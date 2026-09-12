/* Explore directory. Prefix: ex-. Reads considering, dest, mpSubj, quiz fields. */
var EX_CXC = [
  'Electronic Document Preparation and Management',
  'Electrical and Electronic Technology',
  'Electrical and Electronic Engineering Technology',
  'Principles of Accounts',
  'Principles of Business',
  'Additional Mathematics',
  'Human and Social Biology',
  'Integrated Science',
  'Information Technology',
  'Caribbean History',
  'Office Administration',
  'Physical Education and Sport',
  'Industrial Technology',
  'Technical Drawing',
  'Building Technology',
  'Agricultural Science',
  'Food Nutrition and Health',
  'Resource Management',
  'Religious Education',
  'Social Studies',
  'English A',
  'English B',
  'Mathematics',
  'Chemistry',
  'Biology',
  'Physics',
  'Geography',
  'Economics',
  'Portuguese',
  'Spanish',
  'French',
  'Visual Arts',
  'Theatre Arts',
  'Music'
];
var EX_CAPE = [
  'Electrical and Electronic Engineering Technology',
  'Logistics and Supply Chain Operations',
  'Communication Studies',
  'Caribbean Studies',
  'Literatures in English',
  'Integrated Mathematics',
  'Applied Mathematics',
  'Pure Mathematics',
  'Management of Business',
  'Environmental Science',
  'Information Technology',
  'Computer Science',
  'Agricultural Science',
  'Food and Nutrition',
  'Physical Education and Sport',
  'Art and Design',
  'Digital Media',
  'Green Engineering',
  'Entrepreneurship',
  'Financial Services Studies',
  'Performing Arts',
  'Accounting',
  'Chemistry',
  'Biology',
  'Physics',
  'Geography',
  'Economics',
  'Sociology',
  'History',
  'Spanish',
  'French',
  'Tourism',
  'Law'
];
var EX_ALIAS = {
  EDPM: 'Electronic Document Preparation and Management',
  POA: 'Principles of Accounts',
  POB: 'Principles of Business',
  IT: 'Information Technology'
};
var EX_CAVEAT = {
  confirmed: 'A current official or first-party pathway was confirmed. Requirements still change, so check the programme page before you plan around it.',
  varies: 'The route varies by intake, school or employer. Confirm the current notice before you drop a subject or pay a fee.',
  portfolio: 'Portfolio, talent, appointment or election matters more here than any single credential.',
  unmarked: 'This profile has no status mark yet. Treat every requirement as unconfirmed until someone checks it.'
};
var EX_REF = [
  {
    n: 'University of Guyana',
    when: 'The career needs a local degree, laboratory or clinical access, fieldwork or a clear UG professional pathway.',
    check: 'Confirm the exact programme, campus and CSEC or CAPE rules on the UG offered-programmes list.',
    url: 'https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php',
    lab: 'UG offered programmes'
  },
  {
    n: 'GOAL scholarship',
    when: 'A current online programme fits the career and the student can study independently with reliable access.',
    check: 'GOAL is a scholarship pathway, not the awarding university. Confirm the intake, awarding institution, eligibility and recognition on the current GOAL bachelor list.',
    url: 'https://goal.edu.gy/2026-bachelor-degree-programmes/',
    lab: 'GOAL bachelor list'
  },
  {
    n: 'TVET, CVQ or BIT',
    when: 'Practical competence, apprenticeship and faster entry matter more than a bachelor degree.',
    check: 'Check the credential level, practical hours, location, intake and progression in the TVET directory or the current BIT notice.',
    url: 'https://tvet.gov.gy/programs',
    lab: 'TVET programme directory'
  },
  {
    n: 'CPCE, GSA or Ministry training',
    when: 'The occupation has a specialised national training route.',
    check: 'Use the current programme notice. Entry subjects, duration, location and service obligations can differ by intake.',
    url: '',
    lab: ''
  },
  {
    n: 'Regulator or employer pathway',
    when: 'Aviation, maritime, uniformed service or another licensed or selected occupation controls entry.',
    check: 'Verify age, medical, fitness, examinations, experience and licence directly with the regulator or recruitment notice.',
    url: '',
    lab: ''
  },
  {
    n: 'Regional or overseas study',
    when: 'Guyana does not currently offer the complete recognised route.',
    check: 'Confirm accreditation, professional recognition, funding, migration conditions and the route back to practice in Guyana before enrolling.',
    url: '',
    lab: ''
  }
];

function exEnsure() {
  if (!S.ex) {
    S.ex = {
      open: '',
      form: '',
      formErr: '',
      kill: '',
      listAll: {},
      flagNote: '',
      draft: null,
      edit: null
    };
  }
  return S.ex;
}

function exStaff() {
  return S.role === 'mentor' || S.role === 'contributor' || S.role === 'admin';
}

function exAdmin() {
  return S.role === 'admin';
}

function exWho() {
  return (S.me && S.me.name) || (S.pw && S.pw.name) || 'You';
}

function exStore() {
  if (typeof NSG_CMS === 'undefined') return null;
  var st = NSG_CMS.loadWorking();
  if (!st.careerFieldEdits) st.careerFieldEdits = {};
  if (!st.careerQueue) st.careerQueue = [];
  if (!st.careerDrafts) st.careerDrafts = [];
  return st;
}

function exPersist(st) {
  if (typeof NSG_CMS !== 'undefined') NSG_CMS.persist(st);
}

function exSeedAt(ix) {
  var list = typeof EX_SEED !== 'undefined' && EX_SEED.careers ? EX_SEED.careers : [];
  return list[ix] || null;
}

function exClone(v) {
  return JSON.parse(JSON.stringify(v));
}

function exCard(ix) {
  var seed = exSeedAt(ix);
  var st;
  var edits;
  var card;
  if (!seed) return null;
  st = exStore();
  if (st && st.careerDeletes && st.careerDeletes.indexOf(seed.id) !== -1) return null;
  card = exClone(seed);
  edits = st && st.careerFieldEdits && st.careerFieldEdits[card.id] ? st.careerFieldEdits[card.id] : {};
  Object.keys(edits).forEach(function (k) {
    card[k] = exClone(edits[k]);
  });
  card.ix = ix;
  return card;
}

function exPendingField(id, field) {
  var st = exStore();
  var i;
  var row;
  if (!st) return false;
  for (i = 0; i < st.careerQueue.length; i++) {
    row = st.careerQueue[i];
    if (row.status !== 'pending') continue;
    if (row.careerId === id && row.field === field) return true;
  }
  return false;
}

function exMissing(card) {
  var miss = [];
  if (!card.title) miss.push('Title');
  if (!card.fields || !card.fields.length) miss.push('Fields');
  if (!card.entryFrom) miss.push('Entry from');
  if (!card.timeTakes) miss.push('Time it takes');
  if (!card.licence) miss.push('Licence or registration');
  if (!card.routes || !card.routes.length) miss.push('Routes in Guyana');
  if (!card.study || !card.study.length) miss.push('Where you study it');
  if (!card.forms13) miss.push('In Forms 1 to 3');
  if (!card.firstJobs) miss.push('First jobs');
  return miss;
}

function exGuide(key) {
  var g = typeof EX_SEED !== 'undefined' && EX_SEED.guides ? EX_SEED.guides[key] : null;
  var st = exStore();
  var edits;
  var out;
  if (!g) g = (typeof BUCKETS !== 'undefined' && BUCKETS[key]) || {};
  out = { explore: g.explore || '', csec: g.csec || '', after: g.after || '' };
  edits = st && st.careerFieldEdits && st.careerFieldEdits['guide:' + key];
  if (edits) {
    if (edits.explore != null) out.explore = edits.explore;
    if (edits.csec != null) out.csec = edits.csec;
    if (edits.after != null) out.after = edits.after;
  }
  return out;
}

function exStudentNames() {
  var p = S.pw || {};
  var names = {};
  var i;
  var row;
  var exam;
  if (p.mpSubj) {
    for (exam in p.mpSubj) {
      if (!p.mpSubj.hasOwnProperty(exam)) continue;
      for (i = 0; i < p.mpSubj[exam].length; i++) {
        row = p.mpSubj[exam][i];
        if (row && row.name && (row.st === 'have' || row.st === 'take')) names[row.name] = true;
      }
    }
  }
  if (p.subjects) {
    for (row in p.subjects) {
      if (p.subjects.hasOwnProperty(row) && p.subjects[row] && p.subjects[row].st) names[row] = true;
    }
  }
  return names;
}

function exHasName(held, name) {
  return !!(held[name] || held[EX_ALIAS[name]]);
}

function exParseSubjects(text, bank) {
  var raw = String(text || '');
  var used = [];
  var found = [];
  var i;
  var name;
  var ix;
  var alias;
  raw = raw.replace(/Mathematics\/Physics/gi, 'Mathematics Physics');
  raw = raw.replace(/Pure or Applied Mathematics/gi, 'Pure Mathematics Applied Mathematics');
  for (alias in EX_ALIAS) {
    if (EX_ALIAS.hasOwnProperty(alias)) {
      raw = raw.replace(new RegExp('\\b' + alias + '\\b', 'g'), EX_ALIAS[alias]);
    }
  }
  for (i = 0; i < bank.length; i++) {
    name = bank[i];
    ix = raw.toLowerCase().indexOf(name.toLowerCase());
    if (ix === -1) continue;
    found.push({ name: name, at: ix });
    raw = raw.slice(0, ix) + new Array(name.length + 1).join(' ') + raw.slice(ix + name.length);
  }
  found.sort(function (a, b) { return a.at - b.at; });
  for (i = 0; i < found.length; i++) used.push(found[i].name);
  return used;
}

function exCsecMatch(card) {
  var rec = exParseSubjects(card.csec || '', EX_CXC);
  var held = exStudentNames();
  var have = 0;
  var i;
  for (i = 0; i < rec.length; i++) if (exHasName(held, rec[i])) have += 1;
  return { rec: rec, have: have, total: rec.length };
}

function exQueuePush(item) {
  var st = exStore();
  if (!st) {
    if (!S.pw.queue) S.pw.queue = [];
    S.pw.queue.push(item);
    return;
  }
  item.id = item.id || 'q-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  item.status = 'pending';
  item.contentType = 'career-card';
  item.at = item.at || new Date().toISOString();
  st.careerQueue.push(item);
  exPersist(st);
}

function exApplyField(careerId, field, value) {
  var st = exStore();
  var card;
  var i;
  if (!st) return;
  if (!st.careerFieldEdits[careerId]) st.careerFieldEdits[careerId] = {};
  st.careerFieldEdits[careerId][field] = value;
  exPersist(st);
  for (i = 0; i < (EX_SEED && EX_SEED.careers ? EX_SEED.careers.length : 0); i++) {
    if (EX_SEED.careers[i].id === careerId) {
      card = exCard(i);
      if (card) exSyncCompact(card);
      break;
    }
  }
}

function exSyncCompact(card) {
  var i = card.ix;
  if (typeof i !== 'number' || !CAREERS[i]) return;
  CAREERS[i].n = card.title;
  CAREERS[i].s = card.status;
  CAREERS[i].b = (card.fields || []).slice();
  CAREERS[i].route = card.routeGuide;
  CAREERS[i].f13 = card.forms13;
  CAREERS[i].jobs = card.firstJobs;
  CAREERS[i].gate = card.gate;
  CAREERS[i].dev = card.development;
  CAREERS[i].csec = card.csec;
  CAREERS[i].cape = card.cape;
}

function exSaveEdit(careerId, field, after, summary, before) {
  if (exAdmin()) {
    if (field === 'details' && after && after.title) {
      exApplyField(careerId, 'title', after.title);
      exApplyField(careerId, 'status', after.status);
      exApplyField(careerId, 'fields', after.fields);
    } else {
      exApplyField(careerId, field, after);
    }
    toast('Saved.');
    return;
  }
  exQueuePush({
    type: 'edit',
    careerId: careerId,
    career: (exCardById(careerId) || {}).title || '',
    field: field,
    who: exWho(),
    role: S.role,
    before: before,
    after: after,
    summary: summary,
    payload: { field: field, value: after }
  });
  toast('Sent for a check. The live card is unchanged.');
}

function exCardById(id) {
  var i;
  for (i = 0; i < CAREERS.length; i++) {
    if (CAREERS[i].id === id || (exSeedAt(i) && exSeedAt(i).id === id)) return exCard(i);
  }
  return null;
}

function exFactLine(card) {
  var bits = [];
  var sm = exCsecMatch(card);
  if (card.entryFrom) bits.push(card.entryFrom);
  if (card.timeTakes) bits.push(card.timeTakes);
  if (!bits.length) bits.push('Not recorded yet');
  if (sm.total) bits.push('you have ' + sm.have + ' of ' + sm.total + ' recommended CSEC subjects');
  return bits.join(' · ');
}

function exStatusClass(s) {
  if (s === 'confirmed') return 'is-confirmed';
  if (s === 'varies') return 'is-varies';
  if (s === 'portfolio') return 'is-portfolio';
  return '';
}

function exFieldTags(fields, limit) {
  var html = '';
  var i;
  var n = fields ? fields.length : 0;
  var show = typeof limit === 'number' ? Math.min(limit, n) : n;
  for (i = 0; i < show; i++) {
    html += '<span class="ex-pill">' + esc(fieldName(fields[i])) + '</span>';
  }
  if (n > show) html += '<span class="ex-pill">+' + (n - show) + '</span>';
  return html;
}

function exBookSvg(on) {
  return on
    ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h12a1 1 0 0 1 1 1v16l-7-3-7 3V5a1 1 0 0 1 1-1z"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 4h12a1 1 0 0 1 1 1v16l-7-3-7 3V5a1 1 0 0 1 1-1z"/></svg>';
}

function exChev() {
  return '<svg class="ex-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
}

function exPencil() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M12 6l4 4"/></svg>';
}

function exBack(label, sub) {
  return (
    '<div class="pw-backrow"><button type="button" class="pw-back" data-ex-sub="' +
    esc(sub || '') +
    '">' +
    esc(label || 'Back') +
    '</button></div>'
  );
}

function exDeep() {
  return ['field', 'card', 'routes', 'queue', 'add'].indexOf(S.pw.sub) !== -1;
}

function renderExPage() {
  exEnsure();
  if (S.pw.sub === 'field') return renderExField();
  if (S.pw.sub === 'card') return renderExCard();
  if (S.pw.sub === 'routes') return renderExRoutes();
  if (S.pw.sub === 'queue') return renderExQueue();
  if (S.pw.sub === 'add') return renderExAdd();
  return renderExHome();
}

function renderExHome() {
  var html = '<div class="ex-col">';
  var fields;
  var i;
  var f;
  var n;
  var hits;
  var st;
  var qn;
  html +=
    '<div class="ex-search"><input id="ex-q" type="search" placeholder="Search careers" value="' +
    esc(S.pw.q || '') +
    '" autocomplete="off"/>';
  if (S.pw.q) {
    html +=
      '<button type="button" class="btn g" style="margin-top:12px" data-ex-clearq="1">Clear search</button></div>';
    hits = searchCareers(S.pw.q);
    html += '<section class="ex-sec"><h2>Results</h2>';
    html += hits.length ? renderExCards(hits) : '<p class="ex-note">No careers matched that search.</p>';
    html += '</section></div>';
    return html;
  }
  html += '</div><section class="ex-sec"><h2>Browse by field</h2><p class="ex-note">' +
    FIELDS.length +
    ' fields, ' +
    CAREERS.length +
    ' careers. A career can sit in more than one.</p><div class="ex-fgrid">';
  fields = sortedFields();
  for (i = 0; i < fields.length; i++) {
    f = fields[i];
    n = fieldCareerIndexes(f.k).length;
    html +=
      '<button type="button" class="ex-fcard" data-ex-field="' +
      esc(f.k) +
      '"><span class="ex-fg" style="background:var(--i-' +
      esc(f.c) +
      ')">' +
      esc(f.g) +
      '</span><span class="minw"><strong>' +
      esc(f.n) +
      (S.pw.fields.indexOf(f.k) !== -1 ? ' <span class="ex-yours">· yours</span>' : '') +
      '</strong><span>' +
      n +
      ' careers</span></span></button>';
  }
  html +=
    '</div></section><button type="button" class="ex-link" data-ex-sub="routes">Compare UG, GOAL and the rest</button>';
  if (exStaff()) {
    st = exStore();
    qn = st ? st.careerQueue.filter(function (r) { return r.status === 'pending'; }).length : (S.pw.queue || []).length;
    html +=
      '<button type="button" class="ex-link" data-ex-sub="queue">Review queue' +
      (qn ? ' · ' + qn : '') +
      '</button>';
    html += '<button type="button" class="btn g" data-ex-sub="add">Add a career</button>';
  }
  html += '</div>';
  return html;
}

function renderExCards(indexes) {
  var html = '<div class="ex-list">';
  var i;
  for (i = 0; i < indexes.length; i++) html += renderExListCard(indexes[i]);
  html += '</div>';
  return html;
}

function renderExListCard(ix) {
  var card = exCard(ix);
  var miss;
  var saved;
  var html;
  if (!card || (card.published === false && !exStaff())) return '';
  miss = exMissing(card);
  saved = isConsidering(ix);
  html =
    '<article class="ex-row" data-ex-open="' +
    ix +
    '"><div class="minw"><h3>' +
    esc(card.title) +
    '</h3><div class="ex-pills"><span class="ex-pill ' +
    exStatusClass(card.status) +
    '">' +
    esc(card.status || 'unmarked') +
    '</span>';
  if (!card.published) html += '<span class="ex-pill is-draft">Draft</span>';
  if (exStaff() && miss.length) html += '<span class="ex-pill is-miss">' + miss.length + ' fields missing</span>';
  html +=
    exFieldTags(card.fields, 2) +
    '</div><p class="ex-meta">' +
    esc(exFactLine(card)) +
    '</p></div><button type="button" class="ex-book' +
    (saved ? ' on' : '') +
    '" data-ex-book="' +
    ix +
    '" aria-label="' +
    (saved ? 'Remove from considering' : 'Add to considering') +
    '">' +
    exBookSvg(saved) +
    '</button></article>';
  return html;
}

function renderExField() {
  var f = fieldByKey(S.pw.field);
  var g = exGuide(S.pw.field);
  var all = fieldCareerIndexes(S.pw.field);
  var ui = exEnsure();
  var show;
  var html;
  var key = S.pw.field;
  if (!f) return '<p class="ex-note">Field not found.</p>';
  show = ui.listAll[key] ? all : all.slice(0, 12);
  html = '<div class="ex-col">' + exBack('Back to Explore', '') + renderPwSubtabs();
  html +=
    '<div class="ex-hero" style="background:var(--i-' +
    esc(f.c) +
    ')"><h1>' +
    esc(f.n) +
    '</h1><p>' +
    all.length +
    ' careers</p></div>';
  html += exGuideBlock('explore', 'Exploring it in Forms 1 to 3', g.explore, key);
  html += exGuideBlock('csec', 'Subjects this field keeps asking for', g.csec, key);
  html += exGuideBlock('after', 'After CSEC or Form 6', g.after, key);
  html += '<section class="ex-sec"><h2>Careers</h2>' + renderExCards(show);
  if (all.length > 12 && !ui.listAll[key]) {
    html +=
      '<button type="button" class="ex-more" data-ex-all="' +
      esc(key) +
      '">Show all ' +
      all.length +
      ' careers</button>';
  }
  html += '</section></div>';
  return html;
}

function exGuideBlock(k, title, text, fieldKey) {
  var ui = exEnsure();
  var html = '<section class="ex-sec ex-guide"><h3>' + esc(title) + '</h3>';
  if (exPendingField('guide:' + fieldKey, k)) html += '<p class="ex-note">Edit pending</p>';
  if (ui.form === 'guide:' + fieldKey + ':' + k) {
    html +=
      '<div class="ex-edit"><textarea id="ex-guide-t">' +
      esc(text || '') +
      '</textarea><div class="ex-acts"><button type="button" class="btn" data-ex-guide-save="' +
      esc(k) +
      '">Save</button><button type="button" class="btn g" data-ex-form="">Cancel</button></div></div>';
  } else {
    html += '<p>' + esc(text || 'Not recorded yet.') + '</p>';
    if (exStaff()) {
      html +=
        '<button type="button" class="ex-link" data-ex-form="guide:' +
        esc(fieldKey) +
        ':' +
        esc(k) +
        '">Edit</button>';
    }
  }
  html += '</section>';
  return html;
}

function exAcc(key, title, state, body) {
  var open = exEnsure().open === key;
  return (
    '<div class="ex-acc' +
    (open ? ' is-open' : '') +
    '"><button type="button" class="ex-acc-btn" data-ex-acc="' +
    esc(key) +
    '" aria-expanded="' +
    (open ? 'true' : 'false') +
    '" aria-controls="ex-panel-' +
    esc(key) +
    '"><span>' +
    esc(title) +
    '</span><span class="ex-acc-state">' +
    esc(state) +
    '</span>' +
    exChev() +
    '</button><div class="ex-panel" id="ex-panel-' +
    esc(key) +
    '"' +
    (open ? '' : ' inert') +
    '><div class="ex-panel-inner">' +
    body +
    '</div></div></div>'
  );
}

function renderExCard() {
  var ix = S.pw.cardIx;
  var card = exCard(ix);
  var ui = exEnsure();
  var miss;
  var sm;
  var html;
  var i;
  if (!card) return '<p class="ex-note">Career not found.</p>';
  miss = exMissing(card);
  sm = exCsecMatch(card);
  html = '<div class="ex-col">' + exBack('Back', S.pw.field ? 'field' : '') + renderPwSubtabs();
  html += '<article class="ex-card" style="padding:20px 16px"><div class="ex-head"><div class="ex-title-row"><h1>' +
    esc(card.title) +
    '</h1>';
  if (exStaff()) {
    html +=
      '<button type="button" class="ex-icon" data-ex-form="details" aria-label="Edit title, status and fields">' +
      exPencil() +
      '</button>';
  }
  html += '</div><div class="ex-pills"><span class="ex-pill ' + exStatusClass(card.status) + '">' +
    esc(card.status || 'unmarked') +
    '</span>';
  if (!card.published) html += '<span class="ex-pill is-draft">Draft</span>';
  if (exStaff() && miss.length) html += '<span class="ex-pill is-miss">' + miss.length + ' fields missing</span>';
  html += exFieldTags(card.fields) + '</div>';
  if (ui.form === 'details') html += exDetailsForm(card);
  html += '</div>';
  html += exFactsHtml(card);
  html += '<p class="ex-warn">' + esc(EX_CAVEAT[card.status] || EX_CAVEAT.unmarked) + '</p>';
  html += exSubjectsHtml(card, sm);
  html += exRoutesHtml(card);
  html += exStudyHtml(card);
  html += exTextSec(card, 'forms13', 'In Forms 1 to 3', true);
  html += exTextSec(card, 'development', 'Recent development', false);
  html += exTextSec(card, 'gate', 'Professional gate', false);
  html += exTextSec(card, 'firstJobs', 'First jobs', true);
  html += '<p class="ex-foot">Checked ' + esc(exDateLabel(card.verified)) + '.';
  if (exAdmin()) html += ' <button type="button" class="ex-link" data-ex-checked="1">Mark checked today</button>';
  html += '</p><div class="ex-acts">';
  html +=
    '<button type="button" class="btn" data-ex-dest="' +
    ix +
    '">' +
    (S.pw.dest === ix ? 'This is your destination' : 'Make this my destination') +
    '</button><button type="button" class="btn g" data-ex-book="' +
    ix +
    '">' +
    (isConsidering(ix) ? 'Remove from considering' : 'Add to considering') +
    '</button><button type="button" class="btn g" data-ex-flag="' +
    ix +
    '">Flag an error</button></div>';
  if (ui.form === 'flag') html += exFlagForm();
  if (exAdmin()) {
    if (ui.kill === 'card') {
      html +=
        '<div class="ex-kill"><p>Delete this card for good?</p><div class="ex-acts"><button type="button" class="btn" data-ex-kill-yes="card">Delete for good</button><button type="button" class="btn g" data-ex-kill="">Keep</button></div></div>';
    } else {
      html += '<button type="button" class="ex-link" data-ex-kill="card">Delete this card</button>';
    }
  }
  html += '</article></div>';
  return html;
}

function exDateLabel(iso) {
  var d;
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  if (!iso) return 'date not recorded';
  d = new Date(iso);
  if (isNaN(d.getTime())) {
    if (iso === '2026-09-07') return '7 September 2026';
    return iso;
  }
  return d.getUTCDate() + ' ' + months[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
}

function exFactsHtml(card) {
  var keys = [
    ['entryFrom', 'Entry from'],
    ['timeTakes', 'Time it takes'],
    ['licence', 'Licence or registration']
  ];
  var html = '<div class="ex-facts">';
  var i;
  var ui = exEnsure();
  for (i = 0; i < keys.length; i++) {
    html += '<div class="ex-fact' + (card[keys[i][0]] ? '' : ' is-empty') + '"><b>' + esc(keys[i][1]) + '</b>';
    if (ui.form === keys[i][0]) {
      html +=
        '<input id="ex-fact-v" type="text" value="' +
        esc(card[keys[i][0]] || '') +
        '"/><div class="ex-acts"><button type="button" class="btn" data-ex-fact-save="' +
        keys[i][0] +
        '">Save</button><button type="button" class="btn g" data-ex-form="">Cancel</button></div>';
    } else {
      html += '<p>' + esc(card[keys[i][0]] || 'Not recorded yet') + '</p>';
      if (exStaff()) {
        html +=
          '<button type="button" class="ex-link" data-ex-form="' +
          keys[i][0] +
          '">' +
          (card[keys[i][0]] ? 'Edit' : 'Add') +
          '</button>';
      }
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function exSubjGroup(card, key, title, bank, raw) {
  var rec = exParseSubjects(raw || '', bank);
  var held = exStudentNames();
  var html = '';
  var i;
  var state;
  if (exPendingField(card.id, key)) state = 'Edit pending';
  else if (!rec.length) state = 'Not recorded';
  else state = 'you have ' + rec.filter(function (n) { return exHasName(held, n); }).length + ' of ' + rec.length;
  html = '<p class="ex-body"></p><div class="ex-subjs">';
  for (i = 0; i < rec.length; i++) {
    html +=
      '<span class="ex-subj' +
      (exHasName(held, rec[i]) ? ' is-have' : '') +
      '">' +
      esc(rec[i]) +
      '</span>';
  }
  html += '</div>';
  if (exStaff()) {
    html +=
      '<div class="ex-edit"><label for="ex-' +
      key +
      '">Subjects</label><textarea id="ex-' +
      key +
      '">' +
      esc(raw || '') +
      '</textarea><button type="button" class="btn g" data-ex-text-save="' +
      key +
      '">' +
      (raw ? 'Save' : 'Add') +
      '</button></div>';
  }
  return exAcc(key, title, state, html);
}

function exSubjectsHtml(card, sm) {
  return (
    exSubjGroup(card, 'csec', 'Recommended CSEC', EX_CXC, card.csec) +
    exSubjGroup(card, 'cape', 'Recommended CAPE', EX_CAPE, card.cape) +
    exSubjGroup(card, 'helpful', 'Helpful subjects', EX_CXC.concat(EX_CAPE), card.helpful)
  );
}

function exRouteSummary(r) {
  return (r.steps || []).join(' → ') + (r.note ? ' · ' + r.note : '');
}

function exRoutesHtml(card) {
  var ui = exEnsure();
  var html = '';
  var i;
  var r;
  var state;
  if (exPendingField(card.id, 'routes')) state = 'Edit pending';
  else if (!card.routes || !card.routes.length) state = 'Not recorded';
  else state = String(card.routes.length);
  if (card.routes) {
    for (i = 0; i < card.routes.length; i++) {
      r = card.routes[i];
      html += '<div class="ex-steps">';
      (r.steps || []).forEach(function (s, n) {
        if (n) html += '<span class="ex-arrow" aria-hidden="true">→</span>';
        html += '<span class="ex-step">' + esc(s) + '</span>';
      });
      html += '</div>';
      if (r.note) html += '<p class="ex-rnote">' + esc(r.note) + '</p>';
      if (exStaff()) {
        html +=
          '<button type="button" class="ex-link" data-ex-route-edit="' +
          i +
          '">Edit</button> <button type="button" class="ex-link" data-ex-route-del="' +
          i +
          '">Delete</button>';
      }
    }
  }
  html += '<p class="ex-note">From the guide</p><p class="ex-body">' + esc(card.routeGuide || 'Not recorded yet.') + '</p>';
  if (exStaff()) {
    html +=
      '<button type="button" class="ex-link" data-ex-form="routeGuide">Edit guide text</button> <button type="button" class="ex-link" data-ex-form="route-add">Add a route</button>';
  }
  if (ui.form === 'routeGuide') {
    html +=
      '<div class="ex-edit"><textarea id="ex-route-guide">' +
      esc(card.routeGuide || '') +
      '</textarea><button type="button" class="btn" data-ex-text-save="routeGuide">Save</button></div>';
  }
  if (ui.form === 'route-add' || (ui.form && String(ui.form).indexOf('route-edit:') === 0)) {
    html += exRouteForm(card);
  }
  html += '<button type="button" class="ex-link" data-ex-sub="routes">Compare UG, GOAL and the rest</button>';
  return exAcc('routes', 'Routes in Guyana', state, html);
}

function exRouteForm(card) {
  var ui = exEnsure();
  var ix = ui.form === 'route-add' ? -1 : parseInt(String(ui.form).slice(11), 10);
  var r = ix >= 0 && card.routes[ix] ? card.routes[ix] : { steps: ['', ''], note: '' };
  return (
    '<div class="ex-edit"><label>Steps, separated by /</label><p class="ex-help">At least two steps.</p><input id="ex-route-steps" type="text" value="' +
    esc((r.steps || []).join(' / ')) +
    '"/><label>Note</label><input id="ex-route-note" type="text" value="' +
    esc(r.note || '') +
    '"/><p class="ex-err" id="ex-route-err"></p><button type="button" class="btn" data-ex-route-save="' +
    ix +
    '">Save route</button></div>'
  );
}

function exStudyHtml(card) {
  var html = '';
  var i;
  var row;
  var noCourse = 0;
  var state;
  if (card.study) {
    for (i = 0; i < card.study.length; i++) if (!card.study[i].course) noCourse += 1;
  }
  if (exPendingField(card.id, 'study')) state = 'Edit pending';
  else if (!card.study || !card.study.length) state = 'Not recorded';
  else state = noCourse ? card.study.length + ' · ' + noCourse + ' without a course' : String(card.study.length);
  if (card.study) {
    for (i = 0; i < card.study.length; i++) {
      row = card.study[i];
      html += '<div class="ex-study"><b>' + esc(row.institution) + '</b><p class="' +
        (row.course ? 'ex-body' : 'ex-body ex-amber') +
        '">' +
        esc(row.course || 'Course not recorded') +
        '</p>';
      if (row.links && row.links.length) {
        html += '<ul class="ex-links">';
        row.links.forEach(function (l) {
          html += '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label || l.url) + '</a></li>';
        });
        html += '</ul>';
      }
      if (exStaff()) {
        html +=
          '<button type="button" class="ex-link" data-ex-study-edit="' +
          i +
          '">Edit</button> <button type="button" class="ex-link" data-ex-study-del="' +
          i +
          '">Delete</button>';
      }
      html += '</div>';
    }
  }
  if (card.otherLinks && card.otherLinks.length) {
    html += '<p class="ex-note">Other links</p><ul class="ex-links">';
    card.otherLinks.forEach(function (l) {
      html += '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label || l.url) + '</a></li>';
    });
    html += '</ul>';
  }
  if (exStaff()) html += '<button type="button" class="ex-link" data-ex-form="study-add">Add an institution</button>';
  if (exEnsure().form === 'study-add' || (exEnsure().form && String(exEnsure().form).indexOf('study-edit:') === 0)) {
    html += exStudyForm(card);
  }
  return exAcc('study', 'Where you study it', state, html);
}

function exStudyForm(card) {
  var ui = exEnsure();
  var ix = ui.form === 'study-add' ? -1 : parseInt(String(ui.form).slice(11), 10);
  var r = ix >= 0 && card.study[ix] ? card.study[ix] : { institution: '', course: '', links: [] };
  var links = (r.links || []).map(function (l) { return (l.label || '') + ' | ' + (l.url || ''); }).join('\n');
  return (
    '<div class="ex-edit"><label>Institution</label><input id="ex-study-n" type="text" value="' +
    esc(r.institution || '') +
    '"/><label>Course or degree</label><input id="ex-study-c" type="text" value="' +
    esc(r.course || '') +
    '"/><label>Links, one per line as label | url</label><textarea id="ex-study-l">' +
    esc(links) +
    '</textarea><p class="ex-err" id="ex-study-err"></p><button type="button" class="btn" data-ex-study-save="' +
    ix +
    '">Save</button></div>'
  );
}

function exTextSec(card, key, title, required) {
  var state;
  var body;
  if (exPendingField(card.id, key)) state = 'Edit pending';
  else if (!card[key]) state = 'Not recorded';
  else state = 'Recorded';
  body = '<p class="ex-body">' + esc(card[key] || 'Not recorded yet.') + '</p>';
  if (exStaff()) {
    if (exEnsure().form === key) {
      body +=
        '<div class="ex-edit"><textarea id="ex-text">' +
        esc(card[key] || '') +
        '</textarea><button type="button" class="btn" data-ex-text-save="' +
        key +
        '">Save</button></div>';
    } else {
      body += '<button type="button" class="ex-link" data-ex-form="' + key + '">' + (card[key] ? 'Edit' : 'Add') + '</button>';
    }
  }
  return exAcc(key, title, state, body);
}

function exDetailsForm(card) {
  var ui = exEnsure();
  var fields = ui.edit && ui.edit.fields ? ui.edit.fields : card.fields;
  var html = '<div class="ex-edit"><label for="ex-title">Title</label><input id="ex-title" type="text" value="' +
    esc(card.title) +
    '"/><label>Status</label><select id="ex-status">';
  var marks = ['confirmed', 'varies', 'portfolio', 'unmarked'];
  var i;
  if (!ui.edit) ui.edit = { fields: (card.fields || []).slice() };
  for (i = 0; i < marks.length; i++) {
    html +=
      '<option value="' +
      marks[i] +
      '"' +
      (card.status === marks[i] ? ' selected' : '') +
      '>' +
      marks[i] +
      '</option>';
  }
  html += '</select><label>Fields</label><div>';
  for (i = 0; i < FIELDS.length; i++) {
    html +=
      '<button type="button" class="ex-pill' +
      (fields.indexOf(FIELDS[i].k) !== -1 ? ' is-confirmed' : '') +
      '" data-ex-togfield="' +
      esc(FIELDS[i].k) +
      '">' +
      esc(FIELDS[i].n) +
      '</button> ';
  }
  html +=
    '</div><p class="ex-err" id="ex-details-err"></p><div class="ex-acts"><button type="button" class="btn" data-ex-details-save="1">Save</button><button type="button" class="btn g" data-ex-form="">Cancel</button></div></div>';
  return html;
}

function exFlagForm() {
  return (
    '<div class="ex-edit"><label for="ex-flag">What is wrong</label><textarea id="ex-flag">' +
    esc(exEnsure().flagNote || '') +
    '</textarea><div class="ex-acts"><button type="button" class="btn" data-ex-flag-send="1">Send flag</button><button type="button" class="btn g" data-ex-form="">Cancel</button></div></div>'
  );
}

function renderExRoutes() {
  var html = '<div class="ex-col">' + exBack('Back to Explore', '') + renderPwSubtabs();
  var i;
  html += '<section class="ex-ref ex-sec"><h2>Choosing UG, GOAL or another route</h2>';
  html += '<p class="ex-note">Best means the most direct recognised qualification for the intended occupation, not the programme with the most impressive title.</p>';
  for (i = 0; i < EX_REF.length; i++) {
    html +=
      '<div class="ex-ref-card"><h3>' +
      esc(EX_REF[i].n) +
      '</h3><p class="ex-body"><b>Use it when</b> ' +
      esc(EX_REF[i].when) +
      '</p><p class="ex-body"><b>What to check yourself</b> ' +
      esc(EX_REF[i].check) +
      '</p>';
    if (EX_REF[i].url) {
      html +=
        '<p><a href="' +
        esc(EX_REF[i].url) +
        '" target="_blank" rel="noopener">' +
        esc(EX_REF[i].lab) +
        '</a></p>';
    }
    html += '</div>';
  }
  html +=
    '<p class="ex-note">GOAL is a scholarship pathway, not the awarding university, and must not be attached to a profile just because it offers a broadly related degree. For a regulated career the relevant Guyanese council must recognise the qualification, and the live institutional page overrides the guide.</p></section></div>';
  return html;
}

function renderExQueue() {
  var st = exStore();
  var rows = st ? st.careerQueue : S.pw.queue || [];
  var html = '<div class="ex-col">' + exBack('Back to Explore', '') + renderPwSubtabs();
  var i;
  var row;
  var pending = rows.filter(function (r) { return !r.status || r.status === 'pending'; });
  html += '<section class="ex-sec"><h2>Review queue</h2><p class="ex-note">' +
    pending.length +
    ' waiting. Structured career-card items, including cards that still miss required facts.</p>';
  if (exAdmin()) {
    html += '<p class="ex-note">Priority: cards with the most required fields still empty.</p>';
    html += exPriorityList();
  }
  if (!pending.length) html += '<p class="ex-note">Nothing waiting.</p>';
  for (i = 0; i < rows.length; i++) {
    row = rows[i];
    if (row.status && row.status !== 'pending') continue;
    html +=
      '<article class="ex-qitem"><p class="ex-pill">' +
      esc(row.type || row.kind || 'edit') +
      '</p><h3>' +
      esc(row.career || row.careerId || 'Career') +
      '</h3><p class="ex-meta">' +
      esc(row.who || '') +
      (row.field ? ' · ' + row.field : '') +
      '</p><pre>' +
      esc(row.summary || row.text || exDiff(row.before, row.after)) +
      '</pre>';
    if (exAdmin()) {
      html +=
        '<div class="ex-acts"><button type="button" class="btn" data-ex-approve="' +
        esc(row.id || String(i)) +
        '">Approve</button><button type="button" class="btn g" data-ex-reject="' +
        esc(row.id || String(i)) +
        '">Reject</button></div>';
    } else {
      html += '<p class="ex-note">Waiting for an admin.</p>';
    }
    html += '</article>';
  }
  html += '</section></div>';
  return html;
}

function exPriorityList() {
  var ranks = [];
  var i;
  var card;
  var miss;
  for (i = 0; i < CAREERS.length; i++) {
    card = exCard(i);
    if (!card) continue;
    miss = exMissing(card);
    if (miss.length) ranks.push({ ix: i, n: miss.length, title: card.title, miss: miss });
  }
  ranks.sort(function (a, b) { return b.n - a.n; });
  ranks = ranks.slice(0, 8);
  if (!ranks.length) return '';
  return (
    '<div class="ex-list">' +
    ranks
      .map(function (r) {
        return (
          '<button type="button" class="ex-row" data-ex-open="' +
          r.ix +
          '"><div class="minw"><h3>' +
          esc(r.title) +
          '</h3><p class="ex-meta">' +
          r.n +
          ' missing: ' +
          esc(r.miss.join(', ')) +
          '</p></div></button>'
        );
      })
      .join('') +
    '</div>'
  );
}

function exDiff(before, after) {
  if (after && after.steps) return exRouteSummary(after);
  if (typeof after === 'string') return String(before || '(empty)') + '\n→\n' + after;
  try {
    return JSON.stringify(before || {}, null, 2) + '\n→\n' + JSON.stringify(after || {}, null, 2);
  } catch (e) {
    return 'Changed';
  }
}

function renderExAdd() {
  var d = exEnsure().draft || exEmptyDraft();
  var html = '<div class="ex-col">' + exBack('Back to Explore', '') + renderPwSubtabs();
  var i;
  html += '<form class="ex-form" style="padding:16px" onsubmit="return false"><h2>Add a career</h2>';
  if (exEnsure().formErr) html += '<p class="ex-err">' + esc(exEnsure().formErr) + '</p>';
  html += '<label for="ex-add-title">Title</label><input id="ex-add-title" type="text" value="' + esc(d.title) + '"/>';
  html += '<label>Status</label><select id="ex-add-status">';
  ['confirmed', 'varies', 'portfolio', 'unmarked'].forEach(function (s) {
    html += '<option value="' + s + '"' + (d.status === s ? ' selected' : '') + '>' + s + '</option>';
  });
  html += '</select><label>Fields</label><div>';
  for (i = 0; i < FIELDS.length; i++) {
    html +=
      '<button type="button" class="ex-pill' +
      (d.fields.indexOf(FIELDS[i].k) !== -1 ? ' is-confirmed' : '') +
      '" data-ex-addfield="' +
      esc(FIELDS[i].k) +
      '">' +
      esc(FIELDS[i].n) +
      '</button> ';
  }
  html +=
    '</div><label>Entry from</label><input id="ex-add-entry" type="text" value="' +
    esc(d.entryFrom) +
    '"/><label>Time it takes</label><input id="ex-add-time" type="text" value="' +
    esc(d.timeTakes) +
    '"/><label>Licence or registration</label><input id="ex-add-lic" type="text" value="' +
    esc(d.licence) +
    '"/><label>In Forms 1 to 3</label><textarea id="ex-add-f13">' +
    esc(d.forms13) +
    '</textarea><label>First jobs</label><textarea id="ex-add-jobs">' +
    esc(d.firstJobs) +
    '</textarea><label>Route steps, separated by /</label><input id="ex-add-route" type="text" value="' +
    esc((d.routes[0] && d.routes[0].steps.join(' / ')) || '') +
    '"/><label>Institution</label><input id="ex-add-inst" type="text" value="' +
    esc((d.study[0] && d.study[0].institution) || '') +
    '"/><label>Course</label><input id="ex-add-course" type="text" value="' +
    esc((d.study[0] && d.study[0].course) || '') +
    '"/><button type="button" class="btn" data-ex-add-save="1">Save card</button></form></div>';
  return html;
}

function exEmptyDraft() {
  return {
    title: '',
    status: 'unmarked',
    fields: [],
    entryFrom: '',
    timeTakes: '',
    licence: '',
    forms13: '',
    firstJobs: '',
    routes: [{ steps: [], note: '' }],
    study: [{ institution: '', course: '', links: [] }]
  };
}

function exReadAdd() {
  var d = exEnsure().draft || exEmptyDraft();
  var el = function (id) { return document.getElementById(id); };
  if (el('ex-add-title')) d.title = el('ex-add-title').value.replace(/^\s+|\s+$/g, '');
  if (el('ex-add-status')) d.status = el('ex-add-status').value;
  if (el('ex-add-entry')) d.entryFrom = el('ex-add-entry').value.replace(/^\s+|\s+$/g, '');
  if (el('ex-add-time')) d.timeTakes = el('ex-add-time').value.replace(/^\s+|\s+$/g, '');
  if (el('ex-add-lic')) d.licence = el('ex-add-lic').value.replace(/^\s+|\s+$/g, '');
  if (el('ex-add-f13')) d.forms13 = el('ex-add-f13').value.replace(/^\s+|\s+$/g, '');
  if (el('ex-add-jobs')) d.firstJobs = el('ex-add-jobs').value.replace(/^\s+|\s+$/g, '');
  if (el('ex-add-route')) {
    d.routes = [{ steps: el('ex-add-route').value.split('/').map(function (s) { return s.replace(/^\s+|\s+$/g, ''); }).filter(Boolean), note: '' }];
  }
  if (el('ex-add-inst') || el('ex-add-course')) {
    d.study = [{ institution: (el('ex-add-inst') && el('ex-add-inst').value) || '', course: (el('ex-add-course') && el('ex-add-course').value) || '', links: [] }];
  }
  exEnsure().draft = d;
  return d;
}

function exValAdd(d) {
  var miss = [];
  if (!d.title) return 'The card needs a title';
  if (!d.fields.length) return 'Pick at least one field';
  if (!d.entryFrom) miss.push('Entry from');
  if (!d.timeTakes) miss.push('Time it takes');
  if (!d.licence) miss.push('Licence or registration');
  if (!d.forms13) miss.push('In Forms 1 to 3');
  if (!d.firstJobs) miss.push('First jobs');
  if (!d.routes[0] || d.routes[0].steps.length < 2) return 'A route needs at least two steps.';
  if (!d.study[0] || !d.study[0].institution) return 'Name the institution first';
  if (miss.length) return 'Still missing: ' + miss.join(', ');
  return '';
}

function toggleDestination(i) {
  if (S.pw.dest === i) {
    S.pw.dest = -1;
    return;
  }
  setDestination(i);
}

function exMonthToday() {
  var d = new Date();
  var m = d.getMonth() + 1;
  var day = d.getDate();
  return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
}

function exHandleClick(e, t) {
  var btn;
  var ui;
  var card;
  var ix;
  var val;
  var err;
  var st;
  var i;
  var row;
  var steps;
  var next;
  var d;
  if (S.view !== 'pathway') return false;
  ui = exEnsure();
  btn = closestEl(t, '[data-ex-sub]');
  if (btn) {
    S.pw.tab = 'explore';
    S.pw.sub = btn.getAttribute('data-ex-sub') || '';
    if (!S.pw.sub) S.pw.field = S.pw.field;
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-field]');
  if (btn) {
    S.pw.field = btn.getAttribute('data-ex-field');
    S.pw.sub = 'field';
    S.pw.tab = 'explore';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-clearq]');
  if (btn) {
    S.pw.q = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-all]');
  if (btn) {
    ui.listAll[btn.getAttribute('data-ex-all')] = true;
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-book]');
  if (btn) {
    e.stopPropagation();
    toggleConsidering(parseInt(btn.getAttribute('data-ex-book'), 10));
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-open]');
  if (btn) {
    S.pw.cardIx = parseInt(btn.getAttribute('data-ex-open'), 10);
    S.pw.sub = 'card';
    S.pw.tab = 'explore';
    ui.open = '';
    ui.form = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-acc]');
  if (btn) {
    val = btn.getAttribute('data-ex-acc');
    ui.open = ui.open === val ? '' : val;
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-form]');
  if (btn) {
    ui.form = btn.getAttribute('data-ex-form') || '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-dest]');
  if (btn) {
    ix = parseInt(btn.getAttribute('data-ex-dest'), 10);
    toggleDestination(ix);
    toast(S.pw.dest === ix ? 'Destination set.' : 'Destination cleared.');
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-flag]');
  if (btn) {
    ui.form = 'flag';
    ui.flagNote = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-flag-send]');
  if (btn) {
    val = (document.getElementById('ex-flag') && document.getElementById('ex-flag').value) || '';
    card = exCard(S.pw.cardIx);
    exQueuePush({
      type: 'flag',
      careerId: card ? card.id : '',
      career: card ? card.title : '',
      who: exWho(),
      role: S.role,
      summary: val || 'Flagged an error',
      text: val,
      payload: { ix: S.pw.cardIx }
    });
    ui.form = '';
    toast('Flag sent for a check.');
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-checked]');
  if (btn) {
    card = exCard(S.pw.cardIx);
    if (card) exApplyField(card.id, 'verified', exMonthToday());
    toast('Marked checked today.');
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-fact-save]');
  if (btn) {
    card = exCard(S.pw.cardIx);
    val = (document.getElementById('ex-fact-v') && document.getElementById('ex-fact-v').value) || '';
    if (card) exSaveEdit(card.id, btn.getAttribute('data-ex-fact-save'), val.replace(/^\s+|\s+$/g, ''), val, card[btn.getAttribute('data-ex-fact-save')]);
    ui.form = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-text-save]');
  if (btn) {
    card = exCard(S.pw.cardIx);
    val = (document.getElementById('ex-' + btn.getAttribute('data-ex-text-save')) || document.getElementById('ex-text') || document.getElementById('ex-route-guide'));
    val = val ? val.value.replace(/^\s+|\s+$/g, '') : '';
    if (card) exSaveEdit(card.id, btn.getAttribute('data-ex-text-save'), val, val.slice(0, 160), card[btn.getAttribute('data-ex-text-save')]);
    ui.form = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-guide-save]');
  if (btn) {
    val = (document.getElementById('ex-guide-t') && document.getElementById('ex-guide-t').value) || '';
    exSaveEdit('guide:' + S.pw.field, btn.getAttribute('data-ex-guide-save'), val.replace(/^\s+|\s+$/g, ''), val.slice(0, 160), exGuide(S.pw.field)[btn.getAttribute('data-ex-guide-save')]);
    ui.form = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-togfield]');
  if (btn) {
    card = exCard(S.pw.cardIx);
    if (!card) return true;
    if (!ui.edit) ui.edit = { fields: card.fields.slice() };
    i = ui.edit.fields.indexOf(btn.getAttribute('data-ex-togfield'));
    if (i === -1) ui.edit.fields.push(btn.getAttribute('data-ex-togfield'));
    else ui.edit.fields.splice(i, 1);
    card.fields = ui.edit.fields;
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-details-save]');
  if (btn) {
    card = exCard(S.pw.cardIx);
    val = (document.getElementById('ex-title') && document.getElementById('ex-title').value) || '';
    val = val.replace(/^\s+|\s+$/g, '');
    if (!val) {
      toast('The card needs a title');
      return true;
    }
    next = ui.edit && ui.edit.fields ? ui.edit.fields.slice() : card.fields.slice();
    if (!next.length) {
      toast('Pick at least one field');
      return true;
    }
    exSaveEdit(
      card.id,
      'details',
      {
        title: val,
        status: (document.getElementById('ex-status') && document.getElementById('ex-status').value) || card.status,
        fields: next
      },
      val,
      { title: card.title, status: card.status, fields: card.fields }
    );
    ui.form = '';
    ui.edit = null;
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-route-edit]');
  if (btn) {
    ui.form = 'route-edit:' + btn.getAttribute('data-ex-route-edit');
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-route-del]');
  if (btn) {
    card = exCard(S.pw.cardIx);
    next = (card.routes || []).slice();
    i = parseInt(btn.getAttribute('data-ex-route-del'), 10);
    if (ui.kill === 'route:' + i) {
      next.splice(i, 1);
      exSaveEdit(card.id, 'routes', next, next.map(exRouteSummary).join('\n'), card.routes);
      ui.kill = '';
    } else {
      ui.kill = 'route:' + i;
    }
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-route-save]');
  if (btn) {
    card = exCard(S.pw.cardIx);
    steps = ((document.getElementById('ex-route-steps') && document.getElementById('ex-route-steps').value) || '')
      .split('/')
      .map(function (s) { return s.replace(/^\s+|\s+$/g, ''); })
      .filter(Boolean);
    if (steps.length < 2) {
      toast('A route needs at least two steps.');
      return true;
    }
    row = { steps: steps, note: (document.getElementById('ex-route-note') && document.getElementById('ex-route-note').value) || '' };
    next = (card.routes || []).slice();
    ix = parseInt(btn.getAttribute('data-ex-route-save'), 10);
    if (ix >= 0) next[ix] = row;
    else next.push(row);
    exSaveEdit(card.id, 'routes', next, exRouteSummary(row), card.routes);
    ui.form = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-study-edit]');
  if (btn) {
    ui.form = 'study-edit:' + btn.getAttribute('data-ex-study-edit');
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-study-del]');
  if (btn) {
    card = exCard(S.pw.cardIx);
    next = (card.study || []).slice();
    i = parseInt(btn.getAttribute('data-ex-study-del'), 10);
    if (ui.kill === 'study:' + i) {
      next.splice(i, 1);
      exSaveEdit(card.id, 'study', next, (next[0] && next[0].institution) || 'Removed', card.study);
      ui.kill = '';
    } else ui.kill = 'study:' + i;
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-study-save]');
  if (btn) {
    card = exCard(S.pw.cardIx);
    val = (document.getElementById('ex-study-n') && document.getElementById('ex-study-n').value) || '';
    val = val.replace(/^\s+|\s+$/g, '');
    if (!val) {
      toast('Name the institution first');
      return true;
    }
    row = {
      institution: val,
      course: ((document.getElementById('ex-study-c') && document.getElementById('ex-study-c').value) || '').replace(/^\s+|\s+$/g, ''),
      links: ((document.getElementById('ex-study-l') && document.getElementById('ex-study-l').value) || '')
        .split('\n')
        .map(function (line) {
          var p = line.split('|');
          if (p.length < 2) return null;
          return { label: p[0].replace(/^\s+|\s+$/g, ''), url: p.slice(1).join('|').replace(/^\s+|\s+$/g, '') };
        })
        .filter(Boolean)
    };
    next = (card.study || []).slice();
    ix = parseInt(btn.getAttribute('data-ex-study-save'), 10);
    if (ix >= 0) next[ix] = row;
    else next.push(row);
    exSaveEdit(card.id, 'study', next, row.institution + (row.course ? ' · ' + row.course : ''), card.study);
    ui.form = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-addfield]');
  if (btn) {
    exReadAdd();
    i = ui.draft.fields.indexOf(btn.getAttribute('data-ex-addfield'));
    if (i === -1) ui.draft.fields.push(btn.getAttribute('data-ex-addfield'));
    else ui.draft.fields.splice(i, 1);
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-add-save]');
  if (btn) {
    d = exReadAdd();
    err = exValAdd(d);
    if (err) {
      ui.formErr = err;
      toast(err);
      render();
      return true;
    }
    row = {
      id: 'draft-' + Date.now(),
      title: d.title,
      status: d.status,
      fields: d.fields.slice(),
      entryFrom: d.entryFrom,
      timeTakes: d.timeTakes,
      licence: d.licence,
      routes: d.routes,
      routeGuide: '',
      study: d.study,
      otherLinks: [],
      forms13: d.forms13,
      development: '',
      gate: '',
      firstJobs: d.firstJobs,
      csec: '',
      cape: '',
      helpful: '',
      verified: exMonthToday(),
      published: exAdmin()
    };
    if (exAdmin()) {
      if (typeof EX_SEED !== 'undefined') {
        row.ix = EX_SEED.careers.length;
        EX_SEED.careers.push(row);
      }
      CAREERS.push({
        id: row.id,
        n: row.title,
        s: row.status,
        b: row.fields.slice(),
        f13: row.forms13,
        csec: '',
        cape: '',
        route: '',
        gate: '',
        dev: '',
        jobs: row.firstJobs,
        steam: '',
        src: '',
        tr: []
      });
      toast('Published.');
    } else {
      exQueuePush({
        type: 'draft',
        careerId: row.id,
        career: row.title,
        who: exWho(),
        role: S.role,
        summary: row.title + ' · draft',
        payload: row
      });
      toast('Saved as a draft for a check.');
    }
    ui.draft = null;
    ui.formErr = '';
    S.pw.sub = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-approve]');
  if (btn && exAdmin()) {
    exApprove(btn.getAttribute('data-ex-approve'));
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-reject]');
  if (btn && exAdmin()) {
    exReject(btn.getAttribute('data-ex-reject'));
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-kill]');
  if (btn) {
    ui.kill = btn.getAttribute('data-ex-kill') || '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-ex-kill-yes]');
  if (btn && exAdmin()) {
    card = exCard(S.pw.cardIx);
    if (card) {
      st = exStore();
      if (st) {
        st.careerDeletes = st.careerDeletes || [];
        st.careerDeletes.push(card.id);
        exPersist(st);
      }
      if (CAREERS[card.ix]) CAREERS[card.ix].n = CAREERS[card.ix].n;
    }
    ui.kill = '';
    S.pw.sub = '';
    toast('Card deleted.');
    render();
    return true;
  }
  return false;
}

function exApprove(id) {
  var st = exStore();
  var i;
  var row;
  if (!st) return;
  for (i = 0; i < st.careerQueue.length; i++) {
    if (String(st.careerQueue[i].id) === String(id) || String(i) === String(id)) {
      row = st.careerQueue[i];
      break;
    }
  }
  if (!row) return;
  if (row.type === 'draft' && row.payload) {
    row.payload.published = true;
    row.payload.ix = EX_SEED.careers.length;
    EX_SEED.careers.push(row.payload);
    CAREERS.push({
      id: row.payload.id,
      n: row.payload.title,
      s: row.payload.status,
      b: row.payload.fields.slice(),
      f13: row.payload.forms13,
      csec: '',
      cape: '',
      route: '',
      gate: '',
      dev: '',
      jobs: row.payload.firstJobs,
      steam: '',
      src: '',
      tr: []
    });
  } else if (row.payload && row.payload.field) {
    if (row.payload.field === 'details' && row.payload.value) {
      exApplyField(row.careerId, 'title', row.payload.value.title);
      exApplyField(row.careerId, 'status', row.payload.value.status);
      exApplyField(row.careerId, 'fields', row.payload.value.fields);
    } else {
      exApplyField(row.careerId, row.payload.field, row.payload.value);
    }
  } else if (row.field && row.after !== undefined) {
    if (row.field === 'details' && row.after) {
      exApplyField(row.careerId, 'title', row.after.title);
      exApplyField(row.careerId, 'status', row.after.status);
      exApplyField(row.careerId, 'fields', row.after.fields);
    } else {
      exApplyField(row.careerId, row.field, row.after);
    }
  }
  row.status = 'approved';
  exPersist(st);
  toast('Approved.');
}

function exReject(id) {
  var st = exStore();
  var i;
  if (!st) return;
  for (i = 0; i < st.careerQueue.length; i++) {
    if (String(st.careerQueue[i].id) === String(id) || String(i) === String(id)) {
      st.careerQueue[i].status = 'rejected';
      break;
    }
  }
  exPersist(st);
  toast('Rejected.');
}

function exHandleInput(e) {
  if (!e.target) return false;
  if (e.target.id === 'ex-q' && S.view === 'pathway') {
    S.pw.q = e.target.value;
    S.pw.qPos = e.target.selectionStart;
    S.pw.focusExQ = true;
    render();
    return true;
  }
  return false;
}

function exAfterPaint() {
  var inp;
  if (S.pw && S.pw.focusExQ) {
    inp = document.getElementById('ex-q');
    if (inp) {
      inp.focus();
      if (typeof inp.setSelectionRange === 'function') {
        inp.setSelectionRange(S.pw.qPos || inp.value.length, S.pw.qPos || inp.value.length);
      }
    }
    S.pw.focusExQ = false;
  }
}
