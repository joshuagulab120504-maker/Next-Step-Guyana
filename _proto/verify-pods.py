"""Walk Community pods and Feed shoutouts at 390 and 1280."""
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
          applyPrototypeRole(role);
          if (typeof ensurePod === 'function') ensurePod();
          S.pod.lastPostAt = 0;
          setView('community');
        }""",
        role,
    )
    page.wait_for_timeout(140)


def overflow(page):
    return page.evaluate(
        "() => document.documentElement.scrollWidth - document.documentElement.clientWidth"
    )


def shot(page, name):
    page.screenshot(path=f"{OUT}/{name}.png", full_page=False)


def reset_rate(page):
    page.evaluate("() => { if (S.pod) S.pod.lastPostAt = 0; }")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        boot(page)
        assert page.locator(".pod-grid").count() >= 1
        assert page.locator('[data-pod-tab="pods"][aria-selected="true"]').count() == 1
        assert "Propose a pod" not in page.inner_text("body")
        assert page.locator('[data-pod-open="life-csec"]').count() == 1
        assert page.locator('[data-pod-open="creative-media"]').count() == 0
        assert "2 of 4 mentors" in page.inner_text("body")
        assert overflow(page) <= 0
        shot(page, "pod-1280-home")

        page.locator('[data-pod-tab="people"]').click()
        page.wait_for_timeout(80)
        assert page.locator(".pcard").count() >= 5
        assert "Answers in" in page.inner_text("body")
        page.locator('[data-pod-filters]').click()
        page.wait_for_timeout(60)
        assert page.locator("#pod-filter-panel").count() == 1
        page.locator('[data-comm-role="mentors"]').click()
        page.wait_for_timeout(40)
        page.locator('[data-pod-filters-done]').click()
        page.wait_for_timeout(40)
        assert "Mentors" in page.locator(".pod-applied").inner_text()
        page.fill("#q", "Raeka")
        page.wait_for_timeout(80)
        assert page.locator(".pcard").count() == 1
        assert overflow(page) <= 0
        shot(page, "pod-1280-people")

        page.locator('[data-pod-tab="pods"]').click()
        page.wait_for_timeout(60)
        page.locator('[data-pod-open="life-csec"]').click()
        page.wait_for_timeout(80)
        assert "life after csec" in page.inner_text("body").lower()
        assert "decision pod" in page.inner_text("body").lower()
        assert "Join pod" in page.inner_text("body")
        assert page.locator("#pod-ask-text").count() == 0
        assert overflow(page) <= 0
        shot(page, "pod-1280-room")

        reset_rate(page)
        page.locator('[data-pod-kind="question"]').click()
        page.fill("#pod-ask-text", "Can I ask here before I join the pod?")
        page.check("#pod-anon")
        page.locator('[data-pod-ask]').click()
        page.wait_for_timeout(80)
        joined = page.evaluate("() => !!S.pod.joined['life-csec']")
        assert joined
        assert "Leave pod" in page.inner_text("body")
        page.locator('[data-pod-toggle="life-csec"]').click()
        page.wait_for_timeout(60)
        assert page.evaluate("() => !S.pod.joined['life-csec']")

        page.locator('[data-pod-kind="thought"]').click()
        reset_rate(page)
        page.fill("#pod-ask-text", "I am turning over whether to sit one CAPE unit at evening class.")
        page.locator('[data-pod-ask]').click()
        page.wait_for_timeout(80)
        body = page.inner_text("body")
        assert "Waiting on an answer" not in body
        page.locator('[data-pod-tfilter="thoughts"]').click()
        page.wait_for_timeout(40)
        assert "Waiting" in page.locator(".pod-chips").inner_text()
        assert "Waiting on an answer" not in page.inner_text("body")

        page.evaluate(
            """() => {
              applyPrototypeRole('mentor');
              S.pod.lastPostAt = 0;
              S.view = 'community';
              S.pod.tab = 'pods';
              S.pod.sub = 'pod';
              S.pod.podId = 'life-csec';
              S.pod.threadFilter = 'all';
              render();
            }"""
        )
        page.wait_for_timeout(80)
        assert page.locator('[data-pod-share="pt-life-1"]').count() == 1
        page.locator('[data-pod-thread="pt-life-1"]').click()
        page.wait_for_timeout(80)
        assert "answered" in page.inner_text("body").lower()
        assert page.locator(".pod-banner").count() == 1
        assert page.locator(".pod-msg").count() >= 2
        assert overflow(page) <= 0
        shot(page, "pod-1280-thread")
        page.locator('[data-pod-share="pt-life-1"]').click()
        page.wait_for_timeout(80)
        assert page.evaluate("() => !!podThreadById('pt-life-1').shoutout")

        page.evaluate(
            """() => {
              S.pod.sub = 'pod';
              S.pod.podId = 'science-health';
              S.pod.threadId = '';
              S.pod.lastPostAt = 0;
              render();
            }"""
        )
        page.wait_for_timeout(80)
        page.locator('[data-pod-thread="pt-sci-2"]').click()
        page.wait_for_timeout(60)
        reset_rate(page)
        page.fill("#pod-reply", "Stay for med tech if you need Georgetown this year. Pharmacy waits on a licence.")
        page.locator('[data-pod-reply]').click()
        page.wait_for_timeout(80)
        page.locator("[data-pod-mark]").last.click()
        page.wait_for_timeout(60)
        assert page.evaluate("() => podThreadById('pt-sci-2').status") == "answered"
        page.evaluate(
            """() => {
              S.pod.sub = 'pod';
              S.pod.threadId = '';
              render();
            }"""
        )
        page.wait_for_timeout(60)
        assert page.locator('[data-pod-share="pt-sci-2"]').count() == 1
        page.locator('[data-pod-share="pt-sci-2"]').click()
        page.wait_for_timeout(80)
        assert page.evaluate("() => !!podThreadById('pt-sci-2').shoutout")

        page.evaluate("() => { setView('feed'); }")
        page.wait_for_timeout(100)
        assert page.locator(".qa-shout").count() >= 1
        assert "Science and health" in page.inner_text(".qa-podtag")
        assert "Open the thread" in page.inner_text("body")
        assert overflow(page) <= 0
        shot(page, "pod-1280-feed")
        page.locator("[data-pod-open-thread]").first.click()
        page.wait_for_timeout(80)
        assert page.locator(".pod-thread").count() == 1

        page.evaluate(
            """() => {
              applyPrototypeRole('mentor');
              S.view = 'community';
              S.pod.sub = 'thread';
              S.pod.podId = 'life-csec';
              S.pod.threadId = 'pt-life-1';
              S.pod.lastPostAt = 0;
              render();
            }"""
        )
        page.wait_for_timeout(80)
        page.locator('[data-pod-edit="pm-life-1b"]').click()
        page.wait_for_timeout(40)
        page.fill("#pod-edit-text", "Write both plans on one page. Mixed grades still leave a job plus one evening subject.")
        page.locator("[data-pod-edit-save]").click()
        page.wait_for_timeout(60)
        assert "edited" in page.inner_text(".pod-chat")
        assert overflow(page) <= 0
        shot(page, "pod-1280-edit")

        page.locator('[data-pod-del="pm-life-1b"]').click()
        page.wait_for_timeout(40)
        page.locator('[data-pod-del-sure="pm-life-1b"]').click()
        page.wait_for_timeout(60)
        assert page.evaluate("() => podThreadById('pt-life-1').status") == "waiting"
        assert "Waiting" in page.inner_text(".pod-banner")

        page.evaluate(
            """() => {
              applyPrototypeRole('student');
              S.pod.lastPostAt = 0;
              S.view = 'community';
              S.pod.sub = 'pod';
              S.pod.podId = 'life-csec';
              S.pod.threadId = '';
              render();
            }"""
        )
        page.wait_for_timeout(60)
        reset_rate(page)
        page.locator('[data-pod-kind="question"]').click()
        page.wait_for_timeout(40)
        page.fill("#pod-ask-text", "Only message in this thread, then it should go.")
        page.locator('[data-pod-ask]').click()
        page.wait_for_timeout(80)
        tid = page.evaluate("() => POD_THREADS[0].id")
        page.evaluate(
            """id => {
              S.pod.sub = 'thread';
              S.pod.threadId = id;
              render();
            }""",
            tid,
        )
        page.wait_for_timeout(60)
        oid = page.evaluate("() => podThreadById(S.pod.threadId).msgs[0].id")
        page.locator(f'[data-pod-del="{oid}"]').click()
        page.wait_for_timeout(40)
        page.locator(f'[data-pod-del-sure="{oid}"]').click()
        page.wait_for_timeout(80)
        assert page.locator(".pod-room").count() == 1
        assert page.evaluate("id => !podThreadById(id)", tid)

        page.evaluate(
            """() => {
              applyPrototypeRole('mentor');
              S.view = 'community';
              S.pod.tab = 'pods';
              S.pod.sub = '';
              render();
            }"""
        )
        page.wait_for_timeout(60)
        assert "Propose a pod" in page.inner_text("body")
        page.locator("[data-pod-propose]").click()
        page.wait_for_timeout(60)
        page.fill("#pod-pr-name", "Agriculture and food")
        page.fill("#pod-pr-blurb", "Farms, UG agriculture and what a first job looks like.")
        page.locator("[data-pod-propose-send]").click()
        page.wait_for_timeout(80)
        assert "Proposed by" in page.inner_text("body")
        assert overflow(page) <= 0
        shot(page, "pod-1280-propose")

        page.evaluate(
            """() => {
              applyPrototypeRole('student');
              S.view = 'community';
              S.pod.tab = 'pods';
              S.pod.sub = '';
              render();
            }"""
        )
        page.wait_for_timeout(60)
        assert "Propose a pod" not in page.inner_text("body")
        assert "Waiting on review" in page.inner_text("body")

        page.evaluate(
            """() => {
              applyPrototypeRole('admin');
              S.view = 'community';
              S.pod.tab = 'pods';
              S.pod.sub = '';
              render();
            }"""
        )
        page.wait_for_timeout(60)
        page.locator("[data-pod-approve]").first.click()
        page.wait_for_timeout(80)
        assert "Agriculture and food" in page.inner_text("body")
        assert "Opening soon" in page.inner_text("body")

        page.set_viewport_size({"width": 390, "height": 844})
        page.evaluate(
            """() => {
              applyPrototypeRole('student');
              setView('community');
            }"""
        )
        page.wait_for_timeout(80)
        assert overflow(page) <= 0
        shot(page, "pod-390-home")
        page.locator('[data-pod-tab="people"]').click()
        page.wait_for_timeout(60)
        assert overflow(page) <= 0
        shot(page, "pod-390-people")
        page.locator('[data-pod-tab="pods"]').click()
        page.locator('[data-pod-open="life-csec"]').click()
        page.wait_for_timeout(60)
        assert overflow(page) <= 0
        shot(page, "pod-390-room")
        page.locator(".pod-row").first.click()
        page.wait_for_timeout(60)
        assert overflow(page) <= 0
        shot(page, "pod-390-thread")
        page.evaluate("() => setView('feed')")
        page.wait_for_timeout(80)
        assert overflow(page) <= 0
        shot(page, "pod-390-feed")

        page.set_viewport_size({"width": 320, "height": 700})
        page.evaluate("() => { setView('community'); }")
        page.wait_for_timeout(60)
        assert overflow(page) <= 0
        page.locator('[data-pod-open="scholarships"]').click()
        page.wait_for_timeout(60)
        assert overflow(page) <= 0

        browser.close()
        print("pods ok")


if __name__ == "__main__":
    main()
