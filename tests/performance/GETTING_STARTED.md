# 🚀 Performance Testing Framework - Complete Setup

## ✅ Installation Complete!

Your performance testing framework has been successfully installed with the following structure:

```
tests/performance/
├── 📄 config.js                 ← EDIT THIS to configure your tests
├── 🔧 runner.js                 ← Main test engine (no editing needed)
├── 📊 metrics-collector.js      ← Metrics tracking (no editing needed)
├── 📈 report-generator.js       ← Report generation (no editing needed)
├── ⚡ quick-start.js            ← Quick test example
├── 📖 README.md                 ← Full documentation
├── 📝 USAGE_EXAMPLES.md         ← Usage examples
└── 📋 SUMMARY.md                ← Quick reference guide
```

## 🎯 What You Can Do Now

### Option 1: Run a Quick Test (Recommended First Step)

```bash
# Run a quick 30-second test with 10 users
node tests/performance/quick-start.js
```

This will:
- ✅ Run for 30 seconds
- ✅ Simulate 10 concurrent users
- ✅ Generate a beautiful HTML report
- ✅ Show you how everything works

### Option 2: Run Full Performance Test

```bash
# Run the full test (50 users, 60 seconds)
npm run test:performance
```

### Option 3: Customize and Run

1. **Edit configuration**:
   ```bash
   # Open config.js in your editor
   code tests/performance/config.js
   # or
   nano tests/performance/config.js
   ```

2. **Modify these key settings**:
   ```javascript
   CONCURRENT_USERS: 50,      // Change number of users
   TEST_DURATION: 60,         // Change duration (seconds)
   RAMP_UP_TIME: 10,          // Change ramp-up time
   ```

3. **Run your custom test**:
   ```bash
   npm run test:performance
   ```

## 📊 View Your Results

After running any test, view the HTML report:

```bash
# macOS
npm run report:performance

# Linux
xdg-open test-results/performance/performance-report.html

# Windows
start test-results/performance/performance-report.html

# Or manually navigate to:
# test-results/performance/performance-report.html
```

## 🎨 Customization Cheat Sheet

### Change Load Level

```javascript
// In config.js, modify these lines:

// Light load (testing)
CONCURRENT_USERS: 10,
TEST_DURATION: 30,

// Medium load (staging)
CONCURRENT_USERS: 50,
TEST_DURATION: 60,

// Heavy load (production simulation)
CONCURRENT_USERS: 200,
TEST_DURATION: 300,

// Stress test (find limits)
CONCURRENT_USERS: 500,
TEST_DURATION: 600,
```

### Change What Gets Tested

```javascript
// In config.js, modify SCENARIOS array:

SCENARIOS: [
  {
    name: 'Customer Order Flow',
    weight: 40,  // ← Change this (percentage of users)
    description: 'Simulates customer ordering',
    steps: [...]
  },
  // ... more scenarios
]
```

### Change Performance Thresholds

```javascript
// In config.js, modify THRESHOLDS:

THRESHOLDS: {
  RESPONSE_TIME: {
    P50: 500,    // ← Make stricter or more lenient
    P95: 2000,   // ← Adjust based on requirements
  },
  ERROR_RATE: 1,  // ← Maximum acceptable error rate (%)
}
```

## 📈 What the Report Shows

Your HTML report will include:

1. **📊 Test Summary**
   - Total requests sent
   - Success/failure rates
   - Test duration and throughput

2. **⚡ Key Performance Metrics**
   - Average response time
   - P95 response time (95% of requests faster than this)
   - Success rate percentage
   - Error rate percentage

3. **🎯 Threshold Status**
   - ✅ Green: All thresholds passed
   - ⚠️ Yellow: Some warnings
   - ❌ Red: Critical violations

4. **📉 Response Time Chart**
   - Visual graph of response time distribution
   - Shows min, p50, p90, p95, p99, max

5. **🔍 Per-Endpoint Breakdown**
   - Performance stats for each API endpoint
   - Helps identify slow endpoints

6. **❌ Error Details** (if any)
   - List of all errors encountered
   - Timestamps and error codes

## 🎯 Common Scenarios

### Scenario 1: Daily Health Check
```bash
# Edit config.js:
CONCURRENT_USERS: 10
TEST_DURATION: 30

# Run:
npm run test:performance
```

### Scenario 2: Pre-Release Testing
```bash
# Edit config.js:
CONCURRENT_USERS: 100
TEST_DURATION: 300

# Run:
npm run test:performance
```

### Scenario 3: Find Breaking Point
```bash
# Run multiple tests with increasing load:
# Test 1: 50 users
# Test 2: 100 users
# Test 3: 200 users
# Test 4: 500 users
# Continue until you see degradation
```

## 🔧 Troubleshooting

### ❌ Error: "Cannot find module 'axios'"
```bash
npm install
```

### ❌ Error: "ECONNREFUSED"
- Check if `BASE_URL` in config.js is correct
- Verify the server is running
- Check network connectivity

### ❌ Test runs but shows 100% errors
- Verify endpoint URLs in config.js
- Check if authentication is required
- Review server logs

### ❌ High memory usage
```bash
# Run with more memory:
node --max-old-space-size=4096 tests/performance/runner.js
```

## 📚 Documentation

- **Full Guide**: `tests/performance/README.md`
- **Examples**: `tests/performance/USAGE_EXAMPLES.md`
- **Quick Ref**: `tests/performance/SUMMARY.md`
- **This Guide**: `tests/performance/GETTING_STARTED.md`

## 🎉 Next Steps

1. ✅ **Run the quick start**:
   ```bash
   node tests/performance/quick-start.js
   ```

2. ✅ **View the generated report**:
   ```bash
   npm run report:performance
   ```

3. ✅ **Customize config.js** for your needs

4. ✅ **Run your first real test**:
   ```bash
   npm run test:performance
   ```

5. ✅ **Analyze results and optimize**

## 💡 Pro Tips

1. **Start Small**: Begin with 10 users, then scale up
2. **Baseline First**: Run a test before making changes
3. **Regular Testing**: Schedule weekly performance tests
4. **Monitor Server**: Watch server metrics during tests
5. **Keep History**: Archive reports for comparison
6. **Test Realistically**: Match production traffic patterns

## 🚀 You're All Set!

Everything is configured and ready to use. The framework will:

- ✅ Simulate realistic user behavior
- ✅ Track detailed performance metrics
- ✅ Generate beautiful HTML reports
- ✅ Detect performance issues automatically
- ✅ Export data in multiple formats

**Start testing now:**

```bash
npm run test:performance
```

**Questions?** Check the documentation files or review the generated HTML report for detailed insights.

**Happy Performance Testing! 🎯**

---

## 📊 Quick Command Reference

```bash
# Run performance test
npm run test:performance

# Run quick test
node tests/performance/quick-start.js

# View HTML report
npm run report:performance

# View test files
ls -la tests/performance/

# View results
ls -la test-results/performance/
```
