const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Comprehensive Landing Page Section Test\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait for hydration
  await page.waitForTimeout(2000);

  const sections = [
    { name: 'Header', selector: 'header' },
    { name: 'Hero', selector: 'section:has-text("Stop wasting"), main > section:first-of-type' },
    { name: 'Social Proof', selector: ':has-text("500+"):has-text("Pool Companies")' },
    { name: 'ROI Calculator', selector: '#roi, :has-text("How much"), :has-text("losing to inefficient")' },
    { name: 'Features', selector: '#features' },
    { name: 'Testimonials', selector: ':has-text("testimonial"), :has-text("customer story")' },
    { name: 'Pricing', selector: '#pricing' },
    { name: 'FAQ', selector: '#faq' },
    { name: 'Final CTA', selector: ':has-text("14-day trial")' },
    { name: 'Footer', selector: 'footer' },
  ];

  console.log('Checking each section:\n');

  for (const section of sections) {
    try {
      const el = await page.locator(section.selector).first();
      const isVisible = await el.isVisible({ timeout: 2000 }).catch(() => false);
      const box = await el.boundingBox().catch(() => null);

      if (isVisible && box) {
        console.log(`✅ ${section.name}: visible at y=${Math.round(box.y)}, height=${Math.round(box.height)}px`);
      } else if (box) {
        console.log(`⚠️ ${section.name}: exists but not visible (y=${Math.round(box.y)})`);
      } else {
        console.log(`❌ ${section.name}: NOT FOUND`);
      }
    } catch (e) {
      console.log(`❌ ${section.name}: ${e.message.substring(0, 50)}`);
    }
  }

  // Get all visible sections and their positions
  console.log('\n📏 Page layout analysis:');
  const body = await page.locator('main').first();
  const mainBox = await body.boundingBox();
  console.log(`Main content height: ${Math.round(mainBox.height)}px`);

  // Take sectioned screenshots
  const scrollPositions = [0, 1000, 2000, 3000, 4000, 5000, 6000];

  for (let i = 0; i < scrollPositions.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollPositions[i]);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `/tmp/landing-scroll-${i}.png` });
  }

  console.log(`\n📸 Screenshots saved: /tmp/landing-scroll-0.png through /tmp/landing-scroll-${scrollPositions.length - 1}.png`);

  await browser.close();
})();
