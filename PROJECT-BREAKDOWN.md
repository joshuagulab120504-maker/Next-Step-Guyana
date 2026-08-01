# Next Step Guyana — Project Breakdown

Everything discussed so far, split into discrete projects an engineer (or small team) could pick up somewhat independently. Grouped into four phases: **Foundation** (mostly done, needs hardening), **Core Loop** (the main value, partially prototyped), **Engagement** (the "why come back" layer, mostly still ideas), and **Platform** (the unglamorous infrastructure everything else depends on).

---

## Phase 1 — Foundation

**1. Design System & Brand**
Navy/green/gold palette, Fraunces/Sora/Inter type system, glass-surface components, the footprint-and-star homepage illustration with its entrance animation. Mostly built and documented in `design-system/MASTER.md`. Remaining work is mostly maintenance — keeping new pages consistent with it rather than designing anything new.

**2. Public Marketing Pages**
Homepage, About Us, the general "what is this" pages. Built. Low ongoing effort — occasional copy/visual refresh, not a real engineering project on its own.

**3. Requirements Database (Gap-Engine Accuracy)**
The single highest-risk gap in the whole product: only one subject-requirement rule (Law → Caribbean History) is currently verified against a real source. Everything else in `my-plan.html`'s gap-checker is illustrative and labeled as such. This project is pure research — sourcing real CXC/UG/UWI syllabus documents and building a properly-cited requirements table — and should happen before any gap-engine claim goes in front of real students. Not really "engineering," but it blocks the credibility of everything downstream of it.

---

## Phase 2 — Core Product Loop

**4. Self-Check Quiz Engine**
The role-first (student/parent/teacher) branching intake, with stage-specific question sets underneath. Built and tested. Next step per the latest conversation: restructure the *output* — free results before signup, not a direct-to-My-Plan redirect (see #5).

**5. Free Result + Onboarding Gate**
New, not yet built. After the 60-second check-in, show a free results page (possible pathways + a few pre-answered "burning questions" + an email-to-self option) *before* asking for an account. This is the actual hook — right now the product asks for buy-in before proving its value. Needs a decision on how much depth is free vs. gated.

**6. Swipe-Based Pathway Selection**
New, not yet built. Post-signup, replace (or supplement) the current single-Star-with-alternates model with a Tinder-style swipe deck of pathway cards, each showing a visual timeline from "today" to that career. Swiping right seeds My Plan's actual shortlist instead of a hardcoded alternates list. Needs a decision on whether left-swipes are recoverable.

**7. My Plan Dashboard (Gap-Analysis Engine)**
The core built artifact so far: Target − Current = Gap, re-run live as subjects/grades/achievements are added. Journey-stage stepper, Northern Star card, milestones, subjects/grades editor, achievements log. Functionally solid and tested; needs to absorb whatever the swipe deck (#6) produces instead of (or alongside) quiz-derived answers.

**8. Gamification Layer**
XP, profile-completeness %, badges, the "X of 4 milestones to your first 1:1" counter. Built and working. Next real step is connecting the 1:1 unlock to an actual bookable mentor session rather than just a UI state change.

**9. Navi (AI Companion)**
Currently keyword-matched canned responses with session memory, not a real model. Persistent chat button, reacts to milestone completion, can action plan changes via typed commands ("change my star to law"). The honest next step here is a real LLM integration behind the same UI — the interaction pattern is already right, the "brain" isn't real yet.

**10. Mentor Matching & "Inspire Me"**
Mentor roster, interest-based matching (now also weighted by logged achievements), path-comparison view against a chosen mentor. Built with a small hardcoded mentor set. Needs a real mentor-onboarding pipeline (see #14) before this can scale past six illustrative profiles.

---

## Phase 3 — Engagement (the "why come back" layer)

**11. Feed**
Mentor/team composer, reactions, comments, save-to-plan. Built. Not yet opened up for student posts — that's a deliberate, moderated next step, not an oversight.

**12. Persistent Pods**
Currently a session is a one-off booking. Turning a pod into a standing small-group space (a mini-feed visible only to its members + assigned mentor, active between sessions) is the highest-leverage social feature discussed — it reuses existing mentor-portal/session infrastructure rather than inventing new surfaces, and a mentor's presence keeps it moderated by default.

**13. Ambient Collective Progress**
Lower-effort, safer social signal: "24 students are also working toward Law," a shared regional unlock bar toward something concrete (e.g., a live mentor AMA with a real date/time), no leaderboards, no names attached to individual contributions. Good candidate for a fast first engagement experiment before investing in #12.

**14. Mentor Onboarding & Verification Pipeline**
Real mentors need a real intake — the interview framework already exists as a document (`MENTOR-INTERVIEW-FRAMEWORK.md`) but there's no actual application/verification flow yet. This unlocks #10 and #11 scaling past a handful of illustrative profiles.

---

## Phase 4 — Platform (infrastructure everything else depends on)

**15. Real Accounts & Persistence**
Everything today lives in `localStorage` — no real signup, no cross-device sync, nothing survives a cleared browser. This is the single biggest "toy vs. real product" gap. Needed before any of the account-nudge UX (already built) means anything real.

**16. Parent/Teacher Experience**
Light self-reported intake → Feed/Mentors/Sessions filtered by stated interest, deliberately disconnected from any real student account. Built as a prototype. Real version needs a decision on whether a consent-based parent↔student link ever gets added (flagged earlier, deferred on purpose).

**17. Admin & Safeguarding Console**
Mentor verification, content moderation, safeguarding case queue. Exists as a UI prototype (`admin.html`) with no real backend behind it. As soon as any social feature (#11–#13) or real mentor pipeline (#14) ships, this stops being optional — it's the thing that makes those features safe to run with minors.

---

## Suggested sequencing
If I had to pick where to actually put people next: **#5 + #6** (free result + swipe deck) is the biggest near-term engagement lift and is scoped tightly enough to build fast. **#3** (requirements database) should run in parallel regardless of what else happens, since it's pure research and currently blocking. **#15** (real accounts) is the thing that turns everything else from a demo into a product, but it's also the least exciting to build — worth deciding now whether it's a blocker or something you ship the swipe/engagement features ahead of.
