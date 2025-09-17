// Test the actual signup process to see if emails are being sent
const http = require('http');

async function testActualSignupProcess() {
  console.log('🧪 Testing Actual Signup Process...\n');

  const newUser = {
    fullName: 'Test User Verification',
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    role: 'player',
    academyId: 'academy-main-campus'
  };

  console.log('📤 Creating account with verification email...');
  console.log(`   Name: ${newUser.fullName}`);
  console.log(`   Email: ${newUser.email}`);

  try {
    const response = await makeRequest('POST', '/api/users', newUser);
    console.log(`\n📊 Response Status: ${response.statusCode}`);
    
    if (response.statusCode === 201) {
      const data = JSON.parse(response.body);
      console.log('✅ Account created successfully!');
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Message: ${data.message}`);
      
      console.log('\n📧 Verification Email Details:');
      console.log('   ✅ Email should have been sent to: theitxprts786@gmail.com');
      console.log('   📧 Subject: "Verify Your Email - Quick Touch Academy"');
      console.log('   🔗 Should contain verification link');
      console.log('   📬 Check inbox and spam folder');
      
      // Extract verification token from the response (if available)
      if (data.user.verificationToken) {
        const verificationUrl = `http://localhost:3000/api/users/verify?token=${data.user.verificationToken}`;
        console.log(`\n🔗 Verification URL: ${verificationUrl}`);
      }
      
    } else {
      console.log('❌ Account creation failed');
      console.log('   Response:', response.body);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n📝 Note: Check the server console for any email sending errors.');
  console.log('   The server logs will show if emails are being sent successfully.');
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

testActualSignupProcess();
