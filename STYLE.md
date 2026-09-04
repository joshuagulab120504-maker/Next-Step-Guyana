# STYLE.md

Next Step Guyana, mobile UI. Anchored on LinkedIn's structure with our own brand.
`app-linkedin.html` is the working reference. This file is the values.

## Tokens

Paste this at the top of `_proto/shell.css`. It is the only place raw values are allowed.

```css
:root{
  /* surfaces. --page is warm on purpose: a warm off-white makes white cards
     read as paper, a cool grey makes them read as a dashboard. */
  --page:#f4f2ec; --card:#ffffff; --line:#e4e1d9; --line-2:#cfcbc0; --fill:#eeebe3;

  /* ink, three steps */
  --ink:#101f30; --mid:#3f5567; --meta:#6c8092;

  /* brand. --green is the interactive accent, --navy is primary buttons,
     --gold is the key affordance. --gold-ink is gold as text on light. */
  --navy:#08243c; --green:#056d40; --green-fill:#07864d;
  --gold:#ffcf27; --gold-ink:#8a6100; --red:#b23a30;

  /* one accent per post kind, all clear 4.5:1 on white */
  --k-question:#8a6100; --k-story:#056d40; --k-opening:#1a5fb4;
  --k-session:#08243c;  --k-journey:#b23a30;

  /* type. One family does everything. */
  --f:'Source Sans 3',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  --t-title:16px; --t-name:15px; --t-body:14px;
  --t-meta:13px;  --t-action:12px; --t-label:11px;

  /* spacing, 4px base, six steps. Anything off this ladder is a bug. */
  --s1:4px; --s2:8px; --s3:12px; --s4:16px; --s5:20px; --s6:24px;

  --r-sm:6px; --r-md:8px; --r-pill:999px;

  /* z ladder. Never write a literal. Two elements both picking 50 is how the
     Post button ended up on top of a sentence. */
  --z-top:40; --z-tabs:50; --z-scrim:60; --z-sheet:61; --z-toast:70;

  --top-h:52px; --tabs-h:56px; --tap:44px;
}
```

**Font:** Source Sans 3 only, weights 400, 600, 700 and 400 italic. It does display, UI
and quoted voice. Never add a second family. Never use Inter, Poppins, Montserrat, Space
Grotesk, Playfair Display, Lora, Bebas Neue, Raleway, Nunito or DM Sans; those are
generated-UI defaults and they read as a tell.

Load from Google Fonts for now. Self-host before launch: woff2 from `gwfh.mranftl.com`,
latin subset, variable, `font-display:swap`. Students are on metered data and Google Fonts
is not always reachable.

**Never use `#0A66C2` or a blue near it.** That is LinkedIn's brand colour. Structure and
density are generic patterns and fine to borrow. Their brand is not.

## Tabs

Five. `S.tab` replaces `S.view`.

| Tab | Value | Holds |
| --- | --- | --- |
| Feed | `feed` | all five post kinds, mixed, searchable |
| Network | `network` | matched mentors with a "why matched" line, joinable pods |
| Post | n/a | opens the composer sheet, does not change tab |
| Pathway | `pathway` | Northern Star, five-step rail, booked sessions, saved openings, gaps |
| Alerts | `notifications` | replies, session reminders, new openings, new followers |

The old Happening view is gone. Sessions and openings live in Feed as post kinds and in
Pathway under "Booked and saved". Tapping the already-active tab scrolls to top.

## Card anatomy

Every post has identical chrome. Only the block in the middle differs. Uniform chrome is
what makes a feed feel like one place.

```
.stream          display:grid; gap:var(--s2)      <- 8px ground gap is all the separation
.post            border-block 1px var(--line)
                 mobile: edge to edge, no side gutter, no radius, no shadow

.p-head          grid 48px 1fr auto, gap --s3, padding --s3 --s4 0
  avatar         48px circle for people, 48px --r-sm square for orgs and dates
  .p-name        15/600, --ink, clamp 1
  .p-headline    13, --meta, clamp 1          <- credibility lives here
  .p-meta        13, --meta: Kind · time · topic, kind word in its --k-* colour
  .p-follow      13/600, --green, people only, never orgs
  .p-more        32px overflow button

.p-body          padding --s3 --s4 0, 14/1.45, --mid
  .p-lead        the headline sentence, --ink, 600
  clamp3         + inline "…see more" when the post has a `more` field

typed block      question  -> grey quoted reply panel, top mentor answer, clamp 3
                 story     -> prose only, clamp 3 + see more
                 opening   -> bordered card, 3px coloured top strip, <dl> of facts,
                              "See how to join" footer button
                 session   -> same card, date and pod rows, places-left as plain text,
                              "Book a place" footer
                 journey   -> labelled THEN and NOW rows, no card

.proof           13, --meta, padding --s3 --s4 --s2
                 reaction count left, reply count right, above the divider

.actions         4 equal columns, border-top, each button 52px min,
                 20px icon above a 12/600 label
                 Useful | Answer or Reply | Save | Share
```

One breakpoint only: `@media(min-width:700px)`. Cards get a border and radius, column
centres at 620px. Desktop keeps the same cards, it does not get a redesign.

## Ten rules that keep breaking

1. **Clamp properly.** `display:-webkit-box; -webkit-line-clamp:N;
   -webkit-box-orient:vertical; overflow:hidden`. A `max-height` with `overflow:hidden`
   cuts a line in half and leaves the letter tops visible. That bug is in the old build.
2. **No middle-dot metadata chains.** `Story · Junior doctor, Georgetow…` overflows every
   narrow screen. Name, headline and meta are three separate elements with their own slots.
3. **One deterministic avatar colour per person,** hashed from the name, from `.av-1` to
   `.av-5`. The same person must never be green in one row and gold in the next.
4. **`see more` expands in place.** Toggles the id in `S.open` and re-renders. It never
   navigates away. This is why the feed feels fast.
5. **No progress bar for capacity.** Plain text: `8 of 20 places left`, or
   `Full. Waitlist open.` in `--red`. The old bar read as "nearly gone" while the label
   said the opposite.
6. **No redundant per-card CTA.** The action bar is the call to action. No "Explore" link.
7. **No interface-explaining copy.** No "tap any of them to go deeper", no permanent
   "Not set up" in the header. If the UI needs instructions, the layout failed.
8. **Search must look like an input.** Grey fill, magnifier icon, dark text. A filled navy
   pill reads as the page's primary button.
9. **Accessibility floor.** Never remove a focus ring, restyle it. Text clears 4.5:1;
   `--gold` is a fill, use `--gold-ink` for gold text on light. Icon-only buttons carry
   `aria-label`, toggles carry `aria-pressed`, the active tab carries
   `aria-current="page"`. Colour never carries meaning alone.
10. **One piece of non-user-triggered motion in the whole app:** the sheet entrance,
    `.24s cubic-bezier(.32,.72,0,1)`. Animate `transform` and `opacity` only. Respect
    `prefers-reduced-motion`.

## Click wiring order

Delegated in `wire()`. Specific handlers must match before general ones:

```
[data-close] -> [data-compose] -> [data-tab] -> [data-expand]
-> [data-useful] / [data-save] / [data-follow]
-> [data-openpost] / [data-cta] / [data-share] / [data-more] / [data-toast]
-> [data-ctype] -> #csubmit -> #scrim
```

Get this backwards and tapping Save opens the sheet. It looks fine until someone taps a
button.

Search re-renders on every keystroke, so restore focus and caret or the cursor jumps to
the end:

```js
var pos = e.target.selectionStart;
render();
var f = document.getElementById('q');
if(f){ f.focus(); try{ f.setSelectionRange(pos,pos) }catch(err){} }
```

## Decisions already settled

Do not reopen these without asking:

- **Post is a tab, not a floating pill.** That is why there is no floating element left to
  cover text.
- **The page ground is warm.** See the token comment.
- **Cards are edge to edge with an 8px gap.** The old margin plus radius plus shadow stack
  cost about 32px per card to achieve less separation.
- **Uniform chrome, different inner block per kind.** An earlier pass used a different row
  shape per kind. This is better and it is how LinkedIn solves the same problem.
- **Happening has no tab.** A booked session belongs next to the decision it serves.
  Open question: if students mostly want dates and deadlines rather than mentor follows,
  swap Network out for Happening and fold mentors into Pathway.
