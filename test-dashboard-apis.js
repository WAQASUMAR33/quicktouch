const http = require('http');

// Test all the APIs that the dashboard calls
async function testDashboardAPIs() {
  console.log('🔍 Testing all dashboard APIs...');

  // First, login to get a token
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

  console.log('📧 Logging in to get token...');

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
          const token = loginResponse.token;
          
          // Test all dashboard APIs
          testAPI('/api/setup', token, 'Setup API');
          testAPI('/api/players_management', token, 'Players Management API');
          testAPI('/api/event_management', token, 'Event Management API');
          
        } else {
          console.log('❌ Login failed!');
          console.log(`   Status: ${loginRes.statusCode}`);
          console.log(`   Error: ${loginResponse.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.log('❌ Error parsing login response:', error.message);
      }
    });
  });

  loginReq.on('error', (error) => {
    console.log('❌ Login request error:', error.message);
  });

  loginReq.write(loginPostData);
  loginReq.end();
}

function testAPI(path, token, name) {
  console.log(`\n🧪 Testing ${name}...`);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (res.statusCode === 200) {
          console.log(`✅ ${name} - Success!`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response keys: ${Object.keys(response).join(', ')}`);
          
          // Show specific data for each API
          if (path === '/api/setup') {
            console.log(`   Users: ${response.users || 0}`);
            console.log(`   User List Length: ${response.userList?.length || 0}`);
          } else if (path === '/api/players_management') {
            console.log(`   Players: ${response.players?.length || 0}`);
          } else if (path === '/api/event_management') {
            console.log(`   Events: ${response.events?.length || 0}`);
          }
        } else {
          console.log(`❌ ${name} - Failed!`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Error: ${response.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.log(`❌ ${name} - Parse Error:`, error.message);
        console.log(`   Raw response: ${data.substring(0, 200)}...`);
      }
    });
  });

  req.on('error', (error) => {
    console.log(`❌ ${name} - Request Error:`, error.message);
  });

  req.end();
}

testDashboardAPIs();
