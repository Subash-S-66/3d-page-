from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Click the trigger
        trigger = page.locator("#jules-trigger")
        trigger.click()

        # Wait for panel to open
        page.wait_for_selector(".jules-panel.open")

        # Type and send
        input_box = page.locator("#jules-input")
        input_box.fill("Hello Jules!")

        send_btn = page.locator("#jules-send")
        send_btn.click()

        # Wait for API key missing message
        page.wait_for_timeout(1500)

        # Take screenshot of the chat panel
        page.screenshot(path="jules_chat_test.png")
        print("Screenshot saved to jules_chat_test.png")

        browser.close()

if __name__ == "__main__":
    verify()
