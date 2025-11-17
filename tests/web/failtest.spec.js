import { test, expect } from '@playwright/test';

test('make order test', async ({ page }) => {
  await page.goto('/dashboard');
  // هذا الاختبار هيفشل لأن العنصر مش موجود
  await page.click('[data-testid="non-existent"]');
});