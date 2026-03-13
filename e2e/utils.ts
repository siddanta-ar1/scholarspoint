import { Page, expect } from '@playwright/test';

/**
 * Reusable test utilities for login and auth flows
 */

/**
 * Fast email/password login
 * Optimized for E2E test speed with minimal waits
 */
export async function loginWithEmail(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  // Fill email and password simultaneously
  await Promise.all([
    page.fill('input[type="email"]', email),
    page.fill('input[type="password"]', password),
  ]);

  // Click login button
  const loginButton = page.locator('button[type="submit"]');
  await loginButton.click();

  // Wait for navigation (fastest verification)
  await page.waitForURL('/', { waitUntil: 'domcontentloaded' });
}

/**
 * Verify user is logged in
 * Checks for presence of auth-dependent UI elements
 */
export async function verifyUserLoggedIn(page: Page): Promise<void> {
  // Check for navigation elements that only appear when logged in
  await expect(page.locator('[aria-label*="Logout"], button:has-text("Logout"), [role="button"]:has-text("Sign Out")')).toBeVisible({
    timeout: 5000,
  }).catch(async () => {
    // Fallback: Check that we're not on login page
    await expect(page.url()).not.toContain('/login');
  });
}

/**
 * Fast logout
 */
export async function logout(page: Page): Promise<void> {
  // Look for logout button/menu
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), [role="menuitem"]:has-text("Logout")').first();
  
  // If visible, click it
  if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await logoutButton.click();
    await page.waitForURL('/login', { waitUntil: 'domcontentloaded' });
  }
}

/**
 * Navigate to admin panel with verification
 */
export async function navigateToAdmin(page: Page): Promise<void> {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' });
  
  // Verify admin page loaded (look for dashboard elements)
  await expect(
    page.locator('[role="navigation"], sidebar, [data-testid="admin-sidebar"]').first()
  ).toBeVisible({ timeout: 5000 });
}

/**
 * Verify user is on admin dashboard
 */
export async function verifyAdminDashboard(page: Page): Promise<void> {
  const dashboardElements = [
    'text=Dashboard',
    'text=Opportunities',
    'text=Blogs',
    'text=Visa Guides',
  ];

  for (const selector of dashboardElements) {
    const count = await page.locator(selector).count();
    if (count > 0) return; // Found at least one admin element
  }

  throw new Error('Admin dashboard not found');
}

/**
 * Get auth token from localStorage (useful for testing API calls)
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    const session = localStorage.getItem('supabase.auth.token');
    return session ? JSON.parse(session) : null;
  }).catch(() => null);
}

/**
 * Inject auth token directly for faster tests (bypass login UI)
 * Use this in setup blocks for speed
 */
export async function injectAuthToken(page: Page, token: string): Promise<void> {
  await page.evaluate((token) => {
    localStorage.setItem('supabase.auth.token', JSON.stringify(token));
  }, token);
}

/**
 * Clear all cookies and storage (cleanup)
 */
export async function clearAuth(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Measure login performance
 */
export async function measureLoginTime(
  page: Page,
  email: string,
  password: string
): Promise<number> {
  const startTime = Date.now();
  await loginWithEmail(page, email, password);
  return Date.now() - startTime;
}
