const http = require('http');

function testAPI(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

async function runTests() {
  try {
    console.log('Testing API endpoints...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await testAPI('/api/health');
    console.log('Health check:', health);
    
    // Test dashboard endpoint
    console.log('\n2. Testing dashboard endpoint...');
    const dashboard = await testAPI('/api/analysis/dashboard');
    console.log('Dashboard data:', dashboard);
    
    // Test getting all analyses
    console.log('\n3. Testing get all analyses...');
    const analyses = await testAPI('/api/analysis');
    console.log('All analyses:', analyses);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

runTests();