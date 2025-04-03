// Script to test backend authentication API
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api';

// Test user data for registration
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  role: 'admin'
};

// Function to test registration
async function testRegistration() {
  console.log('Testing registration...');
  try {
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return null;
  }
}

// Function to test login
async function testLogin() {
  console.log('\nTesting login...');
  try {
    const credentials = {
      email: testUser.email,
      password: testUser.password
    };
    
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
}

// Function to test authentication
async function testBackend() {
  console.log('=== BACKEND AUTHENTICATION TEST ===\n');
  
  // Step 1: Test registration
  const registrationResult = await testRegistration();
  
  // Step 2: Test login
  if (registrationResult) {
    const loginResult = await testLogin();
    if (loginResult) {
      console.log('\n✅ Backend authentication is working properly!');
    }
  } else {
    console.log('\nTrying login with existing user...');
    await testLogin();
  }
  
  console.log('\n=== TEST COMPLETE ===');
}

// Run the test
testBackend(); 