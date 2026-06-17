import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import ChatBubble from '../components/ChatBubble';
import SessionList from '../components/SessionList';
import '../chat.css';

function ChatAI() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const messagesRef = useRef(null);
  const typingRef = useRef(false);

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentSession) fetchMessages(currentSession.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSession]);

  useEffect(() => {
    // auto-scroll when messages change
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/ai/sessions');
      setSessions(res.data);
      if (!currentSession && res.data.length > 0) setCurrentSession(res.data[0]);
    } catch (err) {
      console.error(err);
      // If sessions disabled, fall back to no-sessions mode
      setSessions([]);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const res = await api.get(`/ai/sessions/${sessionId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  const createSession = async () => {
    setCreating(true);
    try {
      const res = await api.post('/ai/sessions', { title: newTitle || null });
      setSessions((prev) => [res.data, ...prev]);
      setCurrentSession(res.data);
      setNewTitle('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '创建会话失败');
    } finally {
      setCreating(false);
    }
  };

  const ask = async (e) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    typingRef.current = true;

    try {
      const payload = { question };
      if (currentSession) payload.session_id = currentSession.id;
      const res = await api.post('/ai/chat', payload);

      if (res.data.session_id) {
        await fetchMessages(res.data.session_id);
      } else if (res.data.answer) {
        // one-off mode: show answer without session
        setMessages([{ id: Date.now(), role: 'user', content: question, created_at: new Date().toISOString() }, { id: Date.now()+1, role: 'assistant', content: res.data.answer, created_at: new Date().toISOString() }]);
      }

      setQuestion('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '调用 AI 服务失败');
    } finally {
      setLoading(false);
      typingRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  };

  return (
    <div className="page-container chat-page">
      <div className="chat-container">
        <div className="left-panel">
          <SessionList
            sessions={sessions}
            currentSession={currentSession}
            onSelect={(s) => setCurrentSession(s)}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            createSession={createSession}
            creating={creating}
          />
        </div>

        <div className="right-panel">
          <div className="chat-header">
            <h3>{currentSession ? (currentSession.title || `会话 ${currentSession.id}`) : 'AI 问答'}</h3>
            <div className="chat-subtitle">{currentSession?.summary || (currentSession ? new Date(currentSession.created_at).toLocaleString() : '')}</div>
          </div>

          <div className="chat-messages" ref={messagesRef}>
            {messages.length === 0 && <div className="muted">暂无消息，开始提问吧。</div>}
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}
            {loading && (
              <div className="typing-indicator">AI 正在回复...</div>
            )}
          </div>

          <form className="chat-input" onSubmit={ask}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="在此输入你的问题，按 Enter 发送，Shift+Enter 换行"
              rows={3}
            />
            <div className="chat-actions">
              <button className="btn btn-secondary" type="button" onClick={() => setQuestion('')}>清空</button>
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? '正在请求...' : '提问'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatAI;
