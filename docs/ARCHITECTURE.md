# Technical Architecture

## Product Purpose

InternSieve helps hiring teams screen internship applicants faster by combining:

- structured role definitions
- resume ingestion
- applicant scoring
- ranked review workflows
- automated notifications

## High-Level Stack

### Frontend

- React
- React Router
- Axios
- Tailwind CSS via Vite

### Backend

- Express
- Mongoose
- MongoDB
- Multer
- Nodemailer

### AI Layer

- LangChain
- OpenAI chat model
- OpenAI embeddings
- FAISS vector store

## Backend Structure

### App Composition

[backend/app.js](/g:/Projects/intern-hq/backend/app.js) creates the Express app and wires:

- CORS
- JSON and body parsing
- request logging middleware
- uploads static path
- applicant routes
- role routes
- health endpoint
- production static frontend serving
- not-found middleware
- JSON error middleware

[backend/server.js](/g:/Projects/intern-hq/backend/server.js) is the runtime entry point that starts the listener.

### Middleware

The middleware layer now includes:

- [requestLogger.js](/g:/Projects/intern-hq/backend/middleware/requestLogger.js) for request timing and status logs
- [validateObjectId.js](/g:/Projects/intern-hq/backend/middleware/validateObjectId.js) for route param validation
- [notFound.js](/g:/Projects/intern-hq/backend/middleware/notFound.js) for API 404s
- [errorHandler.js](/g:/Projects/intern-hq/backend/middleware/errorHandler.js) for normalized JSON errors

### Service Layer

Business logic lives in:

- [roleService.js](/g:/Projects/intern-hq/backend/services/roleService.js)
- [applicantService.js](/g:/Projects/intern-hq/backend/services/applicantService.js)

This keeps controllers thin and concentrates workflow logic in one place.

### Models

- [Role.js](/g:/Projects/intern-hq/backend/models/Role.js)
- [Applicant.js](/g:/Projects/intern-hq/backend/models/Applicant.js)

`Role` stores job requirements and weight configuration.

`Applicant` stores:

- parsed resume text
- extracted profile data
- scoring fields
- HR status
- notification history

## Scoring Pipeline

The scoring pipeline lives in [scoringEngine.js](/g:/Projects/intern-hq/backend/ai/scoringEngine.js).

### Layer 1: Deterministic

The deterministic score blends:

- skill match
- experience alignment
- project depth
- communication quality
- bonus signals

### Layer 2: AI Evaluation

[candidateEvaluator.js](/g:/Projects/intern-hq/backend/ai/candidateEvaluator.js) generates:

- overall AI score
- strengths
- weaknesses
- fit rating
- summary

If OpenAI is not configured, this module falls back to heuristic logic.

### Layer 3: RAG

[embedding.js](/g:/Projects/intern-hq/backend/ai/embedding.js) stores role and resume chunks in FAISS.

[ragPipeline.js](/g:/Projects/intern-hq/backend/ai/ragPipeline.js) retrieves relevant context and scores contextual fit.

RAG failures do not break the full evaluation flow.

### Final Formula

```text
finalScore = deterministic * 0.45 + ai * 0.40 + rag * 0.15
```

## Request Flow

### Role Creation

1. Frontend submits role form
2. Backend normalizes and validates the role payload
3. Role is saved in MongoDB
4. Role embedding is attempted

### Resume Upload

1. Frontend uploads PDF files with `multipart/form-data`
2. Multer stores temp files
3. Resume text is extracted
4. Applicant data is heuristically or AI parsed
5. Applicant record is created
6. Temp file is deleted

### Evaluation

1. Backend loads applicants for a role
2. Resume embedding is attempted
3. Deterministic scoring runs
4. AI evaluation runs or falls back
5. RAG evaluation runs if embeddings are available
6. Applicant record is updated with scores and summaries

### Notifications

1. HR action triggers status update or notify endpoint
2. Email subject and body are generated
3. SMTP send is attempted
4. Email log is appended to the applicant record

## Frontend Structure

The frontend is organized around:

- pages for the main routes
- reusable dashboard, filter, and upload components
- a centralized Axios client in [api.js](/g:/Projects/intern-hq/frontend/src/api/api.js)

The route set is intentionally centered on the working product flow instead of the earlier static mock screens.

## Testing

Backend tests live in [backend/tests](/g:/Projects/intern-hq/backend/tests) and cover:

- API health and not-found behavior
- role payload normalization
- deterministic scoring helpers
- candidate-evaluator fallback behavior

Frontend tests live in [frontend/tests](/g:/Projects/intern-hq/frontend/tests) and cover:

- dashboard query/filter helper behavior
- active-role resolution logic
- notification candidate selection logic
