/**
 * Performance Test Configuration
 * 
 * This file contains all configurable parameters for performance testing.
 * Modify these values to adjust test scenarios without changing test logic.
 */

module.exports = {
  // ==================== LOAD TESTING PARAMETERS ====================
  
  // Number of concurrent virtual users
  CONCURRENT_USERS: 50,
  
  // Test duration in seconds
  TEST_DURATION: 60,
  
  // Ramp-up time in seconds (time to reach max concurrent users)
  RAMP_UP_TIME: 10,
  
  // Think time between actions (milliseconds)
  THINK_TIME: {
    MIN: 500,
    MAX: 2000
  },
  
  // Request timeout (milliseconds)
  REQUEST_TIMEOUT: 30000,
  
  // ==================== APPLICATION ENDPOINTS ====================
  
  BASE_URL: 'https://api-dev.vastmenu.com',
  DASHBOARD_URL: 'https://dashboard-dev.vastmenu.com',
  PWA_URL: 'https://pwa-dev.vastmenu.com',
  
  // API Endpoints to test
  ENDPOINTS: {
    // Authentication
    LOGIN: '/authentication/login',
    LOGOUT: '/authentication/logout',
    
    // Menu operations
    GET_MENU: '/api/menu',
    GET_CATEGORIES: '/api/categories',
    GET_ITEMS: '/api/items',
    
    // Order operations
    CREATE_ORDER: '/api/orders',
    GET_ORDER: '/api/orders/:id',
    UPDATE_ORDER: '/api/orders/:id',
    
    // Payment operations
    PROCESS_PAYMENT: '/api/payments',
    VERIFY_PAYMENT: '/api/payments/verify',
    
    // Table operations
    GET_TABLES: '/api/tables',
    UPDATE_TABLE_STATUS: '/api/tables/:id/status',
    
    // Reports
    GET_PAYMENT_REPORT: '/api/reports/payments',
    GET_ORDER_REPORT: '/api/reports/orders'
  },
  
  // ==================== TEST SCENARIOS ====================
  
  SCENARIOS: [
    {
      name: 'Customer Order Flow',
      weight: 40, // 40% of users
      description: 'Simulates customer browsing menu and placing orders',
      steps: [
        'Scan QR Code',
        'Browse Menu',
        'Add Items to Cart',
        'Confirm Order',
        'Process Payment'
      ]
    },
    {
      name: 'Admin Dashboard Operations',
      weight: 30, // 30% of users
      description: 'Simulates admin managing tables and viewing reports',
      steps: [
        'Login to Dashboard',
        'View Tables',
        'Check Order Reports',
        'Check Payment Reports'
      ]
    },
    {
      name: 'Split Payment Flow',
      weight: 20, // 20% of users
      description: 'Simulates customers splitting bills',
      steps: [
        'Create Order',
        'Split Invoice',
        'Process First Payment',
        'Process Second Payment'
      ]
    },
    {
      name: 'Menu Browsing Only',
      weight: 10, // 10% of users
      description: 'Simulates users just browsing the menu',
      steps: [
        'Scan QR Code',
        'Browse Categories',
        'View Items'
      ]
    }
  ],
  
  // ==================== PERFORMANCE THRESHOLDS ====================
  
  THRESHOLDS: {
    // Response time thresholds (milliseconds)
    RESPONSE_TIME: {
      P50: 500,    // 50th percentile should be under 500ms
      P90: 1000,   // 90th percentile should be under 1s
      P95: 2000,   // 95th percentile should be under 2s
      P99: 5000    // 99th percentile should be under 5s
    },
    
    // Error rate threshold (percentage)
    ERROR_RATE: 1, // Less than 1% errors
    
    // Throughput threshold (requests per second)
    MIN_THROUGHPUT: 100,
    
    // Success rate threshold (percentage)
    MIN_SUCCESS_RATE: 99
  },
  
  // ==================== REPORTING ====================
  
  REPORT: {
    OUTPUT_DIR: './test-results/performance',
    HTML_REPORT_NAME: 'performance-report.html',
    JSON_REPORT_NAME: 'performance-metrics.json',
    CSV_REPORT_NAME: 'performance-data.csv',
    
    // Include detailed metrics
    INCLUDE_DETAILED_METRICS: true,
    
    // Generate charts
    GENERATE_CHARTS: true
  },
  
  // ==================== TEST DATA ====================
  
  TEST_DATA: {
    // Login credentials
    ADMIN_CREDENTIALS: {
      email: 'amr@test.test',
      password: 'password'
    },
    
    // Sample menu items to order
    SAMPLE_ITEMS: [
      { id: 1, name: 'Item 1', price: 50 },
      { id: 2, name: 'Item 2', price: 75 },
      { id: 3, name: 'Item 3', price: 100 }
    ],
    
    // Test card details
    TEST_CARD: {
      number: '5123450000000008',
      expiry: '01/39',
      cvv: '100',
      holderName: 'APPROVe'
    },
    
    // Table IDs for testing
    TABLE_IDS: [
      '1badfbf9-8d2e-4119-a9c2-61c3575ceaa9',
      '2fe4ca70-6b80-4c12-b1d0-3dc36060a908'
    ]
  },
  
  // ==================== MONITORING ====================
  
  MONITORING: {
    // Enable real-time monitoring
    ENABLE_REAL_TIME: true,
    
    // Monitoring interval (milliseconds)
    INTERVAL: 5000,
    
    // Metrics to track
    TRACK_METRICS: [
      'response_time',
      'throughput',
      'error_rate',
      'active_users',
      'cpu_usage',
      'memory_usage'
    ]
  }
};
