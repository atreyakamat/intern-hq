/**
 * controllers/applicantController.js
 * -------------------------------------------------
 * Handles HTTP layer for applicant operations.
 * Maps to spec routes: POST /apply, GET /applicants,
 * POST /evaluate, POST /rank, POST /notify
 * -------------------------------------------------
 */
const applicantService = require('../services/applicantService');
const { normalizeWorkflowAction } = require('../utils/actionNormalizer');

/* ---- POST /apply — Submit application (upload resumes) ---- */
exports.apply = async (req, res) => {
  try {
    const files = req.files;
    const { roleId, name, email, skills, experience, githubUrl, portfolioUrl, motivationAnswer } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No resume files uploaded' });
    }
    if (!roleId) {
      return res.status(400).json({ message: 'roleId is required' });
    }

    // Build form data from body fields (used for all resumes if provided)
    const formData = {};
    if (name) formData.name = name;
    if (email) formData.email = email;
    if (skills) formData.skills = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;
    if (experience) formData.experience = Number(experience);
    if (githubUrl) formData.githubUrl = githubUrl;
    if (portfolioUrl) formData.portfolioUrl = portfolioUrl;
    if (motivationAnswer) formData.motivationAnswer = motivationAnswer;

    const results = await applicantService.processMultipleResumes(
      files,
      roleId,
      files.map(() => ({ ...formData }))
    );

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    res.status(201).json({
      message: `${successful.length} application(s) submitted, ${failed.length} failed`,
      applicants: successful.map((r) => r.applicant),
      errors: failed,
    });
  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ---- GET /applicants — List all applicants ---- */
exports.getApplicants = async (req, res) => {
  try {
    const filters = {
      roleId: req.query.roleId,
      hrStatus: req.query.hrStatus || req.query.status,
      minScore: req.query.minScore,
      skills: req.query.skills ? req.query.skills.split(',') : [],
      sortBy: req.query.sortBy || req.query.sort,
    };
    const applicants = await applicantService.listApplicants(filters);
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---- GET /applicants/:id — Get applicant detail ---- */
exports.getApplicantById = async (req, res) => {
  try {
    const applicant = await applicantService.getApplicantById(req.params.id);
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---- POST /evaluate — Trigger AI evaluation ---- */
exports.evaluate = async (req, res) => {
  try {
    const { roleId, applicantIds } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: 'roleId is required' });
    }

    const results = await applicantService.evaluateApplicants(roleId, applicantIds);

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    res.json({
      message: `${successful.length} evaluated, ${failed.length} failed`,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---- POST /rank — Rank applicants by score ---- */
exports.rank = async (req, res) => {
  try {
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: 'roleId is required' });
    }

    const applicants = await applicantService.recalculateRanks(roleId);
    res.json({
      message: `Ranked ${applicants.length} applicants`,
      applicants: applicants.map((a) => ({
        _id: a._id,
        name: a.name,
        rank: a.rank,
        finalScore: a.finalScore,
        fitRating: a.fitRating,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---- POST /notify — Send accept/reject emails ---- */
exports.notify = async (req, res) => {
  try {
    const { applicantIds } = req.body;
    const action = normalizeWorkflowAction(req.body.action);

    if (!applicantIds || applicantIds.length === 0) {
      return res.status(400).json({ message: 'applicantIds array is required' });
    }
    if (!['accepted', 'rejected'].includes(action)) {
      return res.status(400).json({ message: 'action must be accept/accepted or reject/rejected' });
    }

    const results = await applicantService.notifyApplicants(applicantIds, action);
    res.json({
      message: `Notifications sent`,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---- PATCH /applicants/:id/status — Update status (quick action) ---- */
exports.updateStatus = async (req, res) => {
  try {
    const status = normalizeWorkflowAction(req.body.status);
    const sendNotification = req.body.sendNotification ?? req.body.sendEmail;

    if (!status) {
      return res.status(400).json({ message: 'A valid status is required' });
    }

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

/* ---- POST /bulk-action — Bulk status/email ---- */
exports.bulkAction = async (req, res) => {
  try {
    const { applicantIds } = req.body;
    const action = normalizeWorkflowAction(req.body.action);
    const sendNotification = req.body.sendNotification ?? req.body.sendEmail;

    if (!action) {
      return res.status(400).json({ message: 'A valid action is required' });
    }

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

/* ---- GET /applicants/compare/:roleId — Comparative intelligence ---- */
exports.compare = async (req, res) => {
  try {
    const { roleId } = req.params;
    const topN = parseInt(req.query.topN) || 10;
    const comparison = await applicantService.compareTopApplicants(roleId, topN);
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---- GET /applicants/analytics — Dashboard stats ---- */
exports.getAnalytics = async (req, res) => {
  try {
    const roleId = req.query.roleId || null;
    const analytics = await applicantService.getAnalytics(roleId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
