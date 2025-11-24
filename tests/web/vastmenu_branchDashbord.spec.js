import { test, expect } from '@playwright/test';
// npx playwright test tests/web/vastmenu_branchDashbord.spec.js --headed
test('Open branch Dashbord and verifay Elments apper ', async ({ page }) => {
  await page.goto('https://dashboard-staging.vastmenu.com/authentication/login');
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('manager@vastmenu.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('password');
  await page.getByPlaceholder('Password').press('Enter');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.locator('.base-app-card').first()).toBeVisible();
  await expect(page.getByRole('main')).toContainText('0Total tips');
  await page.locator('.vast-content-section-break > div:nth-child(2)').first().click();
  await expect(page.locator('.vast-content-section-break > div:nth-child(2)').first()).toBeVisible();
  await expect(page.locator('.vast-content-section-break > div:nth-child(2)').first()).toBeVisible();
  await expect(page.getByRole('main')).toContainText('0Total orders value');
  await page.getByRole('cell', { name: 'Order Status' }).click();
  await page.getByRole('link', { name: 'Financial' }).click();
  await page.locator('div').filter({ hasText: /^Reports$/ }).nth(1).click();
  await page.getByRole('link', { name: 'Orders' }).nth(2).click();
  await page.getByRole('button', { name: 'Details' }).first().click();
  await page.getByText('Discount').click();
  await expect(page.getByText('Discount')).toBeVisible();
  await page.locator('.mdi-close-circle-outline').click();
  await page.getByRole('link', { name: 'Payment' }).click();
  await page.getByPlaceholder('Search').click();
  await page.getByPlaceholder('Search').fill('4');
  await page.getByPlaceholder('Search').press('Enter');
});