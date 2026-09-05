/* Next Step Guyana app core. ES5 only. No storage. No em/en dashes. */
var NAV = [];
var S = {
  view: 'feed',
  filter: 'all',
  query: '',
  ctype: 'question',
  anon: true,
  draft: '',
  draftCat: '',
  sessionStage: '',
  onboarded: false,
  stage: null,
  form: '',
  region: '',
  goal: '',
  priority: '',
  blocker: '',
  archetype: '',
  taken: [],
  following: [],
  saved: [],
  inspired: [],
  booked: [],
  waitlist: [],
  slots: {},
  oneToOne: false,
  unread: 0,
  recent: [],
  setupStep: 0,
  setupDraft: {},
  setupReason: '',
  pendingAction: null,
  hideJoinCard: false,
  replyTimer: null
};

var DUP_MAP = [
  { keys: ['biology', 'chemistry', 'medicine', 'nursing'], id: 'q-bio' },
  { keys: ['cape', 'tvet', 'gtti', 'electrical', 'trade'], id: 'q-cape' },
  { keys: ['sport', 'coach', 'academy', 'lethem'], id: 'q-lethem' },
  { keys: ['media', 'film', 'camera'], id: 'q-media' }
];

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function byId(id) {
  return document.getElementById(id);
}

function toast(msg) {
  var el = byId('toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(function () {
    el.hidden = true;
  }, 3200);
}

function stageIndex(key) {
  var i;
  for (i = 0; i < STAGES.length; i++) {
    if (STAGES[i].key === key) return i;
  }
  return 0;
}

function stageByKey(key) {
  return STAGES[stageIndex(key)] || STAGES[0];
}

function daysUntil(iso) {
  if (!iso) return null;
  var due = new Date(iso + 'T12:00:00');
  var now = new Date();
  var ms = due.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}

function author(id) {
  return AUTHORS[id] || { name: id, init: '?', role: '', pos: '', system: true };
}

function isFollowing(id) {
  return S.following.indexOf(id) !== -1;
}

function toggleFollow(id) {
  var i = S.following.indexOf(id);
  if (i === -1) {
    S.following.push(id);
    toast('Following ' + author(id).name + '. New posts and nodes reach your feed.');
  } else {
    S.following.splice(i, 1);
    toast('Unfollowed ' + author(id).name + '.');
  }
  paint();
  render();
}

function requirePathway(action) {
  if (S.onboarded) return false;
  S.pendingAction = action || null;
  S.setupReason =
    (action && action.reason) || 'We need your form to hold you a place.';
  S.setupDraft = {};
  S.setupStep = 0;
  go({ t: 'setup', id: '0' });
  return true;
}

function runPendingAction(action) {
  if (!action) return;
  if (action.type === 'book') {
    go({ t: 'book', id: action.id });
    toast('Pathway built. Continuing your booking.');
    return;
  }
  if (action.type === 'follow') {
    S.view = S.view || 'feed';
    render();
    if (S.following.indexOf(action.id) === -1) {
      S.following.push(action.id);
      toast('Pathway built. Now following ' + author(action.id).name + '.');
      paint();
      render();
    } else {
      toast('Pathway built.');
    }
    return;
  }
  if (action.type === 'reply') {
    go({ t: 'thread', id: action.id });
    postThreadReply(action.id, action.text || '', true);
    return;
  }
  S.view = 'pathway';
  render();
  toast('Pathway built. Your timeline starts at ' + S.form + '.');
}

function renderJoinCard() {
  if (S.onboarded || S.hideJoinCard) return '';
  return (
    '<article class="feed-card kind-join">' +
    '<div class="join-body">' +
    '<p class="join-lead">You\'re seeing posts for every form. Answer six questions and see only what applies to yours.</p>' +
    '<div class="card-actions">' +
    '<button type="button" class="btn" data-open="setup" data-id="0">Build my pathway</button>' +
    '<button type="button" class="btn quiet" data-dismiss-join="1">Not now</button>' +
    '</div></div></article>'
  );
}

function isSaved(id) {
  return S.saved.indexOf(id) !== -1;
}

function toggleSave(id) {
  var i = S.saved.indexOf(id);
  if (i === -1) {
    S.saved.push(id);
    toast('Saved for later.');
  } else {
    S.saved.splice(i, 1);
    toast('Removed from saved.');
  }
  paint();
  render();
}

function isInspired(id) {
  return S.inspired.indexOf(id) !== -1;
}

function toggleInspired(id) {
  var item = feedById(id);
  var i = S.inspired.indexOf(id);
  if (i === -1) {
    S.inspired.push(id);
    if (item) item.insp = (item.insp || 0) + 1;
    toast('Marked as inspired.');
  } else {
    S.inspired.splice(i, 1);
    if (item && item.insp > 0) item.insp -= 1;
    toast('Removed from inspired.');
  }
  paint();
  render();
}

function takenHas(key) {
  var i;
  for (i = 0; i < S.taken.length; i++) {
    if (S.taken[i].key === key) return true;
  }
  return false;
}

function addTaken(entry, silent) {
  if (takenHas(entry.key)) return false;
  S.taken.push(entry);
  if (!silent) toast('Added to ' + (stageByKey(entry.stage).name || entry.stage) + '.');
  return true;
}

function ensureReplyIds(item) {
  if (!item || !item.replies) return;
  var i;
  for (i = 0; i < item.replies.length; i++) {
    if (!item.replies[i].id) item.replies[i].id = item.id + '-r' + i;
  }
}

function studentLabel() {
  if (S.onboarded && S.form) return S.form + ' student, ' + (S.region || 'Guyana');
  return 'Student';
}

function youName() {
  if (S.onboarded && S.archetype) return 'You (' + S.archetype + ')';
  return 'You';
}

function removeTaken(key) {
  S.taken = S.taken.filter(function (t) {
    return t.key !== key;
  });
  toast('Removed.');
}

function toggleTaken(entry) {
  if (takenHas(entry.key)) {
    removeTaken(entry.key);
  } else {
    addTaken(entry);
  }
  paint();
  render();
}

function pushRecent(kind, id, label) {
  var i;
  S.recent = S.recent.filter(function (r) {
    return !(r.kind === kind && r.id === id);
  });
  S.recent.unshift({ kind: kind, id: id, label: label });
  if (S.recent.length > 6) S.recent.length = 6;
}

function feedById(id) {
  var i;
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].id === id) return FEED[i];
  }
  return null;
}

function sessionById(id) {
  var i;
  for (i = 0; i < SESSIONS.length; i++) {
    if (SESSIONS[i].id === id) return SESSIONS[i];
  }
  return null;
}

function oppOpenAtStage(opp, stageKey) {
  if (!opp || !stageKey) return false;
  var idx = stageIndex(stageKey);
  return opp.stages.indexOf(idx) !== -1;
}

function lockBody(on) {
  if (on) document.body.className = (document.body.className + ' sheet-open').replace(/\s+/g, ' ').trim();
  else document.body.className = document.body.className.replace(/\bsheet-open\b/g, '').replace(/\s+/g, ' ').trim();
}

function go(v) {
  NAV.push(v);
  openSheet();
  paint();
}

function back() {
  NAV.pop();
  if (!NAV.length) {
    closeSheet();
    return;
  }
  paint();
}

function hideSheetUi() {
  NAV = [];
  var sh = byId('sheet');
  if (sh) {
    sh.hidden = true;
    sh.className = sh.className.replace(/\bopen\b/g, '').replace(/\s+/g, ' ').trim();
  }
  var scrim = byId('scrim');
  if (scrim) scrim.hidden = true;
  lockBody(false);
}

function closeSheet() {
  hideSheetUi();
  render();
}

function openSheet() {
  var sh = byId('sheet');
  sh.hidden = false;
  if ((' ' + sh.className + ' ').indexOf(' open ') === -1) sh.className = (sh.className + ' open').replace(/\s+/g, ' ').trim();
  byId('scrim').hidden = false;
  lockBody(true);
  byId('sheet-body').scrollTop = 0;
}

function setView(v) {
  hideSheetUi();
  S.view = v;
  if (v === 'pathway') S.unread = 0;
  render();
}

function paint() {
  if (!NAV.length) return;
  var top = NAV[NAV.length - 1];
  var fn = VIEWS[top.t];
  if (!fn) return;
  var out = fn(top);
  byId('sheet-crumb').textContent = out.crumb || '';
  byId('sheet-title').textContent = out.title || '';
  byId('sheet-back').hidden = NAV.length < 2;
  byId('sheet-body').innerHTML = out.html || '';
  byId('sheet-body').scrollTop = 0;
  if (out.after) out.after();
  renderChrome();
}

function avatarHtml(a, anon) {
  if (anon) {
    return '<span class="av av-anon" aria-hidden="true">?</span>';
  }
  var cls = a && a.system ? 'av av-desk' : 'av';
  return '<span class="' + cls + '" aria-hidden="true">' + esc((a && a.init) || '?') + '</span>';
}

function pill(label, cls, attrs) {
  return '<button type="button" class="p ' + (cls || '') + '" ' + (attrs || '') + '>' + esc(label) + '</button>';
}

function catChip(cat, clickable) {
  if (!cat) return '';
  if (clickable === false) {
    return '<span class="cat-chip">' + esc(cat) + '</span>';
  }
  return (
    '<button type="button" class="cat-chip" data-topic="' +
    esc(cat) +
    '">' +
    esc(cat) +
    '</button>'
  );
}

function exploreCta() {
  return '<span class="engage-cta">Explore</span>';
}

function iconHeart() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
}

function iconCheck() {
  return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
}

function iconBack() {
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
}

function iconClose() {
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
}

function iconFeed() {
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>';
}

function iconPath() {
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><path d="M12 7v3M12 14v3"/></svg>';
}

function caveatCalendar() {
  return '<p class="caveat">Based on the usual school calendar. Confirm the real date with your school, because it moves.</p>';
}

function askAboutBlock(seed, cat) {
  return (
    '<div class="card soft-ask">' +
    '<p class="eyebrow">Ask about this</p>' +
    '<p class="muted">Put a question into the feed. Mentors in this area see it.</p>' +
    '<button type="button" class="btn" data-ask-seed="' +
    esc(seed) +
    '" data-ask-cat="' +
    esc(cat || '') +
    '">Ask in the feed</button>' +
    '</div>'
  );
}

function searchHay(item) {
  var parts = [item.title || '', item.cat || '', item.text || '', item.who || '', item.kind || ''];
  var i, a, o, j, r, sess, jour;
  if (item.body) {
    for (i = 0; i < item.body.length; i++) parts.push(item.body[i]);
  }
  if (item.replies) {
    for (i = 0; i < item.replies.length; i++) {
      r = item.replies[i];
      parts.push(r.text || '');
      parts.push(r.who || '');
      if (r.a) {
        a = author(r.a);
        parts.push(a.name, a.pos || '');
      }
    }
  }
  if (item.author) {
    a = author(item.author);
    parts.push(a.name, a.pos || '');
  }
  if (item.opp && OPPS[item.opp]) {
    o = OPPS[item.opp];
    parts.push(o.name, o.one || '', o.cat || '');
  }
  if (item.session) {
    sess = sessionById(item.session);
    if (sess) parts.push(sess.title, sess.pod || '', sess.cat || '');
  }
  if (item.journey && JOURNEYS[item.journey]) {
    jour = JOURNEYS[item.journey];
    a = author(item.journey);
    parts.push(a.name, jour.hook || '', jour.now || '', jour.place || '', jour.field || '', jour.quote || '');
  }
  return parts.join(' ').toLowerCase();
}

function filteredFeed() {
  var q = (S.query || '').trim().toLowerCase();
  var out = [];
  var i, item, ok;
  for (i = 0; i < FEED.length; i++) {
    item = FEED[i];
    ok = true;
    if (S.filter === 'questions' && item.kind !== 'question') ok = false;
    if (S.filter === 'stories' && item.kind !== 'story') ok = false;
    if (S.filter === 'opportunities' && item.kind !== 'opportunity') ok = false;
    if (S.filter === 'sessions' && item.kind !== 'session') ok = false;
    if (S.filter === 'journeys' && item.kind !== 'journey') ok = false;
    if (ok && q && searchHay(item).indexOf(q) === -1) ok = false;
    if (ok) out.push(item);
  }
  return out;
}

function resultCountLine(list) {
  var q = (S.query || '').trim();
  if (q) return list.length + ' results for "' + q + '"';
  if (S.filter === 'all') return list.length + ' posts, tap any of them to go deeper';
  var labels = {
    questions: 'questions',
    stories: 'stories',
    opportunities: 'opportunities',
    sessions: 'sessions',
    journeys: 'journeys'
  };
  return list.length + ' under ' + (labels[S.filter] || S.filter);
}

function cardClickAttrs(kind, id) {
  return 'data-open="' + esc(kind) + '" data-id="' + esc(id) + '"';
}

function renderQuestionCard(item) {
  var anon = !!item.anon || !item.author;
  var a = item.author ? author(item.author) : null;
  var name = anon ? item.who || youName() : a && a.name ? a.name : youName();
  var bits = ['Question'];
  if (!anon && a && a.pos) bits.push(a.pos);
  if (item.time) bits.push(item.time);
  if (item.askedAt) bits.push('Asked at ' + item.askedAt);
  var first = item.replies && item.replies[0] ? item.replies[0] : null;
  var firstText = '';
  var firstWho = '';
  if (first) {
    firstText = first.text;
    firstWho = first.a ? author(first.a).name : first.who || 'Student';
  }
  var nReplies = item.replies ? item.replies.length : 0;
  var html =
    '<article class="card feed-card kind-q clickable" ' +
    cardClickAttrs('thread', item.id) +
    '>' +
    '<div class="card-head">' +
    avatarHtml(a, anon) +
    '<div class="meta">' +
    '<div class="name">' +
    esc(name) +
    '</div>' +
    '<div class="sub">' +
    esc(bits.join(' · ')) +
    '</div>' +
    '</div>';
  if (!anon && a && !a.system) {
    html +=
      '<button type="button" class="btn quiet follow-btn' +
      (isFollowing(item.author) ? ' following' : '') +
      '" data-follow="' +
      esc(item.author) +
      '">' +
      (isFollowing(item.author) ? 'Following' : 'Follow') +
      '</button>';
  }
  html += '</div>';
  if (item.mine) {
    html += '<div class="flag-row">';
    html += '<span class="mine-tag">Yours</span>';
    if (item.newReply) html += '<span class="mine-tag alert">New reply</span>';
    if (item.edited) html += '<span class="mine-tag">Edited</span>';
    html +=
      '<button type="button" class="btn quiet" data-edit="' +
      esc(item.id) +
      '">Edit</button>';
    html +=
      '<button type="button" class="btn quiet" data-del="' +
      esc(item.id) +
      '">Delete</button>';
    html += '</div>';
  }
  if (item.cat) html += '<div class="card-cats">' + catChip(item.cat) + '</div>';
  html += '<h3>' + esc(item.title) + '</h3>';
  if (first) {
    html +=
      '<div class="reply-preview"><strong>' +
      esc(firstWho) +
      '</strong> ' +
      esc(firstText) +
      '</div>';
  }
  html +=
    '<div class="engage">' +
    '<span class="engage-stat">' +
    nReplies +
    (nReplies === 1 ? ' reply' : ' replies') +
    '</span>' +
    exploreCta() +
    '</div></article>';
  return html;
}

function renderStoryCard(item) {
  var mine = !!item.mine;
  var anon = !!item.anon;
  var a = !mine && item.author ? author(item.author) : null;
  var name = mine ? (anon ? studentLabel() : youName()) : a.name;
  var bits = ['Story'];
  if (!mine && a && a.pos) bits.push(a.pos);
  if (item.time) bits.push(item.time);
  var para = (item.body && item.body[0]) || '';
  var html =
    '<article class="card feed-card kind-story clickable" ' +
    cardClickAttrs('story', item.id) +
    '>' +
    '<div class="card-head">' +
    avatarHtml(a, mine || anon) +
    '<div class="meta"><div class="name">' +
    esc(name) +
    '</div><div class="sub">' +
    esc(bits.join(' · ')) +
    '</div></div>';
  if (!mine && a && !a.system) {
    html +=
      '<button type="button" class="btn quiet follow-btn' +
      (isFollowing(item.author) ? ' following' : '') +
      '" data-follow="' +
      esc(item.author) +
      '">' +
      (isFollowing(item.author) ? 'Following' : 'Follow') +
      '</button>';
  }
  html += '</div>';
  if (mine) {
    html +=
      '<div class="flag-row"><span class="mine-tag">Yours</span>' +
      (item.edited ? '<span class="mine-tag">Edited</span>' : '') +
      '<button type="button" class="btn quiet" data-edit="' +
      esc(item.id) +
      '">Edit</button>' +
      '<button type="button" class="btn quiet" data-del="' +
      esc(item.id) +
      '">Delete</button></div>';
  }
  if (item.cat) html += '<div class="card-cats">' + catChip(item.cat) + '</div>';
  html +=
    '<h3>' +
    esc(item.title) +
    '</h3>' +
    '<p class="clamp3">' +
    esc(para) +
    '</p>' +
    '<div class="engage">' +
    '<button type="button" class="engage-btn" data-inspire="' +
    esc(item.id) +
    '">' +
    iconHeart() +
    ' Inspired · ' +
    (item.insp || 0) +
    '</button>' +
    exploreCta() +
    '</div></article>';
  return html;
}

function renderOppCard(item) {
  var o = OPPS[item.opp];
  if (!o) return '';
  var desk = author('desk');
  var bits = ['Opportunity'];
  if (o.independent) bits.push('Self-entry');
  if (item.time) bits.push(item.time);
  return (
    '<article class="card feed-card kind-opp opp-card clickable" ' +
    cardClickAttrs('opp', o.id) +
    '>' +
    '<div class="card-head">' +
    avatarHtml(desk, false) +
    '<div class="meta"><div class="name">' +
    esc(desk.name) +
    '</div><div class="sub">' +
    esc(bits.join(' · ')) +
    '</div></div></div>' +
    (o.cat ? '<div class="card-cats">' + catChip(o.cat) + '</div>' : '') +
    '<h3>' +
    esc(o.name) +
    '</h3>' +
    '<p class="clamp3">' +
    esc(item.text) +
    '</p>' +
    '<div class="engage">' +
    '<button type="button" class="engage-btn" data-save="' +
    esc(o.id) +
    '">' +
    (isSaved(o.id) ? 'Saved' : 'Save') +
    '</button>' +
    exploreCta() +
    '</div></article>'
  );
}

function renderSessionCard(item) {
  var s = sessionById(item.session);
  if (!s) return '';
  var left = Math.max(0, s.seats - s.taken);
  var pct = Math.min(100, Math.round((s.taken / s.seats) * 100));
  var lead = author(s.lead);
  return (
    '<article class="card feed-card kind-sess sess-card clickable" ' +
    cardClickAttrs('session', s.id) +
    '>' +
    '<div class="card-head">' +
    '<div class="date-chip" aria-hidden="true"><span class="d">' +
    esc(s.date) +
    '</span><span class="w">' +
    esc(s.day) +
    '</span></div>' +
    '<div class="meta"><div class="name">' +
    esc(s.title) +
    '</div><div class="sub">Session · ' +
    esc(s.when) +
    ' · ' +
    esc(lead.name) +
    '</div></div></div>' +
    (s.pod ? '<div class="card-cats">' + catChip(s.pod, false) + '</div>' : '') +
    '<div class="sess-meta">' +
    '<span>' +
    left +
    (left === 1 ? ' place left' : ' places left') +
    '</span>' +
    '<div class="cap"><span style="width:' +
    pct +
    '%"></span></div>' +
    '</div>' +
    '<div class="engage">' +
    '<button type="button" class="engage-btn primary" data-open="book" data-id="' +
    esc(s.id) +
    '">' +
    (left === 0 ? 'Join waitlist' : 'Book') +
    '</button>' +
    exploreCta() +
    '</div></article>'
  );
}

function renderJourneyCard(item) {
  var j = JOURNEYS[item.journey];
  var a = author(item.journey);
  if (!j) return '';
  var bits = ['Journey'];
  if (a.role) bits.push(a.role);
  bits.push('Age ' + j.age);
  if (j.ongoing) bits.push('Ongoing');
  var cats = '';
  if (j.field) cats += catChip(j.field, false);
  if (a.pos) cats += catChip(a.pos, false);
  return (
    '<article class="card feed-card kind-journey journey-card clickable" ' +
    cardClickAttrs('journey', item.journey) +
    '>' +
    '<div class="card-head">' +
    '<span class="av gold">' +
    esc(a.init) +
    '</span>' +
    '<div class="meta"><div class="name">' +
    esc(a.name) +
    '</div><div class="sub">' +
    esc(bits.join(' · ')) +
    '</div></div>' +
    '<button type="button" class="btn quiet follow-btn' +
    (isFollowing(item.journey) ? ' following' : '') +
    '" data-follow="' +
    esc(item.journey) +
    '">' +
    (isFollowing(item.journey) ? 'Following' : 'Follow') +
    '</button>' +
    '</div>' +
    (cats ? '<div class="card-cats">' + cats + '</div>' : '') +
    '<h3 class="hook">' +
    esc(j.hook) +
    '</h3>' +
    '<p class="now-line">Now · ' +
    esc(j.now) +
    '</p>' +
    '<div class="engage">' +
    '<button type="button" class="engage-btn" data-open="mentor" data-id="' +
    esc(item.journey) +
    '">Profile</button>' +
    exploreCta() +
    '</div></article>'
  );
}

function renderFeedCard(item) {
  if (item.kind === 'question') return renderQuestionCard(item);
  if (item.kind === 'story') return renderStoryCard(item);
  if (item.kind === 'opportunity') return renderOppCard(item);
  if (item.kind === 'session') return renderSessionCard(item);
  if (item.kind === 'journey') return renderJourneyCard(item);
  return '';
}

function renderRecentRow() {
  if (!S.recent.length) return '';
  var html = '<div class="recent-row" aria-label="Jump back in">';
  var i, r;
  for (i = 0; i < S.recent.length; i++) {
    r = S.recent[i];
    html +=
      '<button type="button" class="chip" data-open="' +
      esc(r.kind) +
      '" data-id="' +
      esc(r.id) +
      '">' +
      esc(r.label) +
      '</button>';
  }
  html += '</div>';
  return html;
}

function dupHintHtml(draft) {
  if (!draft || draft.length < 12) return '';
  var low = draft.toLowerCase();
  var i, j, hit, item, replyNames, raeka;
  for (i = 0; i < DUP_MAP.length; i++) {
    for (j = 0; j < DUP_MAP[i].keys.length; j++) {
      if (low.indexOf(DUP_MAP[i].keys[j]) !== -1) {
        hit = DUP_MAP[i].id;
        break;
      }
    }
    if (hit) break;
  }
  if (!hit) return '';
  item = feedById(hit);
  if (!item) return '';
  replyNames = [];
  raeka = false;
  if (item.replies) {
    for (i = 0; i < item.replies.length; i++) {
      if (item.replies[i].a) {
        replyNames.push(author(item.replies[i].a).name);
        if (item.replies[i].a === 'raeka') raeka = true;
      }
    }
  }
  return (
    '<div class="dup-box" id="dup-box">' +
    '<p class="eyebrow">Someone already asked this</p>' +
    '<p class="serif"><strong>' +
    esc(item.title) +
    '</strong></p>' +
    '<p class="muted">' +
    (item.replies ? item.replies.length : 0) +
    ' replies, including one from ' +
    esc(raeka ? 'Raeka Persaud' : replyNames[0] || 'a mentor') +
    '.</p>' +
    '<div class="card-actions">' +
    '<button type="button" class="btn sm" data-open="thread" data-id="' +
    esc(item.id) +
    '">Read that thread</button>' +
    '<button type="button" class="btn sm g" id="dup-dismiss">Ask mine anyway</button>' +
    '</div></div>'
  );
}

function renderComposerForm() {
  var i;
  var html = '<div class="composer compose-panel" id="composer">';
  html += '<div class="seg">';
  html +=
    '<button type="button" class="seg-btn' +
    (S.ctype === 'question' ? ' on' : '') +
    '" data-ctype="question">Ask a question</button>';
  html +=
    '<button type="button" class="seg-btn' +
    (S.ctype === 'story' ? ' on' : '') +
    '" data-ctype="story">Share a story</button>';
  html += '</div>';
  html +=
    '<label class="sr" for="comp-text">' +
    (S.ctype === 'question' ? 'Your question' : 'Your story') +
    '</label>';
  html +=
    '<textarea id="comp-text" rows="5" placeholder="' +
    (S.ctype === 'question'
      ? 'What are you trying to decide?'
      : 'What happened, and what did it change?') +
    '">' +
    esc(S.draft || '') +
    '</textarea>';
  html += '<div id="dup-slot">' + (S.ctype === 'question' ? dupHintHtml(S.draft || '') : '') + '</div>';
  html += '<div class="composer-foot">';
  html += '<label class="field-label" for="comp-cat">Category</label>';
  html += '<select id="comp-cat" aria-label="Category">';
  var selCat = S.draftCat || CATS[0];
  for (i = 0; i < CATS.length; i++) {
    html +=
      '<option value="' +
      esc(CATS[i]) +
      '"' +
      (CATS[i] === selCat ? ' selected' : '') +
      '>' +
      esc(CATS[i]) +
      '</option>';
  }
  html += '</select>';
  html +=
    '<label class="check"><input type="checkbox" id="comp-anon"' +
    (S.anon ? ' checked' : '') +
    '/> Post without my name</label>';
  html +=
    '<button type="button" class="btn" id="comp-submit">' +
    (S.ctype === 'question' ? 'Post question' : 'Share story') +
    '</button>';
  html += '</div></div>';
  return html;
}

function renderFeed() {
  var list = filteredFeed();
  var filters = [
    ['all', 'All'],
    ['questions', 'Questions'],
    ['stories', 'Stories'],
    ['opportunities', 'Opportunities'],
    ['sessions', 'Sessions'],
    ['journeys', 'Journeys']
  ];
  var html = '<div class="page-feed">';
  html += '<h1>What\'s Steppin\'?</h1>';
  html +=
    '<label class="sr" for="feed-q">Search the feed</label>' +
    '<input type="search" id="feed-q" class="search" placeholder="Search titles, people, places, categories" value="' +
    esc(S.query) +
    '"/>';
  html += '<div class="filters" role="tablist">';
  var i;
  for (i = 0; i < filters.length; i++) {
    html +=
      '<button type="button" class="filter' +
      (S.filter === filters[i][0] ? ' on' : '') +
      '" data-filter="' +
      filters[i][0] +
      '">' +
      filters[i][1] +
      '</button>';
  }
  html += '</div>';
  html += '<div class="stream">';
  for (i = 0; i < list.length; i++) {
    html += renderFeedCard(list[i]);
    if (i === 3) html += renderJoinCard();
  }
  if (list.length > 0 && list.length < 4) html += renderJoinCard();
  if (!list.length) {
    html +=
      '<div class="empty card">' +
      '<h3>Nothing matches</h3>' +
      '<p>Clear search or switch filter to bring the feed back.</p>' +
      '<button type="button" class="btn sm g" data-filter="all" id="clear-filters">Show all posts</button>' +
      '</div>';
    html += renderJoinCard();
  }
  html += '</div></div>';
  return html;
}

function renderSessionsPage() {
  var stageFilter = S.sessionStage || '';
  var html = '<div class="page-sessions">';
  html += '<h1>Happening</h1>';
  html +=
    '<p class="lede">Book a live pod, or explore programmes currently open for youth in Guyana.</p>';

  html +=
    '<section class="section"><h2>Our sessions</h2>' +
    '<p class="muted">Live pods you can book with mentors.</p>';
  var i, s, shown = 0;
  for (i = 0; i < SESSIONS.length; i++) {
    s = SESSIONS[i];
    if (stageFilter && s.stages.indexOf(stageFilter) === -1) continue;
    html += renderSessionMini(s);
    shown++;
  }
  if (!shown) html += '<p class="muted">No sessions matched yet.</p>';
  html += '</section>';

  html +=
    '<section class="section"><h2>Open opportunities</h2>' +
    '<p class="muted">Programmes currently open for youth in Guyana.</p>';
  var k, o, open = [], later = [];
  for (k in OPPS) {
    if (!OPPS.hasOwnProperty(k)) continue;
    o = OPPS[k];
    if (S.onboarded && S.stage && oppOpenAtStage(o, S.stage)) open.push(o);
    else later.push(o);
  }
  var list = open.length ? open.concat(later.filter(function (x) { return open.indexOf(x) === -1; })) : later;
  if (!list.length) html += '<p class="muted">No opportunities listed yet.</p>';
  for (i = 0; i < list.length; i++) {
    o = list[i];
    html +=
      '<div class="card sess-opp">' +
      '<div class="card-cats">' +
      catChip(o.cat || 'Opportunity', false) +
      (o.independent ? '<span class="cat-chip soft">Self-entry</span>' : '') +
      (S.onboarded && oppOpenAtStage(o, S.stage) ? '<span class="cat-chip soft open">Open for you</span>' : '') +
      '</div>' +
      '<h3>' +
      esc(o.name) +
      '</h3>' +
      '<p class="muted">' +
      esc(o.one) +
      '</p>' +
      '<div class="card-actions">' +
      '<button type="button" class="btn sm" data-open="opp" data-id="' +
      esc(o.id) +
      '">Explore</button>' +
      '<button type="button" class="btn sm g" data-save="' +
      esc(o.id) +
      '">' +
      (isSaved(o.id) ? 'Saved' : 'Save') +
      '</button></div></div>';
  }
  html +=
    '<p class="footer-note">Dates, fees and requirements are illustrative in this prototype and must be confirmed with the organiser.</p></section>';
  html += '</div>';
  return html;
}

/* Pathway helpers and render continue in app-views.js / assembled file */
