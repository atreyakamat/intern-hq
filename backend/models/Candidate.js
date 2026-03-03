const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  education: String,
  yearsOfExperience: Number,
  skills: [String],
  resumeText: String,
  aiScore: { type: Number, default: 0 },
  aiSummary: String,
  status: { 
    type: String, 
    enum: ['new', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'rejected'],
    default: 'new' 
  },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  strengths: [String],
  weaknesses: [String],
  fitRating: String,
  rank: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
