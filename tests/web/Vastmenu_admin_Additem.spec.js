import { test, expect } from '@playwright/test';
import { fakerAR, fakerEN } from '@faker-js/faker';

test('Add new Item with automated data', async ({ page }) => {
  test.setTimeout(60000);

  // --- STEP 1: LOGIN ---
  await test.step("Login as Admin", async () => {
    console.log("[STEP] Logging in...");
    await page.goto('https://dashboard-dev.vastmenu.com/authentication/login', {
      waitUntil: 'networkidle'
    });
    await page.waitForLoadState('domcontentloaded');

    await page.getByPlaceholder('Email').fill('admin@fastmenu.com');
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    console.log("[INFO] Login Successful");
  });

  // --- STEP 2: NAVIGATE TO PRODUCT CREATION ---
  await test.step("Navigate to Provider Details > Add Product", async () => {
    await page.getByRole('link', { name: 'Providers' }).click();
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(2000); // Stabilization pause
    await page.getByRole('button', { name: 'Details' }).first().click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Add new product' }).click();
    await page.waitForLoadState('networkidle');
    console.log("[INFO] Opened 'Add new product' form");
  });

  // --- STEP 3: FILL PRODUCT DATA ---
  await test.step("Fill Product Form with Fake Data", async () => {
    const productData = {
      nameAR: `auto ${fakerAR.commerce.productName()}`,
      nameEN: `auto ${fakerEN.commerce.productName()}`,
      descAR: `auto ${fakerAR.lorem.sentence()}`,
      descEN: `auto ${fakerEN.lorem.sentence()}`,
      allergensAR: `auto ${fakerAR.lorem.words(3)}`,
      allergensEN: `auto ${fakerEN.lorem.words(3)}`,
      price: '100',
      calories: '10',
      displayOrder: '1'
    };

    console.log(`[INFO] Creating product: ${productData.nameEN}`);

    await page.getByRole('textbox', { name: 'Name AR Name AR' }).fill(productData.nameAR);
    await page.getByRole('textbox', { name: 'Name EN Name EN' }).fill(productData.nameEN);
    await page.getByRole('textbox', { name: 'Description AR Description AR' }).fill(productData.descAR);
    await page.getByRole('textbox', { name: 'Description EN Description EN' }).fill(productData.descEN);
    
    await page.getByRole('spinbutton', { name: 'Price Price' }).fill(productData.price);
    await page.getByRole('spinbutton', { name: 'Calories Calories' }).fill(productData.calories);
    await page.getByRole('spinbutton', { name: 'Display order Display order' }).fill(productData.displayOrder);
    
    await page.getByRole('textbox', { name: 'Allergens in arabic Allergens' }).fill(productData.allergensAR);
    await page.getByRole('textbox', { name: 'Allergens in english' }).fill(productData.allergensEN);
  });

  // --- STEP 4: UPLOAD IMAGE & SAVE ---
  await test.step("Upload Image and Save Product", async () => {
    await handleImageUpload(page);
    
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForLoadState('networkidle');
    console.log("[SUCCESS] Product Saved");
  });
});

// Helper function for robust image upload
async function handleImageUpload(page) {
  const imageFiles = [
    'test-images/automation.jpeg',
    'test-images/automation.png',
    'test-images/automation.jpg'
  ];

  for (const imagePath of imageFiles) {
    try {
      console.log(`[INFO] Attempting to upload: ${imagePath}`);
      const fileInput = page.getByRole('button', { name: 'Upload Image Upload Image' });
      await fileInput.waitFor({ state: 'visible', timeout: 5000 });
      await fileInput.setInputFiles(imagePath);
      await page.waitForTimeout(2000);
      
      const errorMessage = page.getByText('Image type is not acceptable');
      if (await errorMessage.isVisible({ timeout: 3000 })) {
        console.log(`[WARN] Image ${imagePath} failed, trying next...`);
        continue;
      }
      console.log(`[SUCCESS] Uploaded: ${imagePath}`);
      return; 
    } catch (error) {
      console.log(`[WARN] Failed to upload ${imagePath}, trying next...`);
      continue;
    }
  }
  console.warn('[WARN] All image uploads failed, continuing without image');
}


// import { test, expect } from '@playwright/test';
// import { fakerAR, fakerEN } from '@faker-js/faker';
// //npx playwright test ./tests/web/Vastmenu_admin_Additem.spec.js --headed
// test('Add new Item with automated data', async ({ page }) => {
//   // Configure timeout and wait for network idle
//   test.setTimeout(60000);
  
//   // Navigate to login page and wait for network to be idle
//   await page.goto('https://dashboard-staging.vastmenu.com/authentication/login', {
//     waitUntil: 'networkidle'
//   });

//   // Wait for page to be fully loaded
//   await page.waitForLoadState('domcontentloaded');
//   await page.waitForLoadState('networkidle');

//   // Login section with better selectors and error handling
//   await page.getByPlaceholder('Email').fill('admin@fastmenu.com');
//   await page.getByPlaceholder('Password').fill('password');
//   await page.getByRole('button', { name: 'Sign In' }).click();

//   // Wait for login to complete and navigation to happen
//   await page.waitForURL('**/dashboard**', { timeout: 15000 });
//   await page.waitForLoadState('networkidle');

//   // Navigate to Providers
//   await page.getByRole('link', { name: 'Providers' }).click();
//   await page.waitForLoadState('networkidle');

//   await page.pause(2000); // Small pause to ensure elements load
//   // Click on first Details button
//   await page.getByRole('button', { name: 'Details' }).first().click();
//   await page.waitForLoadState('networkidle');

//   // Add new product
//   await page.getByRole('button', { name: 'Add new product' }).click();
//   await page.waitForLoadState('networkidle');

//   // Generate fake data with Arabic and English
//   const productData = {
//     nameAR: `auto ${fakerAR.commerce.productName()}`,
//     nameEN: `auto ${fakerEN.commerce.productName()}`,
//     descAR: `auto ${fakerAR.lorem.sentence()}`,
//     descEN: `auto ${fakerEN.lorem.sentence()}`,
//     allergensAR: `auto ${fakerAR.lorem.words(3)}`,
//     allergensEN: `auto ${fakerEN.lorem.words(3)}`,
//     price: '100', // Default value as requested
//     calories: '10',
//     displayOrder: '1'
//   };

//   // Fill product form with generated data
//   await page.getByRole('textbox', { name: 'Name AR Name AR' }).fill(productData.nameAR);
//   await page.getByRole('textbox', { name: 'Name EN Name EN' }).fill(productData.nameEN);
//   await page.getByRole('textbox', { name: 'Description AR Description AR' }).fill(productData.descAR);
//   await page.getByRole('textbox', { name: 'Description EN Description EN' }).fill(productData.descEN);
  
//   await page.getByRole('spinbutton', { name: 'Price Price' }).fill(productData.price);
//   await page.getByRole('spinbutton', { name: 'Calories Calories' }).fill(productData.calories);
//   await page.getByRole('spinbutton', { name: 'Display order Display order' }).fill(productData.displayOrder);
  
//   await page.getByRole('textbox', { name: 'Allergens in arabic Allergens' }).fill(productData.allergensAR);
//   await page.getByRole('textbox', { name: 'Allergens in english' }).fill(productData.allergensEN);

//   // Image upload with robust handling
//   await handleImageUpload(page);

//   // Save the product
//   await page.getByRole('button', { name: 'Save' }).click();

//   // Wait for save to complete and verify success
//   await page.waitForLoadState('networkidle');

//   // Add your assertions here
//   // await expect(page.getByRole('button', { name: /Hello, Admin/i })).toBeVisible();
//   //await expect(page.locator('#app')).toContainText('Dashboard state');

// });

// // Helper function for robust image upload
// async function handleImageUpload(page) {
//   const imageFiles = [
//     'test-images/automation.jpeg',
//     'test-images/automation.png',
//     'test-images/automation.jpg'
//   ];

//   // Try multiple image files until one works
//   for (const imagePath of imageFiles) {
//     try {
//       // Wait for file input to be ready
//       const fileInput = page.getByRole('button', { name: 'Upload Image Upload Image' });
//       await fileInput.waitFor({ state: 'visible', timeout: 5000 });
      
//       // Set input files
//       await fileInput.setInputFiles(imagePath);
      
//       // Wait for upload to complete
//       await page.waitForTimeout(2000);
      
//       // Check if upload was successful (no error message)
//       const errorMessage = page.getByText('Image type is not acceptable');
//       if (await errorMessage.isVisible({ timeout: 3000 })) {
//         console.log(`Image ${imagePath} failed, trying next...`);
//         continue;
//       }
      
//       console.log(`Successfully uploaded: ${imagePath}`);
//       return; // Exit if upload successful
//     } catch (error) {
//       console.log(`Failed to upload ${imagePath}, trying next...`);
//       continue;
//     }
//   }
  
//   // If all images fail, log warning but continue (as requested)
//   console.warn('All image uploads failed, continuing without image');
// }