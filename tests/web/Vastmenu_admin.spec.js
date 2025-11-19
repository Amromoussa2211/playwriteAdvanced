import { test, expect } from '@playwright/test';
//npx playwright test ./tests/web/Vastmenu_admin.spec.js --headed

test('Dashboard Flow - Login and change lunguage and check all is apper', async ({ browser }) => {

  // ---- Create Incognito Context ----
  const context = await browser.newContext();
  const page = await context.newPage();

  // ---- Go to Login Page ----
  await test.step('Navigate to login page', async () => {
    await page.goto('https://dashboard-staging.vastmenu.com/authentication/login', {
      waitUntil: 'networkidle' // more stable
    });
  });

  // ---- Login ----
  await test.step('Login as Admin', async () => {
    await page.getByPlaceholder('Email').fill('admin@fastmenu.com');
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // wait dashboard to load
    await page.waitForLoadState('networkidle');

await expect(page.getByRole('button', { name: /Hello, Admin/i })).toBeVisible();
    await expect(page.locator('#app')).toContainText('Dashboard state');
  });

  // ---- Change Language to Arabic ----
  await test.step('Change language to Arabic', async () => {
    await page.getByRole('button', { name: /Hello, Admin/i }).click();
    await page.getByRole('button', { name: 'Change language' }).click();
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#app')).toContainText('معلومات لوحه التحكم');
  });

  // ---- Change Language Back to English ----
  await test.step('Change language back to English', async () => {
    await page.getByRole('button', { name: /Hello, Admin/i }).click();
    await page.getByRole('button', { name: 'تغير اللغة' }).click();
    await page.waitForLoadState('networkidle');
  });

  // ---- Navigate Between Pages ----
  await test.step('Navigate between system pages', async () => {
    const pages = [
      'Roles & Permissions',
      'Pages',
      'Payment status',
      'Contact us',
      'Requests $vuetify.badge'
    ];

    for (const link of pages) {
      await page.getByRole('link', { name: link }).click();
      await page.waitForLoadState('networkidle');
    }
  });

  // ---- Interact With Requests Table ----
  await test.step('Change request status', async () => {
    await page.getByRole('button').nth(1).click();
    await page.locator('div', { hasText: /^approved$/ }).nth(2).click();
    await page.getByRole('button', { name: 'approved' }).click();
    await page.getByText('pending').click();
  });

  await context.close();
});


// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://dashboard-staging.vastmenu.com/authentication/login');
//   await page.getByPlaceholder('Email').click();
//   await page.getByPlaceholder('Email').click();
//   await page.getByPlaceholder('Email').fill('admin@fastmenu.com');
//   await page.getByPlaceholder('Email').click();
//   await page.getByPlaceholder('Password').click();
//   await page.getByPlaceholder('Password').fill('password');
//   await page.getByRole('button', { name: 'Sign In' }).click();
//   await expect(page.getByRole('button')).toContainText('Hello, Admin');
//   await expect(page.locator('#app')).toContainText('Dashboard state');
//   await page.getByRole('button', { name: 'Hello, Admin admin@fastmenu.' }).click();
//   await page.getByRole('button', { name: 'Change language' }).click();
//   await expect(page.locator('#app')).toContainText('معلومات لوحه التحكم');
//   await page.getByRole('button', { name: 'Hello, Admin admin@fastmenu.' }).click();
//   await page.getByRole('button', { name: 'تغير اللغة' }).click();
//   await page.getByRole('link', { name: 'Roles & Permissions' }).click();
//   await page.getByRole('link', { name: 'Pages' }).click();
//   await page.getByRole('link', { name: 'Payment status' }).click();
//   await page.getByRole('link', { name: 'Contact us' }).click();
//   await page.getByRole('link', { name: 'Requests $vuetify.badge' }).click();
//   await page.getByRole('button').nth(1).click();
//   await page.locator('div').filter({ hasText: /^approved$/ }).nth(2).click();
//   await page.getByRole('button', { name: 'approved' }).click();
//   await page.getByText('pending').click();
// });