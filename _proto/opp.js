/* Opportunity card, story card, and role-gated Post entry.
   Matches Q&A type, tokens, clamp, menus, and toasts.
   Story fields are the spec's proposal: body, one topic, optional poster or link. No title. */

function ensureOpp() {
  if (!S.opp) {
    S.opp = {
      dialog: '',
      dialogId: '',
      mode: '',
      step: 1,
      title: '',
      description: '',
      topic: '',
      tagQ: '',
      tagIx: -1,
      poster: null,
      posterAlt: '',
      linkUrl: '',
      who: '',
      where: '',
      when: '',
      closesAt: '',
      rolling: false,
      apply: '',
      storyBody: '',
      photos: [],
      draftId: '',
      editId: '',
      reportReason: '',
      reportKind: '',
      dateVal: '',
      lightUrl: '',
      lightAlt: '',
      lightPhotos: null,
      lightIx: 0,
      lastFocus: null,
      fromWho: false
    };
  }
  if (!S.opp.photos) S.opp.photos = [];
  if (!S.oppDrafts) S.oppDrafts = [];
  if (!S.oppRemind) S.oppRemind = [];
  if (!S.safeguardCases) S.safeguardCases = [];
  return S.opp;
}

function oppIsAskOnly() {
  var r = postingRole();
  return r === 'student' || r === 'parent';
}

function oppCanAuthor() {
  return qaIsMentor();
}

function oppIsParent() {
  return postingRole() === 'parent';
}

function oppOverlayOpen() {
  var sug;
  if (NAV.length) return true;
  if (S.qa && S.qa.dialog) return true;
  if (S.sess && S.sess.dialog) return true;
  if (S.opp && (S.opp.dialog || S.opp.lightUrl || (S.opp.lightPhotos && S.opp.lightPhotos.length))) return true;
  if (S.menu) return true;
  sug = byId('opp-sug');
  if (sug && !sug.hidden) return true;
  return false;
}

function oppFeedFor(oid) {
  var i;
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].kind === 'opportunity' && (FEED[i].opp === oid || FEED[i].id === oid)) return FEED[i];
  }
  return null;
}

function oppAuthorId(o, item) {
  var aid = (o && o.author) || (item && item.author) || '';
  if (aid && aid !== 'desk') return aid;
  if (o && o.mentors && o.mentors.length) return o.mentors[0];
  return 'keisha';
}

function oppAuthorKind(a) {
  if (!a) return 'mentor';
  if (a.role === 'contributor' || a.role === 'admin') return 'collaborator';
  return 'mentor';
}

function oppInitials(a) {
  var s;
  if (a && a.init) return String(a.init).slice(0, 2).toUpperCase();
  s = ((a && a.name) || 'NS').replace(/[^A-Za-z]/g, '');
  return (s.slice(0, 2) || 'NS').toUpperCase();
}

function oppDescText(o) {
  if (o.description) return o.description;
  if (o.what && o.what.length) return o.what.join('\n\n');
  return o.one || '';
}

function oppOpening(src) {
  var o;
  var item;
  var a;
  var aid;
  var kind;
  var topic;
  var rolling;
  if (!src) return null;
  if (src._card) return src;
  if (typeof src === 'string') {
    o = OPPS[src] || null;
    item = oppFeedFor(src);
  } else if (src.kind === 'opportunity') {
    item = src;
    o = OPPS[src.opp] || src.opening || null;
  } else {
    o = src;
    item = oppFeedFor(src.id);
  }
  if (!o) return null;
  aid = oppAuthorId(o, item);
  a = author(aid);
  kind = oppAuthorKind(a);
  topic = o.topic || (o.cat ? hashTagLabel(o.cat) : '');
  rolling = !!o.rolling;
  if (!o.closesAt && !rolling && o.season && /year-round|all year|rolling intake/i.test(o.season)) {
    rolling = true;
  }
  return {
    id: o.id,
    status: o.status || ((o.state || 'live') === 'live' ? 'published' : o.state),
    authorId: aid,
    author: {
      name: a.name,
      initials: oppInitials(a),
      kind: kind,
      verified: true,
      role: kind === 'collaborator' ? 'Collaborator' : 'Mentor',
      pos: a.pos || ''
    },
    createdAt: (item && item.at) || o.createdAt || '',
    editedAt: (item && (item.editedAt || (item.edited && item.at))) || o.editedAt || '',
    title: o.title || o.name || '',
    description: oppDescText(o),
    topic: topic,
    who: o.who || '',
    where: o.where || o.regions || 'Nationwide',
    when: o.when || o.season || '',
    closesAt: rolling ? null : o.closesAt || null,
    rolling: rolling,
    apply: o.apply || (o.entry && o.entry[0] ? o.entry[0].b + '. ' + o.entry[0].s : o.source || ''),
    poster: o.poster || null,
    link: o.link || null,
    replies: (item && item.replies) || o.replies || [],
    inspiredCount: (item && item.insp != null) ? item.insp : o.inspiredCount || 0,
    src: o,
    item: item
  };
}

function oppOwns(o) {
  var viewer = currentPosterId();
  if (!o || !viewer) return false;
  return o.authorId === viewer;
}

function oppClosed(o) {
  if (!o || !o.closesAt || o.rolling) return false;
  return new Date(o.closesAt).getTime() <= Date.now();
}

function oppMsLeft(o) {
  if (!o || !o.closesAt || o.rolling) return null;
  return new Date(o.closesAt).getTime() - Date.now();
}

function oppDateLabel(iso) {
  var d;
  var months;
  if (!iso) return '';
  d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  months = [
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
  return String(d.getDate()) + ' ' + months[d.getMonth()];
}

function oppCloseCopy(o) {
  var ms;
  var phrase;
  if (!o || o.rolling || !o.closesAt) return null;
  ms = oppMsLeft(o);
  if (ms <= 0) return { text: 'Closed on ' + oppDateLabel(o.closesAt), tone: 'shut' };
  phrase = countDownPhrase(new Date(o.closesAt).getTime(), 'Closes');
  return { text: phrase || 'Closes in 1 minute', tone: 'soon' };
}

function oppWarnPhrase(o) {
  var c = oppCloseCopy(o);
  if (!c || c.tone === 'shut') return '';
  return c.text.replace(/^Closes /, 'closes ');
}

function oppParseLink(raw) {
  var v = (raw || '').trim();
  var url;
  var host;
  if (!v) return null;
  if (!/^https?:\/\//i.test(v) && /^www\./i.test(v)) v = 'https://' + v;
  try {
    url = new URL(v);
  } catch (err) {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  host = url.hostname.replace(/^www\./i, '');
  return { url: url.href, host: host };
}

function oppDetectApply(v) {
  var t = (v || '').trim();
  if (!t) return { kind: 'text', href: '', label: '' };
  if (/^https?:\/\//i.test(t) || /^www\./i.test(t)) {
    return {
      kind: 'link',
      href: /^https?:\/\//i.test(t) ? t : 'https://' + t,
      label: 'Open this link'
    };
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
    return { kind: 'email', href: 'mailto:' + t, label: 'Send an email' };
  }
  if (/^[\d\s+().-]{7,}$/.test(t) && /\d{7,}/.test(t.replace(/\D/g, ''))) {
    return { kind: 'tel', href: 'tel:' + t.replace(/[^\d+]/g, ''), label: 'Call this number' };
  }
  return { kind: 'text', href: '', label: '' };
}

function oppSlug(title) {
  var s = String(title || 'opening')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return s || 'opening';
}

function oppIcsHref(o) {
  function stamp(dt) {
    return dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }
  var d;
  var lines;
  if (!o || !o.closesAt) return '';
  d = new Date(o.closesAt);
  if (isNaN(d.getTime())) return '';
  lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Next Step Guyana//Opportunity//EN',
    'BEGIN:VEVENT',
    'UID:' + o.id + '@nextstepguyana',
    'DTSTAMP:' + stamp(new Date()),
    'DTSTART:' + stamp(d),
    'SUMMARY:' + String(o.title || 'Opening').replace(/[\r\n]/g, ' ') + ' closes',
    'DESCRIPTION:Closing date for ' + String(o.title || 'this opening').replace(/[\r\n]/g, ' '),
    'BEGIN:VALARM',
    'TRIGGER:-P7D',
    'ACTION:DISPLAY',
    'DESCRIPTION:This opening closes in one week',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(lines.join('\r\n'));
}

function oppIconClock() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 1.5"/></svg>';
}

function oppIconPerson() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 19c.8-3.2 3.2-5 6.5-5s5.7 1.8 6.5 5"/></svg>';
}

function oppIconPin() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10z"/><circle cx="12" cy="11" r="1.8"/></svg>';
}

function oppIconExt() {
  return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 5h5v5"/><path d="M10 14L19 5"/><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>';
}

function oppAvHtml(o, size) {
  var cls = o.author.kind === 'collaborator' ? 'is-org' : 'is-person';
  var px = size || 48;
  return (
    '<span class="opp-av ' +
    cls +
    '" style="width:' +
    px +
    'px;height:' +
    px +
    'px" aria-hidden="true">' +
    esc(o.author.initials) +
    '</span>'
  );
}

function oppAuthorHtml(o, withMenu, hideMenu) {
  var role = o.author.role + (o.author.pos ? ' · ' + o.author.pos : '');
  var when = qaTimeAgo(o.createdAt);
  var aid = hideMenu ? '' : o.authorId || o.author.id || '';
  var ident =
    authorHitBtn(oppAvHtml(o, 48), aid, 'av-hit') +
    '<div class="ident-name">' +
    authorHitBtn(
      '<div class="opp-name"><span class="ident-text">' +
        esc(o.author.name) +
        '</span>' +
        (o.author.verified ? qaTickSvg() + '<span class="sr">Verified</span>' : '') +
        '</div><p class="opp-role">' +
        esc(role) +
        '</p>',
      aid,
      'name-hit'
    ) +
    '<p class="opp-meta">' +
    kindOpenBtn('opportunity', 'Opportunity') +
    (when ? ' · ' + esc(when) : '') +
    (o.editedAt ? ' · edited' : '') +
    '</p></div>';
  return (
    '<div class="opp-author">' +
    authorLinkWrap(ident) +
    (hideMenu ? '' : withMenu ? oppMenuHtml(o) : '') +
    '</div>'
  );
}

function oppMenuHtml(o) {
  var key = hideKey('opp', o.id);
  var open = S.menu === key;
  var closed = oppClosed(o);
  var dated = !!(o.closesAt && !o.rolling);
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
    if (oppOwns(o)) {
      html += qaMenuItem('data-opp-edit="' + esc(o.id) + '"', 'Edit this opening', false);
      if (closed) {
        html += qaMenuItem('data-opp-reopen="' + esc(o.id) + '"', 'Set a new closing date', false);
      }
      html += '<hr/>';
      html += qaMenuItem('data-opp-del="' + esc(o.id) + '"', 'Delete opening', true);
    } else {
      if (dated && !closed) {
        html += qaMenuItem('data-opp-remind="' + esc(o.id) + '"', 'Remind me before it closes', false);
      }
      html += qaMenuItem('data-opp-hide="' + esc(key) + '"', 'Not interested', false);
      html += '<hr/>';
      html += qaMenuItem('data-opp-report="' + esc(o.id) + '"', 'Report a problem', true);
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function oppTopicHtml(tag) {
  if (!tag) return '';
  return (
    '<div class="opp-topics"><button type="button" class="opp-chip" data-topic="' +
    esc(qaTopicRaw(tag) || tag) +
    '">' +
    esc(tag) +
    '</button></div>'
  );
}

function oppDeadlineHtml(o) {
  var c = oppCloseCopy(o);
  if (!c) return '';
  return (
    '<div class="opp-deadline is-' +
    c.tone +
    '">' +
    oppIconClock() +
    '<span>' +
    esc(c.text) +
    '</span></div>'
  );
}

function oppPosterHtml(poster, where) {
  var max = where === 'sheet' ? 520 : 340;
  var ratio;
  if (!poster || !poster.url) return '';
  ratio = poster.width && poster.height ? poster.width + ' / ' + poster.height : '3 / 4';
  return (
    '<button type="button" class="opp-poster" data-opp-light="1" data-url="' +
    esc(poster.url) +
    '" data-alt="' +
    esc(poster.alt || '') +
    '" style="aspect-ratio:' +
    ratio +
    ';max-height:' +
    max +
    'px">' +
    '<img src="' +
    esc(poster.url) +
    '" alt="' +
    esc(poster.alt || '') +
    '" loading="lazy" decoding="async"/>' +
    '</button>'
  );
}

function oppLinkHtml(link) {
  if (!link || !link.url || !link.host) return '';
  return (
    '<a class="opp-link" href="' +
    esc(link.url) +
    '" target="_blank" rel="noopener">' +
    (link.image
      ? '<div class="opp-link-img"><img src="' + esc(link.image) + '" alt=""/></div>'
      : '') +
    '<div class="opp-link-meta"><div class="opp-link-host">' +
    oppIconExt() +
    esc(link.host) +
    '</div>' +
    (link.title ? '<div class="opp-link-title">' + esc(link.title) + '</div>' : '') +
    (link.description ? '<p class="opp-link-desc">' + esc(link.description) + '</p>' : '') +
    '</div></a>'
  );
}

function oppGlanceHtml(o) {
  function item(icon, dt, val) {
    return (
      '<div class="g">' +
      '<span class="gi" aria-hidden="true">' +
      icon +
      '</span>' +
      '<div><dt class="sr">' +
      esc(dt) +
      '</dt><dd>' +
      esc(val || '') +
      '</dd></div></div>'
    );
  }
  return (
    '<dl class="glance">' +
    item(oppIconPerson(), 'Who it is for', o.who) +
    item(oppIconPin(), 'Where', o.where) +
    item(oppIconClock(), 'When', o.when) +
    '</dl>'
  );
}

function oppEngageHtml(o, opts) {
  var n = o.replies ? o.replies.length : 0;
  var inspired = isInspired(o.id);
  var saved = isSaved(o.id);
  var closed = oppClosed(o);
  var replyLabel = n === 0 ? 'Reply' : n === 1 ? '1 reply' : n + ' replies';
  var inspN = o.inspiredCount || 0;
  var html = '<div class="qa-actions opp-actions">';
  html +=
    '<button type="button" class="qa-act is-inspired" data-inspire="' +
    esc(o.id) +
    '" aria-pressed="' +
    (inspired ? 'true' : 'false') +
    '">' +
    qaIconHeart(inspired) +
    '<span>' +
    (inspN ? 'Inspired ' + inspN : 'Inspired') +
    '</span></button>';
  if (!opts || !opts.inSheet) {
    html +=
      '<button type="button" class="qa-act" data-open="opp" data-id="' +
      esc(o.id) +
      '">' +
      qaIconReply() +
      '<span>' +
      esc(replyLabel) +
      '</span></button>';
  }
  html +=
    '<button type="button" class="qa-act is-save" data-save="' +
    esc(o.id) +
    '" aria-pressed="' +
    (saved ? 'true' : 'false') +
    '">' +
    qaIconSave(saved) +
    '<span>' +
    (saved ? 'Saved' : 'Save') +
    '</span></button>';
  html +=
    '<button type="button" class="opp-primary" data-opp-apply="' +
    esc(o.id) +
    '"' +
    (closed ? ' disabled' : '') +
    '>' +
    (closed ? 'Closed' : 'How to apply') +
    '</button>';
  html += '</div>';
  return html;
}

function oppRenderCard(item, opts) {
  var o = oppOpening(item);
  var html;
  opts = opts || {};
  if (!o || (o.status !== 'published' && o.status !== 'live' && !opts.preview)) return '';
  if (!opts.preview && o.src && !openingVisible(o.src)) return '';
  html =
    '<article class="card feed-card kind-opp opp-card' +
    (oppClosed(o) ? ' closed' : '') +
    (opts.preview ? ' opp-preview' : ' clickable') +
    '" ' +
    (opts.preview ? '' : cardClickAttrs('opp', o.id)) +
    '><div class="opp-pad">';
  html += oppAuthorHtml(o, true, !!opts.preview);
  html +=
    '<h3 class="opp-title' +
    (opts.preview ? '' : ' qa-clamp') +
    '"' +
    (opts.preview ? '' : ' data-qa-clamp="ot-' + esc(o.id) + '"') +
    '>' +
    esc(o.title) +
    '</h3>';
  html +=
    '<p class="opp-desc' +
    (opts.preview ? '' : ' qa-clamp') +
    '"' +
    (opts.preview ? '' : ' data-qa-clamp="od-' + esc(o.id) + '"') +
    '>' +
    esc(o.description) +
    '</p>';
  html += oppTopicHtml(o.topic);
  html += oppPosterHtml(o.poster, 'feed');
  html += oppLinkHtml(o.link);
  html += oppDeadlineHtml(o);
  html += '</div>';
  html += oppGlanceHtml(o);
  html += oppEngageHtml(o, { inSheet: false });
  html += '</article>';
  return html;
}

function oppStoryBody(item) {
  var text = '';
  if (item.bodyText) text = item.bodyText;
  else if (typeof item.body === 'string') text = item.body;
  else if (item.body && item.body.length) text = item.body.join('\n\n');
  if (item.title && text.indexOf(item.title) !== 0) {
    text = item.title + (text ? '\n\n' + text : '');
  }
  return text;
}

function oppStoryAuthor(item) {
  var a = item.author ? author(item.author) : currentPosterId() ? author(currentPosterId()) : null;
  var kind = oppAuthorKind(a);
  return {
    id: item.id,
    authorId: item.author || currentPosterId() || '',
    author: {
      name: a ? a.name : youName(),
      initials: oppInitials(a || { name: youName(), init: 'YO' }),
      kind: kind,
      verified: !!(a && a.verified),
      role: kind === 'collaborator' ? 'Collaborator' : 'Mentor',
      pos: (a && a.pos) || ''
    },
    createdAt: item.at || item.createdAt || '',
    editedAt: item.editedAt || '',
    topic: item.topic || (item.cat ? hashTagLabel(item.cat) : ''),
    poster: item.poster || null,
    link: item.link || null,
    replies: item.replies || [],
    inspiredCount: item.insp || item.inspiredCount || 0
  };
}

function storyPhotos(item) {
  if (item.photos && item.photos.length) return item.photos;
  if (item.poster && item.poster.url) return [item.poster];
  if (item.images && item.images.length) {
    return item.images.map(function (im) {
      if (typeof im === 'string') return { url: im, alt: '', width: 0, height: 0 };
      return {
        url: im.src || im.url,
        alt: im.alt || '',
        width: im.width || 0,
        height: im.height || 0
      };
    });
  }
  return [];
}

function storyOwns(item) {
  if (!item) return false;
  if (item.author && item.author === currentPosterId()) return true;
  return !!(item.mine && currentPosterId());
}

function storyFollowHtml(item, preview) {
  var on;
  if (preview || storyOwns(item) || !item.author) return '';
  on = isFollowing(item.author);
  return (
    '<button type="button" class="story-follow" data-story-follow="' +
    esc(item.author) +
    '" aria-pressed="' +
    (on ? 'true' : 'false') +
    '">' +
    (on ? 'Following' : '+ Follow') +
    '</button>'
  );
}

function storyAuthorRow(item, opts) {
  var s = oppStoryAuthor(item);
  var when = qaTimeAgo(s.createdAt);
  var ident;
  opts = opts || {};
  ident =
    authorHitBtn(oppAvHtml(s, 48), opts.preview ? '' : item.author || s.authorId, 'av-hit') +
    '<div class="ident-name">' +
    authorHitBtn(
      '<div class="opp-name"><span class="ident-text">' +
        esc(s.author.name) +
        '</span>' +
        (s.author.verified ? qaTickSvg() + '<span class="sr">Verified</span>' : '') +
        '</div><p class="opp-role">' +
        esc(s.author.role + (s.author.pos ? ' · ' + s.author.pos : '')) +
        '</p>',
      opts.preview ? '' : item.author || s.authorId,
      'name-hit'
    ) +
    '<p class="opp-meta">' +
    kindOpenBtn('story', 'Story') +
    (when ? ' · ' + esc(when) : '') +
    (item.edited || item.editedAt ? ' · edited' : '') +
    '</p></div>';
  return (
    '<div class="story-author">' +
    authorLinkWrap(ident) +
    '<div class="story-tools">' +
    storyFollowHtml(item, !!opts.preview) +
    (opts.preview ? '' : oppStoryMenu(item)) +
    '</div></div>'
  );
}

function storyMosaicHtml(photos, where, id) {
  var n;
  var show;
  var extra;
  var html;
  var i;
  var ph;
  var cls;
  var wh;
  if (!photos || !photos.length) return '';
  n = photos.length;
  show = n > 4 ? 4 : n;
  extra = n > 4 ? n - 4 : 0;
  cls = 'story-mosaic n' + (n >= 5 ? '5' : String(show));
  html = '<div class="' + cls + '">';
  for (i = 0; i < show; i++) {
    ph = photos[i];
    wh = '';
    if (ph.width && ph.height) {
      wh = ' width="' + ph.width + '" height="' + ph.height + '"';
    }
    html +=
      '<button type="button" data-story-photo="' +
      i +
      '" data-story-id="' +
      esc(id || '') +
      '" aria-label="Open photo ' +
      (i + 1) +
      ' of ' +
      n +
      '">';
    html +=
      '<img src="' +
      esc(ph.url) +
      '" alt="' +
      esc(ph.alt || '') +
      '" loading="lazy" decoding="async"' +
      wh +
      '/>';
    if (extra && i === show - 1) {
      html += '<span class="story-more" aria-hidden="true">+' + extra + '</span>';
    }
    html += '</button>';
  }
  html += '</div>';
  return html;
}

function storyMentions(item) {
  var out = [];
  var s;
  var o;
  if (item.mentions && item.mentions.length) return item.mentions;
  if (item.sess) {
    s = sessionById(item.sess);
    if (s) {
      out.push({
        kind: 'Session',
        refId: s.id,
        day: s.date,
        weekday: s.day,
        title: s.title,
        sub: s.dateText || s.when || ''
      });
    }
  }
  if (item.opp && OPPS[item.opp]) {
    o = OPPS[item.opp];
    out.push({
      kind: 'Opportunity',
      refId: o.id,
      title: o.name,
      sub: o.one || ''
    });
  }
  return out;
}

function storyMentionsHtml(item) {
  var list = storyMentions(item);
  var html = '';
  var i;
  var m;
  if (!list.length) return '';
  html = '<h3 class="story-mention-h">Also mentioned</h3>';
  for (i = 0; i < list.length; i++) {
    m = list[i];
    if (m.kind === 'Session') {
      html +=
        '<button type="button" class="story-mention" data-open="session" data-id="' +
        esc(m.refId) +
        '"><span class="story-date" aria-hidden="true"><b>' +
        esc(m.day || '') +
        '</b><small>' +
        esc(m.weekday || '') +
        '</small></span><div><strong>' +
        esc(m.title) +
        '</strong><span>' +
        esc(m.sub) +
        '</span></div><span class="story-chev" aria-hidden="true">›</span></button>';
    } else {
      html +=
        '<button type="button" class="story-mention" data-open="opp" data-id="' +
        esc(m.refId) +
        '"><span class="story-case" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></span><div><div class="story-kind">Opportunity</div><strong>' +
        esc(m.title) +
        '</strong><span>' +
        esc(m.sub) +
        '</span></div><span class="story-chev" aria-hidden="true">›</span></button>';
    }
  }
  return html;
}

function oppStoryMenu(item) {
  var key = hideKey('story', item.id);
  var open = S.menu === key;
  var own = storyOwns(item);
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
      html += qaMenuItem('data-opp-story-edit="' + esc(item.id) + '"', 'Edit this story', false);
      html += '<hr/>';
      html += qaMenuItem('data-opp-story-del="' + esc(item.id) + '"', 'Delete story', true);
    } else {
      html += qaMenuItem('data-opp-hide="' + esc(key) + '"', 'Not interested', false);
      html += '<hr/>';
      html += qaMenuItem('data-opp-story-report="' + esc(item.id) + '"', 'Report this story', true);
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function oppStoryEngage(item, inSheet) {
  var n = item.replies ? item.replies.length : 0;
  var inspired = isInspired(item.id);
  var saved = isSaved(item.id);
  var inspN = item.insp || item.inspiredCount || 0;
  var replyLabel = n === 0 ? 'Reply' : n === 1 ? '1 reply' : n + ' replies';
  var html = '<div class="qa-actions opp-actions">';
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
  if (!inSheet) {
    html +=
      '<button type="button" class="qa-act" data-open="story" data-id="' +
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
  if (!inSheet) {
    html +=
      '<button type="button" class="opp-primary" data-open="story" data-id="' +
      esc(item.id) +
      '">View more</button>';
  }
  html += '</div>';
  return html;
}

function oppRenderStoryCard(item, opts) {
  var s = oppStoryAuthor(item);
  var body = oppStoryBody(item);
  var photos = storyPhotos(item);
  var html;
  opts = opts || {};
  html =
    '<article class="card feed-card kind-story opp-story' +
    (opts.preview ? ' opp-preview' : ' clickable') +
    '" ' +
    (opts.preview ? '' : cardClickAttrs('story', item.id)) +
    '><div class="opp-pad">';
  html += storyAuthorRow(item, opts);
  html +=
    '<p class="story-body' +
    (opts.preview ? '' : ' qa-clamp') +
    '"' +
    (opts.preview ? '' : ' data-qa-clamp="st-' + esc(item.id) + '"') +
    '>' +
    esc(body) +
    '</p>';
  html += oppTopicHtml(s.topic);
  if (photos.length) html += storyMosaicHtml(photos, 'feed', item.id);
  else html += oppLinkHtml(s.link);
  html += '</div>';
  html += oppStoryEngage(item, false);
  html += '</article>';
  return html;
}

function oppFactsHtml(o) {
  var html = '<div class="opp-facts"><h3>The details</h3><dl>';
  html +=
    '<div class="row"><dt>Closes</dt><dd>' +
    esc(o.rolling || !o.closesAt ? 'Runs all year' : oppDateLabel(o.closesAt)) +
    '</dd></div>';
  html += '<div class="row"><dt>Runs</dt><dd>' + esc(o.when) + '</dd></div>';
  html += '<div class="row"><dt>Who</dt><dd>' + esc(o.who) + '</dd></div>';
  html += '<div class="row"><dt>Where</dt><dd>' + esc(o.where) + '</dd></div>';
  html += '</dl>';
  if (o.closesAt && !o.rolling) {
    html +=
      '<a class="opp-cal" download="' +
      esc(oppSlug(o.title)) +
      '.ics" href="' +
      oppIcsHref(o) +
      '">Add the closing date to my calendar</a>';
  }
  html += '</div>';
  return html;
}

function oppRemindOn(id) {
  return S.oppRemind && S.oppRemind.indexOf(id) !== -1;
}

function oppRemindHtml(o) {
  var on;
  if (!qaIsStudent() || !o.closesAt || o.rolling || oppClosed(o)) return '';
  on = oppRemindOn(o.id);
  return (
    '<button type="button" class="opp-remind' +
    (on ? ' on' : '') +
    '" data-opp-remind="' +
    esc(o.id) +
    '" aria-pressed="' +
    (on ? 'true' : 'false') +
    '"><strong>' +
    (on ? 'Reminder set' : 'Remind me before it closes') +
    '</strong><span>A week before, and again the day before.</span></button>'
  );
}

function oppReplyHostId(kind, id) {
  var item;
  if (kind === 'story') return id;
  item = oppFeedFor(id);
  return item ? item.id : id;
}

function oppRepliesHtml(list, kind, id) {
  var html = '';
  var i;
  var host = oppReplyHostId(kind, id);
  var fake = { id: host, replies: list };
  var n;
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
    '<div class="qa-compose"><p class="qa-compose-label">Reply to this ' +
    (kind === 'story' ? 'story' : 'opening') +
    '</p><div class="qa-compose-grid">' +
    qaYouAv() +
    '<div class="qa-compose-field"><textarea id="opp-reply" rows="1" placeholder="Add a question or something you know…"></textarea>' +
    '<div class="qa-compose-foot"><p class="qa-note">' +
    (qaIsStudent() || oppIsParent() ? 'Please be respectful.' : '') +
    '</p><button type="button" class="qa-post" id="opp-post" data-opp-reply="' +
    esc(host) +
    '" data-kind="' +
    esc(kind) +
    '" disabled>Reply</button></div></div></div></div>';
  return html;
}

function oppSheetHtml(o) {
  var html = '<div class="opp-sheet" tabindex="-1">';
  html += oppAuthorHtml(o, true, false);
  html += '<h3 class="opp-title">' + esc(o.title) + '</h3>';
  html += oppTopicHtml(o.topic);
  html += oppDeadlineHtml(o);
  html += '<p class="opp-desc" style="white-space:pre-wrap">' + esc(o.description) + '</p>';
  html += oppPosterHtml(o.poster, 'sheet');
  html += oppLinkHtml(o.link);
  html += oppFactsHtml(o);
  html += oppEngageHtml(o, { inSheet: true });
  html += oppRemindHtml(o);
  html += oppRepliesHtml(o.replies || [], 'opp', o.id);
  html += '</div>';
  return html;
}

function oppStorySheetHtml(item) {
  var s = oppStoryAuthor(item);
  var photos = storyPhotos(item);
  var html = '<div class="opp-sheet story-sheet" tabindex="-1">';
  html += storyAuthorRow(item, {});
  html += '<p class="story-body">' + esc(oppStoryBody(item)) + '</p>';
  html += oppTopicHtml(s.topic);
  if (photos.length) html += storyMosaicHtml(photos, 'sheet', item.id);
  else html += oppLinkHtml(s.link);
  html += oppStoryEngage(item, true);
  html += storyMentionsHtml(item);
  html += oppRepliesHtml(item.replies || [], 'story', item.id);
  html += '</div>';
  return html;
}

function oppOwnClosingWarn() {
  var viewer = currentPosterId();
  var k;
  var o;
  var n;
  var ms;
  var best = null;
  var bestMs = Infinity;
  if (!viewer) return '';
  for (k in OPPS) {
    if (!OPPS.hasOwnProperty(k)) continue;
    o = oppOpening(OPPS[k]);
    if (!o || o.authorId !== viewer) continue;
    if (o.status !== 'published' && o.status !== 'live') continue;
    if (!o.closesAt || o.rolling || oppClosed(o)) continue;
    ms = oppMsLeft(o);
    if (ms == null || ms > 14 * 86400000) continue;
    if (ms < bestMs) {
      bestMs = ms;
      best = o;
    }
  }
  if (!best) return '';
  n = oppWarnPhrase(best);
  if (!n) return '';
  return '<p class="opp-warn">Your "' + esc(best.title) + '" ' + esc(n) + '</p>';
}

function oppDraftCount() {
  var viewer = currentPosterId();
  var n = 0;
  var i;
  if (!viewer || !S.oppDrafts) return 0;
  for (i = 0; i < S.oppDrafts.length; i++) {
    if (S.oppDrafts[i].authorId === viewer) n += 1;
  }
  return n;
}

function oppLeadHtml() {
  var drafts;
  var a;
  var kind;
  var av;
  if (oppIsAskOnly()) {
    return (
      '<div class="qa-ask-block">' +
      '<div class="qa-ask-row">' +
      qaYouAv() +
      '<button type="button" class="qa-ask-open" data-qa-ask="1">What do you want to ask?</button></div>' +
      (typeof sessStudentLineHtml === 'function' ? sessStudentLineHtml() : '') +
      '</div>'
    );
  }
  if (!oppCanAuthor()) return '';
  drafts = oppDraftCount();
  a = currentPosterId() ? author(currentPosterId()) : null;
  kind = oppAuthorKind(a);
  av =
    '<span class="opp-av ' +
    (kind === 'collaborator' ? 'is-org' : 'is-person') +
    '" aria-hidden="true">' +
    esc(oppInitials(a || { init: 'ME' })) +
    '</span>';
  return (
    '<div class="opp-lead">' +
    av +
    '<button type="button" class="opp-post-btn" data-opp-post="1">Post</button>' +
    (drafts
      ? '<button type="button" class="opp-drafts-btn" data-opp-drafts="1">Drafts ' + drafts + '</button>'
      : '') +
    oppOwnClosingWarn() +
    (typeof sessHostWarnHtml === 'function' ? sessHostWarnHtml() : '') +
    '</div>'
  );
}

function oppResetCompose(keepMode) {
  var o = ensureOpp();
  var mode = keepMode ? o.mode : '';
  o.step = 1;
  o.title = '';
  o.description = '';
  o.topic = '';
  o.tagQ = '';
  o.tagIx = -1;
  o.poster = null;
  o.posterAlt = '';
  o.linkUrl = '';
  o.who = '';
  o.where = '';
  o.when = '';
  o.closesAt = '';
  o.rolling = false;
  o.apply = '';
  o.storyBody = '';
  o.photos = [];
  o.draftId = '';
  o.editId = '';
  o.mode = mode;
}

function oppWhoHtml() {
  return (
    '<div class="opp-pick">' +
    '<button type="button" data-opp-who="student"><i aria-hidden="true">S</i><div><strong>Student or parent</strong><span>What do you want to ask? One tap into a question.</span></div></button>' +
    '<button type="button" data-opp-who="mentor"><i aria-hidden="true">M</i><div><strong>Mentor or collaborator</strong><span>Post a question, a story, an opening, or a session.</span></div></button>' +
    '</div>'
  );
}

function oppOpenPost(seed, cat) {
  if (isVisitor() && !seed) {
    ensureOpp();
    S.opp.dialog = 'who';
    S.opp.mode = '';
    S.opp.fromWho = true;
    oppPaintLayer();
    return;
  }
  if (oppIsAskOnly() || seed) {
    qaOpenDialog('ask', { text: seed || '' });
    return;
  }
  if (!oppCanAuthor()) {
    go({ t: 'postgate', id: '0' });
    return;
  }
  ensureOpp();
  S.opp.dialog = 'picker';
  S.opp.mode = '';
  if (cat) S.opp.topic = hashTagLabel(cat);
  oppPaintLayer();
}

function oppStep1Ok(c) {
  var title = (c.title || '').trim();
  var desc = (c.description || '').trim();
  if (title.length < 6 || title.length > 80) return false;
  if (desc.length < 20) return false;
  if (!c.topic) return false;
  if (c.poster && (c.posterAlt || '').trim().length < 10) return false;
  return true;
}

function oppStep2Ok(c) {
  if ((c.who || '').trim().length < 3 || (c.who || '').trim().length > 90) return false;
  if ((c.where || '').trim().length < 3 || (c.where || '').trim().length > 90) return false;
  if ((c.when || '').trim().length < 3 || (c.when || '').trim().length > 90) return false;
  if (c.rolling) return true;
  return !!(c.closesAt || '').trim();
}

function oppStep3Ok(c) {
  return (c.apply || '').trim().length >= 5;
}

function oppStepOk(step) {
  var c = ensureOpp();
  if (step === 1) return oppStep1Ok(c);
  if (step === 2) return oppStep2Ok(c);
  if (step === 3) return oppStep3Ok(c);
  return true;
}

function oppStoryOk() {
  var c = ensureOpp();
  var i;
  if ((c.storyBody || '').trim().length < 40) return false;
  if (!c.topic) return false;
  if (c.photos && c.photos.length) {
    for (i = 0; i < c.photos.length; i++) {
      if (!c.photos[i].alt || String(c.photos[i].alt).trim().length < 10) return false;
    }
  }
  return true;
}

function oppMatchTopics(term) {
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
    if (ensureOpp().topic === all[i].tag) continue;
    if (key.indexOf(q) === 0) prefix.push(all[i]);
    else if (key.indexOf(q) !== -1) sub.push(all[i]);
  }
  hit = prefix.concat(sub);
  var cap = ensureOpp().mode === 'story' || ensureOpp().dialog === 'story' ? 5 : 6;
  if (hit.length > cap) hit.length = cap;
  return hit;
}

function oppTopicFieldHtml() {
  var c = ensureOpp();
  var html = '<div class="qa-tags" id="opp-tag-wrap"><label class="qa-tags-label" for="opp-tag-q">Topic</label>';
  if (c.topic) {
    html +=
      '<div class="qa-chosen"><span class="opp-chip">' +
      esc(c.topic) +
      '<span class="qa-chip-x" role="button" tabindex="0" data-opp-untag="1" aria-label="Remove ' +
      esc(c.topic) +
      '">×</span></span></div>';
    html += '<p class="opp-hint">Remove it to choose a different one.</p>';
  } else {
    html +=
      '<input id="opp-tag-q" class="qa-tag-input" role="combobox" aria-expanded="false" aria-controls="opp-sug" aria-autocomplete="list" placeholder="Start typing a topic" value="' +
      esc(c.tagQ || '') +
      '"/>';
    html += '<div class="qa-sug" id="opp-sug" role="listbox" hidden></div>';
  }
  html += '</div>';
  return html;
}

function oppAttachFieldsHtml() {
  var c = ensureOpp();
  var link = oppParseLink(c.linkUrl);
  var html = '<label>Poster</label><div class="opp-file"><input id="opp-poster" type="file" accept="image/*"/></div>';
  if (c.poster) {
    html += oppPosterHtml(
      { url: c.poster.url, alt: c.posterAlt || c.poster.alt || '', width: c.poster.width, height: c.poster.height },
      'feed'
    );
    html +=
      '<label for="opp-alt">Alt text</label><textarea id="opp-alt" minlength="10">' +
      esc(c.posterAlt || '') +
      '</textarea>';
    html +=
      '<p class="opp-hint' +
      ((c.posterAlt || '').trim().length < 10 ? ' is-bad' : '') +
      '">Required. This is all a screen reader gets, and all anyone sees if images do not load.</p>';
  }
  html +=
    '<label for="opp-link">Link</label><input id="opp-link" type="url" placeholder="https://" value="' +
    esc(c.linkUrl || '') +
    '"/>';
  html += '<div id="opp-link-prev">' + (link ? oppLinkHtml(link) : '') + '</div>';
  return html;
}

function oppComposePreviewOpening() {
  var c = ensureOpp();
  var a = currentPosterId() ? author(currentPosterId()) : { name: 'You', init: 'YO', role: 'mentor', pos: '' };
  var kind = oppAuthorKind(a);
  return {
    _card: true,
    id: c.editId || c.draftId || 'preview',
    status: 'published',
    authorId: currentPosterId() || '',
    author: {
      name: a.name,
      initials: oppInitials(a),
      kind: kind,
      verified: !!(a && a.verified),
      role: kind === 'collaborator' ? 'Collaborator' : 'Mentor',
      pos: a.pos || ''
    },
    createdAt: nowIso(),
    editedAt: '',
    title: c.title,
    description: c.description,
    topic: c.topic,
    who: c.who,
    where: c.where,
    when: c.when,
    closesAt: c.rolling ? null : c.closesAt,
    rolling: !!c.rolling,
    apply: c.apply,
    poster: c.poster
      ? {
          url: c.poster.url,
          alt: c.posterAlt || c.poster.alt || '',
          width: c.poster.width,
          height: c.poster.height
        }
      : null,
    link: oppParseLink(c.linkUrl),
    replies: [],
    inspiredCount: 0,
    src: { state: 'live' },
    item: null
  };
}

function oppDraftFromState() {
  var c = ensureOpp();
  return {
    id: c.draftId || 'd-' + Date.now(),
    kind: c.mode,
    authorId: currentPosterId(),
    savedAt: nowIso(),
    title: c.title,
    description: c.description,
    topic: c.topic,
    poster: c.poster,
    posterAlt: c.posterAlt,
    linkUrl: c.linkUrl,
    who: c.who,
    where: c.where,
    when: c.when,
    closesAt: c.closesAt,
    rolling: c.rolling,
    apply: c.apply,
    storyBody: c.storyBody,
    photos: c.photos ? c.photos.slice() : [],
    step: c.step
  };
}

function oppLoadDraft(d) {
  var c = ensureOpp();
  var k;
  for (k in d) {
    if (d.hasOwnProperty(k) && k !== 'id' && k !== 'kind' && k !== 'authorId' && k !== 'savedAt') {
      c[k] = d[k];
    }
  }
  c.draftId = d.id;
  c.mode = d.kind;
  c.dialog = d.kind === 'story' ? 'story' : d.step === 'preview' ? 'preview' : 'opportunity';
  if (d.kind !== 'story') c.step = d.step || 1;
}

function oppSaveDraft() {
  var d = oppDraftFromState();
  var i;
  for (i = 0; i < S.oppDrafts.length; i++) {
    if (S.oppDrafts[i].id === d.id) {
      S.oppDrafts[i] = d;
      toast('Draft saved.');
      return d;
    }
  }
  S.oppDrafts.push(d);
  ensureOpp().draftId = d.id;
  toast('Draft saved.');
  if (typeof refreshUi === 'function' && !NAV.length) render();
  return d;
}

function oppPublishOpening() {
  var c = ensureOpp();
  var id = c.editId || 'opp-' + Date.now();
  var poster = currentPosterId();
  var link = oppParseLink(c.linkUrl);
  var o;
  if (!oppStep1Ok(c) || !oppStep2Ok(c) || !oppStep3Ok(c)) return;
  o = OPPS[id] || { id: id, entry: [], tips: [], truth: { b: '', p: '' }, proof: { b: '', p: '' }, leads: '', mentors: [], rel: [], sess: [], images: [] };
  o.id = id;
  o.name = c.title.trim();
  o.title = c.title.trim();
  o.one = c.description.trim();
  o.description = c.description.trim();
  o.what = [c.description.trim()];
  o.topic = c.topic;
  o.cat = qaTopicRaw(c.topic);
  o.who = c.who.trim();
  o.where = c.where.trim();
  o.regions = c.where.trim();
  o.when = c.when.trim();
  o.season = c.when.trim();
  o.closesAt = c.rolling ? null : c.closesAt;
  o.rolling = !!c.rolling;
  o.apply = c.apply.trim();
  o.poster = c.poster
    ? {
        url: c.poster.url,
        alt: c.posterAlt.trim(),
        width: c.poster.width,
        height: c.poster.height
      }
    : null;
  o.link = link;
  o.author = poster || '';
  o.state = 'live';
  o.status = 'published';
  o.inspiredCount = o.inspiredCount || 0;
  if (c.editId) o.editedAt = nowIso();
  else o.createdAt = nowIso();
  OPPS[id] = o;
  if (!c.editId) {
    FEED.unshift({
      id: 'f-' + id,
      kind: 'opportunity',
      at: nowIso(),
      cat: o.cat,
      author: poster || '',
      opp: id,
      stage: o.stage || '',
      replies: [],
      insp: 0,
      text: o.one
    });
  } else if (oppFeedFor(id)) {
    oppFeedFor(id).edited = true;
    oppFeedFor(id).editedAt = nowIso();
  }
  if (c.draftId) {
    S.oppDrafts = S.oppDrafts.filter(function (x) {
      return x.id !== c.draftId;
    });
  }
  oppCloseDialog();
  toast(c.editId ? 'Opening updated.' : 'Opening posted.');
  render();
}

function oppPublishStory() {
  var c = ensureOpp();
  var id = c.editId || 'st-' + Date.now();
  var poster = currentPosterId();
  var item;
  var link;
  if (!oppStoryOk()) return;
  link = c.photos && c.photos.length ? null : oppParseLink(c.linkUrl);
  if (c.editId) {
    item = feedById(c.editId);
    if (!item) return;
    item.body = c.storyBody.trim();
    item.bodyText = c.storyBody.trim();
    item.title = '';
    item.topic = c.topic;
    item.cat = qaTopicRaw(c.topic);
    item.photos = c.photos && c.photos.length ? c.photos.slice() : [];
    item.poster = null;
    item.link = link;
    item.edited = true;
    item.editedAt = nowIso();
  } else {
    FEED.unshift({
      id: id,
      kind: 'story',
      at: nowIso(),
      cat: qaTopicRaw(c.topic),
      topic: c.topic,
      author: poster || '',
      title: '',
      body: c.storyBody.trim(),
      bodyText: c.storyBody.trim(),
      photos: c.photos && c.photos.length ? c.photos.slice() : [],
      poster: null,
      link: link,
      replies: [],
      insp: 0,
      mine: true
    });
  }
  if (c.draftId) {
    S.oppDrafts = S.oppDrafts.filter(function (x) {
      return x.id !== c.draftId;
    });
  }
  oppCloseDialog();
  toast(c.editId ? 'Story updated.' : 'Story posted.');
  render();
}

function oppTomorrow() {
  var d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function oppPickerHtml() {
  return (
    '<div class="opp-pick">' +
    '<button type="button" data-opp-type="question"><i aria-hidden="true">?</i><div><strong>Question</strong><span>Ask the community something.</span></div></button>' +
    '<button type="button" data-opp-type="story"><i aria-hidden="true">S</i><div><strong>Story</strong><span>Share an update, or something you learned.</span></div></button>' +
    '<button type="button" data-opp-type="opportunity"><i aria-hidden="true">O</i><div><strong>Opportunity</strong><span>Something students can apply to.</span></div></button>' +
    '<button type="button" data-opp-type="session"><i aria-hidden="true">T</i><div><strong>Session</strong><span>Something you are hosting at a time.</span></div></button>' +
    '</div>'
  );
}

function oppComposeStepHtml() {
  var c = ensureOpp();
  var html = '';
  html += '<p class="opp-step">Step ' + c.step + ' of 3</p>';
  html +=
    '<div class="opp-progress" aria-hidden="true"><span' +
    (c.step >= 1 ? ' class="on"' : '') +
    '></span><span' +
    (c.step >= 2 ? ' class="on"' : '') +
    '></span><span' +
    (c.step >= 3 ? ' class="on"' : '') +
    '></span></div>';
  if (c.step === 1) {
    html +=
      '<label for="opp-title">Title</label><input id="opp-title" maxlength="80" value="' +
      esc(c.title) +
      '"/>';
    html +=
      '<label for="opp-desc">Description</label><textarea id="opp-desc">' +
      esc(c.description) +
      '</textarea>';
    html += oppTopicFieldHtml();
    html += oppAttachFieldsHtml();
  } else if (c.step === 2) {
    html +=
      '<label for="opp-who">Who it is for</label><input id="opp-who" maxlength="90" value="' +
      esc(c.who) +
      '" placeholder="ages 14 to 25, any school or none"/>';
    html +=
      '<label for="opp-where">Where</label><input id="opp-where" maxlength="90" value="' +
      esc(c.where) +
      '" placeholder="clubhouse in Georgetown, or online"/>';
    html +=
      '<label for="opp-when">When it runs</label><input id="opp-when" maxlength="90" value="' +
      esc(c.when) +
      '" placeholder="two weeks in the August holidays"/>';
    html +=
      '<label for="opp-closes">Closing date</label><input id="opp-closes" type="date" min="' +
      oppTomorrow() +
      '" value="' +
      esc(c.closesAt ? String(c.closesAt).slice(0, 10) : '') +
      '"' +
      (c.rolling ? ' disabled' : '') +
      '/>';
    html +=
      '<p class="opp-hint">The countdown, reminders, and calendar file need a real date. When it runs is the human description.</p>';
    html +=
      '<label class="opp-check"><input id="opp-rolling" type="checkbox"' +
      (c.rolling ? ' checked' : '') +
      '/> <span>No closing date, it runs all year</span></label>';
  } else {
    html +=
      '<label for="opp-apply">How to apply</label><textarea id="opp-apply" placeholder="A link, an email, a number, or where to turn up">' +
      esc(c.apply) +
      '</textarea>';
    html +=
      '<p class="opp-hint">Whatever you put here is what the student sees. Applying happens with you, not on Next Step.</p>';
    html += oppApplyPreviewHtml(c.apply);
  }
  html += '<div class="opp-foot">';
  html += '<button type="button" class="qa-keep is-left" data-opp-save-draft="1">Save as draft</button>';
  html +=
    '<button type="button" class="qa-keep" data-opp-back="1">' +
    (c.step === 1 ? 'Cancel' : 'Back') +
    '</button>';
  html +=
    '<button type="button" class="qa-go" id="opp-continue" data-opp-next="1"' +
    (oppStepOk(c.step) ? '' : ' disabled') +
    '>' +
    (c.step === 3 ? 'Preview' : 'Continue') +
    '</button>';
  html += '</div>';
  return html;
}

function oppApplyPreviewHtml(val) {
  var d = oppDetectApply(val);
  var html = '<div class="opp-apply-prev" id="opp-apply-prev">';
  if (!val || !String(val).trim()) {
    html += '<p class="opp-hint">Students will see this as you type.</p>';
  } else if (d.label) {
    html += '<p class="opp-hint">Students will get a button.</p><button type="button" class="opp-primary" disabled>' + esc(d.label) + '</button>';
  } else {
    html += '<p class="opp-apply-val">' + esc(val) + '</p>';
  }
  html += '</div>';
  return html;
}

function storyNeedChars() {
  return Math.max(0, 40 - (ensureOpp().storyBody || '').trim().length);
}

function storyAttachHtml() {
  var c = ensureOpp();
  var hasPhotos = !!(c.photos && c.photos.length);
  var link = !hasPhotos ? oppParseLink(c.linkUrl) : null;
  var html = '';
  var i;
  var ph;
  html +=
    '<p class="opp-hint">Photos or a link, not both. The same as LinkedIn. Whichever you add, the other is put away.</p>';
  html += '<label>Photos</label><div class="opp-file">';
  html +=
    '<input id="opp-photos" type="file" accept="image/*" multiple' +
    (c.linkUrl && oppParseLink(c.linkUrl) ? ' disabled' : '') +
    '/>';
  html += '</div>';
  if (hasPhotos && c.photos.length >= 4) {
    html += '<p class="opp-hint">Four photos lay out cleanly. Any more show behind a count.</p>';
  }
  for (i = 0; i < (c.photos || []).length; i++) {
    ph = c.photos[i];
    html +=
      '<div class="story-alt-row"><img src="' +
      esc(ph.url) +
      '" alt=""/><div><input data-story-alt="' +
      i +
      '" maxlength="180" placeholder="Describe this photo" value="' +
      esc(ph.alt || '') +
      '"/><p class="opp-hint' +
      ((ph.alt || '').trim().length < 10 ? ' is-bad' : '') +
      '">Required. This is all a screen reader gets.</p></div><button type="button" class="qa-keep" data-story-rm-photo="' +
      i +
      '">Remove</button></div>';
  }
  html +=
    '<label for="opp-link">Link</label><input id="opp-link" type="url" placeholder="https://" value="' +
    esc(hasPhotos ? '' : c.linkUrl || '') +
    '"' +
    (hasPhotos ? ' disabled' : '') +
    '/>';
  html += '<div id="opp-link-prev">' + (link ? oppLinkHtml(link) : '') + '</div>';
  return html;
}

function oppStoryFormHtml() {
  var c = ensureOpp();
  var a = currentPosterId() ? author(currentPosterId()) : null;
  var need = storyNeedChars();
  var html =
    '<div class="story-comp-h"><h2 id="qa-dlg-title">Write a story</h2><span>' +
    esc((a && a.name) || 'You') +
    '</span></div>';
  html +=
    '<label for="opp-story">Your story</label><textarea id="opp-story" minlength="40" placeholder="What do you want to share? Start with the line that would make a student stop scrolling.">' +
    esc(c.storyBody) +
    '</textarea>';
  if (need) html += '<p class="opp-hint" id="story-need">' + need + ' more characters needed</p>';
  else html += '<p class="opp-hint" id="story-need" hidden></p>';
  html += oppTopicFieldHtml();
  html += storyAttachHtml();
  html += '<div class="opp-foot">';
  html += '<button type="button" class="qa-keep is-left" data-opp-save-draft="1">Save as draft</button>';
  html += '<button type="button" class="qa-keep" data-opp-back="1">Cancel</button>';
  html +=
    '<button type="button" class="qa-go" id="opp-continue" data-opp-story-preview="1"' +
    (oppStoryOk() ? '' : ' disabled') +
    '>Preview</button>';
  html += '</div>';
  return html;
}

function oppPreviewHtml() {
  var c = ensureOpp();
  var html = '<p class="qa-sub">This is exactly how it will look</p>';
  if (c.mode === 'story') {
    html += oppRenderStoryCard(
      {
        id: 'preview',
        kind: 'story',
        at: nowIso(),
        author: currentPosterId(),
        topic: c.topic,
        cat: qaTopicRaw(c.topic),
        bodyText: c.storyBody,
        photos: c.photos && c.photos.length ? c.photos.slice() : [],
        poster: null,
        link: c.photos && c.photos.length ? null : oppParseLink(c.linkUrl),
        replies: [],
        insp: 0
      },
      { preview: true }
    );
  } else {
    html += oppRenderCard(oppComposePreviewOpening(), { preview: true });
  }
  html += '<div class="opp-foot">';
  html += '<button type="button" class="qa-keep is-left" data-opp-save-draft="1">Save as draft</button>';
  html += '<button type="button" class="qa-keep" data-opp-edit-back="1">Back to edit</button>';
  html +=
    '<button type="button" class="qa-go" data-opp-publish="1">' +
    (c.mode === 'story' ? 'Post story' : 'Post opening') +
    '</button>';
  html += '</div>';
  return html;
}

function oppDraftsHtml() {
  var viewer = currentPosterId();
  var rows = (S.oppDrafts || []).filter(function (d) {
    return d.authorId === viewer;
  });
  var html = '';
  var i;
  var d;
  if (!rows.length) return '<p class="qa-sub">No drafts.</p>';
  for (i = 0; i < rows.length; i++) {
    d = rows[i];
    html +=
      '<div class="qa-draft-row"><div><strong>' +
      esc(
        d.kind === 'story'
          ? ((d.storyBody || '').split('\n')[0].trim() || 'Untitled story')
          : d.title || 'Untitled opening'
      ) +
      '</strong><p class="opp-hint">Saved ' +
      esc(qaTimeAgo(d.savedAt)) +
      (d.topic ? ' · ' + esc(d.topic) : '') +
      '</p></div><div><button type="button" class="qa-go" data-opp-resume="' +
      esc(d.id) +
      '">Continue</button> <button type="button" class="qa-kill" data-opp-del-draft="' +
      esc(d.id) +
      '">Delete</button></div></div>';
  }
  return html;
}

function oppApplyDialogHtml(o) {
  var d = oppDetectApply(o.apply);
  var close = oppCloseCopy(o);
  var html = '<h2 id="qa-dlg-title">How to apply</h2>';
  html +=
    '<p class="qa-sub">' +
    esc(o.title) +
    (close && close.tone === 'soon' ? ' · ' + esc(close.text) : '') +
    '</p>';
  html += '<p class="opp-apply-val">' + esc(o.apply) + '</p>';
  html +=
    '<p class="opp-apply-note">Applying happens with ' +
    esc(o.author.name) +
    ', not on Next Step.</p>';
  html += '<div class="qa-dlg-actions">';
  html += '<button type="button" class="qa-keep" data-opp-cancel="1">Close</button>';
  html +=
    '<button type="button" class="qa-go" data-save="' +
    esc(o.id) +
    '">Save to my pathway</button>';
  if (d.href) {
    html +=
      '<a class="opp-primary" style="display:inline-flex;align-items:center;text-decoration:none" href="' +
      esc(d.href) +
      '" target="_blank" rel="noopener">' +
      esc(d.label) +
      '</a>';
  }
  html += '</div>';
  return html;
}

function oppReportHtml() {
  var c = ensureOpp();
  var reasons =
    c.reportKind === 'story'
      ? [
          ['wrong', 'The information is wrong or misleading'],
          ['unkind', 'Rude or unkind'],
          ['spam', 'Spam, or an advertisement'],
          ['personal', "Shares someone's personal details"],
          ['safety', 'This does not look safe for students']
        ]
      : [
          ['closed', 'This closed, or the date is wrong'],
          ['details', 'The details are wrong or misleading'],
          ['apply', 'The way to apply does not work'],
          ['cost', 'It costs money and does not say so'],
          ['safety', 'This does not look safe for students']
        ];
  var html = '<h2 id="qa-dlg-title">' + (c.reportKind === 'story' ? 'Report this story' : 'Report a problem') + '</h2>';
  html += '<p class="qa-sub">Tell us what is wrong. A person reviews every report.</p><div class="qa-reasons">';
  var i;
  for (i = 0; i < reasons.length; i++) {
    html +=
      '<button type="button" class="qa-reason' +
      (reasons[i][0] === 'safety' ? ' is-safe' : '') +
      '" data-opp-reason="' +
      reasons[i][0] +
      '" aria-pressed="' +
      (c.reportReason === reasons[i][0] ? 'true' : 'false') +
      '">' +
      esc(reasons[i][1]) +
      '</button>';
  }
  html += '</div>';
  if (c.reportReason === 'safety') {
    html +=
      '<p class="qa-safe-note">This goes to the safeguarding team, not the same inbox as a wrong date. If someone is in immediate danger, contact a person who can help right now as well.</p>';
  }
  html +=
    '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-opp-cancel="1">Cancel</button><button type="button" class="qa-go" data-opp-send-report="1"' +
    (c.reportReason ? '' : ' disabled') +
    '>Send</button></div>';
  return html;
}

function oppPaintLayer() {
  var layer = byId('qa-layer');
  var c = ensureOpp();
  var html;
  var o;
  var focus;
  if (!layer) return;
  if (S.qa && S.qa.dialog) return;
  if (S.sess && S.sess.dialog) return;
  if (!c.dialog) {
    if (!layer.hidden && layer.querySelector('.opp-box')) {
      layer.hidden = true;
      layer.innerHTML = '';
    }
    return;
  }
  html = '<div class="qa-dialog opp-box opp-compose" role="dialog" aria-modal="true" aria-labelledby="qa-dlg-title">';
  if (c.dialog === 'who') {
    html += '<h2 id="qa-dlg-title">Post</h2>';
    html +=
      '<p class="qa-sub">Look at posting as a student or parent, or as a mentor or collaborator. You do not need to finish the pathway plan first.</p>';
    html += oppWhoHtml();
    html += '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-opp-cancel="1">Cancel</button></div>';
  } else if (c.dialog === 'picker') {
    html +=
      '<h2 id="qa-dlg-title">What are you posting?</h2><p class="qa-sub">Each one asks for different things, so pick first.</p>' +
      oppPickerHtml();
    html +=
      '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-opp-cancel="1">' +
      (c.fromWho ? 'Back' : 'Cancel') +
      '</button></div>';
  } else if (c.dialog === 'opportunity') {
    html += '<h2 id="qa-dlg-title">Share an opportunity</h2>' + oppComposeStepHtml();
  } else if (c.dialog === 'story') {
    html += oppStoryFormHtml();
  } else if (c.dialog === 'preview') {
    html += '<h2 id="qa-dlg-title">Preview</h2>' + oppPreviewHtml();
  } else if (c.dialog === 'drafts') {
    html += '<h2 id="qa-dlg-title">Drafts</h2>' + oppDraftsHtml();
    html += '<div class="qa-dlg-actions"><button type="button" class="qa-keep" data-opp-cancel="1">Close</button></div>';
  } else if (c.dialog === 'apply') {
    o = oppOpening(c.dialogId);
    html += o ? oppApplyDialogHtml(o) : '<p>Missing.</p>';
  } else if (c.dialog === 'report') {
    html += oppReportHtml();
  } else if (c.dialog === 'del') {
    html +=
      '<h2 id="qa-dlg-title">Delete this opening?</h2><p class="qa-sub">It is removed from the feed. This cannot be undone.</p><div class="qa-dlg-actions"><button type="button" class="qa-keep" data-opp-cancel="1">Keep it</button><button type="button" class="qa-kill" data-opp-confirm-del="1">Delete</button></div>';
  } else if (c.dialog === 'del-story') {
    html +=
      '<h2 id="qa-dlg-title">Delete this story?</h2><p class="qa-sub">It disappears from every feed, including anyone who saved it.</p><div class="qa-dlg-actions"><button type="button" class="qa-keep" data-opp-cancel="1">Keep it</button><button type="button" class="qa-kill" data-opp-confirm-del-story="1">Delete</button></div>';
  } else if (c.dialog === 'date') {
    html +=
      '<h2 id="qa-dlg-title">Set a new closing date</h2><p class="qa-sub">This brings the opening back into the feed.</p><input id="opp-new-date" type="date" min="' +
      oppTomorrow() +
      '" value="' +
      esc(c.dateVal || '') +
      '"/><div class="qa-dlg-actions"><button type="button" class="qa-keep" data-opp-cancel="1">Cancel</button><button type="button" class="qa-go" data-opp-save-date="1"' +
      (c.dateVal ? '' : ' disabled') +
      '>Save date</button></div>';
  }
  html += '</div>';
  layer.innerHTML = html;
  layer.hidden = false;
  focus = byId('opp-title') || byId('opp-story') || byId('opp-tag-q') || byId('opp-new-date') || layer.querySelector('button, input, textarea');
  if (focus && focus.focus) focus.focus();
}

function oppCloseDialog() {
  var c = ensureOpp();
  var layer = byId('qa-layer');
  c.dialog = '';
  c.dialogId = '';
  c.reportReason = '';
  c.fromWho = false;
  if (layer && !(S.qa && S.qa.dialog)) {
    layer.hidden = true;
    layer.innerHTML = '';
  }
  if (typeof refreshUi === 'function') refreshUi();
}

function storyPaintLight() {
  var el = byId('opp-light');
  var c = ensureOpp();
  var photos = c.lightPhotos || [];
  var ix = c.lightIx || 0;
  var ph;
  var html;
  var many;
  if (!el || !photos.length) return;
  if (ix < 0) ix = photos.length - 1;
  if (ix >= photos.length) ix = 0;
  c.lightIx = ix;
  ph = photos[ix];
  c.lightUrl = ph.url;
  c.lightAlt = ph.alt || '';
  many = photos.length > 1;
  html = '<button type="button" class="opp-light-x" data-opp-light-x="1" aria-label="Close">×</button>';
  if (many) {
    html += '<div class="opp-light-bar"><span class="opp-light-n">' + (ix + 1) + ' of ' + photos.length + '</span></div>';
    html +=
      '<button type="button" class="opp-light-nav prev" data-story-light-step="-1" aria-label="Previous photo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>';
    html +=
      '<button type="button" class="opp-light-nav next" data-story-light-step="1" aria-label="Next photo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>';
  }
  html +=
    '<div><img src="' +
    esc(ph.url) +
    '" alt="' +
    esc(ph.alt || '') +
    '"/><p class="opp-light-cap">' +
    esc(ph.alt || '') +
    '</p></div>';
  el.innerHTML = html;
  el.hidden = false;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', ph.alt || 'Photo');
  if (el.querySelector('.opp-light-x')) el.querySelector('.opp-light-x').focus();
}

function oppOpenLightbox(url, alt) {
  var c = ensureOpp();
  c.lightPhotos = [{ url: url, alt: alt || '' }];
  c.lightIx = 0;
  storyPaintLight();
}

function storyOpenLight(photos, ix) {
  var c = ensureOpp();
  c.lastFocus = document.activeElement;
  c.lightPhotos = photos;
  c.lightIx = ix || 0;
  storyPaintLight();
}

function oppCloseLightbox() {
  var el = byId('opp-light');
  var c = ensureOpp();
  var focus = c.lastFocus;
  c.lightUrl = '';
  c.lightAlt = '';
  c.lightPhotos = null;
  c.lightIx = 0;
  c.lastFocus = null;
  if (el) {
    el.hidden = true;
    el.innerHTML = '';
  }
  if (focus && focus.focus) focus.focus();
}

function oppReadFields() {
  var c = ensureOpp();
  var el = byId('opp-title');
  if (el) c.title = el.value;
  el = byId('opp-desc');
  if (el) c.description = el.value;
  el = byId('opp-alt');
  if (el) c.posterAlt = el.value;
  el = byId('opp-link');
  if (el) c.linkUrl = el.value;
  el = byId('opp-who');
  if (el) c.who = el.value;
  el = byId('opp-where');
  if (el) c.where = el.value;
  el = byId('opp-when');
  if (el) c.when = el.value;
  el = byId('opp-closes');
  if (el && !c.rolling) c.closesAt = el.value ? el.value + 'T17:00:00-04:00' : '';
  el = byId('opp-rolling');
  if (el) {
    c.rolling = !!el.checked;
    if (c.rolling) c.closesAt = '';
  }
  el = byId('opp-apply');
  if (el) c.apply = el.value;
  el = byId('opp-story');
  if (el) c.storyBody = el.value;
  el = byId('opp-tag-q');
  if (el) c.tagQ = el.value;
  el = byId('opp-new-date');
  if (el) c.dateVal = el.value;
}

function oppSyncCompose() {
  var btn = byId('opp-continue');
  var c = ensureOpp();
  var box;
  var prev;
  var hint;
  if (btn) {
    if (c.mode === 'story' && c.dialog === 'story') btn.disabled = !oppStoryOk();
    else if (c.dialog === 'opportunity') btn.disabled = !oppStepOk(c.step);
    else if (c.dialog === 'date') btn.disabled = !c.dateVal;
  }
  box = byId('opp-apply');
  prev = byId('opp-apply-prev');
  if (box && prev) {
    prev.outerHTML = oppApplyPreviewHtml(box.value);
  }
  hint = document.querySelector('#opp-alt + .opp-hint, .opp-hint.is-bad, .opp-hint');
  if (byId('opp-alt')) {
    hint = byId('opp-alt').nextElementSibling;
    if (hint && hint.className.indexOf('opp-hint') !== -1) {
      if ((c.posterAlt || '').trim().length < 10) hint.className = 'opp-hint is-bad';
      else hint.className = 'opp-hint';
    }
  }
}

function oppSyncTopicUi() {
  var c = ensureOpp();
  var sug = byId('opp-sug');
  var input = byId('opp-tag-q');
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
  hits = oppMatchTopics(input.value);
  if (!hits.length) {
    html =
      '<p class="qa-sug-empty">No topic matches "' +
      esc(input.value.trim()) +
      '". Topics are set by the Next Step team.</p>';
  } else {
    for (i = 0; i < hits.length; i++) {
      html +=
        '<button type="button" role="option" data-opp-pick="' +
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

function oppToggleRemind(id) {
  var i;
  ensureOpp();
  if (
    requirePathway({
      type: 'remind',
      id: id,
      reason: 'Start your pathway first.'
    })
  ) {
    return;
  }
  i = S.oppRemind.indexOf(id);
  if (i === -1) {
    S.oppRemind.push(id);
    toast('Reminder set.');
  } else {
    S.oppRemind.splice(i, 1);
    toast('Reminder removed.');
  }
  S.menu = '';
  refreshUi();
  if (ensureOpp().dialog === 'apply') oppPaintLayer();
}

function oppSendReport() {
  var c = ensureOpp();
  var id = c.dialogId;
  if (!c.reportReason || !id) return;
  if (c.reportReason === 'safety') {
    S.safeguardCases.push({
      id: id,
      kind: c.reportKind === 'story' ? 'story' : 'opening',
      reason: 'safety',
      at: nowIso()
    });
    toast('Report sent. The team will check it.');
  } else if (c.reportReason === 'closed') {
    S.reported.push({ key: hideKey('opp', id), reason: c.reportReason, at: nowIso() });
    toast('Thank you. The team will re-check the closing date.');
  } else {
    S.reported.push({
      key: hideKey(c.reportKind === 'story' ? 'story' : 'opp', id),
      reason: c.reportReason,
      at: nowIso()
    });
    toast('Report sent. The team will check it.');
  }
  oppCloseDialog();
}

function oppDeleteOpening(id) {
  delete OPPS[id];
  FEED = FEED.filter(function (x) {
    return !(x.kind === 'opportunity' && (x.opp === id || x.id === id));
  });
  oppCloseDialog();
  if (NAV.length && NAV[NAV.length - 1].t === 'opp' && NAV[NAV.length - 1].id === id) closeSheet();
  else render();
  toast('Opening deleted.');
}

function oppLoadEdit(id) {
  var o = oppOpening(id);
  var c = ensureOpp();
  if (!o || !oppOwns(o)) return;
  oppResetCompose(false);
  c.mode = 'opportunity';
  c.editId = id;
  c.title = o.title;
  c.description = o.description;
  c.topic = o.topic;
  c.who = o.who;
  c.where = o.where;
  c.when = o.when;
  c.closesAt = o.closesAt || '';
  c.rolling = !!o.rolling;
  c.apply = o.apply;
  c.poster = o.poster;
  c.posterAlt = o.poster && o.poster.alt ? o.poster.alt : '';
  c.linkUrl = o.link && o.link.url ? o.link.url : '';
  c.step = 1;
  c.dialog = 'opportunity';
  S.menu = '';
  oppPaintLayer();
}

function oppPostReply(id, kind) {
  var box = byId('opp-reply');
  var text = box && box.value ? box.value.trim() : '';
  var item;
  var o;
  var rec;
  if (!text) return;
  if (
    requirePathway({
      type: 'reply',
      id: id,
      reason: 'Start your pathway first.'
    })
  ) {
    return;
  }
  rec = {
    id: id + '-r' + Date.now(),
    a: qaIsMentor() ? currentPosterId() : null,
    authorId: qaIsMentor() ? currentPosterId() : qaViewerId(),
    authorRole: qaIsMentor() ? 'mentor' : oppIsParent() ? 'parent' : 'student',
    who: qaIsMentor() ? '' : studentLabel(),
    name: qaIsMentor() ? author(currentPosterId()).name : studentLabel(),
    text: text,
    mine: true,
    at: nowIso(),
    createdAt: nowIso()
  };
  item = feedById(id) || oppFeedFor(id);
  o = OPPS[id];
  if (kind === 'story') {
    if (!item) return;
    if (!item.replies) item.replies = [];
    item.replies.push(rec);
  } else {
    if (item) {
      if (!item.replies) item.replies = [];
      item.replies.push(rec);
    } else if (o) {
      if (!o.replies) o.replies = [];
      o.replies.push(rec);
    }
  }
  toast('Reply posted.');
  paint();
}

function oppHandleClick(e, t) {
  var btn;
  var c = ensureOpp();
  var id;
  var d;
  var i;
  var o;
  var item;
  var file;
  var fromWho;
  btn = closestEl(t, '[data-opp-post]');
  if (btn) {
    e.stopPropagation();
    oppOpenPost();
    return true;
  }
  btn = closestEl(t, '[data-opp-drafts]');
  if (btn) {
    e.stopPropagation();
    c.dialog = 'drafts';
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-cancel]');
  if (btn) {
    if (c.dialog === 'picker' && c.fromWho) {
      c.dialog = 'who';
      oppPaintLayer();
      return true;
    }
    oppCloseDialog();
    return true;
  }
  btn = closestEl(t, '[data-opp-who]');
  if (btn) {
    id = btn.getAttribute('data-opp-who');
    if (id === 'student') {
      oppCloseDialog();
      qaOpenDialog('ask', { text: '' });
    } else {
      c.dialog = 'picker';
      c.fromWho = true;
      c.mode = '';
      oppPaintLayer();
    }
    return true;
  }
  btn = closestEl(t, '[data-opp-type]');
  if (btn) {
    id = btn.getAttribute('data-opp-type');
    if (id === 'question') {
      oppCloseDialog();
      qaOpenDialog('ask', { text: '' });
      return true;
    }
    if (id === 'session') {
      fromWho = !!c.fromWho;
      oppCloseDialog();
      ensureOpp().fromWho = fromWho;
      if (typeof sessOpenCompose === 'function') sessOpenCompose();
      return true;
    }
    oppResetCompose(false);
    c.mode = id;
    c.dialog = id;
    c.step = 1;
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-back]');
  if (btn) {
    oppReadFields();
    if (c.dialog === 'story' || (c.dialog === 'opportunity' && c.step === 1)) {
      c.dialog = 'picker';
      oppPaintLayer();
      return true;
    }
    if (c.step > 1) c.step -= 1;
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-next]');
  if (btn) {
    oppReadFields();
    if (!oppStepOk(c.step)) return true;
    if (c.step < 3) c.step += 1;
    else {
      c.dialog = 'preview';
    }
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-story-preview]');
  if (btn) {
    oppReadFields();
    if (!oppStoryOk()) return true;
    c.dialog = 'preview';
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-edit-back]');
  if (btn) {
    c.dialog = c.mode === 'story' ? 'story' : 'opportunity';
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-save-draft]');
  if (btn) {
    oppReadFields();
    oppSaveDraft();
    return true;
  }
  btn = closestEl(t, '[data-opp-publish]');
  if (btn) {
    if (c.mode === 'story') oppPublishStory();
    else oppPublishOpening();
    return true;
  }
  btn = closestEl(t, '[data-opp-resume]');
  if (btn) {
    for (i = 0; i < S.oppDrafts.length; i++) {
      if (S.oppDrafts[i].id === btn.getAttribute('data-opp-resume')) {
        oppLoadDraft(S.oppDrafts[i]);
        oppPaintLayer();
        return true;
      }
    }
    return true;
  }
  btn = closestEl(t, '[data-opp-del-draft]');
  if (btn) {
    id = btn.getAttribute('data-opp-del-draft');
    S.oppDrafts = S.oppDrafts.filter(function (x) {
      return x.id !== id;
    });
    toast('Draft deleted.');
    if (!oppDraftCount()) oppCloseDialog();
    else oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-apply]');
  if (btn) {
    e.stopPropagation();
    if (btn.disabled) return true;
    c.dialog = 'apply';
    c.dialogId = btn.getAttribute('data-opp-apply');
    S.menu = '';
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-edit]');
  if (btn) {
    e.stopPropagation();
    oppLoadEdit(btn.getAttribute('data-opp-edit'));
    return true;
  }
  btn = closestEl(t, '[data-opp-del]');
  if (btn) {
    e.stopPropagation();
    c.dialog = 'del';
    c.dialogId = btn.getAttribute('data-opp-del');
    S.menu = '';
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-confirm-del]');
  if (btn) {
    oppDeleteOpening(c.dialogId);
    return true;
  }
  btn = closestEl(t, '[data-opp-reopen]');
  if (btn) {
    e.stopPropagation();
    c.dialog = 'date';
    c.dialogId = btn.getAttribute('data-opp-reopen');
    c.dateVal = '';
    S.menu = '';
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-save-date]');
  if (btn) {
    oppReadFields();
    o = OPPS[c.dialogId];
    if (o && c.dateVal) {
      o.closesAt = c.dateVal + 'T17:00:00-04:00';
      o.rolling = false;
      o.editedAt = nowIso();
      toast('Closing date updated.');
    }
    oppCloseDialog();
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-opp-remind]');
  if (btn) {
    e.stopPropagation();
    oppToggleRemind(btn.getAttribute('data-opp-remind'));
    return true;
  }
  btn = closestEl(t, '[data-opp-hide]');
  if (btn) {
    e.stopPropagation();
    id = btn.getAttribute('data-opp-hide');
    if (S.hidden.indexOf(id) === -1) S.hidden.push(id);
    S.menu = '';
    toast('You will see fewer posts like this.', {
      undo: function () {
        S.hidden = S.hidden.filter(function (k) {
          return k !== id;
        });
        render();
      }
    });
    render();
    return true;
  }
  btn = closestEl(t, '[data-opp-report]');
  if (btn) {
    e.stopPropagation();
    c.dialog = 'report';
    c.dialogId = btn.getAttribute('data-opp-report');
    c.reportKind = 'opp';
    c.reportReason = '';
    S.menu = '';
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-story-report]');
  if (btn) {
    e.stopPropagation();
    c.dialog = 'report';
    c.dialogId = btn.getAttribute('data-opp-story-report');
    c.reportKind = 'story';
    c.reportReason = '';
    S.menu = '';
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-reason]');
  if (btn) {
    c.reportReason = btn.getAttribute('data-opp-reason');
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-send-report]');
  if (btn) {
    oppSendReport();
    return true;
  }
  btn = closestEl(t, '[data-opp-story-edit]');
  if (btn) {
    e.stopPropagation();
    item = feedById(btn.getAttribute('data-opp-story-edit'));
    if (item && (item.mine || item.author === currentPosterId())) {
      oppResetCompose(false);
      c.mode = 'story';
      c.editId = item.id;
      c.storyBody = oppStoryBody(item);
      c.topic = item.topic || hashTagLabel(item.cat);
      c.photos = storyPhotos(item).slice();
      c.poster = null;
      c.posterAlt = '';
      c.linkUrl = item.link && item.link.url && !c.photos.length ? item.link.url : '';
      c.dialog = 'story';
      S.menu = '';
      oppPaintLayer();
    }
    return true;
  }
  btn = closestEl(t, '[data-opp-story-del]');
  if (btn) {
    e.stopPropagation();
    c.dialog = 'del-story';
    c.dialogId = btn.getAttribute('data-opp-story-del');
    S.menu = '';
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-confirm-del-story]');
  if (btn) {
    FEED = FEED.filter(function (x) {
      return x.id !== c.dialogId;
    });
    oppCloseDialog();
    if (NAV.length && NAV[NAV.length - 1].t === 'story' && NAV[NAV.length - 1].id === c.dialogId) {
      closeSheet();
    } else {
      render();
    }
    toast('Story deleted.');
    return true;
  }
  btn = closestEl(t, '[data-opp-pick]');
  if (btn) {
    e.stopPropagation();
    c.topic = btn.getAttribute('data-opp-pick');
    c.tagQ = '';
    c.tagIx = -1;
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-untag]');
  if (btn) {
    e.stopPropagation();
    c.topic = '';
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-story-follow]');
  if (btn) {
    e.stopPropagation();
    id = btn.getAttribute('data-story-follow');
    if (
      requirePathway({
        type: 'follow',
        id: id,
        reason: 'Start your pathway first.'
      })
    ) {
      return true;
    }
    if (isFollowing(id)) {
      followSet(id, false);
      toast('Unfollowed.');
    } else {
      followSet(id, true);
      toast('Following. Their stories move up your feed.');
    }
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-story-photo]');
  if (btn) {
    e.stopPropagation();
    item = feedById(btn.getAttribute('data-story-id')) || { photos: ensureOpp().photos };
    storyOpenLight(storyPhotos(item).length ? storyPhotos(item) : item.photos || [], parseInt(btn.getAttribute('data-story-photo'), 10) || 0);
    return true;
  }
  btn = closestEl(t, '[data-story-light-step]');
  if (btn) {
    e.stopPropagation();
    ensureOpp().lightIx = (ensureOpp().lightIx || 0) + parseInt(btn.getAttribute('data-story-light-step'), 10);
    storyPaintLight();
    return true;
  }
  btn = closestEl(t, '[data-story-rm-photo]');
  if (btn) {
    e.stopPropagation();
    i = parseInt(btn.getAttribute('data-story-rm-photo'), 10);
    if (c.photos && !isNaN(i)) c.photos.splice(i, 1);
    oppPaintLayer();
    return true;
  }
  btn = closestEl(t, '[data-opp-light]');
  if (btn) {
    e.stopPropagation();
    oppOpenLightbox(btn.getAttribute('data-url'), btn.getAttribute('data-alt') || '');
    return true;
  }
  btn = closestEl(t, '[data-opp-light-x]');
  if (btn) {
    oppCloseLightbox();
    return true;
  }
  btn = closestEl(t, '[data-opp-reply]');
  if (btn) {
    e.stopPropagation();
    oppPostReply(btn.getAttribute('data-opp-reply'), btn.getAttribute('data-kind') || 'opp');
    return true;
  }
  if (t && t.id === 'opp-light' && !closestEl(t, 'img')) {
    oppCloseLightbox();
    return true;
  }
  if (byId('qa-layer') && !byId('qa-layer').hidden && byId('qa-layer').querySelector('.opp-box') && !closestEl(t, '.opp-box')) {
    if (byId('opp-sug') && !byId('opp-sug').hidden) {
      byId('opp-sug').hidden = true;
      return true;
    }
    oppCloseDialog();
    return true;
  }
  return false;
}

function oppHandleInput(e) {
  var c;
  var file;
  var reader;
  var img;
  var i;
  var hint;
  var need;
  if (!e.target) return false;
  if (e.target.id === 'opp-photos' && e.target.files && e.target.files.length) {
    c = ensureOpp();
    Array.prototype.forEach.call(e.target.files, function (f) {
      var reader = new FileReader();
      var img = new Image();
      reader.onload = function () {
        img.onload = function () {
          if (!c.photos) c.photos = [];
          c.photos.push({ url: reader.result, width: img.naturalWidth, height: img.naturalHeight, alt: '' });
          c.linkUrl = '';
          oppPaintLayer();
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(f);
    });
    return true;
  }
  if (e.target.getAttribute && e.target.getAttribute('data-story-alt') != null) {
    c = ensureOpp();
    i = parseInt(e.target.getAttribute('data-story-alt'), 10);
    if (c.photos && c.photos[i]) c.photos[i].alt = e.target.value;
    oppSyncCompose();
    hint = e.target.nextElementSibling;
    if (hint && hint.className.indexOf('opp-hint') !== -1) {
      hint.className = (e.target.value || '').trim().length < 10 ? 'opp-hint is-bad' : 'opp-hint';
    }
    return true;
  }
  if (e.target.id === 'opp-poster' && e.target.files && e.target.files[0]) {
    c = ensureOpp();
    file = e.target.files[0];
    reader = new FileReader();
    img = new Image();
    reader.onload = function () {
      img.onload = function () {
        c.poster = { url: reader.result, width: img.naturalWidth, height: img.naturalHeight, alt: '' };
        oppPaintLayer();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    return true;
  }
  if (
    e.target.id === 'opp-title' ||
    e.target.id === 'opp-desc' ||
    e.target.id === 'opp-alt' ||
    e.target.id === 'opp-link' ||
    e.target.id === 'opp-who' ||
    e.target.id === 'opp-where' ||
    e.target.id === 'opp-when' ||
    e.target.id === 'opp-closes' ||
    e.target.id === 'opp-apply' ||
    e.target.id === 'opp-story' ||
    e.target.id === 'opp-new-date'
  ) {
    oppReadFields();
    if (e.target.id === 'opp-closes' && ensureOpp().rolling) {
      ensureOpp().rolling = false;
    }
    if (e.target.id === 'opp-story') {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(320, e.target.scrollHeight) + 'px';
      need = storyNeedChars();
      hint = byId('story-need');
      if (hint) {
        if (need) {
          hint.hidden = false;
          hint.textContent = need + ' more characters needed';
        } else {
          hint.hidden = true;
        }
      }
    }
    if (e.target.id === 'opp-link' && ensureOpp().mode === 'story' && oppParseLink(e.target.value) && ensureOpp().photos && ensureOpp().photos.length) {
      ensureOpp().photos = [];
      oppPaintLayer();
      return true;
    }
    oppSyncCompose();
    if (e.target.id === 'opp-link') {
      var slot = byId('opp-link-prev');
      var parsed = oppParseLink(e.target.value);
      if (slot) slot.innerHTML = parsed ? oppLinkHtml(parsed) : '';
    }
    return true;
  }
  if (e.target.id === 'opp-rolling') {
    oppReadFields();
    oppPaintLayer();
    return true;
  }
  if (e.target.id === 'opp-tag-q') {
    ensureOpp().tagQ = e.target.value;
    ensureOpp().tagIx = -1;
    oppSyncTopicUi();
    return true;
  }
  if (e.target.id === 'opp-reply') {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(220, Math.max(44, e.target.scrollHeight)) + 'px';
    var postBtn = byId('opp-post');
    if (postBtn) postBtn.disabled = !e.target.value.trim();
    return true;
  }
  return false;
}

function oppHandleKey(e) {
  var c = ensureOpp();
  var sug = byId('opp-sug');
  var opts;
  var n;
  if (e.target && e.target.id === 'opp-tag-q') {
    opts = sug && !sug.hidden ? sug.querySelectorAll('[data-opp-pick]') : [];
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
      oppSyncTopicUi();
      return true;
    }
    if (e.key === 'ArrowUp' && n) {
      e.preventDefault();
      c.tagIx = c.tagIx <= 0 ? n - 1 : c.tagIx - 1;
      oppSyncTopicUi();
      return true;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (n) {
        c.topic = (opts[c.tagIx >= 0 ? c.tagIx : 0] || opts[0]).getAttribute('data-opp-pick');
        c.tagQ = '';
        oppPaintLayer();
      }
      return true;
    }
    if (e.key === 'Backspace' && !e.target.value && c.topic) {
      c.topic = '';
      oppPaintLayer();
      return true;
    }
  }
  if (c.lightPhotos && c.lightPhotos.length && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    e.preventDefault();
    e.stopPropagation();
    c.lightIx = (c.lightIx || 0) + (e.key === 'ArrowRight' ? 1 : -1);
    storyPaintLight();
    return true;
  }
  if (e.key === 'Escape') {
    if (c.lightUrl || (c.lightPhotos && c.lightPhotos.length)) {
      e.preventDefault();
      oppCloseLightbox();
      return true;
    }
    if (sug && !sug.hidden) {
      e.preventDefault();
      sug.hidden = true;
      return true;
    }
    if (S.menu) {
      S.menu = '';
      refreshUi();
      return true;
    }
    if (c.dialog) {
      e.preventDefault();
      oppCloseDialog();
      return true;
    }
  }
  return false;
}

function oppAfterPaint() {
  var top;
  var root;
  document.body.classList.toggle('opp-sheet-open', !!(NAV.length && (NAV[NAV.length - 1].t === 'opp' || NAV[NAV.length - 1].t === 'story')));
  if (NAV.length && (NAV[NAV.length - 1].t === 'opp' || NAV[NAV.length - 1].t === 'story')) {
    root = document.querySelector('.opp-sheet');
    if (root && root.focus && document.activeElement === document.body) {
      root.setAttribute('tabindex', '-1');
      root.focus();
    }
  }
  if (!(S.qa && S.qa.dialog)) oppPaintLayer();
  if (ensureOpp().lightUrl) {
    /* lightbox is independent of paint */
  } else {
    top = byId('opp-light');
    if (top && !top.hidden && !ensureOpp().lightUrl) top.hidden = true;
  }
}

function oppInit() {
  if (oppInit._ready) return;
  oppInit._ready = true;
  if (!byId('opp-light')) {
    var el = document.createElement('div');
    el.id = 'opp-light';
    el.className = 'opp-light';
    el.hidden = true;
    document.body.appendChild(el);
  }
  setInterval(function () {
    if (oppOverlayOpen()) return;
    if (typeof sessOverlayOpen === 'function' && sessOverlayOpen()) return;
    if (S.view !== 'feed' && S.view !== 'kind') return;
    render();
  }, 30000);
}

