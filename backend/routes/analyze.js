const express = require('express');
const multer = require('multer');
const { analyzeResume } = require('../controllers/analyzeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Use memory storage as we only need the buffer to send to parser
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/analyze-resume
// Accepts: multipart/form-data with field 'file' OR application/json with { text }
router.post('/analyze-resume', protect, upload.single('file'), analyzeResume);

module.exports = router;
