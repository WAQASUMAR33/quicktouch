// Test signup with detailed email logging
const http = require('http');

async function testSignupWithEmail() {
  console.log('🧪 Testing Signup with Email Verification...\n');

  const testUser = {
    fullName: 'Test User ' + Date.now(),
    email: 'theitxprts@gmail.com', // Send to your actual email
    password: 'password123',
    role: 'player',
    academyId: 'academy-main-campus'
  };

  console.log('📤 Sending signup request with email:', testUser.email);

  try {
    const response = await makeRequest('POST', '/api/users', testUser);
    console.log(`📊 Response Status: ${response.statusCode}`);
    console.log(`📥 Response Body: ${response.body}`);
    
    if (response.statusCode === 201) {
      const data = JSON.parse(response.body);
      console.log('✅ User created successfully!');
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Message: ${data.message}`);
      console.log('\n📧 Check your Gmail inbox for the verification email!');
      console.log('   If you don\'t see it, check your Spam/Junk folder.');
    } else {
      console.log('❌ Signup failed');
      console.log('   Response:', response.body);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

testSignupWithEmail();


