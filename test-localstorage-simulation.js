const http = require('http');

// Simulate the exact browser localStorage behavior
async function testLocalStorageSimulation() {
  console.log('🔍 Testing localStorage simulation...');

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

          // Simulate localStorage.setItem calls
          console.log('\n💾 Simulating localStorage.setItem calls...');
          console.log(`   localStorage.setItem('token', '${loginResponse.token}')`);
          console.log(`   localStorage.setItem('user', '${JSON.stringify(loginResponse.user)}')`);
          console.log(`   localStorage.setItem('role', '${loginResponse.user.role}')`);

          // Step 2: Test token verification with the stored token
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
                
                if (verifyRes.statusCode === 200) {
                  console.log('✅ Token verification successful!');
                  console.log(`   User Role: "${verifyResponse.user.role}"`);
                  console.log(`   User Name: ${verifyResponse.user.fullName}`);
                  console.log(`   Academy ID: ${verifyResponse.user.academyId}`);
                  console.log(`   Email Verified: ${verifyResponse.user.isEmailVerified}`);

                  // Step 3: Test dashboard access
                  console.log('\n🏠 Step 3: Testing dashboard access...');
                  
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
                      console.log('\n🎯 Expected Behavior:');
                      console.log('   1. Browser should store token in localStorage');
                      console.log('   2. Dashboard should read token from localStorage');
                      console.log('   3. Dashboard should verify token with API');
                      console.log('   4. Dashboard should load for super_admin role');
                      
                      console.log('\n🔧 If dashboard still redirects to login:');
                      console.log('   - Check browser console for errors');
                      console.log('   - Check if localStorage is being cleared');
                      console.log('   - Check if token is being stored correctly');
                      console.log('   - Try the token-debug page: /pages/token-debug');
                    } else {
                      console.log('❌ Dashboard access failed!');
                      console.log(`   Status: ${dashboardRes.statusCode}`);
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

testLocalStorageSimulation();
