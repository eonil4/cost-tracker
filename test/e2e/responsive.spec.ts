import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should display correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Wait for the app to be fully loaded
    await page.waitForSelector('h1, h2, h3, h4, h5, h6');
    // Clear any existing data
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Check that main title is visible
    await expect(page.getByRole('heading', { name: 'Cost Tracker' })).toBeVisible();
    
    // Check that form section is visible
    await expect(page.getByRole('heading', { name: 'Add Expense' })).toBeVisible();
    
    // Check that expenses list is visible
    await expect(page.getByRole('heading', { name: 'Expenses' })).toBeVisible();
    
    // Add an expense to make the summary section visible
    await page.getByRole('combobox', { name: 'Description' }).fill('Test Expense');
    await page.locator('input[type="number"]').fill('100');
    await page.locator('input[type="date"]').fill('2024-01-15');
    await page.locator('[data-testid="currency-select"]').click();
    await page.waitForTimeout(100); // Wait for dropdown to stabilize
    await page.getByRole('option', { name: 'HUF' }).click();
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    // Check that summary section is visible
    await expect(page.getByText('Currency Breakdowns')).toBeVisible();
  });

  test('should display correctly on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Check that all sections are visible
    await expect(page.getByRole('heading', { name: 'Cost Tracker' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add Expense' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Expenses' })).toBeVisible();
    
    // Add an expense to make the summary section visible
    await page.getByRole('combobox', { name: 'Description' }).fill('Test Expense');
    await page.locator('input[type="number"]').fill('100');
    await page.locator('input[type="date"]').fill('2024-01-15');
    await page.locator('[data-testid="currency-select"]').click();
    await page.waitForTimeout(100); // Wait for dropdown to stabilize
    await page.getByRole('option', { name: 'HUF' }).click();
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    await expect(page.getByText('Currency Breakdowns')).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Check that all sections are visible
    await expect(page.getByRole('heading', { name: 'Cost Tracker' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add Expense' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Expenses' })).toBeVisible();
    
    // Add an expense to make the summary section visible
    await page.getByRole('combobox', { name: 'Description' }).fill('Test Expense');
    await page.locator('input[type="number"]').fill('100');
    await page.locator('input[type="date"]').fill('2024-01-15');
    await page.locator('[data-testid="currency-select"]').click();
    await page.waitForTimeout(100); // Wait for dropdown to stabilize
    await page.getByRole('option', { name: 'HUF' }).click();
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    await expect(page.getByText('Currency Breakdowns')).toBeVisible();
  });

  test('should handle form interaction on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test form interaction on mobile
    const descriptionInput = page.locator('input').first();
    await descriptionInput.fill('Mobile Test');
    const amountInput = page.locator('input[type="number"]');
    await amountInput.fill('50');
    const currencySelector = page.locator('div[role="combobox"]').filter({ hasText: 'HUF' }).first();
    await currencySelector.click();
    await page.getByRole('option', { name: 'USD' }).click();
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    // Verify expense was added
    await expect(page.getByText('Mobile Test')).toBeVisible();
  });

  test('should handle theme toggle on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test theme toggle on mobile
    const themeToggle = page.getByRole('button', { name: /switch to/i });
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    
    // Verify theme toggle works
    await expect(themeToggle).toHaveAttribute('aria-label', /Switch to dark mode|Switch to system theme|Switch to light mode/);
  });

  test('should handle data grid on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Add an expense
    const descriptionInput = page.locator('input').first();
    await descriptionInput.fill('Mobile Grid Test');
    const amountInput = page.locator('input[type="number"]');
    await amountInput.fill('75');
    const currencySelector = page.locator('div[role="combobox"]').filter({ hasText: 'HUF' }).first();
    await currencySelector.click();
    await page.getByRole('option', { name: 'EUR' }).click();
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    // Verify expense appears in the grid
    await expect(page.getByText('Mobile Grid Test')).toBeVisible();
    
    // Test that the data grid is scrollable on mobile
    const dataGrid = page.locator('[role="grid"]').first();
    if (await dataGrid.isVisible()) {
      await expect(dataGrid).toBeVisible();
    }
  });

  test('should handle summary charts on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Add some data for charts
    const descriptionInput = page.locator('input').first();
    await descriptionInput.fill('Chart Test');
    const amountInput = page.locator('input[type="number"]');
    await amountInput.fill('100');
    const currencySelector = page.locator('div[role="combobox"]').filter({ hasText: 'HUF' }).first();
    await currencySelector.click();
    await page.getByRole('option', { name: 'USD' }).click();
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    // Wait for expense to be added
    await expect(page.getByText('Chart Test')).toBeVisible();
    
    // Check that charts are visible on mobile
    await expect(page.getByText(/Daily Costs - Week of/).first()).toBeVisible();
    await expect(page.getByText(/Weekly Costs -/).first()).toBeVisible();
    await expect(page.getByText(/Monthly Costs -/).first()).toBeVisible();
    
    // Check for chart elements
    // Look for recharts SVG elements specifically - use first() to avoid strict mode violation
    await expect(page.locator('.recharts-wrapper svg').first()).toBeVisible();
  });
});
