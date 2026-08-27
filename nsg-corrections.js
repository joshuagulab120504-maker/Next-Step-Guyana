/* Local school facts write immediately via schoolOverride / schoolFacts.
   National career and opportunity facts only open WhatsApp and mark contested in-session.
   OWNERSHIP: a named person must triage WhatsApp reports weekly, edit CareersV3.md /
   Opportunities.md / guyana-schools.json, re-run extract, commit and deploy.
   Without that slot this control is theatre - keep the number current. */
(function (global) {
  'use strict';
  var WA = '5926000000'; /* replace with live Next Step WhatsApp number */

  function prefilledUrl(payload) {
    var lines = [
      'Something looks wrong on Next Step Guyana.',
      'Record: ' + (payload.recordType || 'unknown') + ' / ' + (payload.recordId || ''),
      'Field: ' + (payload.field || ''),
      'Shown: ' + (payload.valueShown == null ? '' : String(payload.valueShown)),
      'Page: ' + (payload.page || (typeof location !== 'undefined' ? location.pathname : '')),
      'Date: ' + (payload.date || new Date().toISOString().slice(0, 10)),
      '',
      'My note: '
    ];
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  function openReport(payload) {
    var url = prefilledUrl(payload);
    if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener');
    return url;
  }

  /* Local school facts: student answer wins immediately. */
  function writeSchoolFact(key, value) {
    var map = { cvq: 'cvq', dorm: 'dorm', sixth: 'sixth', offersCVQ: 'cvq', dormitory: 'dorm', sixthForm: 'sixth' };
    var k = map[key] || key;
    var prof = { subjects: [], schoolId: null, schoolOverride: null, age: null, schoolFacts: {} };
    try {
      var raw = JSON.parse(localStorage.getItem('nsg_profile') || 'null');
      if (raw && typeof raw === 'object' && ('schoolId' in raw || 'subjects' in raw || 'schoolFacts' in raw)) {
        prof = {
          subjects: raw.subjects || [],
          schoolId: raw.schoolId || null,
          schoolOverride: raw.schoolOverride || {},
          age: raw.age != null ? raw.age : null,
          schoolFacts: raw.schoolFacts || {}
        };
      }
    } catch (e) {}
    if (!prof.schoolFacts || typeof prof.schoolFacts !== 'object') prof.schoolFacts = {};
    if (!prof.schoolOverride || typeof prof.schoolOverride !== 'object') prof.schoolOverride = {};
    prof.schoolFacts[k] = value;
    prof.schoolOverride[k] = value;
    localStorage.setItem('nsg_profile', JSON.stringify(prof));
    openReport({
      recordType: 'school',
      recordId: prof.schoolId,
      field: k,
      valueShown: value,
      page: typeof location !== 'undefined' ? location.pathname : 'school'
    });
    return prof;
  }

  /* National career/opportunity facts: never mutate value; mark contested in session only. */
  function contestNational(payload) {
    var key = 'nsg_contested';
    var list = [];
    try { list = JSON.parse(localStorage.getItem(key) || '[]') || []; } catch (e) {}
    list.push({
      recordType: payload.recordType,
      recordId: payload.recordId,
      field: payload.field,
      valueShown: payload.valueShown,
      at: new Date().toISOString()
    });
    localStorage.setItem(key, JSON.stringify(list));
    openReport(payload);
    return list;
  }

  function isContested(recordType, recordId, field) {
    try {
      var list = JSON.parse(localStorage.getItem('nsg_contested') || '[]') || [];
      return list.some(function (x) {
        return x.recordType === recordType && x.recordId === recordId && x.field === field;
      });
    } catch (e) { return false; }
  }

  global.NSG_CORRECTIONS = {
    prefilledUrl: prefilledUrl,
    openReport: openReport,
    writeSchoolFact: writeSchoolFact,
    contestNational: contestNational,
    isContested: isContested,
    WA: WA
  };
})(typeof window !== 'undefined' ? window : globalThis);
