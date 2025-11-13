// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * إعدادات Playwright للاختبار الآلي
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: '../tests/web',
  
  /* الحد الأقصى لوقت تشغيل كل اختبار */
  timeout: 30 * 1000,
  
  /* تكوين الاختبارات بالتوازي */
  fullyParallel: true,
  
  /* إعادة المحاولة عند الفشل */
  retries: process.env.CI ? 2 : 0,
  
  /* عدد العمليات المتوازية */
  workers: process.env.CI ? 2 : undefined,
  
  /* المراسل (Reporter) */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],
  
  /* الإعدادات المشتركة لجميع المشاريع */
  use: {
    /* URL الأساسي */
    baseURL: process.env.APP_URL ,
    
    /* تسجيل الفيديو عند الفشل */
    video: 'retain-on-failure',
    
    /* أخذ لقطة شاشة عند الفشل */
    screenshot: 'only-on-failure',
    
    /* تسجيل التتبع عند الفشل */
    trace: 'retain-on-failure',
    
    /* إعدادات إضافية */
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },

  /* تكوين المتصفحات المختلفة */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    }

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* اختبار الهواتف المحمولة (عبر المتصفح) */
    // {
      // name: 'Mobile Chrome',
      // use: { ...devices['Pixel 5'] },
    // },
    // {
      // name: 'Mobile Safari',
      // use: { ...devices['iPhone 12'] },
    // },
  ]

  /* خادم محلي للتطوير (اختياري) */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
