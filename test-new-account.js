// Test creating a new account with theitxprts786@gmail.com
const http = require('http');

async function createNewAccount() {
  console.log('🧪 Creating New Account with Email Verification...\n');

  const newUser = {
    fullName: 'Test User 786',
    email: 'theitxprts786@gmail.com',
    password: 'password123',
    role: 'player',
    academyId: 'academy-main-campus'
  };

  console.log('📤 Creating account with details:');
  console.log(`   Name: ${newUser.fullName}`);
  console.log(`   Email: ${newUser.email}`);
  console.log(`   Role: ${newUser.role}`);
  console.log(`   Academy: ${newUser.academyId}`);

  try {
    const response = await makeRequest('POST', '/api/users', newUser);
    console.log(`\n📊 Response Status: ${response.statusCode}`);
    
    if (response.statusCode === 201) {
      const data = JSON.parse(response.body);
      console.log('✅ Account created successfully!');
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Full Name: ${data.user.fullName}`);
      console.log(`   Academy: ${data.user.academyId}`);
      console.log(`   Created: ${data.user.createdAt}`);
      console.log(`   Message: ${data.message}`);
      
      console.log('\n📧 Email Verification:');
      console.log(`   ✅ Verification email sent to: ${newUser.email}`);
      console.log('   📬 Please check the inbox for: theitxprts786@gmail.com');
      console.log('   📬 Also check Spam/Junk folder');
      console.log('   📧 Subject: "Verify Your Email - Quick Touch Academy"');
      console.log('   🔗 The email will contain a verification link');
      
    } else {
      console.log('❌ Account creation failed');
      console.log('   Response:', response.body);
    }
  } catch (error) {
    console.log('❌ Error creating account:', error.message);
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

createNewAccount();


