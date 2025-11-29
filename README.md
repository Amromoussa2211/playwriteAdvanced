# 🚀 Comprehensive Test Automation Framework

An integrated automation framework that supports web testing using **Playwright** and mobile testing using **Appium**, with a ready-to-use CI/CD pipeline and automatic result delivery to **Slack** and **Email**.

## ✨ Features

- ✅ **Web Testing**: Using Playwright with support for all browsers (Chrome, Firefox, Safari)
- ✅ **Mobile Testing**: Using Appium for Android and iOS
- ✅ **Performance Testing**: Comprehensive load testing framework with beautiful HTML reports
- ✅ **Automatic Installation**: Automatically installs all dependencies on first run
- ✅ **Docker**: Full support for running with Docker for environment consistency
- ✅ **CI/CD**: Ready pipeline on GitHub Actions
- ✅ **Slack Notifications**: Automatically send results to Slack channel
- ✅ **Email Notifications**: Send detailed reports to stakeholders via email
- ✅ **Comprehensive Reports**: Interactive HTML reports with screenshots and videos
- ✅ **Secure Management**: Use environment variables and secrets securely

## 📋 Prerequisites

### For Local Running (without Docker)

- **Node.js** 18 or later
- **npm** or **yarn**
- **Git**

### For Docker Running

- **Docker** 20.10 or later
- **Docker Compose** 2.0 or later

### For Android Testing

- **Java JDK** 11 or later
- **Android SDK** (automatically installed in Docker)

### For iOS Testing

- **macOS** (required)
- **Xcode** and **Xcode Command Line Tools**
- **iOS Simulator**

## 🚀 Quick Start

### 1. Clone the Project

```bash
git clone <repository-url>
cd test-automation-framework
```

### 2. Automatic Installation

```bash
npm run setup
```

This command will:
- ✅ Check Node.js and npm
- ✅ Install all dependencies
- ✅ Install Playwright browsers
- ✅ Install Appium drivers
- ✅ Create `.env` file from `.env.example`
- ✅ Create required directories

### 3. Environment Configuration

Edit the `.env` file and add your data:

```env
# Slack data
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Email data
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_TO=stakeholder1@example.com,stakeholder2@example.com

# Web testing data
APP_URL=https://your-app-url.com

# Mobile testing data
MOBILE_APP_PACKAGE=com.example.yourapp
MOBILE_APP_ACTIVITY=.MainActivity
```

### 4. Running Tests

#### Web tests only
```bash
npm run test:web
```

#### Mobile tests only
```bash
npm run test:mobile
```

#### All tests
```bash
npm run test:all
```

#### Performance tests
```bash
npm run test:performance
```

#### Using Docker
```bash
# Build containers
npm run docker:build

# Run tests
npm run docker:test
```

## 📁 Project Structure

```
test-automation-framework/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions workflow
├── config/
│   ├── playwright.config.js      # Playwright settings
│   └── appium.config.js          # Appium settings
├── docker/
│   ├── Dockerfile.playwright     # Docker for web
│   └── Dockerfile.appium         # Docker for mobile
├── tests/
│   ├── web/                      # Web tests
│   │   ├── login.spec.js
│   │   └── homepage.spec.js
│   ├── mobile/                   # Mobile tests
│   │   ├── android.test.js
│   │   ├── ios.test.js
│   │   └── runner.js
│   └── performance/              # Performance tests
│       ├── config.js             # Performance test config
│       ├── runner.js             # Test execution engine
│       ├── quick-start.js        # Quick test example
│       └── *.md                  # Documentation
├── utils/
│   ├── slack-notifier.js         # Slack utility
│   ├── email-notifier.js         # Email utility
│   └── results-parser.js         # Results parser
├── scripts/
│   ├── setup.js                  # Setup script
│   └── post-test.js              # Post-test processing
├── reports/                      # Reports
├── test-results/                 # Test results
│   └── performance/              # Performance test results
│       ├── performance-report.html
│       ├── performance-metrics.json
│       └── performance-data.csv
├── playwright-report/            # Playwright HTML reports
├── docker-compose.yml            # Docker Compose
├── package.json                  # Dependencies
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## 🔧 CI/CD Setup

### GitHub Actions

The project comes with a ready workflow in `.github/workflows/ci.yml`

#### Setting up Secrets

Go to `Settings > Secrets and variables > Actions` in your GitHub repository and add:

| Secret Name | Description | Required |
|------------|-------------|----------|
| `SLACK_WEBHOOK_URL` | Slack Webhook URL | Yes |
| `SMTP_HOST` | SMTP server | Yes |
| `SMTP_PORT` | SMTP port | Yes |
| `SMTP_USER` | Email username | Yes |
| `SMTP_PASS` | Email password | Yes |
| `EMAIL_TO` | Recipients (comma-separated) | Yes |
| `APP_URL` | Application URL | Yes |
| `MOBILE_APP_PACKAGE` | App package name | For mobile |

#### Manual Trigger

You can manually run tests from the **Actions** tab in GitHub and select test type:
- `all` - All tests
- `web` - Web tests only
- `mobile` - Mobile tests only

### GitLab CI

Can be converted to GitLab CI by creating `.gitlab-ci.yml` file

## 📱 Mobile Testing Setup

### Android

#### Running emulator locally

```bash
# Create new emulator
avdmanager create avd -n test_emulator -k "system-images;android-33;google_apis;x86_64"

# Run emulator
emulator -avd test_emulator

# Run Appium
npx appium --address 0.0.0.0 --port 4723

# In another window, run tests
npm run test:mobile
```

#### Using real device

1. Enable Developer mode on the device
2. Enable USB Debugging
3. Connect device to computer
4. Verify device appears: `adb devices`
5. Run tests

### iOS

Requires macOS with Xcode:

```bash
# Run iOS simulator
xcrun simctl boot "iPhone 14"

# Run Appium
npx appium --address 0.0.0.0 --port 4723

# Run tests
npm run test:mobile
```

## 🚀 Performance Testing

### Overview

The framework includes a comprehensive performance testing suite that simulates high request loads, identifies bottlenecks, and generates detailed HTML reports.

### Quick Start

```bash
# Run quick test (30 seconds, 10 users)
node tests/performance/quick-start.js

# Run full test (60 seconds, 50 users)
npm run test:performance

# View HTML report
npm run report:performance
```

### Features

- ✅ **Configurable Load Testing**: 1-1000+ concurrent users
- ✅ **Multiple Scenarios**: Customer orders, admin operations, split payments
- ✅ **Comprehensive Metrics**: Response times, throughput, error rates
- ✅ **Beautiful HTML Reports**: Charts, tables, threshold violations
- ✅ **Easy Configuration**: Single config file to edit
- ✅ **No Code Changes**: Runs independently of your project

### Configuration

Edit `tests/performance/config.js`:

```javascript
module.exports = {
  // Load parameters
  CONCURRENT_USERS: 50,      // Number of users
  TEST_DURATION: 60,         // Duration in seconds
  RAMP_UP_TIME: 10,          // Ramp-up time
  
  // Performance thresholds
  THRESHOLDS: {
    RESPONSE_TIME: {
      P95: 2000,             // 95% < 2s
    },
    ERROR_RATE: 1,           // < 1% errors
    MIN_THROUGHPUT: 100      // > 100 req/s
  }
};
```

### Test Scenarios

1. **Customer Order Flow** (40% of users)
   - Browse menu → Add items → Order → Pay

2. **Admin Dashboard** (30% of users)
   - Login → View tables → Check reports

3. **Split Payment** (20% of users)
   - Create order → Split invoice → Multiple payments

4. **Menu Browsing** (10% of users)
   - Browse categories → View items

### Documentation

- **Getting Started**: `tests/performance/GETTING_STARTED.md`
- **Full Documentation**: `tests/performance/README.md`
- **Quick Reference**: `tests/performance/SUMMARY.md`
- **Examples**: `tests/performance/USAGE_EXAMPLES.md`

### Common Use Cases

```bash
# Daily health check (10 users, 30s)
node tests/performance/quick-start.js

# Pre-release validation (100 users, 5min)
# Edit config.js: CONCURRENT_USERS: 100, TEST_DURATION: 300
npm run test:performance

# Stress testing (500 users, 10min)
# Edit config.js: CONCURRENT_USERS: 500, TEST_DURATION: 600
npm run test:performance
```

### Reports

After running tests, find results in:
- **HTML Report**: `test-results/performance/performance-report.html`
- **JSON Data**: `test-results/performance/performance-metrics.json`
- **CSV Export**: `test-results/performance/performance-data.csv`

## 📊 Reports

### Playwright Reports

Interactive HTML reports are automatically generated in `playwright-report/`

To view report:
```bash
npm run report
```

### Screenshots and Videos

Screenshots and videos are automatically saved on test failures in `test-results/`

## 🔔 Setting up Notifications

### Slack

1. Go to [Slack API](https://api.slack.com/messaging/webhooks)
2. Create a new Incoming Webhook
3. Copy the URL and add it to `.env` or GitHub Secrets

### Email

#### Gmail

1. Enable two-factor authentication
2. Create "App Password" from [here](https://myaccount.google.com/apppasswords)
3. Use App Password in `SMTP_PASS`

#### Custom SMTP

Configure `SMTP_HOST` and `SMTP_PORT` according to your provider

## 🐳 Docker

### Building Images

```bash
# Build Playwright image
docker build -f docker/Dockerfile.playwright -t playwright-tests .

# Build Appium image
docker build -f docker/Dockerfile.appium -t appium-tests .

# Or use Docker Compose
docker-compose build
```

### Running Tests

```bash
# Run web only
docker-compose up playwright

# Run mobile only
docker-compose up appium

# Run all
docker-compose up
```

### Stop Containers

```bash
docker-compose down
```

## 🧪 Writing New Tests

### New Web Test

Create a file in `tests/web/your-test.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('New Tests', () => {
  test('Example test', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Page Title/);
  });
});
```

### New Mobile Test

Create a file in `tests/mobile/your-mobile-test.js`:

```javascript
const { remote } = require('webdriverio');
const appiumConfig = require('../../config/appium.config');

describe('New Mobile Test', () => {
  let driver;

  before(async function() {
    this.timeout(60000);
    const options = {
      ...appiumConfig.android,
      hostname: appiumConfig.host,
      port: appiumConfig.port,
      path: appiumConfig.path
    };
    driver = await remote(options);
  });

  after(async function() {
    if (driver) await driver.deleteSession();
  });

  it('Example test', async function() {
    const element = await driver.$('~element-id');
    await element.waitForDisplayed({ timeout: 10000 });
  });
});
```

Then add the file to `tests/mobile/runner.js`

## 📝 Tips and Best Practices

### Performance

- Use parallel test execution
- Minimize `waitForTimeout` and use `waitForSelector` instead
- Use Page Objects pattern for code reusability

### Maintenance

- Make tests independent of each other
- Use dynamic data instead of static data
- Clean up data after each test

### Security

- Don't store sensitive data in code
- Use `.env` and environment variables
- Add `.env` to `.gitignore`

## 🛠️ Troubleshooting

### Test not working

```bash
# Check dependencies
npm install

# Reinstall browsers
npx playwright install --with-deps

# Check Appium
npx appium driver list
```

### Docker issues

```bash
# Rebuild images
docker-compose build --no-cache

# Clean old containers
docker system prune -a
```

### Emulator issues

```bash
# Check connected devices
adb devices

# Restart ADB
adb kill-server
adb start-server
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Appium Documentation](https://appium.io/)
- [WebDriverIO Documentation](https://webdriver.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License

## 👨‍💻 Author

**AMR IBrahem Moussa  01143236791 || Amro_kaza@hotmail.com**

---

## 💡 Need Help?

If you encounter any issues or have questions, please:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search in [Issues](https://github.com/your-repo/issues)
3. Open a new issue with problem details

---

**Ready to Use! 🚀**

Start now by running `npm run setup` and enjoy automated testing!