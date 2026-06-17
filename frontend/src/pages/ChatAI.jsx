import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ChatAI() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (currentSession) fetchMessages(currentSession.id);
  }, [currentSession]);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/ai/sessions');
      setSessions(res.data);
      if (!currentSession && res.data.length > 0) setCurrentSession(res.data[0]);
    } catch (err) {
      console.error(err);
      alert('获取会话失败');
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const res = await api.get(`/ai/sessions/${sessionId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      alert('获取消息失败');
    }
  };

  const createSession = async () => {
    setCreating(true);
    try {
      const res = await api.post('/ai/sessions', { title: newTitle || null });
      setSessions(prev => [res.data, ...prev]);
      setCurrentSession(res.data);
      setNewTitle('');
    } catch (err) {
      console.error(err);
      alert('创建会话失败');
    } finally {
      setCreating(false);
    }
  };

  const ask = async (e) => {
    e.preventDefault();
    if (!question) return;
    setLoading(true);
    try {
      const payload = { question };
      if (currentSession) payload.session_id = currentSession.id;
      const res = await api.post('/ai/chat', payload);
      const { answer, session_id } = res.data;
      // refresh messages
      await fetchMessages(session_id);
      setQuestion('');
    } catch (err) {
      console.error(err);
      alert('调用 AI 服务失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 260 }}>
        <h3>会话列表</h3>
        <div style={{ marginBottom: 10 }}>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="新会话标题（可选）" />
          <button className="btn btn-primary" onClick={createSession} disabled={creating} style={{ marginLeft: 8 }}>{creating ? '创建中...' : '新建'}</button>
        </div>
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {sessions.map(s => (
            <div key={s.id} onClick={() => setCurrentSession(s)} style={{ padding: 8, border: currentSession?.id === s.id ? '2px solid var(--primary-color)' : '1px solid #ddd', borderRadius: 6, marginBottom: 8, cursor: 'pointer' }}>
              <div style={{ fontWeight: 'bold' }}>{s.title || `会话 ${s.id}`}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{new Date(s.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h3>对话窗口 {currentSession ? `- ${currentSession.title || `会话 ${currentSession.id}`}` : ''}</h3>
        <div style={{ height: '60vh', overflowY: 'auto', border: '1px solid #eee', padding: 12, borderRadius: 8, background: '#fafafa' }}>
          {messages.length === 0 && <div style={{ color: '#888' }}>暂无消息，开始提问吧。</div>}
          {messages.map(m => (
            <div key={m.id} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#666' }}>{m.role === 'user' ? '你' : 'AI'} · {new Date(m.created_at).toLocaleString()}</div>
              <div style={{ padding: 10, background: m.role === 'user' ? '#fff' : 'var(--primary-color)', color: m.role === 'user' ? '#000' : '#fff', borderRadius: 6, marginTop: 6 }}>{m.content}</div>
            </div>
          ))}
        </div>

        <form onSubmit={ask} style={{ marginTop: 12 }}>
          <div className="form-group">
            <label>请输入你的问题（中文）</label>
            <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={4} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? '正在请求...' : '提问'}</button>
        </form>
      </div>
    </div>
  );
}

export default ChatAI;
