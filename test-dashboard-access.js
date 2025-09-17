const http = require('http');

// Test admin login and dashboard access
async function testDashboardAccess() {
  console.log('🔐 Testing admin login and dashboard access...');

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

  console.log('📧 Logging in as admin...');

  const loginReq = http.request(loginOptions, (loginRes) => {
    let loginData = '';

    loginRes.on('data', (chunk) => {
      loginData += chunk;
    });

    loginRes.on('end', () => {
      try {
        const loginResponse = JSON.parse(loginData);
        
        if (loginRes.statusCode === 200) {
          console.log('✅ Admin login successful!');
          console.log(`   Token: ${loginResponse.token ? 'Generated' : 'Not provided'}`);
          console.log(`   User Role: ${loginResponse.user.role}`);
          console.log(`   User ID: ${loginResponse.user.id}`);

          // Step 2: Test token verification
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

          console.log('\n🔍 Testing token verification...');

          const verifyReq = http.request(verifyOptions, (verifyRes) => {
            let verifyData = '';

            verifyRes.on('data', (chunk) => {
              verifyData += chunk;
            });

            verifyRes.on('end', () => {
              try {
                const verifyResponse = JSON.parse(verifyData);
                
                if (verifyRes.statusCode === 200) {
                  console.log('✅ Token verification successful!');
                  console.log(`   User Role: ${verifyResponse.user.role}`);
                  console.log(`   User Name: ${verifyResponse.user.fullName}`);
                  console.log(`   Academy ID: ${verifyResponse.user.academyId}`);
                  console.log(`   Email Verified: ${verifyResponse.user.isEmailVerified}`);

                  // Step 3: Test dashboard access
                  console.log('\n🏠 Testing dashboard access...');
                  
                  const dashboardOptions = {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/pages/dashboard',
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${loginResponse.token}`,
                      'Content-Type': 'application/json'
                    }
                  };

                  const dashboardReq = http.request(dashboardOptions, (dashboardRes) => {
                    console.log(`   Dashboard Status: ${dashboardRes.statusCode}`);
                    
                    if (dashboardRes.statusCode === 200) {
                      console.log('✅ Dashboard accessible!');
                      console.log('\n🎯 Admin Dashboard Features Available:');
                      console.log('   - Full system access');
                      console.log('   - Academy management');
                      console.log('   - User management');
                      console.log('   - Player management');
                      console.log('   - Academy approvals');
                      console.log('   - Event management');
                      console.log('   - AI insights');
                      console.log('   - Advanced statistics');
                    } else {
                      console.log('❌ Dashboard access failed!');
                    }
                  });

                  dashboardReq.on('error', (error) => {
                    console.log('❌ Dashboard request error:', error.message);
                  });

                  dashboardReq.end();

                } else {
                  console.log('❌ Token verification failed!');
                  console.log(`   Status: ${verifyRes.statusCode}`);
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
          console.log('❌ Admin login failed!');
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

testDashboardAccess();
