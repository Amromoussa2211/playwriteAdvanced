/**
 * أداة إرسال البريد الإلكتروني
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailNotifier {
  constructor() {
    this.transporter = null;
    this.setupTransporter();
  }

  /**
   * إعداد ناقل البريد الإلكتروني
   */
  setupTransporter() {
    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: parseInt(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };

    if (!config.host || !config.auth.user || !config.auth.pass) {
      console.warn('⚠️  لم يتم تكوين إعدادات SMTP - تخطي إرسال البريد الإلكتروني');
      return;
    }

    this.transporter = nodemailer.createTransport(config);
  }

  /**
   * إرسال بريد إلكتروني
   * @param {object} options - خيارات البريد
   */
  async sendEmail(options) {
    if (!this.transporter) {
      console.warn('⚠️  ناقل البريد الإلكتروني غير متاح - تخطي الإرسال');
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: options.to || process.env.EMAIL_TO,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ تم إرسال البريد الإلكتروني بنجاح:', info.messageId);
    } catch (error) {
      console.error('❌ فشل إرسال البريد الإلكتروني:', error.message);
    }
  }

  /**
   * إرسال نتائج الاختبار عبر البريد الإلكتروني
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
      timestamp = new Date().toISOString(),
      reportUrl = ''
    } = results;

    const status = failed === 0 ? 'نجح ✅' : 'فشل ❌';
    const statusColor = failed === 0 ? '#28a745' : '#dc3545';

    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نتائج الاختبار</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background-color: ${statusColor};
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .stat-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
        }
        .stat-value {
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
        }
        .stat-label {
            color: #6c757d;
            font-size: 14px;
        }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .total { color: #007bff; }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 نتائج اختبار ${testType}</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">${status}</p>
        </div>
        <div class="content">
            <p><strong>التاريخ والوقت:</strong> ${new Date(timestamp).toLocaleString('ar-EG')}</p>
            <p><strong>المدة:</strong> ${duration}</p>
            
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-label">إجمالي الاختبارات</div>
                    <div class="stat-value total">${total}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">نجح</div>
                    <div class="stat-value passed">${passed}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">فشل</div>
                    <div class="stat-value failed">${failed}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">متخطى</div>
                    <div class="stat-value skipped">${skipped}</div>
                </div>
            </div>
            
            ${reportUrl ? `
            <div style="text-align: center;">
                <a href="${reportUrl}" class="button">عرض التقرير الكامل</a>
            </div>
            ` : ''}
        </div>
        <div class="footer">
            <p>Test Automation Framework</p>
            <p>تم إنشاؤه بواسطة MiniMax Agent</p>
        </div>
    </div>
</body>
</html>
    `;

    await this.sendEmail({
      subject: `نتائج اختبار ${testType} - ${status}`,
      html: html,
      text: `
نتائج اختبار ${testType}
========================
الحالة: ${status}
إجمالي الاختبارات: ${total}
نجح: ${passed}
فشل: ${failed}
متخطى: ${skipped}
المدة: ${duration}
التاريخ: ${new Date(timestamp).toLocaleString('ar-EG')}
      `
    });
  }
}

module.exports = EmailNotifier;
