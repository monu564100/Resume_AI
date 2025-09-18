# API Reference Documentation

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Error Responses

All endpoints return consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": {
    "field": "Specific field error message"
  }
}
```

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Success Response (201)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### Error Responses

**400 - Validation Error**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": "Email already exists",
    "password": "Password must be at least 6 characters"
  }
}
```

### Login User

**POST** `/auth/login`

Authenticate user and return access token.

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### Error Responses

**401 - Invalid Credentials**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "statusCode": 401
}
```

### Get Current User

**GET** `/auth/me`

Get authenticated user information.

#### Headers
```
Authorization: Bearer <token>
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Resume Management Endpoints

### Upload Resume

**POST** `/resume/upload`

Upload and analyze a resume file.

#### Headers
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Request Body (Form Data)
```
resume: <file> (PDF or DOCX)
```

#### Success Response (201)

```json
{
  "success": true,
  "message": "Resume uploaded and analyzed successfully",
  "data": {
    "resumeId": "resume_id",
    "fileName": "john_doe_resume.pdf",
    "fileUrl": "https://cloudinary.com/secure_url",
    "analysis": {
      "extractedText": "Full resume text...",
      "summary": "Experienced software engineer...",
      "skills": [
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB"
      ],
      "experience": "5 years",
      "education": "Bachelor's in Computer Science",
      "score": 85,
      "suggestions": [
        "Add more specific achievements",
        "Include relevant certifications"
      ]
    },
    "jobMatches": [
      {
        "jobTitle": "Software Engineer",
        "company": "Tech Corp",
        "location": "Mumbai, India",
        "matchScore": 92,
        "description": "Job description...",
        "requirements": ["React", "Node.js", "JavaScript"],
        "salaryRange": "₹8-12 LPA",
        "postedDate": "2024-01-01",
        "applyUrl": "https://apply-link.com"
      }
    ]
  }
}
```

#### Error Responses

**400 - Invalid File**
```json
{
  "success": false,
  "message": "Invalid file format. Only PDF and DOCX files are allowed",
  "statusCode": 400
}
```

**413 - File Too Large**
```json
{
  "success": false,
  "message": "File size exceeds the 10MB limit",
  "statusCode": 413
}
```

### Get Resume History

**GET** `/resume/history`

Get all resumes uploaded by the authenticated user.

#### Headers
```
Authorization: Bearer <token>
```

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "resumes": [
      {
        "id": "resume_id",
        "fileName": "resume.pdf",
        "fileUrl": "https://cloudinary.com/url",
        "uploadedAt": "2024-01-01T00:00:00.000Z",
        "analysis": {
          "score": 85,
          "skills": ["JavaScript", "React"],
          "summary": "Brief summary..."
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### Get Resume by ID

**GET** `/resume/:id`

Get detailed analysis of a specific resume.

#### Headers
```
Authorization: Bearer <token>
```

#### Parameters
- `id`: Resume ID

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "resume": {
      "id": "resume_id",
      "fileName": "resume.pdf",
      "fileUrl": "https://cloudinary.com/url",
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "analysis": {
        "extractedText": "Full text...",
        "sections": {
          "summary": "Professional summary...",
          "experience": "Work experience...",
          "education": "Educational background...",
          "skills": "Skills section..."
        },
        "skills": ["JavaScript", "React", "Node.js"],
        "experience": "5 years",
        "education": "Bachelor's in CS",
        "score": 85,
        "suggestions": [
          "Add quantifiable achievements",
          "Include relevant keywords"
        ]
      }
    }
  }
}
```

#### Error Responses

**404 - Resume Not Found**
```json
{
  "success": false,
  "message": "Resume not found",
  "statusCode": 404
}
```

### Delete Resume

**DELETE** `/resume/:id`

Delete a resume and its analysis data.

#### Headers
```
Authorization: Bearer <token>
```

#### Parameters
- `id`: Resume ID

#### Success Response (200)

```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

## Skills Management Endpoints

### Get User Skills

**GET** `/skills`

Get all extracted skills for the authenticated user.

#### Headers
```
Authorization: Bearer <token>
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "name": "JavaScript",
        "category": "technical",
        "level": "advanced",
        "extractedFrom": "resume_analysis",
        "confidence": 0.95
      },
      {
        "name": "Communication",
        "category": "soft",
        "level": "intermediate",
        "extractedFrom": "resume_analysis",
        "confidence": 0.85
      }
    ],
    "summary": {
      "totalSkills": 15,
      "technicalSkills": 10,
      "softSkills": 3,
      "languages": 1,
      "certifications": 1
    },
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User Skills

**PUT** `/skills`

Update or add user skills.

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "skills": [
    {
      "name": "Python",
      "category": "technical",
      "level": "intermediate"
    },
    {
      "name": "Project Management",
      "category": "soft",
      "level": "advanced"
    }
  ]
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Skills updated successfully",
  "data": {
    "skillsAdded": 2,
    "skillsUpdated": 0,
    "totalSkills": 17
  }
}
```

### Delete User Skill

**DELETE** `/skills/:skillId`

Remove a specific skill from user's profile.

#### Headers
```
Authorization: Bearer <token>
```

#### Parameters
- `skillId`: Skill ID to delete

#### Success Response (200)

```json
{
  "success": true,
  "message": "Skill removed successfully"
}
```

## Job Search Endpoints

### Search Jobs

**GET** `/jobs/search`

Search for jobs with optional skill-based filtering.

#### Headers
```
Authorization: Bearer <token>
```

#### Query Parameters
- `query` (optional): Job search query
- `location` (optional): Job location (default: "India")
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)
- `skillMatch` (optional): Filter by skill match (true/false)

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_id",
        "title": "Senior Software Engineer",
        "company": "Tech Solutions",
        "location": "Bangalore, India",
        "description": "We are looking for...",
        "requirements": [
          "5+ years experience",
          "React expertise",
          "Node.js knowledge"
        ],
        "skills": ["React", "Node.js", "JavaScript", "MongoDB"],
        "salaryRange": "₹15-25 LPA",
        "experienceLevel": "Senior",
        "employmentType": "Full-time",
        "postedDate": "2024-01-01",
        "companyLogo": "https://logo-url.com",
        "applyUrl": "https://apply-link.com",
        "matchScore": 88,
        "matchingSkills": ["React", "Node.js", "JavaScript"],
        "missingSkills": ["Docker", "AWS"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "locations": ["Mumbai", "Bangalore", "Delhi"],
      "companies": ["Tech Corp", "Innovation Labs"],
      "experienceLevels": ["Junior", "Mid", "Senior"]
    }
  }
}
```

### Get Recommended Jobs

**GET** `/jobs/recommended`

Get personalized job recommendations based on user's skills.

#### Headers
```
Authorization: Bearer <token>
```

#### Query Parameters
- `limit` (optional): Number of recommendations (default: 20)

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "job": {
          "id": "job_id",
          "title": "Full Stack Developer",
          "company": "StartupXYZ",
          "location": "Remote, India",
          "description": "Join our dynamic team...",
          "salaryRange": "₹12-18 LPA",
          "applyUrl": "https://apply-link.com"
        },
        "matchScore": 92,
        "matchingSkills": ["React", "Node.js", "MongoDB"],
        "recommendationReason": "Perfect match for your full-stack skills",
        "skillGap": ["Docker", "Kubernetes"],
        "careerGrowth": "Senior Developer → Team Lead"
      }
    ],
    "userProfile": {
      "topSkills": ["JavaScript", "React", "Node.js"],
      "experienceLevel": "Mid-level",
      "preferredLocations": ["Mumbai", "Bangalore"]
    }
  }
}
```

## Health Check Endpoints

### API Health

**GET** `/health`

Check API server status.

#### Success Response (200)

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.5.0",
  "uptime": "2h 30m 15s"
}
```

### Database Health

**GET** `/health/db`

Check database connection status.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Database connection healthy",
  "database": {
    "status": "connected",
    "responseTime": "15ms",
    "collections": {
      "users": 1250,
      "resumes": 3420,
      "userSkills": 1180
    }
  }
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **File upload endpoints**: 10 requests per hour per user
- **Job search endpoints**: 100 requests per hour per user
- **General endpoints**: 1000 requests per hour per user

#### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

#### Rate Limit Exceeded Response (429)

```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later.",
  "statusCode": 429,
  "retryAfter": 3600
}
```

## Error Codes Reference

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 400 | Bad Request | Invalid request data, validation errors |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 413 | Payload Too Large | File size exceeds limit |
| 415 | Unsupported Media Type | Invalid file format |
| 422 | Unprocessable Entity | Valid request format but semantic errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 502 | Bad Gateway | External service unavailable |
| 503 | Service Unavailable | Server temporarily unavailable |

## SDK Examples

### JavaScript/Node.js

```javascript
const API_BASE_URL = 'http://localhost:5000/api';

class ResumeValidatorAPI {
  constructor(token = null) {
    this.token = token;
    this.baseURL = API_BASE_URL;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      this.token = data.data.token;
    }
    return data;
  }

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(`${this.baseURL}/resume/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });

    return await response.json();
  }

  async getSkills() {
    const response = await fetch(`${this.baseURL}/skills`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    return await response.json();
  }
}

// Usage
const api = new ResumeValidatorAPI();
await api.login('user@example.com', 'password');
const result = await api.uploadResume(fileObject);
```

### Python

```python
import requests
from typing import Optional, Dict, Any

class ResumeValidatorAPI:
    def __init__(self, base_url: str = "http://localhost:5000/api", token: Optional[str] = None):
        self.base_url = base_url
        self.token = token
        self.session = requests.Session()
    
    def login(self, email: str, password: str) -> Dict[str, Any]:
        response = self.session.post(
            f"{self.base_url}/auth/login",
            json={"email": email, "password": password}
        )
        data = response.json()
        
        if data.get('success'):
            self.token = data['data']['token']
            self.session.headers.update({'Authorization': f'Bearer {self.token}'})
        
        return data
    
    def upload_resume(self, file_path: str) -> Dict[str, Any]:
        with open(file_path, 'rb') as file:
            files = {'resume': file}
            response = self.session.post(f"{self.base_url}/resume/upload", files=files)
        
        return response.json()
    
    def get_skills(self) -> Dict[str, Any]:
        response = self.session.get(f"{self.base_url}/skills")
        return response.json()

# Usage
api = ResumeValidatorAPI()
api.login('user@example.com', 'password')
result = api.upload_resume('path/to/resume.pdf')
```

### cURL Examples

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Upload Resume
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@path/to/resume.pdf"

# Get Skills
curl -X GET http://localhost:5000/api/skills \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search Jobs
curl -X GET "http://localhost:5000/api/jobs/search?query=developer&location=Mumbai" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Webhook Support (Coming Soon)

Future webhook endpoints for real-time notifications:

- Resume analysis completion
- New job matches found
- Skill profile updates
- Account activity alerts

## API Versioning

Current API version: **v1**

All endpoints are prefixed with `/api` and are currently unversioned. Future versions will use:
- `/api/v2/endpoint` for new API versions
- Backward compatibility maintained for v1

## Support

For API support and questions:
- **Documentation**: This reference guide
- **GitHub Issues**: Report bugs and request features
- **Email**: api-support@resumevalidator.com
- **Response Time**: 24-48 hours for technical queries