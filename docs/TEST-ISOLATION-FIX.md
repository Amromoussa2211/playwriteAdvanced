# 🎯 TEST ISOLATION FIX - The Robust Solution

## 🐛 **The Root Cause**

**Tests pass individually but fail when run together!**

### **Why This Happens:**

All three tests were using the **SAME TABLE** and interfering with each other's state.
Simply using different tables (`.nth(1)`, `.nth(2)`) failed because **those tables might not exist or be in a usable state**.

---

## ✅ **The Solution: State Reset (Cleanup)**

Instead of trying to find unused tables, we now **RESET THE TABLE** before every single test!

### **How It Works:**

1. **`test.beforeEach` Hook:**
   - Runs automatically before every test
   - Logs into the dashboard
   - Navigates to the Tables page
   - **Resets the table status** (clicks the switch if it's on)

2. **Test Simplification:**
   - Tests no longer need to log in manually
   - Tests no longer need to reset the table manually
   - Tests can safely use the **First Table** (`.first()`) because it's guaranteed to be clean!

---

## 📝 **Changes Made**

### **1. Added `beforeEach` Hook to ALL 3 Files:**
```javascript
test.beforeEach(async ({ page }) => {
  // Login...
  // Go to Tables...
  
  // Reset Table State
  const switchTrack = page.locator('.v-switch__track');
  if (await switchTrack.isVisible()) {
    await switchTrack.click({ force: true }); // Turn off tracking
    // Confirm if needed...
  }
});
```

### **2. Simplified Test Bodies:**
Removed redundant steps:
- ❌ `await page.goto('/login')`
- ❌ `await page.getByRole('link', { name: 'Tables' }).click()`
- ❌ Manual switch track handling

### **3. Reverted to `.first()` Table:**
Since the table is cleaned up, we don't need to hunt for other tables.
```javascript
const qrButton = page.locator("...").first(); // Safe to use now!
```

---

## 📊 **Expected Results**

### **Before Fix:**
```
Sequential run:
❌ ML_order_withoutSplit - PASS
❌ ML_splitorder-ByAmount - FAIL (Table busy)
❌ ML_splitorder-ByItem - FAIL (Table busy / Not found)
```

### **After Fix:**
```
Sequential run:
✅ ML_order_withoutSplit - PASS (Starts with clean table)
✅ ML_splitorder-ByAmount - PASS (Starts with clean table)
✅ ML_splitorder-ByItem - PASS (Starts with clean table)
```

---

## 🎓 **Key Lessons**

### **1. State Management is King**
- Never assume the environment is clean
- Always explicitly reset state before/after tests
- `beforeEach` is perfect for this

### **2. Don't Rely on "Magic" Indices**
- Using `.nth(2)` is risky (what if there are only 2 tables?)
- Cleaning up `.first()` is reliable and predictable

### **3. DRY (Don't Repeat Yourself)**
- Moving setup logic to `beforeEach` removes code duplication
- Makes tests shorter and easier to read

---

## 🚀 **Testing the Fix**

Running now:
```bash
npx playwright test tests/web/ML_order_withoutSplit.spec.js \
                   tests/web/ML_splitorder-ByAmount.spec.js \
                   tests/web/ML_splitorder-ByItem.spec.js \
                   --workers=1
```

**Watch for:**
- ✅ `[SETUP] Resetting table state...` logs
- ✅ All tests passing sequentially
- ✅ No interference between tests

---

**Status:** 🔄 Testing in progress  
**Expected:** All 3 tests should pass when run together  
**Next:** Monitor CI/CD pipeline for consistent results
