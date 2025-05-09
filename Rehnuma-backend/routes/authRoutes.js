const express = require('express');
const { signup, login, getUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { savePlan } = require('../controllers/authController');
const { updateUserProfile } = require('../controllers/authController');
const { sendResetCode, resetPasswordWithCode } = require('../controllers/authController');
const { deletePlans } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile); 
router.post('/forgot-password', sendResetCode);
router.post('/reset-password', resetPasswordWithCode);
router.post('/save-plan', authMiddleware, savePlan);
router.delete('/delete-plans', authMiddleware, deletePlans);

module.exports = router;





