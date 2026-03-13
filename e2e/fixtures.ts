import { test as base, expect } from '@playwright/test';

/**
 * Test user credentials for E2E tests
 * NOTE: Create these test accounts in your Supabase project before running tests
 */
export const TEST_ACCOUNTS = {
  regularUser: {
    email: 'user@scholarspoint-test.com',
    password: 'TestPassword123!@#',
    fullName: 'Test User',
  },
  adminUser: {
    email: 'admin@scholarspoint-test.com',
    password: 'AdminPassword123!@#',
    fullName: 'Test Admin',
  },
};

/**
 * Extended test fixture with authentication helpers
 */
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // This is a placeholder for future auth setup if needed
    await use(page);
  },
});

export { expect };
