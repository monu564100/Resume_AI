const express = require('express');
const router = express.Router();
const {
  uploadResume,
  analyzeResume,
  getUserResumes,
  getResumeById,
  deleteResume
} = require('../controllers/resumeController');
const {
  protect
} = require('../middleware/auth');
router.post('/upload', protect, uploadResume);
router.post('/analyze/:id', protect, analyzeResume);
router.get('/', protect, getUserResumes);
router.get('/:id', protect, getResumeById);
router.delete('/:id', protect, deleteResume);
module.exports = router;