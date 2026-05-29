// server/routes/resultRoutes.js
const express = require('express');
const router = express.Router();
const { completeInterview, getResult, getAllResults } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/complete/:interviewId', completeInterview);
router.get('/', getAllResults);
router.get('/:interviewId', getResult);

module.exports = router;
