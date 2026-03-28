# Usage Guide

## Core Workflow

InternSieve is built around this workflow:

1. Create a role
2. Upload PDF resumes for that role
3. Evaluate applicants
4. Rank applicants
5. Review applicant details and compare top candidates
6. Update applicant status
7. Send acceptance or rejection emails

## Frontend Routes

- `/dashboard` - main applicant dashboard
- `/applicants` - applicant review view
- `/applicants/:id` - applicant detail page
- `/roles` - role list
- `/roles/new` - create role form
- `/upload` - resume upload flow

## Create A Role

Go to `/roles/new` and fill in:

- title
- description
- required skills
- preferred skills
- experience level
- culture description
- scoring weights

The role weights must add up to `1.0`.

## Upload Resumes

Go to `/upload` and:

1. Select a role
2. Upload one or more PDF resumes
3. Submit the upload

Each resume creates an applicant record tied to the selected role.

## Evaluate Applicants

From the dashboard, use:

- `Evaluate All`
- `Rank Applicants`
- `Compare Top`

Evaluation updates the applicant with:

- deterministic breakdown
- AI score
- AI summary
- strengths
- weaknesses
- fit rating
- final score

## Review Applicants

From the table you can:

- filter by role
- filter by status
- filter by minimum score
- sort by score, date, or name
- open the modal or detail page
- accept, reject, or mark applicants for review

## Notifications

Notifications can be sent in two ways:

1. Status-based actions from the applicant detail/dashboard
2. Bulk notification actions from the dashboard buttons

If SMTP is not configured, the API returns a safe failure instead of crashing.

## AI Fallback Behavior

If `OPENAI_API_KEY` is missing:

- resume extraction uses heuristic parsing
- candidate evaluation uses deterministic fallback logic
- comparison uses a fallback summary

This lets the app remain usable in local and demo environments.
