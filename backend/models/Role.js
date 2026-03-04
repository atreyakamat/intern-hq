const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Junior', 'Intermediate', 'Senior'],
      default: 'Entry Level',
    },
    weightConfig: {
      skills: { type: Number, default: 0.4, min: 0, max: 1 },
      experience: { type: Number, default: 0.25, min: 0, max: 1 },
      projects: { type: Number, default: 0.2, min: 0, max: 1 },
      communication: { type: Number, default: 0.1, min: 0, max: 1 },
      bonus: { type: Number, default: 0.05, min: 0, max: 1 },
    },
    cultureDescription: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    embeddingGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

roleSchema.pre('save', function (next) {
  const w = this.weightConfig;
  const total = w.skills + w.experience + w.projects + w.communication + w.bonus;
  if (Math.abs(total - 1.0) > 0.01) {
    return next(
      new Error(`Weight config must sum to 1.0 (current: ${total.toFixed(2)})`)
    );
  }
  next();
});

module.exports = mongoose.model('Role', roleSchema);
