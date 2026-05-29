// server/routes/interviewRoutes.js
const express = require('express');
const router = express.Router();
const { startInterview, submitAnswer, getInterview, getUserInterviews } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.post('/start', startInterview);
router.get('/', getUserInterviews);
router.get('/:id', getInterview);
router.post('/:id/answer', submitAnswer);

module.exports = router;
