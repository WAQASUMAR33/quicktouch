const http = require('http');

// Debug the dashboard issue step by step
async function debugDashboardIssue() {
  console.log('🔍 Debugging dashboard issue...');

  // Step 1: Login as admin
  const loginData = {
    email: 'admin@quicktouch.com',
    password: 'admin123'
  };

  const loginPostData = JSON.stringify(loginData);

  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginPostData)
    }
  };

  console.log('📧 Step 1: Logging in as admin...');

  const loginReq = http.request(loginOptions, (loginRes) => {
    let loginData = '';

    loginRes.on('data', (chunk) => {
      loginData += chunk;
    });

    loginRes.on('end', () => {
      try {
        const loginResponse = JSON.parse(loginData);
        
        if (loginRes.statusCode === 200) {
          console.log('✅ Login successful!');
          console.log(`   Token: ${loginResponse.token ? 'Generated' : 'Not provided'}`);
          console.log(`   User Role: "${loginResponse.user.role}"`);
          console.log(`   User ID: ${loginResponse.user.id}`);
          console.log(`   User Name: ${loginResponse.user.fullName}`);

          // Step 2: Test token verification with detailed logging
          const verifyOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/verify',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${loginResponse.token}`,
              'Content-Type': 'application/json'
            }
          };

          console.log('\n🔍 Step 2: Testing token verification...');

          const verifyReq = http.request(verifyOptions, (verifyRes) => {
            let verifyData = '';

            verifyRes.on('data', (chunk) => {
              verifyData += chunk;
            });

            verifyRes.on('end', () => {
              try {
                const verifyResponse = JSON.parse(verifyData);
                
                console.log(`   Verify Status: ${verifyRes.statusCode}`);
                console.log(`   Verify Message: ${verifyResponse.message}`);
                
                if (verifyRes.statusCode === 200) {
                  console.log('✅ Token verification successful!');
                  console.log(`   User Role: "${verifyResponse.user.role}"`);
                  console.log(`   User Name: ${verifyResponse.user.fullName}`);
                  console.log(`   Academy ID: ${verifyResponse.user.academyId}`);
                  console.log(`   Email Verified: ${verifyResponse.user.isEmailVerified}`);
                  
                  // Check role comparison logic
                  console.log('\n🧪 Step 3: Testing role comparison logic...');
                  console.log(`   userData.user.role === 'admin': ${verifyResponse.user.role === 'admin'}`);
                  console.log(`   userData.user.role !== 'super_admin': ${verifyResponse.user.role !== 'super_admin'}`);
                  console.log(`   userData.user.role === 'super_admin': ${verifyResponse.user.role === 'super_admin'}`);
                  
                  if (verifyResponse.user.role === 'admin') {
                    console.log('   ⚠️  Would redirect to academy-dashboard');
                  } else if (verifyResponse.user.role !== 'super_admin') {
                    console.log('   ❌ Would show access denied error');
                  } else {
                    console.log('   ✅ Would proceed to load dashboard data');
                  }

                } else {
                  console.log('❌ Token verification failed!');
                  console.log(`   Error: ${verifyResponse.error || 'Unknown error'}`);
                }
              } catch (error) {
                console.log('❌ Error parsing verify response:', error.message);
                console.log('Raw response:', verifyData);
              }
            });
          });

          verifyReq.on('error', (error) => {
            console.log('❌ Verify request error:', error.message);
          });

          verifyReq.end();

        } else {
          console.log('❌ Login failed!');
          console.log(`   Status: ${loginRes.statusCode}`);
          console.log(`   Error: ${loginResponse.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.log('❌ Error parsing login response:', error.message);
        console.log('Raw response:', loginData);
      }
    });
  });

  loginReq.on('error', (error) => {
    console.log('❌ Login request error:', error.message);
  });

  loginReq.write(loginPostData);
  loginReq.end();
}

debugDashboardIssue();
