/**
 * مثال لاختبار صفحة تسجيل الدخول باستخدام Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('اختبارات تسجيل الدخول', () => {
  
  test.beforeEach(async ({ page }) => {
    // الانتقال إلى صفحة تسجيل الدخول قبل كل اختبار
    await page.goto('/login');
  });

  test('يجب أن تعرض الصفحة عناصر تسجيل الدخول', async ({ page }) => {
    // التحقق من وجود حقول الإدخال
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('يجب أن تظهر رسالة خطأ عند إدخال بيانات غير صحيحة', async ({ page }) => {
    // إدخال بيانات غير صحيحة
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // التحقق من ظهور رسالة الخطأ
    await expect(page.locator('.error-message')).toBeVisible();
  });

  test('يجب أن ينجح تسجيل الدخول ببيانات صحيحة', async ({ page }) => {
    // إدخال بيانات صحيحة (استخدم بيانات اختبار حقيقية من البيئة)
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'password123');
    await page.click('button[type="submit"]');

    // التحقق من نجاح تسجيل الدخول والانتقال إلى الصفحة الرئيسية
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('يجب التحقق من صحة البريد الإلكتروني', async ({ page }) => {
    // إدخال بريد إلكتروني غير صالح
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // التحقق من رسالة التحقق
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('يجب أن يعمل رابط "نسيت كلمة المرور"', async ({ page }) => {
    // النقر على رابط نسيت كلمة المرور
    await page.click('text=نسيت كلمة المرور؟');

    // التحقق من الانتقال إلى صفحة إعادة تعيين كلمة المرور
    await expect(page).toHaveURL(/.*reset-password/);
  });
});
