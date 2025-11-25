
import { test, expect } from "@playwright/test";
import Jimp from "jimp-compact";
import QrCode from "qrcode-reader";
//npx playwright test tests/web/ML_order_withoutSplit.spec.js
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

test("scan QR → menu list makeorderwitout split", async ({ page, context }) => {
  test.setTimeout(120000); // Increase timeout to 120 seconds
  // 1) LOGIN
  await page.goto("https://dashboard-dev.vastmenu.com/authentication/login");
  await page.getByPlaceholder("Email").fill("amr@test.test");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForLoadState("networkidle");

  // 2) Go to tables
  await page.getByRole("link", { name: "Tables" }).click();
  await page.waitForLoadState("networkidle");
  const switchTrack = page.locator('.v-switch__track');
try {
  await switchTrack.waitFor({ state: 'visible', timeout: 5000 });
  await switchTrack.click({ force: true });
  console.log('✓ Switch track clicked');
  await page.getByRole('button', { name: 'Confirm' }).click();
  // Wait a moment for the state to change
  await page.waitForTimeout(1000);
} catch (error) {
  console.log('Switch track not found or not visible, continuing with test...');
}

  // 3) Click the icon that opens the QR modal
  const qrButton = page.locator(
    "#app div.table-details .table-name-with-status .status div.icon.cursor-pointer"
  ).first();

  await qrButton.waitFor({ state: "visible" });
  await qrButton.click();

  // 4) Wait for QR Image to appear inside the modal
  const qrImg = page.locator('img.v-img__img[src*="qrcode"]');

  await expect(qrImg).toBeVisible();
  await qrImg.waitFor({ state: "visible" });

  // 5) Screenshot ONLY the QR code
  const qrBuffer = await qrImg.screenshot();

  // 6) Decode QR → get URL
  const urlInQR = await decodeQR(qrBuffer);
  console.log("🔗 QR URL = ", urlInQR);

  // 7) Open the decoded URL in a new tab
  const newPage = await context.newPage();
  await newPage.goto(urlInQR);
  await newPage.waitForLoadState("domcontentloaded");

  // 8) Verify page is loaded
  await expect(newPage).toBeTruthy();
  const page1 = newPage;

  // --- ORDERING FLOW ---
  
  // Wait for the menu items to be visible
  await page1.waitForLoadState("networkidle");
  
  // Add items to cart
  // Using more robust waits before clicking
  const addBtn1 = page1.getByText('add').nth(1);
  await addBtn1.waitFor({ state: 'visible' });
  await addBtn1.click();

  const addBtn0 = page1.getByText('add').first();
  await addBtn0.waitFor({ state: 'visible' });
  await addBtn0.click();

  // Open Menu/Category
  // Assuming 'Menu' button opens a category or options
  const menuBtn = page1.getByRole('button', { name: 'Menu' }).nth(3);
  await menuBtn.waitFor({ state: 'visible' });
  await menuBtn.click();

  // Select item '2'
  const item2 = page1.getByText('2').nth(1);
  await item2.waitFor({ state: 'visible' });
  await item2.click();

  // Verify '2' is added/visible in the app container
  await expect(page1.locator('#q-app')).toContainText('2');

  // Click 'Add' button - this was failing
  // Try case-insensitive and wait longer
  const addButton = page1.getByRole('button', { name: /add/i }); 
  // If button role fails, it might be a div with text, but let's stick to button first with regex
  await addButton.waitFor({ state: 'visible', timeout: 15000 });
  await addButton.click();

  // Go to Total/Cart
  const totalBtn = page1.getByRole('button', { name: '3 Item Total' });
  await totalBtn.waitFor({ state: 'visible' });
  await totalBtn.click();

  // Select Tip (10%)
  // await page1.locator('div').filter({ hasText: /^10%$/ }).click();

  // Confirm Order
  await page1.getByRole('button', { name: 'Confirm' }).click();



  // Pay
await page1.locator('p[class*="text-fontExtraBold"][class*="white"]:has-text("Full pay")').click();  
  const payCardBtn = page1.getByRole('button', { name: 'Pay Card' });
  await payCardBtn.waitFor({ state: 'visible' });
  await payCardBtn.click();


  // Fill Payment Details (in iframe)
  // 1. Wait for the container of the iframe (bottom sheet)
  const iframeContainer = page1.locator('.card-container');
  await iframeContainer.waitFor({ state: 'visible', timeout: 30000 });

  // 2. Wait for the iframe element itself
  const iframeElement = page1.locator('iframe[name="tapFrame"]');
  await iframeElement.waitFor({ state: 'visible', timeout: 30000 });

  // 3. Access the frame
  const tapFrameLocator = page1.locator('iframe[name="tapFrame"]');
  const tapFrameHandle = await tapFrameLocator.elementHandle();

    await page1.locator('iframe[name="tapFrame"]').contentFrame().locator('header').click();
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByTestId('CreditCard').fill('5123450000000008\t');
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill('01/39');
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill('100');
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card Holder Name (min. 3' }).fill('APPROVe');
  
  // Click Pay button inside the dialog (dialog ID may vary)
  await page1.locator('[id^="q-portal--dialog"]').getByRole('button', { name: 'Pay', exact: true }).click();
  
  // Wait for 3D Secure redirect (dynamic URL)
  await page1.waitForURL(/authenticate\.alpha\.tap\.company/, { timeout: 20000 });
  
  // Submit 3D Secure challenge
  const challengeFrame = page1.locator('iframe[name="challengeFrame"]').contentFrame();
  await challengeFrame.getByRole('button', { name: 'Submit' }).click();
  
  // Wait for payment success redirect (dynamic URL)
  await page1.waitForURL(/payment-success/, { timeout: 20000 });

  await page1.locator('#q-portal--dialog--1').getByRole('button', { name: 'Home' }).click();
  // await page1.pause();
  ///////////////////
await page.locator('.mdi-close-circle-outline').click();
  await page1.goto('https://pwa-dev.vastmenu.com/');
  await page1.getByRole('button', { name: '4 Item Total' }).click();
  
  await expect(page1.locator('#q-app')).toContainText('Payment success');
  await expect(page1.locator('#q-app')).toContainText('Download Payment Receipt');
  await page.goto('https://dashboard-dev.vastmenu.com/branch-tables');
  await page.locator('#switch-40').check();
  await page1.goto('https://pwa-dev.vastmenu.com/');
//////////////////


});




// import { test, expect } from "@playwright/test";
// import Jimp from "jimp-compact";
// import QrCode from "qrcode-reader";

// // -------- DECODE QR FUNCTION --------
// async function decodeQR(buffer) {
//   const img = await Jimp.read(buffer);
//   return new Promise((resolve, reject) => {
//     const qr = new QrCode();
//     qr.callback = (err, value) => {
//       if (err) reject(err);
//       else resolve(value.result);
//     };
//     qr.decode(img.bitmap);
//   });
// }

// test("scan QR → decode URL → open URL in new tab", async ({ page, context }) => {
//   test.setTimeout(120000); // Increase timeout to 120 seconds
//   // 1) LOGIN
//   await page.goto("https://dashboard-dev.vastmenu.com/authentication/login");
//   await page.getByPlaceholder("Email").fill("amr@test.test");
//   await page.getByPlaceholder("Password").fill("password");
//   await page.getByRole("button", { name: "Sign In" }).click();
//   await page.waitForLoadState("networkidle");

//   // 2) Go to tables
//   await page.getByRole("link", { name: "Tables" }).click();
//   await page.waitForLoadState("networkidle");

//   // 3) Click the icon that opens the QR modal
//   const qrButton = page.locator(
//     "#app div.table-details .table-name-with-status .status div.icon.cursor-pointer"
//   ).first();

//   await qrButton.waitFor({ state: "visible" });
//   await qrButton.click();

//   // 4) Wait for QR Image to appear inside the modal
//   const qrImg = page.locator('img.v-img__img[src*="qrcode"]');

//   await expect(qrImg).toBeVisible();
//   await qrImg.waitFor({ state: "visible" });

//   // 5) Screenshot ONLY the QR code
//   const qrBuffer = await qrImg.screenshot();

//   // 6) Decode QR → get URL
//   const urlInQR = await decodeQR(qrBuffer);
//   console.log("🔗 QR URL = ", urlInQR);

//   // 7) Open the decoded URL in a new tab
//   const newPage = await context.newPage();
//   await newPage.goto(urlInQR);
//   await newPage.waitForLoadState("domcontentloaded");

//   // 8) Verify page is loaded
//   await expect(newPage).toBeTruthy();
//   const page1 = newPage;

//   // --- ORDERING FLOW ---
  
//   // Wait for the menu items to be visible
//   await page1.waitForLoadState("networkidle");
  
//   // Add items to cart
//   // Using more robust waits before clicking
//   const addBtn1 = page1.getByText('add').nth(1);
//   await addBtn1.waitFor({ state: 'visible' });
//   await addBtn1.click();

//   const addBtn0 = page1.getByText('add').first();
//   await addBtn0.waitFor({ state: 'visible' });
//   await addBtn0.click();

//   // Open Menu/Category
//   // Assuming 'Menu' button opens a category or options
//   const menuBtn = page1.getByRole('button', { name: 'Menu' }).nth(3);
//   await menuBtn.waitFor({ state: 'visible' });
//   await menuBtn.click();

//   // Select item '2'
//   const item2 = page1.getByText('2').nth(1);
//   await item2.waitFor({ state: 'visible' });
//   await item2.click();

//   // Verify '2' is added/visible in the app container
//   await expect(page1.locator('#q-app')).toContainText('2');

//   // Click 'Add' button - this was failing
//   // Try case-insensitive and wait longer
//   const addButton = page1.getByRole('button', { name: /add/i }); 
//   // If button role fails, it might be a div with text, but let's stick to button first with regex
//   await addButton.waitFor({ state: 'visible', timeout: 15000 });
//   await addButton.click();

//   // Go to Total/Cart
//   const totalBtn = page1.getByRole('button', { name: '3 Item Total' });
//   await totalBtn.waitFor({ state: 'visible' });
//   await totalBtn.click();

//   // Select Tip (10%)
//   // await page1.locator('div').filter({ hasText: /^10%$/ }).click();

//   // Confirm Order
//   await page1.getByRole('button', { name: 'Confirm' }).click();



//   // Pay
// await page1.locator('p[class*="text-fontExtraBold"][class*="white"]:has-text("Full pay")').click();  
//   const payCardBtn = page1.getByRole('button', { name: 'Pay Card' });
//   await payCardBtn.waitFor({ state: 'visible' });
//   await payCardBtn.click();


//   // Fill Payment Details (in iframe)
//   // 1. Wait for the container of the iframe (bottom sheet)
//   const iframeContainer = page1.locator('.card-container');
//   await iframeContainer.waitFor({ state: 'visible', timeout: 30000 });

//   // 2. Wait for the iframe element itself
//   const iframeElement = page1.locator('iframe[name="tapFrame"]');
//   await iframeElement.waitFor({ state: 'visible', timeout: 30000 });

//   // 3. Access the frame
//   const tapFrameLocator = page1.locator('iframe[name="tapFrame"]');
//   const tapFrameHandle = await tapFrameLocator.elementHandle();

//     await page1.locator('iframe[name="tapFrame"]').contentFrame().locator('header').click();
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByTestId('CreditCard').fill('5123450000000008\t');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill('01/39');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill('100');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card Holder Name (min. 3' }).fill('APPROVe');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card Holder Name (min. 3' }).press('Enter');
//   await page1.getByRole('button', { name: 'Pay', exact: true }).click();
//     await page.waitForLoadState("networkidle");

//   await page1.goto('https://authenticate.alpha.tap.company/redirect/auth_payer_qNtR472514140yL024eD104116');
//     await page.waitForLoadState("networkidle");

//   await page1.goto('https://pwa-dev.vastmenu.com/payment-success/?table_id=2fe4ca70-6b80-4c12-b1d0-3dc36060a908&order_id=ab41f6536c674cf69a0f865741ca264a&paymentStatus=success');
//     await page.waitForLoadState("networkidle");

//   await page1.locator('#q-portal--dialog--1').getByRole('button', { name: 'Home' }).click();
// await page1.pause();
// ///////////////////
// await page.locator('.mdi-close-circle-outline').click();
//   await page1.goto('https://pwa-dev.vastmenu.com/');
//   await page1.getByRole('button', { name: '4 Item Total' }).click();
//   await page1.getByRole('button', { name: 'Full pay' }).click();
//   await page1.getByRole('button', { name: 'Pay Card' }).click();
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card number' }).click();
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByTestId('CreditCard').fill('5123450000000008\t');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill('01/39');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill('100');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card Holder Name (min. 3' }).fill('APPROVe');
//   await page1.getByRole('button', { name: 'Pay', exact: true }).click();
//   await page1.goto('https://authenticate.alpha.tap.company/redirect/auth_payer_iWJE35251632gp1224vg10F373');
//   await page1.locator('iframe[name="challengeFrame"]').contentFrame().getByRole('button', { name: 'Submit' }).click();
//   await page1.goto('https://pwa-dev.vastmenu.com/payment-success/?table_id=2fe4ca70-6b80-4c12-b1d0-3dc36060a908&order_id=74687eb778404d51a04b82b849b12b53&paymentStatus=success');
//   await page1.locator('#q-portal--dialog--1').getByRole('button', { name: 'Home' }).click();
//   await page1.getByRole('button', { name: '4 Item Total' }).click();
//   await expect(page1.locator('#q-app')).toContainText('Payment success');
//   await expect(page1.locator('#q-app')).toContainText('Download Payment Receipt');
//   await page.goto('https://dashboard-dev.vastmenu.com/branch-tables');
//   await page.locator('#switch-40').check();
//   await page1.goto('https://pwa-dev.vastmenu.com/');
// //////////////////
// const closeIcon = page.locator('i.mdi-close-circle-outline');
// if (await closeIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
//     await closeIcon.click();
//     await page.waitForTimeout(500);
// }

// const resettodefult = page.locator('#switch-66');
// if (await resettodefult.isVisible()) {
//     await resettodefult.click();
    
//     const confirmBtn = page.locator('button.swal2-confirm.swal2-styled:has-text("Confirm")');
//     if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
//         await confirmBtn.click();
//         await page.waitForTimeout(1000);
//     }
// }

// });
