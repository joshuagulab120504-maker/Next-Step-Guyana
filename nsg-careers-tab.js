/* Careers tab  -  Finding My North Star. Depends on NSG_NORTH and host stage/esc/toast. */
(function (global) {
  'use strict';

  var N = global.NSG_NORTH;
  if (!N) throw new Error('NSG_NORTH missing  -  load nsg-north-star.js first');

  var STORE = 'nsg_north_star';
  var screen = 'tab'; /* tab | deck | detail */
  var deckKey = null;
  var detailId = null;
  var tabScroll = 0;
  var deckQueue = [];
  var deckUndo = null;
  var drag = null;
  var addPanelOpen = false;

  var CHECK_TO_Q8 = {
    science: 'sci', engineering: 'eng', technology: 'tech', trade: 'trade',
    agriculture: 'agri', business: 'biz', law: 'law', civic: 'gov',
    publicsvc: 'gov', creative: 'creative', sports: 'sport', education: 'edu'
  };

  function q8ByKey(k) {
    for (var i = 0; i < N.Q8.length; i++) if (N.Q8[i].key === k) return N.Q8[i];
    return null;
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORE);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function defaultState() {
    var goals = readGoalsFromSelfcheck();
    return {
      goals: goals,
      opened: [],
      seen: [],
      kept: [],
      passed: [],
      areasOpened: []
    };
  }

  function readGoalsFromSelfcheck() {
    try {
      var sc = JSON.parse(localStorage.getItem('nsg_selfcheck') || 'null');
      var cur = (sc && (sc.curious || (sc.answers && sc.answers.interests))) || [];
      if (!Array.isArray(cur)) return [];
      return cur.map(function (k) { return CHECK_TO_Q8[k] || k; }).filter(function (k) { return !!q8ByKey(k); });
    } catch (e) { return []; }
  }

  function state() {
    var s = loadState();
    if (!s) {
      s = defaultState();
      saveState(s);
    }
    /* Do not invent goals. Empty is honest. */
    if (!s.goals) s.goals = [];
    var fromCheck = readGoalsFromSelfcheck();
    if (!s.goals.length && fromCheck.length) s.goals = fromCheck;
    s.opened = uniq(s.opened || []);
    s.seen = uniq(s.seen || []);
    s.kept = uniq(s.kept || []);
    s.passed = uniq(s.passed || []);
    s.areasOpened = uniq(s.areasOpened || []);
    return s;
  }

  function saveState(s) {
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) {}
  }

  function uniq(a) {
    var o = {}, out = [];
    for (var i = 0; i < a.length; i++) if (!o[a[i]]) { o[a[i]] = 1; out.push(a[i]); }
    return out;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function careers() { return N.CAREERS; }
  function careerById(id) {
    for (var i = 0; i < N.CAREERS.length; i++) if (N.CAREERS[i].id === id) return N.CAREERS[i];
    return null;
  }

  function shortSummary(c) {
    if (!c) return '';
    var s = c.what || '';
    if (!s && c.first) {
      s = String(c.first).split(/[.;]/)[0].trim();
      if (s && !/\.$/.test(s)) s += '.';
    }
    if (!s && c.post) {
      s = String(c.post).split(/[.;]/)[0].trim();
      if (s && !/\.$/.test(s)) s += '.';
    }
    if (!s) s = 'Read the route for this job.';
    var words = s.split(/\s+/);
    if (words.length > 14) s = words.slice(0, 14).join(' ').replace(/[.,;:]+$/, '') + '.';
    return s;
  }
  function careersForKey(key) {
    var list = N.CAREERS.filter(function (c) { return (c.buckets || c.keys).indexOf(key) !== -1; });
    if (global.NSG_ENGINE && NSG_ENGINE.orderCareers) {
      var ordered = NSG_ENGINE.orderCareers(N.CAREERS, NSG_ENGINE.rebuildVector());
      var ids = {};
      list.forEach(function (c) { ids[c.id] = 1; });
      return ordered.filter(function (c) { return ids[c.id]; });
    }
    return list;
  }

  function routeStage(hostStage) {
    var s = hostStage || 1;
    if (s <= 1) return 1;
    if (s === 2) return 2;
    if (s === 3) return 3;
    if (s === 4) return 4;
    if (s === 5) return 5;
    return 6;
  }

  function stageLabel(hostStage) {
    var s = hostStage || 1;
    if (s <= 5) return 'Form ' + s;
    return 'After CSEC';
  }

  function routeNodes(career, hostStage) {
    var S = routeStage(hostStage);
    var future = (career.route || []).filter(function (step) { return step[0] >= S; });
    var nodes = [{ at: S, label: stageLabel(hostStage), current: true }].concat(
      future.map(function (step) { return { at: step[0], label: step[1], current: false }; })
    );
    return nodes;
  }

  function checkpointIndex(hostStage) {
    var s = hostStage || 1;
    if (s <= 3) return 0;
    if (s <= 5) return 1;
    return 2;
  }

  function xpCount(st) { return (st.opened || []).length; }

  function goalsDone(st) {
    var n = 0;
    st.goals.forEach(function (k) {
      var list = careersForKey(k);
      if (!list.length) return;
      var allSeen = list.every(function (c) { return st.seen.indexOf(c.id) !== -1; });
      if (allSeen) n++;
    });
    return n;
  }

  function goalMeta(st, key) {
    var list = careersForKey(key);
    var total = list.length;
    var seenN = list.filter(function (c) { return st.seen.indexOf(c.id) !== -1; }).length;
    var keptN = list.filter(function (c) { return st.kept.indexOf(c.id) !== -1; }).length;
    var rank = st.goals.indexOf(key);
    var rankLabel = rank === 0 ? 'your first choice' : (rank === 1 ? 'your second choice' : (rank === 2 ? 'your third choice' : 'on your list'));
    if (seenN === 0) return total + ' careers · ' + rankLabel;
    if (seenN >= total) return 'All ' + total + ' seen · you kept ' + keptN;
    return seenN + ' of ' + total + ' seen';
  }

  function goalBtn(st, key) {
    var list = careersForKey(key);
    var seenN = list.filter(function (c) { return st.seen.indexOf(c.id) !== -1; }).length;
    if (seenN === 0) return 'Start';
    if (seenN >= list.length) return 'Look again';
    return 'Carry on';
  }

  function nextUnfinished(st) {
    for (var i = 0; i < st.goals.length; i++) {
      var list = careersForKey(st.goals[i]);
      var seenN = list.filter(function (c) { return st.seen.indexOf(c.id) !== -1; }).length;
      if (seenN < list.length) return st.goals[i];
    }
    return st.goals[0] || null;
  }

  function markSeen(st, id) {
    if (st.seen.indexOf(id) === -1) st.seen.push(id);
  }

  function markOpened(st, id) {
    if (st.opened.indexOf(id) === -1) st.opened.push(id);
  }

  function mentionsBond(c) {
    var blob = [c.caveat, c.gate, c.post, c.first, c.f13, c.f45, c.subjects, JSON.stringify(c.flags || [])].join(' ');
    return /\b(bond|bonded|contractual obligation|service obligation)\b/i.test(blob);
  }

  function guyanaLocal(c) {
    var blob = [c.post, c.route && c.route.map(function (r) { return r[1]; }).join(' '), c.gate, c.f45].join(' ');
    return /\b(UG|CPCE|BIT|GTI|Ministry)\b/.test(blob || '');
  }

  function subjectHits(keptCareers) {
    var counts = {};
    keptCareers.forEach(function (c) {
      var s = (c.subjects || '').toLowerCase();
      ['mathematics', 'english', 'biology', 'chemistry', 'physics', 'geography', 'information technology', 'principles of accounts', 'principles of business'].forEach(function (sub) {
        if (s.indexOf(sub) !== -1) counts[sub] = (counts[sub] || 0) + 1;
      });
    });
    var best = null, n = 0;
    Object.keys(counts).forEach(function (k) {
      if (counts[k] > n) { n = counts[k]; best = k; }
    });
    return { subject: best, n: n, total: keptCareers.length };
  }

  function mentorFor(st, hostStage) {
    var areas = {};
    st.kept.forEach(function (id) {
      var c = careerById(id);
      if (!c) return;
      c.keys.forEach(function (k) { areas[k] = 1; });
    });
    var pool = [
      { keys: ['eng', 'tech'], name: 'Dave', at: 'He spent Form 1 taking apart radios at home. Nobody called it engineering then.', now: 'Now a STEM founder' },
      { keys: ['sci'], name: 'Riley', at: 'She spent Form 4 checking what her target programmes actually asked for.', now: 'Now at Toronto' },
      { keys: ['law', 'gov'], name: 'Reginald', at: 'He chose Arts against advice. It turned out right for public service.', now: 'Youth Parliament mentor' },
      { keys: ['sport'], name: 'Aniyah', at: 'In Form 1 she signed up for everything going. Most of it did not stick, and that was fine.', now: 'Now at Stanford' },
      { keys: ['creative'], name: 'Alisande', at: 'Exam year was when she stopped comparing herself to the class.', now: 'Now at Northwestern' },
      { keys: ['edu', 'biz', 'agri', 'trade'], name: 'Joshua', at: 'He joined debate because a friend signed up. He was not top of the class then.', now: 'Now at Stanford' }
    ];
    for (var i = 0; i < pool.length; i++) {
      for (var j = 0; j < pool[i].keys.length; j++) {
        if (areas[pool[i].keys[j]]) return pool[i];
      }
    }
    return pool[0];
  }

  /* ---------- screens ---------- */

  function renderTab(host) {
    var st = state();
    var total = careers().length;
    var xp = xpCount(st);
    var done = goalsDone(st);
    var goalTotal = st.goals.length;
    var next = nextUnfinished(st);
    var h = '';

    h += '<div class="ns-col">';
    h += '<span class="kicker">Careers</span>';
    h += '<h1>Finding My North Star</h1>';

    h += '<section class="ns-xp card" aria-label="XP tracker">';
    h += '<div class="ns-xp-top"><div class="ns-xp-num"><b>' + xp + '</b><span>XP</span></div>';
    h += '<span class="ns-pill">' + done + ' of ' + goalTotal + ' goals done</span></div>';
    h += '<div class="ns-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + xp + '"><i style="width:' + Math.min(100, (xp / total) * 100) + '%"></i></div>';
    h += '<p class="ns-xp-line">You get 1 XP each time you open a career page and read it. That is ' + xp + ' of the ' + total + ' careers here.</p>';
    h += '<div class="ns-counters">';
    h += '<div><b>' + st.seen.length + '</b><span>Seen</span></div>';
    h += '<div><b>' + st.kept.length + '</b><span>Interested in</span></div>';
    h += '<div><b>' + st.areasOpened.length + '</b><span>Areas</span></div>';
    h += '</div></section>';

    h += '<div class="section-label"><span>What you are interested in</span></div>';
    if (!st.goals.length) {
      h += '<div class="notice soft"><p style="margin:0 0 10px">Take the self-check and we will set up your goals from what you ranked. Or pick any areas below - nothing is invented for you.</p>';
      h += '<p style="margin:0 0 12px"><a class="btn small" href="check.html">Take the self-check</a></p></div>';
      h += '<div class="ns-chips">';
      N.Q8.forEach(function (q) {
        h += '<button type="button" class="ns-chip tap" data-ns-add="' + esc(q.key) + '"><i style="background:' + esc(q.hue) + '" aria-hidden="true"></i>' + esc(q.label) + '</button>';
      });
      h += '</div>';
    } else {
    h += '<div class="ns-chips" role="list">';
    st.goals.forEach(function (k) {
      var q = q8ByKey(k);
      var n = careersForKey(k).length;
      h += '<span class="ns-chip" role="listitem"><i style="background:' + esc(q.hue) + '" aria-hidden="true"></i>' + esc(q.label) + ' <em>' + n + ' careers</em></span>';
    });
    h += '</div>';
    var remain = N.Q8.filter(function (q) { return st.goals.indexOf(q.key) === -1; });
    if (remain.length) {
      if (!addPanelOpen) {
        h += '<button type="button" class="ns-add-btn" data-ns-add-open aria-expanded="false">';
        h += '<span class="ns-add-plus" aria-hidden="true">+</span>Add another';
        h += '</button>';
      } else {
        h += '<div class="ns-add-panel" id="nsAddPanel">';
        h += '<div class="ns-add-panel-head">';
        h += '<p>Add another area and it becomes a new goal.</p>';
        h += '<button type="button" class="ns-add-close" data-ns-add-close aria-label="Close">Close</button>';
        h += '</div><div class="ns-chips">';
        remain.forEach(function (q) {
          h += '<button type="button" class="ns-chip tap" data-ns-add="' + esc(q.key) + '"><i style="background:' + esc(q.hue) + '" aria-hidden="true"></i>' + esc(q.label) + '</button>';
        });
        h += '</div></div>';
      }
    }
    }

    h += '<div class="section-label"><span>Your goals</span></div><div class="ns-goals">';
    if (!st.goals.length) {
      h += '<p class="hint">No goals yet. Rank interests in the self-check, or add an area above.</p>';
    }
    st.goals.forEach(function (k, i) {
      var q = q8ByKey(k);
      var gold = k === next ? ' gold' : '';
      h += '<article class="ns-goal card">';
      h += '<span class="ns-badge' + gold + '" aria-label="Goal ' + (i + 1) + (gold ? ', next unfinished' : '') + '">' + (i + 1) + '</span>';
      h += '<div class="ns-goal-body"><h3>Explore ' + esc(q.label) + '</h3>';
      h += '<p class="hint" style="margin:4px 0 0">' + esc(goalMeta(st, k)) + '</p></div>';
      h += '<button type="button" class="btn small" data-ns-deck="' + esc(k) + '">' + goalBtn(st, k) + '</button>';
      h += '</article>';
    });
    h += '</div>';

    var anyKept = false;
    st.goals.forEach(function (k) {
      var kept = careersForKey(k).filter(function (c) { return st.kept.indexOf(c.id) !== -1; });
      if (!kept.length) return;
      anyKept = true;
    });
    if (anyKept) {
      h += '<div class="section-label"><span>Your list</span></div>';
      st.goals.forEach(function (k) {
        var q = q8ByKey(k);
        var kept = careersForKey(k).filter(function (c) { return st.kept.indexOf(c.id) !== -1; });
        if (!kept.length) return;
        h += '<div class="ns-rail-head"><i style="background:' + esc(q.hue) + '" aria-hidden="true"></i><strong>' + esc(q.label) + '</strong><span>' + kept.length + ' careers</span></div>';
        h += '<div class="ns-rail" tabindex="0">';
        kept.forEach(function (c) {
          h += '<button type="button" class="ns-rail-card" data-ns-detail="' + esc(c.id) + '"><span class="c">' + esc(q.label) + '</span><h4>' + esc(c.t) + '</h4><p>' + esc(shortSummary(c)) + '</p></button>';
        });
        h += '</div>';
      });
    }

    h += renderNavi(st, host);
    if (N.IL_FLAG && N.IL_FLAG.message) {
      h += '<p class="hint" style="margin-top:18px">' + esc(N.IL_FLAG.message) + '</p>';
    }
    h += '</div>';
    return h;
  }

  function renderNavi(st, host) {
    var keptC = st.kept.map(careerById).filter(Boolean);
    var h = '<section class="ns-navi card" aria-label="Ask Navi">';
    h += '<div class="section-label" style="margin-top:0"><span>Ask Navi</span></div>';

    if (keptC.length < 2) {
      h += '<p class="ns-navi-lead">Keep at least two careers and Navi can show a shared-subject pattern. Right now you have ' + keptC.length + ' on your list.</p>';
    } else {
      var hit = subjectHits(keptC);
      if (hit.subject) {
        var label = hit.subject.replace(/\b\w/g, function (ch) { return ch.toUpperCase(); });
        h += '<p class="ns-navi-lead">' + hit.n + ' of the ' + hit.total + ' careers you kept list ' + esc(label) + ' as a helpful subject.</p>';
      } else {
        h += '<p class="ns-navi-lead">Your kept careers do not share one clear subject in the guide text yet.</p>';
      }
    }

    var areaSet = {};
    keptC.forEach(function (c) { c.keys.forEach(function (k) { areaSet[k] = 1; }); });
    var areaKeys = Object.keys(areaSet);
    if (keptC.length && areaKeys.length === 1) {
      var q = q8ByKey(areaKeys[0]);
      h += '<p class="hint">Everything you kept sits in ' + esc(q.label) + '. That is a real answer. Adding one more area costs nothing.</p>';
    }

    if (keptC.length) {
      var m = mentorFor(st, host.stage);
      h += '<div class="ns-mentor"><p><strong>' + esc(m.name) + '</strong> - at your stage: ' + esc(m.at) + '</p>';
      h += '<cite class="foot">' + esc(m.now) + '</cite></div>';
    }

    h += '<div class="ns-faq">';
    h += faqBlock('maths', 'Do I need Mathematics for all of these?', naviMaths(keptC));
    h += faqBlock('gy', 'Which of these can I do in Guyana?', naviGy(keptC));
    h += faqBlock('bond', 'Do any of these tie me into a contract?', naviBond(keptC));
    h += '</div></section>';
    return h;
  }

  function faqBlock(id, q, a) {
    return '<details class="ns-faq-item"><summary>' + esc(q) + '</summary><div class="ns-faq-a">' + a + '</div></details>';
  }

  function naviMaths(keptC) {
    if (keptC.length < 1) return '<p>Keep a career first, then we can count.</p>';
    var n = keptC.filter(function (c) { return /mathematics/i.test(c.subjects || ''); }).length;
    return '<p>' + n + ' of ' + keptC.length + ' list Mathematics as helpful.</p><p>Helpful is not the same as required, and the institution sets the real rule for the year you apply.</p>';
  }

  function naviGy(keptC) {
    if (!keptC.length) return '<p>Keep a career first, then we can count.</p>';
    var hit = keptC.filter(guyanaLocal);
    return '<p>' + hit.length + ' of ' + keptC.length + ' name a route at UG, CPCE, BIT, GTI or a Ministry programme.</p>';
  }

  function naviBond(keptC) {
    if (!keptC.length) return '<p>Keep a career first, then we can check.</p>';
    var hit = keptC.filter(mentionsBond);
    if (!hit.length) {
      return '<p>None of the careers on your list mention a bond or contractual obligation in the guide text.</p><p>The exact terms come with the intake offer, so ask before you accept.</p>';
    }
    var names = hit.map(function (c) { return esc(c.t); }).join('; ');
    return '<p>These mention a bond or contractual obligation: ' + names + '.</p><p>The exact terms come with the intake offer, so ask before you accept.</p>';
  }

  function renderDeck(host) {
    var st = state();
    var q = q8ByKey(deckKey);
    var list = careersForKey(deckKey);
    var remaining = deckQueue.slice();
    var seenN = list.filter(function (c) { return st.seen.indexOf(c.id) !== -1; }).length;
    var keptN = list.filter(function (c) { return st.kept.indexOf(c.id) !== -1; }).length;
    var passedN = list.filter(function (c) { return st.passed.indexOf(c.id) !== -1; }).length;
    var h = '<div class="ns-col ns-deck-wrap">';
    h += '<button type="button" class="ns-back" data-ns-back-tab>← Back to Careers</button>';
    h += '<div class="ns-deck-meta"><span>' + Math.min(seenN, list.length) + ' of ' + list.length + ' seen</span><span>' + keptN + ' kept so far</span></div>';
    h += '<div class="ns-bar ns-bar-cap" role="progressbar" aria-valuenow="' + Math.min(seenN, list.length) + '" aria-valuemin="0" aria-valuemax="' + list.length + '"><i style="width:' + (list.length ? Math.min(100, (seenN / list.length) * 100) : 0) + '%"></i></div>';

    if (!remaining.length) {
      h += '<div class="ns-done card">';
      h += '<h2>You have seen every job in ' + esc(q.label) + '</h2>';
      if (!keptN) {
        h += '<p>Keeping none is a real answer. It tells us this area is not for you.</p>';
      } else {
        h += '<p>You kept ' + keptN + ' of ' + list.length + ' careers in this area.</p>';
      }
      h += '<button type="button" class="btn" data-ns-back-tab>Back to Careers</button>';
      h += '</div>';
    } else {
      var c = remaining[0];
      h += deckCardHtml(c, q, host);
      h += '<div class="ns-actions">';
      h += '<div class="ns-act"><button type="button" class="ns-round no" data-ns-pass aria-label="Not for me">✕</button><span>Not for me</span></div>';
      h += '<div class="ns-act"><button type="button" class="ns-round yes" data-ns-keep aria-label="Keep">✓</button><span>Keep</span></div>';
      h += '</div>';
      h += '<button type="button" class="link-btn ns-undo" data-ns-undo' + (deckUndo ? '' : ' disabled') + '>Undo last</button>';
    }

    h += '<div class="ns-sticky">';
    h += '<p>' + keptN + ' kept / ' + passedN + ' passed on, still saved</p>';
    h += '<button type="button" class="btn ghost small" data-ns-back-tab>Back to Careers</button>';
    h += '</div></div>';
    return h;
  }

  function deckCardHtml(c, q, host) {
    var nodes = routeNodes(c, host.stage);
    var hue = q.hue;
    var h = '<article class="ns-deck-card" id="nsDeckCard" style="--area-hue:' + esc(hue) + '" tabindex="0" aria-label="' + esc(c.t) + '">';
    h += '<div class="ns-stamp keep" aria-hidden="true">Keep</div>';
    h += '<div class="ns-stamp pass" aria-hidden="true">Not for me</div>';
    h += '<span class="ns-area">' + esc(q.label) + '</span>';
    h += '<span class="ns-checked">✓ Checked ' + esc(N.VERIFIED) + '</span>';
    (c.flags || []).forEach(function (f) {
      h += '<span class="ns-flag ' + (f[0] === 'warn' ? 'warn' : 'ok') + '">' + esc(f[1]) + '</span>';
    });
    h += '<h2>' + esc(c.t) + '</h2>';
    h += '<p class="ns-what">' + esc(shortSummary(c)) + '</p>';
    h += '<div class="ns-route" aria-label="Route from your stage">';
    nodes.forEach(function (n, i) {
      if (i) h += '<span class="ns-route-line" aria-hidden="true"></span>';
      h += '<span class="ns-route-node' + (n.current ? ' now' : '') + '"><b>' + (i + 1) + '</b><em>' + esc(n.label) + '</em></span>';
    });
    h += '</div>';
    h += '<button type="button" class="btn ghost small ns-more" data-ns-detail="' + esc(c.id) + '">Explore more</button>';
    h += '</article>';
    return h;
  }

  function renderDetail(host) {
    var st = state();
    var c = careerById(detailId);
    if (!c) return '<p class="lede">Career not found.</p><button type="button" class="btn" data-ns-back-tab>Back</button>';
    var key = c.keys.filter(function (k) { return st.goals.indexOf(k) !== -1; })[0] || c.keys[0];
    var q = q8ByKey(key);
    var sc = N.STATUS_COPY[c.status] || N.STATUS_COPY.variable;
    var cp = checkpointIndex(host.stage);
    var onList = st.kept.indexOf(c.id) !== -1;
    var h = '<div class="ns-col ns-detail">';
    h += '<button type="button" class="ns-back" data-ns-back-from-detail>← Back to Careers</button>';
    h += '<span class="ns-area light">' + esc(q.label) + '</span>';
    h += '<h1>' + esc(c.t) + '</h1>';
    h += '<p class="lede">' + esc(shortSummary(c)) + '</p>';
    h += '<div class="ns-status card"><strong>' + esc(sc.title) + '</strong><p>' + esc(sc.body) + '</p></div>';

    h += '<section><h2>Recommended CSEC / CAPE subjects</h2>';
    h += '<p>' + esc(c.csecRecommended || c.subjects || 'The guide does not list a separate recommended-subjects line for this job.') + '</p>';
    if (window.NSG_PROVENANCE) {
      var fields = NSG_PROVENANCE.careerFields(c);
      var note = NSG_PROVENANCE.renderFieldNote(fields.csecRecommended);
      if (NSG_CORRECTIONS && NSG_CORRECTIONS.isContested('career', c.id, 'csecRecommended')) {
        note = (note ? note + ' ' : '') + NSG_PROVENANCE.statusLabel('contested');
      }
      if (note) h += '<p class="hint">' + esc(note) + '</p>';
    }
    if (c.capeRecommended) h += '<p><strong>Form 6 - recommended CAPE:</strong> ' + esc(c.capeRecommended) + '</p>';
    h += '<p class="hint">' + esc(N.SUBJECTS_CAVEAT) + '</p></section>';

    h += '<section><h2>Formal entry requirements</h2>';
    h += '<p>' + esc(c.formalEntry || 'Check the live programme page for the named institution, programme and intake. A recommended subject list is not the same as an entry rule.') + '</p>';
    if (window.NSG_PROVENANCE) {
      var fEntry = NSG_PROVENANCE.careerFields(c).formalEntry;
      if (NSG_CORRECTIONS && NSG_CORRECTIONS.isContested('career', c.id, 'formalEntry')) {
        h += '<p class="hint">' + esc(NSG_PROVENANCE.statusLabel('contested')) + '</p>';
      } else {
        var n2 = NSG_PROVENANCE.renderFieldNote(fEntry);
        if (n2) h += '<p class="hint">' + esc(n2) + '</p>';
      }
    }
    if (/medicine|dentist|law|engineer/i.test(c.t + (c.post || ''))) {
      h += '<p class="hint">Never infer medicine, dentistry, law or engineering from a general five-subject rule. The live programme page overrides any general summary.</p>';
    }
    h += '<p class="hint">' + esc((N.V3_FACTS && N.V3_FACTS.disclaimer) || '') + '</p></section>';

    h += '<section><h2>The three points where it matters</h2>';
    var pts = [
      ['Forms 1 to 3', c.f13],
      ['Forms 4 and 5', c.csecRecommended || c.f45],
      ['After CSEC or Form 6', c.post]
    ];
    pts.forEach(function (p, i) {
      var here = i === cp;
      h += '<div class="ns-check' + (here ? ' here' : '') + '"><h3>' + esc(p[0]) + (here ? ' · you are here' : '') + '</h3>';
      h += '<p>' + esc(p[1] || N.CHECKPOINT_EMPTY) + '</p></div>';
    });
    h += '</section>';

    if (c.gate) {
      h += '<section><h2>Professional gate</h2><p>' + esc(c.gate) + '</p>';
      h += '<p class="hint">' + esc(N.GATE_CAVEAT) + '</p></section>';
    }

    if (c.minAge != null) {
      h += '<section><h2>Minimum age</h2><p>From age ' + c.minAge + '. Do not treat this route as available below that age.</p></section>';
    }

    h += '<section><h2>Where the first jobs are</h2>';
    h += '<p>' + esc(c.first || 'The guide does not name a first-job list for this route.') + '</p>';
    h += '<p class="hint">' + esc(N.FIRST_CAVEAT) + '</p></section>';

    if (c.caveat) {
      h += '<section class="ns-caveat"><h2>Read this part carefully</h2><p>' + esc(c.caveat) + '</p></section>';
    }

    h += '<section><h2>Not in the guide yet</h2><p>' + esc(N.GAPS_COPY) + '</p></section>';

    h += '<section><h2>Where this came from</h2>';
    if (c.src && c.src.length) {
      h += '<ul class="ns-src">';
      c.src.forEach(function (pair) {
        h += '<li><a href="' + esc(pair[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(pair[0]) + '</a></li>';
      });
      h += '</ul><p class="hint">' + esc(N.SRC_FOOT) + '</p>';
    } else {
      h += '<p>' + esc(N.SRC_NONE) + '</p>';
      if (c.status === 'variable') {
        /* already said no single source  -  do not invent a route */
      }
      h += '<p class="hint">' + esc(N.SRC_FOOT) + '</p>';
    }
    h += '</section>';

    h += '<div class="ns-detail-actions">';
    h += '<button type="button" class="btn ghost" data-ns-detail-pass="' + esc(c.id) + '">Not for me</button>';
    if (onList) h += '<button type="button" class="btn" data-ns-detail-kept disabled>On my list ✓</button>';
    else h += '<button type="button" class="btn" data-ns-detail-keep="' + esc(c.id) + '">Add to my list</button>';
    h += '<button type="button" class="btn ghost" data-ns-wrong="' + esc(c.id) + '">Something looks wrong</button>';
    h += '</div></div>';
    return h;
  }

  function view(host) {
    if (screen === 'deck') return renderDeck(host);
    if (screen === 'detail') return renderDetail(host);
    return renderTab(host);
  }

  function openDeck(key, host) {
    var st = state();
    if (st.areasOpened.indexOf(key) === -1) st.areasOpened.push(key);
    saveState(st);
    deckKey = key;
    var list = careersForKey(key);
    /* Look again: if all seen, reshuffle unseen-from-kept perspective  -  show all again but seen set stays */
    var unseen = list.filter(function (c) { return st.seen.indexOf(c.id) === -1; });
    deckQueue = (unseen.length ? unseen : list.slice()).map(function (c) { return c; });
    deckUndo = null;
    screen = 'deck';
    host.render();
    window.scrollTo(0, 0);
  }

  function openDetail(id, host) {
    if (screen === 'tab') tabScroll = window.scrollY || 0;
    var st = state();
    markOpened(st, id);
    markSeen(st, id);
    saveState(st);
    detailId = id;
    screen = 'detail';
    host.render();
    window.scrollTo(0, 0);
  }

  function backToTab(host) {
    screen = 'tab';
    deckKey = null;
    detailId = null;
    host.render();
    window.scrollTo(0, tabScroll || 0);
  }

  function decide(keep, host) {
    if (!deckQueue.length) return;
    var c = deckQueue[0];
    var st = state();
    markSeen(st, c.id);
    deckUndo = { id: c.id, keep: keep, keptHad: st.kept.indexOf(c.id) !== -1, passedHad: st.passed.indexOf(c.id) !== -1 };
    if (keep) {
      if (st.kept.indexOf(c.id) === -1) st.kept.push(c.id);
      st.passed = st.passed.filter(function (x) { return x !== c.id; });
    } else {
      if (st.passed.indexOf(c.id) === -1) st.passed.push(c.id);
      st.kept = st.kept.filter(function (x) { return x !== c.id; });
    }
    saveState(st);
    deckQueue.shift();
    host.render();
  }

  function undo(host) {
    if (!deckUndo) return;
    var st = state();
    var u = deckUndo;
    var c = careerById(u.id);
    if (c) deckQueue.unshift(c);
    /* do not remove from seen  -  seen is a set of judged careers */
    if (u.keep) {
      if (!u.keptHad) st.kept = st.kept.filter(function (x) { return x !== u.id; });
    } else {
      if (!u.passedHad) st.passed = st.passed.filter(function (x) { return x !== u.id; });
    }
    saveState(st);
    deckUndo = null;
    host.render();
  }

  function bindDeckGestures(host) {
    var card = document.getElementById('nsDeckCard');
    if (!card) return;
    var startX = 0, dx = 0, active = false;
    function setX(x) {
      dx = x;
      card.style.transform = 'translateX(' + x + 'px) rotate(' + (x / 28) + 'deg)';
      var keep = card.querySelector('.ns-stamp.keep');
      var pass = card.querySelector('.ns-stamp.pass');
      var a = Math.min(1, Math.max(0, (Math.abs(x) - 24) / 70));
      if (keep) { keep.style.opacity = x > 24 ? a : 0; }
      if (pass) { pass.style.opacity = x < -24 ? a : 0; }
    }
    function end() {
      if (!active) return;
      active = false;
      if (dx > 95) { decide(true, host); return; }
      if (dx < -95) { decide(false, host); return; }
      card.style.transition = 'transform .2s ease';
      setX(0);
      setTimeout(function () { if (card) card.style.transition = ''; }, 220);
    }
    card.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      active = true; startX = e.clientX; dx = 0;
      card.setPointerCapture(e.pointerId);
    });
    card.addEventListener('pointermove', function (e) {
      if (!active) return;
      setX(e.clientX - startX);
    });
    card.addEventListener('pointerup', end);
    card.addEventListener('pointercancel', end);
  }

  function wire(host) {
    var root = host.root || document.getElementById('page');
    if (!root) return;

    root.querySelectorAll('[data-ns-add-open]').forEach(function (b) {
      b.addEventListener('click', function () {
        addPanelOpen = true;
        host.render();
      });
    });
    root.querySelectorAll('[data-ns-add-close]').forEach(function (b) {
      b.addEventListener('click', function () {
        addPanelOpen = false;
        host.render();
      });
    });
    root.querySelectorAll('[data-ns-add]').forEach(function (b) {
      b.addEventListener('click', function () {
        var st = state();
        var k = b.getAttribute('data-ns-add');
        if (st.goals.indexOf(k) === -1) st.goals.push(k);
        saveState(st);
        var left = N.Q8.some(function (q) { return st.goals.indexOf(q.key) === -1; });
        if (!left) addPanelOpen = false;
        host.render();
      });
    });
    root.querySelectorAll('[data-ns-deck]').forEach(function (b) {
      b.addEventListener('click', function () { openDeck(b.getAttribute('data-ns-deck'), host); });
    });
    root.querySelectorAll('[data-ns-detail]').forEach(function (b) {
      b.addEventListener('click', function () { openDetail(b.getAttribute('data-ns-detail'), host); });
    });
    root.querySelectorAll('[data-ns-back-tab]').forEach(function (b) {
      b.addEventListener('click', function () { backToTab(host); });
    });
    root.querySelectorAll('[data-ns-back-from-detail]').forEach(function (b) {
      b.addEventListener('click', function () { backToTab(host); });
    });
    root.querySelectorAll('[data-ns-keep]').forEach(function (b) {
      b.addEventListener('click', function () { decide(true, host); });
    });
    root.querySelectorAll('[data-ns-pass]').forEach(function (b) {
      b.addEventListener('click', function () { decide(false, host); });
    });
    root.querySelectorAll('[data-ns-undo]').forEach(function (b) {
      b.addEventListener('click', function () { undo(host); });
    });
    root.querySelectorAll('[data-ns-detail-keep]').forEach(function (b) {
      b.addEventListener('click', function () {
        var st = state();
        var id = b.getAttribute('data-ns-detail-keep');
        markSeen(st, id);
        if (st.kept.indexOf(id) === -1) st.kept.push(id);
        st.passed = st.passed.filter(function (x) { return x !== id; });
        saveState(st);
        host.render();
      });
    });
    root.querySelectorAll('[data-ns-detail-pass]').forEach(function (b) {
      b.addEventListener('click', function () {
        var st = state();
        var id = b.getAttribute('data-ns-detail-pass');
        markSeen(st, id);
        if (st.passed.indexOf(id) === -1) st.passed.push(id);
        st.kept = st.kept.filter(function (x) { return x !== id; });
        saveState(st);
        host.toast && host.toast('Saved as not for me');
        backToTab(host);
      });
    });
    root.querySelectorAll('[data-ns-wrong]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-ns-wrong');
        var c = careerById(id);
        if (window.NSG_CORRECTIONS) {
          NSG_CORRECTIONS.contestNational({
            recordType: 'career',
            recordId: id,
            field: 'record',
            valueShown: c ? (c.t || c.title) : id,
            page: 'my-plan.html#careers'
          });
        }
        host.toast && host.toast('Opened a WhatsApp report');
        host.render && host.render();
      });
    });

    if (screen === 'deck') bindDeckGestures(host);

    /* band visibility */
    var band = document.getElementById('band');
    if (band) band.style.display = screen === 'tab' ? '' : 'none';
  }

  function onKey(e, host) {
    if (screen !== 'deck') return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); decide(false, host); }
    if (e.key === 'ArrowRight') { e.preventDefault(); decide(true, host); }
  }

  function hideOnOtherTabs() {
    var band = document.getElementById('band');
    if (band) band.style.display = '';
  }

  global.NSG_CareersTab = {
    view: view,
    wire: wire,
    onKey: onKey,
    resetScreen: function () { screen = 'tab'; deckKey = null; detailId = null; addPanelOpen = false; hideOnOtherTabs(); },
    getScreen: function () { return screen; },
    _state: state,
    _routeNodes: routeNodes,
    _careerCount: function () { return careers().length; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
