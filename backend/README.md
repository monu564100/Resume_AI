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

## Required Minimum Environment Variables

The server will fail fast if these are missing in production mode:

| Variable | Purpose | Notes |
|----------|---------|-------|
| MONGODB_URI | MongoDB connection string | Use a dedicated user with least privileges |
| JWT_SECRET | JWT signing secret | 32+ chars recommended |
| JWT_EXPIRES_IN | Token lifetime | e.g. `7d` |
| GEMINI_API_KEY | Gemini model calls | Required for ATS scoring & enrichment |

Optional but recommended:

| Variable | Purpose |
|----------|---------|
| RAPIDAPI_KEY | Real job matching via RapidAPI |
| RESUME_PARSER_PROVIDER | 'local' (default) / 'affinda' / 'rchilli' |
| AFFINDA_API_KEY | Enables Affinda parsing |
| RCHILLI_API_KEY | Enables RChilli parsing |

## Runtime Configuration Validation

Add a lightweight guard early (suggested snippet if you want stricter boot checks):

```js
// config/validateEnv.js
['MONGODB_URI','JWT_SECRET','JWT_EXPIRES_IN','GEMINI_API_KEY'].forEach(k=>{
	if(!process.env[k]){
		console.error(`Missing required env var: ${k}`);
		if(process.env.NODE_ENV==='production') process.exit(1);
	}
});
```

Then import once in `server.js` before starting the app.

## Production Notes

1. Set `NODE_ENV=production` and ensure proper process manager (PM2 / Docker / systemd)
2. Enable compression & security headers (helmet) if not already
3. Use TLS termination at reverse proxy (NGINX / Cloudflare)
4. Rotate `JWT_SECRET` only with session invalidation policy
5. Monitor: add minimal health endpoint `/api/health` and connect to uptime checks
6. Log redaction: never log raw resume text in production; sanitize PII if stored

## Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| 401 after login | Wrong JWT_SECRET mismatch between deploys | Keep secrets consistent / invalidate old tokens |
| Empty job matches | Missing RAPIDAPI_KEY | Set key & restart |
| Low parsing quality | Only local parser active | Provide Gemini key or external parser key |
| Crashes on start | Missing required env | Add .env / secrets to deployment |

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT auth (jsonwebtoken, bcryptjs)
- CORS, dotenv
- Google Generative AI SDK (Gemini)
