import React, { useState } from 'react';
import api from '../services/api';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { username, password });
      alert('注册成功，请在上方登录');
      setUsername('');
      setPassword('');
    } catch (err) {
      alert(err.response?.data?.message || '注册失败');
    }
  };

  return (
    <div className="page-container">
      <h2>注册</h2>
      <form onSubmit={handle}>
        <div className="form-group">
          <label>用户名</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>密码</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit">注册</button>
      </form>
    </div>
  );
}

export default Register;
