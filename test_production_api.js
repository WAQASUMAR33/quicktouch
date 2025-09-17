// Test script for local API
const http = require('http');

const testData = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'player',
  academyId: 'academy-main-campus'
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users/test',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing production API endpoint...');
console.log('📤 Sending data:', testData);

const req = http.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 Response:', data);
    
    if (res.statusCode === 201) {
      console.log('✅ API test successful!');
    } else {
      console.log('❌ API test failed!');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();
