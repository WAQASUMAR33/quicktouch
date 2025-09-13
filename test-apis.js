// API Testing Script for Quick Touch Academy
// This script tests all the API endpoints to ensure they're working properly

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'admin',
  phone: '+1234567890',
  academyId: 'test-academy-id'
};

const testPlayer = {
  fullName: 'Test Player',
  age: 18,
  height: 1.75,
  position: 'Forward',
  academyId: 'test-academy-id'
};

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data: result
    };
  } catch (error) {
    return {
      status: 500,
      ok: false,
      error: error.message
    };
  }
}

// Test functions
async function testUserRegistration() {
  console.log('🧪 Testing User Registration...');
  
  const result = await makeRequest('/users', 'POST', testUser);
  
  if (result.ok) {
    console.log('✅ User registration successful');
    return result.data.user;
  } else {
    console.log('❌ User registration failed:', result.data?.error || result.error);
    return null;
  }
}

async function testUserLogin() {
  console.log('🧪 Testing User Login...');
  
  const loginData = {
    email: testUser.email,
    password: testUser.password
  };
  
  const result = await makeRequest('/login', 'POST', loginData);
  
  if (result.ok) {
    console.log('✅ User login successful');
    return result.data.token;
  } else {
    console.log('❌ User login failed:', result.data?.error || result.error);
    return null;
  }
}

async function testPlayerManagement(token) {
  console.log('🧪 Testing Player Management...');
  
  // Test creating a player
  const createResult = await makeRequest('/players_management', 'POST', testPlayer, token);
  
  if (createResult.ok) {
    console.log('✅ Player creation successful');
    
    // Test fetching players
    const fetchResult = await makeRequest('/players_management', 'GET', null, token);
    
    if (fetchResult.ok) {
      console.log('✅ Player fetching successful');
      return fetchResult.data.players[0];
    } else {
      console.log('❌ Player fetching failed:', fetchResult.data?.error || fetchResult.error);
    }
  } else {
    console.log('❌ Player creation failed:', createResult.data?.error || createResult.error);
  }
  
  return null;
}

async function testMessaging(token) {
  console.log('🧪 Testing Messaging System...');
  
  // Test fetching conversations
  const conversationsResult = await makeRequest('/messaging/conversations', 'GET', null, token);
  
  if (conversationsResult.ok) {
    console.log('✅ Conversations fetching successful');
  } else {
    console.log('❌ Conversations fetching failed:', conversationsResult.data?.error || conversationsResult.error);
  }
  
  // Test fetching users for messaging
  const usersResult = await makeRequest('/messaging/users', 'GET', null, token);
  
  if (usersResult.ok) {
    console.log('✅ Messaging users fetching successful');
  } else {
    console.log('❌ Messaging users fetching failed:', usersResult.data?.error || usersResult.error);
  }
}

async function testPlayerComparison(token) {
  console.log('🧪 Testing Player Comparison...');
  
  // Test fetching comparisons (should work for scouts)
  const comparisonsResult = await makeRequest('/player-comparison', 'GET', null, token);
  
  if (comparisonsResult.ok) {
    console.log('✅ Player comparisons fetching successful');
  } else {
    console.log('❌ Player comparisons fetching failed:', comparisonsResult.data?.error || comparisonsResult.error);
  }
}

async function testAIInsights(token, playerId) {
  console.log('🧪 Testing AI Insights...');
  
  if (playerId) {
    // Test fetching AI insights
    const insightsResult = await makeRequest(`/ai-insights?playerId=${playerId}`, 'GET', null, token);
    
    if (insightsResult.ok) {
      console.log('✅ AI insights fetching successful');
    } else {
      console.log('❌ AI insights fetching failed:', insightsResult.data?.error || insightsResult.error);
    }
    
    // Test fetching video analyses
    const videoResult = await makeRequest(`/ai-insights/video-analysis?playerId=${playerId}`, 'GET', null, token);
    
    if (videoResult.ok) {
      console.log('✅ Video analyses fetching successful');
    } else {
      console.log('❌ Video analyses fetching failed:', videoResult.data?.error || videoResult.error);
    }
  } else {
    console.log('⚠️ Skipping AI insights test - no player ID available');
  }
}

async function testAdvancedStats(token, playerId) {
  console.log('🧪 Testing Advanced Stats...');
  
  if (playerId) {
    // Test fetching advanced stats
    const statsResult = await makeRequest(`/advanced-stats?playerId=${playerId}`, 'GET', null, token);
    
    if (statsResult.ok) {
      console.log('✅ Advanced stats fetching successful');
    } else {
      console.log('❌ Advanced stats fetching failed:', statsResult.data?.error || statsResult.error);
    }
  } else {
    console.log('⚠️ Skipping advanced stats test - no player ID available');
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting API Tests for Quick Touch Academy\n');
  
  try {
    // Test user registration
    const user = await testUserRegistration();
    if (!user) {
      console.log('❌ Cannot continue tests without user registration');
      return;
    }
    
    // Test user login
    const token = await testUserLogin();
    if (!token) {
      console.log('❌ Cannot continue tests without authentication token');
      return;
    }
    
    // Test player management
    const player = await testPlayerManagement(token);
    
    // Test messaging system
    await testMessaging(token);
    
    // Test player comparison
    await testPlayerComparison(token);
    
    // Test AI insights
    await testAIInsights(token, player?.id);
    
    // Test advanced stats
    await testAdvancedStats(token, player?.id);
    
    console.log('\n🎉 All API tests completed!');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runAllTests();
}

module.exports = {
  runAllTests,
  makeRequest,
  testUserRegistration,
  testUserLogin,
  testPlayerManagement,
  testMessaging,
  testPlayerComparison,
  testAIInsights,
  testAdvancedStats
};




