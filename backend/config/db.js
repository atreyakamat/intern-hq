/**
 * config/db.js
 * -------------------------------------------------
 * MongoDB connection handler using Mongoose.
 * -------------------------------------------------
 */
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/internsieve';

  try {
    await mongoose.connect(uri);
    console.log('[InternSieve] Connected to MongoDB');
  } catch (err) {
    console.error('[InternSieve] MongoDB connection error:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('[InternSieve] MongoDB runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[InternSieve] MongoDB disconnected');
  });
}

module.exports = connectDB;
