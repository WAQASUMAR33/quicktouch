// Test all pages in the Quick Touch Academy application
const http = require('http');

const pagesToTest = [
  { path: '/pages/dashboard', name: 'Dashboard' },
  { path: '/pages/players_management', name: 'Players Management' },
  { path: '/pages/event_management', name: 'Events & Matches' },
  { path: '/pages/messaging', name: 'Messaging' },
  { path: '/pages/player-comparison', name: 'Player Comparison' },
  { path: '/pages/ai-insights', name: 'AI Insights' },
  { path: '/pages/advanced-stats', name: 'Advanced Stats' },
  { path: '/pages/training_programs', name: 'Training Programs' },
  { path: '/pages/attandance_management', name: 'Attendance Management' },
  { path: '/pages/academy_management', name: 'Academy Management' },
  { path: '/pages/users', name: 'User Management' },
  // Additional pages found in the directory
  { path: '/pages/players_management/new', name: 'New Player' },
  { path: '/pages/event_management/new', name: 'New Event' },
  { path: '/pages/event_management/match/new', name: 'New Match' },
  // Legacy pages (might be from template)
  { path: '/pages/product_management', name: 'Product Management' },
  { path: '/pages/dealer_management', name: 'Dealer Management' },
  { path: '/pages/supplier_management', name: 'Supplier Management' },
  { path: '/pages/tax_management', name: 'Tax Management' },
  { path: '/pages/sale_list', name: 'Sale List' },
  { path: '/pages/new_sale', name: 'New Sale' },
  { path: '/pages/dealer_trnx', name: 'Dealer Transactions' },
  { path: '/pages/sup_trnx', name: 'Supplier Transactions' }
];

async function testAllPages() {
  console.log('🧪 Testing All Pages in Quick Touch Academy...\n');
  
  const results = {
    working: [],
    errors: [],
    notFound: []
  };

  for (const page of pagesToTest) {
    console.log(`📄 Testing: ${page.name} (${page.path})`);
    
    try {
      const response = await makeRequest('GET', page.path);
      
      if (response.statusCode === 200) {
        // Check if it's a valid HTML page
        if (response.body.includes('<html') || response.body.includes('<!DOCTYPE')) {
          console.log(`   ✅ Working - Status: ${response.statusCode}`);
          results.working.push(page);
        } else {
          console.log(`   ⚠️  Unexpected content - Status: ${response.statusCode}`);
          results.errors.push({ ...page, error: 'Unexpected content type' });
        }
      } else if (response.statusCode === 404) {
        console.log(`   ❌ Not Found - Status: ${response.statusCode}`);
        results.notFound.push(page);
      } else {
        console.log(`   ⚠️  Error - Status: ${response.statusCode}`);
        results.errors.push({ ...page, error: `HTTP ${response.statusCode}` });
      }
    } catch (error) {
      console.log(`   ❌ Connection Error: ${error.message}`);
      results.errors.push({ ...page, error: error.message });
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Working Pages: ${results.working.length}`);
  console.log(`❌ Not Found: ${results.notFound.length}`);
  console.log(`⚠️  Errors: ${results.errors.length}`);
  console.log(`📄 Total Tested: ${pagesToTest.length}`);

  if (results.working.length > 0) {
    console.log('\n✅ Working Pages:');
    results.working.forEach(page => {
      console.log(`   • ${page.name} (${page.path})`);
    });
  }

  if (results.notFound.length > 0) {
    console.log('\n❌ Not Found Pages:');
    results.notFound.forEach(page => {
      console.log(`   • ${page.name} (${page.path})`);
    });
  }

  if (results.errors.length > 0) {
    console.log('\n⚠️  Pages with Errors:');
    results.errors.forEach(page => {
      console.log(`   • ${page.name} (${page.path}) - ${page.error}`);
    });
  }

  // Test API endpoints
  console.log('\n🔌 Testing Key API Endpoints:');
  await testAPIEndpoints();

  console.log('\n🎯 All Pages Test Complete!');
}

async function testAPIEndpoints() {
  const apiEndpoints = [
    { path: '/api/academy_management', name: 'Academy Management API' },
    { path: '/api/users', name: 'Users API' },
    { path: '/api/players', name: 'Players API' },
    { path: '/api/events', name: 'Events API' },
    { path: '/api/matches', name: 'Matches API' }
  ];

  for (const endpoint of apiEndpoints) {
    try {
      const response = await makeRequest('GET', endpoint.path);
      if (response.statusCode === 200) {
        console.log(`   ✅ ${endpoint.name} - Working`);
      } else if (response.statusCode === 404) {
        console.log(`   ❌ ${endpoint.name} - Not Found`);
      } else {
        console.log(`   ⚠️  ${endpoint.name} - Status: ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name} - Error: ${error.message}`);
    }
  }
}

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'User-Agent': 'QuickTouch-Test-Script'
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

    req.end();
  });
}

testAllPages();
