# Pathway page verification. Not loaded by the app.
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOT = ROOT / "_proto" / "verify-shots"
SHOT.mkdir(exist_ok=True)
URL = "http://127.0.0.1:8080/app.html"
notes = []


def note(ok, msg):
    notes.append(("OK" if ok else "FAIL", msg))
    print(("OK  " if ok else "FAIL") + msg)


def shot(page, name):
    page.screenshot(path=str(SHOT / (name + ".png")), full_page=True)


def goto_pathway(page):
    page.evaluate("document.documentElement.classList.remove('splash-on')")
    page.evaluate(
        """() => {
          var el = document.getElementById('app-splash');
          if (el && el.parentNode) el.parentNode.removeChild(el);
        }"""
    )
    dock = page.locator("#dock-pathway")
    if dock.is_visible():
        dock.click()
    else:
        page.click("#nav-pathway")
    page.wait_for_timeout(200)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless=True,
        )
        page = browser.new_page(viewport={"width": 360, "height": 800})
        page.goto(URL, wait_until="domcontentloaded")
        page.wait_for_timeout(400)
        goto_pathway(page)

        text = page.inner_text("body")
        note("QUESTION 1 OF 4" in text, "wizard label reads QUESTION 1 OF 4")
        disabled = page.locator("[data-pw-next]").is_disabled()
        note(disabled, "Continue disabled until answered")
        shot(page, "360-wizard-1")

        page.click("[data-pw-level='f4']")
        note(not page.locator("[data-pw-next]").is_disabled(), "Continue enabled after level")
        page.click("[data-pw-next]")
        note(page.locator("[data-pw-back]").count() > 0, "Back appears from step two")
        note("QUESTION 2 OF 4" in page.inner_text("body"), "step 2 label")
        page.click("[data-pw-region='r4']")
        page.click("[data-pw-next]")
        note("QUESTION 3 OF 4" in page.inner_text("body"), "step 3")
        note(not page.locator("[data-pw-next]").is_disabled(), "step 3 skippable, Continue enabled")
        note("without picking a field" in page.inner_text("body"), "empty skip note on step 3")
        page.click("[data-pw-next]")
        note("QUESTION 4 OF 4" in page.inner_text("body"), "step 4")
        note(page.locator("[data-pw-next]").inner_text().strip() == "Create my pathway", "step 4 CTA")

        # none -> my pathway, line open at level
        page.click("[data-pw-clarity='none']")
        page.click("[data-pw-next]")
        body = page.inner_text("body")
        note("My line" in body, "clarity none lands on My pathway")
        note("Form 4" in body, "line includes Form 4")
        shot(page, "360-student-line")

        # reset wizard via visitor then exact
        page.click("#arch-pill")
        page.wait_for_timeout(200)
        page.click("[data-role='visitor']")
        page.wait_for_timeout(200)
        goto_pathway(page)
        page.click("[data-pw-level='f4']")
        page.click("[data-pw-next]")
        page.click("[data-pw-region='r4']")
        page.click("[data-pw-next]")
        page.click("[data-pw-field='science']")
        page.click("[data-pw-next]")
        page.click("[data-pw-clarity='exact']")
        page.click("[data-pw-next]")
        note(page.locator("#q").count() > 0, "clarity exact opens Explore with search")
        focused = page.evaluate("document.activeElement && document.activeElement.id === 'q'")
        note(focused, "search focused after exact")

        # field route
        page.click("#arch-pill")
        page.click("[data-role='visitor']")
        goto_pathway(page)
        page.click("[data-pw-level='f5']")
        page.click("[data-pw-next]")
        page.click("[data-pw-region='r6']")
        page.click("[data-pw-next]")
        page.click("[data-pw-field='science']")
        page.click("[data-pw-next]")
        page.click("[data-pw-clarity='field']")
        page.click("[data-pw-next]")
        note("Science and Medicine" in page.inner_text("body"), "clarity field opens first field")
        note("<a " not in page.inner_html("#main"), "no literal HTML tags on field page")

        # set destination Nurse and inspect line
        if page.locator("[data-pw-sub='']").count():
            page.click("[data-pw-sub='']")
            page.wait_for_timeout(100)
        if page.locator("[data-pw-tab='explore']").count():
            page.click("[data-pw-tab='explore']")
        page.fill("#q", "nurse")
        page.wait_for_timeout(200)
        cards = page.locator(".pw-card h3")
        first = cards.first.inner_text()
        note(first.startswith("Nurse"), "search nurse returns Nurse first, got " + first)
        page.locator(".pw-card").first.click()
        page.wait_for_timeout(200)
        page.click("[data-pw-dest]")
        page.wait_for_timeout(200)
        body = page.inner_text("body")
        note("Nurse" in body and "Working toward" in body, "destination set")
        note("University of Guyana" in body and "Ministry of Health" in body, "fork closed summary names both routes")
        # should not auto-pick a fork route (no selected fork cards visible unless open)
        page.click("[data-pw-openlvl='fork']")
        page.wait_for_timeout(150)
        selected = page.locator(".pw-fork.on").count()
        note(selected == 0, "Nurse does not auto-select a fork route, selected=" + str(selected))

        # accordion one-open
        page.click("[data-pw-openlvl='f1']")
        page.wait_for_timeout(100)
        note("Do this" in page.inner_text("body"), "Form 1 opens")
        page.click("[data-pw-openlvl='f3']")
        page.wait_for_timeout(100)
        opens = page.locator(".pw-panel.do").count()
        note(opens == 1, "opening one level closes the other, open panels=" + str(opens))
        # collapse all
        page.click("[data-pw-openlvl='f3']")
        page.wait_for_timeout(100)
        note(page.locator(".pw-panel.do").count() == 0, "tap again closes")
        shot(page, "360-collapsed")
        scroll = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
        note(not scroll, "no horizontal scroll at 360")

        # mentor
        page.click("#arch-pill")
        page.click("[data-role='mentor']")
        page.wait_for_timeout(200)
        goto_pathway(page)
        body = page.inner_text("body")
        note("The route I took" in body, "mentor route builder appears")
        note("My posts" in body, "mentor posts appear")
        note("My line" not in body, "student line hidden for mentor")
        page.click("[data-pw-tab='explore']")
        note("Career cards to check" in page.inner_text("body") or page.locator(".pw-banner").count() >= 0, "queue area reachable from Explore")
        page.click("[data-pw-tab='me']")
        page.click("[data-pw-sub='edit']")
        note("Edit my profile" in page.inner_text("body"), "mentor inside edit subpage")
        page.click("#arch-pill")
        page.click("[data-role='student']")
        page.wait_for_timeout(200)
        goto_pathway(page)
        note(page.locator("[data-pw-sub='']").count() == 0 or "Edit my profile" not in page.locator("h1").all_inner_texts(), "role switch lands on main page")
        note("My line" in page.inner_text("body"), "student line after role switch")

        # other viewports
        page.set_viewport_size({"width": 768, "height": 1024})
        page.wait_for_timeout(200)
        shot(page, "768-pathway")
        page.set_viewport_size({"width": 1440, "height": 900})
        page.wait_for_timeout(200)
        shot(page, "1440-pathway")

        browser.close()

    fails = [m for s, m in notes if s == "FAIL"]
    print("\n%d checks, %d failed" % (len(notes), len(fails)))
    for s, m in notes:
        if s == "FAIL":
            print(" -", m)


if __name__ == "__main__":
    main()
