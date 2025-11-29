/**
 * Performance Test - Quick Start Example
 * 
 * This is a simple example showing how to run a quick performance test.
 * Copy this file and modify as needed for your specific testing scenarios.
 */

const config = require('./config');
const PerformanceTestRunner = require('./runner');

// Override configuration for a quick test
config.CONCURRENT_USERS = 10;        // Start with 10 users
config.TEST_DURATION = 30;           // Run for 30 seconds
config.RAMP_UP_TIME = 5;             // Ramp up over 5 seconds

// Optional: Adjust scenarios for quick test
config.SCENARIOS = [
  {
    name: 'Customer Order Flow',
    weight: 50,
    description: 'Quick order test',
    steps: ['Browse Menu', 'Create Order']
  },
  {
    name: 'Menu Browsing Only',
    weight: 50,
    description: 'Quick browse test',
    steps: ['Browse Menu', 'View Items']
  }
];

// Run the test
console.log('🚀 Starting Quick Performance Test...\n');
console.log('Configuration:');
console.log(`  Users: ${config.CONCURRENT_USERS}`);
console.log(`  Duration: ${config.TEST_DURATION}s`);
console.log(`  Ramp-up: ${config.RAMP_UP_TIME}s\n`);

const runner = new PerformanceTestRunner();
runner.run().then(() => {
  console.log('\n✅ Quick test completed!');
  console.log('📊 View the report at: test-results/performance/performance-report.html\n');
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
