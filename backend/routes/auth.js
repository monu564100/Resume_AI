const express = require('express');
const { register, login, getCurrentUser, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Return latest analysis id shortcut (if stored on user)
router.get('/latest-analysis', protect, async (req, res) => {
	try {
		const user = req.user;
		res.json({ success: true, latestAnalysisId: user.latestAnalysisId || null });
	} catch (e) {
		res.status(500).json({ success: false, message: 'Failed to retrieve latest analysis id' });
	}
});

module.exports = router;