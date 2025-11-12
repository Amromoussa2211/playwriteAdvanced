# 🚀 إطار عمل الاختبار الآلي الشامل

إطار عمل متكامل للاختبار الآلي يدعم اختبارات الويب باستخدام **Playwright** واختبارات الأجهزة المحمولة باستخدام **Appium**، مع خط أنابيب CI/CD جاهز للاستخدام وإرسال النتائج تلقائياً إلى **Slack** و**البريد الإلكتروني**.

## ✨ المميزات

- ✅ **اختبارات الويب**: باستخدام Playwright مع دعم جميع المتصفحات (Chrome, Firefox, Safari)
- ✅ **اختبارات المحمول**: باستخدام Appium لـ Android و iOS
- ✅ **تثبيت تلقائي**: تثبيت جميع التبعيات تلقائياً عند أول تشغيل
- ✅ **Docker**: دعم كامل للتشغيل باستخدام Docker لتوحيد البيئة
- ✅ **CI/CD**: خط أنابيب جاهز على GitHub Actions
- ✅ **إشعارات Slack**: إرسال النتائج تلقائياً إلى قناة Slack
- ✅ **إشعارات البريد**: إرسال تقارير مفصلة لأصحاب المصلحة عبر البريد الإلكتروني
- ✅ **تقارير شاملة**: تقارير HTML تفاعلية مع لقطات شاشة وفيديوهات
- ✅ **إدارة آمنة**: استخدام متغيرات البيئة والأسرار بشكل آمن

## 📋 المتطلبات الأساسية

### للتشغيل المحلي (بدون Docker)

- **Node.js** 18 أو أحدث
- **npm** أو **yarn**
- **Git**

### للتشغيل باستخدام Docker

- **Docker** 20.10 أو أحدث
- **Docker Compose** 2.0 أو أحدث

### لاختبارات Android

- **Java JDK** 11 أو أحدث
- **Android SDK** (يتم تثبيته تلقائياً في Docker)

### لاختبارات iOS

- **macOS** (مطلوب)
- **Xcode** و **Xcode Command Line Tools**
- **iOS Simulator**

## 🚀 البدء السريع

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd test-automation-framework
```

### 2. التثبيت التلقائي

```bash
npm run setup
```

هذا الأمر سيقوم بـ:
- ✅ التحقق من Node.js و npm
- ✅ تثبيت جميع التبعيات
- ✅ تثبيت متصفحات Playwright
- ✅ تثبيت تعريفات Appium
- ✅ إنشاء ملف `.env` من `.env.example`
- ✅ إنشاء المجلدات المطلوبة

### 3. تكوين البيئة

قم بتحرير ملف `.env` وأضف البيانات الخاصة بك:

```env
# بيانات Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# بيانات البريد الإلكتروني
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_TO=stakeholder1@example.com,stakeholder2@example.com

# بيانات اختبارات الويب
APP_URL=https://your-app-url.com

# بيانات اختبارات المحمول
MOBILE_APP_PACKAGE=com.example.yourapp
MOBILE_APP_ACTIVITY=.MainActivity
```

### 4. تشغيل الاختبارات

#### اختبارات الويب فقط
```bash
npm run test:web
```

#### اختبارات المحمول فقط
```bash
npm run test:mobile
```

#### جميع الاختبارات
```bash
npm run test:all
```

#### باستخدام Docker
```bash
# بناء الحاويات
npm run docker:build

# تشغيل الاختبارات
npm run docker:test
```

## 📁 هيكل المشروع

```
test-automation-framework/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions workflow
├── config/
│   ├── playwright.config.js      # إعدادات Playwright
│   └── appium.config.js          # إعدادات Appium
├── docker/
│   ├── Dockerfile.playwright     # Docker للويب
│   └── Dockerfile.appium         # Docker للمحمول
├── tests/
│   ├── web/                      # اختبارات الويب
│   │   ├── login.spec.js
│   │   └── homepage.spec.js
│   └── mobile/                   # اختبارات المحمول
│       ├── android.test.js
│       └── runner.js
├── utils/
│   ├── slack-notifier.js         # أداة Slack
│   └── email-notifier.js         # أداة البريد
├── scripts/
│   └── setup.js                  # سكريبت التثبيت
├── reports/                      # التقارير
├── docker-compose.yml            # Docker Compose
├── package.json                  # التبعيات
├── .env.example                  # مثال للبيئة
└── README.md                     # هذا الملف
```

## 🔧 إعداد CI/CD

### GitHub Actions

المشروع يأتي مع workflow جاهز في `.github/workflows/ci.yml`

#### إعداد الأسرار (Secrets)

انتقل إلى `Settings > Secrets and variables > Actions` في مستودع GitHub وأضف:

| Secret Name | الوصف | مطلوب |
|------------|-------|-------|
| `SLACK_WEBHOOK_URL` | رابط Webhook لـ Slack | نعم |
| `SMTP_HOST` | خادم SMTP | نعم |
| `SMTP_PORT` | منفذ SMTP | نعم |
| `SMTP_USER` | اسم مستخدم البريد | نعم |
| `SMTP_PASS` | كلمة مرور البريد | نعم |
| `EMAIL_TO` | المستلمون (مفصولون بفواصل) | نعم |
| `APP_URL` | رابط التطبيق | نعم |
| `MOBILE_APP_PACKAGE` | اسم حزمة التطبيق | للمحمول |

#### تشغيل يدوي

يمكنك تشغيل الاختبارات يدوياً من تبويب **Actions** في GitHub واختيار نوع الاختبار:
- `all` - جميع الاختبارات
- `web` - اختبارات الويب فقط
- `mobile` - اختبارات المحمول فقط

### GitLab CI

يمكن تحويل الإعداد لـ GitLab CI بإنشاء ملف `.gitlab-ci.yml`

## 📱 إعداد اختبارات المحمول

### Android

#### تشغيل المحاكي محلياً

```bash
# إنشاء محاكي جديد
avdmanager create avd -n test_emulator -k "system-images;android-33;google_apis;x86_64"

# تشغيل المحاكي
emulator -avd test_emulator

# تشغيل Appium
npx appium --address 0.0.0.0 --port 4723

# في نافذة أخرى، تشغيل الاختبارات
npm run test:mobile
```

#### استخدام جهاز حقيقي

1. قم بتفعيل وضع المطور على الجهاز
2. فعّل USB Debugging
3. وصّل الجهاز بالكمبيوتر
4. تأكد من ظهور الجهاز: `adb devices`
5. شغّل الاختبارات

### iOS

يتطلب macOS مع Xcode:

```bash
# تشغيل محاكي iOS
xcrun simctl boot "iPhone 14"

# تشغيل Appium
npx appium --address 0.0.0.0 --port 4723

# تشغيل الاختبارات
npm run test:mobile
```

## 📊 التقارير

### تقارير Playwright

يتم إنشاء تقارير HTML تفاعلية تلقائياً في مجلد `playwright-report/`

لعرض التقرير:
```bash
npm run report
```

### لقطات الشاشة والفيديو

يتم حفظ لقطات الشاشة والفيديوهات تلقائياً عند فشل الاختبار في `test-results/`

## 🔔 إعداد الإشعارات

### Slack

1. انتقل إلى [Slack API](https://api.slack.com/messaging/webhooks)
2. أنشئ Incoming Webhook جديد
3. انسخ الرابط وأضفه إلى `.env` أو GitHub Secrets

### البريد الإلكتروني

#### Gmail

1. فعّل التحقق بخطوتين
2. أنشئ "App Password" من [هنا](https://myaccount.google.com/apppasswords)
3. استخدم App Password في `SMTP_PASS`

#### SMTP مخصص

قم بتكوين `SMTP_HOST` و `SMTP_PORT` حسب مزود الخدمة

## 🐳 Docker

### بناء الصور

```bash
# بناء صورة Playwright
docker build -f docker/Dockerfile.playwright -t playwright-tests .

# بناء صورة Appium
docker build -f docker/Dockerfile.appium -t appium-tests .

# أو استخدم Docker Compose
docker-compose build
```

### تشغيل الاختبارات

```bash
# تشغيل الويب فقط
docker-compose up playwright

# تشغيل المحمول فقط
docker-compose up appium

# تشغيل الكل
docker-compose up
```

### إيقاف الحاويات

```bash
docker-compose down
```

## 🧪 كتابة اختبارات جديدة

### اختبار ويب جديد

أنشئ ملف في `tests/web/your-test.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('اختبارات جديدة', () => {
  test('اختبار مثال', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/عنوان الصفحة/);
  });
});
```

### اختبار محمول جديد

أنشئ ملف في `tests/mobile/your-mobile-test.js`:

```javascript
const { remote } = require('webdriverio');
const appiumConfig = require('../../config/appium.config');

describe('اختبار محمول جديد', () => {
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

  it('اختبار مثال', async function() {
    const element = await driver.$('~element-id');
    await element.waitForDisplayed({ timeout: 10000 });
  });
});
```

ثم أضف الملف إلى `tests/mobile/runner.js`

## 📝 نصائح وأفضل الممارسات

### الأداء

- استخدم التشغيل المتوازي للاختبارات
- قلل من `waitForTimeout` واستخدم `waitForSelector` بدلاً منه
- استخدم Page Objects pattern لإعادة استخدام الكود

### الصيانة

- اجعل الاختبارات مستقلة عن بعضها
- استخدم البيانات الديناميكية بدلاً من البيانات الثابتة
- نظف البيانات بعد كل اختبار

### الأمان

- لا تخزن البيانات الحساسة في الكود
- استخدم `.env` ومتغيرات البيئة
- أضف `.env` إلى `.gitignore`

## 🛠️ استكشاف الأخطاء

### الاختبار لا يعمل

```bash
# تحقق من التبعيات
npm install

# أعد تثبيت المتصفحات
npx playwright install --with-deps

# تحقق من Appium
npx appium driver list
```

### مشاكل Docker

```bash
# أعد بناء الصور
docker-compose build --no-cache

# تنظيف الحاويات القديمة
docker system prune -a
```

### مشاكل المحاكي

```bash
# التحقق من الأجهزة المتصلة
adb devices

# إعادة تشغيل ADB
adb kill-server
adb start-server
```

## 📚 مصادر إضافية

- [Playwright Documentation](https://playwright.dev/)
- [Appium Documentation](https://appium.io/)
- [WebDriverIO Documentation](https://webdriver.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License

## 👨‍💻 المؤلف

**AmrIbrahem**

---

<div dir="rtl">

## 💡 هل تحتاج مساعدة؟

إذا واجهت أي مشاكل أو كان لديك أسئلة، يرجى:

1. التحقق من قسم [استكشاف الأخطاء](#-استكشاف-الأخطاء)
2. البحث في [Issues](https://github.com/your-repo/issues)
3. فتح Issue جديد مع تفاصيل المشكلة

</div>

---

**جاهز للاستخدام! 🚀**

ابدأ الآن بتشغيل `npm run setup` واستمتع بالاختبار الآلي!
