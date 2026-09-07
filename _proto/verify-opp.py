from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SHOT = Path(__file__).resolve().parent / "verify-shots"
URL = "http://127.0.0.1:8080/app.html"


def skip_splash(page):
    page.evaluate(
        """() => {
          document.documentElement.classList.remove('splash-on');
          var el = document.getElementById('app-splash');
          if (el && el.parentNode) el.parentNode.removeChild(el);
        }"""
    )


def set_role(page, role, author_id=None):
    page.evaluate(
        """([role, authorId]) => {
          applyPrototypeRole(role);
          if (authorId) S.me.id = authorId;
          render();
        }""",
        [role, author_id],
    )
    page.wait_for_timeout(250)


def main():
    SHOT.mkdir(exist_ok=True)
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless=True,
        )
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.goto(URL, wait_until="domcontentloaded")
        page.wait_for_timeout(300)
        skip_splash(page)

        set_role(page, "student")
        page.screenshot(path=str(SHOT / "1440-opp-student.png"), full_page=False)
        ask = page.locator(".qa-ask-open")
        assert ask.count() == 1, "student should get the ask button"
        assert page.locator(".opp-post-btn").count() == 0, "student must not see Post picker"
        assert page.locator(".opp-pick").count() == 0

        pyarg = page.locator('.opp-card[data-id="pyarg"]')
        assert pyarg.count() == 1, "pyarg card missing"
        assert pyarg.locator(".opp-title").inner_text().find("Youth Award") != -1
        assert pyarg.locator(".glance .g").count() == 3
        assert pyarg.locator(".opp-deadline").inner_text().find("Closes") != -1
        assert pyarg.locator(".opp-primary").inner_text() == "How to apply"
        assert pyarg.locator(".cost, .check-line, dt:text('Cost')").count() == 0
        assert "desk" not in pyarg.inner_text().lower()
        assert pyarg.locator(".opp-av.is-person").count() == 1

        stem = page.locator('.opp-card[data-id="stem"]')
        assert stem.count() == 1
        assert stem.locator(".opp-deadline").count() == 0, "year-round must have no chip"
        assert stem.locator(".opp-av.is-org").count() == 1, "collaborator avatar should be square"

        closed = page.locator('.opp-card[data-id="blue"]')
        assert closed.count() == 1
        assert "closed" in (closed.get_attribute("class") or "")
        assert closed.locator(".opp-primary").inner_text() == "Closed"
        assert closed.locator(".opp-primary").is_disabled()

        pyarg.locator(".qa-see, .opp-title").first.click()
        page.wait_for_timeout(300)
        assert page.locator(".opp-sheet").count() == 1
        assert page.locator("#sheet-title").inner_text() == "Opportunity"
        page.screenshot(path=str(SHOT / "1440-opp-sheet.png"), full_page=False)
        page.locator(".opp-sheet [data-opp-apply='pyarg']").click()
        page.wait_for_timeout(200)
        assert page.locator("#qa-dlg-title").inner_text() == "How to apply"
        assert "not on Next Step" in page.locator(".opp-apply-note").inner_text()
        page.screenshot(path=str(SHOT / "1440-opp-apply.png"), full_page=False)
        page.locator("[data-opp-cancel]").click()
        page.click("#sheet-close")
        page.wait_for_timeout(200)

        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(200)
        page.screenshot(path=str(SHOT / "390-opp-card.png"), full_page=False)

        page.set_viewport_size({"width": 1440, "height": 900})
        set_role(page, "mentor", "keisha")
        lead = page.locator(".opp-lead")
        assert lead.count() == 1, "mentor author strip missing"
        assert page.locator(".opp-post-btn").inner_text() == "Post"
        assert "closes" in page.locator(".opp-warn").inner_text().lower()
        page.screenshot(path=str(SHOT / "1440-opp-mentor.png"), full_page=False)

        page.locator("[data-opp-post]").click()
        page.wait_for_timeout(200)
        assert page.locator("[data-opp-type]").count() == 3
        page.screenshot(path=str(SHOT / "1440-opp-picker.png"), full_page=False)
        page.locator('[data-opp-type="opportunity"]').click()
        page.wait_for_timeout(200)
        assert page.locator("#qa-dlg-title").inner_text() == "Share an opportunity"
        assert page.locator("#opp-continue").is_disabled()
        page.fill("#opp-title", "Holiday robotics camp")
        page.fill("#opp-desc", "A two-week camp for Form 3 to Form 5 students who want to build a robot.")
        page.fill("#opp-tag-q", "tech")
        page.wait_for_timeout(150)
        page.locator("[data-opp-pick]").first.click()
        page.wait_for_timeout(150)
        assert page.locator("#opp-continue").is_enabled()
        page.locator("[data-opp-next]").click()
        page.wait_for_timeout(150)
        page.fill("#opp-who", "ages 12 to 18, any school")
        page.fill("#opp-where", "Georgetown clubhouse")
        page.fill("#opp-when", "two weeks in August")
        page.check("#opp-rolling")
        page.wait_for_timeout(100)
        assert page.locator("#opp-continue").is_enabled()
        page.locator("[data-opp-next]").click()
        page.wait_for_timeout(150)
        page.fill("#opp-apply", "https://example.com/camp")
        page.wait_for_timeout(100)
        assert "Open this link" in page.locator("#opp-apply-prev").inner_text()
        page.locator("[data-opp-next]").click()
        page.wait_for_timeout(200)
        assert page.locator("#qa-dlg-title").inner_text() == "Preview"
        assert page.locator(".opp-preview").count() == 1
        page.screenshot(path=str(SHOT / "1440-opp-preview.png"), full_page=False)
        page.locator("[data-opp-publish]").click()
        page.wait_for_timeout(250)
        assert page.locator('.opp-card[data-id*="opp-"]').count() >= 1

        page.locator("[data-opp-post]").click()
        page.wait_for_timeout(150)
        page.locator('[data-opp-type="story"]').click()
        page.wait_for_timeout(150)
        page.fill("#opp-story", "I learned to ask for travel money before trials week, not after the bus had already gone.")
        page.fill("#opp-tag-q", "sport")
        page.wait_for_timeout(150)
        page.locator("[data-opp-pick]").first.click()
        page.wait_for_timeout(100)
        page.locator("[data-opp-story-preview]").click()
        page.wait_for_timeout(150)
        assert page.locator(".opp-preview .opp-primary").count() == 0
        page.screenshot(path=str(SHOT / "1440-story-preview.png"), full_page=False)

        if errors:
            raise SystemExit("page errors:\n" + "\n".join(errors))
        browser.close()
        print("opp verify ok")


if __name__ == "__main__":
    main()
