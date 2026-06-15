import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import HealthMetrics from './pages/HealthMetrics';
import Analysis from './pages/Analysis';
import Recommendations from './pages/Recommendations';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'metrics':
        return <HealthMetrics />;
      case 'analysis':
        return <Analysis />;
      case 'recommendations':
        return <Recommendations />;
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
