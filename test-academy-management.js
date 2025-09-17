// Test Academy Management API functionality
const http = require('http');

async function testAcademyManagement() {
  console.log('🧪 Testing Academy Management API...\n');

  // Test 1: Get all academies
  console.log('📋 Test 1: Get all academies');
  try {
    const response = await makeRequest('GET', '/api/academy_management');
    console.log(`   Status: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.body);
      console.log(`   ✅ Found ${data.academies.length} academies`);
      console.log(`   Message: ${data.message}`);
      
      if (data.academies.length > 0) {
        const academy = data.academies[0];
        console.log(`   📊 Sample Academy:`);
        console.log(`      ID: ${academy.id}`);
        console.log(`      Name: ${academy.name}`);
        console.log(`      Location: ${academy.location}`);
        console.log(`      Users: ${academy.User?.length || 0}`);
        console.log(`      Players: ${academy.Player?.length || 0}`);
        console.log(`      Events: ${academy.Event?.length || 0}`);
        console.log(`      Matches: ${academy.Match?.length || 0}`);
        console.log(`      Training Plans: ${academy.TrainingPlan?.length || 0}`);
      }
    } else {
      console.log(`   ❌ Failed: ${response.body}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n📝 Test 2: Create new academy');
  const newAcademy = {
    name: 'Test Academy ' + Date.now(),
    location: 'Test City, Pakistan',
    description: 'A test academy for API testing',
    contactEmail: 'test@academy.com',
    contactPhone: '+92-300-0000000',
    adminIds: '[]'
  };

  try {
    const response = await makeRequest('POST', '/api/academy_management', newAcademy);
    console.log(`   Status: ${response.statusCode}`);
    
    if (response.statusCode === 201) {
      const data = JSON.parse(response.body);
      console.log(`   ✅ Academy created successfully`);
      console.log(`   ID: ${data.academy.id}`);
      console.log(`   Name: ${data.academy.name}`);
      console.log(`   Message: ${data.message}`);
      
      // Test 3: Get specific academy
      console.log('\n🔍 Test 3: Get specific academy');
      const getResponse = await makeRequest('GET', `/api/academy_management/${data.academy.id}`);
      console.log(`   Status: ${getResponse.statusCode}`);
      
      if (getResponse.statusCode === 200) {
        const getData = JSON.parse(getResponse.body);
        console.log(`   ✅ Academy retrieved successfully`);
        console.log(`   Name: ${getData.academy.name}`);
        console.log(`   Relations loaded: User(${getData.academy.User?.length || 0}), Player(${getData.academy.Player?.length || 0})`);
      } else {
        console.log(`   ❌ Failed to get academy: ${getResponse.body}`);
      }
      
      // Test 4: Update academy
      console.log('\n✏️ Test 4: Update academy');
      const updateData = {
        name: 'Updated Test Academy',
        description: 'Updated description for testing'
      };
      
      const updateResponse = await makeRequest('PUT', `/api/academy_management/${data.academy.id}`, updateData);
      console.log(`   Status: ${updateResponse.statusCode}`);
      
      if (updateResponse.statusCode === 200) {
        const updateResult = JSON.parse(updateResponse.body);
        console.log(`   ✅ Academy updated successfully`);
        console.log(`   New Name: ${updateResult.academy.name}`);
        console.log(`   Message: ${updateResult.message}`);
      } else {
        console.log(`   ❌ Failed to update academy: ${updateResponse.body}`);
      }
      
      // Test 5: Delete academy
      console.log('\n🗑️ Test 5: Delete academy');
      const deleteResponse = await makeRequest('DELETE', `/api/academy_management/${data.academy.id}`);
      console.log(`   Status: ${deleteResponse.statusCode}`);
      
      if (deleteResponse.statusCode === 200) {
        const deleteResult = JSON.parse(deleteResponse.body);
        console.log(`   ✅ Academy deleted successfully`);
        console.log(`   Message: ${deleteResult.message}`);
      } else {
        console.log(`   ❌ Failed to delete academy: ${deleteResponse.body}`);
      }
      
    } else {
      console.log(`   ❌ Failed to create academy: ${response.body}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n🎯 Academy Management API Test Complete!');
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

testAcademyManagement();

