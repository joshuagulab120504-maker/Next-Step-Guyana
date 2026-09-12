"""Pathway planner first-run: landing, instrument, reveal, part two, plan."""

from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8080/app.html"


def boot(page, role="visitor"):
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
    page.wait_for_timeout(150)


def click_text(page, text):
    page.locator(".plan-opt", has_text=text).first.click()
    page.wait_for_timeout(40)


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
        page.evaluate("() => { S.pw.firstName = 'Aaliyah'; setView('pathway'); }")
        page.wait_for_timeout(150)

        body = page.locator(".page-plan").inner_text()
        html = page.locator(".page-plan").inner_html()
        assert "undefined" not in html
        assert "null" not in html
        assert "NEXT STEP" in body and "GUYANA" in body
        assert "AALIYAH" in body
        assert body.count("AALIYAH") == 1
        assert "Let's start planning your next steps." in body
        assert "Before we begin, let's take 2 minutes" in body
        assert "Who you are" in body and "Where you want to be" in body
        assert "OUR ARCHETYPES" in body
        assert "The Steward" in body

        wordmark_color = page.evaluate(
            """() => getComputedStyle(document.querySelector('.plan-wordmark b')).color"""
        )
        assert "255" in wordmark_color, wordmark_color

        art_op = page.evaluate(
            """() => getComputedStyle(document.querySelector('.plan-hero-art')).opacity"""
        )
        assert abs(float(art_op) - 0.42) < 0.02, art_op
        assert page.locator(".plan-hero-art").get_attribute("aria-label")

        cards = page.locator(".plan-card")
        assert cards.count() == 8
        fronts = page.evaluate(
            """() => {
              var c = document.querySelectorAll('.plan-card');
              var n = 0;
              for (var i=0;i<c.length;i++) if (c[i].classList.contains('at-0')) n++;
              return n;
            }"""
        )
        assert fronts == 1
        hidden_false = page.evaluate(
            """() => document.querySelectorAll('.plan-card[aria-hidden="false"]').length"""
        )
        assert hidden_false == 1
        assert page.locator("[data-plan-pause]").count() == 0
        assert page.locator(".plan-deck-pause").count() == 0

        landing = page.evaluate(
            """() => {
              var hero = document.querySelector('.plan-hero').getBoundingClientRect();
              var h1 = document.querySelector('.plan-headline').getBoundingClientRect();
              var art = getComputedStyle(document.querySelector('.plan-hero-art'));
              var card = getComputedStyle(document.querySelector('.plan-landing'));
              return {
                h1Left: h1.left - hero.left,
                h1Bottom: hero.bottom - h1.bottom,
                radius: parseFloat(card.borderTopRightRadius) || 0,
                obj: art.objectPosition
              };
            }"""
        )
        assert landing["h1Left"] < 36, landing
        assert 16 <= landing["h1Bottom"] <= 48, landing
        assert landing["radius"] >= 12, landing
        assert landing["obj"].startswith("100%") or "right" in landing["obj"], landing

        # laptop: arrows sit on the left and right of the cards
        page.set_viewport_size({"width": 1280, "height": 800})
        page.wait_for_timeout(120)
        desk = page.evaluate(
            """() => {
              var deck = document.querySelector('.plan-deck').getBoundingClientRect();
              var prev = document.querySelector('[data-plan-deck="prev"]').getBoundingClientRect();
              var next = document.querySelector('[data-plan-deck="next"]').getBoundingClientRect();
              var vis = document.querySelectorAll('.plan-card.vis').length;
              return {
                vis: vis,
                prevLeft: prev.right <= deck.left + 2,
                nextRight: next.left >= deck.right - 2,
                align: Math.abs((prev.top + prev.height / 2) - (deck.top + deck.height / 2))
              };
            }"""
        )
        assert desk["vis"] == 3, desk
        assert desk["prevLeft"] and desk["nextRight"], desk
        assert desk["align"] < 24, desk
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(120)

        # deck step forward and back always has a front card
        page.locator('[data-plan-deck="next"]').click()
        page.wait_for_timeout(50)
        assert page.evaluate(
            "() => document.querySelectorAll('.plan-card.at-0').length"
        ) == 1
        page.locator('[data-plan-deck="prev"]').click()
        page.wait_for_timeout(50)
        assert page.evaluate(
            "() => document.querySelectorAll('.plan-card.at-0').length"
        ) == 1

        page.locator("[data-plan-start]").click()
        page.wait_for_timeout(80)
        q = page.locator(".plan-q").inner_text()
        assert "Sports day at school" in q
        assert page.locator(".hint").count() == 0
        assert page.locator(".plan-opt").count() == 4
        assert page.locator("[data-plan-next]").is_disabled()

        fs = page.evaluate(
            """() => getComputedStyle(document.querySelector('.plan-opt')).fontSize"""
        )
        assert fs == "16px", fs

        # Steward path
        click_text(page, "In the first-aid tent")
        page.locator("[data-plan-next]").click()
        click_text(page, "Take on making sure the homework")
        page.locator("[data-plan-next]").click()
        click_text(page, "Sitting with someone having a hard time")
        page.locator("[data-plan-next]").click()
        click_text(page, "Quietly look after it from now on")
        page.locator("[data-plan-next]").click()
        assert "big function, like a wedding or a birthday" in page.locator(".plan-q h2").inner_text()
        click_text(page, "Tracking what is running out")
        page.locator("[data-plan-next]").click()
        click_text(page, "A decision that changed")
        page.locator("[data-plan-next]").click()
        page.wait_for_timeout(80)

        reveal = page.locator(".plan-reveal").inner_text()
        assert "YOU ARE" in reveal
        assert "The Steward" in reveal
        assert "Because you said you would" in reveal
        assert "how you work, not what you should be" in reveal
        order = page.evaluate(
            """() => {
              var r = document.querySelector('.plan-reveal');
              var art = r.querySelector('.plan-reveal-art');
              var line = r.querySelector('.plan-reveal-line');
              var you = r.querySelector('.plan-youare');
              var name = r.querySelector('.plan-reveal-name');
              var nodes = [art, line, you, name];
              var pos = nodes.map(n => n.getBoundingClientRect().top);
              return pos[0] < pos[1] && pos[1] < pos[2] && pos[2] < pos[3];
            }"""
        )
        assert order

        page.locator("[data-plan-to-part2]").click()
        page.wait_for_timeout(60)
        intro = page.locator(".plan-intro").inner_text()
        assert "Now the practical part." in intro
        assert "You are The Steward. This is how you work, not what you should be." in intro
        page.locator("[data-plan-next]").click()

        assert "How clear are you right now?" in page.locator(".plan-q h2").inner_text()
        click_text(page, "I know the field, not the job")
        page.locator("[data-plan-next]").click()

        assert "Tap up to three, in order" in page.locator(".plan-q h2").inner_text()
        fields_before = page.evaluate(
            """() => Array.from(document.querySelectorAll('.plan-opt')).map(el => el.innerText.trim())"""
        )
        page.locator('[data-plan-val="tech"]').click()
        page.locator('[data-plan-val="science"]').click()
        page.locator('[data-plan-val="business"]').click()
        assert page.locator('[data-plan-val="tech"] .plan-rank').inner_text() == "1"
        page.locator("[data-plan-next]").click()

        click_text(page, "University, here or abroad")
        page.locator("[data-plan-next]").click()
        click_text(page, "Getting my grades up")
        page.locator("[data-plan-next]").click()
        assert "Pick up to three" in page.locator(".plan-q h2").inner_text()
        blockers = page.locator(".plan-q").inner_text()
        assert "Family expectations" in blockers
        assert "Needing to earn money soon" in blockers
        click_text(page, "Nobody to ask")
        click_text(page, "Cost or transport")
        page.locator("[data-plan-next]").click()
        click_text(page, "Honestly, nobody")
        page.locator("[data-plan-next]").click()
        page.wait_for_timeout(80)

        plan = page.locator(".plan-result").inner_text()
        assert "The Steward" in plan
        assert "Technology" in plan
        assert page.locator(".plan-step").count() == 3
        assert page.locator(".plan-step.care").count() == 1
        assert "mentor pod" in plan.lower()
        assert "undefined" not in page.locator(".plan-result").inner_html()

        # instrument invariants
        expo = page.evaluate("() => planExposure()")
        assert all(v == 3 for k, v in expo.items()), expo
        assert page.evaluate("() => !planPairSharesScreen('Healer','Advocate')")
        assert page.evaluate("() => !planPairSharesScreen('Artisan','Pioneer')")
        assert page.evaluate("() => !planPairSharesScreen('Explainer','Investigator')")

        same = page.evaluate(
            """() => {
              var a = planBlockOpts(PLAN_BLOCKS[0]).map(o => o.a).join(',');
              var b = planBlockOpts(PLAN_BLOCKS[0]).map(o => o.a).join(',');
              return a === b && a.split(',').length === 4;
            }"""
        )
        assert same

        # field list is FIELDS order, not rotated
        assert fields_before[0].startswith("Science")
        assert fields_before[1].startswith("Trade")

        share = page.evaluate("() => planSimulateN(20000)")
        total = sum(share.values())
        gallery = [
            "Healer",
            "Artisan",
            "Investigator",
            "Advocate",
            "Explainer",
            "Steward",
            "Pioneer",
            "Gladiator",
        ]
        for k in gallery:
            pct = 100.0 * share.get(k, 0) / total
            assert 8 <= pct <= 20, (k, pct, share)

        stab = page.evaluate("() => planStabilityRate(2000)")
        assert stab >= 0.85, stab

        # 5 roles each have 6 questions
        counts = page.evaluate(
            """() => {
              var o = {};
              ['student','parent','teacher','mentor','collaborator'].forEach(r => {
                o[r] = PLAN_PART2[r].qs.length;
              });
              return o;
            }"""
        )
        assert all(v == 6 for v in counts.values()), counts
        assert page.evaluate("() => PLAN_PART2.student.qs[0].k") == "clarity"

        weights = page.evaluate(
            """() => {
              var els = document.querySelectorAll('.page-plan *');
              var bad = [];
              for (var i=0;i<els.length;i++){
                var w = parseInt(getComputedStyle(els[i]).fontWeight,10);
                if (w > 600) bad.push(els[i].tagName+w);
              }
              return bad.slice(0,8);
            }"""
        )
        assert weights == [], weights

        page.locator("[data-plan-done]").click()
        page.wait_for_timeout(200)
        assert page.evaluate("() => S.pw.done") is True
        assert page.evaluate("() => S.archetype") == "The Steward"
        assert page.evaluate("() => S.pw.sub") == ""
        assert page.locator(".pw-subtabs").count() == 1
        assert "My pathway" in page.locator(".pw-subtabs").inner_text()
        assert "Explore" in page.locator(".pw-subtabs").inner_text()
        assert page.locator(".pw-head").count() == 1
        page.locator('.pw-subtabs [data-pw-tab="explore"]').click()
        page.wait_for_timeout(80)
        assert "Browse by field" in page.locator(".page-pw").inner_text()

        assert not errors, errors
        browser.close()
    print("verify-planner ok")


if __name__ == "__main__":
    main()
