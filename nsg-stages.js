/* nsg-stages.js - single source for student stage enum.
   Load before check.html logic, my-plan, plan-engine, parent-landing, my-sessions. */
(function (global) {
  'use strict';

  var STAGES = [
    { v: 'form1', t: 'Form 1' },
    { v: 'form2', t: 'Form 2' },
    { v: 'form3', t: 'Form 3' },
    { v: 'form4', t: 'Form 4' },
    { v: 'form5', t: 'Form 5 / CSEC' },
    { v: 'postcsec', t: 'Just finished CSEC' },
    { v: 'lowersixth', t: 'Lower Sixth Form / CAPE' },
    { v: 'uppersixth', t: 'Upper Sixth Form / CAPE' },
    { v: 'postcape', t: 'Just finished CAPE' },
    { v: 'out', t: 'I am not in school right now' }
  ];

  var ALIASES = {
    lower: 'form1',
    form12: 'form1',
    'form1-2': 'form1',
    streamchoice: 'form3',
    f4: 'form4',
    f5: 'form5',
    post: 'postcsec',
    cape: 'lowersixth',
    sixthform: 'lowersixth',
    outofschool: 'out',
    'out-of-school': 'out'
  };

  var LABELS = {};
  STAGES.forEach(function (s) { LABELS[s.v] = s.t; });
  LABELS.form12 = LABELS.form1;
  LABELS.lower = LABELS.form1;

  /* My Plan timeline chrome: numeric band for in-school stages; out is its own chrome. */
  var PLAN_BAND = {
    form1: { band: 1, label: 'Form 1' },
    form2: { band: 2, label: 'Form 2' },
    form3: { band: 3, label: 'Form 3' },
    form4: { band: 4, label: 'Form 4' },
    form5: { band: 5, label: 'Form 5' },
    postcsec: { band: 6, label: 'After CSEC' },
    lowersixth: { band: 7, label: 'Lower Sixth' },
    uppersixth: { band: 8, label: 'Upper Sixth' },
    postcape: { band: 9, label: 'After CAPE' },
    out: { band: null, label: 'Out of school', chrome: 'out' }
  };

  function normalizeStage(s) {
    if (!s) return 'form1';
    return ALIASES[s] || s;
  }

  function isKnownStage(s) {
    s = normalizeStage(s);
    return !!PLAN_BAND[s];
  }

  function stageLabel(s) {
    s = normalizeStage(s);
    return LABELS[s] || s;
  }

  function planBand(s) {
    s = normalizeStage(s);
    return PLAN_BAND[s] || null;
  }

  function isOutOfSchool(s) {
    return normalizeStage(s) === 'out';
  }

  /** Rough numeric for ordering / legacy UI that used 1-6. Out returns 0. */
  function stageNum(s) {
    var b = planBand(s);
    if (!b) return 1;
    if (b.chrome === 'out') return 0;
    return b.band;
  }

  global.NSG_STAGES = {
    STAGES: STAGES,
    ALIASES: ALIASES,
    LABELS: LABELS,
    PLAN_BAND: PLAN_BAND,
    normalizeStage: normalizeStage,
    isKnownStage: isKnownStage,
    stageLabel: stageLabel,
    planBand: planBand,
    isOutOfSchool: isOutOfSchool,
    stageNum: stageNum
  };
})(typeof window !== 'undefined' ? window : globalThis);
