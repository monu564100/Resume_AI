# Resume Validator Backend API

## Overview

The Resume Validator Backend is a Node.js/Express.js application that provides AI-powered resume analysis, skill extraction, and job matching capabilities. It integrates with Gemini AI, RapidAPI's JSearch, and Cloudinary for comprehensive resume processing.

## 🏗️ Architecture

```
backend/
├── controllers/         # Request handlers and business logic
├── middleware/         # Authentication and error handling
├── models/            # MongoDB/Mongoose data models
├── routes/            # API route definitions
├── services/          # External service integrations
├── utils/             # Utility functions and helpers
└── server.js          # Application entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

#### 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**:
   - Set `NODE_ENV=production`
   - Remove `SKIP_AUTH=true`
   - Use strong JWT secret
   - Configure MongoDB Atlas URI

2. **Database Setup**:
   ```bash
   # Create MongoDB indexes
   db.users.createIndex({ email: 1 }, { unique: true })
   db.userskills.createIndex({ userId: 1 }, { unique: true })
   ```

3. **Server Deployment**:
   ```bash
   # Build and start
   npm install --production
   npm start
   
   # With PM2
   pm2 start server.js --name "resume-api"
   ```

### Performance Optimization

- **Caching**: Implement Redis for session storage
- **Rate Limiting**: Add express-rate-limit middleware
- **Compression**: Enable gzip compression
- **Security**: Add helmet for security headers

## 🧪 Testing

### API Testing with curl

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Upload resume
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume=@path/to/resume.pdf"

# Get skills
curl -X GET http://localhost:5000/api/skills \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📋 Development Guidelines

### Code Style

- Use ESLint with Airbnb configuration
- Follow RESTful API conventions
- Use async/await for asynchronous operations
- Implement proper error handling

### Security Best Practices

- Validate all input data
- Use parameterized queries
- Implement rate limiting
- Keep dependencies updated
- Use environment variables for secrets

### Monitoring

- Log all API requests and errors
- Monitor database performance
- Track file upload metrics
- Set up health check endpoints

## 🔗 External Dependencies

| Package | Purpose | Documentation |
|---------|---------|---------------|
| express | Web framework | https://expressjs.com/ |
| mongoose | MongoDB ODM | https://mongoosejs.com/ |
| jsonwebtoken | JWT authentication | https://github.com/auth0/node-jsonwebtoken |
| bcryptjs | Password hashing | https://github.com/dcodeIO/bcrypt.js |
| multer | File upload handling | https://github.com/expressjs/multer |
| cloudinary | File storage | https://cloudinary.com/documentation |
| pdf-parse | PDF text extraction | https://github.com/modesty/pdf-parse |
| mammoth | DOCX text extraction | https://github.com/mwilliamson/mammoth.js |
| axios | HTTP client | https://axios-http.com/ |

## 📞 Support

For issues and questions:
- Check the API logs for error details
- Verify environment variables are set correctly
- Ensure external services (MongoDB, Cloudinary, RapidAPI) are accessible
- Review rate limits and quotas for external APIs

## 🔄 Version History

- **v1.0.0**: Initial release with basic resume analysis
- **v1.1.0**: Added skill extraction and job matching
- **v1.2.0**: Implemented user-specific skill storage
- **v1.3.0**: Enhanced job matching with skill-based sorting

### Installation & Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

## 📊 Database Models

### User Model (`models/User.js`)

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Resume Model (`models/Resume.js`)

```javascript
{
  userId: ObjectId,
  fileName: String,
  fileUrl: String,
  uploadedAt: Date,
  analysis: {
    extractedText: String,
    sections: Object,
    skills: [String],
    experience: String,
    education: String,
    summary: String,
    score: Number,
    suggestions: [String]
  }
}
```

### UserSkills Model (`models/UserSkills.js`)

```javascript
{
  userId: ObjectId (unique),
  skills: [{
    name: String,
    category: String, // 'technical', 'soft', 'language', 'certification'
    level: String,    // 'beginner', 'intermediate', 'advanced', 'expert'
    extractedFrom: String,
    confidence: Number
  }],
  lastUpdated: Date
}
```

## 🛣️ API Routes

### Authentication Routes (`routes/auth.js`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Resume Routes (`routes/resume.js`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/resume/upload` | Upload and analyze resume | Yes |
| GET | `/api/resume/history` | Get user's resume history | Yes |
| GET | `/api/resume/:id` | Get specific resume analysis | Yes |
| DELETE | `/api/resume/:id` | Delete resume | Yes |

### Skills Routes (`routes/skills.js`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/skills` | Get user's extracted skills | Yes |
| PUT | `/api/skills` | Update user skills | Yes |
| DELETE | `/api/skills/:skillId` | Remove specific skill | Yes |

### Job Matching Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/jobs/search` | Search jobs with skill matching | Yes |
| GET | `/api/jobs/recommended` | Get skill-based recommendations | Yes |

## 🔧 Controllers

### Auth Controller (`controllers/authController.js`)

- **register**: Creates new user account with password hashing
- **login**: Authenticates user and returns JWT token
- **getCurrentUser**: Returns current authenticated user data

### Resume Controller (`controllers/resumeController.js`)

- **uploadResume**: Handles file upload, text extraction, and AI analysis
- **getResumeHistory**: Returns user's upload history
- **getResumeById**: Returns specific resume analysis
- **deleteResume**: Removes resume and associated data

### Analyze Controller (`controllers/analyzeController.js`)

- **analyzeResume**: Core analysis function with:
  - Text extraction (PDF/DOCX)
  - Gemini AI enrichment
  - Skill extraction and categorization
  - Job matching with RapidAPI
  - Skill-based sorting

## 🛠️ Services

### Gemini Service (`services/geminiService.js`)

```javascript
class GeminiService {
  async analyzeResume(text) {
    // Analyzes resume text using Gemini AI
    // Returns structured analysis with skills, experience, suggestions
  }
  
  async extractSkills(text) {
    // Extracts and categorizes skills from resume text
    // Returns skills with categories and proficiency levels
  }
}
```

### Resume Service (`services/resumeService.js`)

```javascript
class ResumeService {
  async extractText(filePath) {
    // Extracts text from PDF/DOCX files
    // Supports pdf-parse and mammoth libraries
  }
  
  async uploadToCloudinary(filePath) {
    // Uploads files to Cloudinary
    // Returns secure URL and public ID
  }
}
```

## 🔐 Middleware

### Authentication (`middleware/auth.js`)

```javascript
// Verifies JWT tokens and attaches user to request
const authMiddleware = (req, res, next) => {
  // Skip auth in development if SKIP_AUTH=true
  // Verify JWT token
  // Attach user to req.user
}
```

### Error Handler (`middleware/errorHandler.js`)

```javascript
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  // Logs errors
  // Returns appropriate error responses
  // Handles validation, authentication, and server errors
}
```

## 📈 Key Features

### 1. Resume Analysis Pipeline

```
File Upload → Text Extraction → Gemini Analysis → Skill Extraction → Job Matching
```

### 2. Skill Management

- Automatic skill extraction from resumes
- Skill categorization (technical, soft, language, certification)
- Proficiency level detection
- User-specific skill storage

### 3. Job Matching

- RapidAPI JSearch integration
- Skill-based job filtering
- Match score calculation
- Location-based search (India focus)

### 4. File Storage

- Cloudinary integration for secure file storage
- Support for PDF and DOCX formats
- Automatic file cleanup and optimization

## 🔍 Error Handling

### Common Error Responses

```javascript
// Validation Error
{
  success: false,
  message: "Validation error",
  errors: {
    email: "Email is required",
    password: "Password must be at least 6 characters"
  }
}

// Authentication Error
{
  success: false,
  message: "Authentication required",
  statusCode: 401
}

// File Upload Error
{
  success: false,
  message: "File upload failed",
  error: "Unsupported file format"
}
```

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
