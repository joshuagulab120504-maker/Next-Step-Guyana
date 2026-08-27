/* nsg-provenance.js - field-level provenance helpers. Shape ready before backend. */
(function (global) {
  'use strict';

  var STATUS = ['confirmed', 'varies', 'not-published', 'contested'];
  var EXPIRY_MONTHS = {
    entry: 12,
    fees: 6,
    intake: 6,
    default: 12
  };

  function field(value, status, src, lastVerified, kind) {
    return {
      value: value,
      status: status || (value == null ? 'not-published' : 'confirmed'),
      src: src || [],
      lastVerified: lastVerified || null,
      kind: kind || 'default'
    };
  }

  function monthsBetween(iso) {
    if (!iso) return Infinity;
    var d = new Date(iso);
    if (isNaN(d.getTime())) return Infinity;
    var now = new Date();
    return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
  }

  function isStale(f) {
    if (!f || !f.lastVerified) return false;
    var limit = EXPIRY_MONTHS[f.kind] || EXPIRY_MONTHS.default;
    return monthsBetween(f.lastVerified) > limit;
  }

  function staleLine(f) {
    if (!f || !f.lastVerified) return '';
    var d = new Date(f.lastVerified);
    var label = isNaN(d.getTime()) ? f.lastVerified : d.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
    return 'Last checked ' + label + '. Check the programme page before you act on this.';
  }

  function statusLabel(status) {
    if (status === 'contested') return 'This has been queried and we are checking it.';
    if (status === 'varies' || status === 'varies-by-intake') return 'This varies by intake.';
    if (status === 'not-published') return 'Not published on a source we can cite yet.';
    return '';
  }

  /* Wrap a legacy career into fields{} without losing flat values. */
  function careerFields(c, verifiedDate) {
    verifiedDate = verifiedDate || (global.NSG_NORTH && NSG_NORTH.VERIFIED) || null;
    if (c.fields) return c.fields;
    return {
      title: field(c.t, 'confirmed', [], verifiedDate, 'entry'),
      csecRecommended: field(c.csecRecommended || c.subjects || null, c.csecRecommended ? 'confirmed' : 'not-published', [], verifiedDate, 'entry'),
      formalEntry: field(c.formalEntry || null, c.formalEntry ? 'confirmed' : 'not-published', [], verifiedDate, 'entry'),
      fees: field(null, 'not-published', [], verifiedDate, 'fees'),
      obligationMonths: field(c.obligationMonths != null ? c.obligationMonths : null, c.obligationMonths != null ? 'varies' : 'not-published', [], verifiedDate, 'entry')
    };
  }

  function renderFieldNote(f) {
    if (!f) return '';
    var parts = [];
    if (f.status === 'contested' || (global.NSG_CORRECTIONS && false)) parts.push(statusLabel('contested'));
    else if (f.status && f.status !== 'confirmed') parts.push(statusLabel(f.status));
    if (isStale(f)) parts.push(staleLine(f));
    return parts.filter(Boolean).join(' ');
  }

  global.NSG_PROVENANCE = {
    STATUS: STATUS,
    EXPIRY_MONTHS: EXPIRY_MONTHS,
    field: field,
    isStale: isStale,
    staleLine: staleLine,
    statusLabel: statusLabel,
    careerFields: careerFields,
    renderFieldNote: renderFieldNote
  };
})(typeof window !== 'undefined' ? window : globalThis);
