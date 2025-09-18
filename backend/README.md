# Backend API

Express + MongoDB backend for the Resume Validator app.

## Setup

1. Copy `.env.example` to `.env` and set your values:
	- `MONGODB_URI`
	- `JWT_SECRET`
	- `JWT_EXPIRES_IN`
	- `PORT` (optional)
	- `GEMINI_API_KEY` (required for Gemini analysis)

2. Install dependencies:
	- From this `backend/` directory, run `npm install`.

3. Start the server:
	- Development (with auto-reload): `npm run dev`
	- Production: `npm start`

Server defaults to `http://localhost:5000`.

## Environment

Copy `.env.example` to `.env` and provide values.

Optional integrations:

- Affinda Resume Parser
  - set `RESUME_PARSER=affinda`
  - `AFFINDA_API_KEY`

- RChilli Resume Parser
  - set `RESUME_PARSER=rchilli`
  - `RCHILLI_URL`, `RCHILLI_USERKEY`, `RCHILLI_SUBUSERID`, (`RCHILLI_VERSION` optional)

- LinkedIn Jobs via RapidAPI
  - `RAPIDAPI_KEY`
  - `RAPIDAPI_LINKEDIN_HOST` (defaults to `linkedin-jobs-search.p.rapidapi.com`)

- SkillRank API (optional)
  - `SKILLRANK_API_KEY`, `SKILLRANK_BASE_URL`

- Local testing
  - `SKIP_AUTH=true` to bypass JWT on protected routes
## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT auth (jsonwebtoken, bcryptjs)
- CORS, dotenv
- Google Generative AI SDK (Gemini)
