/**
 * مساعد تحليل نتائج Playwright
 */

const fs = require('fs');
const path = require('path');

class PlaywrightResultsParser {
  /**
   * قراءة وتحليل نتائج Playwright
   * @param {string} resultsPath - مسار ملف النتائج JSON
   */
  static parseResults(resultsPath = './test-results/results.json') {
    try {
      if (!fs.existsSync(resultsPath)) {
        console.warn(`⚠️  لم يتم العثور على ملف النتائج: ${resultsPath}`);
        return null;
      }

      const rawData = fs.readFileSync(resultsPath, 'utf8');
      const data = JSON.parse(rawData);

      const summary = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        flaky: 0,
        duration: 0,
        startTime: data.config?.metadata?.actualWorkers ? new Date().toISOString() : null
      };

      // تحليل النتائج
      if (data.suites) {
        this.analyzeSuites(data.suites, summary);
      }

      // حساب المدة
      if (data.stats && data.stats.duration) {
        summary.duration = this.formatDuration(data.stats.duration);
      }

      return summary;
    } catch (error) {
      console.error('❌ خطأ في تحليل نتائج Playwright:', error.message);
      return null;
    }
  }

  /**
   * تحليل مجموعات الاختبار
   */
  static analyzeSuites(suites, summary) {
    suites.forEach(suite => {
      if (suite.specs) {
        suite.specs.forEach(spec => {
          summary.total++;

          if (spec.ok) {
            summary.passed++;
          } else if (spec.tests && spec.tests.length > 0) {
            const test = spec.tests[0];
            if (test.status === 'skipped') {
              summary.skipped++;
            } else if (test.status === 'failed') {
              summary.failed++;
            } else if (test.status === 'flaky') {
              summary.flaky++;
            }
          }
        });
      }

      // تحليل متكرر للمجموعات الفرعية
      if (suite.suites) {
        this.analyzeSuites(suite.suites, summary);
      }
    });
  }

  /**
   * تنسيق المدة الزمنية
   */
  static formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * إنشاء تقرير نصي من النتائج
   */
  static generateTextReport(summary) {
    if (!summary) return 'لا توجد نتائج متاحة';

    const statusEmoji = summary.failed === 0 ? '✅' : '❌';
    const status = summary.failed === 0 ? 'نجح' : 'فشل';

    return `
${statusEmoji} حالة الاختبار: ${status}

📊 الإحصائيات:
━━━━━━━━━━━━━━━━━━━━━
إجمالي الاختبارات: ${summary.total}
✅ نجح: ${summary.passed}
❌ فشل: ${summary.failed}
⏭️  متخطى: ${summary.skipped}
${summary.flaky > 0 ? `🔄 Flaky: ${summary.flaky}\n` : ''}⏱️  المدة: ${summary.duration}
━━━━━━━━━━━━━━━━━━━━━
    `.trim();
  }
}

module.exports = PlaywrightResultsParser;
