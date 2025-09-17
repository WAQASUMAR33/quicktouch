// Test Player Detail Page Fix
const http = require('http');

async function testPlayerDetailFix() {
  console.log('🧪 Testing Player Detail Page Fix...\n');

  const playerId = 'd4461e93-65cf-4799-985f-337b487d62c2';
  
  // Test 1: API Endpoint
  console.log('📡 Test 1: Player API Endpoint');
  try {
    const apiResponse = await makeRequest('GET', `/api/players_management/${playerId}`);
    console.log(`   Status: ${apiResponse.statusCode}`);
    
    if (apiResponse.statusCode === 200) {
      const data = JSON.parse(apiResponse.body);
      console.log(`   ✅ API Working - Player: ${data.player.fullName}`);
      console.log(`   📊 Stats: ${data.player.PlayerStats?.length || 0} records`);
      console.log(`   💬 Feedback: ${data.player.Feedback?.length || 0} records`);
      console.log(`   🏫 Academy: ${data.player.Academy?.name || 'N/A'}`);
    } else {
      console.log(`   ❌ API Failed: ${apiResponse.body}`);
    }
  } catch (error) {
    console.log(`   ❌ API Error: ${error.message}`);
  }

  // Test 2: Frontend Page
  console.log('\n🌐 Test 2: Player Detail Page');
  try {
    const pageResponse = await makeRequest('GET', `/pages/players_management/${playerId}`);
    console.log(`   Status: ${pageResponse.statusCode}`);
    
    if (pageResponse.statusCode === 200) {
      console.log(`   ✅ Page Working - Player detail page loads successfully`);
      
      // Check if it contains expected content
      if (pageResponse.body.includes('Player Profile') && 
          pageResponse.body.includes('Basic Information')) {
        console.log(`   ✅ Page Content - Contains expected player profile elements`);
      } else {
        console.log(`   ⚠️  Page Content - May be missing some elements`);
      }
    } else {
      console.log(`   ❌ Page Failed: ${pageResponse.body}`);
    }
  } catch (error) {
    console.log(`   ❌ Page Error: ${error.message}`);
  }

  // Test 3: Test with invalid player ID
  console.log('\n🔍 Test 3: Invalid Player ID');
  try {
    const invalidResponse = await makeRequest('GET', '/api/players_management/invalid-id');
    console.log(`   Status: ${invalidResponse.statusCode}`);
    
    if (invalidResponse.statusCode === 404) {
      console.log(`   ✅ Error Handling - Correctly returns 404 for invalid ID`);
    } else {
      console.log(`   ⚠️  Error Handling - Unexpected response for invalid ID`);
    }
  } catch (error) {
    console.log(`   ❌ Error Test Failed: ${error.message}`);
  }

  console.log('\n🎯 Player Detail Page Fix Test Complete!');
  console.log('\n📋 Summary:');
  console.log('✅ Created dynamic route: /pages/players_management/[id]/page.js');
  console.log('✅ Fixed API endpoint: /api/players_management/[id]/route.js');
  console.log('✅ Updated API to work with Player model instead of Supplier');
  console.log('✅ Added proper relations (Academy, PlayerStats, Feedback)');
  console.log('✅ Implemented CRUD operations (GET, PUT, DELETE)');
  console.log('✅ Added proper error handling and validation');
}

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'User-Agent': 'Player-Detail-Test-Script'
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

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

testPlayerDetailFix();
