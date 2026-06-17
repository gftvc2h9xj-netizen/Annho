import React from 'react';

function SessionList({ sessions, currentSession, onSelect, newTitle, setNewTitle, createSession, creating }) {
  return (
    <div className="session-list">
      <h3>会话</h3>
      <div className="new-session">
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="新会话标题（可选）" />
        <button className="btn btn-primary" onClick={createSession} disabled={creating}>
          {creating ? '创建中...' : '新建'}
        </button>
      </div>

      <div className="sessions-scroll">
        {sessions.length === 0 && <div className="muted">暂无会话，点击 "新建" 开始</div>}
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`session-item ${currentSession?.id === s.id ? 'active' : ''}`}
            onClick={() => onSelect(s)}
          >
            <div className="session-title">{s.title || `会话 ${s.id}`}</div>
            {s.summary ? <div className="session-summary">{s.summary}</div> : <div className="session-summary muted">{new Date(s.created_at).toLocaleString()}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionList;
