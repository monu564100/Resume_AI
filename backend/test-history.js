const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/analysis/history',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer dummy-token',
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => console.error('Error:', e));
req.end();