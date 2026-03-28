/**
 * config/db.js
 * -------------------------------------------------
 * MongoDB connection handler using Mongoose.
 * -------------------------------------------------
 */
const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/internsieve';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[InternSieve] Connected to MongoDB');
  } catch (err) {
    console.error('[InternSieve] MongoDB connection error:', err.message);
    console.warn('[InternSieve] Running WITHOUT database — install MongoDB or set MONGODB_URI to a live Atlas URI to enable persistence.');
    // Do NOT exit — allow the server to serve non-DB routes (health, static, etc.)
  }

  mongoose.connection.on('error', (err) => {
    console.error('[InternSieve] MongoDB runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[InternSieve] MongoDB disconnected');
  });
}

module.exports = connectDB;
