// Test email verification endpoint
const http = require('http');

async function testEmailVerification() {
  console.log('🧪 Testing Email Verification Endpoint...\n');

  // Test with a sample verification token
  const testToken = 'test-verification-token-123';
  const verificationUrl = `/api/users/verify?token=${testToken}`;

  console.log(`📤 Testing verification URL: ${verificationUrl}`);

  try {
    const response = await makeRequest('GET', verificationUrl);
    console.log(`📊 Response Status: ${response.statusCode}`);
    console.log(`📥 Response Body: ${response.body}`);
    
    if (response.statusCode === 200) {
      console.log('✅ Email verification endpoint is working!');
    } else {
      console.log('ℹ️ Verification endpoint responded (this is expected for test token)');
    }
  } catch (error) {
    console.log('❌ Error testing verification:', error.message);
  }

  console.log('\n📧 Email Verification Process:');
  console.log('1. User registers on signup page');
  console.log('2. System sends verification email with unique token');
  console.log('3. User clicks verification link in email');
  console.log('4. System verifies token and activates account');
  console.log('5. User can now login with verified account');
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

testEmailVerification();


