/* Post-quiz My Pathway + My profile. ES5. Prefix mp-.
   Integration: Explore bookmarks live on S.pw.considering (indexes into CAREERS).
   toggleConsidering() in app-views.js is the write path. This screen only reads
   that array and can remove via the same helper. Do not add a second store. */

var MP_STAGES = [
  { k: 'form1', title: 'Form 1', grade: 'Grade 7', tag: '', next: 'form2', nextTitle: 'Form 2', level: 'f1' },
  { k: 'form2', title: 'Form 2', grade: 'Grade 8', tag: '', next: 'form3', nextTitle: 'Form 3', level: 'f2' },
  { k: 'form3', title: 'Form 3', grade: 'Grade 9', tag: 'decision point', next: 'form4', nextTitle: 'Form 4', level: 'f3' },
  { k: 'form4', title: 'Form 4', grade: 'Grade 10', tag: '', next: 'form5', nextTitle: 'Form 5', level: 'f4' },
  { k: 'form5', title: 'Form 5', grade: 'Grade 11', tag: 'decision point', next: 'sixth', nextTitle: 'Sixth Form', level: 'f5' },
  { k: 'sixth', title: 'Sixth Form', grade: 'Lower and Upper Six, Grades 12 and 13', tag: '', next: 'tertiary', nextTitle: 'Tertiary', level: 'l6' },
  { k: 'tertiary', title: 'Tertiary', grade: 'University, college or technical institute', tag: '', next: '', nextTitle: '', level: 't1' }
];

var MP_CSEC = [
  'Additional Mathematics', 'Agricultural Science', 'Biology', 'Building Technology',
  'Caribbean History', 'Chemistry', 'Economics', 'Electrical and Electronic Technology',
  'Electronic Document Preparation and Management', 'English A', 'English B',
  'Food Nutrition and Health', 'French', 'Geography', 'Human and Social Biology',
  'Industrial Technology', 'Information Technology', 'Integrated Science', 'Mathematics',
  'Mechanical Engineering Technology', 'Music', 'Office Administration',
  'Physical Education and Sport', 'Physics', 'Portuguese', 'Principles of Accounts',
  'Principles of Business', 'Religious Education', 'Resource Management', 'Social Studies',
  'Spanish', 'Technical Drawing', 'Textiles Clothing and Fashion', 'Theatre Arts', 'Visual Arts'
];

var MP_CAPE_ONE = ['Caribbean Studies', 'Communication Studies'];
var MP_CAPE_TWO = [
  'Accounting', 'Agricultural Science', 'Animation and Game Design', 'Applied Mathematics',
  'Art and Design', 'Biology', 'Chemistry', 'Computer Science', 'Digital Media', 'Economics',
  'Electrical and Electronic Engineering Technology', 'Entrepreneurship', 'Environmental Science',
  'Financial Services Studies', 'Food and Nutrition', 'French', 'Geography', 'Green Engineering',
  'History', 'Information Technology', 'Integrated Mathematics', 'Law', 'Literatures in English',
  'Logistics and Supply Chain Operations', 'Management of Business', 'Performing Arts',
  'Physical Education and Sport', 'Physics', 'Pure Mathematics', 'Sociology', 'Spanish', 'Tourism'
];

var MP_CVQ = [
  'Agricultural Crop Production', 'Animal Husbandry', 'Bartending', 'Beauty Therapy',
  'Commercial Food Preparation', 'Cosmetology', 'Data Operations', 'Electrical Installation',
  'Fabric Decoration', 'Floral Design', 'Furniture Making', 'Garment Construction',
  'General Construction', 'Graphic Design', 'Housekeeping', 'Information Technology Support',
  'Landscaping and Grounds Maintenance', 'Masonry', 'Motor Vehicle Repair', 'Plumbing',
  'Refrigeration and Air Conditioning', 'Welding and Fabrication'
];

var MP_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function mpPencil() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 16.5V20h3.5L18 9.5 14.5 6 4 16.5z"/><path d="M13.2 7.3l3.5 3.5"/></svg>';
}
function mpPlus() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
}
function mpChev() {
  return '<svg class="mp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
}
function mpStar() {
  return '<svg class="mp-star" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.8l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.8 6.6 19.6l1-6.1L3.2 9.2l6.1-.9z"/></svg>';
}
function mpStarOut() {
  return '<svg class="mp-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.2l2.5 5.1 5.6.8-4.1 4 1 5.6L12 16.2 7 18.7l1-5.6-4.1-4 5.6-.8z"/></svg>';
}
function mpTileAch() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h8v5a4 4 0 01-8 0V4z"/><path d="M8 7H5a3 3 0 003 4M16 7h3a3 3 0 01-3 4"/><path d="M12 13v3M9 20h6"/></svg>';
}
function mpTileAct() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 19c1.2-3.2 3.6-5 7-5s5.8 1.8 7 5"/></svg>';
}

function mpArch() {
  var name = String((S.pw && S.pw.archetype) || S.archetype || '');
  var key = name.replace(/^The\s+/, '');
  if (typeof PLAN_ARCH !== 'undefined') {
    if (PLAN_ARCH[key]) return PLAN_ARCH[key];
    if (PLAN_ARCH[name]) return PLAN_ARCH[name];
  }
  return PLAN_ARCH.Explorer;
}

function mpTokens() {
  var a = mpArch();
  return '--mp-deep:' + a.deep + ';--mp-tint:' + a.tint + ';--mp-glow:' + a.glow;
}

function mpLevelToStage(level) {
  if (level === 'f1') return 'form1';
  if (level === 'f2') return 'form2';
  if (level === 'f3') return 'form3';
  if (level === 'f4') return 'form4';
  if (level === 'f5') return 'form5';
  if (level === 'l6' || level === 'u6') return 'sixth';
  return 'tertiary';
}

function mpStageByKey(k) {
  var i;
  for (i = 0; i < MP_STAGES.length; i++) if (MP_STAGES[i].k === k) return MP_STAGES[i];
  return MP_STAGES[3];
}

function mpStageIx(k) {
  var i;
  for (i = 0; i < MP_STAGES.length; i++) if (MP_STAGES[i].k === k) return i;
  return 3;
}

function mpKnownStage(k) {
  var i;
  for (i = 0; i < MP_STAGES.length; i++) if (MP_STAGES[i].k === k) return true;
  return false;
}

function ensureMp() {
  var p = ensurePw();
  var i;
  if (!p.lineGoals || typeof p.lineGoals !== 'object') p.lineGoals = {};
  for (i = 0; i < MP_STAGES.length; i++) {
    if (!p.lineGoals[MP_STAGES[i].k]) p.lineGoals[MP_STAGES[i].k] = [];
  }
  if (!p.mpSkills) p.mpSkills = [];
  if (!p.mpAch) p.mpAch = [];
  if (!p.mpAct) p.mpAct = [];
  if (!p.mpSubj) p.mpSubj = { csec: [], cape: [], cvq: [] };
  if (!p.mpSubj.csec) p.mpSubj.csec = [];
  if (!p.mpSubj.cape) p.mpSubj.cape = [];
  if (!p.mpSubj.cvq) p.mpSubj.cvq = [];
  if (!p.mpUi) p.mpUi = {};
  if (!p.lineStage) {
    p.lineStage = mpLevelToStage(p.level || 'f4');
  }
  if (!mpKnownStage(p.open)) p.open = p.lineStage;
  return p;
}

function mpSyncLevelFromLine() {
  var p = ensureMp();
  var st = mpStageByKey(p.lineStage);
  p.level = st.level;
  S.form = st.title;
  if (S.me) S.me.form = S.form;
}

function mpAfterKey() {
  var g = (S.pw && S.pw.goal) || '';
  if (g === 'range' || g === 'idk') return 'idk';
  return g;
}

function mpInitials(name) {
  var parts = String(name || 'You').replace(/^\s+|\s+$/g, '').split(/\s+/);
  var a = parts[0] ? parts[0].charAt(0) : 'Y';
  var b = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (a + b).toUpperCase();
}

function mpFieldLabel() {
  var p = ensureMp();
  var k = p.field || (p.fields && p.fields[0]) || '';
  if (!k) return '';
  return fieldName(k);
}

function mpRegionLabel() {
  var r = regionByKey((S.pw && S.pw.region) || '');
  return r ? r.n : '';
}

function mpOpenGoals(list) {
  var n = 0;
  var i;
  for (i = 0; i < list.length; i++) if (!list[i].done) n += 1;
  return n;
}

function mpCapeOptions() {
  var out = [];
  var i;
  for (i = 0; i < MP_CAPE_ONE.length; i++) out.push({ name: MP_CAPE_ONE[i], unit: 0, label: MP_CAPE_ONE[i] });
  for (i = 0; i < MP_CAPE_TWO.length; i++) {
    out.push({ name: MP_CAPE_TWO[i], unit: 1, label: MP_CAPE_TWO[i] + ', Unit 1' });
    out.push({ name: MP_CAPE_TWO[i], unit: 2, label: MP_CAPE_TWO[i] + ', Unit 2' });
  }
  return out;
}

function mpSubjHas(exam, name, unit) {
  var list = ensureMp().mpSubj[exam] || [];
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].name === name && (exam !== 'cape' || list[i].unit === unit)) return true;
  }
  return false;
}

function mpYearOpts(sel) {
  var y = new Date().getFullYear();
  var i;
  var html = '';
  for (i = y + 2; i >= y - 8; i--) {
    html += '<option value="' + i + '"' + (String(sel) === String(i) ? ' selected' : '') + '>' + i + '</option>';
  }
  return html;
}

function mpMonthOpts(sel) {
  var i;
  var html = '<option value="">Month</option>';
  for (i = 0; i < MP_MONTHS.length; i++) {
    html +=
      '<option value="' +
      (i + 1) +
      '"' +
      (String(sel) === String(i + 1) ? ' selected' : '') +
      '>' +
      MP_MONTHS[i] +
      '</option>';
  }
  return html;
}

function mpIconBtn(action, label, extra) {
  return (
    '<button type="button" class="mp-icon" data-mp="' +
    action +
    '"' +
    (extra || '') +
    ' aria-label="' +
    esc(label) +
    '">' +
    mpPencil() +
    '</button>'
  );
}

function mpQuoteHtml(where) {
  var p = ensureMp();
  var ui = p.mpUi;
  var html;
  if (ui.quoteEdit === where) {
    html =
      '<div class="mp-quote-form"><label for="mp-quote-t">Your quote</label>' +
      '<textarea id="mp-quote-t">' +
      esc(p.quote || '') +
      '</textarea><label for="mp-quote-who">Who said it</label>' +
      '<p class="mp-help">Optional.</p>' +
      '<input id="mp-quote-who" type="text" value="' +
      esc(p.quoteWho || '') +
      '"/>' +
      '<div class="mp-form-acts">' +
      '<button type="button" class="mp-btn mp-primary" data-mp="quote-save">Save</button>' +
      '<button type="button" class="mp-btn" data-mp="quote-cancel">Cancel</button>';
    if (p.quote) html += '<button type="button" class="mp-btn" data-mp="quote-remove">Remove</button>';
    html += '</div></div>';
    return html;
  }
  if (p.quote) {
    return (
      '<div class="mp-quote"><div><p>' +
      esc(p.quote) +
      '</p>' +
      (p.quoteWho ? '<cite>' + esc(p.quoteWho) + '</cite>' : '') +
      '</div>' +
      mpIconBtn('quote-edit', 'Edit quote') +
      '</div>'
    );
  }
  return (
    '<button type="button" class="mp-quote-empty" data-mp="quote-edit">' +
    '<b>Add a quote that keeps you going</b>' +
    '<span>Scripture, a lyric, something a relative always says.</span></button>'
  );
}

function mpDetailsForm() {
  var p = ensureMp();
  var html =
    '<div class="mp-form"><div class="mp-field"><label for="mp-ed-name">Name</label>' +
    '<input id="mp-ed-name" type="text" value="' +
    esc(p.name || '') +
    '"/></div><div class="mp-field"><label for="mp-ed-stage">Stage</label><select id="mp-ed-stage">';
  var i;
  for (i = 0; i < MP_STAGES.length; i++) {
    html +=
      '<option value="' +
      MP_STAGES[i].k +
      '"' +
      (p.lineStage === MP_STAGES[i].k ? ' selected' : '') +
      '>' +
      esc(MP_STAGES[i].title) +
      '</option>';
  }
  html +=
    '</select></div><div class="mp-field"><label for="mp-ed-region">Region</label><select id="mp-ed-region">';
  for (i = 0; i < REGIONS.length; i++) {
    html +=
      '<option value="' +
      REGIONS[i].k +
      '"' +
      (p.region === REGIONS[i].k ? ' selected' : '') +
      '>' +
      esc(REGIONS[i].n) +
      '</option>';
  }
  html +=
    '</select></div><div class="mp-form-acts">' +
    '<button type="button" class="mp-btn mp-primary" data-mp="details-save">Save</button>' +
    '<button type="button" class="mp-btn" data-mp="details-cancel">Cancel</button></div></div>';
  return html;
}

function mpProfileCard(where) {
  var p = ensureMp();
  var a = mpArch();
  var field = mpFieldLabel();
  var html =
    '<article class="mp-card pw-head" style="' +
    mpTokens() +
    '"><div class="mp-band"><div class="mp-band-veil" aria-hidden="true"></div>' +
    '<div class="mp-band-inner"><div class="mp-av">' +
    esc(mpInitials(p.name || p.firstName || 'You')) +
    '</div><div class="minw"><h2 class="mp-name">' +
    esc(p.name || p.firstName || 'You') +
    '</h2><p class="mp-meta">' +
    esc(mpStageByKey(p.lineStage).title) +
    ' · ' +
    esc(mpRegionLabel()) +
    '</p><div class="mp-chips"><span class="mp-chip">' +
    esc(a.name) +
    '</span>';
  if (field) html += '<span class="mp-chip mp-chip-field">' + esc(field) + '</span>';
  html +=
    '</div></div></div></div><div class="mp-card-body"><p class="mp-arch-line">' +
    esc(a.line) +
    '</p>' +
    (S.pw.dest >= 0 && careerAt(S.pw.dest)
      ? '<p class="mp-arch-line">Working toward ' + esc(careerAt(S.pw.dest).n) + '</p>'
      : '') +
    mpQuoteHtml(where);
  if (p.mpUi.detailsEdit && where === 'profile') html += mpDetailsForm();
  html += '<div class="mp-card-acts">';
  if (where === 'pathway') {
    html +=
      '<button type="button" class="btn" data-pw-sub="edit">My profile</button>' +
      '<button type="button" class="btn g" data-pw-tab="explore">Explore careers</button>';
  } else {
    html += '<button type="button" class="btn g" data-mp="details-open">Edit my details</button>';
  }
  html += '</div></div></article>';
  return html;
}

function mpDecisions(stage) {
  var after = mpAfterKey();
  var html = '';
  function block(title, body, opts) {
    var i;
    var mark;
    var out =
      '<div class="mp-dec"><h3>' +
      esc(title) +
      '</h3><p>' +
      esc(body) +
      '</p>';
    if (opts) {
      out += '<ul class="mp-opts">';
      for (i = 0; i < opts.length; i++) {
        mark = opts[i].k && (opts[i].k === after || (opts[i].k === 'earn' && after === 'own'));
        out +=
          '<li class="mp-opt' +
          (mark ? ' mp-lean' : '') +
          '">' +
          esc(opts[i].t) +
          (mark ? '<span class="mp-lean-tag">leaning here, from your quiz</span>' : '') +
          '</li>';
      }
      out += '</ul>';
    }
    out += '</div>';
    return out;
  }
  if (stage.k === 'form1') {
    html += block(
      'Settling into a new school culture',
      'How you adapt to a stricter secondary environment. If you were awarded a top national or regional school, this includes the travel, or moving away from home to attend.'
    );
    html += block(
      'What you join',
      'Which clubs, sports or youth organisations you take on, and whether that load still leaves room for the schoolwork.'
    );
  } else if (stage.k === 'form2') {
    html += block(
      'Where your strengths actually are',
      'The year you find out which subjects you are good at and which you enjoy, and whether you lean toward the sciences, business or the arts.'
    );
    html += block(
      'Extra help, or push ahead',
      'Whether to take extra lessons, particularly if Mathematics or English is shaky. These are the foundations everything after this sits on.'
    );
  } else if (stage.k === 'form3') {
    html += block(
      'Your stream',
      'The biggest decision of lower secondary. You pick the track you will follow for the next two years, and it sets which CSEC subjects are open to you.',
      [
        { t: 'Science' },
        { t: 'Business and Commerce' },
        { t: 'Arts and Humanities' },
        { t: 'Technical and Vocational, TVET' }
      ]
    );
  } else if (stage.k === 'form4') {
    html += block(
      'Your CSEC subjects',
      'How many subjects you sit, and which. English A and Mathematics are compulsory. The electives are yours to choose, and they decide what you can apply for later.'
    );
    html += block(
      'Your SBA topics',
      'The research topics for your School-Based Assessments. They carry real weight in the final grade, so pick topics you can actually finish with the time and materials you have.'
    );
  } else if (stage.k === 'form5') {
    html += block(
      'Whether you are ready to sit everything',
      'Whether to write all the subjects you registered for, or defer one or two to a private sitting rather than risk the whole set.'
    );
    html += block(
      'Your next step after CSEC',
      'Decided before you write, not after the results come out.',
      [
        { t: 'Sixth Form, for CAPE' },
        { k: 'uni', t: 'Straight to the University of Guyana, or GOAL' },
        { k: 'trade', t: 'A technical institute, such as GTI or NATI' },
        { k: 'earn', t: 'Into work' }
      ]
    );
  } else if (stage.k === 'sixth') {
    html += block(
      'Your CAPE Units',
      'Which subjects you specialise in, usually three to five per Unit. Six Units including Caribbean Studies gives you the diploma.'
    );
    html += block(
      'Where you apply',
      'Whether you apply to tertiary education here, or go after an overseas scholarship, which is a much longer preparation.'
    );
  } else {
    html += block(
      'Which institution',
      'On campus at the University of Guyana, a technical specialisation at GTI, or an online degree through GOAL.'
    );
    html += block(
      'What you major in',
      'A traditional profession such as law or medicine, or one of the sectors growing fastest here: oil and gas, civil engineering, logistics, agri-business.'
    );
    html += block(
      'How you pay for it, and whether you work',
      'Full-time study or classes alongside a job, weighed against the tuition-free state programmes and how much work is going right now.'
    );
  }
  return html;
}

function mpGoalsHtml(stage) {
  var p = ensureMp();
  var list = p.lineGoals[stage.k] || [];
  var html = '<p class="mp-goals-lab">My goals and notes</p>';
  var i;
  if (!list.length) {
    html += '<p class="mp-goal-empty">Nothing yet. Add what you personally need to do at this stage.</p>';
  }
  for (i = 0; i < list.length; i++) {
    html +=
      '<div class="mp-goal' +
      (list[i].done ? ' is-done' : '') +
      '"><button type="button" class="mp-icon" data-mp="goal-tick" data-mp-sk="' +
      stage.k +
      '" data-mp-i="' +
      i +
      '" aria-label="' +
      (list[i].done ? 'Mark as not done' : 'Mark as done') +
      '">' +
      (list[i].done
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>') +
      '</button><span class="mp-goal-t">' +
      esc(list[i].t) +
      '</span><button type="button" class="mp-icon" data-mp="goal-del" data-mp-sk="' +
      stage.k +
      '" data-mp-i="' +
      i +
      '" aria-label="Delete goal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 7h12M9 7V5h6v2M8 7l1 12h6l1-12"/></svg></button></div>';
  }
  html +=
    '<div class="mp-goal-add"><input id="mp-goal-' +
    stage.k +
    '" type="text" placeholder="Add a goal"/><button type="button" class="mp-btn" data-mp="goal-add" data-mp-sk="' +
    stage.k +
    '">Add</button></div>';
  return html;
}

function mpLineHtml() {
  var p = ensureMp();
  var cur = mpStageIx(p.lineStage);
  var html =
    '<section class="mp-line" style="' +
    mpTokens() +
    '"><div class="mp-line-h"><h2>My line</h2></div>' +
    '<p class="mp-hint">Form 1 to tertiary. Open a stage to see what it asks of you and to set your own goals.</p><ol class="mp-track">';
  var i;
  var st;
  var state;
  var open;
  var waiting;
  for (i = 0; i < MP_STAGES.length; i++) {
    st = MP_STAGES[i];
    open = p.open === st.k;
    if (i < cur) state = 'is-done';
    else if (i === cur) state = 'is-now';
    else state = 'is-ahead';
    waiting = mpOpenGoals(p.lineGoals[st.k] || []);
    html +=
      '<li class="mp-stage ' +
      state +
      (open ? ' is-open' : '') +
      (i === 0 ? ' is-first' : '') +
      (i === MP_STAGES.length - 1 ? ' is-last' : '') +
      '"><button type="button" class="mp-stage-btn" data-mp="stage" data-mp-sk="' +
      st.k +
      '" aria-expanded="' +
      (open ? 'true' : 'false') +
      '" aria-controls="mp-panel-' +
      st.k +
      '"><span class="mp-mark">' +
      (state === 'is-ahead' ? mpStarOut() : mpStar()) +
      '</span><span class="mp-stage-name">' +
      esc(st.title) +
      '</span><span class="mp-stage-end">';
    if (st.tag) html += '<span class="mp-tag">' + esc(st.tag) + '</span>';
    if (waiting) html += '<span class="mp-goalpill">' + waiting + '</span>';
    html +=
      mpChev() +
      '</span></button><div class="mp-panel" id="mp-panel-' +
      st.k +
      '"' +
      (open ? '' : ' inert') +
      '><div class="mp-panel-inner"><p class="mp-grade">' +
      esc(st.grade) +
      '</p>' +
      mpDecisions(st);
    if (i === cur && st.next) {
      html +=
        '<div class="mp-move"><b>Moved up?</b><p>Tell us when you get to ' +
        esc(st.nextTitle) +
        ' and your line moves with you.</p><button type="button" class="mp-btn mp-primary" data-mp="move-up">I am in ' +
        esc(st.nextTitle) +
        ' now</button></div>';
    }
    html += mpGoalsHtml(st) + '</div></div></li>';
  }
  html += '</ol></section>';
  return html;
}

function mpConsideringHtml() {
  var p = ensureMp();
  /* Read Explore bookmarks from S.pw.considering. See file header. */
  var html =
    '<section class="mp-consider" style="' +
    mpTokens() +
    '"><h2>Careers I am considering</h2>';
  var i;
  var c;
  var ix;
  var fk;
  if (!p.considering.length) {
    html +=
      '<p class="mp-empty">Nothing here yet. Add a career in Explore and it lands here.</p>' +
      '<button type="button" class="btn g" data-pw-tab="explore">Explore careers</button></section>';
    return html;
  }
  for (i = 0; i < p.considering.length; i++) {
    ix = p.considering[i];
    c = careerAt(ix);
    if (!c) continue;
    fk = (c.b && c.b[0]) || '';
    html +=
      '<div class="mp-crow"><span class="mp-ftag">' +
      esc(fk ? fieldName(fk) : 'Career') +
      '</span><div class="minw"><p class="mp-cname">' +
      esc(c.n) +
      '</p><p class="mp-croute">' +
      esc(c.route || '') +
      '</p></div><button type="button" class="btn g sm" data-mp="unbook" data-mp-ix="' +
      ix +
      '">Remove</button></div>';
  }
  html += '</section>';
  return html;
}

function renderMpPathway() {
  ensureMp();
  mpSyncLevelFromLine();
  return '<div class="mp-col">' + mpProfileCard('pathway') + mpLineHtml() + mpConsideringHtml() + '</div>';
}

function mpAboutHtml() {
  var p = ensureMp();
  var html =
    '<section class="mp-sec" style="' +
    mpTokens() +
    '"><div class="mp-sec-h"><h2>About you</h2>';
  if (p.about && !p.mpUi.aboutEdit) {
    html += mpIconBtn('about-edit', 'Edit about');
  }
  html +=
    '</div><p class="mp-hint">Two or three lines. Where you are, what you are into, what you are working toward.</p>';
  if (p.mpUi.aboutEdit) {
    html +=
      '<div class="mp-form"><textarea id="mp-about">' +
      esc(p.about || '') +
      '</textarea><div class="mp-form-acts">' +
      '<button type="button" class="mp-btn mp-primary" data-mp="about-save">Save</button>' +
      '<button type="button" class="mp-btn" data-mp="about-cancel">Cancel</button>';
    if (p.about) html += '<button type="button" class="mp-btn" data-mp="about-remove">Remove</button>';
    html += '</div></div>';
  } else if (p.about) {
    html += '<p class="mp-arch-line">' + esc(p.about) + '</p>';
  } else {
    html +=
      '<button type="button" class="mp-quote-empty" data-mp="about-edit"><b>Write a short about</b>' +
      '<span>Two or three lines a mentor can read first.</span></button>';
  }
  html += '</section>';
  return html;
}

function mpComboHtml(exam) {
  var ui = ensureMp().mpUi;
  var open = ui.comboExam === exam;
  var q = open ? ui.comboQ || '' : '';
  var html =
    '<div class="mp-combo"><input id="mp-combo-' +
    exam +
    '" type="text" role="combobox" aria-expanded="' +
    (open ? 'true' : 'false') +
    '" aria-controls="mp-list-' +
    exam +
    '" aria-autocomplete="list" autocomplete="off" placeholder="Add a subject" value="' +
    esc(q) +
    '" data-mp-combo="' +
    exam +
    '"/>';
  if (open) html += '<div class="mp-list" id="mp-list-' + exam + '" role="listbox">' + mpComboOptions(exam) + '</div>';
  html += '</div>';
  return html;
}

function mpFilterOptions(exam, q) {
  var low = String(q || '').toLowerCase();
  var out = [];
  var i;
  var opt;
  var all;
  if (exam === 'cape') all = mpCapeOptions();
  else if (exam === 'cvq') {
    all = [];
    for (i = 0; i < MP_CVQ.length; i++) all.push({ name: MP_CVQ[i], unit: 0, label: MP_CVQ[i] });
  } else {
    all = [];
    for (i = 0; i < MP_CSEC.length; i++) all.push({ name: MP_CSEC[i], unit: 0, label: MP_CSEC[i] });
  }
  for (i = 0; i < all.length; i++) {
    opt = all[i];
    if (mpSubjHas(exam, opt.name, opt.unit)) continue;
    if (low && opt.label.toLowerCase().indexOf(low) === -1) continue;
    out.push(opt);
  }
  return out;
}

function mpComboOptions(exam) {
  var ui = ensureMp().mpUi;
  var hits = mpFilterOptions(exam, ui.comboQ);
  var html = '';
  var i;
  var n;
  var lab = exam.toUpperCase();
  if (exam === 'csec') lab = 'CSEC';
  if (exam === 'cape') lab = 'CAPE';
  if (exam === 'cvq') lab = 'CVQ';
  if (!hits.length) {
    if (!mpFilterOptions(exam, '').length) {
      return '<p class="mp-combo-msg">Everything on the ' + lab + ' list is already added.</p>';
    }
    return '<p class="mp-combo-msg">No match in the ' + lab + ' list.</p>';
  }
  n = Math.min(8, hits.length);
  for (i = 0; i < n; i++) {
    html +=
      '<button type="button" class="mp-optbtn' +
      (ui.comboIx === i ? ' on' : '') +
      '" role="option" data-mp="subj-pick" data-mp-exam="' +
      exam +
      '" data-mp-name="' +
      esc(hits[i].name) +
      '" data-mp-unit="' +
      hits[i].unit +
      '">' +
      esc(hits[i].label) +
      '</button>';
  }
  return html;
}

function mpSubjRows(exam) {
  var list = ensureMp().mpSubj[exam] || [];
  var html = '';
  var i;
  var row;
  var label;
  for (i = 0; i < list.length; i++) {
    row = list[i];
    label = row.name;
    if (exam === 'cape' && row.unit) label += '';
    html +=
      '<div class="mp-srow"><div class="mp-sname">' +
      esc(row.name) +
      (exam === 'cape' && row.unit ? '<span class="mp-unit">Unit ' + row.unit + '</span>' : '') +
      '</div><button type="button" class="mp-st ' +
      (row.st === 'have' ? 'have' : 'take') +
      '" data-mp="subj-st" data-mp-exam="' +
      exam +
      '" data-mp-i="' +
      i +
      '">' +
      (row.st === 'have' ? 'Have it' : 'Taking it') +
      '</button><button type="button" class="mp-icon" data-mp="subj-del" data-mp-exam="' +
      exam +
      '" data-mp-i="' +
      i +
      '" aria-label="Remove subject"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
  }
  return html;
}

function mpSubjectsHtml() {
  var p = ensureMp();
  var html =
    '<section class="mp-sec" style="' +
    mpTokens() +
    '"><div class="mp-sec-h"><h2>My subjects</h2></div>';
  function group(exam, title, note) {
    var n = (p.mpSubj[exam] || []).length;
    return (
      '<div class="mp-subj-block"><h3>' +
      title +
      ' <span class="mp-count">' +
      n +
      ' added</span></h3><p class="mp-hint">' +
      note +
      '</p>' +
      mpSubjRows(exam) +
      mpComboHtml(exam) +
      '</div>'
    );
  }
  html += group(
    'csec',
    'CSEC',
    'General and Technical proficiency. Grades I to III are the ones tertiary institutions count.'
  );
  html += group(
    'cape',
    'CAPE',
    'Add each Unit separately, because they are examined and certified separately. Caribbean Studies and Communication Studies are one-Unit subjects, so they have no Unit 2.'
  );
  html += group(
    'cvq',
    'CVQ',
    'Competency based, so each unit is judged competent or not yet competent. Schools here are approved at Levels 1 and 2.'
  );
  html +=
    '<p class="mp-footnote">Offerings change. Confirm the current list with CXC and the Ministry of Education before a sitting, and check which subjects your own school actually runs.</p></section>';
  return html;
}

function mpEntryMetaAch(it) {
  var bits = [];
  if (it.where) bits.push(it.where);
  if (it.month && it.year) bits.push(MP_MONTHS[it.month - 1] + ' ' + it.year);
  else if (it.year) bits.push(String(it.year));
  return bits.join(' · ');
}

function mpUnitWord(n, unit) {
  var u = unit;
  if (Number(n) === 1) {
    if (u === 'days') u = 'day';
    if (u === 'weeks') u = 'week';
    if (u === 'months') u = 'month';
    if (u === 'years') u = 'year';
  }
  return n + ' ' + u;
}

function mpEntryMetaAct(it) {
  var bits = [];
  if (it.n && it.unit) bits.push(mpUnitWord(it.n, it.unit));
  if (it.still) bits.push('still going');
  return bits.join(' · ');
}

function mpEntryHtml(kind, it, i, expanded) {
  var desc = kind === 'ach' ? it.note : it.do;
  var html =
    '<article class="mp-entry" data-mp-entry="' +
    kind +
    '-' +
    i +
    '"><div class="mp-tile">' +
    (kind === 'ach' ? mpTileAch() : mpTileAct()) +
    '</div><div class="minw"><h3 class="mp-etitle">' +
    esc(it.what || '') +
    '</h3><p class="mp-emeta">' +
    esc(kind === 'ach' ? mpEntryMetaAch(it) : mpEntryMetaAct(it)) +
    '</p>';
  if (desc) {
    html +=
      '<p class="mp-edesc' +
      (expanded ? '' : ' is-clamp') +
      '" data-mp-desc="1">' +
      esc(desc) +
      '</p><button type="button" class="mp-more" hidden data-mp="see-more" data-mp-kind="' +
      kind +
      '" data-mp-i="' +
      i +
      '">See more</button>';
  }
  html +=
    '</div>' +
    mpIconBtn('entry-edit', 'Edit entry', ' data-mp-kind="' + kind + '" data-mp-i="' + i + '"') +
    '</article>';
  return html;
}

function mpAchForm(it, ix) {
  var d = it || { what: '', where: '', month: '', year: '', note: '' };
  return (
    '<div class="mp-form"><div class="mp-field"><label for="mp-ach-what">What it was</label>' +
    '<p class="mp-help">Best speaker, inter-house debate</p>' +
    '<input id="mp-ach-what" type="text" value="' +
    esc(d.what || '') +
    '"/></div><div class="mp-field"><label for="mp-ach-where">Where or who gave it</label>' +
    '<p class="mp-help">St. Joseph High School</p>' +
    '<input id="mp-ach-where" type="text" value="' +
    esc(d.where || '') +
    '"/></div><div class="mp-field"><label>When</label><div class="mp-pair">' +
    '<select id="mp-ach-month">' +
    mpMonthOpts(d.month) +
    '</select><select id="mp-ach-year"><option value="">Year</option>' +
    mpYearOpts(d.year) +
    '</select></div></div><div class="mp-field"><label for="mp-ach-note">Anything worth knowing</label>' +
    '<textarea id="mp-ach-note">' +
    esc(d.note || '') +
    '</textarea></div><div class="mp-form-acts">' +
    '<button type="button" class="mp-btn mp-primary" data-mp="ach-save" data-mp-i="' +
    (ix == null ? -1 : ix) +
    '">' +
    (ix == null ? 'Save' : 'Save changes') +
    '</button><button type="button" class="mp-btn" data-mp="form-cancel">Cancel</button>' +
    (ix == null
      ? ''
      : ensureMp().mpUi.confirmDel === 'ach-' + ix
        ? '<button type="button" class="mp-btn mp-danger" data-mp="ach-kill" data-mp-i="' +
          ix +
          '">Delete for good</button><button type="button" class="mp-btn" data-mp="keep">Keep</button>'
        : '<button type="button" class="mp-btn" data-mp="ach-del" data-mp-i="' + ix + '">Delete</button>') +
    '</div></div>'
  );
}

function mpActForm(it, ix) {
  var d = it || { what: '', do: '', n: '', unit: '', still: false };
  return (
    '<div class="mp-form"><div class="mp-field"><label for="mp-act-what">What it is</label>' +
    '<p class="mp-help">Debate club, or the shop on Saturdays</p>' +
    '<input id="mp-act-what" type="text" value="' +
    esc(d.what || '') +
    '"/></div><div class="mp-field"><label for="mp-act-do">What you actually do</label>' +
    '<p class="mp-help">The part that is yours. Research, repairs, minding the till.</p>' +
    '<textarea id="mp-act-do">' +
    esc(d.do || '') +
    '</textarea></div><div class="mp-field"><label>How long</label><div class="mp-inline">' +
    '<input id="mp-act-n" type="number" min="1" step="1" value="' +
    esc(d.n || '') +
    '"/><select id="mp-act-unit"><option value="">Unit</option>' +
    '<option value="days"' +
    (d.unit === 'days' ? ' selected' : '') +
    '>days</option>' +
    '<option value="weeks"' +
    (d.unit === 'weeks' ? ' selected' : '') +
    '>weeks</option>' +
    '<option value="months"' +
    (d.unit === 'months' ? ' selected' : '') +
    '>months</option>' +
    '<option value="years"' +
    (d.unit === 'years' ? ' selected' : '') +
    '>years</option></select></div>' +
    '<label class="mp-check"><input id="mp-act-still" type="checkbox"' +
    (d.still ? ' checked' : '') +
    '/> I am still doing this</label></div>' +
    (ensureMp().mpUi.formErr ? '<p class="mp-err">' + esc(ensureMp().mpUi.formErr) + '</p>' : '') +
    '<div class="mp-form-acts"><button type="button" class="mp-btn mp-primary" data-mp="act-save" data-mp-i="' +
    (ix == null ? -1 : ix) +
    '">' +
    (ix == null ? 'Save' : 'Save changes') +
    '</button><button type="button" class="mp-btn" data-mp="form-cancel">Cancel</button>' +
    (ix == null
      ? ''
      : ensureMp().mpUi.confirmDel === 'act-' + ix
        ? '<button type="button" class="mp-btn mp-danger" data-mp="act-kill" data-mp-i="' +
          ix +
          '">Delete for good</button><button type="button" class="mp-btn" data-mp="keep">Keep</button>'
        : '<button type="button" class="mp-btn" data-mp="act-del" data-mp-i="' + ix + '">Delete</button>') +
    '</div></div>'
  );
}

function mpListSection(kind, title, hint) {
  var p = ensureMp();
  var list = kind === 'ach' ? p.mpAch : p.mpAct;
  var ui = p.mpUi;
  var showAll = kind === 'ach' ? ui.showAch : ui.showAct;
  var formOn = ui.formKind === kind;
  var html =
    '<section class="mp-sec" style="' +
    mpTokens() +
    '"><div class="mp-sec-h"><h2>' +
    title +
    ' <span class="mp-count">' +
    list.length +
    '</span></h2>' +
    '<button type="button" class="mp-icon" data-mp="entry-add" data-mp-kind="' +
    kind +
    '" aria-label="Add">' +
    mpPlus() +
    '</button></div><p class="mp-hint">' +
    hint +
    '</p>';
  var i;
  var limit;
  if (formOn) {
    if (kind === 'ach') html += mpAchForm(ui.formI == null ? null : list[ui.formI], ui.formI);
    else html += mpActForm(ui.formI == null ? null : list[ui.formI], ui.formI);
  }
  limit = showAll || list.length <= 3 ? list.length : 3;
  for (i = 0; i < limit; i++) {
    if (formOn && ui.formI === i) continue;
    html += mpEntryHtml(kind, list[i], i, ui.more === kind + '-' + i);
  }
  if (!showAll && list.length > 3) {
    html +=
      '<button type="button" class="mp-morefoot" data-mp="show-all" data-mp-kind="' +
      kind +
      '">Show all ' +
      list.length +
      (kind === 'ach' ? ' achievements' : ' activities') +
      '</button>';
  }
  html += '</section>';
  return html;
}

function mpSkillsHtml() {
  var p = ensureMp();
  var html =
    '<section class="mp-sec" style="' +
    mpTokens() +
    '"><div class="mp-sec-h"><h2>Skills <span class="mp-count">' +
    p.mpSkills.length +
    '</span></h2></div>';
  var i;
  if (!p.mpSkills.length) {
    html +=
      '<p class="mp-empty">Nothing here yet. Things you can actually do: wiring, welding, writing, minding a till, speaking in front of people.</p>';
  } else {
    html += '<div class="mp-chips-row">';
    for (i = 0; i < p.mpSkills.length; i++) {
      html +=
        '<span class="mp-skill">' +
        esc(p.mpSkills[i]) +
        '<button type="button" data-mp="skill-del" data-mp-i="' +
        i +
        '" aria-label="Remove ' +
        esc(p.mpSkills[i]) +
        '">×</button></span>';
    }
    html += '</div>';
  }
  if (p.mpUi.skillErr) html += '<p class="mp-err">' + esc(p.mpUi.skillErr) + '</p>';
  html +=
    '<div class="mp-skill-add"><input id="mp-skill" type="text" placeholder="Add a skill"/>' +
    '<button type="button" class="mp-btn" data-mp="skill-add">Add</button></div></section>';
  return html;
}

function renderMpProfile() {
  ensureMp();
  mpSyncLevelFromLine();
  return (
    '<div class="mp-col">' +
    mpProfileCard('profile') +
    mpAboutHtml() +
    mpSubjectsHtml() +
    mpListSection('ach', 'Achievements', 'Awards, competitions, certificates, things you can point to.') +
    mpListSection('act', 'Activities', 'One sustained activity beats five short ones.') +
    mpSkillsHtml() +
    '</div>'
  );
}

function mpSyncShell() {
  var on = false;
  var p;
  var a;
  if (S.view === 'pathway') {
    p = ensurePw();
    on = !!(p.done && !(pwIsGuide() && S.role !== 'admin') && (p.sub === 'edit' || p.tab !== 'explore'));
    if (p.sub === 'field') on = false;
  }
  if (document.body) {
    if (on) {
      document.body.classList.add('mp-focus');
      a = mpArch();
      document.body.style.setProperty('--mp-deep', a.deep);
      document.body.style.setProperty('--mp-tint', a.tint);
      document.body.style.setProperty('--mp-glow', a.glow);
    } else {
      document.body.classList.remove('mp-focus');
    }
  }
}

function mpPaintSeeMore() {
  var nodes = document.querySelectorAll('.mp-edesc.is-clamp');
  var i;
  var el;
  var btn;
  for (i = 0; i < nodes.length; i++) {
    el = nodes[i];
    btn = el.parentNode.querySelector('.mp-more');
    if (!btn) continue;
    if (el.scrollHeight > el.clientHeight + 1) btn.hidden = false;
    else btn.hidden = true;
  }
}

function mpAfterPaint() {
  var p;
  var panel;
  var btn;
  mpSyncShell();
  if (S.view !== 'pathway') return;
  p = ensurePw();
  if (!p.done) return;
  mpPaintSeeMore();
  if (p.mpUi && p.mpUi.focusStage) {
    btn = document.querySelector('[data-mp-sk="' + p.mpUi.focusStage + '"].mp-stage-btn');
    panel = byId('mp-panel-' + p.mpUi.focusStage);
    p.mpUi.focusStage = '';
    if (panel && panel.scrollIntoView) panel.scrollIntoView({ block: 'start' });
    if (btn) btn.focus();
  }
  if (p.mpUi && p.mpUi.comboExam) {
    btn = byId('mp-combo-' + p.mpUi.comboExam);
    if (btn) {
      btn.focus();
      if (typeof btn.setSelectionRange === 'function') {
        btn.setSelectionRange((btn.value || '').length, (btn.value || '').length);
      }
    }
  }
}

function mpToggleStage(key) {
  var p = ensureMp();
  var stages;
  var i;
  var btn;
  var panel;
  var sk;
  p.open = p.open === key ? '' : key;
  stages = document.querySelectorAll('.mp-stage');
  if (!stages.length) {
    render();
    return;
  }
  for (i = 0; i < stages.length; i++) {
    btn = stages[i].querySelector('.mp-stage-btn');
    if (!btn) continue;
    sk = btn.getAttribute('data-mp-sk');
    panel = byId('mp-panel-' + sk);
    if (sk === p.open) {
      stages[i].classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      if (panel) panel.removeAttribute('inert');
    } else {
      stages[i].classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      if (panel) panel.setAttribute('inert', '');
    }
  }
}

function mpAddGoal(sk) {
  var p = ensureMp();
  var inp = byId('mp-goal-' + sk);
  var t = inp && inp.value ? inp.value.replace(/^\s+|\s+$/g, '') : '';
  if (!t) return;
  p.lineGoals[sk].push({ t: t, done: false });
  render();
}

function mpReadQuote() {
  var t = byId('mp-quote-t');
  var w = byId('mp-quote-who');
  return {
    t: t && t.value ? t.value.replace(/^\s+|\s+$/g, '') : '',
    w: w && w.value ? w.value.replace(/^\s+|\s+$/g, '') : ''
  };
}

function mpPickSubj(exam, name, unit) {
  var p = ensureMp();
  unit = parseInt(unit, 10) || 0;
  if (mpSubjHas(exam, name, unit)) return;
  p.mpSubj[exam].push({ name: name, unit: unit, st: 'take' });
  if (exam === 'csec' && !p.subjects[name]) p.subjects[name] = { st: 'take', grade: '' };
  p.mpUi.comboExam = '';
  p.mpUi.comboQ = '';
  p.mpUi.comboIx = -1;
  render();
}

function mpHandleClick(e, t) {
  var btn;
  var p;
  var act;
  var sk;
  var i;
  var kind;
  var v;
  if (S.view !== 'pathway') return false;
  p = ensurePw();
  if (!p.done) return false;
  ensureMp();

  if (p.mpUi.comboExam && !closestEl(t, '.mp-combo')) {
    p.mpUi.comboExam = '';
    p.mpUi.comboQ = '';
    if (
      closestEl(t, '[data-nav]') ||
      closestEl(t, '[data-pw-tab]') ||
      closestEl(t, '[data-pw-sub]') ||
      closestEl(t, '#dock-post') ||
      closestEl(t, '#nav-post')
    ) {
      return false;
    }
    if (!closestEl(t, '[data-mp]')) {
      render();
      return true;
    }
  }

  btn = closestEl(t, '[data-mp]');
  if (!btn) return false;
  act = btn.getAttribute('data-mp');
  sk = btn.getAttribute('data-mp-sk');
  i = parseInt(btn.getAttribute('data-mp-i'), 10);
  kind = btn.getAttribute('data-mp-kind');

  if (act === 'stage') {
    mpToggleStage(sk);
    return true;
  }
  if (act === 'goal-add') {
    mpAddGoal(sk);
    return true;
  }
  if (act === 'goal-tick') {
    p.lineGoals[sk][i].done = !p.lineGoals[sk][i].done;
    render();
    return true;
  }
  if (act === 'goal-del') {
    p.lineGoals[sk].splice(i, 1);
    render();
    return true;
  }
  if (act === 'move-up') {
    v = mpStageByKey(p.lineStage);
    if (v.next) {
      p.lineStage = v.next;
      p.open = v.next;
      p.mpUi.focusStage = v.next;
      mpSyncLevelFromLine();
      render();
      toast('Congratulations. You are in ' + mpStageByKey(p.lineStage).title + ' now');
    }
    return true;
  }
  if (act === 'quote-edit') {
    p.mpUi.quoteEdit = p.sub === 'edit' ? 'profile' : 'pathway';
    render();
    return true;
  }
  if (act === 'quote-cancel') {
    p.mpUi.quoteEdit = '';
    render();
    return true;
  }
  if (act === 'quote-save') {
    v = mpReadQuote();
    p.quote = v.t;
    p.quoteWho = v.w;
    p.mpUi.quoteEdit = '';
    render();
    return true;
  }
  if (act === 'quote-remove') {
    p.quote = '';
    p.quoteWho = '';
    p.mpUi.quoteEdit = '';
    render();
    return true;
  }
  if (act === 'details-open') {
    p.mpUi.detailsEdit = true;
    render();
    return true;
  }
  if (act === 'details-cancel') {
    p.mpUi.detailsEdit = false;
    render();
    return true;
  }
  if (act === 'details-save') {
    v = byId('mp-ed-name');
    if (v) p.name = v.value.replace(/^\s+|\s+$/g, '');
    v = byId('mp-ed-stage');
    if (v && v.value) {
      p.lineStage = v.value;
      p.open = v.value;
      mpSyncLevelFromLine();
    }
    v = byId('mp-ed-region');
    if (v && v.value) {
      p.region = v.value;
      S.region = regionShort(p.region);
      if (S.me) S.me.region = S.region;
    }
    p.mpUi.detailsEdit = false;
    render();
    return true;
  }
  if (act === 'unbook') {
    toggleConsidering(parseInt(btn.getAttribute('data-mp-ix'), 10));
    render();
    return true;
  }
  if (act === 'about-edit') {
    p.mpUi.aboutEdit = true;
    render();
    return true;
  }
  if (act === 'about-cancel') {
    p.mpUi.aboutEdit = false;
    render();
    return true;
  }
  if (act === 'about-save') {
    v = byId('mp-about');
    p.about = v && v.value ? v.value.replace(/^\s+|\s+$/g, '') : '';
    p.mpUi.aboutEdit = false;
    render();
    return true;
  }
  if (act === 'about-remove') {
    p.about = '';
    p.mpUi.aboutEdit = false;
    render();
    return true;
  }
  if (act === 'subj-pick') {
    mpPickSubj(btn.getAttribute('data-mp-exam'), btn.getAttribute('data-mp-name'), btn.getAttribute('data-mp-unit'));
    return true;
  }
  if (act === 'subj-st') {
    v = p.mpSubj[btn.getAttribute('data-mp-exam')][i];
    v.st = v.st === 'have' ? 'take' : 'have';
    if (btn.getAttribute('data-mp-exam') === 'csec' && p.subjects[v.name]) p.subjects[v.name].st = v.st;
    render();
    return true;
  }
  if (act === 'subj-del') {
    v = p.mpSubj[btn.getAttribute('data-mp-exam')].splice(i, 1)[0];
    if (v && btn.getAttribute('data-mp-exam') === 'csec' && p.subjects[v.name]) delete p.subjects[v.name];
    render();
    return true;
  }
  if (act === 'entry-add') {
    p.mpUi.formKind = kind;
    p.mpUi.formI = null;
    p.mpUi.formErr = '';
    p.mpUi.confirmDel = '';
    render();
    return true;
  }
  if (act === 'entry-edit') {
    p.mpUi.formKind = kind;
    p.mpUi.formI = i;
    p.mpUi.formErr = '';
    p.mpUi.confirmDel = '';
    render();
    return true;
  }
  if (act === 'form-cancel' || act === 'keep') {
    p.mpUi.formKind = '';
    p.mpUi.formI = null;
    p.mpUi.formErr = '';
    p.mpUi.confirmDel = '';
    render();
    return true;
  }
  if (act === 'ach-save') {
    v = {
      what: (byId('mp-ach-what') && byId('mp-ach-what').value) || '',
      where: (byId('mp-ach-where') && byId('mp-ach-where').value) || '',
      month: (byId('mp-ach-month') && byId('mp-ach-month').value) || '',
      year: (byId('mp-ach-year') && byId('mp-ach-year').value) || '',
      note: (byId('mp-ach-note') && byId('mp-ach-note').value) || ''
    };
    v.what = v.what.replace(/^\s+|\s+$/g, '');
    if (!v.what) return true;
    if (i >= 0) p.mpAch[i] = v;
    else p.mpAch.push(v);
    p.mpUi.formKind = '';
    p.mpUi.formI = null;
    render();
    return true;
  }
  if (act === 'act-save') {
    v = {
      what: (byId('mp-act-what') && byId('mp-act-what').value) || '',
      do: (byId('mp-act-do') && byId('mp-act-do').value) || '',
      n: (byId('mp-act-n') && byId('mp-act-n').value) || '',
      unit: (byId('mp-act-unit') && byId('mp-act-unit').value) || '',
      still: !!(byId('mp-act-still') && byId('mp-act-still').checked)
    };
    v.what = v.what.replace(/^\s+|\s+$/g, '');
    if (!v.what) return true;
    if (v.unit && !v.n) {
      p.mpUi.formErr = 'Add the number as well';
      render();
      return true;
    }
    if (v.n && !v.unit) {
      p.mpUi.formErr = 'Pick the unit as well';
      render();
      return true;
    }
    if (i >= 0) p.mpAct[i] = v;
    else p.mpAct.push(v);
    p.mpUi.formKind = '';
    p.mpUi.formI = null;
    p.mpUi.formErr = '';
    render();
    return true;
  }
  if (act === 'ach-del') {
    p.mpUi.confirmDel = 'ach-' + i;
    render();
    return true;
  }
  if (act === 'act-del') {
    p.mpUi.confirmDel = 'act-' + i;
    render();
    return true;
  }
  if (act === 'ach-kill') {
    p.mpAch.splice(i, 1);
    p.mpUi.formKind = '';
    p.mpUi.confirmDel = '';
    render();
    return true;
  }
  if (act === 'act-kill') {
    p.mpAct.splice(i, 1);
    p.mpUi.formKind = '';
    p.mpUi.confirmDel = '';
    render();
    return true;
  }
  if (act === 'see-more') {
    p.mpUi.more = p.mpUi.more === kind + '-' + i ? '' : kind + '-' + i;
    render();
    return true;
  }
  if (act === 'show-all') {
    if (kind === 'ach') p.mpUi.showAch = true;
    else p.mpUi.showAct = true;
    render();
    return true;
  }
  if (act === 'skill-add') {
    v = byId('mp-skill');
    v = v && v.value ? v.value.replace(/^\s+|\s+$/g, '') : '';
    if (!v) return true;
    for (i = 0; i < p.mpSkills.length; i++) {
      if (p.mpSkills[i].toLowerCase() === v.toLowerCase()) {
        p.mpUi.skillErr = 'Already on the list';
        render();
        return true;
      }
    }
    p.mpSkills.push(v);
    p.mpUi.skillErr = '';
    render();
    return true;
  }
  if (act === 'skill-del') {
    p.mpSkills.splice(i, 1);
    render();
    return true;
  }
  return false;
}

function mpHandleInput(e) {
  var t = e.target;
  var exam;
  var p;
  if (!t || !t.getAttribute) return false;
  exam = t.getAttribute('data-mp-combo');
  if (!exam) return false;
  p = ensureMp();
  p.mpUi.comboExam = exam;
  p.mpUi.comboQ = t.value;
  p.mpUi.comboIx = -1;
  render();
  return true;
}

function mpHandleKey(e) {
  var t = e.target;
  var exam;
  var p;
  var hits;
  var n;
  if (!t || !t.getAttribute) return false;
  if (t.id && t.id.indexOf('mp-goal-') === 0 && e.key === 'Enter') {
    mpAddGoal(t.id.slice(8));
    e.preventDefault();
    return true;
  }
  if (t.id === 'mp-skill' && e.key === 'Enter') {
    closestEl(t, '.mp-skill-add').querySelector('[data-mp="skill-add"]').click();
    e.preventDefault();
    return true;
  }
  exam = t.getAttribute('data-mp-combo');
  if (!exam) return false;
  p = ensureMp();
  hits = mpFilterOptions(exam, p.mpUi.comboQ);
  n = Math.min(8, hits.length);
  if (e.key === 'ArrowDown') {
    p.mpUi.comboIx = p.mpUi.comboIx + 1 >= n ? 0 : p.mpUi.comboIx + 1;
    e.preventDefault();
    render();
    return true;
  }
  if (e.key === 'ArrowUp') {
    p.mpUi.comboIx = p.mpUi.comboIx <= 0 ? n - 1 : p.mpUi.comboIx - 1;
    e.preventDefault();
    render();
    return true;
  }
  if (e.key === 'Enter') {
    if (p.mpUi.comboIx >= 0 && hits[p.mpUi.comboIx]) {
      mpPickSubj(exam, hits[p.mpUi.comboIx].name, hits[p.mpUi.comboIx].unit);
    }
    e.preventDefault();
    return true;
  }
  if (e.key === 'Escape') {
    p.mpUi.comboExam = '';
    p.mpUi.comboQ = '';
    p.mpUi.comboIx = -1;
    render();
    return true;
  }
  return false;
}

function mpInit() {
  if (typeof window === 'undefined' || window.__mpBound) return;
  window.__mpBound = true;
  document.addEventListener('keydown', function (e) {
    mpHandleKey(e);
  });
}
