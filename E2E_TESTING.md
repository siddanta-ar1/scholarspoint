# Playwright E2E Test Suite - Professional, Fast & Scalable

## Overview

Comprehensive end-to-end testing for SchoolarsPoint with 25+ tests covering:
- ✅ User login flows (13 tests)
- ✅ Admin dashboard flows (12 tests)
- ✅ Performance benchmarks
- ✅ Error handling
- ✅ Session management

## Quick Start

### 1. Install Playwright
```bash
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Create Test Accounts

Create these test accounts in your Supabase project:

**Regular User:**
- Email: `user@scholarspoint-test.com`
- Password: `TestPassword123!@#`
- Role: `user`

**Admin User:**
- Email: `admin@scholarspoint-test.com`
- Password: `AdminPassword123!@#`
- Role: `admin`

### 3. Add NPM Scripts

Update your `package.json` scripts:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:login": "playwright test auth.login",
    "test:e2e:admin": "playwright test admin.dashboard",
    "test:e2e:report": "playwright show-report"
  }
}
```

### 4. Run Tests

```bash
# Run all tests
npm run test:e2e

# Run with interactive UI (recommended)
npm run test:e2e:ui

# Run specific test suite
npm run test:e2e:login
npm run test:e2e:admin

# Debug mode
npm run test:e2e:debug

# View report
npm run test:e2e:report
```

## Test Structure

```
e2e/
├── fixtures.ts                 # Test configuration & credentials
├── utils.ts                   # Reusable test helpers
├── auth.login.spec.ts         # User login tests (13 tests)
├── admin.dashboard.spec.ts    # Admin flow tests (12 tests)
├── README.md                  # Setup instructions
└── playwright.config.ts       # Playwright configuration
```

## User Login Tests (13 tests)

| Test | Purpose |
|------|---------|
| Display login page elements | Verify UI structure |
| Successful login | Valid credentials flow |
| Invalid password error | Error handling |
| Non-existent email error | Validation |
| Submit button disabled state | Loading state |
| Email field required | Form validation |
| Password field required | Form validation |
| Logout functionality | Session cleanup |
| Forgot password navigation | Link verification |
| Signup navigation | Link verification |
| Login performance < 3s | Speed benchmark |
| Session persistence | Reload handling |
| Rapid login attempts | Race condition handling |

## Admin Dashboard Tests (12 tests)

| Test | Purpose |
|------|---------|
| Display all tabs | UI structure |
| Opportunities table | Data rendering |
| Create new opportunity | Navigation |
| Stats/metrics display | Dashboard data |
| Sidebar navigation | Menu functionality |
| Blogs section | Tab switching |
| Visa guides section | Tab switching |
| Non-admin access prevention | Security |
| Mobile sidebar toggle | Responsive design |
| Dashboard load < 2s | Performance |
| Scroll position preservation | UX |
| Tab navigation | Menu interaction |

## Reusable Utilities (e2e/utils.ts)

```typescript
// Login & authentication
loginWithEmail(page, email, password)          // Fast login
verifyUserLoggedIn(page)                      // Check auth state
logout(page)                                   // Logout

// Admin navigation
navigateToAdmin(page)                         // Go to admin
verifyAdminDashboard(page)                    // Verify loaded

// Auth tokens
getAuthToken(page)                            // Get from storage
injectAuthToken(page, token)                  // Inject directly

// Performance
measureLoginTime(page, email, password)       // Timing

// Cleanup
clearAuth(page)                               // Reset session
```

## Performance Benchmarks

- **User Login**: < 3 seconds (target)
- **Admin Load**: < 2 seconds (target)
- **Dashboard**: < 500ms after login
- **Table Render**: < 1 second
- **Navigation**: < 500ms

## Configuration

**playwright.config.ts** includes:
- ✅ Base URL: `http://localhost:3000`
- ✅ Browsers: Chrome, Firefox
- ✅ 30-second timeout
- ✅ Screenshots on failure
- ✅ Videos on failure
- ✅ Traces for debugging

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
test-e2e:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm install --save-dev @playwright/test
    - run: npx playwright install
    - run: npm run build
    - run: npm run test:e2e
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

## Debugging

```bash
# Run with Playwright Inspector
npm run test:e2e:debug

# View test report
npm run test:e2e:report

# Run specific test
npx playwright test auth.login.spec.ts -g "should successfully login"

# Single browser
npx playwright test --project=firefox
```

## Best Practices

1. **Speed**
   - Use `waitForURL()` instead of explicit waits
   - Fill forms with `Promise.all()` for parallelism
   - Minimize timeouts

2. **Reliability**
   - Use `data-testid` attributes for selection
   - Avoid hard-coded delays
   - Test real user flows

3. **Scalability**
   - Reuse utilities from `e2e/utils.ts`
   - Share fixtures in `beforeEach`/`afterEach`
   - Keep tests focused

4. **Maintainability**
   - One flow per test
   - Descriptive test names
   - Add helpful comments

## Troubleshooting

**Cannot find @playwright/test**
```bash
npm install --save-dev @playwright/test
```

**Timeout waiting for locator**
- Check element visibility
- Increase timeout
- Use alternative selector

**Session not persisting**
- Verify localStorage enabled
- Check auth token storage

**Admin tests fail with 403**
- Ensure test admin has `role='admin'` in profiles table

## Next Steps

1. Run tests with UI: `npm run test:e2e:ui`
2. View detailed reports: `npm run test:e2e:report`
3. Add to CI/CD pipeline
4. Expand test coverage as needed

## Resources

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Advanced Config](https://playwright.dev/docs/test-configuration)

---

**Status**: ✅ Ready to use  
**Test Files**: 2 (Login + Admin)  
**Total Tests**: 25+  
**Performance**: Sub-3 second logins  
**Scalability**: Fully extensible architecture
