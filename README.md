# <FaRobot /> AI Interview Simulator

<div align="center">

## <FaLaptopCode /> AI-Powered Mock Interview Platform

<p>
AI Interview Simulator is a full-stack MERN web application designed to help users practice HR and Technical interviews in a realistic environment with AI-generated feedback, voice input, confidence analysis, and performance tracking using Google Gemini API.
</p>

</div>

---

# <FaInfoCircle /> Overview

The system simulates real interview experiences by asking questions one by one with timer-based strict interview flow. Users can answer using text or voice input, and the application evaluates answers using keyword matching, filler word analysis, and AI-generated feedback.

The platform helps users improve:
- Technical Knowledge
- Communication Skills
- Confidence Level
- Interview Performance

---

# <FaStar /> Features

## <FaUserShield /> Authentication System
- User Registration & Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes

---

## <FaClipboardList /> Interview Setup
- HR Interview
- Technical Interview
- Resume Upload
- Dynamic Question Selection

---

## <FaClock /> Mock Interview Mode
- One Question at a Time
- Strict Interview Flow
- Timer-Based Questions
- No Pause / No Skip

---

## <FaMicrophone /> Voice Recognition
- Speech-to-Text Conversion
- Real-time Voice Input
- Browser Web Speech API

---

## <FaChartLine /> Performance Analysis
- Keyword Matching Score
- Filler Word Detection
- Confidence Level Analysis
- Communication Evaluation

---

## <FaBrain /> Gemini AI Feedback
- AI-generated Professional Feedback
- Strength Analysis
- Improvement Suggestions
- Overall Interview Review

---

## <FaChartBar /> Dashboard & Tracking
- Previous Interview History
- Performance Tracking
- Interview Analytics
- Result Management

---

# <FaTools /> Tech Stack

| Technology | Usage |
|------------|-------|
| React.js | Frontend Development |
| Node.js | Backend Runtime |
| Express.js | REST API Development |
| MongoDB | Database |
| Mongoose | Database Modeling |
| JWT | Authentication |
| bcrypt.js | Password Security |
| Google Gemini API | AI Feedback |
| Tailwind CSS | UI Design |

---

# <FaFolderOpen /> Project Structure

```bash
interview-simulator/
├── package.json
├── .gitignore
│
├── server/
│   ├── index.js
│   ├── package.json
│   ├── .env.example
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── interviewController.js
│   │   ├── resultController.js
│   │   └── questionController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Interview.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── questionRoutes.js
│   │   └── resultRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   └── data/
│       └── questions.js
│
└── client/
    ├── package.json
    ├── public/
    │   └── index.html
    │
    └── src/
        ├── index.js
        ├── App.js
        ├── index.css
        │
        ├── context/
        │   └── AuthContext.js
        │
        ├── components/
        │   └── Navbar.js
        │
        └── pages/
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── DashboardPage.js
            ├── SetupPage.js
            ├── InterviewPage.js
            └── ResultPage.js
```

---

# <FaDownload /> Installation

## Clone Repository

```bash
git clone https://github.com/Subaranjanibalasubramanian11/ai-interview-simulator.git
```

---

# <FaDesktop /> Frontend Setup

```bash
cd client
npm install
npm start
```

---

# <FaServer /> Backend Setup

```bash
cd server
npm install
npm run dev
```

---

# <FaKey /> Environment Variables

Create `.env` file inside `server/`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

---

# <FaCogs /> Core Modules

## Authentication Module
Handles secure user registration, login, password hashing, and JWT authentication.

## Dashboard Module
Displays interview history, scores, and user performance tracking.

## Interview Setup Module
Allows users to select interview type and configure interview settings.

## Mock Interview Module
Conducts strict timer-based interviews with continuous question flow.

## Voice Recognition Module
Captures voice responses and converts speech into text using Web Speech API.

## Evaluation Module
Evaluates answers using keyword matching and confidence analysis.

## AI Feedback Module
Generates professional interview feedback using Google Gemini API.

## Result & Tracking Module
Stores scores, AI feedback, and interview history in MongoDB.

---

# <FaCodeBranch /> API Integration

The application integrates Google Gemini API to generate AI-based interview feedback dynamically.

### AI Feedback Includes:
- Overall Performance Review
- Strength Analysis
- Improvement Suggestions
- Communication Feedback

---

# <FaRocket /> Future Enhancements

- Resume-Based AI Questions
- Video Interview Simulation
- Facial Expression Detection
- Multi-language Support
- Mobile Application
- Advanced Analytics Dashboard

---

# <FaUserGraduate /> Developed By

### Subaranjani K

B.Sc Information Technology  
Sri Krishna Arts and Science College

---

# <FaGithub /> GitHub Repository

https://github.com/Subaranjanibalasubramanian11/ai-interview-simulator
