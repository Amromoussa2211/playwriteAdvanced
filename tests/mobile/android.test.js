// /**
//  * مثال لاختبار تطبيق Android باستخدام Appium
//  */

// const { remote } = require('webdriverio');
// const appiumConfig = require('../../config/appium.config');

// describe('اختبارات تطبيق Android - تسجيل الدخول', () => {
//   let driver;

//   before(async function() {
//     this.timeout(60000);
    
//     // إنشاء جلسة Appium
//     const options = {
//       ...appiumConfig.android,
//       hostname: appiumConfig.host,
//       port: appiumConfig.port,
//       path: appiumConfig.path,
//       logLevel: 'info'
//     };

//     try {
//       driver = await remote(options);
//       console.log('✅ تم الاتصال بـ Appium بنجاح');
//     } catch (error) {
//       console.error('❌ فشل الاتصال بـ Appium:', error.message);
//       throw error;
//     }
//   });

//   after(async function() {
//     if (driver) {
//       await driver.deleteSession();
//       console.log('✅ تم إنهاء الجلسة');
//     }
//   });

//   it('يجب أن يعرض التطبيق شاشة تسجيل الدخول', async function() {
//     this.timeout(30000);

//     // الانتظار حتى تظهر شاشة تسجيل الدخول
//     const emailField = await driver.$('~email-input'); // استخدم accessibility ID
//     await emailField.waitForDisplayed({ timeout: 10000 });

//     // التحقق من وجود حقول الإدخال
//     const passwordField = await driver.$('~password-input');
//     const loginButton = await driver.$('~login-button');

//     const isEmailDisplayed = await emailField.isDisplayed();
//     const isPasswordDisplayed = await passwordField.isDisplayed();
//     const isButtonDisplayed = await loginButton.isDisplayed();

//     console.log(`حقل البريد الإلكتروني: ${isEmailDisplayed}`);
//     console.log(`حقل كلمة المرور: ${isPasswordDisplayed}`);
//     console.log(`زر تسجيل الدخول: ${isButtonDisplayed}`);

//     if (!isEmailDisplayed || !isPasswordDisplayed || !isButtonDisplayed) {
//       throw new Error('بعض عناصر شاشة تسجيل الدخول غير ظاهرة');
//     }
//   });

//   it('يجب إدخال البيانات في حقول تسجيل الدخول', async function() {
//     this.timeout(30000);

//     // إدخال البريد الإلكتروني
//     const emailField = await driver.$('~email-input');
//     await emailField.setValue('test@example.com');

//     // إدخال كلمة المرور
//     const passwordField = await driver.$('~password-input');
//     await passwordField.setValue('password123');

//     // التحقق من القيم المدخلة
//     const emailValue = await emailField.getText();
//     console.log(`✅ تم إدخال البريد الإلكتروني: ${emailValue}`);
//   });

//   it('يجب النقر على زر تسجيل الدخول', async function() {
//     this.timeout(30000);

//     const loginButton = await driver.$('~login-button');
//     await loginButton.click();

//     // الانتظار للانتقال إلى الشاشة التالية
//     await driver.pause(2000);

//     console.log('✅ تم النقر على زر تسجيل الدخول');
//   });

//   it('يجب التمرير في القائمة', async function() {
//     this.timeout(30000);

//     // مثال على التمرير
//     await driver.execute('mobile: scroll', { direction: 'down' });
//     await driver.pause(1000);

//     console.log('✅ تم التمرير في القائمة');
//   });

//   it('يجب التقاط لقطة شاشة', async function() {
//     this.timeout(30000);

//     const screenshot = await driver.takeScreenshot();
//     console.log('✅ تم التقاط لقطة الشاشة');
    
//     // يمكن حفظ لقطة الشاشة في ملف
//     // require('fs').writeFileSync('screenshot.png', screenshot, 'base64');
//   });
// });
