const Candidate = require('../models/Candidate');
const Role = require('../models/Role');
const fs = require('fs');
const pdf = require('pdf-parse');
const aiService = require('../utils/aiService');
const emailService = require('../utils/emailService');

exports.getAllCandidates = async (req, res) => {
  try {
    const { status, minScore, sortBy } = req.query;
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (minScore) query.aiScore = { $gte: Number(minScore) };

    let sort = {};
    if (sortBy === 'score') sort.aiScore = -1;
    else if (sortBy === 'date') sort.createdAt = -1;

    const candidates = await Candidate.find(query).sort(sort);
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('role');
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCandidateStatus = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    ).populate('role');

    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    // Send email notifications
    if (req.body.status === 'shortlisted') {
      const { subject, text } = emailService.generateAcceptanceEmail(
        candidate.name, 
        candidate.role.title, 
        candidate.strengths || []
      );
      // await emailService.sendEmail(candidate.email, subject, text);
      console.log('Acceptance email would be sent to:', candidate.email);
    } else if (req.body.status === 'rejected') {
      const { subject, text } = emailService.generateRejectionEmail(
        candidate.name, 
        candidate.role.title, 
        candidate.aiSummary || 'General feedback'
      );
      // await emailService.sendEmail(candidate.email, subject, text);
      console.log('Rejection email would be sent to:', candidate.email);
    }

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadResumes = async (req, res) => {
  try {
    const files = req.files;
    const { roleId } = req.body;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const processedCandidates = [];

    for (const file of files) {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdf(dataBuffer);
      const resumeText = data.text;

      // Extract info using AI
      const candidateInfo = await aiService.extractInfo(resumeText);
      
      // Score candidate using AI
      const evaluation = await aiService.scoreCandidate(resumeText, role);
      
      const newCandidate = new Candidate({
        name: candidateInfo?.Name || file.originalname.split('.')[0],
        email: candidateInfo?.Email || 'placeholder@example.com',
        education: candidateInfo?.Education,
        yearsOfExperience: candidateInfo?.['Years of Experience'],
        skills: candidateInfo?.Skills,
        resumeText: resumeText,
        role: roleId,
        aiScore: evaluation?.['Overall Score'] || 0,
        aiSummary: evaluation?.['Summary of fit'],
        strengths: evaluation?.Strengths,
        weaknesses: evaluation?.Weaknesses,
        fitRating: evaluation?.['Fit Rating'],
        status: 'new'
      });

      await newCandidate.save();
      processedCandidates.push(newCandidate);
      
      // Clean up uploaded file
      fs.unlinkSync(file.path);
    }

    res.status(201).json({ 
      message: `${processedCandidates.length} resumes uploaded and processed`,
      candidates: processedCandidates
    });
  } catch (error) {
    console.error('Error processing resumes:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.bulkAction = async (req, res) => {
  try {
    const { action, candidateIds } = req.body;
    await Candidate.updateMany(
      { _id: { $in: candidateIds } },
      { status: action }
    );
    res.json({ message: `Bulk action ${action} completed successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.compareTopCandidates = async (req, res) => {
  try {
    const { roleId } = req.params;
    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    const topCandidates = await Candidate.find({ role: roleId })
      .sort({ aiScore: -1 })
      .limit(5);

    if (topCandidates.length < 2) {
      return res.status(400).json({ message: 'Not enough candidates to compare' });
    }

    const comparison = await aiService.compareCandidates(role, topCandidates);
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStatsOverview = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const candidates = await Candidate.find();
    
    const averageScore = totalCandidates > 0 
      ? Math.round(candidates.reduce((acc, c) => acc + (c.aiScore || 0), 0) / totalCandidates) 
      : 0;

    const statusStats = {
      new: await Candidate.countDocuments({ status: 'new' }),
      reviewing: await Candidate.countDocuments({ status: 'reviewing' }),
      shortlisted: await Candidate.countDocuments({ status: 'shortlisted' }),
      interviewed: await Candidate.countDocuments({ status: 'interviewed' }),
      offered: await Candidate.countDocuments({ status: 'offered' }),
      rejected: await Candidate.countDocuments({ status: 'rejected' }),
    };

    res.json({
      totalCandidates,
      averageScore,
      statusStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
