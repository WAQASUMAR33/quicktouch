// Script to delete all academies except Demo Academy 1758059945367
const https = require('http');

async function deleteUnwantedAcademies() {
  try {
    console.log('🗑️ Deleting unwanted academies...');
    
    // First, get all academies
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/academy_management',
      method: 'GET'
    };

    const getResponse = await makeRequest(getOptions);
    const getData = JSON.parse(getResponse);
    
    if (!getData.academies || getData.academies.length === 0) {
      console.log('❌ No academies found');
      return;
    }

    // Identify the academy to keep
    const academyToKeep = 'academy-3986f0d5-7753-42c8-8d25-8be5a3955d58'; // Demo Academy 1758059945367
    const academiesToDelete = getData.academies.filter(academy => academy.id !== academyToKeep);

    console.log(`📋 Found ${getData.academies.length} academies total`);
    console.log(`✅ Keeping: Demo Academy 1758059945367 (${academyToKeep})`);
    console.log(`🗑️ Deleting: ${academiesToDelete.length} academies`);

    // Show academies to be deleted
    console.log('\n📋 Academies to be deleted:');
    console.log('='.repeat(80));
    academiesToDelete.forEach(academy => {
      console.log(`   🏫 ${academy.name} (${academy.id})`);
    });
    console.log('='.repeat(80));

    // Delete each academy
    let deletedCount = 0;
    let errorCount = 0;

    for (const academy of academiesToDelete) {
      try {
        console.log(`\n🗑️ Deleting: ${academy.name}...`);
        
        const deleteOptions = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/academy_management/${academy.id}`,
          method: 'DELETE'
        };

        const deleteResponse = await makeRequest(deleteOptions);
        const deleteResult = JSON.parse(deleteResponse);
        
        console.log(`   ✅ Deleted successfully: ${academy.name}`);
        deletedCount++;
        
      } catch (error) {
        console.log(`   ❌ Failed to delete ${academy.name}: ${error.message}`);
        errorCount++;
      }
    }

    // Summary
    console.log('\n📊 DELETION SUMMARY:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully deleted: ${deletedCount} academies`);
    console.log(`❌ Failed to delete: ${errorCount} academies`);
    console.log(`🏫 Remaining academies: ${getData.academies.length - deletedCount}`);

    // Verify remaining academies
    console.log('\n🔍 Verifying remaining academies...');
    const verifyResponse = await makeRequest(getOptions);
    const verifyData = JSON.parse(verifyResponse);
    
    if (verifyData.academies && verifyData.academies.length > 0) {
      console.log('\n📋 Remaining Academies:');
      console.log('='.repeat(50));
      verifyData.academies.forEach(academy => {
        console.log(`   🏫 ${academy.name} (${academy.id})`);
        console.log(`      Status: ${academy.status || 'N/A'}`);
        console.log(`      Contact: ${academy.contactEmail || 'N/A'}`);
      });
    } else {
      console.log('❌ No academies remaining');
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

deleteUnwantedAcademies();
