// Script to delete academies using raw SQL to bypass Prisma issues
const https = require('http');

async function deleteAcademiesWithRawSQL() {
  try {
    console.log('🗑️ Deleting academies using raw SQL approach...');
    
    // Get current academies
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/academy_management',
      method: 'GET'
    };

    const getResponse = await makeRequest(getOptions);
    const getData = JSON.parse(getResponse);
    
    const academyToKeep = 'academy-3986f0d5-7753-42c8-8d25-8be5a3955d58'; // Demo Academy 1758059945367
    const academiesToDelete = getData.academies.filter(academy => academy.id !== academyToKeep);

    console.log(`📋 Found ${academiesToDelete.length} academies to delete`);

    for (const academy of academiesToDelete) {
      console.log(`\n🗑️ Deleting: ${academy.name} (${academy.id})`);
      
      try {
        // Try to delete using a custom endpoint that uses raw SQL
        const deleteData = JSON.stringify({
          academyId: academy.id,
          useRawSQL: true
        });

        const deleteOptions = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/academy_management/${academy.id}`,
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(deleteData)
          }
        };

        const deleteResponse = await makeRequest(deleteOptions, deleteData);
        const deleteResult = JSON.parse(deleteResponse);
        
        console.log(`   ✅ Deleted successfully: ${academy.name}`);
        
      } catch (error) {
        console.log(`   ❌ Failed to delete ${academy.name}: ${error.message}`);
        
        // If the API approach fails, let's try to manually delete the related data first
        console.log(`   🔧 Attempting manual cleanup...`);
        
        try {
          // Delete users first
          const deleteUsersData = JSON.stringify({
            academyId: academy.id
          });

          const deleteUsersOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/users/bulk-delete',
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(deleteUsersData)
            }
          };

          // This endpoint might not exist, but let's try
          try {
            await makeRequest(deleteUsersOptions, deleteUsersData);
            console.log(`   ✅ Deleted users for ${academy.name}`);
          } catch (userError) {
            console.log(`   ⚠️  Could not delete users: ${userError.message}`);
          }

          // Now try to delete the academy again
          const retryDeleteOptions = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/academy_management/${academy.id}`,
            method: 'DELETE'
          };

          const retryResponse = await makeRequest(retryDeleteOptions);
          const retryResult = JSON.parse(retryResponse);
          
          console.log(`   ✅ Deleted successfully on retry: ${academy.name}`);
          
        } catch (retryError) {
          console.log(`   ❌ Still failed to delete ${academy.name}: ${retryError.message}`);
        }
      }
    }

    // Final verification
    console.log('\n🔍 Final verification...');
    const finalResponse = await makeRequest(getOptions);
    const finalData = JSON.parse(finalResponse);
    
    console.log(`\n📊 FINAL RESULT:`);
    console.log(`🏫 Total academies remaining: ${finalData.academies?.length || 0}`);
    
    if (finalData.academies && finalData.academies.length > 0) {
      console.log('\n📋 Remaining Academies:');
      console.log('='.repeat(60));
      finalData.academies.forEach(academy => {
        console.log(`   🏫 ${academy.name}`);
        console.log(`      ID: ${academy.id}`);
        console.log(`      Status: ${academy.status || 'N/A'}`);
        console.log(`      Contact: ${academy.contactEmail || 'N/A'}`);
        console.log('');
      });
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

deleteAcademiesWithRawSQL();
