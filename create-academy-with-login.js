// Script to create a new academy with known login credentials
const https = require('http');

async function createAcademyWithLogin() {
  try {
    console.log('🏫 Creating new academy with login credentials...');
    
    // Create a new academy registration
    const timestamp = Date.now();
    const academyData = JSON.stringify({
      academyName: `Demo Academy ${timestamp}`,
      location: 'Karachi, Pakistan',
      description: 'A demo academy for testing login functionality',
      contactEmail: `demo${timestamp}@academy.com`,
      contactPhone: '+92-300-1234567',
      contactPerson: 'Demo Admin',
      contactPersonPhone: '+92-300-1234567',
      password: 'demo123'
    });

    const createOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/academy-registration',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(academyData)
      }
    };

    console.log('🔄 Creating academy...');
    const createResponse = await makeRequest(createOptions, academyData);
    const createResult = JSON.parse(createResponse);
    
    console.log('✅ Academy created successfully');
    console.log(`   Academy ID: ${createResult.academy.id}`);
    console.log(`   Academy Name: ${createResult.academy.name}`);
    console.log(`   Status: ${createResult.academy.status}`);
    console.log(`   Contact Email: ${createResult.academy.contactEmail}`);

    // Now approve the academy
    const approveData = JSON.stringify({
      action: 'approve'
    });

    const approveOptions = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/admin-approvals/${createResult.academy.id}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(approveData)
      }
    };

    console.log('\n🔄 Approving academy...');
    const approveResponse = await makeRequest(approveOptions, approveData);
    const approveResult = JSON.parse(approveResponse);
    
    console.log('✅ Academy approved successfully');
    console.log(`   Admin Email: ${approveResult.admin.email}`);
    console.log(`   Message: ${approveResult.admin.message}`);

    console.log('\n🎯 LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${approveResult.admin.email}`);
    console.log(`🔑 Password: demo123`);
    console.log(`🏫 Academy: ${createResult.academy.name}`);
    console.log(`📍 Location: ${createResult.academy.location}`);
    console.log(`📝 Note: ${approveResult.admin.message}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

createAcademyWithLogin();
