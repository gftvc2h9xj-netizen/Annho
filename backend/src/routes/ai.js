const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const db = require('../db');
const rateLimiter = require('../middleware/rateLimiter');
const contentFilter = require('../middleware/contentFilter');

const router = express.Router();
const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = process.env.HF_MODEL || 'facebook/blenderbot-400M-distill';
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: '未授权' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: '无效的 token' });
  }
}

async function summarizeMessagesIfNeeded(sessionId) {
  // fetch messages, and if too long, produce a short summary using HF or OpenAI (if available)
  try {
    const res = await db.query('SELECT role, content, created_at FROM ai_messages WHERE session_id=$1 ORDER BY created_at ASC', [sessionId]);
    const msgs = res.rows || [];
    if (msgs.length <= 12) return null; // no summarization needed

    // build a compact conversation text of older messages (exclude last 6 messages)
    const prefixMsgs = msgs.slice(0, Math.max(0, msgs.length - 6));
    const combined = prefixMsgs.map(m => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`).join('\n');
    const prompt = `请将下面的对话总结为中文要点，长度不超过200字，保留关键信息和建议：\n\n${combined}`;

    // call HF or OpenAI for summarization
    if (HF_API_KEY) {
      const hfUrl = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
      const hfResp = await axios.post(hfUrl, { inputs: prompt }, { headers: { Authorization: `Bearer ${HF_API_KEY}` }, timeout: 120000 });
      const data = hfResp.data;
      let text = '';
      if (Array.isArray(data) && data[0].generated_text) text = data[0].generated_text;
      else if (typeof data === 'string') text = data;
      else if (data.generated_text) text = data.generated_text;
      else text = JSON.stringify(data);

      // persist summary into ai_sessions.summary
      await db.query('UPDATE ai_sessions SET summary=$1 WHERE id=$2', [text, sessionId]);
      return text;
    }

    if (OPENAI_KEY) {
      const openaiResp = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400
      }, { headers: { Authorization: `Bearer ${OPENAI_KEY}` } });
      const text = openaiResp.data.choices[0].message.content;
      await db.query('UPDATE ai_sessions SET summary=$1 WHERE id=$2', [text, sessionId]);
      return text;
    }

    return null;
  } catch (err) {
    console.error('summarizeMessagesIfNeeded error', err?.response?.data || err.message);
    return null;
  }
}

// Create a new chat session
router.post('/sessions', authMiddleware, rateLimiter, contentFilter, async (req, res) => {
  const { title } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO ai_sessions (user_id, title) VALUES ($1, $2) RETURNING *',
      [req.userId, title || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '创建会话失败' });
  }
});

// List sessions for user
router.get('/sessions', authMiddleware, rateLimiter, async (req, res) => {
  try {
    const result = await db.query('SELECT id, title, created_at, summary FROM ai_sessions WHERE user_id=$1 ORDER BY created_at DESC', [req.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '查询会话失败' });
  }
});

// Get messages for a session
router.get('/sessions/:id/messages', authMiddleware, rateLimiter, async (req, res) => {
  const sessionId = req.params.id;
  try {
    const result = await db.query('SELECT * FROM ai_messages WHERE session_id=$1 ORDER BY created_at ASC', [sessionId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '查询消息失败' });
  }
});

// POST /api/ai/chat { question: '...', session_id?: n }
router.post('/chat', authMiddleware, rateLimiter, contentFilter, async (req, res) => {
  const { question, session_id } = req.body;
  if (!question) return res.status(400).json({ message: '问题不能为空' });

  let sessionId = session_id;

  try {
    // If no session provided, create one
    if (!sessionId) {
      const createRes = await db.query('INSERT INTO ai_sessions (user_id, title) VALUES ($1, $2) RETURNING *', [req.userId, null]);
      sessionId = createRes.rows[0].id;
    }

    // Content filtering done by middleware

    // Save user message
    await db.query('INSERT INTO ai_messages (session_id, user_id, role, content) VALUES ($1, $2, $3, $4)', [sessionId, req.userId, 'user', question]);

    // Optionally summarize older messages to keep context small
    await summarizeMessagesIfNeeded(sessionId);

    // Build input for AI: include session summary (if exists) + last few messages
    const sessionRow = await db.query('SELECT summary FROM ai_sessions WHERE id=$1', [sessionId]);
    const sessionSummary = sessionRow.rows[0]?.summary || '';

    const msgsRes = await db.query('SELECT role, content FROM ai_messages WHERE session_id=$1 ORDER BY created_at ASC', [sessionId]);
    const msgs = msgsRes.rows || [];
    // include last 6 messages for context
    const recent = msgs.slice(-6).map(m => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`).join('\n');

    let prompt = '';
    if (sessionSummary) prompt += `历史摘要：${sessionSummary}\n\n`;
    prompt += `最近对话（供参考）：\n${recent}\n\n用户问题：${question}`;

    // Call AI provider
    let answer = '';

    if (HF_API_KEY) {
      const hfUrl = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
      const hfResponse = await axios.post(hfUrl, { inputs: prompt }, {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        timeout: 120000
      });
      const data = hfResponse.data;
      if (Array.isArray(data) && data[0].generated_text) {
        answer = data[0].generated_text;
      } else if (typeof data === 'string') {
        answer = data;
      } else if (Array.isArray(data) && data[0].body) {
        answer = data[0].body;
      } else if (data.generated_text) {
        answer = data.generated_text;
      } else {
        answer = JSON.stringify(data);
      }
    } else if (OPENAI_KEY) {
      const openaiResp = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是一个友好的中文健康顾问，回答需简洁并给出建议。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500
      }, {
        headers: { Authorization: `Bearer ${OPENAI_KEY}` }
      });
      answer = openaiResp.data.choices[0].message.content;
    } else {
      return res.status(400).json({ message: '未配置任何 AI API Key（HF_API_KEY 或 OPENAI_API_KEY）' });
    }

    // Save assistant message
    await db.query('INSERT INTO ai_messages (session_id, user_id, role, content) VALUES ($1, $2, $3, $4)', [sessionId, req.userId, 'assistant', answer]);

    res.json({ answer, session_id: sessionId });
  } catch (err) {
    console.error('AI 调用或保存错误', err?.response?.data || err.message);
    res.status(500).json({ message: 'AI 服务调用失败', error: err?.response?.data || err.message });
  }
});

module.exports = router;
