const express = require('express');
const router = express.Router();

const { getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// GET /api/user/me - return current authenticated user
router.get('/me', protect, getCurrentUser);

module.exports = router;
