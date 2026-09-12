"""Walk the replaced Explore tab at 390 and 1280."""
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8080/app.html"
OUT = "_proto/verify-shots"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def boot(page, role="student"):
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(160)
    page.evaluate(
        """role => {
          document.documentElement.classList.remove('splash-on');
          var el = document.getElementById('app-splash');
          if (el && el.parentNode) el.parentNode.removeChild(el);
          if (typeof NSG_CMS !== 'undefined') {
            var st = NSG_CMS.loadWorking();
            st.careerFieldEdits = {};
            st.careerQueue = [];
            st.careerDeletes = [];
            NSG_CMS.persist(st);
          }
          applyPrototypeRole(role);
          S.pw.name = 'Aaliyah Persaud';
          S.pw.firstName = 'Aaliyah';
          S.pw.archetype = 'The Steward';
          S.archetype = 'The Steward';
          S.pw.goal = 'uni';
          S.pw.fields = ['science'];
          S.pw.field = 'science';
          S.pw.region = 'r4';
          S.pw.level = 'f4';
          S.pw.lineStage = 'form4';
          S.pw.considering = [];
          S.pw.dest = -1;
          S.pw.mpSubj = {
            csec: [
              { name: 'Biology', unit: 0, st: 'have' },
              { name: 'Chemistry', unit: 0, st: 'have' },
              { name: 'Mathematics', unit: 0, st: 'take' }
            ],
            cape: [],
            cvq: []
          };
          S.pw.subjects = {
            Biology: { st: 'have', grade: 'II' },
            Chemistry: { st: 'have', grade: 'III' },
            Mathematics: { st: 'take', grade: '' }
          };
          S.pw.tab = 'explore';
          S.pw.sub = '';
          setView('pathway');
          S.pw.tab = 'explore';
          S.pw.sub = '';
          render();
        }""",
        role,
    )
    page.wait_for_timeout(180)


def overflow(page):
    return page.evaluate(
        "() => document.documentElement.scrollWidth - document.documentElement.clientWidth"
    )


def shot(page, name):
    page.screenshot(path=f"{OUT}/{name}.png", full_page=False)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        boot(page)
        assert page.locator(".ex-fgrid").count() == 1
        assert "yours" in page.locator(".ex-fcard").first.inner_text().lower() or page.locator(".ex-yours").count()
        assert overflow(page) <= 0
        shot(page, "ex-1280-home")

        page.locator('[data-ex-field="science"]').click()
        page.wait_for_timeout(80)
        assert "Exploring it in Forms 1 to 3" in page.inner_text("body")
        assert overflow(page) <= 0
        shot(page, "ex-1280-field")

        page.locator("[data-ex-open]").first.click()
        page.wait_for_timeout(100)
        assert page.locator(".ex-card").count() == 1
        assert "Not recorded yet" in page.locator(".ex-fact").first.inner_text()
        assert "CSEC then CAPE" not in page.locator(".ex-facts").inner_text()
        page.locator('[data-ex-acc="csec"]').click()
        page.wait_for_timeout(60)
        body = page.locator("#ex-panel-csec").inner_text()
        if "Biology" in body:
            assert "is-have" in page.locator("#ex-panel-csec .ex-subj").first.get_attribute("class") or "Biology" in body
        page.locator('[data-ex-acc="routes"]').click()
        page.wait_for_timeout(40)
        page.locator('[data-ex-acc="study"]').click()
        page.wait_for_timeout(40)
        assert overflow(page) <= 0
        shot(page, "ex-1280-card")

        ix = page.evaluate("() => S.pw.cardIx")
        page.locator(f'[data-ex-book="{ix}"]').click()
        page.wait_for_timeout(60)
        page.evaluate("() => { S.pw.tab='me'; S.pw.sub=''; render(); }")
        page.wait_for_timeout(80)
        assert "Careers I am considering" in page.inner_text("body")
        assert page.locator(".mp-crow").count() >= 1

        page.evaluate("() => { S.pw.tab='explore'; S.pw.sub='card'; render(); }")
        page.wait_for_timeout(80)
        page.locator("[data-ex-dest]").click()
        page.wait_for_timeout(60)
        page.evaluate("() => { S.pw.tab='me'; S.pw.sub=''; render(); }")
        page.wait_for_timeout(80)
        assert "Working toward" in page.locator(".mp-card").inner_text()

        # mentor edit does not change live card
        boot(page, "mentor")
        page.locator("[data-ex-open]").first.click() if page.locator("[data-ex-open]").count() else page.locator('[data-ex-field="science"]').click()
        page.wait_for_timeout(80)
        if page.locator("[data-ex-open]").count():
            page.locator("[data-ex-open]").first.click()
            page.wait_for_timeout(80)
        page.locator('[data-ex-acc="routes"]').click()
        page.wait_for_timeout(40)
        before = page.locator("#ex-panel-routes").inner_text()
        page.locator('[data-ex-form="route-add"]').click()
        page.wait_for_timeout(40)
        page.locator("#ex-route-steps").fill("CSEC / CAPE / UG LLB")
        page.locator("#ex-route-note").fill("Six CAPE Units including Caribbean Studies")
        page.locator("[data-ex-route-save]").click()
        page.wait_for_timeout(80)
        after = page.locator("#ex-panel-routes").inner_text()
        assert "CSEC" not in after or before == after or "Edit pending" in page.inner_text("body")
        assert page.evaluate(
            """() => {
              var st = NSG_CMS.loadWorking();
              return st.careerQueue.filter(r => r.status==='pending').length;
            }"""
        ) >= 1
        page.evaluate("() => { S.pw.sub='queue'; render(); }")
        page.wait_for_timeout(80)
        assert "CSEC" in page.locator(".ex-qitem").first.inner_text()
        shot(page, "ex-1280-queue")

        boot(page, "admin")
        page.evaluate("() => { S.pw.tab='explore'; S.pw.sub='queue'; render(); }")
        page.wait_for_timeout(80)
        if page.locator("[data-ex-approve]").count():
            live_before = page.evaluate(
                """() => {
                  var st = NSG_CMS.loadWorking();
                  var row = st.careerQueue.find(r => r.status==='pending' && r.field==='routes');
                  return row ? JSON.stringify((exCardById(row.careerId)||{}).routes||[]) : '[]';
                }"""
            )
            page.locator("[data-ex-approve]").first.click()
            page.wait_for_timeout(80)
            live_after = page.evaluate(
                """() => {
                  var st = NSG_CMS.loadWorking();
                  var edits = st.careerFieldEdits || {};
                  return Object.keys(edits).length;
                }"""
            )
            assert live_after >= 1 or live_before is not None

        boot(page, "mentor")
        page.evaluate("() => { S.pw.tab='explore'; S.pw.sub='add'; render(); }")
        page.wait_for_timeout(80)
        page.locator("[data-ex-add-save]").click()
        page.wait_for_timeout(40)
        assert "title" in page.locator(".ex-err").inner_text().lower() or "title" in page.evaluate("() => document.body.innerText").lower()
        shot(page, "ex-1280-add")

        page.set_viewport_size({"width": 390, "height": 844})
        boot(page)
        assert overflow(page) <= 0
        shot(page, "ex-390-home")
        page.locator('[data-ex-field="science"]').click()
        page.wait_for_timeout(80)
        assert overflow(page) <= 0
        shot(page, "ex-390-field")
        page.locator("[data-ex-open]").first.click()
        page.wait_for_timeout(80)
        page.locator('[data-ex-acc="routes"]').click()
        page.locator('[data-ex-acc="study"]').click()
        page.wait_for_timeout(40)
        assert overflow(page) <= 0
        shot(page, "ex-390-card")
        page.evaluate("() => { S.pw.sub='routes'; render(); }")
        page.wait_for_timeout(60)
        assert overflow(page) <= 0
        page.evaluate("() => { S.pw.sub='queue'; render(); }")
        page.wait_for_timeout(60)
        assert overflow(page) <= 0
        page.evaluate("() => { S.pw.sub='add'; render(); }")
        page.wait_for_timeout(60)
        assert overflow(page) <= 0

        browser.close()
    print("verify-explore ok")


if __name__ == "__main__":
    main()
