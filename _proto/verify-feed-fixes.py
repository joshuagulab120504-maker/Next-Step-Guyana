from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8080/app.html"


def boot(page, role="student"):
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(200)
    page.evaluate(
        """role => {
          document.documentElement.classList.remove('splash-on');
          var el = document.getElementById('app-splash');
          if (el && el.parentNode) el.parentNode.removeChild(el);
          applyPrototypeRole(role);
          render();
        }""",
        role,
    )
    page.wait_for_timeout(200)


def main():
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless=True,
        )
        page = browser.new_page(viewport={"width": 390, "height": 844})
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        boot(page, "visitor")

        vp = page.locator('meta[name="viewport"]').get_attribute("content") or ""
        assert "maximum-scale=1" in vp, vp
        assert "user-scalable=no" in vp, vp

        tap = page.evaluate(
            """() => {
              const b = document.querySelector('.qa-act, .opp-chip, button');
              const cs = getComputedStyle(b);
              const inp = document.querySelector('#top-q, input, textarea');
              return {
                tap: cs.webkitTapHighlightColor,
                touch: cs.touchAction,
                inputPx: getComputedStyle(inp).fontSize
              };
            }"""
        )
        assert "0px" in tap["tap"] or tap["tap"] in ("transparent", "rgba(0, 0, 0, 0)"), tap
        assert tap["inputPx"] == "16px", tap

        glance = page.locator(".opp-card .glance .g").first
        glance.scroll_into_view_if_needed()
        flex = glance.evaluate(
            """el => {
              const cs = getComputedStyle(el);
              const icon = el.querySelector('.gi');
              const dd = el.querySelector('dd');
              const ir = icon.getBoundingClientRect();
              const tr = dd.getBoundingClientRect();
              return {
                flex: cs.flexDirection,
                align: cs.alignItems,
                iconMid: ir.top + ir.height / 2,
                textMid: tr.top + tr.height / 2,
                sideBySide: Math.abs((ir.top + ir.height / 2) - (tr.top + tr.height / 2)) < 12
                  && ir.right <= tr.left + 2
              };
            }"""
        )
        assert flex["flex"] == "row", flex
        assert flex["sideBySide"], flex

        f3 = page.locator('.opp-story[data-id="f3"]')
        f3.scroll_into_view_if_needed()
        page.wait_for_timeout(100)
        acts = f3.locator(".qa-act span")
        assert acts.count() >= 3
        assert all(acts.nth(i).is_visible() for i in range(min(3, acts.count())))
        labels = [acts.nth(i).inner_text() for i in range(acts.count())]
        assert any(t.startswith("Inspired") for t in labels), labels
        assert f3.locator(".opp-primary").count() == 1

        trunc = f3.locator(".author-hit.name-hit .ident-text").evaluate(
            "el => getComputedStyle(el).textOverflow"
        )
        assert trunc == "ellipsis", trunc
        follow_ok = f3.evaluate(
            """el => {
              const name = el.querySelector('.author-hit.name-hit');
              const tools = el.querySelector('.story-tools, .story-follow');
              if (!name || !tools) return true;
              const nr = name.getBoundingClientRect();
              const tr = tools.getBoundingClientRect();
              return nr.right <= tr.left + 1 && nr.bottom - tr.bottom < 40;
            }"""
        )
        assert follow_ok

        f3.locator(".qa-act.is-inspired").click()
        page.wait_for_timeout(150)
        assert f3.locator(".qa-act.is-inspired").get_attribute("aria-pressed") == "true"
        assert page.locator("#qa-layer:not([hidden])").count() == 0, "Inspired must not open signup"
        assert page.locator("#sheet:not([hidden])").count() == 0 or (
            "pathway" not in (page.locator("#sheet-title").inner_text() or "").lower()
        )

        assert f3.locator("button.author-hit.name-hit").count() == 1
        f3.locator("button.author-hit.name-hit").click()
        page.wait_for_timeout(200)
        assert page.locator(".page-person, #sheet-title").count() >= 1
        title = page.locator("#sheet-title").inner_text()
        assert "Raeka" in title or page.locator(".page-person").count() == 1
        page.locator("#sheet-close").click()
        page.wait_for_timeout(150)

        f3.locator('[data-open="kind"][data-id="story"]').click()
        page.wait_for_timeout(200)
        assert page.locator(".page-list h1").inner_text() == "Stories"
        assert "Trending" in page.locator(".page-list").inner_text()
        assert "Latest" in page.locator(".page-list").inner_text()
        page.locator("#dock-feed").click()
        page.wait_for_timeout(150)

        f3 = page.locator('.opp-story[data-id="f3"]')
        f3.scroll_into_view_if_needed()
        f3.locator(".opp-chip").click()
        page.wait_for_timeout(200)
        assert "#" in page.locator(".page-list h1").inner_text()
        assert "Trending" in page.locator(".page-list").inner_text()
        assert "Latest" in page.locator(".page-list").inner_text()

        page.locator("#dock-feed").click()
        page.wait_for_timeout(150)
        opp = page.locator(".opp-card").first
        opp.scroll_into_view_if_needed()
        opp.locator('[data-open="kind"][data-id="opportunity"]').click()
        page.wait_for_timeout(200)
        assert page.locator(".page-list h1").inner_text() == "Opportunities"
        assert "Coming up soonest" in page.locator(".page-list").inner_text()

        page.set_viewport_size({"width": 1440, "height": 900})
        page.locator("#dock-feed").click()
        page.wait_for_timeout(200)
        card = page.locator('.opp-story[data-id="f3"]')
        card.scroll_into_view_if_needed()
        assert card.locator(".qa-act span").first.is_visible()
        assert card.locator(".opp-primary").count() == 1
        qa = page.locator(".qa-card").first
        qa.scroll_into_view_if_needed()
        assert qa.locator(".opp-primary").count() == 1
        assert qa.locator(".qa-ask-name button.author-hit").count() == 0
        reply_w = qa.locator(".qa-reply .ident-text").first.evaluate(
            "el => Math.round(el.getBoundingClientRect().width)"
        )
        assert reply_w > 40, reply_w
        assert qa.locator(".qa-reply .ident-text").first.inner_text().strip()
        assert qa.locator(".qa-act span").first.is_visible()

        glance = page.locator(".opp-card .glance .g").first
        if glance.count():
            flex = glance.evaluate("el => getComputedStyle(el).flexDirection")
            assert flex == "row", flex

        boot(page, "student")
        page.evaluate("qaOpenDialog('ask', { text: '' })")
        page.wait_for_timeout(100)
        box = page.locator("#qa-dlg-text")
        box.click()
        box.type("hello", delay=30)
        assert box.input_value() == "hello", box.input_value()
        outline = box.evaluate(
            """el => {
              el.focus();
              const cs = getComputedStyle(el);
              return { outline: cs.outlineStyle, outlineW: cs.outlineWidth, color: cs.outlineColor };
            }"""
        )
        assert outline["outline"] in ("none", "") or outline["outlineW"] == "0px", outline

        browser.close()
    if errors:
        raise SystemExit("page errors: " + " | ".join(errors))
    print("feed fixes ok")


if __name__ == "__main__":
    main()
