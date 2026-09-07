/* Q&A card and thread. Extends the existing question object. Does not reshape the feed.
   Open decisions left unpicked: tag-only pass, student initial glyph, report routing review,
   and whether tick plus role line is enough to tell mentors from students. */

function ensureQa() {
  if (!S.qa) {
    S.qa = {
      dialog: '',
      dialogId: '',
      dialogRid: '',
      dialogText: '',
      reportReason: '',
      reportKind: 'question',
      tags: [],
      tagQ: '',
      tagIx: -1,
      draft: '',
      lastFocus: null
    };
  }
  if (!S.safeguardCases) S.safeguardCases = [];
  return S.qa;
}

function qaViewerId() {
  return currentPosterId() || (qaIsStudent() ? 'you-student' : '');
}

function qaIsMentor() {
  var r = postingRole();
  return r === 'mentor' || r === 'contributor' || r === 'admin';
}

function qaIsStudent() {
  return postingRole() === 'student';
}

function qaTimeAgo(iso) {
  if (!iso) return '';
  var then = new Date(iso);
  if (isNaN(then.getTime())) return '';
  var now = new Date();
  var diff = now.getTime() - then.getTime();
  if (diff < 0) diff = 0;
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins === 1) return '1 minute ago';
  if (mins < 60) return String(mins) + ' minutes ago';
  var hrs = Math.floor(mins / 60);
  if (hrs === 1) return '1 hour ago';
  if (hrs < 24) return String(hrs) + ' hours ago';
  var days = Math.floor(hrs / 24);
  if (days === 1) return '1 day ago';
  return String(days) + ' days ago';
}

function qaAsker(item) {
  return item.asker || item.who || studentLabel();
}

function qaOwnsQuestion(item) {
  if (!item || qaIsMentor()) return false;
  if (item.authorId && item.authorId === qaViewerId()) return true;
  return !!(item.mine && qaIsStudent());
}

function qaTopics(item) {
  var out = [];
  var i;
  var t;
  if (item.topics && item.topics.length) {
    for (i = 0; i < item.topics.length; i++) {
      t = item.topics[i];
      if (t && out.indexOf(t) === -1) out.push(t);
    }
    return out;
  }
  if (item.cat) return [hashTagLabel(item.cat)];
  return [];
}

function qaTopicCatalog() {
  var counts = {};
  var i;
  var j;
  var tags;
  var list = [];
  for (i = 0; i < CATS.length; i++) counts[hashTagLabel(CATS[i])] = 0;
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].kind !== 'question') continue;
    tags = qaTopics(FEED[i]);
    for (j = 0; j < tags.length; j++) {
      counts[tags[j]] = (counts[tags[j]] || 0) + 1;
    }
  }
  for (i = 0; i < CATS.length; i++) {
    list.push({ tag: hashTagLabel(CATS[i]), raw: CATS[i], useCount: counts[hashTagLabel(CATS[i])] || 0 });
  }
  return list;
}

function qaNormReply(r) {
  var a = r && r.a ? author(r.a) : null;
  var mentor = !!(a && (a.role === 'mentor' || a.role === 'contributor' || a.role === 'admin'));
  var name;
  var initials;
  var role;
  if (r.authorRole === 'mentor' || mentor) {
    name = r.name || (a && a.name) || 'Mentor';
    initials = r.initials || (a && a.init) || name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
    if (initials.length < 2) initials = (initials + 'M').slice(0, 2);
    role = r.role || ('Mentor · ' + ((a && a.pos) || 'Mentor'));
    return {
      id: r.id,
      authorId: r.authorId || r.a || '',
      authorRole: 'mentor',
      name: name,
      initials: initials,
      verified: r.verified != null ? !!r.verified : !!(a && a.verified && a.role === 'mentor'),
      role: role,
      createdAt: r.createdAt || r.at || '',
      editedAt: r.editedAt,
      edited: !!(r.edited || r.editedAt),
      text: r.text || '',
      mine: !!r.mine,
      src: r
    };
  }
  name = r.name || r.who || studentLabel();
  initials = r.initials || (name.charAt(0) || 'S').toUpperCase();
  return {
    id: r.id,
    authorId: r.authorId || (r.mine ? qaViewerId() : ''),
    authorRole: r.authorRole === 'parent' ? 'parent' : 'student',
    name: name,
    initials: initials.slice(0, 1),
    verified: false,
    role: '',
    createdAt: r.createdAt || r.at || '',
    editedAt: r.editedAt,
    edited: !!(r.edited || r.editedAt),
    text: r.text || '',
    mine: !!r.mine,
    src: r
  };
}

function qaOwnsReply(r) {
  var n = qaNormReply(r);
  var viewer = postingRole();
  if (n.authorRole === 'mentor') {
    if (!qaIsMentor()) return false;
    if (n.authorId && n.authorId === currentPosterId()) return true;
    return !!(n.mine && qaIsMentor());
  }
  if (viewer !== 'student') return false;
  if (n.authorId && n.authorId === qaViewerId()) return true;
  return !!n.mine;
}

function qaIconHeart(fill) {
  if (fill) {
    return '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.2-4.6-9.6-8.6C.6 9.4 2 6 5.4 6c1.9 0 3.2 1.1 3.9 2.2C10 7.1 11.3 6 13.2 6 16.6 6 18 9.4 16.2 12.4 13.8 16.4 12 21 12 21z"/></svg>';
  }
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
}

function qaIconReply() {
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z"/></svg>';
}

function qaIconSave(fill) {
  if (fill) {
    return '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 3h12a1 1 0 0 1 1 1v17l-7-3.8L5 21V4a1 1 0 0 1 1-1z"/></svg>';
  }
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v17l-6-3.4L6 21V4z"/></svg>';
}

function qaIconBell() {
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 1 1 12 0c0 7 2 7 2 7H4s2 0 2-7"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>';
}

function qaIconMore(size) {
  size = size || 22;
  return (
    '<svg width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="12" cy="19" r="2.2"/></svg>'
  );
}

function qaTickSvg() {
  return (
    '<svg class="qa-tick" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7"></circle><path d="M4.8 8.2l2.1 2.1 4.4-4.8"></path></svg>'
  );
}

function qaYouAv() {
  if (qaIsMentor()) {
    var a = currentPosterId() ? author(currentPosterId()) : null;
    return '<span class="qa-av is-mentor" aria-hidden="true">' + esc((a && a.init) || 'ME') + '</span>';
  }
  return '<span class="qa-av is-student qa-you-gold" aria-hidden="true" style="background:#ffcf27;color:#061a2d">You</span>';
}

function qaTileHtml() {
  return '<span class="qa-tile" aria-hidden="true"><span class="qa-qmark">?</span><span class="qa-qlabel">Q&amp;A</span></span>';
}

function qaMetaLine(item) {
  var t = qaTimeAgo(item.at || item.createdAt);
  var html = '';
  if (qaOwnsQuestion(item)) {
    html += '<span class="qa-yours">Your question</span>';
    if (t) html += ' ' + esc(t);
  } else {
    html += esc(t);
  }
  if (item.edited || item.editedAt) html += ' · edited';
  return html;
}

function qaMenuItem(attrs, label, danger) {
  return (
    '<button type="button" role="menuitem" class="' +
    (danger ? 'is-danger' : '') +
    '" ' +
    attrs +
    '>' +
    esc(label) +
    '</button>'
  );
}

function qaQuestionMenu(item) {
  var own = qaOwnsQuestion(item);
  var key = hideKey('thread', item.id);
  var open = S.menu === key;
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
    if (own) {
      html += qaMenuItem('data-qa-del-q="' + esc(item.id) + '"', 'Delete question', true);
      html += qaMenuItem('data-qa-edit-q="' + esc(item.id) + '"', 'Edit question', false);
    } else if (qaIsMentor()) {
      html += qaMenuItem('data-qa-report="question" data-id="' + esc(item.id) + '"', 'Report question', true);
    } else {
      html += qaMenuItem('data-hide="' + esc(key) + '"', 'Not interested', false);
      html += '<hr/>';
      html += qaMenuItem('data-qa-report="question" data-id="' + esc(item.id) + '"', 'Report question', true);
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function qaReplyMenu(item, r) {
  var key = 'reply:' + item.id + ':' + r.id;
  var open = S.menu === key;
  var html =
    '<div class="qa-more">' +
    '<button type="button" class="qa-more-btn is-sm" data-menu="' +
    esc(key) +
    '" aria-label="Reply actions" aria-haspopup="true" aria-expanded="' +
    (open ? 'true' : 'false') +
    '">' +
    qaIconMore(20) +
    '</button>';
  if (open) {
    html += '<div class="qa-menu" role="menu">';
    if (qaOwnsReply(r.src || r)) {
      html += qaMenuItem(
        'data-qa-edit-r="' + esc(item.id) + '" data-rid="' + esc(r.id) + '"',
        'Edit reply',
        false
      );
      html += qaMenuItem(
        'data-qa-del-r="' + esc(item.id) + '" data-rid="' + esc(r.id) + '"',
        'Delete reply',
        true
      );
    } else {
      html += qaMenuItem(
        'data-qa-report="reply" data-id="' + esc(item.id) + '" data-rid="' + esc(r.id) + '"',
        'Report reply',
        true
      );
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function qaIdentityHtml(item, withMenu) {
  return (
    '<div class="qa-id">' +
    qaTileHtml() +
    '<div><div class="qa-ask-name">' +
    esc(qaAsker(item)) +
    '</div><p class="qa-ask-meta">' +
    qaMetaLine(item) +
    '</p></div>' +
    (withMenu ? qaQuestionMenu(item) : '') +
    '</div>'
  );
}

function qaTopicRaw(tag) {
  var i;
  for (i = 0; i < CATS.length; i++) {
    if (hashTagLabel(CATS[i]) === tag) return CATS[i];
  }
  return String(tag || '').replace(/^#/, '');
}

function qaTopicsHtml(item, clickable) {
  var tags = qaTopics(item);
  var i;
  var html;
  if (!tags.length) return '';
  html = '<div class="qa-topics">';
  for (i = 0; i < tags.length; i++) {
    html +=
      '<button type="button" class="qa-chip"' +
      (clickable === false ? ' disabled' : ' data-topic="' + esc(qaTopicRaw(tags[i])) + '"') +
      '>' +
      esc(tags[i]) +
      '</button>';
  }
  html += '</div>';
  return html;
}

function qaReplyHeadHtml(n, item, withMenu, whenFallback) {
  var when = qaTimeAgo(n.createdAt || whenFallback);
  var html =
    '<div class="qa-reply">' +
    '<span class="qa-av ' +
    (n.authorRole === 'mentor' ? 'is-mentor' : 'is-student') +
    '" aria-hidden="true">' +
    esc(n.initials) +
    '</span><div>' +
    '<div class="qa-r-name">' +
    esc(n.name) +
    (n.verified
      ? qaTickSvg() + '<span class="sr">Verified mentor</span>'
      : '') +
    '</div>';
  if (n.authorRole === 'mentor' && n.role) {
    html += '<p class="qa-r-role">' + esc(n.role) + '</p>';
  }
  if (when) {
    html += '<p class="qa-r-when">' + esc(when) + (n.edited ? ' · edited' : '') + '</p>';
  }
  html += '</div>';
  if (withMenu) html += qaReplyMenu(item, n);
  html += '</div>';
  return html;
}

function qaBodyHtml(text, clampId) {
  return (
    '<p class="qa-r-body' +
    (clampId ? ' qa-clamp" data-qa-clamp="' + esc(clampId) : '') +
    '">' +
    esc(text) +
    '</p>'
  );
}

function qaInspireCount(item) {
  var n = item.insp || item.inspiredCount || 0;
  return n;
}

function qaEngageHtml(item, inThread) {
  var n = item.replies ? item.replies.length : 0;
  var inspired = isInspired(item.id);
  var saved = isSaved(item.id);
  var following = S.qFollow.indexOf(item.id) !== -1;
  var inspN = qaInspireCount(item);
  var replyLabel;
  var html;
  var showUpdates = !inThread && n === 0 && qaIsStudent();
  if (n === 0) replyLabel = qaIsMentor() ? 'Answer' : 'Reply';
  else replyLabel = n === 1 ? '1 reply' : n + ' replies';
  html = '<div class="qa-actions">';
  html +=
    '<button type="button" class="qa-act is-inspired" data-inspire="' +
    esc(item.id) +
    '" aria-pressed="' +
    (inspired ? 'true' : 'false') +
    '">' +
    qaIconHeart(inspired) +
    '<span>' +
    (inspN ? 'Inspired ' + inspN : 'Inspired') +
    '</span></button>';
  if (!inThread) {
    html +=
      '<button type="button" class="qa-act" data-open="thread" data-id="' +
      esc(item.id) +
      '">' +
      qaIconReply() +
      '<span>' +
      esc(replyLabel) +
      '</span></button>';
  }
  html +=
    '<button type="button" class="qa-act is-save" data-save="' +
    esc(item.id) +
    '" aria-pressed="' +
    (saved ? 'true' : 'false') +
    '">' +
    qaIconSave(saved) +
    '<span>' +
    (saved ? 'Saved' : 'Save') +
    '</span></button>';
  if (showUpdates) {
    html +=
      '<button type="button" class="qa-act is-updates" data-qa-updates="' +
      esc(item.id) +
      '" aria-pressed="' +
      (following ? 'true' : 'false') +
      '" aria-label="Get updates when someone answers this question">' +
      qaIconBell() +
      '<span>' +
      (following ? 'Updates on' : 'Get updates') +
      '</span></button>';
  }
  html += '</div>';
  return html;
}

function qaRenderCard(item) {
  var replies = item.replies || [];
  var first = replies[0] ? qaNormReply(replies[0]) : null;
  var more = replies.length > 1 ? replies.length - 1 : 0;
  var html =
    '<article class="card feed-card kind-q qa-card clickable" ' +
    cardClickAttrs('thread', item.id) +
    '><div class="qa-pad">';
  html += qaIdentityHtml(item, true);
  html +=
    '<h3 class="qa-q qa-clamp" data-qa-clamp="q-' +
    esc(item.id) +
    '">' +
    esc(item.title || item.question || '') +
    '</h3>';
  html += qaTopicsHtml(item, true);
  if (first) {
    html += '<div class="qa-preview">';
    html += qaReplyHeadHtml(first, item, false, item.at);
    html += qaBodyHtml(first.text, 'r-' + item.id + '-' + first.id);
    html += '</div>';
    if (more) {
      html +=
        '<button type="button" class="qa-more-replies" data-open="thread" data-id="' +
        esc(item.id) +
        '">Read ' +
        more +
        (more === 1 ? ' more reply' : ' more replies') +
        '</button>';
    }
  }
  html += '</div>' + qaEngageHtml(item, false) + '</article>';
  return html;
}

function qaUnansweredCount() {
  var i;
  var n = 0;
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].kind === 'question' && !(FEED[i].replies && FEED[i].replies.length)) n += 1;
  }
  return n;
}

function qaFeedLeadHtml() {
  var n;
  if (typeof oppLeadHtml === 'function') return oppLeadHtml();
  if (qaIsStudent()) {
    return (
      '<div class="qa-ask-row">' +
      qaYouAv() +
      '<button type="button" class="qa-ask-open" data-qa-ask="1">What do you want to ask?</button></div>'
    );
  }
  if (qaIsMentor()) {
    n = qaUnansweredCount();
    if (!n) return '';
    return (
      '<p class="qa-queue">' +
      n +
      (n === 1 ? ' question with no answer' : ' questions with no answer') +
      '</p>'
    );
  }
  return '';
}

function qaTagPickerHtml(item) {
  var q = ensureQa();
  var chosen = q.tags || [];
  var already = qaTopics(item).length > 0;
  var html = '<div class="qa-tags" id="qa-tag-wrap">';
  var i;
  html += '<label class="qa-tags-label" for="qa-tag-q">Tag this question</label>';
  html += '<div class="qa-chosen" id="qa-chosen"' + (chosen.length ? '' : ' hidden') + '>';
  for (i = 0; i < chosen.length; i++) {
    html +=
      '<span class="qa-chip">' +
      esc(chosen[i]) +
      '<span class="qa-chip-x" role="button" tabindex="0" data-qa-untag="' +
      esc(chosen[i]) +
      '" aria-label="Remove ' +
      esc(chosen[i]) +
      '">×</span></span>';
  }
  html += '</div>';
  html +=
    '<input id="qa-tag-q" class="qa-tag-input" role="combobox" aria-expanded="false" aria-controls="qa-sug" aria-autocomplete="list" placeholder="For example #Science, #Law…" value="' +
    esc(q.tagQ || '') +
    '"/>';
  html += '<div class="qa-sug" id="qa-sug" role="listbox" hidden></div>';
  html += '<div class="qa-tag-foot"><span class="qa-tag-hint" id="qa-tag-hint"></span>';
  if (already) {
    html += '<span class="qa-tagged">' + qaTickSvg() + 'Already tagged</span>';
  }
  html += '</div></div>';
  return html;
}

function qaComposerHtml(item) {
  var mentor = qaIsMentor();
  var q = ensureQa();
  var html = '<div class="qa-compose">';
  html +=
    '<p class="qa-compose-label">' +
    (mentor ? "Answer student's question" : 'Reply to this question') +
    '</p>';
  html += '<div class="qa-compose-grid">' + qaYouAv();
  html += '<div class="qa-compose-field">';
  html +=
    '<textarea id="qa-reply" rows="1" placeholder="' +
    (mentor ? 'What would you tell this student?' : 'Add your experience or ask a follow-up…') +
    '">' +
    esc(q.draft || '') +
    '</textarea>';
  if (mentor) html += qaTagPickerHtml(item);
  html +=
    '<div class="qa-compose-foot"><p class="qa-note">' +
    (mentor ? '' : 'Please be respectful.') +
    '</p><button type="button" class="qa-post" id="qa-post" data-qa-post="' +
    esc(item.id) +
    '" disabled>' +
    (mentor ? 'Post answer' : 'Reply') +
    '</button></div>';
  html += '</div></div></div>';
  return html;
}

function qaThreadHtml(item) {
  var replies = item.replies || [];
  var i;
  var n;
  var html = '<div class="qa-sheet">';
  html += qaIdentityHtml(item, true);
  html += '<h2 class="qa-q">' + esc(item.title || item.question || '') + '</h2>';
  html += qaTopicsHtml(item, true);
  html += qaEngageHtml(item, true);
  if (!replies.length) html += '<p class="qa-caption">No replies yet</p>';
  else {
    html +=
      '<p class="qa-caption">' +
      replies.length +
      (replies.length === 1 ? ' reply' : ' replies') +
      ', oldest first</p>';
  }
  html += '<div class="qa-thread-list">';
  for (i = 0; i < replies.length; i++) {
    n = qaNormReply(replies[i]);
    html += '<div class="qa-thread-item">';
    html += qaReplyHeadHtml(n, item, true, item.at);
    html += qaBodyHtml(n.text);
    html += '</div>';
  }
  html += '</div>';
  html += qaComposerHtml(item);
  html += '</div>';
  return html;
}

function qaMatchTopics(term, item) {
  var q = term.replace(/^#/, '').toLowerCase().replace(/\s+/g, '');
  var chosen = ensureQa().tags || [];
  var have = qaTopics(item);
  var all = qaTopicCatalog();
  var prefix = [];
  var sub = [];
  var i;
  var key;
  var hit;
  if (!q) return [];
  for (i = 0; i < all.length; i++) {
    key = all[i].tag.replace(/^#/, '').toLowerCase();
    if (chosen.indexOf(all[i].tag) !== -1 || have.indexOf(all[i].tag) !== -1) continue;
    if (key.indexOf(q) === 0) prefix.push(all[i]);
    else if (key.indexOf(q) !== -1) sub.push(all[i]);
  }
  hit = prefix.concat(sub);
  if (hit.length > 6) hit.length = 6;
  return hit;
}

function qaSyncPostBtn(item) {
  var btn = byId('qa-post');
  var box = byId('qa-reply');
  var text = box && box.value ? box.value.trim() : '';
  var needTag = qaIsMentor() && qaTopics(item).length === 0 && !(ensureQa().tags && ensureQa().tags.length);
  if (!btn) return;
  btn.disabled = !text || needTag;
}

function qaSyncTagUi(item) {
  var q = ensureQa();
  var hint = byId('qa-tag-hint');
  var n = (q.tags || []).length;
  var sug = byId('qa-sug');
  var input = byId('qa-tag-q');
  var hits;
  var i;
  var html = '';
  if (hint) {
    if (!n) hint.textContent = '';
    else if (n >= 3) hint.textContent = '3 of 3 chosen. Remove one to change it.';
    else hint.textContent = n + ' of 3 chosen.';
  }
  if (!sug || !input) {
    qaSyncPostBtn(item);
    return;
  }
  if (!input.value || !input.value.replace(/\s/g, '')) {
    sug.hidden = true;
    sug.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    qaSyncPostBtn(item);
    return;
  }
  hits = qaMatchTopics(input.value, item);
  if (!hits.length) {
    html =
      '<p class="qa-sug-empty">No topic matches "' +
      esc(input.value.trim()) +
      '". Topics are set by the Next Step team, ask an admin to add one.</p>';
  } else {
    for (i = 0; i < hits.length; i++) {
      html +=
        '<button type="button" role="option" data-qa-pick="' +
        esc(hits[i].tag) +
        '" aria-selected="' +
        (q.tagIx === i ? 'true' : 'false') +
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
  qaSyncPostBtn(item);
}

function qaBindClamps() {
  var nodes = document.querySelectorAll('[data-qa-clamp]');
  var i;
  var el;
  var id;
  var btn;
  var overflow;
  for (i = 0; i < nodes.length; i++) {
    el = nodes[i];
    id = el.getAttribute('data-qa-clamp');
    btn = el.parentNode ? el.parentNode.querySelector('[data-qa-see="' + id + '"]') : null;
    overflow = el.scrollHeight > el.clientHeight + 2;
    if (overflow) {
      el.classList.add('qa-clamp');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'qa-see';
        btn.setAttribute('data-qa-see', id);
        btn.textContent = '…see more';
        el.parentNode.insertBefore(btn, el.nextSibling);
      }
    } else {
      if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
    }
  }
}

function qaAfterPaint() {
  var item;
  var top;
  qaBindClamps();
  if (NAV.length && NAV[NAV.length - 1].t === 'thread') {
    document.body.classList.add('qa-thread-open');
    top = NAV[NAV.length - 1];
    item = feedById(top.id);
    if (item) {
      qaSyncPostBtn(item);
      qaSyncTagUi(item);
    }
  } else {
    document.body.classList.remove('qa-thread-open');
  }
  qaPaintLayer();
  if (typeof oppAfterPaint === 'function') oppAfterPaint();
}

function qaOpenDialog(type, spec) {
  var q = ensureQa();
  spec = spec || {};
  q.dialog = type;
  q.dialogId = spec.id || '';
  q.dialogRid = spec.rid || '';
  q.dialogText = spec.text || '';
  q.reportReason = '';
  q.reportKind = spec.kind || 'question';
  qaPaintLayer();
}

function qaCloseDialog() {
  var q = ensureQa();
  q.dialog = '';
  q.dialogId = '';
  q.dialogRid = '';
  q.dialogText = '';
  q.reportReason = '';
  qaPaintLayer();
}

function qaPaintLayer() {
  var layer = byId('qa-layer');
  var q = ensureQa();
  var item;
  var r;
  var html;
  var left;
  if (!layer) return;
  if (!q.dialog) {
    if (S.opp && S.opp.dialog) return;
    layer.hidden = true;
    layer.innerHTML = '';
    return;
  }
  item = q.dialogId ? feedById(q.dialogId) : null;
  html = '<div class="qa-dialog" role="dialog" aria-modal="true" aria-labelledby="qa-dlg-title">';
  if (q.dialog === 'ask') {
    left = 180 - (q.dialogText || '').length;
    html += '<h2 id="qa-dlg-title">Ask a question</h2>';
    html +=
      '<p class="qa-sub">It is posted as "' +
      esc(studentLabel()) +
      '". Your name is never shown.</p>';
    html +=
      '<textarea id="qa-dlg-text" maxlength="180" placeholder="Ask one clear question, for example: do I need Chemistry for nursing?">' +
      esc(q.dialogText || '') +
      '</textarea>';
    html +=
      '<p class="qa-count' +
      (left < 20 ? ' is-low' : '') +
      '">' +
      left +
      ' left</p>';
    html +=
      '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-qa-cancel="1">Cancel</button><button type="button" class="qa-go" data-qa-ask-post="1"' +
      ((q.dialogText || '').trim().length < 10 ? ' disabled' : '') +
      '>Post</button></div>';
  } else if (q.dialog === 'edit-q' && item) {
    html += '<h2 id="qa-dlg-title">Edit your question</h2>';
    html += '<p class="qa-sub">Students who already replied will see that you edited it.</p>';
    html +=
      '<textarea id="qa-dlg-text" maxlength="180">' +
      esc(q.dialogText) +
      '</textarea>';
    html +=
      '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-qa-cancel="1">Cancel</button><button type="button" class="qa-go" data-qa-save-q="1"' +
      ((q.dialogText || '') === (item.title || '') ? ' disabled' : '') +
      '>Save</button></div>';
  } else if (q.dialog === 'del-q') {
    html += '<h2 id="qa-dlg-title">Delete this question?</h2>';
    html += '<p class="qa-sub">Any replies to it are deleted too. This cannot be undone.</p>';
    html +=
      '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-qa-cancel="1">Keep it</button><button type="button" class="qa-kill" data-qa-confirm-del-q="1">Delete</button></div>';
  } else if (q.dialog === 'edit-r') {
    html += '<h2 id="qa-dlg-title">Edit reply</h2>';
    html +=
      '<textarea id="qa-dlg-text">' +
      esc(q.dialogText) +
      '</textarea>';
    html +=
      '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-qa-cancel="1">Cancel</button><button type="button" class="qa-go" data-qa-save-r="1">Save</button></div>';
  } else if (q.dialog === 'del-r') {
    html += '<h2 id="qa-dlg-title">Delete your reply?</h2>';
    html += '<p class="qa-sub">It is removed from this question. This cannot be undone.</p>';
    html +=
      '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-qa-cancel="1">Keep it</button><button type="button" class="qa-kill" data-qa-confirm-del-r="1">Delete</button></div>';
  } else if (q.dialog === 'report') {
    html +=
      '<h2 id="qa-dlg-title">' +
      (q.reportKind === 'reply' ? 'Report this reply' : 'Report this question') +
      '</h2>';
    html += '<p class="qa-sub">Tell us what is wrong. A person reviews every report.</p>';
    html += qaReportReasonsHtml(q);
    if (q.reportReason === 'worry') {
      html +=
        '<p class="qa-safe-note">This goes straight to the Next Step safeguarding team, not to an automated queue. If a young person is in immediate danger, contact someone who can help right now as well.</p>';
    }
    html +=
      '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-qa-cancel="1">Cancel</button><button type="button" class="qa-go" data-qa-send-report="1"' +
      (q.reportReason ? '' : ' disabled') +
      '>Send</button></div>';
  }
  html += '</div>';
  layer.innerHTML = html;
  layer.hidden = false;
  r = byId('qa-dlg-text');
  if (r) r.focus();
}

function qaReportReasonsHtml(q) {
  var reasons = [
    ['wrong', 'Wrong or misleading information', false],
    ['unkind', 'Rude or unkind', false],
    ['spam', 'Spam, or not a real question', false],
    ['personal', "Shares someone's personal details", false],
    ['worry', 'I am worried about this student', true]
  ];
  var html = '<div class="qa-reasons">';
  var i;
  for (i = 0; i < reasons.length; i++) {
    html +=
      '<button type="button" class="qa-reason' +
      (reasons[i][2] ? ' is-safe' : '') +
      '" data-qa-reason="' +
      reasons[i][0] +
      '" aria-pressed="' +
      (q.reportReason === reasons[i][0] ? 'true' : 'false') +
      '">' +
      esc(reasons[i][1]) +
      '</button>';
  }
  html += '</div>';
  return html;
}

function qaPostQuestion() {
  var q = ensureQa();
  var text = (q.dialogText || '').trim();
  var nid;
  var el;
  if (text.length < 10) return;
  if (
    requirePathway({
      type: 'compose',
      reason: 'Answer four questions first. This is the same quiz as My Pathway.'
    })
  ) {
    return;
  }
  nid = 'mine-' + Date.now();
  FEED.unshift({
    id: nid,
    kind: 'question',
    at: nowIso(),
    who: studentLabel(),
    asker: studentLabel(),
    authorId: qaViewerId(),
    title: text,
    body: text,
    question: text,
    topics: [],
    replies: [],
    mine: true,
    anon: true,
    insp: 0,
    inspiredCount: 0
  });
  if (S.qFollow.indexOf(nid) === -1) S.qFollow.push(nid);
  qaCloseDialog();
  toast('Question posted. We will tell you when someone answers.');
  render();
  el = document.querySelector('[data-open="thread"][data-id="' + nid + '"]');
  if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center' });
}

function qaSaveQuestion() {
  var q = ensureQa();
  var item = feedById(q.dialogId);
  var text = (q.dialogText || '').trim();
  if (!item || text.length < 10 || text === item.title) return;
  item.title = text;
  item.body = text;
  item.question = text;
  item.edited = true;
  item.editedAt = nowIso();
  qaCloseDialog();
  toast('Question updated.');
  refreshUi();
}

function qaDeleteQuestion() {
  var q = ensureQa();
  var id = q.dialogId;
  FEED = FEED.filter(function (x) {
    return x.id !== id;
  });
  qaCloseDialog();
  if (NAV.length && NAV[NAV.length - 1].t === 'thread' && NAV[NAV.length - 1].id === id) {
    closeSheet();
  }
  toast('Question deleted.');
  render();
}

function qaFindReply(item, rid) {
  var i;
  if (!item || !item.replies) return null;
  for (i = 0; i < item.replies.length; i++) {
    if (item.replies[i].id === rid) return item.replies[i];
  }
  return null;
}

function qaSaveReply() {
  var q = ensureQa();
  var item = feedById(q.dialogId);
  var r = qaFindReply(item, q.dialogRid);
  var text = (q.dialogText || '').trim();
  if (!r || !text || text === r.text) return;
  r.text = text;
  r.edited = true;
  r.editedAt = nowIso();
  qaCloseDialog();
  toast('Reply updated.');
  refreshUi();
}

function qaDeleteReply() {
  var q = ensureQa();
  var item = feedById(q.dialogId);
  if (!item) return;
  item.replies = (item.replies || []).filter(function (r) {
    return r.id !== q.dialogRid;
  });
  qaCloseDialog();
  toast('Reply deleted.');
  refreshUi();
}

function qaSendReport() {
  var q = ensureQa();
  var key = (q.reportKind === 'reply' ? 'reply:' : 'thread:') + q.dialogId + (q.dialogRid ? ':' + q.dialogRid : '');
  if (!q.reportReason) return;
  if (
    requirePathway({
      type: 'report',
      id: key,
      reason: 'We need your form before we send a report.'
    })
  ) {
    return;
  }
  if (q.reportReason === 'worry') {
    S.safeguardCases.push({
      key: key,
      reason: q.reportReason,
      at: nowIso(),
      queue: 'safeguarding'
    });
    toast('Sent to the safeguarding team. Someone will review it today.');
  } else {
    S.reported.push({ key: key, reason: q.reportReason, at: nowIso(), queue: 'desk' });
    toast('Report sent. Thank you for telling us.');
  }
  qaCloseDialog();
}

function qaToggleUpdates(id) {
  var i;
  if (
    requirePathway({
      type: 'follow',
      id: id,
      reason: 'We need your form to hold you a place.'
    })
  ) {
    return;
  }
  i = S.qFollow.indexOf(id);
  if (i === -1) {
    S.qFollow.push(id);
    toast('We will tell you when someone answers.');
  } else {
    S.qFollow.splice(i, 1);
    toast('Updates turned off.');
  }
  refreshUi();
}

function qaHideWithUndo(key) {
  if (!key) return;
  if (S.hidden.indexOf(key) === -1) S.hidden.push(key);
  S.menu = '';
  toast('You will see fewer questions like this.', {
    undo: function () {
      S.hidden = S.hidden.filter(function (k) {
        return k !== key;
      });
      render();
    }
  });
  render();
}

function qaAddTag(tag) {
  var q = ensureQa();
  if (!tag) return;
  if (!q.tags) q.tags = [];
  if (q.tags.indexOf(tag) !== -1) return;
  if (q.tags.length >= 3) return;
  q.tags.push(tag);
  q.tagQ = '';
  q.tagIx = -1;
}

function qaRemoveTag(tag) {
  var q = ensureQa();
  q.tags = (q.tags || []).filter(function (t) {
    return t !== tag;
  });
}

function qaPostReply(id) {
  var item = feedById(id);
  var box = byId('qa-reply');
  var text = box && box.value ? box.value.trim() : '';
  var mentor = qaIsMentor();
  var q = ensureQa();
  var rec;
  var a;
  if (!item || !text) return;
  if (mentor && qaTopics(item).length === 0 && !(q.tags && q.tags.length)) return;
  if (
    requirePathway({
      type: 'reply',
      id: id,
      text: text,
      reason: 'We need your form to hold you a place.'
    })
  ) {
    return;
  }
  ensureReplyIds(item);
  item.replies = item.replies || [];
  if (mentor) {
    a = currentPosterId() ? author(currentPosterId()) : null;
    rec = {
      id: id + '-r' + Date.now(),
      a: currentPosterId(),
      authorId: currentPosterId(),
      authorRole: 'mentor',
      name: a ? a.name : 'Mentor',
      initials: a ? a.init : 'ME',
      verified: !!(a && a.verified && a.role === 'mentor'),
      role: 'Mentor · ' + ((a && a.pos) || ''),
      text: text,
      at: nowIso(),
      createdAt: nowIso()
    };
    if (q.tags && q.tags.length) {
      item.topics = qaTopics(item).concat(q.tags);
      if (!item.cat && q.tags[0]) item.cat = q.tags[0].replace(/^#/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
    }
    q.tags = [];
    q.draft = '';
    item.replies.push(rec);
    toast('Answer posted.');
  } else {
    item.replies.push({
      id: id + '-r' + Date.now(),
      a: null,
      authorId: qaViewerId(),
      authorRole: postingRole() === 'parent' ? 'parent' : 'student',
      who: studentLabel(),
      name: studentLabel(),
      initials: (studentLabel().charAt(0) || 'S').toUpperCase(),
      text: text,
      mine: true,
      at: nowIso(),
      createdAt: nowIso()
    });
    q.draft = '';
    toast('Reply posted.');
  }
  S.qFollow = S.qFollow.filter(function (x) {
    return x !== id;
  });
  paint();
  render();
}

function qaHandleClick(e, t) {
  var btn;
  var item;
  var r;
  var q = ensureQa();
  var top;
  btn = closestEl(t, '[data-qa-ask]');
  if (btn) {
    e.stopPropagation();
    if (
      requirePathway({
        type: 'compose',
        reason: 'Answer four questions first. This is the same quiz as My Pathway.'
      })
    ) {
      return true;
    }
    qaOpenDialog('ask', { text: '' });
    return true;
  }
  btn = closestEl(t, '[data-qa-cancel]');
  if (btn) {
    qaCloseDialog();
    return true;
  }
  btn = closestEl(t, '[data-qa-ask-post]');
  if (btn) {
    qaPostQuestion();
    return true;
  }
  btn = closestEl(t, '[data-qa-save-q]');
  if (btn) {
    qaSaveQuestion();
    return true;
  }
  btn = closestEl(t, '[data-qa-confirm-del-q]');
  if (btn) {
    qaDeleteQuestion();
    return true;
  }
  btn = closestEl(t, '[data-qa-save-r]');
  if (btn) {
    qaSaveReply();
    return true;
  }
  btn = closestEl(t, '[data-qa-confirm-del-r]');
  if (btn) {
    qaDeleteReply();
    return true;
  }
  btn = closestEl(t, '[data-qa-reason]');
  if (btn) {
    q.reportReason = btn.getAttribute('data-qa-reason');
    qaPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-qa-send-report]');
  if (btn) {
    qaSendReport();
    return true;
  }
  btn = closestEl(t, '[data-qa-edit-q]');
  if (btn) {
    e.stopPropagation();
    item = feedById(btn.getAttribute('data-qa-edit-q'));
    if (item && qaOwnsQuestion(item)) {
      qaOpenDialog('edit-q', { id: item.id, text: item.title || '' });
    }
    S.menu = '';
    return true;
  }
  btn = closestEl(t, '[data-qa-del-q]');
  if (btn) {
    e.stopPropagation();
    item = feedById(btn.getAttribute('data-qa-del-q'));
    if (item && qaOwnsQuestion(item)) qaOpenDialog('del-q', { id: item.id });
    S.menu = '';
    return true;
  }
  btn = closestEl(t, '[data-qa-edit-r]');
  if (btn) {
    e.stopPropagation();
    item = feedById(btn.getAttribute('data-qa-edit-r'));
    r = qaFindReply(item, btn.getAttribute('data-rid'));
    if (r && qaOwnsReply(r)) qaOpenDialog('edit-r', { id: item.id, rid: r.id, text: r.text || '' });
    S.menu = '';
    return true;
  }
  btn = closestEl(t, '[data-qa-del-r]');
  if (btn) {
    e.stopPropagation();
    item = feedById(btn.getAttribute('data-qa-del-r'));
    r = qaFindReply(item, btn.getAttribute('data-rid'));
    if (r && qaOwnsReply(r)) qaOpenDialog('del-r', { id: item.id, rid: r.id });
    S.menu = '';
    return true;
  }
  btn = closestEl(t, '[data-qa-report]');
  if (btn) {
    e.stopPropagation();
    qaOpenDialog('report', {
      id: btn.getAttribute('data-id'),
      rid: btn.getAttribute('data-rid') || '',
      kind: btn.getAttribute('data-qa-report')
    });
    S.menu = '';
    return true;
  }
  btn = closestEl(t, '[data-qa-updates]');
  if (btn) {
    e.stopPropagation();
    qaToggleUpdates(btn.getAttribute('data-qa-updates'));
    return true;
  }
  btn = closestEl(t, '[data-qa-see]');
  if (btn) {
    e.stopPropagation();
    item = closestEl(btn, '[data-open]');
    if (item) openKind(item.getAttribute('data-open'), item.getAttribute('data-id'));
    return true;
  }
  btn = closestEl(t, '[data-qa-post]');
  if (btn) {
    e.stopPropagation();
    qaPostReply(btn.getAttribute('data-qa-post'));
    return true;
  }
  btn = closestEl(t, '[data-qa-pick]');
  if (btn) {
    e.stopPropagation();
    qaAddTag(btn.getAttribute('data-qa-pick'));
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-qa-untag]');
  if (btn) {
    e.stopPropagation();
    qaRemoveTag(btn.getAttribute('data-qa-untag'));
    top = NAV.length ? NAV[NAV.length - 1] : null;
    item = top && top.t === 'thread' ? feedById(top.id) : null;
    refreshUi();
    if (item) qaSyncTagUi(item);
    return true;
  }
  if (byId('qa-layer') && !byId('qa-layer').hidden && !closestEl(t, '.qa-dialog') && !(S.opp && S.opp.dialog)) {
    qaCloseDialog();
    return true;
  }
  return false;
}

function qaHandleInput(e) {
  var item;
  var top;
  var q = ensureQa();
  if (e.target && e.target.id === 'qa-dlg-text') {
    q.dialogText = e.target.value;
    if (q.dialog === 'ask' || q.dialog === 'edit-q') qaPaintLayer();
    if (q.dialog === 'ask') {
      e.target = byId('qa-dlg-text');
      if (e.target) {
        e.target.focus();
        try {
          e.target.setSelectionRange(q.dialogText.length, q.dialogText.length);
        } catch (err) {}
      }
    }
    return true;
  }
  if (e.target && e.target.id === 'qa-reply') {
    q.draft = e.target.value;
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(220, Math.max(44, e.target.scrollHeight)) + 'px';
    top = NAV.length ? NAV[NAV.length - 1] : null;
    item = top && top.t === 'thread' ? feedById(top.id) : null;
    if (item) qaSyncPostBtn(item);
    return true;
  }
  if (e.target && e.target.id === 'qa-tag-q') {
    q.tagQ = e.target.value;
    q.tagIx = -1;
    top = NAV.length ? NAV[NAV.length - 1] : null;
    item = top && top.t === 'thread' ? feedById(top.id) : null;
    if (item) qaSyncTagUi(item);
    return true;
  }
  return false;
}

function qaHandleKey(e) {
  var q = ensureQa();
  var sug = byId('qa-sug');
  var opts;
  var item;
  var top;
  var n;
  if (e.target && e.target.id === 'qa-tag-q') {
    top = NAV.length ? NAV[NAV.length - 1] : null;
    item = top && top.t === 'thread' ? feedById(top.id) : null;
    opts = sug && !sug.hidden ? sug.querySelectorAll('[data-qa-pick]') : [];
    n = opts.length;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (sug) sug.hidden = true;
      return true;
    }
    if (e.key === 'ArrowDown' && n) {
      e.preventDefault();
      q.tagIx = q.tagIx + 1 >= n ? 0 : q.tagIx + 1;
      if (item) qaSyncTagUi(item);
      if (opts[q.tagIx] && opts[q.tagIx].scrollIntoView) opts[q.tagIx].scrollIntoView({ block: 'nearest' });
      return true;
    }
    if (e.key === 'ArrowUp' && n) {
      e.preventDefault();
      q.tagIx = q.tagIx <= 0 ? n - 1 : q.tagIx - 1;
      if (item) qaSyncTagUi(item);
      return true;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (n) qaAddTag((opts[q.tagIx >= 0 ? q.tagIx : 0] || opts[0]).getAttribute('data-qa-pick'));
      refreshUi();
      return true;
    }
    if (e.key === 'Backspace' && !e.target.value && q.tags && q.tags.length) {
      qaRemoveTag(q.tags[q.tags.length - 1]);
      refreshUi();
      return true;
    }
  }
  if (e.key === 'Escape') {
    if (q.dialog) {
      e.preventDefault();
      qaCloseDialog();
      return true;
    }
    if (S.menu) {
      S.menu = '';
      refreshUi();
      return true;
    }
  }
  return false;
}

function qaInit() {
  var t;
  if (qaInit._ready) return;
  qaInit._ready = true;
  window.addEventListener('resize', function () {
    clearTimeout(qaInit._r);
    qaInit._r = setTimeout(qaBindClamps, 150);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      qaBindClamps();
    });
  }
  t = setInterval(function () {
    if (NAV.length && NAV[NAV.length - 1].t === 'thread') return;
    if (S.view !== 'feed') return;
    if (S.qa && S.qa.dialog) return;
  }, 60000);
  if (!t) return;
}
