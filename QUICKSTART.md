# 🚀 دليل البدء السريع

## خطوات الإعداد في 5 دقائق

### 1️⃣ التثبيت

```bash
# استنساخ المشروع
git clone <repository-url>
cd test-automation-framework

# التثبيت التلقائي
npm run setup
```

### 2️⃣ تكوين البيئة

افتح ملف `.env` وأضف:

```env
# الحد الأدنى المطلوب
APP_URL=https://example.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
EMAIL_TO=stakeholder@example.com
```

### 3️⃣ تشغيل أول اختبار

```bash
# اختبار الويب
npm run test:web

# أو باستخدام Docker
npm run docker:test
```

---

## 📝 الأوامر الأساسية

| الأمر | الوصف |
|------|-------|
| `npm run setup` | إعداد البيئة والتثبيت التلقائي |
| `npm run test:web` | تشغيل اختبارات الويب |
| `npm run test:mobile` | تشغيل اختبارات المحمول |
| `npm run test:all` | تشغيل جميع الاختبارات |
| `npm run report` | عرض تقرير Playwright |
| `npm run docker:build` | بناء Docker images |
| `npm run docker:test` | تشغيل الاختبارات في Docker |

---

## 🎯 كتابة اختبار جديد

### اختبار ويب بسيط

أنشئ `tests/web/my-test.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test('اختبار الصفحة الرئيسية', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/الصفحة الرئيسية/);
});
```

### اختبار محمول بسيط

أنشئ `tests/mobile/my-mobile-test.js`:

```javascript
const { remote } = require('webdriverio');
const appiumConfig = require('../../config/appium.config');

describe('اختبار بسيط', () => {
  let driver;

  before(async function() {
    const options = { ...appiumConfig.android };
    driver = await remote(options);
  });

  it('فتح التطبيق', async function() {
    const element = await driver.$('~button-id');
    await element.click();
  });
});
```

---

## 🔧 إعداد GitHub Actions

### 1. أضف Secrets في GitHub

انتقل إلى: `Settings > Secrets > Actions`

أضف:
- `SLACK_WEBHOOK_URL`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_TO`
- `APP_URL`

### 2. Push الكود

```bash
git add .
git commit -m "إضافة إطار الاختبار"
git push
```

### 3. مراقبة التشغيل

تابع في تبويب **Actions** على GitHub

---

## 🐳 استخدام Docker

### البناء والتشغيل

```bash
# بناء مرة واحدة
docker-compose build

# تشغيل الاختبارات
docker-compose up

# تشغيل في الخلفية
docker-compose up -d

# إيقاف
docker-compose down
```

### تشغيل خدمة معينة

```bash
# الويب فقط
docker-compose up playwright

# المحمول فقط
docker-compose up appium
```

---

## 📱 إعداد اختبارات Android

### 1. تشغيل المحاكي

```bash
# إنشاء محاكي
avdmanager create avd -n test -k "system-images;android-33;google_apis;x86_64"

# تشغيل
emulator -avd test
```

### 2. تشغيل Appium

```bash
npx appium --address 0.0.0.0 --port 4723
```

### 3. تشغيل الاختبارات

```bash
npm run test:mobile
```

---

## 🔔 تكوين Slack

### 1. إنشاء Webhook

1. اذهب إلى: https://api.slack.com/messaging/webhooks
2. اختر قناتك
3. انسخ Webhook URL

### 2. أضفه للبيئة

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00/B00/xxx
```

### 3. اختبر الإرسال

```bash
node -e "
const SlackNotifier = require('./utils/slack-notifier');
const slack = new SlackNotifier();
slack.sendMessage('اختبار! 🎉');
"
```

---

## 📧 تكوين البريد الإلكتروني

### Gmail

1. فعّل التحقق بخطوتين
2. أنشئ App Password: https://myaccount.google.com/apppasswords
3. استخدمه في `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
EMAIL_TO=recipient1@example.com,recipient2@example.com
```

### SMTP آخر

```env
SMTP_HOST=mail.your-provider.com
SMTP_PORT=587  # أو 465 للـ SSL
SMTP_USER=username
SMTP_PASS=password
```

---

## 🐛 حل المشاكل الشائعة

### المتصفحات لا تعمل

```bash
npx playwright install --with-deps
```

### Appium لا يتصل

```bash
# تحقق من الأجهزة
adb devices

# أعد تشغيل ADB
adb kill-server
adb start-server

# تحقق من Appium
npx appium driver list
npx appium driver install uiautomator2
```

### Docker لا يعمل

```bash
# أعد البناء
docker-compose build --no-cache

# نظف
docker system prune -a

# تحقق من الحاويات
docker ps -a
```

### الإشعارات لا تُرسل

```bash
# اختبر الاتصال
node -e "
require('dotenv').config();
console.log('SLACK_WEBHOOK_URL:', process.env.SLACK_WEBHOOK_URL ? '✅ موجود' : '❌ مفقود');
console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ موجود' : '❌ مفقود');
"
```

---

## 📊 قراءة التقارير

### Playwright HTML Report

```bash
# عرض التقرير
npm run report

# أو افتح يدوياً
open playwright-report/index.html
```

### لقطات الشاشة

موجودة في: `test-results/`

### JSON Results

موجودة في: `test-results/results.json`

---

## 🎓 أمثلة متقدمة

### اختبار API

```javascript
test('اختبار API', async ({ request }) => {
  const response = await request.get('/api/users');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data).toHaveLength(10);
});
```

### التقاط فيديو

```javascript
test('مع فيديو', async ({ page }) => {
  await page.goto('/');
  // الفيديو يُسجل تلقائياً عند الفشل
});
```

### اختبار الأداء

```javascript
test('قياس الأداء', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - start;
  expect(loadTime).toBeLessThan(3000);
});
```

---

## 🔗 روابط مفيدة

- [Playwright Docs](https://playwright.dev/)
- [Appium Docs](https://appium.io/)
- [WebDriverIO Docs](https://webdriver.io/)
- [GitHub Actions Docs](https://docs.github.com/actions)

---

## 💡 نصائح سريعة

✅ **افعل:**
- اكتب اختبارات مستقلة
- استخدم Page Objects
- اختبر السيناريوهات الحقيقية
- نظف البيانات بعد الاختبار

❌ **لا تفعل:**
- تخزين البيانات الحساسة في الكود
- الاعتماد على ترتيب الاختبارات
- استخدام `waitForTimeout` كثيراً
- تجاهل الاختبارات الفاشلة

---

**جاهز للبدء؟** 🚀

```bash
npm run setup
npm run test:web
```
