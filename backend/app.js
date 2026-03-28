const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const candidateRoutes = require('./routes/candidateRoutes');
const roleRoutes = require('./routes/roleRoutes');
const roleController = require('./controllers/roleController');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

function getDatabaseStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return states[mongoose.connection.readyState] || 'unknown';
}

function createApp(options = {}) {
  const { connectToDatabase = true } = options;
  const app = express();

  if (connectToDatabase) {
    connectDB();
  }

  app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
  app.use(requestLogger);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  app.use('/api', candidateRoutes);
  app.use('/api/roles', roleRoutes);
  app.post('/api/role', roleController.createRole);

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: getDatabaseStatus(),
      aiConfigured: Boolean(process.env.OPENAI_API_KEY),
      emailConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    });
  });

  app.get('/api', (_req, res) => {
    res.json({
      name: 'InternSieve API',
      version: '1.0.0',
      endpoints: {
        'POST /api/role': 'Create internship role',
        'GET /api/roles': 'List roles',
        'POST /api/apply': 'Submit application (upload resumes)',
        'GET /api/applicants': 'List applicants',
        'POST /api/evaluate': 'Trigger candidate evaluation',
        'POST /api/rank': 'Rank applicants for a role',
        'POST /api/notify': 'Send acceptance or rejection emails',
      },
    });
  });

  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
  if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get(/^(?!\/api|\/uploads).*/, (_req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp, getDatabaseStatus };
