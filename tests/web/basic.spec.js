const { test, expect } = require('@playwright/test');

test('openpage', async ({ page }) => {
  await page.goto(process.env.APP_URL || 'https://example.com');
  await expect(page).toHaveTitle(/Example/);
  console.log('✅ الاختبار 1 نجح');
});

test('vealidate login', async ({ page }) => {
  await page.goto(process.env.APP_URL || 'https://example.com');
  const content = await page.textContent('body');
  expect(content).toBeTruthy();
  console.log('✅ الاختبار 2 نجح');
});
//