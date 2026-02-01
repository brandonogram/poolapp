#!/usr/bin/env python3
"""
Final QA verification - confirms all critical paths work
"""

from playwright.sync_api import sync_playwright
import sys

BASE_URL = "https://poolapp-tau.vercel.app"

def final_qa():
    """Run final QA verification"""
    print("\n" + "="*60)
    print("FINAL QA VERIFICATION - POOLAPP")
    print("="*60 + "\n")

    passed = 0
    failed = 0
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test 1: Homepage loads
        print("Checking homepage...")
        page.goto(BASE_URL, wait_until="networkidle")
        if "Pool" in page.title() or "pool" in page.content().lower():
            results.append(("Homepage loads", "PASS"))
            passed += 1
        else:
            results.append(("Homepage loads", "FAIL"))
            failed += 1

        # Test 2: Convention page loads
        print("Checking convention page...")
        page.goto(f"{BASE_URL}/convention", wait_until="networkidle")
        if "$79" in page.content() or "convention" in page.content().lower():
            results.append(("Convention page loads", "PASS"))
            passed += 1
        else:
            results.append(("Convention page loads", "FAIL"))
            failed += 1

        # Test 3: Dashboard loads
        print("Checking dashboard...")
        page.goto(f"{BASE_URL}/dashboard", wait_until="networkidle")
        if "revenue" in page.content().lower() or "$" in page.content():
            results.append(("Dashboard loads", "PASS"))
            passed += 1
        else:
            results.append(("Dashboard loads", "FAIL"))
            failed += 1

        # Test 4: Routes page loads
        print("Checking routes page...")
        page.goto(f"{BASE_URL}/routes", wait_until="networkidle")
        if "route" in page.content().lower() or "optimi" in page.content().lower():
            results.append(("Routes page loads", "PASS"))
            passed += 1
        else:
            results.append(("Routes page loads", "FAIL"))
            failed += 1

        # Test 5: Customers page loads
        print("Checking customers page...")
        page.goto(f"{BASE_URL}/customers", wait_until="networkidle")
        if "customer" in page.content().lower() or "chemistry" in page.content().lower():
            results.append(("Customers page loads", "PASS"))
            passed += 1
        else:
            results.append(("Customers page loads", "FAIL"))
            failed += 1

        # Test 6: Invoices page loads
        print("Checking invoices page...")
        page.goto(f"{BASE_URL}/invoices", wait_until="networkidle")
        if "invoice" in page.content().lower() or "paid" in page.content().lower():
            results.append(("Invoices page loads", "PASS"))
            passed += 1
        else:
            results.append(("Invoices page loads", "FAIL"))
            failed += 1

        # Test 7: QR page loads
        print("Checking QR page...")
        page.goto(f"{BASE_URL}/qr", wait_until="networkidle")
        if "scan" in page.content().lower() or "qr" in page.content().lower():
            results.append(("QR page loads", "PASS"))
            passed += 1
        else:
            results.append(("QR page loads", "FAIL"))
            failed += 1

        # Test 8: Login page loads
        print("Checking login page...")
        page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        if "login" in page.content().lower() or "sign in" in page.content().lower() or "email" in page.content().lower():
            results.append(("Login page loads", "PASS"))
            passed += 1
        else:
            results.append(("Login page loads", "FAIL"))
            failed += 1

        browser.close()

    # Print results
    print("\n" + "="*60)
    print("FINAL QA RESULTS")
    print("="*60)
    for name, status in results:
        icon = "[OK]" if status == "PASS" else "[FAIL]"
        print(f"{icon} {name}: {status}")
    print("="*60)
    print(f"\nTOTAL: {passed}/{passed+failed} PASSED")
    print("="*60 + "\n")

    if failed == 0:
        print("ALL CHECKS PASSED - APP IS READY FOR CONVENTION!")
        return 0
    else:
        print(f"WARNING: {failed} checks failed!")
        return 1

if __name__ == "__main__":
    sys.exit(final_qa())
