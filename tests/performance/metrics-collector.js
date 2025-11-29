const axios = require('axios');
const config = require('./config');

/**
 * Performance Metrics Collector
 * 
 * Collects and aggregates performance metrics during load testing
 */
class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: [],
      errors: [],
      startTime: null,
      endTime: null,
      activeUsers: 0,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0
    };
    
    this.responseTimes = [];
    this.throughputData = [];
    this.errorRates = [];
  }

  /**
   * Start collecting metrics
   */
  start() {
    this.metrics.startTime = Date.now();
    console.log('[METRICS] Started collecting performance metrics');
  }

  /**
   * Stop collecting metrics
   */
  stop() {
    this.metrics.endTime = Date.now();
    console.log('[METRICS] Stopped collecting performance metrics');
  }

  /**
   * Record a request
   */
  recordRequest(endpoint, method, responseTime, statusCode, success) {
    const timestamp = Date.now();
    
    this.metrics.requests.push({
      endpoint,
      method,
      responseTime,
      statusCode,
      success,
      timestamp
    });

    this.responseTimes.push(responseTime);
    this.metrics.totalRequests++;

    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
      this.metrics.errors.push({
        endpoint,
        method,
        statusCode,
        timestamp
      });
    }
  }

  /**
   * Update active users count
   */
  updateActiveUsers(count) {
    this.metrics.activeUsers = count;
  }

  /**
   * Calculate percentile
   */
  calculatePercentile(arr, percentile) {
    if (arr.length === 0) return 0;
    
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  /**
   * Get aggregated statistics
   */
  getStatistics() {
    const duration = (this.metrics.endTime - this.metrics.startTime) / 1000; // in seconds
    
    const summary = {
      totalRequests: this.metrics.totalRequests,
      successfulRequests: this.metrics.successfulRequests,
      failedRequests: this.metrics.failedRequests,
      successRate: ((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(2),
      errorRate: ((this.metrics.failedRequests / this.metrics.totalRequests) * 100).toFixed(2),
      duration: duration.toFixed(2),
      throughput: (this.metrics.totalRequests / duration).toFixed(2)
    };
    
    const responseTimes = {
      min: Math.min(...this.responseTimes),
      max: Math.max(...this.responseTimes),
      avg: (this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length).toFixed(2),
      p50: this.calculatePercentile(this.responseTimes, 50),
      p90: this.calculatePercentile(this.responseTimes, 90),
      p95: this.calculatePercentile(this.responseTimes, 95),
      p99: this.calculatePercentile(this.responseTimes, 99)
    };
    
    const stats = {
      summary,
      responseTimes,
      byEndpoint: this.getEndpointStatistics(),
      errors: this.metrics.errors,
      thresholdViolations: [] // Will be filled below
    };
    
    // Calculate threshold violations without calling getStatistics again
    stats.thresholdViolations = this.checkThresholdsInternal(stats);
    
    return stats;
  }

  /**
   * Get statistics by endpoint
   */
  getEndpointStatistics() {
    const endpointStats = {};
    
    this.metrics.requests.forEach(req => {
      if (!endpointStats[req.endpoint]) {
        endpointStats[req.endpoint] = {
          count: 0,
          success: 0,
          failed: 0,
          responseTimes: []
        };
      }
      
      endpointStats[req.endpoint].count++;
      endpointStats[req.endpoint].responseTimes.push(req.responseTime);
      
      if (req.success) {
        endpointStats[req.endpoint].success++;
      } else {
        endpointStats[req.endpoint].failed++;
      }
    });
    
    // Calculate statistics for each endpoint
    Object.keys(endpointStats).forEach(endpoint => {
      const stats = endpointStats[endpoint];
      const times = stats.responseTimes;
      
      stats.avgResponseTime = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);
      stats.minResponseTime = Math.min(...times);
      stats.maxResponseTime = Math.max(...times);
      stats.p95ResponseTime = this.calculatePercentile(times, 95);
      stats.successRate = ((stats.success / stats.count) * 100).toFixed(2);
      
      delete stats.responseTimes; // Remove raw data to keep output clean
    });
    
    return endpointStats;
  }

  /**
   * Check if thresholds are violated (internal method that doesn't call getStatistics)
   */
  checkThresholdsInternal(stats) {
    const violations = [];
    const thresholds = config.THRESHOLDS;
    
    // Check response time thresholds
    if (stats.responseTimes.p50 > thresholds.RESPONSE_TIME.P50) {
      violations.push({
        metric: 'P50 Response Time',
        actual: stats.responseTimes.p50,
        threshold: thresholds.RESPONSE_TIME.P50,
        severity: 'WARNING'
      });
    }
    
    if (stats.responseTimes.p95 > thresholds.RESPONSE_TIME.P95) {
      violations.push({
        metric: 'P95 Response Time',
        actual: stats.responseTimes.p95,
        threshold: thresholds.RESPONSE_TIME.P95,
        severity: 'CRITICAL'
      });
    }
    
    // Check error rate
    if (parseFloat(stats.summary.errorRate) > thresholds.ERROR_RATE) {
      violations.push({
        metric: 'Error Rate',
        actual: stats.summary.errorRate,
        threshold: thresholds.ERROR_RATE,
        severity: 'CRITICAL'
      });
    }
    
    // Check throughput
    if (parseFloat(stats.summary.throughput) < thresholds.MIN_THROUGHPUT) {
      violations.push({
        metric: 'Throughput',
        actual: stats.summary.throughput,
        threshold: thresholds.MIN_THROUGHPUT,
        severity: 'WARNING'
      });
    }
    
    return violations;
  }

  /**
   * Export metrics to JSON
   */
  exportToJSON() {
    return JSON.stringify(this.getStatistics(), null, 2);
  }

  /**
   * Export metrics to CSV
   */
  exportToCSV() {
    const headers = ['Timestamp', 'Endpoint', 'Method', 'Response Time (ms)', 'Status Code', 'Success'];
    const rows = this.metrics.requests.map(req => [
      new Date(req.timestamp).toISOString(),
      req.endpoint,
      req.method,
      req.responseTime,
      req.statusCode,
      req.success
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

module.exports = MetricsCollector;
