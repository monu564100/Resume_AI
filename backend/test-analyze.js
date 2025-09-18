const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

function testAnalyzeEndpoint() {
  return new Promise((resolve, reject) => {
    // Create a test text resume
    const testResume = `John Doe
Software Developer
john.doe@email.com
+1-555-0123
San Francisco, CA

SUMMARY
Experienced software developer with 5+ years of experience in web development using JavaScript, React, Node.js, and Python. Passionate about creating scalable applications and solving complex problems.

SKILLS
• Programming Languages: JavaScript, Python, TypeScript, Java
• Frontend: React, Angular, HTML5, CSS3, Bootstrap
• Backend: Node.js, Express.js, Django, REST APIs
• Databases: MongoDB, PostgreSQL, MySQL
• Cloud: AWS, Docker, Kubernetes
• Tools: Git, Jenkins, JIRA

EXPERIENCE
Senior Software Developer - TechCorp Inc.
January 2020 - Present
• Led development of customer-facing web applications serving 100k+ users
• Implemented microservices architecture reducing response time by 40%
• Mentored junior developers and conducted code reviews

Software Developer - StartupXYZ
June 2018 - December 2019
• Developed full-stack web applications using React and Node.js
• Collaborated with cross-functional teams in agile environment
• Implemented automated testing increasing code coverage by 60%

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley
2014 - 2018
GPA: 3.8/4.0`;

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/analyze-resume',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer dummy-token',
        'Content-Type': 'application/json'
      }
    };

    const postData = JSON.stringify({
      text: testResume
    });

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('Status:', res.statusCode);
          console.log('Analysis Result:');
          console.log('- Success:', jsonData.success);
          console.log('- ATS Score:', jsonData.data?.atsScore?.overall);
          console.log('- Skills Found:', jsonData.data?.skills?.length);
          console.log('- Job Matches:', jsonData.data?.jobMatches?.length);
          console.log('- Extraction Method:', jsonData.data?.extractionMethod);
          
          if (jsonData.data?.atsScore) {
            console.log('- Score Breakdown:', JSON.stringify(jsonData.data.atsScore.breakdown, null, 2));
          }
          
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          console.log('Raw response:', data);
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => {
      console.error('Request error:', e);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTest() {
  try {
    console.log('Testing resume analysis endpoint...\n');
    const result = await testAnalyzeEndpoint();
    
    if (result.status === 200 && result.data.success) {
      console.log('\n✅ Resume analysis is working!');
    } else {
      console.log('\n❌ Resume analysis failed');
      console.log('Response:', JSON.stringify(result.data, null, 2));
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest();