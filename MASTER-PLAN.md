# Next Step Guyana — Master Plan & Context

This document exists so an engineer (or an AI assistant inside Cursor) can pick up this codebase without having read the full design conversation that produced it. It covers the original vision, what's actually built, why it's built the way it is, what's verified fact vs. illustrative placeholder, and everything that's been designed but not yet coded.

---

## 1. The original vision (verbatim intent, condensed)

Next Step Guyana exists to help a secondary school student figure out their **"Northern Star"** — a career or study destination — and then chart a personal, editable journey toward it, the same way LinkedIn lets you build a professional record, but aimed at 13–19 year-olds making CSEC/CAPE/tertiary decisions.

The core mechanics envisioned from day one:
- A **60-second self-check** (personality-quiz style) that surfaces a Northern Star and initial pathways
- A **mini-LinkedIn profile** — subjects written, grades, career experiences
- An AI guide (named **Navi**) that asks good follow-up questions and, critically, **surfaces real mentor anecdotes** matched to the student's specific fork ("stuck between CAPE and UG for Law? Here's a mentor who faced that")
- **Mentor matching** — students pick mentors to be "inspired by" (not "follow" — that word choice was deliberate and is enforced throughout the codebase)
- A **gamified journey map** — footsteps, milestones, "you are here" → destination
- **Group pods** as the default, with **1:1 mentor sessions unlocked** by progress
- A light **social layer** — seeing other students on similar paths — but explicitly *not* a normal social network, given the age of the users

Everything built since has been an attempt to make that vision real, in pieces, while being honest about what's genuinely working logic vs. what's still a convincing illustration.

---

## 2. What "done" means in this codebase

**Important framing for whoever picks this up:** almost nothing here has a real backend. There is no database, no authentication, no real AI model, no push notifications. Every page is a self-contained HTML file with inline CSS and JS; state lives in the browser's `localStorage`. This was a deliberate choice to move fast on product/UX decisions before committing engineering time to infrastructure — but it means **"built" in this document means "the interaction and logic are real and tested," not "this is production-ready."**

Every piece of logic described below as "built" was verified by actually executing it (via Node, extracting the pure functions out of the HTML and running them against realistic and adversarial inputs) — not just read through. Several real bugs were caught this way and are noted where relevant, because the *pattern* of catching them matters for whoever continues this: **don't trust that generated logic works until you've run it against edge cases**, especially anything involving branching state, counters, or caps.

---

## 3. Site map & page inventory

| File | Status | Purpose |
|---|---|---|
| `index.html` | Built | Homepage. Footprint-path hero with a two-character illustration and one-time entrance animation, ending at a Northern Star. Sora display font for hero copy, Space Grotesk for the "Choose/Dream/Act" in-illustration labels, Inter for body. |
| `check.html` | Built | **Entry point for everyone.** Question 1 is role (Student / Parent-Guardian / Teacher-Other). Branches immediately. Student path asks school stage, then a stage-specific question set, then universal questions (region, interests, priorities, support network). Ends by generating a plan object and redirecting to `my-plan.html`. Parent/Teacher path is a 3-question light intake redirecting to `parent-landing.html`. |
| `my-plan.html` | Built | The gap-analysis dashboard. Locked/empty until a plan exists in `localStorage`. Journey-stage stepper, Northern Star card (switchable, with alternates), gap count, XP/completeness/1:1-eligibility meters, editable deadline countdowns, milestone list, subjects+grades editor, achievements log, badges, mentor "Inspire me" + path comparison, persistent Navi chat with memory, escalating account-creation nudges. |
| `parent-landing.html` | Built | Feed/Mentors/Sessions filtered by self-reported child/student interest. **Deliberately not connected to any real student account** — this was an explicit decision, not a limitation (see §7). |
| `feed.html` | Built | LinkedIn/Facebook-style feed. Mentor/team composer (Update/Event/Announcement), reactions, comments, save-to-plan. Students can react/comment/save but not post yet (deliberate, see §8). |
| `mentors.html` | Built | Mentor roster with match percentages, "Inspire me" (never "Follow" — see §4.4). |
| `ask.html` | Built | Standalone Navi conversation demo, predates the persistent-Navi-in-My-Plan version. |
| `about.html` | Built | Mission/values page. |
| `my-sessions.html`, `sessions.html` | Built | Booking flow for mentor-pod sessions. |
| `dashboard.html` | Retired | Superseded by `my-plan.html`. Kept for reference, not linked from navigation anywhere. |
| `mentor-portal.html` | Built (illustrative) | Mentor-side view — aggregate inspiration stats, advice posting, pod management. No real backend. |
| `admin.html` | Built (illustrative) | Operations console — mentor verification, safeguarding queue, content moderation. No real backend. This becomes non-optional the moment any real social feature ships (see §8, §9). |
| `prototype-map.html` | Built | Presenter's handoff/tour page, linked from the homepage footer. |

All pages are self-contained (no shared `styles.css`/`app.js`/image files — everything inlined) so any single file can be opened and will render/work on its own, and all internal `href` links between pages are verified to resolve.

---

## 4. Core systems — how they actually work

### 4.1 The self-check quiz engine (`check.html`)
Not a fixed question list — a **branching decision tree**, entirely pre-written (no AI generating questions on the fly). Question 1 (role) determines which pre-written branch loads next. For students, question 2 (school stage: Forms 1–3 / Form 4 / Form 5 / just-finished-CSEC / Sixth Form / just-finished-CAPE) determines a *second* branch of stage-specific questions, followed by universal questions everyone gets (region, interest areas, priorities/constraints, support network).

**As of the latest revision, subject collection was removed from the quiz entirely.** Previously Form 4/5/post-CSEC asked "which subjects are you taking/did you pass" — this was cut because (a) a multi-select through 9+ subjects is tedious on mobile, and (b) it created a redundancy where the "add your subjects" milestone in My Plan was already marked done by the quiz. In its place: a single **Term** question (Term 1/2/3) for any currently-enrolled stage (skipped for post-CSEC/post-CAPE, who have no active term). Term feeds directly into milestone urgency — see 4.2.

Subjects and grades are now collected **exclusively** in My Plan's profile editor, after the plan already exists. This was a deliberate late-stage redesign; if you see any reference to a `subjects` or `capeSubjects` quiz question in older code, it's stale.

### 4.2 The gap-analysis engine (`my-plan.html`)
This is the intellectual core of the product and the thing most worth protecting as "real logic" if this gets rewritten in a real framework. The computation is always:

```
Target (subjects the chosen Star requires) − Current (subjects actually logged) = Gap
```

Re-run every time the subject list, a grade, or an achievement changes (`recomputeGapMilestones()`), not computed once at quiz-completion. Three gap-driving inputs, all currently live:
- **Subject gaps** — a required subject is missing entirely. Framing changes by *both* stage and term: a Form 4 student in Term 1 sees "you still have time to add this," while a Form 5 student in Term 3 sees "may be too late — ask Navi about alternatives." This was tested by flipping term live and confirming the same gap's urgency framing changes without retaking the quiz.
- **Grade gaps** — a logged subject has a CXC Grade V or VI, which likely won't satisfy typical entry requirements. Triggers a separate milestone suggesting revision/tutoring.
- **Level-awareness** — Sixth Form students are checked against **CAPE**-level requirements, not CSEC (they've already cleared CSEC to be there). Post-CAPE students get **no** subject-gap checking at all (that fork has passed; gaps there would be about applications, not subjects). This distinction was a real bug caught during testing — the first version falsely flagged Sixth Formers as missing CSEC Mathematics even when they were actively taking CAPE Pure Mathematics.

**Every dynamically-discovered gap gets its own "Ask Navi" button**, not just the milestones the original quiz happened to flag — this was a deliberate widening so that a gap discovered *later* (by adding a subject in the profile) is just as actionable as one discovered at quiz-time.

**Honesty rule:** if a student hasn't added any subjects yet, the Star card does not say "0 gaps" (which would misleadingly read as good news) — it says "Add your subjects to see your real gaps — we can't check anything yet."

### 4.3 Gamification
- **XP** — awarded per completed milestone, no other purpose than a satisfying number going up
- **Profile completeness %** — four factors: has subjects logged, has an achievement logged, has an inspiration mentor chosen, has completed at least half of milestones
- **Badges** — awarded at real moments (first Star, first achievement, 3 milestones done, inspired by a mentor, 50% complete, unlocked a 1:1), deduped so they only fire once
- **1:1 eligibility** — a separate, deliberately more legible counter than XP ("2 of 4 milestones to your first 1:1 with Aniyah"), because a raw point total doesn't motivate a teenager the way a countdown to a real person does

### 4.4 Mentor matching & "Inspire me"
**Terminology rule, enforced everywhere:** the mechanic is always called **"Inspire me,"** never "Follow." This was corrected multiple times across the codebase and should be treated as a hard style rule for any new copy.

Matching is currently: interest-category overlap (worth 2 points) **plus** a score for logged achievements that match a per-mentor "achievement affinity" list (e.g. Aniyah/Joshua/Reginald resonate with leadership/award achievements; Alisande resonates with sport/creative; Dave/Reginald resonate with volunteer work). This was the most recent upgrade — previously matching was interest-only. Once a mentor is chosen, `my-plan.html` renders a side-by-side comparison: the mentor's real path milestones vs. the student's own completed milestones, showing how far along they are relative to that mentor's journey.

The mentor roster (6 people: Aniyah Couchman, Joshua Gulab, Alisande Jaiserrisingh, Dave Chowtie, Reginald Brown, Riley Nurse) is illustrative/hardcoded. Scaling past this needs a real mentor-onboarding pipeline (Project #14 in the breakdown doc).

### 4.5 Navi
Currently a **keyword-matched response system**, not a real language model — `naviRespond(text)` checks the input against a small set of keyword groups (family, afford/money, subject/grade, mentor/support/alone, law/history) and returns a matching mentor anecdote, falling back to a default. It has session memory (a running log, not reset on every open), reacts unprompted when a milestone completes, and can action real plan changes — typing "change my star to law" actually updates the Star and re-runs the gap check, verified by testing this exact string parse.

**This is the one piece where the interaction design is real but the "intelligence" is not.** The honest next step (Project #9) is swapping the keyword matcher for a real LLM call behind the exact same chat UI — the conversation pattern, memory model, and plan-editing hooks don't need to change, just what generates the response.

### 4.6 Account nudges
Deliberately **escalating, not repetitive**: a full modal the moment a plan is first generated, a smaller banner (different wording) after the 3rd milestone completes, another banner right before the 1:1 unlocks. A persistent "Free forever · No card needed" badge sits in the header at all times, not just inside the ask — the free-ness is meant to be ambient, not only mentioned when something is being requested.

---

## 5. Data model (current, localStorage-based)

```
localStorage keys currently in use:
  nsg_myplan            — the full student plan object (see shape below)
  nsg_parent_view       — { role, childStage, childInterests[], region }
  nsg_account_created   — 'true'/'false' — guest vs "signed up" state (still no real auth)
  nsg_nudge_shown        — has the first-plan modal been shown
  nsg_nudge_3            — has the 3-milestone banner been shown
  nsg_nudge_elig         — has the pre-1:1 banner been shown
```

**Plan object shape** (produced by `check.html`'s `generatePlan()`, consumed by `my-plan.html`):
```js
{
  answers,            // raw quiz answers, kept for reference
  starKey,            // e.g. 'law', 'science', 'engineering'...
  star: { title, desc, verified },   // verified=true only for Law/Caribbean History
  stage,              // 'lower'|'form4'|'form5'|'postcsec'|'sixthform'|'postcape'
  term,               // 'term1'|'term2'|'term3'|null (null for post-CSEC/post-CAPE)
  subjectLevel,       // 'CSEC'|'CAPE'|null — which level gap-checking runs at
  subjects: [],       // [{name, grade}] — always starts empty, filled in My Plan
  achievements: [],   // [{type, title, org, desc, active}]
  milestones: [],     // [{id, type, title, desc, xp, done, urgent?, context?, subject?}]
  inspirationMentor,  // mentor id or null
  naviLog: [],        // running chat history
  badges: [],         // earned badge ids
  lastVisit,          // timestamp
}
```

This schema is shared verbatim between `check.html` (producer) and `my-plan.html` (consumer) — they were built as separate files and their compatibility was explicitly integration-tested (a plan generated by one was fed into the other's render functions in a Node harness to confirm no missing-field errors). **If this becomes a real backend, this object is a reasonable starting point for a database schema**, though `naviLog` and anything free-text should get real moderation/storage consideration before going live.

---

## 6. Verified facts vs. illustrative placeholders — read this before trusting any requirement claim

This matters enough to repeat from earlier in the build: **only one entry-requirement rule in the entire gap-engine is sourced from a real, verified document** — CAPE Law requires Caribbean History at CSEC. Every other rule (Biology+Chemistry for Science, Physics+Maths for Engineering, etc.) is a plausible illustration, explicitly labeled as such in the UI ("Requirement checks here are illustrative — always confirm current entry requirements with the institution or CXC directly"). **Do not remove that disclaimer or expand the requirements table without sourcing real CXC/UG/UWI documentation first** — this is Project #3 in the breakdown doc and should be treated as a prerequisite to any real launch, not a nice-to-have.

Facts that *were* verified via research during this build, and are baked into copy/logic — useful to know so nobody re-litigates them without checking:
- **University of Guyana became tuition-free in January 2025.** This is why the "affordability" milestone talks about transport/materials/application costs rather than tuition — tuition is no longer the main financial barrier at UG specifically.
- **CXC covers exam fees for up to 8 CSEC subjects, plus CAPE fees, government-funded.** Same reasoning — exam fees are not the real affordability pain point anymore for most families.
- **CSEC/CAPE registration for a May/June sitting opens roughly October 1–15 the prior year.** This drives the deadline-countdown widget's "typically opens" date.
- **GOAL's application windows are phased by programme level and shift every cycle** (this cycle: vocational Oct 1–Nov 30, Bachelor's Nov 1–Dec 31, postgrad Dec 1–Jan 31). The deadline widget computes "next occurrence" dynamically rather than hardcoding a date, specifically because these dates are known to move yearly.
- **NGSA's date is not fixed to April** — it moved from early May (2024) to mid-April (2025). Any copy referencing NGSA timing should say "typically April/May," not a fixed month.

---

## 7. Deliberate non-features (things explicitly *not* built, on purpose)

- **No open peer discovery or student-to-student messaging.** Users are minors; direct-contact surfaces are a real safeguarding risk, not just a scope decision. Any social feature (see §8) needs to stay ambient/collective or mentor-moderated, never open 1:1 contact between students.
- **No public leaderboards or rankings.** Discussed and explicitly rejected — public competition tends to demotivate exactly the students with less time, confidence, or access, which is the opposite of this product's purpose.
- **Parent/Teacher view is not linked to any real student account.** A consent-based linking system (parent enters a code the student shares) was discussed as a real future option, deliberately deferred — it's a genuine feature with real privacy/consent plumbing, not something to bolt on casually later.
- **No AI-generated quiz questions.** The branching is entirely pre-written; only the *routing* between pre-written branches is dynamic. This was clarified explicitly during the build because it's easy to misdescribe this as "AI picks your questions," which it does not do.

---

## 8. Discussed and designed, but NOT yet built

These came out of the most recent planning conversation and have real design decisions attached, but zero code:

**Free result + onboarding gate.** Restructure the quiz output: show a free results page (multiple possible pathways + a few pre-answered "burning questions" + an email-to-self option) *before* asking for an account, rather than redirecting straight into a locked My Plan. Open question needing a decision: exactly how much depth is free vs. gated.

**Swipe-based pathway selection.** Post-signup, a Tinder-style deck of pathway cards (each showing a visual timeline from "today" to that career), swipe right to keep / left to discard, feeding My Plan's actual shortlist instead of the current hardcoded 2-alternate lookup table. **Open decision, not yet answered:** are left-swiped cards gone permanently, or recoverable via a "see what you passed on" list? Recommended leaning toward recoverable given the audience's likely fast/impulsive swiping, but this needs a real answer before building.

**Persistent pods.** Turn a booked session into a standing small-group space — a mini-feed visible only to pod members + their assigned mentor, active between sessions. Reuses existing mentor-portal/session infrastructure. Considered the highest-leverage social feature because a mentor's presence keeps it moderated by default.

**Ambient collective progress.** Lower-effort alternative/precursor to persistent pods: quiet stats like "24 students are also working toward Law" or a shared regional bar toward unlocking something concrete (e.g., a live mentor AMA with a real scheduled time), with no leaderboard and no names attached to individual contributions.

**Student posting in Feed.** Currently only mentors/team can post; opening a light, moderated lane for students (e.g., an opt-in auto-generated "I just finished my subject list ✓" card on milestone completion) was discussed as the way to get peer visibility without opening a new contact surface, since Feed is already public/one-to-many, not 1:1.

---

## 9. Known risks if this goes toward a real launch

1. **No real backend.** Everything is `localStorage`. Nothing survives a cleared browser or works across devices. This is the single biggest gap between "convincing demo" and "real product" (Project #15).
2. **Navi has no real intelligence.** Keyword matching will break or feel obviously scripted the moment real students ask anything outside the handful of anticipated phrasings.
3. **Requirements data is mostly unverified**, as covered in §6 — this is a credibility and potentially a real-harm risk if a wrong requirement discourages a viable path or encourages a nonviable one.
4. **No safeguarding infrastructure behind the admin console.** `admin.html` is a UI shell. The moment any open posting, pod, or mentor-matching feature goes live for real minors, real moderation tooling stops being optional.
5. **Mentor roster is a fixed illustrative set of 6 people.** Any matching or "Inspire me" feature is currently a closed demo, not a real marketplace.

---

## 10. Where to start in Cursor

If continuing this in a real framework (React, etc.), the highest-value carry-over isn't the HTML/CSS — it's the **logic that was tested and verified**: the branching quiz engine's state machine (`check.html`), the gap-analysis functions (`computeSubjectGaps`, `recomputeGapMilestones`, `subjectLevelForStage`), the mentor scoring function (`scoreMentor`), and the plan object schema in §5. Those are the parts worth porting deliberately rather than rewriting from scratch, since they've already had real bugs found and fixed in them.

See `PROJECT-BREAKDOWN.md` (companion document) for how all of the above splits into independently-assignable projects, and `design-system/MASTER.md` for the full visual/token reference.
