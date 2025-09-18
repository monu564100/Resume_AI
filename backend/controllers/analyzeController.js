const { GoogleGenerativeAI } = require('@google/generative-ai');
const { catchAsync } = require('../utils/catchAsync');
const skillsMap = require('../utils/skillsMap');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const ExternalParserService = require('../services/externalParserService');
const JobsService = require('../services/jobsService');

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
  const base = 'https://www.coursera.org/search?query=';
  return missingSkills.slice(0, 5).map((skill) => ({
    skill,
    title: `${skill} Fundamentals`,
    url: `${base}${encodeURIComponent(skill)}`
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

  // Find matching jobs using JobsService
  const jobsService = new JobsService();
  const candidateSkills = (parsedData.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const jobMatches = await jobsService.findMatchingJobs(candidateSkills);

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
  const courseSuggestions = suggestCourses(geminiAnalysis?.skillAssessment?.missingSkills || []);

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
    parsed: true
  };

  // Store analysis in MongoDB with enhanced data
  try {
    const resumeAnalysis = new ResumeAnalysis({
      userId: req.user?.id,
      originalFileName: file?.originalname || 'text-input',
      fileType: file?.mimetype || 'text/plain',
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
