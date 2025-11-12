/**
 * أداة إرسال الإشعارات إلى Slack
 */

const axios = require('axios');
require('dotenv').config();

class SlackNotifier {
  constructor(webhookUrl = process.env.SLACK_WEBHOOK_URL) {
    this.webhookUrl = webhookUrl;
  }

  /**
   * إرسال رسالة إلى Slack
   * @param {string} message - الرسالة المراد إرسالها
   * @param {object} options - خيارات إضافية
   */
  async sendMessage(message, options = {}) {
    if (!this.webhookUrl) {
      console.warn('⚠️  لم يتم تعيين SLACK_WEBHOOK_URL - تخطي إرسال Slack');
      return;
    }

    const payload = {
      text: message,
      ...options
    };

    try {
      await axios.post(this.webhookUrl, payload);
      console.log('✅ تم إرسال الإشعار إلى Slack بنجاح');
    } catch (error) {
      console.error('❌ فشل إرسال الإشعار إلى Slack:', error.message);
    }
  }

  /**
   * إرسال نتائج الاختبار إلى Slack
   * @param {object} results - نتائج الاختبار
   */
  async sendTestResults(results) {
    const { 
      total, 
      passed, 
      failed, 
      skipped, 
      duration, 
      testType = 'Web',
      timestamp = new Date().toISOString()
    } = results;

    const status = failed === 0 ? '✅ نجح' : '❌ فشل';
    const color = failed === 0 ? 'good' : 'danger';

    const message = {
      attachments: [
        {
          color: color,
          title: `📊 نتائج اختبار ${testType}`,
          fields: [
            {
              title: 'الحالة',
              value: status,
              short: true
            },
            {
              title: 'إجمالي الاختبارات',
              value: total.toString(),
              short: true
            },
            {
              title: '✅ نجح',
              value: passed.toString(),
              short: true
            },
            {
              title: '❌ فشل',
              value: failed.toString(),
              short: true
            },
            {
              title: '⏭️ متخطى',
              value: skipped.toString(),
              short: true
            },
            {
              title: '⏱️ المدة',
              value: duration,
              short: true
            }
          ],
          footer: 'Test Automation Framework',
          ts: Math.floor(new Date(timestamp).getTime() / 1000)
        }
      ]
    };

    await this.sendMessage('', message);
  }

  /**
   * إرسال إشعار بداية الاختبار
   * @param {string} testType - نوع الاختبار
   */
  async sendTestStartNotification(testType = 'Web') {
    const message = {
      text: `🚀 بدأت اختبارات ${testType}...`,
      attachments: [
        {
          color: 'warning',
          text: 'جاري تشغيل الاختبارات الآلية'
        }
      ]
    };

    await this.sendMessage('', message);
  }

  /**
   * إرسال إشعار خطأ حرج
   * @param {string} error - رسالة الخطأ
   */
  async sendErrorNotification(error) {
    const message = {
      text: '🚨 خطأ حرج في الاختبارات!',
      attachments: [
        {
          color: 'danger',
          title: 'تفاصيل الخطأ',
          text: error,
          footer: 'يرجى التحقق من السجلات'
        }
      ]
    };

    await this.sendMessage('', message);
  }
}

module.exports = SlackNotifier;
