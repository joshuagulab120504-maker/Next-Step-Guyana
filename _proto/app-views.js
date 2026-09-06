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

function inSetupSheet() {
  return !!(NAV.length && NAV[NAV.length - 1].t === 'setup');
}

function finishSetup() {
  finishPwWizard();
}

function renderSetup() {
  ensurePw();
  return {
    crumb: 'Setup',
    title: 'Build my pathway',
    html: renderPwWizardBody({ reason: S.setupReason }),
    after: function () {
      var backBtn = byId('sheet-back');
      if (backBtn) backBtn.hidden = (S.pw.step || 0) < 1;
    }
  };
}

function pwReady() {
  return !!(ensurePw().done);
}

function pwIsGuide() {
  return S.role === 'mentor' || S.role === 'contributor' || S.role === 'admin';
}

function pwCanQueue() {
  return S.role === 'mentor' || S.role === 'admin';
}

function careerAt(i) {
  return CAREERS[i] || null;
}

function destCareer() {
  return S.pw.dest >= 0 ? careerAt(S.pw.dest) : null;
}

function fieldName(k) {
  return fieldByKey(k).n;
}

function initialOf(name) {
  var s = String(name || 'You').replace(/^\s+/, '');
  return s ? s.charAt(0).toUpperCase() : 'Y';
}

function matchSubjects(text) {
  var found = [];
  var i;
  var name;
  var idx;
  var low = String(text || '');
  for (i = 0; i < CSEC_SUBJECTS.length; i++) {
    name = CSEC_SUBJECTS[i];
    idx = low.toLowerCase().indexOf(name.toLowerCase());
    if (idx !== -1) {
      found.push(name);
      low = low.slice(0, idx) + low.slice(idx + name.length);
    }
  }
  return found;
}

function subjectState(name) {
  return S.pw.subjects[name] || null;
}

function subjectLogged(name) {
  var rec = subjectState(name);
  return !!(rec && rec.st);
}

function loggedSubjectCount() {
  var n = 0;
  var k;
  for (k in S.pw.subjects) {
    if (S.pw.subjects.hasOwnProperty(k) && subjectLogged(k)) n += 1;
  }
  return n;
}

function subjectMatch(c) {
  var rec = matchSubjects((c.csec || '') + ' ' + (c.f13 || ''));
  var have = 0;
  var i;
  for (i = 0; i < rec.length; i++) {
    if (subjectLogged(rec[i])) have += 1;
  }
  return { have: have, total: rec.length, rec: rec };
}

function careerFacts(c) {
  var tr = c.tr || [];
  var has = function (k) { return tr.indexOf(k) !== -1; };
  var entry;
  var time;
  if (has('cape')) entry = 'CSEC then CAPE';
  else if (has('tvet')) entry = 'CSEC or CVQ';
  else if (has('port')) entry = 'Portfolio or trial';
  else entry = 'CSEC, sometimes CAPE';
  if (has('port')) time = 'Ongoing practice';
  else if (has('cape') && has('degree')) time = 'About 5 to 6 years';
  else if (has('degree')) time = 'About 3 to 4 years';
  else if (has('health')) time = 'About 2 to 4 years';
  else if (has('tvet')) time = '6 months to 3 years';
  else time = 'Varies by intake';
  return { entry: entry, time: time };
}

function statusLabel(s) {
  if (s === 'confirmed') return 'Route confirmed';
  if (s === 'varies') return 'Route varies';
  return 'Talent decides';
}

function statusShort(s) {
  if (s === 'confirmed') return 'Confirmed';
  if (s === 'varies') return 'Varies';
  return 'Talent';
}

function statusClass(s) {
  if (s === 'confirmed') return 'green';
  if (s === 'varies') return 'gold';
  return 'red';
}

function forkFits(c) {
  var out = [];
  var i;
  var tr = (c && c.tr) || [];
  for (i = 0; i < FORK.length; i++) {
    if (tr.indexOf(FORK[i].tr) !== -1) out.push(FORK[i]);
  }
  return out;
}

function forkByKey(k) {
  var i;
  for (i = 0; i < FORK.length; i++) if (FORK[i].k === k) return FORK[i];
  return null;
}

function autoForkIfOne(c) {
  var fits = forkFits(c);
  if (fits.length === 1) S.pw.fork = fits[0].k;
}

function forkClosedLine(c) {
  var fits = forkFits(c);
  var names = [];
  var i;
  if (!fits.length) return 'After Form 5';
  for (i = 0; i < fits.length; i++) names.push(fits[i].n);
  return 'After Form 5 · Yours: ' + names.join(' and ');
}

function isConsidering(i) {
  return S.pw.considering.indexOf(i) !== -1;
}

function toggleConsidering(i) {
  var ix = S.pw.considering.indexOf(i);
  if (ix === -1) S.pw.considering.push(i);
  else {
    S.pw.considering.splice(ix, 1);
    if (S.pw.dest === i) S.pw.dest = -1;
  }
}

function setDestination(i) {
  S.pw.dest = i;
  if (S.pw.considering.indexOf(i) === -1) S.pw.considering.push(i);
  S.pw.fork = '';
  autoForkIfOne(careerAt(i));
}

function leavingCount() {
  var n = 0;
  var i;
  for (i = 0; i < LEAVING.length; i++) {
    if (S.pw.leaving[LEAVING[i].k]) n += 1;
  }
  return n;
}

function searchCareers(q) {
  var query = String(q || '').toLowerCase().replace(/^\s+|\s+$/g, '');
  var nameHits = [];
  var other = [];
  var i;
  var c;
  var blob;
  if (!query) return [];
  for (i = 0; i < CAREERS.length; i++) {
    c = CAREERS[i];
    blob = (c.n + ' ' + c.route + ' ' + c.jobs + ' ' + c.gate + ' ' + c.dev + ' ' + c.csec).toLowerCase();
    if (blob.indexOf(query) === -1) continue;
    if (c.n.toLowerCase().indexOf(query) !== -1) nameHits.push(i);
    else other.push(i);
  }
  nameHits.sort(function (a, b) { return CAREERS[a].n < CAREERS[b].n ? -1 : 1; });
  other.sort(function (a, b) { return CAREERS[a].n < CAREERS[b].n ? -1 : 1; });
  return nameHits.concat(other);
}

function fieldCareerIndexes(k) {
  var out = [];
  var i;
  for (i = 0; i < CAREERS.length; i++) {
    if (CAREERS[i].b.indexOf(k) !== -1) out.push(i);
  }
  return out;
}

function sortedFields() {
  var mine = [];
  var rest = [];
  var i;
  var f;
  for (i = 0; i < FIELDS.length; i++) {
    f = FIELDS[i];
    if (S.pw.fields.indexOf(f.k) !== -1) mine.push(f);
    else rest.push(f);
  }
  return mine.concat(rest);
}

function capList(arr, n) {
  if (arr.length <= n) return { list: arr, more: 0 };
  return { list: arr.slice(0, n), more: arr.length };
}

function myAuthoredPosts() {
  var out = [];
  var id = currentPosterId();
  var i;
  var it;
  for (i = 0; i < FEED.length; i++) {
    it = FEED[i];
    if (it.mine || (id && (it.a === id || it.author === id))) out.push(it);
  }
  return out;
}

function postState(it) {
  if (it.kind === 'opening' || it.kind === 'opp') {
    if (it.returned) return { n: 'Sent back', c: 'gold' };
    if (it.live === false || it.pending) return { n: 'Waiting for a check', c: 'gold' };
    if (it.draft) return { n: 'Draft', c: 'grey' };
  }
  if (it.draft) return { n: 'Draft', c: 'grey' };
  return { n: 'Live', c: 'green' };
}

function finishPwWizard() {
  var p = ensurePw();
  var pending = S.pendingAction;
  var fromSheet = inSetupSheet();
  p.done = true;
  S.onboarded = true;
  S.hideJoinCard = true;
  S.role = S.role === 'visitor' ? 'student' : S.role;
  S.me.role = S.role;
  S.form = levelName(p.level);
  S.region = regionShort(p.region);
  S.me.form = S.form;
  S.me.region = S.region;
  if (!p.name) p.name = 'You';
  p.open = p.level;
  if (p.clarity === 'exact') {
    p.tab = 'explore';
    p.sub = '';
    p.focusQ = true;
  } else if (p.clarity === 'field' && p.fields.length) {
    p.tab = 'explore';
    p.sub = 'field';
    p.field = p.fields[0];
  } else {
    p.tab = 'me';
    p.sub = '';
    p.open = p.level;
  }
  S.setupStep = 0;
  S.setupDraft = {};
  S.setupReason = '';
  S.pendingAction = null;
  S.unread = 0;
  if (pending) {
    hideSheetUi();
    runPendingAction(pending);
    return;
  }
  if (fromSheet) {
    hideSheetUi();
    S.view = 'pathway';
    render();
    toast('Pathway built. Your timeline starts at ' + S.form + '.');
    return;
  }
  render();
  toast('Pathway built. Your timeline starts at ' + S.form + '.');
}

function renderPwWizardBody(opts) {
  var p = ensurePw();
  var step = p.step || 0;
  var i;
  var html;
  var answered = false;
  var q = [
    { t: 'What level are you at right now?', h: 'This opens the line on the level you are in.' },
    { t: 'Which region are you in?', h: 'Programmes, travel and intakes change by region.' },
    { t: 'Which fields interest you most?', h: 'Pick as many as you like. You can skip this.' },
    { t: 'How clear are you right now?', h: 'This only decides where we land you first.' }
  ][step];
  opts = opts || {};
  html = '<div class="pw-wiz">';
  if (opts.reason) {
    html += '<p class="setup-reason">' + esc(opts.reason) + '</p>';
  }
  html +=
    '<p class="eyebrow">QUESTION ' +
    (step + 1) +
    ' OF 4</p>' +
    '<div class="pw-seg">';
  for (i = 0; i < 4; i++) {
    html += '<i' + (i <= step ? ' class="on"' : '') + '></i>';
  }
  html +=
    '</div><h2>' +
    esc(q.t) +
    '</h2><p class="hint">' +
    esc(q.h) +
    '</p>';
  if (step === 0) {
    html += '<div class="pw-opts two">';
    for (i = 0; i < LEVELS.length; i++) {
      html +=
        '<button type="button" class="pw-opt' +
        (p.level === LEVELS[i].k ? ' on' : '') +
        '" data-pw-level="' +
        esc(LEVELS[i].k) +
        '">' +
        esc(LEVELS[i].n) +
        '</button>';
    }
    html += '</div>';
    answered = !!p.level;
  } else if (step === 1) {
    html += '<div class="pw-opts">';
    for (i = 0; i < REGIONS.length; i++) {
      html +=
        '<button type="button" class="pw-opt' +
        (p.region === REGIONS[i].k ? ' on' : '') +
        '" data-pw-region="' +
        esc(REGIONS[i].k) +
        '">' +
        esc(REGIONS[i].n) +
        '</button>';
    }
    html += '</div>';
    answered = !!p.region;
  } else if (step === 2) {
    html += '<div class="pw-opts">';
    for (i = 0; i < FIELDS.length; i++) {
      html +=
        '<button type="button" class="pw-opt' +
        (p.fields.indexOf(FIELDS[i].k) !== -1 ? ' on' : '') +
        '" data-pw-field="' +
        esc(FIELDS[i].k) +
        '">' +
        esc(FIELDS[i].n) +
        '</button>';
    }
    html += '</div>';
    answered = true;
  } else {
    html += '<div class="pw-opts">';
    html +=
      '<button type="button" class="pw-opt' +
      (p.clarity === 'exact' ? ' on' : '') +
      '" data-pw-clarity="exact">I know exactly what I want</button>' +
      '<button type="button" class="pw-opt' +
      (p.clarity === 'field' ? ' on' : '') +
      '" data-pw-clarity="field">I know the field, not the job</button>' +
      '<button type="button" class="pw-opt' +
      (p.clarity === 'none' ? ' on' : '') +
      '" data-pw-clarity="none">No idea yet</button></div>';
    answered = !!p.clarity;
  }
  html += '<div class="pw-foot">';
  if (step > 0) {
    html += '<button type="button" class="btn g" data-pw-back="1">Back</button>';
  } else {
    html += '<span></span>';
  }
  html +=
    '<button type="button" class="btn" data-pw-next="1"' +
    (answered ? '' : ' disabled') +
    '>' +
    (step === 3 ? 'Create my pathway' : 'Continue') +
    '</button></div>';
  if (step === 2 && !p.fields.length) {
    html += '<p class="pw-skip">You can continue without picking a field.</p>';
  }
  html += '</div>';
  return html;
}

function renderPwWizard() {
  return '<div class="page-pw">' + renderPwWizardBody() + '</div>';
}

function renderPwQueue() {
  var html;
  var i;
  var row;
  var mine;
  if (!pwCanQueue() || !S.pw.queue.length) return '';
  html =
    '<div class="pw-banner"><strong>Career cards to check</strong>' +
    '<p class="hint">' +
    S.pw.queue.length +
    ' waiting. An opening stays out of the feed until another mentor checks it, and you cannot check your own.</p>';
  for (i = 0; i < S.pw.queue.length; i++) {
    row = S.pw.queue[i];
    mine = row.who === (S.me.name || S.pw.name || 'You') || row.mine;
    html +=
      '<div class="pw-qrow"><div class="minw"><strong>' +
      esc(row.career) +
      '</strong><p class="who">' +
      esc(row.kind) +
      ' · ' +
      esc(row.who) +
      '</p><p>' +
      esc(row.text) +
      '</p></div><div class="pw-qacts">';
    if (mine) {
      html += '<span class="p gold">Yours</span>';
    } else {
      html +=
        '<button type="button" class="btn sm" data-pw-pub="' +
        i +
        '">Publish</button>';
    }
    html +=
      '<button type="button" class="btn sm g" data-pw-ret="' +
      i +
      '">Return</button></div></div>';
  }
  html += '</div>';
  return html;
}

function renderCareerCard(ix) {
  var c = careerAt(ix);
  var facts;
  var sm;
  var f;
  var subj;
  var saved;
  if (!c) return '';
  facts = careerFacts(c);
  sm = subjectMatch(c);
  f = fieldByKey(c.b && c.b[0]);
  if (sm.total) subj = sm.have + ' of ' + sm.total + ' subjects';
  else subj = 'Subjects not listed';
  saved = isConsidering(ix);
  return (
    '<article class="pw-card" data-pw-open="' +
    ix +
    '"><span class="pw-card-mark" style="background:var(--i-' +
    esc(f.c) +
    ')" aria-hidden="true">' +
    esc(f.g) +
    '</span><div class="pw-card-body"><h3>' +
    esc(c.n) +
    '</h3><p class="pw-card-co">' +
    esc(f.n) +
    ' · <span class="pw-card-st ' +
    statusClass(c.s) +
    '">' +
    esc(statusShort(c.s)) +
    '</span></p><p class="pw-card-meta">' +
    esc(facts.entry) +
    ' · ' +
    esc(facts.time) +
    ' · <span' +
    (sm.total && sm.have === sm.total ? ' class="ok"' : '') +
    '>' +
    esc(subj) +
    '</span></p></div><button type="button" class="pw-book' +
    (saved ? ' on' : '') +
    '" data-pw-book="' +
    ix +
    '" aria-label="' +
    (saved ? 'Remove from considering' : 'Save to considering') +
    '" aria-pressed="' +
    (saved ? 'true' : 'false') +
    '"><svg viewBox="0 0 24 24" fill="' +
    (saved ? 'currentColor' : 'none') +
    '" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.4L6 20V5a1 1 0 0 1 1-1z"/></svg></button></article>'
  );
}

function renderCareerCards(indexes, one) {
  var cap = capList(indexes, 40);
  var html = '<div class="pw-cards' + (one ? ' one' : '') + '">';
  var i;
  for (i = 0; i < cap.list.length; i++) html += renderCareerCard(cap.list[i]);
  html += '</div>';
  if (cap.more) {
    html +=
      '<p class="pw-note">Showing 40 of ' +
      cap.more +
      '. Narrow it with a search.</p>';
  }
  return html;
}

function renderPwLineStudent() {
  var dest = destCareer();
  var html = '<section class="pw-sec pw-line"><h2>My line</h2>';
  var i;
  var sp;
  var cur = S.pw.level;
  var past = true;
  var open;
  var fits;
  var fr;
  var j;
  var fork;
  for (i = 0; i < SPINE.length; i++) {
    sp = SPINE[i];
    open = S.pw.open === sp.k;
    html +=
      '<div class="pw-node"><div class="pw-spinewrap"><div class="pw-mark' +
      (sp.k === cur ? ' now' : past && sp.k !== cur ? ' past' : '') +
      '">' +
      (past && sp.k !== cur ? '✓' : '') +
      '</div></div><button type="button" class="pw-nbody" data-pw-openlvl="' +
      esc(sp.k) +
      '"><h3>' +
      esc(sp.n) +
      (sp.decide ? ' · decision point' : '') +
      '</h3><p class="sum">' +
      esc(sp.sum) +
      '</p>';
    if (open) {
      html +=
        '<div class="pw-panel do"><span class="lab">Do this</span><p>' +
        esc(sp.do) +
        '</p></div><div class="pw-panel keep"><span class="lab">Keeps open</span><p>' +
        esc(sp.keep) +
        '</p></div><div class="pw-panel risk"><span class="lab">At risk</span><p>' +
        esc(sp.risk) +
        '</p></div>';
      if (sp.k === 'f3' && dest) {
        html +=
          '<div class="pw-panel destp"><span class="lab">Recommended CSEC for ' +
          esc(dest.n) +
          '</span><p>' +
          esc(dest.csec || 'Check the career card for recommended subjects.') +
          '</p></div>';
      }
      if (sp.k === 'f5' && dest) {
        html +=
          '<div class="pw-panel destp"><span class="lab">Route toward ' +
          esc(dest.n) +
          '</span><p>' +
          esc(dest.route) +
          '</p></div>';
      }
    }
    html +=
      '</button><button type="button" class="pw-plus" data-pw-openlvl="' +
      esc(sp.k) +
      '" aria-label="Toggle">' +
      (open ? '−' : '+') +
      '</button></div>';
    if (sp.k === cur) past = false;
  }
  html +=
    '<div class="pw-node"><div class="pw-spinewrap"><div class="pw-mark"></div></div><button type="button" class="pw-nbody" data-pw-openlvl="fork"><h3>' +
    esc(dest ? forkClosedLine(dest) : 'After Form 5') +
    '</h3><p class="sum">Compare a first route, a second and a bridging route.</p>';
  if (S.pw.open === 'fork') {
    fits = dest ? forkFits(dest) : [];
    html += '<div class="pw-forks">';
    for (i = 0; i < FORK.length; i++) {
      fr = FORK[i];
      html +=
        '<button type="button" class="pw-fork' +
        (S.pw.fork === fr.k ? ' on' : '') +
        '" data-pw-fork="' +
        esc(fr.k) +
        '"><strong>' +
        esc(fr.n) +
        '</strong><span>' +
        esc(fr.dur) +
        '</span>';
      if (fits.indexOf(fr) !== -1) html += '<span class="pw-fits">Fits your destination</span>';
      html += '</button>';
    }
    html += '</div>';
  }
  html +=
    '</button><button type="button" class="pw-plus" data-pw-openlvl="fork" aria-label="Toggle">' +
    (S.pw.open === 'fork' ? '−' : '+') +
    '</button></div>';
  fork = forkByKey(S.pw.fork);
  if (fork) {
    for (i = 0; i < fork.steps.length; i++) {
      html +=
        '<div class="pw-node"><div class="pw-spinewrap"><div class="pw-mark"></div></div><button type="button" class="pw-nbody" data-pw-openlvl="rs' +
        i +
        '"><h3>' +
        esc(fork.steps[i].n) +
        '</h3><p class="sum">' +
        esc(fork.dur) +
        '</p>';
      if (S.pw.open === 'rs' + i) {
        html += '<div class="pw-panel do"><p>' + esc(fork.steps[i].t) + '</p></div>';
      }
      html +=
        '</button><button type="button" class="pw-plus" data-pw-openlvl="rs' +
        i +
        '" aria-label="Toggle">' +
        (S.pw.open === 'rs' + i ? '−' : '+') +
        '</button></div>';
    }
  }
  if (dest && dest.gate) {
    html +=
      '<div class="pw-node"><div class="pw-spinewrap"><div class="pw-mark gate"></div></div><button type="button" class="pw-nbody" data-pw-openlvl="gate"><h3>Professional gate</h3><p class="sum">Registration or a licence sits after training.</p>';
    if (S.pw.open === 'gate') {
      html += '<div class="pw-panel risk"><p>' + esc(dest.gate) + '</p></div>';
    }
    html +=
      '</button><button type="button" class="pw-plus" data-pw-openlvl="gate" aria-label="Toggle">' +
      (S.pw.open === 'gate' ? '−' : '+') +
      '</button></div>';
  }
  if (dest) {
    html +=
      '<div class="pw-node"><div class="pw-spinewrap"><div class="pw-mark dest">★</div></div><div class="pw-nbody"><h3>' +
      esc(dest.n) +
      '</h3><p class="sum">Your destination</p></div></div>';
  }
  html += '</section>';
  return html;
}

function renderPwConsidering() {
  var html =
    '<section class="pw-sec"><h2>Careers I am considering · ' +
    S.pw.considering.length +
    '</h2>';
  if (!S.pw.considering.length) {
    html +=
      '<p class="pw-empty">Bookmark a career in Explore and it lands here. Hold a first choice, a second and a bridging route.</p></section>';
    return html;
  }
  html += renderCareerCards(S.pw.considering, true) + '</section>';
  return html;
}

function renderPwStudent() {
  var dest = destCareer();
  var facts = dest ? careerFacts(dest) : null;
  var sm = dest ? subjectMatch(dest) : { have: 0, total: 0 };
  var chips = '';
  var i;
  var html;
  for (i = 0; i < S.pw.fields.length; i++) {
    chips += '<span class="pw-chip">' + esc(fieldName(S.pw.fields[i])) + '</span>';
  }
  html =
    '<div class="pw-head"><div class="pw-head-top"><div class="pw-av">' +
    esc(initialOf(S.pw.name || 'You')) +
    '</div><div class="minw"><h2>' +
    esc(S.pw.name || 'You') +
    '</h2><p class="meta">' +
    esc(levelName(S.pw.level)) +
    ' · ' +
    esc(regionShort(S.pw.region)) +
    '</p><div class="pw-chips">' +
    chips +
    '</div></div></div><div class="pw-rule"></div>';
  if (dest) {
    html +=
      '<p class="toward">Working toward</p><p class="destn">' +
      esc(dest.n) +
      '</p><p class="destd">' +
      esc(facts.entry) +
      ' · ' +
      esc(facts.time) +
      '</p><div class="pw-bar"><i style="width:' +
      (sm.total ? Math.round((sm.have / sm.total) * 100) : 0) +
      '%"></i></div><p class="pw-barlab">' +
      sm.have +
      ' of ' +
      sm.total +
      ' recommended subjects logged</p>';
  } else {
    html +=
      '<p class="toward">Working toward</p><p class="destn">No destination yet</p><p class="destd">Explore careers and set one when you are ready.</p>';
  }
  html +=
    '<p class="pw-stats">' +
    loggedSubjectCount() +
    ' subjects · ' +
    S.pw.achievements.length +
    ' achievement' +
    (S.pw.achievements.length === 1 ? '' : 's') +
    ' · ' +
    S.pw.activities.length +
    ' activit' +
    (S.pw.activities.length === 1 ? 'y' : 'ies') +
    ' · ' +
    leavingCount() +
    ' of 6 leaving record</p><div class="pw-head-acts">' +
    '<button type="button" class="btn sm" data-pw-sub="edit">Edit my profile</button>';
  if (dest) {
    html +=
      '<button type="button" class="btn sm" data-pw-open="' +
      S.pw.dest +
      '">Open the card</button>';
  } else {
    html +=
      '<button type="button" class="btn sm" data-pw-tab="explore">Explore careers</button>';
  }
  html += '</div></div>' + renderPwLineStudent() + renderPwConsidering();
  return html;
}

function renderPwMentor() {
  var chips = '';
  var html;
  var i;
  var posts;
  var it;
  var st;
  var live = 0;
  var wait = 0;
  if (S.pw.mentorField) chips += '<span class="pw-chip">' + esc(fieldName(S.pw.mentorField)) + '</span>';
  posts = myAuthoredPosts();
  for (i = 0; i < posts.length; i++) {
    st = postState(posts[i]);
    if (st.n === 'Live') live += 1;
    else wait += 1;
  }
  html =
    '<div class="pw-head"><div class="pw-head-top"><div class="pw-av">' +
    esc(initialOf(S.pw.name)) +
    '</div><div class="minw"><h2>' +
    esc(S.pw.name || 'Mentor') +
    '</h2><p class="meta">' +
    esc(S.pw.title || '') +
    (S.pw.region ? ' · ' + esc(regionShort(S.pw.region)) : '') +
    '</p><div class="pw-chips"><span class="pw-chip pw-role">' +
    esc(S.role === 'contributor' ? 'Contributor' : 'Mentor') +
    '</span>' +
    chips +
    '</div></div></div>';
  if (S.pw.about) html += '<p class="destd">' + esc(S.pw.about) + '</p>';
  html +=
    '<p class="pw-stats">' +
    S.pw.steps.length +
    ' steps on my route · ' +
    live +
    ' live posts · ' +
    wait +
    ' not live</p><div class="pw-head-acts">' +
    '<button type="button" class="btn sm" data-pw-sub="edit">Edit my profile</button>' +
    '<button type="button" class="btn sm" data-pw-addstep="1">+ Add a step</button></div></div>';
  html +=
    '<section class="pw-sec pw-line"><h2>The route I took</h2>' +
    '<p class="pw-note">Students see this on your profile. The guide is clear that what students need is the decisions and the trade-offs, not a tidy summary.</p>';
  if (S.pw.addStep) {
    html +=
      '<div class="pw-form"><label>When it was</label><input id="pw-step-when" value="' +
      esc(S.pw.stepWhen) +
      '" placeholder="A form, a year, an age, or Now"/>' +
      '<label>What you did</label><textarea id="pw-step-did">' +
      esc(S.pw.stepDid) +
      '</textarea><label>What it led to</label><textarea id="pw-step-led">' +
      esc(S.pw.stepLed) +
      '</textarea><p class="hint">Including if it went badly, that is the part students cannot get anywhere else.</p>' +
      '<button type="button" class="btn" data-pw-savestep="1">Save this step</button></div>';
  }
  for (i = 0; i < S.pw.steps.length; i++) {
    html +=
      '<div class="pw-node"><div class="pw-spinewrap"><div class="pw-mark past"></div></div><div class="pw-nbody"><h3>' +
      esc(S.pw.steps[i].when) +
      '</h3><p class="sum">' +
      esc(S.pw.steps[i].did) +
      '</p><div class="pw-panel do"><p>' +
      esc(S.pw.steps[i].led) +
      '</p></div></div></div>';
  }
  html +=
    '<div class="pw-node"><div class="pw-spinewrap"><div class="pw-mark dest">★</div></div><div class="pw-nbody"><h3>Where I am now</h3><p class="sum">' +
    esc(S.pw.title || 'Your current work') +
    '</p></div></div></section>';
  html += '<section class="pw-sec"><h2>My posts</h2>';
  if (!posts.length) html += '<p class="pw-empty">Nothing posted yet.</p>';
  for (i = 0; i < posts.length; i++) {
    it = posts[i];
    st = postState(it);
    html +=
      '<div class="pw-postrow"><div class="minw"><span class="p">' +
      esc(it.kind) +
      '</span> <span class="p ' +
      st.c +
      '">' +
      esc(st.n) +
      '</span><p>' +
      esc(it.title || (it.body && it.body[0]) || '') +
      '</p><p class="who">' +
      esc(it.when || '') +
      (it.replies ? ' · ' + it.replies.length + ' replies' : '') +
      '</p></div><div class="pw-qacts">' +
      '<button type="button" class="btn sm g" data-edit="' +
      esc(it.id) +
      '">Edit</button>' +
      '<button type="button" class="btn sm g" data-del="' +
      esc(it.id) +
      '">Remove</button></div></div>';
  }
  html +=
    '<p class="pw-note">An opening stays out of the feed until another mentor checks it, and you cannot check your own.</p></section>';
  return html;
}

function renderPwExplore() {
  var html = '<div class="pw-search"><input id="q" type="search" placeholder="Search careers" value="' +
    esc(S.pw.q) +
    '" autocomplete="off"/>';
  var fields;
  var i;
  var f;
  var n;
  var hits;
  if (S.pw.q) {
    html +=
      '<button type="button" class="btn g" data-pw-clearq="1" style="margin-top:var(--s3)">Clear search</button></div>';
    hits = searchCareers(S.pw.q);
    html += '<section class="pw-sec"><h2>Results</h2>' + (hits.length ? renderCareerCards(hits) : '<p class="pw-empty">No careers matched that search.</p>') + '</section>';
    return html;
  }
  html +=
    '</div><section class="pw-sec"><h2>Browse by field</h2>' +
    '<p class="pw-note">Eleven fields, 145 careers. A career can sit in more than one.</p><div class="pw-fgrid">';
  fields = sortedFields();
  for (i = 0; i < fields.length; i++) {
    f = fields[i];
    n = fieldCareerIndexes(f.k).length;
    html +=
      '<button type="button" class="pw-fcard" data-pw-openfield="' +
      esc(f.k) +
      '"><span class="pw-fg" style="background:var(--i-' +
      esc(f.c) +
      ')">' +
      esc(f.g) +
      '</span><span class="minw"><strong>' +
      esc(f.n) +
      (S.pw.fields.indexOf(f.k) !== -1 ? ' <span class="pw-yours">· yours</span>' : '') +
      '</strong><span>' +
      n +
      ' careers</span></span></button>';
  }
  html += '</div></section>';
  if (S.pw.considering.length) html += renderPwConsidering();
  return html;
}

function renderPwField() {
  var f = fieldByKey(S.pw.field);
  var b = BUCKETS[f.k] || {};
  var html =
    '<div class="pw-backrow"><button type="button" class="pw-back" data-pw-sub="">← Back</button><h1>' +
    esc(f.n) +
    '</h1></div>' +
    '<div class="pw-fhero" style="background:var(--i-' +
    esc(f.c) +
    ')"><h2>' +
    esc(f.n) +
    '</h2><p>' +
    fieldCareerIndexes(f.k).length +
    ' careers</p></div>' +
    '<div class="pw-bucket"><h3>Exploring it in Forms 1 to 3</h3><p>' +
    esc(b.explore || '') +
    '</p></div>' +
    '<div class="pw-bucket"><h3>Subjects this field keeps asking for</h3><p>' +
    esc(b.csec || '') +
    '</p></div>' +
    '<div class="pw-bucket"><h3>After CSEC or Form 6</h3><p>' +
    esc(b.after || '') +
    '</p></div>' +
    '<section class="pw-sec"><h2>Careers</h2>' +
    renderCareerCards(fieldCareerIndexes(f.k)) +
    '</section>';
  return html;
}

function renderPwEditStudent() {
  var html =
    '<div class="pw-backrow"><button type="button" class="pw-back" data-pw-sub="">← Back</button><h1>Edit my profile</h1></div>' +
    '<section class="pw-sec pw-form"><label>Name</label><input id="pw-name" value="' +
    esc(S.pw.name || '') +
    '"/>' +
    '<label>Level</label><select id="pw-ed-level">';
  var i;
  var k;
  var rec;
  for (i = 0; i < LEVELS.length; i++) {
    html +=
      '<option value="' +
      esc(LEVELS[i].k) +
      '"' +
      (S.pw.level === LEVELS[i].k ? ' selected' : '') +
      '>' +
      esc(LEVELS[i].n) +
      '</option>';
  }
  html += '</select><label>Region</label><select id="pw-ed-region">';
  for (i = 0; i < REGIONS.length; i++) {
    html +=
      '<option value="' +
      esc(REGIONS[i].k) +
      '"' +
      (S.pw.region === REGIONS[i].k ? ' selected' : '') +
      '>' +
      esc(REGIONS[i].n) +
      '</option>';
  }
  html += '</select><label>Fields</label><div>';
  for (i = 0; i < FIELDS.length; i++) {
    html +=
      '<button type="button" class="pw-tog' +
      (S.pw.fields.indexOf(FIELDS[i].k) !== -1 ? ' on' : '') +
      '" data-pw-field="' +
      esc(FIELDS[i].k) +
      '">' +
      esc(FIELDS[i].n) +
      '</button>';
  }
  html +=
    '</div><h2>My subjects</h2><p class="hint">Tap once for have it, twice for taking it, again to clear.</p><button type="button" class="btn g" data-pw-subjects="1">Open subjects</button>';
  rec = [];
  for (k in S.pw.subjects) {
    if (S.pw.subjects.hasOwnProperty(k) && subjectLogged(k)) rec.push(k);
  }
  if (rec.length) html += '<p class="pw-note">' + esc(rec.join(', ')) + '</p>';
  html +=
    '<h2>Achievements</h2><label>What it was</label><input id="pw-ach-what"/><label>Where or who gave it</label><input id="pw-ach-where"/><label>When</label><input id="pw-ach-when"/><button type="button" class="btn g" data-pw-addach="1">Add achievement</button>';
  for (i = 0; i < S.pw.achievements.length; i++) {
    html +=
      '<p>' +
      esc(S.pw.achievements[i].what) +
      ' · ' +
      esc(S.pw.achievements[i].where) +
      '</p>';
  }
  html +=
    '<h2>Activities</h2><p class="hint">The guide says one sustained activity beats five short ones.</p>' +
    '<label>What it is</label><input id="pw-act-what"/><label>What you actually do</label><input id="pw-act-do"/><label>How long</label><input id="pw-act-how"/><button type="button" class="btn g" data-pw-addact="1">Add activity</button>';
  for (i = 0; i < S.pw.activities.length; i++) {
    html += '<p>' + esc(S.pw.activities[i].what) + ' · ' + esc(S.pw.activities[i].how) + '</p>';
  }
  html +=
    '<h2>Leaving record · ' +
    leavingCount() +
    ' of 6</h2><div class="pw-leave">';
  for (i = 0; i < LEAVING.length; i++) {
    html +=
      '<button type="button" class="' +
      (S.pw.leaving[LEAVING[i].k] ? 'on' : '') +
      '" data-pw-leave="' +
      esc(LEAVING[i].k) +
      '">' +
      esc(LEAVING[i].n) +
      '</button>';
  }
  html +=
    '</div><div class="pw-foot"><span></span><button type="button" class="btn" data-pw-done="1">Done</button></div></section>';
  return html;
}

function renderPwEditMentor() {
  var html =
    '<div class="pw-backrow"><button type="button" class="pw-back" data-pw-sub="">← Back</button><h1>Edit my profile</h1></div>' +
    '<section class="pw-sec pw-form"><label>Name</label><input id="pw-name" value="' +
    esc(S.pw.name || '') +
    '"/><label>Title</label><input id="pw-title" value="' +
    esc(S.pw.title || '') +
    '"/><label>Region</label><select id="pw-ed-region">';
  var i;
  for (i = 0; i < REGIONS.length; i++) {
    html +=
      '<option value="' +
      esc(REGIONS[i].k) +
      '"' +
      (S.pw.region === REGIONS[i].k ? ' selected' : '') +
      '>' +
      esc(REGIONS[i].n) +
      '</option>';
  }
  html += '</select><label>Field</label><select id="pw-ed-field">';
  for (i = 0; i < FIELDS.length; i++) {
    html +=
      '<option value="' +
      esc(FIELDS[i].k) +
      '"' +
      (S.pw.mentorField === FIELDS[i].k ? ' selected' : '') +
      '>' +
      esc(FIELDS[i].n) +
      '</option>';
  }
  html +=
    '</select><label>About</label><textarea id="pw-about">' +
    esc(S.pw.about || '') +
    '</textarea><h2>Route steps</h2>';
  for (i = 0; i < S.pw.steps.length; i++) {
    html +=
      '<p>' +
      esc(S.pw.steps[i].when) +
      ' · ' +
      esc(S.pw.steps[i].did) +
      ' <button type="button" class="btn q" data-pw-rmstep="' +
      i +
      '">Remove</button></p>';
  }
  html +=
    '<div class="pw-foot"><span></span><button type="button" class="btn" data-pw-done="1">Done</button></div></section>';
  return html;
}

function renderCareerSheet() {
  var ix = S.pw.sheet;
  var c = careerAt(ix);
  var facts;
  var sm;
  var html;
  var i;
  var acc;
  var fields;
  if (!c) return '';
  facts = careerFacts(c);
  sm = subjectMatch(c);
  fields = [];
  for (i = 0; i < c.b.length; i++) fields.push(fieldName(c.b[i]));
  acc = [
    { k: 'route', n: 'Routes in Guyana', v: c.route },
    { k: 'csec', n: 'Forms 4 and 5 CSEC', v: c.csec },
    { k: 'cape', n: 'Form 6 CAPE', v: c.cape },
    { k: 'f13', n: 'In Forms 1 to 3', v: c.f13 },
    { k: 'gate', n: 'Professional gate', v: c.gate },
    { k: 'dev', n: 'Recent change', v: c.dev },
    { k: 'jobs', n: 'First jobs', v: c.jobs }
  ];
  html =
    '<div class="pw-backrow"><button type="button" class="pw-back" data-pw-sheetx="1">← Back</button><h1>' +
    esc(c.n) +
    '</h1></div><span class="p ' +
    statusClass(c.s) +
    '">' +
    esc(statusLabel(c.s)) +
    '</span><p class="pw-fields">' +
    esc(fields.join(', ')) +
    '</p><div class="pw-glance"><div class="pw-tile"><span class="k">Entry from</span>' +
    esc(facts.entry) +
    '</div><div class="pw-tile"><span class="k">Time it takes</span>' +
    esc(facts.time) +
    '</div><div class="pw-tile"><span class="k">Routes in Guyana</span>' +
    esc(
      forkFits(c)
        .map(function (x) { return x.n; })
        .join(', ') || 'Varies by intake'
    ) +
    '</div><div class="pw-tile' +
    (c.gate ? ' gate' : '') +
    '"><span class="k">Licence or registration</span>' +
    esc(c.gate ? 'Yes, a professional gate' : 'None listed') +
    '</div></div>';
  if (c.s === 'varies') {
    html +=
      '<div class="pw-warn">The route varies by intake, school or employer. Confirm the current notice before you drop a subject or pay a fee.</div>';
  } else if (c.s === 'portfolio') {
    html +=
      '<div class="pw-warn">Talent, a portfolio, an audition or a selection trial decides this career. A credential alone will not get you there.</div>';
  }
  html +=
    '<h3>Recommended subjects · you have ' +
    sm.have +
    ' of ' +
    sm.total +
    '</h3><p class="pw-note">Recommended is not the same as a formal entry requirement.</p><div class="pw-chips">';
  for (i = 0; i < sm.rec.length; i++) {
    html +=
      '<span class="pw-fact' +
      (subjectLogged(sm.rec[i]) ? ' ok' : '') +
      '">' +
      esc(sm.rec[i]) +
      '</span>';
  }
  html += '</div>';
  for (i = 0; i < acc.length; i++) {
    if (!acc[i].v) continue;
    html +=
      '<div class="pw-acc"><button type="button" data-pw-acc="' +
      esc(acc[i].k) +
      '">' +
      esc(acc[i].n) +
      '</button>';
    if (S.pw.sheetAcc === acc[i].k) html += '<div class="body">' + esc(acc[i].v) + '</div>';
    html += '</div>';
  }
  html +=
    '<p class="pw-note">Checked 9 August 2026 against the Guyana Student Career Pathways Guide. ' +
    (c.src
      ? '<a href="' +
        esc(c.src) +
        '" target="_blank" rel="noopener">Source</a>. '
      : '') +
    'Requirements change. Confirm on the institution\'s own programme page before planning around it.</p>' +
    '<button type="button" class="btn" data-pw-dest="' +
    ix +
    '">Make this my destination</button>' +
    '<button type="button" class="btn g" data-pw-book="' +
    ix +
    '">' +
    (isConsidering(ix) ? 'Saved to considering' : 'Add to considering') +
    '</button>' +
    '<button type="button" class="btn g" data-pw-flag="' +
    ix +
    '">' +
    (pwIsGuide() ? 'Suggest an edit' : 'Flag an error') +
    '</button>';
  return html;
}

function renderPwFlag() {
  var html =
    '<div class="pw-backrow"><button type="button" class="pw-back" data-pw-flagx="1">← Back</button><h1>Flag an error</h1></div><div class="pw-form">';
  var i;
  for (i = 0; i < PW_FLAG_REASONS.length; i++) {
    html +=
      '<button type="button" class="pw-opt' +
      (S.pw.flagReason === PW_FLAG_REASONS[i].k ? ' on' : '') +
      '" data-pw-flagr="' +
      esc(PW_FLAG_REASONS[i].k) +
      '">' +
      esc(PW_FLAG_REASONS[i].n) +
      '</button>';
  }
  html +=
    '<label>Optional correction</label><textarea id="pw-flag-note">' +
    esc(S.pw.flagNote) +
    '</textarea><p class="hint">A flag with a correction gets fixed faster.</p>' +
    '<button type="button" class="btn" data-pw-flagsend="1"' +
    (S.pw.flagReason ? '' : ' disabled') +
    '>Submit flag</button></div>';
  return html;
}

function renderPwSuggest() {
  var c = careerAt(S.pw.sugOn);
  var cur = c && S.pw.sugField ? c[S.pw.sugField] || '' : '';
  var ok = S.pw.sugField && S.pw.sugText.length > 20 && S.pw.sugWhy.length > 10;
  var html =
    '<div class="pw-backrow"><button type="button" class="pw-back" data-pw-sugx="1">← Back</button><h1>Suggest an edit</h1></div><div class="pw-form"><label>Which field</label>';
  var i;
  for (i = 0; i < PW_SUGGEST_FIELDS.length; i++) {
    html +=
      '<button type="button" class="pw-opt' +
      (S.pw.sugField === PW_SUGGEST_FIELDS[i].k ? ' on' : '') +
      '" data-pw-sugf="' +
      esc(PW_SUGGEST_FIELDS[i].k) +
      '">' +
      esc(PW_SUGGEST_FIELDS[i].n) +
      '</button>';
  }
  if (S.pw.sugField) {
    html += '<p class="pw-note">It says now: ' + esc(cur || 'Nothing written.') + '</p>';
  }
  html +=
    '<label>Replacement</label><textarea id="pw-sug-text">' +
    esc(S.pw.sugText) +
    '</textarea><label>Why, and where you checked</label><textarea id="pw-sug-why">' +
    esc(S.pw.sugWhy) +
    '</textarea><button type="button" class="btn" data-pw-sugsend="1"' +
    (ok ? '' : ' disabled') +
    '>Submit suggestion</button></div>';
  return html;
}

function renderPwSubjects() {
  var html =
    '<div class="pw-backrow"><button type="button" class="pw-back" data-pw-subjx="1">← Back</button><h1>My subjects</h1></div><p class="hint">Tap once for have it, twice for taking it, again to clear. Subjects marked as had get a grade of I to VI.</p><div class="pw-subj-grid">';
  var i;
  var st;
  var rec;
  for (i = 0; i < CSEC_SUBJECTS.length; i++) {
    rec = S.pw.subjects[CSEC_SUBJECTS[i]] || null;
    st = rec ? rec.st : '';
    html +=
      '<button type="button" class="pw-subj' +
      (st === 'have' ? ' have' : st === 'take' ? ' take' : '') +
      '" data-pw-subj="' +
      esc(CSEC_SUBJECTS[i]) +
      '">' +
      esc(CSEC_SUBJECTS[i]) +
      (st === 'have' && rec.grade ? ' · ' + rec.grade : st === 'take' ? ' · taking' : '') +
      '</button>';
    if (st === 'have') {
      html +=
        '<select data-pw-grade="' +
        esc(CSEC_SUBJECTS[i]) +
        '"><option' +
        (rec.grade === 'I' ? ' selected' : '') +
        '>I</option><option' +
        (rec.grade === 'II' ? ' selected' : '') +
        '>II</option><option' +
        (rec.grade === 'III' ? ' selected' : '') +
        '>III</option><option' +
        (rec.grade === 'IV' ? ' selected' : '') +
        '>IV</option><option' +
        (rec.grade === 'V' ? ' selected' : '') +
        '>V</option><option' +
        (rec.grade === 'VI' ? ' selected' : '') +
        '>VI</option></select>';
    }
  }
  html += '</div>';
  return html;
}

function readPwFormFields() {
  var el;
  el = byId('pw-name');
  if (el) S.pw.name = el.value;
  el = byId('pw-title');
  if (el) S.pw.title = el.value;
  el = byId('pw-about');
  if (el) S.pw.about = el.value;
  el = byId('pw-ed-level');
  if (el) {
    S.pw.level = el.value;
    S.form = levelName(S.pw.level);
  }
  el = byId('pw-ed-region');
  if (el) {
    S.pw.region = el.value;
    S.region = regionShort(S.pw.region);
  }
  el = byId('pw-ed-field');
  if (el) S.pw.mentorField = el.value;
  el = byId('pw-step-when');
  if (el) S.pw.stepWhen = el.value;
  el = byId('pw-step-did');
  if (el) S.pw.stepDid = el.value;
  el = byId('pw-step-led');
  if (el) S.pw.stepLed = el.value;
  el = byId('pw-flag-note');
  if (el) S.pw.flagNote = el.value;
  el = byId('pw-sug-text');
  if (el) S.pw.sugText = el.value;
  el = byId('pw-sug-why');
  if (el) S.pw.sugWhy = el.value;
}

function renderPwOverlays() {
  var body = '';
  var open = false;
  if (S.pw.subjSheet) {
    open = true;
    body = renderPwSubjects();
  } else if (S.pw.flagOn >= 0) {
    open = true;
    body = renderPwFlag();
  } else if (S.pw.sugOn >= 0) {
    open = true;
    body = renderPwSuggest();
  } else if (S.pw.sheet >= 0) {
    open = true;
    body = renderCareerSheet();
  }
  if (!open) {
    return '<div class="pw-overlay" id="pw-sheet" style="visibility:hidden"></div>';
  }
  return '<div class="pw-overlay open" id="pw-sheet" style="visibility:visible">' + body + '</div>';
}

function renderPathway() {
  var html;
  ensurePw();
  if (!S.pw.done) return renderPwWizard();
  html = '<div class="page-pw">';
  if (S.pw.sub === 'edit') {
    html += renderPwQueue();
    html += pwIsGuide() && S.role !== 'admin' ? renderPwEditMentor() : renderPwEditStudent();
    html += renderPwOverlays() + '</div>';
    return html;
  }
  if (S.pw.sub === 'field') {
    html += renderPwQueue() + renderPwField() + renderPwOverlays() + '</div>';
    return html;
  }
  html += renderPwQueue();
  html +=
    '<div class="pw-subtabs"><button type="button" class="' +
    (S.pw.tab === 'me' ? 'on' : '') +
    '" data-pw-tab="me">My pathway</button><button type="button" class="' +
    (S.pw.tab === 'explore' ? 'on' : '') +
    '" data-pw-tab="explore">Explore</button></div>';
  if (S.pw.tab === 'explore') html += renderPwExplore();
  else if (pwIsGuide() && S.role !== 'admin') html += renderPwMentor();
  else html += renderPwStudent();
  html += renderPwOverlays() + '</div>';
  return html;
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

function syncReplyComposer(el) {
  var bar = closestEl(el, '.reply-bar');
  var h;
  if (!bar) return;
  if (el.value && el.value.replace(/\s/g, '')) bar.classList.add('has-text');
  else bar.classList.remove('has-text');
  el.style.height = 'auto';
  h = el.scrollHeight;
  if (h < 44) h = 44;
  if (h > 120) h = 120;
  el.style.height = h + 'px';
}

function tryPostThreadReply(tid) {
  var tr = byId('thread-reply');
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
}

function postThreadReply(tid, rtext, afterPathway) {
  var titem = feedByEngageId(tid) || feedById(tid);
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
    mine: true,
    at: nowIso()
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
    (S.waitlist.indexOf(s.id) !== -1 ? '<span class="p">Waitlist</span> ' : '') +
    '<button type="button" class="btn sm" data-open="' +
    (S.booked.indexOf(s.id) !== -1 || S.waitlist.indexOf(s.id) !== -1 ? 'book' : 'session') +
    '" data-id="' +
    esc(s.id) +
    '">' +
    (S.booked.indexOf(s.id) !== -1 || S.waitlist.indexOf(s.id) !== -1 ? 'Manage' : 'Open') +
    '</button></div></div>'
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
      replies: item.replies || [],
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
      replies: (item && item.replies) || [],
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
      replies: (item && item.replies) || [],
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
      replies: (item && item.replies) || [],
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
  var kind = detailOpenKind(p);
  var own = !!p.mine || isOwnCard(kind, p.id, !!p.mine);
  return postEngageBar(null, kind, p.id, own, true, p.replies ? p.replies.length : 0);
}

function readKindLabel(p) {
  if (p.kind === 'question') return '';
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
  var list = p.replies || [];
  var html;
  var i;
  var r;
  var a;
  html =
    '<div class="d-replies"><p class="d-count">' +
    list.length +
    (list.length === 1 ? ' reply' : ' replies') +
    ', in the order they were written</p>';
  for (i = 0; i < list.length; i++) {
    r = list[i];
    a = r.a ? author(r.a) : null;
    html +=
      '<div class="d-reply">' +
      replyIdentityHtml(a, r.who || 'Student', true, r.at || p.at) +
      '<p class="reply-text">' +
      esc(r.text) +
      '</p></div>';
  }
  html +=
    '<div class="d-replybox">' +
    '<label class="sr" for="thread-reply">Write a reply</label>' +
    '<div class="reply-bar">' +
    youAvatarHtml() +
    '<textarea id="thread-reply" rows="1" placeholder="Write a reply"></textarea>' +
    '<button type="button" class="reply-send" data-thread-reply="' +
    esc(p.id) +
    '" aria-label="Post reply">' +
    iconSendUp() +
    '</button></div></div></div>';
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
  var html = '<div class="detail d-simple">';
  if (p.kind === 'question') {
    html += content(p) + replies(p) + action(p) + '</div>';
    return html;
  }
  html += head(p) + content(p) + detailEngage(p) + action(p);
  html += resources(p) + similar(p) + replies(p) + '</div>';
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
  return { crumb: '', title: 'QUESTION', html: renderSimpleDetail(p) };
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
    requirePathway({
      type: 'compose',
      reason: 'Answer four questions first. This is the same quiz as My Pathway.'
    });
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
      '<p>Four questions. The same quiz as My Pathway. It tells us which openings fit your form.</p>' +
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
  return { crumb: 'Alerts', title: 'Alerts', html: renderAlertsPage() };
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
  if (S.commRole === 'likeme') S.commRole = 'all';
  var dir = filteredPeople();
  var followed = followedPeople();
  var html = '<div class="page-comm">';
  html += '<h1>Community</h1>';
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
  html += '<h2>Mentors and contributors · ' + dir.length + '</h2>';
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
    nameWithBadge(p.name, a);
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
  ensurePw();
  if (v && v.id && String(v.id) !== '0') {
    S.pw.step = parseInt(v.id, 10) || S.pw.step || 0;
  }
  return renderSetup();
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
  person: viewPerson
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
    } else if (S.unread > 0 && S.view !== 'alerts') {
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
      (navKey === 'community' && (sheetTop === 'person' || sheetTop === 'mentor')) ||
      (navKey === 'alerts' && (S.view === 'sessions' || sheetTop === 'session' || sheetTop === 'book' || sheetTop === 'opp'));
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
      h += catChip(CATS[i]);
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

function restorePwSearch() {
  var f;
  if (S.view !== 'pathway' || !S.pw || !S.pw.focusQ) return;
  f = byId('q');
  if (f) {
    f.focus();
    try {
      f.setSelectionRange(S.pw.qPos, S.pw.qPos);
    } catch (err) {}
  }
  S.pw.focusQ = false;
}

function render() {
  var main = byId('main');
  if (S.view === 'pathway') main.innerHTML = renderPathway();
  else if (S.view === 'alerts' || S.view === 'sessions') main.innerHTML = renderAlertsPage();
  else if (S.view === 'community') main.innerHTML = renderCommunity();
  else main.innerHTML = renderFeed();
  renderChrome();
  restorePwSearch();
}

function openKind(kind, id) {
  if (kind === 'sessions') {
    S.sessionStage = id || '';
    setView('alerts');
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
    mentor: 'person'
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
    ensurePw();
    S.pw.step = 0;
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
        'I saw your question. Write down the subjects you hold now and the ones you wish you still had. Bring that list to a session and we will map what still opens.',
      at: nowIso()
    });
    item.newReply = true;
    if (S.view !== 'pathway' && S.view !== 'alerts') S.unread += 1;
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

function reasonName(k) {
  var i;
  for (i = 0; i < PW_FLAG_REASONS.length; i++) {
    if (PW_FLAG_REASONS[i].k === k) return PW_FLAG_REASONS[i].n;
  }
  return k;
}

function suggestFieldName(k) {
  var i;
  for (i = 0; i < PW_SUGGEST_FIELDS.length; i++) {
    if (PW_SUGGEST_FIELDS[i].k === k) return PW_SUGGEST_FIELDS[i].n;
  }
  return k;
}

function handlePwClick(t) {
  var btn;
  var key;
  var rec;
  var ix;
  var row;
  var c;
  ensurePw();
  btn = closestEl(t, '[data-pw-level]');
  if (btn) {
    S.pw.level = btn.getAttribute('data-pw-level');
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-pw-region]');
  if (btn) {
    S.pw.region = btn.getAttribute('data-pw-region');
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-pw-field]');
  if (btn) {
    key = btn.getAttribute('data-pw-field');
    ix = S.pw.fields.indexOf(key);
    if (ix === -1) S.pw.fields.push(key);
    else S.pw.fields.splice(ix, 1);
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-pw-clarity]');
  if (btn) {
    S.pw.clarity = btn.getAttribute('data-pw-clarity');
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-pw-next]');
  if (btn) {
    if (S.pw.step >= 3) {
      finishPwWizard();
      return true;
    }
    S.pw.step += 1;
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-pw-back]');
  if (btn) {
    if (S.pw.step > 0) S.pw.step -= 1;
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-pw-tab]');
  if (btn) {
    S.pw.tab = btn.getAttribute('data-pw-tab');
    S.pw.sub = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-sub]');
  if (btn) {
    readPwFormFields();
    S.pw.sub = btn.getAttribute('data-pw-sub') || '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-done]');
  if (btn) {
    readPwFormFields();
    S.pw.sub = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-openlvl]');
  if (btn) {
    key = btn.getAttribute('data-pw-openlvl');
    S.pw.open = S.pw.open === key ? '' : key;
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-fork]');
  if (btn) {
    S.pw.fork = btn.getAttribute('data-pw-fork');
    S.pw.open = 'fork';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-book]');
  if (btn) {
    toggleConsidering(parseInt(btn.getAttribute('data-pw-book'), 10));
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-open]');
  if (btn) {
    S.pw.sheet = parseInt(btn.getAttribute('data-pw-open'), 10);
    S.pw.sheetAcc = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-sheetx]');
  if (btn) {
    S.pw.sheet = -1;
    S.pw.sheetAcc = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-openfield]');
  if (btn) {
    S.pw.field = btn.getAttribute('data-pw-openfield');
    S.pw.sub = 'field';
    S.pw.tab = 'explore';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-clearq]');
  if (btn) {
    S.pw.q = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-acc]');
  if (btn) {
    key = btn.getAttribute('data-pw-acc');
    S.pw.sheetAcc = S.pw.sheetAcc === key ? '' : key;
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-dest]');
  if (btn) {
    setDestination(parseInt(btn.getAttribute('data-pw-dest'), 10));
    S.pw.sheet = -1;
    S.pw.tab = 'me';
    S.pw.sub = '';
    toast('Destination set.');
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-flag]');
  if (btn) {
    ix = parseInt(btn.getAttribute('data-pw-flag'), 10);
    if (pwIsGuide() && S.role !== 'admin') {
      S.pw.sugOn = ix;
      S.pw.sugField = '';
      S.pw.sugText = '';
      S.pw.sugWhy = '';
    } else {
      S.pw.flagOn = ix;
      S.pw.flagReason = '';
      S.pw.flagNote = '';
    }
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-flagx]');
  if (btn) {
    S.pw.flagOn = -1;
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-flagr]');
  if (btn) {
    S.pw.flagReason = btn.getAttribute('data-pw-flagr');
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-flagsend]');
  if (btn) {
    readPwFormFields();
    if (!S.pw.flagReason) return true;
    c = careerAt(S.pw.flagOn);
    S.pw.queue.push({
      career: c ? c.n : '',
      kind: 'Flag',
      who: S.pw.name || 'You',
      text: reasonName(S.pw.flagReason) + (S.pw.flagNote ? '. ' + S.pw.flagNote : ''),
      mine: true,
      ix: S.pw.flagOn,
      field: ''
    });
    S.pw.flagOn = -1;
    toast('Flag sent for a check.');
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-sugx]');
  if (btn) {
    S.pw.sugOn = -1;
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-sugf]');
  if (btn) {
    S.pw.sugField = btn.getAttribute('data-pw-sugf');
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-sugsend]');
  if (btn) {
    readPwFormFields();
    if (!S.pw.sugField || S.pw.sugText.length <= 20 || S.pw.sugWhy.length <= 10) return true;
    c = careerAt(S.pw.sugOn);
    S.pw.queue.push({
      career: c ? c.n : '',
      kind: 'Suggestion',
      who: S.pw.name || 'You',
      text: S.pw.sugText + ' (' + S.pw.sugWhy + ')',
      mine: true,
      ix: S.pw.sugOn,
      field: S.pw.sugField,
      next: S.pw.sugText
    });
    S.pw.sugOn = -1;
    toast('Suggestion sent for a check.');
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-pub]');
  if (btn) {
    ix = parseInt(btn.getAttribute('data-pw-pub'), 10);
    row = S.pw.queue[ix];
    if (!row || row.mine) return true;
    if (row.field && row.next && CAREERS[row.ix]) CAREERS[row.ix][row.field] = row.next;
    S.pw.queue.splice(ix, 1);
    toast('Published.');
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-ret]');
  if (btn) {
    ix = parseInt(btn.getAttribute('data-pw-ret'), 10);
    S.pw.queue.splice(ix, 1);
    toast('Returned.');
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-subjects]');
  if (btn) {
    S.pw.subjSheet = true;
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-subjx]');
  if (btn) {
    S.pw.subjSheet = false;
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-subj]');
  if (btn) {
    key = btn.getAttribute('data-pw-subj');
    rec = S.pw.subjects[key];
    if (!rec) S.pw.subjects[key] = { st: 'have', grade: 'I' };
    else if (rec.st === 'have') S.pw.subjects[key] = { st: 'take', grade: '' };
    else delete S.pw.subjects[key];
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-leave]');
  if (btn) {
    key = btn.getAttribute('data-pw-leave');
    S.pw.leaving[key] = !S.pw.leaving[key];
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-addach]');
  if (btn) {
    rec = {
      what: (byId('pw-ach-what') && byId('pw-ach-what').value) || '',
      where: (byId('pw-ach-where') && byId('pw-ach-where').value) || '',
      when: (byId('pw-ach-when') && byId('pw-ach-when').value) || ''
    };
    if (rec.what) S.pw.achievements.push(rec);
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-addact]');
  if (btn) {
    rec = {
      what: (byId('pw-act-what') && byId('pw-act-what').value) || '',
      do: (byId('pw-act-do') && byId('pw-act-do').value) || '',
      how: (byId('pw-act-how') && byId('pw-act-how').value) || ''
    };
    if (rec.what) S.pw.activities.push(rec);
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-addstep]');
  if (btn) {
    S.pw.addStep = true;
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-savestep]');
  if (btn) {
    readPwFormFields();
    if (S.pw.stepDid) {
      S.pw.steps.push({ when: S.pw.stepWhen || 'Now', did: S.pw.stepDid, led: S.pw.stepLed });
      S.pw.stepWhen = '';
      S.pw.stepDid = '';
      S.pw.stepLed = '';
      S.pw.addStep = false;
    }
    render();
    return true;
  }
  btn = closestEl(t, '[data-pw-rmstep]');
  if (btn) {
    S.pw.steps.splice(parseInt(btn.getAttribute('data-pw-rmstep'), 10), 1);
    render();
    return true;
  }
  return false;
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

    if (handlePwClick(t)) return;

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
      if (nav === 'sessions' || nav === 'alerts') S.sessionStage = '';
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

    if (closestEl(t, '[data-clear-stage]')) {
      S.sessionStage = '';
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
      ensurePw();
      if (S.pw.step > 0) {
        S.pw.step -= 1;
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
      tryPostThreadReply(btn.getAttribute('data-thread-reply'));
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
      if (S.view === 'pathway') {
        ensurePw();
        S.pw.q = e.target.value;
        S.pw.qPos = pos;
        S.pw.focusQ = true;
        render();
        return;
      }
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
    if (e.target && e.target.id === 'thread-reply') {
      syncReplyComposer(e.target);
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
    var gname;
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-pw-grade')) {
      gname = e.target.getAttribute('data-pw-grade');
      if (!S.pw.subjects[gname]) S.pw.subjects[gname] = { st: 'have', grade: e.target.value };
      else S.pw.subjects[gname].grade = e.target.value;
      return;
    }
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
    var bar;
    var btn;
    if (e.target && e.target.id === 'thread-reply' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      bar = closestEl(e.target, '.reply-bar');
      btn = bar ? bar.querySelector('[data-thread-reply]') : null;
      if (btn) tryPostThreadReply(btn.getAttribute('data-thread-reply'));
      return;
    }
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
  if (h === 'sessions' || h === 'alerts' || h === 'happening' || h === 'notifications') {
    hideSheetUi();
    S.view = 'alerts';
    S.sessionStage = '';
    S.unread = 0;
    return 'alerts';
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
