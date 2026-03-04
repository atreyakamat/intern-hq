const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['acceptance', 'rejection', 'follow_up', 'custom'],
      required: true,
    },
    subject: String,
    body: String,
    sentAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['sent', 'failed', 'pending'],
      default: 'pending',
    },
    messageId: String,
    error: String,
  },
  { _id: true }
);

const applicantSchema = new mongoose.Schema(
  {
    /* -------- basic info -------- */
    name: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Applicant email is required'],
      trim: true,
      lowercase: true,
    },
    phone: { type: String, default: '' },

    /* -------- resume -------- */
    resumeText: { type: String, default: '' },
    resumeFileName: { type: String, default: '' },

    /* -------- form fields -------- */
    skills: { type: [String], default: [] },
    experience: { type: Number, default: 0 },
    education: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    motivationAnswer: { type: String, default: '' },
    projectDescriptions: { type: [String], default: [] },

    /* -------- role reference -------- */
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },

    /* -------- deterministic scoring (Layer 1) -------- */
    deterministicScore: {
      skillMatch: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      projectDepth: { type: Number, default: 0 },
      clarityScore: { type: Number, default: 0 },
      bonusSignals: { type: Number, default: 0 },
      weighted: { type: Number, default: 0 },
    },

    /* -------- AI scoring (Layer 2) -------- */
    aiScore: { type: Number, default: 0 },
    aiSummary: { type: String, default: '' },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    fitRating: {
      type: String,
      enum: ['Excellent', 'Strong', 'Moderate', 'Weak', ''],
      default: '',
    },

    /* -------- combined -------- */
    finalScore: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },

    /* -------- HR workflow -------- */
    hrStatus: {
      type: String,
      enum: ['pending', 'reviewing', 'accepted', 'rejected'],
      default: 'pending',
    },

    /* -------- email log -------- */
    emailLog: {
      type: [emailLogSchema],
      default: [],
    },

    /* -------- embedding metadata -------- */
    embeddingGenerated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

applicantSchema.index({ role: 1, finalScore: -1 });
applicantSchema.index({ hrStatus: 1 });
applicantSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('Applicant', applicantSchema);
