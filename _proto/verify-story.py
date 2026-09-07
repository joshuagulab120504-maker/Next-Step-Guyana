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
        assert page.locator(".qa-ask-open").count() == 1, "student should get the ask button"
        assert page.locator(".opp-post-btn").count() == 0, "student must not see Post"
        page.locator(".qa-ask-open").click()
        page.wait_for_timeout(200)
        assert page.locator("[data-opp-type]").count() == 0, "student must not see a type picker"
        page.keyboard.press("Escape")
        page.wait_for_timeout(150)

        f3 = page.locator('.opp-story[data-id="f3"]')
        f3.scroll_into_view_if_needed()
        page.wait_for_timeout(150)
        assert f3.count() == 1, "f3 story missing"
        assert f3.locator(".story-body").count() == 1
        assert f3.locator("h3, .opp-title, .hook").count() == 0, "story must have no title"
        assert f3.locator(".opp-av.is-person").count() == 1
        assert f3.locator(".story-follow").count() == 1, "Follow should show on others"
        assert "+ Follow" in f3.locator(".story-follow").inner_text()
        assert "Story" in f3.locator(".opp-meta").inner_text()
        meta_color = f3.locator(".opp-meta").evaluate("el => getComputedStyle(el).color")
        assert "rgb(7, 134, 77)" not in meta_color, "Story label must not be green"
        assert f3.locator(".story-mosaic.n3").count() == 1
        assert f3.locator("[data-story-photo]").count() == 3
        assert f3.locator(".qa-see").count() == 1
        assert f3.locator(".qa-see").inner_text() == "…see more"
        assert f3.locator(".opp-primary, .opp-chip").count() >= 1
        assert "View more" not in f3.inner_text()
        page.screenshot(path=str(SHOT / "1440-story-card.png"), full_page=False)

        f12 = page.locator('.opp-story[data-id="f12"]')
        f12.scroll_into_view_if_needed()
        assert f12.locator(".story-mosaic.n1").count() == 1
        assert f12.locator("[data-story-photo]").count() == 1

        f7 = page.locator('.opp-story[data-id="f7"]')
        f7.scroll_into_view_if_needed()
        assert f7.locator(".opp-link").count() == 1
        assert "gtti.edu.gy" in f7.locator(".opp-link").inner_text()
        assert f7.locator(".story-mosaic").count() == 0

        page.evaluate(
            """() => {
              var item = feedById('f3');
              item.photos = item.photos.concat([
                { url: 'assets/hero-wide-1600.jpg', alt: 'A late afternoon sports field.', width: 1600, height: 900 },
                { url: 'assets/hero-crop-520.jpg', alt: 'A second look at the clinic desks.', width: 520, height: 347 }
              ]);
              render();
            }"""
        )
        page.wait_for_timeout(200)
        f3 = page.locator('.opp-story[data-id="f3"]')
        f3.scroll_into_view_if_needed()
        assert f3.locator(".story-mosaic.n5").count() == 1
        assert f3.locator("[data-story-photo]").count() == 4
        assert "+1" in f3.locator(".story-more").inner_text()
        page.screenshot(path=str(SHOT / "1440-story-mosaic5.png"), full_page=False)

        f3.locator("[data-story-photo='2']").click()
        page.wait_for_timeout(200)
        assert page.locator("#opp-light:not([hidden])").count() == 1
        assert "3 of 5" in page.locator(".opp-light-n").inner_text()
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(100)
        assert "4 of 5" in page.locator(".opp-light-n").inner_text()
        page.keyboard.press("Escape")
        page.wait_for_timeout(150)
        assert page.locator("#opp-light:not([hidden])").count() == 0

        page.evaluate(
            """() => {
              var item = feedById('f3');
              item.photos = item.photos.slice(0, 3);
              render();
            }"""
        )
        page.wait_for_timeout(200)
        f3 = page.locator('.opp-story[data-id="f3"]')
        f3.scroll_into_view_if_needed()
        f3.locator(".qa-see").click()
        page.wait_for_timeout(250)
        assert page.locator(".story-sheet").count() == 1
        assert page.locator("#sheet-title").inner_text() == "Story"
        assert page.locator("#sheet-crumb").inner_text() == ""
        assert page.locator(".story-sheet .qa-clamp").count() == 0
        assert page.locator(".story-sheet [data-open='story']").count() == 0
        assert "Save to my pathway" not in page.locator(".story-sheet").inner_text()
        assert page.locator(".story-mention-h").inner_text() == "Also mentioned"
        assert page.locator(".story-date").count() == 1
        assert page.locator(".story-kind").inner_text() == "Opportunity"
        page.screenshot(path=str(SHOT / "1440-story-sheet.png"), full_page=False)
        page.click("#sheet-close")
        page.wait_for_timeout(150)

        f3.locator(".story-follow").click()
        page.wait_for_timeout(200)
        assert "Following" in page.locator('.opp-story[data-id="f3"] .story-follow').inner_text()
        assert "Following. Their stories move up your feed." in page.locator("#toast").inner_text()

        set_role(page, "parent")
        assert page.locator(".qa-ask-open").count() == 1
        assert page.locator(".opp-post-btn").count() == 0

        set_role(page, "mentor", "raeka")
        f3 = page.locator('.opp-story[data-id="f3"]')
        f3.scroll_into_view_if_needed()
        assert f3.locator(".story-follow").count() == 0, "Follow hidden on own story"
        assert page.locator(".opp-post-btn").inner_text() == "Post"
        page.locator("[data-opp-post]").click()
        page.wait_for_timeout(200)
        assert page.locator("#qa-dlg-title").inner_text() == "What are you posting?"
        assert "Each one asks for different things" in page.locator(".qa-sub").inner_text()
        assert page.locator("[data-opp-type]").count() == 3
        page.screenshot(path=str(SHOT / "1440-story-picker.png"), full_page=False)
        page.locator('[data-opp-type="story"]').click()
        page.wait_for_timeout(200)
        assert page.locator("#qa-dlg-title").inner_text() == "Write a story"
        assert page.locator("#opp-continue").is_disabled()
        page.fill("#opp-story", "Short")
        page.wait_for_timeout(100)
        assert "more characters needed" in page.locator("#story-need").inner_text()
        page.fill(
            "#opp-story",
            "What I tell Form 4 after a weak mock. Start the rebuild that same week, not after the holidays, and keep the list of topics you missed to one page.",
        )
        page.fill("#opp-tag-q", "sci")
        page.wait_for_timeout(150)
        first = page.locator("[data-opp-pick]").first
        assert "#ScienceAndHealth" in first.inner_text()
        first.click()
        page.wait_for_timeout(150)
        assert page.locator("#opp-continue").is_enabled()
        page.locator("[data-opp-save-draft]").click()
        page.wait_for_timeout(150)
        page.locator("[data-opp-back]").click()
        page.wait_for_timeout(100)
        page.locator("[data-opp-cancel]").click()
        page.wait_for_timeout(150)
        assert "Drafts" in page.locator(".opp-drafts-btn").inner_text()
        page.locator("[data-opp-drafts]").click()
        page.wait_for_timeout(150)
        assert "What I tell Form 4" in page.locator(".qa-draft-row").inner_text()
        page.locator("[data-opp-resume]").click()
        page.wait_for_timeout(150)
        page.locator("[data-opp-story-preview]").click()
        page.wait_for_timeout(200)
        assert page.locator("#qa-dlg-title").inner_text() == "Preview"
        assert page.locator(".opp-preview .qa-more").count() == 0
        assert page.locator(".opp-preview .story-follow").count() == 0
        page.screenshot(path=str(SHOT / "1440-story-preview.png"), full_page=False)
        page.locator("[data-opp-publish]").click()
        page.wait_for_timeout(250)
        posted = page.locator(".opp-story").first
        assert "What I tell Form 4" in posted.locator(".story-body").inner_text()
        assert posted.locator(".story-follow").count() == 0

        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(200)
        mobile = page.locator('.opp-story[data-id="f3"]')
        mobile.scroll_into_view_if_needed()
        assert mobile.locator(".qa-see").count() == 1
        page.screenshot(path=str(SHOT / "390-story-card.png"), full_page=False)

        browser.close()

    if errors:
        raise SystemExit("page errors: " + " | ".join(errors))
    print("story verify ok")


if __name__ == "__main__":
    main()
