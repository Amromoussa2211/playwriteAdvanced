# Performance Testing - Usage Examples

## Quick Start Examples

### Example 1: Light Load Test (10 users, 30 seconds)

```javascript
// Edit tests/performance/config.js
module.exports = {
  CONCURRENT_USERS: 10,
  TEST_DURATION: 30,
  RAMP_UP_TIME: 5,
  // ... rest of config
};
```

```bash
npm run test:performance
```

### Example 2: Medium Load Test (50 users, 1 minute)

```javascript
// Edit tests/performance/config.js
module.exports = {
  CONCURRENT_USERS: 50,
  TEST_DURATION: 60,
  RAMP_UP_TIME: 10,
  // ... rest of config
};
```

```bash
npm run test:performance
```

### Example 3: Heavy Load Test (200 users, 5 minutes)

```javascript
// Edit tests/performance/config.js
module.exports = {
  CONCURRENT_USERS: 200,
  TEST_DURATION: 300,
  RAMP_UP_TIME: 30,
  // ... rest of config
};
```

```bash
npm run test:performance
```

## Common Scenarios

### Testing Specific Endpoints

To focus on specific endpoints, modify the scenarios in `config.js`:

```javascript
SCENARIOS: [
  {
    name: 'Order API Only',
    weight: 100,  // 100% of users
    description: 'Test order creation endpoint',
    steps: ['Create Order', 'Get Order']
  }
]
```

### Testing Peak Hours

Simulate peak traffic:

```javascript
CONCURRENT_USERS: 500,
TEST_DURATION: 600,  // 10 minutes
RAMP_UP_TIME: 60,    // Gradual ramp-up
```

### Stress Testing

Find the breaking point:

```javascript
CONCURRENT_USERS: 1000,
TEST_DURATION: 300,
RAMP_UP_TIME: 120,
```

## Interpreting Results

### Good Performance Indicators
- ✅ Success rate > 99%
- ✅ P95 response time < 2000ms
- ✅ Error rate < 1%
- ✅ No threshold violations

### Warning Signs
- ⚠️ Success rate 95-99%
- ⚠️ P95 response time 2000-5000ms
- ⚠️ Error rate 1-5%

### Critical Issues
- ❌ Success rate < 95%
- ❌ P95 response time > 5000ms
- ❌ Error rate > 5%

## Customization Examples

### Custom Scenario Example

```javascript
// In runner.js, add new method:
async simulateCheckoutFlow(userId) {
  console.log(`[USER ${userId}] Starting Checkout Flow`);
  
  try {
    // Step 1: Add items to cart
    await this.makeRequest(
      `${config.BASE_URL}/api/cart/add`,
      'POST',
      { items: [1, 2, 3] }
    );
    await this.sleep(this.getThinkTime());
    
    // Step 2: Apply coupon
    await this.makeRequest(
      `${config.BASE_URL}/api/cart/coupon`,
      'POST',
      { code: 'DISCOUNT10' }
    );
    await this.sleep(this.getThinkTime());
    
    // Step 3: Checkout
    await this.makeRequest(
      `${config.BASE_URL}/api/checkout`,
      'POST',
      { paymentMethod: 'card' }
    );
    
    console.log(`[USER ${userId}] Completed Checkout Flow`);
  } catch (error) {
    console.error(`[USER ${userId}] Error:`, error.message);
  }
}
```

### Custom Thresholds

```javascript
// In config.js
THRESHOLDS: {
  RESPONSE_TIME: {
    P50: 300,    // Stricter: 300ms instead of 500ms
    P90: 800,    // Stricter: 800ms instead of 1000ms
    P95: 1500,   // Stricter: 1.5s instead of 2s
    P99: 3000    // Stricter: 3s instead of 5s
  },
  ERROR_RATE: 0.5,        // Stricter: 0.5% instead of 1%
  MIN_THROUGHPUT: 200,    // Higher: 200 req/s instead of 100
  MIN_SUCCESS_RATE: 99.5  // Higher: 99.5% instead of 99%
}
```

## Automation Examples

### CI/CD Integration

```yaml
# .github/workflows/performance-test.yml
name: Performance Tests

on:
  schedule:
    - cron: '0 2 * * *'  # Run daily at 2 AM
  workflow_dispatch:

jobs:
  performance-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:performance
      - uses: actions/upload-artifact@v2
        with:
          name: performance-report
          path: test-results/performance/
```

### Scheduled Testing Script

```bash
#!/bin/bash
# run-performance-test.sh

echo "Starting scheduled performance test..."
cd /path/to/project

# Run test
npm run test:performance

# Archive results
timestamp=$(date +%Y%m%d_%H%M%S)
cp test-results/performance/performance-report.html \
   archives/performance-report-$timestamp.html

# Send notification (optional)
# curl -X POST https://hooks.slack.com/... \
#   -d "Performance test completed: $timestamp"

echo "Performance test completed!"
```

## Troubleshooting

### Issue: High Memory Usage

```javascript
// Reduce concurrent users
CONCURRENT_USERS: 25,  // Instead of 50

// Or run with increased Node memory
// node --max-old-space-size=4096 tests/performance/runner.js
```

### Issue: Connection Timeouts

```javascript
// Increase request timeout
REQUEST_TIMEOUT: 60000,  // 60 seconds instead of 30

// Reduce concurrent users
CONCURRENT_USERS: 20,
```

### Issue: Inconsistent Results

```javascript
// Increase test duration for more stable metrics
TEST_DURATION: 300,  // 5 minutes instead of 1

// Use longer ramp-up
RAMP_UP_TIME: 60,
```

## Best Practices

1. **Start Small**: Begin with 10 users, then scale up
2. **Baseline First**: Establish baseline before changes
3. **Regular Testing**: Run weekly or before releases
4. **Monitor Server**: Watch CPU, memory, database during tests
5. **Document Results**: Keep historical reports
6. **Test Realistic Scenarios**: Match production traffic patterns
7. **Clean Data**: Reset test data between runs

## Report Locations

After running tests, find reports at:

- **HTML Report**: `test-results/performance/performance-report.html`
- **JSON Data**: `test-results/performance/performance-metrics.json`
- **CSV Data**: `test-results/performance/performance-data.csv`

## Quick Commands

```bash
# Run performance test
npm run test:performance

# View HTML report (macOS)
npm run report:performance

# View HTML report (Linux)
xdg-open test-results/performance/performance-report.html

# View HTML report (Windows)
start test-results/performance/performance-report.html

# Run quick test
node tests/performance/quick-start.js
```
