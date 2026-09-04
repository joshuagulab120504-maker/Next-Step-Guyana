/* Views, pathway, wiring. Depends on app-core.js + data. ES5. No em/en dashes. */

var SETUP_QS = [
  {
    q: 'Where are you in school right now?',
    hint: 'This sets the shape of your timeline and which decisions are actually near.',
    key: 'stage',
    opts: [
      { v: 'explore', label: 'Form 1 or 2', sub: 'Still working out what I like', form: 'Form 1 to 2' },
      { v: 'subject', label: 'Form 3', sub: 'Choosing subjects this year', form: 'Form 3' },
      { v: 'csec', label: 'Form 4 or 5', sub: 'CSEC is the thing in front of me', form: 'Form 4 to 5' },
      { v: 'fork', label: 'Finished CSEC', sub: 'Deciding what comes next', form: 'After CSEC' }
    ]
  },
  {
    q: 'Which region are you in?',
    hint: 'Sessions, travel costs and which programmes actually reach you all depend on this.',
    key: 'region',
    opts: [
      { v: 'Region 4', label: 'Region 4', sub: 'Georgetown and East Coast' },
      { v: 'Region 6', label: 'Region 6', sub: 'Berbice' },
      { v: 'Region 3 or 2', label: 'Region 3 or 2', sub: 'West Demerara, Essequibo' },
      { v: 'Region 9, 8, 7 or 1', label: 'Region 9, 8, 7 or 1', sub: 'Hinterland' }
    ]
  },
  {
    q: 'When you picture life after school, which is closest?',
    hint: 'Not a commitment. It only decides which routes get compared first.',
    key: 'goal',
    opts: [
      { v: 'uni', label: 'University, here or abroad', sub: '' },
      { v: 'trade', label: 'A trade or technical certificate', sub: '' },
      { v: 'earn', label: 'Earning as soon as I can', sub: '' },
      { v: 'own', label: 'Running something of my own', sub: '' },
      { v: 'range', label: 'No idea yet', sub: 'Show me a range' }
    ]
  },
  {
    q: 'What matters most in the next twelve months?',
    hint: 'This is what your suggestions get weighted toward.',
    key: 'priority',
    opts: [
      { v: 'grades', label: 'Getting my grades up', sub: '' },
      { v: 'options', label: 'Keeping my options open', sub: '' },
      { v: 'try', label: 'Finding out if I actually like a field', sub: '' },
      { v: 'money', label: 'Money and cost', sub: '' },
      { v: 'home', label: 'Being taken seriously at home', sub: '' }
    ]
  },
  {
    q: 'What is most in your way?',
    hint: 'Say the real one. It changes what gets suggested more than your goal does.',
    key: 'blocker',
    opts: [
      { v: 'nobody', label: 'Nobody to ask', sub: 'No one around me has done this' },
      { v: 'cost', label: 'Cost or transport', sub: 'Getting there, or paying for it' },
      { v: 'dropped', label: 'I already dropped a subject I might need', sub: '' },
      { v: 'nothing', label: 'Nothing runs where I live', sub: '' },
      { v: 'time', label: 'Time, between school and home', sub: '' }
    ]
  },
  {
    q: 'When something in front of you is broken, what do you do?',
    hint: 'Last one. This shapes whose journeys reach you first.',
    key: 'archetype',
    opts: [
      { v: 'The Artisan', label: 'Take it apart', sub: 'The Artisan' },
      { v: 'The Steward', label: 'Check on whoever it affected', sub: 'The Steward' },
      { v: 'The Advocate', label: 'Argue for a better rule', sub: 'The Advocate' },
      { v: 'The Pioneer', label: 'Build the replacement', sub: 'The Pioneer' }
    ]
  }
];

var GOAL_LABEL = {
  uni: 'a university route',
  trade: 'a trade or technical certificate',
  earn: 'earning as soon as you can',
  own: 'running something of your own',
  range: 'a range of routes'
};

var BLOCKER_LABEL = {
  nobody: 'nobody nearby who has done this',
  cost: 'cost or transport in the way',
  dropped: 'a subject you already dropped',
  nothing: 'little running where you live',
  time: 'time split between school and home'
};

function mentorMatchReason(id) {
  var g = S.goal;
  var map = {
    raeka: {
      uni: 'Walked the academic route you are weighing, and can name the cost.',
      trade: 'Useful counterweight: chose to stay academic and can say what it cost.',
      earn: 'Can show where medicine delayed earnings, and where it paid later.',
      own: 'Clinic work is employment first, but the decision pattern transfers.',
      range: 'A clear academic path for comparing against the others.'
    },
    omar: {
      uni: 'Useful counterweight: kept a trade open when school pushed university only.',
      trade: 'Built a trade route with proof before the certificate arrived.',
      earn: 'Earned while training. Knows what that schedule costs.',
      own: 'Runs crews. Can talk about independence without calling it a start-up.',
      range: 'A concrete trade path you can put next to school routes.'
    },
    jerome: {
      uni: 'Built proof before credentials. Useful if applications feel closed.',
      trade: 'Self-taught path that still ended in paid work.',
      earn: 'Started shipping work before a degree finished.',
      own: 'Treats projects like products. Close to running your own thing.',
      range: 'A pioneer route that skips waiting for permission.'
    },
    keisha: {
      uni: 'Hinterland route into teaching. Shows how location changes the plan.',
      trade: 'Organising and coaching as skilled work, not a soft side option.',
      earn: 'Funded travel by logging every session she ran.',
      own: 'Built a programme where nothing was organised.',
      range: 'A Region 9 path that keeps sport and study in the same frame.'
    }
  };
  return (map[id] && map[id][g]) || 'Matched to the way you approach decisions.';
}

function pathwaySubtitle() {
  return (
    S.archetype +
    ', ' +
    S.form +
    ', ' +
    S.region +
    '. Pointed at ' +
    (GOAL_LABEL[S.goal] || 'a range of routes') +
    ', with ' +
    (BLOCKER_LABEL[S.blocker] || 'real constraints') +
    '.'
  );
}

function finishSetup() {
  var d = S.setupDraft;
  S.onboarded = true;
  S.stage = d.stage;
  S.form = d.form || stageByKey(d.stage).name;
  S.region = d.region;
  S.goal = d.goal;
  S.priority = d.priority;
  S.blocker = d.blocker;
  S.archetype = d.archetype;
  S.setupStep = 0;
  hideSheetUi();
  S.view = 'pathway';
  S.unread = 0;
  render();
  toast('Pathway built. Your timeline starts at ' + S.form + '.');
}

function renderSetup(step) {
  var q = SETUP_QS[step];
  if (!q) {
    finishSetup();
    return { crumb: 'Setup', title: 'Done', html: '' };
  }
  var pct = Math.round(((step + 1) / SETUP_QS.length) * 100);
  var html =
    '<div class="setup">' +
    '<div class="prog"><span style="width:' +
    pct +
    '%"></span></div>' +
    '<p class="eyebrow">Question ' +
    (step + 1) +
    ' of 6</p>' +
    '<h2>' +
    esc(q.q) +
    '</h2>' +
    '<p class="hint">' +
    esc(q.hint) +
    '</p>' +
    '<div class="opt-list">';
  var i, o;
  for (i = 0; i < q.opts.length; i++) {
    o = q.opts[i];
    var selected = S.setupDraft[q.key] === o.v;
    html +=
      '<button type="button" class="opt' +
      (selected ? ' on' : '') +
      '" data-setup-key="' +
      esc(q.key) +
      '" data-setup-val="' +
      esc(o.v) +
      '" data-setup-form="' +
      esc(o.form || '') +
      '"><strong>' +
      esc(o.label) +
      '</strong>' +
      (o.sub ? '<span>' + esc(o.sub) + '</span>' : '') +
      '</button>';
  }
  html += '</div>';
  if (step > 0) {
    html +=
      '<button type="button" class="btn g sm" data-setup-back="1">Back</button>';
  }
  html += '</div>';
  return {
    crumb: 'Setup',
    title: 'Build my pathway',
    html: html,
    after: function () {
      byId('sheet-back').hidden = step < 1;
    }
  };
}

function renderPathwayBlank() {
  var waiting = S.taken.length;
  return (
    '<div class="page-path">' +
    '<div class="path-hero">' +
    '<p class="eyebrow">You</p>' +
    '<h1>Nothing set up yet</h1>' +
    '<div class="stat-pills"><span class="p">' +
    waiting +
    ' steps waiting</span><span class="p">' +
    S.booked.length +
    ' sessions</span><span class="p">' +
    S.saved.length +
    ' saved</span></div>' +
    '</div>' +
    '<div class="card gold-edge">' +
    '<h2>This page is empty on purpose.</h2>' +
    '<p>Six questions about where you are and what is in your way. It builds your timeline, marks the decisions that are actually near, and points you at sessions worth sitting in.</p>' +
    (waiting
      ? '<p class="muted">' +
        waiting +
        ' item' +
        (waiting === 1 ? '' : 's') +
        ' already waiting to land on your timeline once setup is done.</p>'
      : '') +
    '<button type="button" class="btn" data-open="setup" data-id="0">Build my pathway</button>' +
    '</div>' +
    '<div class="card">' +
    '<h2>Meanwhile. The feed works without any of this.</h2>' +
    '<p>Read journeys, open an opportunity, ask a question. Anything you take lands here once your timeline exists.</p>' +
    '<button type="button" class="btn g" data-goto="feed">Go to the feed</button>' +
    '</div></div>'
  );
}

function renderTimeline() {
  var cur = stageIndex(S.stage);
  var html = '<section class="section"><h2>Your timeline</h2><div class="timeline">';
  var i, st, steps, j, t;
  for (i = 0; i < STAGES.length; i++) {
    st = STAGES[i];
    html += '<div class="tl-item' + (i === cur ? ' here' : '') + (i < cur ? ' done' : '') + '">';
    if (i < cur) html += '<div class="node done">' + iconCheck() + '</div>';
    else if (i === cur) html += '<div class="node cur"></div>';
    else html += '<div class="node">' + (i + 1) + '</div>';
    html += '<div class="tl-body"><h3>' + esc(st.name);
    if (i === cur) html += '<span class="here-lab">, you are here</span>';
    html += '</h3><p class="muted">' + esc(st.label) + '</p>';
    if (i >= cur) {
      html +=
        '<div class="dec-box"><p class="eyebrow">Key decision</p><p>' +
        esc(st.dec.t) +
        '</p></div>';
    }
    steps = S.taken.filter(function (x) {
      return x.stage === st.key;
    });
    if (steps.length) {
      for (j = 0; j < steps.length; j++) {
        t = steps[j];
        html +=
          '<div class="taken-row"><span class="p">' +
          esc(t.kind) +
          '</span> ' +
          esc(t.label) +
          (t.from ? ' <span class="muted">from ' + esc(t.from) + '</span>' : '') +
          ' <button type="button" class="btn q" data-untake="' +
          esc(t.key) +
          '">Remove</button></div>';
      }
    } else if (i >= cur) {
      html += '<div class="tl-empty">Nothing here yet</div>';
    }
    html += '</div></div>';
  }
  html += '</div></section>';
  return html;
}

function renderPathway() {
  if (!S.onboarded) return renderPathwayBlank();
  var st = stageByKey(S.stage);
  var days = daysUntil(st.dec.due);
  var html = '<div class="page-path">';
  html +=
    '<div class="path-hero onboarded"><p class="eyebrow">You</p><h1>' +
    esc(S.archetype) +
    '</h1><p class="subline">' +
    esc(pathwaySubtitle()) +
    '</p>';
  html +=
    '<div class="stat-pills"><span class="p">' +
    S.taken.length +
    ' steps</span><span class="p">' +
    S.booked.length +
    ' sessions</span><span class="p">' +
    S.saved.length +
    ' saved</span></div></div>';

  /* 1 Next decision */
  html += '<section class="section card next-dec">';
  if (days != null) {
    html += '<div class="day-box"><div class="n">' + days + '</div><div class="l">days</div></div>';
  } else {
    html += '<div class="day-box"><div class="n">..</div><div class="l">open</div></div>';
  }
  html +=
    '<div><p class="eyebrow">Your next decision</p><h2>' +
    esc(st.dec.t) +
    '</h2><p>' +
    esc(st.dec.why) +
    '</p>' +
    caveatCalendar() +
    '<div class="card-actions">' +
    '<button type="button" class="btn sm" data-ask-seed="About ' +
    esc(st.dec.t.toLowerCase()) +
    ': " data-ask-cat="Subject choice">Ask about this</button>' +
    '<button type="button" class="btn sm g" data-open="sessions" data-id="' +
    esc(S.stage) +
    '">Find a session on it</button>' +
    '</div></div></section>';

  html += renderTimeline();

  /* 3 Open to you now */
  var open = [];
  var closed = 0;
  var k, o, i;
  for (k in OPPS) {
    if (!OPPS.hasOwnProperty(k)) continue;
    o = OPPS[k];
    if (oppOpenAtStage(o, S.stage)) open.push(o);
    else closed++;
  }
  html +=
    '<section class="section"><h2>Open to you now</h2><div class="carousel">';
  for (i = 0; i < open.length; i++) {
    o = open[i];
    html +=
      '<div class="card car-card">' +
      (o.independent ? '<span class="p green">Enter yourself</span>' : '') +
      '<h3>' +
      esc(o.name) +
      '</h3><p class="muted">' +
      esc(o.one) +
      '</p>' +
      '<div class="card-actions">' +
      '<button type="button" class="btn sm" data-take-opp="' +
      esc(o.id) +
      '">Add to plan</button>' +
      '<button type="button" class="btn sm g" data-open="opp" data-id="' +
      esc(o.id) +
      '">Details</button></div></div>';
  }
  html +=
    '</div><p class="muted">' +
    closed +
    ' others are in the catalogue but not open at ' +
    esc(S.form) +
    '. The limits are set by the organisers, not by us.</p></section>';

  /* 4 Well rounded five */
  var filled = 0;
  html +=
    '<section class="section"><h2>The well rounded five</h2><div class="slots">';
  for (i = 0; i < SLOTS.length; i++) {
    var sl = SLOTS[i];
    var on = !!S.slots[sl.k];
    if (on) filled++;
    html +=
      '<button type="button" class="slot' +
      (on ? ' on' : '') +
      '" data-slot="' +
      esc(sl.k) +
      '"><strong>' +
      esc(sl.t) +
      '</strong><span>' +
      esc(sl.hint) +
      '</span>' +
      (on ? ' ' + iconCheck() : '') +
      '</button>';
  }
  html +=
    '</div><p class="muted">' +
    filled +
    ' of 5 filled. This is the Ministry of Education\'s own checklist for what a student should leave school with, and it is the part scholarship applications ask about.</p></section>';

  /* 5 Sessions */
  html += '<section class="section"><h2>Sessions</h2>';
  var bookedFirst = [];
  var matched = [];
  for (i = 0; i < SESSIONS.length; i++) {
    var sess = SESSIONS[i];
    if (S.booked.indexOf(sess.id) !== -1) bookedFirst.push(sess);
    else if (sess.stages.indexOf(S.stage) !== -1) matched.push(sess);
  }
  var allS = bookedFirst.concat(matched);
  if (!allS.length) html += '<p class="muted">No sessions matched yet.</p>';
  for (i = 0; i < allS.length; i++) {
    html += renderSessionMini(allS[i]);
  }
  html += '</section>';

  /* 6 Mentorship */
  html += '<section class="section"><h2>Mentorship</h2>';
  var mentors = ['raeka', 'omar', 'jerome', 'keisha'];
  for (i = 0; i < mentors.length; i++) {
    html += mentorRow(mentors[i], mentorMatchReason(mentors[i]));
  }
  html += '</section>';

  /* 7 One to one */
  var c1 = S.taken.length >= 2;
  var c2 = S.booked.length >= 1;
  var mineCount = 0;
  for (i = 0; i < FEED.length; i++) if (FEED[i].mine) mineCount++;
  var c3 = mineCount >= 1;
  var unlocked = c1 && c2 && c3;
  html +=
    '<section class="section card"><h2>One to one</h2>' +
    '<ul class="check-list">' +
    '<li class="' +
    (c1 ? 'ok' : '') +
    '">Two steps on the timeline</li>' +
    '<li class="' +
    (c2 ? 'ok' : '') +
    '">One session booked</li>' +
    '<li class="' +
    (c3 ? 'ok' : '') +
    '">One question or story posted</li></ul>' +
    '<p class="muted">A one to one is the scarcest thing here, so it opens after you have used the group layer. This is not a ranking of you. It is how a handful of mentors reach hundreds of students.</p>' +
    '<button type="button" class="btn" id="oto-btn"' +
    (unlocked ? '' : ' disabled') +
    '>' +
    (S.oneToOne ? 'Request sent' : 'Request a one to one') +
    '</button></section>';

  /* 8 Your posts */
  html += '<section class="section"><h2>Your posts</h2>';
  var anyMine = false;
  for (i = 0; i < FEED.length; i++) {
    if (!FEED[i].mine) continue;
    anyMine = true;
    var it = FEED[i];
    html +=
      '<div class="card mini-post"><div class="pill-row"><span class="p">' +
      esc(it.kind) +
      '</span><span class="p">' +
      esc(it.cat) +
      '</span>' +
      (it.anon ? '<span class="p">Anonymous</span>' : '') +
      (it.edited ? '<span class="p">Edited</span>' : '') +
      (it.newReply ? '<span class="p red">New reply</span>' : '') +
      '</div><p>' +
      esc(it.title || (it.body && it.body[0]) || '') +
      '</p>' +
      '<p class="muted">' +
      (it.replies ? it.replies.length : 0) +
      ' replies</p>' +
      '<button type="button" class="btn q" data-edit="' +
      esc(it.id) +
      '">Edit</button>' +
      '<button type="button" class="btn q" data-del="' +
      esc(it.id) +
      '">Delete</button></div>';
  }
  if (!anyMine) html += '<p class="muted">Nothing posted yet.</p>';
  html += '</section>';

  /* 9 Inspired */
  html +=
    '<section class="section"><h2>What inspired you</h2><p class="muted">Stories you marked. Raw material for when someone asks you to write about yourself.</p>';
  if (!S.inspired.length) html += '<p class="muted">None yet.</p>';
  for (i = 0; i < S.inspired.length; i++) {
    var story = feedById(S.inspired[i]);
    if (!story) continue;
    var au = author(story.author);
    html +=
      '<button type="button" class="card clickable row-btn" data-open="story" data-id="' +
      esc(story.id) +
      '"><strong>' +
      esc(story.title) +
      '</strong><span class="muted">' +
      esc(au.name) +
      ', ' +
      esc(au.pos) +
      '</span></button>';
  }
  html += '</section>';

  /* 10 Saved */
  html += '<section class="section"><h2>Saved</h2>';
  if (!S.saved.length) html += '<p class="muted">Nothing saved.</p>';
  for (i = 0; i < S.saved.length; i++) {
    o = OPPS[S.saved[i]];
    if (!o) continue;
    html +=
      '<div class="card row-between"><div><strong>' +
      esc(o.name) +
      '</strong><p class="muted">' +
      esc(o.cat) +
      '</p></div>' +
      '<button type="button" class="btn sm" data-open="opp" data-id="' +
      esc(o.id) +
      '">Open</button></div>';
  }
  html += '</section>';

  html +=
    '<button type="button" class="btn g" data-open="setup" data-id="0">Redo my setup</button>';
  html +=
    '<p class="footer-note">Dates, fees and requirements are illustrative in this prototype and must be confirmed with the organiser.</p>';
  html += '</div>';
  return html;
}

function renderSessionMini(s) {
  var left = Math.max(0, s.seats - s.taken);
  return (
    '<div class="card sess-mini">' +
    '<div class="date-box"><div class="d">' +
    esc(s.date) +
    '</div><div class="w">' +
    esc(s.day) +
    '</div></div>' +
    '<div class="sess-main">' +
    '<h3>' +
    esc(s.title) +
    '</h3><p class="muted">' +
    esc(s.when) +
    ' · ' +
    left +
    ' left</p>' +
    (S.booked.indexOf(s.id) !== -1 ? '<span class="p green">Booked</span> ' : '') +
    '<button type="button" class="btn sm" data-open="session" data-id="' +
    esc(s.id) +
    '">Open</button></div></div>'
  );
}

function mentorRow(id, reason) {
  var a = author(id);
  return (
    '<button type="button" class="card mentor-row clickable" data-open="mentor" data-id="' +
    esc(id) +
    '">' +
    avatarHtml(a, false) +
    '<div><strong>' +
    esc(a.name) +
    '</strong><p class="muted">' +
    esc(a.pos) +
    '</p><p class="reason">' +
    esc(reason || '') +
    '</p></div></button>'
  );
}

function similarReason(id) {
  var map = {
    raeka: 'Also chose to stay academic when it was not obvious.',
    omar: 'Also had to keep a subject he nearly dropped.',
    jerome: 'Also built proof before anyone gave him a credential.',
    keisha: 'Also started where nothing was organised.',
    marcus: 'Also had to prove a creative route was real.'
  };
  return map[id] || '';
}

/* ---------- DETAIL VIEWS ---------- */

function viewThread(v) {
  var item = feedById(v.id);
  if (!item) return { crumb: 'Thread', title: 'Missing', html: '<p>Not found.</p>' };
  ensureReplyIds(item);
  if (item.mine && item.newReply) {
    item.newReply = false;
    if (S.unread > 0) S.unread -= 1;
  }
  pushRecent('thread', item.id, item.title);
  var anon = !!item.anon || !item.author;
  var a = item.author ? author(item.author) : null;
  var name = anon ? item.who || youName() : a && a.name ? a.name : youName();
  var html = '<div class="detail">';
  html +=
    '<div class="card"><div class="card-head">' +
    avatarHtml(a, anon) +
    '<div class="meta"><div class="name">' +
    esc(name) +
    '</div><div class="sub">' +
    esc(item.time || '') +
    '</div></div></div>';
  html +=
    '<p class="muted">' +
    (item.asks || 0) +
    ' students asked something like this</p>';
  html += '<h2 class="t25">' + esc(item.title) + '</h2>';
  html +=
    '<div class="pill-row">' +
    pill(item.cat, 'dot', 'data-topic="' + esc(item.cat) + '"') +
    '<span class="p blue">Asked at ' +
    esc(item.askedAt || 'Form 3') +
    '</span></div>';
  if (item.mine) {
    html +=
      '<div class="flag-row"><button type="button" class="btn q" data-edit="' +
      esc(item.id) +
      '">Edit</button><button type="button" class="btn q" data-del="' +
      esc(item.id) +
      '">Delete</button></div>';
  }
  html += '</div>';
  html +=
    '<p class="reply-label">' +
    (item.replies ? item.replies.length : 0) +
    ' replies, in the order they were written</p>';
  var i, r, ra;
  for (i = 0; i < (item.replies || []).length; i++) {
    r = item.replies[i];
    ra = r.a ? author(r.a) : { name: r.who || 'Student', init: '?', pos: '', system: true };
    html +=
      '<div class="card reply-card" id="reply-' +
      esc(r.id) +
      '">' +
      avatarHtml(ra, !r.a) +
      '<div class="reply-body"><strong>' +
      esc(ra.name) +
      '</strong><p class="muted">' +
      esc(ra.pos || '') +
      '</p><p>' +
      esc(r.text) +
      '</p><div class="flag-row">';
    if (r.a) {
      html +=
        '<button type="button" class="btn sm g" data-open="mentor" data-id="' +
        esc(r.a) +
        '">Profile</button>';
    }
    if (r.mine) {
      html +=
        '<button type="button" class="btn q" data-del-reply="' +
        esc(item.id) +
        '" data-rid="' +
        esc(r.id) +
        '">Delete reply</button>';
    }
    html += '</div></div></div>';
  }
  html +=
    '<div class="card reply-composer"><label class="field-label" for="thread-reply">Add a reply</label>' +
    '<textarea id="thread-reply" rows="3" placeholder="One clear point is enough"></textarea>' +
    '<button type="button" class="btn sm" data-thread-reply="' +
    esc(item.id) +
    '">Post reply</button></div>';
  if (item.opp && OPPS[item.opp]) {
    html += miniOpp(OPPS[item.opp]);
  }
  if (item.sess) {
    var ss = sessionById(item.sess);
    if (ss) html += renderSessionMini(ss);
  }
  var answered = false;
  html += '<section><h3>Who answered</h3>';
  var seen = {};
  for (i = 0; i < (item.replies || []).length; i++) {
    if (item.replies[i].a && !seen[item.replies[i].a]) {
      seen[item.replies[i].a] = true;
      answered = true;
      html += mentorRow(item.replies[i].a, '');
    }
  }
  if (!answered) html += '<p class="muted">No mentor replies yet.</p>';
  html += '</section>';
  html += '<section><h3>Students asked these next</h3>';
  var nextN = 0;
  for (i = 0; i < (item.rel || []).length; i++) {
    var rel = feedById(item.rel[i]);
    if (rel) {
      nextN++;
      html +=
        '<button type="button" class="card clickable row-btn" data-open="thread" data-id="' +
        esc(rel.id) +
        '">' +
        esc(rel.title) +
        '</button>';
    }
  }
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].kind === 'question' && FEED[i].cat === item.cat && FEED[i].id !== item.id) {
      nextN++;
      html +=
        '<button type="button" class="card clickable row-btn" data-open="thread" data-id="' +
        esc(FEED[i].id) +
        '">' +
        esc(FEED[i].title) +
        '</button>';
      break;
    }
  }
  if (!nextN) html += '<p class="muted">No related questions yet.</p>';
  html += '</section>';
  html += askAboutBlock('About ' + item.title + ': ', item.cat);
  html += '</div>';
  return { crumb: 'Question', title: item.title, html: html };
}

function miniOpp(o) {
  return (
    '<button type="button" class="card clickable opp-mini" data-open="opp" data-id="' +
    esc(o.id) +
    '"><span class="p blue">Opportunity</span><strong>' +
    esc(o.name) +
    '</strong><p class="muted">' +
    esc(o.one) +
    '</p></button>'
  );
}

function viewStory(v) {
  var item = feedById(v.id);
  if (!item) return { crumb: 'Story', title: 'Missing', html: '<p>Not found.</p>' };
  pushRecent('story', item.id, item.title);
  var mine = !!item.mine;
  var anon = !!item.anon;
  var a = !mine && item.author ? author(item.author) : null;
  var j = !mine && item.author ? JOURNEYS[item.author] : null;
  var name = mine ? (anon ? studentLabel() : youName()) : a.name;
  var pos = mine ? '' : a.pos || '';
  var html = '<div class="detail">';
  html +=
    '<div class="card"><div class="card-head">' +
    avatarHtml(a, mine || anon) +
    '<div class="meta"><div class="name">' +
    esc(name) +
    '</div><div class="sub">' +
    esc(pos) +
    '</div></div>';
  if (!mine && a) {
    html +=
      '<button type="button" class="btn sm g" data-follow="' +
      esc(item.author) +
      '">' +
      (isFollowing(item.author) ? 'Following' : 'Follow') +
      '</button>';
  }
  html +=
    '</div>' +
    '<h2 class="t27">' +
    esc(item.title) +
    '</h2>' +
    pill(item.cat, 'dot', 'data-topic="' + esc(item.cat) + '"');
  if (mine) {
    html +=
      '<div class="flag-row"><span class="p green">Your post</span>' +
      (item.edited ? '<span class="p">Edited</span>' : '') +
      '<button type="button" class="btn q" data-edit="' +
      esc(item.id) +
      '">Edit</button>' +
      '<button type="button" class="btn q" data-del="' +
      esc(item.id) +
      '">Delete</button></div>';
  }
  html += '</div>';
  html += '<div class="card article">';
  var i;
  for (i = 0; i < item.body.length; i++) {
    html += '<p' + (i === 0 ? ' class="drop"' : '') + '>' + esc(item.body[i]) + '</p>';
  }
  html +=
    '<button type="button" class="btn g" data-inspire="' +
    esc(item.id) +
    '">' +
    iconHeart() +
    ' Inspired me · ' +
    (item.insp || 0) +
    '</button></div>';
  if (item.takeaways && item.takeaways.length) {
    html += '<section class="card"><h3>What to take from it</h3><ul class="tips">';
    for (i = 0; i < item.takeaways.length; i++) {
      html += '<li>' + iconCheck() + ' ' + esc(item.takeaways[i]) + '</li>';
    }
    html +=
      '</ul><button type="button" class="btn sm" data-take-story="' +
      esc(item.id) +
      '">Put these on my pathway</button></section>';
  }
  if (!mine && a) {
    html +=
      '<button type="button" class="card clickable" data-open="mentor" data-id="' +
      esc(item.author) +
      '"><p class="eyebrow">The person behind it</p>' +
      avatarHtml(a, false) +
      '<strong>' +
      esc(a.name) +
      '</strong><p class="muted">' +
      esc(a.pos) +
      (j ? ' · ' + esc(j.place) : '') +
      '</p>' +
      (j ? '<p class="muted">' + esc(j.type) + ' · ' + esc(j.blurb) + '</p>' : '') +
      '<p>See their full journey, stories and answers</p></button>';
  }
  if (item.opp && OPPS[item.opp]) html += miniOpp(OPPS[item.opp]);
  if (item.sess) {
    var ss = sessionById(item.sess);
    if (ss) html += renderSessionMini(ss);
  }
  if (!mine && a) {
    html += '<section><h3>More from ' + esc(a.name.split(' ')[0]) + '</h3>';
    for (i = 0; i < FEED.length; i++) {
      if (FEED[i].kind === 'story' && FEED[i].author === item.author && FEED[i].id !== item.id) {
        html +=
          '<button type="button" class="card clickable row-btn" data-open="story" data-id="' +
          esc(FEED[i].id) +
          '">' +
          esc(FEED[i].title) +
          '</button>';
      }
    }
    html += '</section>';
  }
  html +=
    '<section><h3>Stories like this one</h3><p class="muted">Different people, similar turn.</p>';
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].kind === 'story' && FEED[i].id !== item.id && FEED[i].cat === item.cat) {
      html +=
        '<button type="button" class="card clickable row-btn" data-open="story" data-id="' +
        esc(FEED[i].id) +
        '">' +
        esc(FEED[i].title) +
        '</button>';
    }
  }
  html += '</section>';
  html += '<section><h3>Questions in the same area.</h3>';
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].kind === 'question' && FEED[i].cat === item.cat) {
      html +=
        '<button type="button" class="card clickable row-btn" data-open="thread" data-id="' +
        esc(FEED[i].id) +
        '">' +
        esc(FEED[i].title) +
        '</button>';
    }
  }
  html += '</section></div>';
  return { crumb: 'Story', title: item.title, html: html };
}

function viewOpp(v) {
  var o = OPPS[v.id];
  if (!o) return { crumb: 'Opportunity', title: 'Missing', html: '<p>Not found.</p>' };
  pushRecent('opp', o.id, o.name);
  var html = '<div class="detail">';
  html +=
    '<div class="hero blue"><span class="p">Opportunity</span><h2>' +
    esc(o.name) +
    '</h2><p>' +
    esc(o.one) +
    '</p><div class="card-actions">' +
    '<button type="button" class="btn" data-take-opp="' +
    esc(o.id) +
    '">Add to my pathway</button>' +
    '<button type="button" class="btn g" data-save="' +
    esc(o.id) +
    '">' +
    (isSaved(o.id) ? 'Saved' : 'Save for later') +
    '</button></div></div>';

  /* Fit check */
  if (!S.onboarded) {
    html +=
      '<div class="callout blue"><p>Is this open to you? Set up your pathway and this tells you directly, using your form and region rather than a general answer,</p>' +
      '<button type="button" class="btn sm" data-open="setup" data-id="0">Build my pathway</button></div>';
  } else if (oppOpenAtStage(o, S.stage)) {
    html +=
      '<div class="callout green"><p>Open to you at ' + esc(S.form) + '</p></div>';
  } else {
    html +=
      '<div class="callout gold"><p>Not open to you yet at ' +
      esc(S.form) +
      '</p><p>' +
      esc(o.who) +
      '</p><p>The limit is set by the organisers, not by us. It is worth knowing about now so it is not a surprise later.</p></div>';
  }

  if (o.independent) {
    html +=
      '<div class="callout blue"><p>You can enter this yourself. No school sponsor and no teacher required. That single fact is why most students who could enter this never do.</p></div>';
  }

  html +=
    '<div class="facts4">' +
    '<div><p class="eyebrow">When</p><p>' +
    esc(o.season) +
    '</p></div>' +
    '<div><p class="eyebrow">Cost</p><p>' +
    esc(o.cost) +
    '</p></div>' +
    '<div><p class="eyebrow">Who it is for</p><p>' +
    esc(o.who) +
    '</p></div>' +
    '<div><p class="eyebrow">Category</p><p>' +
    esc(o.cat) +
    '</p></div></div>';

  html += '<section><h3>What it actually is</h3>';
  var i;
  for (i = 0; i < o.what.length; i++) html += '<p>' + esc(o.what[i]) + '</p>';
  html += '</section>';

  html += '<section><h3>How you actually get in</h3><ol class="steps-ol">';
  for (i = 0; i < o.entry.length; i++) {
    html +=
      '<li><strong>' + esc(o.entry[i].b) + '</strong><span>' + esc(o.entry[i].s) + '</span></li>';
  }
  html += '</ol></section>';

  html += '<section><h3>Quick tips</h3><ul class="tips gold">';
  for (i = 0; i < o.tips.length; i++) html += '<li>' + esc(o.tips[i]) + '</li>';
  html += '</ul></section>';

  html +=
    '<div class="blocker"><strong>' +
    esc(o.truth.b) +
    '</strong><p>' +
    esc(o.truth.p) +
    '</p></div>';
  html +=
    '<div class="callout blue"><strong>' +
    esc(o.proof.b) +
    '</strong><p>' +
    esc(o.proof.p) +
    '</p></div>';
  html += '<div class="callout gold"><p class="eyebrow">Where this leads</p><p>' + esc(o.leads) + '</p></div>';

  html += '<section><h3>Mentors who went that way</h3>';
  for (i = 0; i < (o.mentors || []).length; i++) html += mentorRow(o.mentors[i], '');
  html += '</section>';

  html += '<section><h3>Sessions that cover it</h3>';
  for (i = 0; i < (o.sess || []).length; i++) {
    var ss = sessionById(o.sess[i]);
    if (ss) html += renderSessionMini(ss);
  }
  html += '</section>';

  html += '<section><h3>If this one fits, these do too</h3>';
  for (i = 0; i < (o.rel || []).length; i++) {
    if (OPPS[o.rel[i]]) html += miniOpp(OPPS[o.rel[i]]);
  }
  html += '</section>';
  html += askAboutBlock('About ' + o.name + ': ', o.cat);
  html +=
    '<p class="footer-note">Dates, fees and requirements are illustrative in this prototype and must be confirmed with the organiser.</p></div>';
  return { crumb: 'Opportunity', title: o.name, html: html };
}

function viewSession(v) {
  var s = sessionById(v.id);
  if (!s) return { crumb: 'Session', title: 'Missing', html: '<p>Not found.</p>' };
  pushRecent('session', s.id, s.title);
  var lead = author(s.lead);
  var left = Math.max(0, s.seats - s.taken);
  var html =
    '<div class="detail"><div class="hero navy"><p class="eyebrow">' +
    esc(s.pod) +
    '</p><h2>' +
    esc(s.title) +
    '</h2><p>' +
    esc(s.when) +
    ' · One hour · Google Meet</p><p>' +
    esc(s.what) +
    '</p>' +
    '<button type="button" class="btn" data-open="book" data-id="' +
    esc(s.id) +
    '">' +
    (S.booked.indexOf(s.id) !== -1 ? 'Manage booking' : left === 0 ? 'Join waitlist' : 'Book a place') +
    '</button></div>';
  html +=
    '<div class="facts4"><div><p class="eyebrow">Places left</p><p>' +
    left +
    '</p></div><div><p class="eyebrow">What to bring</p><p>' +
    esc(s.bring) +
    '</p></div></div>';
  html += '<section><h3>Questions already submitted</h3><ul class="q-list">';
  var i;
  for (i = 0; i < s.qs.length; i++) {
    html += '<li><span class="qmark">?</span>' + esc(s.qs[i]) + '</li>';
  }
  html +=
    '</ul><p class="muted">Yours gets added when you book, and the mentor sees them beforehand.</p></section>';
  html += '<section><h3>Who leads it</h3>' + mentorRow(s.lead, '') + '</section>';
  html += '<section><h3>Opportunities this covers</h3>';
  for (var k in OPPS) {
    if (OPPS[k].sess && OPPS[k].sess.indexOf(s.id) !== -1) html += miniOpp(OPPS[k]);
  }
  html += '</section>';
  html += askAboutBlock('About ' + s.title + ': ', s.cat);
  html += '</div>';
  return { crumb: 'Session', title: s.title, html: html };
}

function viewBook(v) {
  var s = sessionById(v.id);
  if (!s) return { crumb: 'Book', title: 'Missing', html: '<p>Not found.</p>' };
  var lead = author(s.lead);
  var left = Math.max(0, s.seats - s.taken);
  var booked = S.booked.indexOf(s.id) !== -1;
  var waiting = S.waitlist.indexOf(s.id) !== -1;
  var html =
    '<div class="detail"><p class="eyebrow">' +
    esc(s.pod) +
    '</p><h2>' +
    esc(s.title) +
    '</h2><p class="muted">' +
    esc(s.when) +
    ' · ' +
    esc(lead.name) +
    '</p>';
  if (booked) {
    html +=
      '<div class="callout green"><p>You have a place.</p>' +
      '<button type="button" class="btn g" data-cancel-book="' +
      esc(s.id) +
      '">Cancel place</button></div>';
  } else if (left === 0) {
    if (waiting) {
      html +=
        '<div class="callout gold"><p>You are on the waitlist. You move up if someone cancels.</p>' +
        '<button type="button" class="btn g" data-leave-waitlist="' +
        esc(s.id) +
        '">Leave waitlist</button></div>';
    } else {
      html +=
        '<div class="callout gold"><p>This session is full. Join the waitlist and you move up if someone cancels.</p>' +
        '<button type="button" class="btn" data-waitlist="' +
        esc(s.id) +
        '">Join waitlist</button></div>';
    }
  } else {
    html += '<p>' + left + ' places remaining</p>';
    html +=
      '<label class="field-label" for="book-q">What do you want to leave knowing?</label>' +
      '<input type="text" id="book-q" placeholder="One sentence is enough"/>';
    html +=
      '<label class="check"><input type="checkbox" id="book-wa" checked/> Send my reminders on WhatsApp. Confirmation, a reminder the day before, and the link an hour before. Your number is never shown to mentors or other students. <span class="muted">Prototype note: no number is collected here. The tick confirms you want reminders.</span></label>';
    html +=
      '<div class="card-actions"><button type="button" class="btn" data-confirm-book="' +
      esc(s.id) +
      '">Confirm place</button></div>';
  }
  html += '</div>';
  return { crumb: 'Booking', title: s.title, html: html };
}

function viewCompose() {
  return {
    crumb: 'New post',
    title: S.ctype === 'story' ? 'Share a story' : 'Ask a question',
    html: renderComposerForm(),
    after: function () {
      var ta = byId('comp-text');
      if (ta) ta.focus();
    }
  };
}

function openCompose(seed, cat) {
  if (seed != null && seed !== '') S.draft = seed;
  if (cat) S.draftCat = cat;
  go({ t: 'compose', id: 'new' });
}

function viewMentor(v) {
  var a = author(v.id);
  var j = JOURNEYS[v.id];
  pushRecent('mentor', v.id, a.name);
  var html =
    '<div class="detail"><div class="hero navy"><span class="p">' +
    esc(a.role) +
    '</span><h2>' +
    esc(a.name) +
    '</h2><p>' +
    esc(a.pos) +
    '</p>' +
    (j
      ? '<p>' +
        esc(j.place) +
        ' · ' +
        esc(j.type) +
        ' · ' +
        esc(j.field) +
        '</p><p>' +
        esc(j.blurb) +
        '</p>'
      : '') +
    '<div class="card-actions">' +
    '<button type="button" class="btn" data-follow="' +
    esc(v.id) +
    '">' +
    (isFollowing(v.id) ? 'Following' : 'Follow') +
    '</button>' +
    (j
      ? '<button type="button" class="btn g" data-open="journey" data-id="' +
        esc(v.id) +
        '">Read the full journey</button>'
      : '') +
    '<button type="button" class="btn g" data-ask-seed="Question for ' +
    esc(a.name) +
    ': " data-ask-cat="' +
    esc((a.cats && a.cats[0]) || '') +
    '">Ask in their pod</button></div></div>';
  if (j) {
    html += '<blockquote class="quote">' + esc(j.quote) + '</blockquote>';
    html +=
      '<section class="card"><h3>The short version</h3><p class="serif">' +
      esc(j.hook) +
      '</p><p class="now-line"><span class="eyebrow">NOW</span> ' +
      esc(j.now) +
      '</p>' +
      '<button type="button" class="btn sm" data-open="journey" data-id="' +
      esc(v.id) +
      '">Full journey</button></section>';
  }
  html += '<section><h3>Their stories</h3>';
  var i;
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].kind === 'story' && FEED[i].author === v.id) {
      html +=
        '<button type="button" class="card clickable row-btn" data-open="story" data-id="' +
        esc(FEED[i].id) +
        '">' +
        esc(FEED[i].title) +
        '</button>';
    }
  }
  html += '</section><section><h3>Where they answered</h3>';
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].kind !== 'question' || !FEED[i].replies) continue;
    var r, hit = false;
    for (r = 0; r < FEED[i].replies.length; r++) {
      if (FEED[i].replies[r].a === v.id) hit = true;
    }
    if (hit) {
      html +=
        '<button type="button" class="card clickable row-btn" data-open="thread" data-id="' +
        esc(FEED[i].id) +
        '">' +
        esc(FEED[i].title) +
        '</button>';
    }
  }
  html += '</section><section><h3>Sessions they lead</h3>';
  for (i = 0; i < SESSIONS.length; i++) {
    if (SESSIONS[i].lead === v.id) html += renderSessionMini(SESSIONS[i]);
  }
  html += '</section><section><h3>Opportunities they point at</h3>';
  for (var ok in OPPS) {
    if (OPPS[ok].mentors && OPPS[ok].mentors.indexOf(v.id) !== -1) html += miniOpp(OPPS[ok]);
  }
  html += '</section>';
  if (a.similar && a.similar.length) {
    html += '<section><h3>People with a similar turn</h3>';
    for (i = 0; i < a.similar.length; i++) {
      html += mentorRow(a.similar[i], similarReason(a.similar[i]));
    }
    html += '</section>';
  }
  html += '</div>';
  return { crumb: 'Mentor', title: a.name, html: html };
}

function viewJourney(v) {
  var a = author(v.id);
  var j = JOURNEYS[v.id];
  if (!j) return { crumb: 'Journey', title: 'Missing', html: '<p>Not found.</p>' };
  pushRecent('journey', v.id, a.name + ' journey');
  var html =
    '<div class="detail"><div class="hero navy"><h2>' +
    esc(a.name) +
    '</h2><blockquote class="quote">' +
    esc(j.quote) +
    '</blockquote><p class="now-line"><span class="eyebrow">NOW</span> ' +
    esc(j.now) +
    '</p></div>';
  html += '<section><h3>Moments</h3>';
  var i, m;
  for (i = 0; i < j.moments.length; i++) {
    m = j.moments[i];
    html +=
      '<div class="card moment"><div class="age-box"><div class="n">' +
      esc(String(m.age)) +
      '</div><div class="l">AT THE TIME</div></div><p class="serif mtxt">' +
      esc(m.text) +
      '</p>' +
      (m.flag ? '<span class="p red">Setback</span>' : '') +
      '</div>';
  }
  html += '</section><section><h3>Route</h3>';
  for (i = 0; i < j.route.length; i++) {
    var rt = j.route[i];
    var stn = stageByKey(rt.stage);
    html +=
      '<div class="card"><p class="eyebrow">' +
      esc(stn.name) +
      '</p><p class="serif">' +
      esc(rt.text) +
      '</p><p class="muted">' +
      esc(rt.lesson) +
      '</p></div>';
  }
  html += '</section>';
  html +=
    '<section class="card"><h3>Deep dive</h3><p><strong>' +
    esc(j.dive.title) +
    '</strong></p><p>Requirement: ' +
    esc(j.dive.req) +
    '</p><p>Cost: ' +
    esc(j.dive.cost) +
    '</p><p class="caveat">' +
    esc(j.dive.caveat) +
    '</p></section>';
  html +=
    '<section class="card"><h3>What ' +
    esc(a.name.split(' ')[0]) +
    ' did</h3><p class="muted">Tap anything to put it on your pathway at the stage where it happens. Tap again to remove it.</p><div class="step-chips">';
  for (i = 0; i < j.steps.length; i++) {
    var sp = j.steps[i];
    var key = v.id + ':' + sp.label;
    var on = takenHas(key);
    html +=
      '<button type="button" class="chip step' +
      (on ? ' on' : '') +
      '" data-jstep="' +
      esc(v.id) +
      '" data-label="' +
      esc(sp.label) +
      '" data-kind="' +
      esc(sp.kind) +
      '" data-stage="' +
      esc(sp.stage) +
      '">' +
      esc(sp.kind) +
      ': ' +
      esc(sp.label) +
      '</button>';
  }
  html +=
    '</div><button type="button" class="btn sm" data-jstep-all="' +
    esc(v.id) +
    '">Add everything ' +
    esc(a.name.split(' ')[0]) +
    ' did</button></section>';
  html +=
    '<div class="callout blue"><p class="eyebrow">Did you know</p><p>' +
    esc(j.did.text) +
    '</p><p class="muted">Source: ' +
    esc(j.did.src) +
    '</p></div>';
  html +=
    '<section><h3>Other journeys</h3><p class="muted">Deliberately different routes.</p>';
  for (var jid in JOURNEYS) {
    if (jid === v.id) continue;
    html +=
      '<button type="button" class="card clickable row-btn" data-open="journey" data-id="' +
      esc(jid) +
      '">' +
      esc(author(jid).name) +
      ' · ' +
      esc(JOURNEYS[jid].field) +
      '</button>';
  }
  html += '</section></div>';
  return { crumb: 'Journey', title: a.name, html: html };
}

function viewTopic(v) {
  var cat = v.id;
  pushRecent('topic', cat, cat);
  var html =
    '<div class="detail"><div class="hero gold"><span class="p">Topic</span><h2>' +
    esc(cat) +
    '</h2><p>Everything in one place: what students are asking, who has done it, what you can enter, and where to talk it through.</p></div>';
  var i, o, has;
  has = false;
  html += '<section><h3>What you can actually enter</h3>';
  for (var k in OPPS) {
    o = OPPS[k];
    if (o.cat !== cat) continue;
    has = true;
    html +=
      '<div class="card">' +
      (o.independent ? '<span class="p green">Independent</span> ' : '') +
      '<span class="p">' +
      esc(o.season) +
      '</span><h3>' +
      esc(o.name) +
      '</h3>' +
      '<button type="button" class="btn sm" data-open="opp" data-id="' +
      esc(o.id) +
      '">Open</button></div>';
  }
  if (!has) html = html.replace('<section><h3>What you can actually enter</h3>', '');
  else html += '</section>';

  function sectionFeed(title, kind) {
    var block = '<section><h3>' + title + '</h3>';
    var any = false;
    for (i = 0; i < FEED.length; i++) {
      if (FEED[i].kind !== kind) continue;
      if (FEED[i].cat !== cat && !(kind === 'opportunity' && OPPS[FEED[i].opp] && OPPS[FEED[i].opp].cat === cat))
        continue;
      any = true;
      if (kind === 'question')
        block +=
          '<button type="button" class="card clickable row-btn" data-open="thread" data-id="' +
          esc(FEED[i].id) +
          '">' +
          esc(FEED[i].title) +
          '</button>';
      if (kind === 'story')
        block +=
          '<button type="button" class="card clickable row-btn" data-open="story" data-id="' +
          esc(FEED[i].id) +
          '">' +
          esc(FEED[i].title) +
          '</button>';
    }
    if (!any) return '';
    return block + '</section>';
  }
  html += sectionFeed('What students are asking', 'question');
  html += sectionFeed('Stories', 'story');

  html += '<section><h3>People in this area</h3>';
  has = false;
  for (k in AUTHORS) {
    if (AUTHORS[k].cats && AUTHORS[k].cats.indexOf(cat) !== -1) {
      has = true;
      html += mentorRow(k, '');
    }
  }
  if (!has) html = html.replace('<section><h3>People in this area</h3>', '');
  else html += '</section>';

  html += '<section><h3>Sessions</h3>';
  has = false;
  for (i = 0; i < SESSIONS.length; i++) {
    if (SESSIONS[i].cat === cat) {
      has = true;
      html += renderSessionMini(SESSIONS[i]);
    }
  }
  if (!has) html = html.replace('<section><h3>Sessions</h3>', '');
  else html += '</section>';

  html += askAboutBlock('About ' + cat + ': ', cat);
  html += '</div>';
  return { crumb: 'Topic', title: cat, html: html };
}

function viewEdit(v) {
  var item = feedById(v.id);
  if (!item) return { crumb: 'Edit', title: 'Missing', html: '<p>Not found.</p>' };
  var text = item.kind === 'story' ? (item.body || []).join('\n\n') : item.title || '';
  var html =
    '<div class="detail"><label class="field-label" for="edit-text">Edit your post</label>' +
    '<textarea id="edit-text" style="height:140px">' +
    esc(text) +
    '</textarea>' +
    '<label class="field-label" for="edit-cat">Category</label><select id="edit-cat">';
  var i;
  for (i = 0; i < CATS.length; i++) {
    html +=
      '<option value="' +
      esc(CATS[i]) +
      '"' +
      (CATS[i] === item.cat ? ' selected' : '') +
      '>' +
      esc(CATS[i]) +
      '</option>';
  }
  html +=
    '</select><p class="hint">Replies stay where they are. Editing does not notify anyone.</p>' +
    '<div class="card-actions">' +
    '<button type="button" class="btn" data-save-edit="' +
    esc(item.id) +
    '">Save</button>' +
    '<button type="button" class="btn g" id="edit-cancel">Cancel</button>' +
    '<button type="button" class="btn q alert-push" data-del="' +
    esc(item.id) +
    '">Delete instead</button></div></div>';
  return { crumb: 'Edit', title: 'Edit post', html: html };
}

function viewDel(v) {
  var item = feedById(v.id);
  if (!item) return { crumb: 'Delete', title: 'Missing', html: '<p>Not found.</p>' };
  var n = item.replies ? item.replies.length : 0;
  var html =
    '<div class="detail"><p>' +
    esc(item.title || '') +
    '</p><p>It has ' +
    n +
    ' replies, and those replies will go with it. This cannot be undone.</p>' +
    '<div class="card-actions">' +
    '<button type="button" class="btn g" id="del-keep">Keep it</button>' +
    '<button type="button" class="btn danger" data-confirm-del="' +
    esc(item.id) +
    '">Delete post</button></div></div>';
  return { crumb: 'Delete', title: 'Delete post', html: html };
}

function viewSetup(v) {
  var step = parseInt(v.id, 10) || 0;
  if (String(v.id) === '0' && NAV.length === 1) {
    /* fresh open keeps prior draft so redo can resume; clear only when redo requested */
  }
  S.setupStep = step;
  return renderSetup(step);
}

var VIEWS = {
  thread: viewThread,
  story: viewStory,
  opp: viewOpp,
  session: viewSession,
  mentor: viewMentor,
  journey: viewJourney,
  topic: viewTopic,
  book: viewBook,
  edit: viewEdit,
  del: viewDel,
  setup: viewSetup,
  compose: viewCompose
};

function renderChrome() {
  var pill = byId('arch-pill');
  if (pill) {
    var init = 'You';
    if (S.onboarded && S.archetype) {
      var parts = S.archetype.split(' ');
      init = parts[parts.length - 1].charAt(0);
    }
    var dot = S.onboarded ? '' : '<span class="setup-dot" id="setup-dot" aria-hidden="true"></span>';
    pill.innerHTML =
      '<span class="av" aria-hidden="true">' +
      esc(init) +
      '</span>' +
      dot;
    pill.setAttribute(
      'aria-label',
      S.onboarded ? 'Your profile, open My Pathway' : 'Profile not set up, open My Pathway'
    );
    pill.hidden = false;
  }
  var badge = byId('dock-badge');
  if (badge) {
    if (S.unread > 0) {
      badge.hidden = false;
      badge.textContent = String(S.unread);
    } else {
      badge.hidden = true;
    }
  }

  var navs = document.querySelectorAll('[data-nav]');
  var i;
  var sheetTop = NAV.length ? NAV[NAV.length - 1].t : '';
  for (i = 0; i < navs.length; i++) {
    if (navs[i].id === 'arch-pill') {
      navs[i].classList.remove('on');
      navs[i].removeAttribute('aria-current');
      continue;
    }
    var navKey = navs[i].getAttribute('data-nav');
    var on =
      navKey === S.view ||
      (navKey === 'sessions' && (sheetTop === 'session' || sheetTop === 'book' || sheetTop === 'opp'));
    if (on) {
      navs[i].classList.add('on');
      if (navs[i].closest && navs[i].closest('#dock')) {
        navs[i].setAttribute('aria-current', 'page');
      }
    } else {
      navs[i].classList.remove('on');
      navs[i].removeAttribute('aria-current');
    }
  }

  /* Left next decision */
  var nd = byId('next-decision');
  if (nd) {
    if (!S.onboarded) {
      nd.innerHTML =
        '<p class="eyebrow">Your next decision</p><p class="muted">Set up your pathway to see what is actually near.</p>' +
        '<button type="button" class="btn sm" data-open="setup" data-id="0">Build my pathway</button>';
    } else {
      var st = stageByKey(S.stage);
      var d = daysUntil(st.dec.due);
      nd.innerHTML =
        '<p class="eyebrow">Your next decision</p><h3>' +
        esc(st.dec.t) +
        '</h3>' +
        (d != null ? '<p class="due">' + d + ' days on the usual calendar</p>' : '') +
        '<button type="button" class="btn sm g" data-goto="pathway">Open pathway</button>';
    }
  }

  /* Browse topics: first 6 */
  var bt = byId('browse-topics');
  if (bt && !bt.getAttribute('data-ready')) {
    var h = '';
    for (i = 0; i < 6; i++) {
      h +=
        '<button type="button" data-topic="' +
        esc(CATS[i]) +
        '">' +
        esc(CATS[i]) +
        '</button>';
    }
    bt.innerHTML = h;
    bt.setAttribute('data-ready', '1');
  }

  /* Right rails */
  var trend = byId('trending');
  if (trend) {
    var h2 = '';
    for (i = 0; i < FEED.length && i < 4; i++) {
      if (FEED[i].kind === 'question') {
        h2 +=
          '<button type="button" class="rail-link" data-open="thread" data-id="' +
          esc(FEED[i].id) +
          '">' +
          esc(FEED[i].title) +
          '</button>';
      }
    }
    trend.innerHTML = h2;
  }
  var closing = byId('closing');
  if (closing) {
    var h3 = '';
    for (i = 0; i < SESSIONS.length && i < 3; i++) {
      h3 +=
        '<button type="button" class="rail-link" data-open="session" data-id="' +
        esc(SESSIONS[i].id) +
        '">' +
        esc(SESSIONS[i].title) +
        '</button>';
    }
    closing.innerHTML = h3;
  }
  var replies = byId('replies-rail');
  if (replies) {
    var mineReplies = [];
    for (i = 0; i < FEED.length; i++) {
      if (FEED[i].mine && FEED[i].newReply) mineReplies.push(FEED[i]);
    }
    if (!mineReplies.length) {
      replies.hidden = true;
    } else {
      replies.hidden = false;
      var box = byId('replies-list');
      if (box) {
        var h4 = '';
        for (i = 0; i < mineReplies.length; i++) {
          h4 +=
            '<button type="button" class="rail-link" data-open="thread" data-id="' +
            esc(mineReplies[i].id) +
            '">' +
            esc(mineReplies[i].title) +
            '</button>';
        }
        box.innerHTML = h4;
      }
    }
  }
}

function render() {
  var main = byId('main');
  if (S.view === 'pathway') main.innerHTML = renderPathway();
  else if (S.view === 'sessions') main.innerHTML = renderSessionsPage();
  else main.innerHTML = renderFeed();
  renderChrome();
}

function openKind(kind, id) {
  if (kind === 'sessions') {
    S.sessionStage = id || '';
    setView('sessions');
    return;
  }
  var map = {
    thread: 'thread',
    story: 'story',
    opp: 'opp',
    session: 'session',
    mentor: 'mentor',
    journey: 'journey',
    topic: 'topic',
    book: 'book',
    edit: 'edit',
    del: 'del',
    setup: 'setup',
    compose: 'compose'
  };
  if (!map[kind]) return;
  if (kind === 'setup') {
    S.setupDraft = {};
    S.setupStep = 0;
    id = '0';
  }
  go({ t: map[kind], id: id });
}

function mentorForCat(cat) {
  var map = {
    'Science and health': 'raeka',
    'Subject choice': 'raeka',
    Technology: 'jerome',
    'Building and fixing things': 'omar',
    Business: 'aisha',
    'Creative and media': 'marcus',
    'Sport and coaching': 'keisha',
    'After CSEC': 'omar',
    Scholarships: 'raeka'
  };
  return map[cat] || 'raeka';
}

function simulateReply(itemId) {
  setTimeout(function () {
    var item = feedById(itemId);
    if (!item || item.kind !== 'question') return;
    var mid = mentorForCat(item.cat);
    var a = author(mid);
    item.replies = item.replies || [];
    item.replies.push({
      a: mid,
      text:
        'I saw your question. Write down the subjects you hold now and the ones you wish you still had. Bring that list to a session and we will map what still opens.'
    });
    item.newReply = true;
    if (S.view !== 'pathway') S.unread += 1;
    toast(a.name + ' replied to your question.');
    render();
    if (NAV.length) paint();
  }, 7000);
}

function closestEl(el, sel) {
  if (!el) return null;
  if (el.closest) return el.closest(sel);
  while (el && el.nodeType === 1) {
    if (el.matches && el.matches(sel)) return el;
    if (el.msMatchesSelector && el.msMatchesSelector(sel)) return el;
    el = el.parentElement || el.parentNode;
  }
  return null;
}

function wire() {
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.nodeType !== 1) t = t.parentElement;
    var btn;
    var innerBtn = closestEl(t, 'button');
    var card = closestEl(t, '.clickable[data-open]');
    if (card && (!innerBtn || innerBtn === card)) {
      openKind(card.getAttribute('data-open'), card.getAttribute('data-id'));
      return;
    }

    btn = closestEl(t, 'button[data-open]');
    if (btn) {
      openKind(btn.getAttribute('data-open'), btn.getAttribute('data-id'));
      return;
    }

    btn = closestEl(t, '[data-nav]');
    if (btn) {
      var nav = btn.getAttribute('data-nav');
      if (nav === 'sessions') S.sessionStage = '';
      setView(nav);
      return;
    }

    if (t.id === 'dock-post' || closestEl(t, '#dock-post')) {
      if (NAV.length && NAV[NAV.length - 1].t === 'compose') {
        closeSheet();
      } else {
        openCompose();
      }
      return;
    }

    btn = closestEl(t, '[data-goto]');
    if (btn) {
      setView(btn.getAttribute('data-goto'));
      return;
    }

    if (t.id === 'logo' || closestEl(t, '#logo')) {
      /* Let the brand link go to the marketing homepage. */
      return;
    }

    btn = closestEl(t, '[data-filter]');
    if (btn) {
      S.filter = btn.getAttribute('data-filter');
      if (S.filter === 'all') S.query = '';
      render();
      return;
    }

    btn = closestEl(t, '[data-ctype]');
    if (btn) {
      S.ctype = btn.getAttribute('data-ctype');
      S.anon = S.ctype === 'question';
      if (NAV.length && NAV[NAV.length - 1].t === 'compose') paint();
      else render();
      return;
    }

    btn = closestEl(t, '[data-topic]');
    if (btn) {
      e.stopPropagation();
      go({ t: 'topic', id: btn.getAttribute('data-topic') });
      return;
    }

    btn = closestEl(t, '[data-follow]');
    if (btn) {
      e.stopPropagation();
      toggleFollow(btn.getAttribute('data-follow'));
      return;
    }

    btn = closestEl(t, '[data-save]');
    if (btn) {
      e.stopPropagation();
      toggleSave(btn.getAttribute('data-save'));
      return;
    }

    btn = closestEl(t, '[data-inspire]');
    if (btn) {
      e.stopPropagation();
      toggleInspired(btn.getAttribute('data-inspire'));
      return;
    }

    btn = closestEl(t, '[data-edit]');
    if (btn) {
      go({ t: 'edit', id: btn.getAttribute('data-edit') });
      return;
    }

    btn = closestEl(t, '[data-del]');
    if (btn) {
      go({ t: 'del', id: btn.getAttribute('data-del') });
      return;
    }

    btn = closestEl(t, '[data-ask-seed]');
    if (btn) {
      closeSheet();
      setView('feed');
      S.ctype = 'question';
      S.anon = true;
      openCompose(btn.getAttribute('data-ask-seed') || '', btn.getAttribute('data-ask-cat') || '');
      return;
    }

    btn = closestEl(t, '[data-setup-key]');
    if (btn) {
      var key = btn.getAttribute('data-setup-key');
      var val = btn.getAttribute('data-setup-val');
      var form = btn.getAttribute('data-setup-form');
      S.setupDraft[key] = val;
      if (form) S.setupDraft.form = form;
      if (key === 'stage') S.setupDraft.stage = val;
      if (S.setupStep >= 5) {
        finishSetup();
        return;
      }
      S.setupStep += 1;
      NAV[NAV.length - 1] = { t: 'setup', id: String(S.setupStep) };
      paint();
      return;
    }

    btn = closestEl(t, '[data-setup-back]');
    if (btn) {
      if (S.setupStep > 0) {
        S.setupStep -= 1;
        NAV[NAV.length - 1] = { t: 'setup', id: String(S.setupStep) };
        paint();
      }
      return;
    }

    if ((t.id === 'sheet-back' || closestEl(t, '#sheet-back')) && NAV.length && NAV[NAV.length - 1].t === 'setup') {
      if (S.setupStep > 0) {
        S.setupStep -= 1;
        NAV[NAV.length - 1] = { t: 'setup', id: String(S.setupStep) };
        paint();
        return;
      }
    }

    btn = closestEl(t, '[data-jstep]');
    if (btn) {
      toggleTaken({
        key: btn.getAttribute('data-jstep') + ':' + btn.getAttribute('data-label'),
        label: btn.getAttribute('data-label'),
        kind: btn.getAttribute('data-kind'),
        stage: btn.getAttribute('data-stage'),
        from: author(btn.getAttribute('data-jstep')).name
      });
      return;
    }

    btn = closestEl(t, '[data-jstep-all]');
    if (btn) {
      var jid = btn.getAttribute('data-jstep-all');
      var j = JOURNEYS[jid];
      var si;
      var added = 0;
      for (si = 0; si < j.steps.length; si++) {
        if (
          addTaken(
            {
              key: jid + ':' + j.steps[si].label,
              label: j.steps[si].label,
              kind: j.steps[si].kind,
              stage: j.steps[si].stage,
              from: author(jid).name
            },
            true
          )
        )
          added++;
      }
      toast(added ? 'Added ' + added + ' steps to your pathway.' : 'Those steps are already on your pathway.');
      paint();
      render();
      return;
    }

    btn = closestEl(t, '[data-take-opp]');
    if (btn) {
      var oid = btn.getAttribute('data-take-opp');
      var op = OPPS[oid];
      toggleTaken({
        key: 'opp:' + oid,
        label: op.name,
        kind: 'Opportunity',
        stage: op.stage || S.stage || 'subject',
        from: 'Opportunities desk'
      });
      return;
    }

    btn = closestEl(t, '[data-take-story]');
    if (btn) {
      var sid = btn.getAttribute('data-take-story');
      var st = feedById(sid);
      var ti;
      if (st && st.takeaways) {
        for (ti = 0; ti < st.takeaways.length; ti++) {
          addTaken({
            key: 'tk:' + sid + ':' + ti,
            label: st.takeaways[ti],
            kind: 'Route step',
            stage: S.stage || 'subject',
            from: author(st.author).name
          });
        }
        toast('Added to ' + (S.form || 'your timeline') + '.');
        paint();
        render();
      }
      return;
    }

    btn = closestEl(t, '[data-untake]');
    if (btn) {
      removeTaken(btn.getAttribute('data-untake'));
      render();
      return;
    }

    btn = closestEl(t, '[data-slot]');
    if (btn) {
      var sk = btn.getAttribute('data-slot');
      S.slots[sk] = !S.slots[sk];
      render();
      return;
    }

    btn = closestEl(t, '[data-confirm-book]');
    if (btn) {
      var wa = byId('book-wa');
      if (wa && !wa.checked) {
        toast('Reminders are how the link reaches you. Tick the box to continue.');
        return;
      }
      var bid = btn.getAttribute('data-confirm-book');
      var bs = sessionById(bid);
      var bq = byId('book-q');
      var qtext = bq && bq.value ? bq.value.trim() : '';
      if (!qtext || qtext.length < 4) {
        toast('Add one sentence about what you want to leave knowing.');
        if (bq) bq.focus();
        return;
      }
      bs.qs.push(qtext);
      bs.taken += 1;
      if (S.booked.indexOf(bid) === -1) S.booked.push(bid);
      S.waitlist = S.waitlist.filter(function (x) {
        return x !== bid;
      });
      toast('Booked. It is on your pathway under Sessions.');
      paint();
      render();
      return;
    }

    btn = closestEl(t, '[data-cancel-book]');
    if (btn) {
      var cid = btn.getAttribute('data-cancel-book');
      var cs = sessionById(cid);
      S.booked = S.booked.filter(function (x) {
        return x !== cid;
      });
      if (cs.taken > 0) cs.taken -= 1;
      toast('Place cancelled. The first person waiting gets it.');
      paint();
      render();
      return;
    }

    btn = closestEl(t, '[data-waitlist]');
    if (btn) {
      var wid = btn.getAttribute('data-waitlist');
      if (S.waitlist.indexOf(wid) === -1) S.waitlist.push(wid);
      toast('Waitlist noted. You move up if someone cancels.');
      paint();
      render();
      return;
    }

    btn = closestEl(t, '[data-leave-waitlist]');
    if (btn) {
      var lid = btn.getAttribute('data-leave-waitlist');
      S.waitlist = S.waitlist.filter(function (x) {
        return x !== lid;
      });
      toast('Left the waitlist.');
      paint();
      render();
      return;
    }

    btn = closestEl(t, '[data-save-edit]');
    if (btn) {
      var eid = btn.getAttribute('data-save-edit');
      var eitem = feedById(eid);
      var et = byId('edit-text');
      var ec = byId('edit-cat');
      var etxt = et && et.value ? et.value.trim() : '';
      if (!etxt || etxt.length < 8) {
        toast('Write a little more before saving.');
        return;
      }
      if (eitem.kind === 'question') eitem.title = etxt;
      else if (eitem.kind === 'story') {
        eitem.body = etxt.split(/\n+/);
        eitem.title = etxt.slice(0, 80);
      }
      if (ec) eitem.cat = ec.value;
      eitem.edited = true;
      toast('Saved.');
      back();
      render();
      return;
    }

    btn = closestEl(t, '[data-confirm-del]');
    if (btn) {
      var did = btn.getAttribute('data-confirm-del');
      FEED = FEED.filter(function (x) {
        return x.id !== did;
      });
      S.inspired = S.inspired.filter(function (x) {
        return x !== did;
      });
      S.recent = S.recent.filter(function (x) {
        return x.id !== did;
      });
      toast('Post deleted.');
      closeSheet();
      render();
      return;
    }

    btn = closestEl(t, '[data-thread-reply]');
    if (btn) {
      var tr = byId('thread-reply');
      var tid = btn.getAttribute('data-thread-reply');
      var titem = feedById(tid);
      var rtext = tr && tr.value ? tr.value.trim() : '';
      if (!rtext || rtext.length < 4) {
        toast('Write a short reply before posting.');
        if (tr) tr.focus();
        return;
      }
      ensureReplyIds(titem);
      titem.replies = titem.replies || [];
      titem.replies.push({
        id: tid + '-r' + Date.now(),
        a: null,
        who: studentLabel(),
        text: rtext,
        mine: true
      });
      toast('Reply posted.');
      paint();
      render();
      return;
    }

    btn = closestEl(t, '[data-del-reply]');
    if (btn) {
      var pid = btn.getAttribute('data-del-reply');
      var rid = btn.getAttribute('data-rid');
      var pitem = feedById(pid);
      if (pitem && pitem.replies) {
        pitem.replies = pitem.replies.filter(function (x) {
          return x.id !== rid;
        });
        toast('Reply deleted.');
        paint();
        render();
      }
      return;
    }

    if (t.id === 'comp-submit' || closestEl(t, '#comp-submit')) {
      var textEl = byId('comp-text');
      var catEl = byId('comp-cat');
      var anonEl = byId('comp-anon');
      var body = textEl.value.trim();
      if (body.length < 8) {
        toast('Write a little more before posting.');
        return;
      }
      var nid = 'mine-' + Date.now();
      var isAnon = !!(anonEl && anonEl.checked);
      if (S.ctype === 'question') {
        FEED.unshift({
          id: nid,
          kind: 'question',
          time: 'Just now',
          cat: catEl.value,
          anon: isAnon,
          who: studentLabel(),
          title: body,
          askedAt: S.form || 'Form 3',
          asks: 1,
          replies: [],
          rel: [],
          mine: true
        });
        toast('Question posted.');
        simulateReply(nid);
      } else {
        FEED.unshift({
          id: nid,
          kind: 'story',
          time: 'Just now',
          cat: catEl.value,
          author: null,
          title: body.slice(0, 80),
          body: [body],
          takeaways: ['Write the decision down', 'Name who you will ask', 'Pick one next step'],
          insp: 0,
          rel: [],
          mine: true,
          anon: isAnon,
          who: studentLabel()
        });
        toast('Story shared.');
      }
      S.draft = '';
      S.draftCat = catEl.value;
      closeSheet();
      setView('feed');
      window.scrollTo(0, 0);
      return;
    }

    if (t.id === 'dup-dismiss') {
      var box = byId('dup-box');
      if (box) box.parentNode.removeChild(box);
      return;
    }

    if (t.id === 'edit-cancel' || t.id === 'del-keep') {
      back();
      return;
    }

    if (t.id === 'oto-btn' && !t.disabled) {
      S.oneToOne = true;
      toast('Request noted. A mentor will reach you through the pod.');
      render();
      return;
    }

    if (t.id === 'sheet-back' || closestEl(t, '#sheet-back')) {
      back();
      return;
    }
    if (t.id === 'sheet-close' || closestEl(t, '#sheet-close')) {
      closeSheet();
      return;
    }
    if (t.id === 'scrim') {
      closeSheet();
      return;
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'feed-q') {
      S.query = e.target.value;
      render();
      var fq = byId('feed-q');
      if (fq) {
        fq.focus();
        if (fq.setSelectionRange) fq.setSelectionRange(fq.value.length, fq.value.length);
      }
      return;
    }
    if (e.target && e.target.id === 'comp-text') {
      S.draft = e.target.value;
      var slot = byId('dup-slot');
      if (slot && S.ctype === 'question') slot.innerHTML = dupHintHtml(e.target.value);
    }
    if (e.target && e.target.id === 'comp-cat') {
      S.draftCat = e.target.value;
    }
    if (e.target && e.target.id === 'comp-anon') {
      S.anon = e.target.checked;
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'comp-cat') S.draftCat = e.target.value;
    if (e.target && e.target.id === 'comp-anon') S.anon = e.target.checked;
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && NAV.length) {
      back();
    }
  });
}

function applyHash() {
  var h = (location.hash || '').replace(/^#/, '').toLowerCase();
  if (h === 'pathway' || h === 'plan') {
    hideSheetUi();
    S.view = 'pathway';
    return 'pathway';
  }
  if (h === 'sessions') {
    hideSheetUi();
    S.view = 'sessions';
    S.sessionStage = '';
    return 'sessions';
  }
  if (h === 'feed' || h === 'stories') {
    hideSheetUi();
    S.view = 'feed';
    return 'feed';
  }
  return '';
}

function boot() {
  if (window.NSG_CMS && typeof NSG_CMS.applyAppGlobals === 'function') {
    NSG_CMS.applyAppGlobals();
  }
  var hash = applyHash();
  wire();
  render();
  window.addEventListener('hashchange', function () {
    applyHash();
    render();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
