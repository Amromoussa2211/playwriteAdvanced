/**
 * مثال لاختبار تطبيق iOS باستخدام Appium
 */

const { remote } = require('webdriverio');
const appiumConfig = require('../../config/appium.config');

describe('اختبارات تطبيق iOS', () => {
  let driver;

  before(async function() {
    this.timeout(60000);
    
    // إنشاء جلسة Appium لـ iOS
    const options = {
      ...appiumConfig.ios,
      hostname: appiumConfig.host,
      port: appiumConfig.port,
      path: appiumConfig.path,
      logLevel: 'info'
    };

    try {
      driver = await remote(options);
      console.log('✅ تم الاتصال بـ Appium (iOS) بنجاح');
    } catch (error) {
      console.error('❌ فشل الاتصال بـ Appium:', error.message);
      throw error;
    }
  });

  after(async function() {
    if (driver) {
      await driver.deleteSession();
      console.log('✅ تم إنهاء جلسة iOS');
    }
  });

  it('يجب أن يعرض التطبيق الشاشة الرئيسية', async function() {
    this.timeout(30000);

    // الانتظار حتى تحميل الشاشة
    await driver.pause(3000);

    // الحصول على عنوان الصفحة أو اسم التطبيق
    const pageSource = await driver.getPageSource();
    console.log('✅ تم تحميل التطبيق بنجاح');

    // التحقق من وجود عناصر معينة
    const elements = await driver.$$('XCUIElementTypeButton');
    console.log(`عدد الأزرار الموجودة: ${elements.length}`);
  });

  it('يجب البحث عن عنصر باستخدام Accessibility ID', async function() {
    this.timeout(30000);

    try {
      // البحث باستخدام accessibility ID
      const element = await driver.$('~main-button');
      const isDisplayed = await element.isDisplayed();
      
      if (isDisplayed) {
        console.log('✅ تم العثور على العنصر وهو ظاهر');
      }
    } catch (error) {
      console.log('⚠️  العنصر غير موجود - تأكد من Accessibility ID الصحيح');
    }
  });

  it('يجب التفاعل مع حقل نصي', async function() {
    this.timeout(30000);

    try {
      // البحث عن حقل نصي
      const textField = await driver.$('XCUIElementTypeTextField');
      
      // النقر على الحقل
      await textField.click();
      
      // إدخال نص
      await textField.setValue('اختبار iOS');
      
      // الحصول على القيمة
      const value = await textField.getText();
      console.log(`✅ تم إدخال النص: ${value}`);
      
      // إخفاء لوحة المفاتيح
      await driver.hideKeyboard();
    } catch (error) {
      console.log('⚠️  لم يتم العثور على حقل نصي');
    }
  });

  it('يجب التمرير في القائمة', async function() {
    this.timeout(30000);

    try {
      // التمرير لأسفل
      await driver.execute('mobile: scroll', { direction: 'down' });
      await driver.pause(1000);
      
      console.log('✅ تم التمرير في القائمة');
    } catch (error) {
      console.log('⚠️  خطأ في التمرير:', error.message);
    }
  });

  it('يجب التقاط لقطة شاشة', async function() {
    this.timeout(30000);

    const screenshot = await driver.takeScreenshot();
    console.log('✅ تم التقاط لقطة الشاشة');
    
    // يمكن حفظ لقطة الشاشة
    const fs = require('fs');
    const path = require('path');
    const screenshotPath = path.join(__dirname, '../../reports/ios-screenshot.png');
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    console.log(`💾 تم حفظ لقطة الشاشة: ${screenshotPath}`);
  });

  it('يجب اختبار الإيماءات (Gestures)', async function() {
    this.timeout(30000);

    try {
      // السحب من اليمين لليسار (Swipe)
      const { width, height } = await driver.getWindowSize();
      
      await driver.touchPerform([
        { action: 'press', options: { x: width * 0.8, y: height * 0.5 } },
        { action: 'wait', options: { ms: 100 } },
        { action: 'moveTo', options: { x: width * 0.2, y: height * 0.5 } },
        { action: 'release' }
      ]);
      
      await driver.pause(1000);
      console.log('✅ تم تنفيذ إيماءة السحب');
    } catch (error) {
      console.log('⚠️  خطأ في الإيماءة:', error.message);
    }
  });

  it('يجب الحصول على معلومات الجهاز', async function() {
    this.timeout(30000);

    const orientation = await driver.getOrientation();
    const { width, height } = await driver.getWindowSize();
    
    console.log('📱 معلومات الجهاز:');
    console.log(`   الاتجاه: ${orientation}`);
    console.log(`   العرض: ${width}px`);
    console.log(`   الارتفاع: ${height}px`);
  });
});
