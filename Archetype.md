# Archetypes — 11 fields, with a soft-skills layer

Build spec for the archetype reveal. Replaces whatever names are currently hardcoded (the build is presently rendering **The Arbiter** and **The Village Advocate** for Law, and **The Inventor** for Technology — only the last of those survives).

---

## The design: two layers, kept visibly separate

Deriving the archetype from a student's **1st-choice field** means archetype and Star always agree, which costs us the "how you operate" dimension. Rather than fuse the two into dozens of blended sentences, the reveal carries **two distinct lines**:

1. **The archetype** — name + one-liner, from their 1st-choice field (Q8 rank 1)
2. **How you work** — one line, from their soft-skills answer (Q5)

Keeping them separate is deliberate. A student can see which part came from *what pulls them* and which from *how they said they work* — and it's 14 pieces of copy to maintain instead of 33 blended permutations.

---

## Layer 1 — Archetype, by 1st-choice field

| 1st choice | Archetype | One-liner |
|---|---|---|
| Agriculture | **The Cultivator** | You back things that take time, and you don't lose patience when results are slow. |
| Science & Medicine | **The Healer** | You want to leave people better than you found them. |
| Engineering | **The Builder** | You'd rather make the thing than talk about the thing. |
| Sports | **The Competitor** | You show up, you put in the work, and you want to see where you stand. |
| Business & Entrepreneurship | **The Founder** | You spot the gap other people walk past, and you want to do something about it. |
| Trade & Technical Vocation | **The Artisan** | You take pride in work done properly, and people can tell the difference. |
| Law & Humanities | **The Advocate** | You'll speak up when something isn't right, even when it's easier not to. |
| Creative Industry | **The Storyteller** | You notice what other people miss, and you know how to make them see it too. |
| Education | **The Explainer** | You make hard things make sense, and people come to you when they're stuck. |
| Public Service & Government | **The Guardian** | You look after what matters, and you're the one people count on. |
| Technology | **The Inventor** | You'd rather find a new way than follow the old one. |

**If a student ranks nothing** (Q8 allows 1–3 but a skipped state is possible), fall back to **The Explorer** — *"You're still looking, and that's the honest place to start."* Never leave the reveal blank.

---

## Layer 2 — "How you work", by soft-skills cluster

Q5 offers nine options; group them into three clusters. These map onto real competency domains — the *Effective Relationships*, *Critical Thinking* and leadership/creativity strands of the US Department of Education's Employability Skills Framework and the Cambridge Life Competencies Framework.

| Cluster | Q5 options that count toward it |
|---|---|
| **With people** | Working with others in a group · Explaining things so people understand · Helping people who need it · Being the one people rely on |
| **With problems** | Figuring out problems on my own · Sticking with something until it's done · Creating solutions to complex problems |
| **With ideas** | Leading or organising people · Coming up with new ideas |

**Resolution rule:** whichever cluster receives the most of the student's picks wins. Ties break to whichever cluster their **first** pick belongs to. Deterministic, no randomness.

**The three lines:**

- **With people** — *"And you do it with people around you — explaining, steadying, being the one they count on."*
- **With problems** — *"And you do it by staying with the hard part until it gives, even if that means working alone."*
- **With ideas** — *"And you do it by going first — new angles, and people follow."*

These are written to sit under **any** of the eleven archetypes, so they describe manner rather than content. Check each combination reads sensibly before shipping — "The Competitor… and you do it by going first" should work as well as "The Cultivator… and you do it with people around you."

---

## Reveal card composition

Keeps the ordering already specified — **image, then description, then name** — with the soft-skills line beneath:

```
   [ archetype image — placeholder for now ]

   You'd rather make the thing than talk about the thing.

   THE BUILDER
   ─────────────
   And you do it by staying with the hard part until it gives.

   [ See my full report → ]
```

Unchanged from the existing spec: full-screen reveal, shown once per plan (gate on a `plan.archetypeSeen` flag), badge pinned in the report reopens it as a modal, and the short "share your result" action stays distinct from the report's longer "email this to myself."

---

## Data shape

```js
const ARCHETYPES = {
  agriculture: { name: 'The Cultivator', line: 'You back things that take time, and you don\'t lose patience when results are slow.', image: 'archetype-cultivator.webp' },
  science:     { name: 'The Healer',     line: 'You want to leave people better than you found them.', image: '…' },
  engineering: { name: 'The Builder',    line: 'You\'d rather make the thing than talk about the thing.', image: '…' },
  sports:      { name: 'The Competitor', line: 'You show up, you put in the work, and you want to see where you stand.', image: '…' },
  business:    { name: 'The Founder',    line: 'You spot the gap other people walk past, and you want to do something about it.', image: '…' },
  trade:       { name: 'The Artisan',    line: 'You take pride in work done properly, and people can tell the difference.', image: '…' },
  law:         { name: 'The Advocate',   line: 'You\'ll speak up when something isn\'t right, even when it\'s easier not to.', image: '…' },
  creative:    { name: 'The Storyteller',line: 'You notice what other people miss, and you know how to make them see it too.', image: '…' },
  education:   { name: 'The Explainer',  line: 'You make hard things make sense, and people come to you when they\'re stuck.', image: '…' },
  publicsvc:   { name: 'The Guardian',   line: 'You look after what matters, and you\'re the one people count on.', image: '…' },
  technology:  { name: 'The Inventor',   line: 'You\'d rather find a new way than follow the old one.', image: '…' },
  _fallback:   { name: 'The Explorer',   line: 'You\'re still looking, and that\'s the honest place to start.', image: '…' },
};

const WORK_STYLE = {
  people:   'And you do it with people around you — explaining, steadying, being the one they count on.',
  problems: 'And you do it by staying with the hard part until it gives, even if that means working alone.',
  ideas:    'And you do it by going first — new angles, and people follow.',
};
```

Archetype **images are placeholders** for now — build the component so the image source is a single swappable field per archetype, so real artwork later is a data change rather than a layout change.

---

## Naming decisions worth recording

**"The Artisan" for Trade, not "The Fixer."** Fixer is punchier but undersells — trades build, they don't only repair. Given the career guide establishes BIT and GTI as the most accessible legitimate routes in the country, the archetype name mustn't quietly rank Trade below the academic fields.

**"The Explainer" for Education, not "The Teacher"** (that's just the field restated) or "The Mentor" (collides with the actual mentor feature). It also maps cleanly onto a Q5 option — *"Explaining things so people understand."*

**"The Advocate" for Law** — consolidating the two names currently in the build.

---

## ⚠️ One flag on The Healer

Swapping The Investigator for **The Healer** fixes a real problem: a student heading for nursing would not have recognised themselves in "Investigator," and nursing is one of the fastest routes to a professional licence in Guyana.

But it inherits the mirror-image gap. **Science & Medicine also contains research and lab work** — environmental science, geology, chemistry-led paths. A student aiming at those won't see themselves in "The Healer" either.

Two ways to handle it, if you want to:
1. **Accept it.** Health careers likely dominate this field's real traffic, so optimising the name for them is defensible.
2. **Let the soft-skills cluster swap the name, not just the line.** Science & Medicine + *"with problems"* → **The Investigator**; Science & Medicine + anything else → **The Healer**. Costs one conditional and one extra name, and it's the only field where the tension is sharp enough to be worth it.

I'd lean **(2)**, but it's a small enough gap that (1) is a reasonable call. Nothing else in the eleven needs this treatment.

---

## Acceptance criteria

- [ ] All 11 fields map to an archetype; none renders a blank or a placeholder name.
- [ ] Skipping Q8 falls back to The Explorer rather than erroring or showing nothing.
- [ ] "The Arbiter" and "The Village Advocate" no longer appear anywhere.
- [ ] Soft-skills cluster is resolved by most-picks, ties broken by first pick — deterministic across reloads.
- [ ] All 33 archetype × cluster combinations read sensibly (spot-check, don't assume).
- [ ] Reveal card order is image → description → name, with the work-style line beneath the name.
- [ ] Reveal shows once per plan and is reopenable from the report badge.
- [ ] Archetype image is a single swappable data field per archetype.
