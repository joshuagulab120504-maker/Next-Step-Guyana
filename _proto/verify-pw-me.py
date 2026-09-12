"""Walk post-quiz My Pathway + My profile at 390 and 1280."""
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8080/app.html"
OUT = "_proto/verify-shots"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def boot(page):
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(180)
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
          S.pw.lineStage = '';
          S.pw.considering = [0];
          S.pw.tab = 'me';
          S.pw.sub = '';
          setView('pathway');
        }"""
    )
    page.wait_for_timeout(200)


def overflow(page):
    return page.evaluate(
        "() => document.documentElement.scrollWidth - document.documentElement.clientWidth"
    )


def track_align(page):
    return page.evaluate(
        """() => {
          var stages = document.querySelectorAll('.mp-stage');
          var bad = [];
          for (var i = 0; i < stages.length; i++) {
            var mark = stages[i].querySelector('.mp-mark');
            var cs = getComputedStyle(stages[i], '::after');
            if (!mark) continue;
            var mr = mark.getBoundingClientRect();
            var sr = stages[i].getBoundingClientRect();
            var starCx = mr.left + mr.width / 2;
            var left = parseFloat(cs.left);
            var width = parseFloat(cs.width);
            var trackCx = sr.left + left + width / 2;
            if (Math.abs(starCx - trackCx) > 1.5) {
              bad.push({i: i, star: starCx, track: trackCx, d: starCx - trackCx});
            }
          }
          return bad;
        }"""
    )


def shot(page, name):
    page.screenshot(path=f"{OUT}/{name}.png", full_page=False)


def walk(page, w, h, tag):
    page.set_viewport_size({"width": w, "height": h})
    page.wait_for_timeout(150)
    page.evaluate(
        """() => {
          S.pw.sub = '';
          S.pw.tab = 'me';
          S.pw.name = 'Aaliyah Persaud';
          S.pw.archetype = 'The Steward';
          S.archetype = 'The Steward';
          S.pw.goal = 'uni';
          S.pw.fields = ['trade'];
          S.pw.field = 'trade';
          S.pw.region = 'r4';
          S.pw.level = 'f4';
          S.pw.lineStage = 'form4';
          S.pw.open = 'form4';
          S.pw.quote = '';
          S.pw.quoteWho = '';
          S.pw.lineGoals = null;
          S.pw.mpAch = [];
          S.pw.mpAct = [];
          S.pw.mpSubj = { csec: [], cape: [], cvq: [] };
          S.pw.mpUi = {};
          S.pw.considering = [0];
          render();
        }"""
    )
    page.wait_for_timeout(150)

    body = page.locator(".mp-col").inner_text()
    assert "Aaliyah Persaud" in body
    assert "AP" in page.locator(".mp-av").inner_text()
    assert "The Steward" in body
    assert "Trade and TVET" in body
    assert "Form 4 ·" in body
    assert "My line" in body
    assert "Careers I am considering" in body
    assert "Accountant" in body
    assert "Working toward" not in body
    assert "Leaving record" not in body
    assert overflow(page) <= 0, overflow(page)
    closed_h = page.evaluate(
        "() => document.getElementById('mp-panel-form1').getBoundingClientRect().height"
    )
    assert closed_h < 2, closed_h

    tokens = page.evaluate(
        """() => getComputedStyle(document.querySelector('.mp-card')).getPropertyValue('--mp-deep').trim()"""
    )
    assert tokens.lower() == "#1d6640", tokens

    align = track_align(page)
    assert align == [], align

    shot(page, f"mp-{tag}-pathway")

    # open every stage
    keys = page.evaluate(
        """() => Array.from(document.querySelectorAll('[data-mp="stage"]')).map(b => b.getAttribute('data-mp-sk'))"""
    )
    assert keys == ["form1", "form2", "form3", "form4", "form5", "sixth", "tertiary"], keys
    for k in keys:
        page.locator(f'[data-mp="stage"][data-mp-sk="{k}"]').click()
        page.wait_for_timeout(80)
        assert page.locator(f"#mp-panel-{k}").get_attribute("inert") is None
        closed = page.evaluate(
            """k => Array.from(document.querySelectorAll('.mp-panel')).filter(p => p.id !== 'mp-panel-'+k).every(p => p.hasAttribute('inert'))""",
            k,
        )
        assert closed
        if k == "form5":
            assert "leaning here, from your quiz" in page.locator("#mp-panel-form5").inner_text()
            assert "Sixth Form, for CAPE" in page.locator("#mp-panel-form5").inner_text()
            assert "Into work" in page.locator("#mp-panel-form5").inner_text()

    # goals on form4
    page.locator('[data-mp="stage"][data-mp-sk="form4"]').click()
    page.wait_for_timeout(60)
    page.locator("#mp-goal-form4").fill("Finish my SBA outline")
    page.locator('[data-mp="goal-add"][data-mp-sk="form4"]').click()
    page.wait_for_timeout(60)
    assert "Finish my SBA outline" in page.locator(".mp-col").inner_text()
    assert page.locator(".mp-goalpill").inner_text() == "1"
    page.locator('[data-mp="goal-tick"]').first.click()
    page.wait_for_timeout(40)
    assert page.locator(".mp-goalpill").count() == 0
    page.locator('[data-mp="goal-del"]').first.click()
    page.wait_for_timeout(40)
    assert "Finish my SBA outline" not in page.locator(".mp-col").inner_text()

    # move up
    page.locator('[data-mp="move-up"]').click()
    page.wait_for_timeout(80)
    assert "Form 5 ·" in page.locator(".mp-meta").inner_text()
    assert page.locator('[data-mp-sk="form5"].mp-stage-btn').get_attribute("aria-expanded") == "true"

    # quote
    page.locator('[data-mp="quote-edit"]').click()
    page.wait_for_timeout(40)
    page.locator("#mp-quote-t").fill("Walk good.")
    page.locator("#mp-quote-who").fill("Granny")
    page.locator('[data-mp="quote-save"]').click()
    page.wait_for_timeout(40)
    assert "Walk good." in page.locator(".mp-quote").inner_text()
    assert "Granny" in page.locator(".mp-quote").inner_text()

    # profile
    page.locator('[data-pw-sub="edit"]').click()
    page.wait_for_timeout(120)
    assert "About you" in page.locator(".mp-col").inner_text()
    assert "My subjects" in page.locator(".mp-col").inner_text()
    assert "Leaving record" not in page.locator(".mp-col").inner_text()
    assert overflow(page) <= 0, overflow(page)
    shot(page, f"mp-{tag}-profile")

    page.locator("#mp-combo-cape").fill("biology")
    page.wait_for_timeout(80)
    opts = page.locator('[data-mp="subj-pick"]').all_inner_texts()
    assert any("Unit 1" in o for o in opts)
    assert any("Unit 2" in o for o in opts)
    page.locator('[data-mp="subj-pick"]', has_text="Unit 1").first.click()
    page.wait_for_timeout(60)
    page.locator("#mp-combo-cape").fill("biology")
    page.wait_for_timeout(80)
    opts2 = page.locator('[data-mp="subj-pick"]').all_inner_texts()
    assert any("Unit 2" in o for o in opts2)
    assert not any("Unit 1" in o for o in opts2)
    page.locator('[data-mp="subj-pick"]', has_text="Unit 2").first.click()
    page.wait_for_timeout(60)
    assert page.locator(".mp-srow").count() == 2

    page.locator('[data-mp="entry-add"][data-mp-kind="ach"]').click()
    page.wait_for_timeout(40)
    page.locator("#mp-ach-what").fill("Best speaker")
    page.locator("#mp-ach-where").fill("St. Joseph High School")
    page.locator("#mp-ach-month").select_option("6")
    page.locator("#mp-ach-year").select_option("2025")
    page.locator("#mp-ach-note").fill("Inter-house debate, third form.")
    page.locator('[data-mp="ach-save"]').click()
    page.wait_for_timeout(60)
    assert "Best speaker" in page.locator(".mp-col").inner_text()
    assert "St. Joseph High School · June 2025" in page.locator(".mp-col").inner_text()
    page.locator('[data-mp="entry-edit"][data-mp-kind="ach"]').click()
    page.wait_for_timeout(40)
    page.locator('[data-mp="ach-del"]').click()
    page.wait_for_timeout(40)
    page.locator('[data-mp="ach-kill"]').click()
    page.wait_for_timeout(40)
    assert "Best speaker" not in page.locator(".mp-col").inner_text()

    # archetype follow
    page.evaluate(
        """() => {
          S.pw.archetype = 'The Advocate';
          S.archetype = 'The Advocate';
          render();
        }"""
    )
    page.wait_for_timeout(80)
    deep = page.evaluate(
        """() => getComputedStyle(document.querySelector('.mp-card')).getPropertyValue('--mp-deep').trim()"""
    )
    assert deep.lower() == "#6437a0", deep

    page.locator('[data-pw-sub=""]').first.click()
    page.wait_for_timeout(80)
    assert page.locator(".mp-line").count() == 1
    assert "is-mp" in (page.locator(".page-pw").get_attribute("class") or "")
    border = page.evaluate(
        "() => getComputedStyle(document.querySelector('.mp-card')).borderLeftWidth"
    )
    assert border == "1px", border

    # In-section tab: profile then My pathway
    page.locator('[data-pw-sub="edit"]').click()
    page.wait_for_timeout(80)
    assert page.locator(".pw-backrow").count() >= 1
    page.locator('.pw-subtabs [data-pw-tab="me"]').click()
    page.wait_for_timeout(80)
    assert page.locator(".mp-line").count() == 1

    # Explore still intact, then the My Pathway menu returns to the line
    page.locator('.pw-subtabs [data-pw-tab="explore"]').click()
    page.wait_for_timeout(100)
    assert "Browse by field" in page.locator(".page-pw").inner_text()
    assert page.locator(".ex-fgrid").count() == 1
    assert "is-mp" not in (page.locator(".page-pw").get_attribute("class") or "")
    assert overflow(page) <= 0

    def go_home():
        if w >= 980:
            rail = page.evaluate(
                "() => getComputedStyle(document.querySelector('.rail.left')).display"
            )
            assert rail == "flex", rail
            assert page.locator("#nav-pathway").get_attribute("aria-current") == "page"
            page.locator("#nav-pathway").click()
        else:
            assert page.locator("#dock-pathway").get_attribute("aria-current") == "page"
            page.locator("#dock-pathway").click()
        page.wait_for_timeout(120)

    go_home()
    assert page.locator(".mp-line").count() == 1
    assert page.locator(".pw-fgrid").count() == 0
    assert page.locator('.pw-subtabs [data-pw-tab="me"]').get_attribute("aria-selected") == "true"

    # Field drill-in, then the same menu
    page.locator('.pw-subtabs [data-pw-tab="explore"]').click()
    page.wait_for_timeout(80)
    page.locator("[data-ex-field]").first.click()
    page.wait_for_timeout(80)
    assert page.locator(".ex-hero").count() == 1
    go_home()
    assert page.locator(".mp-line").count() == 1
    assert page.locator(".ex-hero").count() == 0

    # My profile, then the same menu
    page.locator('[data-pw-sub="edit"]').click()
    page.wait_for_timeout(80)
    assert "About you" in page.locator(".page-pw").inner_text()
    go_home()
    assert page.locator(".mp-line").count() == 1
    assert page.locator(".mp-sec").count() == 0


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, headless=True)
        page = browser.new_page(viewport={"width": 390, "height": 844})
        boot(page)
        walk(page, 390, 844, "390")
        walk(page, 1280, 900, "1280")
        walk(page, 320, 720, "320")
        walk(page, 1600, 900, "1600")
        browser.close()
    print("verify-pw-me ok")


if __name__ == "__main__":
    main()
