# Next Step Guyana — implementation brief
Give this whole file to Cursor as the task. It is written to be applied to the existing repo, not to replace it.
---
## 0. What you are doing
The app currently has four bottom tabs: Stories, My Pathway, Feed, Questions. Collapse this to **two tabs: Feed and My Pathway**.
Stories and Questions stop being destinations. They become **filter values on the Feed**. The Journey detail page (currently `mentor-story.html`) stays, but is reached from the Feed rather than from a Stories tab.
Read the repo first and write down which files exist before changing anything. Expect roughly: `index.html`, `feed.html`, `stories.html`, `questions.html`, `my-pathway.html`, `mentor-story.html`, plus a shared stylesheet and script. If the names differ, map them to the roles below and say what you mapped.
### Hard constraints
1. **Do not replace the logo.** Keep using the existing logo image asset already in the repo, referenced the way it is referenced now. Do not inline an SVG, do not generate a new mark, do not change the file it points at. If the current markup is `<img src="logo.png" alt="Next Step Guyana">` inside a rounded tile, keep exactly that and only restyle the tile if told to below.
2. **No em dashes or en dashes anywhere in user-facing copy.** Use a full stop, a comma, or a colon. Run a search for the characters U+2014 and U+2013 across every file at the end and confirm zero hits in text nodes. Ranges are written out in words: "Form 1 to 2", "ages 8 to 18", "Form 3 to Form 6".
3. **The "For you" carousel on My Pathway keeps its carousel behaviour.** It is a horizontally scrolling rail of activity cards, exactly as it is today, not a grid and not a stack. Section 8 has the full spec including the clipping bug that needs fixing.
4. Persist state with `localStorage` under keys prefixed `nsg_`, so a refresh does not wipe the pathway. If the repo already has a storage helper, use that instead of adding a second one.
---
## 1. Routing and file changes
| File | Action |
| --- | --- |
| `feed.html` | Becomes the landing page and the default route. Rebuilt per section 5. |
| `my-pathway.html` | Rebuilt per section 8. Keeps the carousel. |
| `mentor-story.html` | Keep. Rename the page title and headings from "story" to "journey" per section 7. Reached with `?id=<journeyId>`. |
| `stories.html` | Delete. Any link to it becomes `feed.html?filter=journey`. |
| `questions.html` | Delete. Any link to it becomes `feed.html?filter=question`. |
| `index.html` | If it is a marketing landing page, keep it and point every call to action at `feed.html`. If it is just a redirect shell, make it redirect to `feed.html`. |
On load, `feed.html` reads `?filter=` from the query string and preselects that filter chip. Valid values: `all`, `question`, `story`, `tip`, `opportunity`, `journey`.
The bottom dock has exactly two buttons. Delete the Stories and Questions buttons and their icons. On viewports 880px and wider the dock is hidden and the same two items appear as a left rail. Do not show both at once.
---
## 2. Design tokens
Replace the existing token block with this. The navy is deliberately deeper and more saturated than the current build so the header, the hero and the journey card headers read as the strongest thing on the page.
```css
:root{
  --navy:#0a2d52;
  --navy-deep:#061c33;
  --navy-mid:#0f4272;
  --ink:#0f2740;
  --body:#2c4054;
  --muted:#6b7d94;
  --faint:#8a9aad;
  --paper:#f3f6fa;
  --card:#ffffff;
  --line:#e3e9f1;
  --line-soft:#eef2f7;
  --gold:#f4c945;
  --gold-deep:#e8b924;
  --gold-soft:#fdf5dd;
  --gold-line:#ecd894;
  --ochre:#a8801f;
  --alert:#b93b30;
  --serif:"Source Serif 4","Iowan Old Style","Palatino Linotype",Palatino,Georgia,ui-serif,serif;
  --sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
  --r-card:15px;
  --r-pill:999px;
  --shadow:0 1px 2px rgba(15,39,64,.05),0 10px 28px rgba(15,39,64,.045);
}
```
Rules that follow from this:
- Every heading uses `--serif`. Every label, button, pill, byline and form control uses `--sans`. No exceptions.
- Body copy is 16px with 1.55 line height. Do not go below 13px for anything a student has to read.
- All three navy surfaces use the same gradient so they read as one family: `linear-gradient(100deg,var(--navy-deep),var(--navy-mid))`. Those surfaces are the header, the My Pathway hero, and the journey card header strip.
- The header gets `box-shadow:0 6px 22px rgba(6,28,51,.22)` and the hero and journey headers get `0 14px 34px rgba(6,28,51,.18)`. This is what makes the navy sit forward instead of blending into the grey page.
- The gold rule under the header stays 4px: `linear-gradient(90deg,var(--gold-deep),var(--gold) 45%,#f7dd8a)`.
Load `Source Serif 4` at 600 and 700 and `Inter` at 400 to 800, with the local fallback stacks above kept in place so the page still renders offline.
---
## 3. Header
Structure stays as it is now. Only these changes:
- Keep the existing logo image inside its rounded tile. Tile is 46px, `border-radius:12px`, background `#f8f6ef`, `overflow:hidden`, image `object-fit:contain` or `cover` matching whatever it currently does.
- Wordmark: `NEXT STEP` in Inter 800 at 19px with `letter-spacing:.02em`, and `GUYANA` under it at 10px, weight 700, `letter-spacing:.28em`, colour `#b3cae0`.
- Right side is a single pill showing the student's stage: avatar initials on gold, then text. Copy is `Form 3, Region 4` before the check is taken, and `The Steward, Form 3` after. Comma separated, no bullet, no middot.
- Remove any other header buttons. No notification bell, no help icon, no search icon in the header. Search lives on the Feed page.
---
## 4. Copy rules
Apply these to every string you touch, including ones this brief does not list.
- No em dashes or en dashes.
- Sentence case everywhere except the eyebrow labels, which are uppercase with `letter-spacing:.15em` in `--ochre` at 10.5px weight 800.
- A button says what happens. "Post question" produces the toast "Question posted." Same verb both ends.
- Write the way a student or a working mentor would type. Short sentences. No slogans, no "not X but Y" constructions, no colon reveals.
- Delete explanatory notes that tell the user how the product thinks. Specifically remove all of these if they exist in the current build:
  - the "No upvotes or downvotes here, deliberately" panel on the feed
  - any "Replies show in the order they were written" note inside a thread
  - every "Here because of Form 1" or "Here because you read them" line under a card
  - "Reviewed 2026-07-20" badges
  - "Prototype guidance is illustrative" blocks inside page bodies
  - the "6 others are in the catalogue but not open to Form 1" line as currently worded, replaced per section 8
- Keep exactly one disclaimer in the whole app, at the very bottom of My Pathway: `Prototype. Mentors and contributors are placeholders until consented interviews replace them.`
---
## 5. Feed page
### 5.1 Order of elements, top to bottom
This order matters. Search sits above the composer.
1. Eyebrow `TIMELY`
2. `<h1>Feed</h1>`
3. Search field
4. Filter chip row
5. Tune strip, dismissible
6. Composer
7. Result count line
8. The stream
Do not put a lead paragraph under the `Feed` heading. It was there before and it goes.
### 5.2 Search
```html
<div class="search">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
  <label class="sr" for="q">Search the feed</label>
  <input id="q" placeholder="Search the feed">
</div>
```
```css
.search{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);
  border-radius:13px;padding:13px 15px;box-shadow:var(--shadow)}
.search svg{width:18px;height:18px;color:#93a4b7;flex:0 0 18px}
.search input{flex:1;border:0;outline:0;background:transparent;font-size:15px;min-width:0}
```
Behaviour: filters the stream live on `input`, case insensitive, against the item title, body text, author name, topic tag, every reply author and reply body, and for journey cards also the journey's name, field, place, hook and current role. Search and the chip filter combine with AND.
### 5.3 Filter chips
Six chips in this order, labels exactly as written: `Everything`, `Questions`, `Stories`, `Mentor tips`, `Opportunities`, `Journeys`. Values `all`, `question`, `story`, `tip`, `opportunity`, `journey`.
```css
.filters{display:flex;gap:7px;overflow-x:auto;padding:12px 0 16px;scrollbar-width:none}
.filters::-webkit-scrollbar{display:none}
.filters button{flex:0 0 auto;border:1px solid var(--line);background:#fff;border-radius:var(--r-pill);
  padding:9px 14px;font-size:13px;font-weight:700;color:#5b7089}
.filters button.on{background:var(--navy);border-color:var(--navy);color:#fff}
```
The active chip is solid navy with white text. Horizontal scroll on narrow screens with the scrollbar hidden. Each chip is at least 44px tall on touch.
### 5.4 Tune strip
One line, not a paragraph block. Gold left edge, 4px.
```html
<div class="tune" id="tune">
  <p><b>Your feed is not tuned yet.</b> Three questions change the order of what you see.</p>
  <button class="btn sm" id="startCheck">Tune it</button>
  <button class="btn ghost sm" id="skipCheck">Not now</button>
</div>
```
```css
.tune{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#fff;border:1px solid var(--line);
  border-left:4px solid var(--gold);border-radius:12px;padding:13px 16px;margin-bottom:14px}
.tune p{margin:0;font-size:14px;color:var(--body);flex:1;min-width:200px}
.tune p b{color:var(--ink)}
```
`Not now` hides it and writes `nsg_tune_dismissed=1` so it does not come back. `Tune it` opens the three question check from section 9. Once the check completes, the strip is removed permanently.
### 5.5 Composer
One control, three modes. Segmented buttons: `Ask a question`, `Share a story`, `Post an update`. Active segment is solid navy.
Placeholders by mode:
- question: `What are you trying to figure out?`
- story: `Something you did, went to, or learned, and what someone younger should take from it.`
- update: `A short update for people on a similar path.`
Button label by mode: `Post question`, `Post story`, `Post update`.
Footer row contains, in order: a topic `<select>`, an identity checkbox labelled `Post without my name`, and the post button pushed right with `margin-left:auto`. On screens under 880px the button goes full width and drops to the last line with `order:9`.
Topic options, exact strings: `Subject choice`, `Science and health`, `Technology`, `Building and fixing things`, `Business`, `Creative and media`, `Sport and coaching`, `After CSEC`.
Identity default: checked for `question`, unchecked for `story` and `update`. Switching mode resets it to that default. When checked, the post is attributed as `Form 3 student, Region 4` built from the student's stage and region. When unchecked, it uses their name.
**Duplicate question detection.** Only in question mode, and only once the textarea holds 12 or more characters. On every input, lowercase the text and test it against these keyword sets in order. First set that matches wins.
```js
var DUPE_KEYS=[
  {words:['biology','chemistry','medicine','science','doctor','nursing'], id:'f1'},
  {words:['cape','tvet','gtti','electrical','after csec','trade'],        id:'f8'},
  {words:['sport','coach','academy','lethem','football','cricket'],       id:'f6'},
  {words:['media','film','camera','photograph','design'],                 id:'f11'}
];
```
On a match, render a gold panel directly under the textarea:
- eyebrow: `SOMEONE ALREADY ASKED THIS`
- heading: the matched question's title
- line: `<n> replies, including one from <first reply author>.`
- buttons: `Read that thread` opens that thread sheet, `Ask mine anyway` clears the panel and leaves the draft alone
Posting prepends the new item to the top of the stream, clears the textarea and the duplicate panel, re-renders, and toasts `Question posted.` or `Posted.` An `update` is stored with kind `story` so it shows under the Stories filter, and its byline reads `just now, update`.
Empty submit does not post. It toasts `Write something first.` and focuses the textarea.
### 5.6 Count line
Sits between the composer and the stream, 12.5px, weight 700, colour `--faint`.
- no search, filter is `all`: `12 posts`
- filter active: `4 under questions`
- search active: `3 results for "biology"` and if one, `1 result for "biology"`
### 5.7 Post card
```html
<article class="card item">
  <div class="item-head">
    <span class="avatar">RP</span>
    <div>
      <strong>Raeka Persaud</strong>
      <p class="meta">5h ago &middot; mentor tip</p>
    </div>
  </div>
  <h3>Optional headline</h3>
  <p class="text">Body copy.</p>
  <div class="tagrow"><span class="pill">Science and health</span></div>
  <!-- questions only: first reply preview, then the open thread button -->
  <div class="actions"><button class="btn ghost sm">Read their journey</button></div>
</article>
```
Tag discipline, this is the main cleanup: **one topic pill per card, no more.** The post type is plain text in the byline after a middot, lowercase: `question`, `story`, `update`, `mentor tip`, `opportunity`. It is not a pill. There are no other badges on a post card.
Avatar is 42px, `border-radius:12px`, two letters, weight 800. Navy with white text by default. Gold with navy text for mentor tips. `#dbe4ee` background with `#5b7089` text for anonymous posts, showing one letter.
Question cards show only the **first** reply as a preview: author name in Inter 800 at 14px, then the reply text. Under it a ghost button reading `3 replies` or `1 reply` or `No replies yet` which opens the thread sheet. Do not show a role label on the preview.
### 5.8 Journey card in the stream
Journeys appear as feed items, since there is no Stories tab. Card is `padding:0` with an internal navy header strip.
```html
<article class="card jcard">
  <div class="jhead">
    <span class="avatar gold">RP</span>
    <div><strong>Raeka Persaud</strong><small>Georgetown, Region 4</small></div>
    <div class="age"><b>12</b><small>AT THE TIME</small></div>
  </div>
  <div class="jbody">
    <div class="tagrow">
      <span class="pill gold dot">Mentor</span>
      <span class="pill">Science and health</span>
    </div>
    <p class="hook">Joined the school science club at St Rose's and stayed after every lab to clean glassware.</p>
    <p class="now"><b>NOW</b>Junior doctor at Georgetown Public Hospital. Mentors CSEC science students on weekends.</p>
    <div class="actions">
      <button class="btn">Read their journey</button>
      <button class="btn ghost">Follow</button>
      <button class="btn ghost">Take their steps</button>
    </div>
  </div>
</article>
```
Two pills only: the role (`Mentor` or `Contributor`) on gold with a dot, and the field. The archetype and the "still adding nodes" label come off the card and live on the journey page instead.
```css
.jhead{background:linear-gradient(100deg,var(--navy-deep),var(--navy-mid));color:#fff;padding:16px 20px;
  display:grid;grid-template-columns:46px 1fr auto;gap:13px;align-items:center}
.jhead strong{display:block;font-family:var(--serif);font-size:19px}
.jhead small{display:block;font-size:12.5px;color:#b3cae0;font-weight:600}
.age{text-align:center;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.09);
  border-radius:11px;padding:6px 11px}
.age b{display:block;font-family:var(--serif);font-size:19px;color:var(--gold);line-height:1}
.age small{font-size:8.5px;letter-spacing:.14em;color:#bfd4e6;font-weight:800}
.jbody{padding:16px 20px 19px}
.jbody .hook{font-family:var(--serif);font-weight:600;font-size:19px;line-height:1.32;color:var(--ink);margin:13px 0 0}
.now{margin:11px 0 0;font-size:14px;color:var(--muted)}
.now b{font-size:10.5px;letter-spacing:.14em;color:var(--ochre);font-weight:800;margin-right:7px}
.jbody .actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.jbody .actions .btn:first-child{grid-column:1/-1}
```
`Read their journey` goes to `mentor-story.html?id=<id>` or opens the journey as a sheet, whichever fits the existing routing. `Follow` toggles and swaps its label to `Following` with the gold ghost state. `Take their steps` adds every step from that journey to My Pathway at once and toasts `<n> steps added to your road.` or `You already have all of those.`
### 5.9 Empty state
When search or filter returns nothing: a card with heading `Nothing matches` and body `Clear the search or switch back to Everything. Nothing has been removed.`
---
## 6. Feed content
Replace the existing seed data with this. The copy has been rewritten to read like real posts. Keep the ids, the duplicate detection depends on `f1`, `f6`, `f8`, `f11`.
```js
var FEED=[
  {id:'f1',kind:'question',anon:true,who:'Form 3 student, Region 4',time:'2h ago',tag:'Subject choice',
   title:'If I might want medicine later, do I have to keep Biology and Chemistry in Form 3?',
   replies:[
     {who:'Raeka Persaud',role:'Mentor',text:'Keep both. Some schools let you add Chemistry back in Form 4 and some do not, and you usually find out too late to do anything about it.'},
     {who:'Omar Khan',role:'Mentor',text:'Same thinking on a trade path. Keep whichever subject closes the most doors if you drop it.'},
     {who:'Form 5 student, Region 6',role:'Student',text:'I dropped Chemistry in Form 3 and ended up sitting it privately. It cost me a year.'}
   ]},
  {id:'f2',kind:'opportunity',anon:false,who:'Opportunities desk',init:'OD',time:'2 days ago',tag:'STEM',
   text:'STEMGuyana holiday pods are open for ages 8 to 18 in several regions. Coding, robotics and AI taster weeks, and there is no fee to join.',
   wish:{key:'stem-pod',title:'STEMGuyana holiday pod',note:'Ages 8 to 18, several regions'}},
  {id:'f3',kind:'tip',anon:false,who:'Raeka Persaud',init:'RP',time:'5h ago',tag:'Science and health',journey:'raeka',
   text:'Mocks are rehearsal. If Biology goes badly, start rebuilding from past papers that same week. Do not wait for the final term.'},
  {id:'f4',kind:'story',anon:false,who:'Jerome DaSilva',init:'JD',time:'Yesterday',tag:'Technology',journey:'jerome',
   title:'Went to a developer meetup in Georgetown on Saturday. Three things worth passing on.',
   text:'Nobody asked what school anyone went to. They asked what you had built. Two people picked up contract work from a single page they made for a family business. And the monthly session is free and open to secondary students, which almost nobody in the room seemed to know.',
   wish:{key:'gt-meetup',title:'Georgetown developer meetup',note:'Monthly, open to secondary students'}},
  {id:'f5',kind:'journey',journey:'raeka'},
  {id:'f6',kind:'question',anon:true,who:'Form 2 student, Region 9',time:'5 days ago',tag:'Sport and coaching',
   title:'There is no private academy in Lethem. How do I build a sport pathway that still looks serious?',
   replies:[
     {who:'Keisha Daniels',role:'Contributor',text:'Community leagues, PE subjects, a first aid certificate and a short coaching course. Travel funding is usually the real blocker, so ask about it early.'},
     {who:'Form 4 student, Region 9',role:'Student',text:'I kept a log of every match I helped run. That log is what got me into a regional coaching workshop.'}
   ]},
  {id:'f7',kind:'tip',anon:false,who:'Omar Khan',init:'OK',time:'Yesterday',tag:'Building and fixing things',journey:'omar',
   text:'Keep Maths and English on a trade path. Sites and certificates still ask for both, even when the work is with your hands.'},
  {id:'f8',kind:'question',anon:true,who:'Form 5 student, Region 4',time:'1 week ago',tag:'After CSEC',
   title:'My parents want CAPE. I want GTTi electrical after CSEC. How do we decide without it turning into a fight?',
   replies:[
     {who:'Omar Khan',role:'Mentor',text:'Put both plans on one page. Years, cost, first job, and what happens if it does not work out. TVET stops sounding like giving up once a certificate and a mentor are named.'},
     {who:'Raeka Persaud',role:'Mentor',text:'Staying is right for some gates. Pull the actual entry list for the programme you want and compare it against the other one.'}
   ]},
  {id:'f9',kind:'journey',journey:'omar'},
  {id:'f10',kind:'story',anon:false,who:'Aisha Mohamed',init:'AM',time:'3 days ago',tag:'Business',
   title:'Ran the school stall for a term and kept a cash book.',
   text:'The margin was smaller than I expected, and keeping records turned out to be the actual lesson. I stopped two weeks before exam block, which was the right call, because the stall would have eaten revision time it could not pay back.'},
  {id:'f11',kind:'question',anon:true,who:'Form 4 student, Region 3',time:'4 days ago',tag:'Creative and media',
   title:'People keep telling me media is not a real career in Guyana. What proof should I be collecting?',
   replies:[
     {who:'Marcus Gomes',role:'Contributor',text:'A weekly school reel, three shoots run like client work, and everything delivered on time. Show the work instead of arguing for it.'},
     {who:'Form 5 student, Region 4',role:'Student',text:'Delivering on time is what changed how adults spoke to me about it.'}
   ]}
];
```
---
## 7. Journeys
### 7.1 The naming split
This is a real model change, not a rename. Two different objects:
- **Journey.** The long documented route. Moments, Route, Deep dive, and the take-a-step chips. Only approved mentors and appointed contributors have one. Browsable and followable. This is what `mentor-story.html` renders. Change its `<title>` to `Journey` and every heading and link label from "story" to "journey": `Read their journey`, `What Raeka did`, `Journeys to follow`.
- **Story.** A short post in the feed. A conference writeup, a term of running a stall. Anyone can post one from the composer.
A mentor whose journey is still being added to shows `still adding nodes` on their journey page. A contributor who gave one interview shows `documented`. That label appears on the journey page and in the Following list on My Pathway, not on the feed card.
### 7.2 Journey data shape
```js
{
  id:'raeka', name:'Raeka Persaud', init:'RP',
  role:'Mentor',                 // Mentor | Contributor
  type:'The Steward',            // archetype
  field:'Science and health',
  place:'Georgetown, Region 4',
  age:12,                        // age in the opening moment
  ongoing:true,                  // true renders "still adding nodes"
  hook:'...',                    // the opening moment, one sentence
  now:'...',                     // what they do today
  quote:'...',
  blurb:'...',                   // who they help and how
  moments:[{age:16,text:'...',flag:'Setback'}],
  route:[{stage:'subject',text:'...',lesson:'...'}],
  dive:{title:'...',req:'...',cost:'...',caveat:'...'},
  did:{text:'...',src:'...'},
  steps:[{kind:'Subject',label:'CSEC Biology',stage:'subject'}]
}
```
`stage` on both `route` and `steps` must be one of the six stage keys in section 8.2. This is the mechanism that puts a taken step on the right Form.
`kind` on `steps` is one of `Subject`, `Opportunity`, `Route step`, `Career`. The journey page groups the chips under these as uppercase labels.
Three journeys: `raeka`, `omar`, `jerome`. Keep whatever route, moments and deep dive content the repo already has for Raeka and rewrite it to the copy rules in section 4. Omar Khan is a Berbice electrician who went GTTi rather than CAPE, and Jerome DaSilva is a Georgetown developer who learned on a shared family laptop and is a Contributor with `ongoing:false`. Each needs at least three moments, six route entries covering the six stages where they apply, a deep dive with a requirement, a cost and a caveat, and five or six steps spread across at least four stages.
Raeka's steps, as the reference set:
```js
steps:[
  {kind:'Subject',    label:'CSEC Biology',              stage:'subject'},
  {kind:'Subject',    label:'CSEC Chemistry',            stage:'subject'},
  {kind:'Opportunity',label:'Weekly past paper clinic',  stage:'csec'},
  {kind:'Route step', label:'Join school science club',  stage:'explore'},
  {kind:'Route step', label:'Stay for CAPE Sciences',    stage:'fork'},
  {kind:'Career',     label:'Doctor, clinical pathway',  stage:'led'}
]
```
### 7.3 Journey page order
1. Navy hero: role pill on gold, name as `<h2>`, then `place, archetype, field` comma separated, then the blurb, then a `Follow this journey` button that becomes a ghost `Following` when active.
2. The quote in serif italic at 21px.
3. `NOW` line in ochre small caps followed by what they do today.
4. `MOMENTS` label, then one card per moment. Each has a gold age box reading the number over `AT THE TIME`, then the moment in serif at 17.5px. If `flag` is set, a line under it in `--alert` at 12.5px Inter weight 800.
5. `ROUTE` label, then one card per route entry. Stage label in ochre uppercase reading `Form 3, subject choice`, then the action in serif bold, then the lesson in `--muted` at 13.5px.
6. `DEEP DIVE` label, then one card: institution as `<h3>`, then `Requirement.` and `Cost.` as bold run-in leads, then the caveat in `--muted`. The caveat always tells the student to confirm current requirements with the institution directly.
7. `What <first name> did` card. Line under the heading: `Tap anything to add it to your pathway at the stage where it happens. Tap again to remove it.` Then chips grouped by `kind` under uppercase labels. Then a full width `Add everything <first name> did`.
8. Did you know panel on gold: heading `Did you know`, the fact, then `Source: <src>` at 12.5px.
Nothing else. No prototype disclaimer on this page.
### 7.4 Chip behaviour
Chips are 44px minimum height, pill shaped, white with a `--line` border. Selected state is solid navy with white text and a trailing check. Selection key is `journeyId + ':' + label` so the same label from two journeys does not collide.
Tapping on adds `{key,label,kind,stage,from}` to the pathway and toasts `Added to Form 3, subject choice.` using that step's stage. Tapping off removes it and toasts `Removed from your pathway.` The chip state must survive leaving and returning to the page, so read it back from storage on load.
---
## 8. My Pathway
### 8.1 Order of elements
1. Navy hero
2. Tune prompt card, gold border, hidden once the check is done
3. Profile completeness row
4. `The road ahead` section
5. **`For you` carousel** — section 8.3
6. `Saved` section
7. `Following` section
8. The single prototype disclaimer
Delete the empty `Know exactly what you want?` card that currently renders as a heading with nothing under it. If it was meant to be a collapsed search, either build it properly or leave it out. Leave it out for now.
### 8.2 The road ahead
Six stages, keys and labels exactly:
```js
var STAGES=[
  {key:'explore', name:'Form 1 to 2',          label:'Exploration',    note:'Try things cheaply. Nothing is decided yet.'},
  {key:'subject', name:'Form 3',               label:'Subject choice', note:'What you choose now decides which gates stay open after CSEC.'},
  {key:'csec',    name:'Form 4 to 5',          label:'CSEC',           note:'Sit the papers. Mocks are rehearsal, not judgment.'},
  {key:'fork',    name:'After CSEC',           label:'The fork',       note:'CAPE, TVET or work. Name the gate each path needs.'},
  {key:'special', name:'Form 6 or institute',  label:'Specialise',     note:'Map your units to the exact entry list.'},
  {key:'led',     name:'After that',           label:'Where it led',   note:'The destination is allowed to change.'}
];
```
Vertical timeline. A 2px connector line runs behind the nodes and stops at the last one. Nodes are 34px circles. Stages before the student's current stage are `done`: navy fill, white check. The current stage is `now`: gold fill, navy text, and a 5px `--gold-soft` ring. Later stages are outlined only, numbered.
Each stage shows its name as `<h4>`, then the label in uppercase 11px. The current stage appends `, you are here`. Under that, either the list of steps the student has taken at that stage, or the stage note in a dashed empty box if none.
A taken step renders as a white bordered row: the label in 13.5px, then `<kind>, from <mentor name>` in 11.5px `--faint`, and a `Remove` text button on the right that turns `--alert` on hover.
### 8.3 For you carousel
**Keep this as a horizontally scrolling carousel.** It is the one component that must behave the way it does in the current build. Three activity cards side by side, scrolling sideways, with the next card peeking in from the right edge.
There is a bug in the current build to fix: the third card is clipped mid word by the container edge, so it reads as broken rather than as a deliberate peek. The card must never be cut through its text. Fix it by giving cards a fixed width, letting the rail overflow past the content column with negative margins, and adding scroll padding at both ends.
```html
<section class="foryou">
  <div class="sec-head">
    <div>
      <span class="eyebrow">Because of your next node</span>
      <h3>For you</h3>
      <p>Activities open to you at Form 3, and worth doing before the decision.</p>
    </div>
    <div class="rail-arrows">
      <button class="arrow" id="fyPrev" aria-label="Previous activities">&#8592;</button>
      <button class="arrow" id="fyNext" aria-label="More activities">&#8594;</button>
    </div>
  </div>
  <div class="fy-rail" id="fyRail" tabindex="0" role="group" aria-label="Suggested activities">
    <!-- one .fy-card per activity -->
    <article class="fy-card">
      <h4>STEMGuyana learning pod</h4>
      <p>After school coding and robotics pods in several regions. Low barrier to try digital making.</p>
      <div class="fy-foot">
        <button class="btn ghost sm">Details</button>
        <button class="btn ghost sm" data-save="stem-pod">Save this</button>
      </div>
    </article>
  </div>
  <p class="fy-note" id="fyNote"></p>
</section>
```
```css
.foryou{margin-top:28px}
.rail-arrows{display:flex;gap:7px}
.arrow{width:38px;height:38px;border:1px solid var(--line);background:#fff;border-radius:11px;
  color:#5b7089;font-size:15px;line-height:1}
.arrow:hover{background:#f7fafd;border-color:#cdd8e6}
.arrow[disabled]{opacity:.4;cursor:default}
.fy-rail{
  display:flex;
  gap:13px;
  overflow-x:auto;
  overflow-y:hidden;
  scroll-snap-type:x mandatory;
  scroll-behavior:smooth;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
  /* let the rail bleed past the column so a card can peek without being cut through */
  margin-inline:-18px;
  padding-inline:18px;
  /* keeps the snapped card clear of the bleed edge */
  scroll-padding-inline:18px;
  /* room for the card shadow, otherwise it gets clipped by overflow */
  padding-block:4px 14px;
}
.fy-rail::-webkit-scrollbar{display:none}
.fy-card{
  flex:0 0 clamp(248px,74vw,296px);
  scroll-snap-align:start;
  background:var(--card);
  border:1px solid var(--line);
  border-radius:var(--r-card);
  box-shadow:var(--shadow);
  padding:18px 19px;
  display:flex;
  flex-direction:column;
  min-height:186px;
}
.fy-card h4{font-size:17px;line-height:1.3}
.fy-card p{margin:8px 0 0;font-size:13.5px;color:var(--muted)}
.fy-card .fy-foot{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:14px}
.fy-note{margin:4px 0 0;font-size:12.5px;color:var(--faint);font-weight:600}
@media(max-width:880px){
  .fy-rail{margin-inline:-14px;padding-inline:14px;scroll-padding-inline:14px}
  .rail-arrows{display:none}
}
```
Rules for this rail:
- Cards are equal height because of `min-height` plus `margin-top:auto` on the footer. The action buttons line up across all cards.
- The arrows scroll by one card width plus the gap. Disable `fyPrev` at `scrollLeft <= 0` and `fyNext` when `scrollLeft + clientWidth >= scrollWidth - 1`. Update on `scroll` and on `resize`.
- Arrows are hidden under 880px where touch swipe is the interaction. Keyboard users can still scroll the rail because it is focusable, and the cards' buttons are in the tab order.
- The rail is populated from the activity set for the student's **current stage**, so it changes when the stage changes. Two to four cards per stage.
- `.fy-note` states honestly what is being withheld and who set the limit. Copy: `Six others in the catalogue are not open to Form 3. The age and grade limits are set by the organisers, not by us.` Substitute the real count and the real Form. If nothing is filtered out, leave the note empty.
- `Save this` adds the activity to the Saved list further down and swaps the label to `Saved`.
Activity sets by stage, wording as given:
```js
var FY={
 explore:[
  {t:'STEMGuyana learning pod',d:'After school coding and robotics pods in several regions. Low barrier to try digital making.'},
  {t:"President's Youth Award",d:'Open from age 14 and not a competition. Service, skill and adventure sections build evidence early.'},
  {t:'School club with a record',d:'Any club counts if you keep a log of what you actually did in it.'}
 ],
 subject:[
  {t:'Compare two subject combinations',d:'Put the science one and the technical one side by side, with the gate each keeps open.'},
  {t:'Talk to whoever teaches the subject you might drop',d:'Ask specifically whether it can be added back in Form 4 at your school.'},
  {t:'Regional STEAM fair',d:'The regional round is the entry point. The national fair is the final stage, not where you sign up.'}
 ],
 csec:[
  {t:'Free past paper clinic',d:'Weekly, after school. The mentors who run it are answering questions in your feed.'},
  {t:'Fix the weakest paper first',d:'Pick the subject you would rather avoid and give it the first hour, not the last.'},
  {t:'J.O.F. Haynes debating competition',d:'Entered through your school. Ask the English or Social Studies teacher about the round dates.'}
 ],
 fork:[
  {t:'GTTi and CAPE on one page',d:'Years, cost, first job and backup for each. The comparison is what ends the argument at home.'},
  {t:'Find the gate, not the school',d:'Pull the entry list for the programme you want and work backwards from it.'}
 ],
 special:[
  {t:'Match your units to the entry list',d:'Check the published requirement for this cycle rather than last year.'},
  {t:'Line up one reference early',d:'Whoever writes it needs months of you, not a week.'}
 ],
 led:[
  {t:'Contribute your own journey',d:'The route you just walked is the one somebody in Form 2 is looking for.'},
  {t:'Keep one node ahead',d:'The destination can change. The habit of planning is what carries.'}
 ]
};
```
### 8.4 Hero, profile, Saved, Following
**Hero.** Eyebrow `MY PATHWAY` in gold, `You` as an `<h2>` at 38px, then a subline reading `The Steward, Form 3, Region 4` or just `Form 3, Region 4` before the check. Then three stat pills: `<n> steps taken`, `<n> journeys followed`, `<n> saved`. Singular and plural both handled.
**Profile row.** A 52px conic gradient ring showing a percentage with a white inner circle, then `Your profile` and a subline, then an `Update` button that opens the check. Score it: 35 for taking the check, 8 per step taken capped at 40, 7 per journey followed capped at 15, 5 per saved item capped at 10. Subline is `Nothing set yet.` at zero, otherwise `<n> steps on your road, <n> journeys followed.`
**Saved.** Rows of title plus note with a `Remove` ghost button. Empty state: `Nothing saved yet. When a story mentions a programme or event, save it here.`
**Following.** Rows with a gold initials tile, the name, and `<field>, still adding nodes` or `<field>, documented`, plus an `Open` button going to that journey. Empty state: `Follow a journey from the feed and new nodes show up here.`
---
## 9. The three question check
Replaces the longer self-check as the tuning step. It is a sheet, not a page.
Question 1 sets the stage. Options and the stage index each sets: `Form 1 or 2` to 0, `Form 3` to 1, `Form 4 or 5` to 2, `Finished CSEC` to 3. Subtitles: `Still working out what I like.`, `Choosing subjects.`, `CSEC is close.`, `Deciding what comes next.`
Questions 2 and 3 set the archetype. Question 2 is `When something in front of you is broken, what do you do?` with `Take it apart` for The Artisan, `Check on whoever it affected` for The Steward, `Argue for a better rule` for The Advocate, `Build the replacement` for The Pioneer. Question 3 is `How would you rather spend a free Saturday?` with the same four archetypes: making or fixing something with your hands, helping someone who needs it, organising people around something that matters, starting something nobody asked for yet.
Archetype is whichever type is picked most across questions 2 and 3. On a tie, take the answer to question 3. Fall back to `The Explorer` if neither carries a type.
Progress is three thin bars at the top, filled in gold up to the current question. An eyebrow reads `QUESTION 2 OF 3`.
The result screen says `You read as The Steward, at Form 3.` then: `That changes the order of your feed and what shows up under your next node. Nobody is removed, and you can redo this whenever it stops fitting.` Buttons: `See my feed` and `Open My Pathway`.
Completing it sets `nsg_tuned`, hides the tune strip on the feed and the prompt card on My Pathway, updates the header pill, sets the current stage on the road, and re-renders the For you carousel from the new stage.
**Cold start matters here.** The feed is the landing page and it must be fully usable before the check is taken. Untaken means the stream renders in posted order, the header pill shows only the Form and Region, and the count line says `12 posts`. Nothing is gated and nothing is hidden.
---
## 10. Shared behaviour
**Sheets.** Full height overlay, scrim `rgba(6,20,36,.66)`, panel `min(760px,100%)` on a `--paper` background with a sticky bar carrying the title and a round close button. Closes on the button, on scrim click, and on Escape. Lock `body` scroll while open and restore it on close. Entry animation is a 14px rise over .26s, suppressed under `prefers-reduced-motion: reduce`.
**Toasts.** Centred, 96px off the bottom so the dock does not cover them, navy `--navy-deep` background, 2.4s, `role="status"` with `aria-live="polite"`. One at a time, each new one cancels the last.
**Threads.** The question, then every reply in the order written, then a reply box. Reply author in serif 17px, role in the `.meta` style under it, then the text. Posting a reply appends it as `Form 3 student, Region 4` with role `Student`, re-renders both the thread and the feed, and toasts `Reply posted.` No vote controls anywhere, and no note explaining why there are none.
**Right rail, 1120px and up.** Two cards. `Threads moving now` lists the first four questions by title with a reply count, each opening its thread. `Journeys to follow` lists the three journeys with a Follow toggle. No footnotes under either card. Below 1120px the rail is hidden entirely. Below 880px the left rail is hidden and the dock appears.
---
## 11. Acceptance checklist
Work through this and report each line.
1. Two tabs only. `stories.html` and `questions.html` are gone and nothing links to them.
2. `feed.html` is the default route and renders fully before the check is taken.
3. `feed.html?filter=question` lands with the Questions chip active.
4. Search sits above the composer, and filtering by chip and typing in search combine.
5. Zero U+2014 and U+2013 characters in any text node across all files.
6. Every post card carries exactly one topic pill. The post type is plain byline text, not a pill.
7. Journey cards carry exactly two pills: role and field.
8. The removed notes are gone: no upvote panel, no order-of-replies note, no "Here because" lines, no Reviewed badges, one disclaimer total.
9. The logo is the repo's own asset, unchanged.
10. The My Pathway For you section still scrolls horizontally, snaps per card, and no card is ever clipped through its text at any width from 320px to 1440px.
11. Arrow buttons scroll the rail one card and disable correctly at both ends. Hidden under 880px.
12. Tapping a chip on Raeka's journey puts that step on the right stage on My Pathway. `Join school science club` goes to Form 1 to 2, `Stay for CAPE Sciences` goes to After CSEC.
13. A refresh keeps taken steps, follows, saved items, archetype and stage.
14. Typing `should I keep chemistry for medicine` in the composer surfaces the existing thread and offers both `Read that thread` and `Ask mine anyway`.
15. Keyboard: every control reachable, focus ring visible, Escape closes any sheet.
16. Contrast: gold buttons use navy text, never white. Check every gold surface against its text at 4.5:1.
17. Touch targets 44px minimum on all chips, filters, dock items and card buttons.
18. No horizontal page scroll at 320px.
