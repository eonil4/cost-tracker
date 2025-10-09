// Import the crypto polyfill setup
import './setup';

async function globalSetup() {
  // This function runs once before all tests
  console.log('Setting up Playwright tests...');
  
  // Minimal global setup - just ensure the environment is ready
  // Individual tests will handle their own data cleanup
  
  console.log('Global setup completed.');
}

export default globalSetup;
