import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import HealthMetrics from './pages/HealthMetrics';
import Analysis from './pages/Analysis';
import Recommendations from './pages/Recommendations';
import ChatAI from './pages/ChatAI';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('current_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    setUser(null);
  };

  const onLogin = (user) => {
    localStorage.setItem('current_user', JSON.stringify(user));
    setUser(user);
    setCurrentPage('dashboard');
  };

  if (!user) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🏥 AI宿舍健康管理系统</h1>
          <p>智能健康监测 · 个性化建议 · 数据驱动</p>
        </header>

        <main className="app-main">
          <Login onLogin={onLogin} />
          <div style={{ height: 20 }} />
          <Register />
        </main>

        <footer className="app-footer">
          <p>&copy; 2024 AI宿舍健康管理系统. 版权所有</p>
        </footer>
      </div>
    );
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'metrics':
        return <HealthMetrics />;
      case 'analysis':
        return <Analysis />;
      case 'recommendations':
        return <Recommendations />;
      case 'chat':
        return <ChatAI />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏥 AI宿舍健康管理系统</h1>
        <p>智能健康监测 · 个性化建议 · 数据驱动</p>
      </header>

      <nav className="app-nav">
        <button 
          className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentPage('dashboard')}
        >
          📊 仪表板
        </button>
        <button 
          className={`nav-btn ${currentPage === 'metrics' ? 'active' : ''}`}
          onClick={() => setCurrentPage('metrics')}
        >
          📈 健康数据
        </button>
        <button 
          className={`nav-btn ${currentPage === 'analysis' ? 'active' : ''}`}
          onClick={() => setCurrentPage('analysis')}
        >
          🤖 AI分析
        </button>
        <button 
          className={`nav-btn ${currentPage === 'recommendations' ? 'active' : ''}`}
          onClick={() => setCurrentPage('recommendations')}
        >
          💡 建议
        </button>
        <button 
          className={`nav-btn ${currentPage === 'chat' ? 'active' : ''}`}
          onClick={() => setCurrentPage('chat')}
        >
          🗣️ AI 问答
        </button>
        <div style={{ marginLeft: 12 }}>
          <button className="nav-btn" onClick={handleLogout}>退出 ({user.username})</button>
        </div>
      </nav>

      <main className="app-main">
        {renderPage()}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 AI宿舍健康管理系统. 版权所有</p>
      </footer>
    </div>
  );
}

export default App;
