/* nsg-plan-engine.js - personalisation: ordering only, never filtering.
   plan = f(answers, keptCareers, stage, profile)
   Depends on NSG_NORTH (CareersV3 + Opportunities) and preferably NSG_STAGES.

   BOUNDARY: region and school offerings may affect copy, milestones and which local
   programmes are surfaced. School type, name or perceived rank must never affect
   career ordering or availability.
*/
(function (global) {
  'use strict';

  var N = global.NSG_NORTH;
  if (!N) throw new Error('NSG_NORTH missing - load nsg-north-star.js first');

  var PREF_STORE = 'nsg_pref';
  var OPP_STORE = 'nsg_opps';
  var PROFILE_STORE = 'nsg_profile';
  var MYPLAN_STORE = 'nsg_myplan';

  var ROUTE_TYPES = ['degree', 'diploma', 'certificate', 'apprenticeship', 'selection', 'none-needed'];
  var BUCKETS = ['sci', 'eng', 'tech', 'trade', 'agri', 'biz', 'law', 'gov', 'creative', 'sport', 'edu'];

  var AMERICAN = /\b(favor|colored|center|organize|analyze|behavior|personalized|favorite)\b/i;
  var EM_DASH = /\u2014| - /;

  function stageNum(stage) {
    if (global.NSG_STAGES && NSG_STAGES.stageNum) return NSG_STAGES.stageNum(stage);
    return 1;
  }

  function migrateMyPlan(old) {
    if (!old || typeof old !== 'object') {
      return {
        studentName: null, contact: null, archetypeSeen: false, lastVisit: Date.now(),
        stageHistory: {}, naviLog: [], badges: [],
        discover: { clustersOpened: {}, careersSeen: {}, thingsTried: [], scenariosRevealed: [] },
        answeredAt: null, stage: null
      };
    }
    return {
      studentName: old.studentName || null,
      contact: old.contact || null,
      archetypeSeen: !!old.archetypeSeen,
      lastVisit: old.lastVisit || Date.now(),
      stageHistory: old.stageHistory || {},
      naviLog: old.naviLog || [],
      badges: old.badges || [],
      discover: old.discover || { clustersOpened: {}, careersSeen: {}, thingsTried: [], scenariosRevealed: [] },
      answeredAt: old.answeredAt || null,
      stage: old.stage || null
    };
  }

  function loadMyPlanFlags() {
    try {
      var raw = JSON.parse(localStorage.getItem(MYPLAN_STORE) || 'null');
      var cleaned = migrateMyPlan(raw);
      if (raw && (raw.starKey || raw.milestones || raw.answers || raw.star)) {
        try { localStorage.setItem(MYPLAN_STORE, JSON.stringify(cleaned)); } catch (e) {}
      }
      return cleaned;
    } catch (e) {
      return migrateMyPlan(null);
    }
  }

  function loadProfile() {
    try {
      var raw = JSON.parse(localStorage.getItem(PROFILE_STORE) || 'null');
      /* Shape guard: dashboard used to write {name,stage,interest,decision} under this key. */
      if (!raw || typeof raw !== 'object') return { subjects: [], schoolId: null, schoolOverride: null, age: null };
      if (!('schoolId' in raw) && !('subjects' in raw) && !('schoolFacts' in raw) && ('name' in raw || 'interest' in raw)) {
        return { subjects: [], schoolId: null, schoolOverride: null, age: null };
      }
      return {
        subjects: raw.subjects || [],
        schoolId: raw.schoolId || null,
        schoolOverride: raw.schoolOverride || null,
        age: raw.age != null ? raw.age : null,
        schoolFacts: raw.schoolFacts || null
      };
    } catch (e) {
      return { subjects: [], schoolId: null, schoolOverride: null, age: null };
    }
  }

  function emptyVector() {
    return {
      handsOn: 0,
      academic: 0,
      earnSoon: 0,
      costSensitive: 0,
      localOnly: 0,
      flatten: false,
      routes: {},
      buckets: {},
      judged: 0,
      abroadOk: null,
      obligationOk: null,
      coastalMoveOk: null,
      leadFreeRoutes: null,
      naviAsked: {},
      inferenceShown: {}
    };
  }

  function loadPref() {
    try {
      var raw = JSON.parse(localStorage.getItem(PREF_STORE) || 'null');
      if (raw && typeof raw === 'object') {
        var v = emptyVector();
        Object.keys(v).forEach(function (k) {
          if (raw[k] !== undefined) v[k] = raw[k];
        });
        v.routes = raw.routes || {};
        v.buckets = raw.buckets || {};
        v.naviAsked = raw.naviAsked || {};
        v.inferenceShown = raw.inferenceShown || {};
        return v;
      }
    } catch (e) {}
    return emptyVector();
  }

  function savePref(v) {
    try { localStorage.setItem(PREF_STORE, JSON.stringify(v)); } catch (e) {}
  }

  function loadOpps() {
    try {
      return JSON.parse(localStorage.getItem(OPP_STORE) || '{"saved":[],"done":[],"dismissed":[],"slots":{}}') || { saved: [], done: [], dismissed: [], slots: {} };
    } catch (e) { return { saved: [], done: [], dismissed: [], slots: {} }; }
  }

  function saveOpps(o) {
    try { localStorage.setItem(OPP_STORE, JSON.stringify(o)); } catch (e) {}
  }

  function saveProfile(p) {
    try { localStorage.setItem(PROFILE_STORE, JSON.stringify(p)); } catch (e) {}
  }

  function loadSelfcheck() {
    try { return JSON.parse(localStorage.getItem('nsg_selfcheck') || 'null'); } catch (e) { return null; }
  }

  function loadMyPlan() {
    return loadMyPlanFlags();
  }

  function loadNorth() {
    try { return JSON.parse(localStorage.getItem('nsg_north_star') || 'null'); } catch (e) { return null; }
  }

  function isOutOfSchool(answers, sc) {
    var a = answers || (sc && sc.answers) || {};
    var st = (sc && sc.stage) || (a.stage && a.stage[0]) || '';
    if (st === 'out' || st === 'outofschool' || st === 'out-of-school') return true;
    if (a.outOfSchool || a.notInSchool) return true;
    if (sc && sc.outOfSchool) return true;
    return false;
  }

  function readLearning(sc, answers) {
    var a = answers || (sc && sc.rawAnswers) || {};
    var L = (a.learning && a.learning[0]) || (sc && sc.learning) || null;
    return L;
  }

  function readTimeToEarning(sc, answers) {
    var a = answers || (sc && sc.rawAnswers) || {};
    if (a.timeToEarning && a.timeToEarning[0]) return a.timeToEarning[0];
    if (sc && sc.timeToEarning != null) return sc.timeToEarning;
    return null;
  }

  /* Declared preferences from self-check (additive). */
  function applyDeclared(v, sc, answers) {
    var a = answers || (sc && sc.rawAnswers) || {};
    var pulls = (sc && sc.pulls) || a.pull || [];
    var subjects = (sc && sc.subjects) || [];
    var concerns = (sc && sc.concerns) || [];
    var learning = readLearning(sc, a);
    var tte = readTimeToEarning(sc, a);
    var stage = (sc && sc.stage) || (a.stage && a.stage[0]) || 'form1';
    var sn = stageNum(stage);

    pulls.forEach(function (p) {
      if (p === 'engineering' || p === 'technical' || p === 'agriculture') v.handsOn += 2;
      if (p === 'creative' || p === 'making' || p === 'law' || p === 'english' || p === 'social') v.academic += 2;
    });
    subjects.forEach(function (s) {
      if (s === 'technical' || s === 'agriculture') v.handsOn += 2;
      if (s === 'english' || s === 'social') v.academic += 2;
    });
    if (learning === 'practising' || learning === 'practice' || learning === 'making') v.handsOn += 3;
    if (learning === 'reading' || learning === 'discussing' || learning === 'ideas') v.academic += 3;

    /* timeToEarning: Form 1-2 may only have inferred 'soon' from Q9 earn; null is never long-study. */
    if (tte === 'soon') v.earnSoon += 4;
    else if (tte === 'training' || tte === 'few-years') { /* neutral-ish */ }
    else if (tte === 'long') { /* leave earnSoon alone - do not treat null as long */ }
    if (concerns.indexOf('earn') !== -1) v.earnSoon += 3;
    if (concerns.indexOf('afford') !== -1) v.costSensitive += 3;
    if (concerns.indexOf('exists') !== -1) v.localOnly += 2;

    /* Form 1-2 inference only when not already set */
    if (sn > 0 && sn <= 2 && tte == null && concerns.indexOf('earn') !== -1) {
      v.earnSoon += 4;
    }

    (sc && sc.curious || []).forEach(function (k, i) {
      var b = checkToBucket(k);
      if (b) v.buckets[b] = (v.buckets[b] || 0) + Math.max(3 - i, 1);
    });

    return v;
  }

  function namedCareerWeight(stage, certainty, judged) {
    var sn = stageNum(stage);
    var base = 2;
    if (sn <= 2) base = 2;
    else if (sn === 3) base = 4;
    else if (sn === 4 || sn === 5) base = 5;
    else if (sn === 0) base = 4; /* out */
    else if (sn >= 6) base = 6; /* postcsec / sixth / postcape */
    var w = base;
    if (sn >= 3 || sn === 0) {
      var scale = { 1: 0.5, 2: 0.75, 3: 1.0, 4: 1.5 }[certainty] || 1;
      w = base * scale;
    } else {
      /* Form 1-2: certainty must not push past +3 */
      w = Math.min(3, base);
    }
    var decay = 1 - Math.min((judged || 0) / 20, 0.6);
    return w * decay;
  }

  function applyNamedCareerOrdering(v, sc) {
    var nc = sc && sc.namedCareer;
    if (!nc || nc.notYet || !nc.id) return;
    var judged = v.judged || 0;
    var w = namedCareerWeight(sc.stage, nc.certainty || 2, judged);
    v.namedCareerWeight = w;
    v.namedCareerId = nc.id;
    var buckets = (nc.buckets || []).slice();
    if (!buckets.length) {
      var c = careerById(nc.id);
      if (c) buckets = (c.buckets || c.keys || []).slice();
    }
    buckets.forEach(function (b) {
      var bucket = checkToBucket(b) || (BUCKETS.indexOf(b) !== -1 ? b : null);
      if (bucket) v.buckets[bucket] = (v.buckets[bucket] || 0) + w;
    });
  }

  function checkToBucket(k) {
    var m = {
      science: 'sci', engineering: 'eng', technology: 'tech', trade: 'trade',
      agriculture: 'agri', business: 'biz', law: 'law', civic: 'gov', publicsvc: 'gov',
      creative: 'creative', sports: 'sport', education: 'edu'
    };
    return m[k] || (BUCKETS.indexOf(k) !== -1 ? k : null);
  }

  function addRoute(v, routeType, n) {
    if (!routeType) return;
    v.routes[routeType] = (v.routes[routeType] || 0) + n;
  }

  function addBuckets(v, buckets, n) {
    (buckets || []).forEach(function (b) {
      v.buckets[b] = (v.buckets[b] || 0) + n;
    });
  }

  function careerAttrs(c) {
    return {
      handsOn: !!c.handsOn,
      academic: !c.handsOn || c.routeType === 'degree',
      earnSoon: c.routeType === 'none-needed' || c.routeType === 'apprenticeship' || c.routeType === 'certificate' || (c.monthsToFirstEarning != null && c.monthsToFirstEarning <= 12),
      costSensitive: c.routeType === 'none-needed' || /free tuition|goal|bit|cvq/i.test((c.post || '') + (c.what || '')),
      localOnly: (c.studyWhere || []).indexOf('regional') !== -1 || (c.studyWhere || []).indexOf('community') !== -1 || (c.studyWhere || []).indexOf('on-the-job') !== -1
    };
  }

  /* Revealed preference from careers + opportunities. */
  function applyRevealed(v, north, oppState) {
    north = north || { kept: [], passed: [], opened: [] };
    var judged = (north.kept || []).length + (north.passed || []).length;
    v.judged = judged;

    (north.kept || []).forEach(function (id) {
      var c = careerById(id);
      if (!c) return;
      var a = careerAttrs(c);
      if (a.handsOn) v.handsOn += 2;
      if (a.academic) v.academic += 2;
      if (a.earnSoon) v.earnSoon += 2;
      if (a.costSensitive) v.costSensitive += 1;
      if (a.localOnly) v.localOnly += 1;
      addRoute(v, c.routeType, 2);
      addBuckets(v, c.buckets || c.keys, 2);
    });

    (north.opened || []).forEach(function (id) {
      var c = careerById(id);
      if (!c) return;
      var a = careerAttrs(c);
      if (a.handsOn) v.handsOn += 3;
      if (a.academic) v.academic += 3;
      if (a.earnSoon) v.earnSoon += 3;
      addRoute(v, c.routeType, 3);
      addBuckets(v, c.buckets || c.keys, 1);
    });

    (north.passed || []).forEach(function (id) {
      var c = careerById(id);
      if (!c) return;
      var a = careerAttrs(c);
      if (a.handsOn) v.handsOn -= 1;
      if (a.academic) v.academic -= 1;
      addRoute(v, c.routeType, -1);
    });

    oppState = oppState || loadOpps();
    (oppState.saved || []).forEach(function (id) {
      var o = oppById(id);
      if (!o) return;
      if (o.serves === 'practical') v.handsOn += 1;
      if (o.serves === 'academic') v.academic += 1;
      if (o.serves === 'both') { v.handsOn += 0.5; v.academic += 0.5; }
      addRoute(v, servesToRoute(o.serves), 1);
      addBuckets(v, o.buckets, 1); /* light bucket weight */
    });
    (oppState.done || []).forEach(function (id) {
      var o = oppById(id);
      if (!o) return;
      if (o.serves === 'practical') v.handsOn += 3;
      if (o.serves === 'academic') v.academic += 3;
      if (o.serves === 'both') { v.handsOn += 1.5; v.academic += 1.5; }
      addRoute(v, servesToRoute(o.serves), 3);
      addBuckets(v, o.buckets, 2); /* still lighter than careers for bucket */
    });
    (oppState.dismissed || []).forEach(function (id) {
      var o = oppById(id);
      if (!o) return;
      addRoute(v, servesToRoute(o.serves), -1);
    });
    Object.keys(oppState.slots || {}).forEach(function (slot) {
      if (!oppState.slots[slot]) return;
      v.handsOn += 2;
      addRoute(v, 'certificate', 2);
      /* bucket from fillsSlot mapping - light */
      var bucketGuess = { sport: 'sport', instrument: 'creative', volunteering: 'gov', language: 'law' }[slot];
      if (bucketGuess) addBuckets(v, [bucketGuess], 1);
    });

    if (v.flatten) {
      v.handsOn = (v.handsOn + v.academic) / 2;
      v.academic = v.handsOn;
      Object.keys(v.routes).forEach(function (r) { v.routes[r] = Math.min(v.routes[r], 2); });
    }
    return v;
  }

  function servesToRoute(serves) {
    if (serves === 'practical') return 'certificate';
    if (serves === 'academic') return 'degree';
    return 'diploma';
  }

  function careerById(id) {
    for (var i = 0; i < N.CAREERS.length; i++) if (N.CAREERS[i].id === id) return N.CAREERS[i];
    return null;
  }

  function oppById(id) {
    for (var i = 0; i < N.OPPORTUNITIES.length; i++) if (N.OPPORTUNITIES[i].id === id) return N.OPPORTUNITIES[i];
    return null;
  }

  function rebuildVector(opts) {
    opts = opts || {};
    var v = emptyVector();
    var stored = loadPref();
    v.flatten = !!stored.flatten;
    v.abroadOk = stored.abroadOk;
    v.obligationOk = stored.obligationOk;
    v.coastalMoveOk = stored.coastalMoveOk;
    v.leadFreeRoutes = stored.leadFreeRoutes;
    v.naviAsked = stored.naviAsked || {};
    v.inferenceShown = stored.inferenceShown || {};
    var sc = opts.selfcheck || loadSelfcheck();
    applyDeclared(v, sc, opts.answers);
    applyRevealed(v, opts.north || loadNorth(), opts.opps || loadOpps());
    applyNamedCareerOrdering(v, sc); /* after judged count is known; ordering only */
    return v;
  }

  function scoreCareer(c, v, neutral) {
    if (neutral) return 0;
    var a = careerAttrs(c);
    var s = 0;
    if (a.handsOn) s += v.handsOn;
    if (a.academic) s += v.academic;
    if (a.earnSoon) s += v.earnSoon;
    if (a.costSensitive && v.costSensitive) s += v.costSensitive;
    if (a.localOnly && v.localOnly) s += v.localOnly;
    s += (v.routes[c.routeType] || 0);
    (c.buckets || c.keys || []).forEach(function (b) { s += (v.buckets[b] || 0); });
    if (v.leadFreeRoutes && a.costSensitive) s += 5;
    if (v.obligationOk === false && c.obligationMonths) s -= 3;
    if (v.coastalMoveOk === false && (c.studyWhere || []).indexOf('coastal') !== -1 && (c.studyWhere || []).length === 1) s -= 4;
    if (v.abroadOk === false && /abroad|overseas|international/i.test(c.post || '')) s -= 2;
    return s;
  }

  function scoreOpp(o, v, neutral) {
    if (neutral) return 0;
    var s = 0;
    if (o.serves === 'practical') s += v.handsOn;
    if (o.serves === 'academic') s += v.academic;
    if (o.serves === 'both') s += (v.handsOn + v.academic) / 2;
    (o.buckets || []).forEach(function (b) { s += (v.buckets[b] || 0) * 0.5; });
    return s;
  }

  /* Order careers - never exclude. Declared self-check preferences may score
     before keeps; full lean still waits on enough keeps/passes for route weights. */
  function orderCareers(list, v, opts) {
    opts = opts || {};
    var hasDeclared = Object.keys(v.buckets || {}).length > 0 || v.handsOn || v.academic || v.earnSoon || v.costSensitive;
    var neutral = (v.judged || 0) < 6 && !hasDeclared && !opts.forceScore;
    var scored = (list || N.CAREERS).map(function (c, i) {
      return { c: c, s: scoreCareer(c, v, neutral), i: i };
    });
    scored.sort(function (a, b) {
      if (b.s !== a.s) return b.s - a.s;
      return a.i - b.i;
    });
    var ordered = scored.map(function (x) { return x.c; });

    /* Floor: at least one low-scoring route type mid-deck */
    if (ordered.length >= 3) {
      var routeScores = {};
      ROUTE_TYPES.forEach(function (r) { routeScores[r] = v.routes[r] || 0; });
      var lowRoute = ROUTE_TYPES.slice().sort(function (a, b) { return (routeScores[a] || 0) - (routeScores[b] || 0); })[0];
      var lowIdx = -1;
      for (var i = 0; i < ordered.length; i++) {
        if (ordered[i].routeType === lowRoute) { lowIdx = i; break; }
      }
      if (lowIdx !== -1) {
        var mid = Math.floor(ordered.length / 2);
        if (lowIdx === ordered.length - 1 || lowIdx === 0) {
          var item = ordered.splice(lowIdx, 1)[0];
          ordered.splice(mid, 0, item);
        }
      }
    }
    return ordered;
  }

  function orderOpportunities(list, v, studentAge) {
    var hasDeclared = Object.keys(v.buckets || {}).length > 0 || v.handsOn || v.academic || v.earnSoon;
    var neutral = (v.judged || 0) < 6 && !hasDeclared;
    var all = (list || N.OPPORTUNITIES).slice();
    var scored = all.map(function (o, i) {
      return { o: o, s: scoreOpp(o, v, neutral), i: i };
    });
    scored.sort(function (a, b) {
      if (b.s !== a.s) return b.s - a.s;
      return a.i - b.i;
    });
    var ordered = scored.map(function (x) { return x.o; });

    /* Floor: at least one of each serves value visible (reorder only) */
    ['academic', 'practical', 'both'].forEach(function (serves) {
      var idx = -1;
      for (var i = 0; i < ordered.length; i++) {
        if (ordered[i].serves === serves) { idx = i; break; }
      }
      if (idx > 5) {
        var item = ordered.splice(idx, 1)[0];
        ordered.splice(2, 0, item);
      }
    });
    return ordered;
  }

  function oppAvailable(o, age) {
    if (o.ageFrom == null || age == null) return true;
    return age >= o.ageFrom;
  }

  function schoolById(id) {
    if (global.NSG_SCHOOLS && NSG_SCHOOLS.schoolById) {
      var s = NSG_SCHOOLS.schoolById(id);
      if (s && s.id !== 'not-listed') return s;
    }
    for (var i = 0; i < (N.SCHOOLS || []).length; i++) if (N.SCHOOLS[i].id === id) return N.SCHOOLS[i];
    return null;
  }

  function matchSchool(query) {
    var q = String(query || '').toLowerCase().trim();
    if (!q) return [];
    return (N.SCHOOLS || []).filter(function (s) {
      if (s.name.toLowerCase().indexOf(q) !== -1) return true;
      return (s.nick || []).some(function (n) { return n.toLowerCase().indexOf(q) !== -1 || q.indexOf(n.toLowerCase()) !== -1; });
    });
  }

  /* Subject core: union of csecNamed across kept, ranked by how many need it. */
  function subjectCore(keptCareers) {
    var counts = {};
    keptCareers.forEach(function (c) {
      (c.csecNamed || []).forEach(function (s) {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    return Object.keys(counts).map(function (s) {
      return { subject: s, n: counts[s], total: keptCareers.length };
    }).sort(function (a, b) { return b.n - a.n; });
  }

  function normalizeSubjectRecord(s) {
    if (s == null) return null;
    if (typeof s === 'string') return { name: s, status: 'planning', sitting: null, grade: null };
    if (!s.name) return null;
    return {
      name: s.name,
      status: s.status || 'planning',
      sitting: s.sitting != null ? s.sitting : null,
      grade: s.grade != null ? s.grade : null
    };
  }

  function subjectKey(name) {
    return String(name || '').toLowerCase()
      .replace(/^english a$/, 'english')
      .replace(/^maths$/, 'mathematics')
      .replace(/^mathematics$/, 'mathematics');
  }

  /* Gap check reads subject.status - never the stage label. */
  function gaps(core, profileSubjects) {
    var have = {};
    var resit = {};
    (profileSubjects || []).forEach(function (raw) {
      var s = normalizeSubjectRecord(raw);
      if (!s) return;
      var k = subjectKey(s.name);
      if (s.status === 'passed' || s.status === 'writing-this-year') have[k] = s;
      if (s.status === 'written-not-passed') resit[k] = s;
    });
    var out = [];
    (core || []).forEach(function (x) {
      var k = subjectKey(x.subject);
      if (have[k] || (k === 'english' && have['english']) || (k.indexOf('english') === 0 && have['english'])) return;
      if (resit[k]) {
        out.push({ subject: x.subject, n: x.n, total: x.total, kind: 'resit' });
        return;
      }
      out.push({ subject: x.subject, n: x.n, total: x.total, kind: 'missing' });
    });
    return out;
  }

  function nextDecision(stage, outOfSchool) {
    if (outOfSchool) {
      return {
        title: 'Next open intake',
        detail: 'GROW, BIT, GTI and the TVET Hub publish rolling or fixed intakes. Check the live page for the window that is open now.',
        when: 'This month'
      };
    }
    var sn = stageNum(stage);
    if (sn <= 2) {
      return {
        title: 'Form 3 stream choice',
        detail: 'That is the first real decision point. Until then, explore and keep English and Mathematics strong.',
        when: 'End of Form 3'
      };
    }
    if (sn === 3) {
      return {
        title: 'CSEC and CVQ subject list',
        detail: 'Protect English A and Mathematics, then the prerequisites shared by the careers you kept.',
        when: 'This school year'
      };
    }
    if (sn === 4 || sn === 5) {
      var sixthNote = '';
      try {
        var prof = loadProfile();
        var facts = (prof && prof.schoolOverride) || (prof && prof.schoolFacts) || {};
        var sch = schoolById(prof && prof.schoolId);
        var sixth = facts.sixth != null ? facts.sixth : (sch && sch.sixthForm);
        if (sn === 4 && (sixth === 'no' || sixth === 'No')) {
          return {
            title: 'Sixth form transfer',
            detail: 'Your school does not run CAPE. If a kept pathway needs Form 6, plan the transfer school this year - not in Form 5.',
            when: 'This school year'
          };
        }
      } catch (e) {}
      return {
        title: 'Post-CSEC fork',
        detail: 'Sixth Form, technical institute, work-plus-study, or a direct programme. Keep a Plan A and a Plan B.' + sixthNote,
        when: sn === 5 ? 'Exam year' : 'After Form 5'
      };
    }
    return {
      title: 'Programme applications',
      detail: 'Apply early. Verify every condition on the live programme page.',
      when: 'This intake cycle'
    };
  }

  function stageBodyFromV3(stage) {
    if (global.NSG_STAGES) stage = NSG_STAGES.normalizeStage(stage);
    /* Distinct copy per canonical stage. Forms 1-5 and Lower Sixth use V3 STAGE_COPY; others are explicit. */
    var map = {
      form1: '1', form2: '2', form3: '3', form4: '4', form5: '5',
      lowersixth: '6'
    };
    if (map[stage] && N.STAGE_COPY[map[stage]]) {
      return N.STAGE_COPY[map[stage]];
    }
    if (stage === 'uppersixth') {
      return {
        title: 'Upper Sixth',
        bullets: [
          'Finish CAPE Unit 2 and any portfolio or coursework the programme requires.',
          'Submit applications early. Verify every condition on the live programme page.',
          'Keep a Plan A, Plan B and a bridging route if results or funding shift.',
          'Confirm accommodation, transport and any bond or service obligation before you accept an offer.'
        ]
      };
    }
    if (stage === 'postcsec') {
      return {
        title: 'After CSEC',
        bullets: [
          'This is the fork: Sixth Form, technical institute, work-plus-study, or a direct programme.',
          'Compare published entry rules, calendars, location and cost - not only what friends are doing.',
          'If results are pending, use programmes that accept applications before grades arrive.',
          'Keep English and Mathematics evidence ready for every route that asks for them.'
        ]
      };
    }
    if (stage === 'postcape') {
      return {
        title: 'After CAPE',
        bullets: [
          'Enrol, start work, or take a bridging route. Confirm the live offer letter conditions.',
          'If you are waiting on results or funding, pick one holding action so the year does not drift.',
          'Recheck programme pages before registration day - conditions change.',
          'Keep certificates and transcripts in one folder for applications and employers.'
        ]
      };
    }
    if (stage === 'out') {
      return {
        title: 'Out of school',
        bullets: [
          'Lead with open intakes: GROW, BIT, GTI SCCP and experience routes, and the TVET Hub.',
          'Record your last point of contact with school and whether you wrote CSEC.',
          'Pick one application this month. A rolling intake beats waiting for a perfect plan.',
          'You do not need a Forms 1 to 6 map. You need the next window that will take you.'
        ]
      };
    }
    return { title: 'Your stage', bullets: [] };
  }

  function threeActions(orderedOpps, servesLean, age, outOfSchool) {
    var picks = [];
    var used = {};
    function take(pred) {
      for (var i = 0; i < orderedOpps.length; i++) {
        var o = orderedOpps[i];
        if (used[o.id]) continue;
        if (!oppAvailable(o, age)) continue;
        if (pred && !pred(o)) continue;
        used[o.id] = 1;
        picks.push(o);
        if (picks.length >= 3) return;
      }
    }
    if (outOfSchool) {
      take(function (o) { return /bit|goal|gti|tvet/i.test(o.id + o.t); });
    }
    if (servesLean === 'practical') take(function (o) { return o.serves === 'practical' || o.serves === 'both'; });
    else if (servesLean === 'academic') take(function (o) { return o.serves === 'academic' || o.serves === 'both'; });
    take(null);
    return picks.slice(0, 3);
  }

  function moodLine(stage, core) {
    var sn = stageNum(stage);
    if (!core.length) return '';
    var top = core.slice(0, 3);
    if (sn > 0 && sn <= 2) {
      /* information mood */
      if (top.length === 1) {
        return 'Your kept careers list ' + top[0].subject + ' as a helpful subject.';
      }
      return 'All ' + (top[0].total || '') + ' of these list ' + top.map(function (x) { return x.subject; }).join(', ').replace(/, ([^,]*)$/, ' and $1') + ' as helpful subjects.';
    }
    /* instruction mood Form 3+ */
    var names = top.map(function (x) { return x.subject; }).join(' and ');
    return 'To keep these open you need ' + names + ' at CSEC. Check the exact rule on the programme page.';
  }

  function whySeeingThis(v, sc, keptCareers) {
    var lines = [];
    var curious = (sc && sc.curious) || [];
    if (curious.length) {
      var labels = curious.slice(0, 2).map(function (k) {
        var b = checkToBucket(k);
        var q = (N.Q8 || []).filter(function (x) { return x.key === b || x.check === k; })[0];
        return q ? q.label : k;
      });
      if (labels.length) lines.push('You ranked ' + labels.join(', then ') + ' first.');
    }
    var routeCounts = {};
    keptCareers.forEach(function (c) {
      routeCounts[c.routeType] = (routeCounts[c.routeType] || 0) + 1;
    });
    var certish = (routeCounts.certificate || 0) + (routeCounts.apprenticeship || 0) + (routeCounts['none-needed'] || 0);
    if (keptCareers.length >= 3 && certish >= Math.ceil(keptCareers.length * 0.6)) {
      lines.push('You have kept ' + keptCareers.length + ' careers and ' + certish + ' of them are certificate or apprenticeship routes, so we put those nearer the top.');
    } else if (keptCareers.length) {
      lines.push('You have kept ' + keptCareers.length + ' careers, so shared subjects and route types shape the order.');
    }
    if (v.earnSoon >= 4) {
      lines.push('You told us you would like to start earning soon, so routes that reach a wage faster come first.');
    }
    var core = subjectCore(keptCareers);
    if (core[0] && core[0].n >= 2) {
      lines.push(core[0].n + ' of your ' + keptCareers.length + ' list ' + core[0].subject + ' as a helpful subject.');
    }
    if (v.judged < 6) {
      lines.push('We have not seen enough keeps and passes yet to lean hard on revealed preference. Declared interests still shape the order lightly.');
    }
    lines.push('Nothing is hidden from you - every career and every bucket is still there, just in a different order.');
    return lines;
  }

  function effectiveFact(prof, sch, key) {
    var ov = (prof && prof.schoolOverride) || {};
    var sf = (prof && prof.schoolFacts) || {};
    if (ov[key] != null) return ov[key];
    if (sf[key] != null) return sf[key];
    if (key === 'cvq') return sch && sch.offersCVQ;
    if (key === 'dorm') return sch && sch.dormitory;
    if (key === 'sixth') return sch && sch.sixthForm;
    return 'unknown';
  }

  function schoolFactNavi(v, keptCareers, stage) {
    var sn = String(stageNum(stage));
    var asked = v.naviAsked[sn] || [];
    function notAsked(id) { return asked.indexOf(id) === -1; }
    var prof = loadProfile();
    var sch = schoolById(prof && prof.schoolId);
    if (!sch || (sch.id === 'not-listed')) return null;
    var stageN = stageNum(stage);
    var region = (prof && prof.schoolFacts && prof.schoolFacts.region) || sch.region;
    var hinterland = [1, 7, 8, 9].indexOf(Number(region)) !== -1;

    var needsCvq = keptCareers.some(function (c) {
      var buckets = c.buckets || c.keys || [];
      return buckets.indexOf('trade') !== -1 || /cvq|tvet|trade/i.test((c.t || '') + ' ' + (c.what || '') + ' ' + (c.post || ''));
    });
    var needsCape = keptCareers.some(function (c) {
      return (c.capeSubjects && c.capeSubjects.length) || /cape|sixth|form 6/i.test((c.formalEntry || '') + ' ' + (c.post || ''));
    });
    var needsRelo = keptCareers.some(function (c) { return c.requiresRelocation === true; });

    var ov = (prof && prof.schoolOverride) || {};
    /* Student answer already beats the file - do not re-ask once they have answered. */
    var cvq = effectiveFact(prof, sch, 'cvq');
    if (needsCvq && notAsked('school-cvq') && ov.cvq == null) {
      var cvqText = (cvq === 'yes' || cvq === 'Yes')
        ? 'Our records say your school offers CVQ subjects. Is that right?'
        : (cvq === 'no' || cvq === 'No')
          ? 'Our records say your school does not offer CVQ subjects. Is that right?'
          : 'Does your school offer CVQ subjects?';
      return { id: 'school-cvq', text: cvqText, options: [
        { v: 'Yes', t: 'Yes' }, { v: 'No', t: 'No' }, { v: 'Not sure', t: 'Not sure' }
      ]};
    }

    var sixth = effectiveFact(prof, sch, 'sixth');
    if ((stageN >= 3 || needsCape) && notAsked('school-sixth') && ov.sixth == null) {
      if (sixth === 'yes' || sixth === 'Yes') {
        return { id: 'school-sixth', text: 'Our records say your school offers CAPE. Is that right?', options: [
          { v: 'Yes', t: 'Yes' }, { v: 'No', t: 'No' }, { v: 'Not sure', t: 'Not sure' }
        ]};
      }
      return { id: 'school-sixth', text: 'Does your school have a sixth form for CAPE?', options: [
        { v: 'Yes', t: 'Yes' }, { v: 'No', t: 'No' }, { v: 'Not sure', t: 'Not sure' }
      ]};
    }

    var dorm = effectiveFact(prof, sch, 'dorm');
    if ((hinterland || needsRelo) && notAsked('school-dorm') && ov.dorm == null) {
      var dormText = (dorm === 'yes' || dorm === 'Yes')
        ? 'Our records say there is a dormitory at your school. Is that right?'
        : (dorm === 'no' || dorm === 'No')
          ? 'Our records say there is no dormitory at your school. Is that right?'
          : 'Is there a dormitory at your school?';
      return { id: 'school-dorm', text: dormText, options: [
        { v: 'Yes', t: 'Yes' }, { v: 'No', t: 'No' }, { v: 'Not sure', t: 'Not sure' }
      ]};
    }

    /* Certainty re-ask when stage changed since named career was set. */
    try {
      var sc = loadSelfcheck() || {};
      var nc = sc.namedCareer;
      if (nc && nc.id && !nc.notYet && nc.stageWhenSet && nc.stageWhenSet !== stage && notAsked('named-certainty')) {
        return { id: 'named-certainty', text: 'You named ' + (nc.title || 'a job') + ' earlier. How set are you on it now?', options: [
          { v: '1', t: 'Someone asked and I said it' },
          { v: '2', t: 'It is an idea I like' },
          { v: '3', t: 'I am fairly set on it' },
          { v: '4', t: 'This is the plan' }
        ]};
      }
    } catch (e) {}
    return null;
  }

  function pickNaviQuestion(v, keptCareers, stage) {
    var schoolQ = schoolFactNavi(v, keptCareers, stage);
    if (schoolQ) return schoolQ;
    var sn = String(stageNum(stage));
    var asked = v.naviAsked[sn] || [];
    function notAsked(id) { return asked.indexOf(id) === -1; }

    var bucketCounts = {};
    keptCareers.forEach(function (c) {
      (c.buckets || c.keys || []).forEach(function (b) {
        bucketCounts[b] = (bucketCounts[b] || 0) + 1;
      });
    });
    var topBucket = Object.keys(bucketCounts).sort(function (a, b) { return bucketCounts[b] - bucketCounts[a]; })[0];
    if (topBucket && bucketCounts[topBucket] >= 3 && notAsked('abroad')) {
      return { id: 'abroad', text: 'Would you study in Guyana, or would you go abroad?', options: [
        { v: 'guyana', t: 'Stay in Guyana' },
        { v: 'abroad', t: 'Open to abroad' },
        { v: 'unsure', t: 'Not sure yet' }
      ]};
    }
    if (keptCareers.some(function (c) { return c.obligationMonths; }) && notAsked('obligation')) {
      return { id: 'obligation', text: 'Some of these tie you to a few years of service afterwards. Is that all right with you?', options: [
        { v: 'ok', t: 'That is all right' },
        { v: 'prefer-not', t: 'Prefer routes without a bond' },
        { v: 'unsure', t: 'Not sure yet' }
      ]};
    }
    var coastalOnly = keptCareers.filter(function (c) {
      var w = c.studyWhere || [];
      return w.indexOf('coastal') !== -1 && w.length === 1;
    });
    if (coastalOnly.length && notAsked('coastal')) {
      return { id: 'coastal', text: 'Could you move to Georgetown or another town to study?', options: [
        { v: 'yes', t: 'Yes, I could move' },
        { v: 'no', t: 'I need a local or online route' },
        { v: 'unsure', t: 'Not sure yet' }
      ]};
    }
    if (v.costSensitive >= 3 && notAsked('free')) {
      return { id: 'free', text: 'Free tuition applies to approved students at UG from 2025, and GSA removed tuition fees in 2026. Shall we lead with free routes?', options: [
        { v: 'yes', t: 'Yes, lead with free routes' },
        { v: 'no', t: 'Keep the current mix' }
      ]};
    }
    if (notAsked('tte')) {
      return { id: 'tte', text: 'When would you like to start earning?', options: [
        { v: 'soon', t: 'As soon as I can after school' },
        { v: 'training', t: 'A few years of training is fine' },
        { v: 'long', t: 'I do not mind studying for a long time' },
        { v: 'unsure', t: 'Not sure yet' }
      ]};
    }
    return null;
  }

  function answerNavi(qid, value, stage) {
    var v = loadPref();
    var sn = String(stageNum(stage));
    v.naviAsked[sn] = v.naviAsked[sn] || [];
    if (v.naviAsked[sn].indexOf(qid) === -1) v.naviAsked[sn].push(qid);
    if (qid === 'abroad') v.abroadOk = value === 'abroad' ? true : value === 'guyana' ? false : null;
    if (qid === 'obligation') v.obligationOk = value === 'ok' ? true : value === 'prefer-not' ? false : null;
    if (qid === 'coastal') v.coastalMoveOk = value === 'yes' ? true : value === 'no' ? false : null;
    if (qid === 'free') v.leadFreeRoutes = value === 'yes';
    if (qid === 'tte') {
      try {
        var sc = loadSelfcheck() || {};
        sc.timeToEarning = value === 'unsure' ? null : value;
        localStorage.setItem('nsg_selfcheck', JSON.stringify(sc));
      } catch (e) {}
    }
    if (qid === 'school-cvq' || qid === 'school-dorm' || qid === 'school-sixth') {
      var map = { 'school-cvq': 'cvq', 'school-dorm': 'dorm', 'school-sixth': 'sixth' };
      if (value !== 'skip') {
        try {
          var prof = loadProfile() || { subjects: [], schoolId: null, schoolOverride: {}, age: null, schoolFacts: {} };
          prof.schoolFacts = prof.schoolFacts || {};
          prof.schoolOverride = prof.schoolOverride || {};
          prof.schoolFacts[map[qid]] = value;
          prof.schoolOverride[map[qid]] = value; /* student beats the file */
          localStorage.setItem('nsg_profile', JSON.stringify(prof));
        } catch (e2) {}
      }
    }
    if (qid === 'named-certainty' && value !== 'skip') {
      try {
        var sc2 = loadSelfcheck() || {};
        if (sc2.namedCareer) {
          sc2.namedCareer.certainty = parseInt(value, 10);
          sc2.namedCareer.stageWhenSet = stage;
          localStorage.setItem('nsg_selfcheck', JSON.stringify(sc2));
        }
      } catch (e3) {}
    }
    savePref(v);
    return derivePlan();
  }

  function inferencePrompt(v, stage) {
    var sn = String(stageNum(stage));
    if ((v.judged || 0) < 6) return null;
    if (v.inferenceShown[sn]) return null;
    var hands = v.handsOn > v.academic + 2;
    var acad = v.academic > v.handsOn + 2;
    var soon = v.earnSoon >= 4;
    var text;
    if (hands && soon) {
      text = 'You have been keeping mostly short, hands-on routes where you start earning sooner. Is that right?';
    } else if (hands) {
      text = 'You have been keeping mostly hands-on, practical routes. Is that right?';
    } else if (acad) {
      text = 'You have been keeping mostly study-heavy, academic routes. Is that right?';
    } else {
      text = 'You have been keeping a mix of routes so far. Is that right?';
    }
    return {
      text: text,
      options: [
        { v: 'yes', t: 'Yes, more like that' },
        { v: 'both', t: 'Show me more of both' }
      ]
    };
  }

  function answerInference(value, stage) {
    var v = loadPref();
    var sn = String(stageNum(stage));
    v.inferenceShown[sn] = true;
    if (value === 'both') v.flatten = true;
    savePref(v);
    return derivePlan();
  }

  /* Opportunity signals */
  function saveOpportunity(id) {
    var o = loadOpps();
    if (o.saved.indexOf(id) === -1) o.saved.push(id);
    o.dismissed = o.dismissed.filter(function (x) { return x !== id; });
    saveOpps(o);
    return derivePlan();
  }

  function dismissOpportunity(id) {
    var o = loadOpps();
    if (o.dismissed.indexOf(id) === -1) o.dismissed.push(id);
    o.saved = o.saved.filter(function (x) { return x !== id; });
    saveOpps(o);
    return derivePlan();
  }

  function markOpportunityDone(id, opts) {
    opts = opts || {};
    var o = loadOpps();
    if (o.done.indexOf(id) === -1) o.done.push(id);
    o.saved = o.saved.filter(function (x) { return x !== id; });
    saveOpps(o);
    var opp = oppById(id);
    var offer = null;
    if (opp && !opts.skipOffer) {
      offer = {
        prompt: 'Add this to your record?',
        prefill: {
          title: opp.t,
          org: '',
          type: opp.fillsSlot ? ({ sport: 'Sport', instrument: 'Music', volunteering: 'Volunteering', language: 'Language' }[opp.fillsSlot] || 'Activity') : 'Activity',
          hoursPerWeek: opp.hoursPerWeek,
          level: opp.entryRoute === 'district-round' ? 'District / regional round' : (opp.entryRoute || ''),
          forms: null
        }
      };
    }
    return { plan: derivePlan(), profileOffer: offer };
  }

  function fillSlot(slot, oppId) {
    var o = loadOpps();
    o.slots = o.slots || {};
    o.slots[slot] = oppId || true;
    saveOpps(o);
    return derivePlan();
  }

  function derivePlan(opts) {
    opts = opts || {};
    var sc = opts.selfcheck || loadSelfcheck();
    var north = opts.north || loadNorth() || { kept: [], passed: [], opened: [], goals: [] };
    var profile = opts.profile || loadProfile();
    var answers = opts.answers || (sc && sc.rawAnswers) || {};
    var myplan = loadMyPlan() || {};

    var stage = (sc && sc.stage) || myplan.stage || (answers.stage && answers.stage[0]) || 'form1';
    var out = isOutOfSchool(answers, sc);
    var v = rebuildVector({ selfcheck: sc, answers: answers, north: north, opps: loadOpps() });

    var keptCareers = (north.kept || []).map(careerById).filter(Boolean);
    var core = subjectCore(keptCareers);
    var gapList = gaps(core, profile.subjects || myplan.subjects || []);
    var age = profile.age != null ? profile.age : null;
    var orderedCareers = orderCareers(N.CAREERS, v);
    var orderedOpps = orderOpportunities(N.OPPORTUNITIES, v, age);
    var servesLean = v.handsOn > v.academic + 1 ? 'practical' : (v.academic > v.handsOn + 1 ? 'academic' : 'both');
    var actions = threeActions(orderedOpps, servesLean, age, out);
    var school = schoolById(profile.schoolId);
    if (profile.schoolOverride) school = Object.assign({}, school || {}, profile.schoolOverride);

    var plan = {
      where: {
        stage: stage,
        stageNum: stageNum(stage),
        outOfSchool: out,
        lastSchoolContact: (sc && sc.lastSchoolContact) || answers.lastAttended || null,
        wroteCsec: (sc && sc.wroteCsec) || answers.wroteCsec || null,
        workingNow: (sc && sc.workingNow) || answers.workingNow || null
      },
      nextDecision: nextDecision(stage, out),
      subjectCore: core,
      gaps: gapList,
      moodLine: moodLine(stage, core),
      stageBody: stageBodyFromV3(out ? 'out' : stage),
      actions: actions,
      orderedCareers: orderedCareers,
      orderedOpportunities: orderedOpps.map(function (o) {
        return Object.assign({}, o, { available: oppAvailable(o, age), belowAge: age != null && o.ageFrom != null && age < o.ageFrom });
      }),
      keptCareers: keptCareers,
      preference: v,
      why: whySeeingThis(v, sc, keptCareers),
      naviQuestion: pickNaviQuestion(v, keptCareers, stage),
      inference: inferencePrompt(v, stage),
      school: school ? {
        id: school.id,
        name: school.name,
        region: school.region,
        offersCvq: school.offersCvq,
        dormitory: school.dormitory
      } : null,
      facts: N.V3_FACTS,
      leadRoutes: out ? ['goal-grow', 'bit-taster', 'gti-open', 'tvet-hub'] : null,
      emptyKept: keptCareers.length === 0,
      emptyMessage: keptCareers.length === 0 ? 'Open a deck and keep a few careers. Your plan is built from what those careers share.' : null,
      disclaimer: N.V3_FACTS.disclaimer
    };
    return plan;
  }

  function exportRecord() {
    return {
      exportedAt: new Date().toISOString(),
      selfcheck: loadSelfcheck(),
      myplan: loadMyPlan(),
      profile: loadProfile(),
      northStar: loadNorth(),
      opportunities: loadOpps(),
      preference: loadPref(),
      derived: derivePlan()
    };
  }

  function validateLanguage(blob) {
    var errors = [];
    var s = typeof blob === 'string' ? blob : JSON.stringify(blob);
    if (EM_DASH.test(s)) errors.push('em dash');
    if (AMERICAN.test(s)) errors.push('American spelling');
    return errors;
  }

  /* Build check: fail on changelog src / em dash / American spelling in engine surfaces */
  function buildCheck() {
    var errors = N.validateCareers(N.CAREERS) || [];
    N.OPPORTUNITIES.forEach(function (o) {
      if (!o.serves) errors.push(o.id + ': missing serves');
      if (!o.buckets || !o.buckets.length) errors.push(o.id + ': missing buckets');
      if (!o.entryRoute) errors.push(o.id + ': missing entryRoute');
      var lang = validateLanguage(o);
      lang.forEach(function (e) { errors.push(o.id + ': ' + e); });
    });
    return errors;
  }

  var errs = buildCheck();
  if (errs.length) {
    console.error('[nsg-plan-engine] build check', errs);
    throw new Error('nsg-plan-engine build check failed: ' + errs.length);
  }

  global.NSG_ENGINE = {
    derivePlan: derivePlan,
    rebuildVector: rebuildVector,
    orderCareers: orderCareers,
    orderOpportunities: orderOpportunities,
    scoreCareer: scoreCareer,
    saveOpportunity: saveOpportunity,
    dismissOpportunity: dismissOpportunity,
    markOpportunityDone: markOpportunityDone,
    fillSlot: fillSlot,
    answerNavi: answerNavi,
    answerInference: answerInference,
    matchSchool: matchSchool,
    schoolById: schoolById,
    careerById: careerById,
    oppById: oppById,
    loadPref: loadPref,
    savePref: savePref,
    loadOpps: loadOpps,
    loadProfile: loadProfile,
    saveProfile: saveProfile,
    loadMyPlanFlags: loadMyPlanFlags,
    migrateMyPlan: migrateMyPlan,
    exportRecord: exportRecord,
    buildCheck: buildCheck,
    validateLanguage: validateLanguage,
    stageNum: stageNum,
    namedCareerWeight: namedCareerWeight,
    normalizeSubjectRecord: normalizeSubjectRecord,
    gaps: gaps,
    PREF_STORE: PREF_STORE,
    OPP_STORE: OPP_STORE,
    PROFILE_STORE: PROFILE_STORE,
    MYPLAN_STORE: MYPLAN_STORE
  };
})(typeof window !== 'undefined' ? window : globalThis);
