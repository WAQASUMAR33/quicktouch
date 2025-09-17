// Test script to verify academy management API
const fetch = require('node-fetch');

async function testAcademyAPI() {
  try {
    console.log('🧪 Testing Academy Management API...');
    
    const response = await fetch('http://192.168.10.8:3002/api/academy_management');
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Academy API is working correctly!');
      console.log(`📈 Found ${data.academies?.length || 0} academies`);
    } else {
      console.log('❌ Academy API returned an error');
    }
    
  } catch (error) {
    console.error('❌ Error testing Academy API:', error.message);
  }
}

testAcademyAPI();

