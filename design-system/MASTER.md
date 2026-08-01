# Next Step Guyana — MASTER Design System
**Style:** Minimalist Bento Grid × Clean Modern Tech, with a sophisticated academic palette
**Scope:** Global — applies to every page in the prototype (`styles.css` + the four pages with embedded `<style>`: `index.html`, `check.html`, `my-pathway.html`, `admin.html`)

---

## 1. Design Rationale
The previous prototype used three *slightly* different navy/green palettes across files (each embedded `<style>` block had drifted independently), a blue accent competing with the green brand color, no loaded display font (Inter was referenced but never imported, so it silently fell back to system fonts), flat white cards with no depth language, and a few real bugs (broken logo paths, inconsistent nav link sets). This system fixes all of that from one source of truth.

**Audience:** Guyanese secondary school students (13–19) making CSEC/CAPE/tertiary decisions, plus mentors and admin staff. The tone needs to feel *trustworthy and institutional* (navy, editorial serif headlines) without feeling like a government form — so it's paired with soft glass surfaces, rounded geometry, and a warm gold accent for encouragement moments (progress, stamps, milestones).

---

## 2. Color Tokens
| Token | Hex | Role |
|---|---|---|
| `--navy` | `#0A1930` | Primary dark surface, headers, hero backgrounds |
| `--navy2` | `#123A52` | Secondary dark gradient stop |
| `--teal` / `--green` | `#0E7A4F` | **Primary brand action color** (buttons, links, active states) |
| `--teal2` | `#149B62` | Brighter green for gradients & hover states |
| `--gold` | `#EEB52F` | Celebration/encouragement accent only (stamps, "gold" CTAs, active nav underline) — never a primary action color |
| `--ink` | `#101A28` | Body text |
| `--muted` | `#5C6C7E` | Secondary text |
| `--paper` | `#F5F7FA` | Page background |
| `--line` | `#DFE6EC` | Borders |
| `--soft` / `--green2` | `#EAF3EE` | Light tinted chip background |
| `--glass-bg` | `rgba(255,255,255,.66)` | Glass container fill |
| `--glass-line` | `rgba(255,255,255,.5)` | Glass container border |
| `--glass-navy` | `rgba(8,22,40,.72)` | Dark glass (topbar) |

**Rule:** Navy = authority/structure. Green = action/progress. Gold = reward, used sparingly (max 1–2 gold elements per screen) so it stays meaningful.

Blue (`--blue: #2D6BD9`) is retained only as a low-emphasis informational tint (e.g. a "study" pill) — it is **not** a button or nav-active color anymore, to avoid competing with the green brand identity.

## 3. Typography
- **Display font:** `Fraunces` (variable serif, opsz 9–144) — used *only* on `h1`, `.page-title`, `.hero h1`, section headlines. Gives the "sophisticated academic" register.
- **Body/UI font:** `Inter` — everything else (nav, buttons, body copy, forms).
- Both are loaded via `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..800&family=Inter:wght@400;500;600;700;800;900&display=swap')` at the top of every stylesheet/style block — previously missing, so Inter never actually loaded.
- Base body size stays ≥15px; never below 12px for any label.

## 4. Glassmorphism Containers
```css
.glass{
  background:var(--glass-bg);
  backdrop-filter:blur(16px) saturate(1.2);
  -webkit-backdrop-filter:blur(16px) saturate(1.2);
  border:1px solid var(--glass-line);
}
```
Applied to: `.card`, `.mentor`, `.chat-box`, `.chat-info`(dark variant), `.booking-panel`, `.session-card`, `.quiz-wrap`, `.question-card`, `.rail-card`, `.step`, `.trust-card`, and the sticky `.topbar` (dark glass over navy).
**Rule:** Glass sits on `var(--paper)` backgrounds only — never glass-on-glass (would crush contrast). Text inside glass containers stays at full `--ink` opacity, never faded.

## 5. Bento Grid
```css
.bento{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}
.bento>.b-wide{grid-column:span 4}
.bento>.b-narrow{grid-column:span 2}
.bento>.b-half{grid-column:span 3}
```
Collapses to 2 columns at 900px, 1 column at 620px. Used for the Dashboard "Picked for you" panel (one wide feature + two half-width + a dark "stage" tile) to break the repetitive 3-equal-card grid and create visual hierarchy — the most important recommendation is now visually largest.

## 6. Accessibility & Touch (Priority 1–2 fixes applied globally)
- `:focus-visible` outline restored everywhere (2.5px solid green, was previously invisible/default on some elements).
- `button, a.btn, .filter, .choice, .quick button, .side-links a, input[type=checkbox/radio]` → `min-height:44px` global floor.
- `@media(prefers-reduced-motion:reduce)` respected globally.
- Nav active-state now shown via a gold underline bar (color, not the removed hover-only blue), so keyboard/low-vision users have a persistent non-hover indicator.

## 7. Bug Fixes Applied
| Bug | Fix |
|---|---|
| `index.html` / `check.html` referenced `logo-top.jpg` (file doesn't exist) | Corrected to `logotop.jpg` |
| `admin.html` referenced `admin-logo.png` (file doesn't exist) | Corrected to `adminlogo.png` |
| Inter font referenced but never loaded anywhere | Added `@import` in every stylesheet |
| Public pages (`ask`, `mentors`, `pathways`, `opportunities`, `sessions`) each had a *different* subset of nav links | Unified to one 7-item set: Home · My Pathway · Explore · Opportunities · Mentors · My Sessions · Ask Navi · [My Dashboard CTA] |
| Homepage nav was missing "Opportunities" | Added, and mobile sheet nav synced to match desktop |
| Three near-duplicate navy/green hex values drifting across `index/check/my-pathway/admin` embedded styles | Unified to one canonical hex per token across all four |

## 8. Component Anti-Patterns Avoided
- No emoji-as-icon for primary nav/action icons (existing glyphs like ✓ ↗ ★ kept as decorative marks only, not information-bearing icons without labels).
- No horizontal scroll on mobile (filters use `overflow-x:auto` intentionally with visible scroll affordance, not accidental overflow).
- No layout-shifting animations — all transitions are opacity/transform based, and now gated by `prefers-reduced-motion`.
- Gold is never used as a large background fill for body text — always for small accent chips/underlines/badges only, to protect contrast.

## 9. File Map
- `styles.css` — master stylesheet, used by: `dashboard.html`, `ask.html`, `mentors.html`, `pathways.html`, `opportunities.html`, `sessions.html`, `my-sessions.html`, `mentor-portal.html`, `prototype-map.html`
- Embedded `<style>` (retain page-specific layout, share the same tokens/utilities above): `index.html`, `check.html`, `my-pathway.html`, `admin.html`

## 10. Terminology & Consistency Rules (added during build-out)
- The mentor-following mechanic is always **"Inspire me"** in the UI — never "Follow." Toggling it writes `{type:'inspiration', id}` to the shared `nsg_saved` localStorage array, which `feed.html`'s profile-rail stat and any future "mentors who've inspired you" count should read from directly rather than maintaining a separate counter.
- Every public/student page ends in the same lightweight `.mini-footer` (defined once in `styles.css`, mirrored into the embedded `<style>` blocks of `index.html`, `check.html`, `my-plan.html`) carrying the mission line: *"Next Step was created to help Guyanese students take inspiration from others but build their own journey."* Page-specific disclaimers (e.g. Feed's moderation note, About's data-verification note) live in the footer's `<small>`, not as a separate paragraph, to avoid stacking two disclaimers.
- `dashboard.html` is retired but not deleted — it has no inbound links from primary navigation anywhere in the site. `my-plan.html`'s "Today" tab is the account hub now.
