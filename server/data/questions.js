// ============================================
// server/data/questions.js - Sample Interview Questions
// ============================================

const hrQuestions = [
  {
    id: 1,
    question: "Tell me about yourself and your professional background.",
    keywords: ["experience", "background", "skills", "education", "work", "professional", "career", "role", "team"],
    category: "Introduction"
  },
  {
    id: 2,
    question: "What are your greatest strengths and how have they helped you professionally?",
    keywords: ["strength", "skill", "leadership", "communication", "problem-solving", "teamwork", "organized", "dedicated", "helped"],
    category: "Self-Assessment"
  },
  {
    id: 3,
    question: "What is your biggest weakness and how are you working to improve it?",
    keywords: ["weakness", "improve", "learning", "working", "overcome", "challenge", "growth", "feedback"],
    category: "Self-Assessment"
  },
  {
    id: 4,
    question: "Describe a time when you faced a difficult challenge at work and how you handled it.",
    keywords: ["challenge", "solution", "resolved", "team", "managed", "result", "outcome", "strategy", "approach"],
    category: "Behavioral"
  },
  {
    id: 5,
    question: "Where do you see yourself in the next 5 years?",
    keywords: ["goal", "growth", "career", "leadership", "develop", "advance", "contribute", "learn", "skills"],
    category: "Career Goals"
  },
  {
    id: 6,
    question: "Why are you interested in this position and our company?",
    keywords: ["company", "role", "opportunity", "mission", "values", "culture", "growth", "interest", "passion"],
    category: "Motivation"
  },
  {
    id: 7,
    question: "How do you handle pressure and tight deadlines?",
    keywords: ["deadline", "prioritize", "manage", "stress", "calm", "organize", "plan", "deliver", "focus"],
    category: "Work Style"
  },
  {
    id: 8,
    question: "Tell me about a time you worked effectively as part of a team.",
    keywords: ["team", "collaborate", "communicate", "contribute", "support", "together", "shared", "goal", "success"],
    category: "Teamwork"
  },
  {
    id: 9,
    question: "What motivates you in your professional life?",
    keywords: ["motivated", "passion", "challenge", "growth", "impact", "learning", "achieve", "results", "purpose"],
    category: "Motivation"
  },
  {
    id: 10,
    question: "Do you have any questions for us?",
    keywords: ["question", "culture", "team", "opportunity", "role", "expectations", "growth", "learning"],
    category: "Closing"
  }
];

const technicalQuestions = [
  {
    id: 101,
    question: "Explain the difference between REST and GraphQL APIs.",
    keywords: ["REST", "GraphQL", "endpoint", "query", "flexible", "response", "schema", "mutation", "HTTP"],
    category: "API Design"
  },
  {
    id: 102,
    question: "What is the difference between == and === in JavaScript?",
    keywords: ["strict", "equality", "type", "coercion", "comparison", "boolean", "value", "conversion"],
    category: "JavaScript"
  },
  {
    id: 103,
    question: "Explain the concept of closures in JavaScript with an example.",
    keywords: ["closure", "scope", "inner function", "outer", "variable", "lexical", "access", "memory"],
    category: "JavaScript"
  },
  {
    id: 104,
    question: "What is the difference between SQL and NoSQL databases?",
    keywords: ["relational", "schema", "document", "flexible", "scalable", "ACID", "MongoDB", "MySQL", "structured"],
    category: "Databases"
  },
  {
    id: 105,
    question: "How does React's virtual DOM work and why is it beneficial?",
    keywords: ["virtual", "DOM", "reconciliation", "diff", "performance", "update", "render", "efficient"],
    category: "React"
  },
  {
    id: 106,
    question: "What are the core principles of Object-Oriented Programming?",
    keywords: ["encapsulation", "inheritance", "polymorphism", "abstraction", "class", "object", "method", "OOP"],
    category: "OOP"
  },
  {
    id: 107,
    question: "Explain time and space complexity. What is Big O notation?",
    keywords: ["Big O", "complexity", "time", "space", "O(n)", "O(1)", "algorithm", "efficiency", "notation"],
    category: "Algorithms"
  },
  {
    id: 108,
    question: "What is JWT and how does it work for authentication?",
    keywords: ["JWT", "token", "header", "payload", "signature", "authentication", "authorization", "decode", "verify"],
    category: "Security"
  },
  {
    id: 109,
    question: "Describe how you would optimize the performance of a slow web application.",
    keywords: ["optimize", "cache", "lazy loading", "minify", "CDN", "database", "query", "profiling", "bundle"],
    category: "Performance"
  },
  {
    id: 110,
    question: "What is the difference between async/await and Promises in JavaScript?",
    keywords: ["async", "await", "promise", "then", "catch", "asynchronous", "callback", "resolve", "reject"],
    category: "JavaScript"
  }
];

// Get questions based on interview type
const getQuestions = (type, count = 7) => {
  const pool = type === 'Technical' ? technicalQuestions : hrQuestions;
  // Shuffle and pick 'count' questions
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
};

module.exports = { hrQuestions, technicalQuestions, getQuestions };
