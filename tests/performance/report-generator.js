const fs = require('fs');
const path = require('path');

/**
 * HTML Report Generator
 * 
 * Generates comprehensive HTML performance reports with charts and detailed metrics
 */
class ReportGenerator {
  constructor(metrics, config) {
    this.metrics = metrics;
    this.config = config;
  }

  /**
   * Generate complete HTML report
   */
  generate() {
    const stats = this.metrics.getStatistics();
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Test Report - ${new Date().toISOString()}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .test-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 3px solid #667eea;
        }
        
        .info-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .info-card h3 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .info-card .value {
            font-size: 2em;
            font-weight: bold;
            color: #333;
        }
        
        .info-card .unit {
            font-size: 0.8em;
            color: #666;
            margin-left: 5px;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: transform 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-5px);
        }
        
        .metric-card h3 {
            font-size: 0.9em;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        
        .metric-card .value {
            font-size: 2.5em;
            font-weight: bold;
        }
        
        .metric-card.success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        
        .metric-card.warning {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .metric-card.error {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
        
        .section {
            padding: 30px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .section h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-left: 5px solid #667eea;
            padding-left: 15px;
        }
        
        .chart-container {
            position: relative;
            height: 400px;
            margin: 20px 0;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 1px;
        }
        
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .status-badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
            display: inline-block;
        }
        
        .status-pass {
            background: #d4edda;
            color: #155724;
        }
        
        .status-fail {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-warning {
            background: #fff3cd;
            color: #856404;
        }
        
        .threshold-violations {
            background: #fff3cd;
            border-left: 5px solid #ffc107;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        
        .threshold-violations h3 {
            color: #856404;
            margin-bottom: 15px;
        }
        
        .violation-item {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 3px solid #ffc107;
        }
        
        .violation-item.critical {
            border-left-color: #dc3545;
            background: #f8d7da;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        
        .scenarios-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .scenario-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-top: 4px solid #667eea;
        }
        
        .scenario-card h3 {
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .scenario-card .weight {
            background: #667eea;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.85em;
            display: inline-block;
            margin-bottom: 10px;
        }
        
        .scenario-card ul {
            list-style: none;
            padding-left: 0;
        }
        
        .scenario-card li {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .scenario-card li:before {
            content: "✓ ";
            color: #38ef7d;
            font-weight: bold;
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Performance Test Report</h1>
            <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
        </div>
        
        <div class="test-info">
            <div class="info-card">
                <h3>Test Duration</h3>
                <div class="value">${stats.summary.duration}<span class="unit">seconds</span></div>
            </div>
            <div class="info-card">
                <h3>Concurrent Users</h3>
                <div class="value">${this.config.CONCURRENT_USERS}<span class="unit">users</span></div>
            </div>
            <div class="info-card">
                <h3>Total Requests</h3>
                <div class="value">${stats.summary.totalRequests}<span class="unit">requests</span></div>
            </div>
            <div class="info-card">
                <h3>Throughput</h3>
                <div class="value">${stats.summary.throughput}<span class="unit">req/s</span></div>
            </div>
        </div>
        
        <div class="summary-grid">
            <div class="metric-card ${parseFloat(stats.summary.successRate) >= 99 ? 'success' : 'warning'}">
                <h3>Success Rate</h3>
                <div class="value">${stats.summary.successRate}%</div>
            </div>
            <div class="metric-card ${parseFloat(stats.summary.errorRate) <= 1 ? 'success' : 'error'}">
                <h3>Error Rate</h3>
                <div class="value">${stats.summary.errorRate}%</div>
            </div>
            <div class="metric-card">
                <h3>Avg Response Time</h3>
                <div class="value">${stats.responseTimes.avg}<span style="font-size: 0.5em">ms</span></div>
            </div>
            <div class="metric-card ${stats.responseTimes.p95 <= this.config.THRESHOLDS.RESPONSE_TIME.P95 ? 'success' : 'warning'}">
                <h3>P95 Response Time</h3>
                <div class="value">${stats.responseTimes.p95}<span style="font-size: 0.5em">ms</span></div>
            </div>
        </div>
        
        ${this.generateThresholdViolations(stats.thresholdViolations)}
        
        <div class="section">
            <h2>📊 Test Scenarios</h2>
            <div class="scenarios-grid">
                ${this.config.SCENARIOS.map(scenario => `
                    <div class="scenario-card">
                        <h3>${scenario.name}</h3>
                        <span class="weight">${scenario.weight}% of users</span>
                        <p style="color: #666; margin: 10px 0;">${scenario.description}</p>
                        <ul>
                            ${scenario.steps.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2>📈 Response Time Distribution</h2>
            <div class="chart-container">
                <canvas id="responseTimeChart"></canvas>
            </div>
        </div>
        
        <div class="section">
            <h2>🎯 Performance by Endpoint</h2>
            <table>
                <thead>
                    <tr>
                        <th>Endpoint</th>
                        <th>Requests</th>
                        <th>Success Rate</th>
                        <th>Avg Response (ms)</th>
                        <th>Min (ms)</th>
                        <th>Max (ms)</th>
                        <th>P95 (ms)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.generateEndpointRows(stats.byEndpoint)}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>📉 Response Time Metrics</h2>
            <table>
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Value (ms)</th>
                        <th>Threshold (ms)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Minimum</td>
                        <td>${stats.responseTimes.min}</td>
                        <td>-</td>
                        <td><span class="status-badge status-pass">✓ PASS</span></td>
                    </tr>
                    <tr>
                        <td>Average</td>
                        <td>${stats.responseTimes.avg}</td>
                        <td>-</td>
                        <td><span class="status-badge status-pass">✓ PASS</span></td>
                    </tr>
                    <tr>
                        <td>P50 (Median)</td>
                        <td>${stats.responseTimes.p50}</td>
                        <td>${this.config.THRESHOLDS.RESPONSE_TIME.P50}</td>
                        <td>${this.getStatusBadge(stats.responseTimes.p50, this.config.THRESHOLDS.RESPONSE_TIME.P50)}</td>
                    </tr>
                    <tr>
                        <td>P90</td>
                        <td>${stats.responseTimes.p90}</td>
                        <td>${this.config.THRESHOLDS.RESPONSE_TIME.P90}</td>
                        <td>${this.getStatusBadge(stats.responseTimes.p90, this.config.THRESHOLDS.RESPONSE_TIME.P90)}</td>
                    </tr>
                    <tr>
                        <td>P95</td>
                        <td>${stats.responseTimes.p95}</td>
                        <td>${this.config.THRESHOLDS.RESPONSE_TIME.P95}</td>
                        <td>${this.getStatusBadge(stats.responseTimes.p95, this.config.THRESHOLDS.RESPONSE_TIME.P95)}</td>
                    </tr>
                    <tr>
                        <td>P99</td>
                        <td>${stats.responseTimes.p99}</td>
                        <td>${this.config.THRESHOLDS.RESPONSE_TIME.P99}</td>
                        <td>${this.getStatusBadge(stats.responseTimes.p99, this.config.THRESHOLDS.RESPONSE_TIME.P99)}</td>
                    </tr>
                    <tr>
                        <td>Maximum</td>
                        <td>${stats.responseTimes.max}</td>
                        <td>-</td>
                        <td><span class="status-badge status-pass">✓ PASS</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        ${stats.errors.length > 0 ? this.generateErrorSection(stats.errors) : ''}
        
        <div class="footer">
            <p>Performance Test Report | Generated by Playwright Advanced Testing Framework</p>
            <p>Test Configuration: ${this.config.CONCURRENT_USERS} concurrent users over ${this.config.TEST_DURATION}s duration</p>
        </div>
    </div>
    
    <script>
        // Response Time Distribution Chart
        const ctx = document.getElementById('responseTimeChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Min', 'P50', 'P90', 'P95', 'P99', 'Max'],
                datasets: [{
                    label: 'Response Time (ms)',
                    data: [
                        ${stats.responseTimes.min},
                        ${stats.responseTimes.p50},
                        ${stats.responseTimes.p90},
                        ${stats.responseTimes.p95},
                        ${stats.responseTimes.p99},
                        ${stats.responseTimes.max}
                    ],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(245, 87, 108, 0.8)',
                        'rgba(245, 87, 108, 0.8)'
                    ],
                    borderColor: [
                        'rgba(102, 126, 234, 1)',
                        'rgba(102, 126, 234, 1)',
                        'rgba(118, 75, 162, 1)',
                        'rgba(118, 75, 162, 1)',
                        'rgba(245, 87, 108, 1)',
                        'rgba(245, 87, 108, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Response Time Percentiles',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Response Time (ms)'
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>
    `;
    
    return html;
  }

  /**
   * Generate threshold violations section
   */
  generateThresholdViolations(violations) {
    if (violations.length === 0) {
      return `
        <div class="section">
            <div style="background: #d4edda; border-left: 5px solid #28a745; padding: 20px; border-radius: 5px;">
                <h3 style="color: #155724; margin-bottom: 10px;">✓ All Thresholds Passed</h3>
                <p style="color: #155724;">No performance threshold violations detected.</p>
            </div>
        </div>
      `;
    }
    
    return `
      <div class="section">
          <div class="threshold-violations">
              <h3>⚠️ Threshold Violations (${violations.length})</h3>
              ${violations.map(v => `
                  <div class="violation-item ${v.severity.toLowerCase()}">
                      <strong>${v.metric}</strong>: ${v.actual} (threshold: ${v.threshold})
                      <span class="status-badge status-${v.severity === 'CRITICAL' ? 'fail' : 'warning'}">
                          ${v.severity}
                      </span>
                  </div>
              `).join('')}
          </div>
      </div>
    `;
  }

  /**
   * Generate endpoint table rows
   */
  generateEndpointRows(endpointStats) {
    return Object.entries(endpointStats).map(([endpoint, stats]) => `
      <tr>
          <td><code>${endpoint}</code></td>
          <td>${stats.count}</td>
          <td>${stats.successRate}%</td>
          <td>${stats.avgResponseTime}</td>
          <td>${stats.minResponseTime}</td>
          <td>${stats.maxResponseTime}</td>
          <td>${stats.p95ResponseTime}</td>
          <td>${parseFloat(stats.successRate) >= 99 ? 
              '<span class="status-badge status-pass">✓ PASS</span>' : 
              '<span class="status-badge status-fail">✗ FAIL</span>'
          }</td>
      </tr>
    `).join('');
  }

  /**
   * Generate error section
   */
  generateErrorSection(errors) {
    return `
      <div class="section">
          <h2>❌ Errors (${errors.length})</h2>
          <table>
              <thead>
                  <tr>
                      <th>Timestamp</th>
                      <th>Endpoint</th>
                      <th>Method</th>
                      <th>Status Code</th>
                  </tr>
              </thead>
              <tbody>
                  ${errors.slice(0, 50).map(error => `
                      <tr>
                          <td>${new Date(error.timestamp).toLocaleString()}</td>
                          <td><code>${error.endpoint}</code></td>
                          <td>${error.method}</td>
                          <td><span class="status-badge status-fail">${error.statusCode}</span></td>
                      </tr>
                  `).join('')}
              </tbody>
          </table>
          ${errors.length > 50 ? `<p style="margin-top: 10px; color: #666;">Showing first 50 of ${errors.length} errors</p>` : ''}
      </div>
    `;
  }

  /**
   * Get status badge HTML
   */
  getStatusBadge(actual, threshold) {
    if (actual <= threshold) {
      return '<span class="status-badge status-pass">✓ PASS</span>';
    }
    return '<span class="status-badge status-fail">✗ FAIL</span>';
  }

  /**
   * Save report to file
   */
  save(outputPath) {
    const html = this.generate();
    fs.writeFileSync(outputPath, html);
    console.log(`[REPORT] HTML report saved to: ${outputPath}`);
  }
}

module.exports = ReportGenerator;
