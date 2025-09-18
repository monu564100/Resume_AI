const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiAPI() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Testing Gemini API with key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT SET');
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('Testing basic Gemini API call...');
    const prompt = 'Hello, can you respond with a simple JSON object containing the message "API is working"?';
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini API Response:', text);
    console.log('✅ Gemini API is working correctly!');
    
    return true;
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

async function testResumeAnalysis() {
  try {
    console.log('\n--- Testing Resume Analysis with Gemini ---');
    
    const sampleResumeData = {
      personalInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        location: 'San Francisco, CA'
      },
      summary: 'Experienced software developer with 5 years of experience in web development using JavaScript, React, and Node.js.',
      skills: [
        { name: 'JavaScript', level: 85, category: 'Programming' },
        { name: 'React', level: 80, category: 'Frontend' },
        { name: 'Node.js', level: 75, category: 'Backend' }
      ],
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Developer',
          startDate: '2020-01',
          endDate: 'Present',
          description: 'Lead frontend development team'
        }
      ],
      education: [
        {
          institution: 'University of California',
          degree: 'Bachelor of Computer Science',
          field: 'Computer Science',
          endDate: '2019'
        }
      ]
    };

    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
You are a world-class ATS (Applicant Tracking System) and career advisor. Analyze this resume and provide detailed feedback.

RESUME DATA:
${JSON.stringify(sampleResumeData, null, 2)}

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
        "recommendation": "specific actionable advice",
        "priority": "high",
        "estimatedLearningTime": "2-3 months"
      }
    ]
  },
  "improvementSuggestions": [
    {
      "category": "skills",
      "suggestion": "specific improvement advice",
      "impact": "high",
      "difficulty": "medium",
      "estimatedTime": "1-2 months"
    }
  ],
  "careerAnalysis": {
    "experienceLevel": "mid",
    "careerProgression": "analysis of career growth",
    "industryFit": "assessment of industry alignment",
    "salaryRange": "$80,000 - $120,000",
    "marketDemand": "high",
    "competitiveAdvantage": "what makes this candidate unique",
    "nextCareerSteps": ["step1", "step2", "step3"]
  },
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "overallFeedback": "comprehensive summary highlighting strengths and areas for improvement"
}

Provide only the JSON response, no additional text.`;

    console.log('Sending resume analysis request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini Response:');
    console.log(text);
    
    // Try to parse the JSON
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonText = text.substring(jsonStart, jsonEnd);
      
      const parsed = JSON.parse(jsonText);
      console.log('\n✅ Successfully parsed Gemini response!');
      console.log('Overall ATS Score:', parsed.atsScore?.overall);
      console.log('Strong Skills:', parsed.skillAssessment?.strongSkills?.join(', '));
      console.log('Missing Skills:', parsed.skillAssessment?.missingSkills?.join(', '));
      
      return true;
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini JSON response:', parseError.message);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Resume analysis test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('=== Gemini API Integration Tests ===\n');
  
  const basicTest = await testGeminiAPI();
  if (!basicTest) {
    console.log('Basic API test failed. Please check your API key configuration.');
    return;
  }
  
  const resumeTest = await testResumeAnalysis();
  if (!resumeTest) {
    console.log('Resume analysis test failed. The API is working but response parsing needs improvement.');
    return;
  }
  
  console.log('\n🎉 All tests passed! Gemini API integration is working correctly.');
}

runTests();