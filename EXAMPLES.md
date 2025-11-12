# 📚 أمثلة متقدمة للاختبارات

هذا الملف يحتوي على أمثلة متقدمة لمختلف سيناريوهات الاختبار.

## 📑 جدول المحتويات

- [اختبارات API](#اختبارات-api)
- [اختبارات الأداء](#اختبارات-الأداء)
- [Page Object Model](#page-object-model)
- [Data-Driven Testing](#data-driven-testing)
- [اختبارات متقدمة للمحمول](#اختبارات-متقدمة-للمحمول)
- [اختبارات الأمان](#اختبارات-الأمان)

---

## اختبارات API

### اختبار GET Request

```javascript
const { test, expect } = require('@playwright/test');

test('اختبار API - الحصول على قائمة المستخدمين', async ({ request }) => {
  const response = await request.get('https://api.example.com/users');
  
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  
  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);
  
  console.log(`✅ تم الحصول على ${data.length} مستخدم`);
});
```

### اختبار POST Request

```javascript
test('اختبار API - إنشاء مستخدم جديد', async ({ request }) => {
  const newUser = {
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
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
  
  console.log(`✅ تم إنشاء المستخدم بـ ID: ${createdUser.id}`);
});
```

### اختبار مع Authentication

```javascript
test('اختبار API مع المصادقة', async ({ request }) => {
  // الحصول على Token
  const loginResponse = await request.post('https://api.example.com/auth/login', {
    data: {
      email: 'user@example.com',
      password: 'password123'
    }
  });
  
  const { token } = await loginResponse.json();
  
  // استخدام Token في الطلب
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

## اختبارات الأداء

### قياس وقت تحميل الصفحة

```javascript
test('قياس أداء تحميل الصفحة', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('https://example.com');
  await page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000); // يجب أن تحمل خلال 3 ثواني
  
  console.log(`⏱️  وقت التحميل: ${loadTime}ms`);
});
```

### قياس أداء API

```javascript
test('قياس أداء API', async ({ request }) => {
  const times = [];
  
  // تشغيل 10 طلبات
  for (let i = 0; i < 10; i++) {
    const start = Date.now();
    await request.get('https://api.example.com/users');
    const duration = Date.now() - start;
    times.push(duration);
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const maxTime = Math.max(...times);
  const minTime = Math.min(...times);
  
  console.log(`📊 متوسط الوقت: ${avgTime.toFixed(2)}ms`);
  console.log(`📊 أسرع طلب: ${minTime}ms`);
  console.log(`📊 أبطأ طلب: ${maxTime}ms`);
  
  expect(avgTime).toBeLessThan(500);
});
```

### اختبار الحمل البسيط

```javascript
test('اختبار الحمل - 50 طلب متزامن', async ({ request }) => {
  const promises = [];
  const startTime = Date.now();
  
  // إنشاء 50 طلب متزامن
  for (let i = 0; i < 50; i++) {
    promises.push(request.get('https://api.example.com/health'));
  }
  
  const responses = await Promise.all(promises);
  const duration = Date.now() - startTime;
  
  // التحقق من نجاح جميع الطلبات
  const successfulRequests = responses.filter(r => r.ok()).length;
  
  console.log(`✅ ${successfulRequests}/${responses.length} طلب نجح`);
  console.log(`⏱️  المدة الإجمالية: ${duration}ms`);
  
  expect(successfulRequests).toBe(50);
  expect(duration).toBeLessThan(5000);
});
```

---

## Page Object Model

### تعريف Page Object

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

### استخدام Page Object

```javascript
const LoginPage = require('./pages/LoginPage');

test('تسجيل الدخول باستخدام Page Object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  
  await expect(page).toHaveURL(/.*dashboard/);
});

test('رسالة خطأ عند بيانات خاطئة', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('wrong@example.com', 'wrongpass');
  
  expect(await loginPage.isErrorVisible()).toBeTruthy();
  const errorText = await loginPage.getErrorMessage();
  expect(errorText).toContain('بيانات غير صحيحة');
});
```

---

## Data-Driven Testing

### استخدام البيانات من ملف

```javascript
const testData = require('./data/users.json');

testData.forEach(user => {
  test(`اختبار تسجيل دخول - ${user.name}`, async ({ page }) => {
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

### استخدام CSV

```javascript
const fs = require('fs');
const csv = require('csv-parser');

const testCases = [];

// قراءة CSV
fs.createReadStream('data/test-cases.csv')
  .pipe(csv())
  .on('data', (row) => testCases.push(row))
  .on('end', () => {
    testCases.forEach(testCase => {
      test(`${testCase.scenario}`, async ({ page }) => {
        // تنفيذ الاختبار حسب البيانات
      });
    });
  });
```

---

## اختبارات متقدمة للمحمول

### Swipe و Scroll

```javascript
it('اختبار السحب والتمرير', async function() {
  const { width, height } = await driver.getWindowSize();
  
  // السحب من اليمين لليسار
  await driver.touchPerform([
    { action: 'press', options: { x: width * 0.8, y: height * 0.5 } },
    { action: 'wait', options: { ms: 100 } },
    { action: 'moveTo', options: { x: width * 0.2, y: height * 0.5 } },
    { action: 'release' }
  ]);
  
  await driver.pause(1000);
  
  // التمرير لأعلى
  await driver.touchPerform([
    { action: 'press', options: { x: width * 0.5, y: height * 0.8 } },
    { action: 'wait', options: { ms: 100 } },
    { action: 'moveTo', options: { x: width * 0.5, y: height * 0.2 } },
    { action: 'release' }
  ]);
});
```

### التعامل مع Alerts

```javascript
it('التعامل مع التنبيهات', async function() {
  // النقر على زر يظهر Alert
  const button = await driver.$('~alert-button');
  await button.click();
  
  await driver.pause(1000);
  
  // الحصول على نص Alert
  const alertText = await driver.getAlertText();
  console.log(`Alert Text: ${alertText}`);
  
  // قبول Alert
  await driver.acceptAlert();
  
  // أو رفض Alert
  // await driver.dismissAlert();
});
```

### التعامل مع الأذونات

```javascript
it('التعامل مع أذونات التطبيق', async function() {
  // منح إذن الموقع
  await driver.execute('mobile: shell', {
    command: 'appops',
    args: ['set', process.env.MOBILE_APP_PACKAGE, 'android:fine_location', 'allow']
  });
  
  // منح إذن الكاميرا
  await driver.execute('mobile: shell', {
    command: 'pm',
    args: ['grant', process.env.MOBILE_APP_PACKAGE, 'android.permission.CAMERA']
  });
});
```

### اختبار الاتجاه (Orientation)

```javascript
it('اختبار تغيير الاتجاه', async function() {
  // الحصول على الاتجاه الحالي
  const currentOrientation = await driver.getOrientation();
  console.log(`الاتجاه الحالي: ${currentOrientation}`);
  
  // تغيير إلى الوضع الأفقي
  await driver.setOrientation('LANDSCAPE');
  await driver.pause(2000);
  
  // التحقق من الاتجاه
  const newOrientation = await driver.getOrientation();
  expect(newOrientation).toBe('LANDSCAPE');
  
  // العودة إلى الوضع العمودي
  await driver.setOrientation('PORTRAIT');
});
```

---

## اختبارات الأمان

### اختبار XSS

```javascript
test('اختبار حماية من XSS', async ({ page }) => {
  const xssPayload = '<script>alert("XSS")</script>';
  
  await page.goto('/search');
  await page.fill('[name="query"]', xssPayload);
  await page.click('button[type="submit"]');
  
  // التحقق من أن السكريبت لم يتم تنفيذه
  const pageContent = await page.content();
  expect(pageContent).not.toContain('<script>alert("XSS")</script>');
  
  // التحقق من أن النص تم escape بشكل صحيح
  const results = await page.locator('.search-results').textContent();
  expect(results).toContain('&lt;script&gt;');
});
```

### اختبار SQL Injection

```javascript
test('اختبار حماية من SQL Injection', async ({ request }) => {
  const sqlPayload = "'; DROP TABLE users; --";
  
  const response = await request.post('/api/login', {
    data: {
      email: sqlPayload,
      password: 'password'
    }
  });
  
  // يجب أن يفشل الطلب بشكل آمن
  expect(response.status()).toBe(400);
  
  // التحقق من عدم تنفيذ SQL
  const dbCheck = await request.get('/api/users');
  expect(dbCheck.ok()).toBeTruthy();
});
```

### اختبار CSRF

```javascript
test('اختبار حماية CSRF', async ({ page, request }) => {
  await page.goto('/login');
  
  // تسجيل الدخول
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // محاولة إرسال طلب بدون CSRF token
  const response = await request.post('/api/profile/update', {
    data: {
      name: 'Hacked Name'
    }
    // بدون CSRF token
  });
  
  expect(response.status()).toBe(403);
});
```

---

## اختبارات Accessibility

```javascript
test('اختبار إمكانية الوصول', async ({ page }) => {
  await page.goto('/');
  
  // التحقق من وجود alt text للصور
  const images = await page.locator('img').all();
  for (const img of images) {
    const alt = await img.getAttribute('alt');
    expect(alt).toBeTruthy();
  }
  
  // التحقق من ARIA labels
  const buttons = await page.locator('button').all();
  for (const button of buttons) {
    const ariaLabel = await button.getAttribute('aria-label');
    const text = await button.textContent();
    expect(ariaLabel || text).toBeTruthy();
  }
  
  // التحقق من التباين اللوني (يحتاج إلى أداة إضافية)
  // await injectAxe(page);
  // const results = await checkA11y(page);
});
```

---

## اختبارات Responsive Design

```javascript
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

viewports.forEach(viewport => {
  test(`اختبار ${viewport.name} - ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height
    });
    
    await page.goto('/');
    
    // التقاط لقطة شاشة
    await page.screenshot({
      path: `screenshots/${viewport.name}.png`,
      fullPage: true
    });
    
    // التحقق من ظهور العناصر بشكل صحيح
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
```

---

## نصائح متقدمة

### استخدام Fixtures

```javascript
const { test: base } = require('@playwright/test');

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // تسجيل الدخول مرة واحدة
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    await use(page);
  }
});

test('اختبار مع مصادقة جاهزة', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/profile');
  // المستخدم مسجل دخول بالفعل
});
```

### Retry Strategy

```javascript
test('اختبار مع إعادة محاولة مخصصة', async ({ page }) => {
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
      console.log(`إعادة المحاولة ${attempts}/${maxAttempts}`);
      await page.waitForTimeout(2000);
    }
  }
});
```

---

**للمزيد من الأمثلة، راجع:**
- [Playwright Examples](https://playwright.dev/docs/examples)
- [Appium Examples](https://github.com/appium/appium/tree/master/sample-code)
