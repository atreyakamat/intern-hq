const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

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
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internsieve')
  .then(() => console.log('[InternSieve] Connected to MongoDB'))
  .catch((err) => {
    console.error('[InternSieve] MongoDB connection error:', err.message);
    process.exit(1);
  });

/* ---- Routes ---- */
const applicantRoutes = require('./routes/candidateRoutes');
const roleRoutes = require('./routes/roleRoutes');

app.use('/api/applicants', applicantRoutes);
app.use('/api/roles', roleRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({
    name: 'InternSieve API',
    version: '1.0.0',
    docs: '/api/health',
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
