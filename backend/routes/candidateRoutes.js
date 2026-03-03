const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', candidateController.getAllCandidates);
router.get('/analytics/overview', candidateController.getStatsOverview);
router.get('/compare/:roleId', candidateController.compareTopCandidates);
router.get('/:id', candidateController.getCandidateById);
router.patch('/:id', candidateController.updateCandidateStatus);
router.post('/upload', upload.array('resumes'), candidateController.uploadResumes);
router.post('/bulk-action', candidateController.bulkAction);

module.exports = router;
