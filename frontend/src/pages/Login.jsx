import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, user } = res.data;
      localStorage.setItem('access_token', token);
      onLogin(user);
    } catch (err) {
      alert(err.response?.data?.message || '登录失败');
    }
  };

  return (
    <div className="page-container">
      <h2>登录</h2>
      <form onSubmit={handle}>
        <div className="form-group">
          <label>用户名</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>密码</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit">登录</button>
      </form>
    </div>
  );
}

export default Login;
