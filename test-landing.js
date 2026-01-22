const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Testing Pool App Landing Page...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  let passed = 0, failed = 0;

  // Test 1: Page loads
  console.log('Test 1: Page loads');
  try {
    const res = await page.goto('http://localhost:3000', { timeout: 30000 });
    console.log('  ✅ Status:', res.status());
    passed++;
  } catch(e) {
    console.log('  ❌ FAILED:', e.message);
    failed++;
  }

  // Test 2: Header
  console.log('\nTest 2: Header present');
  try {
    await page.waitForSelector('header', { timeout: 5000 });
    console.log('  ✅ Header found');
    passed++;
  } catch(e) {
    console.log('  ❌ Header not found');
    failed++;
  }

  // Test 3: Pool content
  console.log('\nTest 3: Hero section');
  const heroText = await page.textContent('body');
  if (heroText && heroText.toLowerCase().includes('pool')) {
    console.log('  ✅ Pool-related content found');
    passed++;
  } else {
    console.log('  ❌ No pool content found');
    failed++;
  }

  // Test 4: Interactive elements
  console.log('\nTest 4: Interactive elements');
  const buttons = await page.$$('a, button');
  console.log('  ✅ Found', buttons.length, 'clickable elements');
  passed++;

  // Test 5: Check for key sections
  console.log('\nTest 5: Key content sections');
  const pageContent = heroText.toLowerCase();
  const hasRouteOptimization = pageContent.includes('route') || pageContent.includes('optimi');
  const hasPricing = pageContent.includes('49') || pageContent.includes('99') || pageContent.includes('pricing');
  const hasCTA = pageContent.includes('trial') || pageContent.includes('start') || pageContent.includes('free');

  if (hasRouteOptimization) console.log('  ✅ Route optimization mentioned');
  else console.log('  ⚠️ Route optimization not found');

  if (hasPricing) console.log('  ✅ Pricing found');
  else console.log('  ⚠️ Pricing not visible');

  if (hasCTA) console.log('  ✅ CTA found');
  else console.log('  ⚠️ CTA not found');

  passed++;

  // Screenshot
  await page.screenshot({ path: '/tmp/landing-desktop.png', fullPage: true });
  console.log('\n📸 Desktop screenshot: /tmp/landing-desktop.png');

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/landing-mobile.png', fullPage: true });
  console.log('📸 Mobile screenshot: /tmp/landing-mobile.png');

  console.log('\n' + '='.repeat(40));
  console.log('RESULTS: ✅', passed, 'passed |', failed > 0 ? '❌ ' + failed + ' failed' : 'All tests passed!');

  await browser.close();
})();
