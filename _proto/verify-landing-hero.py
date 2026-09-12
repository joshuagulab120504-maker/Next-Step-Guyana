"""Visual + layout check for planner landing hero and carousel."""
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8080/app.html"
OUT = "_proto/verify-shots"


def boot(page):
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(200)
    page.evaluate(
        """() => {
          document.documentElement.classList.remove('splash-on');
          var el = document.getElementById('app-splash');
          if (el && el.parentNode) el.parentNode.removeChild(el);
          applyPrototypeRole('visitor');
          S.pw.firstName = 'Aaliyah';
          setView('pathway');
        }"""
    )
    page.wait_for_timeout(200)


def shot(page, name, sel):
    page.locator(sel).screenshot(path=f"{OUT}/{name}.png")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless=True,
        )
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        boot(page)

        body = page.locator(".page-plan").inner_text()
        assert "Pause" not in body
        assert page.locator("[data-plan-pause]").count() == 0

        desk = page.evaluate(
            """() => {
              var hero = document.querySelector('.plan-hero').getBoundingClientRect();
              var h1 = document.querySelector('.plan-headline').getBoundingClientRect();
              var deck = document.querySelector('.plan-deck').getBoundingClientRect();
              var prev = document.querySelector('[data-plan-deck="prev"]').getBoundingClientRect();
              var next = document.querySelector('[data-plan-deck="next"]').getBoundingClientRect();
              var land = getComputedStyle(document.querySelector('.plan-landing'));
              var art = getComputedStyle(document.querySelector('.plan-hero-art'));
              return {
                h1Left: h1.left - hero.left,
                h1Bottom: hero.bottom - h1.bottom,
                vis: document.querySelectorAll('.plan-card.vis').length,
                prevLeft: prev.right <= deck.left + 2,
                nextRight: next.left >= deck.right - 2,
                align: Math.abs((prev.top + prev.height / 2) - (deck.top + deck.height / 2)),
                radius: parseFloat(land.borderTopRightRadius) || 0,
                obj: art.objectPosition,
                overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth
              };
            }"""
        )
        assert desk["h1Left"] < 36, desk
        assert 16 <= desk["h1Bottom"] <= 48, desk
        assert desk["vis"] == 3, desk
        assert desk["prevLeft"] and desk["nextRight"], desk
        assert desk["align"] < 24, desk
        assert desk["radius"] >= 12, desk
        assert desk["obj"].startswith("100%") or "right" in desk["obj"], desk
        assert desk["overflowX"] <= 0, desk

        shot(page, "landing-1280-hero", ".plan-landing")
        shot(page, "landing-1280-gallery", ".plan-gallery")
        page.screenshot(path=f"{OUT}/landing-1280-page.png", full_page=False)

        front0 = page.evaluate("() => document.querySelector('.plan-card.at-0').getAttribute('data-plan-card')")
        page.wait_for_timeout(3400)
        front1 = page.evaluate("() => document.querySelector('.plan-card.at-0').getAttribute('data-plan-card')")
        assert front0 != front1, (front0, front1)

        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(200)
        mob = page.evaluate(
            """() => {
              var hero = document.querySelector('.plan-hero').getBoundingClientRect();
              var h1 = document.querySelector('.plan-headline').getBoundingClientRect();
              var deck = document.querySelector('.plan-deck').getBoundingClientRect();
              var prev = document.querySelector('[data-plan-deck="prev"]').getBoundingClientRect();
              var next = document.querySelector('[data-plan-deck="next"]').getBoundingClientRect();
              return {
                h1Left: h1.left - hero.left,
                h1Bottom: hero.bottom - h1.bottom,
                vis: document.querySelectorAll('.plan-card.vis').length,
                front: document.querySelectorAll('.plan-card.at-0').length,
                prevLeft: prev.right <= deck.left + 2,
                nextRight: next.left >= deck.right - 2,
                overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth
              };
            }"""
        )
        assert mob["h1Left"] < 36, mob
        assert 16 <= mob["h1Bottom"] <= 48, mob
        assert mob["front"] == 1, mob
        assert mob["prevLeft"] and mob["nextRight"], mob
        assert mob["overflowX"] <= 0, mob

        shot(page, "landing-390-hero", ".plan-landing")
        shot(page, "landing-390-gallery", ".plan-gallery")
        page.screenshot(path=f"{OUT}/landing-390-page.png", full_page=False)
        browser.close()
    print("verify-landing-hero ok")


if __name__ == "__main__":
    main()
