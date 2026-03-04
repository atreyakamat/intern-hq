const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---- Middleware ---- */
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---- MongoDB ---- */
connectDB();

/* ---- Routes ---- */
const apiRoutes = require('./routes/candidateRoutes');
const roleRoutes = require('./routes/roleRoutes');

// Spec routes: POST /api/role, POST /api/apply, GET /api/applicants, POST /api/evaluate, POST /api/rank, POST /api/notify
app.use('/api', apiRoutes);

// Role routes: POST /api/role (also available), GET /api/roles, etc.
app.use('/api/roles', roleRoutes);
app.post('/api/role', require('./controllers/roleController').createRole);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({
    name: 'InternSieve API',
    version: '1.0.0',
    endpoints: {
      'POST /api/role': 'Create internship role',
      'POST /api/apply': 'Submit application (upload resumes)',
      'GET /api/applicants': 'List applicants',
      'POST /api/evaluate': 'Trigger AI evaluation',
      'POST /api/rank': 'Rank applicants',
      'POST /api/notify': 'Send accept/reject emails',
    },
  });
});

/* ---- Error handler ---- */
app.use((err, _req, res, _next) => {
  console.error('[InternSieve] Unhandled error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

/* ---- Start ---- */
app.listen(PORT, () => {
  console.log(`[InternSieve] Server running on port ${PORT}`);
});
