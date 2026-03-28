# Deployment Guide

## Deployment Modes

You can deploy InternSieve in either of these ways:

1. Single-service deployment
   Build the frontend and let the backend serve `frontend/dist` in production.
2. Split deployment
   Deploy the frontend separately and point it at the backend with `VITE_API_BASE_URL`.

The repository now supports the single-service option directly.

## Required Services

- Node.js 18+
- MongoDB instance
- Optional: OpenAI API key for AI extraction, evaluation, and comparison
- Optional: SMTP credentials for email notifications

## Environment Variables

### Backend

Create `backend/.env` from [backend/.env.example](/g:/Projects/intern-hq/backend/.env.example).

Required for core persistence:

- `MONGODB_URI`

Optional but recommended:

- `OPENAI_API_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `CORS_ORIGIN`
- `PORT`
- `NODE_ENV=production`

### Frontend

Create `frontend/.env` from [frontend/.env.example](/g:/Projects/intern-hq/frontend/.env.example) if you want an explicit API base URL.

## Local Production Build

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Build the frontend

```bash
cd frontend
npm run build
```

### 3. Start the backend in production mode

```bash
cd backend
npm start
```

In production, the backend serves the built frontend automatically when `frontend/dist` exists.

## Single-Service Deployment Steps

1. Provision MongoDB and collect the connection string.
2. Set backend environment variables.
3. Install backend dependencies.
4. Install frontend dependencies.
5. Run `cd frontend && npm run build`.
6. Run `cd backend && npm start`.
7. Expose the backend port publicly.

## Split Deployment Steps

1. Deploy the backend service first.
2. Set `VITE_API_BASE_URL` in the frontend environment to the backend URL.
3. Build and deploy the frontend separately.
4. Set `CORS_ORIGIN` on the backend to the frontend URL.

## Health Check

Use:

```text
GET /api/health
```

The response includes:

- API status
- timestamp
- database connection state
- whether AI is configured
- whether email is configured

## Recommended Production Checklist

- Set `NODE_ENV=production`
- Use a managed MongoDB deployment
- Restrict `CORS_ORIGIN`
- Provide SMTP credentials if you want notifications to send
- Provide `OPENAI_API_KEY` if you want full AI scoring and comparison behavior
- Build the frontend before starting the backend
- Run `npm test` in both `backend/` and `frontend/` before each deploy
- Run `npm run lint` in `frontend/` before each deploy
