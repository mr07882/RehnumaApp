const express = require('express');
const { signup, login, getUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;

const { updateUserProfile } = require('../controllers/authController');

router.put('/profile', authMiddleware, updateUserProfile); // ✅ PUT for update

const { sendResetCode, resetPasswordWithCode } = require('../controllers/authController');

router.post('/forgot-password', sendResetCode);
router.post('/reset-password', resetPasswordWithCode);
