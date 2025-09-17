// Script to create test academy and approve it
const https = require('http');

async function createAndApproveAcademy() {
  try {
    console.log('🏫 Creating test academy registration...');
    
    // Generate unique email
    const timestamp = Date.now();
    const email = `admin${timestamp}@testacademy.com`;
    
    // Step 1: Create academy registration
    const registrationData = JSON.stringify({
      academyName: `Test Academy ${timestamp}`,
      location: "Karachi, Pakistan", 
      description: "A test academy for demonstration purposes",
      contactEmail: email,
      contactPhone: "+92-300-1234567",
      contactPerson: "John Smith",
      contactPersonPhone: "+92-300-1234568",
      password: "testpass123"
    });

    const registrationOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/academy-registration',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(registrationData)
      }
    };

    const registrationResponse = await makeRequest(registrationOptions, registrationData);
    console.log('✅ Academy registration created successfully');
    console.log('Registration Response:', registrationResponse);

    // Step 2: Get pending academies
    console.log('\n📋 Fetching pending academies...');
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin-approvals',
      method: 'GET'
    };

    const pendingResponse = await makeRequest(getOptions);
    const pendingData = JSON.parse(pendingResponse);
    console.log('📋 Pending academies:', pendingData);

    if (pendingData.academies && pendingData.academies.length > 0) {
      // Find the academy we just created
      const academy = pendingData.academies.find(a => a.contactEmail === email) || pendingData.academies[0];
      console.log(`\n🎯 Found academy: ${academy.name} (ID: ${academy.id})`);

      // Step 3: Approve the academy
      console.log('\n✅ Approving academy...');
      const approvalData = JSON.stringify({ action: 'approve' });
      const approvalOptions = {
        hostname: 'localhost',
        port: 3000,
        path: `/api/admin-approvals/${academy.id}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(approvalData)
        }
      };

      const approvalResponse = await makeRequest(approvalOptions, approvalData);
      console.log('✅ Academy approved successfully');
      console.log('Approval Response:', approvalResponse);

      // Step 4: Display login credentials
      console.log('\n🔑 LOGIN CREDENTIALS:');
      console.log('================================');
      console.log(`Email: ${academy.contactEmail}`);
      console.log(`Password: testpass123`);
      console.log('================================');
      console.log('\n📝 You can now login with these credentials!');

    } else {
      console.log('❌ No pending academies found');
    }

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

createAndApproveAcademy();
