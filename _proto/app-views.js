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
  },
  {
    q: 'Which describes you?',
    hint: 'A student can ask immediately. Sharing experience or mentoring is checked by staff first.',
    key: 'you',
    opts: [
      { v: 'student', label: 'I am a student', sub: '' },
      { v: 'contributor', label: 'I have experience worth sharing', sub: '' },
      { v: 'mentor', label: 'I want to mentor students', sub: '' }
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
  var pending = S.pendingAction;
  var you = d.you || 'student';
  S.onboarded = true;
  S.stage = d.stage;
  S.form = d.form || stageByKey(d.stage).name;
  S.region = d.region;
  S.goal = d.goal;
  S.priority = d.priority;
  S.blocker = d.blocker;
  S.archetype = d.archetype;
  S.me.form = S.form;
  S.me.region = S.region;
  if (you === 'contributor') {
    S.role = 'contributor';
    S.me.role = 'contributor';
    S.me.pending = true;
    S.me.verified = false;
    S.me.contactable = false;
    S.me.id = '';
  } else if (you === 'mentor') {
    S.role = 'mentor';
    S.me.role = 'mentor';
    S.me.pending = true;
    S.me.verified = false;
    S.me.contactable = true;
    S.me.id = '';
  } else {
    S.role = 'student';
    S.me.role = 'student';
    S.me.pending = false;
    S.me.verified = false;
    S.me.contactable = false;
    S.me.id = '';
  }
  S.setupStep = 0;
  S.setupDraft = {};
  S.setupReason = '';
  S.pendingAction = null;
  S.hideJoinCard = true;
  S.unread = 0;
  hideSheetUi();
  if (pending) {
    runPendingAction(pending);
    return;
  }
  S.view = 'pathway';
  render();
  toast('Pathway built. Your timeline starts at ' + S.form + '.');
}

function renderSetupHtml(step, opts) {
  var q = SETUP_QS[step];
  if (!q) return '';
  opts = opts || {};
  var pct = Math.round(((step + 1) / SETUP_QS.length) * 100);
  var html = '<div class="setup">';
  if (opts.reason) {
    html += '<p class="setup-reason">' + esc(opts.reason) + '</p>';
  }
  html +=
    '<div class="prog"><span style="width:' +
    pct +
    '%"></span></div>' +
    '<p class="eyebrow">Question ' +
    (step + 1) +
    ' of ' +
    SETUP_QS.length +
    '</p>' +
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
  return html;
}

function renderSetup(step) {
  var q = SETUP_QS[step];
  if (!q) {
    finishSetup();
    return { crumb: 'Setup', title: 'Done', html: '' };
  }
  return {
    crumb: 'Setup',
    title: 'Build my pathway',
    html: renderSetupHtml(step, { reason: S.setupReason }),
    after: function () {
      byId('sheet-back').hidden = step < 1;
    }
  };
}

function renderPathwayBlank() {
  var step = S.setupStep || 0;
  if (step > SETUP_QS.length - 1) step = 0;
  return (
    '<div class="page-path">' +
    '<div class="path-hero">' +
    '<p class="eyebrow">Your pathway</p>' +
    '<h1>Answer six questions</h1>' +
    '<p class="lead">Six questions about where you are and what is in your way. It builds your timeline, marks the decisions that are actually near, and points you at sessions worth sitting in. The feed stays open meanwhile.</p>' +
    '</div>' +
    '<div class="path-setup">' +
    renderSetupHtml(step) +
    '</div></div>'
  );
}

function advanceSetupStep() {
  if (S.setupStep >= SETUP_QS.length - 1) {
    finishSetup();
    return;
  }
  S.setupStep += 1;
  if (NAV.length && NAV[NAV.length - 1].t === 'setup') {
    NAV[NAV.length - 1] = { t: 'setup', id: String(S.setupStep) };
    paint();
    return;
  }
  render();
}

function backSetupStep() {
  if (S.setupStep < 1) return;
  S.setupStep -= 1;
  if (NAV.length && NAV[NAV.length - 1].t === 'setup') {
    NAV[NAV.length - 1] = { t: 'setup', id: String(S.setupStep) };
    paint();
    return;
  }
  render();
}

function postThreadReply(tid, rtext, afterPathway) {
  var titem = feedById(tid);
  if (!titem) return;
  if (!rtext || rtext.length < 4) {
    toast('Write a short reply before posting.');
    var tr = byId('thread-reply');
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
  toast(afterPathway ? 'Pathway built. Reply posted.' : 'Reply posted.');
  paint();
  render();
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
    var saved = savedTarget(S.saved[i]);
    if (!saved) continue;
    html +=
      '<div class="card row-between"><div><strong>' +
      esc(saved.title) +
      '</strong><p class="muted">' +
      esc(saved.sub) +
      '</p></div>' +
      '<button type="button" class="btn sm" data-open="' +
      esc(saved.kind) +
      '" data-id="' +
      esc(saved.id) +
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
    esc(sessionWhen(s)) +
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

/* ---------- DETAIL VIEWS (four blocks, same order) ---------- */

function resetCompose(kind) {
  S.compose = {
    step: 'write',
    kind: kind || 'question',
    title: S.draft || '',
    body: '',
    extra: '',
    when: '',
    cost: '',
    ages: '',
    regions: '',
    grade: '',
    source: '',
    date: '',
    length: '',
    where: '',
    capacity: '',
    lead: '',
    topic: S.draftCat || '',
    stage: '',
    res: [],
    resOther: '',
    images: [],
    anon: S.anon !== false,
    editId: ''
  };
  if (kind === 'question' && S.draft) {
    S.compose.title = S.draft;
  }
}

function isContactableAuthor(id) {
  return canContact(id);
}

function detailStageLabel(key) {
  if (!key) return '';
  var i;
  for (i = 0; i < STAGES.length; i++) {
    if (STAGES[i].key === key) return STAGES[i].name;
  }
  return key;
}

function chevronSvg() {
  return '<svg class="d-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
}

function loadDetail(kind, id) {
  var item;
  var o;
  var s;
  var j;
  var a;
  var p;
  if (kind === 'thread' || kind === 'question') {
    item = feedById(id);
    if (!item) return null;
    p = {
      kind: 'question',
      id: item.id,
      title: item.title || '',
      at: item.at || '',
      edited: !!item.edited,
      cat: item.cat || '',
      stage: item.stage || '',
      author: item.author || null,
      anon: !!item.anon,
      who: item.who || '',
      body: item.body || item.title || '',
      extra: item.extra || '',
      replies: item.replies || [],
      res: item.res || [],
      similar: item.similar || [],
      mine: !!item.mine
    };
    return p;
  }
  if (kind === 'story') {
    item = feedById(id);
    if (!item) return null;
    return {
      kind: 'story',
      id: item.id,
      title: item.title || '',
      at: item.at || '',
      edited: !!item.edited,
      cat: item.cat || '',
      stage: item.stage || '',
      author: item.author || null,
      anon: !!item.anon,
      who: item.who || '',
      body: item.body || [],
      images: item.images || [],
      res: item.res || [],
      similar: item.similar || [],
      mine: !!item.mine
    };
  }
  if (kind === 'opp' || kind === 'opportunity') {
    o = OPPS[id];
    if (!o) return null;
    item = null;
    var fi;
    for (fi = 0; fi < FEED.length; fi++) {
      if (FEED[fi].kind === 'opportunity' && FEED[fi].opp === id) item = FEED[fi];
    }
    return {
      kind: 'opportunity',
      id: o.id,
      title: o.name,
      at: item ? item.at : '',
      edited: !!(item && item.edited),
      cat: o.cat || '',
      stage: o.stage || '',
      author: o.author || (item && item.author) || 'desk',
      body: o.what || [],
      images: o.images || (item && item.images) || [],
      state: o.state || 'live',
      checkedAt: o.checkedAt || '',
      checkedBy: o.checkedBy || '',
      source: o.source || '',
      returnReason: o.returnReason || '',
      details: [
        { label: 'When', value: o.season || '' },
        { label: 'Cost', value: o.cost || '', accent: /no fee|^free$/i.test(o.cost || '') },
        { label: 'Ages', value: o.who || '' },
        { label: 'Regions', value: o.regions || '' },
        { label: 'Grade requirement', value: o.grade || '', accent: /^none$/i.test(o.grade || '') }
      ],
      verified: o.verified || '',
      res: (item && item.res) || [],
      similar: (item && item.similar) || o.rel || [],
      mine: !!(o.author && o.author === currentPosterId())
    };
  }
  if (kind === 'session') {
    s = sessionById(id);
    if (!s) return null;
    item = null;
    for (fi = 0; fi < FEED.length; fi++) {
      if (FEED[fi].kind === 'session' && FEED[fi].session === id) item = FEED[fi];
    }
    a = author(s.lead);
    return {
      kind: 'session',
      id: s.id,
      title: s.title,
      at: item ? item.at : '',
      edited: !!(item && item.edited),
      cat: s.cat || '',
      stage: s.stages && s.stages[0] ? s.stages[0] : '',
      author: s.hosted_by || s.lead,
      body: s.what ? [s.what] : [],
      details: [
        { label: 'When', value: s.dateText || sessionWhen(s) },
        { label: 'Length', value: s.length || '' },
        { label: 'Where', value: s.platform || '' },
        { label: 'Places', value: String(Math.max(0, s.seats - s.taken)) + ' of ' + String(s.seats) },
        { label: 'Led by', value: a.name }
      ],
      verified: '',
      res: (item && item.res) || [],
      similar: (item && item.similar) || [],
      mine: !!(s.hosted_by === currentPosterId() || s.lead === currentPosterId())
    };
  }
  if (kind === 'journey') {
    j = JOURNEYS[id];
    a = author(id);
    if (!j) return null;
    item = null;
    for (fi = 0; fi < FEED.length; fi++) {
      if (FEED[fi].kind === 'journey' && FEED[fi].journey === id) item = FEED[fi];
    }
    return {
      kind: 'journey',
      id: id,
      title: j.hook || a.name,
      at: item ? item.at : '',
      edited: !!(item && item.edited),
      cat: (item && item.cat) || j.field || '',
      stage: (item && item.stage) || '',
      author: id,
      body: j.body || [],
      images: (item && item.images) || j.images || [],
      res: (item && item.res) || [],
      similar: (item && item.similar) || [],
      mine: !!(item && item.mine) || !!(currentPosterId() && currentPosterId() === id)
    };
  }
  return null;
}

function head(p) {
  var a = p.author ? author(p.author) : null;
  var name;
  var kindLabel;
  var html;
  if (p.kind === 'question') kindLabel = 'Question';
  else if (p.kind === 'story') kindLabel = 'Story';
  else if (p.kind === 'journey') kindLabel = 'Journey';
  else if (p.kind === 'opportunity') kindLabel = 'Opportunity';
  else if (p.kind === 'session') kindLabel = 'Session';
  else kindLabel = '';
  if (p.anon || (p.kind === 'question' && !p.author)) {
    name = p.who || studentLabel();
    a = null;
  } else if (p.mine && !p.author) {
    name = p.anon ? studentLabel() : youName();
  } else {
    name = a ? a.name : p.who || '';
  }
  html = '<div class="d-head">';
  html +=
    '<div class="d-author">' +
    '<span class="av av-lg' +
    (p.anon || !a ? ' av-anon' : a.system ? ' av-desk' : '') +
    '" aria-hidden="true">' +
    esc(p.anon || !a ? '?' : a.init) +
    '</span>' +
    '<div class="d-who">' +
    nameWithBadge(name, a) +
    '<div class="d-sub">' +
    kindTimeHtml(kindLabel, p.at, p.edited) +
    '</div></div>';
  html += contactAffordance(p.author, p.mine || p.anon);
  html += cardMoreHtml(detailOpenKind(p), p.id, !!p.mine);
  html += '</div>';
  if (p.cat || p.stage) {
    html += '<div class="d-chips">';
    if (p.cat) html += '<span class="d-chip">' + esc(p.cat) + '</span>';
    if (p.stage) html += '<span class="d-chip">' + esc(detailStageLabel(p.stage)) + '</span>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function detailOpenKind(p) {
  if (p.kind === 'question') return 'thread';
  if (p.kind === 'opportunity') return 'opp';
  return p.kind;
}

function detailEngage(p) {
  var n;
  var btns = [];
  if (p.kind === 'question') {
    n = p.replies ? p.replies.length : 0;
    btns.push(
      engageBtn(
        'data-focus-reply="1"',
        iconReply(),
        n === 1 ? '1 reply' : n + ' replies',
        false
      )
    );
    if (!p.mine) btns.push(reportEngageBtn('thread', p.id));
  } else if (p.kind === 'story') {
    btns.push(
      engageBtn(
        'data-inspire="' + esc(p.id) + '"',
        iconHeart(),
        'Inspired',
        isInspired(p.id)
      )
    );
    btns.push(saveEngageBtn(p.id));
    if (!p.mine) btns.push(reportEngageBtn('story', p.id));
  } else if (p.kind === 'journey') {
    btns.push(saveEngageBtn(p.id));
    if (!p.mine) btns.push(reportEngageBtn('journey', p.id));
  } else if (p.kind === 'opportunity') {
    if (!isOwnCard('opp', p.id, !!p.mine)) btns.push(reportEngageBtn('opp', p.id));
  } else if (p.kind === 'session') {
    btns.push(saveEngageBtn(p.id));
    if (!isOwnCard('session', p.id, !!p.mine)) btns.push(reportEngageBtn('session', p.id));
  }
  return engageBar(btns);
}

function readKindLabel(p) {
  if (p.kind === 'question') return 'The question';
  if (p.kind === 'story') return 'The story';
  if (p.kind === 'journey') return 'The pathway';
  if (p.kind === 'opportunity') return 'The opening';
  if (p.kind === 'session') return 'The session';
  return '';
}

function content(p) {
  var html;
  var i;
  var rows;
  var row;
  var accent;
  var qbody;
  var paras = [];
  if (p.kind === 'question') {
    qbody = p.body || '';
    if (qbody && qbody === p.title) qbody = '';
    if (qbody) paras.push(qbody);
    if (p.extra) paras.push(p.extra);
  } else if (p.body && p.body.length) {
    if (typeof p.body === 'string') paras.push(p.body);
    else {
      for (i = 0; i < p.body.length; i++) paras.push(p.body[i]);
    }
  }
  if (paras.length && paras[0] === p.title) paras.shift();
  html = '<div class="d-read">';
  if (readKindLabel(p)) html += '<p class="d-read-kicker">' + esc(readKindLabel(p)) + '</p>';
  html += '<h2 class="d-title">' + esc(p.title) + '</h2>';
  if (p.kind === 'journey' && paras.length) {
    html += '<ol class="d-path">';
    for (i = 0; i < paras.length; i++) html += '<li>' + esc(paras[i]) + '</li>';
    html += '</ol>';
  } else {
    for (i = 0; i < paras.length; i++) {
      html += '<p' + (i === 0 ? ' class="d-lead"' : '') + '>' + esc(paras[i]) + '</p>';
    }
  }
  html += renderImages(p.images, 'detail');
  html += '</div>';
  if (p.kind === 'opportunity') {
    if ((p.state || 'live') === 'pending' && p.author === currentPosterId()) {
      html += '<p class="wait-line">Waiting for a mentor to check this.</p>';
    }
    if ((p.state || '') === 'returned' && p.author === currentPosterId()) {
      html +=
        '<p class="wait-line">Sent back' +
        (p.returnReason ? ': ' + esc(p.returnReason) : '.') +
        '</p>';
    }
    html += openingCheckedHtml({
      state: p.state,
      checkedAt: p.checkedAt,
      checkedBy: p.checkedBy,
      source: p.source
    });
  }
  if (p.kind === 'opportunity' || p.kind === 'session') {
    rows = '';
    if (p.details) {
      for (i = 0; i < p.details.length; i++) {
        row = p.details[i];
        if (!row.value) continue;
        accent = row.accent ? ' d-accent' : '';
        rows +=
          '<div class="d-fact"><dt>' +
          esc(row.label) +
          '</dt><dd class="' +
          accent +
          '">' +
          esc(row.value) +
          '</dd></div>';
      }
    }
    if (rows) html += '<dl class="d-facts">' + rows + '</dl>';
    if (p.kind === 'opportunity' && p.verified) {
      html += '<p class="d-verified">' + esc(p.verified) + '</p>';
    }
  }
  return html;
}

function replies(p) {
  if (p.kind !== 'question') return '';
  var list = p.replies || [];
  var html;
  var i;
  var r;
  var a;
  var name;
  var headline;
  html =
    '<div class="d-replies"><p class="d-count">' +
    list.length +
    (list.length === 1 ? ' reply' : ' replies') +
    ', in the order they were written</p>';
  for (i = 0; i < list.length; i++) {
    r = list[i];
    a = r.a ? author(r.a) : null;
    name = a ? a.name : r.who || 'Student';
    headline = a ? a.pos || '' : '';
    html +=
      '<div class="d-reply">' +
      '<span class="av' +
      (a ? '' : ' av-anon') +
      '" aria-hidden="true">' +
      esc(a ? a.init : '?') +
      '</span>' +
      '<div>' +
      nameWithBadge(name, a) +
      (headline ? '<div class="d-sub">' + esc(headline) + '</div>' : '') +
      '<p>' +
      esc(r.text) +
      '</p></div></div>';
  }
  html +=
    '<div class="d-replybox"><label class="field-label" for="thread-reply">Write a reply</label>' +
    '<textarea id="thread-reply" rows="3" placeholder="One clear point is enough"></textarea>' +
    '<button type="button" class="btn sm" data-thread-reply="' +
    esc(p.id) +
    '">Post reply</button></div></div>';
  return html;
}

function resourceOpen(r) {
  if (r.k === 'Opportunity' && r.ref) return { kind: 'opp', id: r.ref };
  if (r.k === 'Session' && r.ref) return { kind: 'session', id: r.ref };
  return null;
}

function attachRow(opts) {
  var html;
  var open = opts.open;
  var tag = open ? 'button' : 'div';
  var attrs = open
    ? ' type="button" class="d-row clickable" data-open="' +
      esc(open.kind) +
      '" data-id="' +
      esc(open.id) +
      '"'
    : ' class="d-row"';
  html = '<' + tag + attrs + '>';
  if (opts.d && opts.dw) {
    html +=
      '<span class="d-date" aria-hidden="true"><b>' +
      esc(opts.d) +
      '</b><small>' +
      esc(opts.dw) +
      '</small></span>';
  } else if (opts.k) {
    html += '<span class="d-kind">' + esc(opts.k) + '</span>';
  }
  html +=
    '<span class="d-rowmain"><strong>' +
    esc(opts.title) +
    '</strong>' +
    (opts.s ? '<span class="d-sub">' + esc(opts.s) + '</span>' : '') +
    '</span>';
  if (open) html += chevronSvg();
  html += '</' + tag + '>';
  return html;
}

function resources(p) {
  var ids = p.res || [];
  var rows = '';
  var i;
  var r;
  var dest;
  var heading;
  for (i = 0; i < ids.length; i++) {
    r = RES[ids[i]];
    if (!r) continue;
    dest = resourceOpen(r);
    rows += attachRow({
      k: r.k,
      title: r.t,
      s: r.s,
      d: r.d,
      dw: r.dw,
      open: dest
    });
  }
  if (!rows) return '';
  if (p.kind === 'question') heading = 'Resources mentors added';
  else if (p.kind === 'story' || p.kind === 'journey') heading = 'What they attached';
  else heading = 'Useful with this';
  return '<div class="d-block"><h3>' + heading + '</h3>' + rows + '</div>';
}

function similarItem(p, sid) {
  var item;
  var o;
  var s;
  var a;
  var j;
  if (p.kind === 'journey') {
    a = author(sid);
    j = JOURNEYS[sid];
    if (!j) return '';
    return attachRow({
      k: 'Journey',
      title: a.name,
      s: j.field || j.hook || '',
      open: { kind: 'journey', id: sid }
    });
  }
  if (p.kind === 'opportunity') {
    o = OPPS[sid];
    if (!o) return '';
    return attachRow({
      k: 'Opportunity',
      title: o.name,
      s: o.one || '',
      open: { kind: 'opp', id: sid }
    });
  }
  if (p.kind === 'session') {
    s = sessionById(sid);
    if (!s) return '';
    return attachRow({
      k: 'Session',
      title: s.title,
      s: sessionWhen(s),
      d: s.date,
      dw: s.day,
      open: { kind: 'session', id: sid }
    });
  }
  item = feedById(sid);
  if (!item) return '';
  if (p.kind === 'question') {
    return attachRow({
      k: 'Question',
      title: item.title,
      s: item.who || timeAgo(item.at) || '',
      open: { kind: 'thread', id: sid }
    });
  }
  return attachRow({
    k: 'Story',
    title: item.title,
    s: timeAgo(item.at) || '',
    open: { kind: 'story', id: sid }
  });
}

function similar(p) {
  var ids = p.similar || [];
  var rows = '';
  var i;
  var n = 0;
  var heading;
  for (i = 0; i < ids.length && n < 3; i++) {
    var row = similarItem(p, ids[i]);
    if (row) {
      rows += row;
      n += 1;
    }
  }
  if (!rows) return '';
  if (p.kind === 'question') heading = 'Similar questions';
  else if (p.kind === 'story') heading = 'More stories like this';
  else if (p.kind === 'journey') heading = 'Other journeys';
  else if (p.kind === 'opportunity') heading = 'Similar openings';
  else heading = 'Other sessions';
  return '<div class="d-block"><h3>' + heading + '</h3>' + rows + '</div>';
}

function action(p) {
  var line;
  var label;
  var attrs;
  if (p.kind === 'question') {
    line = 'We will alert you when someone else answers.';
    label = S.qFollow.indexOf(p.id) !== -1 ? 'Following this question' : 'Follow this question';
    attrs = 'data-follow-q="' + esc(p.id) + '"';
  } else if (p.kind === 'story') {
    line = 'It sits with your current step so you can come back to it.';
    label = 'Save to my pathway';
    attrs = 'data-take-story="' + esc(p.id) + '"';
  } else if (p.kind === 'journey') {
    line = 'It sits with your current step so you can come back to it.';
    label = 'Save to my pathway';
    attrs = 'data-jstep-all="' + esc(p.id) + '"';
  } else if (p.kind === 'opportunity') {
    line = 'It shows up under your pathway with the details attached.';
    label = isSaved(p.id) ? 'Saved to my pathway' : 'Save this opening';
    attrs = 'data-save="' + esc(p.id) + '"';
  } else if (p.kind === 'session') {
    line = 'Your question goes on the list the mentor sees beforehand.';
    label = S.booked.indexOf(p.id) !== -1 ? 'Manage booking' : 'Book a place';
    attrs = 'data-open="book" data-id="' + esc(p.id) + '"';
  } else {
    return '';
  }
  return (
    '<div class="d-action"><p>' +
    line +
    '</p><button type="button" class="btn" ' +
    attrs +
    '>' +
    label +
    '</button></div>'
  );
}

function renderSimpleDetail(p) {
  var html = '<div class="detail d-simple">' + head(p) + content(p) + detailEngage(p) + action(p);
  if (p.kind === 'question') {
    html += replies(p) + '</div>';
    return html;
  }
  html += resources(p) + similar(p) + '</div>';
  return html;
}

function viewThread(v) {
  var item = feedById(v.id);
  var p;
  if (!item) return { crumb: 'Question', title: 'Missing', html: '<p>Not found.</p>' };
  ensureReplyIds(item);
  if (item.mine && item.newReply) item.newReply = false;
  pushRecent('thread', item.id, item.title);
  p = loadDetail('question', v.id);
  return { crumb: 'Question', title: 'Question', html: renderSimpleDetail(p) };
}

function viewStory(v) {
  var item = feedById(v.id);
  var p;
  if (!item) return { crumb: 'Story', title: 'Missing', html: '<p>Not found.</p>' };
  pushRecent('story', item.id, item.title);
  p = loadDetail('story', v.id);
  return { crumb: 'Story', title: 'Story', html: renderSimpleDetail(p) };
}

function viewOpp(v) {
  var o = OPPS[v.id];
  var p;
  if (!o || !openingVisible(o)) return { crumb: 'Opportunity', title: 'Missing', html: '<p>Not found.</p>' };
  pushRecent('opp', o.id, o.name);
  p = loadDetail('opp', v.id);
  return { crumb: 'Opportunity', title: 'Opportunity', html: renderSimpleDetail(p) };
}

function viewSession(v) {
  var s = sessionById(v.id);
  var p;
  if (!s) return { crumb: 'Session', title: 'Missing', html: '<p>Not found.</p>' };
  pushRecent('session', s.id, s.title);
  p = loadDetail('session', v.id);
  return { crumb: 'Session', title: 'Session', html: renderSimpleDetail(p) };
}

function viewJourney(v) {
  var a = author(v.id);
  var j = JOURNEYS[v.id];
  var p;
  if (!j) return { crumb: 'Journey', title: 'Missing', html: '<p>Not found.</p>' };
  pushRecent('journey', v.id, a.name + ' journey');
  p = loadDetail('journey', v.id);
  return { crumb: 'Journey', title: 'Journey', html: renderSimpleDetail(p) };
}

function viewCompose() {
  return {
    crumb: 'New post',
    title: composeSheetTitle(),
    html: renderComposer(),
    after: function () {
      wireComposeLive();
      var first = byId('comp-title') || byId('comp-text');
      if (first) first.focus();
    }
  };
}

function composeSheetTitle() {
  var k = S.compose.kind;
  if (S.compose.step === 'choose') return 'What are you posting';
  if (k === 'question') return 'Ask a question';
  if (k === 'story') return 'Share a story';
  if (k === 'journey') return 'Share a journey';
  if (k === 'opportunity') return 'Post an opening';
  if (k === 'session') return 'Post a session';
  return 'New post';
}

function openCompose(seed, cat) {
  var types;
  if (isVisitor()) {
    S.pendingAction = { type: 'compose' };
    go({ t: 'postgate', id: '0' });
    return;
  }
  types = composeTypesFor(postingRole());
  if (!types.length) {
    go({ t: 'postgate', id: '0' });
    return;
  }
  if (seed != null && seed !== '') S.draft = seed;
  if (cat) S.draftCat = cat;
  if (types.length === 1) {
    resetCompose(types[0]);
    S.compose.step = 'write';
  } else {
    resetCompose(types[0]);
    S.compose.step = 'choose';
  }
  if (seed && types[0] === 'question') S.compose.title = seed;
  if (cat) S.compose.topic = cat;
  go({ t: 'compose', id: 'new' });
}

function fieldErr(id, msg) {
  if (!msg) return '<span class="d-err" id="' + id + '-err" hidden></span>';
  return '<span class="d-err" id="' + id + '-err">' + esc(msg) + '</span>';
}

function composeValidate() {
  var c = S.compose;
  var k = c.kind;
  var errs = {};
  var reason = '';
  var t;
  var n;
  if (k === 'question') {
    t = (c.title || '').trim();
    n = t.length;
    if (n < 15 || n > 140) errs.title = '15 to 140 characters.';
    if (t && t.charAt(t.length - 1) !== '?') errs.title = 'End with a question mark.';
    if (!t) errs.title = 'Write the question.';
  } else if (k === 'story' || k === 'journey') {
    if ((c.title || '').trim().length < 10) errs.title = 'Title needs 10 or more characters.';
    if ((c.body || '').trim().length < 200) errs.body = 'Write at least 200 characters.';
  } else if (k === 'opportunity') {
    if (!(c.when || '').trim()) errs.when = 'When is required.';
    if (!(c.cost || '').trim()) errs.cost = 'Cost is required. "No fee" is fine.';
    if (!(c.ages || '').trim()) errs.ages = 'Ages is required.';
    if (!(c.regions || '').trim()) errs.regions = 'Regions is required.';
    if (!(c.grade || '').trim()) errs.grade = 'Grade requirement is required. "None" is fine.';
    if (!(c.source || '').trim()) errs.source = 'Source link is required.';
    if (!(c.title || '').trim()) errs.title = 'Title is required.';
    if (!(c.body || '').trim()) errs.body = 'Write what it is.';
  } else if (k === 'session') {
    if (!(c.date || '').trim()) errs.date = 'Date and time is required.';
    if (!(c.length || '').trim()) errs.length = 'Length is required.';
    if (!(c.where || '').trim()) errs.where = 'Where is required.';
    if (!(c.capacity || '').trim()) errs.capacity = 'Capacity is required.';
    if (!(c.title || '').trim()) errs.title = 'Title is required.';
    if (!(c.body || '').trim()) errs.body = 'Write what it is.';
  }
  if (c.step === 'attach') {
    if (!(c.topic || '').trim()) errs.topic = 'Topic is required.';
    if (!(c.stage || '').trim()) errs.stage = 'Stage is required.';
  }
  if (c.step === 'write') {
    if (k === 'question' && errs.title) reason = errs.title;
    else if ((k === 'story' || k === 'journey') && (errs.title || errs.body)) {
      reason = errs.body || errs.title;
    } else if (k === 'opportunity') {
      reason = errs.title || errs.body || errs.when || errs.cost || errs.ages || errs.regions || errs.grade || errs.source || '';
    } else if (k === 'session') {
      reason = errs.title || errs.body || errs.date || errs.length || errs.where || errs.capacity || '';
    }
  } else if (c.step === 'attach') {
    reason = errs.topic || errs.stage || '';
  }
  return { errs: errs, reason: reason, ok: !reason };
}

function paintComposeErrors(errs) {
  var ids = ['title', 'body', 'when', 'cost', 'ages', 'regions', 'grade', 'source', 'date', 'length', 'where', 'capacity', 'lead', 'topic', 'stage'];
  var i;
  var el;
  var msg;
  for (i = 0; i < ids.length; i++) {
    el = byId('comp-' + ids[i] + '-err');
    if (!el) continue;
    msg = errs[ids[i]] || '';
    el.textContent = msg;
    el.hidden = !msg;
  }
  el = byId('comp-text-err');
  if (el) {
    msg = errs.title || errs.body || '';
    el.textContent = msg;
    el.hidden = !msg;
  }
}

function refreshComposeValid() {
  var v = composeValidate();
  var btn = byId('comp-next') || byId('comp-submit');
  var why = byId('comp-why');
  var count;
  paintComposeErrors(v.errs);
  if (btn) btn.disabled = !v.ok;
  if (why) {
    why.textContent = v.ok ? '' : v.reason;
    why.hidden = v.ok;
  }
  count = byId('comp-count');
  if (count) {
    if (S.compose.kind === 'question') count.textContent = String((S.compose.title || '').length) + ' / 140';
    else if (S.compose.kind === 'story' || S.compose.kind === 'journey') {
      count.textContent = String((S.compose.body || '').length) + ' characters';
    }
  }
}

function readComposeFields() {
  var c = S.compose;
  function val(id) {
    var el = byId(id);
    return el ? el.value : '';
  }
  function checked(id) {
    var el = byId(id);
    return !!(el && el.checked);
  }
  if (byId('comp-title')) c.title = val('comp-title');
  if (byId('comp-text')) {
    if (c.kind === 'question') c.title = val('comp-text');
    else c.body = val('comp-text');
  }
  if (byId('comp-extra')) c.extra = val('comp-extra');
  if (byId('comp-when')) c.when = val('comp-when');
  if (byId('comp-cost')) c.cost = val('comp-cost');
  if (byId('comp-ages')) c.ages = val('comp-ages');
  if (byId('comp-regions')) c.regions = val('comp-regions');
  if (byId('comp-grade')) c.grade = val('comp-grade');
  if (byId('comp-source')) c.source = val('comp-source');
  if (byId('comp-date')) c.date = val('comp-date');
  if (byId('comp-length')) c.length = val('comp-length');
  if (byId('comp-where')) c.where = val('comp-where');
  if (byId('comp-capacity')) c.capacity = val('comp-capacity');
  if (byId('comp-lead')) c.lead = val('comp-lead');
  if (byId('comp-topic')) c.topic = val('comp-topic');
  if (byId('comp-stage')) c.stage = val('comp-stage');
  if (byId('comp-res-other')) c.resOther = val('comp-res-other');
  if (byId('comp-anon')) c.anon = checked('comp-anon');
}

function wireComposeLive() {
  refreshComposeValid();
}

function inputLabel(id, text) {
  return '<label class="field-label" for="' + id + '">' + text + '</label>';
}

function textField(id, key, label, ph) {
  return (
    inputLabel(id, label) +
    '<input type="text" id="' +
    id +
    '" data-compose="' +
    key +
    '" placeholder="' +
    esc(ph || '') +
    '" value="' +
    esc(S.compose[key] || '') +
    '"/>' +
    fieldErr(id, '')
  );
}

function renderComposerChoose() {
  var types = composeTypesFor(postingRole());
  var labels = {
    question: 'Question',
    story: 'Story',
    journey: 'Journey',
    opportunity: 'Opening',
    session: 'Session'
  };
  var html = '<div class="composer compose-panel"><p class="muted">Pick what you are posting.</p>';
  var i;
  for (i = 0; i < types.length; i++) {
    html +=
      '<button type="button" class="d-row clickable" data-compose-kind="' +
      types[i] +
      '"><span class="d-rowmain"><strong>' +
      labels[types[i]] +
      '</strong></span>' +
      chevronSvg() +
      '</button>';
  }
  html += '</div>';
  return html;
}

function mentorLeadOptions() {
  var html = '<option value="">Select a mentor</option>';
  var k;
  var a;
  for (k in AUTHORS) {
    if (!AUTHORS.hasOwnProperty(k)) continue;
    a = AUTHORS[k];
    if (a.role !== 'mentor') continue;
    html +=
      '<option value="' +
      esc(k) +
      '"' +
      (S.compose.lead === k ? ' selected' : '') +
      '>' +
      esc(a.name) +
      '</option>';
  }
  return html;
}

function renderImagePicker() {
  var c = S.compose;
  var html;
  var i;
  var img;
  if (c.kind !== 'story' && c.kind !== 'journey' && c.kind !== 'opportunity') return '';
  html = '<div class="comp-imgs"><p class="field-label">Pictures</p>';
  for (i = 0; i < (c.images || []).length; i++) {
    img = c.images[i];
    html +=
      '<div class="comp-thumb"><img src="' +
      esc(img.src) +
      '" alt="' +
      esc(img.alt || '') +
      '"/><button type="button" class="btn sm g" data-img-remove="' +
      i +
      '">Remove</button></div>';
  }
  if ((c.images || []).length < 3) {
    html +=
      '<label class="btn sm g" for="comp-img">Add a picture</label>' +
      '<input type="file" id="comp-img" accept="image/*" hidden/>';
  }
  html += '</div>';
  return html;
}

function renderComposerWrite() {
  var c = S.compose;
  var k = c.kind;
  var html = '<div class="composer compose-panel" id="composer">';
  if (isPendingPoster()) {
    html +=
      '<p class="wait-line">Your application is being reviewed. You can ask questions in the meantime.</p>';
  }
  if (k === 'question') {
    html += inputLabel('comp-text', 'What do you want to know?');
    html +=
      '<textarea id="comp-text" data-compose="title" rows="5" placeholder="Be specific about your form and your region. End with a question mark.">' +
      esc(c.title || '') +
      '</textarea>' +
      fieldErr('comp-text', '') +
      '<p class="d-count" id="comp-count"></p>';
    html += inputLabel('comp-extra', 'Anything else we should know');
    html +=
      '<textarea id="comp-extra" data-compose="extra" rows="3" placeholder="Optional">' +
      esc(c.extra || '') +
      '</textarea>';
    html += '<div id="dup-slot">' + dupHintHtml(c.title || '') + '</div>';
  } else if (k === 'story' || k === 'journey') {
    html += textField('comp-title', 'title', 'Title', 'Give it a name');
    html += inputLabel('comp-text', 'Write it your way');
    html +=
      '<textarea id="comp-text" data-compose="body" rows="10" placeholder="' +
      (k === 'story'
        ? 'One turning point is enough. What happened, and what you would do differently.'
        : 'The road you took, in your own words. Where it started, what changed, where you are now.') +
      '">' +
      esc(c.body || '') +
      '</textarea>' +
      fieldErr('comp-text', '') +
      '<p class="d-count" id="comp-count"></p>';
    html += renderImagePicker();
  } else if (k === 'opportunity') {
    html += textField('comp-title', 'title', 'Title', 'Name of the opening');
    html += inputLabel('comp-text', 'What it is');
    html +=
      '<textarea id="comp-text" data-compose="body" rows="6" placeholder="Write the opening in plain language.">' +
      esc(c.body || '') +
      '</textarea>' +
      fieldErr('comp-text', '');
    html += textField('comp-when', 'when', 'When', 'Season or dates');
    html += textField('comp-cost', 'cost', 'Cost', 'No fee is a valid answer');
    html += textField('comp-ages', 'ages', 'Ages', 'Who it is for');
    html += textField('comp-regions', 'regions', 'Regions', 'Where it runs');
    html += textField('comp-grade', 'grade', 'Grade requirement', 'None is a valid answer');
    html += textField('comp-source', 'source', 'Source link', 'The organiser page');
    html += renderImagePicker();
  } else if (k === 'session') {
    html += textField('comp-title', 'title', 'Title', 'Name of the session');
    html += inputLabel('comp-text', 'What it is');
    html +=
      '<textarea id="comp-text" data-compose="body" rows="6" placeholder="What students will walk through.">' +
      esc(c.body || '') +
      '</textarea>' +
      fieldErr('comp-text', '');
    html += textField('comp-date', 'date', 'Date and time', 'Thursday 18 September, 6:00 PM');
    html += textField('comp-length', 'length', 'Length in minutes', '60');
    html += textField('comp-where', 'where', 'Where', 'Google Meet');
    html += textField('comp-capacity', 'capacity', 'Capacity', '25');
    html += '<p class="hosted-by">Hosted by you</p>';
  }
  html +=
    '<div class="d-submit"><p class="d-err" id="comp-why" hidden></p>' +
    '<button type="button" class="btn" id="comp-next" disabled>Continue</button></div></div>';
  return html;
}

function renderComposerAttach() {
  var c = S.compose;
  var k = c.kind;
  var html = '<div class="composer compose-panel" id="composer">';
  html += '<p class="field-label">Attach from the list</p>';
  var k;
  var r;
  var on;
  for (k in RES) {
    if (!RES.hasOwnProperty(k)) continue;
    r = RES[k];
    on = c.res.indexOf(k) !== -1;
    html +=
      '<label class="d-pick"><input type="checkbox" data-res="' +
      esc(k) +
      '"' +
      (on ? ' checked' : '') +
      '/> <span><strong>' +
      esc(r.t) +
      '</strong><span class="d-sub">' +
      esc(r.k) +
      (r.s ? ' · ' + esc(r.s) : '') +
      '</span></span></label>';
  }
  html +=
    '<div class="comp-file"><label class="btn sm g" for="comp-file">Attach a file</label>' +
    '<input type="file" id="comp-file" hidden/>' +
    '<p class="hint">A PDF, a form or a syllabus extract becomes a File row.</p></div>';
  html +=
    inputLabel('comp-res-other', 'Something not listed') +
    '<input type="text" id="comp-res-other" data-compose="resOther" placeholder="The desk checks links before they go live" value="' +
    esc(c.resOther || '') +
    '"/>';
  html += inputLabel('comp-topic', 'Topic');
  html += '<select id="comp-topic" data-compose="topic"><option value="">Select a topic</option>';
  var i;
  for (i = 0; i < CATS.length; i++) {
    html +=
      '<option value="' +
      esc(CATS[i]) +
      '"' +
      (c.topic === CATS[i] ? ' selected' : '') +
      '>' +
      esc(CATS[i]) +
      '</option>';
  }
  html += '</select>' + fieldErr('comp-topic', '');
  html += inputLabel('comp-stage', 'Stage');
  html += '<select id="comp-stage" data-compose="stage"><option value="">Select a stage</option>';
  for (i = 0; i < STAGES.length; i++) {
    html +=
      '<option value="' +
      esc(STAGES[i].key) +
      '"' +
      (c.stage === STAGES[i].key ? ' selected' : '') +
      '>' +
      esc(STAGES[i].name) +
      '</option>';
  }
  html += '</select>' + fieldErr('comp-stage', '');
  if (postingRole() === 'student') {
    html +=
      '<label class="check"><input type="checkbox" id="comp-anon"' +
      (c.anon ? ' checked' : '') +
      '/> Post without my name</label>';
  }
  html +=
    '<p class="d-err" id="comp-why" hidden></p>' +
    '<button type="button" class="btn" id="comp-submit" disabled>' +
    (c.editId ? 'Save changes' : k === 'opportunity' ? 'Send for a mentor check' : 'Post to the feed') +
    '</button></div>';
  return html;
}

function renderComposer() {
  if (S.compose.step === 'choose') return renderComposerChoose();
  if (S.compose.step === 'attach') return renderComposerAttach();
  return renderComposerWrite();
}

function submitCompose() {
  var c = S.compose;
  var v = composeValidate();
  var nid;
  var body;
  var host;
  var s;
  var poster = currentPosterId();
  var images = (c.images || []).slice();
  if (!v.ok) {
    refreshComposeValid();
    return;
  }
  if (c.editId && c.kind === 'opportunity' && OPPS[c.editId]) {
    OPPS[c.editId].name = c.title.trim();
    OPPS[c.editId].one = c.body.trim();
    OPPS[c.editId].what = [c.body.trim()];
    OPPS[c.editId].season = c.when.trim();
    OPPS[c.editId].cost = c.cost.trim();
    OPPS[c.editId].who = c.ages.trim();
    OPPS[c.editId].regions = c.regions.trim();
    OPPS[c.editId].grade = c.grade.trim();
    OPPS[c.editId].source = c.source.trim();
    OPPS[c.editId].images = images;
    OPPS[c.editId].state = 'pending';
    OPPS[c.editId].returnReason = '';
    OPPS[c.editId].checkedAt = '';
    OPPS[c.editId].checkedBy = '';
    toast('Sent back for a mentor check.');
    S.draft = '';
    closeSheet();
    setView('feed');
    return;
  }
  nid = 'mine-' + Date.now();
  if (c.kind === 'question') {
    FEED.unshift({
      id: nid,
      kind: 'question',
      at: nowIso(),
      cat: c.topic,
      stage: c.stage,
      anon: c.anon,
      who: studentLabel(),
      title: c.title.trim(),
      body: c.title.trim(),
      extra: (c.extra || '').trim(),
      askedAt: S.form || detailStageLabel(c.stage),
      asks: 1,
      replies: [],
      res: c.res.slice(),
      similar: [],
      rel: [],
      mine: true
    });
    toast('Question posted.');
    simulateReply(nid);
  } else if (c.kind === 'story') {
    body = c.body.trim();
    FEED.unshift({
      id: nid,
      kind: 'story',
      at: nowIso(),
      cat: c.topic,
      stage: c.stage,
      author: postingRole() === 'student' ? null : poster,
      title: c.title.trim(),
      body: [body],
      images: images,
      res: c.res.slice(),
      similar: [],
      insp: 0,
      rel: [],
      mine: true,
      anon: false
    });
    toast('Story posted.');
  } else if (c.kind === 'journey') {
    FEED.unshift({
      id: nid,
      kind: 'journey',
      at: nowIso(),
      cat: c.topic,
      stage: c.stage,
      journey: poster || 'raeka',
      author: poster,
      images: images,
      res: c.res.slice(),
      similar: [],
      mine: true
    });
    toast('Journey posted.');
  } else if (c.kind === 'opportunity') {
    nid = 'opp-' + Date.now();
    OPPS[nid] = {
      id: nid,
      name: c.title.trim(),
      cat: c.topic,
      stage: c.stage,
      stages: [0],
      one: c.body.trim(),
      what: [c.body.trim()],
      season: c.when.trim(),
      cost: c.cost.trim(),
      who: c.ages.trim(),
      regions: c.regions.trim(),
      grade: c.grade.trim(),
      source: c.source.trim(),
      verified: '',
      entry: [],
      tips: [],
      truth: { b: '', p: '' },
      proof: { b: '', p: '' },
      leads: '',
      mentors: [],
      rel: [],
      sess: [],
      independent: false,
      state: 'pending',
      author: poster || '',
      checkedAt: '',
      checkedBy: '',
      returnReason: '',
      images: images
    };
    FEED.unshift({
      id: 'f-' + nid,
      kind: 'opportunity',
      at: nowIso(),
      cat: c.topic,
      author: poster || '',
      opp: nid,
      stage: c.stage,
      images: images,
      res: c.res.slice(),
      similar: [],
      text: c.body.trim(),
      mine: true
    });
    toast('Sent for a mentor check. It is not on the public feed yet.');
  } else if (c.kind === 'session') {
    nid = 's-' + Date.now();
    host = poster;
    s = {
      id: nid,
      title: c.title.trim(),
      day: '',
      date: '',
      dateText: c.date.trim(),
      length: c.length.trim(),
      platform: c.where.trim(),
      when: c.date.trim() + ', ' + c.length.trim() + ' on ' + c.where.trim(),
      pod: '',
      lead: host,
      hosted_by: host,
      seats: parseInt(c.capacity, 10) || 20,
      taken: 0,
      stages: [c.stage],
      cat: c.topic,
      what: c.body.trim(),
      bring: '',
      qs: []
    };
    SESSIONS.push(s);
    FEED.unshift({
      id: 'f-' + nid,
      kind: 'session',
      at: nowIso(),
      cat: c.topic,
      session: nid,
      stage: c.stage,
      res: c.res.slice(),
      similar: [],
      mine: true
    });
    toast('Session posted.');
  }
  S.draft = '';
  S.draftCat = c.topic;
  closeSheet();
  setView('feed');
  window.scrollTo(0, 0);
}

function protoRoleKey() {
  if (S.role === 'visitor' || !S.onboarded) return 'visitor';
  if (S.me && S.me.pending && S.role === 'mentor') return 'pending-mentor';
  if (S.me && S.me.pending && S.role === 'contributor') return 'pending-contributor';
  return S.role;
}

function viewProfile() {
  var roles = [
    ['visitor', 'Visitor'],
    ['student', 'Student'],
    ['pending-contributor', 'Pending contributor'],
    ['contributor', 'Contributor'],
    ['pending-mentor', 'Pending mentor'],
    ['mentor', 'Mentor'],
    ['admin', 'Admin']
  ];
  var html =
    '<div class="detail"><p class="eyebrow">Prototype control</p><h2>Viewing as</h2>' +
    '<p class="muted">This switch is for demonstrating posting roles. It is not a real login. Visitor, student, contributor, mentor and admin are the five roles. Pending states show the review line.</p><div class="d-roles">';
  var i;
  var check = openingsToCheck();
  var key = protoRoleKey();
  for (i = 0; i < roles.length; i++) {
    html +=
      '<button type="button" class="btn' +
      (key === roles[i][0] ? '' : ' g') +
      '" data-role="' +
      roles[i][0] +
      '">' +
      roles[i][1] +
      '</button>';
  }
  html += '</div>';
  if (canCheckOpenings()) {
    html +=
      '<button type="button" class="btn g" data-nav="alerts">Openings to check' +
      (check.length ? ' · ' + check.length : '') +
      '</button>';
  }
  html +=
    '<button type="button" class="btn" data-nav="pathway">My Pathways</button></div>';
  return { crumb: 'Profile', title: 'You', html: html };
}

function viewPostgate() {
  return {
    crumb: 'Post',
    title: 'Build your pathway to post',
    html:
      '<div class="detail post-gate"><h2>Build your pathway to post</h2>' +
      '<p>Six questions. It also tells us which openings fit your form.</p>' +
      '<button type="button" class="btn" data-open="setup" data-id="0">Build my pathway</button></div>'
  };
}

function reportSubject(key) {
  var parts = String(key || '').split(':');
  var kind = parts[0] || '';
  var id = parts.slice(1).join(':');
  var item;
  var o;
  var s;
  var j;
  if (kind === 'thread' || kind === 'story') {
    item = feedById(id);
    if (item) return item.title;
  }
  if (kind === 'opp') {
    o = OPPS[id];
    if (o) return o.name;
  }
  if (kind === 'session') {
    s = sessionById(id);
    if (s) return s.title;
  }
  if (kind === 'journey') {
    j = JOURNEYS[id];
    if (j) return j.hook;
  }
  return 'this post';
}

function viewReport(v) {
  var key = v.id || '';
  var title = reportSubject(key);
  var reasons = [
    { v: 'wrong', t: 'The facts look wrong' },
    { v: 'unkind', t: 'This is unkind' },
    { v: 'off', t: 'This should not be here' }
  ];
  var html =
    '<div class="detail report-sheet"><p>The desk reads these. Pick the reason that fits.</p>' +
    '<p class="report-target">' +
    esc(title) +
    '</p><div class="report-reasons">';
  var i;
  for (i = 0; i < reasons.length; i++) {
    html +=
      '<button type="button" class="report-opt" data-report-key="' +
      esc(key) +
      '" data-report-reason="' +
      esc(reasons[i].v) +
      '">' +
      esc(reasons[i].t) +
      '</button>';
  }
  html += '</div></div>';
  return { crumb: 'Report', title: 'Report this post', html: html };
}

function addComposeFile(f) {
  var kid = 'file-' + Date.now();
  var kb = Math.max(1, Math.round(f.size / 1024));
  RES[kid] = { k: 'File', t: f.name, s: String(kb) + ' KB' };
  if (S.compose.res.indexOf(kid) === -1) S.compose.res.push(kid);
}

function publishOpening(id) {
  var o = OPPS[id];
  if (!o) return;
  if (!canCheckOpenings() || o.author === currentPosterId()) {
    toast('You cannot check your own opening.');
    return;
  }
  o.state = 'live';
  o.checkedAt = nowIso();
  o.checkedBy = currentPosterId();
  o.returnReason = '';
  toast('Published. It is on the public feed.');
  paint();
  render();
}

function returnOpening(id) {
  var o = OPPS[id];
  var reason;
  if (!o) return;
  if (!canCheckOpenings() || o.author === currentPosterId()) {
    toast('You cannot check your own opening.');
    return;
  }
  reason = window.prompt('Why are you sending this back?', '');
  if (reason == null) return;
  reason = String(reason).trim();
  if (!reason) {
    toast('A reason is required to send it back.');
    return;
  }
  o.state = 'returned';
  o.returnReason = reason;
  toast('Sent back to the author.');
  paint();
  render();
}

function viewAlerts() {
  var list = canCheckOpenings() ? openingsToCheck() : [];
  var html = '<div class="detail"><h2>Alerts</h2>';
  var i;
  var o;
  var a;
  if (canCheckOpenings()) {
    html +=
      '<h3>Openings to check' +
      (list.length ? ' · ' + list.length : '') +
      '</h3>';
    if (!list.length) html += '<p class="muted">Nothing waiting.</p>';
    for (i = 0; i < list.length; i++) {
      o = list[i];
      a = author(o.author);
      html +=
        '<div class="check-row"><div><strong>' +
        esc(o.name) +
        '</strong><span class="d-sub">' +
        esc(a.name || 'Unknown') +
        '</span></div>' +
        '<button type="button" class="btn sm" data-opp-live="' +
        esc(o.id) +
        '">Looks right, publish it</button>' +
        '<button type="button" class="btn sm g" data-opp-return="' +
        esc(o.id) +
        '">Send it back</button></div>';
    }
  } else {
    html += '<p class="muted">No alerts right now.</p>';
  }
  html += '</div>';
  return { crumb: 'Alerts', title: 'Alerts', html: html };
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
    esc(sessionWhen(s)) +
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

function commChip(label, on, attrs) {
  return (
    '<button type="button" class="comm-chip' +
    (on ? ' on' : '') +
    '" ' +
    attrs +
    '>' +
    esc(label) +
    '</button>'
  );
}

function renderArchCard() {
  var arch = S.myArch ? ARCHETYPES[S.myArch] : null;
  var nDir;
  var nStu;
  var html = '<section class="comm-arch">';
  if (!arch) {
    html +=
      '<p class="eyebrow">Start here</p>' +
      '<h2>Which explorer are you?</h2>' +
      '<p class="comm-arch-line">Five questions. It names the kind of explorer you are and shows you mentors and contributors who came out the same way.</p>' +
      '<button type="button" class="btn" data-arch-start="1">Take the archetype check</button>';
  } else {
    nDir = sameArchPeople(arch.key).length;
    nStu = ARCH_COUNTS[arch.key] || 0;
    html +=
      '<div class="comm-arch-after">' +
      '<span class="comm-glyph" aria-hidden="true">' +
      esc(arch.glyph) +
      '</span>' +
      '<div><p class="eyebrow">Your archetype</p><h2>' +
      esc(arch.name) +
      '</h2></div></div>' +
      '<p class="comm-arch-line">' +
      esc(arch.blurb) +
      '</p>' +
      '<div class="comm-arch-acts">' +
      '<button type="button" class="btn" data-comm-role="likeme">See the ' +
      nDir +
      ' like you</button>' +
      '<button type="button" class="btn g" data-arch-start="1">Retake</button></div>' +
      '<p class="comm-arch-note">' +
      nStu +
      ' students share it. We do not list students here, so their names stay private.</p>';
  }
  html += '</section>';
  return html;
}

function renderCommTools() {
  var html =
    '<section class="comm-tools"><div class="comm-search">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
    '<input type="search" id="q" value="' +
    esc(S.commQ || '') +
    '" placeholder="Search a name or a career" aria-label="Search a name or a career" autocomplete="off"/>' +
    '</div><div class="comm-chips" role="group" aria-label="Role">';
  html += commChip('Everyone', S.commRole === 'all', 'data-comm-role="all"');
  html += commChip('Mentors', S.commRole === 'mentors', 'data-comm-role="mentors"');
  html += commChip(
    'Contributors',
    S.commRole === 'contributors',
    'data-comm-role="contributors"'
  );
  if (S.myArch) {
    html += commChip('Like me', S.commRole === 'likeme', 'data-comm-role="likeme"');
  }
  html += '</div><div class="comm-chips" role="group" aria-label="Career">';
  html += commChip('All careers', !S.commCareer, 'data-comm-career=""');
  var i;
  for (i = 0; i < CAREER_FILTERS.length; i++) {
    html += commChip(
      CAREER_FILTERS[i],
      S.commCareer === CAREER_FILTERS[i],
      'data-comm-career="' + esc(CAREER_FILTERS[i]) + '"'
    );
  }
  html += '</div></section>';
  return html;
}

function renderCommunity() {
  var dir = filteredPeople();
  var followed = followedPeople();
  var html = '<div class="page-comm">';
  html += '<h1>Community</h1>';
  html += renderArchCard();
  html += renderCommTools();
  if (followed.length) {
    html +=
      '<section class="comm-sec"><h2>People you follow · ' +
      followed.length +
      '</h2>' +
      personCardsHtml(followed) +
      '</section>';
  }
  html += '<section class="comm-sec">';
  if (S.commRole === 'likeme' && S.myArch) {
    html += '<h2>Same archetype as you · ' + dir.length + '</h2>';
  } else {
    html += '<h2>Mentors and contributors · ' + dir.length + '</h2>';
  }
  if (!dir.length) {
    html +=
      '<div class="comm-empty"><p class="comm-empty-t">Nobody matches that</p>' +
      '<p>Try a shorter word, or clear the filters.</p></div>';
  } else {
    html += personCardsHtml(dir);
  }
  html += '</section></div>';
  return html;
}

function personPostRow(ref) {
  var kind = ref.kind;
  var id = ref.id;
  var title = '';
  var meta = '';
  var openK = kind;
  var item;
  var o;
  var s;
  var j;
  var a;
  var fi;
  if (kind === 'story' || kind === 'question') {
    item = feedById(id);
    if (!item) return '';
    title = item.title;
    meta = timeAgo(item.at);
    openK = kind === 'question' ? 'thread' : 'story';
  } else if (kind === 'journey') {
    j = JOURNEYS[id];
    a = author(id);
    if (!j) return '';
    title = j.hook || a.name;
    for (fi = 0; fi < FEED.length; fi++) {
      if (FEED[fi].kind === 'journey' && FEED[fi].journey === id) item = FEED[fi];
    }
    meta = item ? timeAgo(item.at) : '';
    openK = 'journey';
  } else if (kind === 'session') {
    s = sessionById(id);
    if (!s) return '';
    title = s.title;
    meta = s.dateText || sessionWhen(s);
    openK = 'session';
  } else if (kind === 'opportunity' || kind === 'opp') {
    o = OPPS[id];
    if (!o) return '';
    title = o.name;
    meta = o.checkedAt ? 'Checked ' + formatCheckedDay(o.checkedAt) : '';
    openK = 'opp';
  } else {
    return '';
  }
  if (kind === 'session' && s) {
    return (
      '<button type="button" class="d-row clickable" data-open="' +
      esc(openK) +
      '" data-id="' +
      esc(id) +
      '"><span class="d-date" aria-hidden="true"><b>' +
      esc(s.date) +
      '</b><small>' +
      esc(s.day) +
      '</small></span><span class="d-rowmain"><strong>' +
      esc(title) +
      '</strong><span class="d-sub">' +
      esc(meta) +
      '</span></span>' +
      chevronSvg() +
      '</button>'
    );
  }
  return (
    '<button type="button" class="d-row clickable" data-open="' +
    esc(openK) +
    '" data-id="' +
    esc(id) +
    '"><span class="d-kind k-' +
    esc(kind) +
    '">' +
    esc(kind === 'opportunity' || kind === 'opp' ? 'Opening' : kind.charAt(0).toUpperCase() + kind.slice(1)) +
    '</span><span class="d-rowmain"><strong>' +
    esc(title) +
    '</strong>' +
    (meta ? '<span class="d-sub">' + esc(meta) + '</span>' : '') +
    '</span>' +
    chevronSvg() +
    '</button>'
  );
}

function viewPerson(v) {
  var p = personById(v.id);
  var a = author(v.id);
  var posts;
  var html;
  var i;
  if (!p) return { crumb: 'Person', title: 'Missing', html: '<p>Not found.</p>' };
  posts = personPosts(v.id);
  pushRecent('person', v.id, p.name);
  html =
    '<div class="page-person">' +
    '<button type="button" class="person-back" data-person-back="1">' +
    iconBack() +
    '<span>Back</span></button>' +
    '<div class="person-cover ' +
    esc(p.av || 'av-1') +
    '" aria-hidden="true"></div>' +
    '<div class="person-id">' +
    '<span class="person-av av ' +
    esc(p.av || 'av-1') +
    '" aria-hidden="true">' +
    esc(a.init || p.name.charAt(0)) +
    '</span>' +
    nameWithBadge(p.name, a) +
    '<p class="person-title">' +
    esc(p.title) +
    '</p>';
  html += personFollowBtn(v.id, 'is-wide');
  html += '</div>';
  if (p.about) {
    html +=
      '<section class="person-block"><p class="eyebrow">About</p><p>' +
      esc(p.about) +
      '</p></section>';
  }
  html +=
    '<section class="person-block"><h3>Their posts · ' +
    posts.length +
    '</h3>';
  for (i = 0; i < posts.length; i++) html += personPostRow(posts[i]);
  html += '</section></div>';
  return { crumb: 'Community', title: p.name, html: html };
}

function viewArchtest(v) {
  var step = parseInt(v.id, 10);
  var q;
  var html;
  var i;
  var key;
  var arch;
  var same;
  var n;
  if (isNaN(step)) step = S.archStep || 0;
  if (step >= ARCH_QUIZ.length) {
    key = archPickWinner(S.archTally || {});
    arch = ARCHETYPES[key];
    same = sameArchPeople(key);
    html =
      '<div class="page-arch page-arch-result">' +
      '<span class="comm-glyph" aria-hidden="true">' +
      esc(arch.glyph) +
      '</span>' +
      '<h2>' +
      esc(arch.name) +
      '</h2>' +
      '<p>' +
      esc(arch.blurb) +
      '</p>' +
      '<div class="arch-traits">';
    for (i = 0; i < arch.traits.length; i++) {
      html += '<span class="arch-trait">' + esc(arch.traits[i]) + '</span>';
    }
    html += '</div>';
    if (same.length) {
      html +=
        '<h3>People who came out the same</h3>' + personCardsHtml(same);
    }
    html +=
      '<button type="button" class="btn" data-arch-keep="' +
      esc(key) +
      '">Keep this and see the community</button>' +
      '<p class="comm-arch-note">It is a starting point, not a verdict. You can retake it whenever you want.</p></div>';
    return { crumb: 'Archetype', title: arch.name, html: html };
  }
  q = ARCH_QUIZ[step];
  n = step + 1;
  html =
    '<div class="page-arch">' +
    (step > 0
      ? '<button type="button" class="person-back" data-arch-back="1">' +
        iconBack() +
        '<span>Back</span></button>'
      : '') +
    '<p class="arch-prog-lab">Question ' +
    n +
    ' of ' +
    ARCH_QUIZ.length +
    '</p>' +
    '<div class="arch-bar n' +
    n +
    '" aria-hidden="true"><i></i></div>' +
    '<h2>' +
    esc(q.q) +
    '</h2><div class="arch-opts">';
  for (i = 0; i < q.opts.length; i++) {
    html +=
      '<button type="button" class="arch-opt" data-arch-pick="' +
      esc(q.opts[i].a) +
      '">' +
      esc(q.opts[i].t) +
      '</button>';
  }
  html += '</div></div>';
  return { crumb: 'Archetype', title: 'Which explorer are you?', html: html };
}

function viewMentor(v) {
  return viewPerson(v);
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
  compose: viewCompose,
  profile: viewProfile,
  postgate: viewPostgate,
  alerts: viewAlerts,
  report: viewReport,
  person: viewPerson,
  archtest: viewArchtest
};

function renderChrome() {
  var pill = byId('arch-pill');
  if (pill) {
    var init = 'You';
    if (S.onboarded && S.archetype) {
      var parts = S.archetype.split(' ');
      init = parts[parts.length - 1].charAt(0);
    }
    pill.innerHTML =
      '<span class="av" aria-hidden="true">' +
      esc(init) +
      '</span>';
    pill.setAttribute(
      'aria-label',
      S.onboarded ? 'Your profile, open My Pathway' : 'Profile not set up, open My Pathway'
    );
    pill.hidden = false;
  }
  var badge = byId('dock-badge');
  var checkN = canCheckOpenings() ? openingsToCheck().length : 0;
  if (badge) {
    if (checkN > 0) {
      badge.hidden = false;
      badge.textContent = String(checkN);
    } else if (S.unread > 0) {
      badge.hidden = false;
      badge.textContent = String(S.unread);
    } else {
      badge.hidden = true;
    }
  }
  var postBtn = byId('dock-post');
  if (postBtn) {
    if (isVisitor()) postBtn.classList.add('is-locked');
    else postBtn.classList.remove('is-locked');
  }
  var pathDot = byId('path-dot');
  if (pathDot) pathDot.hidden = !!S.onboarded;

  var navs = document.querySelectorAll('[data-nav]');
  var i;
  var sheetTop = NAV.length ? NAV[NAV.length - 1].t : '';
  for (i = 0; i < navs.length; i++) {
    if (navs[i].id === 'arch-pill' || navs[i].id === 'logo') {
      navs[i].classList.remove('on');
      navs[i].removeAttribute('aria-current');
      continue;
    }
    var navKey = navs[i].getAttribute('data-nav');
    var on =
      navKey === S.view ||
      (navKey === 'community' && (sheetTop === 'person' || sheetTop === 'archtest' || sheetTop === 'mentor')) ||
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
  else if (S.view === 'alerts') main.innerHTML = viewAlerts().html;
  else if (S.view === 'community') main.innerHTML = renderCommunity();
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
    journey: 'journey',
    topic: 'topic',
    book: 'book',
    edit: 'edit',
    del: 'del',
    setup: 'setup',
    compose: 'compose',
    profile: 'profile',
    report: 'report',
    person: 'person',
    mentor: 'person',
    archtest: 'archtest'
  };
  if (!map[kind]) return;
  S.menu = '';
  if (kind === 'report') {
    if (
      requirePathway({
        type: 'report',
        id: id,
        reason: 'We need your form before we send a report.'
      })
    ) {
      return;
    }
  }
  if (kind === 'book') {
    if (
      requirePathway({
        type: 'book',
        id: id,
        reason: 'We need your form to hold you a place.'
      })
    ) {
      return;
    }
  }
  if (kind === 'setup') {
    if (!S.pendingAction) S.setupReason = '';
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
    if (S.menu && !closestEl(t, '.more-wrap')) {
      S.menu = '';
      if (NAV.length) paint();
      else render();
    }
    if (card && (!innerBtn || innerBtn === card)) {
      openKind(card.getAttribute('data-open'), card.getAttribute('data-id'));
      return;
    }

    btn = closestEl(t, 'button[data-open]');
    if (btn) {
      openKind(btn.getAttribute('data-open'), btn.getAttribute('data-id'));
      return;
    }

    btn = closestEl(t, '[data-compose-kind]');
    if (btn) {
      resetCompose(btn.getAttribute('data-compose-kind'));
      S.compose.step = 'write';
      paint();
      return;
    }

    if (t.id === 'comp-next' || closestEl(t, '#comp-next')) {
      readComposeFields();
      if (!composeValidate().ok) {
        refreshComposeValid();
        return;
      }
      S.compose.step = 'attach';
      paint();
      return;
    }

    btn = closestEl(t, '[data-follow-q]');
    if (btn) {
      if (
        requirePathway({
          type: 'follow-q',
          id: btn.getAttribute('data-follow-q'),
          reason: 'We need your form before we can follow a question.'
        })
      ) {
        return;
      }
      var qid = btn.getAttribute('data-follow-q');
      var qi = S.qFollow.indexOf(qid);
      if (qi === -1) {
        S.qFollow.push(qid);
        toast('Following this question.');
      } else {
        S.qFollow.splice(qi, 1);
        toast('Stopped following.');
      }
      paint();
      if (!NAV.length) render();
      return;
    }

    btn = closestEl(t, '[data-menu]');
    if (btn) {
      e.stopPropagation();
      toggleMenu(btn.getAttribute('data-menu'));
      return;
    }

    btn = closestEl(t, '[data-hide]');
    if (btn) {
      e.stopPropagation();
      hidePost(btn.getAttribute('data-hide'));
      return;
    }

    btn = closestEl(t, '[data-report-reason]');
    if (btn) {
      submitReport(btn.getAttribute('data-report-key'), btn.getAttribute('data-report-reason'));
      return;
    }

    btn = closestEl(t, '[data-focus-reply]');
    if (btn) {
      var box = byId('thread-reply');
      if (box) {
        box.focus();
        if (box.scrollIntoView) box.scrollIntoView({ block: 'center' });
      }
      return;
    }

    btn = closestEl(t, '[data-role]');
    if (btn) {
      applyPrototypeRole(btn.getAttribute('data-role'));
      toast('Prototype: viewing as ' + protoRoleKey() + '.');
      closeSheet();
      render();
      return;
    }

    btn = closestEl(t, '[data-img-remove]');
    if (btn) {
      var rmix = parseInt(btn.getAttribute('data-img-remove'), 10);
      if (S.compose.images && !isNaN(rmix)) S.compose.images.splice(rmix, 1);
      paint();
      return;
    }

    btn = closestEl(t, '[data-opp-live]');
    if (btn) {
      publishOpening(btn.getAttribute('data-opp-live'));
      return;
    }

    btn = closestEl(t, '[data-opp-return]');
    if (btn) {
      returnOpening(btn.getAttribute('data-opp-return'));
      return;
    }

    if (t.getAttribute && t.getAttribute('data-res')) {
      readComposeFields();
      var rid = t.getAttribute('data-res');
      var ri = S.compose.res.indexOf(rid);
      if (t.checked) {
        if (ri === -1) S.compose.res.push(rid);
      } else if (ri !== -1) {
        S.compose.res.splice(ri, 1);
      }
      return;
    }

    btn = closestEl(t, '[data-arch-start]');
    if (btn) {
      startArchTest();
      return;
    }

    btn = closestEl(t, '[data-arch-pick]');
    if (btn) {
      archAdvance(btn.getAttribute('data-arch-pick'));
      return;
    }

    btn = closestEl(t, '[data-arch-back]');
    if (btn) {
      archBack();
      return;
    }

    btn = closestEl(t, '[data-arch-keep]');
    if (btn) {
      keepArchetype(btn.getAttribute('data-arch-keep'));
      return;
    }

    btn = closestEl(t, '[data-person-back]');
    if (btn) {
      closeSheet();
      return;
    }

    btn = closestEl(t, '[data-comm-role]');
    if (btn) {
      S.commRole = btn.getAttribute('data-comm-role') || 'all';
      render();
      return;
    }

    btn = closestEl(t, '[data-comm-career]');
    if (btn) {
      S.commCareer = btn.getAttribute('data-comm-career') || '';
      render();
      return;
    }

    btn = closestEl(t, '[data-nav]');
    if (btn) {
      e.preventDefault();
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
      e.preventDefault();
      setView('feed');
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
      var fid = btn.getAttribute('data-follow');
      if (
        requirePathway({
          type: 'follow',
          id: fid,
          reason: 'We need your form to hold you a place.'
        })
      ) {
        return;
      }
      toggleFollow(fid);
      return;
    }

    btn = closestEl(t, '[data-dismiss-join]');
    if (btn) {
      e.stopPropagation();
      S.hideJoinCard = true;
      render();
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
      advanceSetupStep();
      return;
    }

    btn = closestEl(t, '[data-setup-back]');
    if (btn) {
      backSetupStep();
      return;
    }

    if ((t.id === 'sheet-back' || closestEl(t, '#sheet-back')) && NAV.length && NAV[NAV.length - 1].t === 'setup') {
      if (S.setupStep > 0) {
        backSetupStep();
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
      if (eitem.kind === 'opportunity' && eitem.opp && OPPS[eitem.opp]) {
        OPPS[eitem.opp].state = 'pending';
        OPPS[eitem.opp].checkedAt = '';
        OPPS[eitem.opp].checkedBy = '';
      }
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
      var rtext = tr && tr.value ? tr.value.trim() : '';
      if (!rtext || rtext.length < 4) {
        toast('Write a short reply before posting.');
        if (tr) tr.focus();
        return;
      }
      if (
        requirePathway({
          type: 'reply',
          id: tid,
          text: rtext,
          reason: 'We need your form to hold you a place.'
        })
      ) {
        return;
      }
      postThreadReply(tid, rtext, false);
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
      readComposeFields();
      submitCompose();
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
      if (NAV.length && NAV[NAV.length - 1].t === 'compose' && S.compose.step === 'attach') {
        readComposeFields();
        S.compose.step = 'write';
        paint();
        return;
      }
      if (NAV.length && NAV[NAV.length - 1].t === 'compose' && S.compose.step === 'write') {
        var types = composeTypesFor(postingRole());
        if (types.length > 1) {
          S.compose.step = 'choose';
          paint();
          return;
        }
      }
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
    if (e.target && e.target.id === 'q') {
      var pos = e.target.selectionStart;
      S.commQ = e.target.value;
      render();
      var f = document.getElementById('q');
      if (f) {
        f.focus();
        try {
          f.setSelectionRange(pos, pos);
        } catch (err) {}
      }
      return;
    }
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
    if (e.target && (e.target.getAttribute('data-compose') || e.target.id === 'comp-text' || e.target.id === 'comp-extra' || e.target.id === 'comp-anon')) {
      readComposeFields();
      S.draft = S.compose.title || S.compose.body || '';
      S.anon = S.compose.anon;
      var slot = byId('dup-slot');
      if (slot && S.compose.kind === 'question') slot.innerHTML = dupHintHtml(S.compose.title || '');
      refreshComposeValid();
      return;
    }
  });

  document.addEventListener('change', function (e) {
    var f;
    var reader;
    if (e.target && e.target.id === 'comp-cat') S.draftCat = e.target.value;
    if (e.target && e.target.id === 'comp-anon') S.anon = e.target.checked;
    if (e.target && e.target.id === 'comp-img') {
      f = e.target.files && e.target.files[0];
      if (!f) return;
      reader = new FileReader();
      reader.onload = function () {
        var alt = window.prompt('Describe it for someone who cannot see it.', '') || '';
        if (!S.compose.images) S.compose.images = [];
        if (S.compose.images.length < 3) {
          S.compose.images.push({ src: reader.result, caption: '', alt: alt });
        }
        paint();
      };
      reader.readAsDataURL(f);
      return;
    }
    if (e.target && e.target.id === 'comp-file') {
      f = e.target.files && e.target.files[0];
      if (!f) return;
      addComposeFile(f);
      paint();
    }
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
  if (h === 'community' || h === 'network') {
    hideSheetUi();
    S.view = 'community';
    return 'community';
  }
  return '';
}

function dismissSplash() {
  var el = byId('app-splash');
  if (!el || el.getAttribute('data-done') === '1') return;
  el.setAttribute('data-done', '1');
  el.classList.add('out');
  document.documentElement.classList.remove('splash-on');
  setTimeout(function () {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 320);
}

function startSplash() {
  var el = byId('app-splash');
  if (!el) return;
  document.documentElement.classList.add('splash-on');
  var reduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(dismissSplash, reduced ? 400 : 1400);
  var go = byId('splash-continue');
  if (go) go.addEventListener('click', dismissSplash);
  el.addEventListener('click', dismissSplash);
}

function boot() {
  if (window.NSG_CMS && typeof NSG_CMS.applyAppGlobals === 'function') {
    NSG_CMS.applyAppGlobals();
  }
  startSplash();
  applyHash();
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
