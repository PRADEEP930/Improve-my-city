const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPIs() {
  try {
    console.log('🚀 Testing Improve My City APIs...\n');

    // Test 1: Get all issues
    console.log('1. Testing GET /api/issues/all');
    const issuesResponse = await axios.get(`${BASE_URL}/issues/all`);
    console.log('✅ All Issues:', issuesResponse.data);
    console.log('');

    // Test 2: Report a new issue
    console.log('2. Testing POST /api/issues/report');
    const newIssue = {
      title: "Test Pothole Issue",
      description: "This is a test issue for demonstration",
      category_id: 1,
      latitude: 12.9716,
      longitude: 77.5946,
      address: "Test Street, Demo City",
      user_id: 1
    };

    const reportResponse = await axios.post(`${BASE_URL}/issues/report`, newIssue);
    console.log('✅ Issue Reported:', reportResponse.data);
    console.log('');

    // Test 3: Get issues by status
    console.log('3. Testing GET /api/issues/status/pending');
    const statusResponse = await axios.get(`${BASE_URL}/issues/status/pending`);
    console.log('✅ Pending Issues:', statusResponse.data);
    console.log('');

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API Test Failed:', error.response?.data || error.message);
  }
}

testAPIs();