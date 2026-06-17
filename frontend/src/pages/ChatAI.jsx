import React, { useState } from 'react';
import api from '../services/api';

function ChatAI() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async (e) => {
    e.preventDefault();
    if (!question) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { question });
      setAnswer(res.data.answer || 'AI 未返回结果');
    } catch (err) {
      setAnswer('调用 AI 服务失败：' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>🤖 AI 助手</h2>
      <form onSubmit={ask}>
        <div className="form-group">
          <label>请输入你的问题（中文）</label>
          <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={4} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? '正在请求...' : '提问'}</button>
      </form>

      <div style={{ marginTop: 20 }}>
        <h3>AI 回答：</h3>
        <div className="page-container">{answer}</div>
      </div>
    </div>
  );
}

export default ChatAI;
