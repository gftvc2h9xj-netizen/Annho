const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

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

router.post('/chat', authMiddleware, async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ message: '问题不能为空' });

  try {
    if (HF_API_KEY) {
      const hfUrl = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
      const hfResponse = await axios.post(hfUrl, { inputs: question }, {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        timeout: 120000
      });
      const data = hfResponse.data;
      let text = '';
      if (Array.isArray(data) && data[0].generated_text) {
        text = data[0].generated_text;
      } else if (typeof data === 'string') {
        text = data;
      } else if (Array.isArray(data) && data[0].body) {
        text = data[0].body;
      } else if (data.generated_text) {
        text = data.generated_text;
      } else {
        text = JSON.stringify(data);
      }
      return res.json({ answer: text });
    }

    if (OPENAI_KEY) {
      const openaiResp = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        max_tokens: 500
      }, {
        headers: { Authorization: `Bearer ${OPENAI_KEY}` }
      });
      const answer = openaiResp.data.choices[0].message.content;
      return res.json({ answer });
    }

    return res.status(400).json({ message: '未配置任何 AI API Key（HF_API_KEY 或 OPENAI_API_KEY）' });
  } catch (err) {
    console.error('AI 调用错误', err?.response?.data || err.message);
    res.status(500).json({ message: 'AI 服务调用失败', error: err?.response?.data || err.message });
  }
});

module.exports = router;
