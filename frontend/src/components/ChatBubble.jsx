import React from 'react';
import './chat.css';

function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`chat-row ${isUser ? 'chat-row-user' : 'chat-row-assistant'}`}>
      <div className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}>
        <div className="chat-text">{message.content}</div>
        <div className="chat-meta">{new Date(message.created_at).toLocaleString()}</div>
      </div>
    </div>
  );
}

export default ChatBubble;
