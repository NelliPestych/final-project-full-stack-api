import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';

// Helper function to make API requests
const apiRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('🏥 Testing health check...');
  const result = await apiRequest('GET', '/health');
  console.log('Health check:', result.success ? '✅ PASS' : '❌ FAIL');
  if (!result.success) console.log('Error:', result.error);
};

const testUserRegistration = async () => {
  console.log('👤 Testing user registration...');
  const result = await apiRequest('POST', '/auth/register', testUser);
  console.log('Registration:', result.success ? '✅ PASS' : '❌ FAIL');
  if (result.success) {
    authToken = result.data.data.token;
    console.log('Auth token received');
  } else {
    console.log('Error:', result.error);
  }
};

const testUserLogin = async () => {
  console.log('🔐 Testing user login...');
  const result = await apiRequest('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  console.log('Login:', result.success ? '✅ PASS' : '❌ FAIL');
  if (result.success) {
    authToken = result.data.data.token;
    console.log('Auth token received');
  } else {
    console.log('Error:', result.error);
  }
};

const testGetProfile = async () => {
  console.log('👤 Testing get profile...');
  const result = await apiRequest('GET', '/users/profile', null, authToken);
  console.log('Get profile:', result.success ? '✅ PASS' : '❌ FAIL');
  if (!result.success) console.log('Error:', result.error);
};

const testGetCategories = async () => {
  console.log('📂 Testing get categories...');
  const result = await apiRequest('GET', '/categories');
  console.log('Get categories:', result.success ? '✅ PASS' : '❌ FAIL');
  if (result.success) {
    console.log(`Found ${result.data.data.length} categories`);
  } else {
    console.log('Error:', result.error);
  }
};

const testGetAreas = async () => {
  console.log('🌍 Testing get areas...');
  const result = await apiRequest('GET', '/areas');
  console.log('Get areas:', result.success ? '✅ PASS' : '❌ FAIL');
  if (result.success) {
    console.log(`Found ${result.data.data.length} areas`);
  } else {
    console.log('Error:', result.error);
  }
};

const testGetIngredients = async () => {
  console.log('🥕 Testing get ingredients...');
  const result = await apiRequest('GET', '/ingredients');
  console.log('Get ingredients:', result.success ? '✅ PASS' : '❌ FAIL');
  if (result.success) {
    console.log(`Found ${result.data.data.length} ingredients`);
  } else {
    console.log('Error:', result.error);
  }
};

const testGetTestimonials = async () => {
  console.log('💬 Testing get testimonials...');
  const result = await apiRequest('GET', '/testimonials');
  console.log('Get testimonials:', result.success ? '✅ PASS' : '❌ FAIL');
  if (result.success) {
    console.log(`Found ${result.data.data.length} testimonials`);
  } else {
    console.log('Error:', result.error);
  }
};

const testSearchRecipes = async () => {
  console.log('🔍 Testing search recipes...');
  const result = await apiRequest('GET', '/recipes/search?limit=5');
  console.log('Search recipes:', result.success ? '✅ PASS' : '❌ FAIL');
  if (result.success) {
    console.log(`Found ${result.data.data.recipes.length} recipes`);
  } else {
    console.log('Error:', result.error);
  }
};

const testGetPopularRecipes = async () => {
  console.log('⭐ Testing get popular recipes...');
  const result = await apiRequest('GET', '/recipes/popular?limit=5');
  console.log('Get popular recipes:', result.success ? '✅ PASS' : '❌ FAIL');
  if (result.success) {
    console.log(`Found ${result.data.data.length} popular recipes`);
  } else {
    console.log('Error:', result.error);
  }
};

const testCreateRecipe = async () => {
  console.log('🍳 Testing create recipe...');
  const recipeData = {
    title: 'Test Recipe',
    description: 'A test recipe for API testing',
    instructions: '1. Mix ingredients\n2. Cook for 30 minutes\n3. Serve hot',
    time: 30,
    category: 'Miscellaneous',
    area: 'Unknown',
    ingredients: [
      { id: 1, measure: '1 cup' },
      { id: 2, measure: '2 tbsp' }
    ]
  };
  
  const result = await apiRequest('POST', '/recipes', recipeData, authToken);
  console.log('Create recipe:', result.success ? '✅ PASS' : '❌ FAIL');
  if (!result.success) console.log('Error:', result.error);
};

const testGetMyRecipes = async () => {
  console.log('📝 Testing get my recipes...');
  const result = await apiRequest('GET', '/recipes/my', null, authToken);
  console.log('Get my recipes:', result.success ? '✅ PASS' : '❌ FAIL');
  if (result.success) {
    console.log(`Found ${result.data.data.recipes.length} my recipes`);
  } else {
    console.log('Error:', result.error);
  }
};

const testGetFavorites = async () => {
  console.log('❤️ Testing get favorites...');
  const result = await apiRequest('GET', '/recipes/favorites', null, authToken);
  console.log('Get favorites:', result.success ? '✅ PASS' : '❌ FAIL');
  if (result.success) {
    console.log(`Found ${result.data.data.recipes.length} favorite recipes`);
  } else {
    console.log('Error:', result.error);
  }
};

const testUserLogout = async () => {
  console.log('🚪 Testing user logout...');
  const result = await apiRequest('POST', '/auth/logout', null, authToken);
  console.log('Logout:', result.success ? '✅ PASS' : '❌ FAIL');
  if (!result.success) console.log('Error:', result.error);
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting API tests...\n');

  try {
    // Basic tests
    await testHealthCheck();
    console.log('');

    // Auth tests
    await testUserRegistration();
    await testUserLogin();
    console.log('');

    // User tests
    await testGetProfile();
    console.log('');

    // Public endpoint tests
    await testGetCategories();
    await testGetAreas();
    await testGetIngredients();
    await testGetTestimonials();
    console.log('');

    // Recipe tests
    await testSearchRecipes();
    await testGetPopularRecipes();
    await testCreateRecipe();
    await testGetMyRecipes();
    await testGetFavorites();
    console.log('');

    // Logout test
    await testUserLogout();

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test runner error:', error.message);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  apiRequest,
  testUser
};
