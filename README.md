# InternSieve

InternSieve is an internship applicant screening platform with:

- A React frontend for role setup, resume upload, applicant review, comparison, ranking, and notifications
- An Express + MongoDB backend with applicant and role APIs
- A hybrid scoring pipeline that combines deterministic scoring with optional AI and RAG layers
- Graceful fallbacks when OpenAI or SMTP credentials are not configured

## What Is Implemented

- Role management with weighted scoring configuration
- PDF resume upload and applicant creation
- Applicant listing, filtering, comparison, and detail views
- Evaluation, ranking, status updates, and email notification endpoints
- Middleware for logging, 404 handling, validation, and JSON error responses
- Backend unit/API tests
- Production frontend build support and backend static serving in production

## Quick Start

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm test
npm run dev
```

### Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run lint
npm run dev
```

Open `http://localhost:3000`.

## Verification Commands

- Backend tests: `cd backend && npm test`
- Frontend tests: `cd frontend && npm test`
- Frontend lint: `cd frontend && npm run lint`
- Frontend production build: `cd frontend && npm run build`

## Environment

### Backend

See [backend/.env.example](/g:/Projects/intern-hq/backend/.env.example) for the full list.

Important variables:

- `MONGODB_URI`
- `OPENAI_API_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `PORT`
- `CORS_ORIGIN`
- `NODE_ENV`

### Frontend

- `VITE_API_BASE_URL`

If omitted in production, the frontend defaults to same-origin requests.

## Docs

- Deployment: [docs/DEPLOYMENT.md](/g:/Projects/intern-hq/docs/DEPLOYMENT.md)
- Usage: [docs/USAGE.md](/g:/Projects/intern-hq/docs/USAGE.md)
- Technical architecture: [docs/ARCHITECTURE.md](/g:/Projects/intern-hq/docs/ARCHITECTURE.md)

## Notes

- Resume ingestion currently supports PDF files.
- If `OPENAI_API_KEY` is missing, resume extraction, evaluation, and comparison use deterministic fallbacks instead of failing.
- If SMTP credentials are missing, notification attempts fail safely and return an explanatory error in the API response.
