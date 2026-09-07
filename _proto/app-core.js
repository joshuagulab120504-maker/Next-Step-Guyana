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
  follow: [],
  commQ: '',
  commRole: 'all',
  commCareer: '',
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
  replyTimer: null,
  role: 'visitor',
  me: {
    id: '',
    name: '',
    role: 'visitor',
    pending: false,
    verified: false,
    contactable: false,
    form: '',
    region: ''
  },
  qFollow: [],
  hidden: [],
  reported: [],
  menu: '',
  compose: {
    step: 'write',
    kind: 'question',
    title: '',
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
    topic: '',
    stage: '',
    res: [],
    resOther: '',
    images: [],
    anon: true,
    editId: ''
  },
  pw: null,
  topicTag: '',
  topicMore: '',
  kindKey: '',
  kindMore: ''
};

function emptyPw() {
  return {
    done: false,
    step: 0,
    level: '',
    region: '',
    fields: [],
    clarity: '',
    dest: -1,
    considering: [],
    fork: '',
    open: '',
    tab: 'me',
    sub: '',
    field: '',
    q: '',
    sheet: -1,
    sheetAcc: '',
    name: '',
    title: '',
    about: '',
    mentorField: '',
    subjects: {},
    achievements: [],
    activities: [],
    leaving: {},
    steps: [],
    queue: [],
    flagOn: -1,
    flagReason: '',
    flagNote: '',
    sugOn: -1,
    sugField: '',
    sugText: '',
    sugWhy: '',
    subjSheet: false,
    addStep: false,
    stepWhen: '',
    stepDid: '',
    stepLed: '',
    focusQ: false,
    qPos: 0
  };
}

function ensurePw() {
  if (!S.pw) S.pw = emptyPw();
  return S.pw;
}

function resetPwSubpages() {
  var p = ensurePw();
  p.sub = '';
  p.field = '';
  p.sheet = -1;
  p.sheetAcc = '';
  p.flagOn = -1;
  p.sugOn = -1;
  p.subjSheet = false;
  p.addStep = false;
}

function levelByKey(k) {
  var i;
  for (i = 0; i < LEVELS.length; i++) if (LEVELS[i].k === k) return LEVELS[i];
  return LEVELS[0];
}

function levelName(k) {
  return levelByKey(k).n;
}

function regionByKey(k) {
  var i;
  for (i = 0; i < REGIONS.length; i++) if (REGIONS[i].k === k) return REGIONS[i];
  return REGIONS[3];
}

function regionShort(k) {
  return regionByKey(k).short;
}

function seedMentorRoute(id) {
  var j = typeof JOURNEYS !== 'undefined' ? JOURNEYS[id] : null;
  var i;
  if (!j || !j.moments || S.pw.steps.length) return;
  for (i = 0; i < j.moments.length; i++) {
    S.pw.steps.push({
      when: j.moments[i].age ? 'Age ' + j.moments[i].age : 'Then',
      did: j.moments[i].text,
      led: (j.route && j.route[i] && j.route[i].lesson) || ''
    });
  }
}

function fieldByKey(k) {
  var i;
  for (i = 0; i < FIELDS.length; i++) if (FIELDS[i].k === k) return FIELDS[i];
  return FIELDS[0];
}

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

function toast(msg, opts) {
  var el = byId('toast');
  var btn;
  opts = opts || {};
  el.textContent = '';
  el.appendChild(document.createTextNode(msg));
  if (opts.undo) {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast-undo';
    btn.textContent = 'Undo';
    btn.onclick = function () {
      el.hidden = true;
      opts.undo();
    };
    el.appendChild(btn);
  }
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(function () {
    el.hidden = true;
  }, opts.undo ? 6000 : 3200);
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

function countDownUnits(ms) {
  var mins;
  var hours;
  var days;
  var weeks;
  if (ms < 0) ms = 0;
  if (ms < 60000) return { n: 1, unit: 'minute' };
  mins = Math.round(ms / 60000);
  if (mins < 60) return { n: mins, unit: mins === 1 ? 'minute' : 'minutes' };
  hours = Math.round(ms / 3600000);
  if (hours < 48) return { n: hours, unit: hours === 1 ? 'hour' : 'hours' };
  days = Math.round(ms / 86400000);
  if (days < 14) return { n: days, unit: days === 1 ? 'day' : 'days' };
  weeks = Math.max(1, Math.round(ms / 604800000));
  return { n: weeks, unit: weeks === 1 ? 'week' : 'weeks' };
}

function countDownWhen(ms) {
  var d = new Date(ms);
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  var h = d.getHours();
  var m = d.getMinutes();
  var ap = h >= 12 ? 'PM' : 'AM';
  var h12 = h % 12 || 12;
  var mm = m < 10 ? '0' + m : String(m);
  return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ', ' + h12 + ':' + mm + ' ' + ap;
}

function countDownPhrase(targetMs, verb, nowMs) {
  var left = targetMs - (nowMs || Date.now());
  var u;
  var text;
  if (left <= 0) return '';
  u = countDownUnits(left);
  text = verb + ' in ' + u.n + ' ' + u.unit;
  if (left >= 48 * 3600000) text += ' · ' + countDownWhen(targetMs);
  return text;
}

function author(id) {
  return AUTHORS[id] || { name: id, init: '?', role: '', pending: false, verified: false, contactable: false, form: '', region: '', pos: '', system: true };
}

function postingRole() {
  if (!S.onboarded || S.role === 'visitor' || (S.me && S.me.role === 'visitor')) return 'visitor';
  if (S.me && S.me.pending) return 'student';
  return S.role;
}

function isVisitor() {
  return postingRole() === 'visitor';
}

function isPendingPoster() {
  return !!(S.me && S.me.pending && (S.me.role === 'contributor' || S.me.role === 'mentor'));
}

function canCheckOpenings() {
  if (!S.me || S.me.pending) return false;
  return S.role === 'mentor' || S.role === 'admin';
}

function currentPosterId() {
  return S.me && S.me.id ? S.me.id : null;
}

function applyPrototypeRole(key) {
  var pending = key.indexOf('pending-') === 0;
  var role = pending ? key.slice(8) : key;
  var a;
  S.role = role;
  S.me.role = role;
  S.me.pending = pending;
  S.me.form = S.form || '';
  S.me.region = S.region || '';
  ensurePw();
  resetPwSubpages();
  S.pw.tab = 'me';
  if (role === 'visitor') {
    S.onboarded = false;
    S.me.id = '';
    S.me.verified = false;
    S.me.contactable = false;
    S.me.form = '';
    S.me.region = '';
    S.pw.done = false;
    S.pw.step = 0;
    S.pw.level = '';
    S.pw.region = '';
    S.pw.fields = [];
    S.pw.clarity = '';
    return;
  }
  S.onboarded = true;
  S.hideJoinCard = true;
  S.pw.done = true;
  if (!S.pw.level) S.pw.level = 'f4';
  if (!S.pw.region) S.pw.region = 'r4';
  if (!S.pw.open) S.pw.open = S.pw.level;
  if (!S.form) {
    S.form = levelName(S.pw.level);
    S.stage = 'csec';
  }
  if (!S.region) S.region = regionShort(S.pw.region);
  S.me.form = S.form;
  S.me.region = S.region;
  if (role === 'student') {
    S.me.id = '';
    S.me.verified = false;
    S.me.contactable = false;
    S.pw.name = 'You';
  } else if (role === 'contributor') {
    S.me.id = 'jerome';
    S.me.verified = false;
    S.me.contactable = false;
    a = author('jerome');
    S.pw.name = a.name;
    S.pw.title = a.pos;
    if (!S.pw.mentorField) S.pw.mentorField = 'tech';
    seedMentorRoute('jerome');
  } else if (role === 'mentor') {
    S.me.id = 'raeka';
    S.me.verified = !pending;
    S.me.contactable = true;
    a = author('raeka');
    S.pw.name = a.name;
    S.pw.title = a.pos;
    if (!S.pw.mentorField) S.pw.mentorField = 'science';
    seedMentorRoute('raeka');
  } else if (role === 'admin') {
    S.me.id = 'desk';
    S.me.verified = false;
    S.me.contactable = false;
    S.pw.name = 'Desk';
  } else if (role === 'parent') {
    S.me.id = '';
    S.me.verified = false;
    S.me.contactable = false;
    S.pw.name = 'You';
  }
}

function canContact(id) {
  var a = author(id);
  return !!(a && a.contactable && a.role === 'mentor');
}

function canFollowPerson(id) {
  var a;
  if (!id || id === currentPosterId()) return false;
  a = author(id);
  if (!a || a.system) return false;
  return a.role === 'mentor' || a.role === 'contributor';
}

function canLinkAuthor(id) {
  var a;
  if (!id) return false;
  a = author(id);
  if (!a || a.system) return false;
  return a.role === 'mentor' || a.role === 'contributor' || a.role === 'admin';
}

function authorLinkWrap(inner) {
  return '<div class="author-link">' + inner + '</div>';
}

function authorHitBtn(inner, authorId, extraCls) {
  var cls = extraCls ? 'author-hit ' + extraCls : 'author-hit';
  if (!canLinkAuthor(authorId)) {
    return '<div class="' + cls + '">' + inner + '</div>';
  }
  return (
    '<button type="button" class="' +
    cls +
    '" data-open="person" data-id="' +
    esc(authorId) +
    '">' +
    inner +
    '</button>'
  );
}

function kindOpenBtn(kind, label) {
  return (
    '<button type="button" class="k-word k-' +
    esc(kind) +
    '" data-open="kind" data-id="' +
    esc(kind) +
    '">' +
    esc(label) +
    '</button>'
  );
}

function kindHitBtn(kind, inner, extraCls, label) {
  var cls = extraCls ? 'kind-hit ' + extraCls : 'kind-hit';
  return (
    '<button type="button" class="' +
    cls +
    '" data-open="kind" data-id="' +
    esc(kind) +
    '"' +
    (label ? ' aria-label="' + esc(label) + '"' : '') +
    '>' +
    inner +
    '</button>'
  );
}

function normalizeTopicTag(tag) {
  var s = String(tag || '').trim();
  if (!s) return '';
  if (s.charAt(0) === '#') return s;
  return hashTagLabel(s);
}

function MONTHS_SHORT() {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

function timeAgo(iso) {
  if (!iso) return '';
  var then = new Date(iso);
  if (isNaN(then.getTime())) return '';
  var now = new Date();
  var diff = now.getTime() - then.getTime();
  if (diff < 0) diff = 0;
  var mins = Math.floor(diff / 60000);
  if (mins < 60) return String(Math.max(1, mins)) + 'm ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return String(hrs) + 'h ago';
  var days = Math.floor(hrs / 24);
  if (days < 7) return String(days) + 'd ago';
  var mon = MONTHS_SHORT()[then.getMonth()];
  if (then.getFullYear() !== now.getFullYear()) {
    return String(then.getDate()) + ' ' + mon + ' ' + then.getFullYear();
  }
  return String(then.getDate()) + ' ' + mon;
}

function formatCheckedDay(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return String(d.getDate()) + ' ' + MONTHS_SHORT()[d.getMonth()] + ' ' + d.getFullYear();
}

function nowIso() {
  return new Date().toISOString();
}

function kindTimeHtml(kindLabel, iso, edited, kindKey) {
  var t = timeAgo(iso);
  var html;
  if (kindKey) {
    html = kindOpenBtn(kindKey, kindLabel);
  } else {
    html = esc(kindLabel);
  }
  if (t) html += ' · ' + esc(t);
  if (edited) html += '<span class="edited-mark"> · Edited</span>';
  return html;
}

function mentorSealSvg() {
  return (
    '<svg class="badge-seal" viewBox="0 0 16 16" aria-hidden="true">' +
    '<circle cx="8" cy="8" r="7"></circle>' +
    '<path d="M4.8 8.2l2.1 2.1 4.4-4.8"></path>' +
    '</svg>'
  );
}

function roleBadgeHtml(a) {
  if (!a) return '';
  if (a.role === 'mentor') {
    if (a.verified && !a.pending) {
      return '<span class="role-badge is-mentor">' + mentorSealSvg() + 'Mentor</span>';
    }
    return '<span class="role-badge is-pending">Mentor</span>';
  }
  if (a.role === 'contributor') {
    return '<span class="role-badge is-contributor">Contributor</span>';
  }
  if (a.role === 'admin') {
    return '<span class="role-badge is-admin">Next Step team</span>';
  }
  return '';
}

function authorRoleLabel(a) {
  if (!a || !a.role) return '';
  if (a.role === 'mentor') return 'Mentor';
  if (a.role === 'contributor') return 'Collaborator';
  if (a.role === 'admin') return 'Next Step team';
  return '';
}

function verifiedMarkHtml(a) {
  if (!a || a.pending || !a.verified) return '';
  if (a.role !== 'mentor') return '';
  return '<span class="name-verify" title="Verified mentor">' + mentorSealSvg() + '</span>';
}

function authorMetaHtml(a) {
  var role = authorRoleLabel(a);
  var pos;
  if (!role) return '';
  pos = a.pos && a.pos !== role ? a.pos : '';
  if (pos) {
    return '<p class="author-meta">' + esc(role) + ' • ' + esc(pos) + '</p>';
  }
  return '<p class="author-meta">' + esc(role) + '</p>';
}

function nameWithBadge(name, a) {
  return (
    '<div class="name-block">' +
    '<div class="name-row"><span class="name">' +
    esc(name) +
    '</span>' +
    verifiedMarkHtml(a) +
    '</div>' +
    authorMetaHtml(a) +
    '</div>'
  );
}

function replyIdentityHtml(a, fallbackName, withAv, whenIso) {
  var name = a && a.name ? a.name : fallbackName || 'Student';
  var when = timeAgo(whenIso);
  var who = nameWithBadge(name, a);
  if (when) who += '<p class="reply-when">' + esc(when) + '</p>';
  if (withAv) {
    return (
      '<div class="reply-id has-av">' +
      avatarHtml(a, !a) +
      '<div class="reply-who">' +
      who +
      '</div></div>'
    );
  }
  return '<div class="reply-id">' + who + '</div>';
}

function followPersonBtn(id, extraCls) {
  if (!canFollowPerson(id)) return '';
  return (
    '<button type="button" class="btn quiet follow-btn' +
    (isFollowing(id) ? ' following' : '') +
    (extraCls ? ' ' + extraCls : '') +
    '" data-follow="' +
    esc(id) +
    '">' +
    (isFollowing(id) ? 'Following' : '+ Follow') +
    '</button>'
  );
}

function contactAffordance(id, mine) {
  if (mine || !id) return '';
  return followPersonBtn(id, '');
}

function cardChevron() {
  return '<svg class="card-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
}

function renderImages(images, mode) {
  var list = images || [];
  var html;
  var i;
  var n;
  var cap;
  if (!list.length) return '';
  if (mode === 'card') {
    return (
      '<div class="card-photo"><img src="' +
      esc(list[0].src) +
      '" alt="' +
      esc(list[0].alt || '') +
      '"/></div>'
    );
  }
  n = Math.min(3, list.length);
  html = '<div class="d-imgs n' + n + '">';
  for (i = 0; i < n; i++) {
    html +=
      '<figure><img src="' +
      esc(list[i].src) +
      '" alt="' +
      esc(list[i].alt || '') +
      '"/>';
    cap = list[i].caption || '';
    if (cap) html += '<figcaption>' + esc(cap) + '</figcaption>';
    html += '</figure>';
  }
  html += '</div>';
  return html;
}

function openingVisible(o) {
  var st;
  if (!o) return false;
  st = o.state || 'live';
  if (st === 'live') return true;
  if (st === 'pending') {
    return o.author === currentPosterId() || canCheckOpenings();
  }
  if (st === 'returned') return o.author === currentPosterId();
  return false;
}

function openingCheckedHtml(o) {
  var who;
  var line;
  var html;
  if (!o || (o.state || 'live') !== 'live' || !o.checkedAt || !o.checkedBy) return '';
  who = author(o.checkedBy);
  line = 'Checked ' + formatCheckedDay(o.checkedAt) + ' by ' + who.name;
  html = '<p class="check-line">' + esc(line);
  if (o.source) {
    html +=
      ' <a class="check-src" href="' +
      esc(o.source) +
      '" target="_blank" rel="noopener">Source</a>';
  }
  html += '</p>';
  return html;
}

function openingsToCheck() {
  var list = [];
  var k;
  var o;
  for (k in OPPS) {
    if (!OPPS.hasOwnProperty(k)) continue;
    o = OPPS[k];
    if ((o.state || '') === 'pending' && o.author !== currentPosterId()) list.push(o);
  }
  return list;
}

function composeTypesFor(role) {
  if (role === 'visitor') return [];
  if (role === 'student') return ['question'];
  if (role === 'contributor') return ['story', 'journey', 'opportunity'];
  if (role === 'mentor') return ['story', 'journey', 'opportunity', 'session'];
  if (role === 'admin') return ['question', 'story', 'journey', 'opportunity', 'session'];
  return ['question'];
}

function sessionWhen(s) {
  if (!s) return '';
  if (s.dateText && s.length && s.platform) {
    return s.dateText + ', ' + s.length.toLowerCase() + ' on ' + s.platform;
  }
  return s.when || '';
}

function isFollowing(id) {
  return S.follow.indexOf(id) !== -1 || S.following.indexOf(id) !== -1;
}

function followSet(id, on) {
  var i = S.follow.indexOf(id);
  var j = S.following.indexOf(id);
  if (on) {
    if (i === -1) S.follow.push(id);
    if (j === -1) S.following.push(id);
  } else {
    if (i !== -1) S.follow.splice(i, 1);
    if (j !== -1) S.following.splice(j, 1);
  }
}

function toggleFollow(id) {
  if (isFollowing(id)) {
    followSet(id, false);
    toast('Unfollowed ' + author(id).name + '.');
  } else {
    followSet(id, true);
    toast('Following ' + author(id).name + '. New posts and nodes reach your feed.');
  }
  paint();
  render();
}

function requireAccount(action) {
  return requirePathway(action);
}

function requirePathway(action) {
  ensurePw();
  if (S.pw.done && !isVisitor()) return false;
  S.pendingAction = action || null;
  S.setupReason =
    (action && action.reason) || 'We need your form to hold you a place.';
  S.setupDraft = {};
  S.setupStep = 0;
  S.pw.step = 0;
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
    if (!isFollowing(action.id)) {
      followSet(action.id, true);
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
  if (action.type === 'save') {
    S.view = 'feed';
    render();
    if (S.saved.indexOf(action.id) === -1) S.saved.push(action.id);
    toast('Pathway built. Saved for later.');
    paint();
    render();
    return;
  }
  if (action.type === 'follow-q') {
    if (S.qFollow.indexOf(action.id) === -1) S.qFollow.push(action.id);
    go({ t: 'thread', id: action.id });
    toast('Pathway built. Following this question.');
    return;
  }
  if (action.type === 'inspire') {
    var inspiredItem;
    if (S.inspired.indexOf(action.id) === -1) {
      S.inspired.push(action.id);
      inspiredItem = feedById(action.id);
      if (inspiredItem) inspiredItem.insp = (inspiredItem.insp || 0) + 1;
    }
    toast('Pathway built. Marked as inspired.');
    S.view = 'feed';
    render();
    return;
  }
  if (action.type === 'report') {
    go({ t: 'report', id: action.id });
    toast('Pathway built. You can send the report now.');
    return;
  }
  if (action.type === 'compose') {
    openCompose();
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
    '<p class="join-lead">You\'re seeing posts for every form. Answer four questions and see only what applies to yours.</p>' +
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
  if (
    requirePathway({
      type: 'save',
      id: id,
      reason: 'We need your form before we save a post for later.'
    })
  ) {
    return;
  }
  var i = S.saved.indexOf(id);
  var item = feedById(id);
  if (i === -1) {
    S.saved.push(id);
    toast(item && item.kind === 'question' ? 'Saved. Find it under Saved questions.' : 'Saved for later.');
  } else {
    S.saved.splice(i, 1);
    toast(item && item.kind === 'question' ? 'Removed from your saved questions.' : 'Removed from saved.');
  }
  paint();
  render();
}

function isInspired(id) {
  return S.inspired.indexOf(id) !== -1;
}

function toggleInspired(id) {
  var item;
  var i;
  item = feedByEngageId(id);
  i = S.inspired.indexOf(id);
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
  if (postingRole() === 'parent') return 'Parent, ' + (S.region || 'Region 4');
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

function feedByEngageId(id) {
  var item = feedById(id);
  var i;
  if (item) return item;
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].opp === id || FEED[i].session === id || FEED[i].journey === id) {
      return FEED[i];
    }
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
  var body = byId('sheet-body');
  if (sh) {
    sh.hidden = true;
    sh.style.visibility = 'hidden';
    sh.className = 'sheet';
  }
  if (body) body.innerHTML = '';
  var scrim = byId('scrim');
  if (scrim) scrim.hidden = true;
  lockBody(false);
  document.body.classList.remove('qa-thread-open');
  document.body.classList.remove('opp-sheet-open');
  document.body.classList.remove('sess-sheet-open');
}

function closeSheet() {
  hideSheetUi();
  render();
}

function openSheet() {
  var sh = byId('sheet');
  var cls = 'sheet open';
  sh.hidden = false;
  sh.style.visibility = 'visible';
  sh.className = cls;
  byId('scrim').hidden = false;
  lockBody(true);
  byId('sheet-body').scrollTop = 0;
}

function setView(v) {
  hideSheetUi();
  if (v === 'sessions' || v === 'happening' || v === 'notifications') v = 'alerts';
  S.view = v;
  if (v === 'pathway' || v === 'alerts') S.unread = 0;
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
  if (typeof qaAfterPaint === 'function') qaAfterPaint();
}

/* Feed avatars take the post kind colour so kinds are readable at a glance.
   Community avatars stay a name-hash tint so the same person is the same colour
   everywhere. Different surface, different job. Do not unify them. */
function iconAnonMark() {
  return (
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M9.2 9.2a3.2 3.2 0 1 1 3.6 3.1c-.8.3-1.3.8-1.3 1.7V15"/>' +
    '<circle cx="12" cy="17.6" r="1" fill="currentColor" stroke="none"/>' +
    '</svg>'
  );
}

function youAvatarHtml() {
  var a;
  var init = 'You';
  if (currentPosterId()) {
    a = author(currentPosterId());
    if (a && a.init && a.init !== '?') init = a.init;
  }
  return '<span class="av av-you" aria-hidden="true">' + esc(init) + '</span>';
}

function avatarHtml(a, anon, kind) {
  var cls = 'av';
  if (kind) {
    cls += ' av-k av-k-' + kind;
    if (kind === 'opportunity') cls += ' av-sq';
    if (kind === 'question') {
      cls += ' av-sq';
      return (
        '<span class="' +
        cls +
        '" aria-hidden="true"><span class="av-qmark">?</span><span class="av-qlabel">Q&amp;A</span></span>'
      );
    }
    if (anon || !a) {
      return '<span class="' + cls + '" aria-hidden="true">' + iconAnonMark() + '</span>';
    }
    return '<span class="' + cls + '" aria-hidden="true">' + esc(a.init || '?') + '</span>';
  }
  if (anon) {
    return '<span class="av av-anon" aria-hidden="true">?</span>';
  }
  cls = a && a.system ? 'av av-desk' : 'av';
  return '<span class="' + cls + '" aria-hidden="true">' + esc((a && a.init) || '?') + '</span>';
}

function pill(label, cls, attrs) {
  return '<button type="button" class="p ' + (cls || '') + '" ' + (attrs || '') + '>' + esc(label) + '</button>';
}

function hashTagLabel(cat) {
  var parts;
  var i;
  var word;
  var out;
  if (!cat) return '';
  parts = String(cat).split(/[^A-Za-z0-9]+/);
  out = '#';
  for (i = 0; i < parts.length; i++) {
    word = parts[i];
    if (!word) continue;
    out += word.charAt(0).toUpperCase() + word.slice(1);
  }
  return out;
}

function catChip(cat, clickable) {
  var label;
  if (!cat) return '';
  label = hashTagLabel(cat);
  if (clickable === false) {
    return '<span class="cat-chip">' + esc(label) + '</span>';
  }
  return (
    '<button type="button" class="cat-chip" data-topic="' +
    esc(cat) +
    '">' +
    esc(label) +
    '</button>'
  );
}

function exploreCta() {
  return '';
}

function iconHeart() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
}

function iconBookmark() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v17l-6-3.4L6 21V4z"/></svg>';
}

function iconFlag() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4h10l-1.2 4.2L19 12H5"/></svg>';
}

function iconMore() {
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="12" cy="19" r="2.2"/></svg>';
}

function iconSendUp() {
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></svg>';
}

function iconReply() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z"/></svg>';
}

function iconHide() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18M10.5 10.7a3 3 0 0 0 4 4M9.2 5.6A10 10 0 0 1 12 5c5 0 9 4.5 10 7-0.4 1.1-1.3 2.6-2.6 3.9M6.1 6.2C4.4 7.5 3.2 9.2 2 12c1 2.5 5 7 10 7 1.4 0 2.7-.3 3.9-.8"/></svg>';
}

function iconFollow() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>';
}

function iconCal() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
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
  var i, item, ok, o;
  for (i = 0; i < FEED.length; i++) {
    item = FEED[i];
    ok = true;
    if (S.filter === 'questions' && item.kind !== 'question') ok = false;
    if (S.filter === 'stories' && item.kind !== 'story') ok = false;
    if (S.filter === 'opportunities' && item.kind !== 'opportunity') ok = false;
    if (S.filter === 'sessions' && item.kind !== 'session') ok = false;
    if (S.filter === 'journeys' && item.kind !== 'journey') ok = false;
    if (ok && item.kind === 'opportunity') {
      o = OPPS[item.opp];
      if (!openingVisible(o)) ok = false;
    }
    if (ok && q && searchHay(item).indexOf(q) === -1) ok = false;
    if (ok && item.kind === 'question' && isHidden('thread', item.id)) ok = false;
    if (ok && item.kind === 'story' && isHidden('story', item.id)) ok = false;
    if (ok && item.kind === 'opportunity' && isHidden('opp', item.opp)) ok = false;
    if (ok && item.kind === 'session' && isHidden('session', item.session)) ok = false;
    if (ok && item.kind === 'session') {
      sess = sessionById(item.session);
      if (sess && sess.status === 'cancelled') ok = false;
    }
    if (ok && item.kind === 'journey' && isHidden('journey', item.journey)) ok = false;
    if (ok) out.push(item);
  }
  if (S.filter === 'sessions' && typeof sessSortSoonest === 'function') {
    return sessSortSoonest(out);
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

function hideKey(kind, id) {
  return kind + ':' + id;
}

function isHidden(kind, id) {
  return S.hidden.indexOf(hideKey(kind, id)) !== -1;
}

function refreshUi() {
  if (NAV.length) paint();
  else render();
}

function toggleMenu(key) {
  S.menu = S.menu === key ? '' : key;
  refreshUi();
}

function hidePost(key) {
  if (!key) return;
  if (S.hidden.indexOf(key) === -1) S.hidden.push(key);
  S.menu = '';
  toast('Hidden from your feed.');
  if (NAV.length) closeSheet();
  else render();
}

function submitReport(key, reason) {
  if (!key || !reason) return;
  if (
    requirePathway({
      type: 'report',
      id: key,
      reason: 'We need your form before we send a report.'
    })
  ) {
    return;
  }
  S.reported.push({ key: key, reason: reason, at: new Date().toISOString() });
  if (S.hidden.indexOf(key) === -1) S.hidden.push(key);
  S.menu = '';
  toast('Report sent. We hid this post from your feed.');
  closeSheet();
  render();
}

function savedTarget(id) {
  var o = OPPS[id];
  var item;
  var s;
  var j;
  var a;
  if (o) return { kind: 'opp', id: o.id, title: o.name, sub: o.cat || 'Opening' };
  item = feedById(id);
  if (item && item.kind === 'story') {
    return { kind: 'story', id: item.id, title: item.title, sub: 'Story' };
  }
  if (item && item.kind === 'question') {
    return { kind: 'thread', id: item.id, title: item.title, sub: 'Question' };
  }
  s = sessionById(id);
  if (s) return { kind: 'session', id: s.id, title: s.title, sub: 'Session' };
  j = JOURNEYS[id];
  if (j) {
    a = author(id);
    return { kind: 'journey', id: id, title: j.hook || a.name, sub: 'Journey' };
  }
  return null;
}

function isOwnCard(kind, id, mine) {
  var s;
  if (mine) return true;
  if (kind === 'opp' && OPPS[id] && OPPS[id].author === currentPosterId()) return true;
  if (kind === 'session') {
    s = sessionById(id);
    if (s && (s.hosted_by === currentPosterId() || s.lead === currentPosterId())) return true;
  }
  if (kind === 'journey' && id && id === currentPosterId()) return true;
  return false;
}

function moreItem(attrs, icon, label) {
  return (
    '<button type="button" class="more-item" role="menuitem" ' +
    attrs +
    '>' +
    (icon || '') +
    '<span>' +
    esc(label) +
    '</span></button>'
  );
}

function cardMoreHtml(kind, id, mine) {
  var key = hideKey(kind, id);
  var open = S.menu === key;
  var own = isOwnCard(kind, id, mine);
  var canEdit = own && (kind === 'thread' || kind === 'story');
  var html =
    '<div class="more-wrap">' +
    '<button type="button" class="more-btn" data-menu="' +
    esc(key) +
    '" aria-label="More actions" aria-expanded="' +
    (open ? 'true' : 'false') +
    '">' +
    iconMore() +
    '</button>';
  if (open) {
    html += '<div class="more-menu" role="menu">';
    if (canEdit) {
      html += moreItem('data-edit="' + esc(id) + '"', '', 'Edit');
      html += moreItem('data-del="' + esc(id) + '"', '', 'Delete');
    }
    html += moreItem('data-hide="' + esc(key) + '"', iconHide(), 'Not interested');
    if (!own) {
      html += moreItem(
        'data-open="report" data-id="' + esc(key) + '"',
        iconFlag(),
        'Report'
      );
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function engageBtn(attrs, icon, label, on, extraCls) {
  return (
    '<button type="button" class="engage-btn' +
    (on ? ' on' : '') +
    (extraCls ? ' ' + extraCls : '') +
    '" ' +
    attrs +
    '>' +
    (icon || '') +
    '<span>' +
    esc(label) +
    '</span></button>'
  );
}

function engageBar(buttons) {
  var html = '<div class="engage" role="group">';
  var i;
  var n = 0;
  for (i = 0; i < buttons.length; i++) {
    if (buttons[i]) {
      html += buttons[i];
      n += 1;
    }
  }
  html += '</div>';
  return n ? html : '';
}

function saveEngageBtn(id) {
  var on = isSaved(id);
  return engageBtn('data-save="' + esc(id) + '"', iconBookmark(), on ? 'Saved' : 'Save', on);
}

function inspireEngageBtn(id) {
  var item = feedByEngageId(id);
  var n = item && item.insp ? item.insp : 0;
  return engageBtn(
    'data-inspire="' + esc(id) + '"',
    iconHeart(),
    n ? 'Inspired ' + n : 'Inspired',
    isInspired(id)
  );
}

function replyEngageBtn(kind, id, n, focus) {
  n = n || 0;
  return engageBtn(
    focus
      ? 'data-focus-reply="1"'
      : 'data-open="' + esc(kind) + '" data-id="' + esc(id) + '"',
    iconReply(),
    n === 0 ? 'Reply' : n === 1 ? '1 reply' : n + ' replies',
    false
  );
}

function postEngageBar(item, kind, id, own, focus, replyN) {
  var src;
  var n = replyN;
  var last;
  if (n == null) {
    src = item || feedByEngageId(id);
    n = src && src.replies ? src.replies.length : 0;
  }
  if ((kind === 'session' || kind === 'opp') && !own) last = signUpEngageBtn(kind, id);
  else last = moreEngageBtn(kind, id);
  return engageBar([
    inspireEngageBtn(id),
    replyEngageBtn(kind, id, n, focus),
    saveEngageBtn(id),
    last
  ]);
}

function moreEngageBtn(kind, id) {
  return engageBtn(
    'data-open="' + esc(kind) + '" data-id="' + esc(id) + '"',
    '',
    kind === 'thread' ? 'View answer' : 'View more',
    false,
    'primary'
  );
}

function signUpEngageBtn(kind, id) {
  var on = false;
  var label = 'Sign up';
  var attrs;
  if (kind === 'session') {
    on = S.booked.indexOf(id) !== -1;
    if (on) label = 'Signed up';
    else if (S.waitlist.indexOf(id) !== -1) {
      label = 'Waitlist';
      on = true;
    }
    attrs = 'data-open="book" data-id="' + esc(id) + '"';
  } else {
    attrs = 'data-open="opp" data-id="' + esc(id) + '"';
  }
  return engageBtn(attrs, iconCal(), label, on, 'primary');
}

function mineFlagsHtml(item) {
  if (!item || !item.mine) return '';
  var html = '<div class="flag-row"><span class="mine-tag">Yours</span>';
  if (item.newReply) html += '<span class="mine-tag alert">New reply</span>';
  html += '</div>';
  return html;
}

function renderQuestionCard(item) {
  return qaRenderCard(item);
}

function renderStoryCard(item) {
  if (typeof oppRenderStoryCard === 'function') return oppRenderStoryCard(item);
  var mine = !!item.mine;
  var anon = !!item.anon;
  var a = item.author ? author(item.author) : null;
  var name = mine && !item.author ? (anon ? studentLabel() : youName()) : a ? a.name : youName();
  var body = item.body || [];
  var i;
  var html =
    '<article class="card feed-card kind-story clickable" ' +
    cardClickAttrs('story', item.id) +
    '>' +
    '<div class="card-head">' +
    avatarHtml(a, anon || (!a && mine), 'story') +
    '<div class="meta">' +
    nameWithBadge(name, anon ? null : a) +
    '<div class="sub">' +
    kindTimeHtml('Story', item.at, item.edited, 'story') +
    '</div></div>' +
    contactAffordance(item.author, mine) +
    cardMoreHtml('story', item.id, mine) +
    '</div><div class="card-body">';
  html += mineFlagsHtml(item);
  if (item.cat) html += '<div class="card-cats">' + catChip(item.cat) + '</div>';
  html += '<h3>' + esc(item.title) + '</h3><div class="card-read">';
  for (i = 0; i < body.length && i < 3; i++) {
    html += '<p>' + esc(body[i]) + '</p>';
  }
  if (body.length > 3) html += '<p class="card-take">' + esc(body[body.length - 1]) + '</p>';
  html += '</div>';
  html += renderImages(item.images, 'card');
  html += '</div>' + postEngageBar(item, 'story', item.id, mine, false) + '</article>';
  return html;
}

function renderOppCard(item) {
  if (typeof oppRenderCard === 'function') return oppRenderCard(item);
  var o = OPPS[item.opp];
  var a;
  var html;
  if (!o || !openingVisible(o)) return '';
  a = author(o.author || item.author || 'desk');
  html =
    '<article class="card feed-card kind-opp opp-card clickable" ' +
    cardClickAttrs('opp', o.id) +
    '>' +
    '<div class="card-head">' +
    avatarHtml(a, false, 'opportunity') +
    '<div class="meta">' +
    nameWithBadge(a.name, a) +
    '<div class="sub">' +
    kindTimeHtml('Opportunity', item.at, item.edited, 'opportunity') +
    '</div></div>' +
    contactAffordance(o.author || item.author, false) +
    cardMoreHtml('opp', o.id, false) +
    '</div><div class="card-body">';
  if (o.cat) html += '<div class="card-cats">' + catChip(o.cat) + '</div>';
  html += '<h3>' + esc(o.name) + '</h3>';
  html +=
    '<p class="card-lead">' +
    esc((o.what && o.what[0]) || o.one || item.text || '') +
    '</p>';
  if (o.what && o.what[1]) html += '<p class="card-more">' + esc(o.what[1]) + '</p>';
  html += '<dl class="card-facts">';
  if (o.season) {
    html += '<div><dt>When</dt><dd>' + esc(o.season) + '</dd></div>';
  }
  if (o.cost) {
    html +=
      '<div><dt>Cost</dt><dd' +
      (/no fee|^free$/i.test(o.cost) ? ' class="d-accent"' : '') +
      '>' +
      esc(o.cost) +
      '</dd></div>';
  }
  if (o.who) html += '<div><dt>Ages</dt><dd>' + esc(o.who) + '</dd></div>';
  if (o.regions) html += '<div><dt>Where</dt><dd>' + esc(o.regions) + '</dd></div>';
  html += '</dl>';
  if ((o.state || 'live') === 'pending' && o.author === currentPosterId()) {
    html += '<p class="wait-line">Waiting for a mentor to check this.</p>';
  }
  html += openingCheckedHtml(o);
  html += renderImages(o.images || item.images, 'card');
  html +=
    '</div>' +
    postEngageBar(item, 'opp', o.id, isOwnCard('opp', o.id, false), false) +
    '</article>';
  return html;
}

function renderSessionCard(item, opts) {
  if (typeof sessRenderCard === 'function') return sessRenderCard(item, opts);
  return '';
}

function renderJourneyCard(item) {
  var j = JOURNEYS[item.journey];
  var a = author(item.journey);
  var html;
  if (!j) return '';
  html =
    '<article class="card feed-card kind-journey journey-card clickable" ' +
    cardClickAttrs('journey', item.journey) +
    '>' +
    '<div class="card-head">' +
    authorLinkWrap(
      authorHitBtn(
        avatarHtml(a, false, 'journey'),
        item.journey,
        'av-hit'
      ) +
        '<div class="meta ident-name">' +
        authorHitBtn(nameWithBadge(a.name, a), item.journey, 'name-hit') +
        '<div class="sub">' +
        kindTimeHtml('Journey', item.at, item.edited, 'journey') +
        '</div></div>'
    ) +
    contactAffordance(item.journey, item.mine) +
    cardMoreHtml('journey', item.journey, item.mine) +
    '</div><div class="card-body">';
  html += mineFlagsHtml(item);
  if (j.field) html += '<div class="card-cats">' + catChip(j.field) + '</div>';
  html += '<h3 class="hook">' + esc(j.hook) + '</h3>';
  if (j.place) html += '<p class="card-place">' + esc(j.place) + '</p>';
  html += journeyPathPreview(j);
  html += '<p class="now-line">Now: ' + esc(j.now) + '</p>';
  html += renderImages(item.images || j.images, 'card');
  html += '</div>';
  html +=
    postEngageBar(
      item,
      'journey',
      item.journey,
      isOwnCard('journey', item.journey, item.mine),
      false
    ) +
    '</article>';
  return html;
}

function journeyPathPreview(j) {
  var html = '';
  var i;
  var start = 0;
  var n = 0;
  var line;
  if (!j.body || !j.body.length) return '';
  if (j.body[0] === j.hook) start = 1;
  html = '<ol class="card-path">';
  for (i = start; i < j.body.length && n < 4; i++) {
    line = j.body[i];
    if (!line || line === j.now) continue;
    html += '<li>' + esc(line) + '</li>';
    n += 1;
  }
  html += '</ol>';
  return n ? html : '';
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
  html += typeof qaFeedLeadHtml === 'function' ? qaFeedLeadHtml() : '';
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

function replyActor(r) {
  if (!r) return { name: 'A student', a: null, anon: true };
  if (r.a) {
    return { name: author(r.a).name, a: author(r.a), anon: false };
  }
  if (r.mine) return { name: studentLabel(), a: null, anon: true };
  return { name: r.who || 'A student', a: null, anon: true };
}

function lastOtherReply(item) {
  var list = (item && item.replies) || [];
  var i;
  var r;
  for (i = list.length - 1; i >= 0; i--) {
    r = list[i];
    if (r && !r.mine) return r;
  }
  return list.length ? list[list.length - 1] : null;
}

function lastMineReplyIndex(item) {
  var list = (item && item.replies) || [];
  var i;
  for (i = list.length - 1; i >= 0; i--) {
    if (list[i] && list[i].mine) return i;
  }
  return -1;
}

function postKindWord(item) {
  if (!item) return 'post';
  if (item.kind === 'question') return 'question';
  if (item.kind === 'story') return 'story';
  return 'post';
}

function postOpenKind(item) {
  if (!item) return 'thread';
  if (item.kind === 'story') return 'story';
  if (item.kind === 'opportunity') return 'opp';
  if (item.kind === 'session') return 'session';
  if (item.kind === 'journey') return 'journey';
  return 'thread';
}

function postOpenId(item) {
  if (!item) return '';
  if (item.kind === 'opportunity') return item.opp || item.id;
  if (item.kind === 'session') return item.session || item.id;
  if (item.kind === 'journey') return item.journey || item.id;
  return item.id;
}

function renderAlertRow(opts) {
  var av = opts.av || avatarHtml(null, true);
  var cls = 'card alert-row' + (opts.isNew ? ' is-new' : '');
  return (
    '<article class="' +
    cls +
    '">' +
    av +
    '<div class="alert-main">' +
    (opts.kicker ? '<p class="alert-kicker">' + esc(opts.kicker) + '</p>' : '') +
    '<h3>' +
    esc(opts.title || '') +
    '</h3>' +
    (opts.body ? '<p class="muted">' + esc(opts.body) + '</p>' : '') +
    '</div>' +
    '<button type="button" class="btn sm" ' +
    (opts.nav
      ? 'data-nav="' + esc(opts.nav) + '"'
      : 'data-open="' + esc(opts.kind || 'thread') + '" data-id="' + esc(opts.id || '') + '"') +
    '>' +
    esc(opts.action || 'Open') +
    '</button></article>'
  );
}

function alertsReplyItems() {
  var mine = [];
  var joined = [];
  var followed = [];
  var i;
  var item;
  var myIdx;
  var later;
  var j;
  var seen = {};
  for (i = 0; i < FEED.length; i++) {
    item = FEED[i];
    if (!item || isHidden(postOpenKind(item), postOpenId(item))) continue;
    if (item.mine && item.replies && item.replies.length) {
      mine.push(item);
      seen[item.id] = true;
    }
  }
  for (i = 0; i < FEED.length; i++) {
    item = FEED[i];
    if (!item || seen[item.id] || isHidden(postOpenKind(item), postOpenId(item))) continue;
    myIdx = lastMineReplyIndex(item);
    if (myIdx === -1) continue;
    later = [];
    for (j = myIdx + 1; j < (item.replies || []).length; j++) {
      if (item.replies[j] && !item.replies[j].mine) later.push(item.replies[j]);
    }
    if (later.length) {
      joined.push({ item: item, later: later });
      seen[item.id] = true;
    }
  }
  for (i = 0; i < S.qFollow.length; i++) {
    item = feedById(S.qFollow[i]);
    if (!item || seen[item.id] || isHidden(postOpenKind(item), postOpenId(item))) continue;
    if (item.replies && item.replies.length) followed.push(item);
  }
  mine.sort(function (a, b) {
    return (b.newReply ? 1 : 0) - (a.newReply ? 1 : 0);
  });
  return { mine: mine, joined: joined, followed: followed };
}

function renderAlertsReplySection() {
  var groups = alertsReplyItems();
  var html = '<section class="section"><h2>Replies</h2>';
  var i;
  var item;
  var r;
  var who;
  var n;
  var kind;
  var any = groups.mine.length + groups.joined.length + groups.followed.length;
  if (!any) {
    html +=
      '<p class="muted">' +
      (S.onboarded
        ? 'No replies on your posts yet. When someone answers a question you posted or a thread you joined, it lands here.'
        : 'Replies to your posts will show here after you post.') +
      '</p></section>';
    return html;
  }
  for (i = 0; i < groups.mine.length; i++) {
    item = groups.mine[i];
    r = lastOtherReply(item);
    who = replyActor(r);
    n = item.replies.length;
    kind = postKindWord(item);
    html += renderAlertRow({
      av: avatarHtml(who.a, who.anon),
      kicker: item.newReply ? 'New reply' : 'Reply',
      title: who.name + ' replied to your ' + kind,
      body:
        (r && r.text ? r.text : item.title || '') +
        (n > 1 ? ' · ' + n + ' replies' : ''),
      kind: postOpenKind(item),
      id: postOpenId(item),
      isNew: !!item.newReply,
      action: 'Open'
    });
  }
  for (i = 0; i < groups.joined.length; i++) {
    item = groups.joined[i].item;
    r = groups.joined[i].later[groups.joined[i].later.length - 1];
    who = replyActor(r);
    html += renderAlertRow({
      av: avatarHtml(who.a, who.anon),
      kicker: 'On a thread you joined',
      title: who.name + ' replied after you',
      body: item.title || (r && r.text) || '',
      kind: postOpenKind(item),
      id: postOpenId(item),
      isNew: false,
      action: 'Open'
    });
  }
  for (i = 0; i < groups.followed.length; i++) {
    item = groups.followed[i];
    r = lastOtherReply(item);
    who = replyActor(r);
    n = item.replies.length;
    html += renderAlertRow({
      av: avatarHtml(who.a, who.anon),
      kicker: 'Question you follow',
      title: who.name + ' replied to a question you follow',
      body: item.title + (n ? ' · ' + n + ' replies' : ''),
      kind: postOpenKind(item),
      id: postOpenId(item),
      isNew: false,
      action: 'Open'
    });
  }
  html += '</section>';
  return html;
}

function renderAlertsCheckSection() {
  var list = canCheckOpenings() ? openingsToCheck() : [];
  var html;
  var i;
  var o;
  var a;
  if (!list.length) return '';
  html = '<section class="section"><h2>Needs a look · ' + list.length + '</h2>';
  html += '<p class="muted">Openings waiting for a mentor check before they go live.</p>';
  for (i = 0; i < list.length; i++) {
    o = list[i];
    a = author(o.author);
    html +=
      '<article class="card alert-row alert-check">' +
      avatarHtml(a, false) +
      '<div class="alert-main"><p class="alert-kicker">Opening to check</p><h3>' +
      esc(o.name) +
      '</h3><p class="muted">' +
      esc(a.name || 'Unknown') +
      '</p></div>' +
      '<div class="alert-acts">' +
      '<button type="button" class="btn sm" data-opp-live="' +
      esc(o.id) +
      '">Looks right, publish it</button>' +
      '<button type="button" class="btn sm g" data-opp-return="' +
      esc(o.id) +
      '">Send it back</button></div></article>';
  }
  html += '</section>';
  return html;
}

function renderAlertsYourSessions() {
  var booked = [];
  var waiting = [];
  var i;
  var s;
  var html;
  for (i = 0; i < SESSIONS.length; i++) {
    s = SESSIONS[i];
    if (S.booked.indexOf(s.id) !== -1) booked.push(s);
    else if (S.waitlist.indexOf(s.id) !== -1) waiting.push(s);
  }
  html = '<section class="section"><h2>Your sessions</h2>';
  if (!booked.length && !waiting.length) {
    html +=
      '<p class="muted">' +
      (S.onboarded
        ? 'No place held yet. Book a pod below and it will sit here with the time and how to join.'
        : 'Book a place and it will show here.') +
      '</p></section>';
    return html;
  }
  if (booked.length) {
    html += '<p class="muted">Sessions you have a place in.</p>';
    for (i = 0; i < booked.length; i++) html += renderSessionMini(booked[i]);
  }
  if (waiting.length) {
    html += '<p class="muted">Waitlist. You move up if someone cancels.</p>';
    for (i = 0; i < waiting.length; i++) html += renderSessionMini(waiting[i]);
  }
  html += '</section>';
  return html;
}

function renderAlertsComingUp() {
  var stageFilter = S.sessionStage || '';
  var st = stageFilter ? stageByKey(stageFilter) : null;
  var html = '<section class="section"><h2>Coming up</h2>';
  var i;
  var s;
  var shown = 0;
  if (st) {
    html +=
      '<p class="muted">Sessions for ' +
      esc(st.name) +
      '. <button type="button" class="btn q" data-clear-stage="1">Show all</button></p>';
  } else {
    html += '<p class="muted">Live pods you can still book.</p>';
  }
  for (i = 0; i < SESSIONS.length; i++) {
    s = SESSIONS[i];
    if (S.booked.indexOf(s.id) !== -1 || S.waitlist.indexOf(s.id) !== -1) continue;
    if (stageFilter && s.stages.indexOf(stageFilter) === -1) continue;
    html += renderSessionMini(s);
    shown++;
  }
  if (!shown) html += '<p class="muted">No other sessions matched yet.</p>';
  html += '</section>';
  return html;
}

function renderAlertsOpenings() {
  var html =
    '<section class="section"><h2>Openings</h2>' +
    '<p class="muted">Programmes currently open for youth in Guyana.</p>';
  var k;
  var o;
  var i;
  var open = [];
  var later = [];
  var list;
  for (k in OPPS) {
    if (!OPPS.hasOwnProperty(k)) continue;
    o = OPPS[k];
    if (!openingVisible(o)) continue;
    if (S.onboarded && S.stage && oppOpenAtStage(o, S.stage)) open.push(o);
    else later.push(o);
  }
  list = open.length ? open.concat(later.filter(function (x) { return open.indexOf(x) === -1; })) : later;
  if (!list.length) html += '<p class="muted">No opportunities listed yet.</p>';
  for (i = 0; i < list.length; i++) {
    o = list[i];
    html +=
      '<div class="card sess-opp">' +
      '<div class="card-cats">' +
      catChip(o.cat || 'Opportunity', false) +
      (o.independent ? '<span class="cat-chip soft">Self-entry</span>' : '') +
      (S.onboarded && oppOpenAtStage(o, S.stage) ? '<span class="cat-chip soft open">Open for you</span>' : '') +
      (isSaved(o.id) ? '<span class="cat-chip soft">Saved</span>' : '') +
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
      '">Open</button>' +
      '<button type="button" class="btn sm g" data-save="' +
      esc(o.id) +
      '">' +
      (isSaved(o.id) ? 'Saved' : 'Save') +
      '</button></div></div>';
  }
  html +=
    '<p class="footer-note">Dates, fees and requirements are illustrative in this prototype and must be confirmed with the organiser.</p></section>';
  return html;
}

function renderAlertsSaved() {
  var i;
  var saved;
  var html;
  var any = false;
  if (!S.saved.length) return '';
  html = '<section class="section"><h2>Saved</h2><p class="muted">Posts and openings you kept for later.</p>';
  for (i = 0; i < S.saved.length; i++) {
    saved = savedTarget(S.saved[i]);
    if (!saved) continue;
    any = true;
    html += renderAlertRow({
      av: '<span class="av av-desk" aria-hidden="true">S</span>',
      kicker: saved.sub,
      title: saved.title,
      body: 'Saved by you',
      kind: saved.kind,
      id: saved.id,
      isNew: false,
      action: 'Open'
    });
  }
  if (!any) return '';
  html += '</section>';
  return html;
}

function renderAlertsDecision() {
  var st;
  var days;
  var body;
  if (!S.onboarded || !S.stage) return '';
  st = stageByKey(S.stage);
  if (!st || !st.dec) return '';
  days = daysUntil(st.dec.due);
  if (days == null) body = st.dec.why || '';
  else if (days === 0) body = 'Due today. ' + (st.dec.why || '');
  else body = days + ' days left. ' + (st.dec.why || '');
  return (
    '<section class="section"><h2>Your next decision</h2>' +
    renderAlertRow({
      av: '<span class="av" aria-hidden="true">P</span>',
      kicker: S.form || 'Pathway',
      title: st.dec.t,
      body: body,
      nav: 'pathway',
      action: 'Open pathway'
    }) +
    '</section>'
  );
}

function renderAlertsPage() {
  var html = '<div class="page-alerts">';
  html += '<h1>Alerts</h1>';
  html +=
    '<p class="lede">Sessions you booked, replies on your posts, and programmes still open.</p>';
  html += renderAlertsCheckSection();
  html += renderAlertsReplySection();
  html += renderAlertsYourSessions();
  html += renderAlertsDecision();
  html += renderAlertsComingUp();
  html += renderAlertsSaved();
  html += renderAlertsOpenings();
  html += '</div>';
  return html;
}

function renderSessionsPage() {
  return renderAlertsPage();
}

function personById(id) {
  return PEOPLE[id] || null;
}

function personIds() {
  var ids = [];
  var k;
  for (k in PEOPLE) {
    if (!PEOPLE.hasOwnProperty(k)) continue;
    if (PEOPLE[k].role === 'mentor' || PEOPLE[k].role === 'contributor') ids.push(k);
  }
  return ids;
}

function personSearchHay(p) {
  return [p.name, p.career, p.title, p.region].join(' ').toLowerCase();
}

function personMatches(id) {
  var p = personById(id);
  var q;
  if (!p) return false;
  if (p.role !== 'mentor' && p.role !== 'contributor') return false;
  if (S.commRole === 'mentors' && p.role !== 'mentor') return false;
  if (S.commRole === 'contributors' && p.role !== 'contributor') return false;
  if (S.commCareer && p.career !== S.commCareer) return false;
  q = (S.commQ || '').trim().toLowerCase();
  if (q && personSearchHay(p).indexOf(q) === -1) return false;
  return true;
}

function sortPersonIds(ids) {
  return ids.slice().sort(function (a, b) {
    var pa = personById(a);
    var pb = personById(b);
    return (pa.name || '').toLowerCase() < (pb.name || '').toLowerCase() ? -1 : 1;
  });
}

function filteredPeople() {
  var ids = personIds();
  var out = [];
  var i;
  for (i = 0; i < ids.length; i++) {
    if (personMatches(ids[i])) out.push(ids[i]);
  }
  return sortPersonIds(out);
}

function followedPeople() {
  var seen = {};
  var raw = S.follow.concat(S.following);
  var ids = [];
  var i;
  var id;
  for (i = 0; i < raw.length; i++) {
    id = raw[i];
    if (seen[id]) continue;
    seen[id] = true;
    if (personMatches(id) && isFollowing(id)) ids.push(id);
  }
  return sortPersonIds(ids);
}

function personFollowBtn(id, extraCls) {
  return followPersonBtn(id, extraCls);
}

function personCardHtml(id) {
  var p = personById(id);
  var a = author(id);
  var html;
  if (!p) return '';
  html =
    '<article class="pcard">' +
    '<div class="pcard-cover ' +
    esc(p.av || 'av-1') +
    '" aria-hidden="true"></div>' +
    '<button type="button" class="pcard-main" data-open="person" data-id="' +
    esc(id) +
    '">' +
    '<span class="pcard-av av ' +
    esc(p.av || 'av-1') +
    '" aria-hidden="true">' +
    esc(a.init || p.name.charAt(0)) +
    '</span>' +
    '<strong class="pcard-name">' +
    esc(p.name) +
    '</strong>' +
    '<span class="pcard-badge">' +
    roleBadgeHtml(a) +
    '</span>' +
    '<span class="pcard-title">' +
    esc(p.title) +
    '</span>' +
    '</button>' +
    followPersonBtn(id, 'pcard-follow') +
    '</article>';
  return html;
}

function personCardsHtml(ids) {
  var html = '<div class="pcards">';
  var i;
  for (i = 0; i < ids.length; i++) html += personCardHtml(ids[i]);
  html += '</div>';
  return html;
}

function personPosts(id) {
  var p = personById(id);
  var listed = (p && p.posts) || [];
  var out = [];
  var seen = {};
  var i;
  var row;
  var item;
  var s;
  var key;
  function add(kind, pid) {
    var k = kind + ':' + pid;
    if (seen[k]) return;
    seen[k] = true;
    out.push({ kind: kind, id: pid });
  }
  for (i = 0; i < listed.length; i++) {
    row = listed[i];
    if (row && row.kind && row.id) add(row.kind, row.id);
  }
  for (i = 0; i < FEED.length; i++) {
    item = FEED[i];
    if (item.kind === 'question') continue;
    if (item.author === id) {
      if (item.kind === 'story') add('story', item.id);
      if (item.kind === 'journey') add('journey', item.journey || id);
    }
    if (item.kind === 'session' && item.session) {
      s = sessionById(item.session);
      if (s && (s.hosted_by === id || s.lead === id)) add('session', s.id);
    }
  }
  return out;
}

/* Pathway helpers and render continue in app-views.js / assembled file */
