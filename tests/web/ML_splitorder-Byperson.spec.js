import { test, expect } from "@playwright/test";
import Jimp from "jimp-compact";
import QrCode from "qrcode-reader";

const TABLE_INDEX = 1; // Using table index 0 for split order test (different from ML_order_withoutSplit.spec.js)

// -------- DECODE QR FUNCTION --------
async function decodeQR(buffer) {
  const img = await Jimp.read(buffer);
  return new Promise((resolve, reject) => {
    const qr = new QrCode();
    qr.callback = (err, value) => {
      if (err) reject(err);
      else resolve(value.result);
    };
    qr.decode(img.bitmap);
  });
}

// Reset table before each test to ensure clean state
// Reset table before each test to ensure clean state
test.beforeEach(async ({ page }) => {
  // Increase timeout for setup hook
  // test.setTimeout(60000); // Removed to allow config timeout or test timeout to apply
  console.log("[SETUP] Resetting table state...");
  
  // Login to dashboard
  await page.goto("https://dashboard-dev.vastmenu.com/authentication/login");
  await page.getByPlaceholder("Email").fill("amr@test.test");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  // Use domcontentloaded instead of networkidle for faster login
  await page.waitForLoadState("domcontentloaded");
  
  // Go to tables
  const tablesLink = page.getByRole("link", { name: "Tables" });
  await tablesLink.waitFor({ state: "visible", timeout: 60000 });
  await tablesLink.click();
  await page.waitForLoadState("domcontentloaded");
  // Wait for tables to be visible to ensure page is loaded
  await page.locator('.table-details').nth(TABLE_INDEX).waitFor({ state: "visible", timeout: 60000 });
  await page.waitForTimeout(1000);
  // Reset switch track (clear table)
  try {
    // Wait for at least one table to be visible
    const tables = page.locator('.table-details');
    await tables.first().waitFor({ state: "visible", timeout: 10000 });
    
    const tableCount = await tables.count();
    console.log(`[DEBUG] Found ${tableCount} tables`);

    if (tableCount > TABLE_INDEX) {
      const targetTable = tables.nth(TABLE_INDEX);
      // Look for the switch specifically within this table's row/card
      const switchTrack = targetTable.locator('.v-switch__track');
      
      if (await switchTrack.isVisible({ timeout: 5000 })) {
        await switchTrack.click({ force: true });
        console.log('[SETUP] Table reset - switch clicked');
        
        const confirmBtn = page.getByRole('button', { name: 'Confirm' });
        if (await confirmBtn.isVisible({ timeout: 2000 })) {
          await confirmBtn.click();
          console.log('[SETUP] Confirmed reset');
        }
        await page.waitForTimeout(1000);
      } else {
        console.log(`[WARN] Switch not visible in table ${TABLE_INDEX}. It might be already clean or selector is wrong.`);
      }
    } else {
      console.log(`[WARN] Not enough tables found. Expected index ${TABLE_INDEX}, found ${tableCount}`);
    }
  } catch (error) {
    console.log(`[SETUP] Error during table reset: ${error.message}`);
  }
});

test("scanQR →ML splitOrder(By person) &Validate in report", async ({ page, context }) => {
  // 1. INCREASED TIMEOUT: Set to 5 minutes for slow payment gateways
  test.setTimeout(600000);

  // --- STEP 1: LOGIN ---
  await test.step("Login to Dashboard", async () => {
    console.log("[STEP] Starting Login Process...");
    // Already logged in from beforeEach, just verify
    await expect(page).toHaveURL(/dashboard-dev.vastmenu.com/);
    console.log("[INFO] Already logged in from setup");
  });

  // --- STEP 2: PREPARE TABLE ---
  await test.step("Prepare Table (Enable Tracking)", async () => {
    // Already on tables page from beforeEach
    await expect(page).toHaveURL(/tables/);
    console.log("[INFO] Already on tables page from setup");
  });

  // --- STEP 3: SCAN QR ---
  let urlInQR;
  await test.step("Scan and Decode QR", async () => {
    console.log("[STEP] Finding QR Button...");
    // Use FIRST table since we reset state
    const qrButton = page.locator(
      "#app div.table-details .table-name-with-status .status div.icon.cursor-pointer"
    ).nth(TABLE_INDEX);
    
    await qrButton.waitFor({ state: "visible", timeout: 30000 });
    await qrButton.click();

    const qrImg = page.locator('img.v-img__img[src*="qrcode"]');
    await expect(qrImg).toBeVisible();
    await qrImg.waitFor({ state: "visible" });

    const qrBuffer = await qrImg.screenshot();
    urlInQR = await decodeQR(qrBuffer);
    console.log(`[INFO] QR URL: ${urlInQR}`);
  });


  // --- STEP 4: OPEN MOBILE APP ---
  const newPage = await context.newPage();
  await test.step("Open Mobile Menu", async () => {
    await newPage.goto(urlInQR);
    await newPage.waitForLoadState("domcontentloaded");
    await expect(newPage).toBeTruthy();
  });
  const page1 = newPage;

  // --- STEP 5: ADD ITEMS AND ORDER ---
  await test.step("Add Items and Confirm Order", async () => {
    // Wait for hydration and let items fully render
    await page1.waitForLoadState("networkidle"); 
    await page1.waitForTimeout(2000); // Extra wait for items to render

    // Add first two items
    const addBtn1 = page1.getByText('add').nth(1);
    await addBtn1.waitFor({ state: 'visible', timeout: 30000 });
    await addBtn1.click();
    await page1.waitForTimeout(500);

    const addBtn0 = page1.getByText('add').first();
    await addBtn0.waitFor({ state: 'visible' });
    await addBtn0.click();
    await page1.waitForTimeout(500);

    // Open Menu to select specific item - with retry logic
    console.log('[INFO] Looking for Menu button...');
    let menuBtn;
    let menuClicked = false;
    
    // Try nth(3) first
    try {
      menuBtn = page1.getByRole('button', { name: 'Menu' }).nth(3);
      await menuBtn.waitFor({ state: 'visible', timeout: 10000 });
      await menuBtn.click();
      menuClicked = true;
      console.log('[INFO] Clicked Menu button nth(3)');
    } catch (error) {
      console.log('[WARN] Menu button nth(3) not found, trying nth(2)...');
      try {
        menuBtn = page1.getByRole('button', { name: 'Menu' }).nth(2);
        await menuBtn.waitFor({ state: 'visible', timeout: 10000 });
        await menuBtn.click();
        menuClicked = true;
        console.log('[INFO] Clicked Menu button nth(2)');
      } catch (error2) {
        console.log('[WARN] Menu button nth(2) not found, trying nth(1)...');
        menuBtn = page1.getByRole('button', { name: 'Menu' }).nth(1);
        await menuBtn.waitFor({ state: 'visible', timeout: 10000 });
        await menuBtn.click();
        menuClicked = true;
        console.log('[INFO] Clicked Menu button nth(1)');
      }
    }

    if (!menuClicked) {
      throw new Error('Could not find Menu button');
    }

    await page1.waitForTimeout(1000); // Wait for menu to open

   // Select Item 2 with Retry Logic
    const item2 = page1.getByText('2').nth(1);
    await item2.waitFor({ state: 'visible' });
    await item2.click();

    // Verify item 2 was clicked by looking for the "Add" button (modal)
    const addButton = page1.getByRole('button', { name: /add/i });
    
    try {
      await addButton.waitFor({ state: 'visible', timeout: 5000 });
    } catch (e) {
      console.log("[INFO] 'Add' button not found, clicking Item '2' again...");
      await item2.click({ force: true });
      await addButton.waitFor({ state: 'visible', timeout: 30000 });
    }

    await addButton.click();

    // Go to Total
    const totalBtn = page1.getByRole('button', { name: '3 Item Total' });
    await totalBtn.waitFor({ state: 'visible' });
    await totalBtn.click();

    // Add Tip and Confirm
    await page1.locator('div').filter({ hasText: /^2\.5%$/ }).click();
    const confirm =await page1.getByRole('button', { name: 'Confirm' })
    await confirm.waitFor({ state: 'visible' })
    await confirm.click()
    
    console.log("[INFO] Added tips 2.5%");
    console.log("[INFO] Order Confirmed");
  });
  // --- STEP 6: SPLIT PAYMENT (PART 1) ---
  await test.step("Perform First Split Payment", async () => {
    await page1.getByRole('button', { name: 'Split invoice' }).click();

  await page1.getByRole('button', { name: 'Choose' }).first().click();
  await page1.locator('div').filter({ hasText: /^3$/ }).click();
  await page1.getByRole('button', { name: 'Pay', exact: true }).click();   
 
    // Select Card
    // Select Card
    const payCardBtn = page1.getByRole('button', { name: 'Pay Card' });
    await payCardBtn.waitFor({ state: 'visible', timeout: 30000 });
    await payCardBtn.click();

    // Fill Card Details (Iframe)
    const frame = page1.locator('iframe[name="tapFrame"]').contentFrame();
    await frame.getByRole('textbox', { name: 'Card number' }).click();
    await frame.getByTestId('CreditCard').fill('5123450000000008');
    await frame.getByRole('textbox', { name: 'MM/YY' }).fill('01/39');
    await frame.getByRole('textbox', { name: 'CVV' }).fill('100');
    await frame.getByRole('textbox', { name: 'Card Holder Name (min. 3' }).fill('APPROVe');
    await frame.getByRole('textbox', { name: 'Card Holder Name (min. 3' }).press('Tab');
    
    // Click Pay
    await page1.waitForTimeout(1000); 
    await page1.locator('#q-portal--dialog--3').getByRole('button', { name: 'Pay' }).click();
    
    console.log("[INFO] Waiting for 3D Secure Redirect...");
    // FIX: Increased timeout to 60s and using domcontentloaded
    await page1.waitForURL(/authenticate\.alpha\.tap\.company/, { timeout: 60000, waitUntil: 'domcontentloaded' });
  
    // Submit 3D Secure challenge
    const challengeFrame1 = page1.locator('iframe[name="challengeFrame"]').contentFrame();
    await challengeFrame1.getByRole('button', { name: 'Submit' }).click();
    
    await page1.waitForURL(/payment-success/, { timeout: 60000, waitUntil: 'domcontentloaded' });
    console.log("[INFO] First split payment successful"); 
     await page1.locator('#q-portal--dialog--1').getByRole('button', { name: 'Home' }).click();
  await page1.getByRole('button', { name: '4 Item Total' }).click();
  await page1.locator('div').filter({ hasText: /^10%$/ }).click();
  await page1.getByRole('button', { name: 'Pay' }).click();
  await page1.locator('#q-portal--dialog--2').getByRole('button', { name: 'Pay' }).click();
    const payCardBtn2 = page1.getByRole('button', { name: 'Pay Card' });
    await payCardBtn2.waitFor({ state: 'visible', timeout: 30000 });
    await payCardBtn2.click();

    // Fill Card Details (Iframe)
    const frame2 = page1.locator('iframe[name="tapFrame"]').contentFrame();
    await frame2.getByRole('textbox', { name: 'Card number' }).click();
    await frame2.getByTestId('CreditCard').fill('5123450000000008');
    await frame2.getByRole('textbox', { name: 'MM/YY' }).fill('01/39');
    await frame2.getByRole('textbox', { name: 'CVV' }).fill('100');
    await frame2.getByRole('textbox', { name: 'Card Holder Name (min. 3' }).fill('APPROVe');
    await frame2.getByRole('textbox', { name: 'Card Holder Name (min. 3' }).press('Tab');
    
    // Click Pay
    await page1.waitForTimeout(2000); 
    // Use a more robust selector that targets the visible dialog's Pay button
    const payButton = page1.locator('[id^="q-portal--dialog"]').filter({ hasText: 'Pay' }).last().getByRole('button', { name: 'Pay' });
    await payButton.waitFor({ state: 'visible', timeout: 30000 });
    await payButton.click();
    
    console.log("[INFO] Waiting for 3D Secure Redirect...");
    // FIX: Increased timeout to 60s and using domcontentloaded
    await page1.waitForURL(/authenticate\.alpha\.tap\.company/, { timeout: 60000, waitUntil: 'domcontentloaded' });
  
    // Submit 3D Secure challenge
    const challengeFrame2 = page1.locator('iframe[name="challengeFrame"]').contentFrame();
    await challengeFrame2.getByRole('button', { name: 'Submit' }).click();
    
    await page1.waitForTimeout(2000); // Wait for redirect to initiate
    await page1.waitForURL(/payment-success/, { timeout: 60000, waitUntil: 'domcontentloaded' });
    console.log("[INFO] Second split payment successful");
});
  await page1.locator('#q-portal--dialog--1').getByRole('button', { name: 'Home' }).click();
  await page1.getByRole('button', { name: '4 Item Total' }).click();
  await page1.getByRole('button', { name: 'Pay' }).click();
  await page1.locator('#q-portal--dialog--2').getByRole('button', { name: 'Pay' }).click();

   const paycard3 = await page1.getByRole('button', { name: 'Pay Card' })
    await paycard3.waitFor({ state: 'visible', timeout: 30000 });
    await paycard3.click();

    // Fill Card Details (Iframe)
    const frame = page1.locator('iframe[name="tapFrame"]').contentFrame();
    await frame.getByRole('textbox', { name: 'Card number' }).click();
    await frame.getByTestId('CreditCard').fill('5123450000000008');
    await frame.getByRole('textbox', { name: 'MM/YY' }).fill('01/39');
    await frame.getByRole('textbox', { name: 'CVV' }).fill('100');
    await frame.getByRole('textbox', { name: 'Card Holder Name (min. 3' }).fill('APPROVe');
    await frame.getByRole('textbox', { name: 'Card Holder Name (min. 3' }).press('Tab');
    
    // Click Pay 3 recite
    await page1.waitForTimeout(1000); 
    await page1.locator('#q-portal--dialog--4').getByRole('button', { name: 'Pay' }).click();
    
    console.log("[INFO] Waiting for 3D Secure Redirect...");
    // FIX: Increased timeout to 60s and using domcontentloaded
    await page1.waitForURL(/authenticate\.alpha\.tap\.company/, { timeout: 60000, waitUntil: 'domcontentloaded' });
  
    // Submit 3D Secure challenge
    const challengeFrame1 = page1.locator('iframe[name="challengeFrame"]').contentFrame();
    await challengeFrame1.getByRole('button', { name: 'Submit' }).click();
    
    await page1.waitForURL(/payment-success/, { timeout: 60000, waitUntil: 'domcontentloaded' });
    console.log("[INFO] First split payment successful"); 

  });
  