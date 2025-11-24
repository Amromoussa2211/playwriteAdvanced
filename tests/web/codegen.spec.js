// import { test, expect } from '@playwright/test';
// // npx playwright codegen https://dashboard-staging.vastmenu.com/authentication/login -o ./tests/web/codegen.spec.js 
// test('test', async ({ page }) => {
//   await page.goto('http://the-internet.herokuapp.com/nested_frames');
//   await page.locator('frame[name="frame-top"]').contentFrame().locator('frame[name="frame-middle"]').contentFrame().locator('body').click();
//   await expect(page.locator('frame[name="frame-top"]').contentFrame().locator('frame[name="frame-middle"]').contentFrame().locator('#content')).toContainText('MIDDLE');
//   await expect(page.locator('frame[name="frame-bottom"]').contentFrame().locator('body')).toContainText('BOTTOM');
//   await page.locator('frame[name="frame-top"]').contentFrame().locator('frame[name="frame-right"]').contentFrame().getByText('RIGHT').click();
//   await page.locator('frame[name="frame-top"]').contentFrame().locator('frame[name="frame-middle"]').contentFrame().locator('body').click();
//   await page.locator('frame[name="frame-top"]').contentFrame().locator('frame[name="frame-middle"]').contentFrame().locator('body').click();
//   await page.locator('frame[name="frame-top"]').contentFrame().locator('frame[name="frame-left"]').contentFrame().getByText('LEFT').click();
//   await page.locator('frame[name="frame-top"]').contentFrame().locator('frame[name="frame-left"]').contentFrame().getByText('LEFT').click();
//   await page.locator('frame[name="frame-top"]').contentFrame().locator('frame[name="frame-middle"]').contentFrame().locator('body').click();
// }); 