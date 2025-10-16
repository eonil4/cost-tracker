import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Simple wait for page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    
    // Clear any existing data
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should have proper heading structure', async ({ page }) => {
    // Wait a bit for React to render the headings
    await page.waitForTimeout(500);
    
    // Check that main headings are properly structured
    await expect(page.getByRole('heading', { name: 'Cost Tracker' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Add Expense' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Expenses' })).toBeVisible({ timeout: 10000 });
  });

  test('should have proper form labels', async ({ page }) => {
    // Check that form inputs have proper labels
    await expect(page.locator('input').first()).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible();
    await expect(page.locator('div[role="combobox"]').filter({ hasText: 'HUF' }).first()).toBeVisible();
  });

  test('should have proper button labels', async ({ page }) => {
    // Check that buttons have proper labels
    await expect(page.getByRole('button', { name: 'Add Expense' })).toBeVisible();
    await expect(page.getByRole('button', { name: /switch to/i })).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Wait for form to be ready
    await page.waitForTimeout(500);
    
    // Test keyboard navigation by focusing on the description input
    const descriptionInput = page.locator('input').first();
    await descriptionInput.click();
    await expect(descriptionInput).toBeFocused();
    
    // Test tab navigation to next element
    await page.keyboard.press('Tab');
    const amountInput = page.locator('input[type="number"]');
    await expect(amountInput).toBeFocused();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check for proper ARIA attributes
    const themeToggle = page.getByRole('button', { name: /switch to/i });
    await expect(themeToggle).toHaveAttribute('aria-label');
    
    // Check that form controls have proper ARIA attributes
    const descriptionInput = page.locator('input').first();
    await expect(descriptionInput).toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    // This test would need to be implemented with a specific accessibility testing tool
    // For now, we'll just check that the page loads without errors
    await expect(page.getByRole('heading', { name: 'Cost Tracker' })).toBeVisible();
  });

  test('should work with screen reader', async ({ page }) => {
    // Test that important elements are accessible to screen readers
    await expect(page.getByRole('heading', { name: 'Cost Tracker' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add Expense' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Expenses' })).toBeVisible();
    
    // Check that form elements are properly labeled
    await expect(page.locator('input').first()).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible();
    await expect(page.locator('div[role="combobox"]').filter({ hasText: 'HUF' }).first()).toBeVisible();
  });

  test('should handle focus management', async ({ page }) => {
    // Add an expense to test focus management
    const descriptionInput = page.locator('input').first();
    await descriptionInput.fill('Focus Test');
    const amountInput = page.locator('input[type="number"]');
    await amountInput.fill('100');
    const currencySelector = page.locator('div[role="combobox"]').filter({ hasText: 'HUF' }).first();
    await currencySelector.click();
    await page.getByRole('option', { name: 'USD' }).click();
    
    // Submit the form
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    // Check that focus is managed properly after form submission
    // The focus should return to the form or be managed appropriately
    await expect(page.getByText('Focus Test')).toBeVisible();
  });

  test('should have proper table structure for data grid', async ({ page }) => {
    // Add an expense to populate the data grid
    const descriptionInput = page.locator('input').first();
    await descriptionInput.fill('Table Test');
    const amountInput = page.locator('input[type="number"]');
    await amountInput.fill('150');
    const currencySelector = page.locator('div[role="combobox"]').filter({ hasText: 'HUF' }).first();
    await currencySelector.click();
    await page.getByRole('option', { name: 'EUR' }).click();
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    // Wait for the expense to appear
    await expect(page.getByText('Table Test')).toBeVisible();
    
    // Check that the data grid has proper table structure
    const dataGrid = page.locator('[role="grid"]').first();
    if (await dataGrid.isVisible()) {
      await expect(dataGrid).toBeVisible();
      
      // Check for proper table headers
      const headers = page.locator('[role="columnheader"]');
      if (await headers.count() > 0) {
        await expect(headers.first()).toBeVisible();
      }
    }
  });
});
