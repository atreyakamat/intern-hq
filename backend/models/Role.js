const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  requiredSkills: [String],
  preferredSkills: [String],
  experienceLevel: String,
  weightConfig: {
    skills: { type: Number, default: 0.4 },
    projects: { type: Number, default: 0.3 },
    clarity: { type: Number, default: 0.2 },
    experience: { type: Number, default: 0.1 }
  },
  companyCulture: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', roleSchema);
