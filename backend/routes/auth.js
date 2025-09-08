const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/logout', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
});

module.exports = router;