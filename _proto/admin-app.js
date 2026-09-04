/* Admin & Mentor Center app. ES5. Depends on data.js + nsg-cms.js (+ careers/schools optional). */
(function () {
  'use strict';

  var state = {
    section: 'overview',
    query: '',
    filter: '',
    selected: null,
    store: null,
    user: null
  };

  var SECTIONS = [
    { id: 'overview', label: 'Overview', group: 'Home', roles: ['admin', 'mentor'] },
    { id: 'opps', label: 'Opportunities', group: 'Site content', roles: ['admin'] },
    { id: 'sessions', label: 'Sessions', group: 'Site content', roles: ['admin', 'mentor'] },
    { id: 'authors', label: 'Mentors & contributors', group: 'Site content', roles: ['admin', 'mentor'] },
    { id: 'journeys', label: 'Journeys', group: 'Site content', roles: ['admin', 'mentor'] },
    { id: 'feed', label: 'Feed posts', group: 'Site content', roles: ['admin', 'mentor'] },
    { id: 'stages', label: 'Pathway stages', group: 'Pathway', roles: ['admin'] },
    { id: 'topics', label: 'Topics', group: 'Pathway', roles: ['admin'] },
    { id: 'slots', label: 'Pathway slots', group: 'Pathway', roles: ['admin'] },
    { id: 'careers', label: 'Careers library', group: 'Libraries', roles: ['admin'] },
    { id: 'schools', label: 'Schools library', group: 'Libraries', roles: ['admin'] }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toast(msg) {
    var el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove('show');
    }, 2200);
  }

  function can(sectionId) {
    var sec = null;
    var i;
    for (i = 0; i < SECTIONS.length; i++) {
      if (SECTIONS[i].id === sectionId) {
        sec = SECTIONS[i];
        break;
      }
    }
    if (!sec || !state.user) return false;
    return sec.roles.indexOf(state.user.role) !== -1;
  }

  function isMentorOnly() {
    return state.user && state.user.role === 'mentor';
  }

  function mentorId() {
    return (state.user && state.user.authorId) || null;
  }

  function saveStore() {
    if (!window.NSG_CMS) return;
    var ok = NSG_CMS.persist(state.store);
    toast(ok ? 'Saved. Live site will use these edits on this browser.' : 'Could not save (storage full or blocked).');
  }

  function linesToArr(text) {
    return String(text || '')
      .split(/\n+/)
      .map(function (x) {
        return x.trim();
      })
      .filter(Boolean);
  }

  function arrToLines(arr) {
    return (arr || []).join('\n');
  }

  function csvToArr(text) {
    return String(text || '')
      .split(',')
      .map(function (x) {
        return x.trim();
      })
      .filter(Boolean);
  }

  function matchQ(hay, q) {
    if (!q) return true;
    return String(hay || '')
      .toLowerCase()
      .indexOf(q.toLowerCase()) !== -1;
  }

  function careersBase() {
    return (window.CAREERS || window.NSG_CAREERS_V3 || []).slice();
  }

  function schoolsBase() {
    return (window.NSG_SCHOOLS && window.NSG_SCHOOLS.SCHOOLS
      ? window.NSG_SCHOOLS.SCHOOLS.slice()
      : []);
  }

  function effectiveCareers() {
    var list = careersBase();
    var upserts = state.store.careerUpserts || {};
    var deletes = state.store.careerDeletes || [];
    var del = {};
    var i;
    for (i = 0; i < deletes.length; i++) del[deletes[i]] = true;
    var out = [];
    var seen = {};
    for (i = 0; i < list.length; i++) {
      var row = list[i];
      if (!row || del[row.id]) continue;
      if (upserts[row.id]) {
        out.push(upserts[row.id]);
        seen[row.id] = true;
      } else {
        out.push(row);
        seen[row.id] = true;
      }
    }
    for (var id in upserts) {
      if (!Object.prototype.hasOwnProperty.call(upserts, id)) continue;
      if (seen[id] || del[id]) continue;
      out.push(upserts[id]);
    }
    return out;
  }

  function effectiveSchools() {
    var list = schoolsBase();
    var upserts = state.store.schoolUpserts || {};
    var deletes = state.store.schoolDeletes || [];
    var del = {};
    var i;
    for (i = 0; i < deletes.length; i++) del[deletes[i]] = true;
    var out = [];
    var seen = {};
    for (i = 0; i < list.length; i++) {
      var row = list[i];
      if (!row || del[row.id]) continue;
      if (upserts[row.id]) {
        out.push(upserts[row.id]);
        seen[row.id] = true;
      } else {
        out.push(row);
        seen[row.id] = true;
      }
    }
    for (var id in upserts) {
      if (!Object.prototype.hasOwnProperty.call(upserts, id)) continue;
      if (seen[id] || del[id]) continue;
      out.push(upserts[id]);
    }
    return out;
  }

  /* ---------- list builders ---------- */

  function listOpps() {
    var map = state.store.opps || {};
    var out = [];
    var id;
    for (id in map) {
      if (!Object.prototype.hasOwnProperty.call(map, id)) continue;
      var o = map[id];
      var hay = [o.id, o.name, o.cat, o.one, o.who].join(' ');
      if (!matchQ(hay, state.query)) continue;
      if (state.filter && o.cat !== state.filter) continue;
      out.push({ id: id, title: o.name, meta: o.cat + ' · ' + (o.stage || ''), tags: [o.independent ? 'independent' : 'pipeline'] });
    }
    out.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    return out;
  }

  function listSessions() {
    var list = state.store.sessions || [];
    var mid = mentorId();
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
      var s = list[i];
      if (isMentorOnly() && s.lead !== mid) continue;
      var hay = [s.id, s.title, s.pod, s.cat, s.what, s.lead].join(' ');
      if (!matchQ(hay, state.query)) continue;
      if (state.filter && s.cat !== state.filter) continue;
      out.push({
        id: s.id,
        title: s.title,
        meta: (s.when || '') + (s.lead ? ' · ' + s.lead : ''),
        tags: [s.cat || 'Session']
      });
    }
    return out;
  }

  function listAuthors() {
    var map = state.store.authors || {};
    var mid = mentorId();
    var out = [];
    var id;
    for (id in map) {
      if (!Object.prototype.hasOwnProperty.call(map, id)) continue;
      if (isMentorOnly() && id !== mid) continue;
      var a = map[id];
      var hay = [id, a.name, a.role, a.pos, a.pod, (a.cats || []).join(' ')].join(' ');
      if (!matchQ(hay, state.query)) continue;
      if (state.filter && a.role !== state.filter) continue;
      out.push({
        id: id,
        title: a.name,
        meta: a.role + (a.pos ? ' · ' + a.pos : ''),
        tags: a.system ? ['system'] : [a.role || '']
      });
    }
    out.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    return out;
  }

  function listJourneys() {
    var map = state.store.journeys || {};
    var mid = mentorId();
    var out = [];
    var id;
    for (id in map) {
      if (!Object.prototype.hasOwnProperty.call(map, id)) continue;
      if (isMentorOnly() && id !== mid) continue;
      var j = map[id];
      var author = (state.store.authors && state.store.authors[id]) || {};
      var hay = [id, author.name, j.field, j.type, j.place, j.hook, j.now, j.blurb].join(' ');
      if (!matchQ(hay, state.query)) continue;
      if (state.filter && j.field !== state.filter) continue;
      out.push({
        id: id,
        title: author.name || id,
        meta: (j.field || '') + (j.type ? ' · ' + j.type : ''),
        tags: j.ongoing ? ['ongoing'] : []
      });
    }
    return out;
  }

  function listFeed() {
    var list = state.store.feed || [];
    var mid = mentorId();
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
      var f = list[i];
      if (isMentorOnly()) {
        var mine =
          f.author === mid ||
          f.kind === 'question' ||
          (f.replies &&
            f.replies.some(function (r) {
              return r.a === mid;
            }));
        if (!mine && f.kind !== 'question') continue;
      }
      var hay = [f.id, f.kind, f.cat, f.title, f.text, f.who, f.author].join(' ');
      if (!matchQ(hay, state.query)) continue;
      if (state.filter && f.kind !== state.filter) continue;
      out.push({
        id: f.id,
        title: f.title || f.text || f.id,
        meta: f.kind + (f.cat ? ' · ' + f.cat : ''),
        tags: [f.kind]
      });
    }
    return out;
  }

  function listStages() {
    var list = state.store.stages || [];
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
      var s = list[i];
      var hay = [s.key, s.name, s.label, s.dec && s.dec.t, s.dec && s.dec.why].join(' ');
      if (!matchQ(hay, state.query)) continue;
      out.push({
        id: s.key,
        title: s.name,
        meta: s.label + (s.dec && s.dec.t ? ' · ' + s.dec.t : ''),
        tags: [s.key]
      });
    }
    return out;
  }

  function listTopics() {
    var list = state.store.cats || [];
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
      if (!matchQ(list[i], state.query)) continue;
      out.push({ id: String(i), title: list[i], meta: 'Topic ' + (i + 1), tags: [] });
    }
    return out;
  }

  function listSlots() {
    var list = state.store.slots || [];
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
      var s = list[i];
      var hay = [s.k, s.t, s.hint].join(' ');
      if (!matchQ(hay, state.query)) continue;
      out.push({ id: s.k, title: s.t, meta: s.k, tags: ['slot'] });
    }
    return out;
  }

  function listCareers() {
    var list = effectiveCareers();
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
      var c = list[i];
      var hay = [c.id, c.name, c.category, c.does, (c.csecSubjects || []).join(' ')].join(' ');
      if (!matchQ(hay, state.query)) continue;
      if (state.filter && c.category !== state.filter) continue;
      out.push({
        id: c.id,
        title: c.name,
        meta: (c.category || '') + (c.confidence ? ' · ' + c.confidence : ''),
        tags: [c.confidence || 'career']
      });
    }
    out.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    return out;
  }

  function listSchools() {
    var list = effectiveSchools();
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
      var s = list[i];
      var hay = [s.id, s.name, s.district, s.type, s.status, s.notes].join(' ');
      if (!matchQ(hay, state.query)) continue;
      if (state.filter && String(s.region) !== state.filter) continue;
      out.push({
        id: s.id,
        title: s.name,
        meta: 'Region ' + s.region + (s.status ? ' · ' + s.status : ''),
        tags: [s.type || 'school']
      });
    }
    out.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    return out;
  }

  function currentList() {
    switch (state.section) {
      case 'opps':
        return listOpps();
      case 'sessions':
        return listSessions();
      case 'authors':
        return listAuthors();
      case 'journeys':
        return listJourneys();
      case 'feed':
        return listFeed();
      case 'stages':
        return listStages();
      case 'topics':
        return listTopics();
      case 'slots':
        return listSlots();
      case 'careers':
        return listCareers();
      case 'schools':
        return listSchools();
      default:
        return [];
    }
  }

  /* ---------- editors ---------- */

  function field(label, name, value, opts) {
    opts = opts || {};
    var tag = opts.area ? 'textarea' : opts.select ? 'select' : 'input';
    var cls = opts.full ? 'field full' : 'field';
    var html = '<div class="' + cls + '"><label for="f-' + esc(name) + '">' + esc(label) + '</label>';
    if (tag === 'textarea') {
      html +=
        '<textarea id="f-' +
        esc(name) +
        '" name="' +
        esc(name) +
        '"' +
        (opts.rows ? ' rows="' + opts.rows + '"' : '') +
        '>' +
        esc(value) +
        '</textarea>';
    } else if (tag === 'select') {
      html += '<select id="f-' + esc(name) + '" name="' + esc(name) + '">';
      var i;
      for (i = 0; i < opts.options.length; i++) {
        var o = opts.options[i];
        var val = typeof o === 'string' ? o : o.value;
        var lab = typeof o === 'string' ? o : o.label;
        html +=
          '<option value="' +
          esc(val) +
          '"' +
          (String(val) === String(value) ? ' selected' : '') +
          '>' +
          esc(lab) +
          '</option>';
      }
      html += '</select>';
    } else {
      html +=
        '<input id="f-' +
        esc(name) +
        '" name="' +
        esc(name) +
        '" type="' +
        esc(opts.type || 'text') +
        '" value="' +
        esc(value) +
        '"' +
        (opts.placeholder ? ' placeholder="' + esc(opts.placeholder) + '"' : '') +
        '/>';
    }
    if (opts.help) html += '<div class="help">' + esc(opts.help) + '</div>';
    html += '</div>';
    return html;
  }

  function readForm(root) {
    var data = {};
    var nodes = root.querySelectorAll('[name]');
    var i;
    for (i = 0; i < nodes.length; i++) {
      data[nodes[i].name] = nodes[i].value;
    }
    return data;
  }

  function editorShell(title, bodyHtml, actionsHtml) {
    return (
      '<div class="editor-head"><h2>' +
      esc(title) +
      '</h2><div class="top-actions">' +
      (actionsHtml || '') +
      '</div></div><div class="editor-body">' +
      bodyHtml +
      '</div>'
    );
  }

  function renderOppEditor(id) {
    var o = state.store.opps[id];
    if (!o) return '<div class="editor-empty"><h3>Missing opportunity</h3></div>';
    var html =
      '<form id="edit-form" class="form-grid" data-kind="opp" data-id="' +
      esc(id) +
      '">' +
      field('ID', 'id', o.id, { help: 'Stable key used by feed cards and related links.' }) +
      field('Name', 'name', o.name) +
      field('Category', 'cat', o.cat, { select: true, options: state.store.cats || [] }) +
      field('Primary stage', 'stage', o.stage || '') +
      field('Stage indexes (comma)', 'stages', (o.stages || []).join(', '), {
        help: '0-based indexes into pathway stages.'
      }) +
      field('One-liner', 'one', o.one, { area: true, full: true, rows: 3 }) +
      field('What it is (one paragraph per line)', 'what', arrToLines(o.what), { area: true, full: true, rows: 6 }) +
      field('Season', 'season', o.season || '', { full: true }) +
      field('Cost', 'cost', o.cost || '', { full: true }) +
      field('Who', 'who', o.who || '', { full: true }) +
      field('Entry steps (bold|support per line)', 'entry', (o.entry || [])
        .map(function (e) {
          return (e.b || '') + '|' + (e.s || '');
        })
        .join('\n'), { area: true, full: true, rows: 5 }) +
      field('Tips (one per line)', 'tips', arrToLines(o.tips), { area: true, full: true, rows: 4 }) +
      field('Truth bold', 'truth_b', (o.truth && o.truth.b) || '') +
      field('Truth detail', 'truth_p', (o.truth && o.truth.p) || '', { area: true }) +
      field('Proof bold', 'proof_b', (o.proof && o.proof.b) || '') +
      field('Proof detail', 'proof_p', (o.proof && o.proof.p) || '', { area: true }) +
      field('Leads to', 'leads', o.leads || '', { area: true, full: true }) +
      field('Mentor ids (comma)', 'mentors', (o.mentors || []).join(', ')) +
      field('Related opp ids (comma)', 'rel', (o.rel || []).join(', ')) +
      field('Session ids (comma)', 'sess', (o.sess || []).join(', ')) +
      field('Independent', 'independent', o.independent ? 'true' : 'false', {
        select: true,
        options: ['false', 'true']
      }) +
      '<div class="form-actions full">' +
      '<button class="btn solid" type="submit">Save opportunity</button>' +
      '<button class="btn danger" type="button" data-delete>Delete</button>' +
      '</div></form>';
    return editorShell(o.name || id, html);
  }

  function renderSessionEditor(id) {
    var list = state.store.sessions || [];
    var s = null;
    var i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) s = list[i];
    if (!s) return '<div class="editor-empty"><h3>Missing session</h3></div>';
    if (isMentorOnly() && s.lead !== mentorId()) {
      return '<div class="editor-empty"><h3>Not your session</h3><p>Mentors can only edit sessions they lead.</p></div>';
    }
    var html =
      '<form id="edit-form" class="form-grid" data-kind="session" data-id="' +
      esc(id) +
      '">' +
      field('ID', 'id', s.id) +
      field('Title', 'title', s.title) +
      field('Day label', 'day', s.day || '') +
      field('Date number', 'date', s.date || '') +
      field('When', 'when', s.when || '', { full: true }) +
      field('Pod', 'pod', s.pod || '') +
      field('Lead author id', 'lead', s.lead || '') +
      field('Category', 'cat', s.cat || '', { select: true, options: (state.store.cats || []).concat(['']) }) +
      field('Seats', 'seats', s.seats != null ? s.seats : '', { type: 'number' }) +
      field('Taken', 'taken', s.taken != null ? s.taken : '', { type: 'number' }) +
      field('Stage keys (comma)', 'stages', (s.stages || []).join(', ')) +
      field('What', 'what', s.what || '', { area: true, full: true }) +
      field('Bring', 'bring', s.bring || '', { area: true, full: true }) +
      field('Sample questions (one per line)', 'qs', arrToLines(s.qs), { area: true, full: true, rows: 4 }) +
      '<div class="form-actions full">' +
      '<button class="btn solid" type="submit">Save session</button>' +
      (isMentorOnly()
        ? ''
        : '<button class="btn danger" type="button" data-delete>Delete</button>') +
      '</div></form>';
    return editorShell(s.title || id, html);
  }

  function renderAuthorEditor(id) {
    var a = state.store.authors[id];
    if (!a) return '<div class="editor-empty"><h3>Missing person</h3></div>';
    if (isMentorOnly() && id !== mentorId()) {
      return '<div class="editor-empty"><h3>Not your profile</h3></div>';
    }
    var html =
      '<form id="edit-form" class="form-grid" data-kind="author" data-id="' +
      esc(id) +
      '">' +
      field('Key', 'key', id, { help: 'Used across journeys, sessions, and feed.' }) +
      field('Name', 'name', a.name || '') +
      field('Initials', 'init', a.init || '') +
      field('Role', 'role', a.role || '', {
        select: true,
        options: ['Mentor', 'Contributor', 'Student', 'Next Step']
      }) +
      field('Position', 'pos', a.pos || '', { full: true }) +
      field('Pod', 'pod', a.pod || '') +
      field('Journey key', 'journey', a.journey || '') +
      field('Topics (comma)', 'cats', (a.cats || []).join(', '), { full: true }) +
      field('Similar author ids (comma)', 'similar', (a.similar || []).join(', '), { full: true }) +
      '<div class="form-actions full">' +
      '<button class="btn solid" type="submit">Save person</button>' +
      (isMentorOnly() || a.system
        ? ''
        : '<button class="btn danger" type="button" data-delete>Delete</button>') +
      '</div></form>';
    return editorShell(a.name || id, html);
  }

  function renderJourneyEditor(id) {
    var j = state.store.journeys[id];
    if (!j) return '<div class="editor-empty"><h3>Missing journey</h3></div>';
    if (isMentorOnly() && id !== mentorId()) {
      return '<div class="editor-empty"><h3>Not your journey</h3></div>';
    }
    var html =
      '<form id="edit-form" class="form-grid" data-kind="journey" data-id="' +
      esc(id) +
      '">' +
      field('Author key', 'key', id) +
      field('Start age', 'age', j.age != null ? j.age : '', { type: 'number' }) +
      field('Ongoing', 'ongoing', j.ongoing ? 'true' : 'false', { select: true, options: ['true', 'false'] }) +
      field('Field', 'field', j.field || '') +
      field('Archetype type', 'type', j.type || '') +
      field('Place', 'place', j.place || '', { full: true }) +
      field('Hook', 'hook', j.hook || '', { area: true, full: true }) +
      field('Now', 'now', j.now || '', { area: true, full: true }) +
      field('Quote', 'quote', j.quote || '', { area: true, full: true }) +
      field('Blurb', 'blurb', j.blurb || '', { area: true, full: true }) +
      field('Moments (age|text per line)', 'moments', (j.moments || [])
        .map(function (m) {
          return (m.age != null ? m.age : '') + '|' + (m.text || '');
        })
        .join('\n'), { area: true, full: true, rows: 8 }) +
      '<div class="form-actions full">' +
      '<button class="btn solid" type="submit">Save journey</button>' +
      (isMentorOnly()
        ? ''
        : '<button class="btn danger" type="button" data-delete>Delete</button>') +
      '</div></form>';
    return editorShell((state.store.authors[id] && state.store.authors[id].name) || id, html);
  }

  function renderFeedEditor(id) {
    var list = state.store.feed || [];
    var f = null;
    var i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) f = list[i];
    if (!f) return '<div class="editor-empty"><h3>Missing post</h3></div>';

    var replyBlock = '';
    if (f.kind === 'question') {
      replyBlock =
        field(
          'Replies (authorId|text per line; use blank authorId for anonymous)',
          'replies',
          (f.replies || [])
            .map(function (r) {
              return (r.a || '') + '|' + (r.text || '');
            })
            .join('\n'),
          {
            area: true,
            full: true,
            rows: 6,
            help: isMentorOnly()
              ? 'Add or edit replies. Use your author id (' + mentorId() + ') for your answers.'
              : 'Full reply thread.'
          }
        );
    }

    var html =
      '<form id="edit-form" class="form-grid" data-kind="feed" data-id="' +
      esc(id) +
      '">' +
      field('ID', 'id', f.id) +
      field('Kind', 'kind', f.kind || '', {
        select: true,
        options: ['question', 'story', 'opportunity', 'session', 'journey']
      }) +
      field('Time label', 'time', f.time || '') +
      field('Category', 'cat', f.cat || '', {
        select: true,
        options: (state.store.cats || []).concat([''])
      }) +
      field('Author id', 'author', f.author || '') +
      field('Who label', 'who', f.who || '') +
      field('Title', 'title', f.title || '', { full: true }) +
      field('Text / teaser', 'text', f.text || '', { area: true, full: true }) +
      field('Body paragraphs (one per line)', 'body', arrToLines(f.body), {
        area: true,
        full: true,
        rows: 5
      }) +
      field('Opportunity id', 'opp', f.opp || '') +
      field('Session id', 'sess', f.sess || '') +
      field('Journey id', 'journey', f.journey || '') +
      field('Anonymous', 'anon', f.anon ? 'true' : 'false', {
        select: true,
        options: ['false', 'true']
      }) +
      replyBlock +
      '<div class="form-actions full">' +
      '<button class="btn solid" type="submit">Save post</button>' +
      (isMentorOnly()
        ? ''
        : '<button class="btn danger" type="button" data-delete>Delete</button>') +
      '</div></form>';
    return editorShell(f.title || f.text || id, html);
  }

  function renderStageEditor(id) {
    var list = state.store.stages || [];
    var s = null;
    var i;
    for (i = 0; i < list.length; i++) if (list[i].key === id) s = list[i];
    if (!s) return '<div class="editor-empty"><h3>Missing stage</h3></div>';
    var html =
      '<form id="edit-form" class="form-grid" data-kind="stage" data-id="' +
      esc(id) +
      '">' +
      field('Key', 'key', s.key) +
      field('Name', 'name', s.name || '') +
      field('Label', 'label', s.label || '') +
      field('Decision title', 'dec_t', (s.dec && s.dec.t) || '', { full: true }) +
      field('Decision why', 'dec_why', (s.dec && s.dec.why) || '', { area: true, full: true, rows: 4 }) +
      field('Due date', 'dec_due', (s.dec && s.dec.due) || '', { help: 'YYYY-MM-DD or blank' }) +
      '<div class="form-actions full"><button class="btn solid" type="submit">Save stage</button></div></form>';
    return editorShell(s.name || id, html);
  }

  function renderTopicEditor(id) {
    var idx = parseInt(id, 10);
    var list = state.store.cats || [];
    var name = list[idx];
    if (name == null) return '<div class="editor-empty"><h3>Missing topic</h3></div>';
    var html =
      '<form id="edit-form" class="form-grid" data-kind="topic" data-id="' +
      esc(id) +
      '">' +
      field('Topic name', 'name', name, { full: true }) +
      '<div class="form-actions full">' +
      '<button class="btn solid" type="submit">Save topic</button>' +
      '<button class="btn danger" type="button" data-delete>Delete</button>' +
      '</div></form>';
    return editorShell(name, html);
  }

  function renderSlotEditor(id) {
    var list = state.store.slots || [];
    var s = null;
    var i;
    for (i = 0; i < list.length; i++) if (list[i].k === id) s = list[i];
    if (!s) return '<div class="editor-empty"><h3>Missing slot</h3></div>';
    var html =
      '<form id="edit-form" class="form-grid" data-kind="slot" data-id="' +
      esc(id) +
      '">' +
      field('Key', 'k', s.k) +
      field('Title', 't', s.t || '') +
      field('Hint', 'hint', s.hint || '', { area: true, full: true }) +
      '<div class="form-actions full">' +
      '<button class="btn solid" type="submit">Save slot</button>' +
      '<button class="btn danger" type="button" data-delete>Delete</button>' +
      '</div></form>';
    return editorShell(s.t || id, html);
  }

  function renderCareerEditor(id) {
    var list = effectiveCareers();
    var c = null;
    var i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) c = list[i];
    if (!c) return '<div class="editor-empty"><h3>Missing career</h3></div>';
    var routes = (c.routes || [])
      .map(function (r) {
        return (r.name || '') + (r.detail ? '|' + r.detail : '');
      })
      .join('\n');
    var html =
      '<form id="edit-form" class="form-grid" data-kind="career" data-id="' +
      esc(id) +
      '">' +
      field('ID', 'id', c.id) +
      field('Name', 'name', c.name || '') +
      field('Category', 'category', c.category || '') +
      field('Confidence', 'confidence', c.confidence || '') +
      field('Gatekeeper type', 'gatekeeperType', c.gatekeeperType || '') +
      field('CSEC subjects (comma)', 'csecSubjects', (c.csecSubjects || []).join(', '), { full: true }) +
      field('CSEC note', 'csecNote', c.csecNote || '', { area: true, full: true }) +
      field('CAPE note', 'capeNote', c.capeNote || '', { area: true, full: true }) +
      field('Routes (name|detail per line)', 'routes', routes, { area: true, full: true, rows: 4 }) +
      field('What they do', 'does', c.does || '', { area: true, full: true, rows: 4 }) +
      field('Source note', 'sourceNote', c.sourceNote || '', { full: true }) +
      '<div class="form-actions full">' +
      '<button class="btn solid" type="submit">Save career</button>' +
      '<button class="btn danger" type="button" data-delete>Delete</button>' +
      '</div></form>';
    return editorShell(c.name || id, html);
  }

  function renderSchoolEditor(id) {
    var list = effectiveSchools();
    var s = null;
    var i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) s = list[i];
    if (!s) return '<div class="editor-empty"><h3>Missing school</h3></div>';
    var html =
      '<form id="edit-form" class="form-grid" data-kind="school" data-id="' +
      esc(id) +
      '">' +
      field('ID', 'id', s.id) +
      field('Name', 'name', s.name || '') +
      field('Region', 'region', s.region != null ? s.region : '', { type: 'number' }) +
      field('District', 'district', s.district || '', { full: true }) +
      field('Type', 'type', s.type || '') +
      field('Status', 'status', s.status || '') +
      field('Sixth form', 'sixthForm', s.sixthForm || '') +
      field('Dormitory', 'dormitory', s.dormitory || '') +
      field('Offers CVQ', 'offersCVQ', s.offersCVQ || '') +
      field('Notes', 'notes', s.notes || '', { area: true, full: true, rows: 5 }) +
      '<div class="form-actions full">' +
      '<button class="btn solid" type="submit">Save school</button>' +
      '<button class="btn danger" type="button" data-delete>Delete</button>' +
      '</div></form>';
    return editorShell(s.name || id, html);
  }

  function renderEditor() {
    var el = $('editor');
    if (!el) return;
    if (state.section === 'overview') {
      el.innerHTML = '';
      el.style.display = 'none';
      return;
    }
    el.style.display = '';
    if (!state.selected) {
      el.innerHTML =
        '<div class="editor-empty"><h3>Select an item</h3><p>Use search on the left, then edit on the right.</p></div>';
      return;
    }
    var html = '';
    switch (state.section) {
      case 'opps':
        html = renderOppEditor(state.selected);
        break;
      case 'sessions':
        html = renderSessionEditor(state.selected);
        break;
      case 'authors':
        html = renderAuthorEditor(state.selected);
        break;
      case 'journeys':
        html = renderJourneyEditor(state.selected);
        break;
      case 'feed':
        html = renderFeedEditor(state.selected);
        break;
      case 'stages':
        html = renderStageEditor(state.selected);
        break;
      case 'topics':
        html = renderTopicEditor(state.selected);
        break;
      case 'slots':
        html = renderSlotEditor(state.selected);
        break;
      case 'careers':
        html = renderCareerEditor(state.selected);
        break;
      case 'schools':
        html = renderSchoolEditor(state.selected);
        break;
      default:
        html = '<div class="editor-empty"><h3>Nothing here</h3></div>';
    }
    el.innerHTML = html;
    wireEditor();
  }

  /* ---------- save / delete ---------- */

  function parseEntry(lines) {
    return linesToArr(lines).map(function (line) {
      var parts = line.split('|');
      return { b: (parts[0] || '').trim(), s: (parts.slice(1).join('|') || '').trim() };
    });
  }

  function parseMoments(lines) {
    return linesToArr(lines).map(function (line) {
      var parts = line.split('|');
      var age = parseInt(parts[0], 10);
      return { age: isNaN(age) ? null : age, text: (parts.slice(1).join('|') || '').trim() };
    });
  }

  function parseReplies(lines) {
    return linesToArr(lines).map(function (line) {
      var parts = line.split('|');
      var a = (parts[0] || '').trim();
      var text = (parts.slice(1).join('|') || '').trim();
      if (!a) return { a: null, who: 'Community reply', text: text };
      return { a: a, text: text };
    });
  }

  function parseRoutes(lines) {
    return linesToArr(lines).map(function (line) {
      var parts = line.split('|');
      return { name: (parts[0] || '').trim(), detail: (parts.slice(1).join('|') || '').trim() || null };
    });
  }

  function onSave(form) {
    var kind = form.getAttribute('data-kind');
    var id = form.getAttribute('data-id');
    var d = readForm(form);

    if (kind === 'opp') {
      var old = state.store.opps[id] || {};
      var nextId = (d.id || id).trim();
      var next = NSG_CMS.clone(old);
      next.id = nextId;
      next.name = d.name;
      next.cat = d.cat;
      next.stage = d.stage;
      next.stages = csvToArr(d.stages).map(function (x) {
        return parseInt(x, 10);
      }).filter(function (n) {
        return !isNaN(n);
      });
      next.one = d.one;
      next.what = linesToArr(d.what);
      next.season = d.season;
      next.cost = d.cost;
      next.who = d.who;
      next.entry = parseEntry(d.entry);
      next.tips = linesToArr(d.tips);
      next.truth = { b: d.truth_b, p: d.truth_p };
      next.proof = { b: d.proof_b, p: d.proof_p };
      next.leads = d.leads;
      next.mentors = csvToArr(d.mentors);
      next.rel = csvToArr(d.rel);
      next.sess = csvToArr(d.sess);
      next.independent = d.independent === 'true';
      if (nextId !== id) delete state.store.opps[id];
      state.store.opps[nextId] = next;
      state.selected = nextId;
    }

    if (kind === 'session') {
      var sessions = state.store.sessions;
      var si;
      for (si = 0; si < sessions.length; si++) {
        if (sessions[si].id === id) {
          var s = sessions[si];
          if (isMentorOnly() && s.lead !== mentorId()) return;
          var newId = (d.id || id).trim();
          s.id = newId;
          s.title = d.title;
          s.day = d.day;
          s.date = d.date;
          s.when = d.when;
          s.pod = d.pod;
          s.lead = d.lead;
          s.cat = d.cat;
          s.seats = parseInt(d.seats, 10) || 0;
          s.taken = parseInt(d.taken, 10) || 0;
          s.stages = csvToArr(d.stages);
          s.what = d.what;
          s.bring = d.bring;
          s.qs = linesToArr(d.qs);
          state.selected = newId;
          break;
        }
      }
    }

    if (kind === 'author') {
      if (isMentorOnly() && id !== mentorId()) return;
      var key = (d.key || id).trim();
      var a = state.store.authors[id] || {};
      var na = NSG_CMS.clone(a);
      na.name = d.name;
      na.init = d.init;
      na.role = d.role;
      na.pos = d.pos;
      na.pod = d.pod || undefined;
      na.journey = d.journey || undefined;
      na.cats = csvToArr(d.cats);
      na.similar = csvToArr(d.similar);
      if (key !== id) {
        delete state.store.authors[id];
      }
      state.store.authors[key] = na;
      state.selected = key;
    }

    if (kind === 'journey') {
      if (isMentorOnly() && id !== mentorId()) return;
      var jk = (d.key || id).trim();
      var j = state.store.journeys[id] || {};
      var nj = NSG_CMS.clone(j);
      nj.age = parseInt(d.age, 10) || nj.age;
      nj.ongoing = d.ongoing === 'true';
      nj.field = d.field;
      nj.type = d.type;
      nj.place = d.place;
      nj.hook = d.hook;
      nj.now = d.now;
      nj.quote = d.quote;
      nj.blurb = d.blurb;
      nj.moments = parseMoments(d.moments);
      if (jk !== id) delete state.store.journeys[id];
      state.store.journeys[jk] = nj;
      state.selected = jk;
    }

    if (kind === 'feed') {
      var feed = state.store.feed;
      var fi;
      for (fi = 0; fi < feed.length; fi++) {
        if (feed[fi].id === id) {
          var f = feed[fi];
          var fid = (d.id || id).trim();
          f.id = fid;
          f.kind = d.kind;
          f.time = d.time;
          f.cat = d.cat;
          f.author = d.author || undefined;
          f.who = d.who || undefined;
          f.title = d.title || undefined;
          f.text = d.text || undefined;
          f.body = linesToArr(d.body);
          if (!f.body.length) delete f.body;
          f.opp = d.opp || undefined;
          f.sess = d.sess || undefined;
          f.journey = d.journey || undefined;
          f.anon = d.anon === 'true';
          if (d.replies != null) f.replies = parseReplies(d.replies);
          state.selected = fid;
          break;
        }
      }
    }

    if (kind === 'stage') {
      var stages = state.store.stages;
      var sti;
      for (sti = 0; sti < stages.length; sti++) {
        if (stages[sti].key === id) {
          var st = stages[sti];
          st.key = (d.key || id).trim();
          st.name = d.name;
          st.label = d.label;
          st.dec = st.dec || {};
          st.dec.t = d.dec_t;
          st.dec.why = d.dec_why;
          st.dec.due = d.dec_due || null;
          state.selected = st.key;
          break;
        }
      }
    }

    if (kind === 'topic') {
      var idx = parseInt(id, 10);
      state.store.cats[idx] = d.name;
    }

    if (kind === 'slot') {
      var slots = state.store.slots || [];
      var sli;
      for (sli = 0; sli < slots.length; sli++) {
        if (slots[sli].k === id) {
          var nk = (d.k || id).trim();
          slots[sli].k = nk;
          slots[sli].t = d.t;
          slots[sli].hint = d.hint;
          state.selected = nk;
          break;
        }
      }
    }

    if (kind === 'career') {
      var career = {
        id: (d.id || id).trim(),
        name: d.name,
        category: d.category,
        confidence: d.confidence,
        gatekeeperType: d.gatekeeperType,
        csecSubjects: csvToArr(d.csecSubjects),
        csecNote: d.csecNote,
        capeNote: d.capeNote,
        routes: parseRoutes(d.routes),
        does: d.does,
        sourceNote: d.sourceNote
      };
      var base = null;
      var cl = effectiveCareers();
      var ci;
      for (ci = 0; ci < cl.length; ci++) if (cl[ci].id === id) base = cl[ci];
      if (base) {
        var mergedC = NSG_CMS.clone(base);
        var ck;
        for (ck in career) {
          if (Object.prototype.hasOwnProperty.call(career, ck)) mergedC[ck] = career[ck];
        }
        career = mergedC;
      }
      if (id !== career.id && state.store.careerUpserts[id]) delete state.store.careerUpserts[id];
      state.store.careerUpserts[career.id] = career;
      state.selected = career.id;
    }

    if (kind === 'school') {
      var school = {
        id: (d.id || id).trim(),
        name: d.name,
        region: parseInt(d.region, 10),
        district: d.district,
        type: d.type,
        status: d.status,
        sixthForm: d.sixthForm,
        dormitory: d.dormitory,
        offersCVQ: d.offersCVQ,
        notes: d.notes
      };
      var sb = null;
      var sl = effectiveSchools();
      var si2;
      for (si2 = 0; si2 < sl.length; si2++) if (sl[si2].id === id) sb = sl[si2];
      if (sb) {
        var mergedS = NSG_CMS.clone(sb);
        var sk;
        for (sk in school) {
          if (Object.prototype.hasOwnProperty.call(school, sk)) mergedS[sk] = school[sk];
        }
        school = mergedS;
      }
      if (id !== school.id && state.store.schoolUpserts[id]) delete state.store.schoolUpserts[id];
      state.store.schoolUpserts[school.id] = school;
      state.selected = school.id;
    }

    saveStore();
    render();
  }

  function onDelete(kind, id) {
    if (!confirm('Delete this item? This cannot be undone on this browser until you reset CMS data.')) return;

    if (kind === 'opp') {
      delete state.store.opps[id];
    }
    if (kind === 'session') {
      state.store.sessions = state.store.sessions.filter(function (s) {
        return s.id !== id;
      });
    }
    if (kind === 'author') {
      delete state.store.authors[id];
    }
    if (kind === 'journey') {
      delete state.store.journeys[id];
    }
    if (kind === 'feed') {
      state.store.feed = state.store.feed.filter(function (f) {
        return f.id !== id;
      });
    }
    if (kind === 'topic') {
      state.store.cats.splice(parseInt(id, 10), 1);
    }
    if (kind === 'slot') {
      state.store.slots = (state.store.slots || []).filter(function (s) {
        return s.k !== id;
      });
    }
    if (kind === 'career') {
      delete state.store.careerUpserts[id];
      if (state.store.careerDeletes.indexOf(id) === -1) state.store.careerDeletes.push(id);
    }
    if (kind === 'school') {
      delete state.store.schoolUpserts[id];
      if (state.store.schoolDeletes.indexOf(id) === -1) state.store.schoolDeletes.push(id);
    }

    state.selected = null;
    saveStore();
    render();
  }

  function wireEditor() {
    var form = $('edit-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      onSave(form);
    });
    var del = form.querySelector('[data-delete]');
    if (del) {
      del.addEventListener('click', function () {
        onDelete(form.getAttribute('data-kind'), form.getAttribute('data-id'));
      });
    }
  }

  /* ---------- create new ---------- */

  function createNew() {
    var id;
    if (state.section === 'opps') {
      id = 'opp-' + Date.now();
      state.store.opps[id] = {
        id: id,
        name: 'New opportunity',
        cat: (state.store.cats && state.store.cats[0]) || 'Scholarships',
        stage: 'explore',
        stages: [0],
        one: '',
        what: [''],
        season: '',
        cost: '',
        who: '',
        entry: [],
        tips: [],
        truth: { b: '', p: '' },
        proof: { b: '', p: '' },
        leads: '',
        mentors: [],
        rel: [],
        sess: [],
        independent: true
      };
      state.selected = id;
    } else if (state.section === 'sessions') {
      id = 's-' + Date.now();
      state.store.sessions.unshift({
        id: id,
        title: 'New session',
        day: 'Sat',
        date: '1',
        when: '',
        pod: '',
        lead: mentorId() || 'raeka',
        seats: 20,
        taken: 0,
        stages: ['explore'],
        cat: (state.store.cats && state.store.cats[0]) || '',
        what: '',
        bring: '',
        qs: []
      });
      state.selected = id;
    } else if (state.section === 'authors' && !isMentorOnly()) {
      id = 'person-' + Date.now();
      state.store.authors[id] = {
        name: 'New mentor',
        init: 'NM',
        role: 'Mentor',
        pos: '',
        cats: []
      };
      state.selected = id;
    } else if (state.section === 'journeys' && !isMentorOnly()) {
      id = 'journey-' + Date.now();
      state.store.journeys[id] = {
        age: 12,
        ongoing: true,
        field: '',
        type: '',
        place: '',
        hook: '',
        now: '',
        quote: '',
        blurb: '',
        moments: []
      };
      state.selected = id;
    } else if (state.section === 'feed') {
      id = 'post-' + Date.now();
      var post = {
        id: id,
        kind: isMentorOnly() ? 'story' : 'question',
        time: 'just now',
        cat: (state.store.cats && state.store.cats[0]) || '',
        author: mentorId() || 'desk',
        title: 'New post',
        text: ''
      };
      if (post.kind === 'question') {
        post.anon = true;
        post.who = 'Student';
        post.replies = [];
        delete post.author;
      }
      state.store.feed.unshift(post);
      state.selected = id;
    } else if (state.section === 'topics') {
      state.store.cats.push('New topic');
      state.selected = String(state.store.cats.length - 1);
    } else if (state.section === 'slots') {
      id = 'slot-' + Date.now();
      state.store.slots = state.store.slots || [];
      state.store.slots.push({ k: id, t: 'New slot', hint: '' });
      state.selected = id;
    } else if (state.section === 'careers') {
      id = 'career-' + Date.now();
      state.store.careerUpserts[id] = {
        id: id,
        name: 'New career',
        category: 'business',
        confidence: 'draft',
        gatekeeperType: 'csec-count',
        csecSubjects: [],
        csecNote: '',
        capeNote: '',
        routes: [],
        does: '',
        sourceNote: 'Admin center'
      };
      state.selected = id;
    } else if (state.section === 'schools') {
      id = 'school-' + Date.now();
      state.store.schoolUpserts[id] = {
        id: id,
        name: 'New school',
        region: 4,
        district: '',
        type: 'secondary',
        status: 'open',
        sixthForm: 'unknown',
        dormitory: 'unknown',
        offersCVQ: 'unknown',
        notes: ''
      };
      state.selected = id;
    } else {
      toast('Create is not available in this section.');
      return;
    }
    saveStore();
    render();
  }

  /* ---------- overview + chrome ---------- */

  function renderOverview() {
    var opps = Object.keys(state.store.opps || {}).length;
    var sessions = (state.store.sessions || []).length;
    var authors = Object.keys(state.store.authors || {}).length;
    var journeys = Object.keys(state.store.journeys || {}).length;
    var feed = (state.store.feed || []).length;
    var careers = effectiveCareers().length;
    var schools = effectiveSchools().length;
    var questions = (state.store.feed || []).filter(function (f) {
      return f.kind === 'question';
    }).length;

    var mentorBits = '';
    if (isMentorOnly()) {
      var mid = mentorId();
      var mySessions = (state.store.sessions || []).filter(function (s) {
        return s.lead === mid;
      }).length;
      mentorBits =
        '<div class="card"><h3>Your mentor desk</h3><p>Update your profile and journey, manage sessions you lead, and answer student questions.</p><ul>' +
        '<li>Your sessions<span>' +
        mySessions +
        '</span></li>' +
        '<li>Open questions<span>' +
        questions +
        '</span></li>' +
        '</ul></div>';
    }

    return (
      '<div class="stats">' +
      '<div class="stat"><b>' +
      opps +
      '</b><span>Opportunities</span></div>' +
      '<div class="stat"><b>' +
      sessions +
      '</b><span>Sessions</span></div>' +
      '<div class="stat"><b>' +
      authors +
      '</b><span>People</span></div>' +
      '<div class="stat"><b>' +
      feed +
      '</b><span>Feed posts</span></div>' +
      '<div class="stat"><b>' +
      careers +
      '</b><span>Careers</span></div>' +
      '<div class="stat"><b>' +
      schools +
      '</b><span>Schools</span></div>' +
      '</div>' +
      '<div class="dash-grid">' +
      '<div class="card"><h3>What this center manages</h3><p>Everything students see in the feed, pathway, and happening views, plus the careers and schools libraries.</p><ul>' +
      '<li>Opportunities &amp; sessions<span>Happening</span></li>' +
      '<li>Mentors, contributors, journeys<span>Profiles</span></li>' +
      '<li>Feed questions &amp; stories<span>What\'s Steppin\'</span></li>' +
      '<li>Stages &amp; topics<span>Pathway</span></li>' +
      '<li>Careers &amp; schools<span>Libraries</span></li>' +
      '</ul></div>' +
      '<div class="card"><h3>Wiring status</h3><p>Edits save in this browser and apply to <code>app.html</code> when students open it here.</p><ul>' +
      '<li>CMS dirty<span class="badge ' +
      (state.store.dirty ? 'warn' : '') +
      '">' +
      (state.store.dirty ? 'Has local edits' : 'Seed data') +
      '</span></li>' +
      '<li>Journeys mapped<span>' +
      journeys +
      '</span></li>' +
      '<li>Open questions<span>' +
      questions +
      '</span></li>' +
      '</ul>' +
      '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">' +
      '<a class="btn ghost sm" href="app.html" target="_blank" rel="noopener">Open student app</a>' +
      '<button type="button" class="btn danger sm" id="reset-cms">Reset to seed</button>' +
      '</div></div>' +
      mentorBits +
      '</div>'
    );
  }

  function sectionMeta() {
    var map = {
      overview: {
        title: isMentorOnly() ? 'Mentor desk' : 'Admin center',
        sub: isMentorOnly()
          ? 'Manage your profile, sessions, and student questions.'
          : 'Search and edit every surface students see on the site.'
      },
      opps: { title: 'Opportunities', sub: 'Programmes, awards, clinics, and openings shown in Happening and the feed.' },
      sessions: { title: 'Sessions', sub: 'Live pods and clinics. Mentors only see sessions they lead.' },
      authors: { title: 'Mentors & contributors', sub: 'People cards, pods, and related profiles.' },
      journeys: { title: 'Journeys', sub: 'Pathway story arcs linked to mentors and contributors.' },
      feed: { title: 'Feed posts', sub: 'Questions, stories, opportunity cards, and session cards in What\'s Steppin\'.' },
      stages: { title: 'Pathway stages', sub: 'Form milestones and the next decision copy on My Pathway.' },
      topics: { title: 'Topics', sub: 'Browse chips and category labels across the app.' },
      slots: { title: 'Pathway slots', sub: 'Optional extras students can add during pathway setup.' },
      careers: { title: 'Careers library', sub: 'Full career pathways dataset (search and patch).' },
      schools: { title: 'Schools library', sub: 'Secondary school directory used by setup and filters.' }
    };
    return map[state.section] || { title: 'Admin', sub: '' };
  }

  function filterOptions() {
    if (state.section === 'feed') {
      return [
        { value: 'question', label: 'question' },
        { value: 'story', label: 'story' },
        { value: 'opportunity', label: 'opportunity' },
        { value: 'session', label: 'session' },
        { value: 'journey', label: 'journey' }
      ];
    }
    if (state.section === 'opps' || state.section === 'sessions' || state.section === 'journeys') {
      return (state.store.cats || []).map(function (c) {
        return { value: c, label: c };
      });
    }
    if (state.section === 'authors') {
      return [
        { value: 'Mentor', label: 'Mentor' },
        { value: 'Contributor', label: 'Contributor' },
        { value: 'Student', label: 'Student' },
        { value: 'Next Step', label: 'Next Step' }
      ];
    }
    if (state.section === 'careers') {
      var set = {};
      var list = effectiveCareers();
      var i;
      for (i = 0; i < list.length; i++) if (list[i].category) set[list[i].category] = true;
      return Object.keys(set)
        .sort()
        .map(function (c) {
          return { value: c, label: c };
        });
    }
    if (state.section === 'schools') {
      var out = [];
      var r;
      for (r = 1; r <= 10; r++) out.push({ value: String(r), label: 'Region ' + r });
      return out;
    }
    return [];
  }

  function canCreate() {
    if (state.section === 'overview' || state.section === 'stages') return false;
    if (isMentorOnly() && (state.section === 'authors' || state.section === 'journeys')) return false;
    if (isMentorOnly() && (state.section === 'opps' || state.section === 'topics' || state.section === 'slots' || state.section === 'careers' || state.section === 'schools')) return false;
    return state.section !== 'overview';
  }

  function renderNav() {
    var el = $('side-nav');
    if (!el) return;
    var html = '';
    var lastGroup = '';
    var i;
    for (i = 0; i < SECTIONS.length; i++) {
      var s = SECTIONS[i];
      if (s.roles.indexOf(state.user.role) === -1) continue;
      if (s.group !== lastGroup) {
        html += '<div class="nav-group"><div class="nav-label">' + esc(s.group) + '</div>';
        lastGroup = s.group;
      }
      html +=
        '<button type="button" class="nav-btn' +
        (state.section === s.id ? ' on' : '') +
        '" data-section="' +
        esc(s.id) +
        '">' +
        esc(s.label) +
        '</button>';
      var next = SECTIONS[i + 1];
      var close =
        !next ||
        next.group !== s.group ||
        next.roles.indexOf(state.user.role) === -1;
      /* close group when next is different group among visible — simplified: close after each for cleanliness */
    }
    /* Rebuild with proper group closing */
    html = '';
    lastGroup = '';
    var open = false;
    for (i = 0; i < SECTIONS.length; i++) {
      s = SECTIONS[i];
      if (s.roles.indexOf(state.user.role) === -1) continue;
      if (s.group !== lastGroup) {
        if (open) html += '</div>';
        html += '<div class="nav-group"><div class="nav-label">' + esc(s.group) + '</div>';
        lastGroup = s.group;
        open = true;
      }
      html +=
        '<button type="button" class="nav-btn' +
        (state.section === s.id ? ' on' : '') +
        '" data-section="' +
        esc(s.id) +
        '">' +
        esc(s.label) +
        '</button>';
    }
    if (open) html += '</div>';
    el.innerHTML = html;
  }

  function renderList() {
    var wrap = $('list-panel');
    if (!wrap) return;
    if (state.section === 'overview') {
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = '';
    var items = currentList();
    var body = '';
    if (!items.length) {
      body = '<div class="empty">No matches. Try another search.</div>';
    } else {
      var i;
      for (i = 0; i < items.length; i++) {
        var it = items[i];
        var tags = '';
        var t;
        for (t = 0; t < (it.tags || []).length; t++) {
          if (!it.tags[t]) continue;
          tags += '<span class="tag">' + esc(it.tags[t]) + '</span>';
        }
        body +=
          '<button type="button" class="row' +
          (state.selected === it.id ? ' on' : '') +
          '" data-select="' +
          esc(it.id) +
          '"><span class="t">' +
          esc(it.title) +
          '</span><span class="m">' +
          esc(it.meta) +
          '</span>' +
          (tags ? '<span class="tags">' + tags + '</span>' : '') +
          '</button>';
      }
    }
    $('list-count').textContent = items.length + ' items';
    $('list-body').innerHTML = body;
  }

  function renderToolbar() {
    var bar = $('toolbar');
    if (!bar) return;
    if (state.section === 'overview') {
      bar.style.display = 'none';
      return;
    }
    bar.style.display = 'flex';
    var opts = filterOptions();
    var filterHtml = '';
    if (opts.length) {
      filterHtml = '<div class="filters"><select id="filter-select"><option value="">All</option>';
      var i;
      for (i = 0; i < opts.length; i++) {
        filterHtml +=
          '<option value="' +
          esc(opts[i].value) +
          '"' +
          (state.filter === opts[i].value ? ' selected' : '') +
          '>' +
          esc(opts[i].label) +
          '</option>';
      }
      filterHtml += '</select></div>';
    }
    /* keep search input value */
    var search = $('search-input');
    var q = search ? search.value : state.query;
    bar.innerHTML =
      '<div class="search"><input id="search-input" type="search" placeholder="Search this section..." value="' +
      esc(q) +
      '"/></div>' +
      filterHtml +
      (canCreate()
        ? '<button type="button" class="btn gold sm" id="btn-new">+ New</button>'
        : '');
  }

  function render() {
    if (!state.user) return;
    var meta = sectionMeta();
    $('page-title').textContent = meta.title;
    $('page-sub').textContent = meta.sub;
    $('role-pill').textContent = state.user.role;
    $('who-name').textContent = state.user.name;
    $('who-email').textContent = state.user.email;

    renderNav();
    renderToolbar();

    var content = $('content');
    var panel = $('panel');
    if (state.section === 'overview') {
      panel.style.display = 'none';
      content.style.display = '';
      content.innerHTML = renderOverview();
      var reset = $('reset-cms');
      if (reset) {
        reset.addEventListener('click', function () {
          if (!confirm('Reset all admin edits on this browser back to seed data?')) return;
          state.store = NSG_CMS.reset();
          state.selected = null;
          toast('CMS reset to seed.');
          render();
        });
      }
    } else {
      content.style.display = 'none';
      panel.style.display = 'grid';
      renderList();
      renderEditor();
    }
  }

  function showAdmin() {
    $('gate').style.display = 'none';
    $('admin').classList.add('on');
    state.store = NSG_CMS.loadWorking();
    if (!can(state.section)) state.section = 'overview';
    render();
  }

  function showGate(err) {
    $('gate').style.display = '';
    $('admin').classList.remove('on');
    var errEl = $('gate-err');
    if (err) {
      errEl.textContent = err;
      errEl.classList.add('show');
    } else {
      errEl.classList.remove('show');
    }
  }

  function trySession() {
    var u = NSG_CMS.currentUser();
    if (!u) return false;
    if (u.role !== 'admin' && u.role !== 'mentor') {
      NSG_CMS.logout();
      return false;
    }
    state.user = u;
    showAdmin();
    return true;
  }

  function wireChrome() {
    document.body.addEventListener('click', function (e) {
      var t = e.target.closest('[data-section]');
      if (t) {
        var sec = t.getAttribute('data-section');
        if (!can(sec)) return;
        state.section = sec;
        state.selected = null;
        state.query = '';
        state.filter = '';
        render();
        return;
      }
      t = e.target.closest('[data-select]');
      if (t) {
        state.selected = t.getAttribute('data-select');
        renderList();
        renderEditor();
        return;
      }
      if (e.target.id === 'btn-new') {
        createNew();
        return;
      }
      if (e.target.id === 'btn-logout') {
        NSG_CMS.logout();
        state.user = null;
        showGate();
      }
    });

    document.body.addEventListener('input', function (e) {
      if (e.target.id === 'search-input') {
        state.query = e.target.value;
        renderList();
      }
    });

    document.body.addEventListener('change', function (e) {
      if (e.target.id === 'filter-select') {
        state.filter = e.target.value;
        renderList();
      }
    });

    $('gate-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('gate-email').value;
      var pass = $('gate-pass').value;
      var session = NSG_CMS.login(email, pass);
      if (!session) {
        showGate('Those credentials were not recognised.');
        return;
      }
      if (session.role === 'student') {
        NSG_CMS.logout();
        window.location.href = 'app.html';
        return;
      }
      state.user = session;
      showAdmin();
    });
  }

  function boot() {
    wireChrome();
    var params = new URLSearchParams(window.location.search);
    var roleHint = params.get('role');
    if (!trySession()) {
      showGate();
      if (roleHint === 'mentor') {
        $('gate-email').value = 'mentor@nextstep.gy';
      } else if (roleHint === 'admin') {
        $('gate-email').value = 'admin@nextstep.gy';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
