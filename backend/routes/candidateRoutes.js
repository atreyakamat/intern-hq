const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/candidateController');
const multer = require('multer');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF and DOCX files are allowed'));
  },
});

// Analytics
router.get('/analytics', applicantController.getAnalytics);

// Comparison
router.get('/compare/:roleId', applicantController.compareTopApplicants);

// Recalculate ranks
router.post('/ranks/:roleId', applicantController.recalculateRanks);

// Bulk actions
router.post('/bulk-action', applicantController.bulkAction);

// Upload
router.post('/upload', upload.array('resumes', 20), applicantController.uploadResumes);

// CRUD
router.get('/', applicantController.getAllApplicants);
router.get('/:id', applicantController.getApplicantById);
router.patch('/:id/status', applicantController.updateApplicantStatus);

module.exports = router;
