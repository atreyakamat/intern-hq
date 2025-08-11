# InternSieve

InternSieve helps startups and HR teams evaluate intern applications at scale using AI. It ranks candidates, summarizes profiles, and can auto-generate accept/reject emails.

Tech:
- Frontend: React + Vite
- Backend: Node.js + Express
- AI: LangChain + RAG (planned)
- Scoring: Custom weights (planned)

## Repo structure
- `frontend/` — React app (Vite)
- `backend/` — Express API (to be implemented)

## Prerequisites
- Node.js 18+ (use `.nvmrc`)
- NPM (or Yarn/PNPM)
- API keys for LLM provider (OpenAI/Anthropic) and vector DB (planned)
- SMTP creds for email (planned)

## Quick start
Frontend:
```bash
cd frontend
npm install
npm run dev
```

Backend (MVP to be implemented):
```bash
cd backend
npm install
node index.js
```

## Environment variables
- `backend/.env` — LLM keys, vector DB, SMTP, server config
- `frontend/.env` — public runtime config (e.g. API base URL)

See `.env.example` files in each folder.

## Roadmap
- Implement backend MVP endpoints (upload, rank, summary, email preview)
- Add scoring.json and basic scoring engine
- Integrate LangChain and vector DB (RAG) for summaries/justifications
- Add SMTP email send + templates with preview/dry-run
- Frontend flows for upload/rank/detail/settings/email
- Tests + CI, and optional Docker compose
