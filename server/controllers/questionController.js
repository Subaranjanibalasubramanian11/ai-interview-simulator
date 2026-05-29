// ============================================
// server/controllers/questionController.js
// ============================================
const { getQuestions, hrQuestions, technicalQuestions } = require('../data/questions');

// @desc    Generate questions for a given type
// @route   GET /api/questions?type=HR&count=7
// @access  Private
const generateQuestions = async (req, res) => {
  try {
    const { type, count } = req.query;

    if (!type || !['HR', 'Technical'].includes(type)) {
      return res.status(400).json({ message: 'Type must be HR or Technical' });
    }

    const questionCount = parseInt(count) || 7;
    if (questionCount < 5 || questionCount > 10) {
      return res.status(400).json({ message: 'Count must be between 5 and 10' });
    }

    const questions = getQuestions(type, questionCount);

    res.json({
      type,
      count: questions.length,
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        category: q.category
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all available categories
// @route   GET /api/questions/categories
// @access  Private
const getCategories = async (req, res) => {
  const hrCategories = [...new Set(hrQuestions.map(q => q.category))];
  const techCategories = [...new Set(technicalQuestions.map(q => q.category))];

  res.json({
    HR: hrCategories,
    Technical: techCategories
  });
};

module.exports = { generateQuestions, getCategories };
