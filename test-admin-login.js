const http = require('http');

// Test admin login
async function testAdminLogin() {
  const loginData = {
    email: 'admin@quicktouch.com',
    password: 'admin123'
  };

  const postData = JSON.stringify(loginData);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🔐 Testing admin login...');
  console.log(`📧 Email: ${loginData.email}`);
  console.log(`🔑 Password: ${loginData.password}`);

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (res.statusCode === 200) {
          console.log('✅ Admin login successful!');
          console.log('📋 Login Response:');
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Message: ${response.message}`);
          console.log(`   User ID: ${response.user.id}`);
          console.log(`   User Role: ${response.user.role}`);
          console.log(`   User Name: ${response.user.fullName}`);
          console.log(`   Academy ID: ${response.user.academyId}`);
          console.log(`   Token: ${response.token ? 'Generated' : 'Not provided'}`);
          
          if (response.token) {
            console.log('\n🎯 Next Steps:');
            console.log('   1. Use this token for authenticated API calls');
            console.log('   2. Access admin dashboard at /pages/dashboard');
            console.log('   3. Manage academies at /pages/academy_management');
            console.log('   4. Review academy approvals at /pages/admin-approvals');
          }
        } else {
          console.log('❌ Admin login failed!');
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Error: ${response.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
  });

  req.write(postData);
  req.end();
}

testAdminLogin();
