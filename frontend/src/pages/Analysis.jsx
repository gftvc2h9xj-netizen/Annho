import React from 'react';

function Analysis() {
  const analysis = {
    healthScore: 85,
    riskLevel: 'low',
    summary: '您的健康状态良好，请继续保持良好的生活习惯。'
  };

  const riskLevelMap = {
    low: '低',
    medium: '中等',
    high: '高'
  };

  const riskLevelText = riskLevelMap[analysis.riskLevel] || analysis.riskLevel;

  return (
    <div className="page-container">
      <h2>🤖 AI健康分析</h2>
      <div className="analysis-card">
        <div className="score-section">
          <div className="score-circle">
            <span className="score-value">{analysis.healthScore}</span>
            <span className="score-unit">分</span>
          </div>
          <div className="score-info">
            <p>风险等级: <strong>{riskLevelText}</strong></p>
            <p>{analysis.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
