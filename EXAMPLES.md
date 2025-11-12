# 📚 Advanced Test Examples

This file contains advanced examples for various testing scenarios.

## 📑 Table of Contents

- [API Testing](#api-testing)
- [Performance Testing](#performance-testing)
- [Page Object Model](#page-object-model)
- [Data-Driven Testing](#data-driven-testing)
- [Advanced Mobile Testing](#advanced-mobile-testing)
- [Security Testing](#security-testing)
- [Accessibility Testing](#accessibility-testing)
- [Responsive Design Testing](#responsive-design-testing)
- [Advanced Tips](#advanced-tips)

---

## API Testing

### GET Request Test

```javascript
const { test, expect } = require('@playwright/test');

test('API Test - Get User List', async ({ request }) => {
  const response = await request.get('https://api.example.com/users');
  
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  
  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);
  
  console.log(`✅ Retrieved ${data.length} users`);
});
```

### POST Request Test

```javascript
test('API Test - Create New User', async ({ request }) => {
  const newUser = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  };
  
  const response = await request.post('https://api.example.com/users', {
    data: newUser
  });
  
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(201);
  
  const createdUser = await response.json();
  expect(createdUser.name).toBe(newUser.name);
  expect(createdUser.email).toBe(newUser.email);
  expect(createdUser.id).toBeDefined();
  
  console.log(`✅ User created with ID: ${createdUser.id}`);
});
```

### Authentication Test

```javascript
test('API Test with Authentication', async ({ request }) => {
  // Get Token
  const loginResponse = await request.post('https://api.example.com/auth/login', {
    data: {
      email: 'user@example.com',
      password: 'password123'
    }
  });
  
  const { token } = await loginResponse.json();
  
  // Use Token in request
  const response = await request.get('https://api.example.com/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  expect(response.ok()).toBeTruthy();
  const profile = await response.json();
  expect(profile.email).toBe('user@example.com');
});
```

---

## Performance Testing

### Page Load Time Measurement

```javascript
test('Page Load Performance Test', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('https://example.com');
  await page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
  
  console.log(`⏱️ Load time: ${loadTime}ms`);
});
```

### API Performance Test

```javascript
test('API Performance Test', async ({ request }) => {
  const times = [];
  
  // Run 10 requests
  for (let i = 0; i < 10; i++) {
    const start = Date.now();
    await request.get('https://api.example.com/users');
    const duration = Date.now() - start;
    times.push(duration);
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const maxTime = Math.max(...times);
  const minTime = Math.min(...times);
  
  console.log(`📊 Average time: ${avgTime.toFixed(2)}ms`);
  console.log(`📊 Fastest request: ${minTime}ms`);
  console.log(`📊 Slowest request: ${maxTime}ms`);
  
  expect(avgTime).toBeLessThan(500);
});
```

### Simple Load Test

```javascript
test('Load Test - 50 Concurrent Requests', async ({ request }) => {
  const promises = [];
  const startTime = Date.now();
  
  // Create 50 concurrent requests
  for (let i = 0; i < 50; i++) {
    promises.push(request.get('https://api.example.com/health'));
  }
  
  const responses = await Promise.all(promises);
  const duration = Date.now() - startTime;
  
  // Check success of all requests
  const successfulRequests = responses.filter(r => r.ok()).length;
  
  console.log(`✅ ${successfulRequests}/${responses.length} requests succeeded`);
  console.log(`⏱️ Total duration: ${duration}ms`);
  
  expect(successfulRequests).toBe(50);
  expect(duration).toBeLessThan(5000);
});
```

---

## Page Object Model

### Page Object Definition

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }
  
  async goto() {
    await this.page.goto('/login');
  }
  
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
  
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
  
  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}

module.exports = LoginPage;
```

### Using Page Object

```javascript
const LoginPage = require('./pages/LoginPage');

test('Login using Page Object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  
  await expect(page).toHaveURL(/.*dashboard/);
});

test('Error message with wrong credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('wrong@example.com', 'wrongpass');
  
  expect(await loginPage.isErrorVisible()).toBeTruthy();
  const errorText = await loginPage.getErrorMessage();
  expect(errorText).toContain('Invalid credentials');
});
```

---

## Data-Driven Testing

### Using Data from File

```javascript
const testData = require('./data/users.json');

testData.forEach(user => {
  test(`Login test - ${user.name}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', user.email);
    await page.fill('[name="password"]', user.password);
    await page.click('button[type="submit"]');
    
    if (user.shouldSucceed) {
      await expect(page).toHaveURL(/.*dashboard/);
    } else {
      await expect(page.locator('.error-message')).toBeVisible();
    }
  });
});
```

### Using CSV

```javascript
const fs = require('fs');
const csv = require('csv-parser');

const testCases = [];

// Read CSV
fs.createReadStream('data/test-cases.csv')
  .pipe(csv())
  .on('data', (row) => testCases.push(row))
  .on('end', () => {
    testCases.forEach(testCase => {
      test(`${testCase.scenario}`, async ({ page }) => {
        // Execute test based on data
      });
    });
  });
```

---

## Advanced Mobile Testing

### Swipe and Scroll

```javascript
it('Swipe and Scroll Test', async function() {
  const { width, height } = await driver.getWindowSize();
  
  // Swipe from right to left
  await driver.touchPerform([
    { action: 'press', options: { x: width * 0.8, y: height * 0.5 } },
    { action: 'wait', options: { ms: 100 } },
    { action: 'moveTo', options: { x: width * 0.2, y: height * 0.5 } },
    { action: 'release' }
  ]);
  
  await driver.pause(1000);
  
  // Scroll up
  await driver.touchPerform([
    { action: 'press', options: { x: width * 0.5, y: height * 0.8 } },
    { action: 'wait', options: { ms: 100 } },
    { action: 'moveTo', options: { x: width * 0.5, y: height * 0.2 } },
    { action: 'release' }
  ]);
});
```

### Handling Alerts

```javascript
it('Handle Alerts', async function() {
  // Click button that shows Alert
  const button = await driver.$('~alert-button');
  await button.click();
  
  await driver.pause(1000);
  
  // Get Alert text
  const alertText = await driver.getAlertText();
  console.log(`Alert Text: ${alertText}`);
  
  // Accept Alert
  await driver.acceptAlert();
  
  // Or dismiss Alert
  // await driver.dismissAlert();
});
```

### Handling Permissions

```javascript
it('Handle App Permissions', async function() {
  // Grant location permission
  await driver.execute('mobile: shell', {
    command: 'appops',
    args: ['set', process.env.MOBILE_APP_PACKAGE, 'android:fine_location', 'allow']
  });
  
  // Grant camera permission
  await driver.execute('mobile: shell', {
    command: 'pm',
    args: ['grant', process.env.MOBILE_APP_PACKAGE, 'android.permission.CAMERA']
  });
});
```

### Orientation Test

```javascript
it('Test Orientation Change', async function() {
  // Get current orientation
  const currentOrientation = await driver.getOrientation();
  console.log(`Current orientation: ${currentOrientation}`);
  
  // Change to landscape
  await driver.setOrientation('LANDSCAPE');
  await driver.pause(2000);
  
  // Verify orientation
  const newOrientation = await driver.getOrientation();
  expect(newOrientation).toBe('LANDSCAPE');
  
  // Return to portrait
  await driver.setOrientation('PORTRAIT');
});
```

---

## Security Testing

### XSS Test

```javascript
test('XSS Protection Test', async ({ page }) => {
  const xssPayload = '<script>alert("XSS")</script>';
  
  await page.goto('/search');
  await page.fill('[name="query"]', xssPayload);
  await page.click('button[type="submit"]');
  
  // Verify script was not executed
  const pageContent = await page.content();
  expect(pageContent).not.toContain('<script>alert("XSS")</script>');
  
  // Verify text was properly escaped
  const results = await page.locator('.search-results').textContent();
  expect(results).toContain('&lt;script&gt;');
});
```

### SQL Injection Test

```javascript
test('SQL Injection Protection Test', async ({ request }) => {
  const sqlPayload = "'; DROP TABLE users; --";
  
  const response = await request.post('/api/login', {
    data: {
      email: sqlPayload,
      password: 'password'
    }
  });
  
  // Should fail safely
  expect(response.status()).toBe(400);
  
  // Verify SQL was not executed
  const dbCheck = await request.get('/api/users');
  expect(dbCheck.ok()).toBeTruthy();
});
```

### CSRF Test

```javascript
test('CSRF Protection Test', async ({ page, request }) => {
  await page.goto('/login');
  
  // Login
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Attempt to send request without CSRF token
  const response = await request.post('/api/profile/update', {
    data: {
      name: 'Hacked Name'
    }
    // Without CSRF token
  });
  
  expect(response.status()).toBe(403);
});
```

---

## Accessibility Testing

```javascript
test('Accessibility Test', async ({ page }) => {
  await page.goto('/');
  
  // Check for alt text on images
  const images = await page.locator('img').all();
  for (const img of images) {
    const alt = await img.getAttribute('alt');
    expect(alt).toBeTruthy();
  }
  
  // Check ARIA labels
  const buttons = await page.locator('button').all();
  for (const button of buttons) {
    const ariaLabel = await button.getAttribute('aria-label');
    const text = await button.textContent();
    expect(ariaLabel || text).toBeTruthy();
  }
  
  // Check color contrast (requires additional tool)
  // await injectAxe(page);
  // const results = await checkA11y(page);
});
```

---

## Responsive Design Testing

```javascript
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

viewports.forEach(viewport => {
  test(`Test ${viewport.name} - ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height
    });
    
    await page.goto('/');
    
    // Take screenshot
    await page.screenshot({
      path: `screenshots/${viewport.name}.png`,
      fullPage: true
    });
    
    // Verify elements appear correctly
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
```

---

## Advanced Tips

### Using Fixtures

```javascript
const { test: base } = require('@playwright/test');

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login once
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    await use(page);
  }
});

test('Test with pre-authenticated user', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/profile');
  // User is already logged in
});
```

### Retry Strategy

```javascript
test('Test with Custom Retry', async ({ page }) => {
  test.setTimeout(60000);
  
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      await page.goto('/flaky-page');
      await page.locator('.dynamic-content').waitFor({ timeout: 5000 });
      break;
    } catch (error) {
      attempts++;
      if (attempts === maxAttempts) throw error;
      console.log(`Retry attempt ${attempts}/${maxAttempts}`);
      await page.waitForTimeout(2000);
    }
  }
});
```

---

**For more examples, see:**
- [Playwright Examples](https://playwright.dev/docs/examples)
- [Appium Examples](https://github.com/appium/appium/tree/master/sample-code)