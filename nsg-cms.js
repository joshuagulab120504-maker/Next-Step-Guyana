/* Next Step Guyana CMS store.
   Persists admin/mentor edits in localStorage and applies them to app globals.
   Student feed prototype still avoids localStorage for its own UI state. */
(function (global) {
  'use strict';

  var KEY = 'nsg_cms_v1';
  var AUTH_KEY = 'nsg_auth_v1';

  var ACCOUNTS = [
    {
      email: 'admin@nextstep.gy',
      pass: 'admin',
      role: 'admin',
      name: 'Site Admin'
    },
    {
      email: 'mentor@nextstep.gy',
      pass: 'mentor',
      role: 'mentor',
      authorId: 'raeka',
      name: 'Raeka Persaud'
    },
    {
      email: 'omar@nextstep.gy',
      pass: 'mentor',
      role: 'mentor',
      authorId: 'omar',
      name: 'Omar Khan'
    },
    {
      email: 'keisha@nextstep.gy',
      pass: 'mentor',
      role: 'mentor',
      authorId: 'keisha',
      name: 'Keisha Daniels'
    },
    {
      email: 'student@nextstep.gy',
      pass: 'student',
      role: 'student',
      name: 'Student'
    }
  ];

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function emptyStore() {
    return {
      version: 1,
      dirty: false,
      stages: null,
      cats: null,
      authors: null,
      journeys: null,
      opps: null,
      sessions: null,
      feed: null,
      slots: null,
      careerUpserts: {},
      careerDeletes: [],
      schoolUpserts: {},
      schoolDeletes: []
    };
  }

  function loadRaw() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveRaw(store) {
    try {
      if (!global.localStorage) return false;
      global.localStorage.setItem(KEY, JSON.stringify(store));
      return true;
    } catch (e) {
      return false;
    }
  }

  function seedFromGlobals() {
    var s = emptyStore();
    if (typeof STAGES !== 'undefined') s.stages = clone(STAGES);
    if (typeof CATS !== 'undefined') s.cats = clone(CATS);
    if (typeof AUTHORS !== 'undefined') s.authors = clone(AUTHORS);
    if (typeof JOURNEYS !== 'undefined') s.journeys = clone(JOURNEYS);
    if (typeof OPPS !== 'undefined') s.opps = clone(OPPS);
    if (typeof SESSIONS !== 'undefined') s.sessions = clone(SESSIONS);
    if (typeof FEED !== 'undefined') s.feed = clone(FEED);
    if (typeof SLOTS !== 'undefined') s.slots = clone(SLOTS);
    return s;
  }

  function loadWorking() {
    var saved = loadRaw();
    var seed = seedFromGlobals();
    if (!saved) return seed;
    var out = emptyStore();
    out.dirty = !!saved.dirty;
    out.stages = saved.stages || seed.stages;
    out.cats = saved.cats || seed.cats;
    out.authors = saved.authors || seed.authors;
    out.journeys = saved.journeys || seed.journeys;
    out.opps = saved.opps || seed.opps;
    out.sessions = saved.sessions || seed.sessions;
    out.feed = saved.feed || seed.feed;
    out.slots = saved.slots || seed.slots;
    out.careerUpserts = saved.careerUpserts || {};
    out.careerDeletes = saved.careerDeletes || [];
    out.schoolUpserts = saved.schoolUpserts || {};
    out.schoolDeletes = saved.schoolDeletes || [];
    return out;
  }

  function persist(store) {
    store.dirty = true;
    return saveRaw(store);
  }

  function reset() {
    try {
      if (global.localStorage) global.localStorage.removeItem(KEY);
    } catch (e) {}
    return seedFromGlobals();
  }

  function applyListPatches(list, upserts, deletes) {
    if (!list || !list.length) return list;
    var del = {};
    var i;
    for (i = 0; i < (deletes || []).length; i++) del[deletes[i]] = true;
    var out = [];
    var seen = {};
    for (i = 0; i < list.length; i++) {
      var row = list[i];
      if (!row || !row.id || del[row.id]) continue;
      if (upserts && upserts[row.id]) {
        out.push(clone(upserts[row.id]));
        seen[row.id] = true;
      } else {
        out.push(row);
        seen[row.id] = true;
      }
    }
    if (upserts) {
      for (var id in upserts) {
        if (!Object.prototype.hasOwnProperty.call(upserts, id)) continue;
        if (seen[id] || del[id]) continue;
        out.push(clone(upserts[id]));
      }
    }
    return out;
  }

  function applyAppGlobals() {
    var store = loadRaw();
    if (!store || !store.dirty) return false;

    if (store.stages && typeof STAGES !== 'undefined') {
      global.STAGES = store.stages;
    }
    if (store.cats && typeof CATS !== 'undefined') {
      global.CATS = store.cats;
    }
    if (store.authors && typeof AUTHORS !== 'undefined') {
      global.AUTHORS = store.authors;
    }
    if (store.journeys && typeof JOURNEYS !== 'undefined') {
      global.JOURNEYS = store.journeys;
    }
    if (store.opps && typeof OPPS !== 'undefined') {
      global.OPPS = store.opps;
    }
    if (store.sessions && typeof SESSIONS !== 'undefined') {
      global.SESSIONS = store.sessions;
    }
    if (store.feed && typeof FEED !== 'undefined') {
      global.FEED = store.feed;
    }
    if (store.slots && typeof SLOTS !== 'undefined') {
      global.SLOTS = store.slots;
    }

    var careers = global.CAREERS || global.NSG_CAREERS_V3;
    if (careers && (store.careerUpserts || store.careerDeletes)) {
      var nextCareers = applyListPatches(
        careers,
        store.careerUpserts,
        store.careerDeletes
      );
      global.CAREERS = nextCareers;
      global.NSG_CAREERS_V3 = nextCareers;
    }

    if (
      global.NSG_SCHOOLS &&
      global.NSG_SCHOOLS.SCHOOLS &&
      (store.schoolUpserts || store.schoolDeletes)
    ) {
      global.NSG_SCHOOLS.SCHOOLS = applyListPatches(
        global.NSG_SCHOOLS.SCHOOLS,
        store.schoolUpserts,
        store.schoolDeletes
      );
    }

    return true;
  }

  function normalizeEmail(v) {
    return String(v || '')
      .trim()
      .toLowerCase();
  }

  function login(email, pass) {
    var e = normalizeEmail(email);
    var p = String(pass || '');
    var i;
    for (i = 0; i < ACCOUNTS.length; i++) {
      var a = ACCOUNTS[i];
      if (normalizeEmail(a.email) === e && a.pass === p) {
        var session = {
          email: a.email,
          role: a.role,
          name: a.name,
          authorId: a.authorId || null,
          at: Date.now()
        };
        try {
          if (global.localStorage) {
            global.localStorage.setItem(AUTH_KEY, JSON.stringify(session));
          }
        } catch (err) {}
        return session;
      }
    }
    return null;
  }

  function logout() {
    try {
      if (global.localStorage) global.localStorage.removeItem(AUTH_KEY);
    } catch (e) {}
  }

  function currentUser() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function routeForRole(role) {
    if (role === 'admin' || role === 'mentor') return 'admin.html';
    return 'app.html';
  }

  global.NSG_CMS = {
    KEY: KEY,
    ACCOUNTS: ACCOUNTS,
    clone: clone,
    emptyStore: emptyStore,
    seedFromGlobals: seedFromGlobals,
    loadWorking: loadWorking,
    persist: persist,
    reset: reset,
    applyAppGlobals: applyAppGlobals,
    login: login,
    logout: logout,
    currentUser: currentUser,
    routeForRole: routeForRole
  };
})(typeof window !== 'undefined' ? window : globalThis);
