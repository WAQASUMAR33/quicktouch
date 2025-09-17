// Script to test updated academy management API
const https = require('http');

async function testAcademyManagement() {
  try {
    console.log('🏫 Testing updated academy management API...');
    
    // Test GET academies
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/academy_management',
      method: 'GET'
    };

    const response = await makeRequest(getOptions);
    const data = JSON.parse(response);
    
    console.log('✅ Academy management API working');
    console.log(`📊 Found ${data.academies.length} academies`);
    
    if (data.academies.length > 0) {
      const academy = data.academies[0];
      console.log('\n📋 Sample academy data:');
      console.log(`   ID: ${academy.id}`);
      console.log(`   Name: ${academy.name}`);
      console.log(`   Location: ${academy.location}`);
      console.log(`   Status: ${academy.status || 'N/A'}`);
      console.log(`   Contact Email: ${academy.contactEmail || 'N/A'}`);
      console.log(`   Contact Phone: ${academy.contactPhone || 'N/A'}`);
      console.log(`   Contact Person: ${academy.contactPerson || 'N/A'}`);
      console.log(`   Contact Person Phone: ${academy.contactPersonPhone || 'N/A'}`);
      console.log(`   Admin Password: ${academy.adminPassword ? '***' : 'N/A'}`);
      
      // Check if new fields are present
      const hasNewFields = academy.hasOwnProperty('contactPerson') || 
                          academy.hasOwnProperty('contactPersonPhone') || 
                          academy.hasOwnProperty('status') ||
                          academy.hasOwnProperty('adminPassword');
      
      if (hasNewFields) {
        console.log('\n✅ New fields are present in the API response');
      } else {
        console.log('\n⚠️  New fields may not be present in the API response');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function makeRequest(options) {
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
    
    req.end();
  });
}

testAcademyManagement();
