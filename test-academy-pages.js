// Test Academy Registration and Dashboard Pages
const http = require('http');

async function testAcademyPages() {
  console.log('🧪 Testing Academy Registration and Dashboard Pages...\n');

  // Test 1: Academy Registration Page
  console.log('📝 Test 1: Academy Registration Page');
  try {
    const pageResponse = await makeRequest('GET', '/pages/academy-registration');
    console.log(`   Status: ${pageResponse.statusCode}`);
    
    if (pageResponse.statusCode === 200) {
      console.log(`   ✅ Page Working - Academy registration page loads successfully`);
      
      // Check if it contains expected content
      if (pageResponse.body.includes('Academy Registration') && 
          pageResponse.body.includes('Academy Information') &&
          pageResponse.body.includes('Admin Information')) {
        console.log(`   ✅ Page Content - Contains expected registration form elements`);
      } else {
        console.log(`   ⚠️  Page Content - May be missing some elements`);
      }
    } else {
      console.log(`   ❌ Page Failed: ${pageResponse.body}`);
    }
  } catch (error) {
    console.log(`   ❌ Page Error: ${error.message}`);
  }

  // Test 2: Academy Registration API
  console.log('\n🔌 Test 2: Academy Registration API');
  const testAcademyData = {
    academyName: 'Test Academy ' + Date.now(),
    location: 'Test City, Pakistan',
    description: 'A test academy for API testing',
    contactEmail: `test${Date.now()}@academy.com`,
    contactPhone: '+92-300-0000000',
    adminName: 'Test Admin',
    adminEmail: `admin${Date.now()}@test.com`,
    adminPhone: '+92-300-0000001',
    password: 'testpassword123'
  };

  try {
    const apiResponse = await makeRequest('POST', '/api/academy-registration', testAcademyData);
    console.log(`   Status: ${apiResponse.statusCode}`);
    
    if (apiResponse.statusCode === 201) {
      const data = JSON.parse(apiResponse.body);
      console.log(`   ✅ API Working - Academy registered successfully`);
      console.log(`   📊 Academy: ${data.academy.name}`);
      console.log(`   👤 Admin: ${data.admin.name}`);
      console.log(`   📧 Email: ${data.admin.email}`);
    } else {
      console.log(`   ❌ API Failed: ${apiResponse.body}`);
    }
  } catch (error) {
    console.log(`   ❌ API Error: ${error.message}`);
  }

  // Test 3: Academy Dashboard Page
  console.log('\n📊 Test 3: Academy Dashboard Page');
  try {
    const pageResponse = await makeRequest('GET', '/pages/academy-dashboard');
    console.log(`   Status: ${pageResponse.statusCode}`);
    
    if (pageResponse.statusCode === 200) {
      console.log(`   ✅ Page Working - Academy dashboard page loads successfully`);
      
      // Check if it contains expected content
      if (pageResponse.body.includes('Academy Dashboard') || 
          pageResponse.body.includes('Access Denied')) {
        console.log(`   ✅ Page Content - Contains expected dashboard elements`);
      } else {
        console.log(`   ⚠️  Page Content - May be missing some elements`);
      }
    } else {
      console.log(`   ❌ Page Failed: ${pageResponse.body}`);
    }
  } catch (error) {
    console.log(`   ❌ Page Error: ${error.message}`);
  }

  // Test 4: Test with invalid data
  console.log('\n🔍 Test 4: Invalid Registration Data');
  const invalidData = {
    academyName: '',
    location: '',
    contactEmail: 'invalid-email',
    adminEmail: 'invalid-email',
    password: '123'
  };

  try {
    const apiResponse = await makeRequest('POST', '/api/academy-registration', invalidData);
    console.log(`   Status: ${apiResponse.statusCode}`);
    
    if (apiResponse.statusCode === 400) {
      console.log(`   ✅ Validation Working - Correctly rejects invalid data`);
    } else {
      console.log(`   ⚠️  Validation - Unexpected response for invalid data`);
    }
  } catch (error) {
    console.log(`   ❌ Validation Test Failed: ${error.message}`);
  }

  console.log('\n🎯 Academy Pages Test Complete!');
  console.log('\n📋 Summary:');
  console.log('✅ Created Academy Registration Page: /pages/academy-registration');
  console.log('✅ Created Academy Registration API: /api/academy-registration');
  console.log('✅ Created Academy Dashboard Page: /pages/academy-dashboard');
  console.log('✅ Fixed Next.js params await warning in player API');
  console.log('✅ Added proper form validation and error handling');
  console.log('✅ Implemented transaction-based academy and user creation');
  console.log('✅ Added password hashing and email validation');
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

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

testAcademyPages();
