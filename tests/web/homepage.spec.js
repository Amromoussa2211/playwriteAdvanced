/**
 * مثال لاختبار الصفحة الرئيسية باستخدام Playwright
 */
import env from 'dotenv';
env.config();
import  { test, expect }  from '@playwright/test';

test.describe('اختبارات الصفحة الرئيسية', () => {
  
  test('يجب تحميل الصفحة الرئيسية بنجاح', async ({ page }) => {
    await page.goto(process.env.APP_URL);
    
    // التحقق من العنوان
    await expect(page).toHaveTitle(/.*Home|الصفحة الرئيسية/);
  });

  test('يجب أن تظهر عناصر التنقل الرئيسية', async ({ page }) => {
    await page.goto('/');
    
    // التحقق من قائمة التنقل
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // التحقق من وجود روابط رئيسية
    await expect(page.locator('a:has-text("الرئيسية"), a:has-text("Home")')).toBeVisible();
    await expect(page.locator('a:has-text("حول"), a:has-text("About")')).toBeVisible();
  });

  test('يجب أن يعمل البحث', async ({ page }) => {
    await page.goto('/');
    
    // العثور على حقل البحث والكتابة فيه
    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="search"]').first();
    await searchInput.fill('test search query');
    await searchInput.press('Enter');
    
    // الانتظار للتنقل أو تحديث النتائج
    await page.waitForTimeout(1000);
    
    // التحقق من تغيير URL أو ظهور نتائج
    const hasUrlChanged = page.url().includes('search') || page.url().includes('بحث');
    const hasResults = await page.locator('.search-results, .results').count() > 0;
    
    expect(hasUrlChanged || hasResults).toBeTruthy();
  });

  test('اختبار الاستجابة للهاتف المحمول', async ({ page }) => {
    // تعيين حجم شاشة الهاتف
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // التحقق من أن القائمة متجاوبة
    const mobileMenu = page.locator('.mobile-menu, .hamburger, button[aria-label*="menu"]').first();
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('يجب أن تعمل الروابط الخارجية', async ({ page, context }) => {
    await page.goto('/');
    
    // البحث عن رابط خارجي
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    
    if (count > 0) {
      // النقر على أول رابط خارجي
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        externalLinks.first().click()
      ]);
      
      // التحقق من فتح صفحة جديدة
      expect(newPage).toBeTruthy();
      await newPage.close();
    }
  });

  test('التحقق من أداء تحميل الصفحة', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // التحقق من أن وقت التحميل أقل من 5 ثواني
    expect(loadTime).toBeLessThan(5000);
    console.log(`⏱️  وقت تحميل الصفحة: ${loadTime}ms`);
  });
});
