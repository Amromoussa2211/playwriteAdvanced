/**
 * سكريبت ما بعد الاختبار - إرسال النتائج
 * يتم تشغيله تلقائياً بعد انتهاء اختبارات Playwright
 */

const PlaywrightResultsParser = require('../utils/results-parser');
const SlackNotifier = require('../utils/slack-notifier');
const EmailNotifier = require('../utils/email-notifier');
require('dotenv').config();

async function sendTestResults() {
  console.log('\n📊 معالجة نتائج الاختبار...\n');

  // تحليل النتائج
  const summary = PlaywrightResultsParser.parseResults('./test-results/results.json');

  if (!summary) {
    console.error('❌ لم يتم العثور على نتائج للإرسال');
    return;
  }

  // عرض النتائج
  console.log(PlaywrightResultsParser.generateTextReport(summary));

  // إعداد بيانات النتائج
  const results = {
    total: summary.total,
    passed: summary.passed,
    failed: summary.failed,
    skipped: summary.skipped,
    duration: summary.duration,
    testType: 'Web (Playwright)',
    timestamp: new Date().toISOString()
  };

  // إرسال إلى Slack
  console.log('\n📤 إرسال النتائج إلى Slack...');
  const slack = new SlackNotifier();
  await slack.sendTestResults(results);

  // إرسال عبر البريد
  console.log('📤 إرسال النتائج عبر البريد الإلكتروني...');
  const email = new EmailNotifier();
  await email.sendTestResults(results);

  console.log('\n✅ اكتمل إرسال النتائج!\n');
}

// تشغيل السكريبت
if (require.main === module) {
  sendTestResults().catch(error => {
    console.error('❌ خطأ في إرسال النتائج:', error);
    process.exit(1);
  });
}

module.exports = { sendTestResults };
