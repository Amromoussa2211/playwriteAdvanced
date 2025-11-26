import { test, expect } from '@playwright/test';

test('Create category of item with robust image upload and dynamic waits', async ({ page }) => {
  test.setTimeout(120000);

  // --- STEP 1: LOGIN ---
  await test.step("Login to Dashboard", async () => {
    console.log("[STEP] Starting Login");
    await page.goto('https://dashboard-dev.vastmenu.com/authentication/login');
    await waitForAppReady(page);
    
    await safeClick(page, page.getByPlaceholder('Email'));
    await page.getByPlaceholder('Email').fill('admin@fastmenu.com');
    
    await safeClick(page, page.getByPlaceholder('Password'));
    await page.getByPlaceholder('Password').fill('password');
    
    await safeClick(page, page.getByRole('button', { name: 'Sign In' }));
    await page.waitForURL('**/admin/dashboard-state', { timeout: 30000 });
    await waitForAppReady(page);
    console.log("[INFO] Login Complete");
  });

  // --- STEP 2: NAVIGATE TO CATEGORIES ---
  await test.step("Navigate to Provider Categories", async () => {
    await safeClick(page, page.getByRole('link', { name: 'Providers' }));
    await waitForAppReady(page);

    await safeClick(page, page.getByRole('button', { name: 'Details' }).first());
    await waitForAppReady(page);

    await safeClick(page, page.locator('div').filter({ hasText: /^Categories$/ }).first());
    await waitForAppReady(page);

    await safeClick(page, page.getByRole('button', { name: 'Add new categories' }));
    await waitForAppReady(page);
    console.log("[INFO] Opened 'Add new category' form");
  });

  // --- STEP 3: FILL CATEGORY DATA ---
  const timestamp = Date.now();
  const categoryNameAR = `auto test cat ${timestamp}`;
  const categoryNameEN = `auto test cant ${timestamp}`;

  await test.step("Fill Category Details", async () => {
    console.log(`[INFO] Creating category: ${categoryNameEN}`);
    
    await safeClick(page, page.getByRole('textbox', { name: 'Name AR Name AR' }));
    await page.getByRole('textbox', { name: 'Name AR Name AR' }).fill(categoryNameAR);

    await safeClick(page, page.getByRole('textbox', { name: 'Name EN Name EN' }));
    await page.getByRole('textbox', { name: 'Name EN Name EN' }).fill(categoryNameEN);

    await safeClick(page, page.getByRole('textbox', { name: 'Display order Display order' }));
    await page.getByRole('textbox', { name: 'Display order Display order' }).fill('2');
  });

  // --- STEP 4: UPLOAD & SAVE ---
  await test.step("Upload Image and Save", async () => {
    await handleImageUpload(page);
    await safeClick(page, page.getByRole('button', { name: 'Save' }));
    await waitForSaveCompletion(page);
    console.log("[INFO] Category saved");
  });

  // --- STEP 5: VERIFY CREATION ---
  await test.step("Verify Category in Table", async () => {
    await safeClick(page, page.getByPlaceholder('Search'));
    await page.getByPlaceholder('Search').fill(categoryNameAR);
    await safeClick(page, page.getByRole('button', { name: 'Search' }));
    
    await waitForAppReady(page);
    await page.waitForTimeout(2000);

    await expect(page.locator('tbody')).toContainText(categoryNameEN);
    await expect(page.locator('tbody')).toContainText(categoryNameAR);
    console.log("[SUCCESS] Category verified in list");
  });
});

// --- HELPER FUNCTIONS ---

async function handleImageUpload(page) {
  const imageFiles = [
    'test-images/automation.jpeg',
    'test-images/automation.png',
    'test-images/automation.jpg',
    'automation.png'
  ];

  for (const imagePath of imageFiles) {
    try {
      const fileInput = page.getByRole('button', { name: 'Upload Image Upload Image' });
      await fileInput.waitFor({ state: 'visible', timeout: 10000 });
      
      await fileInput.setInputFiles(imagePath);
      await page.waitForTimeout(3000);
      
      const errorMessage = page.getByText('Image type is not acceptable');
      if (await errorMessage.isVisible({ timeout: 2000 })) {
        console.log(`[WARN] Image ${imagePath} rejected, trying next...`);
        continue;
      }
      
      // Assume success if no error
      console.log(`[INFO] Successfully uploaded: ${imagePath}`);
      return; 
    } catch (error) {
      console.log(`[WARN] Failed to upload ${imagePath}, trying next...`);
      continue;
    }
  }
  console.warn('[WARN] All image uploads failed, continuing without image');
}

async function waitForAppReady(page) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const loadingSelectors = [
      '.loading', '[data-loading="true"]', '.spinner', '.progress-bar',
      '.v-progress-linear', '[role="progressbar"]'
    ];
    for (const selector of loadingSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
        await element.waitFor({ state: 'hidden', timeout: 10000 });
      }
    }
    await page.waitForTimeout(1000);
  } catch (error) {
    console.log('[INFO] Wait for app ready timeout, continuing anyway...');
  }
}

async function safeClick(page, locator, timeout = 15000) {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    await expect(locator).toBeEnabled({ timeout: 10000 });
    await page.waitForTimeout(500);
    await locator.click();
    await page.waitForTimeout(500);
  } catch (error) {
    console.log(`[WARN] Click failed on ${locator}, retrying...`);
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      await locator.click();
    } catch (retryError) {
      throw new Error(`[ERROR] Failed to click element: ${locator}`);
    }
  }
}

async function waitForSaveCompletion(page) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 20000 });
    const successSelectors = ['.success', '.v-alert--success', '.v-snackbar--success'];
    
    for (const selector of successSelectors) {
      if (await page.locator(selector).first().isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('[INFO] Success message detected');
        break;
      }
    }
    await page.waitForTimeout(3000);
  } catch (error) {
    console.log('[INFO] Save completion check finished');
  }
}

// import { test, expect } from '@playwright/test';

// test('Create category of item with robust image upload and dynamic waits', async ({ page }) => {
//   // Set longer timeout for the entire test
//   test.setTimeout(120000);

//   // Login
//   await page.goto('https://dashboard-staging.vastmenu.com/authentication/login');
  
//   // Wait for page to be fully loaded
//   await waitForAppReady(page);
  
//   await safeClick(page, page.getByPlaceholder('Email'));
//   await page.getByPlaceholder('Email').fill('admin@fastmenu.com');
  
//   await safeClick(page, page.getByPlaceholder('Password'));
//   await page.getByPlaceholder('Password').fill('password');
  
//   await safeClick(page, page.getByRole('button', { name: 'Sign In' }));
  
//   // Wait for login to complete and redirect
//   await page.waitForURL('**/admin/dashboard-state', { timeout: 30000 });
//   await waitForAppReady(page);

//   // Navigate to Providers
//   await safeClick(page, page.getByRole('link', { name: 'Providers' }));
//   await waitForAppReady(page);

//   // Click on first Details button
//   await safeClick(page, page.getByRole('button', { name: 'Details' }).first());
//   await waitForAppReady(page);

//   // Click on Categories
//   await safeClick(page, page.locator('div').filter({ hasText: /^Categories$/ }).first());
//   await waitForAppReady(page);

//   // Create new category
//   await safeClick(page, page.getByRole('button', { name: 'Add new categories' }));
//   await waitForAppReady(page);

//   // Fill category details
//   const timestamp = Date.now();
//   const categoryNameAR = `auto test cat ${timestamp}`;
//   const categoryNameEN = `auto test cant ${timestamp}`;

//   // Fill Arabic name
//   await safeClick(page, page.getByRole('textbox', { name: 'Name AR Name AR' }));
//   await page.getByRole('textbox', { name: 'Name AR Name AR' }).fill(categoryNameAR);

//   // Fill English name
//   await safeClick(page, page.getByRole('textbox', { name: 'Name EN Name EN' }));
//   await page.getByRole('textbox', { name: 'Name EN Name EN' }).fill(categoryNameEN);

//   // Fill display order
//   await safeClick(page, page.getByRole('textbox', { name: 'Display order Display order' }));
//   await page.getByRole('textbox', { name: 'Display order Display order' }).fill('2');

//   // Handle image upload using the helper function
//   await handleImageUpload(page);

//   // Save the category
//   await safeClick(page, page.getByRole('button', { name: 'Save' }));

//   // Wait for save to complete with multiple verification methods
//   await waitForSaveCompletion(page);

//   // Verify the category was created successfully
//   await safeClick(page, page.getByPlaceholder('Search'));
//   await page.getByPlaceholder('Search').fill(categoryNameAR);
  
//   await safeClick(page, page.getByRole('button', { name: 'Search' }));
  
//   // Wait for search results to load
//   await waitForAppReady(page);
//   await page.waitForTimeout(2000);

//   // Verify the category appears in the table
//   await expect(page.locator('tbody')).toContainText(categoryNameEN);
//   await expect(page.locator('tbody')).toContainText(categoryNameAR);
// });

// // Helper function for robust image upload
// async function handleImageUpload(page) {
//   const imageFiles = [
//     'test-images/automation.jpeg',
//     'test-images/automation.png',
//     'test-images/automation.jpg',
//     'automation.png' // fallback to your original file
//   ];

//   // Try multiple image files until one works
//   for (const imagePath of imageFiles) {
//     try {
//       // Wait for file input to be ready
//       const fileInput = page.getByRole('button', { name: 'Upload Image Upload Image' });
//       await fileInput.waitFor({ state: 'visible', timeout: 10000 });
      
//       // Set input files
//       await fileInput.setInputFiles(imagePath);
      
//       // Wait for upload to complete
//       await page.waitForTimeout(3000);
      
//       // Check if upload was successful (no error message)
//       const errorMessage = page.getByText('Image type is not acceptable');
//       if (await errorMessage.isVisible({ timeout: 2000 })) {
//         console.log(`Image ${imagePath} failed, trying next...`);
//         continue;
//       }
      
//       // Additional check for successful upload - look for success indicators
//       try {
//         // Wait a bit more for any upload completion indicators
//         await page.waitForTimeout(2000);
//         console.log(`Successfully uploaded: ${imagePath}`);
//         return; // Exit if upload successful
//       } catch {
//         console.log(`Upload status unclear for ${imagePath}, but continuing...`);
//         return;
//       }
//     } catch (error) {
//       console.log(`Failed to upload ${imagePath}, trying next...`);
//       continue;
//     }
//   }
  
//   // If all images fail, log warning but continue (as requested)
//   console.warn('All image uploads failed, continuing without image');
// }

// // Dynamic wait for application to be ready
// async function waitForAppReady(page) {
//   try {
//     // Wait for network to be idle
//     await page.waitForLoadState('networkidle', { timeout: 15000 });
    
//     // Wait for any loading spinners to disappear
//     const loadingSelectors = [
//       '.loading', '[data-loading="true"]', '.spinner', '.progress-bar',
//       '.v-progress-linear', '[role="progressbar"]'
//     ];
    
//     for (const selector of loadingSelectors) {
//       try {
//         const element = page.locator(selector).first();
//         if (await element.isVisible({ timeout: 1000 })) {
//           await element.waitFor({ state: 'hidden', timeout: 10000 });
//         }
//       } catch {
//         // Ignore if selector not found or not visible
//       }
//     }
    
//     // Small delay to ensure DOM is stable
//     await page.waitForTimeout(1000);
    
//   } catch (error) {
//     console.log('Wait for app ready timeout, continuing anyway...');
//   }
// }

// // Safe click with dynamic waits
// async function safeClick(page, locator, timeout = 15000) {
//   try {
//     // Wait for element to be ready
//     await locator.waitFor({ state: 'visible', timeout });
    
//     // Wait for element to be enabled
//     await expect(locator).toBeEnabled({ timeout: 10000 });
    
//     // Wait for any animations to complete
//     await page.waitForTimeout(500);
    
//     // Click the element
//     await locator.click();
    
//     // Wait for click to process
//     await page.waitForTimeout(500);
    
//   } catch (error) {
//     console.log(`Click failed on ${locator}, retrying once...`);
    
//     // Retry once
//     try {
//       await locator.waitFor({ state: 'visible', timeout: 5000 });
//       await expect(locator).toBeEnabled({ timeout: 5000 });
//       await page.waitForTimeout(500);
//       await locator.click();
//       await page.waitForTimeout(500);
//     } catch (retryError) {
//       throw new Error(`Failed to click element after retry: ${locator}`);
//     }
//   }
// }

// // Wait for save operation to complete
// async function waitForSaveCompletion(page) {
//   try {
//     // Wait for network requests to complete
//     await page.waitForLoadState('networkidle', { timeout: 20000 });
    
//     // Look for success messages
//     const successSelectors = [
//       '.success', '.v-alert--success', '.v-snackbar--success',
//       '.message-success', '[data-success="true"]'
//     ];
    
//     for (const selector of successSelectors) {
//       try {
//         const successElement = page.locator(selector).first();
//         if (await successElement.isVisible({ timeout: 3000 })) {
//           console.log('Save operation completed successfully');
//           break;
//         }
//       } catch {
//         // Continue if success indicator not found
//       }
//     }
    
//     // Wait a bit more for any redirects or UI updates
//     await page.waitForTimeout(3000);
    
//   } catch (error) {
//     console.log('Save completion check timeout, continuing...');
//   }
// }