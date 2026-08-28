/* nsg-data.js - Next Step Guyana shared library data.
   Plain ES5 IIFE; attaches to window.NSG_DATA. No modules. */
(function (global) {
  'use strict';

  var STAGES = [
    { key: 'explore', name: 'Form 1 to 2', label: 'Exploration', note: 'Try things cheaply. Nothing is decided yet.' },
    { key: 'subject', name: 'Form 3', label: 'Subject choice', note: 'What you choose now decides which gates stay open after CSEC.' },
    { key: 'csec', name: 'Form 4 to 5', label: 'CSEC', note: 'Sit the papers. Mocks are rehearsal, not judgment.' },
    { key: 'fork', name: 'After CSEC', label: 'The fork', note: 'CAPE, TVET or work. Name the gate each path needs.' },
    { key: 'special', name: 'Form 6 or institute', label: 'Specialise', note: 'Map your units to the exact entry list.' },
    { key: 'led', name: 'After that', label: 'Where it led', note: 'The destination is allowed to change.' }
  ];

  var FY = {
    explore: [
      { t: 'STEMGuyana learning pod', d: 'After school coding and robotics pods in several regions. Low barrier to try digital making.' },
      { t: "President's Youth Award", d: 'Open from age 14 and not a competition. Service, skill and adventure sections build evidence early.' },
      { t: 'School club with a record', d: 'Any club counts if you keep a log of what you actually did in it.' }
    ],
    subject: [
      { t: 'Compare two subject combinations', d: 'Put the science one and the technical one side by side, with the gate each keeps open.' },
      { t: 'Talk to whoever teaches the subject you might drop', d: 'Ask specifically whether it can be added back in Form 4 at your school.' },
      { t: 'Regional STEAM fair', d: 'The regional round is the entry point. The national fair is the final stage, not where you sign up.' }
    ],
    csec: [
      { t: 'Free past paper clinic', d: 'Weekly, after school. The mentors who run it are answering questions in your feed.' },
      { t: 'Fix the weakest paper first', d: 'Pick the subject you would rather avoid and give it the first hour, not the last.' },
      { t: 'J.O.F. Haynes debating competition', d: 'Entered through your school. Ask the English or Social Studies teacher about the round dates.' }
    ],
    fork: [
      { t: 'GTTi and CAPE on one page', d: 'Years, cost, first job and backup for each. The comparison is what ends the argument at home.' },
      { t: 'Find the gate, not the school', d: 'Pull the entry list for the programme you want and work backwards from it.' }
    ],
    special: [
      { t: 'Match your units to the entry list', d: 'Check the published requirement for this cycle rather than last year.' },
      { t: 'Line up one reference early', d: 'Whoever writes it needs months of you, not a week.' }
    ],
    led: [
      { t: 'Contribute your own journey', d: 'The route you just walked is the one somebody in Form 2 is looking for.' },
      { t: 'Keep one node ahead', d: 'The destination can change. The habit of planning is what carries.' }
    ]
  };

  var FEED = [
    {
      id: 'f1',
      kind: 'question',
      anon: true,
      who: 'Form 3 student, Region 4',
      time: '2h ago',
      tag: 'Subject choice',
      title: 'If I might want medicine later, do I have to keep Biology and Chemistry in Form 3?',
      replies: [
        { who: 'Raeka Persaud', role: 'Mentor', text: 'Keep both. Some schools let you add Chemistry back in Form 4 and some do not, and you usually find out too late to do anything about it.' },
        { who: 'Omar Khan', role: 'Mentor', text: 'Same thinking on a trade path. Keep whichever subject closes the most doors if you drop it.' },
        { who: 'Form 5 student, Region 6', role: 'Student', text: 'I dropped Chemistry in Form 3 and ended up sitting it privately. It cost me a year.' }
      ]
    },
    {
      id: 'f2',
      kind: 'opportunity',
      anon: false,
      who: 'Opportunities desk',
      init: 'OD',
      time: '2 days ago',
      tag: 'STEM',
      text: 'STEMGuyana holiday pods are open for ages 8 to 18 in several regions. Coding, robotics and AI taster weeks, and there is no fee to join.',
      wish: { key: 'stem-pod', title: 'STEMGuyana holiday pod', note: 'Ages 8 to 18, several regions' }
    },
    {
      id: 'f3',
      kind: 'tip',
      anon: false,
      who: 'Raeka Persaud',
      init: 'RP',
      time: '5h ago',
      tag: 'Science and health',
      journey: 'raeka',
      text: 'Mocks are rehearsal. If Biology goes badly, start rebuilding from past papers that same week. Do not wait for the final term.'
    },
    {
      id: 'f4',
      kind: 'story',
      anon: false,
      who: 'Jerome DaSilva',
      init: 'JD',
      time: 'Yesterday',
      tag: 'Technology',
      journey: 'jerome',
      title: 'Went to a developer meetup in Georgetown on Saturday. Three things worth passing on.',
      text: 'Nobody asked what school anyone went to. They asked what you had built. Two people picked up contract work from a single page they made for a family business. And the monthly session is free and open to secondary students, which almost nobody in the room seemed to know.',
      wish: { key: 'gt-meetup', title: 'Georgetown developer meetup', note: 'Monthly, open to secondary students' }
    },
    { id: 'f5', kind: 'journey', journey: 'raeka' },
    {
      id: 'f6',
      kind: 'question',
      anon: true,
      who: 'Form 2 student, Region 9',
      time: '5 days ago',
      tag: 'Sport and coaching',
      title: 'There is no private academy in Lethem. How do I build a sport pathway that still looks serious?',
      replies: [
        { who: 'Keisha Daniels', role: 'Contributor', text: 'Community leagues, PE subjects, a first aid certificate and a short coaching course. Travel funding is usually the real blocker, so ask about it early.' },
        { who: 'Form 4 student, Region 9', role: 'Student', text: 'I kept a log of every match I helped run. That log is what got me into a regional coaching workshop.' }
      ]
    },
    {
      id: 'f7',
      kind: 'tip',
      anon: false,
      who: 'Omar Khan',
      init: 'OK',
      time: 'Yesterday',
      tag: 'Building and fixing things',
      journey: 'omar',
      text: 'Keep Maths and English on a trade path. Sites and certificates still ask for both, even when the work is with your hands.'
    },
    {
      id: 'f8',
      kind: 'question',
      anon: true,
      who: 'Form 5 student, Region 4',
      time: '1 week ago',
      tag: 'After CSEC',
      title: 'My parents want CAPE. I want GTTi electrical after CSEC. How do we decide without it turning into a fight?',
      replies: [
        { who: 'Omar Khan', role: 'Mentor', text: 'Put both plans on one page. Years, cost, first job, and what happens if it does not work out. TVET stops sounding like giving up once a certificate and a mentor are named.' },
        { who: 'Raeka Persaud', role: 'Mentor', text: 'Staying is right for some gates. Pull the actual entry list for the programme you want and compare it against the other one.' }
      ]
    },
    { id: 'f9', kind: 'journey', journey: 'omar' },
    {
      id: 'f10',
      kind: 'story',
      anon: false,
      who: 'Aisha Mohamed',
      init: 'AM',
      time: '3 days ago',
      tag: 'Business',
      title: 'Ran the school stall for a term and kept a cash book.',
      text: 'The margin was smaller than I expected, and keeping records turned out to be the actual lesson. I stopped two weeks before exam block, which was the right call, because the stall would have eaten revision time it could not pay back.'
    },
    {
      id: 'f11',
      kind: 'question',
      anon: true,
      who: 'Form 4 student, Region 3',
      time: '4 days ago',
      tag: 'Creative and media',
      title: 'People keep telling me media is not a real career in Guyana. What proof should I be collecting?',
      replies: [
        { who: 'Marcus Gomes', role: 'Contributor', text: 'A weekly school reel, three shoots run like client work, and everything delivered on time. Show the work instead of arguing for it.' },
        { who: 'Form 5 student, Region 4', role: 'Student', text: 'Delivering on time is what changed how adults spoke to me about it.' }
      ]
    }
  ];

  var DUPE_KEYS = [
    { words: ['biology', 'chemistry', 'medicine', 'science', 'doctor', 'nursing'], id: 'f1' },
    { words: ['cape', 'tvet', 'gtti', 'electrical', 'after csec', 'trade'], id: 'f8' },
    { words: ['sport', 'coach', 'academy', 'lethem', 'football', 'cricket'], id: 'f6' },
    { words: ['media', 'film', 'camera', 'photograph', 'design'], id: 'f11' }
  ];

  var TOPIC_OPTIONS = [
    'Subject choice',
    'Science and health',
    'Technology',
    'Building and fixing things',
    'Business',
    'Creative and media',
    'Sport and coaching',
    'After CSEC'
  ];

  var JOURNEYS = {
    raeka: {
      id: 'raeka',
      name: 'Raeka Persaud',
      init: 'RP',
      role: 'Mentor',
      type: 'The Steward',
      field: 'Science and health',
      place: 'Georgetown, Region 4',
      age: 12,
      ongoing: true,
      hook: "Joined the school science club at St Rose's and stayed after every lab to clean glassware.",
      now: 'Junior doctor at Georgetown Public Hospital. Mentors CSEC science students on weekends.',
      quote: 'Steady care beats flashy grades.',
      blurb: 'Walks Form 3 to Form 6 students through science subject choice and UG health routes.',
      moments: [
        { age: 12, text: "Joined the school science club at St Rose's and stayed after every lab to clean glassware." },
        { age: 14, text: 'Chose the pure science stream even though friends pushed her toward business subjects.' },
        { age: 16, text: 'Failed her first CSEC Biology mock. Rebuilt her notes from past papers and a neighbour\'s textbooks.', flag: 'Setback' },
        { age: 18, text: 'Sat CAPE Biology and Chemistry while volunteering at a health centre in Kitty.' }
      ],
      route: [
        {
          stage: 'explore',
          text: 'Took every science elective she could and kept a notebook of hospital stories from her aunt.',
          lesson: 'Collect real moments from clinics and labs before you pick a stream.'
        },
        {
          stage: 'subject',
          text: 'Locked Biology, Chemistry, Physics, Maths, English and Caribbean History.',
          lesson: 'If medicine is even a maybe, protect Biology and Chemistry at Form 3.'
        },
        {
          stage: 'csec',
          text: 'Sat CSEC with strong Biology and Chemistry. Used free past paper clinics after school.',
          lesson: 'Mocks are rehearsal, not judgment. Fix the weak paper early.'
        },
        {
          stage: 'fork',
          text: 'Stayed for CAPE Sciences instead of jumping straight to work.',
          lesson: 'The fork is real. CAPE, TVET or work. Name the gate each path needs.'
        },
        {
          stage: 'special',
          text: 'Completed CAPE Biology, Chemistry and Caribbean Studies. Applied to UG Medicine.',
          lesson: 'Map CAPE units to the exact UG entry list, not a rumour from WhatsApp.'
        },
        {
          stage: 'led',
          text: 'Entered UG medical training and began junior clinical work in Georgetown.',
          lesson: 'Health routes take years. Build patience and a support circle early.'
        }
      ],
      dive: {
        title: 'University of Guyana, Faculty of Health Sciences',
        req: 'Strong CSEC and CAPE Biology and Chemistry. Competitive aggregate for Medicine and related health programmes.',
        cost: 'Living costs in Georgetown are usually the main expense. Scholarships and support vary by year.',
        caveat: 'Confirm the current entry list, grades and application dates with the University of Guyana before you plan around them.'
      },
      did: {
        text: 'UG health programmes publish subject requirements each cycle. Biology and Chemistry stay the usual gates.',
        src: 'University of Guyana Faculty of Health Sciences admissions notices'
      },
      steps: [
        { kind: 'Subject', label: 'CSEC Biology', stage: 'subject' },
        { kind: 'Subject', label: 'CSEC Chemistry', stage: 'subject' },
        { kind: 'Opportunity', label: 'Weekly past paper clinic', stage: 'csec' },
        { kind: 'Route step', label: 'Join school science club', stage: 'explore' },
        { kind: 'Route step', label: 'Stay for CAPE Sciences', stage: 'fork' },
        { kind: 'Career', label: 'Doctor, clinical pathway', stage: 'led' }
      ]
    },

    omar: {
      id: 'omar',
      name: 'Omar Khan',
      init: 'OK',
      role: 'Mentor',
      type: 'The Artisan',
      field: 'Building and fixing things',
      place: 'New Amsterdam, Region 6 / Berbice',
      age: 13,
      ongoing: true,
      hook: "Fixed a neighbour's fan with a borrowed multimeter and never gave the tool back without asking first.",
      now: 'Electrician and site supervisor in Berbice. Evening instructor at a local TVET centre.',
      quote: 'If it breaks, learn why. Then fix it properly.',
      blurb: 'Helps students see TVET and trade routes as real plans, not leftovers.',
      moments: [
        { age: 13, text: "Fixed a neighbour's fan with a borrowed multimeter and never gave the tool back without asking first." },
        { age: 15, text: 'Picked Industrial Technology and Maths even when the academic stream looked more prestigious.' },
        { age: 17, text: 'Missed a CSEC English resit window and had to wait a full sitting. Kept working on sites anyway.', flag: 'Setback' },
        { age: 18, text: 'Took a GTTi electrical short course while earning on residential jobs in New Amsterdam.' }
      ],
      route: [
        {
          stage: 'explore',
          text: 'Helped the school caretaker with small repairs and logged every tool he learned.',
          lesson: 'Treat every broken thing at home as a free lesson.'
        },
        {
          stage: 'subject',
          text: 'Chose Industrial Technology, Maths, English, Integrated Science and EDPM.',
          lesson: 'Keep Maths and English even on a trade path. Sites and certificates ask for both.'
        },
        {
          stage: 'csec',
          text: 'Sat CSEC while apprenticing Saturdays with a licensed electrician in Berbice.',
          lesson: 'Pair exam year with real hours under someone licensed.'
        },
        {
          stage: 'fork',
          text: 'Left the full-time academic track for GTTi electrical training plus paid site work.',
          lesson: 'Leaving school can be a plan if a certificate and mentor are lined up.'
        },
        {
          stage: 'special',
          text: 'Completed electrical installation modules and safety tickets part time.',
          lesson: 'Stack short certificates. Each one unlocks better site pay.'
        },
        {
          stage: 'led',
          text: 'Became a licensed electrician and began supervising small residential crews.',
          lesson: 'Reputation on sites travels faster than any certificate alone.'
        }
      ],
      dive: {
        title: 'Government Technical Institute (GTTi) and regional TVET centres',
        req: 'CSEC Maths and English help. Some programmes accept experience plus lower grades with bridging.',
        cost: 'TVET fees are usually lower than university. Tools and transport are the real extras.',
        caveat: 'Call the TVET centre for current intake dates, tool lists and whether your CSEC grades meet the programme you want. Confirm requirements with the institution directly.'
      },
      did: {
        text: 'Many Guyanese electrical careers run through TVET certificates plus supervised site hours, not only a university degree.',
        src: 'Council for Technical and Vocational Education and Training / GTTi programme notices'
      },
      steps: [
        { kind: 'Subject', label: 'Industrial Technology', stage: 'subject' },
        { kind: 'Subject', label: 'CSEC Mathematics', stage: 'subject' },
        { kind: 'Opportunity', label: 'Saturday site apprenticeship', stage: 'csec' },
        { kind: 'Route step', label: 'Leave for TVET and paid site work', stage: 'fork' },
        { kind: 'Opportunity', label: 'GTTi electrical modules', stage: 'special' },
        { kind: 'Career', label: 'Electrician, trades supervisor', stage: 'led' }
      ]
    },

    jerome: {
      id: 'jerome',
      name: 'Jerome DaSilva',
      init: 'JD',
      role: 'Contributor',
      type: 'The Pioneer',
      field: 'Technology',
      place: 'Georgetown, Region 4',
      age: 12,
      ongoing: false,
      hook: "Built a simple HTML page for his cousin's cake business on a shared family laptop.",
      now: 'Software developer in Georgetown. Runs a weekend coding circle for secondary students.',
      quote: 'Ship something small before you wait for perfect.',
      blurb: 'Shares coding club and scholarship tips from a documented Georgetown developer path.',
      moments: [
        { age: 12, text: "Built a simple HTML page for his cousin's cake business on a shared family laptop." },
        { age: 14, text: 'Joined a STEMGuyana robotics pod and learned to debug in public without freezing.' },
        { age: 16, text: 'Lost a national hackathon final when the demo crashed. Rewrote the pitch around the failure.', flag: 'Setback' },
        { age: 18, text: 'Used CAPE Computer Science projects as portfolio pieces for UG and internship apps.' }
      ],
      route: [
        {
          stage: 'explore',
          text: 'Taught himself basic HTML and CSS from free tutorials and school computer lab hours.',
          lesson: 'One small project beats ten unread tutorials.'
        },
        {
          stage: 'subject',
          text: 'Chose Information Technology, Maths, Physics, English and EDPM.',
          lesson: 'Protect Maths. Every solid tech route still leans on it.'
        },
        {
          stage: 'csec',
          text: 'Sat CSEC while shipping small apps for church and school events.',
          lesson: 'Portfolio evidence matters as much as the grade slip.'
        },
        {
          stage: 'fork',
          text: 'Stayed for CAPE Computer Science and Applied Maths rather than a quick certificate only.',
          lesson: 'If you want degree-level CS, CAPE still opens doors in Guyana.'
        },
        {
          stage: 'special',
          text: 'Built a CAPE project that tracked school club attendance. Presented it at a regional STEAM fair.',
          lesson: 'Make CAPE IA work double as a public demo.'
        },
        {
          stage: 'led',
          text: 'Entered UG Computer Science and freelanced for local SMEs while studying.',
          lesson: 'Local clients teach scope and delivery faster than another course.'
        }
      ],
      dive: {
        title: 'University of Guyana, Computer Science and IT programmes',
        req: 'Strong Maths. Computer Science or IT subjects help. A portfolio strengthens internship apps.',
        cost: 'Living costs plus a laptop. Many clubs and online courses stay free or low cost.',
        caveat: 'Check STEMGuyana club locations and UG Computer Science entry requirements for the current academic year with the institution directly.'
      },
      did: {
        text: 'STEMGuyana has run robotics and coding pods across multiple regions, including communities outside Georgetown.',
        src: 'STEMGuyana programme descriptions'
      },
      steps: [
        { kind: 'Opportunity', label: 'STEMGuyana coding club', stage: 'explore' },
        { kind: 'Subject', label: 'CSEC Information Technology', stage: 'subject' },
        { kind: 'Subject', label: 'CSEC Mathematics', stage: 'subject' },
        { kind: 'Route step', label: 'Enter a hackathon or STEAM fair', stage: 'csec' },
        { kind: 'Subject', label: 'CAPE Computer Science', stage: 'special' },
        { kind: 'Career', label: 'Software developer', stage: 'led' }
      ]
    }
  };

  var JOURNEY_LIST = [JOURNEYS.raeka, JOURNEYS.omar, JOURNEYS.jerome];

  function journeyById(id) {
    if (!id) return null;
    return JOURNEYS[id] || null;
  }

  global.NSG_DATA = {
    STAGES: STAGES,
    FY: FY,
    FEED: FEED,
    JOURNEYS: JOURNEYS,
    JOURNEY_LIST: JOURNEY_LIST,
    DUPE_KEYS: DUPE_KEYS,
    TOPIC_OPTIONS: TOPIC_OPTIONS,
    journeyById: journeyById
  };
})(typeof window !== 'undefined' ? window : this);
