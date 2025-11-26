import { test, expect } from "@playwright/test";

test("count tables", async ({ page }) => {
  await page.goto("https://dashboard-dev.vastmenu.com/authentication/login");
  await page.getByPlaceholder("Email").fill("amr@test.test");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("link", { name: "Tables" }).click();
  await page.locator('.table-details').first().waitFor({ state: "visible", timeout: 30000 });
  
  const count = await page.locator("#app div.table-details .table-name-with-status .status div.icon.cursor-pointer").count();
  console.log(`[INFO] Found ${count} tables`);
});
