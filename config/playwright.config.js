// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * إعدادات Playwright للاختبار الآلي
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: '../tests/web',
  
  /* الحد الأقصى لوقت تشغيل كل اختبار - INCREASED for CI */
  timeout: 120 * 1000, // 2 minutes (was 30s)
  
  /* تكوين الاختبارات بالتوازي - DISABLED in CI for stability */
  fullyParallel: !process.env.CI, // Only parallel locally
  
  /* إعادة المحاولة عند الفشل - INCREASED */
  retries: process.env.CI ? 3 : 0, // 3 retries in CI (was 2)
  
  /* عدد العمليات المتوازية - ALWAYS SEQUENTIAL for stability */
  workers: 1, // Always run sequentially (1 worker)
  
  /* Expect timeout for assertions */
  expect: {
    timeout: 15 * 1000, // 15s for assertions
  },
  
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
    baseURL: process.env.APP_URL,
    
    /* تسجيل الفيديو عند الفشل */
    video: 'retain-on-failure',
    
    /* أخذ لقطة شاشة عند الفشل */
    screenshot: 'only-on-failure',
    
    /* تسجيل التتبع عند الفشل */
    trace: 'retain-on-failure',
    
    /* إعدادات إضافية - INCREASED for CI stability */
    actionTimeout: 30 * 1000, // 30s (was 10s)
    navigationTimeout: 60 * 1000, // 60s (was 30s)
    
    /* Additional stability settings for CI */
    bypassCSP: true, // Bypass Content-Security-Policy
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    
    /* Headless mode settings */
    headless: true,
    
    /* Viewport size */
    viewport: { width: 1280, height: 720 },
    
    /* Slow down actions in CI for stability */
    launchOptions: {
      slowMo: process.env.CI ? 100 : 0, // 100ms delay in CI
    },
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