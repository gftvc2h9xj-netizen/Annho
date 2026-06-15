import React from 'react';

function Recommendations() {
  const recommendations = [
    {
      id: 1,
      title: '增加日常活动',
      description: '建议每天进行至少30分钟的中等强度运动',
      priority: 'normal'
    },
    {
      id: 2,
      title: '改善饮食习惯',
      description: '建议增加水果和蔬菜的摄入，减少高盐高油食物',
      priority: 'normal'
    }
  ];

  return (
    <div className="page-container">
      <h2>💡 个性化健康建议</h2>
      <div className="recommendations-list">
        {recommendations.map(rec => (
          <div key={rec.id} className="recommendation-card">
            <h3>{rec.title}</h3>
            <p>{rec.description}</p>
            <span className="priority-badge">{rec.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
