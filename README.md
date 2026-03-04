# InternSieve

**AI-Powered Internship Evaluation Platform**

InternSieve automates the screening and ranking of internship applicants using a hybrid scoring engine that combines deterministic heuristics, GPT-4o-mini reasoning, and RAG-based contextual analysis. HR teams get a single dashboard to upload resumes, compare top candidates, and send personalised acceptance / rejection emails — all powered by AI.

---

## Architecture

```
backend/
├── ai/                  # AI layer (LangChain, OpenAI, FAISS)
│   ├── embedding.js         – Vector embedding & FAISS store
│   ├── ragPipeline.js       – Retrieval-Augmented Generation evaluation
│   ├── scoringEngine.js     – Hybrid scoring (deterministic + AI + RAG)
│   └── summaryGenerator.js  – Comparison & email generation
├── controllers/         # Express request handlers
├── mailer/              # Nodemailer email service & templates
├── models/              # Mongoose schemas (Role, Applicant)
├── routes/              # Express route definitions
├── services/            # Business logic layer
├── utils/               # Resume parsing, logging
└── server.js            # Entry point

frontend/
├── src/
│   ├── components/
│   │   ├── Analytics/       – StatsCards
│   │   ├── Applicants/      – ApplicantDetail, ScoreBadge
│   │   ├── Dashboard/       – ApplicantDashboard, Table, ComparisonPanel
│   │   ├── Filters/         – FilterBar
│   │   ├── Layout/          – Navbar, Footer
│   │   ├── Roles/           – CreateRole, RoleList
│   │   └── Upload/          – ResumeUpload
│   ├── App.jsx
│   └── config.js
└── vite.config.js
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express 5, Mongoose 9, MongoDB |
| AI / LLM | LangChain JS, OpenAI GPT-4o-mini, text-embedding-3-small |
| Vector Store | FAISS (faiss-node) — local file-based |
| Frontend | React 19, Vite 7, TailwindCSS 4, React Router 7 |
| Email | Nodemailer (SMTP) |

---

## Core Features

1. **Role Creation** — Define roles with required/preferred skills, experience level, culture description, and 5 configurable scoring weights.
2. **Application Intake** — Drag-and-drop multi-resume upload (PDF/DOCX), parsed via `pdf-parse`.
3. **Resume Parsing** — Extracts text, skills, contact info; AI-assisted structured extraction.
4. **RAG Pipeline** — Embeds resumes & role descriptions into FAISS; retrieves relevant chunks at evaluation time.
5. **Hybrid Scoring** — Three-layer formula: **45% deterministic** (skill match, experience, project depth, clarity, bonus signals) + **40% AI reasoning** (GPT-4o-mini evaluation) + **15% RAG contextual fit**.
6. **Comparative Intelligence** — AI-generated side-by-side analysis of top applicants per role.
7. **HR Dashboard** — Real-time stats, filterable/sortable applicant table, score breakdown, accept/reject workflow.
8. **Email Automation** — AI-generated personalised acceptance & rejection emails sent via SMTP.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or a connection URI (e.g. MongoDB Atlas)
- **OpenAI API key** with access to `gpt-4o-mini` and `text-embedding-3-small`

### 1. Clone

```bash
git clone https://github.com/atreyakamat/intern-hq.git
cd intern-hq
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your real values
npm run dev             # starts with nodemon on port 5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev             # Vite dev server on port 3000
```

Open **http://localhost:3000** in your browser.

---

## Environment Variables

Create `backend/.env` from the provided `.env.example`:

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/internsieve` |
| `OPENAI_API_KEY` | OpenAI API key | — |
| `EMBEDDING_MODEL` | Embedding model name | `text-embedding-3-small` |
| `LLM_MODEL` | Chat model name | `gpt-4o-mini` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_SECURE` | Use TLS | `false` |
| `SMTP_USER` | SMTP username / email | — |
| `SMTP_PASS` | SMTP password / app password | — |
| `PORT` | Backend server port | `5000` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level (`debug`, `info`, `warn`, `error`) | `debug` |

---

## API Endpoints

### Roles

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/roles` | List all roles |
| `GET` | `/api/roles/:id` | Get role by ID |
| `POST` | `/api/roles` | Create a new role |
| `PUT` | `/api/roles/:id` | Update a role |

### Applicants

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/applicants` | List applicants (query: roleId, hrStatus, minScore, skills, sortBy) |
| `GET` | `/api/applicants/:id` | Get applicant detail |
| `POST` | `/api/applicants/upload` | Upload resumes (multipart, max 20 files) |
| `PATCH` | `/api/applicants/:id/status` | Update status (pending / reviewing / accepted / rejected) |
| `POST` | `/api/applicants/bulk-action` | Bulk status update |
| `GET` | `/api/applicants/compare/:roleId` | AI comparative analysis of top applicants |
| `GET` | `/api/applicants/analytics` | Dashboard analytics (query: roleId) |
| `POST` | `/api/applicants/ranks/:roleId` | Recalculate rankings |

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Server health check |

---

## Scoring Formula

```
finalScore = (deterministicScore × 0.45) + (aiScore × 0.40) + (ragScore × 0.15)
```

**Deterministic sub-scores** (weights configurable per role):
- **Skill Match** — overlap ratio of required (70%) + preferred (30%) skills
- **Experience Score** — proximity to target experience level
- **Project Depth** — count, description length, technical keyword density
- **Clarity Score** — resume length, sentence structure, quality indicators
- **Bonus Signals** — GitHub, LinkedIn, portfolio, education keywords

**AI Score** — GPT-4o-mini evaluates the applicant holistically against the role description.

**RAG Score** — Contextual fit derived from vector similarity between embedded resume chunks and role description.

---

## Project Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm start` | Start server (production) |
| `npm run dev` | Start with nodemon (development) |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

---

## License

MIT
