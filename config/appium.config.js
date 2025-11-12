/**
 * إعدادات Appium للاختبار على الأجهزة المحمولة
 */

require('dotenv').config();

const appiumConfig = {
  // إعدادات الخادم
  host: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT) || 4723,
  path: '/wd/hub',

  // إعدادات Android
  android: {
    platformName: 'Android',
    'appium:platformVersion': process.env.PLATFORM_VERSION || '13.0',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
    'appium:automationName': 'UiAutomator2',
    'appium:appPackage': process.env.MOBILE_APP_PACKAGE || 'com.android.settings',
    'appium:appActivity': process.env.MOBILE_APP_ACTIVITY || '.Settings',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 300,
  },

  // إعدادات iOS
  ios: {
    platformName: 'iOS',
    'appium:platformVersion': process.env.PLATFORM_VERSION || '16.0',
    'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 14',
    'appium:automationName': 'XCUITest',
    'appium:bundleId': process.env.IOS_BUNDLE_ID || 'com.apple.Preferences',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 300,
  },

  // إعدادات WebDriverIO
  wdio: {
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
      ui: 'bdd',
      timeout: 60000
    }
  }
};

module.exports = appiumConfig;
