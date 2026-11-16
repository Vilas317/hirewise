const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const authRoutes = require('./auth/auth.routes');
const jobRoutes = require('./modules/job/job.routes');
const errorHandler = require('./middleware/error.middleware');
const { generalLimiter } = require('./middleware/rateLimit.middleware');

const allowedOrigins = (process.env.CLIENT_URL || 'https://hirewise-sigma.vercel.app')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Allow non-browser clients (health checks, curl, server-to-server).
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    const error = new Error('Origin is not allowed by CORS.');
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(generalLimiter);

app.get('/api/health', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'ok' : 'starting',
    database: databaseReady ? 'connected' : 'connecting',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.get('/test', (req, res) => res.json({ msg: 'working' }));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
app.use(errorHandler);

module.exports = app;
