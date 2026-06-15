import React from 'react';

function Dashboard() {
  const stats = {
    todaySteps: 8234,
    heartRate: 72,
    sleepHours: 7.5,
    healthScore: 85
  };

  return (
    <div className="page-container">
      <h2>📊 健康仪表板</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚶</div>
          <div className="stat-content">
            <div className="stat-label">今日步数</div>
            <div className="stat-value">{stats.todaySteps}</div>
            <div className="stat-goal">目标: 10,000</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <div className="stat-label">心率 (bpm)</div>
            <div className="stat-value">{stats.heartRate}</div>
            <div className="stat-goal">正常范围: 60-100</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">😴</div>
          <div className="stat-content">
            <div className="stat-label">睡眠时长</div>
            <div className="stat-value">{stats.sleepHours}h</div>
            <div className="stat-goal">建议: 7-9小时</div>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">💪</div>
          <div className="stat-content">
            <div className="stat-label">健康评分</div>
            <div className="stat-value">{stats.healthScore}/100</div>
            <div className="stat-goal">状态: 良好</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
