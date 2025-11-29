const axios = require('axios');
const config = require('./config');
const MetricsCollector = require('./metrics-collector');
const ReportGenerator = require('./report-generator');
const fs = require('fs');
const path = require('path');

/**
 * Performance Test Runner
 * 
 * Main orchestrator for running performance tests with configurable load
 */
class PerformanceTestRunner {
  constructor() {
    this.metrics = new MetricsCollector();
    this.activeUsers = 0;
    this.stopTest = false;
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Random think time between actions
   */
  getThinkTime() {
    const min = config.THINK_TIME.MIN;
    const max = config.THINK_TIME.MAX;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Make HTTP request and record metrics
   */
  async makeRequest(endpoint, method = 'GET', data = null, headers = {}) {
    const startTime = Date.now();
    let success = false;
    let statusCode = 0;
    
    try {
      const response = await axios({
        method,
        url: endpoint,
        data,
        headers,
        timeout: config.REQUEST_TIMEOUT,
        validateStatus: () => true // Don't throw on any status
      });
      
      statusCode = response.status;
      success = statusCode >= 200 && statusCode < 400;
      
      const responseTime = Date.now() - startTime;
      this.metrics.recordRequest(endpoint, method, responseTime, statusCode, success);
      
      return { success, statusCode, data: response.data, responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      statusCode = error.response?.status || 0;
      this.metrics.recordRequest(endpoint, method, responseTime, statusCode, false);
      
      return { success: false, statusCode, error: error.message, responseTime };
    }
  }

  /**
   * Simulate customer order flow
   */
  async simulateCustomerOrderFlow(userId) {
    console.log(`[USER ${userId}] Starting Customer Order Flow`);
    
    try {
      // Step 1: Get menu
      await this.makeRequest(`${config.BASE_URL}${config.ENDPOINTS.GET_MENU}`, 'GET');
      await this.sleep(this.getThinkTime());
      
      // Step 2: Get categories
      await this.makeRequest(`${config.BASE_URL}${config.ENDPOINTS.GET_CATEGORIES}`, 'GET');
      await this.sleep(this.getThinkTime());
      
      // Step 3: Get items
      await this.makeRequest(`${config.BASE_URL}${config.ENDPOINTS.GET_ITEMS}`, 'GET');
      await this.sleep(this.getThinkTime());
      
      // Step 4: Create order
      const orderData = {
        tableId: config.TEST_DATA.TABLE_IDS[Math.floor(Math.random() * config.TEST_DATA.TABLE_IDS.length)],
        items: config.TEST_DATA.SAMPLE_ITEMS.slice(0, Math.floor(Math.random() * 3) + 1)
      };
      
      const orderResult = await this.makeRequest(
        `${config.BASE_URL}${config.ENDPOINTS.CREATE_ORDER}`,
        'POST',
        orderData
      );
      await this.sleep(this.getThinkTime());
      
      // Step 5: Process payment (if order created successfully)
      if (orderResult.success) {
        await this.makeRequest(
          `${config.BASE_URL}${config.ENDPOINTS.PROCESS_PAYMENT}`,
          'POST',
          {
            orderId: orderResult.data?.orderId || 'test-order-id',
            amount: 100,
            cardNumber: config.TEST_DATA.TEST_CARD.number
          }
        );
      }
      
      console.log(`[USER ${userId}] Completed Customer Order Flow`);
    } catch (error) {
      console.error(`[USER ${userId}] Error in Customer Order Flow:`, error.message);
    }
  }

  /**
   * Simulate admin dashboard operations
   */
  async simulateAdminDashboardFlow(userId) {
    console.log(`[USER ${userId}] Starting Admin Dashboard Flow`);
    
    try {
      // Step 1: Login
      const loginResult = await this.makeRequest(
        `${config.DASHBOARD_URL}${config.ENDPOINTS.LOGIN}`,
        'POST',
        config.TEST_DATA.ADMIN_CREDENTIALS
      );
      await this.sleep(this.getThinkTime());
      
      const authToken = loginResult.data?.token || '';
      const headers = { Authorization: `Bearer ${authToken}` };
      
      // Step 2: Get tables
      await this.makeRequest(`${config.BASE_URL}${config.ENDPOINTS.GET_TABLES}`, 'GET', null, headers);
      await this.sleep(this.getThinkTime());
      
      // Step 3: Get order reports
      await this.makeRequest(`${config.BASE_URL}${config.ENDPOINTS.GET_ORDER_REPORT}`, 'GET', null, headers);
      await this.sleep(this.getThinkTime());
      
      // Step 4: Get payment reports
      await this.makeRequest(`${config.BASE_URL}${config.ENDPOINTS.GET_PAYMENT_REPORT}`, 'GET', null, headers);
      
      console.log(`[USER ${userId}] Completed Admin Dashboard Flow`);
    } catch (error) {
      console.error(`[USER ${userId}] Error in Admin Dashboard Flow:`, error.message);
    }
  }

  /**
   * Simulate split payment flow
   */
  async simulateSplitPaymentFlow(userId) {
    console.log(`[USER ${userId}] Starting Split Payment Flow`);
    
    try {
      // Create order
      const orderData = {
        tableId: config.TEST_DATA.TABLE_IDS[0],
        items: config.TEST_DATA.SAMPLE_ITEMS
      };
      
      const orderResult = await this.makeRequest(
        `${config.BASE_URL}${config.ENDPOINTS.CREATE_ORDER}`,
        'POST',
        orderData
      );
      await this.sleep(this.getThinkTime());
      
      if (orderResult.success) {
        const orderId = orderResult.data?.orderId || 'test-order-id';
        
        // First payment
        await this.makeRequest(
          `${config.BASE_URL}${config.ENDPOINTS.PROCESS_PAYMENT}`,
          'POST',
          {
            orderId,
            amount: 50,
            splitPayment: true
          }
        );
        await this.sleep(this.getThinkTime());
        
        // Second payment
        await this.makeRequest(
          `${config.BASE_URL}${config.ENDPOINTS.PROCESS_PAYMENT}`,
          'POST',
          {
            orderId,
            amount: 50,
            splitPayment: true
          }
        );
      }
      
      console.log(`[USER ${userId}] Completed Split Payment Flow`);
    } catch (error) {
      console.error(`[USER ${userId}] Error in Split Payment Flow:`, error.message);
    }
  }

  /**
   * Simulate menu browsing only
   */
  async simulateMenuBrowsingFlow(userId) {
    console.log(`[USER ${userId}] Starting Menu Browsing Flow`);
    
    try {
      // Browse menu
      await this.makeRequest(`${config.BASE_URL}${config.ENDPOINTS.GET_MENU}`, 'GET');
      await this.sleep(this.getThinkTime());
      
      // Browse categories
      await this.makeRequest(`${config.BASE_URL}${config.ENDPOINTS.GET_CATEGORIES}`, 'GET');
      await this.sleep(this.getThinkTime());
      
      // View items
      await this.makeRequest(`${config.BASE_URL}${config.ENDPOINTS.GET_ITEMS}`, 'GET');
      
      console.log(`[USER ${userId}] Completed Menu Browsing Flow`);
    } catch (error) {
      console.error(`[USER ${userId}] Error in Menu Browsing Flow:`, error.message);
    }
  }

  /**
   * Select and execute a scenario based on weight
   */
  async executeScenario(userId) {
    const random = Math.random() * 100;
    let cumulativeWeight = 0;
    
    for (const scenario of config.SCENARIOS) {
      cumulativeWeight += scenario.weight;
      
      if (random <= cumulativeWeight) {
        switch (scenario.name) {
          case 'Customer Order Flow':
            await this.simulateCustomerOrderFlow(userId);
            break;
          case 'Admin Dashboard Operations':
            await this.simulateAdminDashboardFlow(userId);
            break;
          case 'Split Payment Flow':
            await this.simulateSplitPaymentFlow(userId);
            break;
          case 'Menu Browsing Only':
            await this.simulateMenuBrowsingFlow(userId);
            break;
        }
        break;
      }
    }
  }

  /**
   * Simulate a single virtual user
   */
  async simulateUser(userId) {
    this.activeUsers++;
    this.metrics.updateActiveUsers(this.activeUsers);
    
    console.log(`[USER ${userId}] Started (Active users: ${this.activeUsers})`);
    
    while (!this.stopTest) {
      await this.executeScenario(userId);
      await this.sleep(this.getThinkTime());
    }
    
    this.activeUsers--;
    this.metrics.updateActiveUsers(this.activeUsers);
    console.log(`[USER ${userId}] Stopped (Active users: ${this.activeUsers})`);
  }

  /**
   * Run the performance test
   */
  async run() {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 PERFORMANCE TEST STARTED');
    console.log('='.repeat(80));
    console.log(`Configuration:`);
    console.log(`  - Concurrent Users: ${config.CONCURRENT_USERS}`);
    console.log(`  - Test Duration: ${config.TEST_DURATION}s`);
    console.log(`  - Ramp-up Time: ${config.RAMP_UP_TIME}s`);
    console.log(`  - Base URL: ${config.BASE_URL}`);
    console.log('='.repeat(80) + '\n');
    
    // Start metrics collection
    this.metrics.start();
    
    // Calculate ramp-up delay
    const rampUpDelay = (config.RAMP_UP_TIME * 1000) / config.CONCURRENT_USERS;
    
    // Start users with ramp-up
    const userPromises = [];
    for (let i = 1; i <= config.CONCURRENT_USERS; i++) {
      userPromises.push(this.simulateUser(i));
      
      if (i < config.CONCURRENT_USERS) {
        await this.sleep(rampUpDelay);
      }
    }
    
    console.log(`\n[INFO] All ${config.CONCURRENT_USERS} users ramped up. Running test for ${config.TEST_DURATION}s...\n`);
    
    // Run for specified duration
    await this.sleep(config.TEST_DURATION * 1000);
    
    // Stop all users
    console.log('\n[INFO] Test duration reached. Stopping users...\n');
    this.stopTest = true;
    
    // Wait for all users to finish
    await Promise.all(userPromises);
    
    // Stop metrics collection
    this.metrics.stop();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ PERFORMANCE TEST COMPLETED');
    console.log('='.repeat(80) + '\n');
    
    // Generate reports
    await this.generateReports();
  }

  /**
   * Generate all reports
   */
  async generateReports() {
    console.log('[REPORT] Generating performance reports...\n');
    
    // Ensure output directory exists
    const outputDir = config.REPORT.OUTPUT_DIR;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate HTML report
    const reportGenerator = new ReportGenerator(this.metrics, config);
    const htmlPath = path.join(outputDir, config.REPORT.HTML_REPORT_NAME);
    reportGenerator.save(htmlPath);
    
    // Generate JSON report
    const jsonPath = path.join(outputDir, config.REPORT.JSON_REPORT_NAME);
    fs.writeFileSync(jsonPath, this.metrics.exportToJSON());
    console.log(`[REPORT] JSON report saved to: ${jsonPath}`);
    
    // Generate CSV report
    const csvPath = path.join(outputDir, config.REPORT.CSV_REPORT_NAME);
    fs.writeFileSync(csvPath, this.metrics.exportToCSV());
    console.log(`[REPORT] CSV report saved to: ${csvPath}`);
    
    // Print summary
    this.printSummary();
  }

  /**
   * Print test summary to console
   */
  printSummary() {
    const stats = this.metrics.getStatistics();
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Requests:       ${stats.summary.totalRequests}`);
    console.log(`Successful Requests:  ${stats.summary.successfulRequests} (${stats.summary.successRate}%)`);
    console.log(`Failed Requests:      ${stats.summary.failedRequests} (${stats.summary.errorRate}%)`);
    console.log(`Test Duration:        ${stats.summary.duration}s`);
    console.log(`Throughput:           ${stats.summary.throughput} req/s`);
    console.log('');
    console.log('Response Times (ms):');
    console.log(`  Min:    ${stats.responseTimes.min}`);
    console.log(`  Avg:    ${stats.responseTimes.avg}`);
    console.log(`  P50:    ${stats.responseTimes.p50}`);
    console.log(`  P90:    ${stats.responseTimes.p90}`);
    console.log(`  P95:    ${stats.responseTimes.p95}`);
    console.log(`  P99:    ${stats.responseTimes.p99}`);
    console.log(`  Max:    ${stats.responseTimes.max}`);
    
    if (stats.thresholdViolations.length > 0) {
      console.log('\n⚠️  THRESHOLD VIOLATIONS:');
      stats.thresholdViolations.forEach(v => {
        console.log(`  - ${v.metric}: ${v.actual} (threshold: ${v.threshold}) [${v.severity}]`);
      });
    } else {
      console.log('\n✅ All performance thresholds passed!');
    }
    
    console.log('='.repeat(80) + '\n');
  }
}

// Run the test if executed directly
if (require.main === module) {
  const runner = new PerformanceTestRunner();
  runner.run().catch(error => {
    console.error('❌ Performance test failed:', error);
    process.exit(1);
  });
}

module.exports = PerformanceTestRunner;
