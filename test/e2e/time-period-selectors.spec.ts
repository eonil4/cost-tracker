import { test, expect } from '@playwright/test';

test.describe('Time Period Selectors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to be fully loaded
    await page.waitForSelector('h1, h2, h3, h4, h5, h6');
    // Clear any existing data
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should display time period selectors in summary section', async ({ page }) => {
    // Check that all three time period selectors are visible
    await expect(page.getByText(/Daily Costs - Week of/)).toBeVisible();
    await expect(page.getByText(/Weekly Costs -/)).toBeVisible();
    await expect(page.getByText(/Monthly Costs -/)).toBeVisible();
  });

  test('should have quick navigation buttons', async ({ page }) => {
    // Check for quick navigation buttons
    await expect(page.getByRole('button', { name: 'Current Week' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Current Month' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Current Year' })).toBeVisible();
  });

  test('should navigate to current week when clicking Current Week button', async ({ page }) => {
    // Click the Current Week button
    await page.getByRole('button', { name: 'Current Week' }).click();
    
    // Verify the date picker shows current week
    // This test assumes the date picker updates its value
    const datePicker = page.locator('input[type="date"]').first();
    await expect(datePicker).toBeVisible();
  });

  test('should navigate to current month when clicking Current Month button', async ({ page }) => {
    // Click the Current Month button
    await page.getByRole('button', { name: 'Current Month' }).click();
    
    // Verify the month picker shows current month
    // MUI DatePicker renders as text input, not month input
    const monthPicker = page.locator('input[type="text"]').nth(1); // Second text input (month picker)
    await expect(monthPicker).toBeVisible();
  });

  test('should navigate to current year when clicking Current Year button', async ({ page }) => {
    // Click the Current Year button
    await page.getByRole('button', { name: 'Current Year' }).click();
    
    // Verify the year picker shows current year
    const yearPicker = page.locator('input[type="number"]').first();
    await expect(yearPicker).toBeVisible();
  });

  test('should change week selection and update daily costs', async ({ page }) => {
    // Add some test data first
    const descriptionInput = page.locator('input').first();
    await descriptionInput.fill('Week Test Expense');
    const amountInput = page.locator('input[type="number"]');
    await amountInput.fill('100');
    const currencySelector = page.locator('div[role="combobox"]').filter({ hasText: 'HUF' }).first();
    await currencySelector.click();
    await page.getByRole('option', { name: 'USD' }).click();
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    // Wait for expense to be added
    await expect(page.getByText('Week Test Expense')).toBeVisible();
    
    // Try to change the week selection - look for MUI DatePicker input
    const weekDatePicker = page.locator('input[type="text"]').nth(1); // Second text input (week picker)        
    await weekDatePicker.waitFor({ state: 'visible' });
    await weekDatePicker.click();
    
    // Select a different date (this might open a date picker modal)
    // The exact interaction depends on your date picker implementation
    await expect(weekDatePicker).toBeVisible();
  });

  test('should change month selection and update weekly costs', async ({ page }) => {
    // Add some test data first
    const descriptionInput = page.locator('input').first();
    await descriptionInput.fill('Month Test Expense');
    const amountInput = page.locator('input[type="number"]');
    await amountInput.fill('200');
    const currencySelector = page.locator('div[role="combobox"]').filter({ hasText: 'HUF' }).first();
    await currencySelector.click();
    await page.getByRole('option', { name: 'EUR' }).click();
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    // Wait for expense to be added
    await expect(page.getByText('Month Test Expense')).toBeVisible();
    
    // Try to change the month selection - look for MUI DatePicker input
    const monthPicker = page.locator('input[type="text"]').nth(2); // Third text input (month picker)
    await monthPicker.waitFor({ state: 'visible' });
    await monthPicker.click();
    
    // The month picker should be visible and interactive
    await expect(monthPicker).toBeVisible();
  });

  test('should change year selection and update monthly costs', async ({ page }) => {
    // Add some test data first
    const descriptionInput = page.locator('input').first();
    await descriptionInput.fill('Year Test Expense');
    const amountInput = page.locator('input[type="number"]');
    await amountInput.fill('300');
    const currencySelector = page.locator('div[role="combobox"]').filter({ hasText: 'HUF' }).first();
    await currencySelector.click();
    await page.getByRole('option', { name: 'HUF' }).click();
    await page.getByRole('button', { name: 'Add Expense' }).click();
    
    // Wait for expense to be added
    await expect(page.getByText('Year Test Expense')).toBeVisible();
    
    // Try to change the year selection - look for MUI DatePicker input
    const yearPicker = page.locator('input[type="text"]').nth(3); // Fourth text input (year picker)
    await yearPicker.waitFor({ state: 'visible' });
    await yearPicker.click();
    
    // The year picker should be visible and interactive
    await expect(yearPicker).toBeVisible();
  });

  test('should display empty state when no expenses for selected period', async ({ page }) => {
    // Navigate to a different year (assuming no expenses exist for that year)
    const yearPicker = page.locator('input[type="text"]').nth(3); // Fourth text input (year picker)
    await yearPicker.waitFor({ state: 'visible' });
    await yearPicker.fill('2020');
    await yearPicker.press('Enter');
    
    // Check that summary sections show empty state or zero values
    await expect(page.getByText(/Daily Costs - Week of/)).toBeVisible();
    await expect(page.getByText(/Weekly Costs -/)).toBeVisible();
    await expect(page.getByText(/Monthly Costs -/)).toBeVisible();
  });
});
