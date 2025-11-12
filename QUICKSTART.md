# 🚀 Quick Start Guide

## Setup Steps in 5 Minutes

### 1️⃣ Installation

```bash
# Clone the project
git clone <repository-url>
cd test-automation-framework

# Automatic installation
npm run setup
```

### 2️⃣ Environment Configuration

Open `.env` file and add:

```env
# Minimum required
APP_URL=https://example.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
EMAIL_TO=stakeholder@example.com
```

### 3️⃣ Run First Test

```bash
# Web test
npm run test:web

# Or using Docker
npm run docker:test
```

---

## 📝 Basic Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Environment setup and automatic installation |
| `npm run test:web` | Run web tests |
| `npm run test:mobile` | Run mobile tests |
| `npm run test:all` | Run all tests |
| `npm run report` | Show Playwright report |
| `npm run docker:build` | Build Docker images |
| `npm run docker:test` | Run tests in Docker |

---

## 🎯 Writing a New Test

### Simple Web Test

Create `tests/web/my-test.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test('Homepage Test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Homepage/);
});
```

### Simple Mobile Test

Create `tests/mobile/my-mobile-test.js`:

```javascript
const { remote } = require('webdriverio');
const appiumConfig = require('../../config/appium.config');

describe('Simple Test', () => {
  let driver;

  before(async function() {
    const options = { ...appiumConfig.android };
    driver = await remote(options);
  });

  it('Launch App', async function() {
    const element = await driver.$('~button-id');
    await element.click();
  });
});
```

---

## 🔧 GitHub Actions Setup

### 1. Add Secrets in GitHub

Go to: `Settings > Secrets > Actions`

Add:
- `SLACK_WEBHOOK_URL`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_TO`
- `APP_URL`

### 2. Push Code

```bash
git add .
git commit -m "Add test automation framework"
git push
```

### 3. Monitor Execution

Follow in **Actions** tab on GitHub

---

## 🐳 Using Docker

### Build and Run

```bash
# Build once
docker-compose build

# Run tests
docker-compose up

# Run in background
docker-compose up -d

# Stop
docker-compose down
```

### Run specific service

```bash
# Web only
docker-compose up playwright

# Mobile only
docker-compose up appium
```

---

## 📱 Android Testing Setup

### 1. Start Emulator

```bash
# Create emulator
avdmanager create avd -n test -k "system-images;android-33;google_apis;x86_64"

# Run
emulator -avd test
```

### 2. Start Appium

```bash
npx appium --address 0.0.0.0 --port 4723
```

### 3. Run Tests

```bash
npm run test:mobile
```

---

## 🔔 Slack Configuration

### 1. Create Webhook

1. Go to: https://api.slack.com/messaging/webhooks
2. Select your channel
3. Copy Webhook URL

### 2. Add to Environment

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00/B00/xxx
```

### 3. Test Sending

```bash
node -e "
const SlackNotifier = require('./utils/slack-notifier');
const slack = new SlackNotifier();
slack.sendMessage('Test! 🎉');
"
```

---

## 📧 Email Configuration

### Gmail

1. Enable two-factor authentication
2. Create App Password: https://myaccount.google.com/apppasswords
3. Use it in `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
EMAIL_TO=recipient1@example.com,recipient2@example.com
```

### Other SMTP

```env
SMTP_HOST=mail.your-provider.com
SMTP_PORT=587  # or 465 for SSL
SMTP_USER=username
SMTP_PASS=password
```

---

## 🐛 Common Troubleshooting

### Browsers not working

```bash
npx playwright install --with-deps
```

### Appium not connecting

```bash
# Check devices
adb devices

# Restart ADB
adb kill-server
adb start-server

# Check Appium
npx appium driver list
npx appium driver install uiautomator2
```

### Docker not working

```bash
# Rebuild
docker-compose build --no-cache

# Clean
docker system prune -a

# Check containers
docker ps -a
```

### Notifications not sending

```bash
# Test connection
node -e "
require('dotenv').config();
console.log('SLACK_WEBHOOK_URL:', process.env.SLACK_WEBHOOK_URL ? '✅ exists' : '❌ missing');
console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ exists' : '❌ missing');
"
```

---

## 📊 Reading Reports

### Playwright HTML Report

```bash
# Show report
npm run report

# Or open manually
open playwright-report/index.html
```

### Screenshots

Located in: `test-results/`

### JSON Results

Located in: `test-results/results.json`

---

## 🎓 Advanced Examples

### API Testing

```javascript
test('API Test', async ({ request }) => {
  const response = await request.get('/api/users');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data).toHaveLength(10);
});
```

### Video Capture

```javascript
test('With Video', async ({ page }) => {
  await page.goto('/');
  // Video is automatically recorded on failure
});
```

### Performance Testing

```javascript
test('Performance Measurement', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - start;
  expect(loadTime).toBeLessThan(3000);
});
```

---

## 🔗 Useful Links

- [Playwright Docs](https://playwright.dev/)
- [Appium Docs](https://appium.io/)
- [WebDriverIO Docs](https://webdriver.io/)
- [GitHub Actions Docs](https://docs.github.com/actions)

---

## 💡 Quick Tips

✅ **Do:**
- Write independent tests
- Use Page Objects
- Test real scenarios
- Clean data after testing

❌ **Don't:**
- Store sensitive data in code
- Rely on test order
- Use `waitForTimeout` too much
- Ignore failed tests

---

**Ready to Start?** 🚀

```bash
npm run setup
npm run test:web
```