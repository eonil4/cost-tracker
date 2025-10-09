# Playwright E2E Tests

This directory contains end-to-end tests for the Cost Tracker application using Playwright.

## Test Structure

- **`app.spec.ts`** - Main application functionality tests
- **`time-period-selectors.spec.ts`** - Time period selector functionality tests
- **`responsive.spec.ts`** - Responsive design tests
- **`accessibility.spec.ts`** - Accessibility tests
- **`global-setup.ts`** - Global test setup and teardown

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### With UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### In Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### Debug Mode
```bash
npm run test:e2e:debug
```

### View Test Report
```bash
npm run test:e2e:report
```

## Test Coverage

The tests cover:

### Application Functionality
- ✅ Main title and theme toggle display
- ✅ All main sections visibility
- ✅ Adding new expenses
- ✅ Editing existing expenses
- ✅ Deleting expenses
- ✅ Filtering expenses by currency
- ✅ Searching expenses by description
- ✅ Theme toggle functionality
- ✅ Summary charts display
- ✅ Form validation
- ✅ Data persistence in localStorage

### Time Period Selectors
- ✅ Time period selector display
- ✅ Quick navigation buttons
- ✅ Week/Month/Year navigation
- ✅ Date picker interactions
- ✅ Empty state handling

### Responsive Design
- ✅ Mobile device compatibility (375x667)
- ✅ Tablet device compatibility (768x1024)
- ✅ Desktop compatibility (1920x1080)
- ✅ Form interactions on mobile
- ✅ Theme toggle on mobile
- ✅ Data grid on mobile
- ✅ Summary charts on mobile

### Accessibility
- ✅ Proper heading structure
- ✅ Form labels
- ✅ Button labels
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Color contrast
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ Table structure for data grid

## Browser Support

Tests run on:
- **Chromium** (Desktop Chrome)
- **Firefox** (Desktop Firefox)
- **WebKit** (Desktop Safari)
- **Mobile Chrome** (Pixel 5)
- **Mobile Safari** (iPhone 12)

## Configuration

The tests are configured in `playwright.config.ts` with:
- Base URL: `http://localhost:5173`
- Automatic dev server startup
- Parallel test execution
- Retry on failure (2 retries on CI)
- HTML reporter
- Trace collection on first retry

## Global Setup

The `global-setup.ts` file:
- Clears localStorage before tests
- Ensures clean test state
- Can be extended for additional setup needs

## Writing New Tests

When adding new tests:

1. Create test files in the `tests/e2e/` directory
2. Use descriptive test names
3. Follow the existing test structure
4. Include proper assertions
5. Test both positive and negative scenarios
6. Consider accessibility and responsive design

## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.getByRole('button', { name: 'Button' }).click();
    
    // Act
    await page.getByRole('textbox').fill('test');
    
    // Assert
    await expect(page.getByText('Expected Result')).toBeVisible();
  });
});
```

## Troubleshooting

### Tests Failing
1. Ensure the dev server is running (`npm run dev`)
2. Check that the application is accessible at `http://localhost:5173`
3. Verify test selectors match the actual UI elements
4. Check browser console for errors

### Slow Tests
1. Use `page.waitForSelector()` instead of `page.waitForTimeout()`
2. Optimize test data setup
3. Consider using `test.beforeEach()` for common setup

### Flaky Tests
1. Add proper waits for dynamic content
2. Use more specific selectors
3. Avoid hardcoded timeouts
4. Test in different browsers to identify browser-specific issues
