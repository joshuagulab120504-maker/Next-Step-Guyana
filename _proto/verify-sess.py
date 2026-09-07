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

        vp = page.locator("meta[name='viewport']").get_attribute("content") or ""
        assert "user-scalable=no" not in vp
        assert "maximum-scale=1" not in vp

        set_role(page, "student")
        ask = page.locator(".qa-ask-open")
        assert ask.count() == 1, "student should get the ask button"
        assert page.locator(".opp-post-btn").count() == 0, "student must not see Post picker"
        assert "sessions booked" in page.locator(".sess-student-line").inner_text().lower() or "no sessions booked" in page.locator(".sess-student-line").inner_text().lower()

        card = page.locator('.sess-card[data-id="s-trades"]')
        assert card.count() == 1, "Omar session card missing"
        feed_html = page.locator("#main").inner_html()
        assert "meet.google.com" not in feed_html
        assert "whatsapp" not in feed_html.lower()
        assert card.locator(".date-chip").count() == 0, "date tile must not be in the author slot"
        assert "places left" not in card.inner_text().lower()
        assert card.locator(".opp-av.is-person").count() == 1
        assert card.locator(".k-word.k-session").inner_text() == "Session"
        assert card.locator(".sess-title").inner_text().find("GTTi") != -1
        assert card.locator(".glance .g").count() == 3
        assert "Starts in" in card.locator(".sess-count").inner_text()
        assert "is-soon" in (card.locator(".sess-count").get_attribute("class") or "")
        prim = card.locator(".sess-primary")
        assert prim.inner_text() == "Book a place"
        assert prim.inner_text() not in ("Finished", "Join now", "Sign up")
        assert card.locator(".qa-act.is-inspired").count() == 1
        assert card.locator(".qa-act.is-save").count() == 1

        page.set_viewport_size({"width": 360, "height": 800})
        assert card.locator(".qa-act span").count() >= 3
        page.screenshot(path=str(SHOT / "360-sess-card.png"), full_page=False)
        page.set_viewport_size({"width": 1440, "height": 900})

        set_role(page, "parent")
        page.locator('.sess-card[data-id="s-trades"] .sess-primary').click()
        page.wait_for_timeout(250)
        layer = page.locator("#qa-layer")
        hidden = (not layer.is_visible()) if layer.count() else True
        title = page.locator("#qa-dlg-title")
        assert hidden or title.count() == 0 or title.inner_text() != "Book a place"

        set_role(page, "student")
        card = page.locator('.sess-card[data-id="s-trades"]')
        prim = card.locator(".sess-primary")
        prim.click()
        page.wait_for_timeout(250)
        assert page.locator("#qa-dlg-title").inner_text() == "Book a place"
        assert page.locator("#sess-book-name").count() == 1
        assert page.locator("#sess-book-email").count() == 1
        assert page.locator("#sess-book-alert").is_checked() is False
        assert "form and region" in page.locator(".sess-box").inner_text().lower()
        assert page.locator("#sess-book-go").is_disabled()
        page.fill("#sess-book-name", "Asha")
        page.fill("#sess-book-email", "asha@example.com")
        page.wait_for_timeout(100)
        assert page.locator("#sess-book-go").is_enabled()
        page.locator("#sess-book-go").click()
        page.wait_for_timeout(250)
        assert page.locator("#qa-dlg-title").inner_text() == "You have a place"
        assert "My Sessions" in page.locator(".sess-box").inner_text()
        page.locator("[data-sess-dlg-close]").click()
        page.wait_for_timeout(200)
        assert card.locator(".sess-primary").inner_text() == "You have a place"
        assert "Your place is booked" in card.inner_text()
        page.screenshot(path=str(SHOT / "1440-sess-booked.png"), full_page=False)

        set_role(page, "mentor", "omar")
        host_card = page.locator('.sess-card[data-id="s-trades"]')
        assert host_card.locator(".story-follow").count() == 0
        assert "starts in" in page.locator(".sess-lead-line").inner_text().lower()
        host_card.locator(".qa-more-btn").click()
        page.wait_for_timeout(150)
        assert page.locator("[data-sess-edit]").count() == 1
        assert page.locator("[data-sess-reg]").inner_text() == "Close registration"
        page.locator("[data-sess-reg]").click()
        page.wait_for_timeout(200)
        assert host_card.locator(".sess-primary").inner_text() == "Registration closed"
        assert host_card.locator(".sess-primary").is_disabled()
        page.screenshot(path=str(SHOT / "1440-sess-host.png"), full_page=False)

        page.locator("[data-opp-post]").click()
        page.wait_for_timeout(200)
        assert page.locator("#qa-dlg-title").inner_text() == "What are you posting?"
        assert page.locator("[data-opp-type]").count() == 4
        assert page.locator('[data-opp-type="session"]').inner_text().find("hosting") != -1
        page.screenshot(path=str(SHOT / "1440-sess-picker.png"), full_page=False)
        page.locator('[data-opp-type="session"]').click()
        page.wait_for_timeout(200)
        assert page.locator("#qa-dlg-title").inner_text() == "Host a session"
        assert "Step 1 of 2" in page.locator(".opp-step").inner_text()
        assert page.locator("#sess-continue").is_disabled()
        page.fill("#sess-title", "Site walk at GTTi")
        page.fill("#sess-desc", "Walk the workshop floor and talk through first-year electrical work.")
        page.fill("#sess-tag-q", "build")
        page.wait_for_timeout(150)
        page.locator("[data-sess-pick]").first.click()
        page.wait_for_timeout(150)
        assert page.locator("#sess-continue").is_enabled()
        page.locator("[data-sess-next]").click()
        page.wait_for_timeout(150)
        assert page.locator("#sess-date").get_attribute("type") == "date"
        assert page.locator("#sess-time").get_attribute("type") == "time"
        date_size = page.evaluate("() => getComputedStyle(document.getElementById('sess-date')).fontSize")
        assert date_size == "16px", date_size
        page.fill("#sess-date", "2026-10-02")
        page.fill("#sess-time", "17:00")
        page.fill("#sess-where", "Google Meet")
        page.fill("#sess-who", "Form 4 and Form 5")
        page.locator("[data-sess-next]").click()
        page.wait_for_timeout(200)
        assert page.locator("#qa-dlg-title").inner_text() == "Preview"
        assert page.locator(".sess-card.opp-preview").count() == 1
        assert page.locator(".sess-card.opp-preview .qa-more").count() == 0
        assert page.locator(".sess-card.opp-preview .story-follow").count() == 0
        page.screenshot(path=str(SHOT / "1440-sess-preview.png"), full_page=False)
        page.locator("[data-sess-publish]").click()
        page.wait_for_timeout(250)
        posted = page.locator(".sess-card").filter(has_text="Site walk at GTTi")
        assert posted.count() == 1

        host_card.locator(".sess-title").click()
        page.wait_for_timeout(300)
        assert page.locator(".sess-sheet").count() == 1
        assert page.locator("#sheet-title").inner_text() == "Session"
        assert page.locator(".sheet-crumb").inner_text() == ""
        assert page.locator(".sess-host").count() == 1
        assert "Registration closed" in page.locator(".sess-host").inner_text()
        assert "never a name" in page.locator(".sess-asks").inner_text().lower()
        assert page.locator(".sess-sheet .sess-primary").count() == 1
        page.screenshot(path=str(SHOT / "1440-sess-sheet.png"), full_page=False)

        weights = page.evaluate(
            """() => {
              var bad = [];
              document.querySelectorAll('.sess-card, .sess-sheet, .sess-box').forEach(function(el) {
                var w = parseInt(getComputedStyle(el).fontWeight, 10);
                if (w > 600) bad.push(el.className + ':' + w);
              });
              return bad;
            }"""
        )
        assert weights == [], weights

        browser.close()
    if errors:
        raise SystemExit("page errors: " + " | ".join(errors[:6]))
    print("verify-sess ok")


if __name__ == "__main__":
    main()
