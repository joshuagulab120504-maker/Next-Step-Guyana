"""Smoke test for the merged personality + pathway wizard.
Clicks through the whole "Build my pathway" flow (level, region, 12 RIASEC
ratings, optional tiebreak, curiosity ranking, clarity, goal, priority,
blocker, pressure, conditions, recover, extra, concerns, advice) and checks
that it lands on a real archetype with no console errors.
"""

from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8080/app.html"


def boot(page):
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(200)
    page.evaluate(
        """() => {
          document.documentElement.classList.remove('splash-on');
          var el = document.getElementById('app-splash');
          if (el && el.parentNode) el.parentNode.removeChild(el);
          applyPrototypeRole('visitor');
          render();
        }"""
    )
    page.wait_for_timeout(200)


def click_next(page):
    page.locator('[data-pw-next]').click()
    page.wait_for_timeout(50)


def answer_ratings(page):
    # Answer whichever rating screen is showing (3 items x 4 buttons) with
    # "love it" (4) for the first two items and "hate it" (1) for the third,
    # so the profile is not flat and a tiebreak is likely to appear at least
    # once across the run.
    for screen in range(4):
        rows = page.locator('.pw-rate-item')
        assert rows.count() == 3, f"expected 3 rate items, got {rows.count()}"
        for i in range(3):
            val = 4 if i < 2 else 1
            page.locator('.pw-rate-item').nth(i).locator(
                f'[data-pw-val="{val}"]'
            ).click()
        assert page.locator('[data-pw-next]').is_enabled()
        click_next(page)


def maybe_answer_tiebreak(page):
    if page.locator('.pw-rate-item').count() == 4:
        for i in range(4):
            page.locator('.pw-rate-item').nth(i).locator('[data-pw-val="4"]').click()
        assert page.locator('[data-pw-next]').is_enabled()
        click_next(page)


def main():
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless=True,
        )
        page = browser.new_page(viewport={"width": 390, "height": 844})
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        boot(page)

        page.evaluate("() => { go({t:'setup', id:'0'}); }")
        page.wait_for_timeout(100)

        # 1. level
        assert "What level are you at" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-level="f4"]').click()
        click_next(page)

        # 2. region
        assert "Which region are you in" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-region="r4"]').click()
        click_next(page)

        # 3-6. the 12 RIASEC ratings
        answer_ratings(page)

        # optional tiebreak
        maybe_answer_tiebreak(page)

        # curiosity ranking: tap three fields in order
        body_text = page.locator('#sheet-body').inner_text()
        assert "Which fields interest you most" in body_text
        page.locator('[data-pw-field="tech"]').click()
        page.locator('[data-pw-field="science"]').click()
        page.locator('[data-pw-field="business"]').click()
        badge = page.locator('[data-pw-field="tech"] .pw-rank-badge')
        assert badge.inner_text() == "1", badge.inner_text()
        click_next(page)

        # clarity (pick "no idea yet" so the result lands on the My Pathway
        # profile page (renderPwStudent), not the field detail sub-page)
        assert "How clear are you" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-clarity="none"]').click()
        click_next(page)

        # goal / priority / blocker
        assert "life after school" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-single="goal"][data-pw-val="uni"]').click()
        click_next(page)
        assert "next twelve months" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-single="priority"][data-pw-val="grades"]').click()
        click_next(page)
        assert "most in your way" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-single="blocker"][data-pw-val="cost"]').click()
        click_next(page)

        # pressure / conditions / recover
        assert "not going to plan" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-single="pressure"][data-pw-val="charge"]').click()
        click_next(page)
        assert "best work" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-single="conditions"][data-pw-val="fast"]').click()
        click_next(page)
        assert "helps you recover" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-single="recover"][data-pw-val="both"]').click()
        click_next(page)

        # extra (multi, allow skipping) -> pick one
        assert "outside of class" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-multi="extra"][data-pw-val="sports"]').click()
        click_next(page)

        # concerns (multi, max 3)
        assert "concerns you most" in page.locator('#sheet-body').inner_text()
        page.locator('[data-pw-multi="concerns"][data-pw-val="afford"]').click()
        page.locator('[data-pw-multi="concerns"][data-pw-val="exists"]').click()
        page.locator('[data-pw-multi="concerns"][data-pw-val="early"]').click()
        # a 4th pick should be rejected with a toast, not added
        page.locator('[data-pw-multi="concerns"][data-pw-val="family"]').click()
        assert not page.locator('[data-pw-multi="concerns"][data-pw-val="family"]').get_attribute("class").__contains__("on")
        click_next(page)

        # advice (last question)
        assert "talk to about decisions" in page.locator('#sheet-body').inner_text()
        assert page.locator('[data-pw-next]').inner_text() == "Create my pathway"
        page.locator('[data-pw-single="advice"][data-pw-val="mentor"]').click()
        assert page.locator('[data-pw-next]').inner_text() == "Create my pathway"
        page.locator('[data-pw-next]').click()
        page.wait_for_timeout(300)

        archetype = page.evaluate("() => S.archetype")
        goal = page.evaluate("() => S.goal")
        onboarded = page.evaluate("() => S.onboarded")
        assert onboarded is True
        assert goal == "uni", goal
        assert archetype, "expected a non-empty archetype after finishing the quiz"
        print("Resolved archetype:", archetype)

        # the pathway page should now show the archetype chip + description
        page.evaluate("() => { closeSheet(); S.view='pathway'; render(); }")
        page.wait_for_timeout(150)
        pw_text = page.locator('.pw-head').inner_text()
        assert archetype in pw_text, pw_text

        assert not errors, errors
        browser.close()
    print("verify-pw-quiz ok")


if __name__ == "__main__":
    main()
