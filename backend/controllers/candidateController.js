/**
 * controllers/applicantController.js
 * -------------------------------------------------
 * Handles HTTP layer for applicant operations.
 * All business logic delegated to applicantService.
 * -------------------------------------------------
 */
const applicantService = require('../services/applicantService');

exports.getAllApplicants = async (req, res) => {
  try {
    const filters = {
      roleId: req.query.roleId,
      hrStatus: req.query.hrStatus || req.query.status,
      minScore: req.query.minScore,
      skills: req.query.skills ? req.query.skills.split(',') : [],
      sortBy: req.query.sortBy,
    };
    const applicants = await applicantService.listApplicants(filters);
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicantById = async (req, res) => {
  try {
    const applicant = await applicantService.getApplicantById(req.params.id);
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicantStatus = async (req, res) => {
  try {
    const { status, sendNotification } = req.body;
    const applicant = await applicantService.updateStatus(
      req.params.id,
      status,
      sendNotification !== false
    );
    res.json(applicant);
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
    if (!roleId) {
      return res.status(400).json({ message: 'roleId is required' });
    }

    const results = await applicantService.processMultipleResumes(files, roleId);

    // Recalculate ranks after all are processed
    await applicantService.recalculateRanks(roleId);

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    res.status(201).json({
      message: `${successful.length} resumes processed, ${failed.length} failed`,
      applicants: successful.map((r) => r.applicant),
      errors: failed,
    });
  } catch (error) {
    console.error('Error processing resumes:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.bulkAction = async (req, res) => {
  try {
    const { action, applicantIds, sendNotification } = req.body;
    const results = await applicantService.bulkUpdateStatus(
      applicantIds,
      action,
      sendNotification
    );
    res.json({ message: 'Bulk action completed', results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.compareTopApplicants = async (req, res) => {
  try {
    const { roleId } = req.params;
    const topN = parseInt(req.query.topN) || 10;
    const comparison = await applicantService.compareTopApplicants(roleId, topN);
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const roleId = req.query.roleId || null;
    const analytics = await applicantService.getAnalytics(roleId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recalculateRanks = async (req, res) => {
  try {
    const { roleId } = req.params;
    const applicants = await applicantService.recalculateRanks(roleId);
    res.json({
      message: `Ranks recalculated for ${applicants.length} applicants`,
      applicants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
