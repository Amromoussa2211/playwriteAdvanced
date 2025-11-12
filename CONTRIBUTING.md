# 🤝 Contributing Guidelines

Thank you for your interest in contributing to the test automation framework! We welcome contributions from everyone.

## 📑 Table of Contents

- [How to Contribute](#how-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Code Guidelines](#code-guidelines)
- [Review Process](#review-process)

## How to Contribute

### 1. Fork the Project

Click the "Fork" button at the top of the page

### 2. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/test-automation-framework.git
cd test-automation-framework
```

### 3. Create New Branch

```bash
git checkout -b feature/amazing-feature
```

Branch naming:
- `feature/feature-name` - For new features
- `fix/bug-name` - For bug fixes
- `docs/description` - For documentation
- `refactor/description` - For code improvements

### 4. Make Changes

- Write clean, readable code
- Add helpful comments in English
- Follow code guidelines below

### 5. Test Changes

```bash
# Install dependencies
npm install

# Run tests
npm run test:web

# Check for linting errors
npm run lint # (if available)
```

### 6. Commit Changes

```bash
git add .
git commit -m "Add amazing feature"
```

Commit messages should be:
- Clear and concise
- Describe what, not how
- In English

Good examples:
```
✅ Add support for Allure reports
✅ Fix Appium connection issue
✅ Update iOS testing documentation
```

Bad examples:
```
❌ update
❌ fix
❌ changes
```

### 7. Push to Branch

```bash
git push origin feature/amazing-feature
```

### 8. Open Pull Request

1. Go to original repository
2. Click "New Pull Request"
3. Select your branch
4. Write clear description of changes

## Reporting Bugs

### Before Reporting

- Check existing [Issues](https://github.com/your-repo/issues)
- Make sure you're using the latest version
- Try to reproduce the issue

### How to Report

Open a new Issue and provide:

1. **Title**: Brief description of the issue
2. **Description**: Detailed explanation of the problem
3. **Steps to reproduce**:
   ```
   1. Go to...
   2. Click on...
   3. See error
   ```
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happened
6. **Screenshots**: If applicable
7. **Environment**:
   - Operating System:
   - Node.js version:
   - Project version:

## Suggesting Features

### Before Suggesting

- Check the [Roadmap](CHANGELOG.md#coming-soon---roadmap)
- Search existing issues

### How to Suggest

Open a new Issue with:

1. **Title**: Proposed feature name
2. **Problem**: What problem does this feature solve?
3. **Proposed solution**: How do you envision the feature?
4. **Alternatives**: Have you considered other solutions?
5. **Examples**: Sample code if applicable

## Code Guidelines

### JavaScript/Node.js

```javascript
// ✅ Good
/**
 * Function to send notifications
 * @param {string} message - Message to be sent
 * @param {object} options - Additional options
 */
async function sendNotification(message, options = {}) {
  try {
    const result = await notifier.send(message, options);
    console.log('✅ Sent successfully');
    return result;
  } catch (error) {
    console.error('❌ Send error:', error.message);
    throw error;
  }
}

// ❌ Bad
async function send(m,o){
  return await notifier.send(m,o)
}
```

### Writing Rules

1. **Naming**:
   - Use `camelCase` for variables and functions
   - Use `PascalCase` for Classes
   - Use `UPPER_CASE` for constants

2. **Comments**:
   - Write helpful comments in English
   - Use JSDoc for functions
   - Explain "why", not "what"

3. **Error Handling**:
   - Always use try/catch
   - Log errors clearly
   - Don't ignore errors

4. **Async/Await**:
   - Use async/await instead of Promises
   - Handle errors properly

5. **Clean Code**:
   - Small, focused functions
   - Avoid repetition (DRY)
   - Clear, descriptive names

### Playwright Tests

```javascript
// ✅ Good
test('Should display error message with invalid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'invalid@example.com');
  await page.fill('[name="password"]', 'wrongpassword');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('.error-message')).toBeVisible();
  await expect(page.locator('.error-message')).toContainText('Invalid credentials');
});

// ❌ Bad
test('test1', async ({ page }) => {
  await page.goto('/login');
  await page.click('button');
});
```

### Appium Tests

```javascript
// ✅ Good
it('Should display login screen successfully', async function() {
  this.timeout(30000);
  
  const emailField = await driver.$('~email-input');
  await emailField.waitForDisplayed({ timeout: 10000 });
  
  const isDisplayed = await emailField.isDisplayed();
  expect(isDisplayed).toBe(true);
});

// ❌ Bad
it('test', async function() {
  const e = await driver.$('~email');
  e.click();
});
```

## Review Process

### What We Look For

✅ **We accept**:
- Clean, readable code
- Clear comments
- Working tests
- Updated documentation
- Follows guidelines

❌ **We reject**:
- Untested code
- Large changes without discussion
- Breaking existing features
- Without documentation

### After Opening PR

1. Code will be reviewed within 48 hours
2. We may request changes
3. Once approved, it will be merged
4. Thank you for your contribution! 🎉

## Questions?

If you have any questions:

1. Read [README.md](README.md)
2. Read [QUICKSTART.md](QUICKSTART.md)
3. Search in [Issues](https://github.com/your-repo/issues)
4. Open a new issue

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and safe environment for everyone.

### Standards

✅ **Positive behavior**:
- Mutual respect
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy

❌ **Unacceptable behavior**:
- Harassment or abuse
- Insulting comments
- Personal attacks
- Publishing private information

### Enforcement

Violations will be taken seriously and may result in being banned.

---

## 🙏 Thank You

Thank you for contributing to making this project better!

Every contribution, small or large, makes a difference. 💙

---

**Happy Coding! 🚀**