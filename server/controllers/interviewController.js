// ============================================
// server/controllers/interviewController.js
// ============================================
const Interview = require('../models/Interview');
const { getQuestions } = require('../data/questions');

// @desc    Start a new interview session
// @route   POST /api/interviews/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const { type, resumeText, questionCount } = req.body;

    if (!type || !['HR', 'Technical'].includes(type)) {
      return res.status(400).json({ message: 'Interview type must be HR or Technical' });
    }

    // Generate questions based on type
    const count = questionCount || 7;
    const questions = getQuestions(type, count);

    // Create interview in database
    const interview = await Interview.create({
      user: req.user._id,
      type,
      status: 'in-progress',
      questions,
      resumeText: resumeText || '',
      answers: []
    });

    res.status(201).json({
      message: 'Interview started',
      interviewId: interview._id,
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        category: q.category
      }))
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ message: 'Failed to start interview', error: error.message });
  }
};

// @desc    Submit an answer for a question
// @route   POST /api/interviews/:id/answer
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'Interview is already completed' });
    }

    // Find the question
    const question = interview.questions.find(q => q.id === questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found in this interview' });
    }

    // Analyze the answer
    const analysis = analyzeAnswer(answer, question.keywords);

    // Add or update answer
    const existingAnswerIndex = interview.answers.findIndex(a => a.questionId === questionId);
    const answerData = {
      questionId,
      question: question.question,
      answer,
      score: analysis.score,
      fillerWordCount: analysis.fillerWordCount,
      keywords: question.keywords,
      matchedKeywords: analysis.matchedKeywords
    };

    if (existingAnswerIndex >= 0) {
      interview.answers[existingAnswerIndex] = answerData;
    } else {
      interview.answers.push(answerData);
    }

    await interview.save();

    res.json({
      message: 'Answer submitted',
      analysis: {
        score: analysis.score,
        fillerWordCount: analysis.fillerWordCount,
        matchedKeywords: analysis.matchedKeywords
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ message: 'Failed to submit answer', error: error.message });
  }
};

// @desc    Get a specific interview by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ interview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all interviews for the logged-in user
// @route   GET /api/interviews
// @access  Private
const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // Newest first
      .select('type status totalScore confidenceLevel createdAt completedAt duration');

    res.json({ interviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============================================
// Helper: Analyze answer quality
// ============================================
const analyzeAnswer = (answer, keywords) => {
  if (!answer || answer.trim().length === 0) {
    return { score: 0, fillerWordCount: 0, matchedKeywords: [] };
  }

  const lowerAnswer = answer.toLowerCase();
  const words = lowerAnswer.split(/\s+/);

  // Count filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'actually', 'sort of', 'kind of', 'i mean'];
  let fillerWordCount = 0;
  fillerWords.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = answer.match(regex);
    if (matches) fillerWordCount += matches.length;
  });

  // Keyword matching
  const matchedKeywords = keywords.filter(keyword =>
    lowerAnswer.includes(keyword.toLowerCase())
  );

  // Base score: keyword coverage (60% weight) + length bonus (20%) + filler penalty (20%)
  const keywordScore = keywords.length > 0
    ? (matchedKeywords.length / keywords.length) * 60
    : 30;

  const wordCount = words.filter(w => w.length > 0).length;
  const lengthBonus = Math.min(wordCount / 5, 20); // Max 20 points for length

  const fillerPenalty = Math.min(fillerWordCount * 3, 20); // Max 20 point penalty

  const rawScore = keywordScore + lengthBonus - fillerPenalty;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  return { score, fillerWordCount, matchedKeywords };
};

module.exports = { startInterview, submitAnswer, getInterview, getUserInterviews };
