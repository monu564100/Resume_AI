const { GoogleGenerativeAI } = require('@google/generative-ai');
const { catchAsync } = require('../utils/catchAsync');
const skillsMap = require('../utils/skillsMap');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const UserSkills = require('../models/UserSkills');
const ExternalParserService = require('../services/externalParserService');
const JobsService = require('../services/jobsService');
const { configureCloudinary, uploadBuffer } = require('../utils/cloudinary');
const axios = require('axios');

// Real Job Search using RapidAPI
async function searchJobsWithRapidAPI(skills = [], location = 'India') {
  try {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';
    
    if (!rapidApiKey || rapidApiKey === 'your_rapidapi_key_here') {
      console.warn('RapidAPI key not configured, using fallback job data');
      return getFallbackJobs(skills, location);
    }

    // Use top 3 skills for job search
    const searchSkills = skills.slice(0, 3).map(skill => 
      typeof skill === 'string' ? skill : skill.name
    ).join(' ');

    const searchQuery = `${searchSkills} developer ${location}`.trim();
    console.log(`🔍 Searching jobs for: "${searchQuery}"`);
    
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': rapidApiHost
      },
      params: {
        query: searchQuery,
        page: '1',
        num_pages: '1',
        date_posted: 'month'
      },
      timeout: 10000
    });

    if (response.data && response.data.data) {
      console.log(`✅ Found ${response.data.data.length} real jobs from API`);
      return response.data.data.slice(0, 10).map(job => ({
        title: job.job_title || 'Software Developer',
        company: job.employer_name || 'Tech Company',
        location: job.job_city ? `${job.job_city}, ${job.job_state || job.job_country}` : location,
        salary: job.job_min_salary && job.job_max_salary 
          ? `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}`
          : job.job_salary || 'Competitive',
        description: job.job_description ? job.job_description.slice(0, 200) + '...' : 'Great opportunity to work with modern technologies.',
        url: job.job_apply_link || job.job_google_link || generateLinkedInJobURL(job.job_title, job.employer_name, location),
        linkedinUrl: generateLinkedInJobURL(job.job_title, job.employer_name, location),
        postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
        jobType: job.job_employment_type || 'Full-time',
        requirements: job.job_highlights?.Qualifications || [],
        benefits: job.job_highlights?.Benefits || [],
        isRealJob: true
      }));
    }

    console.warn('⚠️ No job data from API, using fallback');
    return getFallbackJobs(skills, location);
  } catch (error) {
    console.error('RapidAPI job search error:', error.message);
    return getFallbackJobs(skills, location);
  }
}

// Generate LinkedIn job search URL
function generateLinkedInJobURL(jobTitle, company, location) {
  const title = encodeURIComponent(jobTitle || 'software developer');
  const comp = encodeURIComponent(company || '');
  const loc = encodeURIComponent(location || 'India');
  return `https://www.linkedin.com/jobs/search/?keywords=${title}&location=${loc}&company=${comp}`;
}

// Fallback job data when API is unavailable
function getFallbackJobs(skills = [], location = 'India') {
  const skillNames = skills.map(skill => 
    typeof skill === 'string' ? skill : skill.name
  );
  
  // Indian job market focused fallback data
  const fallbackJobs = [
    {
      title: `${skillNames[0] || 'Software'} Developer`,
      company: 'Tata Consultancy Services (TCS)',
      location: 'Bangalore, India',
      salary: '₹8,00,000 - ₹15,00,000',
      description: 'Join our dynamic team building innovative solutions with modern technologies for global clients...',
      url: '#',
      linkedinUrl: generateLinkedInJobURL(`${skillNames[0] || 'Software'} Developer`, 'TCS', 'Bangalore'),
      postedDate: new Date().toISOString(),
      jobType: 'Full-time',
      requirements: skillNames.slice(0, 3),
      benefits: ['Health Insurance', 'Remote Work', 'PF'],
      isRealJob: false
    },
    {
      title: `Senior ${skillNames[1] || 'Frontend'} Engineer`,
      company: 'Infosys',
      location: 'Hyderabad, India',
      salary: '₹12,00,000 - ₹20,00,000',
      description: 'Lead frontend development for cutting-edge applications in our digital transformation projects...',
      url: '#',
      linkedinUrl: generateLinkedInJobURL(`Senior ${skillNames[1] || 'Frontend'} Engineer`, 'Infosys', 'Hyderabad'),
      postedDate: new Date().toISOString(),
      jobType: 'Full-time',
      requirements: skillNames.slice(1, 4),
      benefits: ['Stock Options', 'Flexible Hours', 'Learning Budget'],
      isRealJob: false
    },
    {
      title: `${skillNames[2] || 'Full Stack'} Developer`,
      company: 'Wipro',
      location: 'Pune, India',
      salary: '₹6,00,000 - ₹12,00,000',
      description: 'Build scalable web applications in our fast-paced development environment...',
      url: '#',
      linkedinUrl: generateLinkedInJobURL(`${skillNames[2] || 'Full Stack'} Developer`, 'Wipro', 'Pune'),
      postedDate: new Date().toISOString(),
      jobType: 'Full-time',
      requirements: skillNames.slice(0, 2),
      benefits: ['Equity', 'Casual Environment', 'Growth Opportunities'],
      isRealJob: false
    },
    {
      title: 'Python Developer',
      company: 'Tech Mahindra',
      location: 'Chennai, India',
      salary: '₹5,00,000 - ₹10,00,000',
      description: 'Work on AI/ML projects and backend development using Python and modern frameworks...',
      url: '#',
      linkedinUrl: generateLinkedInJobURL('Python Developer', 'Tech Mahindra', 'Chennai'),
      postedDate: new Date().toISOString(),
      jobType: 'Full-time',
      requirements: ['Python', 'Django', 'Flask'],
      benefits: ['Medical Insurance', 'Work from Home', 'Training Programs'],
      isRealJob: false
    }
  ];

  return fallbackJobs;
}

// Helper: parser selection with fallbacks
async function parseResumeContent({ buffer, mimetype, text, filename = 'resume.txt' }) {
  const provider = (process.env.RESUME_PARSER || '').toLowerCase();
  // Simple text handling for pasted resumes
  if (text && (!buffer || (mimetype && mimetype.startsWith('text/')))) {
    const sampleSkills = extractKeywords(text).slice(0, 12).map((k) => k.toUpperCase());
    return {
      personalInfo: { name: 'Candidate', email: '', phone: '', location: '' },
      summary: text.slice(0, 500),
      skills: sampleSkills.map((s) => ({ name: s, level: 60, category: 'Extracted' })),
      experience: [],
      education: [],
      rawText: text,
    };
  }
  // External providers (file uploads)
  if (buffer) {
    try {
      if (provider === 'affinda' && process.env.AFFINDA_API_KEY) {
        const data = await parseWithAffinda(buffer, filename);
        const d = data?.data || data;
        const skills = (d?.skills || []).map((s) => ({ name: s.name || s, level: 70, category: 'Parsed' }));
        const summary = d?.professionalSummary || d?.summary || '';
        return { personalInfo: d?.personalInfo || {}, summary, skills, experience: d?.workExperience || [], education: d?.education || [] };
      }
      if (provider === 'rchilli' && process.env.RCHILLI_USERKEY) {
        const d = await parseWithRChilli(buffer);
        const skills = (d?.ResumeParserData?.Skills?.Skill || []).map((s) => ({ name: s.SkillName || s, level: 70, category: 'Parsed' }));
        const summary = d?.ResumeParserData?.SegregatedExperience?.ExperienceSummary || '';
        return { personalInfo: d?.ResumeParserData?.PersonalInfo || {}, summary, skills, experience: [], education: [] };
      }
    } catch (e) {
      console.error('External parser error, falling back:', e.message || e);
    }
  }
  // Fallback simple structure
  const sampleSkills = ['JavaScript', 'React', 'CSS', 'Node.js', 'Express', 'MongoDB'];
  return {
    personalInfo: { name: 'Candidate', email: 'candidate@example.com', phone: '', location: '' },
    summary: (text && text.slice(0, 240)) || 'Experienced developer...',
    skills: sampleSkills.map((s) => ({ name: s, level: 70, category: 'Programming' })),
    experience: [],
    education: []
  };
}

function analyzeSkillsAgainstRoles(parsed) {
  const candidateSkills = new Set(
    (parsed.skills || []).map((s) => (typeof s === 'string' ? s : s.name))
  );
  const roleMatches = Object.entries(skillsMap).map(([title, requiredSkills]) => {
    const matched = requiredSkills.filter((s) => candidateSkills.has(s));
    const missing = requiredSkills.filter((s) => !candidateSkills.has(s));
    const matchScore = Math.round((matched.length / requiredSkills.length) * 100);
    return {
      title,
      company: '',
      matchScore,
      keySkillMatches: matched,
      missingSkills: missing,
      salary: ''
    };
  });
  // sort by matchScore desc and take top 3
  roleMatches.sort((a, b) => b.matchScore - a.matchScore);
  const top3 = roleMatches.slice(0, 3);

  // Build skill gaps from lowest matched roles
  const gaps = top3.map((r) => ({
    category: r.title,
    missing: r.missingSkills,
    recommendation: r.missingSkills.length
      ? `Focus on: ${r.missingSkills.slice(0, 3).join(', ')}`
      : 'Strong alignment'
  }));

  return { roleMatches: top3, skillGaps: gaps };
}

// Extract and categorize skills from analysis
function extractAndCategorizeSkills(analysisResult, geminiAnalysis) {
  const skillCategories = {
    'Programming': ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'typescript', 'swift', 'kotlin'],
    'Framework': ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'next.js', 'nuxt.js'],
    'Database': ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra', 'elasticsearch'],
    'Cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible'],
    'Tool': ['git', 'jenkins', 'jira', 'confluence', 'slack', 'figma', 'photoshop', 'illustrator'],
    'Technical': ['api', 'rest', 'graphql', 'microservices', 'devops', 'ci/cd', 'testing', 'agile', 'scrum']
  };

  const extractedSkills = [];
  const skills = analysisResult.skills || [];

  // Process skills from resume analysis
  skills.forEach(skill => {
    const skillName = typeof skill === 'string' ? skill : skill.name;
    const skillLevel = skill.level || 'Intermediate';
    
    if (!skillName) return;

    // Determine category
    let category = 'Other';
    const normalizedSkill = skillName.toLowerCase().trim();
    
    for (const [cat, keywords] of Object.entries(skillCategories)) {
      if (keywords.some(keyword => 
        normalizedSkill.includes(keyword) || keyword.includes(normalizedSkill)
      )) {
        category = cat;
        break;
      }
    }

    // Estimate experience years based on level and context
    let experienceYears = 1;
    if (skillLevel === 'Expert') experienceYears = 5;
    else if (skillLevel === 'Advanced') experienceYears = 3;
    else if (skillLevel === 'Intermediate') experienceYears = 2;

    extractedSkills.push({
      name: skillName,
      level: skillLevel,
      category,
      experienceYears,
      verified: false
    });
  });

  // Add skills from Gemini skill assessment if available
  if (geminiAnalysis?.skillAssessment?.skills) {
    geminiAnalysis.skillAssessment.skills.forEach(geminiSkill => {
      const existingSkill = extractedSkills.find(s => 
        s.name.toLowerCase() === geminiSkill.name?.toLowerCase()
      );

      if (!existingSkill && geminiSkill.name) {
        let category = 'Technical';
        const normalizedSkill = geminiSkill.name.toLowerCase().trim();
        
        for (const [cat, keywords] of Object.entries(skillCategories)) {
          if (keywords.some(keyword => 
            normalizedSkill.includes(keyword) || keyword.includes(normalizedSkill)
          )) {
            category = cat;
            break;
          }
        }

        extractedSkills.push({
          name: geminiSkill.name,
          level: geminiSkill.level || 'Intermediate',
          category,
          experienceYears: geminiSkill.experienceYears || 2,
          verified: true
        });
      }
    });
  }

  return extractedSkills;
}

// Enhanced Gemini analysis with comprehensive prompts
async function getGeminiAnalysis(parsedData) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.warn('Gemini API key not configured, using fallback analysis');
      return getFallbackAnalysis(parsedData);
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
You are a world-class ATS (Applicant Tracking System) and career advisor with 20+ years of experience in talent acquisition and career development. Analyze this resume comprehensively and provide detailed, actionable feedback.

RESUME DATA:
${JSON.stringify(parsedData, null, 2)}

Please provide a comprehensive analysis in the following JSON format (ensure valid JSON with no extra text):
{
  "atsScore": {
    "overall": <number 0-100>,
    "breakdown": {
      "skills": <number 0-100>,
      "experience": <number 0-100>, 
      "education": <number 0-100>,
      "resumeQuality": <number 0-100>,
      "marketFit": <number 0-100>,
      "formatting": <number 0-100>,
      "keywords": <number 0-100>
    }
  },
  "skillAssessment": {
    "strongSkills": ["skill1", "skill2", "skill3"],
    "developingSkills": ["skill1", "skill2"],
    "missingSkills": ["skill1", "skill2", "skill3"],
    "skillGaps": [
      {
        "category": "Technical Skills",
        "missing": ["skill1", "skill2"],
        "recommendation": "specific actionable advice with learning path",
        "priority": "high",
        "estimatedLearningTime": "2-3 months"
      }
    ]
  },
  "improvementSuggestions": [
    {
      "category": "skills",
      "suggestion": "specific improvement advice with concrete steps",
      "impact": "high",
      "difficulty": "medium",
      "estimatedTime": "1-2 months"
    }
  ],
  "courseSuggestions": [
    {
      "skill": "skill name",
      "title": "Complete Course Title",
      "provider": "Platform Name (Coursera, Udemy, etc)",
      "url": "https://example.com/course",
      "duration": "4-6 weeks",
      "level": "beginner/intermediate/advanced",
      "rating": 4.5,
      "price": "₹3,500 or Free"
    }
  ],
  "careerAnalysis": {
    "experienceLevel": "mid",
    "careerProgression": "detailed analysis of career growth trajectory",
    "industryFit": "assessment of industry alignment and potential",
    "salaryRange": "$80,000 - $120,000",
    "marketDemand": "high",
    "competitiveAdvantage": "what makes this candidate unique",
    "nextCareerSteps": ["step1", "step2", "step3"]
  },
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "overallFeedback": "comprehensive 3-4 sentence summary highlighting key strengths and critical improvement areas"
}

ANALYSIS GUIDELINES:
1. Be extremely detailed and specific in recommendations
2. Focus on actionable insights the candidate can implement immediately
3. Consider current market trends and industry demands
4. Provide realistic timelines for improvements
5. Be honest but constructive in feedback
6. Include specific skill gaps for the candidate's target roles
7. Consider both technical and soft skills
8. Evaluate resume formatting and ATS compatibility
9. Assess market competitiveness and positioning
10. Provide 5-8 relevant course suggestions with real platforms and pricing

COURSE SUGGESTIONS CRITERIA:
- Include courses from popular platforms (Coursera, Udemy, edX, Pluralsight, LinkedIn Learning)
- Focus on skills that will have the highest impact on career advancement
- Include a mix of beginner, intermediate, and advanced courses
- Provide realistic pricing and duration estimates
- Prioritize courses that address identified skill gaps

SCORING CRITERIA:
- Skills: Relevance, depth, market demand (0-100)
- Experience: Quality, progression, achievements (0-100)
- Education: Relevance, prestige, additional certifications (0-100)
- Resume Quality: Formatting, clarity, impact statements (0-100)
- Market Fit: Industry alignment, role suitability (0-100)
- Formatting: ATS compatibility, structure, readability (0-100)
- Keywords: Industry-relevant terms, optimization (0-100)

Provide only the JSON response, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean the response text to extract JSON
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonText = text.substring(jsonStart, jsonEnd);
      
      const parsed = JSON.parse(jsonText);
      
      // Validate the response structure
      if (!parsed.atsScore || !parsed.skillAssessment || !parsed.improvementSuggestions) {
        throw new Error('Invalid response structure from Gemini');
      }
      
      return parsed;
    } catch (parseError) {
      console.error('Gemini response parsing error:', parseError);
      console.log('Raw Gemini response:', text);
      return getFallbackAnalysis(parsedData);
    }
  } catch (err) {
    console.error('Gemini analysis error:', err);
    return getFallbackAnalysis(parsedData);
  }
}

// Comprehensive fallback analysis when Gemini fails
function getFallbackAnalysis(parsedData) {
  const skills = (parsedData.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const hasExperience = (parsedData.experience || []).length > 0;
  const hasEducation = (parsedData.education || []).length > 0;
  
  return {
    atsScore: {
      overall: 75,
      breakdown: {
        skills: skills.length > 5 ? 80 : 60,
        experience: hasExperience ? 75 : 50,
        education: hasEducation ? 80 : 60,
        resumeQuality: 70,
        marketFit: 75,
        formatting: 70,
        keywords: skills.length > 3 ? 75 : 55
      }
    },
    skillAssessment: {
      strongSkills: skills.slice(0, 3),
      developingSkills: skills.slice(3, 5),
      missingSkills: ['Communication', 'Leadership', 'Project Management'],
      skillGaps: [
        {
          category: 'Technical Skills',
          missing: ['Advanced Programming', 'Cloud Technologies'],
          recommendation: 'Focus on modern technologies and frameworks relevant to your field',
          priority: 'high',
          estimatedLearningTime: '3-6 months'
        }
      ]
    },
    improvementSuggestions: [
      {
        category: 'skills',
        suggestion: 'Add more relevant technical skills and certifications',
        impact: 'high',
        difficulty: 'medium',
        estimatedTime: '2-3 months'
      },
      {
        category: 'experience',
        suggestion: 'Include more quantifiable achievements and impact metrics',
        impact: 'high',
        difficulty: 'easy',
        estimatedTime: '1 week'
      }
    ],
    courseSuggestions: [
      {
        skill: 'JavaScript',
        title: 'The Complete JavaScript Course 2024: From Zero to Expert',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/the-complete-javascript-course/',
        duration: '8-10 weeks',
        level: 'beginner',
        rating: 4.7,
        price: '₹4,999'
      },
      {
        skill: 'React',
        title: 'React - The Complete Guide (incl Hooks, React Router, Redux)',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        duration: '12-16 weeks',
        level: 'intermediate',
        rating: 4.6,
        price: '₹6,499'
      },
      {
        skill: 'Node.js',
        title: 'Node.js, Express, MongoDB & More: The Complete Bootcamp',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
        duration: '10-12 weeks',
        level: 'intermediate',
        rating: 4.8,
        price: '₹5,799'
      },
      {
        skill: 'AWS',
        title: 'AWS Certified Solutions Architect - Associate',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/aws-cloud-solutions-architect',
        duration: '6-8 weeks',
        level: 'intermediate',
        rating: 4.5,
        price: '₹4,100/month'
      },
      {
        skill: 'Python',
        title: '100 Days of Code: The Complete Python Pro Bootcamp',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/100-days-of-code/',
        duration: '14-16 weeks',
        level: 'beginner',
        rating: 4.7,
        price: '₹7,099'
      }
    ],
    careerAnalysis: {
      experienceLevel: hasExperience ? 'mid' : 'entry',
      careerProgression: 'Good foundation with room for growth',
      industryFit: 'Strong potential in technology sector',
      salaryRange: '$60,000 - $90,000',
      marketDemand: 'high',
      competitiveAdvantage: 'Strong technical foundation',
      nextCareerSteps: ['Gain more experience', 'Build portfolio', 'Network in industry']
    },
    keywords: extractKeywords(parsedData.summary || '').slice(0, 10),
    overallFeedback: 'Strong foundation with good technical skills. Focus on gaining more experience and building a portfolio to stand out in the competitive market.'
  };
}

function extractKeywords(text = '') {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const stop = new Set(['and','or','with','the','a','an','to','in','for','on','of']);
  const freq = new Map();
  for (const t of tokens) {
    if (stop.has(t) || t.length < 2) continue;
    freq.set(t, (freq.get(t) || 0) + 1);
  }
  return Array.from(freq.entries()).sort((a,b)=>b[1]-a[1]).slice(0,50).map(([k])=>k);
}

function suggestCourses(missingSkills = []) {
  if (!missingSkills || missingSkills.length === 0) {
    return [
      {
        skill: 'JavaScript',
        title: 'The Complete JavaScript Course 2024: From Zero to Expert',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/the-complete-javascript-course/',
        duration: '8-10 weeks',
        level: 'beginner',
        rating: 4.7,
        price: '₹4,999'
      }
    ];
  }
  
  const coursePlatforms = ['Udemy', 'Coursera', 'edX', 'Pluralsight', 'LinkedIn Learning'];
  const basePrices = [3999, 4499, 2999, 5999, 3499]; // INR prices
  
  return missingSkills.slice(0, 5).map((skill, index) => ({
    skill,
    title: `Complete ${skill} Course - From Beginner to Professional`,
    provider: coursePlatforms[index % coursePlatforms.length],
    url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
    duration: `${4 + index * 2}-${6 + index * 2} weeks`,
    level: index < 2 ? 'beginner' : index < 4 ? 'intermediate' : 'advanced',
    rating: Math.round((4.3 + (Math.random() * 0.7)) * 10) / 10,
    price: index % 2 === 0 ? `₹${basePrices[index % basePrices.length].toLocaleString()}` : 'Free'
  }));
}

exports.analyzeResume = catchAsync(async (req, res) => {
  // Accept either uploaded file (multer) or raw text (req.body.text)
  const file = req.file;
  const text = req.body?.text;
  if (!file && !text) {
    return res.status(400).json({ success: false, message: 'Provide a file or text' });
  }

  // Parse resume using external services or local parsing
  const parserService = new ExternalParserService();
  const parsedData = await parserService.parseResume(
    file?.buffer,
    file?.mimetype,
    file?.originalname || 'resume.txt'
  );

  // If text was provided instead of file, add it to parsed data
  if (text && !file) {
    parsedData.summary = text;
    parsedData.skills = parserService.extractSkills(text);
  }

  // Get comprehensive Gemini analysis
  const geminiAnalysis = await getGeminiAnalysis(parsedData);

  // Find matching jobs using RapidAPI and local analysis
  const candidateSkills = (parsedData.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const location = parsedData.personalInfo?.location || 'United States';
  
  // Get real job matches from RapidAPI
  const jobMatches = await searchJobsWithRapidAPI(candidateSkills, location);
  console.log(`🔍 Found ${jobMatches.length} job matches for skills: ${candidateSkills.slice(0, 3).join(', ')}`);
  console.log(`📍 Location: ${location}`);

  // Analyze skills against predefined roles
  const { roleMatches, skillGaps } = analyzeSkillsAgainstRoles(parsedData);

  // Combine Gemini analysis with local analysis
  const atsScore = geminiAnalysis?.atsScore || {
    overall: Math.round(roleMatches[0]?.matchScore || 75),
    breakdown: {
      skills: 75,
      experience: 70,
      education: 80,
      resumeQuality: 70,
      marketFit: roleMatches[0]?.matchScore || 70,
      formatting: 70,
      keywords: 65
    }
  };

  const improvementSuggestions = geminiAnalysis?.improvementSuggestions || [
    {
      category: 'skills',
      suggestion: 'Consider adding more relevant technical skills',
      impact: 'high',
      difficulty: 'medium',
      estimatedTime: '2-3 months'
    }
  ];

  const keywords = geminiAnalysis?.keywords || extractKeywords(text || parsedData.summary || '');
  const courseSuggestions = geminiAnalysis?.courseSuggestions || suggestCourses(geminiAnalysis?.skillAssessment?.missingSkills || []);

  // Create comprehensive analysis result
  const analysisResult = {
    ...parsedData,
    atsScore,
    jobMatches,
    roleMatches,
    skillGaps: geminiAnalysis?.skillAssessment?.skillGaps || skillGaps,
    improvementSuggestions,
    keywords: keywords.slice(0, 20),
    courseSuggestions,
    careerAnalysis: geminiAnalysis?.careerAnalysis,
    overallFeedback: geminiAnalysis?.overallFeedback,
    analysisVersion: '2.0',
    extractionMethod: parsedData.extractionMethod || 'local',
    parsed: true,
    // Added for frontend backward compatibility with existing components expecting these fields
    overallScore: atsScore?.overall,
    fileName: file?.originalname || 'text-input'
  };

  // Optional: upload original file to Cloudinary (raw) for later retrieval
  let uploadedFileUrl = null;
  if (file && configureCloudinary()) {
    try {
      const up = await uploadBuffer(file.buffer, file.originalname);
      uploadedFileUrl = up.secure_url;
      analysisResult.originalFileUrl = uploadedFileUrl;
    } catch (e) {
      console.error('Cloudinary upload failed:', e.message || e);
    }
  }

  // Store analysis in MongoDB with enhanced data
  try {
    const resumeAnalysis = new ResumeAnalysis({
      userId: req.user?.id,
      originalFileName: file?.originalname || 'text-input',
      fileType: file?.mimetype || 'text/plain',
      originalFileUrl: uploadedFileUrl,
      personalInfo: analysisResult.personalInfo,
      summary: analysisResult.summary,
      rawText: parsedData.rawText || text || '',
      skills: analysisResult.skills,
      experience: analysisResult.experience,
      education: analysisResult.education,
      certifications: analysisResult.certifications || [],
      projects: analysisResult.projects || [],
      atsScore: analysisResult.atsScore,
      jobMatches: analysisResult.jobMatches,
      skillGaps: analysisResult.skillGaps,
      improvementSuggestions: analysisResult.improvementSuggestions,
      courseSuggestions: analysisResult.courseSuggestions,
      careerAnalysis: analysisResult.careerAnalysis,
      skillAssessment: geminiAnalysis?.skillAssessment,
      overallFeedback: analysisResult.overallFeedback,
      keywords: analysisResult.keywords,
      analysisVersion: analysisResult.analysisVersion,
      extractionMethod: analysisResult.extractionMethod,
      extractionMetadata: parsedData.extractionMetadata || {},
      processed: true
    });
    
    const savedAnalysis = await resumeAnalysis.save();
    analysisResult.analysisId = savedAnalysis._id;

    // Extract and store user skills in UserSkills collection
    if (req.user?.id) {
      try {
        const extractedSkills = extractAndCategorizeSkills(analysisResult, geminiAnalysis);
        
        if (extractedSkills.length > 0) {
          await UserSkills.createOrUpdate(req.user.id, extractedSkills, savedAnalysis._id);
          console.log(`💼 Stored ${extractedSkills.length} skills for user ${req.user.id}`);
          
          // Add skills summary to analysis result
          analysisResult.skillsSummary = {
            totalSkills: extractedSkills.length,
            categories: extractedSkills.reduce((acc, skill) => {
              acc[skill.category] = (acc[skill.category] || 0) + 1;
              return acc;
            }, {}),
            topSkills: extractedSkills
              .sort((a, b) => {
                const levelWeight = { 'Expert': 4, 'Advanced': 3, 'Intermediate': 2, 'Beginner': 1 };
                return (levelWeight[b.level] || 1) - (levelWeight[a.level] || 1);
              })
              .slice(0, 5)
              .map(s => s.name)
          };
        }
      } catch (skillError) {
        console.error('❌ Failed to store user skills:', skillError);
      }
    }

    // Persist latestAnalysisId on user for quick retrieval
    if (req.user && req.user.id) {
      try {
        const User = require('../models/User');
        await User.findByIdAndUpdate(req.user.id, { latestAnalysisId: savedAnalysis._id });
      } catch (e) {
        console.error('Failed to update latestAnalysisId on user:', e.message || e);
      }
    }
    
    console.log(`✅ Analysis saved successfully for user ${req.user?.id || 'anonymous'} with ID: ${savedAnalysis._id}`);
    console.log(`📊 ATS Score: ${analysisResult.atsScore?.overall || 'N/A'}`);
    console.log(`🔍 Job Matches Found: ${analysisResult.jobMatches?.length || 0}`);
    console.log(`💡 Skills Identified: ${analysisResult.skills?.length || 0}`);
  } catch (dbError) {
    console.error('❌ Database save error:', dbError);
    console.error('Error details:', dbError.message);
    // Continue without failing the analysis, but log the error
    analysisResult.dbSaveError = true;
    analysisResult.dbError = dbError.message;
  }

  return res.json({ success: true, data: analysisResult });
});

// Get job matches for a specific analysis
exports.getJobMatches = catchAsync(async (req, res) => {
  const { analysisId } = req.params;
  
  if (!analysisId) {
    return res.status(400).json({ success: false, message: 'Analysis ID is required' });
  }

  try {
    const analysis = await ResumeAnalysis.findById(analysisId);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    // Extract skills for job search
    const skills = analysis.skills || [];
    const location = analysis.personalInfo?.location || 'United States';

    // Search for jobs using RapidAPI
    const jobMatches = await searchJobsWithRapidAPI(skills, location);

    // Update the analysis with fresh job matches
    analysis.jobMatches = jobMatches;
    analysis.lastJobSearchUpdate = new Date();
    await analysis.save();

    return res.json({ 
      success: true, 
      data: {
        jobMatches,
        skills: skills.map(skill => typeof skill === 'string' ? skill : skill.name),
        location,
        lastUpdated: analysis.lastJobSearchUpdate
      }
    });
  } catch (error) {
    console.error('Job matches fetch error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch job matches',
      error: error.message 
    });
  }
});

// Calculate skill match score between user skills and job requirements
function calculateSkillMatchScore(userSkills, jobRequirements, jobTitle, jobDescription) {
  if (!userSkills || userSkills.length === 0) return 0;
  
  const normalizeSkill = (skill) => {
    return (typeof skill === 'string' ? skill : skill.name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '');
  };

  const normalizedUserSkills = userSkills.map(skill => ({
    name: normalizeSkill(skill),
    level: skill.level || 'Intermediate',
    category: skill.category || 'Technical',
    experienceYears: skill.experienceYears || 1,
    original: skill
  }));

  // Combine job requirements, title and description for matching
  const jobText = [
    ...(jobRequirements || []),
    jobTitle || '',
    jobDescription || ''
  ].join(' ').toLowerCase();

  let totalScore = 0;
  let maxPossibleScore = 0;
  const matchedSkills = [];
  const missingSkills = [];

  // Weight factors
  const levelWeights = { 'Expert': 4, 'Advanced': 3, 'Intermediate': 2, 'Beginner': 1 };
  const categoryWeights = { 'Programming': 1.3, 'Framework': 1.2, 'Technical': 1.1, 'Database': 1.1 };

  normalizedUserSkills.forEach(userSkill => {
    maxPossibleScore += 10; // Each skill has max 10 points

    const skillInJob = jobText.includes(userSkill.name) || 
                      userSkill.name.split(' ').some(word => word.length > 2 && jobText.includes(word));

    if (skillInJob) {
      let skillScore = 6; // Base score for skill match
      skillScore += (levelWeights[userSkill.level] || 2); // Level bonus
      skillScore *= (categoryWeights[userSkill.category] || 1); // Category multiplier
      skillScore = Math.min(skillScore, 10); // Cap at 10
      
      totalScore += skillScore;
      matchedSkills.push(userSkill.original.name || userSkill.name);
    }
  });

  // Look for commonly required skills not in user's skillset
  const commonRequiredSkills = ['javascript', 'python', 'java', 'react', 'node.js', 'sql', 'git', 'aws'];
  commonRequiredSkills.forEach(reqSkill => {
    if (jobText.includes(reqSkill)) {
      const hasSkill = normalizedUserSkills.some(userSkill => 
        userSkill.name.includes(reqSkill) || reqSkill.includes(userSkill.name)
      );
      if (!hasSkill) {
        missingSkills.push(reqSkill);
      }
    }
  });

  // Calculate final score as percentage
  const matchScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  
  return {
    matchScore: Math.min(matchScore, 95), // Cap at 95% to be realistic
    matchedSkills: [...new Set(matchedSkills)], // Remove duplicates
    missingSkills: [...new Set(missingSkills)],
    totalUserSkills: normalizedUserSkills.length,
    skillsMatched: matchedSkills.length
  };
}

// Enhanced job matching with skill-based scoring and sorting
async function getSkillBasedJobMatches(userId) {
  try {
    // Get user skills from UserSkills collection
    const userSkills = await UserSkills.findByUserId(userId);
    let skillsList = [];
    
    if (userSkills && userSkills.skills.length > 0) {
      skillsList = userSkills.skills;
      console.log(`👤 Found ${skillsList.length} skills for user ${userId}`);
    } else {
      // Fallback to latest analysis
      console.log(`🔍 No UserSkills found, checking latest analysis for user ${userId}`);
      const User = require('../models/User');
      const user = await User.findById(userId);
      
      if (user?.latestAnalysisId) {
        const analysis = await ResumeAnalysis.findById(user.latestAnalysisId);
        if (analysis?.skills) {
          skillsList = analysis.skills.map(skill => ({
            name: typeof skill === 'string' ? skill : skill.name,
            level: skill.level || 'Intermediate',
            category: 'Technical',
            experienceYears: 2
          }));
        }
      }
    }

    if (skillsList.length === 0) {
      console.log('⚠️ No skills found, using sample skills');
      skillsList = [
        { name: 'JavaScript', level: 'Intermediate', category: 'Programming', experienceYears: 2 },
        { name: 'React', level: 'Intermediate', category: 'Framework', experienceYears: 2 },
        { name: 'Node.js', level: 'Intermediate', category: 'Framework', experienceYears: 1 }
      ];
    }

    // Get location from latest analysis or default
    let location = 'India';
    try {
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (user?.latestAnalysisId) {
        const analysis = await ResumeAnalysis.findById(user.latestAnalysisId);
        location = analysis?.personalInfo?.location || 'India';
      }
    } catch (e) {
      console.log('Could not get location, using default:', e.message);
    }

    // Search for jobs using top skills
    const topSkills = skillsList
      .sort((a, b) => {
        const levelWeight = { 'Expert': 4, 'Advanced': 3, 'Intermediate': 2, 'Beginner': 1 };
        return (levelWeight[b.level] || 1) - (levelWeight[a.level] || 1);
      })
      .slice(0, 5);

    const jobMatches = await searchJobsWithRapidAPI(topSkills, location);

    // Calculate match scores for each job and sort by relevance
    const jobsWithScores = jobMatches.map(job => {
      const matchData = calculateSkillMatchScore(
        skillsList, 
        job.requirements || [], 
        job.title, 
        job.description
      );

      return {
        ...job,
        matchScore: matchData.matchScore,
        keySkillMatches: matchData.matchedSkills,
        missingSkills: matchData.missingSkills,
        skillsMatched: matchData.skillsMatched,
        totalUserSkills: matchData.totalUserSkills,
        matchQuality: matchData.matchScore >= 70 ? 'High' : 
                     matchData.matchScore >= 50 ? 'Medium' : 'Low'
      };
    });

    // Sort by match score (highest first)
    jobsWithScores.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    console.log(`🎯 Processed ${jobsWithScores.length} jobs with skill matching`);
    console.log(`📊 Average match score: ${Math.round(jobsWithScores.reduce((sum, job) => sum + (job.matchScore || 0), 0) / jobsWithScores.length) || 0}%`);

    return {
      jobMatches: jobsWithScores,
      userSkills: skillsList,
      location,
      matchingStats: {
        totalJobs: jobsWithScores.length,
        highMatches: jobsWithScores.filter(j => j.matchScore >= 70).length,
        mediumMatches: jobsWithScores.filter(j => j.matchScore >= 50 && j.matchScore < 70).length,
        lowMatches: jobsWithScores.filter(j => j.matchScore < 50).length,
        averageScore: Math.round(jobsWithScores.reduce((sum, job) => sum + (job.matchScore || 0), 0) / jobsWithScores.length) || 0
      }
    };

  } catch (error) {
    console.error('Error in getSkillBasedJobMatches:', error);
    throw error;
  }
}

// Get all job matches for the current user's latest analysis
exports.getCurrentUserJobMatches = catchAsync(async (req, res) => {
  try {
    let userId = req.user?.id;
    
    // If no user authentication, try to find any recent analysis
    if (!userId || process.env.SKIP_AUTH === 'true') {
      console.log('🔍 No authenticated user, searching for recent analysis...');
      const recentAnalysis = await ResumeAnalysis.findOne().sort({createdAt: -1});
      if (recentAnalysis) {
        console.log(`📋 Found recent analysis: ${recentAnalysis._id}`);
        
        // Use temporary user ID for skill matching
        const tempUserId = recentAnalysis.userId || 'temp';
        try {
          const skillBasedResults = await getSkillBasedJobMatches(tempUserId);
          return res.json({ 
            success: true, 
            data: {
              ...skillBasedResults,
              analysisId: recentAnalysis._id,
              lastUpdated: new Date(),
              source: 'recent_analysis_with_skills'
            }
          });
        } catch (skillError) {
          console.log('Skill-based matching failed, falling back to simple matching');
          // Fallback to original logic
          const skills = recentAnalysis.skills || [];
          const location = recentAnalysis.personalInfo?.location || 'India';
          const jobMatches = await searchJobsWithRapidAPI(skills, location);
          
          return res.json({ 
            success: true, 
            data: {
              jobMatches,
              analysisId: recentAnalysis._id,
              skills: skills.map(skill => typeof skill === 'string' ? skill : skill.name),
              location,
              lastUpdated: new Date(),
              source: 'recent_analysis'
            }
          });
        }
      }
      
      // If no analysis found, create sample job matches with skill scoring
      console.log('🎯 No analysis found, creating sample job matches with skill scoring...');
      const sampleSkills = [
        { name: 'JavaScript', level: 'Intermediate', category: 'Programming', experienceYears: 2 },
        { name: 'React', level: 'Intermediate', category: 'Framework', experienceYears: 2 },
        { name: 'Node.js', level: 'Beginner', category: 'Framework', experienceYears: 1 },
        { name: 'Python', level: 'Advanced', category: 'Programming', experienceYears: 3 },
        { name: 'Java', level: 'Intermediate', category: 'Programming', experienceYears: 2 }
      ];
      
      const jobMatches = await searchJobsWithRapidAPI(sampleSkills, 'India');
      
      // Add skill matching to sample jobs
      const jobsWithScores = jobMatches.map(job => {
        const matchData = calculateSkillMatchScore(
          sampleSkills, 
          job.requirements || [], 
          job.title, 
          job.description
        );

        return {
          ...job,
          matchScore: matchData.matchScore,
          keySkillMatches: matchData.matchedSkills,
          missingSkills: matchData.missingSkills
        };
      });

      // Sort by match score
      jobsWithScores.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      return res.json({ 
        success: true, 
        data: {
          jobMatches: jobsWithScores,
          userSkills: sampleSkills,
          analysisId: null,
          location: 'India',
          lastUpdated: new Date(),
          source: 'sample_data_with_skills',
          matchingStats: {
            totalJobs: jobsWithScores.length,
            averageScore: Math.round(jobsWithScores.reduce((sum, job) => sum + (job.matchScore || 0), 0) / jobsWithScores.length) || 0
          }
        }
      });
    }

    // Authenticated user - use skill-based matching
    const skillBasedResults = await getSkillBasedJobMatches(userId);
    
    return res.json({ 
      success: true, 
      data: {
        ...skillBasedResults,
        lastUpdated: new Date(),
        source: 'user_skills_based'
      }
    });

  } catch (error) {
    console.error('Current user job matches error:', error);
    
    // Ultimate fallback with basic sample data
    const fallbackJobs = getFallbackJobs().map((job, index) => ({
      ...job,
      matchScore: Math.max(30, 90 - (index * 8)), // Decreasing scores
      keySkillMatches: ['JavaScript', 'React'].slice(0, Math.max(1, 3 - index)),
      missingSkills: ['AWS', 'Docker'].slice(0, index + 1)
    }));

    return res.json({ 
      success: true, 
      data: {
        jobMatches: fallbackJobs,
        userSkills: [{ name: 'JavaScript', level: 'Intermediate' }],
        location: 'India',
        lastUpdated: new Date(),
        source: 'fallback_with_scores',
        error: 'Partial functionality - some features may be limited'
      }
    });
  }
});
