# Next Step Guyana — Northern Star Multipage Prototype

Open `prototype-map.html` for the lead-engineer walkthrough, or `index.html` to begin as a first-time student. The primary product loop is: **14-screen self-check** (interest ratings → mid-flow archetype card → detail questions) → **gap-analysis engine** on My Plan (checks actual subjects against actual Star requirements) → **My Plan** (gamified milestones, XP, badges, persistent Navi, mentor inspiration + path comparison) → booked session.

Primary navigation (student-facing pages): **Home · Feed · My Plan · My Sessions · Mentors · Ask Navi · About Us**. Parent/Teacher view has its own minimal nav (Feed · Mentors · Sessions · About Us) — **no My Plan link**, by design.

Design system reference: see `design-system/MASTER.md` for tokens, typography, glass/bento patterns and accessibility rules — every page pulls from the same token set (`styles.css`, or a matching embedded `<style>` block where a page is self-contained).

**Terminology note:** the mentor-following mechanic is always labeled **"Inspire me"** in the UI (not "Follow").

**Requirement-accuracy note:** the subject-requirement checks in `check.html`/`my-plan.html` (e.g. "Law needs Caribbean History") are mostly **illustrative** and flagged as such in the UI — only the Law → Caribbean History rule is a verified published CAPE prerequisite. Anything else needs sourcing from real CXC/UG/UWI documentation before this could be trusted with real students.

## The self-check → My Plan pipeline (the core of the product)

1. **`check.html` — 14 screens, about two and a half to three minutes.** Screens 1–6 rate 18 concrete activities on a 4-point scale (the only RIASEC input). Screen 7 ranks curiosity areas and **reveals the explorer card mid-flow**. Screens 8–14 add work-style detail, school stage, concerns and support — filling blank lines on the card and sharpening mentor matches. Results persist in `localStorage['nsg_selfcheck']`.
2. **`my-plan.html`** reads `nsg_myplan`. If it doesn't exist yet, shows a locked empty state pointing back to `check.html` — no fake placeholder data. If it exists, renders the full dashboard: journey-stage stepper, Northern Star card (with alternates and re-check-on-switch), gap-count that honestly reads *"Add your subjects to see your real gaps"* until at least one subject is logged rather than implying a clean bill of health at zero data, XP/completeness/1:1-eligibility meters, editable deadline countdowns, the milestone list (each tagged by type — profile, task, session, mentor, Navi, or **subject gap**), a Subjects & Grades editor (this is now the *only* place subjects enter the system), an Achievements/Extracurriculars log, badges, and mentor "Inspire me" with a path-comparison view. **Every subject-gap milestone carries its own "Ask Navi" button**, not just the ones the original quiz happened to flag — clicking it opens Navi already knowing which specific subject is missing. **Mentor matching now factors in logged achievements**, not just stated interest — e.g. a leadership achievement nudges the match toward mentors whose own story involved leadership (see `MENTOR_ACHIEVEMENT_AFFINITY` and `scoreMentor()`), with a small "sharpened using what you've logged" note when it kicks in. A persistent Navi button (bottom right) holds a running conversation, reacts unprompted when a milestone completes, and can action a plan change directly (typing "change my star to law" actually updates the Star and re-runs the gap check).
3. **`parent-landing.html`** remains available for the parent/teacher path when that branch is reintroduced; the self-check itself no longer opens with a role question.

**The "gap engine" is the important part conceptually:** it's `Target (required subjects for the chosen Star) − Current (subjects actually logged) = Gap`, re-run every time the subject list, grades, term, or achievements change — not a one-time snapshot. Adding a subject, switching Stars, or just the term ticking over all visibly change the milestone list or its urgency immediately (the same gap reads as "you still have time" in Term 1 and "may be too late" in Term 3). This was verified by actually executing the plan-generation and recompute logic in Node against every stage and term combination (including bugs caught that way: Sixth Form/post-CAPE students were being falsely flagged as missing CSEC subjects they'd have needed to already pass to reach that stage, and the milestone cap could silently drop the core session/mentor milestones under enough conditional flags — both fixed).

## Page inventory

| File | Role | Purpose |
| --- | --- | --- |
| `index.html` | Public | Homepage — two-character footprint-path hero with an entrance animation, quick actions, how it works, stats, stories, trust, CTA, full footer |
| `check.html` | Public | 14-screen interest self-check with mid-flow archetype reveal (screens 1–7), then detail questions that fill the card; results saved to `nsg_selfcheck` |
| `my-plan.html` | Student | The full gap-engine dashboard described above — locked until `check.html` is completed |
| `parent-landing.html` | Parent/Teacher | Feed/Mentors/Sessions filtered by self-reported child/student interest — no My Plan, no student-account link |
| `feed.html` | Public/student | LinkedIn/Facebook-style feed — composer for mentors/team, reactions, comments, Save-to-Plan |
| `mentors.html` | Public/student | Match and get inspired by mentors based on shared decisions and experience ("Inspire me," not "Follow") |
| `sessions.html` | Student | Book mentor-pod sessions with WhatsApp consent |
| `my-sessions.html` | Student | Track bookings, links, reminders and preparation |
| `ask.html` | Public/student | Navi guidance with follow-up questions and attributed mentor experience |
| `about.html` | Public | Mission, values and how-it-works |
| `dashboard.html` | Retired | Kept for reference only; no longer linked from navigation — superseded by `my-plan.html` |
| `mentor-portal.html` | Mentor | Inspiration metrics, aggregate progress, advice feed, pods and availability |
| `admin.html` | Admin | Operations, verification, safeguarding, content and analytics |
| `prototype-map.html` | Handoff | Role and route map for presentation |
| `MENTOR-INTERVIEW-FRAMEWORK.md` | Research | Questions and metadata for capturing mentor journeys safely |

Every public/student page ends in a consistent light footer: *"Next Step was created to help Guyanese students take inspiration from others but build their own journey."*

## Suggested presentation route

1. `prototype-map.html`
2. `index.html`
3. `check.html`
4. `feed.html`
5. `my-plan.html`
6. `sessions.html`
7. `mentor-portal.html`
8. `admin.html`

## Engineering boundary

This is a front-end prototype. It does not include real authentication, a database, recommendation services, WhatsApp messaging, Google Meet creation, calendar synchronization, AI responses or production analytics. Buttons and forms demonstrate expected behavior and information architecture — `feed.html`'s composer, reactions and comments are functional in-session (via DOM updates), but nothing persists server-side; `localStorage` is used only for lightweight demo continuity (saved items, task completion, quiz answers) and is cleared if the browser storage is cleared. All personal data, safeguarding, consent, content-verification, moderation and role-permission requirements must be specified and reviewed before implementation.
