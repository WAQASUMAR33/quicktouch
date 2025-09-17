// Script to test academy update functionality
const https = require('http');

async function testAcademyUpdate() {
  try {
    console.log('🏫 Testing academy update functionality...');
    
    // First, get an academy to update
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/academy_management',
      method: 'GET'
    };

    const getResponse = await makeRequest(getOptions);
    const getData = JSON.parse(getResponse);
    
    if (!getData.academies || getData.academies.length === 0) {
      console.log('❌ No academies found to update');
      return;
    }

    const academy = getData.academies[0];
    console.log(`📋 Found academy: ${academy.name} (ID: ${academy.id})`);
    console.log(`   Current status: ${academy.status || 'N/A'}`);
    console.log(`   Contact person: ${academy.contactPerson || 'N/A'}`);

    // Test update with new fields
    const updateData = JSON.stringify({
      name: academy.name + ' (Updated)',
      contactPerson: 'Updated Contact Person',
      contactPersonPhone: '+92-300-9999999',
      status: 'approved'
    });

    const updateOptions = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/academy_management/${academy.id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updateData)
      }
    };

    console.log('\n🔄 Updating academy...');
    const updateResponse = await makeRequest(updateOptions, updateData);
    const updateResult = JSON.parse(updateResponse);
    
    console.log('✅ Academy updated successfully');
    console.log('📋 Updated academy data:');
    console.log(`   Name: ${updateResult.academy.name}`);
    console.log(`   Status: ${updateResult.academy.status}`);
    console.log(`   Contact Person: ${updateResult.academy.contactPerson}`);
    console.log(`   Contact Person Phone: ${updateResult.academy.contactPersonPhone}`);

    // Verify the update by getting the academy again
    console.log('\n🔍 Verifying update...');
    const verifyResponse = await makeRequest(getOptions);
    const verifyData = JSON.parse(verifyResponse);
    
    const updatedAcademy = verifyData.academies.find(a => a.id === academy.id);
    if (updatedAcademy) {
      console.log('✅ Update verified successfully');
      console.log(`   Verified name: ${updatedAcademy.name}`);
      console.log(`   Verified status: ${updatedAcademy.status}`);
      console.log(`   Verified contact person: ${updatedAcademy.contactPerson}`);
    } else {
      console.log('❌ Could not verify update');
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

testAcademyUpdate();
