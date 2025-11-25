import { test, expect } from "@playwright/test";
import Jimp from "jimp-compact";
import QrCode from "qrcode-reader";

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

test("scanQR →ML splitOrder(BYamount) &Validate in report", async ({ page, context }) => {
  test.setTimeout(120000);

  // 1) LOGIN
  await page.goto("https://dashboard-dev.vastmenu.com/authentication/login");
  await page.getByPlaceholder("Email").fill("amr@test.test");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForLoadState("networkidle");

  // 2) Go to tables - FIXED: Wait for tables page to load
  await page.getByRole("link", { name: "Tables" }).click();
  await page.waitForLoadState("networkidle");
 const switchTrack = page.locator('.v-switch__track');
try {
  await switchTrack.waitFor({ state: 'visible', timeout: 5000 });
  await switchTrack.click({ force: true });
  console.log('✓ Switch track clicked');
  
  // Wait a moment for the state to change
  await page.waitForTimeout(1000);
} catch (error) {
  console.log('Switch track not found or not visible, continuing with test...');
}

  
  // Wait for the table content to be available - using your existing QR button as indicator
  const qrButton = page.locator(
    "#app div.table-details .table-name-with-status .status div.icon.cursor-pointer"
  ).first();
  
  await qrButton.waitFor({ state: "visible", timeout: 15000 });

  // 3) Click the QR modal icon
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
  const addBtn1 = page1.getByText('add').nth(1);
  await addBtn1.waitFor({ state: 'visible' });
  await addBtn1.click();

  const addBtn0 = page1.getByText('add').first();
  await addBtn0.waitFor({ state: 'visible' });
  await addBtn0.click();

  // Open Menu/Category
  const menuBtn = page1.getByRole('button', { name: 'Menu' }).nth(3);
  await menuBtn.waitFor({ state: 'visible' });
  await menuBtn.click();

  // Select item '2'
  const item2 = page1.getByText('2').nth(1);
  await item2.waitFor({ state: 'visible' });
  await item2.click();

  // Verify '2' is added/visible in the app container
  await expect(page1.locator('#q-app')).toContainText('2');

  // Click 'Add' button
  const addButton = page1.getByRole('button', { name: /add/i });
  await addButton.waitFor({ state: 'visible', timeout: 15000 });
  await addButton.click();

  // Go to Total/Cart
  const totalBtn = page1.getByRole('button', { name: '3 Item Total' });
  await totalBtn.waitFor({ state: 'visible' });
  await totalBtn.click();

  // Continue with your existing flow...
  await page1.locator('div').filter({ hasText: /^2\.5%$/ }).click();
  await page1.getByRole('button', { name: 'Confirm' }).click();
  await page1.getByRole('button', { name: 'Split invoice' }).click();
  await page1.getByRole('button', { name: 'Choose' }).nth(1).click();
  await page1.getByPlaceholder('Enter the deducted amount to').click();
  await page1.getByPlaceholder('Enter the deducted amount to').fill('153');
  await page1.getByRole('button', { name: 'Pay', exact: true }).click();
  await page1.locator('div').filter({ hasText: 'closePayment typeChoose the' }).nth(2).click();
  await page1.getByRole('button', { name: 'Pay Card' }).click();
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card number' }).click();
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByTestId('CreditCard').fill('5123450000000008');
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill('01/39');
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill('100');
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card Holder Name (min. 3' }).fill('APPROVe');
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card Holder Name (min. 3' }).press('Tab');
  await page1.locator('#q-portal--dialog--3').getByRole('button', { name: 'Pay' }).click();
  await page1.waitForURL(/authenticate\.alpha\.tap\.company/, { timeout: 20000 });
  
  // Submit 3D Secure challenge
  const challengeFrame = page1.locator('iframe[name="challengeFrame"]').contentFrame();
  await challengeFrame.getByRole('button', { name: 'Submit' }).click();
  await page1.waitForURL(/payment-success/, { timeout: 20000 });

  // ... rest of your existing code continues unchanged
  await page1.goto('https://pwa-dev.vastmenu.com/payment-success/?table_id=2fe4ca70-6b80-4c12-b1d0-3dc36060a908&order_id=45e81da665814e24b455b62334ec72d7&paymentStatus=success&payment_split_id=6241');
  await page1.locator('#q-portal--dialog--1').getByRole('button', { name: 'Home' }).click();
  await page1.getByRole('button', { name: '4 Item Total' }).click();
  await page1.getByRole('button', { name: 'Pay' }).click();

  // Get remaining amount 
  const remainingAmountElement = page1.locator('.summary-item:has-text("Remaining amount") .text-fontExtraBold');
  const remainingAmountText = await remainingAmountElement.textContent();
  console.log('Remaining amount:', remainingAmountText);
  const amount = remainingAmountText.trim();

  // Fill the amount in the input field
  await page1.getByPlaceholder('Enter the deducted amount to pay').fill(amount);

  await page1.locator('#q-portal--dialog--2').getByRole('button', { name: 'Pay' }).click();
  await page1.locator('div').filter({ hasText: 'closePayment typeChoose the' }).nth(2).click();
  await page1.getByRole('button', { name: 'Pay Card' }).click();
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card number' }).click();
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByTestId('CreditCard').fill('5123450000000008');
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill('01/39');
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill('100');
  await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card Holder Name (min. 3' }).fill('APPROVEd');
  await page1.locator('#q-portal--dialog--4').getByRole('button', { name: 'Pay' }).click();  
  await page1.waitForURL(/authenticate\.alpha\.tap\.company/, { timeout: 20000 });
  
  const challengeFrame1 = page1.locator('iframe[name="challengeFrame"]').contentFrame();
  await challengeFrame1.getByRole('button', { name: 'Submit' }).click();
  await page1.waitForURL(/payment-success/, { timeout: 20000 })
  await page1.goto('https://pwa-dev.vastmenu.com/payment-success/?table_id=2fe4ca70-6b80-4c12-b1d0-3dc36060a908&order_id=45e81da665814e24b455b62334ec72d7&paymentStatus=success&payment_split_id=6242');
  await page1.getByRole('button', { name: 'dark_mode' }).click();
  await page1.getByRole('radio', { name: '5' }).click();
  await page1.getByPlaceholder('Name').click();
  await page1.getByPlaceholder('Name').fill('automated revio');
  await page1.getByPlaceholder('Phone number').click();
  await page1.getByPlaceholder('Phone number').fill('0559423418');
  await page1.getByPlaceholder('Email').click();
  await page1.getByPlaceholder('Email').fill('auto@auto.automation');
  await page1.getByPlaceholder('Please tell us how we can').click();
  await page1.getByPlaceholder('Please tell us how we can').fill('automated review');
  await page1.getByRole('button', { name: 'Send rate' }).click();
  await page1.goto('https://dashboard-dev.vastmenu.com/authentication/login');
  await page1.getByPlaceholder('Email').click();
  await page1.getByPlaceholder('Email').fill('amr@test.test');
  await page1.getByPlaceholder('Email').press('Tab');
  await page1.getByPlaceholder('Password').fill('password');
  await page1.getByRole('button', { name: 'Sign In' }).click();
  await page1.getByRole('link', { name: 'Tables' }).click();
  await page1.locator('div').filter({ hasText: /^Reports$/ }).nth(1).click();
  await page1.getByRole('link', { name: 'Payment' }).click();
  await expect(page1.locator('tbody')).toContainText('Successful');
  await page1.getByRole('link', { name: 'Orders' }).nth(2).click();
  await expect(page1.locator('tbody')).toContainText('Split');
  await page1.getByRole('link', { name: 'Tables' }).click();
  // Handle the checkbox if found
// Handle the specific checkbox with id starting with "switch-"
const switchTrackafter = page.locator('.v-switch__track');
try {
  await switchTrackafter.waitFor({ state: 'visible', timeout: 5000 });
  await switchTrackafter.click({ force: true });
  console.log('✓ Switch track clicked');
  
  // Wait a moment for the state to change
  await page.waitForTimeout(1000);
} catch (error) {
  console.log('Switch track not found or not visible, continuing with test...');
} 

});


// import { test, expect } from "@playwright/test";
// import Jimp from "jimp-compact";
// import QrCode from "qrcode-reader";
// //npx playwright test tests/web/ML_order_withoutSplit.spec.js
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

// test("scanQR →ML splitOrder(BYamount) &Validate in report", async ({ page, context }) => {
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
// //   await page1.getByRole('button', { name: 'Confirm' }).click();

//   // Split Order
// //   await page1.getByRole('button', { name: 'Split Order' }).click(); 
//   await page1.pause();

//   ///
//    await page1.locator('div').filter({ hasText: /^2\.5%$/ }).click();
//   await page1.getByRole('button', { name: 'Confirm' }).click();
//   await page1.getByRole('button', { name: 'Split invoice' }).click();
//   await page1.getByRole('button', { name: 'Choose' }).nth(1).click();
//   await page1.getByPlaceholder('Enter the deducted amount to').click();
//   await page1.getByPlaceholder('Enter the deducted amount to').fill('153');
//   await page1.getByRole('button', { name: 'Pay', exact: true }).click();
//   await page1.locator('div').filter({ hasText: 'closePayment typeChoose the' }).nth(2).click();
//   await page1.getByRole('button', { name: 'Pay Card' }).click();
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card number' }).click();
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByTestId('CreditCard').fill('5123450000000008');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill('01/39');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill('100');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card Holder Name (min. 3' }).fill('APPROVe');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card Holder Name (min. 3' }).press('Tab');
//   await page1.locator('#q-portal--dialog--3').getByRole('button', { name: 'Pay' }).click();
//  await page1.waitForURL(/authenticate\.alpha\.tap\.company/, { timeout: 20000 });
  
//   // Submit 3D Secure challenge
//   const challengeFrame = page1.locator('iframe[name="challengeFrame"]').contentFrame();
//   await challengeFrame.getByRole('button', { name: 'Submit' }).click();
//     await page1.waitForURL(/payment-success/, { timeout: 20000 });

  
//   await page1.goto('https://pwa-dev.vastmenu.com/payment-success/?table_id=2fe4ca70-6b80-4c12-b1d0-3dc36060a908&order_id=45e81da665814e24b455b62334ec72d7&paymentStatus=success&payment_split_id=6241');
//   await page1.locator('#q-portal--dialog--1').getByRole('button', { name: 'Home' }).click();
//   await page1.getByRole('button', { name: '4 Item Total' }).click();
//   await page1.getByRole('button', { name: 'Pay' }).click();
    // await page1.pause();
//     ////get remaing amount 
// // First, extract the remaining amount from the summary section
// const remainingAmountElement = page1.locator('.summary-item:has-text("Remaining amount") .text-fontExtraBold');
// const remainingAmountText = await remainingAmountElement.textContent();
// console.log('Remaining amount:', remainingAmountText);
// const amount = remainingAmountText.trim();

// // Fill the amount in the input field
// await page1.getByPlaceholder('Enter the deducted amount to pay').fill(amount);
// ////////////////////

//   await page1.locator('#q-portal--dialog--2').getByRole('button', { name: 'Pay' }).click();
//   await page1.locator('div').filter({ hasText: 'closePayment typeChoose the' }).nth(2).click();
//   await page1.getByRole('button', { name: 'Pay Card' }).click();
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card number' }).click();
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByTestId('CreditCard').fill('5123450000000008');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill('01/39');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill('100');
//   await page1.locator('iframe[name="tapFrame"]').contentFrame().getByRole('textbox', { name: 'Card Holder Name (min. 3' }).fill('APPROVEd');
// await page1.locator('#q-portal--dialog--4').getByRole('button', { name: 'Pay' }).click();  
//   // Wait for 3D Secure redirect (dynamic URL)
//   await page1.waitForURL(/authenticate\.alpha\.tap\.company/, { timeout: 20000 });
  
//   // Submit 3D Secure challenge
//   const challengeFrame1 = page1.locator('iframe[name="challengeFrame"]').contentFrame();
//   await challengeFrame1.getByRole('button', { name: 'Submit' }).click();
  
//   // Wait for payment success redirect (dynamic URL)
//   await page1.waitForURL(/payment-success/, { timeout: 20000 })
//   await page1.goto('https://pwa-dev.vastmenu.com/payment-success/?table_id=2fe4ca70-6b80-4c12-b1d0-3dc36060a908&order_id=45e81da665814e24b455b62334ec72d7&paymentStatus=success&payment_split_id=6242');
//   await page1.getByRole('button', { name: 'dark_mode' }).click();
//   await page1.getByRole('radio', { name: '5' }).click();
//   await page1.getByPlaceholder('Name').click();
//   await page1.getByPlaceholder('Name').fill('automated revio');
//   await page1.getByPlaceholder('Phone number').click();
//   await page1.getByPlaceholder('Phone number').fill('0559423418');
//   await page1.getByPlaceholder('Email').click();
//   await page1.getByPlaceholder('Email').fill('auto@auto.automation');
//   await page1.getByPlaceholder('Please tell us how we can').click();
//   await page1.getByPlaceholder('Please tell us how we can').fill('automated review');
//   await page1.getByRole('button', { name: 'Send rate' }).click();
//    await page1.goto('https://dashboard-dev.vastmenu.com/authentication/login');
//   await page1.getByPlaceholder('Email').click();
//   await page1.getByPlaceholder('Email').fill('amr@test.test');
//   await page1.getByPlaceholder('Email').press('Tab');
//   await page1.getByPlaceholder('Password').fill('password');
//   await page1.getByRole('button', { name: 'Sign In' }).click();
//   await page1.getByRole('link', { name: 'Tables' }).click();

//   await page1.locator('div').filter({ hasText: /^Reports$/ }).nth(1).click();
//   await page1.getByRole('link', { name: 'Payment' }).click();
//   await expect(page1.locator('tbody')).toContainText('Successful');
//   await page1.getByRole('link', { name: 'Orders' }).nth(2).click();
//   await expect(page1.locator('tbody')).toContainText('Split');
//   await page1.getByRole('link', { name: 'Tables' }).click();
// })