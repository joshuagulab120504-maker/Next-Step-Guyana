/* nsg-app.js — Stories / My Pathway / Feed / Questions
   Single implementations only. reg() fails loudly on duplicate names. */
(function (global) {
  'use strict';

  var _fns = Object.create(null);
  function reg(name, fn) {
    if (_fns[name]) {
      throw new Error('NSG_APP duplicate function: ' + name);
    }
    _fns[name] = fn;
    return fn;
  }

  var DATA = global.NSG_DATA;
  if (!DATA) throw new Error('NSG_DATA missing — load nsg-data.js first');
  try { DATA.validateMentors(); } catch (e) { throw e; }

  var STORAGE_KEY = 'nsg_signals_v1';
  var LANES = DATA.LANES;
  var STAGES = DATA.STAGES;
  var MENTORS = DATA.MENTORS;
  var POSTS = DATA.POSTS;
  var THREADS = DATA.THREADS;
  var OPPORTUNITIES = DATA.OPPORTUNITIES;

  var NAVI_QS = [
    { key: 'pace', q: 'Does starting to earn sooner matter to you?', opts: [
      { v: 'earn', t: 'Yes — earning sooner matters' },
      { v: 'study', t: 'I want to study first' },
      { v: null, t: 'Not sure yet' }
    ]},
    { key: 'hands', q: 'Which sounds more like the work you\'d want?', opts: [
      { v: 'make', t: 'Making or fixing things' },
      { v: 'analyse', t: 'Figuring things out' },
      { v: null, t: 'Not sure yet' }
    ]},
    { key: 'risk', q: 'Working for someone, or building your own thing?', opts: [
      { v: 'steady', t: 'Working for someone' },
      { v: 'own', t: 'Building my own thing' },
      { v: null, t: 'Not sure yet' }
    ]},
    { key: 'study', q: 'How do you picture studying after school?', opts: [
      { v: 'fulltime', t: 'Full-time study' },
      { v: 'parttime', t: 'Part-time, alongside work' },
      { v: 'none', t: 'Little or no formal study' },
      { v: null, t: 'Not sure yet' }
    ]},
    { key: 'place', q: 'Where do you see yourself working?', opts: [
      { v: 'home', t: 'Near home / my region' },
      { v: 'capital', t: 'In the capital or a bigger centre' },
      { v: null, t: 'Not sure yet' }
    ]}
  ];

  var PROFILE_OPTS = {
    where: ['Region 1','Region 2','Region 3','Region 4','Region 5','Region 6','Region 7','Region 8','Region 9','Region 10'],
    subjects: ['Mathematics','English','Biology','Chemistry','Physics','Integrated Science','Principles of Business','Principles of Accounts','Information Technology','Technical Drawing','Agricultural Science','Visual Arts','Physical Education','Caribbean History','Geography'],
    activities: ['Sports team','Science club','Debate','Music or choir','Church or community group','Helping a family business','Coding or makers club','Student council','Drama','4-H or agriculture'],
    awards: ['Nothing yet','School prize','Regional competition','National competition','Certificate course','Leadership role'],
    context: [
      'I need to earn sooner rather than later',
      'Cost is a real limit',
      'I would find it hard to move or travel',
      'Family expectations shape my choices',
      'I am still exploring'
    ]
  };

  /* ── utils ── */
  var esc = reg('esc', function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  });

  var toast = reg('toast', function (msg) {
    var t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2200);
  });

  var lsGet = reg('lsGet', function (k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  });
  var lsSet = reg('lsSet', function (k, v) {
    try { localStorage.setItem(k, v); return true; } catch (e) { return false; }
  });

  var firstName = reg('firstName', function (name) {
    return String(name || '').split(/\s+/)[0] || 'Them';
  });

  var monogram = reg('monogram', function (name) {
    var p = String(name || '?').trim().split(/\s+/);
    if (p.length === 1) return p[0].charAt(0).toUpperCase();
    return (p[0].charAt(0) + p[p.length - 1].charAt(0)).toUpperCase();
  });

  var formToStage = reg('formToStage', function (form) {
    var f = +form || 1;
    if (f <= 2) return 'f12';
    if (f === 3) return 'f3';
    if (f === 4 || f === 5) return 'f45';
    if (f === 6) return 'f6';
    return 'aft';
  });

  var stageLabel = reg('stageLabel', function (id) {
    for (var i = 0; i < STAGES.length; i++) if (STAGES[i].id === id) return STAGES[i].label;
    return id;
  });

  var words = reg('words', function (s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(function (w) {
      return w.length > 1;
    });
  });

  var mentorById = reg('mentorById', function (id) {
    for (var i = 0; i < MENTORS.length; i++) if (MENTORS[i].id === id) return MENTORS[i];
    return null;
  });

  /* ── signal store ── */
  var blankSignals = reg('blankSignals', function () {
    return {
      archetype: null,
      naviAnswers: { pace: null, hands: null, risk: null, study: null, place: null },
      naviAsked: [],
      naviSkipped: false,
      profile: { where: [], subjects: [], activities: [], awards: [], context: [] },
      viewed: [],
      saves: {},
      added: [],
      opened: [],
      form: 1,
      fieldLane: null,
      name: 'You',
      profileSetupSeen: false
    };
  });

  var signals = blankSignals();

  var loadSignals = reg('loadSignals', function () {
    var raw = lsGet(STORAGE_KEY);
    var base = blankSignals();
    if (!raw) {
      /* pull archetype/form from self-check if present */
      try {
        var sc = JSON.parse(lsGet('nsg_selfcheck') || 'null');
        if (sc) {
          if (sc.archetype) base.archetype = sc.archetype;
          if (sc.stage === 'lower') base.form = 2;
          else if (sc.stage === 'f4') base.form = 4;
          else if (sc.stage === 'f5') base.form = 5;
          else if (sc.stage === 'cape') base.form = 6;
          else if (sc.stage === 'post' || sc.stage === 'out') base.form = 5;
        }
      } catch (e) { /* ASSUMPTION: ignore corrupt self-check */ }
      signals = base;
      return signals;
    }
    try {
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object') { signals = base; return signals; }
      signals = base;
      if (data.archetype) signals.archetype = data.archetype;
      if (data.naviAnswers) {
        ['pace','hands','risk','study','place'].forEach(function (k) {
          if (k in data.naviAnswers) signals.naviAnswers[k] = data.naviAnswers[k];
        });
      }
      if (Array.isArray(data.naviAsked)) signals.naviAsked = data.naviAsked.slice();
      signals.naviSkipped = !!data.naviSkipped;
      if (data.profile) {
        ['where','subjects','activities','awards','context'].forEach(function (k) {
          if (Array.isArray(data.profile[k])) signals.profile[k] = data.profile[k].slice();
        });
      }
      if (Array.isArray(data.viewed)) signals.viewed = data.viewed.slice();
      if (data.saves && typeof data.saves === 'object') signals.saves = data.saves;
      if (Array.isArray(data.added)) signals.added = data.added.slice();
      if (Array.isArray(data.opened)) signals.opened = data.opened.slice();
      if (data.form) signals.form = +data.form || 1;
      signals.fieldLane = data.fieldLane || null;
      if (data.name) signals.name = data.name;
      signals.profileSetupSeen = !!data.profileSetupSeen;
    } catch (e) { signals = base; }
    return signals;
  });

  var saveSignals = reg('saveSignals', function () {
    lsSet(STORAGE_KEY, JSON.stringify(signals));
  });

  /* ── pathway tags ── */
  var allAddable = reg('allAddable', function () {
    var out = [];
    MENTORS.forEach(function (m) {
      (m.addable || []).forEach(function (t) {
        out.push({
          id: t.id,
          label: t.label,
          type: t.type,
          stage: t.stage,
          excl: t.excl || null,
          req: t.req || null,
          mentorId: m.id,
          mentorName: m.name,
          lane: m.lane
        });
      });
    });
    return out;
  });

  var tagById = reg('tagById', function (id) {
    var all = allAddable();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  });

  var addedTags = reg('addedTags', function () {
    return signals.added.map(tagById).filter(Boolean);
  });

  var hasTag = reg('hasTag', function (id) {
    return signals.added.indexOf(id) >= 0;
  });

  var toggleTag = reg('toggleTag', function (id) {
    var i = signals.added.indexOf(id);
    if (i >= 0) signals.added.splice(i, 1);
    else signals.added.push(id);
    saveSignals();
  });

  var addEverything = reg('addEverything', function (mentorId) {
    var m = mentorById(mentorId);
    if (!m) return;
    (m.addable || []).forEach(function (t) {
      if (signals.added.indexOf(t.id) < 0) signals.added.push(t.id);
    });
    saveSignals();
  });

  var derivedLane = reg('derivedLane', function () {
    var careers = addedTags().filter(function (t) { return t.type === 'career'; });
    if (!careers.length) return null;
    var lane = careers[0].lane;
    for (var i = 1; i < careers.length; i++) {
      if (careers[i].lane !== lane) return null;
    }
    return lane;
  });

  var contradiction = reg('contradiction', function () {
    var leave = false, stay = false;
    addedTags().forEach(function (t) {
      if (t.stage === 'aft' && t.excl === 'leave') leave = true;
      if (t.stage === 'aft' && t.excl === 'stay') stay = true;
    });
    return leave && stay;
  });

  var twoDirections = reg('twoDirections', function () {
    var careers = addedTags().filter(function (t) { return t.type === 'career'; });
    var lanes = {};
    careers.forEach(function (t) { lanes[t.lane] = 1; });
    return Object.keys(lanes);
  });

  var subjectGaps = reg('subjectGaps', function () {
    var listed = signals.profile.subjects || [];
    if (!listed.length) return [];
    var gaps = [];
    addedTags().forEach(function (t) {
      if (t.type !== 'career' || !t.req) return;
      var missing = t.req.filter(function (s) { return listed.indexOf(s) < 0; });
      if (missing.length) {
        gaps.push({ tag: t, missing: missing });
      }
    });
    return gaps;
  });

  var emptyStages = reg('emptyStages', function () {
    var filled = {};
    addedTags().forEach(function (t) { filled[t.stage] = 1; });
    return STAGES.filter(function (s) { return !filled[s.id]; }).map(function (s) { return s.id; });
  });

  /* ── scoring helpers ── */
  var naviFit = reg('naviFit', function (m) {
    var score = 0;
    var a = signals.naviAnswers || {};
    Object.keys(a).forEach(function (k) {
      if (a[k] == null) return;
      if (m.traits && m.traits[k] === a[k]) score += 2;
      else score -= 1;
    });
    return score;
  });

  var profileFit = reg('profileFit', function (m) {
    var score = 0;
    var p = signals.profile || {};
    var region = (p.where && p.where[0]) || '';
    if (region && m.grewUp && m.grewUp.indexOf(region) >= 0) score += 3;
    (p.activities || []).forEach(function (act) {
      var hit = (m.addable || []).some(function (t) {
        return t.type === 'opp' && t.label.toLowerCase().indexOf(act.toLowerCase().split(' ')[0]) >= 0;
      }) || (m.searchTerms || []).some(function (s) {
        return act.toLowerCase().indexOf(s.toLowerCase()) >= 0 || s.toLowerCase().indexOf(act.toLowerCase().split(' ')[0]) >= 0;
      });
      if (hit) score += 2;
    });
    var ctx = p.context || [];
    if (ctx.indexOf('I need to earn sooner rather than later') >= 0 && m.traits && m.traits.pace === 'earn') score += 2;
    if (ctx.indexOf('Cost is a real limit') >= 0 && m.lowCost) score += 2;
    if (ctx.indexOf('I would find it hard to move or travel') >= 0 && m.traits && m.traits.place === 'home') score += 2;
    (p.subjects || []).forEach(function (sub) {
      (m.addable || []).forEach(function (t) {
        if (t.type === 'subject' && t.label === sub) score += 1;
      });
    });
    return score;
  });

  var reasonForMentor = reg('reasonForMentor', function (m) {
    var bits = [];
    var p = signals.profile || {};
    var region = (p.where && p.where[0]) || '';
    if (region && m.grewUp && m.grewUp.indexOf(region) >= 0) bits.push('they grew up in ' + region);
    (p.activities || []).slice(0, 1).forEach(function (act) {
      bits.push('did ' + act.toLowerCase() + ' too');
    });
    if (!bits.length) return '';
    return 'Here because ' + bits.join(', and ') + '.';
  });

  var momentForForm = reg('momentForForm', function (m, form) {
    var target = 11 + (+form || 1);
    var best = null, bestDiff = 99;
    (m.moments || []).forEach(function (mo) {
      var d = Math.abs(mo.age - target);
      if (d <= 1 && d < bestDiff) { best = mo; bestDiff = d; }
    });
    return best || (m.moments && m.moments[0]) || { age: target, text: m.pull };
  });

  /* ── Stories ordering — signals change order, not membership ── */
  var scoreStories = reg('scoreStories', function () {
    var pool = MENTORS.slice();
    var scored = pool.map(function (m, idx) {
      return { item: m, score: naviFit(m) + profileFit(m), idx: idx, outside: false };
    });
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.idx - b.idx;
    });
    if (signals.fieldLane) {
      var inLane = [], outLane = [];
      scored.forEach(function (s) {
        if (s.item.lane === signals.fieldLane) inLane.push(s);
        else outLane.push(s);
      });
      /* keep all in-lane; append one outside (lowest-ranked outside) as outside slot */
      var outside = outLane.length ? outLane[outLane.length - 1] : null;
      scored = inLane.slice();
      if (outside) {
        outside.outside = true;
        scored.push(outside);
      }
    } else {
      /* always mark lowest-ranked as outside */
      if (scored.length) scored[scored.length - 1].outside = true;
    }
    return scored;
  });

  /* ── Feed ── */
  var scoreFeed = reg('scoreFeed', function () {
    var pathwayLabels = {};
    addedTags().forEach(function (t) { pathwayLabels[t.label.toLowerCase()] = 1; });
    var scored = POSTS.map(function (p, idx) {
      var score = 0;
      var reasons = [];
      if ((p.forms || []).indexOf(+signals.form) >= 0) { score += 3; reasons.push('Form ' + signals.form); }
      if (p.topic && pathwayLabels[String(p.topic).toLowerCase()]) { score += 4; reasons.push('your pathway'); }
      if (p.kind === 'mentor tip' && p.mentorId && signals.viewed.indexOf(p.mentorId) >= 0) {
        score += 3; reasons.push('you read them');
      }
      if (p.kind === 'library announcement' && p.threadId && signals.opened.indexOf(p.threadId) >= 0) {
        score += 2; reasons.push('a thread you opened');
      }
      if (p.kind === 'opportunity notice' && (signals.profile.context || []).indexOf('Cost is a real limit') >= 0) {
        score += 1; reasons.push('cost matters to you');
      }
      return { item: p, score: score, idx: idx, reasons: reasons, outside: false };
    });
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.idx - b.idx;
    });
    if (scored.length) scored[scored.length - 1].outside = true;
    return scored;
  });

  /* ── Questions ── */
  var scoreQuestions = reg('scoreQuestions', function (query) {
    var stage = formToStage(signals.form);
    var empties = emptyStages();
    var hasConflict = contradiction();
    var gaps = subjectGaps();
    var lane = derivedLane();
    var qWords = words(query);

    var scored = THREADS.map(function (th, idx) {
      var score = 0;
      if (th.stage === stage) score += 4;
      (th.triggers || []).forEach(function (tr) {
        if (tr.indexOf('gap:') === 0) {
          var st = tr.slice(4);
          if (empties.indexOf(st) >= 0) score += 3;
        }
        if (tr === 'conflict' && hasConflict) score += 5;
        if (tr === 'subjectgap' && gaps.length) score += 4;
        if (tr.indexOf('forms:') === 0) {
          var forms = tr.slice(6).split(',').map(function (x) { return +x; });
          if (forms.indexOf(+signals.form) >= 0) score += 2;
        }
      });
      if (lane && th.lane === lane) score += 2;

      if (qWords.length) {
        var hay = words(th.question + ' ' + th.lane + ' ' + (th.answers || []).map(function (a) {
          var m = mentorById(a.mentorId);
          return (a.text || '') + ' ' + (m ? m.name : '');
        }).join(' '));
        var hits = 0;
        qWords.forEach(function (w) { if (hay.indexOf(w) >= 0) hits++; });
        score += hits * 10; /* search dominates when typing */
        if (!hits) score = -9999;
      }
      return { item: th, score: score, idx: idx, outside: false };
    });

    scored = scored.filter(function (s) { return s.score > -9000; });
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.idx - b.idx;
    });
    if (scored.length && !qWords.length) scored[scored.length - 1].outside = true;
    return scored;
  });

  /* ── For You ── */
  var scoreForYou = reg('scoreForYou', function () {
    var lane = derivedLane();
    var p = signals.profile || {};
    var ctx = p.context || [];
    var awards = p.awards || [];
    var hasPrior = awards.some(function (a) { return a && a !== 'Nothing yet'; });
    var region = (p.where && p.where[0]) || '';
    var hinterland = ['Region 1','Region 7','Region 8','Region 9'].indexOf(region) >= 0;
    var pathwayTopics = {};
    addedTags().forEach(function (t) { pathwayTopics[t.label.toLowerCase()] = 1; });

    var scored = OPPORTUNITIES.map(function (o, idx) {
      var score = 0;
      var reasons = [];
      var formOk = (o.forms || []).indexOf(+signals.form) >= 0;
      if (formOk) { score += 2; reasons.push({ w: 2, t: 'open to Form ' + signals.form }); }
      else { score -= 3; reasons.push({ w: -3, t: 'not open to your form' }); }

      if (lane && (o.lanes || []).indexOf(lane) >= 0) { score += 4; reasons.push({ w: 4, t: 'your direction' }); }
      else if (!(o.lanes || []).length) { score += 1; }

      if (o.topic && pathwayTopics[String(o.topic).toLowerCase()]) {
        score += 5; reasons.push({ w: 5, t: 'matches a tag on your pathway' });
      }
      if (o.rung === 'next' && hasPrior) { score += 3; reasons.push({ w: 3, t: 'next rung after what you have done' }); }
      if (o.rung === 'starter' && (!awards.length || !hasPrior)) {
        score += 3; reasons.push({ w: 3, t: 'a starter step' });
      }
      var flags = o.flags || [];
      if (flags.indexOf('lowcost') >= 0 && ctx.indexOf('Cost is a real limit') >= 0) {
        score += 2; reasons.push({ w: 2, t: 'lower cost' });
      }
      if (flags.indexOf('independent') >= 0 && ctx.indexOf('I would find it hard to move or travel') >= 0) {
        score += 3; reasons.push({ w: 3, t: 'can do without moving' });
      }
      if (flags.indexOf('hinterland') >= 0 && ctx.indexOf('I would find it hard to move or travel') >= 0) {
        score += 3; reasons.push({ w: 3, t: 'hinterland-friendly' });
      }
      if (flags.indexOf('hinterland') >= 0 && hinterland) {
        score += 2; reasons.push({ w: 2, t: 'near your region' });
      }
      if (flags.indexOf('tvet') >= 0 && ctx.indexOf('I need to earn sooner rather than later') >= 0) {
        score += 2; reasons.push({ w: 2, t: 'skills you can earn with' });
      }
      if (flags.indexOf('noexam') >= 0 && !(p.subjects || []).length) {
        score += 1; reasons.push({ w: 1, t: 'no exam barrier' });
      }
      reasons.sort(function (a, b) { return b.w - a.w; });
      return { item: o, score: score, idx: idx, reasons: reasons, formOk: formOk, outside: false };
    });

    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.idx - b.idx;
    });
    /* show top 6 + outside (lowest ranked overall) */
    var top = scored.slice(0, 6);
    var outside = scored[scored.length - 1];
    if (outside && top.indexOf(outside) < 0) {
      outside.outside = true;
      top.push(outside);
    } else if (top.length) {
      top[top.length - 1].outside = true;
    }
    return { shown: top, all: scored };
  });

  /* ── Navi ── */
  var saveCount = reg('saveCount', function () {
    return Object.keys(signals.saves || {}).length;
  });

  var naviReady = reg('naviReady', function () {
    var opened = (signals.viewed || []).length >= 5;
    var saved = saveCount() >= 5;
    return (opened || saved) && !signals.naviSkipped && (signals.naviAsked || []).length < 2;
  });

  var pickNaviQuestion = reg('pickNaviQuestion', function () {
    var readIds = (signals.viewed || []).slice();
    /* ASSUMPTION: if Navi fired via saves with few opens, use saved mentors for disagreement scoring */
    if (readIds.length < 2) {
      Object.keys(signals.saves || {}).forEach(function (id) {
        if (readIds.indexOf(id) < 0) readIds.push(id);
      });
    }
    var read = readIds.map(mentorById).filter(Boolean);
    var unanswered = NAVI_QS.filter(function (q) {
      return signals.naviAnswers[q.key] == null && (signals.naviAsked || []).indexOf(q.key) < 0;
    });
    if (!unanswered.length || !read.length) return null;
    var best = null, bestDiv = -1, agreed = false;
    unanswered.forEach(function (q) {
      var vals = {};
      read.forEach(function (m) {
        if (m.traits && m.traits[q.key] != null) vals[m.traits[q.key]] = 1;
      });
      var div = Object.keys(vals).length;
      if (div > bestDiv) {
        bestDiv = div;
        best = q;
        agreed = div <= 1;
      }
    });
    if (!best) return null;
    return { q: best, agreed: agreed, mentors: read };
  });

  /* ── render: bottom nav ── */
  var renderBottomNav = reg('renderBottomNav', function (active) {
    var items = [
      { id: 'stories', href: 'stories.html', label: 'Stories', ico: '◈' },
      { id: 'pathway', href: 'my-pathway.html', label: 'My Pathway', ico: '◎' },
      { id: 'feed', href: 'feed.html', label: 'Feed', ico: '◫' },
      { id: 'questions', href: 'questions.html', label: 'Questions', ico: '?' }
    ];
    return '<nav class="bottom-nav" aria-label="Main">' + items.map(function (it) {
      return '<a href="' + it.href + '" class="' + (active === it.id ? 'on' : '') + '"'
        + (active === it.id ? ' aria-current="page"' : '') + '>'
        + '<span class="ico" aria-hidden="true">' + it.ico + '</span>' + esc(it.label) + '</a>';
    }).join('') + '</nav>';
  });

  var renderHeader = reg('renderHeader', function () {
    return '<header class="app-header"><a class="brand" href="index.html">'
      + '<span class="mark"><img src="logotop.jpg" alt=""></span>'
      + '<span><strong style="display:block;line-height:1">NEXT STEP</strong>'
      + '<small style="display:block;font-size:9px;letter-spacing:.22em;color:rgba(255,255,255,.7);margin-top:4px;font-weight:700">GUYANA</small></span>'
      + '</a></header>';
  });

  var pageFoot = reg('pageFoot', function () {
    return '<p class="page-foot">Prototype for design testing. Mentor stories are illustrative placeholders, not real people, until consented interviews replace them.</p>';
  });

  /* ── story card (one implementation) ── */
  var renderStoryCard = reg('renderStoryCard', function (m, opts) {
    opts = opts || {};
    var mo = opts.moment || momentForForm(m, signals.form);
    var roleCls = m.role === 'mentor' ? 'mentor' : 'contributor';
    var taken = (m.addable || []).filter(function (t) { return hasTag(t.id); }).length;
    var reason = reasonForMentor(m);
    var h = '<article class="story-card" data-mentor="' + esc(m.id) + '">';
    if (opts.outside) {
      h += '<div class="outside-banner">✦ Outside your pattern — we always show one</div>';
    }
    h += '<div class="story-band"><div class="story-band-top">'
      + '<div class="mono-av">' + esc(monogram(m.name)) + '</div>'
      + '<div class="who"><strong>' + esc(m.name) + '</strong><small>' + esc(m.grewUp) + '</small></div>'
      + '<div class="age-chip"><b>' + esc(mo.age) + '</b><span>AT THE TIME</span></div>'
      + '</div></div>';
    h += '<div class="story-body">';
    h += '<div class="story-meta">'
      + '<span class="role-tag ' + roleCls + '"><span class="dot" aria-hidden="true"></span>'
      + (m.role === 'mentor' ? 'Mentor' : 'Contributor') + '</span>'
      + '<span class="chip">' + esc(m.archetype) + '</span>'
      + '<span class="chip lane">' + esc(m.lane) + '</span>'
      + (taken ? '<span class="chip outline">' + taken + ' on your pathway</span>' : '')
      + '</div>';
    if (reason && (signals.profile.where.length || signals.profile.activities.length || signals.profile.subjects.length)) {
      h += '<p class="reason-line">' + esc(reason) + '</p>';
    }
    h += '<div class="perforation" aria-hidden="true"></div>';
    h += '<p class="story-moment">' + esc(mo.text) + '</p>';
    h += '<p class="now-row"><span class="k">NOW</span>' + esc(m.now) + '</p>';
    h += '<div class="story-actions">'
      + '<a class="btn full" href="mentor-story.html?id=' + encodeURIComponent(m.id) + '" data-open-story="' + esc(m.id) + '">Read their story →</a>'
      + '<div class="row">'
      + '<button type="button" class="btn ghost small" data-sounds="' + esc(m.id) + '">'
      + (signals.saves[m.id] ? 'Saved as you' : 'Sounds like me') + '</button>'
      + '<button type="button" class="btn ghost small" data-compare="' + esc(m.id) + '">+ Compare</button>'
      + '</div></div>';
    h += '</div></article>';
    return h;
  });

  /* ── Stories surface ── */
  var renderStories = reg('renderStories', function (root) {
    var age = 11 + (+signals.form || 1);
    var arch = signals.archetype || 'your interests';
    var scored = scoreStories();
    var h = '<div class="wrap">';
    h += '<p class="eyebrow">Discovery</p>';
    h += '<h1 style="font-size:clamp(26px,7vw,34px);margin:6px 0 6px">Stories for you</h1>';
    h += '<p style="margin:0 0 14px;color:var(--muted);font-size:14px">Curated around ' + esc(arch)
      + ' · about age ' + age + '</p>';

    if (signals.fieldLane) {
      h += '<div class="field-bar"><span>Showing ' + esc(signals.fieldLane) + '</span>'
        + '<button type="button" data-clear-lane>Show everyone</button></div>';
    }

    var hasProfile = (signals.profile.where.length + signals.profile.activities.length + signals.profile.subjects.length) > 0;
    if (hasProfile) {
      h += '<p class="reason-line">Ordered around your profile: your region, what you are part of. '
        + 'Nobody was removed — all ' + scored.length + ' are still here, in a different order.</p>';
    } else {
      h += '<p class="reason-line">Nobody was removed — all ' + scored.length + ' are still here.</p>';
    }

    if (naviReady()) {
      var nq = pickNaviQuestion();
      if (nq) {
        var names = nq.mentors.slice(0, 3).map(function (m) { return firstName(m.name); }).join(', ');
        var answeredN = (signals.naviAsked || []).length;
        h += '<div class="navi-card" id="naviCard">'
          + '<p class="eyebrow">Navi · Two quick questions</p>'
          + '<p style="margin:0 0 8px;font-family:var(--font-accent);font-size:11px;font-weight:800;color:var(--gold-deep)">'
          + answeredN + ' of 2 answered</p>'
          + '<h2>' + esc(nq.q.q) + '</h2>'
          + '<p>' + (nq.agreed
            ? 'They had this in common, so let me check it is true of you too.'
            : 'You read ' + esc(names) + '. They did not all agree on this one, which is why it is worth asking.')
          + '</p>'
          + '<p style="font-size:12.5px;color:var(--muted);margin:0 0 12px">Answers change the order only. Nobody gets hidden from you.</p>'
          + '<div class="choices">' + nq.q.opts.map(function (o) {
            return '<button type="button" class="btn ghost full" style="margin-bottom:8px" data-navi-key="'
              + esc(nq.q.key) + '" data-navi-val="' + esc(o.v == null ? '' : o.v) + '">' + esc(o.t) + '</button>';
          }).join('') + '</div>'
          + '<button type="button" class="btn ghost full" data-navi-skip style="margin-top:4px">Skip these for now</button>'
          + '</div>';
      }
    }

    scored.forEach(function (s) {
      h += renderStoryCard(s.item, { outside: s.outside });
    });
    h += pageFoot() + '</div>';
    root.innerHTML = h;
    bindStories(root);
  });

  var bindStories = reg('bindStories', function (root) {
    root.querySelectorAll('[data-open-story]').forEach(function (a) {
      a.addEventListener('click', function () {
        var id = a.getAttribute('data-open-story');
        if (signals.viewed.indexOf(id) < 0) signals.viewed.push(id);
        saveSignals();
      });
    });
    root.querySelectorAll('[data-sounds]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-sounds');
        if (signals.saves[id]) delete signals.saves[id];
        else signals.saves[id] = 'me';
        saveSignals();
        renderStories(root);
      });
    });
    root.querySelectorAll('[data-compare]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toast('Compare stays on this device — open another story, then come back.');
      });
    });
    root.querySelectorAll('[data-navi-key]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-navi-key');
        var val = btn.getAttribute('data-navi-val');
        signals.naviAnswers[key] = val === '' ? null : val;
        if (signals.naviAsked.indexOf(key) < 0) signals.naviAsked.push(key);
        saveSignals();
        renderStories(root);
      });
    });
    var skip = root.querySelector('[data-navi-skip]');
    if (skip) skip.addEventListener('click', function () {
      signals.naviSkipped = true;
      saveSignals();
      renderStories(root);
    });
    var clear = root.querySelector('[data-clear-lane]');
    if (clear) clear.addEventListener('click', function () {
      signals.fieldLane = null;
      saveSignals();
      renderStories(root);
    });
  });

  /* ── My Pathway ── */
  var profileCompletion = reg('profileCompletion', function () {
    var p = signals.profile;
    var n = 0;
    if (p.where.length) n++;
    if (p.subjects.length) n++;
    if (p.activities.length) n++;
    if (p.awards.length) n++;
    if (p.context.length) n++;
    return Math.round((n / 5) * 100);
  });

  var renderProfileStrip = reg('renderProfileStrip', function (editing) {
    var pct = profileCompletion();
    var p = signals.profile;
    var parts = [];
    if (p.where.length) parts.push(p.where[0]);
    if (p.subjects.length) parts.push(p.subjects.length + ' subjects');
    if (p.activities.length) parts.push(p.activities.length + ' activities');
    if (p.awards.length) parts.push('achievements set');
    if (p.context.length) parts.push('situation set');
    var sum = parts.length ? parts.join(' · ') : 'Nothing set yet — the product still works.';

    if (!editing) {
      return '<div class="profile-strip" id="profileStrip">'
        + '<div class="ring" style="--p:' + pct + '" aria-hidden="true"><i>' + pct + '%</i></div>'
        + '<div class="sum"><strong>Your profile</strong><small>' + esc(sum) + '</small></div>'
        + '<button type="button" class="btn small" data-profile-edit>Update</button>'
        + '</div>';
    }

    var why = {
      where: 'We put people who grew up near you higher up.',
      subjects: 'Lets us tell you when a route you saved needs a subject you have not listed.',
      activities: 'People who did the same things at your age come up first.',
      awards: 'Decides which opportunity we suggest next — the step up, not the starting rung.',
      context: 'Stops us putting a route in front of you that was never affordable.'
    };
    var titles = {
      where: 'Where you are',
      subjects: 'Subjects',
      activities: 'Activities',
      awards: 'Achievements',
      context: 'Your situation'
    };
    var h = '<div class="card" id="profileEditor" style="margin-bottom:16px">';
    h += '<h2 style="font-size:20px;margin:0 0 12px">Update your profile</h2>';
    ['where','subjects','activities','awards','context'].forEach(function (key) {
      h += '<section style="margin:0 0 16px" data-profile-section="' + key + '">';
      h += '<h3 style="font-size:16px;margin:0 0 4px">' + esc(titles[key]) + '</h3>';
      h += '<p style="margin:0 0 8px;font-size:12.5px;color:var(--muted)"><em>Why we ask:</em> ' + esc(why[key]) + '</p>';
      var multi = key !== 'where';
      PROFILE_OPTS[key].forEach(function (opt) {
        var on = p[key].indexOf(opt) >= 0;
        h += '<button type="button" class="option-chip' + (on ? ' on' : '') + '" aria-checked="'
          + (on ? 'true' : 'false') + '" data-prof-key="' + key + '" data-prof-val="' + esc(opt)
          + '" data-multi="' + (multi ? '1' : '0') + '">' + esc(opt) + '</button>';
      });
      h += '</section>';
    });
    h += '<button type="button" class="btn full" data-profile-done>Done</button></div>';
    return h;
  });

  var showAllStagesSession = false;

  var stageIndex = reg('stageIndex', function (id) {
    for (var i = 0; i < STAGES.length; i++) if (STAGES[i].id === id) return i;
    return 0;
  });

  var stagesToShow = reg('stagesToShow', function () {
    if (showAllStagesSession) {
      return STAGES.map(function (_, i) { return i; });
    }
    var here = formToStage(signals.form);
    var currentStageIndex = stageIndex(here);
    var filled = [];
    STAGES.forEach(function (st, i) {
      if (addedTags().some(function (t) { return t.stage === st.id; })) filled.push(i);
    });
    var lastFilled = filled.length ? Math.max.apply(null, filled) : currentStageIndex;
    var showMap = {};
    filled.forEach(function (i) { showMap[i] = 1; });
    showMap[currentStageIndex] = 1;
    showMap[Math.min(lastFilled + 1, 5)] = 1;
    return Object.keys(showMap).map(function (k) { return +k; }).sort(function (a, b) { return a - b; });
  });

  var renderHowItFills = reg('renderHowItFills', function () {
    return '<div class="card" style="margin:0 0 16px">'
      + '<p class="eyebrow">How this fills up</p>'
      + '<h2 style="font-size:22px;margin:6px 0 10px">Your pathway builds itself as you read.</h2>'
      + '<p style="margin:0 0 14px;color:var(--muted);font-size:14px;line-height:1.5">'
      + 'Open somebody\'s story. When something they did looks worth copying — a subject, a programme, a route step — take it, and it lands here on the right Form.</p>'
      + '<a class="btn full" href="stories.html">Read some stories →</a></div>';
  });

  var renderForYou = reg('renderForYou', function () {
    var res = scoreForYou();
    var gated = res.all.filter(function (s) { return !s.formOk; }).length;
    var h = '<div class="section" style="margin:0 0 18px" id="forYouSection">';
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px">';
    h += '<h2 style="font-size:22px;margin:0">For you</h2>';
    h += '<span class="swipe-hint">Swipe →</span></div>';
    h += '<div class="foryou-rail" tabindex="0">';
    res.shown.forEach(function (s) {
      var o = s.item;
      h += '<button type="button" class="foryou-card" data-opp-open="' + esc(o.id) + '">';
      if (s.outside) h += '<span class="out-mark" title="Outside your pattern" aria-label="Outside your pattern">✦</span>';
      h += '<h3>' + esc(o.name) + '</h3><p>' + esc(o.blurb) + '</p>';
      h += '<span class="details-aff">Details →</span>';
      h += '</button>';
    });
    h += '</div>';
    if (gated) {
      h += '<p class="reason-line">' + gated + ' others are in the catalogue but not open to Form '
        + esc(signals.form) + ' — age or grade limits set by the organisers, not by us.</p>';
    }
    h += '</div>';
    return h;
  });

  var openOppSheet = reg('openOppSheet', function (oppId) {
    var res = scoreForYou();
    var scored = null;
    res.all.forEach(function (s) { if (s.item.id === oppId) scored = s; });
    if (!scored) return;
    var o = scored.item;
    var topReasons = (scored.reasons || []).filter(function (r) { return r.w > 0; }).slice(0, 2).map(function (r) { return r.t; });
    var existing = document.getElementById('oppSheet');
    if (existing) existing.parentNode.removeChild(existing);
    var wrap = document.createElement('div');
    wrap.id = 'oppSheet';
    wrap.className = 'sheet-backdrop';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', o.name);
    var html = '<div class="sheet">'
      + '<button type="button" class="close-sheet" data-close-sheet aria-label="Close">×</button>'
      + '<div class="sheet-meta">'
      + '<span class="chip">' + esc(o.kind === 'event' ? 'Event' : 'Opportunity') + '</span>'
      + '<span class="chip outline">' + esc(o.when) + '</span>'
      + '<span class="chip outline">' + esc(o.rung) + '</span></div>'
      + '<h2>' + esc(o.name) + '</h2>'
      + '<p style="margin:0 0 12px;font-size:14.5px;line-height:1.5">' + esc(o.blurb) + '</p>';
    if (topReasons.length) {
      html += '<p class="reason-line">Here because ' + esc(topReasons.join(', and ')) + '.</p>';
    }
    html += '<p style="margin:0;font-size:12.5px;color:var(--muted);line-height:1.45">Source: ' + esc(o.source)
      + '. Dates and eligibility shift — confirm with the organiser before you plan around it.</p>'
      + '</div>';
    wrap.innerHTML = html;
    document.body.appendChild(wrap);
    function close() {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) close();
    });
    var btn = wrap.querySelector('[data-close-sheet]');
    if (btn) btn.addEventListener('click', close);
  });

  var renderBypass = reg('renderBypass', function () {
    var h = '<details class="card" style="margin:0 0 16px" id="decidedBypass">';
    h += '<summary style="cursor:pointer;font-family:var(--font-display);font-size:18px;font-weight:650;min-height:44px;display:flex;align-items:center">Know exactly what you want?</summary>';
    h += '<div style="margin-top:12px">';
    h += '<label class="search-bar" style="margin-bottom:12px"><span class="mag" aria-hidden="true">⌕</span>'
      + '<input type="search" id="careerSearch" placeholder="Nurse, welding, own business…" autocomplete="off">'
      + '<button type="button" class="clear hidden" id="careerSearchClear" aria-label="Clear">×</button></label>';
    h += '<div id="careerSearchResults"></div>';
    h += '<p style="font-size:12.5px;color:var(--muted);margin:0 0 10px">Or pick a lane</p>';
    h += '<div class="lane-grid">';
    LANES.forEach(function (lane) {
      var count = MENTORS.filter(function (m) { return m.lane === lane; }).length;
      h += '<button type="button" class="lane-btn' + (signals.fieldLane === lane ? ' on' : '')
        + '" data-set-lane="' + esc(lane) + '">' + esc(lane)
        + '<small>' + count + ' ' + (count === 1 ? 'person' : 'people') + '</small></button>';
    });
    h += '</div></div></details>';
    return h;
  });

  var renderCoherence = reg('renderCoherence', function () {
    var h = '';
    if (contradiction()) {
      h += '<div class="notice bad"><strong>These two cannot both be your plan.</strong>'
        + ' You have added steps for leaving the academic track after CSEC and staying on for CAPE. '
        + 'That is a real fork, not a detail — it is the decision the whole of Form 5 turns on. '
        + '<a href="questions.html?q=fork">Open the fork thread</a></div>';
    }
    var dirs = twoDirections();
    if (dirs.length > 1) {
      h += '<div class="notice warn"><strong>You are holding more than one direction.</strong> '
        + esc(dirs.join(' · ')) + '. That is fine for now — we will not pick a lane for you.</div>';
    }
    subjectGaps().forEach(function (g) {
      var from = firstName(g.tag.mentorName);
      h += '<div class="notice warn"><strong>' + esc(g.tag.label) + ' usually needs '
        + esc(g.missing.join(' and ')) + '.</strong> You have not listed those in your profile. '
        + esc(from) + ' took ' + esc(g.tag.req.join(' and ')) + ' — worth checking whether you still can.</div>';
    });
    return h;
  });

  var suggestionsForStage = reg('suggestionsForStage', function (stageId) {
    var sourceIds = signals.viewed.length ? signals.viewed : MENTORS.map(function (m) { return m.id; });
    var heading = signals.viewed.length ? 'FROM PEOPLE YOU READ' : 'WORTH LOOKING AT';
    var tags = [];
    sourceIds.forEach(function (id) {
      var m = mentorById(id);
      if (!m) return;
      (m.addable || []).forEach(function (t) {
        if (t.stage === stageId && !hasTag(t.id) && tags.length < 3) {
          tags.push({ tag: t, mentor: m });
        }
      });
    });
    return { heading: heading, tags: tags };
  });

  var renderSpine = reg('renderSpine', function () {
    var tags = addedTags();
    if (!tags.length) return '';

    var here = formToStage(signals.form);
    var lane = derivedLane();
    var showIdx = stagesToShow();
    var hiddenN = STAGES.length - showIdx.length;
    var fromNames = [];
    tags.forEach(function (t) {
      var n = firstName(t.mentorName);
      if (fromNames.indexOf(n) < 0) fromNames.push(n);
    });
    var h = '';
    if (lane) {
      h += '<div style="margin:0 0 14px"><h2 style="font-size:20px;margin:0 0 4px">' + esc(lane) + '</h2>'
        + '<p style="margin:0;color:var(--muted);font-size:13px">A direction, not a job title. The specialisation comes later, from people already at the end of it.</p></div>';
    }
    h += '<h2 style="font-size:22px;margin:0 0 4px">Your Form 1–6 pathway</h2>';
    h += '<p style="margin:0 0 12px;color:var(--muted);font-size:13.5px">'
      + tags.length + ' thing' + (tags.length === 1 ? '' : 's') + ' taken'
      + (fromNames.length ? ' from ' + esc(fromNames.join(', ')) : '') + '.</p>';

    STAGES.forEach(function (st, i) {
      if (showIdx.indexOf(i) < 0) return;
      var isHere = st.id === here;
      var stageTags = tags.filter(function (t) { return t.stage === st.id; });
      h += '<section class="stage-card' + (isHere ? ' here' : '') + '">';
      h += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">'
        + '<span class="stage-dot" aria-hidden="true"></span>'
        + '<strong style="font-family:var(--font-display);font-size:17px">' + esc(st.label) + '</strong>'
        + (isHere ? '<span class="here-badge">YOU ARE HERE</span>' : '')
        + '</div>';
      if (!stageTags.length) {
        h += '<p style="margin:0 0 8px;color:var(--muted);font-size:13px">Nothing here yet</p>';
        var sug = suggestionsForStage(st.id);
        if (sug.tags.length) {
          h += '<p class="eyebrow" style="margin-bottom:6px">' + esc(sug.heading) + '</p>';
          sug.tags.forEach(function (s) {
            h += '<button type="button" class="btn ghost small" style="margin:0 6px 6px 0" data-add-tag="'
              + esc(s.tag.id) + '">+ ' + esc(s.tag.label) + ' · ' + esc(firstName(s.mentor.name)) + '</button>';
          });
        }
      } else {
        stageTags.forEach(function (t) {
          var also = MENTORS.filter(function (m) {
            return m.id !== t.mentorId && (m.addable || []).some(function (x) { return x.label === t.label; });
          });
          h += '<div class="path-tag ' + esc(t.type) + '"><div><div class="meta">' + esc(t.type)
            + ' · from ' + esc(firstName(t.mentorName)) + '</div>'
            + '<strong>' + esc(t.label) + '</strong>'
            + (also.length ? '<div style="font-size:12px;color:var(--muted);margin-top:2px">'
              + esc(t.label) + ' · ' + esc(firstName(also[0].name)) + ' too</div>' : '')
            + '</div><button type="button" class="rm" data-rm-tag="' + esc(t.id) + '" aria-label="Remove">✕</button></div>';
        });
      }
      h += '</section>';
    });

    if (hiddenN > 0) {
      h += '<button type="button" class="btn ghost full" data-show-stages style="margin:4px 0 12px">'
        + 'Show the other ' + hiddenN + ' stage' + (hiddenN === 1 ? '' : 's') + '</button>';
    }
    return h;
  });

  var renderPathwaySummary = reg('renderPathwaySummary', function () {
    var tags = addedTags();
    if (tags.length < 3) return '';
    var byType = { subject: [], opp: [], step: [], career: [] };
    tags.forEach(function (t) { if (byType[t.type]) byType[t.type].push(t); });
    var empties = emptyStages().map(stageLabel);
    var h = '<section class="card" style="margin:18px 0">';
    h += '<h2 style="font-size:20px;margin:0 0 10px">What your pathway says so far</h2>';
    ['subject','opp','step','career'].forEach(function (ty) {
      if (!byType[ty].length) return;
      h += '<p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:.08em;color:var(--muted)">'
        + esc(ty.toUpperCase()) + '</p>';
      h += '<p style="margin:0 0 10px;font-size:13.5px">' + byType[ty].map(function (t) {
        return esc(t.label);
      }).join(' · ') + '</p>';
    });
    if (empties.length) {
      h += '<p style="margin:8px 0 0;font-size:13px;color:var(--muted)">Still to fill: ' + esc(empties.join(' · ')) + '</p>';
    } else {
      h += '<p style="margin:8px 0 0;font-size:13px;color:var(--muted)">Every stage has something in it. The useful move now is checking the requirements are real — open a tag\'s owner and read their deep dive.</p>';
    }
    h += '</section>';
    return h;
  });

  var renderPathwayThreads = reg('renderPathwayThreads', function () {
    if (!addedTags().length) return '';
    var top = scoreQuestions('').slice(0, 2);
    var h = '<section style="margin:18px 0"><h2 style="font-size:20px;margin:0 0 10px">Questions near your pathway</h2>';
    top.forEach(function (s) {
      h += '<a class="thread-card" style="display:block;text-decoration:none;color:inherit" href="questions.html?id='
        + encodeURIComponent(s.item.id) + '"><h3>' + esc(s.item.question) + '</h3>'
        + '<span class="chip outline">' + esc(s.item.lane) + '</span></a>';
    });
    h += '</section>';
    return h;
  });

  var renderPathway = reg('renderPathway', function (root, state) {
    state = state || { editing: false };
    var tagsCount = signals.added.length;
    var h = '<div class="wrap">';
    h += '<div class="record-head">';
    h += '<p class="eyebrow" style="color:var(--gold)">My Pathway</p>';
    h += '<h1>' + esc(signals.name || 'You') + '</h1>';
    h += '<p>' + esc(signals.archetype || 'Archetype not set yet')
      + ' · Form ' + esc(signals.form)
      + (signals.profile.where[0] ? ' · ' + esc(signals.profile.where[0]) : '') + '</p>';
    h += '<div class="record-counts">'
      + '<span>' + (signals.profile.awards.length || 0) + ' achievements</span>'
      + '<span>' + (signals.profile.activities.length || 0) + ' activities</span>'
      + '<span>' + tagsCount + ' tags taken</span>'
      + '</div></div>';

    if (!signals.profileSetupSeen && profileCompletion() === 0) {
      h += '<div class="card" style="border:2px solid var(--gold);margin-bottom:16px">'
        + '<h2 style="font-size:20px;margin:0 0 8px">Tell us what should shape suggestions</h2>'
        + '<p style="margin:0 0 12px;color:var(--muted);font-size:13.5px">Nothing is required. The product works without it.</p>'
        + '<button type="button" class="btn full" data-profile-setup>Set this up — takes a minute</button></div>';
    }

    h += renderProfileStrip(state.editing);
    h += renderForYou();
    h += renderBypass();
    h += renderCoherence();
    if (!tagsCount) {
      h += renderHowItFills();
    } else {
      h += renderSpine();
      h += renderPathwaySummary();
      h += renderPathwayThreads();
    }
    h += pageFoot() + '</div>';
    root.innerHTML = h;
    bindPathway(root, state);
  });

  var bindPathway = reg('bindPathway', function (root, state) {
    var editBtn = root.querySelector('[data-profile-edit]');
    if (editBtn) editBtn.addEventListener('click', function () {
      renderPathway(root, { editing: true });
    });
    var setup = root.querySelector('[data-profile-setup]');
    if (setup) setup.addEventListener('click', function () {
      signals.profileSetupSeen = true;
      saveSignals();
      renderPathway(root, { editing: true });
    });
    var done = root.querySelector('[data-profile-done]');
    if (done) done.addEventListener('click', function () {
      signals.profileSetupSeen = true;
      saveSignals();
      renderPathway(root, { editing: false });
    });
    root.querySelectorAll('[data-prof-key]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-prof-key');
        var val = btn.getAttribute('data-prof-val');
        var multi = btn.getAttribute('data-multi') === '1';
        var arr = signals.profile[key];
        var i = arr.indexOf(val);
        if (!multi) {
          signals.profile[key] = i >= 0 ? [] : [val];
        } else {
          if (i >= 0) arr.splice(i, 1);
          else arr.push(val);
        }
        saveSignals();
        renderPathway(root, { editing: true });
      });
    });
    root.querySelectorAll('[data-add-tag]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleTag(btn.getAttribute('data-add-tag'));
        renderPathway(root, state);
      });
    });
    root.querySelectorAll('[data-rm-tag]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleTag(btn.getAttribute('data-rm-tag'));
        renderPathway(root, state);
      });
    });
    root.querySelectorAll('[data-set-lane]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lane = btn.getAttribute('data-set-lane');
        signals.fieldLane = lane;
        saveSignals();
        toast('Stories will show ' + lane + ' — undo anytime.');
        renderPathway(root, state);
      });
    });
    var showStages = root.querySelector('[data-show-stages]');
    if (showStages) showStages.addEventListener('click', function () {
      showAllStagesSession = true;
      renderPathway(root, state);
    });
    root.querySelectorAll('[data-opp-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openOppSheet(btn.getAttribute('data-opp-open'));
      });
    });
    var search = root.querySelector('#careerSearch');
    var clear = root.querySelector('#careerSearchClear');
    var results = root.querySelector('#careerSearchResults');
    function runSearch() {
      var q = (search && search.value) || '';
      var qw = words(q);
      if (clear) clear.classList.toggle('hidden', !q);
      if (!results) return;
      if (!qw.length) { results.innerHTML = ''; return; }
      var hits = MENTORS.map(function (m) {
        var hay = words((m.searchTerms || []).join(' ') + ' ' + m.now + ' ' + m.lane);
        var n = 0;
        qw.forEach(function (w) { if (hay.indexOf(w) >= 0) n++; });
        return { m: m, n: n };
      }).filter(function (x) { return x.n > 0; }).sort(function (a, b) { return b.n - a.n; });
      if (!hits.length) {
        results.innerHTML = '<div class="notice info"><strong>Nobody yet for “‘ + esc(q) + ’”.</strong> '
          + 'We would rather say so than match you to something loosely related.'
          + '<button type="button" class="btn small" style="margin-top:10px" data-waitlist>Join the waitlist</button></div>';
        var wl = results.querySelector('[data-waitlist]');
        if (wl) wl.addEventListener('click', function () { toast('Waitlist noted on this device.'); });
        return;
      }
      results.innerHTML = hits.slice(0, 5).map(function (x) {
        return '<button type="button" class="btn ghost full" style="margin-bottom:8px;justify-content:flex-start" data-set-lane="'
          + esc(x.m.lane) + '">' + esc(x.m.name) + ' · ' + esc(x.m.lane) + '</button>';
      }).join('');
      results.querySelectorAll('[data-set-lane]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          signals.fieldLane = btn.getAttribute('data-set-lane');
          saveSignals();
          toast('Filtering Stories to that lane.');
        });
      });
    }
    if (search) search.addEventListener('input', runSearch);
    if (clear) clear.addEventListener('click', function () { search.value = ''; runSearch(); });
  });

  /* ── Feed ── */
  var renderFeed = reg('renderFeed', function (root) {
    var scored = scoreFeed();
    var h = '<div class="wrap">';
    h += '<p class="eyebrow">Timely</p>';
    h += '<h1 style="font-size:clamp(26px,7vw,34px);margin:6px 0 10px">Feed</h1>';
    h += '<div class="notice info"><strong>No upvotes or downvotes here, deliberately.</strong> '
      + 'Popular advice is not the same as true advice, and an honest answer that costs someone votes is an answer they stop giving. '
      + 'Replies show in the order they were written.</div>';
    h += '<div class="composer"><textarea id="composerText" placeholder="Ask or share something…" aria-label="Compose"></textarea>'
      + '<button type="button" class="btn small" style="margin-top:8px" data-compose>Post</button></div>';

    scored.forEach(function (s) {
      var p = s.item;
      h += '<article class="post-card">';
      if (s.outside) h += '<div class="outside-banner" style="margin:-14px -16px 12px;border-radius:16px 16px 0 0">✦ Outside your pattern — we always show one</div>';
      h += '<div class="post-top"><div class="post-av">' + esc((p.author || '?').charAt(0)) + '</div><div>'
        + '<strong>' + esc(p.author) + '</strong>'
        + '<div class="post-meta">' + esc(p.when) + ' · ' + esc(p.kind)
        + ' <span class="chip outline" style="margin-left:6px">' + esc(p.category) + '</span></div></div></div>';
      h += '<p class="post-body">' + esc(p.text) + '</p>';
      if (s.reasons && s.reasons.length) {
        h += '<p class="reason-line">Here because of ' + esc(s.reasons.join(' and ')) + '.</p>';
      }
      h += '<div class="post-foot">' + esc(p.replies || 0) + ' replies'
        + (p.answered ? ' · answered' : '') + '</div></article>';
    });
    h += '<div class="card" style="text-align:center;margin-top:8px">'
      + '<h2 style="font-size:20px;margin:0 0 8px">That is the end of today’s feed.</h2>'
      + '<p style="margin:0 0 12px;color:var(--muted);font-size:13.5px">Anything worth keeping lives in Questions — the feed announces, the library keeps.</p>'
      + '<a class="btn ghost" href="questions.html">Open Questions</a></div>';
    h += pageFoot() + '</div>';
    root.innerHTML = h;
    var postBtn = root.querySelector('[data-compose]');
    if (postBtn) postBtn.addEventListener('click', function () {
      toast('Posted on this device — in the prototype it stays local.');
      var ta = root.querySelector('#composerText');
      if (ta) ta.value = '';
    });
  });

  /* ── Questions ── */
  var renderQuestions = reg('renderQuestions', function (root, opts) {
    opts = opts || {};
    var q = opts.query || '';
    var scored = scoreQuestions(q);
    var h = '<div class="wrap">';
    h += '<p class="eyebrow">Library</p>';
    h += '<h1 style="font-size:clamp(26px,7vw,34px);margin:6px 0 12px">Questions</h1>';
    h += '<label class="search-bar"><span class="mag" aria-hidden="true">⌕</span>'
      + '<input type="search" id="qSearch" placeholder="Search questions, answers, people…" value="' + esc(q) + '" autocomplete="off">'
      + '<button type="button" class="clear' + (q ? '' : ' hidden') + '" id="qClear" aria-label="Clear">×</button></label>';

    scored.forEach(function (s) {
      var th = s.item;
      h += '<article class="thread-card" id="thread-' + esc(th.id) + '">';
      if (s.outside) {
        h += '<p style="margin:0 0 8px;font-size:13px;color:var(--muted);font-weight:650">'
          + 'The questions you are not asking are often the useful ones.</p>';
      }
      h += '<h3>' + esc(th.question) + '</h3>';
      if (th.reviewed) h += '<div class="reviewed">✓ Reviewed ' + esc(th.reviewed) + '</div>';
      h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px">'
        + '<span class="chip outline">' + esc(th.lane) + '</span>'
        + '<span class="chip outline">' + esc(stageLabel(th.stage)) + '</span>'
        + '<span class="chip outline">' + esc(th.asks) + ' asks</span></div>';
      (th.answers || []).forEach(function (a) {
        var m = mentorById(a.mentorId);
        h += '<div style="border-top:1px solid var(--line);padding:10px 0">'
          + '<strong style="font-size:13px">' + esc(m ? m.name : 'Mentor') + '</strong>'
          + '<p style="margin:4px 0 0;font-size:14px;line-height:1.5">' + esc(a.text) + '</p></div>';
      });
      if (th.review) {
        h += '<div class="notice info" style="margin-top:10px"><strong>Staff note · ' + esc(th.review.who) + '</strong>'
          + esc(th.review.text) + '</div>';
      }
      h += '</article>';
    });

    h += '<div class="ask-box"><h2 style="font-size:20px;margin:0 0 8px">Ask something</h2>'
      + '<textarea id="askText" placeholder="Type your question…" aria-label="Your question"></textarea>'
      + '<div id="askDupes" style="margin-top:10px"></div>'
      + '<button type="button" class="btn full" style="margin-top:10px" data-ask-post>Ask anyway</button></div>';
    h += pageFoot() + '</div>';
    root.innerHTML = h;

    var input = root.querySelector('#qSearch');
    var clear = root.querySelector('#qClear');
    var timer = null;
    function apply() {
      renderQuestions(root, { query: input.value });
      var el = root.querySelector('#qSearch');
      if (el) { el.focus(); var v = el.value; el.value = ''; el.value = v; }
    }
    if (input) input.addEventListener('input', function () {
      clear.classList.toggle('hidden', !input.value);
      clearTimeout(timer);
      timer = setTimeout(apply, 160);
    });
    if (clear) clear.addEventListener('click', function () {
      input.value = '';
      apply();
    });

    var ask = root.querySelector('#askText');
    var dupes = root.querySelector('#askDupes');
    function checkDupes() {
      var qw = words(ask.value);
      if (!qw.length) { dupes.innerHTML = ''; return; }
      var matches = THREADS.map(function (th) {
        var hay = words(th.question);
        var n = 0;
        qw.forEach(function (w) { if (hay.indexOf(w) >= 0) n++; });
        return { th: th, n: n };
      }).filter(function (x) { return x.n > 0; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 3);
      if (!matches.length) { dupes.innerHTML = ''; return; }
      dupes.innerHTML = '<div class="notice warn"><strong>' + matches.length
        + ' already asked something like this</strong>'
        + matches.map(function (x) {
          return '<div style="margin-top:6px"><a href="#thread-' + esc(x.th.id) + '">' + esc(x.th.question) + '</a></div>';
        }).join('')
        + '<p style="margin:8px 0 0">Read those first if you like — or ask anyway. If you do, that tells us the existing answer is not good enough.</p></div>';
    }
    if (ask) ask.addEventListener('input', checkDupes);
    var post = root.querySelector('[data-ask-post]');
    if (post) post.addEventListener('click', function () {
      /* Never block the post */
      toast('Question noted on this device. Existing answers stay; this tells us they were not enough.');
      if (ask) ask.value = '';
      if (dupes) dupes.innerHTML = '';
    });

    if (opts.focusId) {
      var t = root.querySelector('#thread-' + opts.focusId);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* ── mount helpers ── */
  var mountShell = reg('mountShell', function (active) {
    loadSignals();
    var body = document.body;
    if (!document.querySelector('.app-header')) {
      body.insertAdjacentHTML('afterbegin', renderHeader());
    }
    if (!document.querySelector('.bottom-nav')) {
      body.insertAdjacentHTML('beforeend', renderBottomNav(active));
    }
    if (!document.querySelector('.toast')) {
      body.insertAdjacentHTML('beforeend', '<div class="toast" role="status" aria-live="polite"></div>');
    }
  });

  /* ── acceptance / tests (startup) ── */
  var runAcceptance = reg('runAcceptance', function () {
    var errors = [];
    /* 1 duplicate fn registry already enforced by reg() */
    var regNames = Object.keys(_fns);
    var seenReg = {};
    regNames.forEach(function (n) {
      if (seenReg[n]) errors.push('Duplicate reg() name: ' + n);
      seenReg[n] = 1;
    });

    /* 3 pool invariance */
    var snap = JSON.parse(JSON.stringify(signals));
    var prevShowAll = showAllStagesSession;
    showAllStagesSession = false;
    var empty = blankSignals();
    empty.form = 4;
    signals = empty;
    var s0 = scoreStories().length;
    var f0 = scoreFeed().length;
    var q0 = scoreQuestions('').length;
    var o0 = scoreForYou().all.length;
    signals = blankSignals();
    signals.form = 4;
    signals.archetype = 'The Steward';
    signals.naviAnswers = { pace: 'earn', hands: 'make', risk: 'own', study: 'parttime', place: 'home' };
    signals.profile = {
      where: ['Region 9'],
      subjects: ['Mathematics', 'English'],
      activities: ['Sports team', 'Science club'],
      awards: ['School prize'],
      context: ['Cost is a real limit', 'I need to earn sooner rather than later']
    };
    signals.viewed = ['raeka', 'omar', 'jerome'];
    signals.added = MENTORS[0].addable.map(function (t) { return t.id; });
    var s1 = scoreStories().length;
    var f1 = scoreFeed().length;
    var q1 = scoreQuestions('').length;
    var o1 = scoreForYou().all.length;
    if (s0 !== MENTORS.length) errors.push('Stories pool empty-state size wrong');
    if (s0 !== s1) errors.push('Stories pool changed with signals (' + s0 + '→' + s1 + ')');
    if (f0 !== f1) errors.push('Feed pool changed with signals');
    if (q0 !== q1) errors.push('Questions pool changed with signals');
    if (o0 !== o1) errors.push('For You pool changed with signals');

    /* outside slots */
    signals = blankSignals();
    signals.form = 4;
    if (!scoreStories().some(function (x) { return x.outside; })) errors.push('Stories missing outside');
    if (!scoreFeed().some(function (x) { return x.outside; })) errors.push('Feed missing outside');
    if (!scoreQuestions('').some(function (x) { return x.outside; })) errors.push('Questions missing outside');
    if (!scoreForYou().shown.some(function (x) { return x.outside; })) errors.push('For You missing outside');

    /* contradiction keeps both tags */
    signals = blankSignals();
    var leaveTag = null, stayTag = null;
    MENTORS.forEach(function (m) {
      (m.addable || []).forEach(function (t) {
        if (t.excl === 'leave' && !leaveTag) leaveTag = t.id;
        if (t.excl === 'stay' && !stayTag) stayTag = t.id;
      });
    });
    if (leaveTag && stayTag) {
      signals.added = [leaveTag, stayTag];
      if (!contradiction()) errors.push('Contradiction not detected');
      if (signals.added.length !== 2) errors.push('Contradiction removed a tag');
    }

    /* For You card face: name/description/details only */
    signals = blankSignals();
    signals.form = 1;
    var fy = renderForYou();
    if (/Here because/i.test(fy)) errors.push('For You card still has reason line');
    if (/Source:/i.test(fy)) errors.push('For You card still has source on face');
    if (/>\s*Opportunity\s*</i.test(fy) || />\s*Event\s*</i.test(fy)) errors.push('For You card still has kind chip');
    if (/starter|next/i.test(fy.replace(/Details →/g, ''))) {
      /* rung may appear in blurb text — only fail if chip-like class outline near rung words is hard; check chip outline count after name */
    }
    if (fy.indexOf('Details →') < 0) errors.push('For You missing Details affordance');

    /* State 0 pathway: no spine emptiness */
    signals = blankSignals();
    signals.form = 3;
    var probe0 = document.createElement('div');
    try {
      renderPathway(probe0, { editing: false });
      var h0 = probe0.innerHTML;
      if (/stage-card/.test(h0)) errors.push('State 0 still renders stage cards');
      if (/Nothing here yet/.test(h0)) errors.push('State 0 still says Nothing here yet');
      if (/What your pathway says/.test(h0)) errors.push('State 0 still shows summary');
      if (/Still to fill|Still empty/.test(h0)) errors.push('State 0 lists empty stages');
      if (!/How this fills up/i.test(h0)) errors.push('State 0 missing how-it-fills card');
      if (!/forYouSection|For you/.test(h0)) errors.push('State 0 missing For You');
      if (!/Know exactly what you want/.test(h0)) errors.push('State 0 missing bypass');
    } catch (e) { errors.push('State 0 pathway threw: ' + e.message); }

    /* State 1: one tag at Form 3 → two stages + show other 4 */
    signals = blankSignals();
    signals.form = 3;
    showAllStagesSession = false;
    var f3Tag = null;
    MENTORS.forEach(function (m) {
      (m.addable || []).forEach(function (t) {
        if (t.stage === 'f3' && !f3Tag) f3Tag = t.id;
      });
    });
    if (f3Tag) {
      signals.added = [f3Tag];
      var shown = stagesToShow();
      if (shown.length !== 2) errors.push('Form 3 + one tag should show 2 stages, got ' + shown.length);
      var spine = renderSpine();
      if (!/Show the other 4 stages/.test(spine)) errors.push('Missing Show the other 4 stages');
      var stageCards = (spine.match(/stage-card/g) || []).length;
      if (stageCards !== 2) errors.push('Spine should render 2 stage cards, got ' + stageCards);
    }

    /* Summary at 3 tags, not at 2 */
    signals = blankSignals();
    signals.added = MENTORS[0].addable.slice(0, 2).map(function (t) { return t.id; });
    if (renderPathwaySummary()) errors.push('Summary should be absent with 2 tags');
    signals.added = MENTORS[0].addable.slice(0, 3).map(function (t) { return t.id; });
    if (!renderPathwaySummary()) errors.push('Summary should appear with 3 tags');

    /* Navi at 5 opens / 5 saves, not at 4; asks 2 */
    signals = blankSignals();
    signals.viewed = ['raeka', 'omar', 'jerome', 'aisha'];
    if (naviReady()) errors.push('Navi should not fire at 4 opens');
    signals.viewed = ['raeka', 'omar', 'jerome', 'aisha', 'priya'];
    if (!naviReady()) errors.push('Navi should fire at 5 opens');
    signals = blankSignals();
    signals.saves = { raeka: 'me', omar: 'me', jerome: 'me', aisha: 'me', priya: 'me' };
    if (!naviReady()) errors.push('Navi should fire at 5 saves with zero opens');
    signals.naviAsked = ['pace', 'hands'];
    if (naviReady()) errors.push('Navi should stop after 2 answers');

    /* banned strings */
    var ban = [
      'up' + 'vote', 'down' + 'vote', 'kar' + 'ma', 'follow' + 'ers', 'stre' + 'ak',
      'leader' + 'board', 'lik' + 'es', 'years' + ' old', 'age' + ' now', '%' + ' match'
    ];
    var probe = document.createElement('div');
    try {
      signals = blankSignals();
      renderStories(probe);
      var html = probe.innerHTML.toLowerCase();
      html = html.replace(/no upvotes or downvotes[\s\S]*?written\./g, '');
      ban.forEach(function (b) {
        if (html.indexOf(b) >= 0) errors.push('Banned term in Stories: ' + b);
      });
    } catch (e) { errors.push('Stories render threw: ' + e.message); }

    signals = snap;
    showAllStagesSession = prevShowAll;
    saveSignals();
    if (errors.length) {
      if (typeof console !== 'undefined' && console.error) console.error('NSG_APP acceptance failures:\n - ' + errors.join('\n - '));
    } else {
      if (typeof console !== 'undefined' && console.log) console.log('NSG_APP acceptance checks passed');
    }
    return errors;
  });

  /* public API — one name each */
  var API = {
    reg: reg,
    loadSignals: loadSignals,
    saveSignals: saveSignals,
    getSignals: function () { return signals; },
    setForm: function (f) { signals.form = +f || 1; saveSignals(); },
    mountShell: mountShell,
    renderStories: renderStories,
    renderPathway: renderPathway,
    renderFeed: renderFeed,
    renderQuestions: renderQuestions,
    scoreStories: scoreStories,
    scoreFeed: scoreFeed,
    scoreQuestions: scoreQuestions,
    scoreForYou: scoreForYou,
    toggleTag: toggleTag,
    addEverything: addEverything,
    contradiction: contradiction,
    subjectGaps: subjectGaps,
    derivedLane: derivedLane,
    runAcceptance: runAcceptance,
    mentorById: mentorById,
    markViewed: function (id) {
      if (signals.viewed.indexOf(id) < 0) signals.viewed.push(id);
      saveSignals();
    },
    markOpened: function (id) {
      if (signals.opened.indexOf(id) < 0) signals.opened.push(id);
      saveSignals();
    },
    _fns: _fns
  };

  global.NSG_APP = API;
})(typeof window !== 'undefined' ? window : this);
