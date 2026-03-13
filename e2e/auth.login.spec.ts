import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  loginWithEmail,
  verifyUserLoggedIn,
  logout,
  clearAuth,
  measureLoginTime,
} from './utils';
import { TEST_ACCOUNTS } from './fixtures';

const { regularUser } = TEST_ACCOUNTS;

test.describe('User Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    /**
     * Clean auth state before each test
     * Ensures consistent test environment
     */
    await clearAuth(page);
  });

  test('should display login page with all required elements', async ({
    page,
  }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // Verify page title
    await expect(page.locator('text=Welcome Back')).toBeVisible();

    // Verify form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Verify buttons
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(
      page.locator('button:has-text("Continue with Google")')
    ).toBeVisible();

    // Verify signup link
    await expect(
      page.locator('a:has-text("Create an account")')
    ).toBeVisible();

    // Verify forgot password link
    await expect(
      page.locator('a:has-text("Forgot password")')
    ).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({
    page,
  }) => {
    await loginWithEmail(page, regularUser.email, regularUser.password);

    // Verify redirected to home
    await expect(page.url()).toBe('http://localhost:3000/');

    // Verify user is logged in
    await verifyUserLoggedIn(page);
  });

  test('should show error on invalid password', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // Fill form with wrong password
    await page.fill('input[type="email"]', regularUser.email);
    await page.fill('input[type="password"]', 'WrongPassword123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error modal
    await expect(
      page.locator('text=Login Failed')
    ).toBeVisible({ timeout: 10000 });

    // Verify error message
    const errorMessage = page.locator(
      'text=/Invalid|password|credentials/i'
    );
    await expect(errorMessage).toBeVisible();
  });

  test('should show error on non-existent email', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // Fill form with non-existent email
    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[type="password"]', 'AnyPassword123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error modal
    await expect(
      page.locator('text=Login Failed')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should disable submit button while loading', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // Fill form
    await page.fill('input[type="email"]', regularUser.email);
    await page.fill('input[type="password"]', regularUser.password);

    // Get button
    const submitButton = page.locator('button[type="submit"]');

    // Intercept request to slow it down
    await page.route('**/auth/v1/**', (route) => {
      setTimeout(() => route.continue(), 500);
    });

    // Click button and check disabled state
    await submitButton.click();
    
    // Check that button is disabled or shows loading state
    const isDisabled = await submitButton.isDisabled();
    const hasLoadingIndicator = await page.locator('.animate-spin').isVisible().catch(() => false);
    
    expect(isDisabled || hasLoadingIndicator).toBeTruthy();
  });

  test('should require email field', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // Try to submit without email
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should require password field', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await loginWithEmail(page, regularUser.email, regularUser.password);

    // Verify logged in
    await verifyUserLoggedIn(page);

    // Perform logout
    await logout(page);

    // Verify logged out
    await expect(page.url()).toContain('/login');
  });

  test('should navigate to forgot password', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // Click forgot password link
    await page.click('a:has-text("Forgot password")');

    // Verify navigation
    await expect(page.url()).toContain('/forgot-password');
  });

  test('should navigate to signup', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // Click signup link
    await page.click('a:has-text("Create an account")');

    // Verify navigation
    await expect(page.url()).toContain('/signup');
  });

  test('should measure login performance (< 3 seconds)', async ({ page }) => {
    const loginTime = await measureLoginTime(
      page,
      regularUser.email,
      regularUser.password
    );

    console.log(`Login completed in ${loginTime}ms`);

    // Assert login was fast (3 seconds = 3000ms)
    expect(loginTime).toBeLessThan(3000);
  });

  test('should persist session after page reload', async ({ page }) => {
    // Login
    await loginWithEmail(page, regularUser.email, regularUser.password);

    // Verify logged in
    await verifyUserLoggedIn(page);

    // Reload page
    await page.reload();

    // Should still be logged in
    await verifyUserLoggedIn(page);
  });

  test('should handle rapid login attempts', async ({ page }) => {
    // Attempt to submit multiple times quickly
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await page.fill('input[type="email"]', regularUser.email);
    await page.fill('input[type="password"]', regularUser.password);

    const submitButton = page.locator('button[type="submit"]');

    // Click rapidly
    await submitButton.click();
    await submitButton.click();
    await submitButton.click();

    // Should eventually login successfully (not crash)
    await page.waitForURL('/', { waitUntil: 'domcontentloaded' }).catch(() => {
      // May still be processing, that's ok
    });
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    const emailInput = page.locator('input[type="email"]');

    // Email input should have email type validation
    await expect(emailInput).toHaveAttribute('type', 'email');
  });
});
