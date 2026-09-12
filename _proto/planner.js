/* Pathway first-run planner. ES5. No em/en dashes. Instrument version stamps every result. */
var PLAN_INSTRUMENT = 'arch-6block-v1';

var PLAN_ARCH = {
  Healer: {
    name: 'The Healer',
    line: 'You want to leave people better than you found them.',
    deep: '#a8324b', tint: '#fdeef1', glow: '#f3a2b4',
    icon: 'healer'
  },
  Artisan: {
    name: 'The Artisan',
    line: 'You trust what your hands can prove.',
    deep: '#9a5313', tint: '#fbf0e3', glow: '#efb474',
    icon: 'artisan'
  },
  Investigator: {
    name: 'The Investigator',
    line: 'You want to know why, and you will keep pulling until it comes apart.',
    deep: '#0c666e', tint: '#e4f3f4', glow: '#6fcdd6',
    icon: 'investigator'
  },
  Advocate: {
    name: 'The Advocate',
    line: 'You speak for people who are not in the room.',
    deep: '#6437a0', tint: '#f1ecfa', glow: '#bfa3f0',
    icon: 'advocate'
  },
  Explainer: {
    name: 'The Explainer',
    line: 'You make hard things make sense, and people come to you when they are stuck.',
    deep: '#1d5aa0', tint: '#e9f1fb', glow: '#8dbdf0',
    icon: 'explainer'
  },
  Steward: {
    name: 'The Steward',
    line: 'You look after something bigger than yourself.',
    deep: '#1d6640', tint: '#e8f5ed', glow: '#79d3a1',
    icon: 'steward'
  },
  Pioneer: {
    name: 'The Pioneer',
    line: 'You start things.',
    deep: '#8a6612', tint: '#fdf6e0', glow: '#e8b93a',
    icon: 'pioneer'
  },
  Gladiator: {
    name: 'The Gladiator',
    line: 'You want to know where you stand, and you will find out the hard way.',
    deep: '#9b2b6d', tint: '#fbebf4', glow: '#eda1c9',
    icon: 'gladiator'
  },
  Explorer: {
    name: 'The Explorer',
    line: 'You are still looking, and that is the honest place to start.',
    deep: '#3d5566', tint: '#eef1f4', glow: '#a9bfcf',
    icon: 'explorer'
  }
};

var PLAN_GALLERY = ['Steward', 'Healer', 'Artisan', 'Investigator', 'Advocate', 'Explainer', 'Pioneer', 'Gladiator'];

var PLAN_BLOCKS = [
  {
    k: 'b1',
    q: 'Sports day at school. Where do you actually end up?',
    opts: [
      { a: 'Gladiator', t: 'On the field, trying to win, even if you lose in front of everyone' },
      { a: 'Artisan', t: 'Setting up the sound and the tents, and missing most of the events' },
      { a: 'Healer', t: 'In the first-aid tent, dealing with whoever got hurt' },
      { a: 'Investigator', t: 'On the stopwatch, arguing with people about the actual times' }
    ]
  },
  {
    k: 'b2',
    q: 'A younger cousin is failing a subject and the family is arguing about it.',
    opts: [
      { a: 'Explainer', t: 'Teach them yourself, over and over, until it lands' },
      { a: 'Advocate', t: 'Say something while the adults talk about them, and risk being told off' },
      { a: 'Steward', t: 'Take on making sure the homework happens every night, for months' },
      { a: 'Pioneer', t: 'Suggest something completely different, and carry the blame if it fails' }
    ]
  },
  {
    k: 'b3',
    q: 'A free Saturday. Nothing you have to do. What actually happens?',
    opts: [
      { a: 'Gladiator', t: 'Practising something until you are measurably better than last week' },
      { a: 'Pioneer', t: 'Starting something you might not finish' },
      { a: 'Explainer', t: 'Helping someone with the thing you have already explained twice' },
      { a: 'Healer', t: 'Sitting with someone having a hard time, not knowing what to say' }
    ]
  },
  {
    k: 'b4',
    q: 'Something at your school has been broken for months.',
    opts: [
      { a: 'Artisan', t: 'Fix it yourself, roughly, with whatever you can get hold of' },
      { a: 'Advocate', t: 'Keep asking whoever can authorise it until they are sick of you' },
      { a: 'Investigator', t: 'Work out why it broke and why nobody fixed it, fixed or not' },
      { a: 'Steward', t: 'Quietly look after it from now on, with nobody noticing' }
    ]
  },
  {
    k: 'b5',
    q: 'Your family is throwing a big function, like a wedding or a birthday. Where are you?',
    opts: [
      { a: 'Artisan', t: 'The heavy work: building, wiring, cooking, before anyone arrives' },
      { a: 'Steward', t: 'Tracking what is running out, all night, while everyone else enjoys it' },
      { a: 'Explainer', t: 'Showing the younger ones how to do their bit, slowly' },
      { a: 'Healer', t: 'Looking after whoever is overwhelmed, away from the party' }
    ]
  },
  {
    k: 'b6',
    q: 'Ten years from now, which would you be proudest of?',
    opts: [
      { a: 'Pioneer', t: 'Something that exists because you started it, even if someone else runs it now' },
      { a: 'Advocate', t: 'A decision that changed because you would not drop it' },
      { a: 'Investigator', t: 'Working out something nobody had worked out, even if few people know' },
      { a: 'Gladiator', t: 'Being genuinely one of the best at something, with the record to prove it' }
    ]
  }
];

function planFieldOpts() {
  var i, out = [];
  for (i = 0; i < FIELDS.length; i++) out.push({ v: FIELDS[i].k, t: FIELDS[i].n });
  return out;
}

function planRegionOpts() {
  var i, out = [];
  for (i = 0; i < REGIONS.length; i++) out.push({ v: REGIONS[i].k, t: REGIONS[i].short });
  return out;
}

var PLAN_PART2 = {
  student: {
    introK: 'Now the practical part.',
    note: 'Be honest about the obstacle. It changes what we show you more than your goal does.',
    qs: [
      {
        k: 'clarity', type: 'one',
        q: 'How clear are you right now?',
        opts: [
          { v: 'exact', t: 'I know exactly what I want' },
          { v: 'field', t: 'I know the field, not the job' },
          { v: 'none', t: 'No idea yet' }
        ]
      },
      {
        k: 'fields', type: 'rank', cap: 3,
        q: 'Which fields interest you most? Tap up to three, in order.',
        opts: null
      },
      {
        k: 'goal', type: 'one',
        q: 'When you picture life after school, which is closest?',
        opts: [
          { v: 'uni', t: 'University, here or abroad' },
          { v: 'trade', t: 'A trade or technical certificate' },
          { v: 'earn', t: 'Earning as soon as I can' },
          { v: 'own', t: 'Running something of my own' },
          { v: 'range', t: 'No idea yet' }
        ]
      },
      {
        k: 'priority', type: 'one',
        q: 'What matters most in the next twelve months?',
        opts: [
          { v: 'grades', t: 'Getting my grades up' },
          { v: 'options', t: 'Keeping my options open' },
          { v: 'try', t: 'Finding out if I actually like a field' },
          { v: 'money', t: 'Money and cost' },
          { v: 'home', t: 'Being taken seriously at home' }
        ]
      },
      {
        k: 'blockers', type: 'many', cap: 3,
        q: 'What is most in your way? Pick up to three.',
        opts: [
          { v: 'ask', t: 'Nobody to ask' },
          { v: 'cost', t: 'Cost or transport' },
          { v: 'dropped', t: 'I already dropped a subject I might need' },
          { v: 'nothing', t: 'Nothing runs where I live' },
          { v: 'time', t: 'Time, between school and home' },
          { v: 'family', t: 'Family expectations' },
          { v: 'earn', t: 'Needing to earn money soon' },
          { v: 'lock', t: 'Locking myself in too early' },
          { v: 'leave', t: 'Whether I would have to leave home' },
          { v: 'qual', t: 'Not knowing what qualifications I need' }
        ]
      },
      {
        k: 'who', type: 'one',
        q: 'Who do you talk to about decisions like this?',
        opts: [
          { v: 'parents', t: 'A parent, sibling or guardian' },
          { v: 'teacher', t: 'A teacher or counsellor' },
          { v: 'friends', t: 'Friends my own age' },
          { v: 'mentor', t: 'A mentor or someone in the field' },
          { v: 'nobody', t: 'Honestly, nobody' }
        ]
      }
    ]
  },
  parent: {
    introK: 'Now about your child.',
    note: 'Be honest about the obstacle. It changes what we show you more than the destination does.',
    qs: [
      {
        k: 'stage', type: 'one',
        q: 'What stage is your child at?',
        opts: [
          { v: 'early', t: 'Form 1 or 2' },
          { v: 'f3', t: 'Form 3' },
          { v: 'csec', t: 'Form 4 or 5' },
          { v: 'sixth', t: 'Sixth form' },
          { v: 'after', t: 'Finished CSEC, deciding' },
          { v: 'tertiary', t: 'Already at university or a trade' }
        ]
      },
      {
        k: 'clarity', type: 'one',
        q: 'How clear are they about what they want?',
        opts: [
          { v: 'exact', t: 'They know exactly' },
          { v: 'field', t: 'They know the field' },
          { v: 'none', t: 'They are still looking' },
          { v: 'split', t: 'We do not agree' }
        ]
      },
      {
        k: 'help', type: 'one',
        q: 'What do you most want help with?',
        opts: [
          { v: 'subjects', t: 'Subject choices' },
          { v: 'after', t: 'What comes after CSEC' },
          { v: 'cost', t: 'Cost and scholarships' },
          { v: 'talk', t: 'Talking to them about it' },
          { v: 'people', t: 'Finding people who have done it' }
        ]
      },
      {
        k: 'worries', type: 'many', cap: 3,
        q: 'What worries you most? Pick up to three.',
        opts: [
          { v: 'cost', t: 'Cost' },
          { v: 'lock', t: 'They will lock in too early' },
          { v: 'leave', t: 'They will have to leave home' },
          { v: 'nothing', t: 'Nothing runs where we live' },
          { v: 'family', t: 'Family pressure, including mine' },
          { v: 'idea', t: 'They do not know what they are good at' }
        ]
      },
      {
        k: 'before', type: 'one',
        q: 'Have you been through this before?',
        opts: [
          { v: 'older', t: 'Yes, with an older child' },
          { v: 'own', t: 'Yes, my own school years' },
          { v: 'no', t: 'No, this is the first time' }
        ]
      },
      {
        k: 'now', type: 'one',
        q: 'What would help you most right now?',
        opts: [
          { v: 'step', t: 'A clear next step for this month' },
          { v: 'talk', t: 'Someone to talk to with them' },
          { v: 'list', t: 'A list of programmes that actually reach us' },
          { v: 'cost', t: 'Help with the cost conversation' }
        ]
      }
    ]
  },
  teacher: {
    introK: 'Now about your students.',
    note: 'Say the real friction. It changes what we put in front of you.',
    qs: [
      {
        k: 'job', type: 'one',
        q: 'What do you do at the school?',
        opts: [
          { v: 'form', t: 'Form teacher' },
          { v: 'subject', t: 'Subject teacher' },
          { v: 'guidance', t: 'Guidance or counselling' },
          { v: 'hod', t: 'Head of department' },
          { v: 'admin', t: 'Administration' }
        ]
      },
      {
        k: 'forms', type: 'many', cap: 3,
        q: 'Which forms do you work with most? Pick up to three.',
        opts: [
          { v: 'f1', t: 'Form 1' },
          { v: 'f2', t: 'Form 2' },
          { v: 'f3', t: 'Form 3' },
          { v: 'f4', t: 'Form 4' },
          { v: 'f5', t: 'Form 5' },
          { v: 'l6', t: 'Lower Sixth' },
          { v: 'u6', t: 'Upper Sixth' }
        ]
      },
      {
        k: 'ask', type: 'one',
        q: 'What do students ask you most?',
        opts: [
          { v: 'subjects', t: 'Subject choices' },
          { v: 'after', t: 'What to do after CSEC' },
          { v: 'cost', t: 'Scholarships and cost' },
          { v: 'enough', t: 'Whether they are good enough' },
          { v: 'untrained', t: 'Things I am not trained to answer' }
        ]
      },
      {
        k: 'hard', type: 'many', cap: 3,
        q: 'What is hardest about this part of your job? Pick up to three.',
        opts: [
          { v: 'time', t: 'Time' },
          { v: 'parents', t: 'Parents who have already decided' },
          { v: 'nothing', t: 'No local options to point to' },
          { v: 'quiet', t: 'Students who will not talk' },
          { v: 'keep', t: 'Keeping up with what still exists' }
        ]
      },
      {
        k: 'help', type: 'one',
        q: 'What would help you most?',
        opts: [
          { v: 'sheet', t: 'A sheet I can send home' },
          { v: 'names', t: 'Names of people students can ask' },
          { v: 'period', t: 'Something I can run in a form period' },
          { v: 'send', t: 'Just a place to send them' }
        ]
      },
      {
        k: 'part', type: 'one',
        q: 'Would you take part yourself?',
        opts: [
          { v: 'mentor', t: 'Yes, as a mentor' },
          { v: 'openings', t: 'Yes, by sharing openings' },
          { v: 'no', t: 'Not right now' }
        ]
      }
    ]
  },
  mentor: {
    introK: 'Now how you can help.',
    note: 'What you can actually give this month is more useful than a long list.',
    qs: [
      {
        k: 'fields', type: 'rank', cap: 2,
        q: 'Which fields can you speak to? Tap up to two, in order.',
        opts: null
      },
      {
        k: 'route', type: 'one',
        q: 'What route did you take yourself?',
        opts: [
          { v: 'uni-here', t: 'University here' },
          { v: 'uni-abroad', t: 'University abroad' },
          { v: 'trade', t: 'A trade or TVET' },
          { v: 'work', t: 'Work, then study' },
          { v: 'own', t: 'I built something of my own' }
        ]
      },
      {
        k: 'offer', type: 'many', cap: 3,
        q: 'What can you offer? Pick up to three.',
        opts: [
          { v: 'group', t: 'Group sessions' },
          { v: 'one', t: 'One conversation' },
          { v: 'read', t: 'Reading an application' },
          { v: 'visit', t: 'A workplace visit' },
          { v: 'money', t: 'Honest talk about money' }
        ]
      },
      {
        k: 'time', type: 'one',
        q: 'How much time a month, realistically?',
        opts: [
          { v: 'under2', t: 'Under two hours' },
          { v: '2to4', t: 'Two to four hours' },
          { v: 'day', t: 'A day' },
          { v: 'depends', t: 'It depends' }
        ]
      },
      {
        k: 'reach', type: 'one',
        q: 'Who do you most want to reach?',
        opts: [
          { v: 'f3', t: 'Form 3, choosing subjects' },
          { v: 'csec', t: 'Form 4 and 5, CSEC' },
          { v: 'after', t: 'After CSEC' },
          { v: 'home', t: 'Students where I grew up' }
        ]
      },
      {
        k: 'ask', type: 'many', cap: 3,
        q: 'What should students ask you about? Pick up to three.',
        opts: [
          { v: 'cost', t: 'The real cost' },
          { v: 'dropped', t: 'What I dropped' },
          { v: 'again', t: 'What I would do again' },
          { v: 'job', t: 'How I got the first job' },
          { v: 'leave', t: 'Whether to leave Guyana' }
        ]
      }
    ]
  },
  collaborator: {
    introK: 'Now what you offer.',
    note: 'Be specific about who you actually reach. It stops us sending the wrong students.',
    qs: [
      {
        k: 'org', type: 'one',
        q: 'What kind of organisation are you?',
        opts: [
          { v: 'school', t: 'School or training centre' },
          { v: 'employer', t: 'Employer' },
          { v: 'public', t: 'Public programme' },
          { v: 'ngo', t: 'NGO or community group' },
          { v: 'else', t: 'Something else' }
        ]
      },
      {
        k: 'offer', type: 'many', cap: 3,
        q: 'What do you offer students? Pick up to three.',
        opts: [
          { v: 'openings', t: 'Openings' },
          { v: 'sessions', t: 'Sessions' },
          { v: 'mentors', t: 'Mentors' },
          { v: 'info', t: 'Information' },
          { v: 'places', t: 'Places on a programme' }
        ]
      },
      {
        k: 'regions', type: 'many', cap: 3,
        q: 'Which regions do you reach? Pick up to three.',
        opts: null
      },
      {
        k: 'who', type: 'many', cap: 3,
        q: 'Who is it for? Pick up to three.',
        opts: [
          { v: 'early', t: 'Form 1 to 3' },
          { v: 'csec', t: 'Form 4 and 5' },
          { v: 'after', t: 'After CSEC' },
          { v: 'teachers', t: 'Teachers' },
          { v: 'parents', t: 'Parents' }
        ]
      },
      {
        k: 'often', type: 'one',
        q: 'How often do you have something to share?',
        opts: [
          { v: 'weekly', t: 'Weekly' },
          { v: 'monthly', t: 'Monthly' },
          { v: 'few', t: 'A few times a year' },
          { v: 'round', t: 'When a round opens' }
        ]
      },
      {
        k: 'want', type: 'one',
        q: 'What do you most want from Next Step?',
        opts: [
          { v: 'fit', t: 'Students who fit' },
          { v: 'hinterland', t: 'Help reaching hinterland' },
          { v: 'post', t: 'A place to post openings' },
          { v: 'mentors', t: 'Mentors from our side' }
        ]
      }
    ]
  }
};

function planImul(a, b) {
  a |= 0;
  b |= 0;
  var ah = (a >>> 16) & 0xffff;
  var al = a & 0xffff;
  var bh = (b >>> 16) & 0xffff;
  var bl = b & 0xffff;
  return (al * bl + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
}

function planHash(s) {
  var h = 2166136261;
  var i;
  s = String(s || '');
  for (i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = planImul(h, 16777619);
  }
  return h >>> 0;
}

function planShuffle(arr, seed) {
  var a = arr.slice();
  var i, j, t;
  var s = seed || 1;
  for (i = a.length - 1; i > 0; i--) {
    s = (planImul(s, 1664525) + 1013904223) >>> 0;
    j = s % (i + 1);
    t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function planUserId() {
  var p = ensurePlan();
  if (S.me && S.me.id) return S.me.id;
  if (p.planSeed) return p.planSeed;
  p.planSeed = 'anon-' + String((S.pw && S.pw.name) || 'you');
  return p.planSeed;
}

function planBlockOpts(block) {
  return planShuffle(block.opts, planHash(planUserId() + ':' + block.k));
}

function planCountPicks(picks) {
  var counts = {};
  var i, a;
  for (i = 0; i < picks.length; i++) {
    a = picks[i];
    if (!a) continue;
    counts[a] = (counts[a] || 0) + 1;
  }
  return counts;
}

function planTiedKeys(counts) {
  var k, max = 0, tied = [];
  for (k in counts) {
    if (!counts.hasOwnProperty(k)) continue;
    if (counts[k] > max) max = counts[k];
  }
  if (!max) return [];
  for (k in counts) {
    if (!counts.hasOwnProperty(k)) continue;
    if (counts[k] === max) tied.push(k);
  }
  return tied;
}

function planScorePicks(picks, tiePick) {
  var counts = planCountPicks(picks);
  var tied = planTiedKeys(counts);
  if (!picks.length) {
    return { archetype: 'Explorer', tied: [], resolvedBy: 'skipped', counts: counts };
  }
  if (tied.length === 1) {
    return { archetype: tied[0], tied: [], resolvedBy: 'outright', counts: counts };
  }
  if (tiePick && tied.indexOf(tiePick) !== -1) {
    return { archetype: tiePick, tied: tied.slice(), resolvedBy: 'headToHead', counts: counts };
  }
  return { archetype: '', tied: tied.slice(), resolvedBy: '', counts: counts };
}

function planPickText(blockIx, arch) {
  var opts = PLAN_BLOCKS[blockIx].opts;
  var i;
  for (i = 0; i < opts.length; i++) {
    if (opts[i].a === arch) return opts[i].t;
  }
  return '';
}

function planEvidence(picks, arch) {
  var out = [];
  var i;
  for (i = 0; i < picks.length; i++) {
    if (picks[i] === arch) out.push(planPickText(i, arch));
  }
  return out;
}

function planRoleKey() {
  var r = S.role || 'student';
  if (r === 'contributor') return 'collaborator';
  if (r === 'admin') return 'mentor';
  if (r === 'visitor') return 'student';
  if (PLAN_PART2[r]) return r;
  return 'student';
}

function planPart2() {
  return PLAN_PART2[planRoleKey()];
}

function planQOpts(q) {
  if (q.opts) return q.opts;
  if (q.k === 'fields') return planFieldOpts();
  if (q.k === 'regions') return planRegionOpts();
  return [];
}

function planLookOption(set, key, val) {
  var i, j, q, opts;
  var qs = (PLAN_PART2[set] && PLAN_PART2[set].qs) || [];
  for (i = 0; i < qs.length; i++) {
    q = qs[i];
    if (q.k !== key) continue;
    opts = planQOpts(q);
    for (j = 0; j < opts.length; j++) {
      if (opts[j].v === val) return opts[j].t;
    }
  }
  return '';
}

function planFirstName() {
  var n = (S.pw && S.pw.firstName) || (S.pw && S.pw.name) || '';
  n = String(n).replace(/^\s+|\s+$/g, '');
  if (!n || n === 'You') return 'You';
  return n.split(' ')[0];
}

function planBlankAnswers() {
  return {};
}

function planResetInstrument() {
  var p = ensurePlan();
  p.planPhase = 'landing';
  p.planStep = 0;
  p.planPicks = [null, null, null, null, null, null];
  p.planTiePick = '';
  p.planTied = [];
  p.planAnswers = planBlankAnswers();
  p.planDeckI = 0;
  p.planDeckStop = false;
  p.planResult = null;
}

function ensurePlan() {
  var p = ensurePw();
  if (!p.planPhase) p.planPhase = 'landing';
  if (typeof p.planStep !== 'number') p.planStep = 0;
  if (!p.planPicks) p.planPicks = [null, null, null, null, null, null];
  if (!p.planAnswers) p.planAnswers = planBlankAnswers();
  if (typeof p.planDeckI !== 'number') p.planDeckI = 0;
  if (!p.planCal) {
    p.planCal = { option: {}, arch: {}, results: [] };
  }
  return p;
}

function planLogResult(result) {
  var p = ensurePlan();
  var cal = p.planCal;
  var i, key, a;
  var picks = p.planPicks || [];
  for (i = 0; i < picks.length; i++) {
    if (!picks[i]) continue;
    key = PLAN_BLOCKS[i].k + ':' + picks[i];
    cal.option[key] = (cal.option[key] || 0) + 1;
  }
  a = result.archetype || 'Explorer';
  if (!cal.arch[a]) cal.arch[a] = { outright: 0, tie: 0, skip: 0 };
  if (result.resolvedBy === 'outright') cal.arch[a].outright += 1;
  else if (result.resolvedBy === 'headToHead') cal.arch[a].tie += 1;
  else cal.arch[a].skip += 1;
  cal.results.push({
    archetype: a,
    picks: picks.slice(),
    tied: result.tied ? result.tied.slice() : [],
    resolvedBy: result.resolvedBy || 'skipped',
    instrumentVersion: PLAN_INSTRUMENT,
    takenAt: nowIso ? nowIso() : new Date().toISOString()
  });
}

var PLAN_DECK_T = null;

function planStopDeck() {
  if (PLAN_DECK_T) {
    clearInterval(PLAN_DECK_T);
    PLAN_DECK_T = null;
  }
}

function planIcon(key) {
  var inner = {
    healer:
      '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
    artisan:
      '<path d="M14 7l3 3-8.5 8.5H6v-2.5L14.5 7z"/><path d="M12 9l3 3"/>',
    investigator:
      '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
    advocate:
      '<path d="M5 12h10l4-3v10l-4-3H5z"/><path d="M8 9V7a2 2 0 0 1 2-2h0"/>',
    explainer:
      '<path d="M4 6h12v10H4z"/><path d="M8 20h4M10 16v4M18 8l2 2-2 2"/>',
    steward:
      '<path d="M12 4l8 4v4c0 5-3.5 8-8 9-4.5-1-8-4-8-9V8l8-4z"/>',
    pioneer:
      '<path d="M6 21V5l10 5-10 5"/>',
    gladiator:
      '<path d="M8 4l2 4-2 2 4 4 2-2 4 2"/><path d="M5 19l5-5M14 10l5-5"/>',
    explorer:
      '<circle cx="12" cy="12" r="8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/><path d="M12 12l3-2"/>'
  };
  var d = inner[key];
  if (!d) return '';
  return (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    d +
    '</svg>'
  );
}

function planArchStyle(key) {
  var a = PLAN_ARCH[key] || PLAN_ARCH.Explorer;
  return '--arch-deep:' + a.deep + ';--arch-tint:' + a.tint + ';--arch-glow:' + a.glow;
}

function planLandingHtml() {
  var name = planFirstName();
  var i, k, a, html;
  html =
    '<div class="plan-landing">' +
    '<div class="plan-hero">' +
    '<img class="plan-hero-art" src="assets/hero-wide-1600.jpg" alt="" role="img" aria-label="A community sports field in the late afternoon, with students still training.">' +
    '<div class="plan-hero-veil" aria-hidden="true"></div>' +
    '<div class="plan-hero-inner">' +
    '<p class="plan-wordmark"><b>NEXT STEP</b><small>GUYANA</small></p>' +
    '<div class="plan-hero-copy">' +
    '<p class="plan-firstname">' +
    esc(name.toUpperCase()) +
    '</p>' +
    '<h1 class="plan-headline">Let\'s start planning your next steps.</h1>' +
    '</div></div></div>' +
    '<div class="plan-lead">' +
    '<p class="plan-lead-copy">Before we begin, let\'s take 2 minutes to better understand you.</p>' +
    '<div class="plan-parts">' +
    '<div class="plan-part"><span class="plan-ord">ONE</span><span class="plan-part-lab">Who you are</span></div>' +
    '<div class="plan-part"><span class="plan-ord">TWO</span><span class="plan-part-lab">Where you want to be</span></div>' +
    '</div>' +
    '<button type="button" class="plan-start" data-plan-start="1">Start part one</button>' +
    '</div></div>' +
    '<div class="plan-gallery">' +
    '<span class="plan-gallery-lab">OUR ARCHETYPES</span>' +
    '<div class="plan-deck-stage">' +
    '<button type="button" class="plan-deck-btn" data-plan-deck="prev" aria-label="Previous archetype">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>' +
    '</button>' +
    '<div class="plan-deck" id="plan-deck">';
  for (i = 0; i < PLAN_GALLERY.length; i++) {
    k = PLAN_GALLERY[i];
    a = PLAN_ARCH[k];
    html +=
      '<article class="plan-card" data-plan-card="' +
      k +
      '" style="' +
      planArchStyle(k) +
      '" aria-hidden="true">' +
      '<div class="plan-card-icon">' +
      planIcon(a.icon) +
      '</div><h3>' +
      esc(a.name) +
      '</h3><p>' +
      esc(a.line) +
      '</p></article>';
  }
  html +=
    '</div>' +
    '<button type="button" class="plan-deck-btn" data-plan-deck="next" aria-label="Next archetype">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>' +
    '</button>' +
    '<div class="plan-dots" aria-hidden="true">';
  for (i = 0; i < PLAN_GALLERY.length; i++) {
    html += '<i' + (i === 0 ? ' class="on"' : '') + '></i>';
  }
  html += '</div></div></div>';
  return html;
}

function planProgressHtml(n, total, label) {
  var pct = Math.round((n / total) * 100);
  return (
    '<p class="plan-progress-lab">' +
    esc(label || 'QUESTION ' + n + ' OF ' + total) +
    '</p><div class="plan-bar"><i style="width:' +
    pct +
    '%"></i></div>'
  );
}

function planPart1Html() {
  var p = ensurePlan();
  var ix = p.planStep || 0;
  var block = PLAN_BLOCKS[ix];
  var opts = planBlockOpts(block);
  var picked = p.planPicks[ix];
  var html;
  var i;
  html =
    '<div class="plan-q">' +
    '<h2>' +
    esc(block.q) +
    '</h2><div class="plan-opts">';
  for (i = 0; i < opts.length; i++) {
    html +=
      '<button type="button" class="plan-opt' +
      (picked === opts[i].a ? ' on' : '') +
      '" data-plan-pick="' +
      esc(opts[i].a) +
      '">' +
      esc(opts[i].t) +
      '</button>';
  }
  html +=
    '</div><div class="plan-foot">' +
    (ix > 0
      ? '<button type="button" class="plan-btn plan-secondary" data-plan-back="1">Back</button>'
      : '<span></span>') +
    '<button type="button" class="plan-btn plan-primary" data-plan-next="1"' +
    (picked ? '' : ' disabled') +
    '>Continue</button></div></div>';
  return html;
}

function planTieHtml() {
  var p = ensurePlan();
  var tied = p.planTied || [];
  var html;
  var i, k, a;
  html =
    '<div class="plan-q">' +
    '<h2>You are close on two. Which one is more you?</h2><div class="plan-opts">';
  for (i = 0; i < tied.length; i++) {
    k = tied[i];
    a = PLAN_ARCH[k] || PLAN_ARCH.Explorer;
    html +=
      '<button type="button" class="plan-opt' +
      (p.planTiePick === k ? ' on' : '') +
      '" data-plan-tie="' +
      esc(k) +
      '"><strong>' +
      esc(a.name) +
      '</strong><span style="display:block;margin-top:4px;font-weight:400">' +
      esc(a.line) +
      '</span></button>';
  }
  html +=
    '</div><div class="plan-foot">' +
    '<button type="button" class="plan-btn plan-secondary" data-plan-back="1">Back</button>' +
    '<button type="button" class="plan-btn plan-primary" data-plan-next="1"' +
    (p.planTiePick ? '' : ' disabled') +
    '>Continue</button></div></div>';
  return html;
}

function planRevealHtml() {
  var p = ensurePlan();
  var key = (p.planResult && p.planResult.archetype) || 'Explorer';
  var a = PLAN_ARCH[key] || PLAN_ARCH.Explorer;
  var evid = key === 'Explorer' ? [] : planEvidence(p.planPicks, key);
  var html;
  var i;
  html =
    '<div class="plan-reveal" style="--glow:' +
    a.glow +
    '">' +
    '<div class="plan-reveal-art" style="color:' +
    a.glow +
    ';border-color:' +
    a.glow +
    '">' +
    planIcon(a.icon) +
    '</div>' +
    '<p class="plan-reveal-line">' +
    esc(a.line) +
    '</p>' +
    '<p class="plan-youare">YOU ARE</p>' +
    '<h1 class="plan-reveal-name">' +
    esc(a.name) +
    '</h1>' +
    '<hr class="plan-reveal-rule">';
  if (evid.length) {
    html += '<div class="plan-evidence"><p>Because you said you would</p><ul>';
    for (i = 0; i < evid.length; i++) {
      html += '<li>' + esc(String(evid[i]).toLowerCase()) + '</li>';
    }
    html += '</ul></div>';
  }
  html +=
    '<p class="plan-survive">This is how you work, not what you should be. It stays the same whatever field you end up choosing.</p>' +
    '<div class="plan-reveal-acts">' +
    '<button type="button" class="plan-btn plan-primary" data-plan-to-part2="1">Next: where you want to be</button>' +
    '<button type="button" class="plan-btn plan-secondary" data-plan-again="1">Take it again</button>' +
    '</div></div>';
  return html;
}

function planIntroHtml() {
  var p = ensurePlan();
  var set = planPart2();
  var key = (p.planResult && p.planResult.archetype) || 'Explorer';
  var a = PLAN_ARCH[key] || PLAN_ARCH.Explorer;
  return (
    '<div class="plan-intro">' +
    '<h2>' +
    esc(set.introK) +
    '</h2>' +
    '<p class="plan-stay">You are ' +
    esc(a.name) +
    '. This is how you work, not what you should be.</p>' +
    '<p class="plan-note">' +
    esc(set.note) +
    '</p>' +
    '<div class="plan-foot solo">' +
    '<button type="button" class="plan-btn plan-primary" data-plan-next="1">Continue</button>' +
    '</div></div>'
  );
}

function planPart2Html() {
  var p = ensurePlan();
  var set = planPart2();
  var ix = p.planStep || 0;
  var q = set.qs[ix];
  var opts = planQOpts(q);
  var cur = p.planAnswers[q.k];
  var html;
  var i, on, rank;
  html =
    '<div class="plan-q">' +
    '<h2>' +
    esc(q.q) +
    '</h2><div class="plan-opts">';
  for (i = 0; i < opts.length; i++) {
    if (q.type === 'one') {
      on = cur === opts[i].v;
    } else {
      rank = (cur || []).indexOf(opts[i].v);
      on = rank !== -1;
    }
    html +=
      '<button type="button" class="plan-opt' +
      (on ? ' on' : '') +
      '" data-plan2="' +
      q.type +
      '" data-plan-key="' +
      esc(q.k) +
      '" data-plan-val="' +
      esc(opts[i].v) +
      '"' +
      (q.cap ? ' data-plan-cap="' + q.cap + '"' : '') +
      '>' +
      esc(opts[i].t);
    if ((q.type === 'rank' || q.type === 'many') && on && q.type === 'rank') {
      html += '<span class="plan-rank">' + (rank + 1) + '</span>';
    }
    html += '</button>';
  }
  html +=
    '</div><div class="plan-foot">' +
    '<button type="button" class="plan-btn plan-secondary" data-plan-back="1">Back</button>' +
    '<button type="button" class="plan-btn plan-primary" data-plan-next="1"' +
    (plan2Complete(q, cur) ? '' : ' disabled') +
    '>Continue</button></div></div>';
  return html;
}

function plan2Complete(q, cur) {
  if (q.type === 'one') return !!cur;
  if (q.type === 'many' || q.type === 'rank') return !!(cur && cur.length);
  return false;
}

function planBuildSteps(p) {
  var role = planRoleKey();
  var ans = p.planAnswers || {};
  var steps = [];
  var fields = ans.fields || [];
  var blockers = ans.blockers || [];
  var who = ans.who;
  var top = fields[0] ? fieldName(fields[0]) : '';
  var i;
  var bind = [
    { k: 'cost', t: 'Map the real cost this month, including the bus, before you pick a route that assumes you can always get there.' },
    { k: 'earn', t: 'Look first at routes that pay or train while you study, so earning soon is in the plan, not a side note.' },
    { k: 'nothing', t: 'Start with what actually runs in your region, then what you would have to travel for.' },
    { k: 'dropped', t: 'Write down the subject you dropped and what still opens without it, before you close more doors.' },
    { k: 'family', t: 'Name the family expectation out loud with someone who has walked this. It is a constraint, not a character flaw.' }
  ];
  var explore = [
    { t: 'Compare two routes in the same field, side by side, before you commit to one.' },
    { t: 'Open the trade routes even if school only talks about university.' },
    { t: 'Put the exam dates on a page you will actually see.' },
    { t: 'Find a session this month. Sitting in a room with people who have done it is the shortest way to test a field.' }
  ];

  if (role !== 'student') {
    return planAltSteps(role, ans, p);
  }

  if (blockers.indexOf('ask') !== -1 || who === 'nobody') {
    steps.push({
      kind: 'care',
      k: 'Care',
      t: 'Join a mentor pod this month. A lot of people have nobody to ask. That is what the mentors are for, and the pods are free and in small groups.'
    });
  }
  if (top) {
    steps.push({ kind: 'want', k: 'What you want', t: 'Open the ' + top + ' routes' });
  }
  for (i = 0; i < bind.length && steps.length < 3; i++) {
    if (blockers.indexOf(bind[i].k) !== -1) {
      steps.push({ kind: 'bind', k: 'In the way', t: bind[i].t });
    }
  }
  for (i = 0; i < explore.length && steps.length < 3; i++) {
    steps.push({ kind: 'explore', k: 'Next', t: explore[i].t });
  }
  if (!steps.length) {
    steps.push({ kind: 'explore', k: 'Next', t: 'Browse the eleven fields' });
  }
  while (steps.length < 3) {
    steps.push({ kind: 'explore', k: 'Next', t: 'Browse the eleven fields' });
  }
  return steps.slice(0, 3);
}

function planAltSteps(role, ans, p) {
  var steps = [];
  var key = (p.planResult && p.planResult.archetype) || 'Explorer';
  var a = PLAN_ARCH[key] || PLAN_ARCH.Explorer;
  if (role === 'parent') {
    if ((ans.worries || []).indexOf('cost') !== -1 || ans.help === 'cost' || ans.now === 'cost') {
      steps.push({ kind: 'care', k: 'Care', t: 'Sit down this week with the real numbers: bus, fees, and what you can actually put in. Cost is the constraint, not a later conversation.' });
    }
    steps.push({ kind: 'want', k: 'Help', t: ans.help ? 'Start with: ' + planLookOption('parent', 'help', ans.help) + '.' : 'Open the fields they are curious about, together.' });
    if (ans.now) steps.push({ kind: 'explore', k: 'Now', t: planLookOption('parent', 'now', ans.now) + '.' });
  } else if (role === 'teacher') {
    steps.push({ kind: 'want', k: 'In the room', t: ans.help ? planLookOption('teacher', 'help', ans.help) + '.' : 'A place to send them when the question is bigger than the form period.' });
    if (ans.part === 'mentor' || ans.part === 'openings') {
      steps.push({ kind: 'care', k: 'You', t: 'You said you would take part. Post one opening or sit in on a pod this month so students see a name they already trust.' });
    }
    steps.push({ kind: 'explore', k: 'Next', t: 'Keep a short list of people students can ask, by field, and refresh it once a term.' });
  } else if (role === 'mentor') {
    if ((ans.offer || []).indexOf('group') !== -1) {
      steps.push({ kind: 'care', k: 'Offer', t: 'Host a pod this month. Group sessions are how students with nobody to ask actually get a first conversation.' });
    }
    if (ans.fields && ans.fields[0]) {
      steps.push({ kind: 'want', k: 'Field', t: 'Speak first to students looking at ' + fieldName(ans.fields[0]) + '.' });
    }
    steps.push({ kind: 'explore', k: 'Time', t: ans.time ? 'Protect ' + planLookOption('mentor', 'time', ans.time).toLowerCase() + ' and treat that as the real offer.' : 'Name a real number of hours before you say yes to more.' });
  } else {
    if (ans.offer && ans.offer[0]) {
      steps.push({ kind: 'want', k: 'Offer', t: 'Lead with ' + planLookOption('collaborator', 'offer', ans.offer[0]).toLowerCase() + ' in the regions you actually reach.' });
    }
    if ((ans.want === 'hinterland') || (ans.regions && ans.regions.length)) {
      steps.push({ kind: 'bind', k: 'Reach', t: 'Name the regions on every post. Students in hinterland should not have to guess whether it is for them.' });
    }
    steps.push({ kind: 'explore', k: 'Next', t: 'Post the next opening or session while the round is still open.' });
  }
  if (!steps.length) {
    steps.push({ kind: 'explore', k: 'Next', t: 'Browse the eleven fields' });
  }
  while (steps.length < 3) {
    steps.push({ kind: 'explore', k: 'Next', t: 'You are ' + a.name + '. Keep that in the way you show up, whatever you post next.' });
  }
  return steps.slice(0, 3);
}

function planAfterBadge(p) {
  var role = planRoleKey();
  var ans = p.planAnswers || {};
  if (role === 'student') return planLookOption('student', 'goal', ans.goal);
  if (role === 'parent') return planLookOption('parent', 'stage', ans.stage);
  if (role === 'teacher') return planLookOption('teacher', 'job', ans.job);
  if (role === 'mentor') return planLookOption('mentor', 'route', ans.route);
  return planLookOption('collaborator', 'org', ans.org);
}

function planHtml() {
  var p = ensurePlan();
  var key = (p.planResult && p.planResult.archetype) || 'Explorer';
  var a = PLAN_ARCH[key] || PLAN_ARCH.Explorer;
  var ans = p.planAnswers || {};
  var fields = ans.fields || [];
  var top = fields[0] ? fieldName(fields[0]) : '';
  var after = planAfterBadge(p);
  var steps = planBuildSteps(p);
  var html;
  var i;
  html =
    '<div class="plan-result">' +
    '<div class="plan-result-head"><h2>Your plan</h2>' +
    '<div class="plan-badges" role="group" aria-label="Plan summary">' +
    '<span class="plan-badge">' +
    esc(a.name) +
    '</span>';
  if (top) html += '<span class="plan-badge field">' + esc(top) + '</span>';
  if (after) html += '<span class="plan-badge after">' + esc(after) + '</span>';
  html += '</div></div><div class="plan-steps">';
  for (i = 0; i < steps.length; i++) {
    html +=
      '<article class="plan-step' +
      (steps[i].kind === 'care' ? ' care' : '') +
      '"><p class="plan-step-k">' +
      esc(steps[i].k) +
      '</p><p>' +
      esc(steps[i].t) +
      '</p></article>';
  }
  html +=
    '</div><div class="plan-foot solo">' +
    '<button type="button" class="plan-btn plan-primary" data-plan-done="1">Open my pathway</button>' +
    '</div></div>';
  return html;
}

function planRender() {
  var p = ensurePlan();
  var body;
  planStopDeck();
  if (p.planPhase === 'part1') body = planPart1Html();
  else if (p.planPhase === 'tie') body = planTieHtml();
  else if (p.planPhase === 'reveal') body = planRevealHtml();
  else if (p.planPhase === 'part2intro') body = planIntroHtml();
  else if (p.planPhase === 'part2') body = planPart2Html();
  else if (p.planPhase === 'plan') body = planHtml();
  else body = planLandingHtml();
  return '<div class="page-plan">' + body + '</div>';
}

function planDeckWide() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 980px)').matches;
}

function planApplyDeckClasses(droppingKey, liftedKey) {
  var p = ensurePlan();
  var deck = byId('plan-deck');
  var cards;
  var dots;
  var i, k, pos, n, front, cls, hidden, wide;
  if (!deck) return;
  cards = deck.querySelectorAll('[data-plan-card]');
  n = PLAN_GALLERY.length;
  front = ((p.planDeckI % n) + n) % n;
  wide = planDeckWide();
  for (i = 0; i < cards.length; i++) {
    k = cards[i].getAttribute('data-plan-card');
    pos = (PLAN_GALLERY.indexOf(k) - front + n) % n;
    cls = 'plan-card';
    hidden = true;
    if (wide) {
      if (pos === 0 || pos === 1 || pos === 2) {
        cls += ' vis';
        if (pos === 0) cls += ' at-0';
        hidden = false;
      } else cls += ' away';
    } else if (liftedKey && k === liftedKey) {
      cls += ' lifted';
      hidden = true;
    } else if (pos === 0) {
      cls += ' at-0';
      if (droppingKey && k === droppingKey) cls += ' dropping';
      hidden = false;
    } else if (pos === 1) cls += ' at-1';
    else if (pos === 2) cls += ' at-2';
    else cls += ' away';
    cards[i].className = cls;
    cards[i].setAttribute('aria-hidden', hidden ? 'true' : 'false');
  }
  dots = document.querySelectorAll('.page-plan .plan-dots i');
  for (i = 0; i < dots.length; i++) {
    dots[i].className = i === front ? 'on' : '';
  }
}

function planDeckStep(dir) {
  var p = ensurePlan();
  var n = PLAN_GALLERY.length;
  var old = ((p.planDeckI % n) + n) % n;
  var incoming;
  if (dir > 0) {
    p.planDeckI = old + 1;
    planApplyDeckClasses('', PLAN_GALLERY[old]);
    setTimeout(function () {
      planApplyDeckClasses('', '');
    }, 380);
  } else {
    incoming = PLAN_GALLERY[(old - 1 + n) % n];
    p.planDeckI = old - 1;
    planApplyDeckClasses(incoming, '');
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        planApplyDeckClasses('', '');
      });
    });
  }
}

function planPrefersReduce() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function planAskMeta() {
  var p = ensurePlan();
  var set;
  var n;
  var total;
  var phase = p.planPhase;
  if (p.done || S.view !== 'pathway') return null;
  if (phase === 'part1') {
    n = (p.planStep || 0) + 1;
    return { lab: 'Part 1 · question ' + n + ' of 6', pct: Math.round((n / 6) * 100) };
  }
  if (phase === 'tie') {
    return { lab: 'Part 1 · last question', pct: 100 };
  }
  if (phase === 'part2') {
    set = planPart2();
    total = set.qs.length;
    n = (p.planStep || 0) + 1;
    return { lab: 'Part 2 · question ' + n + ' of ' + total, pct: Math.round((n / total) * 100) };
  }
  return null;
}

function planSyncShell() {
  var bar = byId('plan-askbar');
  var lab = byId('plan-askbar-lab');
  var fill = byId('plan-askbar-fill');
  var meta = planAskMeta();
  var asking = false;
  var p;
  if (S.view === 'pathway') {
    p = ensurePlan();
    asking = !p.done && (p.planPhase === 'part1' || p.planPhase === 'tie' || p.planPhase === 'part2intro' || p.planPhase === 'part2' || p.planPhase === 'reveal');
  }
  if (document.body) {
    if (asking) document.body.classList.add('plan-asking');
    else document.body.classList.remove('plan-asking');
    document.body.style.setProperty('--askbar-h', meta ? '52px' : '0px');
  }
  if (!bar) return;
  if (!meta) {
    bar.hidden = true;
    return;
  }
  bar.hidden = false;
  if (lab) lab.textContent = meta.lab;
  if (fill) fill.style.width = meta.pct + '%';
}

function planSaveExit() {
  var dest = S.planReturnView || 'feed';
  if (dest === 'pathway') dest = 'feed';
  setView(dest);
}

function planAfterPaint() {
  var p;
  var deck;
  planSyncShell();
  if (S.view !== 'pathway') {
    planStopDeck();
    return;
  }
  p = ensurePw();
  if (p.done || p.planPhase !== 'landing') {
    planStopDeck();
    return;
  }
  deck = byId('plan-deck');
  if (!deck) return;
  planApplyDeckClasses('', '');
  if (!deck.getAttribute('data-plan-bound')) {
    deck.setAttribute('data-plan-bound', '1');
    deck.addEventListener('mouseenter', function () {
      planStopDeck();
    });
    deck.addEventListener('mouseleave', function () {
      if (planPrefersReduce()) return;
      planStartDeck();
    });
  }
  if (planPrefersReduce()) {
    planStopDeck();
    return;
  }
  planStartDeck();
}

function planStartDeck() {
  planStopDeck();
  PLAN_DECK_T = setInterval(function () {
    var p = ensurePlan();
    if (p.planPhase !== 'landing' || p.done) {
      planStopDeck();
      return;
    }
    p.planDeckI += 1;
    planApplyDeckClasses('', '');
  }, 3200);
}

function planFinishInstrument() {
  var p = ensurePlan();
  var scored = planScorePicks(p.planPicks, p.planTiePick);
  if (!scored.archetype && scored.tied.length) {
    p.planTied = scored.tied;
    p.planPhase = 'tie';
    return;
  }
  if (!scored.archetype) scored.archetype = 'Explorer';
  p.planResult = scored;
  planLogResult(scored);
  p.planPhase = 'reveal';
}

function planCommitProfile() {
  var p = ensurePlan();
  var key = (p.planResult && p.planResult.archetype) || 'Explorer';
  var a = PLAN_ARCH[key] || PLAN_ARCH.Explorer;
  var ans = p.planAnswers || {};
  var pending = S.pendingAction;
  p.done = true;
  p.archetype = a.name;
  p.fields = ans.fields ? ans.fields.slice() : p.fields;
  p.clarity = ans.clarity || p.clarity;
  p.goal = ans.goal || p.goal;
  p.priority = ans.priority || p.priority;
  p.blocker = (ans.blockers && ans.blockers[0]) || ans.who || p.blocker;
  if (!p.level) p.level = 'f4';
  if (!p.region) p.region = 'r4';
  p.open = p.level;
  p.tab = 'me';
  p.sub = '';
  p.focusQ = false;
  if (p.fields && p.fields[0]) p.field = p.fields[0];
  S.onboarded = true;
  S.hideJoinCard = true;
  S.role = S.role === 'visitor' ? 'student' : S.role;
  S.me.role = S.role;
  S.form = levelName(p.level);
  S.region = regionShort(p.region);
  S.me.form = S.form;
  S.me.region = S.region;
  if (!p.name) p.name = planFirstName();
  S.archetype = a.name;
  S.goal = p.goal;
  S.priority = p.priority;
  S.blocker = p.blocker;
  S.pendingAction = null;
  planStopDeck();
  if (pending) {
    hideSheetUi();
    runPendingAction(pending);
    return;
  }
  hideSheetUi();
  S.view = 'pathway';
  render();
  toast(a.name + '. Your plan is ready.');
}

function planNext() {
  var p = ensurePlan();
  var scored;
  var set;
  var q;
  if (p.planPhase === 'part1') {
    if (!p.planPicks[p.planStep]) return;
    if (p.planStep >= 5) {
      planFinishInstrument();
    } else {
      p.planStep += 1;
    }
    refreshUi();
    return;
  }
  if (p.planPhase === 'tie') {
    if (!p.planTiePick) return;
    scored = planScorePicks(p.planPicks, p.planTiePick);
    scored.archetype = scored.archetype || p.planTiePick;
    p.planResult = scored;
    planLogResult(scored);
    p.planPhase = 'reveal';
    refreshUi();
    return;
  }
  if (p.planPhase === 'part2intro') {
    p.planPhase = 'part2';
    p.planStep = 0;
    refreshUi();
    return;
  }
  if (p.planPhase === 'part2') {
    set = planPart2();
    q = set.qs[p.planStep];
    if (!plan2Complete(q, p.planAnswers[q.k])) return;
    if (p.planStep >= set.qs.length - 1) {
      p.planPhase = 'plan';
    } else {
      p.planStep += 1;
    }
    refreshUi();
  }
}

function planBack() {
  var p = ensurePlan();
  if (p.planPhase === 'part1') {
    if (p.planStep > 0) p.planStep -= 1;
    else p.planPhase = 'landing';
    refreshUi();
    return;
  }
  if (p.planPhase === 'tie') {
    p.planPhase = 'part1';
    p.planStep = 5;
    refreshUi();
    return;
  }
  if (p.planPhase === 'part2intro') {
    p.planPhase = 'reveal';
    refreshUi();
    return;
  }
  if (p.planPhase === 'part2') {
    if (p.planStep > 0) p.planStep -= 1;
    else p.planPhase = 'part2intro';
    refreshUi();
  }
}

function planToggle2(type, key, val, cap) {
  var p = ensurePlan();
  var cur = p.planAnswers[key];
  var ix;
  if (type === 'one') {
    p.planAnswers[key] = val;
    refreshUi();
    return;
  }
  if (!cur) cur = [];
  ix = cur.indexOf(val);
  if (ix !== -1) cur.splice(ix, 1);
  else if (cap && cur.length >= cap) {
    toast('Choose up to ' + cap + '.');
    return;
  } else cur.push(val);
  p.planAnswers[key] = cur;
  refreshUi();
}

function planHandleClick(e, t) {
  var btn;
  var p;
  if (S.view !== 'pathway') return false;
  p = ensurePw();
  if (p.done) return false;
  ensurePlan();

  btn = closestEl(t, '[data-plan-exit]');
  if (btn) {
    planSaveExit();
    return true;
  }
  btn = closestEl(t, '[data-plan-start]');
  if (btn) {
    p.planPhase = 'part1';
    p.planStep = 0;
    planStopDeck();
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-plan-deck]');
  if (btn) {
    if (btn.getAttribute('data-plan-deck') === 'next') planDeckStep(1);
    else if (btn.getAttribute('data-plan-deck') === 'prev') planDeckStep(-1);
    if (!planPrefersReduce()) planStartDeck();
    return true;
  }
  btn = closestEl(t, '[data-plan-pick]');
  if (btn) {
    p.planPicks[p.planStep] = btn.getAttribute('data-plan-pick');
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-plan-tie]');
  if (btn) {
    p.planTiePick = btn.getAttribute('data-plan-tie');
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-plan2]');
  if (btn) {
    planToggle2(
      btn.getAttribute('data-plan2'),
      btn.getAttribute('data-plan-key'),
      btn.getAttribute('data-plan-val'),
      parseInt(btn.getAttribute('data-plan-cap'), 10) || 0
    );
    return true;
  }
  btn = closestEl(t, '[data-plan-again]');
  if (btn) {
    p.planPicks = [null, null, null, null, null, null];
    p.planTiePick = '';
    p.planTied = [];
    p.planResult = null;
    p.planPhase = 'part1';
    p.planStep = 0;
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-plan-to-part2]');
  if (btn) {
    p.planPhase = 'part2intro';
    refreshUi();
    return true;
  }
  btn = closestEl(t, '[data-plan-done]');
  if (btn) {
    planCommitProfile();
    return true;
  }
  btn = closestEl(t, '[data-plan-next]');
  if (btn) {
    planNext();
    return true;
  }
  btn = closestEl(t, '[data-plan-back]');
  if (btn) {
    planBack();
    return true;
  }
  return false;
}

function planInit() {
  ensurePlan();
  if (typeof window !== 'undefined' && !window.__planResizeBound) {
    window.__planResizeBound = true;
    window.addEventListener('resize', function () {
      var p = ensurePw();
      if (S.view === 'pathway' && !p.done && p.planPhase === 'landing') {
        planApplyDeckClasses('', '');
      }
    });
  }
}

/* Used by the verify script: uniform random picks, then head-to-head on ties. */
function planSimulateN(n) {
  var i, b, o, picks, tied, pick, scored, share = {}, k;
  for (k in PLAN_ARCH) {
    if (PLAN_ARCH.hasOwnProperty(k)) share[k] = 0;
  }
  for (i = 0; i < n; i++) {
    picks = [];
    for (b = 0; b < PLAN_BLOCKS.length; b++) {
      o = PLAN_BLOCKS[b].opts;
      picks.push(o[Math.floor(Math.random() * o.length)].a);
    }
    scored = planScorePicks(picks, '');
    if (scored.tied && scored.tied.length > 1) {
      pick = scored.tied[Math.floor(Math.random() * scored.tied.length)];
      scored = planScorePicks(picks, pick);
    }
    share[scored.archetype] = (share[scored.archetype] || 0) + 1;
  }
  return share;
}

function planExposure() {
  var counts = {};
  var i, j, a;
  for (a in PLAN_ARCH) {
    if (a !== 'Explorer') counts[a] = 0;
  }
  for (i = 0; i < PLAN_BLOCKS.length; i++) {
    for (j = 0; j < PLAN_BLOCKS[i].opts.length; j++) {
      a = PLAN_BLOCKS[i].opts[j].a;
      counts[a] = (counts[a] || 0) + 1;
    }
  }
  return counts;
}

function planPairSharesScreen(a, b) {
  var i, names, j;
  for (i = 0; i < PLAN_BLOCKS.length; i++) {
    names = [];
    for (j = 0; j < PLAN_BLOCKS[i].opts.length; j++) names.push(PLAN_BLOCKS[i].opts[j].a);
    if (names.indexOf(a) !== -1 && names.indexOf(b) !== -1) return true;
  }
  return false;
}

function planStabilityRate(n) {
  var keep = 0;
  var i, b, picks, scored, np, opts, bi, scored2, still, x, hit, origSet;
  for (i = 0; i < n; i++) {
    picks = [];
    for (b = 0; b < PLAN_BLOCKS.length; b++) {
      picks.push(PLAN_BLOCKS[b].opts[Math.floor(Math.random() * 4)].a);
    }
    scored = planScorePicks(picks, '');
    origSet = scored.tied && scored.tied.length ? scored.tied : [scored.archetype];
    bi = Math.floor(Math.random() * 6);
    opts = [];
    for (b = 0; b < 4; b++) {
      if (PLAN_BLOCKS[bi].opts[b].a !== picks[bi]) opts.push(PLAN_BLOCKS[bi].opts[b].a);
    }
    np = picks.slice();
    np[bi] = opts[Math.floor(Math.random() * opts.length)];
    scored2 = planScorePicks(np, '');
    still = scored2.tied && scored2.tied.length ? scored2.tied : [scored2.archetype];
    hit = false;
    for (x = 0; x < origSet.length; x++) {
      if (still.indexOf(origSet[x]) !== -1) hit = true;
    }
    if (hit) keep += 1;
  }
  return keep / n;
}
