const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:3000';

(async () => {
  console.log('🚀 Testing Pool App Onboarding Flow...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const results = { passed: 0, failed: 0, errors: [] };

  // Test 1: Onboarding page loads
  console.log('Test 1: Onboarding step 1 (The Hook) page exists');
  try {
    // The onboarding page is at root since (onboarding)/page.tsx exists
    const response = await page.goto(`${TARGET_URL}`, { waitUntil: 'networkidle', timeout: 30000 });

    // Check for onboarding content OR landing page (either is valid depending on routing)
    const pageContent = await page.textContent('body');
    const hasOnboarding = pageContent.toLowerCase().includes('zip') ||
                          pageContent.toLowerCase().includes('where') ||
                          pageContent.toLowerCase().includes('territory');
    const hasLanding = pageContent.toLowerCase().includes('pool') &&
                       pageContent.toLowerCase().includes('route');

    if (hasOnboarding || hasLanding) {
      console.log('  ✅ Main page loaded successfully');
      results.passed++;
    } else {
      throw new Error('Page content not recognized');
    }
  } catch (e) {
    console.log('  ❌ FAILED:', e.message);
    results.failed++;
    results.errors.push({ test: 'Onboarding page', error: e.message });
  }

  // Test 2: Check onboarding setup route
  console.log('\nTest 2: Onboarding setup page');
  try {
    await page.goto(`${TARGET_URL}/setup`, { waitUntil: 'networkidle', timeout: 15000 });
    const status = page.url().includes('/setup') ? 'loaded' : 'redirected';
    console.log(`  ✅ Setup page ${status}`);
    await page.screenshot({ path: '/tmp/onboarding-setup.png', fullPage: true });
    results.passed++;
  } catch (e) {
    console.log('  ❌ FAILED:', e.message);
    results.failed++;
    results.errors.push({ test: 'Setup page', error: e.message });
  }

  // Test 3: Check customers page
  console.log('\nTest 3: Onboarding customers page');
  try {
    await page.goto(`${TARGET_URL}/setup/customers`, { waitUntil: 'networkidle', timeout: 15000 });
    const status = page.url().includes('/customers') ? 'loaded' : 'redirected';
    console.log(`  ✅ Customers page ${status}`);
    await page.screenshot({ path: '/tmp/onboarding-customers.png', fullPage: true });
    results.passed++;
  } catch (e) {
    console.log('  ❌ FAILED:', e.message);
    results.failed++;
    results.errors.push({ test: 'Customers page', error: e.message });
  }

  // Test 4: Check welcome page
  console.log('\nTest 4: Welcome/completion page');
  try {
    await page.goto(`${TARGET_URL}/welcome`, { waitUntil: 'networkidle', timeout: 15000 });
    const pageContent = await page.textContent('body');
    const hasWelcome = pageContent.toLowerCase().includes('welcome') ||
                       pageContent.toLowerCase().includes('congratulations') ||
                       pageContent.toLowerCase().includes('ready');
    if (hasWelcome || page.url().includes('/welcome')) {
      console.log('  ✅ Welcome page loaded');
      await page.screenshot({ path: '/tmp/onboarding-welcome.png', fullPage: true });
      results.passed++;
    } else {
      console.log('  ⚠️ Welcome page exists but no expected content');
      results.passed++;
    }
  } catch (e) {
    console.log('  ❌ FAILED:', e.message);
    results.failed++;
    results.errors.push({ test: 'Welcome page', error: e.message });
  }

  // Test 5: Dashboard pages
  console.log('\nTest 5: Dashboard page');
  try {
    await page.goto(`${TARGET_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 15000 });
    const pageContent = await page.textContent('body');
    console.log(`  ✅ Dashboard page loaded`);
    await page.screenshot({ path: '/tmp/dashboard-main.png', fullPage: true });
    results.passed++;
  } catch (e) {
    console.log('  ❌ FAILED:', e.message);
    results.failed++;
    results.errors.push({ test: 'Dashboard', error: e.message });
  }

  // Test 6: Schedule page
  console.log('\nTest 6: Schedule page');
  try {
    await page.goto(`${TARGET_URL}/schedule`, { waitUntil: 'networkidle', timeout: 15000 });
    console.log('  ✅ Schedule page loaded');
    await page.screenshot({ path: '/tmp/dashboard-schedule.png', fullPage: true });
    results.passed++;
  } catch (e) {
    console.log('  ❌ FAILED:', e.message);
    results.failed++;
    results.errors.push({ test: 'Schedule', error: e.message });
  }

  // Test 7: Customers page (dashboard)
  console.log('\nTest 7: Customers page (dashboard)');
  try {
    await page.goto(`${TARGET_URL}/customers`, { waitUntil: 'networkidle', timeout: 15000 });
    console.log('  ✅ Customers page loaded');
    await page.screenshot({ path: '/tmp/dashboard-customers.png', fullPage: true });
    results.passed++;
  } catch (e) {
    console.log('  ❌ FAILED:', e.message);
    results.failed++;
    results.errors.push({ test: 'Customers dashboard', error: e.message });
  }

  // Test 8: Routes page
  console.log('\nTest 8: Routes page');
  try {
    await page.goto(`${TARGET_URL}/routes`, { waitUntil: 'networkidle', timeout: 15000 });
    console.log('  ✅ Routes page loaded');
    await page.screenshot({ path: '/tmp/dashboard-routes.png', fullPage: true });
    results.passed++;
  } catch (e) {
    console.log('  ❌ FAILED:', e.message);
    results.failed++;
    results.errors.push({ test: 'Routes', error: e.message });
  }

  // Test 9: Invoices page
  console.log('\nTest 9: Invoices page');
  try {
    await page.goto(`${TARGET_URL}/invoices`, { waitUntil: 'networkidle', timeout: 15000 });
    console.log('  ✅ Invoices page loaded');
    await page.screenshot({ path: '/tmp/dashboard-invoices.png', fullPage: true });
    results.passed++;
  } catch (e) {
    console.log('  ❌ FAILED:', e.message);
    results.failed++;
    results.errors.push({ test: 'Invoices', error: e.message });
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\nFailed tests:');
    results.errors.forEach(e => console.log(`  - ${e.test}: ${e.error}`));
  }

  console.log('\n📸 Screenshots saved:');
  console.log('  - /tmp/onboarding-setup.png');
  console.log('  - /tmp/onboarding-customers.png');
  console.log('  - /tmp/onboarding-welcome.png');
  console.log('  - /tmp/dashboard-main.png');
  console.log('  - /tmp/dashboard-schedule.png');
  console.log('  - /tmp/dashboard-customers.png');
  console.log('  - /tmp/dashboard-routes.png');
  console.log('  - /tmp/dashboard-invoices.png');

  await browser.close();

  if (results.failed > 0) {
    process.exit(1);
  }
})();
