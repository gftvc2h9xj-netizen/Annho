import React, { useState } from 'react';

function HealthMetrics() {
  const [metrics, setMetrics] = useState({
    steps: 8000,
    heartRate: 72,
    sleepHours: 7.5,
    bodyTemperature: 36.5,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('健康数据已保存');
  };

  return (
    <div className="page-container">
      <h2>📈 健康数据记录</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>步数</label>
            <input type="number" value={metrics.steps} onChange={(e) => setMetrics({...metrics, steps: e.target.value})} />
          </div>
          <div className="form-group">
            <label>心率 (bpm)</label>
            <input type="number" value={metrics.heartRate} onChange={(e) => setMetrics({...metrics, heartRate: e.target.value})} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">💾 保存数据</button>
      </form>
    </div>
  );
}

export default HealthMetrics;
