// Script to get academy login details
const https = require('http');

async function getAcademyLoginDetails() {
  try {
    console.log('🏫 Getting academy login details...');
    
    // Get all academies
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

    console.log('📋 Available Academies:');
    console.log('='.repeat(80));
    
    for (const academy of getData.academies) {
      console.log(`\n🏫 Academy: ${academy.name}`);
      console.log(`   ID: ${academy.id}`);
      console.log(`   Status: ${academy.status || 'N/A'}`);
      console.log(`   Contact Person: ${academy.contactPerson || 'N/A'}`);
      console.log(`   Contact Email: ${academy.contactEmail || 'N/A'}`);
      console.log(`   Contact Phone: ${academy.contactPersonPhone || 'N/A'}`);
      
      // Check if academy has admin users
      if (academy.User && academy.User.length > 0) {
        console.log(`   👥 Admin Users (${academy.User.length}):`);
        academy.User.forEach(user => {
          if (user.role === 'admin') {
            console.log(`      📧 Email: ${user.email}`);
            console.log(`      👤 Name: ${user.fullName}`);
            console.log(`      🔑 Role: ${user.role}`);
            console.log(`      📅 Created: ${new Date(user.createdAt).toLocaleDateString()}`);
          }
        });
      } else {
        console.log(`   👥 Admin Users: None found`);
      }
      
      console.log(`   📊 Stats: ${academy.Player?.length || 0} Players, ${academy.Event?.length || 0} Events`);
    }

    // Check for approved academies specifically
    const approvedAcademies = getData.academies.filter(a => a.status === 'approved');
    console.log(`\n✅ Approved Academies: ${approvedAcademies.length}`);
    
    if (approvedAcademies.length > 0) {
      console.log('\n🎯 LOGIN CREDENTIALS FOR APPROVED ACADEMIES:');
      console.log('='.repeat(80));
      
      for (const academy of approvedAcademies) {
        console.log(`\n🏫 ${academy.name}`);
        console.log(`   📧 Login Email: ${academy.contactEmail || 'N/A'}`);
        
        if (academy.User && academy.User.length > 0) {
          const adminUser = academy.User.find(u => u.role === 'admin');
          if (adminUser) {
            console.log(`   🔑 Admin Email: ${adminUser.email}`);
            console.log(`   👤 Admin Name: ${adminUser.fullName}`);
            console.log(`   📝 Note: Use the admin email to login`);
          }
        } else {
          console.log(`   ⚠️  No admin user found - academy may need approval`);
        }
      }
    }

    // Check pending academies
    const pendingAcademies = getData.academies.filter(a => a.status === 'pending');
    console.log(`\n⏳ Pending Academies: ${pendingAcademies.length}`);
    
    if (pendingAcademies.length > 0) {
      console.log('\n📋 PENDING ACADEMIES (Need Admin Approval):');
      console.log('='.repeat(80));
      
      for (const academy of pendingAcademies) {
        console.log(`\n🏫 ${academy.name}`);
        console.log(`   📧 Contact Email: ${academy.contactEmail || 'N/A'}`);
        console.log(`   👤 Contact Person: ${academy.contactPerson || 'N/A'}`);
        console.log(`   📞 Contact Phone: ${academy.contactPersonPhone || 'N/A'}`);
        console.log(`   ⏳ Status: Pending approval`);
      }
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

getAcademyLoginDetails();
