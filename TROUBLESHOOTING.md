# 🔧 دليل حل المشاكل

دليل شامل لحل المشاكل الشائعة في إطار عمل الاختبار الآلي.

## 📋 جدول المحتويات

- [مشاكل التثبيت](#مشاكل-التثبيت)
- [مشاكل Playwright](#مشاكل-playwright)
- [مشاكل Appium](#مشاكل-appium)
- [مشاكل Docker](#مشاكل-docker)
- [مشاكل CI/CD](#مشاكل-cicd)
- [مشاكل الإشعارات](#مشاكل-الإشعارات)
- [مشاكل الأداء](#مشاكل-الأداء)

---

## مشاكل التثبيت

### المشكلة: `npm install` يفشل

**الأعراض:**
```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
```

**الحلول:**

1. **تنظيف الـ cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **التحقق من إصدار Node.js:**
```bash
node --version  # يجب أن يكون 18 أو أحدث
```

3. **استخدام npm أحدث:**
```bash
npm install -g npm@latest
```

4. **التثبيت مع تجاهل scripts:**
```bash
npm install --ignore-scripts
npx playwright install
```

---

### المشكلة: أذونات محظورة (Permission Denied)

**الأعراض:**
```
EACCES: permission denied
```

**الحلول:**

**على Linux/Mac:**
```bash
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP .
```

**تجنب sudo:**
```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

---

## مشاكل Playwright

### المشكلة: المتصفحات لا تعمل

**الأعراض:**
```
browserType.launch: Executable doesn't exist
```

**الحلول:**

1. **إعادة تثبيت المتصفحات:**
```bash
npx playwright install --with-deps
```

2. **تثبيت المتصفحات مع التبعيات:**
```bash
# على Ubuntu/Debian
sudo npx playwright install-deps

# على Mac
npx playwright install --with-deps chromium
```

3. **استخدام متصفح معين فقط:**
```bash
npx playwright install chromium
npm run test:web -- --project=chromium
```

---

### المشكلة: Timeouts متكررة

**الأعراض:**
```
Test timeout of 30000ms exceeded
```

**الحلول:**

1. **زيادة Timeout:**
```javascript
// في playwright.config.js
module.exports = defineConfig({
  timeout: 60 * 1000, // 60 ثانية
  expect: {
    timeout: 10 * 1000
  }
});
```

2. **استخدام waitForLoadState:**
```javascript
await page.goto('/');
await page.waitForLoadState('networkidle');
```

3. **تجنب waitForTimeout:**
```javascript
// ❌ سيء
await page.waitForTimeout(5000);

// ✅ جيد
await page.waitForSelector('.element', { state: 'visible' });
```

---

### المشكلة: Screenshots أو Videos لا تحفظ

**الأعراض:**
لا توجد ملفات في `test-results/`

**الحلول:**

1. **التحقق من الإعدادات:**
```javascript
// في playwright.config.js
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

2. **إنشاء المجلدات:**
```bash
mkdir -p test-results screenshots videos
```

3. **أخذ Screenshot يدوياً:**
```javascript
await page.screenshot({ path: 'screenshot.png' });
```

---

## مشاكل Appium

### المشكلة: لا يمكن الاتصال بـ Appium Server

**الأعراض:**
```
Unable to connect to Appium server
ECONNREFUSED 127.0.0.1:4723
```

**الحلول:**

1. **التحقق من تشغيل Appium:**
```bash
# تشغيل Appium
npx appium

# في نافذة أخرى، تحقق من المنفذ
lsof -i :4723
```

2. **إعادة تشغيل Appium:**
```bash
# إيقاف
pkill -f appium

# تشغيل مجدداً
npx appium --address 0.0.0.0 --port 4723
```

3. **التحقق من الإعدادات:**
```javascript
// في appium.config.js
host: 'localhost',  // أو '0.0.0.0' للـ Docker
port: 4723,
```

---

### المشكلة: لا يتعرف على الجهاز

**الأعراض:**
```
No devices/emulators found
```

**الحلول:**

**للـ Android:**
```bash
# التحقق من الأجهزة
adb devices

# إذا كانت القائمة فارغة
adb kill-server
adb start-server
adb devices

# للمحاكي
emulator -list-avds
emulator -avd <AVD_NAME>
```

**للـ iOS:**
```bash
# التحقق من المحاكيات
xcrun simctl list devices

# تشغيل محاكي
xcrun simctl boot "iPhone 14"
```

---

### المشكلة: التطبيق لا يثبت

**الأعراض:**
```
Could not install app
```

**الحلول:**

1. **التحقق من صلاحيات الملف:**
```bash
chmod +x /path/to/app.apk
```

2. **التثبيت اليدوي:**
```bash
# Android
adb install /path/to/app.apk

# iOS
xcrun simctl install booted /path/to/app.app
```

3. **مسح البيانات القديمة:**
```bash
# Android
adb uninstall com.example.app
adb install /path/to/app.apk

# iOS
xcrun simctl uninstall booted com.example.app
```

---

### المشكلة: لا يعثر على العناصر

**الأعراض:**
```
Element not found
```

**الحلول:**

1. **زيادة وقت الانتظار:**
```javascript
const element = await driver.$('~element-id');
await element.waitForDisplayed({ timeout: 15000 });
```

2. **استخدام استراتيجيات مختلفة:**
```javascript
// Accessibility ID (مفضل)
await driver.$('~button-id');

// XPath
await driver.$('//android.widget.Button[@text="Login"]');

// Class Name
await driver.$('android.widget.Button');

// ID
await driver.$('com.example:id/button');
```

3. **الحصول على Page Source:**
```javascript
const source = await driver.getPageSource();
console.log(source); // للبحث عن العنصر
```

---

## مشاكل Docker

### المشكلة: فشل بناء Docker Image

**الأعراض:**
```
ERROR: failed to solve
```

**الحلول:**

1. **بناء بدون cache:**
```bash
docker-compose build --no-cache
```

2. **التحقق من Dockerfile:**
```bash
docker build -f docker/Dockerfile.playwright -t test .
```

3. **تنظيف Docker:**
```bash
docker system prune -a
docker volume prune
```

---

### المشكلة: الحاويات لا تتصل ببعضها

**الأعراض:**
```
Connection refused between containers
```

**الحلول:**

1. **التحقق من الشبكة:**
```bash
docker network ls
docker network inspect test-automation-framework_test-network
```

2. **استخدام أسماء الخدمات:**
```javascript
// في .env للـ Docker
APPIUM_HOST=appium  // اسم الخدمة بدلاً من localhost
```

3. **إعادة إنشاء الشبكة:**
```bash
docker-compose down
docker network prune
docker-compose up
```

---

### المشكلة: الحاويات تستهلك موارد كثيرة

**الأعراض:**
النظام بطيء، استخدام CPU/RAM عالي

**الحلول:**

1. **تحديد الموارد:**
```yaml
# في docker-compose.yml
services:
  playwright:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

2. **إيقاف الحاويات غير المستخدمة:**
```bash
docker-compose down
docker stop $(docker ps -aq)
```

---

## مشاكل CI/CD

### المشكلة: GitHub Actions تفشل

**الأعراض:**
Workflow يفشل على GitHub

**الحلول:**

1. **التحقق من Secrets:**
```bash
# تأكد من إضافة جميع Secrets في GitHub
- SLACK_WEBHOOK_URL
- SMTP_HOST
- SMTP_USER
- SMTP_PASS
- EMAIL_TO
- APP_URL
```

2. **تشغيل محلياً:**
```bash
# استخدم act لتشغيل GitHub Actions محلياً
act -j web-tests
```

3. **التحقق من الأخطاء:**
- اذهب إلى تبويب Actions
- افتح Workflow الفاشل
- راجع السجلات (Logs)

---

### المشكلة: Tests تنجح محلياً لكن تفشل في CI

**الأسباب الشائعة:**

1. **اختلاف البيئة:**
```yaml
# تأكد من توحيد البيئة في .github/workflows/ci.yml
env:
  NODE_VERSION: '18'
  CI: true
```

2. **Timeouts قصيرة:**
```yaml
# زيادة timeout في workflow
- name: Run tests
  timeout-minutes: 30
```

3. **موارد محدودة:**
```javascript
// تقليل التوازي في CI
workers: process.env.CI ? 1 : undefined,
```

---

## مشاكل الإشعارات

### المشكلة: Slack لا يستقبل الرسائل

**الحلول:**

1. **التحقق من Webhook:**
```bash
# اختبار Webhook
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"اختبار"}' \
  YOUR_WEBHOOK_URL
```

2. **التحقق من الكود:**
```javascript
// اختبار إرسال Slack
node -e "
const SlackNotifier = require('./utils/slack-notifier');
const slack = new SlackNotifier(process.env.SLACK_WEBHOOK_URL);
slack.sendMessage('اختبار! 🎉').catch(console.error);
"
```

3. **التحقق من الأخطاء:**
```javascript
// في slack-notifier.js
catch (error) {
  console.error('Slack Error:', error.response?.data || error.message);
}
```

---

### المشكلة: البريد الإلكتروني لا يرسل

**الحلول:**

**للـ Gmail:**
1. **استخدم App Password:**
   - اذهب إلى: https://myaccount.google.com/apppasswords
   - أنشئ App Password جديد
   - استخدمه في `SMTP_PASS`

2. **فعّل "Less secure app access":**
   - (غير موصى به - استخدم App Password بدلاً منه)

**اختبار الإرسال:**
```javascript
node -e "
const EmailNotifier = require('./utils/email-notifier');
const email = new EmailNotifier();
email.sendEmail({
  subject: 'اختبار',
  text: 'رسالة اختبار'
}).catch(console.error);
"
```

**التحقق من الإعدادات:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587  # للـ TLS
# أو 465 للـ SSL
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
```

---

## مشاكل الأداء

### المشكلة: الاختبارات بطيئة جداً

**الحلول:**

1. **التشغيل المتوازي:**
```javascript
// playwright.config.js
workers: 4,  // عدد العمليات المتوازية
```

2. **تقليل Timeouts:**
```javascript
actionTimeout: 5000,  // بدلاً من 10000
```

3. **استخدام headless:**
```javascript
use: {
  headless: true,  // أسرع
}
```

4. **تجنب waitForTimeout:**
```javascript
// ❌ بطيء
await page.waitForTimeout(5000);

// ✅ سريع
await page.waitForSelector('.element');
```

---

### المشكلة: Docker بطيء

**الحلول:**

1. **استخدام volumes للـ cache:**
```yaml
volumes:
  - ~/.npm:/root/.npm
  - ./node_modules:/app/node_modules
```

2. **تحسين Dockerfile:**
```dockerfile
# استخدام multi-stage build
FROM node:18 as builder
COPY package*.json ./
RUN npm ci --only=production
```

---

## أدوات مفيدة للتشخيص

### فحص شامل للبيئة

```bash
#!/bin/bash
echo "=== فحص البيئة ==="
echo "Node: $(node --version)"
echo "npm: $(npm --version)"
echo "Playwright: $(npx playwright --version)"
echo "Appium: $(npx appium --version)"
echo "Docker: $(docker --version 2>/dev/null || echo 'غير مثبت')"
echo "ADB: $(adb version 2>/dev/null || echo 'غير مثبت')"
echo "=================
```

### سكريبت تشخيص

```javascript
// scripts/diagnose.js
const fs = require('fs');
require('dotenv').config();

console.log('🔍 تشخيص البيئة...\n');

// التحقق من .env
const requiredEnvVars = [
  'SLACK_WEBHOOK_URL',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'APP_URL'
];

requiredEnvVars.forEach(varName => {
  const exists = process.env[varName];
  console.log(`${exists ? '✅' : '❌'} ${varName}`);
});

// التحقق من المجلدات
const dirs = ['reports', 'test-results', 'playwright-report'];
dirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`${exists ? '✅' : '❌'} ${dir}/`);
});
```

---

## الحصول على المساعدة

إذا لم تحل هذه الخطوات مشكلتك:

1. **راجع الوثائق:**
   - [README.md](README.md)
   - [QUICKSTART.md](QUICKSTART.md)
   - [EXAMPLES.md](EXAMPLES.md)

2. **ابحث في Issues:**
   - GitHub Issues
   - Stack Overflow

3. **افتح Issue جديد:**
   - قدم وصف تفصيلي
   - أرفق السجلات (logs)
   - أذكر البيئة والإصدارات

4. **اتصل بالدعم:**
   - افتح Issue على GitHub
   - أرسل بريد إلكتروني

---

**نصيحة:** احتفظ بهذا الدليل مرجعياً دائماً! 📌
