# Performance Testing Framework - Summary

## 📁 File Structure

```
tests/performance/
├── config.js                 # Main configuration file (EDIT THIS)
├── runner.js                 # Test execution engine
├── metrics-collector.js      # Metrics tracking
├── report-generator.js       # HTML report generation
├── quick-start.js           # Quick test example
├── README.md                # Complete documentation
└── USAGE_EXAMPLES.md        # Usage examples and troubleshooting

test-results/performance/
├── performance-report.html  # Generated HTML report
├── performance-metrics.json # Raw metrics data
└── performance-data.csv     # CSV export
```

## 🎯 What This Framework Does

### 1. Load Testing
- Simulates multiple concurrent users
- Configurable ramp-up and duration
- Realistic user behavior with think times

### 2. Scenario Testing
- **Customer Order Flow** (40%): Browse menu → Add items → Order → Pay
- **Admin Dashboard** (30%): Login → View tables → Check reports
- **Split Payment** (20%): Create order → Split → Pay twice
- **Menu Browsing** (10%): Browse menu only

### 3. Metrics Collection
- Response times (min, avg, p50, p90, p95, p99, max)
- Throughput (requests per second)
- Success/error rates
- Per-endpoint statistics

### 4. Reporting
- Beautiful HTML report with charts
- JSON export for analysis
- CSV export for spreadsheets
- Threshold violation detection

## 🚀 Quick Start (3 Steps)

### Step 1: Configure
Edit `tests/performance/config.js`:

```javascript
CONCURRENT_USERS: 50,      // Number of users
TEST_DURATION: 60,         // Test duration (seconds)
RAMP_UP_TIME: 10,          // Ramp-up time (seconds)
```

### Step 2: Run
```bash
npm run test:performance
```

### Step 3: View Results
```bash
npm run report:performance
# Or manually open: test-results/performance/performance-report.html
```

## 📊 Configuration Options

### Essential Settings (config.js)

| Setting | Default | Description |
|---------|---------|-------------|
| `CONCURRENT_USERS` | 50 | Number of simultaneous users |
| `TEST_DURATION` | 60 | How long to run (seconds) |
| `RAMP_UP_TIME` | 10 | Time to reach max users |
| `BASE_URL` | api-dev.vastmenu.com | API base URL |
| `THINK_TIME.MIN` | 500 | Min pause between actions (ms) |
| `THINK_TIME.MAX` | 2000 | Max pause between actions (ms) |

### Performance Thresholds

| Threshold | Default | Meaning |
|-----------|---------|---------|
| `P50` | 500ms | 50% of requests < 500ms |
| `P90` | 1000ms | 90% of requests < 1s |
| `P95` | 2000ms | 95% of requests < 2s |
| `P99` | 5000ms | 99% of requests < 5s |
| `ERROR_RATE` | 1% | Less than 1% errors |
| `MIN_THROUGHPUT` | 100 req/s | At least 100 requests/second |

## 🎨 Customization Guide

### Change Number of Users

```javascript
// Light load
CONCURRENT_USERS: 10,

// Medium load
CONCURRENT_USERS: 50,

// Heavy load
CONCURRENT_USERS: 200,

// Stress test
CONCURRENT_USERS: 500,
```

### Change Test Duration

```javascript
// Quick test (30 seconds)
TEST_DURATION: 30,

// Standard test (1 minute)
TEST_DURATION: 60,

// Extended test (5 minutes)
TEST_DURATION: 300,

// Long test (10 minutes)
TEST_DURATION: 600,
```

### Adjust Scenario Mix

```javascript
SCENARIOS: [
  {
    name: 'Customer Order Flow',
    weight: 60,  // Change from 40% to 60%
    // ...
  },
  {
    name: 'Admin Dashboard Operations',
    weight: 20,  // Change from 30% to 20%
    // ...
  },
  // ... adjust other scenarios
]
```

### Change Endpoints

```javascript
ENDPOINTS: {
  // Add your custom endpoints
  MY_ENDPOINT: '/api/my-endpoint',
  ANOTHER_ENDPOINT: '/api/another',
  // ...
}
```

## 📈 Understanding Results

### HTML Report Sections

1. **Test Summary** - Overview of test execution
2. **Key Metrics** - Success rate, error rate, response times
3. **Threshold Violations** - Any performance issues
4. **Test Scenarios** - What was tested
5. **Response Time Chart** - Visual distribution
6. **Endpoint Performance** - Per-endpoint breakdown
7. **Detailed Metrics** - Complete statistics table
8. **Errors** - List of any errors (if applicable)

### Success Criteria

✅ **PASS** if:
- Success rate ≥ 99%
- P95 response time ≤ 2000ms
- Error rate ≤ 1%
- No critical threshold violations

⚠️ **WARNING** if:
- Success rate 95-99%
- P95 response time 2000-5000ms
- Error rate 1-5%

❌ **FAIL** if:
- Success rate < 95%
- P95 response time > 5000ms
- Error rate > 5%

## 🔧 Common Use Cases

### Use Case 1: Daily Health Check
```javascript
CONCURRENT_USERS: 10,
TEST_DURATION: 30,
RAMP_UP_TIME: 5,
```
Run: `npm run test:performance`

### Use Case 2: Pre-Release Validation
```javascript
CONCURRENT_USERS: 100,
TEST_DURATION: 300,
RAMP_UP_TIME: 30,
```
Run: `npm run test:performance`

### Use Case 3: Capacity Planning
Run multiple tests with increasing users:
- Test 1: 50 users
- Test 2: 100 users
- Test 3: 200 users
- Test 4: 500 users
- Find where performance degrades

### Use Case 4: Endpoint-Specific Testing
Modify scenarios to focus on specific endpoints:
```javascript
SCENARIOS: [
  {
    name: 'Payment Endpoint Only',
    weight: 100,
    description: 'Test payment processing',
    steps: ['Process Payment', 'Verify Payment']
  }
]
```

## 🎯 Performance Benchmarks

Based on industry standards:

| Load Level | Users | Duration | Expected P95 |
|------------|-------|----------|--------------|
| Light | 10-25 | 30-60s | < 500ms |
| Medium | 50-100 | 60-300s | < 1000ms |
| Heavy | 200-500 | 300-600s | < 2000ms |
| Stress | 500+ | 600s+ | Monitor for breaking point |

## 📝 Best Practices

1. ✅ **Start with baseline** - Run test before making changes
2. ✅ **Test regularly** - Weekly or before each release
3. ✅ **Monitor server** - Watch CPU, memory, database during tests
4. ✅ **Keep history** - Archive reports for comparison
5. ✅ **Test realistic scenarios** - Match production traffic patterns
6. ✅ **Clean environment** - Reset test data between runs
7. ✅ **Gradual load increase** - Use proper ramp-up time

## 🚨 Troubleshooting

### Problem: Test crashes
**Solution**: Reduce `CONCURRENT_USERS` or increase Node memory:
```bash
node --max-old-space-size=4096 tests/performance/runner.js
```

### Problem: High error rate
**Solution**: 
- Check server logs
- Verify endpoint URLs
- Reduce concurrent users
- Check network connectivity

### Problem: Slow response times
**Solution**:
- Identify slow endpoints in report
- Check database queries
- Review server resources
- Consider caching

### Problem: Inconsistent results
**Solution**:
- Increase `TEST_DURATION`
- Use longer `RAMP_UP_TIME`
- Test at consistent times
- Ensure no other load on server

## 📞 Support

1. Read `README.md` for detailed documentation
2. Check `USAGE_EXAMPLES.md` for examples
3. Review generated HTML report for insights
4. Check console output for errors
5. Examine `performance-metrics.json` for raw data

## 🎉 You're Ready!

Everything is configured and ready to use. Just run:

```bash
npm run test:performance
```

Then view your beautiful HTML report:

```bash
npm run report:performance
```

**Happy Performance Testing! 🚀**
