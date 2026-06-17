require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const metricsRoutes = require('./routes/metrics');
const aiRoutes = require('./routes/ai');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/ai', aiRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`后端已启动，端口 ${port}`);
});
