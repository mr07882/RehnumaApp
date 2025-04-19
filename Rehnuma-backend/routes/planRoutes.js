const express = require('express');
const { generatePlan } = require('../controllers/planController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/generate', authMiddleware, generatePlan);
module.exports = router;