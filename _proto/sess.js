/* Session card, sheet, booking, and two-step host composer.
   Matches Q&A / Opportunity / Story type, tokens, clamp, menus, and toasts. */

function ensureSess() {
  if (!S.sess) {
    S.sess = {
      dialog: '',
      dialogId: '',
      step: 1,
      title: '',
      description: '',
      topic: '',
      tagQ: '',
      tagIx: -1,
      poster: null,
      posterAlt: '',
      linkUrl: '',
      dateVal: '',
      timeVal: '',
      minutes: 60,
      format: 'online',
      where: '',
      joinLink: '',
      who: '',
      signupUrl: '',
      editId: '',
      createdAt: '',
      bookName: '',
      bookEmail: '',
      bookQ: '',
      bookAlerts: false,
      reportReason: '',
      lastFocus: null
    };
  }
  if (!S.sessBookings) S.sessBookings = [];
  return S.sess;
}

function sessHydrateOne(s) {
  var starts = {
    's-sci': '2026-09-12T17:00:00-04:00',
    's-clinic': '2026-09-16T18:30:00-04:00',
    's-trades': '2026-09-18T18:00:00-04:00',
    's-tech': '2026-09-20T16:00:00-04:00',
    's-sport': '2026-09-21T17:30:00-04:00',
    's-media': '2026-09-23T18:30:00-04:00',
    's-fork': '2026-09-29T18:30:00-04:00'
  };
  var who = {
    's-sci': 'Form 5 and CAPE considering medicine',
    's-clinic': 'Students sitting Biology or Chemistry',
    's-trades': 'Form 3 to 5 considering a trade',
    's-tech': 'Anyone building a first portfolio',
    's-sport': 'Students in community leagues',
    's-media': 'Students making work for school or clients',
    's-fork': 'Form 5 after CSEC'
  };
  var i;
  if (!s) return s;
  if (!s.status) s.status = 'published';
  if (!s.authorId) s.authorId = s.hosted_by || s.lead || '';
  if (!s.startsAt) s.startsAt = starts[s.id] || '';
  if (!s.minutes) s.minutes = 60;
  if (!s.format) s.format = 'online';
  if (!s.where) s.where = s.platform || 'Google Meet';
  if (!s.who) s.who = who[s.id] || s.pod || 'Students';
  if (s.registrationOpen == null) s.registrationOpen = true;
  if (!s.topic) s.topic = s.cat ? hashTagLabel(s.cat) : '';
  if (!s.description) s.description = s.what || '';
  if (!s.createdAt) s.createdAt = s.startsAt || nowIso();
  if (!s.bookings) s.bookings = [];
  if (!s.replies) {
    s.replies = [];
    if (s.qs && s.qs.length) {
      for (i = 0; i < s.qs.length; i++) {
        s.replies.push({
          id: s.id + '-r' + i,
          who: 'Form 5 student, Region 4',
          text: s.qs[i],
          createdAt: s.startsAt || nowIso(),
          authorRole: 'student'
        });
      }
    }
  }
  if (s.inspiredCount == null) s.inspiredCount = 0;
  if (s.joinLink == null && s.format === 'online') {
    s.joinLink = 'https://meet.google.com/nsg-' + String(s.id).replace(/^s-/, '');
  }
  return s;
}

function sessHydrateAll() {
  var i;
  for (i = 0; i < SESSIONS.length; i++) sessHydrateOne(SESSIONS[i]);
}

function sessOverlayOpen() {
  if (S.sess && S.sess.dialog) return true;
  if (NAV.length && NAV[NAV.length - 1].t === 'session') return true;
  return false;
}

function sessFeedFor(sid) {
  var i;
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].kind === 'session' && (FEED[i].session === sid || FEED[i].id === sid)) return FEED[i];
  }
  return null;
}

function sessModel(src) {
  var s;
  var item;
  var a;
  var aid;
  var kind;
  if (!src) return null;
  if (src._card) return src;
  if (typeof src === 'string') {
    s = sessionById(src);
    item = sessFeedFor(src);
  } else if (src.kind === 'session') {
    item = src;
    s = sessionById(src.session || src.id);
  } else {
    s = src;
    item = sessFeedFor(src.id);
  }
  if (!s || s.status === 'cancelled') return null;
  sessHydrateOne(s);
  aid = s.authorId || s.hosted_by || s.lead || '';
  a = author(aid);
  kind = oppAuthorKind(a);
  return {
    _card: true,
    id: s.id,
    status: s.status || 'published',
    authorId: aid,
    author: {
      id: aid,
      name: a.name,
      initials: oppInitials(a),
      kind: kind,
      verified: !!(a && a.verified),
      role: kind === 'collaborator' ? 'Collaborator' : 'Mentor',
      pos: (a && a.pos) || ''
    },
    createdAt: (item && item.at) || s.createdAt || s.startsAt || '',
    editedAt: (item && (item.editedAt || item.edited)) || s.editedAt || '',
    title: s.title,
    description: s.description || s.what || '',
    topic: s.topic || (s.cat ? hashTagLabel(s.cat) : ''),
    startsAt: s.startsAt,
    minutes: s.minutes || 60,
    format: s.format || 'online',
    where: s.where || s.platform || '',
    who: s.who || s.pod || '',
    registrationOpen: s.registrationOpen !== false,
    signupUrl: s.signupUrl || '',
    poster: s.poster || null,
    link: s.link || null,
    bookings: s.bookings || [],
    replies: s.replies || (item && item.replies) || [],
    inspiredCount: s.inspiredCount || (item && (item.insp || item.inspiredCount)) || 0,
    src: s,
    item: item
  };
}

function sessOwns(s) {
  var viewer = currentPosterId();
  if (!s || !viewer) return false;
  return s.authorId === viewer;
}

function sessIsOver(s) {
  return sessEndsAt(s) <= Date.now();
}

function sessIsLive(s) {
  var start = sessStartsAt(s);
  var end = sessEndsAt(s);
  var now = Date.now();
  return start <= now && now < end;
}

function sessStartsAt(s) {
  if (!s || !s.startsAt) return 0;
  return new Date(s.startsAt).getTime();
}

function sessEndsAt(s) {
  return sessStartsAt(s) + (s.minutes || 60) * 60000;
}

function sessLengthLabel(mins) {
  var h;
  var m;
  mins = parseInt(mins, 10) || 0;
  if (mins === 60) return '1 hour';
  if (mins < 60) return mins + (mins === 1 ? ' minute' : ' minutes');
  h = Math.floor(mins / 60);
  m = mins % 60;
  if (!m) return h === 1 ? '1 hour' : h + ' hours';
  return h + (h === 1 ? ' hour ' : ' hours ') + m + ' minutes';
}

function sessWhereLabel(s) {
  if (s.format === 'inperson') return s.where || '';
  return 'Online · ' + (s.where || 'Google Meet');
}

function sessHasPlace(id) {
  var i;
  var uid = qaViewerId() || currentPosterId() || 'me';
  var any = false;
  for (i = 0; i < (S.sessBookings || []).length; i++) {
    if (S.sessBookings[i].sessionId !== id) continue;
    any = true;
    if (S.sessBookings[i].userId === uid) return true;
  }
  if (any) return false;
  return !!(qaIsStudent() && S.booked && S.booked.indexOf(id) !== -1);
}

function sessMyBooking(id) {
  var i;
  var uid = qaViewerId ? qaViewerId() : currentPosterId() || 'me';
  for (i = 0; i < (S.sessBookings || []).length; i++) {
    if (S.sessBookings[i].sessionId === id && S.sessBookings[i].userId === uid) return S.sessBookings[i];
  }
  return null;
}

function sessCanSeeJoin(s) {
  var left;
  if (!s || s.format !== 'online') return false;
  if (!sessHasPlace(s.id)) return false;
  left = sessStartsAt(s) - Date.now();
  return left <= 3600000;
}

function sessJoinUrl(s) {
  if (!sessCanSeeJoin(s)) return '';
  return (s.src && s.src.joinLink) || s.joinLink || '';
}

function sessClockTime(ms) {
  var d = new Date(ms);
  var h = d.getHours();
  var m = d.getMinutes();
  var ap = h >= 12 ? 'PM' : 'AM';
  var h12 = h % 12 || 12;
  var mm = m < 10 ? '0' + m : String(m);
  return h12 + ':' + mm + ' ' + ap;
}

function sessFullWhen(ms) {
  var d = new Date(ms);
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[d.getDay()] + ' ' + countDownWhen(ms);
}

function sessCountState(s) {
  var start = sessStartsAt(s);
  var left;
  var u;
  var text;
  if (!start) return null;
  if (sessIsOver(s)) {
    return { tone: 'done', text: 'Finished · ' + oppDateLabel(s.startsAt) };
  }
  if (sessIsLive(s)) return { tone: 'now', text: 'Happening now' };
  left = start - Date.now();
  u = countDownUnits(left);
  text = 'Starts in ' + u.n + ' ' + u.unit;
  if (left >= 48 * 3600000) text += ' · ' + countDownWhen(start);
  else if (left >= 3600000) text += ' · ' + sessClockTime(start);
  return { tone: 'soon', text: text };
}

function sessIsUrgent(s) {
  var left = sessStartsAt(s) - Date.now();
  return left > 0 && left <= 14 * 86400000;
}

function sessCountHtml(s) {
  var c = sessCountState(s);
  if (!c) return '';
  return (
    '<div class="sess-count is-' +
    c.tone +
    '">' +
    (c.tone === 'now' ? '<span class="sess-dot" aria-hidden="true"></span>' : oppIconClock()) +
    '<span>' +
    esc(c.text) +
    '</span></div>'
  );
}

function sessFollowHtml(s, preview) {
  var on;
  if (preview || sessOwns(s) || !s.authorId) return '';
  on = isFollowing(s.authorId);
  return (
    '<button type="button" class="story-follow" data-story-follow="' +
    esc(s.authorId) +
    '" aria-pressed="' +
    (on ? 'true' : 'false') +
    '">' +
    (on ? 'Following' : '+ Follow') +
    '</button>'
  );
}

function sessMenuHtml(s) {
  var key = hideKey('session', s.id);
  var open = S.menu === key;
  var over = sessIsOver(s);
  var booked = sessHasPlace(s.id);
  var html =
    '<div class="qa-more">' +
    '<button type="button" class="qa-more-btn" data-menu="' +
    esc(key) +
    '" aria-label="More actions" aria-haspopup="true" aria-expanded="' +
    (open ? 'true' : 'false') +
    '">' +
    qaIconMore(22) +
    '</button>';
  if (open) {
    html += '<div class="qa-menu" role="menu">';
    if (sessOwns(s)) {
      html += qaMenuItem('data-sess-edit="' + esc(s.id) + '"', 'Edit this session', false);
      if (!over) {
        html += qaMenuItem(
          'data-sess-reg="' + esc(s.id) + '"',
          s.registrationOpen ? 'Close registration' : 'Open registration',
          false
        );
      }
      html += '<hr/>';
      html += qaMenuItem('data-sess-cancel="' + esc(s.id) + '"', 'Cancel the session', true);
    } else if (booked) {
      html += qaMenuItem('data-sess-edit-q="' + esc(s.id) + '"', 'Change my question', false);
      html += '<hr/>';
      html += qaMenuItem('data-sess-giveup="' + esc(s.id) + '"', 'Give up my place', true);
    } else {
      html += qaMenuItem('data-sess-hide="' + esc(key) + '"', 'Not interested', false);
      html += '<hr/>';
      html += qaMenuItem('data-sess-report="' + esc(s.id) + '"', 'Report a problem', true);
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function sessAuthorHtml(s, opts) {
  var when = qaTimeAgo(s.createdAt);
  var aid = opts && opts.preview ? '' : s.authorId || '';
  var role = s.author.role + (s.author.pos ? ' · ' + s.author.pos : '');
  var face =
    oppAvHtml(s, 48) +
    '<div class="ident-name"><div class="opp-name"><span class="ident-text">' +
    esc(s.author.name) +
    '</span>' +
    (s.author.verified ? qaTickSvg() + '<span class="sr">Verified</span>' : '') +
    '</div><p class="opp-role">' +
    esc(role) +
    '</p></div>';
  return (
    '<div class="sess-author"><div class="sess-main">' +
    authorHitBtn(face, aid, 'sess-face') +
    '<p class="sess-kind"><span>' +
    kindOpenBtn('session', 'Session') +
    (when ? ' · ' + esc(when) : '') +
    (s.editedAt ? ' · edited' : '') +
    '</span></p></div><div class="sess-tools">' +
    sessFollowHtml(s, !!(opts && opts.preview)) +
    (opts && opts.preview ? '' : sessMenuHtml(s)) +
    '</div></div>'
  );
}

function sessGlanceHtml(s) {
  function item(icon, dt, val) {
    return (
      '<div class="g"><span class="gi" aria-hidden="true">' +
      icon +
      '</span><div><dt class="sr">' +
      esc(dt) +
      '</dt><dd>' +
      esc(val || '') +
      '</dd></div></div>'
    );
  }
  return (
    '<dl class="glance">' +
    item(oppIconPerson(), 'Who it is for', s.who) +
    item(oppIconPin(), 'Where', sessWhereLabel(s)) +
    item(oppIconClock(), 'How long', sessLengthLabel(s.minutes)) +
    '</dl>'
  );
}

function sessPrimaryLabel(s) {
  if (sessHasPlace(s.id)) return { label: 'You have a place', cls: 'have', disabled: false };
  if (sessIsOver(s) || !s.registrationOpen) return { label: 'Registration closed', cls: '', disabled: true };
  return { label: 'Book a place', cls: '', disabled: false };
}

function sessEngageHtml(s, opts) {
  var n = s.replies ? s.replies.length : 0;
  var inspired = isInspired(s.id);
  var saved = isSaved(s.id);
  var replyLabel = n === 0 ? 'Reply' : n === 1 ? '1 reply' : n + ' replies';
  var inspN = s.inspiredCount || 0;
  var prim = sessPrimaryLabel(s);
  var html = '<div class="qa-actions opp-actions">';
  html +=
    '<button type="button" class="qa-act is-inspired" data-inspire="' +
    esc(s.id) +
    '" aria-pressed="' +
    (inspired ? 'true' : 'false') +
    '">' +
    qaIconHeart(inspired) +
    '<span>' +
    (inspN ? 'Inspired ' + inspN : 'Inspired') +
    '</span></button>';
  if (!opts || !opts.inSheet) {
    html +=
      '<button type="button" class="qa-act" data-open="session" data-id="' +
      esc(s.id) +
      '">' +
      qaIconReply() +
      '<span>' +
      esc(replyLabel) +
      '</span></button>';
  }
  html +=
    '<button type="button" class="qa-act is-save" data-save="' +
    esc(s.id) +
    '" aria-pressed="' +
    (saved ? 'true' : 'false') +
    '">' +
    qaIconSave(saved) +
    '<span>' +
    (saved ? 'Saved' : 'Save') +
    '</span></button>';
  html +=
    '<button type="button" class="sess-primary' +
    (prim.cls ? ' ' + prim.cls : '') +
    '" data-sess-book="' +
    esc(s.id) +
    '"' +
    (prim.disabled ? ' disabled' : '') +
    '>' +
    esc(prim.label) +
    '</button>';
  html += '</div>';
  return html;
}

function sessBookedNoteHtml(s) {
  var venue;
  if (!sessHasPlace(s.id)) return '';
  if (s.format === 'inperson') {
    venue = s.where || 'the venue';
    return (
      '<div class="sess-booked"><p>Your place is booked. We alert you in the app the day before. Come to ' +
      esc(venue) +
      '.</p></div>'
    );
  }
  if (sessCanSeeJoin(s)) {
    return '<div class="sess-booked"><p>Your place is booked and the session is about to start.</p></div>';
  }
  return (
    '<div class="sess-booked"><p>Your place is booked. The joining link appears here an hour before, and we alert you in the app the day before.</p></div>'
  );
}

function sessJoinHtml(s) {
  var url;
  if (s.format !== 'online') return '';
  if (sessCanSeeJoin(s)) {
    url = sessJoinUrl(s);
    if (!url) return '<p class="sess-lock">The joining link is not set yet.</p>';
    return (
      '<a class="sess-join" href="' +
      esc(url) +
      '" target="_blank" rel="noopener">Join on Google Meet</a>'
    );
  }
  if (sessHasPlace(s.id)) {
    return '<p class="sess-lock">The joining link appears here an hour before the session starts. We alert you in the app at the same time.</p>';
  }
  return '<p class="sess-lock">Book a place and the joining link appears here an hour before.</p>';
}

function sessRenderCard(item, opts) {
  var s = sessModel(item);
  var html;
  opts = opts || {};
  if (!s) return '';
  if (!opts.preview && isHidden('session', s.id)) return '';
  html =
    '<article class="card feed-card kind-sess sess-card' +
    (sessIsOver(s) ? ' finished' : '') +
    (opts.preview ? ' opp-preview' : ' clickable') +
    '" ' +
    (opts.preview ? '' : cardClickAttrs('session', s.id)) +
    '><div class="sess-pad">';
  html += sessAuthorHtml(s, opts);
  html +=
    '<h3 class="sess-title' +
    (opts.preview ? '' : ' qa-clamp') +
    '"' +
    (opts.preview ? '' : ' data-qa-clamp="st-' + esc(s.id) + '"') +
    '>' +
    esc(s.title) +
    '</h3>';
  html +=
    '<p class="sess-desc' +
    (opts.preview ? '' : ' qa-clamp') +
    '"' +
    (opts.preview ? '' : ' data-qa-clamp="sd-' + esc(s.id) + '"') +
    '>' +
    esc(s.description) +
    '</p>';
  html += oppTopicHtml(s.topic);
  html += oppPosterHtml(s.poster, 'feed');
  html += oppLinkHtml(s.link);
  html += sessCountHtml(s);
  if (sessHasPlace(s.id) && !opts.preview) html += sessBookedNoteHtml(s);
  html += '</div>';
  html += sessGlanceHtml(s);
  html += sessEngageHtml(s, { inSheet: false });
  html += '</article>';
  return html;
}

function sessFactsHtml(s) {
  var html = '<div class="sess-facts"><h3>The details</h3><dl>';
  html += '<div class="row"><dt>When</dt><dd>' + esc(sessFullWhen(sessStartsAt(s))) + '</dd></div>';
  html += '<div class="row"><dt>How long</dt><dd>' + esc(sessLengthLabel(s.minutes)) + '</dd></div>';
  html += '<div class="row"><dt>Where</dt><dd>' + esc(sessWhereLabel(s)) + '</dd></div>';
  html += '<div class="row"><dt>Who</dt><dd>' + esc(s.who) + '</dd></div>';
  html += '<div class="row"><dt>Host</dt><dd>' + esc(s.author.name) + '</dd></div>';
  html += '</dl></div>';
  return html;
}

function sessHostPanelHtml(s) {
  var n = 0;
  var i;
  var html;
  if (!sessOwns(s)) return '';
  for (i = 0; i < (s.bookings || []).length; i++) {
    if (s.bookings[i].question) n += 1;
  }
  html = '<div class="sess-host"><h3>Your session</h3>';
  html += '<p>Registration ' + (s.registrationOpen ? 'open' : 'closed') + '</p>';
  html += '<p>' + n + (n === 1 ? ' question in' : ' questions in') + '</p>';
  if (s.signupUrl) html += '<p>Sign-up: on your own site</p>';
  else if ((s.src && s.src.joinLink) || s.joinLink) html += '<p>Set — released an hour before</p>';
  else html += '<p>Not set yet</p>';
  html += '</div>';
  return html;
}

function sessAsksHtml(s) {
  var html;
  var i;
  var b;
  var list;
  if (!sessOwns(s)) return '';
  list = [];
  for (i = 0; i < (s.bookings || []).length; i++) {
    if (s.bookings[i].question) list.push(s.bookings[i]);
  }
  html = '<div class="sess-asks"><h3>What students have asked</h3>';
  if (!list.length) html += '<p>No questions in yet.</p>';
  for (i = 0; i < list.length; i++) {
    b = list[i];
    html +=
      '<div class="sess-ask"><strong>' +
      esc((b.form || 'Student') + (b.region ? ', ' + b.region : '')) +
      '</strong><span>' +
      esc(b.question) +
      '</span></div>';
  }
  html +=
    '<p class="sess-note">Only the form and region is shown to you, never a name or an email.</p></div>';
  return html;
}

function sessRepliesHtml(s) {
  var list = s.replies || [];
  var html = '';
  var i;
  var n;
  var fake = { id: s.id, replies: list };
  var host = sessOwns(s);
  html +=
    '<p class="opp-replies-h">' +
    (list.length
      ? list.length + (list.length === 1 ? ' reply, oldest first' : ' replies, oldest first')
      : 'No replies yet') +
    '</p>';
  for (i = 0; i < list.length; i++) {
    n = qaNormReply(list[i]);
    html += '<div class="qa-thread-item">';
    html += qaReplyHeadHtml(n, fake, true, n.createdAt);
    html += qaBodyHtml(n.text);
    html += '</div>';
  }
  html +=
    '<div class="qa-compose"><p class="qa-compose-label">' +
    (host ? 'Answer here' : 'Ask about this session') +
    '</p><div class="qa-compose-grid">' +
    qaYouAv() +
    '<div class="qa-compose-field"><textarea id="sess-reply" rows="1" placeholder="Add a question or something you know…"></textarea>' +
    '<div class="qa-compose-foot"><p class="qa-note">' +
    (qaIsStudent() || oppIsParent() ? 'Please be respectful.' : '') +
    '</p><button type="button" class="qa-post" id="sess-post" data-sess-reply="' +
    esc(s.id) +
    '" disabled>Reply</button></div></div></div></div>';
  return html;
}

function sessSheetHtml(s) {
  var html = '<div class="sess-sheet" tabindex="-1">';
  html += sessAuthorHtml(s, {});
  html += '<h3 class="sess-title">' + esc(s.title) + '</h3>';
  html += oppTopicHtml(s.topic);
  html += sessCountHtml(s);
  html += '<p class="sess-desc" style="white-space:pre-wrap">' + esc(s.description) + '</p>';
  html += oppPosterHtml(s.poster, 'sheet');
  html += oppLinkHtml(s.link);
  html += sessFactsHtml(s);
  html += sessJoinHtml(s);
  html += sessBookedNoteHtml(s);
  if (sessCanSeeJoin(s) && s.format === 'online') {
    /* join button already in sessJoinHtml */
  }
  html += sessEngageHtml(s, { inSheet: true });
  html += sessHostPanelHtml(s);
  html += sessAsksHtml(s);
  html += sessRepliesHtml(s);
  html += '</div>';
  return html;
}

function sessSortSoonest(list) {
  return list.slice().sort(function (a, b) {
    var sa = sessModel(a);
    var sb = sessModel(b);
    var overA = sa ? (sessIsOver(sa) ? 1 : 0) : 0;
    var overB = sb ? (sessIsOver(sb) ? 1 : 0) : 0;
    if (overA !== overB) return overA - overB;
    return (sa ? sessStartsAt(sa) : 0) - (sb ? sessStartsAt(sb) : 0);
  });
}

function sessBookedCount() {
  var n = 0;
  var seen = {};
  var i;
  var s;
  var id;
  var uid = qaViewerId() || currentPosterId() || 'me';
  for (i = 0; i < (S.sessBookings || []).length; i++) {
    if (S.sessBookings[i].userId !== uid) continue;
    id = S.sessBookings[i].sessionId;
    s = sessModel(id);
    if (!s || sessIsOver(s) || seen[id]) continue;
    seen[id] = true;
    n += 1;
  }
  if (n) return n;
  if (!qaIsStudent()) return 0;
  for (i = 0; i < (S.booked || []).length; i++) {
    id = S.booked[i];
    s = sessModel(id);
    if (!s || sessIsOver(s) || seen[id]) continue;
    seen[id] = true;
    n += 1;
  }
  return n;
}

function sessStudentLineHtml() {
  var n = sessBookedCount();
  if (n) {
    return (
      '<p class="sess-student-line">' +
      n +
      (n === 1 ? ' session booked' : ' sessions booked') +
      ' — we alert you in the app the day before</p>'
    );
  }
  return '<p class="sess-student-line">No sessions booked yet — book a place and we will alert you before it starts</p>';
}

function sessHostWarnHtml() {
  var viewer = currentPosterId();
  var i;
  var s;
  var left;
  var best = null;
  var bestLeft = Infinity;
  var u;
  if (!viewer) return '';
  for (i = 0; i < SESSIONS.length; i++) {
    s = sessModel(SESSIONS[i]);
    if (!s || s.authorId !== viewer || sessIsOver(s)) continue;
    left = sessStartsAt(s) - Date.now();
    if (left <= 0 || left > 14 * 86400000) continue;
    if (left < bestLeft) {
      bestLeft = left;
      best = s;
    }
  }
  if (!best) return '';
  u = countDownUnits(bestLeft);
  return (
    '<p class="sess-lead-line">Your "' +
    esc(best.title) +
    '" starts in ' +
    u.n +
    ' ' +
    u.unit +
    '</p>'
  );
}

function sessToday() {
  var d = new Date();
  var m = d.getMonth() + 1;
  var day = d.getDate();
  return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
}

function sessEmailOk(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
}

function sessStep1Ok(c) {
  var title = (c.title || '').trim();
  var desc = (c.description || '').trim();
  if (title.length < 6 || title.length > 80) return false;
  if (desc.length < 20) return false;
  if (!c.topic) return false;
  if (c.poster && (c.posterAlt || '').trim().length < 10) return false;
  return true;
}

function sessStep2Ok(c) {
  var mins = parseInt(c.minutes, 10);
  if (!(c.dateVal || '').trim()) return false;
  if (!(c.timeVal || '').trim()) return false;
  if (isNaN(mins) || mins < 15 || mins > 240 || mins % 15 !== 0) return false;
  if ((c.where || '').trim().length < 2) return false;
  if ((c.who || '').trim().length < 3 || (c.who || '').trim().length > 90) return false;
  if ((c.signupUrl || '').trim() && !oppParseLink(c.signupUrl)) return false;
  return true;
}

function sessResetCompose() {
  var c = ensureSess();
  c.step = 1;
  c.title = '';
  c.description = '';
  c.topic = '';
  c.tagQ = '';
  c.tagIx = -1;
  c.poster = null;
  c.posterAlt = '';
  c.linkUrl = '';
  c.dateVal = '';
  c.timeVal = '';
  c.minutes = 60;
  c.format = 'online';
  c.where = '';
  c.joinLink = '';
  c.who = '';
  c.signupUrl = '';
  c.editId = '';
  c.createdAt = '';
}

function sessOpenCompose() {
  ensureSess();
  sessResetCompose();
  S.sess.dialog = 'compose';
  S.sess.step = 1;
  sessPaintLayer();
}

function sessLoadEdit(id) {
  var s = sessModel(id);
  var c = ensureSess();
  var d;
  if (!s || !sessOwns(s)) return;
  sessResetCompose();
  c.editId = s.id;
  c.createdAt = s.createdAt;
  c.title = s.title;
  c.description = s.description;
  c.topic = s.topic;
  c.poster = s.poster;
  c.posterAlt = s.poster ? s.poster.alt || '' : '';
  c.linkUrl = s.link ? s.link.url : '';
  d = new Date(s.startsAt);
  c.dateVal =
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1 < 10 ? '0' : '') +
    (d.getMonth() + 1) +
    '-' +
    (d.getDate() < 10 ? '0' : '') +
    d.getDate();
  c.timeVal =
    (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  c.minutes = s.minutes;
  c.format = s.format;
  c.where = s.where;
  c.joinLink = (s.src && s.src.joinLink) || s.joinLink || '';
  c.who = s.who;
  c.signupUrl = s.signupUrl || '';
  c.dialog = 'compose';
  c.step = 1;
  sessPaintLayer();
}

function sessMatchTopics(term) {
  var q = String(term || '')
    .replace(/^#/, '')
    .toLowerCase()
    .replace(/\s+/g, '');
  var all = qaTopicCatalog();
  var prefix = [];
  var sub = [];
  var i;
  var key;
  var hit;
  if (!q) return [];
  for (i = 0; i < all.length; i++) {
    key = all[i].tag.replace(/^#/, '').toLowerCase();
    if (ensureSess().topic === all[i].tag) continue;
    if (key.indexOf(q) === 0) prefix.push(all[i]);
    else if (key.indexOf(q) !== -1) sub.push(all[i]);
  }
  hit = prefix.concat(sub);
  if (hit.length > 5) hit.length = 5;
  return hit;
}

function sessTopicFieldHtml() {
  var c = ensureSess();
  var html = '<div class="qa-tags" id="sess-tag-wrap"><label class="qa-tags-label" for="sess-tag-q">Topic</label>';
  if (c.topic) {
    html +=
      '<div class="qa-chosen"><span class="opp-chip">' +
      esc(c.topic) +
      '<span class="qa-chip-x" role="button" tabindex="0" data-sess-untag="1" aria-label="Remove ' +
      esc(c.topic) +
      '">×</span></span></div>';
    html += '<p class="opp-hint">Remove it to choose a different one.</p>';
  } else {
    html +=
      '<input id="sess-tag-q" class="qa-tag-input" role="combobox" aria-expanded="false" aria-controls="sess-sug" aria-autocomplete="list" placeholder="Start typing a topic" value="' +
      esc(c.tagQ || '') +
      '"/>';
    html += '<div class="qa-sug" id="sess-sug" role="listbox" hidden></div>';
  }
  html += '</div>';
  return html;
}

function sessAttachFieldsHtml() {
  var c = ensureSess();
  var link = oppParseLink(c.linkUrl);
  var html = '<label>Poster</label><div class="opp-file"><input id="sess-poster" type="file" accept="image/*"/></div>';
  if (c.poster) {
    html += oppPosterHtml(
      { url: c.poster.url, alt: c.posterAlt || c.poster.alt || '', width: c.poster.width, height: c.poster.height },
      'feed'
    );
    html +=
      '<label for="sess-alt">Alt text</label><textarea id="sess-alt" minlength="10">' +
      esc(c.posterAlt || '') +
      '</textarea>';
    html +=
      '<p class="opp-hint' +
      ((c.posterAlt || '').trim().length < 10 ? ' is-bad' : '') +
      '">Required. This is all a screen reader gets, and all anyone sees if images do not load.</p>';
  }
  html +=
    '<label for="sess-link">Link</label><input id="sess-link" type="url" placeholder="https://" value="' +
    esc(c.linkUrl || '') +
    '"/>';
  html += '<div id="sess-link-prev">' + (link ? oppLinkHtml(link) : '') + '</div>';
  return html;
}

function sessComposePreview() {
  var c = ensureSess();
  var a = currentPosterId() ? author(currentPosterId()) : { name: 'You', init: 'YO', role: 'mentor', pos: '' };
  var kind = oppAuthorKind(a);
  var starts = c.dateVal && c.timeVal ? c.dateVal + 'T' + c.timeVal + ':00-04:00' : '';
  return {
    _card: true,
    id: c.editId || 'preview',
    status: 'published',
    authorId: currentPosterId() || '',
    author: {
      id: currentPosterId() || '',
      name: a.name,
      initials: oppInitials(a),
      kind: kind,
      verified: !!(a && a.verified),
      role: kind === 'collaborator' ? 'Collaborator' : 'Mentor',
      pos: a.pos || ''
    },
    createdAt: c.createdAt || nowIso(),
    editedAt: c.editId ? nowIso() : '',
    title: c.title,
    description: c.description,
    topic: c.topic,
    startsAt: starts,
    minutes: parseInt(c.minutes, 10) || 60,
    format: c.format,
    where: c.where,
    who: c.who,
    registrationOpen: true,
    signupUrl: c.signupUrl,
    poster: c.poster
      ? { url: c.poster.url, alt: c.posterAlt || c.poster.alt || '', width: c.poster.width, height: c.poster.height }
      : null,
    link: c.poster ? null : oppParseLink(c.linkUrl),
    bookings: [],
    replies: [],
    inspiredCount: 0,
    joinLink: c.joinLink
  };
}

function sessComposeStepHtml() {
  var c = ensureSess();
  var html = '';
  html += '<p class="opp-step">Step ' + c.step + ' of 2</p>';
  html +=
    '<div class="sess-progress" aria-hidden="true"><span' +
    (c.step >= 1 ? ' class="on"' : '') +
    '></span><span' +
    (c.step >= 2 ? ' class="on"' : '') +
    '></span></div>';
  if (c.step === 1) {
    html +=
      '<label for="sess-title">Title</label><input id="sess-title" maxlength="80" value="' +
      esc(c.title) +
      '"/>';
    html +=
      '<label for="sess-desc">What you will cover</label><textarea id="sess-desc">' +
      esc(c.description) +
      '</textarea>';
    html += sessAttachFieldsHtml();
    html += sessTopicFieldHtml();
  } else {
    html +=
      '<label for="sess-date">Date</label><input id="sess-date" type="date" min="' +
      sessToday() +
      '" value="' +
      esc(c.dateVal) +
      '"/>';
    html +=
      '<label for="sess-time">Start time</label><input id="sess-time" type="time" value="' +
      esc(c.timeVal) +
      '"/>';
    html +=
      '<label for="sess-mins">How long, in minutes</label><input id="sess-mins" type="number" min="15" max="240" step="15" value="' +
      esc(String(c.minutes || 60)) +
      '"/>';
    html +=
      '<p class="opp-hint">Where</p><div class="sess-fmt"><button type="button" data-sess-fmt="online"' +
      (c.format === 'online' ? ' class="on"' : '') +
      '>Online</button><button type="button" data-sess-fmt="inperson"' +
      (c.format === 'inperson' ? ' class="on"' : '') +
      '>In person</button></div>';
    html +=
      '<label for="sess-where">' +
      (c.format === 'inperson' ? 'Venue' : 'Platform') +
      '</label><input id="sess-where" value="' +
      esc(c.where) +
      '" placeholder="' +
      (c.format === 'inperson' ? 'The venue, and how to find it' : 'Google Meet, or the platform name') +
      '"/>';
    if (c.format === 'online') {
      html +=
        '<label for="sess-join">Joining link</label><input id="sess-join" type="url" placeholder="https://" value="' +
        esc(c.joinLink) +
        '"/>';
      html +=
        '<p class="opp-hint">Students see this an hour before, never on the public post. You can add it later.</p>';
    }
    html +=
      '<label for="sess-who">Who it is for</label><input id="sess-who" maxlength="90" value="' +
      esc(c.who) +
      '"/>';
    html +=
      '<label for="sess-signup">Sign-up link</label><input id="sess-signup" type="url" placeholder="https://" value="' +
      esc(c.signupUrl) +
      '"/>';
    html +=
      '<p class="opp-hint">Leave this empty and students book here. Add a link and they register on your own site instead.</p>';
  }
  html += '<div class="opp-foot">';
  html +=
    '<button type="button" class="qa-keep" data-sess-back="1">' +
    (c.step === 1 ? 'Back' : 'Back') +
    '</button>';
  html +=
    '<button type="button" class="qa-go" id="sess-continue" data-sess-next="1"' +
    ((c.step === 1 ? sessStep1Ok(c) : sessStep2Ok(c)) ? '' : ' disabled') +
    '>' +
    (c.step === 2 ? 'Preview' : 'Continue') +
    '</button>';
  html += '</div>';
  return html;
}

function sessPreviewHtml() {
  var html = '<p class="qa-sub">This is exactly how it will look</p>';
  html += sessRenderCard(sessComposePreview(), { preview: true });
  html += '<div class="opp-foot">';
  html += '<button type="button" class="qa-keep" data-sess-edit-back="1">Back to edit</button>';
  html += '<button type="button" class="qa-go" data-sess-publish="1">Post the session</button>';
  html += '</div>';
  return html;
}

function sessBookValid(c) {
  return (c.bookName || '').trim().length >= 2 && sessEmailOk(c.bookEmail);
}

function sessBookFormHtml(s) {
  var c = ensureSess();
  var host = s.author.name;
  var html = '<h2 id="qa-dlg-title">Book a place</h2>';
  html += '<p class="qa-sub">' + esc(s.title) + '</p>';
  html +=
    '<label for="sess-book-name">Your name</label><input id="sess-book-name" value="' +
    esc(c.bookName) +
    '" autocomplete="name"/>';
  html +=
    '<label for="sess-book-email">Email</label><input id="sess-book-email" type="email" value="' +
    esc(c.bookEmail) +
    '" autocomplete="email"/>';
  html +=
    '<p class="opp-hint">Your name and email stay with Next Step. ' +
    esc(host) +
    ' only ever sees your form and region.</p>';
  html +=
    '<label for="sess-book-q">Anything you want covered?</label><textarea id="sess-book-q" maxlength="200">' +
    esc(c.bookQ) +
    '</textarea>';
  html +=
    '<label class="opp-check"><input id="sess-book-alert" type="checkbox"' +
    (c.bookAlerts ? ' checked' : '') +
    '/> <span>Alert me before it starts — in the app, the day before and again an hour before with the joining link.</span></label>';
  html +=
    '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-sess-dlg-close="1">Cancel</button><button type="button" class="qa-go" id="sess-book-go" data-sess-confirm-book="1"' +
    (sessBookValid(c) ? '' : ' disabled') +
    '>Confirm place</button></div>';
  return html;
}

function sessSignupHtml(s) {
  return (
    '<h2 id="qa-dlg-title">Book a place</h2><p class="qa-sub">' +
    esc(s.title) +
    '</p><p class="sess-url">' +
    esc(s.signupUrl) +
    '</p><p class="opp-hint">Registering happens with ' +
    esc(s.author.name) +
    ', not on Next Step</p><div class="qa-dlg-actions"><button type="button" class="qa-keep" data-sess-dlg-close="1">Cancel</button><a class="qa-go sess-primary" href="' +
    esc(s.signupUrl) +
    '" target="_blank" rel="noopener">Open the sign-up page</a></div>'
  );
}

function sessBookedHtml(s) {
  var b = sessMyBooking(s.id);
  var html = '<h2 id="qa-dlg-title">You have a place</h2>';
  html += '<p class="qa-sub">' + esc(s.title) + '</p>';
  html += '<p>It is in My Sessions now.</p>';
  if (b && b.alerts) html += '<p>We alert you in the app the day before, and an hour before.</p>';
  else html += '<p>Alerts are off. You can turn them on from My Sessions.</p>';
  if (s.format === 'online') html += '<p>The joining link appears an hour before the session starts.</p>';
  if (b && b.question) html += '<p>What you asked for has gone to ' + esc(s.author.name) + '.</p>';
  html += '<div class="qa-dlg-actions"><button type="button" class="qa-go" data-sess-dlg-close="1">Done</button></div>';
  return html;
}

function sessReportHtml() {
  var c = ensureSess();
  var html = '<h2 id="qa-dlg-title">Report a problem</h2>';
  html += '<p class="qa-sub">Tell us what is wrong. A person reviews every report.</p>';
  html +=
    '<label class="opp-check"><input type="radio" name="sess-rep" value="wrong"' +
    (c.reportReason === 'wrong' ? ' checked' : '') +
    '/> <span>The details look wrong</span></label>';
  html +=
    '<label class="opp-check"><input type="radio" name="sess-rep" value="unsafe"' +
    (c.reportReason === 'unsafe' ? ' checked' : '') +
    '/> <span>It does not look safe for students</span></label>';
  html +=
    '<label class="opp-check"><input type="radio" name="sess-rep" value="other"' +
    (c.reportReason === 'other' ? ' checked' : '') +
    '/> <span>Something else</span></label>';
  html +=
    '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-sess-dlg-close="1">Cancel</button><button type="button" class="qa-go" data-sess-send-report="1"' +
    (c.reportReason ? '' : ' disabled') +
    '>Send report</button></div>';
  return html;
}

function sessPaintLayer() {
  var layer = byId('qa-layer');
  var c = ensureSess();
  var html;
  var s;
  var focus;
  if (!layer) return;
  if (S.qa && S.qa.dialog) return;
  if (S.opp && S.opp.dialog) return;
  if (!c.dialog) {
    if (!layer.hidden && layer.querySelector('.sess-box')) {
      layer.hidden = true;
      layer.innerHTML = '';
    }
    return;
  }
  html = '<div class="qa-dialog opp-box opp-compose sess-box" role="dialog" aria-modal="true" aria-labelledby="qa-dlg-title">';
  if (c.dialog === 'compose') {
    html += '<h2 id="qa-dlg-title">Host a session</h2>' + sessComposeStepHtml();
  } else if (c.dialog === 'preview') {
    html += '<h2 id="qa-dlg-title">Preview</h2>' + sessPreviewHtml();
  } else if (c.dialog === 'book') {
    s = sessModel(c.dialogId);
    html += s ? sessBookFormHtml(s) : '<p>Missing.</p>';
  } else if (c.dialog === 'signup') {
    s = sessModel(c.dialogId);
    html += s ? sessSignupHtml(s) : '<p>Missing.</p>';
  } else if (c.dialog === 'booked') {
    s = sessModel(c.dialogId);
    html += s ? sessBookedHtml(s) : '<p>Missing.</p>';
  } else if (c.dialog === 'giveup') {
    html +=
      '<h2 id="qa-dlg-title">Give up your place?</h2><p class="qa-sub">Your booking and your question are removed.</p><div class="qa-dlg-actions"><button type="button" class="qa-keep" data-sess-dlg-close="1">Keep my place</button><button type="button" class="qa-kill" data-sess-confirm-giveup="1">Give up my place</button></div>';
  } else if (c.dialog === 'editq') {
    html +=
      '<h2 id="qa-dlg-title">Change my question</h2><textarea id="sess-edit-q" maxlength="200">' +
      esc(c.bookQ) +
      '</textarea><div class="qa-dlg-actions"><button type="button" class="qa-keep" data-sess-dlg-close="1">Cancel</button><button type="button" class="qa-go" data-sess-save-q="1">Save</button></div>';
  } else if (c.dialog === 'cancel') {
    html +=
      '<h2 id="qa-dlg-title">Cancel this session?</h2><p class="qa-sub">Everyone with a place is told, and it leaves the feed.</p><div class="qa-dlg-actions"><button type="button" class="qa-keep" data-sess-dlg-close="1">Keep it</button><button type="button" class="qa-kill" data-sess-confirm-cancel="1">Cancel the session</button></div>';
  } else if (c.dialog === 'report') {
    html += sessReportHtml();
  }
  html += '</div>';
  layer.innerHTML = html;
  layer.hidden = false;
  focus =
    byId('sess-title') ||
    byId('sess-date') ||
    byId('sess-book-name') ||
    byId('sess-edit-q') ||
    layer.querySelector('button, input, textarea');
  if (focus && focus.focus) focus.focus();
}

function sessCloseDialog() {
  var c = ensureSess();
  var layer = byId('qa-layer');
  c.dialog = '';
  c.dialogId = '';
  c.reportReason = '';
  if (layer && !(S.qa && S.qa.dialog) && !(S.opp && S.opp.dialog)) {
    layer.hidden = true;
    layer.innerHTML = '';
  }
}

function sessReadFields() {
  var c = ensureSess();
  var el;
  el = byId('sess-title');
  if (el) c.title = el.value;
  el = byId('sess-desc');
  if (el) c.description = el.value;
  el = byId('sess-alt');
  if (el) c.posterAlt = el.value;
  el = byId('sess-link');
  if (el) c.linkUrl = el.value;
  el = byId('sess-date');
  if (el) c.dateVal = el.value;
  el = byId('sess-time');
  if (el) c.timeVal = el.value;
  el = byId('sess-mins');
  if (el) c.minutes = parseInt(el.value, 10) || c.minutes;
  el = byId('sess-where');
  if (el) c.where = el.value;
  el = byId('sess-join');
  if (el) c.joinLink = el.value;
  el = byId('sess-who');
  if (el) c.who = el.value;
  el = byId('sess-signup');
  if (el) c.signupUrl = el.value;
  el = byId('sess-tag-q');
  if (el) c.tagQ = el.value;
  el = byId('sess-book-name');
  if (el) c.bookName = el.value;
  el = byId('sess-book-email');
  if (el) c.bookEmail = el.value;
  el = byId('sess-book-q');
  if (el) c.bookQ = el.value;
  el = byId('sess-book-alert');
  if (el) c.bookAlerts = !!el.checked;
  el = byId('sess-edit-q');
  if (el) c.bookQ = el.value;
}

function sessSyncCompose() {
  var btn = byId('sess-continue');
  var go = byId('sess-book-go');
  var c = ensureSess();
  var hint;
  if (btn) {
    btn.disabled = c.step === 1 ? !sessStep1Ok(c) : !sessStep2Ok(c);
  }
  if (go) go.disabled = !sessBookValid(c);
  if (byId('sess-alt')) {
    hint = byId('sess-alt').nextElementSibling;
    if (hint && hint.className.indexOf('opp-hint') !== -1) {
      hint.className = (c.posterAlt || '').trim().length < 10 ? 'opp-hint is-bad' : 'opp-hint';
    }
  }
}

function sessSyncTopicUi() {
  var c = ensureSess();
  var sug = byId('sess-sug');
  var input = byId('sess-tag-q');
  var hits;
  var html = '';
  var i;
  if (!sug || !input) return;
  if (!input.value || !input.value.replace(/\s/g, '')) {
    sug.hidden = true;
    sug.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    return;
  }
  hits = sessMatchTopics(input.value);
  if (!hits.length) {
    html =
      '<p class="qa-sug-empty">No topic matches "' +
      esc(input.value.trim()) +
      '". Topics are set by the Next Step team.</p>';
  } else {
    for (i = 0; i < hits.length; i++) {
      html +=
        '<button type="button" role="option" data-sess-pick="' +
        esc(hits[i].tag) +
        '" aria-selected="' +
        (c.tagIx === i ? 'true' : 'false') +
        '"><span class="qa-sug-name">' +
        esc(hits[i].tag) +
        '</span><span class="qa-sug-n">used ' +
        hits[i].useCount +
        (hits[i].useCount === 1 ? ' time' : ' times') +
        '</span></button>';
    }
  }
  sug.innerHTML = html;
  sug.hidden = false;
  input.setAttribute('aria-expanded', 'true');
}

function sessPublish() {
  var c = ensureSess();
  var preview = sessComposePreview();
  var raw;
  var item;
  var starts;
  if (!sessStep1Ok(c) || !sessStep2Ok(c)) return;
  starts = c.dateVal + 'T' + c.timeVal + ':00-04:00';
  if (c.editId) {
    raw = sessionById(c.editId);
    if (!raw || !sessOwns(sessModel(raw))) return;
    raw.title = c.title.trim();
    raw.description = c.description.trim();
    raw.what = c.description.trim();
    raw.topic = c.topic;
    raw.cat = qaTopicRaw(c.topic) || raw.cat;
    raw.startsAt = starts;
    raw.minutes = parseInt(c.minutes, 10) || 60;
    raw.format = c.format;
    raw.where = c.where.trim();
    raw.platform = c.where.trim();
    raw.who = c.who.trim();
    raw.signupUrl = (c.signupUrl || '').trim();
    raw.joinLink = c.format === 'online' ? (c.joinLink || '').trim() : '';
    raw.poster = preview.poster;
    raw.link = preview.link;
    raw.editedAt = nowIso();
    item = sessFeedFor(c.editId);
    if (item) {
      item.edited = true;
      item.editedAt = raw.editedAt;
      item.cat = raw.cat;
    }
    sessCloseDialog();
    toast('Session updated.');
    render();
    return;
  }
  raw = {
    id: 's-' + Date.now(),
    status: 'published',
    title: c.title.trim(),
    description: c.description.trim(),
    what: c.description.trim(),
    topic: c.topic,
    cat: qaTopicRaw(c.topic) || '',
    startsAt: starts,
    minutes: parseInt(c.minutes, 10) || 60,
    format: c.format,
    where: c.where.trim(),
    platform: c.where.trim(),
    who: c.who.trim(),
    signupUrl: (c.signupUrl || '').trim(),
    joinLink: c.format === 'online' ? (c.joinLink || '').trim() : '',
    poster: preview.poster,
    link: preview.link,
    authorId: currentPosterId() || '',
    hosted_by: currentPosterId() || '',
    lead: currentPosterId() || '',
    createdAt: nowIso(),
    registrationOpen: true,
    bookings: [],
    replies: [],
    inspiredCount: 0,
    seats: 30,
    taken: 0,
    qs: []
  };
  sessHydrateOne(raw);
  SESSIONS.unshift(raw);
  FEED.unshift({
    id: 'f-' + raw.id,
    kind: 'session',
    session: raw.id,
    at: raw.createdAt,
    cat: raw.cat,
    replies: []
  });
  sessCloseDialog();
  toast('Session posted.');
  render();
}

function sessOpenBook(id) {
  var s = sessModel(id);
  var c = ensureSess();
  if (!s) return;
  if (oppIsParent()) {
    toast('Parents cannot book a place. Ask a question on the session instead.');
    return;
  }
  if (sessOwns(s)) {
    toast('You are hosting this session.');
    return;
  }
  if (sessHasPlace(s.id)) {
    toast('You already have a place.');
    return;
  }
  if (sessIsOver(s) || !s.registrationOpen) {
    toast('Registration is closed.');
    return;
  }
  if (
    requirePathway({
      type: 'book',
      id: id,
      reason: 'We need your form to hold you a place.'
    })
  ) {
    return;
  }
  c.dialogId = s.id;
  c.bookName = (S.me && S.me.name) || youName() || '';
  c.bookEmail = (S.me && S.me.email) || '';
  c.bookQ = '';
  c.bookAlerts = false;
  if (s.signupUrl) c.dialog = 'signup';
  else c.dialog = 'book';
  sessPaintLayer();
}

function sessConfirmBook() {
  var c = ensureSess();
  var s = sessModel(c.dialogId);
  var raw;
  var rec;
  sessReadFields();
  if (!s || !sessBookValid(c)) return;
  raw = sessionById(s.id);
  rec = {
    id: 'bk-' + Date.now(),
    sessionId: s.id,
    userId: qaViewerId ? qaViewerId() : currentPosterId() || 'me',
    name: c.bookName.trim(),
    email: c.bookEmail.trim(),
    question: (c.bookQ || '').trim().slice(0, 200),
    alerts: !!c.bookAlerts,
    createdAt: nowIso(),
    form: (S.me && S.me.form) || S.form || 'Student',
    region: (S.me && S.me.region) || S.region || ''
  };
  if (!raw.bookings) raw.bookings = [];
  raw.bookings.push(rec);
  S.sessBookings.push(rec);
  if (S.booked.indexOf(s.id) === -1) S.booked.push(s.id);
  c.dialog = 'booked';
  sessPaintLayer();
  render();
}

function sessGiveUp(id) {
  var raw = sessionById(id);
  var uid = qaViewerId ? qaViewerId() : currentPosterId() || 'me';
  if (!raw) return;
  raw.bookings = (raw.bookings || []).filter(function (b) {
    return b.userId !== uid;
  });
  S.sessBookings = (S.sessBookings || []).filter(function (b) {
    return !(b.sessionId === id && b.userId === uid);
  });
  S.booked = (S.booked || []).filter(function (x) {
    return x !== id;
  });
  sessCloseDialog();
  toast('Your place was given up.');
  render();
}

function sessSaveQuestion(id) {
  var c = ensureSess();
  var raw = sessionById(id);
  var uid = qaViewerId ? qaViewerId() : currentPosterId() || 'me';
  var i;
  sessReadFields();
  if (!raw) return;
  for (i = 0; i < (raw.bookings || []).length; i++) {
    if (raw.bookings[i].userId === uid) raw.bookings[i].question = (c.bookQ || '').trim().slice(0, 200);
  }
  for (i = 0; i < (S.sessBookings || []).length; i++) {
    if (S.sessBookings[i].sessionId === id && S.sessBookings[i].userId === uid) {
      S.sessBookings[i].question = (c.bookQ || '').trim().slice(0, 200);
    }
  }
  sessCloseDialog();
  toast('Question updated.');
  render();
}

function sessCancelSession(id) {
  var raw = sessionById(id);
  var item;
  var n;
  if (!raw || !sessOwns(sessModel(raw))) return;
  n = (raw.bookings || []).length;
  raw.status = 'cancelled';
  item = sessFeedFor(id);
  if (item) {
    FEED = FEED.filter(function (x) {
      return x !== item;
    });
  }
  sessCloseDialog();
  toast(
    n
      ? 'Session cancelled. ' + n + (n === 1 ? ' student with a place was told.' : ' students with a place were told.')
      : 'Session cancelled.'
  );
  if (NAV.length) closeSheet();
  else render();
}

function sessToggleReg(id) {
  var raw = sessionById(id);
  var s = sessModel(raw);
  if (!raw || !s || !sessOwns(s) || sessIsOver(s)) return;
  raw.registrationOpen = !raw.registrationOpen;
  S.menu = '';
  if (raw.registrationOpen) toast('Registration is open again.');
  else toast('Registration closed. Students can still see the session.');
  if (NAV.length) paint();
  else render();
}

function sessPostReply(id) {
  var box = byId('sess-reply');
  var raw = sessionById(id);
  var text = box && box.value ? box.value.trim() : '';
  var rec;
  if (!raw || !text) return;
  rec = {
    id: 'sr-' + Date.now(),
    text: text,
    createdAt: nowIso(),
    mine: true,
    authorId: currentPosterId() || qaViewerId(),
    authorRole: qaIsMentor() ? 'mentor' : postingRole() === 'parent' ? 'parent' : 'student',
    who: qaIsMentor() ? (author(currentPosterId()) || {}).name : studentLabel(),
    name: qaIsMentor() ? (author(currentPosterId()) || {}).name : studentLabel()
  };
  if (!raw.replies) raw.replies = [];
  raw.replies.push(rec);
  toast('Reply posted.');
  paint();
}

function sessOpenBookGate(id) {
  sessOpenBook(id);
}

function sessHandleClick(e, t) {
  var btn;
  var c = ensureSess();
  var id;
  var sug;
  btn = closestEl(t, '[data-sess-book]');
  if (btn) {
    e.stopPropagation();
    if (btn.disabled) return true;
    sessOpenBook(btn.getAttribute('data-sess-book'));
    return true;
  }
  btn = closestEl(t, '[data-sess-edit]');
  if (btn) {
    e.stopPropagation();
    S.menu = '';
    sessLoadEdit(btn.getAttribute('data-sess-edit'));
    return true;
  }
  btn = closestEl(t, '[data-sess-reg]');
  if (btn) {
    e.stopPropagation();
    sessToggleReg(btn.getAttribute('data-sess-reg'));
    return true;
  }
  btn = closestEl(t, '[data-sess-cancel]');
  if (btn) {
    e.stopPropagation();
    S.menu = '';
    c.dialog = 'cancel';
    c.dialogId = btn.getAttribute('data-sess-cancel');
    sessPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-sess-giveup]');
  if (btn) {
    e.stopPropagation();
    S.menu = '';
    c.dialog = 'giveup';
    c.dialogId = btn.getAttribute('data-sess-giveup');
    sessPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-sess-edit-q]');
  if (btn) {
    e.stopPropagation();
    S.menu = '';
    id = btn.getAttribute('data-sess-edit-q');
    c.dialogId = id;
    c.bookQ = (sessMyBooking(id) && sessMyBooking(id).question) || '';
    c.dialog = 'editq';
    sessPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-sess-hide]');
  if (btn) {
    e.stopPropagation();
    hidePost(btn.getAttribute('data-sess-hide'));
    return true;
  }
  btn = closestEl(t, '[data-sess-report]');
  if (btn) {
    e.stopPropagation();
    S.menu = '';
    c.dialog = 'report';
    c.dialogId = btn.getAttribute('data-sess-report');
    c.reportReason = '';
    sessPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-sess-dlg-close]');
  if (btn) {
    sessCloseDialog();
    return true;
  }
  btn = closestEl(t, '[data-sess-back]');
  if (btn) {
    sessReadFields();
    if (c.step === 1) {
      if (c.editId) {
        sessCloseDialog();
        return true;
      }
      sessCloseDialog();
      ensureOpp();
      S.opp.dialog = 'picker';
      S.opp.mode = '';
      oppPaintLayer();
      return true;
    }
    c.step = 1;
    sessPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-sess-next]');
  if (btn) {
    sessReadFields();
    if (c.step === 1) {
      if (!sessStep1Ok(c)) return true;
      c.step = 2;
    } else {
      if (!sessStep2Ok(c)) return true;
      c.dialog = 'preview';
    }
    sessPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-sess-edit-back]');
  if (btn) {
    c.dialog = 'compose';
    c.step = 2;
    sessPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-sess-publish]');
  if (btn) {
    sessPublish();
    return true;
  }
  btn = closestEl(t, '[data-sess-fmt]');
  if (btn) {
    sessReadFields();
    c.format = btn.getAttribute('data-sess-fmt');
    sessPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-sess-untag]');
  if (btn) {
    c.topic = '';
    c.tagQ = '';
    sessPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-sess-pick]');
  if (btn) {
    c.topic = btn.getAttribute('data-sess-pick');
    c.tagQ = '';
    sessPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-sess-confirm-book]');
  if (btn) {
    sessConfirmBook();
    return true;
  }
  btn = closestEl(t, '[data-sess-confirm-giveup]');
  if (btn) {
    sessGiveUp(c.dialogId);
    return true;
  }
  btn = closestEl(t, '[data-sess-save-q]');
  if (btn) {
    sessSaveQuestion(c.dialogId);
    return true;
  }
  btn = closestEl(t, '[data-sess-confirm-cancel]');
  if (btn) {
    sessCancelSession(c.dialogId);
    return true;
  }
  btn = closestEl(t, '[data-sess-send-report]');
  if (btn) {
    toast('Report sent. A person will look at it.');
    sessCloseDialog();
    return true;
  }
  btn = closestEl(t, '[data-sess-reply]');
  if (btn) {
    sessPostReply(btn.getAttribute('data-sess-reply'));
    return true;
  }
  if (t && t.name === 'sess-rep') {
    c.reportReason = t.value;
    sessPaintLayer();
    return true;
  }
  sug = byId('sess-sug');
  if (sug && !sug.hidden && !closestEl(t, '#sess-tag-wrap')) {
    sug.hidden = true;
    return true;
  }
  if (byId('qa-layer') && !byId('qa-layer').hidden && byId('qa-layer').querySelector('.sess-box') && !closestEl(t, '.sess-box')) {
    if (sug && !sug.hidden) {
      sug.hidden = true;
      return true;
    }
    sessCloseDialog();
    return true;
  }
  return false;
}

function sessHandleInput(e) {
  var c;
  var file;
  var reader;
  var img;
  var slot;
  var parsed;
  var postBtn;
  if (!e.target) return false;
  if (e.target.id === 'sess-poster' && e.target.files && e.target.files[0]) {
    c = ensureSess();
    file = e.target.files[0];
    reader = new FileReader();
    img = new Image();
    reader.onload = function () {
      img.onload = function () {
        c.poster = { url: reader.result, width: img.naturalWidth, height: img.naturalHeight, alt: '' };
        sessPaintLayer();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    return true;
  }
  if (
    e.target.id === 'sess-title' ||
    e.target.id === 'sess-desc' ||
    e.target.id === 'sess-alt' ||
    e.target.id === 'sess-link' ||
    e.target.id === 'sess-date' ||
    e.target.id === 'sess-time' ||
    e.target.id === 'sess-mins' ||
    e.target.id === 'sess-where' ||
    e.target.id === 'sess-join' ||
    e.target.id === 'sess-who' ||
    e.target.id === 'sess-signup' ||
    e.target.id === 'sess-book-name' ||
    e.target.id === 'sess-book-email' ||
    e.target.id === 'sess-book-q' ||
    e.target.id === 'sess-book-alert' ||
    e.target.id === 'sess-edit-q'
  ) {
    sessReadFields();
    sessSyncCompose();
    if (e.target.id === 'sess-link') {
      slot = byId('sess-link-prev');
      parsed = oppParseLink(e.target.value);
      if (slot) slot.innerHTML = parsed ? oppLinkHtml(parsed) : '';
    }
    return true;
  }
  if (e.target.id === 'sess-tag-q') {
    ensureSess().tagQ = e.target.value;
    ensureSess().tagIx = -1;
    sessSyncTopicUi();
    return true;
  }
  if (e.target.id === 'sess-reply') {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(220, Math.max(44, e.target.scrollHeight)) + 'px';
    postBtn = byId('sess-post');
    if (postBtn) postBtn.disabled = !e.target.value.trim();
    return true;
  }
  return false;
}

function sessHandleKey(e) {
  var c = ensureSess();
  var sug = byId('sess-sug');
  var opts;
  var n;
  if (e.target && e.target.id === 'sess-tag-q') {
    opts = sug && !sug.hidden ? sug.querySelectorAll('[data-sess-pick]') : [];
    n = opts.length;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (sug) sug.hidden = true;
      return true;
    }
    if (e.key === 'ArrowDown' && n) {
      e.preventDefault();
      c.tagIx = c.tagIx + 1 >= n ? 0 : c.tagIx + 1;
      sessSyncTopicUi();
      return true;
    }
    if (e.key === 'ArrowUp' && n) {
      e.preventDefault();
      c.tagIx = c.tagIx <= 0 ? n - 1 : c.tagIx - 1;
      sessSyncTopicUi();
      return true;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (c.tagIx >= 0 && opts[c.tagIx]) opts[c.tagIx].click();
      else if (opts[0]) opts[0].click();
      return true;
    }
    if (e.key === 'Backspace' && !e.target.value && c.topic) {
      c.topic = '';
      sessPaintLayer();
      return true;
    }
  }
  if (e.key === 'Escape' && c.dialog) {
    if (sug && !sug.hidden) {
      sug.hidden = true;
      return true;
    }
    if (c.dialog === 'preview') {
      c.dialog = 'compose';
      c.step = 2;
      sessPaintLayer();
      return true;
    }
    sessCloseDialog();
    return true;
  }
  return false;
}

function sessAfterPaint() {
  document.body.classList.toggle(
    'sess-sheet-open',
    !!(NAV.length && NAV[NAV.length - 1].t === 'session')
  );
  if (NAV.length && NAV[NAV.length - 1].t === 'session') {
    var root = document.querySelector('.sess-sheet');
    if (root && root.focus && document.activeElement === document.body) {
      root.setAttribute('tabindex', '-1');
      root.focus();
    }
  }
  if (!(S.qa && S.qa.dialog) && !(S.opp && S.opp.dialog)) sessPaintLayer();
}

function sessInit() {
  if (sessInit._ready) return;
  sessInit._ready = true;
  sessHydrateAll();
}
