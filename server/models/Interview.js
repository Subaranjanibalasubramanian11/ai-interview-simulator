// ============================================
// server/models/Interview.js - Interview Schema
// ============================================
const mongoose = require('mongoose');

// Schema for individual Q&A pairs
const answerSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  score: { type: Number, default: 0, min: 0, max: 100 },
  fillerWordCount: { type: Number, default: 0 },
  keywords: [String],
  matchedKeywords: [String]
});

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['HR', 'Technical'],
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  questions: [{
    id: Number,
    question: String,
    keywords: [String],
    category: String
  }],
  answers: [answerSchema],
  resumeText: {
    type: String,
    default: ''
  },
  // Final result fields (filled after completion)
  totalScore: { type: Number, default: 0 },
  confidenceLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  aiFeedback: {
    overall: { type: String, default: '' },
    strengths: [String],
    improvements: [String]
  },
  duration: { type: Number, default: 0 }, // in seconds
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.model('Interview', interviewSchema);
