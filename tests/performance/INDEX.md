# 🚀 Performance Testing Framework - File Index

## 📁 Complete File Structure

```
tests/performance/
│
├── 📋 Documentation Files
│   ├── GETTING_STARTED.md       ← START HERE! Complete setup guide
│   ├── README.md                ← Full documentation with all details
│   ├── SUMMARY.md               ← Quick reference guide
│   ├── USAGE_EXAMPLES.md        ← Code examples and troubleshooting
│   └── INDEX.md                 ← This file
│
├── ⚙️ Configuration
│   └── config.js                ← MAIN CONFIG FILE - Edit this!
│
├── 🔧 Core Framework (Don't edit these)
│   ├── runner.js                ← Test execution engine
│   ├── metrics-collector.js     ← Metrics tracking system
│   └── report-generator.js      ← HTML report generator
│
└── ⚡ Examples
    └── quick-start.js           ← Quick test example
```

## 📖 Which File Should I Read?

### 🆕 First Time User?
**Read**: `GETTING_STARTED.md`
- Step-by-step setup
- Quick start guide
- First test walkthrough

### 🔍 Need Complete Documentation?
**Read**: `README.md`
- Full feature documentation
- Configuration options
- Best practices
- Troubleshooting guide

### ⚡ Want Quick Reference?
**Read**: `SUMMARY.md`
- Quick configuration cheat sheet
- Common use cases
- Performance benchmarks
- Command reference

### 💡 Looking for Examples?
**Read**: `USAGE_EXAMPLES.md`
- Code examples
- Customization examples
- CI/CD integration
- Troubleshooting scenarios

## ⚙️ Which File Should I Edit?

### 🎯 To Configure Tests
**Edit**: `config.js`

This is the ONLY file you need to edit for most use cases:

```javascript
// Change number of users
CONCURRENT_USERS: 50,

// Change test duration
TEST_DURATION: 60,

// Change endpoints
BASE_URL: 'https://your-api.com',

// Change thresholds
THRESHOLDS: {
  RESPONSE_TIME: {
    P95: 2000,
  }
}
```

### 🔧 To Add Custom Scenarios
**Edit**: `runner.js`

Only edit this if you need custom test scenarios beyond the defaults.

### 📊 To Customize Reports
**Edit**: `report-generator.js`

Only edit this if you want to change the HTML report layout/styling.

## 🚀 Quick Start Commands

```bash
# 1. Run quick test (30 seconds, 10 users)
node tests/performance/quick-start.js

# 2. Run full test (60 seconds, 50 users)
npm run test:performance

# 3. View HTML report
npm run report:performance

# 4. View test configuration
cat tests/performance/config.js
```

## 📊 Output Files

After running tests, find results in:

```
test-results/performance/
├── performance-report.html      ← Beautiful HTML report (OPEN THIS!)
├── performance-metrics.json     ← Raw metrics data
└── performance-data.csv         ← CSV export for spreadsheets
```

## 🎯 Common Tasks

### Task: Change Number of Users
1. Open `config.js`
2. Find `CONCURRENT_USERS: 50`
3. Change to desired number
4. Run `npm run test:performance`

### Task: Change Test Duration
1. Open `config.js`
2. Find `TEST_DURATION: 60`
3. Change to desired seconds
4. Run `npm run test:performance`

### Task: Test Specific Endpoints
1. Open `config.js`
2. Modify `SCENARIOS` array
3. Adjust `weight` percentages
4. Run `npm run test:performance`

### Task: Change Performance Thresholds
1. Open `config.js`
2. Find `THRESHOLDS` section
3. Adjust values
4. Run `npm run test:performance`

### Task: View Previous Results
```bash
# HTML report
open test-results/performance/performance-report.html

# JSON data
cat test-results/performance/performance-metrics.json

# CSV data
open test-results/performance/performance-data.csv
```

## 🎨 Framework Features

### ✅ What's Included

- **Load Testing**: Simulate 1-1000+ concurrent users
- **Ramp-Up**: Gradual user increase for realistic load
- **Think Time**: Random pauses between actions
- **Multiple Scenarios**: 4 pre-built user flows
- **Metrics Collection**: Response times, throughput, errors
- **Beautiful Reports**: HTML with charts and tables
- **Threshold Monitoring**: Automatic violation detection
- **Multiple Exports**: HTML, JSON, CSV formats
- **Easy Configuration**: One file to edit
- **No Code Changes**: Runs independently

### 📊 Metrics Tracked

- **Response Times**: Min, Avg, P50, P90, P95, P99, Max
- **Throughput**: Requests per second
- **Success Rate**: Percentage of successful requests
- **Error Rate**: Percentage of failed requests
- **Per-Endpoint Stats**: Individual endpoint performance
- **Active Users**: Concurrent user count
- **Test Duration**: Actual test runtime

### 🎯 Test Scenarios

1. **Customer Order Flow** (40%)
   - Browse menu
   - Add items
   - Create order
   - Process payment

2. **Admin Dashboard** (30%)
   - Login
   - View tables
   - Check reports

3. **Split Payment** (20%)
   - Create order
   - Split invoice
   - Multiple payments

4. **Menu Browsing** (10%)
   - Browse categories
   - View items

## 🔧 Customization Levels

### Level 1: Basic (Edit config.js only)
- Change user count
- Change duration
- Adjust thresholds
- Modify scenario weights

### Level 2: Intermediate (Edit runner.js)
- Add custom scenarios
- Modify user behaviors
- Add new endpoints
- Custom think times

### Level 3: Advanced (Edit all files)
- Custom metrics
- Modified reports
- Integration with other tools
- Advanced monitoring

## 📚 Documentation Map

```
GETTING_STARTED.md
├── Quick setup
├── First test
└── Basic customization

README.md
├── Complete features
├── Configuration guide
├── Best practices
└── Troubleshooting

SUMMARY.md
├── Quick reference
├── Common use cases
└── Command cheat sheet

USAGE_EXAMPLES.md
├── Code examples
├── CI/CD integration
└── Advanced scenarios
```

## 🎯 Recommended Reading Order

1. **First**: `GETTING_STARTED.md` - Get up and running
2. **Second**: Run `quick-start.js` - See it in action
3. **Third**: `SUMMARY.md` - Learn key concepts
4. **Fourth**: `README.md` - Deep dive
5. **Fifth**: `USAGE_EXAMPLES.md` - Advanced usage

## 💡 Pro Tips

1. ✅ Always start with `GETTING_STARTED.md`
2. ✅ Run `quick-start.js` before full tests
3. ✅ Only edit `config.js` for most needs
4. ✅ Keep `README.md` open for reference
5. ✅ Archive HTML reports for comparison
6. ✅ Use `SUMMARY.md` for quick lookups

## 🚀 Get Started Now!

```bash
# Read the getting started guide
cat tests/performance/GETTING_STARTED.md

# Or run your first test immediately
node tests/performance/quick-start.js

# Then view the beautiful report
npm run report:performance
```

---

**Need Help?**
- 📖 Read `GETTING_STARTED.md` for setup
- 📚 Read `README.md` for full docs
- 💡 Read `USAGE_EXAMPLES.md` for examples
- 🔍 Check generated HTML report for insights

**Happy Testing! 🎯**
