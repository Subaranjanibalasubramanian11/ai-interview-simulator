# 🎯 InterviewAI — MERN Interview Simulator

A full-stack AI-powered mock interview platform with real-time feedback, voice input, timer-based strict mode, and OpenAI-generated coaching.

---

## 📁 Folder Structure

```
interview-simulator/
├── package.json                    ← Root (run both servers)
├── .gitignore
│
├── server/                         ← Express + Node.js Backend
│   ├── index.js                    ← Entry point
│   ├── package.json
│   ├── .env.example                ← Copy to .env and fill in
│   ├── controllers/
│   │   ├── authController.js       ← Register / Login / Me
│   │   ├── interviewController.js  ← Start / Answer / Get
│   │   ├── resultController.js     ← Complete + AI Feedback
│   │   └── questionController.js   ← Question generation
│   ├── models/
│   │   ├── User.js                 ← User schema (bcrypt hashed)
│   │   └── Interview.js            ← Interview + answers schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── questionRoutes.js
│   │   └── resultRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js       ← JWT protect middleware
│   └── data/
│       └── questions.js            ← HR + Technical question bank
│
└── client/                         ← React Frontend
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js                  ← Router + protected routes
        ├── index.css               ← Global styles (dark theme)
        ├── context/
        │   └── AuthContext.js      ← Auth state + axios config
        ├── components/
        │   └── Navbar.js
        └── pages/
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── DashboardPage.js    ← Stats + history
            ├── SetupPage.js        ← Type + question count + resume
            ├── InterviewPage.js    ← Strict mode + voice + timer
            └── ResultPage.js       ← Score + AI feedback + breakdown
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
  - OR use MongoDB Atlas (free cloud): https://www.mongodb.com/atlas
- **OpenAI API Key** (optional, for AI feedback) → https://platform.openai.com/api-keys

---

## 🚀 Installation & Setup

### Step 1 — Clone / Download the project

```bash
# If using git
git clone <your-repo-url>
cd interview-simulator

# Or just cd into the folder
cd interview-simulator
```

### Step 2 — Install all dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Go back to root
cd ..
```

Or run everything at once from the root:
```bash
npm run install-all
```

### Step 3 — Configure environment variables

```bash
# Copy the example env file
cp server/.env.example server/.env
```

Now edit `server/.env` with your values:

```env
MONGO_URI=mongodb://localhost:27017/interview-simulator
JWT_SECRET=your_super_secret_key_make_it_long_and_random
OPENAI_API_KEY=sk-your-openai-key-here
PORT=5000
CLIENT_URL=http://localhost:3000
```

> 💡 **No OpenAI key?** The app still works! It will use rule-based AI feedback as a fallback. Just leave the key as the placeholder value.

### Step 4 — Start MongoDB

```bash
# On macOS/Linux
mongod

# On Windows (if installed as service)
net start MongoDB

# Or use MongoDB Compass GUI
```

---

## ▶️ Running the App

### Option A — Run both together (recommended)

```bash
# From the root folder
npm run dev
```

This starts:
- Backend on **http://localhost:5000**
- Frontend on **http://localhost:3000**

### Option B — Run separately

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interviews/start` | Start new interview |
| GET | `/api/interviews` | Get all user interviews |
| GET | `/api/interviews/:id` | Get specific interview |
| POST | `/api/interviews/:id/answer` | Submit an answer |

### Results
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/results/complete/:id` | Complete + generate AI feedback |
| GET | `/api/results` | Get all completed results |
| GET | `/api/results/:id` | Get specific result |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions?type=HR&count=7` | Generate questions |

---

## 🧠 Features Explained

### Strict Interview Mode
- Questions shown one at a time
- 3-minute countdown timer per question
- Auto-advances when timer hits 0
- No pause or skip allowed

### Voice Input
- Uses Web Speech API (Chrome recommended)
- Converts speech to text in real-time
- Transcript is auto-filled in the answer box

### AI Evaluation
- **Keyword matching** — checks answer for relevant terms
- **Filler word detection** — counts "um", "uh", "like", etc.
- **Length analysis** — rewards detailed responses
- **Confidence scoring** — Low / Medium / High based on patterns

### AI Feedback (OpenAI)
- Sends all Q&A pairs to GPT-3.5-turbo
- Returns overall assessment, strengths, and improvements
- Falls back to rule-based feedback if no API key

---

## 🔧 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWTs |
| `OPENAI_API_KEY` | Optional | OpenAI API key for AI feedback |
| `PORT` | No | Server port (default: 5000) |
| `CLIENT_URL` | No | Frontend URL for CORS (default: http://localhost:3000) |

---

## 🐛 Common Issues

**MongoDB not connecting:**
- Make sure `mongod` is running
- Check your `MONGO_URI` in `.env`
- For Atlas, whitelist your IP address

**Port already in use:**
```bash
# Kill process on port 5000
kill $(lsof -t -i:5000)
# Or on Windows:
netstat -ano | findstr :5000
taskkill /PID <pid> /F
```

**Voice input not working:**
- Use Google Chrome (best support for Web Speech API)
- Allow microphone permission when prompted
- HTTPS is required in production for voice

**OpenAI API error:**
- Verify your API key is correct
- Check you have credits in your OpenAI account
- The app will use fallback feedback automatically

---

## 📦 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| AI | OpenAI GPT-3.5-turbo |
| Voice | Web Speech API (browser) |
| Styling | Custom CSS (no framework) |

---

## 🚀 Deployment (Production)

### Backend (Railway / Render)
1. Push code to GitHub
2. Connect to Railway or Render
3. Set environment variables in dashboard
4. Deploy!

### Frontend (Vercel / Netlify)
1. In `client/package.json`, remove the `"proxy"` field
2. Set `REACT_APP_API_URL=https://your-backend-url.com` in `.env`
3. Update axios calls to use `process.env.REACT_APP_API_URL`
4. Deploy `client/` folder

---

Built with ❤️ using the MERN stack
