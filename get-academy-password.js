// Script to get academy password
const https = require('http');

async function getAcademyPassword() {
  try {
    console.log('🔑 Getting academy password...');
    
    // Get the approved academy details
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/academy_management/academy-f231a18f-2fd2-40bc-9626-f827cd2401ee',
      method: 'GET'
    };

    const getResponse = await makeRequest(getOptions);
    const getData = JSON.parse(getResponse);
    
    if (getData.academy) {
      const academy = getData.academy;
      console.log('🏫 Academy Details:');
      console.log(`   Name: ${academy.name}`);
      console.log(`   Status: ${academy.status}`);
      console.log(`   Contact Email: ${academy.contactEmail}`);
      
      // Check if academy has adminPassword field
      if (academy.adminPassword) {
        console.log(`   🔑 Admin Password: ${academy.adminPassword}`);
      } else {
        console.log(`   ⚠️  No admin password found in academy data`);
      }
      
      // Check admin users
      if (academy.User && academy.User.length > 0) {
        console.log('\n👥 Admin Users:');
        academy.User.forEach(user => {
          if (user.role === 'admin') {
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   👤 Name: ${user.fullName}`);
            console.log(`   🔑 Role: ${user.role}`);
          }
        });
      }
    }

    // Also check if we can get the password from the database directly
    console.log('\n🔍 Checking for password in academy data...');
    
    // Try to get raw academy data
    const rawOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/academy_management',
      method: 'GET'
    };

    const rawResponse = await makeRequest(rawOptions);
    const rawData = JSON.parse(rawResponse);
    
    const approvedAcademy = rawData.academies.find(a => a.id === 'academy-f231a18f-2fd2-40bc-9626-f827cd2401ee');
    if (approvedAcademy) {
      console.log('\n📋 Raw Academy Data:');
      console.log(`   ID: ${approvedAcademy.id}`);
      console.log(`   Name: ${approvedAcademy.name}`);
      console.log(`   Status: ${approvedAcademy.status}`);
      console.log(`   Contact Email: ${approvedAcademy.contactEmail}`);
      console.log(`   Admin Password: ${approvedAcademy.adminPassword || 'Not found'}`);
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

getAcademyPassword();
