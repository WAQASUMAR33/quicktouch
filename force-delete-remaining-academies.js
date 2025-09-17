// Script to force delete the remaining academies
const https = require('http');

async function forceDeleteRemainingAcademies() {
  try {
    console.log('🗑️ Force deleting remaining academies...');
    
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

    console.log(`📋 Found ${academiesToDelete.length} academies still to delete`);

    for (const academy of academiesToDelete) {
      console.log(`\n🗑️ Attempting to delete: ${academy.name} (${academy.id})`);
      
      try {
        // First, let's check what related data exists
        console.log(`   📊 Related data:`);
        console.log(`      Users: ${academy.User?.length || 0}`);
        console.log(`      Players: ${academy.Player?.length || 0}`);
        console.log(`      Events: ${academy.Event?.length || 0}`);
        console.log(`      Matches: ${academy.Match?.length || 0}`);
        console.log(`      Training Plans: ${academy.TrainingPlan?.length || 0}`);

        const deleteOptions = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/academy_management/${academy.id}`,
          method: 'DELETE'
        };

        const deleteResponse = await makeRequest(deleteOptions);
        const deleteResult = JSON.parse(deleteResponse);
        
        console.log(`   ✅ Deleted successfully: ${academy.name}`);
        
      } catch (error) {
        console.log(`   ❌ Failed to delete ${academy.name}: ${error.message}`);
        
        // If it's a foreign key constraint error, we might need to delete related data first
        if (error.message.includes('Foreign key constraint')) {
          console.log(`   🔧 Foreign key constraint detected. This academy has related data that needs to be deleted first.`);
          console.log(`   💡 You may need to manually delete related users, players, events, etc. from the database.`);
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
        console.log(`      Users: ${academy.User?.length || 0}`);
        console.log(`      Players: ${academy.Player?.length || 0}`);
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

forceDeleteRemainingAcademies();
