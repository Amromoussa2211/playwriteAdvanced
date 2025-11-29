# Performance Testing Framework

A comprehensive, configurable performance testing framework for load testing your application with detailed metrics and beautiful HTML reports.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Understanding Reports](#understanding-reports)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This performance testing framework simulates real-world user behavior under high load conditions to identify bottlenecks and ensure your application can handle expected traffic.

### Test Scenarios

The framework includes 4 pre-configured scenarios:

1. **Customer Order Flow (40% of users)**
   - Scan QR Code
   - Browse Menu
   - Add Items to Cart
   - Confirm Order
   - Process Payment

2. **Admin Dashboard Operations (30% of users)**
   - Login to Dashboard
   - View Tables
   - Check Order Reports
   - Check Payment Reports

3. **Split Payment Flow (20% of users)**
   - Create Order
   - Split Invoice
   - Process First Payment
   - Process Second Payment

4. **Menu Browsing Only (10% of users)**
   - Scan QR Code
   - Browse Categories
   - View Items

## ✨ Features

- **Configurable Load Testing**: Easily adjust concurrent users, test duration, and ramp-up time
- **Multiple Scenarios**: Simulate different user behaviors with weighted distribution
- **Comprehensive Metrics**: Track response times, throughput, error rates, and more
- **Beautiful HTML Reports**: Auto-generated reports with charts and detailed breakdowns
- **Threshold Monitoring**: Automatically detect performance violations
- **Real-time Monitoring**: Track test progress in real-time
- **Multiple Export Formats**: HTML, JSON, and CSV reports
- **No Code Changes Required**: All configuration in one file

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Test

Edit `tests/performance/config.js`:

```javascript
module.exports = {
  CONCURRENT_USERS: 50,      // Number of virtual users
  TEST_DURATION: 60,         // Test duration in seconds
  RAMP_UP_TIME: 10,          // Ramp-up time in seconds
  
  BASE_URL: 'https://api-dev.vastmenu.com',
  // ... other settings
};
```

### 3. Run the Test

```bash
npm run test:performance
```

### 4. View Results

Open the generated HTML report:

```bash
open test-results/performance/performance-report.html
```

## ⚙️ Configuration

All configuration is centralized in `tests/performance/config.js`. Here's what you can customize:

### Load Parameters

```javascript
CONCURRENT_USERS: 50,      // Number of simultaneous users
TEST_DURATION: 60,         // How long to run the test (seconds)
RAMP_UP_TIME: 10,          // Time to reach max users (seconds)
```

### Think Time

Simulates realistic user behavior with pauses between actions:

```javascript
THINK_TIME: {
  MIN: 500,    // Minimum pause (ms)
  MAX: 2000    // Maximum pause (ms)
}
```

### Performance Thresholds

Define acceptable performance limits:

```javascript
THRESHOLDS: {
  RESPONSE_TIME: {
    P50: 500,    // 50th percentile < 500ms
    P90: 1000,   // 90th percentile < 1s
    P95: 2000,   // 95th percentile < 2s
    P99: 5000    // 99th percentile < 5s
  },
  ERROR_RATE: 1,           // < 1% errors
  MIN_THROUGHPUT: 100,     // > 100 req/s
  MIN_SUCCESS_RATE: 99     // > 99% success
}
```

### Test Scenarios

Adjust scenario weights to simulate different traffic patterns:

```javascript
SCENARIOS: [
  {
    name: 'Customer Order Flow',
    weight: 40,  // 40% of users
    description: 'Simulates customer browsing menu and placing orders',
    steps: [...]
  },
  // ... more scenarios
]
```

### Endpoints

Configure which API endpoints to test:

```javascript
ENDPOINTS: {
  LOGIN: '/authentication/login',
  CREATE_ORDER: '/api/orders',
  PROCESS_PAYMENT: '/api/payments',
  // ... more endpoints
}
```

## 📊 Understanding Reports

### HTML Report Sections

1. **Test Summary**
   - Test duration, concurrent users, total requests, throughput

2. **Key Metrics**
   - Success rate, error rate, average response time, P95 response time

3. **Threshold Violations**
   - Highlights any performance thresholds that were exceeded

4. **Test Scenarios**
   - Visual breakdown of all test scenarios and their steps

5. **Response Time Distribution**
   - Chart showing response time percentiles

6. **Performance by Endpoint**
   - Detailed metrics for each API endpoint tested

7. **Response Time Metrics Table**
   - Min, Avg, P50, P90, P95, P99, Max response times

8. **Errors Section** (if any)
   - Detailed list of all errors encountered

### Interpreting Results

#### ✅ Good Performance
- Success rate > 99%
- P95 response time < 2000ms
- Error rate < 1%
- No threshold violations

#### ⚠️ Warning Signs
- Success rate 95-99%
- P95 response time 2000-5000ms
- Error rate 1-5%
- Some threshold violations

#### ❌ Poor Performance
- Success rate < 95%
- P95 response time > 5000ms
- Error rate > 5%
- Multiple critical threshold violations

## 🎨 Customization

### Adding New Scenarios

1. Define the scenario in `config.js`:

```javascript
SCENARIOS: [
  // ... existing scenarios
  {
    name: 'My Custom Scenario',
    weight: 15,  // 15% of users
    description: 'Description of what this scenario does',
    steps: [
      'Step 1',
      'Step 2',
      'Step 3'
    ]
  }
]
```

2. Implement the scenario in `runner.js`:

```javascript
async simulateMyCustomScenario(userId) {
  console.log(`[USER ${userId}] Starting My Custom Scenario`);
  
  try {
    // Step 1
    await this.makeRequest(`${config.BASE_URL}/api/endpoint1`, 'GET');
    await this.sleep(this.getThinkTime());
    
    // Step 2
    await this.makeRequest(`${config.BASE_URL}/api/endpoint2`, 'POST', { data: 'value' });
    await this.sleep(this.getThinkTime());
    
    // Step 3
    await this.makeRequest(`${config.BASE_URL}/api/endpoint3`, 'GET');
    
    console.log(`[USER ${userId}] Completed My Custom Scenario`);
  } catch (error) {
    console.error(`[USER ${userId}] Error:`, error.message);
  }
}
```

3. Add to scenario execution in `executeScenario()`:

```javascript
case 'My Custom Scenario':
  await this.simulateMyCustomScenario(userId);
  break;
```

### Adjusting for Different Load Levels

#### Light Load (Development/Staging)
```javascript
CONCURRENT_USERS: 10,
TEST_DURATION: 30,
RAMP_UP_TIME: 5
```

#### Medium Load (Pre-Production)
```javascript
CONCURRENT_USERS: 50,
TEST_DURATION: 60,
RAMP_UP_TIME: 10
```

#### Heavy Load (Production Simulation)
```javascript
CONCURRENT_USERS: 200,
TEST_DURATION: 300,
RAMP_UP_TIME: 30
```

#### Stress Testing (Find Breaking Point)
```javascript
CONCURRENT_USERS: 500,
TEST_DURATION: 600,
RAMP_UP_TIME: 60
```

## 🔧 Troubleshooting

### High Error Rates

**Problem**: Error rate > 5%

**Solutions**:
- Check server logs for errors
- Verify endpoint URLs in config
- Ensure test data is valid
- Check network connectivity
- Reduce concurrent users

### Slow Response Times

**Problem**: P95 > 5000ms

**Solutions**:
- Identify slow endpoints in the report
- Check database query performance
- Review server resource usage (CPU, memory)
- Consider caching strategies
- Optimize API endpoints

### Test Crashes

**Problem**: Test stops unexpectedly

**Solutions**:
- Check Node.js memory limits: `node --max-old-space-size=4096 tests/performance/runner.js`
- Reduce concurrent users
- Shorten test duration
- Check for network timeouts

### Inconsistent Results

**Problem**: Results vary significantly between runs

**Solutions**:
- Increase test duration for more stable metrics
- Run tests at consistent times
- Ensure no other load on the server
- Use longer ramp-up time

## 📈 Best Practices

1. **Start Small**: Begin with low load and gradually increase
2. **Baseline First**: Establish baseline performance before making changes
3. **Consistent Environment**: Always test in the same environment
4. **Monitor Server**: Watch server metrics during tests
5. **Regular Testing**: Run performance tests regularly, not just before release
6. **Document Results**: Keep historical reports for comparison
7. **Set Realistic Thresholds**: Base thresholds on business requirements

## 📝 Example Workflows

### Daily Performance Check
```bash
# Quick 30-second test with 10 users
# Edit config.js: CONCURRENT_USERS: 10, TEST_DURATION: 30
npm run test:performance
```

### Pre-Release Validation
```bash
# Full 5-minute test with 100 users
# Edit config.js: CONCURRENT_USERS: 100, TEST_DURATION: 300
npm run test:performance
```

### Capacity Planning
```bash
# Gradually increase users to find limits
# Run multiple tests with increasing CONCURRENT_USERS
# 50, 100, 200, 500, 1000...
```

## 🎯 Performance Goals

Based on industry standards:

| Metric | Excellent | Good | Acceptable | Poor |
|--------|-----------|------|------------|------|
| P95 Response Time | < 500ms | < 1000ms | < 2000ms | > 2000ms |
| Success Rate | > 99.9% | > 99% | > 95% | < 95% |
| Error Rate | < 0.1% | < 1% | < 5% | > 5% |
| Throughput | > 500 req/s | > 200 req/s | > 100 req/s | < 100 req/s |

## 📞 Support

For issues or questions:
1. Check this README
2. Review the generated HTML report for detailed metrics
3. Check console output for error messages
4. Review `test-results/performance/performance-metrics.json` for raw data

---

**Happy Testing! 🚀**
