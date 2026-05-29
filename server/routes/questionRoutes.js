// server/routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const { generateQuestions, getCategories } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', generateQuestions);
router.get('/categories', getCategories);

module.exports = router;
