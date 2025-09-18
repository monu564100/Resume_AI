const axios = require('axios');

async function testResumeAnalysis() {
  try {
    console.log('🧪 Testing Resume Analysis API...');
    
    // Test with text input
    const testData = {
      text: `
        John Doe
        Software Engineer
        
        Experience:
        - 3 years as Full Stack Developer at TechCorp
        - JavaScript, React, Node.js, MongoDB
        - Led team of 5 developers
        
        Skills:
        - JavaScript, TypeScript, React, Node.js
        - MongoDB, PostgreSQL
        - AWS, Docker, Kubernetes
        - Team Leadership, Project Management
        
        Education:
        Bachelor of Computer Science, XYZ University (2019)
      `
    };

    console.log('📤 Sending request to /api/analyze...');
    
    const response = await axios.post('http://localhost:5000/api/analyze', testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Response Status:', response.status);
    console.log('📋 Response Data Keys:', Object.keys(response.data));
    
    if (response.data.success) {
      console.log('🎉 Analysis successful!');
      console.log('📊 Analysis ID:', response.data.analysisId);
      console.log('🔍 Skills Found:', response.data.analysis.skills?.length || 0);
      console.log('💼 Job Matches:', response.data.analysis.jobMatches?.length || 0);
      console.log('🎯 Career Level:', response.data.analysis.careerAnalysis?.level);
      
      if (response.data.analysis.jobMatches?.length > 0) {
        console.log('🏢 Sample Job Match:', response.data.analysis.jobMatches[0].title);
      }
    } else {
      console.log('❌ Analysis failed:', response.data.error);
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    console.error('🔍 Error Details:', error);
    if (error.response) {
      console.error('📤 Response Status:', error.response.status);
      console.error('📝 Response Data:', error.response.data);
    }
    if (error.code) {
      console.error('🚨 Error Code:', error.code);
    }
  }
}

// Run the test
testResumeAnalysis();