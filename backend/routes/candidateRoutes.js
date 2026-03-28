/**
 * routes/candidateRoutes.js
 * -------------------------------------------------
 * API routes mapping to spec:
 *   POST   /apply             — Submit application
 *   GET    /applicants        — List applicants
 *   GET    /applicants/:id    — Get applicant detail
 *   PATCH  /applicants/:id/status — Quick status update
 *   POST   /evaluate          — Trigger AI evaluation
 *   POST   /rank              — Rank applicants
 *   POST   /notify            — Send emails
 *   POST   /bulk-action       — Bulk actions
 *   GET    /applicants/compare/:roleId — Comparison
 *   GET    /applicants/analytics       — Stats
 * -------------------------------------------------
 */
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/candidateController');
const multer = require('multer');
const validateObjectId = require('../middleware/validateObjectId');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF files are currently supported'));
  },
});

// ----- Spec routes -----
router.post('/apply', upload.array('resumes', 20), ctrl.apply);
router.get('/applicants', ctrl.getApplicants);
router.post('/evaluate', ctrl.evaluate);
router.post('/rank', ctrl.rank);
router.post('/notify', ctrl.notify);

// ----- Extended routes -----
router.get('/applicants/analytics', ctrl.getAnalytics);
router.get('/applicants/compare/:roleId', validateObjectId('roleId'), ctrl.compare);
router.post('/applicants/bulk-action', ctrl.bulkAction);
router.get('/applicants/:id', validateObjectId('id'), ctrl.getApplicantById);
router.patch('/applicants/:id/status', validateObjectId('id'), ctrl.updateStatus);

module.exports = router;
