// ============================================
// server/controllers/resultController.js
// AI: Google Gemini (Free)
// ============================================
const Interview = require('../models/Interview');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini client initialize
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Complete interview and generate AI feedback
// @route   POST /api/results/complete/:interviewId
// @access  Private
const completeInterview = async (req, res) => {
  try {
    const { duration } = req.body;

    const interview = await Interview.findOne({
      _id: req.params.interviewId,
      user: req.user._id
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'Interview already completed' });
    }

    const answers = interview.answers;
    if (answers.length === 0) {
      return res.status(400).json({ message: 'No answers submitted for this interview' });
    }

    // ---- Calculate Total Score ----
    const totalScore = Math.round(
      answers.reduce((sum, a) => sum + a.score, 0) / answers.length
    );

    // ---- Calculate Confidence Level ----
    const totalFillerWords = answers.reduce((sum, a) => sum + a.fillerWordCount, 0);
    const avgFiller = totalFillerWords / answers.length;

    let confidenceLevel;
    if (avgFiller <= 1 && totalScore >= 60) confidenceLevel = 'High';
    else if (avgFiller <= 3 && totalScore >= 40) confidenceLevel = 'Medium';
    else confidenceLevel = 'Low';

    // ---- Generate AI Feedback ----
    let aiFeedback;

    if (process.env.GEMINI_API_KEY) {
      try {
        aiFeedback = await generateGeminiFeedback(interview, totalScore, confidenceLevel);
      } catch (aiError) {
        console.error('Gemini feedback failed:', aiError.message);
        aiFeedback = generateFallbackFeedback(answers, totalScore, confidenceLevel);
      }
    } else {
      aiFeedback = generateFallbackFeedback(answers, totalScore, confidenceLevel);
    }

    // ---- Save Results ----
    interview.status = 'completed';
    interview.totalScore = totalScore;
    interview.confidenceLevel = confidenceLevel;
    interview.aiFeedback = aiFeedback;
    interview.duration = duration || 0;
    interview.completedAt = new Date();

    await interview.save();

    res.json({
      message: 'Interview completed successfully',
      result: {
        interviewId: interview._id,
        type: interview.type,
        totalScore,
        confidenceLevel,
        aiFeedback,
        answers: interview.answers,
        duration: interview.duration,
        completedAt: interview.completedAt
      }
    });

  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({ message: 'Failed to complete interview', error: error.message });
  }
};

// ============================================
// Gemini AI Feedback Generator
// ============================================
async function generateGeminiFeedback(interview, totalScore, confidenceLevel) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const qaSummary = interview.answers.map((a, i) =>
    `Q${i + 1}: ${a.question}\nAnswer: ${a.answer || '(no answer given)'}\nScore: ${a.score}/100`
  ).join('\n\n');

  const prompt = `You are an expert interview coach. Analyze this ${interview.type} interview and give professional feedback.

Interview Type: ${interview.type}
Overall Score: ${totalScore}/100
Confidence Level: ${confidenceLevel}

Questions and Answers:
${qaSummary}

Respond ONLY in this exact JSON format (no extra text, no markdown, no backticks):
{
  "overall": "2-3 sentence overall assessment of the candidate's performance",
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Clean any markdown backticks if Gemini adds them
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

// ============================================
// Fallback: Rule-based feedback (no API key)
// ============================================
function generateFallbackFeedback(answers, totalScore, confidenceLevel) {
  const avgKeywordMatch = answers.reduce((sum, a) =>
    sum + (a.matchedKeywords.length / Math.max(a.keywords.length, 1)), 0
  ) / answers.length;

  const strengths = [];
  const improvements = [];

  if (totalScore >= 70) strengths.push('Strong overall performance across most questions');
  if (totalScore >= 50) strengths.push('Good grasp of core concepts and relevant terminology');
  if (confidenceLevel === 'High') strengths.push('Excellent communication with minimal hesitation');
  if (avgKeywordMatch >= 0.5) strengths.push('Used relevant keywords showing domain knowledge');
  if (answers.some(a => a.answer.length > 200)) strengths.push('Provided detailed and thoughtful responses');
  if (strengths.length === 0) strengths.push('Completed the full interview session — great commitment');

  if (totalScore < 60) improvements.push('Focus on including more relevant keywords and technical terminology');
  if (confidenceLevel === 'Low') improvements.push('Practice reducing filler words like um, uh, and like');
  if (avgKeywordMatch < 0.4) improvements.push('Study core concepts to strengthen your answers');
  improvements.push('Practice the STAR method — Situation, Task, Action, Result — for behavioral questions');
  if (answers.some(a => a.answer.length < 50)) improvements.push('Aim to give more comprehensive and detailed answers');

  const overall = totalScore >= 70
    ? `Strong performance with a score of ${totalScore}/100 and ${confidenceLevel.toLowerCase()} confidence. You demonstrated solid knowledge and communication skills.`
    : totalScore >= 50
      ? `Good effort with a score of ${totalScore}/100. You showed decent knowledge with room to grow in specific areas.`
      : `You scored ${totalScore}/100. With focused practice on the areas highlighted below, you can significantly improve.`;

  return {
    overall,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3)
  };
}

// @desc    Get a specific result
// @route   GET /api/results/:interviewId
// @access  Private
const getResult = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.interviewId,
      user: req.user._id,
      status: 'completed'
    });

    if (!interview) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json({ result: interview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all results for user
// @route   GET /api/results
// @access  Private
const getAllResults = async (req, res) => {
  try {
    const results = await Interview.find({
      user: req.user._id,
      status: 'completed'
    })
      .sort({ completedAt: -1 })
      .select('type totalScore confidenceLevel completedAt duration aiFeedback');

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { completeInterview, getResult, getAllResults };