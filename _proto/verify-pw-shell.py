"""Visual check: My Pathway sits in the app shell on phone, tablet, laptop."""
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8080/app.html"
OUT = "_proto/verify-shots"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def boot(page):
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(160)
    page.evaluate(
        """() => {
          document.documentElement.classList.remove('splash-on');
          var el = document.getElementById('app-splash');
          if (el && el.parentNode) el.parentNode.removeChild(el);
          applyPrototypeRole('student');
          S.pw.name = 'Aaliyah Persaud';
          S.pw.firstName = 'Aaliyah';
          S.pw.archetype = 'The Steward';
          S.archetype = 'The Steward';
          S.pw.goal = 'uni';
          S.pw.fields = ['trade'];
          S.pw.field = 'trade';
          S.pw.region = 'r4';
          S.pw.level = 'f4';
          S.pw.lineStage = 'form4';
          S.pw.open = 'form4';
          S.pw.considering = [0];
          S.pw.tab = 'me';
          S.pw.sub = '';
          setView('feed');
        }"""
    )
    page.wait_for_timeout(120)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, headless=True)
        page = browser.new_page()
        boot(page)
        for w, h, tag, nav in (
            (390, 844, "390", "#dock-pathway"),
            (768, 900, "768", "#dock-pathway"),
            (1280, 900, "1280", "#nav-pathway"),
        ):
            page.set_viewport_size({"width": w, "height": h})
            page.wait_for_timeout(80)
            page.evaluate("() => setView('feed')")
            page.wait_for_timeout(80)
            page.locator(nav).click()
            page.wait_for_timeout(140)
            assert page.locator(".mp-line").count() == 1, tag
            assert page.locator(nav).get_attribute("aria-current") == "page", tag
            if w >= 980:
                assert (
                    page.evaluate(
                        "() => getComputedStyle(document.querySelector('.rail.left')).display"
                    )
                    == "flex"
                )
            else:
                assert page.locator("#dock-pathway").is_visible()
            page.screenshot(path=f"{OUT}/mp-shell-{tag}.png", full_page=False)
            page.locator('.pw-subtabs [data-pw-tab="explore"]').click()
            page.wait_for_timeout(80)
            page.locator(nav).click()
            page.wait_for_timeout(120)
            assert page.locator(".mp-line").count() == 1, tag + " loop"
        browser.close()
    print("verify-pw-shell ok")


if __name__ == "__main__":
    main()
