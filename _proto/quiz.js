/* Personality half of the pathway quiz. ES5. No storage. No em/en dashes.
   Ported from check.html's standalone archetype quiz so "Build my pathway"
   asks the real RIASEC questions instead of one guessed archetype tap.
   Six archetypes: Steward, Artisan, Pioneer, Advocate, Visionary, Gladiator.
   Field keys below (science, trade, education, ...) match FIELDS in data.js
   so the curiosity ranking step can double as the existing "which fields
   interest you" pick. */

var PWQ_DIMS = ['R', 'I', 'A', 'S', 'E', 'C'];
var PWQ_DIM_NAME = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' };
var PWQ_RATE_LABEL = { 1: 'Hate it', 2: 'Not really', 3: 'Alright', 4: 'Love it' };

var PWQ_ITEMS = [
  { dim: 'S', t: 'Sit with a younger student until they finally understand their homework' },
  { dim: 'R', t: 'Get a broken generator running when you have blackout' },
  { dim: 'C', t: 'Keep the money records for your parents so every dollar adds up' },
  { dim: 'A', t: 'Design a float for Diwali or Mash' },
  { dim: 'I', t: 'Find out why the water out your pipe is rusty' },
  { dim: 'E', t: 'Buy something cheap, sell it for more, and keep doing that' },
  { dim: 'I', t: 'Work out a maths problem that has no obvious method' },
  { dim: 'E', t: 'Convince a room full of your friends to change their mind' },
  { dim: 'R', t: 'Wire up the lights and sound for the next school or work event' },
  { dim: 'C', t: 'Turn a messy pile of papers into a system anyone could use' },
  { dim: 'S', t: 'Look after someone who is recovering from being unwell' },
  { dim: 'A', t: 'Write a song, poem or story that other people will hear' }
];

var PWQ_TIEBREAK = {
  R: [
    { dim: 'R', t: 'Grow crops or raise animals on a farm' },
    { dim: 'R', t: 'Learn to weld, or service an air conditioning unit' }
  ],
  I: [
    { dim: 'I', t: 'Take a machine apart just to understand how it works' },
    { dim: 'I', t: 'Test soil or water samples and record what you find' }
  ],
  A: [
    { dim: 'A', t: 'Edit photos or video into something people want to watch' },
    { dim: 'A', t: 'Design a logo and posters for an organisation' }
  ],
  S: [
    { dim: 'S', t: 'Coach a team, or lead a training session' },
    { dim: 'S', t: 'Run activities for children at a community event' }
  ],
  E: [
    { dim: 'E', t: 'Start a small business of your own' },
    { dim: 'E', t: 'Speak on behalf of a group at a public meeting' }
  ],
  C: [
    { dim: 'C', t: 'Check a long document for mistakes before it goes out' },
    { dim: 'C', t: 'Keep track of stock and supplies so nothing runs out' }
  ]
};

var PWQ_ARCH_DESC = {
  'The Steward': "Stewards look after something bigger than themselves: a body of knowledge, people's health, land, or a system other people depend on. They are usually trusted long before they are noticed.",
  'The Artisan': "Artisans trust what their hands can prove. They would rather show you the finished thing than describe it, and the skill travels with them wherever they go.",
  'The Pioneer': 'Pioneers start things. Being first also means being wrong in public sometimes, and they will take that over waiting for permission.',
  'The Advocate': "Advocates speak for people who are not in the room. They work through argument and persuasion, and they usually noticed the unfairness first.",
  'The Visionary': "Visionaries see the version that does not exist yet. They work in ideas, images and language, and the contribution is often obvious only once it is made.",
  'The Gladiator': "Gladiators do their best work when it counts and somebody is watching. They have learned things about pressure that most people never have to."
};

var PWQ_ARCH_QUOTE = {
  R: "I would rather build the thing than talk about building it.",
  I: "I need to know why before I will accept how.",
  A: "I can see the version of this that does not exist yet.",
  S: "I do my best work when somebody else gets better because of it.",
  E: "I would rather persuade the room than wait for permission.",
  C: 'I keep things right when nobody is checking.'
};

var PWQ_ARCH_COLOR = {
  'The Steward': { grad: 'linear-gradient(145deg,#07864d,#05603a)', tintBg: '#e8f7ef', tintInk: '#05603a' },
  'The Artisan': { grad: 'linear-gradient(145deg,#0a4a52,#0a2d52)', tintBg: '#e8f2ff', tintInk: '#1a55a8' },
  'The Pioneer': { grad: 'linear-gradient(145deg,#c98a12,#a3500f)', tintBg: '#fff0e2', tintInk: '#a3500f' },
  'The Advocate': { grad: 'linear-gradient(145deg,#0f4272,#0a2d52)', tintBg: '#e8f1fa', tintInk: '#0a2d52' },
  'The Visionary': { grad: 'linear-gradient(145deg,#078697,#04616e)', tintBg: '#e2f5f7', tintInk: '#04616e' },
  'The Gladiator': { grad: 'linear-gradient(145deg,#a92e28,#7a201c)', tintBg: '#ffe9e7', tintInk: '#a92e28' }
};

var PWQ_DEFAULT_ARCH = { R: 'The Artisan', I: 'The Steward', A: 'The Visionary', S: 'The Advocate', E: 'The Pioneer', C: 'The Steward' };

/* Keyed by FIELDS[i].k (data.js), not the old check.html bucket names. */
var PWQ_BUCKET_OVERRIDE = {
  law: { R: 'The Advocate' },
  'public': { R: 'The Advocate' },
  trade: { I: 'The Artisan' },
  creative: { C: 'The Visionary' },
  sports: { R: 'The Gladiator', C: 'The Gladiator' }
};
var PWQ_GLADIATOR_FIELDS = { sports: 1, business: 1, 'public': 1, trade: 1 };

var PWQ_EXTRA_OPTS = [
  { v: 'club', t: 'School club or society' },
  { v: 'sports', t: 'Sports team' },
  { v: 'music', t: 'Music, choir or band' },
  { v: 'debate', t: 'Debating or public speaking' },
  { v: 'essay', t: 'Essay or writing competitions' },
  { v: 'church', t: 'Church or community group' },
  { v: 'family-biz', t: 'Helping with a family business' },
  { v: 'else', t: 'Something else' },
  { v: 'none', t: 'Nothing right now, and that is fine' }
];
var PWQ_EXTRA_DIM = { club: null, sports: 'R', music: 'A', debate: 'E', essay: 'A', church: 'S', 'family-biz': 'E', 'else': null, none: null };

var PWQ_PRESSURE_OPTS = [
  { v: 'fix', t: 'Try to fix it myself before asking anyone' },
  { v: 'why', t: 'Work out what went wrong, and why' },
  { v: 'different', t: 'Find a completely different way to approach it' },
  { v: 'talk', t: 'Talk it through with someone I trust' },
  { v: 'charge', t: 'Take charge and reorganise the whole thing' },
  { v: 'contain', t: 'Make sure nothing else slips through the gaps' }
];
var PWQ_PRESSURE_LINE = {
  fix: 'You would rather solve it yourself before anyone else knows.',
  why: 'You stop and find the cause before you move.',
  different: 'You start over from a different angle.',
  talk: 'You think it out loud with somebody.',
  charge: 'You take hold of it and rebuild the plan.',
  contain: 'You contain it before anything else goes wrong.'
};

var PWQ_CONDITIONS_OPTS = [
  { v: 'expected', t: "When I know exactly what's expected of me" },
  { v: 'own', t: 'When I can figure out my own approach' },
  { v: 'fast', t: "When I'm moving fast and reacting" },
  { v: 'depends', t: 'It depends on the situation' }
];
var PWQ_CONDITIONS_LINE = {
  expected: "You do better knowing what's expected before you start.",
  own: 'You want the goal, then room to reach it your own way.',
  fast: "You would rather be moving and correcting than waiting to be sure.",
  depends: 'Your best setup shifts with the task.'
};

var PWQ_RECOVER_OPTS = [
  { v: 'people', t: 'Being around people' },
  { v: 'alone', t: 'Time to myself' },
  { v: 'both', t: 'A proper mix of both' }
];
var PWQ_RECOVER_LINE = {
  people: 'You recover around other people, not away from them.',
  alone: 'You need real time on your own to come back.',
  both: 'You need both, in roughly equal measure.'
};

var PWQ_CONCERN_OPTS = [
  { v: 'no-idea', t: "I don't know what I'm good at" },
  { v: 'afford', t: 'Whether I can afford it' },
  { v: 'exists', t: 'Whether the opportunity exists in Guyana' },
  { v: 'family', t: 'Family expectations' },
  { v: 'earn', t: 'Needing to earn money soon' },
  { v: 'good-enough', t: 'Not knowing what qualifications I need' },
  { v: 'early', t: 'Locking myself in too early' },
  { v: 'leaving', t: "Whether I'd have to leave home" }
];

var PWQ_ADVICE_OPTS = [
  { v: 'parents', t: 'A parent, sibling or guardian' },
  { v: 'teacher', t: 'A teacher or counsellor' },
  { v: 'friends', t: 'Friends my own age' },
  { v: 'mentor', t: 'A mentor or someone in the field' },
  { v: 'noone', t: 'Honestly, nobody' }
];

function pwqRateStart(stepId) {
  if (stepId === 'r0') return 0;
  if (stepId === 'r1') return 3;
  if (stepId === 'r2') return 6;
  if (stepId === 'r3') return 9;
  return 0;
}

function pwqGetTiebreakItems(primary, secondary) {
  var a = PWQ_TIEBREAK[primary] || PWQ_TIEBREAK.R;
  var b = PWQ_TIEBREAK[secondary] || PWQ_TIEBREAK.I;
  return [a[0], b[0], a[1], b[1]];
}

function pwqHashFallback(ratings, tbRatings) {
  var sig = '';
  var i;
  var h = 0;
  var fallback = {};
  for (i = 0; i < ratings.length; i++) sig += ratings[i] == null ? '0' : String(ratings[i]);
  if (tbRatings) {
    for (i = 0; i < tbRatings.length; i++) sig += tbRatings[i] == null ? '0' : String(tbRatings[i]);
  }
  for (i = 0; i < sig.length; i++) {
    h = (h * 31 + sig.charCodeAt(i)) >>> 0;
  }
  for (i = 0; i < PWQ_DIMS.length; i++) {
    fallback[PWQ_DIMS[i]] = (h >> (i * 3)) & 7;
  }
  return fallback;
}

/* p is S.pw. Mirrors check.html's scoreRiasec(baseOnly). */
function pwqScore(p, baseOnly) {
  var buckets = {};
  var count4 = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  var count3 = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  var mean = {};
  var extra = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  var grand = 0;
  var adj = {};
  var fallback;
  var rankedDims;
  var i, d, v, item, arr;
  var primary, secondary, close, spread, flat;
  var meanSum = 0;
  var shares = {};

  for (i = 0; i < PWQ_DIMS.length; i++) buckets[PWQ_DIMS[i]] = [];
  for (i = 0; i < PWQ_ITEMS.length; i++) {
    item = PWQ_ITEMS[i];
    v = p.ratings[i];
    if (v == null) continue;
    buckets[item.dim].push(v);
    if (v === 4) count4[item.dim] += 1;
    if (v === 3) count3[item.dim] += 1;
  }
  if (!baseOnly && p.tbRatings && p.tbDims) {
    var tbItems = pwqGetTiebreakItems(p.tbDims[0], p.tbDims[1]);
    for (i = 0; i < tbItems.length; i++) {
      item = tbItems[i];
      v = p.tbRatings[i];
      if (v == null) continue;
      buckets[item.dim].push(v);
      if (v === 4) count4[item.dim] += 1;
      if (v === 3) count3[item.dim] += 1;
    }
  }
  for (i = 0; i < PWQ_DIMS.length; i++) {
    d = PWQ_DIMS[i];
    arr = buckets[d];
    mean[d] = arr.length ? sumArr(arr) / arr.length : 0;
  }
  if (!baseOnly) {
    for (i = 0; i < (p.extra || []).length; i++) {
      d = PWQ_EXTRA_DIM[p.extra[i]];
      if (d) extra[d] += 0.5;
    }
    for (i = 0; i < PWQ_DIMS.length; i++) {
      d = PWQ_DIMS[i];
      mean[d] += Math.min(extra[d], 1.0);
    }
  }
  for (i = 0; i < PWQ_DIMS.length; i++) grand += mean[PWQ_DIMS[i]];
  grand = grand / 6;
  for (i = 0; i < PWQ_DIMS.length; i++) adj[PWQ_DIMS[i]] = mean[PWQ_DIMS[i]] - grand;
  fallback = pwqHashFallback(p.ratings, baseOnly ? null : p.tbRatings);
  rankedDims = PWQ_DIMS.slice().sort(function (a2, b2) {
    if (adj[b2] !== adj[a2]) return adj[b2] - adj[a2];
    if (count4[b2] !== count4[a2]) return count4[b2] - count4[a2];
    if (count3[b2] !== count3[a2]) return count3[b2] - count3[a2];
    return fallback[a2] - fallback[b2];
  });
  primary = rankedDims[0];
  secondary = rankedDims[1];
  close = Math.abs(adj[primary] - adj[secondary]) <= 0.5;
  spread = adj[rankedDims[0]] - adj[rankedDims[5]];
  flat = spread < 0.25;
  for (i = 0; i < PWQ_DIMS.length; i++) meanSum += mean[PWQ_DIMS[i]];
  for (i = 0; i < PWQ_DIMS.length; i++) {
    d = PWQ_DIMS[i];
    shares[d] = meanSum > 0 ? (mean[d] / meanSum) * 100 : 100 / 6;
  }
  return {
    mean: mean, adj: adj, shares: shares, rankedDims: rankedDims,
    primary: primary, secondary: secondary, close: close, flat: flat, spread: spread,
    code: primary + secondary
  };
}

function sumArr(arr) {
  var i, t = 0;
  for (i = 0; i < arr.length; i++) t += arr[i];
  return t;
}

function pwqNeedsTiebreak(sc) {
  if (sc.flat) return false;
  return sc.adj[sc.primary] - sc.adj[sc.secondary] <= 0.35;
}

function pwqPerfScore(p) {
  var perf = 0;
  if (p.pressure === 'charge') perf += 1.0;
  else if (p.pressure === 'fix') perf += 0.5;
  if (p.conditions === 'fast') perf += 1.0;
  else if (p.conditions === 'own') perf += 0.5;
  return perf;
}

function pwqResolveArchetype(p, primary, bucket) {
  var arch = PWQ_DEFAULT_ARCH[primary] || 'The Steward';
  var ov = PWQ_BUCKET_OVERRIDE[bucket];
  var perf;
  if (ov && ov[primary]) arch = ov[primary];
  perf = pwqPerfScore(p);
  if (perf >= 1.5 && PWQ_GLADIATOR_FIELDS[bucket]) arch = 'The Gladiator';
  return arch;
}

/* Full result once every personality question is answered. p.fields[0]
   (if any) is the top curiosity pick and doubles as the career bucket. */
function pwqBuildProfile(p) {
  var sc = pwqScore(p, false);
  var bucket = (p.fields && p.fields[0]) || null;
  var archetype = sc.flat ? '' : pwqResolveArchetype(p, sc.primary, bucket);
  return {
    primary: sc.primary,
    secondary: sc.secondary,
    code: sc.code,
    close: sc.close,
    flat: sc.flat,
    archetype: archetype,
    bucket: bucket
  };
}

/* Keeps p.tbDims pointing at the current primary/secondary RIASEC pair.
   Clears any half-answered tiebreak ratings if the pair changes because
   an earlier rating was edited after going back. Mirrors check.html's
   syncTiebreak. */
function pwqSyncTiebreak(p, sc) {
  var dims = [sc.primary, sc.secondary];
  if (p.tbDims && (p.tbDims[0] !== dims[0] || p.tbDims[1] !== dims[1])) {
    p.tbRatings = [null, null, null, null];
  } else if (!p.tbRatings) {
    p.tbRatings = [null, null, null, null];
  }
  p.tbDims = dims;
}

/* The step order for the merged personality + pathway wizard. Rebuilt on
   every render since the tiebreak step only appears when the top two
   RIASEC scores are close, mirroring check.html's rebuildFlow(). */
function pwqFlow(p) {
  var flow = ['level', 'region', 'r0', 'r1', 'r2', 'r3'];
  var sc = pwqScore(p, true);
  if (pwqNeedsTiebreak(sc)) {
    pwqSyncTiebreak(p, sc);
    flow.push('tiebreak');
  } else {
    p.tbRatings = null;
    p.tbDims = null;
  }
  return flow.concat([
    'curiosity', 'clarity', 'goal', 'priority', 'blocker',
    'pressure', 'conditions', 'recover', 'extra', 'concerns', 'advice'
  ]);
}

function pwqStepComplete(p, stepId) {
  var start, i;
  if (stepId === 'level') return !!p.level;
  if (stepId === 'region') return !!p.region;
  if (stepId === 'r0' || stepId === 'r1' || stepId === 'r2' || stepId === 'r3') {
    start = pwqRateStart(stepId);
    for (i = start; i < start + 3; i++) {
      if (p.ratings[i] == null) return false;
    }
    return true;
  }
  if (stepId === 'tiebreak') {
    if (!p.tbRatings) return false;
    for (i = 0; i < p.tbRatings.length; i++) {
      if (p.tbRatings[i] == null) return false;
    }
    return true;
  }
  if (stepId === 'curiosity') return p.fields.length >= 1;
  if (stepId === 'clarity') return !!p.clarity;
  if (stepId === 'goal') return !!p.goal;
  if (stepId === 'priority') return !!p.priority;
  if (stepId === 'blocker') return !!p.blocker;
  if (stepId === 'pressure') return !!p.pressure;
  if (stepId === 'conditions') return !!p.conditions;
  if (stepId === 'recover') return !!p.recover;
  if (stepId === 'extra') return true;
  if (stepId === 'concerns') return true;
  if (stepId === 'advice') return !!p.advice;
  return true;
}
