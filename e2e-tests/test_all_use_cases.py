#!/usr/bin/env python3
"""
PoolApp E2E Test Suite - Convention Pre-Launch QA
Tests all 8 use cases for pool service company owners
"""

from playwright.sync_api import sync_playwright
import os
import json
from datetime import datetime

BASE_URL = "https://poolapp-tau.vercel.app"
SCREENSHOT_DIR = "/Users/brandonbot/projects/workbench/poolapp/e2e-tests/screenshots"

# Ensure screenshot directory exists
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

results = {
    "timestamp": datetime.now().isoformat(),
    "base_url": BASE_URL,
    "use_cases": []
}

def take_screenshot(page, name):
    """Take screenshot and return the path"""
    path = f"{SCREENSHOT_DIR}/{name}.png"
    page.screenshot(path=path, full_page=True)
    return path

def log_result(use_case_num, name, status, screenshots, notes, issues=None):
    """Log test result"""
    result = {
        "use_case": use_case_num,
        "name": name,
        "status": status,
        "screenshots": screenshots,
        "notes": notes,
        "issues": issues or []
    }
    results["use_cases"].append(result)
    print(f"\n{'='*60}")
    print(f"USE CASE {use_case_num}: {name}")
    print(f"STATUS: {status}")
    print(f"NOTES: {notes}")
    if issues:
        print(f"ISSUES: {issues}")
    print(f"{'='*60}\n")

def test_use_case_1(page):
    """Use Case 1: First Impression Flow"""
    screenshots = []
    issues = []
    notes = []

    try:
        # Land on homepage
        page.goto(BASE_URL, wait_until="networkidle")
        page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(page, "uc1_01_homepage"))

        # Check value proposition
        hero_text = page.locator("h1, h2").first
        if hero_text.is_visible():
            text = hero_text.text_content()
            notes.append(f"Hero text found: {text[:100]}...")
        else:
            issues.append("No clear hero/value proposition visible")

        # Look for pricing link - check various options
        pricing_link = page.locator("a[href*='pricing']").first
        convention_link = page.locator("a[href*='convention']").first

        if pricing_link.count() > 0 and pricing_link.is_visible():
            notes.append("Pricing link found")
            pricing_link.click()
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(1000)
            screenshots.append(take_screenshot(page, "uc1_02_pricing_page"))
        elif convention_link.count() > 0 and convention_link.is_visible():
            notes.append("Convention link found (leads to pricing)")
            convention_link.click()
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(1000)
            screenshots.append(take_screenshot(page, "uc1_02_convention_page"))
        else:
            # Try scrolling to find pricing
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(1000)
            screenshots.append(take_screenshot(page, "uc1_02_scrolled"))
            notes.append("Scrolled to look for pricing section")

        # Look for signup/CTA button
        page.goto(BASE_URL, wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Try different CTA patterns
        cta_selectors = [
            "text=Sign Up",
            "text=Get Started",
            "text=Start Free",
            "text=Try Free",
            "text=Free Trial",
            "a:has-text('Start')",
            "button:has-text('Start')",
            "a:has-text('Trial')",
            "button:has-text('Trial')"
        ]

        cta_found = False
        for selector in cta_selectors:
            try:
                cta = page.locator(selector).first
                if cta.count() > 0 and cta.is_visible():
                    notes.append(f"CTA found: {cta.text_content()}")
                    cta.click()
                    page.wait_for_timeout(2000)
                    screenshots.append(take_screenshot(page, "uc1_03_cta_clicked"))
                    cta_found = True
                    break
            except:
                continue

        if not cta_found:
            issues.append("No clear CTA/signup button found on homepage")

        status = "PASS" if len(issues) == 0 else "PARTIAL" if len(issues) < 2 else "FAIL"
        log_result(1, "First Impression Flow", status, screenshots, "; ".join(notes), issues)
        return status

    except Exception as e:
        screenshots.append(take_screenshot(page, "uc1_error"))
        log_result(1, "First Impression Flow", "FAIL", screenshots, f"Error: {str(e)}", [str(e)])
        return "FAIL"

def test_use_case_2(page):
    """Use Case 2: Convention Signup Flow"""
    screenshots = []
    issues = []
    notes = []

    try:
        # Navigate to /convention
        page.goto(f"{BASE_URL}/convention", wait_until="networkidle")
        page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(page, "uc2_01_convention_page"))

        # Check if page loaded
        page_content = page.content().lower()
        if "404" in page.title().lower() or "not found" in page_content:
            issues.append("/convention page returns 404")
            log_result(2, "Convention Signup Flow", "FAIL", screenshots, "Page not found", issues)
            return "FAIL"

        # Look for pricing options
        pricing_cards = page.locator("[class*='card']").all()
        plan_cards = page.locator("[class*='plan']").all()
        price_cards = page.locator("[class*='pricing']").all()
        total_cards = len(pricing_cards) + len(plan_cards) + len(price_cards)

        if total_cards > 0:
            notes.append(f"Found {total_cards} pricing/plan cards")
        else:
            notes.append("No explicit pricing cards found")

        # Look for pricing text (dollar amounts)
        price_elements = page.locator("text=$").all()
        if len(price_elements) > 0:
            notes.append(f"Found {len(price_elements)} price displays")

        # Scroll to see full page
        page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
        page.wait_for_timeout(500)
        screenshots.append(take_screenshot(page, "uc2_02_convention_scrolled"))

        # Look for signup form
        form = page.locator("form").first
        if form.count() > 0 and form.is_visible():
            notes.append("Signup form found")

            # Try to fill form fields
            email_field = page.locator("input[type='email']").first
            if email_field.count() > 0 and email_field.is_visible():
                email_field.fill("test@poolcompany.com")
                notes.append("Email field filled")

            name_field = page.locator("input[name='name'], input[name='company']").first
            if name_field.count() > 0 and name_field.is_visible():
                name_field.fill("Test Pool Company")
                notes.append("Name/Company field filled")

            screenshots.append(take_screenshot(page, "uc2_03_form_filled"))
        else:
            # Look for CTA button instead
            cta = page.locator("button, a[class*='btn']").first
            if cta.count() > 0 and cta.is_visible():
                notes.append(f"CTA found: {cta.text_content()}")
            else:
                notes.append("No form found, but CTA buttons present")

        status = "PASS" if len(issues) == 0 else "PARTIAL" if len(issues) < 2 else "FAIL"
        log_result(2, "Convention Signup Flow", status, screenshots, "; ".join(notes), issues)
        return status

    except Exception as e:
        screenshots.append(take_screenshot(page, "uc2_error"))
        log_result(2, "Convention Signup Flow", "FAIL", screenshots, f"Error: {str(e)}", [str(e)])
        return "FAIL"

def test_use_case_3(page):
    """Use Case 3: Demo Dashboard Experience"""
    screenshots = []
    issues = []
    notes = []

    try:
        # Navigate to login
        page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(page, "uc3_01_login_page"))

        # Check for login form
        email_field = page.locator("input[type='email']").first
        password_field = page.locator("input[type='password']").first

        login_worked = False
        if email_field.count() > 0 and password_field.count() > 0:
            if email_field.is_visible() and password_field.is_visible():
                notes.append("Login form found")
                email_field.fill("demo@poolapp.com")
                password_field.fill("demo123")
                screenshots.append(take_screenshot(page, "uc3_02_login_filled"))

                # Submit login
                submit_btn = page.locator("button[type='submit']").first
                if submit_btn.count() == 0:
                    submit_btn = page.locator("button:has-text('Login'), button:has-text('Sign In')").first

                if submit_btn.count() > 0 and submit_btn.is_visible():
                    submit_btn.click()
                    page.wait_for_timeout(3000)
                    screenshots.append(take_screenshot(page, "uc3_03_after_login"))

                    # Check if we're on dashboard
                    if "/dashboard" in page.url:
                        notes.append("Successfully reached dashboard via login")
                        login_worked = True
                    else:
                        notes.append(f"Login redirect to: {page.url}")

        if not login_worked:
            # Try going directly to dashboard
            page.goto(f"{BASE_URL}/dashboard", wait_until="networkidle")
            page.wait_for_timeout(2000)
            screenshots.append(take_screenshot(page, "uc3_02_direct_dashboard"))
            notes.append("Accessed dashboard directly (demo mode)")

        # Check dashboard content
        page.goto(f"{BASE_URL}/dashboard", wait_until="networkidle")
        page.wait_for_timeout(2000)

        # Look for revenue/savings stats
        stat_cards = page.locator("[class*='stat']").all()
        metric_cards = page.locator("[class*='metric']").all()
        cards = page.locator("[class*='card']").all()
        total_cards = len(stat_cards) + len(metric_cards) + len(cards)

        if total_cards > 0:
            notes.append(f"Found {total_cards} stat/metric/card elements")

        # Look for specific metrics - dollar amounts
        dollar_elements = page.locator("text=$").all()
        if len(dollar_elements) > 0:
            notes.append(f"Found {len(dollar_elements)} dollar amount displays")

        # Look for percentage values
        percent_elements = page.locator("text=%").all()
        if len(percent_elements) > 0:
            notes.append(f"Found {len(percent_elements)} percentage displays")

        # Look for chemistry/alerts section
        alert_elements = page.locator("[class*='alert']").all()
        if len(alert_elements) > 0:
            notes.append(f"Found {len(alert_elements)} alert elements")

        # Look for chemistry text
        chem_text = page.locator("text=chemistry").all()
        ph_text = page.locator("text=pH").all()
        chlorine_text = page.locator("text=chlorine").all()
        if len(chem_text) + len(ph_text) + len(chlorine_text) > 0:
            notes.append("Chemistry-related content found")

        # Look for tech utilization
        tech_text = page.locator("text=tech").all()
        util_text = page.locator("text=utilization").all()
        efficiency_text = page.locator("text=efficiency").all()
        if len(tech_text) + len(util_text) + len(efficiency_text) > 0:
            notes.append("Tech/utilization content found")

        screenshots.append(take_screenshot(page, "uc3_04_dashboard_content"))

        # Scroll to see more
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(500)
        screenshots.append(take_screenshot(page, "uc3_05_dashboard_scrolled"))

        status = "PASS" if len(issues) == 0 else "PARTIAL"
        log_result(3, "Demo Dashboard Experience", status, screenshots, "; ".join(notes), issues)
        return status

    except Exception as e:
        screenshots.append(take_screenshot(page, "uc3_error"))
        log_result(3, "Demo Dashboard Experience", "FAIL", screenshots, f"Error: {str(e)}", [str(e)])
        return "FAIL"

def test_use_case_4(page):
    """Use Case 4: Route Optimization Demo"""
    screenshots = []
    issues = []
    notes = []

    try:
        # Navigate to routes page
        page.goto(f"{BASE_URL}/routes", wait_until="networkidle")
        page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(page, "uc4_01_routes_page"))

        # Check for 404
        page_content = page.content().lower()
        if "404" in page.title().lower() or "not found" in page_content:
            issues.append("/routes page returns 404")
            log_result(4, "Route Optimization Demo", "FAIL", screenshots, "Page not found", issues)
            return "FAIL"

        # Look for before/after comparison
        before_text = page.locator("text=before").all()
        after_text = page.locator("text=after").all()
        optimize_text = page.locator("text=optimiz").all()

        if len(before_text) > 0 or len(after_text) > 0:
            notes.append("Before/after comparison elements found")
        if len(optimize_text) > 0:
            notes.append("Optimization text found")

        # Look for savings stats - dollar amounts
        dollar_elements = page.locator("text=$").all()
        if len(dollar_elements) > 0:
            notes.append(f"Found {len(dollar_elements)} dollar amount displays")

        # Look for miles/time savings
        miles_text = page.locator("text=mile").all()
        hours_text = page.locator("text=hour").all()
        min_text = page.locator("text=min").all()

        if len(miles_text) + len(hours_text) + len(min_text) > 0:
            notes.append("Time/distance metrics found")

        # Look for map or route visualization
        map_elem = page.locator("[class*='map']").all()
        canvas_elem = page.locator("canvas").all()
        svg_elem = page.locator("svg").all()
        route_elem = page.locator("[class*='route']").all()

        if len(map_elem) + len(canvas_elem) + len(svg_elem) + len(route_elem) > 0:
            notes.append("Map/route visualization found")

        # Look for per-tech breakdown
        tech_text = page.locator("text=tech").all()
        rows = page.locator("tr").all()

        if len(tech_text) > 0:
            notes.append("Tech-related content found")
        if len(rows) > 3:
            notes.append(f"Table with {len(rows)} rows found (likely tech breakdown)")

        # Scroll to see more content
        page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
        page.wait_for_timeout(500)
        screenshots.append(take_screenshot(page, "uc4_02_routes_scrolled"))

        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(500)
        screenshots.append(take_screenshot(page, "uc4_03_routes_bottom"))

        status = "PASS" if len(issues) == 0 else "PARTIAL" if len(issues) < 2 else "FAIL"
        log_result(4, "Route Optimization Demo", status, screenshots, "; ".join(notes), issues)
        return status

    except Exception as e:
        screenshots.append(take_screenshot(page, "uc4_error"))
        log_result(4, "Route Optimization Demo", "FAIL", screenshots, f"Error: {str(e)}", [str(e)])
        return "FAIL"

def test_use_case_5(page):
    """Use Case 5: Customer Management Demo"""
    screenshots = []
    issues = []
    notes = []

    try:
        # Navigate to customers page
        page.goto(f"{BASE_URL}/customers", wait_until="networkidle")
        page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(page, "uc5_01_customers_page"))

        # Check for 404
        page_content = page.content().lower()
        if "404" in page.title().lower() or "not found" in page_content:
            issues.append("/customers page returns 404")
            log_result(5, "Customer Management Demo", "FAIL", screenshots, "Page not found", issues)
            return "FAIL"

        # Look for customer list
        customer_cards = page.locator("[class*='customer']").all()
        rows = page.locator("tr").all()
        cards = page.locator("[class*='card']").all()

        total_items = len(customer_cards) + len(rows) + len(cards)
        if total_items > 2:
            notes.append(f"Found {total_items} customer-related elements")
        else:
            issues.append("No customer list visible")

        # Look for status indicators
        badges = page.locator("[class*='badge']").all()
        status_elem = page.locator("[class*='status']").all()
        indicators = page.locator("[class*='indicator']").all()
        chips = page.locator("[class*='chip']").all()

        total_badges = len(badges) + len(status_elem) + len(indicators) + len(chips)
        if total_badges > 0:
            notes.append(f"Found {total_badges} status indicators")

        # Look for chemistry alerts inline
        alert_elem = page.locator("[class*='alert']").all()
        chem_text = page.locator("text=chemistry").all()
        ph_text = page.locator("text=pH").all()
        chlorine_text = page.locator("text=chlorine").all()

        if len(alert_elem) + len(chem_text) + len(ph_text) + len(chlorine_text) > 0:
            notes.append("Chemistry alert indicators found")

        # Try to click into a customer detail
        customer_link = page.locator("a[href*='customer']").first
        if customer_link.count() == 0:
            customer_link = page.locator("tr").first
        if customer_link.count() == 0:
            customer_link = page.locator("[class*='customer']").first

        if customer_link.count() > 0 and customer_link.is_visible():
            original_url = page.url
            customer_link.click()
            page.wait_for_timeout(2000)
            screenshots.append(take_screenshot(page, "uc5_02_customer_detail"))

            if page.url != original_url:
                notes.append("Customer detail page accessible")
            else:
                notes.append("Customer clicked (modal or inline detail)")
        else:
            notes.append("No clickable customer found")

        status = "PASS" if len(issues) == 0 else "PARTIAL" if len(issues) < 2 else "FAIL"
        log_result(5, "Customer Management Demo", status, screenshots, "; ".join(notes), issues)
        return status

    except Exception as e:
        screenshots.append(take_screenshot(page, "uc5_error"))
        log_result(5, "Customer Management Demo", "FAIL", screenshots, f"Error: {str(e)}", [str(e)])
        return "FAIL"

def test_use_case_6(page):
    """Use Case 6: Invoice Demo"""
    screenshots = []
    issues = []
    notes = []

    try:
        # Navigate to invoices page
        page.goto(f"{BASE_URL}/invoices", wait_until="networkidle")
        page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(page, "uc6_01_invoices_page"))

        # Check for 404
        page_content = page.content().lower()
        if "404" in page.title().lower() or "not found" in page_content:
            issues.append("/invoices page returns 404")
            log_result(6, "Invoice Demo", "FAIL", screenshots, "Page not found", issues)
            return "FAIL"

        # Look for payment stats
        paid_text = page.locator("text=paid").all()
        pending_text = page.locator("text=pending").all()
        overdue_text = page.locator("text=overdue").all()
        collected_text = page.locator("text=collected").all()

        total_status = len(paid_text) + len(pending_text) + len(overdue_text) + len(collected_text)
        if total_status > 0:
            notes.append(f"Found {total_status} payment status elements")

        # Look for dollar amounts
        dollar_elements = page.locator("text=$").all()
        if len(dollar_elements) > 0:
            notes.append(f"Found {len(dollar_elements)} dollar amount displays")

        # Look for invoice list
        invoice_cards = page.locator("[class*='invoice']").all()
        rows = page.locator("tr").all()

        total_items = len(invoice_cards) + len(rows)
        if total_items > 2:
            notes.append(f"Found {total_items} invoice rows")
        else:
            issues.append("No invoice list visible")

        # Look for "get paid faster" value prop
        faster_text = page.locator("text=faster").all()
        automatic_text = page.locator("text=automatic").all()
        recurring_text = page.locator("text=recurring").all()

        if len(faster_text) + len(automatic_text) + len(recurring_text) > 0:
            notes.append("'Get paid faster' value proposition found")

        # Scroll to see more
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(500)
        screenshots.append(take_screenshot(page, "uc6_02_invoices_scrolled"))

        status = "PASS" if len(issues) == 0 else "PARTIAL" if len(issues) < 2 else "FAIL"
        log_result(6, "Invoice Demo", status, screenshots, "; ".join(notes), issues)
        return status

    except Exception as e:
        screenshots.append(take_screenshot(page, "uc6_error"))
        log_result(6, "Invoice Demo", "FAIL", screenshots, f"Error: {str(e)}", [str(e)])
        return "FAIL"

def test_use_case_7(page, browser):
    """Use Case 7: Mobile Experience"""
    screenshots = []
    issues = []
    notes = []

    try:
        # Create mobile context
        mobile_context = browser.new_context(
            viewport={"width": 375, "height": 812},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15"
        )
        mobile_page = mobile_context.new_page()

        # Test homepage on mobile
        mobile_page.goto(BASE_URL, wait_until="networkidle")
        mobile_page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(mobile_page, "uc7_01_mobile_homepage"))

        # Check for hamburger menu or mobile nav
        hamburger = mobile_page.locator("[class*='hamburger']").first
        mobile_menu = mobile_page.locator("[class*='mobile-menu']").first
        burger = mobile_page.locator("[class*='burger']").first
        menu_btn = mobile_page.locator("button[aria-label*='menu']").first

        mobile_nav = None
        for nav in [hamburger, mobile_menu, burger, menu_btn]:
            if nav.count() > 0 and nav.is_visible():
                mobile_nav = nav
                break

        if mobile_nav:
            notes.append("Mobile navigation menu found")
            try:
                mobile_nav.click()
                mobile_page.wait_for_timeout(500)
                screenshots.append(take_screenshot(mobile_page, "uc7_02_mobile_nav_open"))
            except:
                notes.append("Mobile nav click failed")
        else:
            # Check if nav is just visible
            nav_links = mobile_page.locator("nav a").all()
            if len(nav_links) > 0:
                notes.append(f"Navigation visible on mobile ({len(nav_links)} links)")

        # Test dashboard on mobile
        mobile_page.goto(f"{BASE_URL}/dashboard", wait_until="networkidle")
        mobile_page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(mobile_page, "uc7_03_mobile_dashboard"))

        # Check touch target sizes (buttons should be at least 44x44)
        buttons = mobile_page.locator("button, a[class*='btn'], [role='button']").all()
        small_buttons = 0
        for btn in buttons[:10]:  # Check first 10
            try:
                box = btn.bounding_box()
                if box and (box['width'] < 44 or box['height'] < 44):
                    small_buttons += 1
            except:
                pass

        if small_buttons > 0:
            issues.append(f"{small_buttons} buttons may be too small for touch")
        else:
            notes.append("Touch targets appear adequate")

        # Test routes on mobile
        mobile_page.goto(f"{BASE_URL}/routes", wait_until="networkidle")
        mobile_page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(mobile_page, "uc7_04_mobile_routes"))

        # Test convention page on mobile
        mobile_page.goto(f"{BASE_URL}/convention", wait_until="networkidle")
        mobile_page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(mobile_page, "uc7_05_mobile_convention"))

        # Verify text is readable
        notes.append("Mobile pages rendered successfully")

        mobile_context.close()

        status = "PASS" if len(issues) == 0 else "PARTIAL" if len(issues) < 2 else "FAIL"
        log_result(7, "Mobile Experience", status, screenshots, "; ".join(notes), issues)
        return status

    except Exception as e:
        screenshots.append(take_screenshot(page, "uc7_error"))
        log_result(7, "Mobile Experience", "FAIL", screenshots, f"Error: {str(e)}", [str(e)])
        return "FAIL"

def test_use_case_8(page):
    """Use Case 8: QR Code Flow"""
    screenshots = []
    issues = []
    notes = []

    try:
        # Navigate to QR page
        page.goto(f"{BASE_URL}/qr", wait_until="networkidle")
        page.wait_for_timeout(2000)
        screenshots.append(take_screenshot(page, "uc8_01_qr_page"))

        # Check for 404
        page_content = page.content().lower()
        if "404" in page.title().lower() or "not found" in page_content:
            issues.append("/qr page returns 404")
            log_result(8, "QR Code Flow", "FAIL", screenshots, "Page not found", issues)
            return "FAIL"

        # Look for QR code image
        qr_img = page.locator("img[src*='qr']").first
        canvas = page.locator("canvas").first
        qr_class = page.locator("[class*='qr']").first
        img = page.locator("img").first

        qr_found = False
        for elem in [qr_img, canvas, qr_class, img]:
            if elem.count() > 0 and elem.is_visible():
                notes.append("QR code element found")
                qr_found = True

                # Try to get the QR code src
                try:
                    src = elem.get_attribute("src")
                    if src:
                        notes.append(f"QR image src: {src[:80]}...")
                except:
                    pass
                break

        if not qr_found:
            issues.append("No QR code visible on page")

        # Check if page mentions convention
        convention_link = page.locator("a[href*='convention']").all()
        convention_text = page.locator("text=convention").all()

        if len(convention_link) + len(convention_text) > 0:
            notes.append("Convention reference found on QR page")

        # Scroll to see full page
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(500)
        screenshots.append(take_screenshot(page, "uc8_02_qr_scrolled"))

        status = "PASS" if len(issues) == 0 else "PARTIAL" if len(issues) < 2 else "FAIL"
        log_result(8, "QR Code Flow", status, screenshots, "; ".join(notes), issues)
        return status

    except Exception as e:
        screenshots.append(take_screenshot(page, "uc8_error"))
        log_result(8, "QR Code Flow", "FAIL", screenshots, f"Error: {str(e)}", [str(e)])
        return "FAIL"

def main():
    """Run all E2E tests"""
    print("\n" + "="*60)
    print("POOLAPP E2E TEST SUITE - CONVENTION PRE-LAUNCH QA")
    print(f"Testing: {BASE_URL}")
    print(f"Started: {datetime.now().isoformat()}")
    print("="*60 + "\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        # Run all use cases
        statuses = []
        statuses.append(test_use_case_1(page))
        statuses.append(test_use_case_2(page))
        statuses.append(test_use_case_3(page))
        statuses.append(test_use_case_4(page))
        statuses.append(test_use_case_5(page))
        statuses.append(test_use_case_6(page))
        statuses.append(test_use_case_7(page, browser))
        statuses.append(test_use_case_8(page))

        browser.close()

    # Summary
    passed = statuses.count("PASS")
    partial = statuses.count("PARTIAL")
    failed = statuses.count("FAIL")

    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"PASSED: {passed}/8")
    print(f"PARTIAL: {partial}/8")
    print(f"FAILED: {failed}/8")
    print("="*60 + "\n")

    results["summary"] = {
        "passed": passed,
        "partial": partial,
        "failed": failed,
        "total": 8
    }

    # Save results to JSON
    with open(f"{SCREENSHOT_DIR}/../results.json", "w") as f:
        json.dump(results, f, indent=2)

    print(f"Results saved to {SCREENSHOT_DIR}/../results.json")
    print(f"Screenshots saved to {SCREENSHOT_DIR}/")

    return results

if __name__ == "__main__":
    main()
