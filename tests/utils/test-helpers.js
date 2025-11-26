/**
 * Playwright Test Utilities for CI/CD Stability
 * Helper functions to make tests more robust in pipeline environments
 */

/**
 * Safe click with automatic retries and better waits
 * @param {Page} page - Playwright page object
 * @param {Locator} locator - Element locator
 * @param {Object} options - Click options
 */
export async function safeClick(page, locator, options = {}) {
  const { timeout = 30000, retries = 3 } = options;
  
  for (let i = 0; i < retries; i++) {
    try {
      // Wait for element to be ready
      await locator.waitFor({ state: 'visible', timeout });
      await locator.waitFor({ state: 'attached', timeout });
      
      // Scroll into view if needed
      await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      
      // Wait for animations to complete
      await page.waitForTimeout(300);
      
      // Click
      await locator.click({ timeout });
      
      console.log(`[INFO] Click successful on attempt ${i + 1}`);
      return; // Success
      
    } catch (error) {
      console.log(`[WARN] Click failed on attempt ${i + 1}/${retries}: ${error.message}`);
      
      if (i === retries - 1) {
        throw new Error(`Failed to click after ${retries} attempts: ${error.message}`);
      }
      
      // Wait before retry
      await page.waitForTimeout(1000);
    }
  }
}

/**
 * Safe fill with automatic retries
 * @param {Page} page - Playwright page object
 * @param {Locator} locator - Input locator
 * @param {string} value - Value to fill
 * @param {Object} options - Fill options
 */
export async function safeFill(page, locator, value, options = {}) {
  const { timeout = 30000, retries = 3 } = options;
  
  for (let i = 0; i < retries; i++) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await locator.clear({ timeout: 5000 }).catch(() => {});
      await locator.fill(value, { timeout });
      
      // Verify the value was filled
      const filledValue = await locator.inputValue();
      if (filledValue === value) {
        console.log(`[INFO] Fill successful on attempt ${i + 1}`);
        return;
      }
      
      throw new Error(`Value mismatch: expected "${value}", got "${filledValue}"`);
      
    } catch (error) {
      console.log(`[WARN] Fill failed on attempt ${i + 1}/${retries}: ${error.message}`);
      
      if (i === retries - 1) {
        throw new Error(`Failed to fill after ${retries} attempts: ${error.message}`);
      }
      
      await page.waitForTimeout(1000);
    }
  }
}

/**
 * Wait for network to be idle (more robust than networkidle)
 * @param {Page} page - Playwright page object
 * @param {Object} options - Wait options
 */
export async function waitForNetworkIdle(page, options = {}) {
  const { timeout = 30000, idleTime = 500 } = options;
  
  try {
    await page.waitForLoadState('networkidle', { timeout });
    await page.waitForTimeout(idleTime); // Extra stability
    console.log('[INFO] Network is idle');
  } catch (error) {
    console.log('[WARN] Network idle timeout, continuing anyway');
  }
}

/**
 * Wait for element with better error handling
 * @param {Locator} locator - Element locator
 * @param {Object} options - Wait options
 */
export async function waitForElement(locator, options = {}) {
  const { state = 'visible', timeout = 30000 } = options;
  
  try {
    await locator.waitFor({ state, timeout });
    console.log(`[INFO] Element is ${state}`);
    return true;
  } catch (error) {
    console.log(`[WARN] Element wait failed: ${error.message}`);
    return false;
  }
}

/**
 * Handle iframe interactions with better stability
 * @param {Page} page - Playwright page object
 * @param {string} iframeName - Iframe name or selector
 * @param {Function} callback - Function to execute in iframe context
 */
export async function handleIframe(page, iframeName, callback) {
  const maxRetries = 3;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Wait for iframe to be available
      const iframeElement = page.locator(`iframe[name="${iframeName}"]`);
      await iframeElement.waitFor({ state: 'attached', timeout: 30000 });
      await iframeElement.waitFor({ state: 'visible', timeout: 30000 });
      
      // Get frame content
      const frame = iframeElement.contentFrame();
      
      if (!frame) {
        throw new Error('Frame content not available');
      }
      
      // Wait for frame to load
      await frame.waitForLoadState('domcontentloaded', { timeout: 30000 });
      await page.waitForTimeout(1000); // Stability
      
      // Execute callback
      await callback(frame);
      
      console.log(`[INFO] Iframe interaction successful on attempt ${i + 1}`);
      return;
      
    } catch (error) {
      console.log(`[WARN] Iframe interaction failed on attempt ${i + 1}/${maxRetries}: ${error.message}`);
      
      if (i === maxRetries - 1) {
        throw new Error(`Failed to interact with iframe after ${maxRetries} attempts: ${error.message}`);
      }
      
      await page.waitForTimeout(2000);
    }
  }
}

/**
 * Wait for URL pattern with retries
 * @param {Page} page - Playwright page object
 * @param {RegExp|string} pattern - URL pattern to wait for
 * @param {Object} options - Wait options
 */
export async function waitForURL(page, pattern, options = {}) {
  const { timeout = 60000, retries = 3 } = options;
  
  for (let i = 0; i < retries; i++) {
    try {
      await page.waitForURL(pattern, { timeout });
      console.log(`[INFO] URL matched pattern on attempt ${i + 1}`);
      return;
    } catch (error) {
      console.log(`[WARN] URL wait failed on attempt ${i + 1}/${retries}: ${error.message}`);
      console.log(`[INFO] Current URL: ${page.url()}`);
      
      if (i === retries - 1) {
        throw new Error(`Failed to reach URL pattern after ${retries} attempts: ${error.message}`);
      }
      
      await page.waitForTimeout(2000);
    }
  }
}

/**
 * Smart wait - combines multiple wait strategies
 * @param {Page} page - Playwright page object
 * @param {Object} options - Wait options
 */
export async function smartWait(page, options = {}) {
  const { timeout = 30000 } = options;
  
  try {
    // Wait for DOM to be ready
    await page.waitForLoadState('domcontentloaded', { timeout });
    
    // Wait for network to be idle
    await page.waitForLoadState('networkidle', { timeout }).catch(() => {
      console.log('[INFO] Network idle timeout, continuing');
    });
    
    // Wait for no loading spinners
    const loadingSelectors = [
      '.loading',
      '.spinner',
      '.v-progress-linear',
      '[role="progressbar"]',
      '.skeleton'
    ];
    
    for (const selector of loadingSelectors) {
      const element = page.locator(selector).first();
      const isVisible = await element.isVisible({ timeout: 1000 }).catch(() => false);
      
      if (isVisible) {
        await element.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
          console.log(`[INFO] Loading element ${selector} still visible, continuing`);
        });
      }
    }
    
    // Final stability wait
    await page.waitForTimeout(500);
    
    console.log('[INFO] Smart wait completed');
    
  } catch (error) {
    console.log(`[WARN] Smart wait encountered error: ${error.message}`);
  }
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 */
export async function retryWithBackoff(fn, options = {}) {
  const { retries = 3, initialDelay = 1000, maxDelay = 10000 } = options;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      
      const delay = Math.min(initialDelay * Math.pow(2, i), maxDelay);
      console.log(`[WARN] Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
