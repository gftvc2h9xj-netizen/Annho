const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: '未授权' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: '无效的 token' });
  }
}

router.post('/', authMiddleware, async (req, res) => {
  const data = req.body;
  try {
    const values = [
      req.userId,
      data.steps || null,
      data.heart_rate || null,
      data.sleep_hours || null,
      data.body_temperature || null,
      data.blood_pressure_systolic || null,
      data.blood_pressure_diastolic || null,
    ];
    const result = await db.query(
      `INSERT INTO metrics (user_id, steps, heart_rate, sleep_hours, body_temperature, blood_pressure_systolic, blood_pressure_diastolic)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      values
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '保存失败' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM metrics WHERE user_id=$1 ORDER BY created_at DESC', [req.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '查询失败' });
  }
});

module.exports = router;
