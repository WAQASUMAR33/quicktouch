// Complete signup test
const http = require('http');

async function testSignupFlow() {
  console.log('🧪 Testing Complete Signup Flow...\n');

  // Test 1: Check Academy API
  console.log('1️⃣ Testing Academy API...');
  try {
    const academyResponse = await makeRequest('GET', '/api/academy_management');
    if (academyResponse.statusCode === 200) {
      const data = JSON.parse(academyResponse.body);
      console.log(`✅ Academy API working - Found ${data.academies.length} academies`);
      console.log(`   Available academies:`);
      data.academies.forEach(academy => {
        console.log(`   - ${academy.name} (ID: ${academy.id})`);
      });
    } else {
      console.log('❌ Academy API failed');
      return;
    }
  } catch (error) {
    console.log('❌ Academy API error:', error.message);
    return;
  }

  // Test 2: Test User Registration
  console.log('\n2️⃣ Testing User Registration...');
  const testUser = {
    fullName: 'Test User ' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'player',
    academyId: 'academy-main-campus'
  };

  try {
    const signupResponse = await makeRequest('POST', '/api/users', testUser);
    if (signupResponse.statusCode === 201) {
      const data = JSON.parse(signupResponse.body);
      console.log('✅ User registration successful!');
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Academy: ${data.user.academyId}`);
      console.log(`   Message: ${data.message}`);
    } else {
      console.log('❌ User registration failed');
      console.log('   Response:', signupResponse.body);
    }
  } catch (error) {
    console.log('❌ User registration error:', error.message);
  }

  console.log('\n🎉 Signup flow test completed!');
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

testSignupFlow();


