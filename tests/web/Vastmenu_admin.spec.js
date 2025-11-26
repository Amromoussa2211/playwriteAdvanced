import { test, expect } from '@playwright/test';

test('Dashboard Flow - Login and change language and check all elements', async ({ browser }) => {
  // Create Incognito Context
  const context = await browser.newContext();
  const page = await context.newPage();

  // --- STEP 1: NAVIGATE ---
  await test.step('Navigate to login page', async () => {
    console.log("[STEP] Navigating to Login");
    await page.goto('https://dashboard-dev.vastmenu.com/authentication/login', {
      waitUntil: 'networkidle'
    });
  });

  // --- STEP 2: LOGIN ---
  await test.step('Login as Admin', async () => {
    console.log("[STEP] Performing Admin Login");
    await page.getByPlaceholder('Email').fill('admin@fastmenu.com');
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: /Hello, Admin/i })).toBeVisible();
    await expect(page.locator('#app')).toContainText('Dashboard state');
    console.log("[INFO] Login Successful");
  });

  // --- STEP 3: CHANGE LANGUAGE AR ---
  await test.step('Change language to Arabic', async () => {
    console.log("[STEP] Switching to Arabic");
    await page.getByRole('button', { name: /Hello, Admin/i }).click();
    await page.getByRole('button', { name: 'Change language' }).click();
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#app')).toContainText('معلومات لوحه التحكم');
    console.log("[INFO] Language changed to Arabic");
  });

  // --- STEP 4: CHANGE LANGUAGE EN ---
  await test.step('Change language back to English', async () => {
    console.log("[STEP] Switching back to English");
    await page.getByRole('button', { name: /Hello, Admin/i }).click();
    await page.getByRole('button', { name: 'تغير اللغة' }).click();
    await page.waitForLoadState('networkidle');
  });

  // --- STEP 5: NAVIGATION CHECKS ---
  await test.step('Navigate between system pages', async () => {
    const pages = [
      'Roles & Permissions',
      'Pages',
      'Payment status',
      'Contact us',
      'Requests $vuetify.badge'
    ];

    for (const link of pages) {
      console.log(`[INFO] Visiting: ${link}`);
      await page.getByRole('link', { name: link }).click();
      await page.waitForLoadState('networkidle');
    }
  });

  // --- STEP 6: MANAGE REQUESTS ---
  await test.step('Change request status', async () => {
    console.log("[STEP] Modifying Request Status");
    await page.getByRole('button').nth(1).click();
    await page.locator('div', { hasText: /^approved$/ }).nth(2).click();
    await page.getByRole('button', { name: 'approved' }).click();
    await page.getByText('pending').click();
    console.log("[SUCCESS] Request status updated");
  });

  await context.close();
});