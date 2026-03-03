# InternSieve: Intelligent Internship Evaluation & Selection Platform

InternSieve is an AI-powered internship evaluation system built to eliminate manual screening chaos. It helps companies intelligently rank, compare, and respond to internship applicants using algorithmic scoring + LangChain-powered RAG analysis.

## Features

- **Ranked candidate lists** with AI-driven scoring.
- **Clear strengths & weaknesses** per applicant.
- **Comparative insights** (AI analysis of top candidates).
- **One-click acceptance/rejection emails** with constructive feedback.
- **Resume Parsing** from PDF files.

## Tech Stack

- **Frontend:** React, Vite, Axios, React Router, Framer Motion.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Multer, PDF-Parse.
- **AI Layer:** LangChain, OpenAI GPT-4, OpenAI Embeddings.
- **Email:** Nodemailer.

## Getting Started

### Prerequisites

- Node.js installed.
- MongoDB running locally or a MongoDB Atlas URI.
- OpenAI API Key.

### Backend Setup

1. Navigate to `backend/`.
2. Create a `.env` file (see `.env.example`).
3. Install dependencies: `npm install`.
4. Start the server: `node server.js`.

### Frontend Setup

1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

## Environment Variables (Backend)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/internsieve
OPENAI_API_KEY=your_openai_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

## How it Works

1. **Create a Role:** Define requirements and scoring weights.
2. **Upload Resumes:** Batch upload candidate resumes (PDF).
3. **AI Evaluation:** InternSieve parses, scores, and summarizes each candidate.
4. **Compare & Select:** Use comparative insights to pick the best fit and send automated emails.
