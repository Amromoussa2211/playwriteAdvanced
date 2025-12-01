const fs = require('fs');
const path = require('path');

const resultsPath = path.join(__dirname, 'security-results.json');
const reportPath = path.join(__dirname, 'SECURITY_REPORT.md');

try {
  const data = fs.readFileSync(resultsPath, 'utf8');
  const results = JSON.parse(data);

  let report = '# 🛡️ Security Test Report\n\n';
  report += `**Date:** ${new Date().toLocaleString()}\n`;
  report += `**Total Tests:** ${results.stats.expected}\n`;
  report += `**Passed:** ${results.stats.expected - results.stats.unexpected}\n`;
  report += `**Failed:** ${results.stats.unexpected}\n`;
  report += `**Duration:** ${(results.stats.duration / 1000).toFixed(2)}s\n\n`;

  report += '---\n\n';
  report += '## ⚠️ Executive Summary & Warnings\n\n';

  let warnings = [];
  let details = [];

  function processSuite(suite) {
    if (suite.suites) {
      suite.suites.forEach(processSuite);
    }
    if (suite.specs) {
      suite.specs.forEach(spec => {
        const title = spec.title;
        const testResult = spec.tests[0].results[0];
        const status = testResult.status;
        const icon = status === 'passed' ? '✅' : '❌';
        
        let attachmentData = null;
        if (testResult.attachments) {
           const attachment = testResult.attachments.find(a => a.contentType === 'application/json');
           if (attachment && attachment.body) {
             try {
                const decodedBody = Buffer.from(attachment.body, 'base64').toString('utf8');
                attachmentData = JSON.parse(decodedBody);
             } catch (e) {
                console.error('Error parsing attachment for', title, e.message);
             }
           }
        }

        // Check for warnings in attachment data (custom logic based on security.spec.js)
        if (attachmentData) {
            let isWarning = false;
            if (attachmentData.status === 'FOUND' || attachmentData.status === 'MISSING') isWarning = true;
            if (attachmentData.details) {
                if (attachmentData.details.exposed === true) isWarning = true;
                if (Array.isArray(attachmentData.details) && attachmentData.details.some(d => d.exposed === true)) isWarning = true;
                if (attachmentData.details.missing && attachmentData.details.missing.length > 0) isWarning = true;
                if (attachmentData.details.runtimeErrors && attachmentData.details.runtimeErrors.length > 0) isWarning = true;
                if (attachmentData.details.mixedFound === true) isWarning = true;
            }

            if (isWarning) {
                 warnings.push({ title, data: attachmentData });
            }
        }
        
        details.push({ title, status, icon, attachmentData });
      });
    }
  }

  results.suites.forEach(processSuite);

  if (warnings.length > 0) {
    report += '> [!WARNING]\n> **Potential Security Issues Found**\n>\n';
    warnings.forEach(w => {
      report += `> *   **${w.title}**: ${JSON.stringify(w.data.details)}\n`;
    });
  } else {
    report += '> [!NOTE]\n> No critical security warnings were explicitly flagged by the test logic.\n';
  }
  
  report += '\n---\n\n';
  report += '## 📝 Detailed Findings\n\n';

  details.forEach(d => {
    report += `### ${d.icon} ${d.title}\n\n`;
    report += `**Status:** ${d.status.toUpperCase()}\n\n`;
    
    if (d.attachmentData) {
      report += '**Details:**\n';
      report += '```json\n';
      report += JSON.stringify(d.attachmentData, null, 2);
      report += '\n```\n';
    } else {
      report += '_No detailed output captured._\n';
    }
    report += '\n';
  });

  fs.writeFileSync(reportPath, report);
  console.log(`Report generated at: ${reportPath}`);

} catch (err) {
  console.error('Error generating report:', err);
}
