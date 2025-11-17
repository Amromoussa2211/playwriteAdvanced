/**
 * Runner لاختبارات الأجهزة المحمولة
 */

const Mocha = require('mocha');
const path = require('path');
const SlackNotifier = require('../../utils/slack-notifier');
const EmailNotifier = require('../../utils/email-notifier');

// إنشاء نسخة من Mocha
const mocha = new Mocha({
  timeout: 60000,
  reporter: 'spec'
});

// إضافة ملفات الاختبار
mocha.addFile(path.join(__dirname, 'android.test.js'));
// يمكن إضافة المزيد من ملفات الاختبار هنا
// mocha.addFile(path.join(__dirname, 'ios.test.js'));

// تشغيل الاختبارات
async function runTests() {
  console.log('🚀 بدء اختبارات الأجهزة المحمولة...\n');

  const slack = new SlackNotifier();
  const email = new EmailNotifier();

  // إرسال إشعار البداية
  await slack.sendTestStartNotification('Mobile');

  const startTime = Date.now();

  return new Promise((resolve) => {
    const runner = mocha.run((failures) => {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2) + 's';

      // جمع النتائج
      const results = {
        total: runner.stats.tests,
        passed: runner.stats.passes,
        failed: runner.stats.failures,
        skipped: runner.stats.pending,
        duration: duration,
        testType: 'Mobile',
        timestamp: new Date().toISOString()
      };
 
      console.log('\n📊 ملخص النتائج:');
      console.log('==================');
      console.log(`إجمالي الاختبارات: ${results.total}`);
      console.log(`✅ نجح: ${results.passed}`);
      console.log(`❌ فشل: ${results.failed}`);
      console.log(`⏭️  متخطى: ${results.skipped}`);
      console.log(`⏱️  المدة: ${results.duration}`);
      console.log('==================\n');

      // إرسال النتائج
      Promise.all([
        slack.sendTestResults(results),
        email.sendTestResults(results)
      ]).then(() => {
        console.log('✅ تم إرسال النتائج بنجاح');
        resolve(failures);
      }).catch(error => {
        console.error('❌ خطأ في إرسال النتائج:', error.message);
        resolve(failures);
      });
    });

    // معالجة الأخطاء
    runner.on('fail', (test, err) => {
      console.error(`❌ فشل الاختبار: ${test.title}`);
      console.error(`   الخطأ: ${err.message}`);
    });
  });
}

// تشغيل إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  runTests().then(failures => {
    process.exit(failures > 0 ? 1 : 0);
  }).catch(error => {
    console.error('❌ خطأ حرج:', error);
    process.exit(1);
  });
}

module.exports = { runTests };
