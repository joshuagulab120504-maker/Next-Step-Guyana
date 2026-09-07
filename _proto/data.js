/* Next Step Guyana prototype seed data (_proto/data.js).
   ES5 only: var, no arrows, no template literals, no optional chaining.
   No em dashes, no en dashes. Ranges written with "to". */

var STAGES = [
  {
    key: 'explore',
    name: 'Form 1 to 2',
    label: 'Exploration',
    dec: {
      t: 'Pick one thing to try this term',
      why: 'Nothing is decided yet, so the cheapest useful move is testing an interest before it costs you a subject.',
      due: null
    }
  },
  {
    key: 'subject',
    name: 'Form 3',
    label: 'Subject choice',
    dec: {
      t: 'Lock your subject combination',
      why: 'This is the decision that quietly closes doors. Dropping a subject now is easy. Adding it back in Form 4 depends entirely on your school.',
      due: '2026-11-28'
    }
  },
  {
    key: 'csec',
    name: 'Form 4 to 5',
    label: 'CSEC',
    dec: {
      t: 'Register your subjects and fix the weakest paper',
      why: 'Registration is admin and easy to leave late. The weak paper is what decides your aggregate.',
      due: '2026-12-28'
    }
  },
  {
    key: 'fork',
    name: 'After CSEC',
    label: 'The fork',
    dec: {
      t: 'Choose between CAPE, an institute, work or a mix',
      why: 'All of these are real routes. What separates a plan from a guess is naming the certificate or entry list the route needs.',
      due: '2027-07-28'
    }
  },
  {
    key: 'special',
    name: 'Form 6 or institute',
    label: 'Specialise',
    dec: {
      t: 'Match your units to the published entry list',
      why: 'Programmes publish requirements each cycle. Working from last year, or from what someone told you, is where applications fail.',
      due: null
    }
  },
  {
    key: 'led',
    name: 'After that',
    label: 'Where it led',
    dec: {
      t: 'Write up your own route',
      why: 'The path you just walked is the one somebody in Form 2 is searching for right now.',
      due: null
    }
  }
];

var CATS = [
  'Subject choice',
  'Science and health',
  'Technology',
  'Building and fixing things',
  'Business',
  'Creative and media',
  'Sport and coaching',
  'After CSEC',
  'Scholarships'
];

var AUTHORS = {
  raeka: {
    name: 'Raeka Persaud',
    init: 'RP',
    role: 'mentor',
    pending: false,
    verified: true,
    contactable: true,
    form: '',
    region: '',
    pos: 'Junior doctor, Georgetown Public Hospital',
    journey: 'raeka',
    pod: 'Science and health pod',
    cats: ['Science and health', 'Subject choice'],
    similar: ['omar', 'jerome']
  },
  omar: {
    name: 'Omar Khan',
    init: 'OK',
    role: 'mentor',
    pending: false,
    verified: true,
    contactable: true,
    form: '',
    region: '',
    pos: 'Electrician and site supervisor, Berbice',
    journey: 'omar',
    pod: 'Trades pod',
    cats: ['Building and fixing things'],
    similar: ['raeka', 'keisha']
  },
  jerome: {
    name: 'Jerome DaSilva',
    init: 'JD',
    role: 'contributor',
    pending: false,
    verified: false,
    contactable: false,
    form: '',
    region: '',
    pos: 'Software developer, Georgetown',
    journey: 'jerome',
    cats: ['Technology'],
    similar: ['omar', 'raeka']
  },
  keisha: {
    name: 'Keisha Daniels',
    init: 'KD',
    role: 'mentor',
    pending: false,
    verified: true,
    contactable: true,
    form: '',
    region: '',
    pos: 'Community coach and PE teacher, Lethem',
    journey: 'keisha',
    pod: 'Sport and coaching pod',
    cats: ['Sport and coaching'],
    similar: ['omar', 'marcus']
  },
  marcus: {
    name: 'Marcus Gomes',
    init: 'MG',
    role: 'contributor',
    pending: false,
    verified: false,
    contactable: false,
    form: '',
    region: '',
    pos: 'Videographer, Georgetown',
    journey: 'marcus',
    cats: ['Creative and media'],
    similar: ['jerome', 'keisha']
  },
  aisha: {
    name: 'Aisha Mohamed',
    init: 'AM',
    role: 'student',
    pending: false,
    verified: false,
    contactable: false,
    form: 'Form 5',
    region: 'Region 4',
    pos: 'Form 5 student, Region 4',
    cats: ['Business']
  },
  desk: {
    name: 'Opportunities desk',
    init: 'OD',
    role: 'admin',
    pending: false,
    verified: false,
    contactable: false,
    form: '',
    region: '',
    pos: 'Next Step team',
    system: true
  }
};

var JOURNEYS = {
  raeka: {
    age: 12,
    ongoing: true,
    field: 'Science and health',
    type: 'The Steward',
    place: 'Georgetown, Region 4',
    hook: "Joined the school science club at St Rose's and stayed after every lab to clean glassware.",
    now: 'Junior doctor at Georgetown Public Hospital. Mentors CSEC science students on weekends.',
    body: [
      "Joined the school science club at St Rose's and stayed after every lab to clean glassware.",
      'Chose the pure science stream even though friends pushed her toward business subjects.',
      'Failed her first CSEC Biology mock. Rebuilt her notes from past papers and a neighbour\'s textbooks.',
      'Sat CAPE Biology and Chemistry while volunteering at a health centre in Kitty.',
      'Took every science elective she could and kept a notebook of hospital stories from her aunt. Locked Biology, Chemistry, Physics, Maths, English and Caribbean History.',
      'Sat CSEC with strong Biology and Chemistry. Used free past paper clinics after school. Stayed for CAPE Sciences instead of jumping straight to work.',
      'Completed CAPE Biology, Chemistry and Caribbean Studies. Applied to UG Medicine. Entered UG medical training and began junior clinical work in Georgetown.',
      'Junior doctor at Georgetown Public Hospital. Mentors CSEC science students on weekends.'
    ],
    quote: 'Steady care beats flashy grades.',
    blurb: 'Walks Form 3 to Form 6 students through science subject choice and UG health routes.',
    moments: [
      { age: 12, text: "Joined the school science club at St Rose's and stayed after every lab to clean glassware." },
      { age: 14, text: 'Chose the pure science stream even though friends pushed her toward business subjects.' },
      { age: 16, text: 'Failed her first CSEC Biology mock. Rebuilt her notes from past papers and a neighbour\'s textbooks.', flag: 'setback' },
      { age: 18, text: 'Sat CAPE Biology and Chemistry while volunteering at a health centre in Kitty.' }
    ],
    route: [
      { stage: 'explore', text: 'Took every science elective she could and kept a notebook of hospital stories from her aunt.', lesson: 'Collect real moments from clinics and labs before you pick a stream.' },
      { stage: 'subject', text: 'Locked Biology, Chemistry, Physics, Maths, English and Caribbean History.', lesson: 'If medicine is even a maybe, protect Biology and Chemistry at Form 3.' },
      { stage: 'csec', text: 'Sat CSEC with strong Biology and Chemistry. Used free past paper clinics after school.', lesson: 'Mocks are rehearsal, not judgment. Fix the weak paper early.' },
      { stage: 'fork', text: 'Stayed for CAPE Sciences instead of jumping straight to work.', lesson: 'The fork is real. CAPE, TVET or work. Name the gate each path needs.' },
      { stage: 'special', text: 'Completed CAPE Biology, Chemistry and Caribbean Studies. Applied to UG Medicine.', lesson: 'Map CAPE units to the exact UG entry list, not a rumour from WhatsApp.' },
      { stage: 'led', text: 'Entered UG medical training and began junior clinical work in Georgetown.', lesson: 'Health routes take years. Build patience and a support circle early.' }
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
    age: 13,
    ongoing: true,
    field: 'Building and fixing things',
    type: 'The Artisan',
    place: 'New Amsterdam, Region 6',
    hook: "Fixed a neighbour's fan with a borrowed multimeter and got asked to look at three more that week.",
    now: 'Electrician and site supervisor in Berbice. Evening instructor at a local TVET centre.',
    body: [
      "Fixed a neighbour's fan with a borrowed multimeter and got asked to look at three more that week.",
      'Picked Industrial Technology and Maths even when the academic stream looked more prestigious.',
      'Missed a CSEC English resit window and had to wait a full sitting. Kept working on sites anyway.',
      'Took a GTTi electrical short course while earning on residential jobs in New Amsterdam.',
      'Helped the school caretaker with small repairs and logged every tool he learned. Chose Industrial Technology, Maths, English, Integrated Science and EDPM.',
      'Sat CSEC while apprenticing Saturdays with a licensed electrician in Berbice. Left the full-time academic track for GTTi electrical training plus paid site work.',
      'Completed electrical installation modules and safety tickets part time. Became a licensed electrician and began supervising small residential crews.',
      'Electrician and site supervisor in Berbice. Evening instructor at a local TVET centre.'
    ],
    quote: 'A certificate is a door. Your hands are what walk you through it.',
    blurb: 'Helps students see TVET and trade routes as real plans, not leftovers.',
    moments: [
      { age: 13, text: "Fixed a neighbour's fan with a borrowed multimeter and got asked to look at three more that week." },
      { age: 15, text: 'Picked Industrial Technology and Maths even when the academic stream looked more prestigious.' },
      { age: 17, text: 'Missed a CSEC English resit window and had to wait a full sitting. Kept working on sites anyway.', flag: 'setback' },
      { age: 19, text: 'Took a GTTi electrical short course while earning on residential jobs in New Amsterdam.' }
    ],
    route: [
      { stage: 'explore', text: 'Helped the school caretaker with small repairs and logged every tool he learned.', lesson: 'Treat every broken thing at home as a free lesson.' },
      { stage: 'subject', text: 'Chose Industrial Technology, Maths, English, Integrated Science and EDPM.', lesson: 'Keep Maths and English even on a trade path. Sites and certificates ask for both.' },
      { stage: 'csec', text: 'Sat CSEC while apprenticing Saturdays with a licensed electrician in Berbice.', lesson: 'Pair exam year with real hours under someone licensed.' },
      { stage: 'fork', text: 'Left the full-time academic track for GTTi electrical training plus paid site work.', lesson: 'Leaving school can be a plan if a certificate and mentor are lined up.' },
      { stage: 'special', text: 'Completed electrical installation modules and safety tickets part time.', lesson: 'Stack short certificates. Each one unlocks better site pay.' },
      { stage: 'led', text: 'Became a licensed electrician and began supervising small residential crews.', lesson: 'Reputation on sites travels faster than any certificate alone.' }
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
    age: 12,
    ongoing: false,
    field: 'Technology',
    type: 'The Pioneer',
    place: 'Sophia, Region 4',
    hook: "Built a simple HTML page for his cousin's cake business on a shared family laptop.",
    now: 'Software developer in Georgetown. Runs a weekend coding circle for secondary students.',
    body: [
      "Built a simple HTML page for his cousin's cake business on a shared family laptop.",
      'Joined a STEMGuyana robotics pod and learned to debug in public without freezing.',
      'Lost a national hackathon final when the demo crashed. Rewrote the pitch around the failure.',
      'Used CAPE Computer Science projects as portfolio pieces for UG and internship apps.',
      'Taught himself basic HTML and CSS from free tutorials and school computer lab hours. Chose Information Technology, Maths, Physics, English and EDPM.',
      'Sat CSEC while shipping small apps for church and school events. Stayed for CAPE Computer Science and Applied Maths rather than a quick certificate only.',
      'Built a CAPE project that tracked school club attendance. Presented it at a regional STEAM fair. Entered UG Computer Science and freelanced for local SMEs while studying.',
      'Software developer in Georgetown. Runs a weekend coding circle for secondary students.'
    ],
    quote: 'Ship something small before you wait for perfect.',
    blurb: 'Shares coding club and scholarship tips from a documented Georgetown developer path.',
    moments: [
      { age: 12, text: "Built a simple HTML page for his cousin's cake business on a shared family laptop." },
      { age: 14, text: 'Joined a STEMGuyana robotics pod and learned to debug in public without freezing.' },
      { age: 16, text: 'Lost a national hackathon final when the demo crashed. Rewrote the pitch around the failure.', flag: 'setback' },
      { age: 18, text: 'Used CAPE Computer Science projects as portfolio pieces for UG and internship apps.' }
    ],
    route: [
      { stage: 'explore', text: 'Taught himself basic HTML and CSS from free tutorials and school computer lab hours.', lesson: 'One small project beats ten unread tutorials.' },
      { stage: 'subject', text: 'Chose Information Technology, Maths, Physics, English and EDPM.', lesson: 'Protect Maths. Every solid tech route still leans on it.' },
      { stage: 'csec', text: 'Sat CSEC while shipping small apps for church and school events.', lesson: 'Portfolio evidence matters as much as the grade slip.' },
      { stage: 'fork', text: 'Stayed for CAPE Computer Science and Applied Maths rather than a quick certificate only.', lesson: 'If you want degree-level CS, CAPE still opens doors in Guyana.' },
      { stage: 'special', text: 'Built a CAPE project that tracked school club attendance. Presented it at a regional STEAM fair.', lesson: 'Make CAPE IA work double as a public demo.' },
      { stage: 'led', text: 'Entered UG Computer Science and freelanced for local SMEs while studying.', lesson: 'Local clients teach scope and delivery faster than another course.' }
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
  },

  keisha: {
    age: 13,
    ongoing: true,
    field: 'Sport and coaching',
    type: 'The Steward',
    place: 'Lethem, Region 9',
    hook: 'Started keeping a lined exercise book of every PE session she helped run at her Lethem school, including who showed up and what drills they did.',
    now: 'Community coach and PE teacher in Lethem. Mentors hinterland students who want a sport route without a private academy.',
    body: [
      'Started keeping a lined exercise book of every PE session she helped run at her Lethem school, including who showed up and what drills they did.',
      'Missed regional trials because there was no transport that week. Logged the absence and kept training the younger students instead.',
      'Used her written log of sessions to apply for travel support. The log is what got her funded to a regional coaching workshop.',
      'Took a short coaching course and first aid certificate, then began PE teaching while still coaching community leagues.',
      'Joined every school sport she could reach on foot and kept the attendance book when teachers asked. Kept Physical Education, Biology, English and Maths when friends dropped PE for prestige subjects.',
      'Sat CSEC while coaching under-14 community football on Saturdays and writing up every session. Chose a mix: short coaching courses plus work, not only CAPE full time.',
      'Completed first aid and a coaching module while teaching PE parts of the week in Lethem. Became a community coach and PE teacher, mentoring students who face the same transport gaps she did.',
      'Community coach and PE teacher in Lethem. Mentors hinterland students who want a sport route without a private academy.'
    ],
    quote: 'If nothing is organised where you live, write down what you do until someone can fund the next step.',
    blurb: 'Shows Region 9 and hinterland students how community leagues, PE subjects and a paper trail become a serious coaching pathway.',
    moments: [
      { age: 13, text: 'Started keeping a lined exercise book of every PE session she helped run at her Lethem school.' },
      { age: 15, text: 'Missed regional trials because there was no transport that week. Logged the absence and kept training the younger students instead.', flag: 'setback' },
      { age: 17, text: 'Used her written log of sessions to apply for travel support. The log is what got her funded to a regional coaching workshop.' },
      { age: 20, text: 'Took a short coaching course and first aid certificate, then began PE teaching while still coaching community leagues.' }
    ],
    route: [
      { stage: 'explore', text: 'Joined every school sport she could reach on foot and kept the attendance book when teachers asked.', lesson: 'Start with what already runs near you. Record it.' },
      { stage: 'subject', text: 'Kept Physical Education, Biology, English and Maths when friends dropped PE for prestige subjects.', lesson: 'PE is not a soft option if coaching or sport science is on the table.' },
      { stage: 'csec', text: 'Sat CSEC while coaching under-14 community football on Saturdays and writing up every session.', lesson: 'A log of real hours beats a vague claim that you love sport.' },
      { stage: 'fork', text: 'Chose a mix: short coaching courses plus work, not only CAPE full time.', lesson: 'Name the certificate or course the next job actually asks for.' },
      { stage: 'special', text: 'Completed first aid and a coaching module while teaching PE parts of the week in Lethem.', lesson: 'Stack short credentials that travel with you across regions.' },
      { stage: 'led', text: 'Became a community coach and PE teacher, mentoring students who face the same transport gaps she did.', lesson: 'Hinterland routes are real when travel funding is asked for early and backed by evidence.' }
    ],
    dive: {
      title: 'Community coaching, PE teaching and Ministry sport pathways',
      req: 'PE or Biology helps. First aid and a recognised coaching short course matter more than a single school medal.',
      cost: 'Course fees vary. Transport to regional events is often the real cost. Ask early about funded travel.',
      caveat: 'Confirm current coaching course providers, first aid providers and school PE openings with the Ministry or your district office before you plan around them.'
    },
    did: {
      text: 'National schools track and field moved to March so athletes stop missing CARIFTA qualification windows. Regional rounds are still the entry point.',
      src: 'Ministry of Education secondary schools track and field programme notices'
    },
    steps: [
      { kind: 'Route step', label: 'Keep a written log of sessions', stage: 'explore' },
      { kind: 'Subject', label: 'Physical Education', stage: 'subject' },
      { kind: 'Opportunity', label: 'Community league coaching hours', stage: 'csec' },
      { kind: 'Opportunity', label: 'First aid certificate', stage: 'fork' },
      { kind: 'Route step', label: 'Apply for travel funding with evidence', stage: 'special' },
      { kind: 'Career', label: 'Community coach and PE teacher', stage: 'led' }
    ]
  }
};

var OPPS = {
  stem: {
    id: 'stem',
    name: 'STEMGuyana learning pod',
    cat: 'Technology',
    stage: 'explore',
    stages: [0, 1, 2],
    one: 'Free coding and robotics pods for ages 8 to 18 in several regions, and the pipeline into every other STEM competition on this list.',
    what: [
      'STEMGuyana runs after-school learning pods and holiday intensives covering robotics, coding, AI and digital design. Founded by Karen Abrams and partnered with the Ministry of Education, it is the central youth STEM organisation in Guyana.',
      'Pods run in local communities across several regions, including out of school youth. Holiday programmes are typically two-week taster blocks. A clubhouse and mentor training sit behind the student-facing work.',
      'This is the usual on-ramp to Scratch, Caribbean STEM Olympiads and international showcases. Teams from the national learning pods programme have represented Guyana abroad. Start here if you want digital making without waiting for a perfect school club.'
    ],
    season: 'Year-round pods, with intensive holiday blocks in July to August',
    cost: 'No fee to join the student pods described here',
    who: 'Ages 8 to 18, several regions',
    entry: [
      { b: 'Find a pod near you', s: 'Ask STEMGuyana or your school which learning pod or clubhouse serves your area.' },
      { b: 'Turn up for the next block', s: 'Holiday intensives and after-school pods both take beginners. Bring curiosity more than equipment.' },
      { b: 'Stay long enough to ship one thing', s: 'A small robot, animation or app is the proof that unlocks the next competition.' },
      { b: 'Ask about the next competition cycle', s: 'Pods feed Scratch, CSO and STEAM fair teams. Ask your coach which one is open next.' }
    ],
    tips: [
      'Geography is not destiny here. Students from small communities have placed nationally through this pipeline.',
      'If your school has no club, the pod is the entry, not a backup.',
      'Keep a photo or short note of what you built. Mentors and scholarship forms ask for that later.'
    ],
    truth: {
      b: 'Coverage is uneven.',
      p: 'Official listings name strong coverage in Regions 2, 3, 4, 5, 6 and 10. Confirm whether a pod actually runs near you this term before you plan your whole year around it.'
    },
    proof: {
      b: 'International teams have come through these pods.',
      p: 'A National Learning Pods team represented Guyana at the International Greenwich Olympiad in London. STEMGuyana robotics teams have built real prototypes for IDB challenges.'
    },
    leads: 'Scratch coding competition, Caribbean STEM Olympiads, regional STEAM fairs, and later UG or internship portfolios.',
    mentors: ['jerome', 'raeka'],
    rel: ['scratch', 'cso', 'steam'],
    sess: ['s-tech', 's-clinic'],
    independent: false,
    state: 'live',
    author: 'jerome',
    rolling: true,
    closesAt: null,
    apply: 'Ask STEMGuyana or your school which learning pod or clubhouse serves your area.',
    checkedAt: '',
    checkedBy: '',
    source: '',
    returnReason: '',
    images: []
  },

  pyarg: {
    id: 'pyarg',
    name: "President's Youth Award",
    cat: 'Sport and coaching',
    stage: 'explore',
    stages: [0, 1, 2, 3],
    one: 'Non-competitive award from age 14. Bronze, Silver and Gold over 6, 12 and 18 months of service, skill, sport and adventure.',
    what: [
      "The President's Youth Award Republic of Guyana is Guyana's Duke of Edinburgh-style award. It has run since 1998 for ages 14 to 25. You are not beating other students. You are meeting a standard.",
      'Four sections sit under every level: Community Service, Physical Recreation, Skills Training, and Adventurous Journeys. Bronze is about six months, Silver about twelve, Gold about eighteen.',
      'Journeys are concrete. Bronze participants have hiked around fifteen miles. Silver around thirty. Gold has included sixty-mile hikes through the Rupununi savannahs. Completing Gold is genuinely distinguishing because most people stop earlier.'
    ],
    season: 'Rolling intake. Levels take 6, 12 or 18 months',
    cost: 'Programme fees vary by award centre. Ask your Award Leader for the current figure',
    who: 'Ages 14 to 25, any school',
    regions: 'Nationwide through schools',
    entry: [
      { b: 'Find an Award Leader', s: 'Ask your school, youth group or PYARG contacts who assesses in your area.' },
      { b: 'Pick Bronze first', s: 'Set challenges you can actually finish in six months across the four sections.' },
      { b: 'Log everything', s: 'Hours and reflections are the evidence. Without the log, the award stalls.' },
      { b: 'Plan the journey early', s: 'Transport and kit for the adventurous journey are the parts families need notice for.' }
    ],
    tips: [
      'This is the default recommendation when you have no obvious competition hook yet.',
      'Gold is rare on purpose. Do not skip levels to look impressive.',
      'Disability-inclusive pathways exist through centres such as Open Doors. Ask if that is relevant.'
    ],
    truth: {
      b: 'Silver and Gold numbers drop.',
      p: 'Officials have said fewer people finish the higher levels while standards rise. Translation: finishing Gold stands out because most do not.'
    },
    proof: {
      b: 'Hundreds complete journeys in a single year.',
      p: 'One recent cycle saw well over seven hundred participants across Bronze, Silver and Gold adventurous journeys, including long Rupununi hikes.'
    },
    leads: 'Scholarship applications, leadership evidence, and a structured habit of finishing what you start.',
    mentors: ['keisha', 'omar'],
    rel: ['track', 'mash', 'clinic'],
    sess: ['s-sport', 's-fork'],
    independent: true,
    state: 'live',
    author: 'keisha',
    rolling: false,
    closesAt: '2026-09-12T17:00:00-04:00',
    apply: 'Ask your Award Leader, or visit https://pyarg.org.gy',
    link: {
      url: 'https://pyarg.org.gy',
      host: 'pyarg.org.gy',
      title: "President's Youth Award Republic of Guyana",
      description: 'Non-competitive award for ages 14 to 25 across service, skill, sport and adventure.'
    },
    checkedAt: '',
    checkedBy: '',
    source: 'https://pyarg.org.gy',
    returnReason: '',
    images: []
  },

  cso: {
    id: 'cso',
    name: 'Caribbean STEM Olympiads',
    cat: 'Technology',
    stage: 'csec',
    stages: [1, 2, 3],
    one: 'Regional Maths, Coding and Robotics olympiads that accept independent competitors not tied to any school.',
    what: [
      'Run by the Caribbean Science Foundation. Three categories: Math Olympiad, Computer Coding Olympiad, and Robotics and Electronics Olympiad. Each has levels I, II and III, so nine competitive events in total.',
      'Team sizes differ. Maths up to three. Coding and Robotics up to four. Coding teams may sit in different locations or even different countries. Maths and Robotics teams must be in the same room.',
      'The Foundation states outright that medalists should gain an edge on university applications. Guyanese students from Queen\'s College took silver in Level 2 Coding in 2025 with a conservation project called Tides of Tomorrow.'
    ],
    season: 'Annual cycle. Confirm registration windows each year',
    cost: 'Entry fees vary by event. Confirm with the Caribbean Science Foundation',
    who: 'Secondary students ready to work beyond the classroom syllabus',
    entry: [
      { b: 'Pick a category and level', s: 'Read the current rules. Do not assume CSEC age bands match the Foundation levels.' },
      { b: 'Register as independent if needed', s: 'You do not need a school sponsor. That is the fact most students miss.' },
      { b: 'Form a team or go solo where allowed', s: 'Coding can be remote. Maths and Robotics need a shared room.' },
      { b: 'Study outside the syllabus', s: 'Organisers say questions will not always match CSEC or CAPE by age. Plan for that.' }
    ],
    tips: [
      'If your school will not organise entry, register yourself.',
      'Treat finals as exceptional. Most teams do not reach them.',
      'Keep your project writeup. University apps ask for it.'
    ],
    truth: {
      b: 'Difficulty.',
      p: 'This is the hardest thing on this page and the organisers say so themselves. Go in expecting to study beyond your syllabus.'
    },
    proof: {
      b: 'Guyanese medalists already exist.',
      p: 'Titianna Wells, Tomika Wallace and Rihanna Taylor of Queen\'s College won silver in Level 2 of the 2025 Computer Coding Olympiad.'
    },
    leads: 'Stronger university applications, regional STEM networks, and a clear signal you can work past school syllabi.',
    mentors: ['jerome', 'raeka'],
    rel: ['stem', 'scratch', 'steam'],
    sess: ['s-tech'],
    independent: true,
    state: 'live',
    author: 'jerome',
    rolling: false,
    closesAt: '2026-10-12T17:00:00-04:00',
    apply: 'Register as an independent competitor at https://caribbeanscience.org',
    checkedAt: '',
    checkedBy: '',
    source: '',
    returnReason: '',
    images: []
  },

  scratch: {
    id: 'scratch',
    name: 'National Scratch coding competition',
    cat: 'Technology',
    stage: 'explore',
    stages: [0, 1],
    one: 'Grades 1 to 10 build a Scratch animation on a set theme. Regional winners have come from very small communities.',
    what: [
      'Teams create a Scratch project on a published theme, such as climate effects on their own community. It is one of the clearest proofs that geography is not destiny in Guyana STEM.',
      'A recent edition drew eighty-plus teams from eight regions, with more than fifty coming through STEMGuyana learning pods. Georgetown International Academy took first, but regional tops came from Port Kaituma, Aurora, Bell West, Central Mahaicony, West Canje, Bartica and Tabatinga.',
      'Prizes have included certificates for all students, cash for top overall teams and coaches, and medals for top regional teams. Sponsors have included the IDB, Tullow Oil, GTT and diaspora supporters.'
    ],
    season: 'Varies by year. Watch Ministry and STEMGuyana notices',
    cost: 'Usually no student fee through school or pod entry. Confirm each cycle',
    who: 'Grades 1 to 10, teams through school or a learning pod',
    entry: [
      { b: 'Join a pod or school team', s: 'Most strong entries come through STEMGuyana pods or a teacher who already enters.' },
      { b: 'Read the theme early', s: 'Local research beats generic animations. Judges notice place-specific detail.' },
      { b: 'Ship a finished project', s: 'A complete story with working code beats an unfinished ambitious idea.' }
    ],
    tips: [
      'Tabatinga and Port Kaituma teams have placed. Do not wait for a Georgetown school.',
      'Keep coach contacts. They matter for the next cycle.',
      'Use the same project notes later for CSO or STEAM fair writeups.'
    ],
    truth: {
      b: 'You need a team structure.',
      p: 'A solo student with no pod and no teacher still struggles. Find the adult who enters teams, or join a STEMGuyana pod first.'
    },
    proof: {
      b: 'Small communities place nationally.',
      p: 'Regional winners have come from Port Kaituma, Aurora, Bell West, Central Mahaicony, West Canje, Bartica and Tabatinga. Teams from small communities have placed nationally.'
    },
    leads: 'STEMGuyana depth, Caribbean STEM Olympiads, and a portfolio piece before CSEC.',
    mentors: ['jerome'],
    rel: ['stem', 'cso', 'steam'],
    sess: ['s-tech'],
    independent: false,
    state: 'live',
    author: 'desk',
    checkedAt: '',
    checkedBy: '',
    source: '',
    returnReason: '',
    images: []
  },

  jof: {
    id: 'jof',
    name: 'J.O.F. Haynes schools debating competition',
    cat: 'Creative and media',
    stage: 'csec',
    stages: [1, 2],
    one: 'The flagship national schools debate competition, broadcast on the Guyana Learning Channel, entered through your school.',
    what: [
      'Run by the Ministry of Education Secondary Sector. Knockout rounds run from a late April launch toward a June final in recent cycles. Debates are broadcast, so participation carries real visibility.',
      'Motions are current and substantive. Recent ones have covered oil-funded basic income, tablets replacing textbooks, Smart Classrooms and road safety systems. This is not light after-school speaking practice.',
      'The field is not only Georgetown elite schools. Mackenzie High, Three Miles Secondary, Annai Secondary, Santa Rosa Secondary and New Amsterdam Secondary have reached late rounds. Nephlyah Farrel of Mackenzie High was 2026 Best Debater.'
    ],
    season: 'Typically late April launch through June. Confirm each year',
    cost: 'Entered through school. Ask about travel support for later rounds',
    who: 'Secondary students whose school enters a team',
    entry: [
      { b: 'Ask your English or Social Studies teacher', s: 'Entry is through the school. The barrier is usually institutional inertia, not eligibility.' },
      { b: 'Join practice early', s: 'Broadcast rounds reward preparation. Start before the launch event.' },
      { b: 'Push for school entry if it is missing', s: 'If your school is not participating, that is the thing to change first.' }
    ],
    tips: [
      'Hinterland and out-of-town schools have reached late rounds. Do not self-exclude.',
      'Watch previous Learning Channel debates if you can find them.',
      'Best Debater awards travel with your name. Keep the citation.'
    ],
    truth: {
      b: 'Your school has to enter.',
      p: 'There is no clean independent route here. If the school will not field a team, your first job is persuading them, not practising alone.'
    },
    proof: {
      b: 'Wide national field.',
      p: 'Mackenzie High won a recent final. Annai, Santa Rosa and New Amsterdam have reached late rounds. Best Debater has gone to Mackenzie.'
    },
    leads: 'Public speaking confidence, civic arguments, and evidence for law, policy or media routes.',
    mentors: ['marcus', 'aisha'],
    rel: ['mash', 'blue', 'clinic'],
    sess: ['s-media', 's-clinic'],
    independent: false,
    state: 'live',
    author: 'desk',
    checkedAt: '',
    checkedBy: '',
    source: '',
    returnReason: '',
    images: []
  },

  mash: {
    id: 'mash',
    name: "National Children's Mashramani competitions",
    cat: 'Creative and media',
    stage: 'explore',
    stages: [0, 1, 2],
    one: 'The largest youth participation event in Guyana. District round is the entry point, and hinterland travel to nationals is funded.',
    what: [
      'Run by the Ministry of Education Unit of Allied Arts. Categories include Dramatic Poetry, Calypso, Dance, Masquerade, Hip Hop, Jingle, Costume and Physical Display, plus the costume and road parade.',
      'Pipeline matters. District or regional competitions come first. Winners advance to nationals at the National Cultural Centre in February, then the Children\'s Costume and Road Parade through Georgetown. Age bands cover nursery through late teens.',
      'Nearly fifteen hundred students from all eleven education districts competed in a recent national edition. The Unit of Allied Arts provides meals and accommodation for hinterland students at nationals. Students from Region 7, Region 8 and deep Rupununi communities such as Karaudarnau have competed.'
    ],
    season: 'District rounds from January, nationals around February',
    cost: 'School entry. Hinterland meals and accommodation for nationals are funded by the Unit',
    who: 'Age bands from about 5 to 17 or 18 across performance categories',
    entry: [
      { b: 'Start at the district round', s: 'That is the actual entry point. The national final is what people see.' },
      { b: 'Pick a category that fits your strength', s: 'Calypso, poetry, dance and costume are judged on performance, not CSEC grades.' },
      { b: 'Ask about hinterland support early', s: 'If you advance, meals and lodging for nationals are organised. Do not assume you must pay your own way.' },
      { b: 'Treat rehearsal like training', s: 'Winning pieces have clear themes and polish. Atiya Mohamed\'s Hands Off Guyana calypso is the recent standard.' }
    ],
    tips: [
      'TVET students are not excluded. Essequibo Technical Institute has competed in calypso.',
      'Keep recordings and results. Creative portfolios need them.',
      'If your school is not entering, ask why in January, not in February.'
    ],
    truth: {
      b: 'Nothing much, which is the point.',
      p: 'This is the most open door in the country for a student whose strength is performance.'
    },
    proof: {
      b: 'Named winners across regions.',
      p: 'Recent winners include Atiya Mohamed of Zeeburg Secondary in calypso, Kareem Jabor of Christ Church Secondary in dramatic poetry, and Zelie James of Santa Rosa Primary from Region 1.'
    },
    leads: 'Institute of Creative Arts routes, cultural industry visibility, and proof that talent without top grades still travels.',
    mentors: ['marcus', 'keisha'],
    rel: ['jof', 'blue', 'track'],
    sess: ['s-media', 's-sport'],
    independent: false,
    state: 'live',
    author: 'desk',
    checkedAt: '',
    checkedBy: '',
    source: '',
    returnReason: '',
    images: []
  },

  steam: {
    id: 'steam',
    name: 'National STEAM fair',
    cat: 'Science and health',
    stage: 'subject',
    stages: [1, 2, 3, 4],
    one: 'Biennial national fair fed by regional STEAM fairs. The regional fair is the real entry point, not the national one.',
    what: [
      'Run by the Ministry of Education. Students from primary through tertiary show projects across education districts. Categories include nursery, primary, secondary, practical instruction centres and observers.',
      'The national event is a three-day showcase with interactive exhibits and student projects on real problems, often sustainability, entrepreneurship and technology. One regional fair at Queen\'s College displayed eighty-five projects.',
      'If someone tells you to enter the national STEAM fair, they are skipping the step that matters. Your regional fair is where you actually sign up.'
    ],
    season: 'Regional fairs feed a biennial national fair. Confirm the current cycle',
    cost: 'Usually through school. Confirm materials and transport support',
    who: 'Primary through tertiary students via school or centre entry',
    entry: [
      { b: 'Ask about the regional fair date', s: 'That date is your deadline. The national fair is later and invitational by progress.' },
      { b: 'Pick a problem you can evidence', s: 'Local problems with measured results beat vague global slogans.' },
      { b: 'Build a demo people can touch', s: 'Interactive beats poster-only when judges walk the floor.' }
    ],
    tips: [
      'Reuse CAPE IA or club projects when the timing lines up.',
      'Photograph the build process. Judges and later applications ask how you got there.',
      'Practical instruction centres have their own category. TVET work belongs here.'
    ],
    truth: {
      b: 'Wrong entry point.',
      p: 'Students who wait for the national announcement miss the regional qualifier. Ask your science or IT teacher for the regional date now.'
    },
    proof: {
      b: 'Scale is real.',
      p: 'Regional fairs already draw dozens of projects per site. The national stage is a continuation, not a cold open.'
    },
    leads: 'CAPE project visibility, UG and scholarship evidence, and links into STEMGuyana competition pipelines.',
    mentors: ['raeka', 'jerome'],
    rel: ['stem', 'cso', 'clinic'],
    sess: ['s-sci', 's-tech'],
    independent: false,
    state: 'live',
    author: 'desk',
    checkedAt: '',
    checkedBy: '',
    source: '',
    returnReason: '',
    images: []
  },

  track: {
    id: 'track',
    name: 'National secondary schools track and field',
    cat: 'Sport and coaching',
    stage: 'csec',
    stages: [1, 2],
    one: 'The main national schools athletics meet, moved to March so athletes stop missing CARIFTA windows.',
    what: [
      'Held at the National Track and Field Centre, Leonora, over three days in March under the revamped format. Track and field only. Swimming and cycling were dropped from the old multi-sport schools nationals.',
      'Roughly two thousand student-athletes compete for school districts. Regional qualification rounds happen first. Nationals are the final stage, not where you suddenly appear.',
      'The date change is deliberate. The old November timing left athletes peaking too late for CARIFTA and other international windows. March Nationals are now a stepping stone into regional athletics the same year.'
    ],
    season: 'Regional qualifiers first, nationals in March',
    cost: 'Through school and district. Ask about kit and travel early',
    who: 'Secondary student-athletes selected through regional rounds',
    entry: [
      { b: 'Compete at the regional meet', s: 'That is the gate. Nationals come after selection.' },
      { b: 'Know your event calendar', s: 'March timing exists so international windows stay open. Plan school exams around that honestly.' },
      { b: 'Talk to your PE teacher about district selection', s: 'Federations and the Athletics Association sit on the management side. School is still your door.' }
    ],
    tips: [
      'If you swim, do not wait for schools nationals. That route now runs through clubs.',
      'Coaching and sports admin are adjacent careers if you love sport but will not go pro.',
      'Keep result sheets. They are evidence for scholarships and federation pathways.'
    ],
    truth: {
      b: 'Transport and selection.',
      p: 'Missing a regional trial because there was no transport that week is common outside the coast. Ask about travel support before the meet week.'
    },
    proof: {
      b: 'Pathway to CARIFTA is explicit.',
      p: 'The Ministry moved Nationals to March specifically so athletes could still be channelled into CARIFTA and other international events the same year.'
    },
    leads: 'CARIFTA and federation pathways, PE and coaching routes, and sports management seminars.',
    mentors: ['keisha'],
    rel: ['pyarg', 'mash', 'clinic'],
    sess: ['s-sport'],
    independent: false,
    state: 'live',
    author: 'desk',
    checkedAt: '',
    checkedBy: '',
    source: '',
    returnReason: '',
    images: []
  },

  blue: {
    id: 'blue',
    name: 'Blue Ocean student entrepreneur competition',
    cat: 'Business',
    stage: 'subject',
    stages: [1, 2, 3],
    one: 'Fully virtual global student entrepreneur competition. Direct registration, no school sponsor required. Guyana is listed among participating countries.',
    what: [
      'Blue Ocean is a virtual, global competition for high-school-aged students. Tens of thousands of students enter in a cycle. Guyana is explicitly listed among participating countries.',
      'Students pitch business concepts to real entrepreneurs, get feedback, and compete for cash prizes. The whole path is online, which matters if you cannot travel or your school will not organise entrepreneurship clubs.',
      'Registration for the next cycle opens after each year\'s results. Treat the calendar as rolling and confirm on the organiser site rather than last year\'s WhatsApp flyer.'
    ],
    season: 'Annual virtual cycle. Registration opens after results each year',
    cost: 'Confirm on the organiser site. Designed for direct student entry',
    who: 'High-school-aged students anywhere with internet access',
    entry: [
      { b: 'Register yourself', s: 'No school sponsor and no teacher required. That single fact is why most students who could enter this never do.' },
      { b: 'Write a problem you see locally', s: 'Judges have seen generic app ideas. A Berbice or Lethem problem stands out.' },
      { b: 'Practise a short pitch', s: 'Feedback from entrepreneurs is part of the value. Use it even if you do not place.' }
    ],
    tips: [
      'Pair this with a cash book or small stall experiment so your pitch has numbers.',
      'Keep the feedback notes. They help SBB and other local programmes later.',
      'Virtual does not mean casual. Treat deadlines like exam dates.'
    ],
    truth: {
      b: 'Internet and self-discipline.',
      p: 'There is no teacher chasing you. If connectivity is unreliable, download materials early and draft offline.'
    },
    proof: {
      b: 'Guyana is already on the map.',
      p: 'The organiser lists Guyana among participating countries. Entry is not theoretical for students here.'
    },
    leads: 'Small Business Bureau programmes, local start-up grants, and a pitch you can reuse for class or youth business training.',
    mentors: ['aisha', 'omar'],
    rel: ['sbb', 'jof', 'pyarg'],
    sess: ['s-biz', 's-fork'],
    independent: true,
    state: 'live',
    author: 'omar',
    rolling: false,
    closesAt: '2026-09-04T17:00:00-04:00',
    apply: 'Register directly on the Blue Ocean site. No school sponsor required.',
    checkedAt: '',
    checkedBy: '',
    source: '',
    returnReason: '',
    images: []
  },

  sbb: {
    id: 'sbb',
    name: 'Tertiary entrepreneurship award',
    cat: 'Business',
    stage: 'fork',
    stages: [3, 4, 5],
    one: 'Small Business Bureau award aimed at TVET students. Training, a pitch, and grants of up to four hundred thousand dollars for viable proposals.',
    what: [
      'Run by the Small Business Bureau with the Ministry of Education. The inaugural cohort saw more than sixty-five students from five technical and vocational institutions complete the programme.',
      'Training covers marketing, financial management, record-keeping, business proposal writing and small business management. Participants develop proposals, pitch to judges, and the most viable plans qualify for grants to establish the business.',
      'This is aimed at TVET students, not university students. If you are at GTTi, ETI, Carnegie or a similar institute, this is one of the few high-value entrepreneurship doors built for you.'
    ],
    season: 'Cohort-based. Confirm intake with SBB and your institute',
    cost: 'Programme costs handled through the award structure. Confirm with SBB',
    who: 'Students at technical and vocational institutions',
    entry: [
      { b: 'Ask your institute coordinator', s: 'Entry has run through participating TVET institutions, not cold street applications.' },
      { b: 'Build a proposal with real numbers', s: 'Record-keeping and financial management are taught because judges expect them.' },
      { b: 'Practise the pitch', s: 'The panel is the gate to the grant. Rehearse like a practical exam.' }
    ],
    tips: [
      'Keep a cash book from any small hustle before you apply. It becomes evidence.',
      'SBB is also the wider government vehicle for small business support after the award.',
      'TVET is not a second-class route here. The programme is built around it.'
    ],
    truth: {
      b: 'You need to be in a participating institute.',
      p: 'This is not a Form 3 competition. It opens when you are in TVET. Know it early so you aim at the right fork.'
    },
    proof: {
      b: 'Grants are real.',
      p: 'In the inaugural round, the fifteen most viable proposals each qualified for grants of up to four hundred thousand dollars, with millions invested across the cohort.'
    },
    leads: 'Registered small businesses, SBB financing pathways, and work that does not wait on a degree.',
    mentors: ['omar', 'aisha'],
    rel: ['blue', 'pyarg', 'clinic'],
    sess: ['s-biz', 's-fork'],
    independent: false,
    state: 'live',
    author: 'desk',
    checkedAt: '',
    checkedBy: '',
    source: '',
    returnReason: '',
    images: []
  },

  clinic: {
    id: 'clinic',
    name: 'Weekly past paper clinic',
    cat: 'Subject choice',
    stage: 'csec',
    stages: [1, 2],
    one: 'Free after-school past paper sessions run by mentors who sat the same papers.',
    what: [
      'A standing clinic for CSEC and CAPE students who need timed practice and someone to mark the weak spots out loud. It is not a paid lesson shop.',
      'Mentors on the Science and health and Subject choice pods rotate through common papers. Biology, Chemistry, Maths and English A come up most. Bring the paper you are avoiding.',
      'The point is rehearsal. Mocks and past papers are where aggregates get rescued, not where you invent a new identity.'
    ],
    season: 'Weekly in term time. Confirm the current slot on the sessions list',
    cost: 'Free',
    who: 'Form 3 to Form 6 students sitting CSEC or CAPE papers',
    entry: [
      { b: 'Book a session seat', s: 'Places are limited. Use the Sessions list and bring one question you already tried.' },
      { b: 'Arrive with a weak paper, not your best one', s: 'The clinic works when you put the hard subject first.' },
      { b: 'Rebook after mocks', s: 'One visit is a start. A short streak after a bad mock is the real use.' }
    ],
    tips: [
      'Nothing special to bring except the paper and honest timing.',
      'Ask how to add a dropped subject back at your school if that is the real problem.',
      'Pair clinic weeks with registration deadlines so admin does not sink the grade work.'
    ],
    truth: {
      b: 'It will not replace your own hours.',
      p: 'One group session a week cannot carry five subjects. Use it to target the paper that is dragging the aggregate.'
    },
    proof: {
      b: 'Mentors who sat the papers lead it.',
      p: 'Raeka and others on the science pod answer the same threads in the feed that show up in clinic questions.'
    },
    leads: 'Stronger CSEC aggregates, clearer subject choice conversations, and readiness for CAPE or institute entry lists.',
    mentors: ['raeka', 'omar'],
    rel: ['steam', 'stem', 'jof'],
    sess: ['s-clinic', 's-sci', 's-subj'],
    independent: false,
    state: 'live',
    author: 'desk',
    checkedAt: '',
    checkedBy: '',
    source: '',
    returnReason: '',
    images: []
  }
};

var SESSIONS = [
  {
    id: 's-sci',
    title: 'Pathways into medicine and health',
    day: 'Sat',
    date: '12',
    when: 'Saturday 12 September, 5:00 PM, one hour on Google Meet',
    dateText: 'Saturday 12 September, 5:00 PM',
    length: 'One hour',
    platform: 'Google Meet',
    pod: 'Science and health pod',
    lead: 'raeka',
    hosted_by: 'raeka',
    seats: 25,
    taken: 14,
    stages: ['subject', 'csec', 'fork'],
    cat: 'Science and health',
    what: 'Walk through Biology and Chemistry gates, UG health entry lists, and what a bad mock actually means.',
    bring: 'Nothing. Come and listen if you would rather.',
    qs: [
      'Do I need Physics if I want nursing rather than medicine?',
      'What aggregate should I be aiming at before I get my hopes up?',
      'Is volunteering at a health centre worth anything on an application?'
    ]
  },
  {
    id: 's-clinic',
    title: 'Past paper clinic: Biology and Chemistry',
    day: 'Wed',
    date: '16',
    when: 'Wednesday 16 September, 6:30 PM, one hour on Google Meet',
    dateText: 'Wednesday 16 September, 6:30 PM',
    length: 'One hour',
    platform: 'Google Meet',
    pod: 'Science and health pod',
    lead: 'raeka',
    hosted_by: 'raeka',
    seats: 20,
    taken: 11,
    stages: ['csec', 'special'],
    cat: 'Subject choice',
    what: 'Timed past paper work on the papers students are avoiding, with mentors who sat them.',
    bring: 'One past paper you already attempted, and the mark scheme if you have it.',
    qs: [
      'How do I rebuild after a failed mock without restarting the whole syllabus?',
      'Which topics show up every year in Biology paper 2?',
      'Can I sit Chemistry privately if my school dropped it?'
    ]
  },
  {
    id: 's-trades',
    title: 'GTTi, sites and keeping Maths',
    day: 'Thu',
    date: '18',
    when: 'Thursday 18 September, 6:00 PM, one hour on Google Meet',
    dateText: 'Thursday 18 September, 6:00 PM',
    length: 'One hour',
    platform: 'Google Meet',
    pod: 'Trades pod',
    lead: 'omar',
    hosted_by: 'omar',
    seats: 30,
    taken: 22,
    stages: ['subject', 'csec', 'fork'],
    cat: 'Building and fixing things',
    what: 'Compare CAPE stay-on with GTTi electrical routes, including cost, first jobs and what English still gates.',
    bring: 'What your family expects, honestly. Half the session is about that conversation.',
    qs: [
      'Will sites still take me if my English is weak?',
      'How do I find a licensed electrician who will actually teach on Saturdays?',
      'Is Industrial Technology enough without Physics?'
    ]
  },
  {
    id: 's-tech',
    title: 'Building proof before a credential',
    day: 'Sat',
    date: '20',
    when: 'Saturday 20 September, 4:00 PM, one hour on Google Meet',
    dateText: 'Saturday 20 September, 4:00 PM',
    length: 'One hour',
    platform: 'Google Meet',
    pod: 'Technology pod',
    lead: 'jerome',
    hosted_by: 'jerome',
    seats: 28,
    taken: 17,
    stages: ['explore', 'subject', 'csec'],
    cat: 'Technology',
    what: 'How to use STEMGuyana pods, Scratch and small shipped projects as evidence for CAPE and internships.',
    bring: 'A link or screenshot of anything you have built, even unfinished.',
    qs: [
      'Do I need CAPE Computer Science if I already have a portfolio?',
      'How do hinterland students join pods with weak internet?',
      'What does a good first project look like on a shared family laptop?'
    ]
  },
  {
    id: 's-sport',
    title: 'Sport pathways without a private academy',
    day: 'Sun',
    date: '21',
    when: 'Sunday 21 September, 5:30 PM, one hour on Google Meet',
    dateText: 'Sunday 21 September, 5:30 PM',
    length: 'One hour',
    platform: 'Google Meet',
    pod: 'Sport and coaching pod',
    lead: 'keisha',
    hosted_by: 'keisha',
    seats: 24,
    taken: 24,
    stages: ['explore', 'subject', 'csec', 'fork'],
    cat: 'Sport and coaching',
    what: 'Community leagues, PE subjects, travel funding and the paper trail that makes hinterland coaching look serious.',
    bring: 'Your training or session log if you have one, even if it is messy.',
    qs: [
      'What do I do if I miss regional trials because there is no transport?',
      'Is a first aid certificate worth doing before any coaching course?',
      'How do I ask for travel funding without sounding like I am begging?'
    ]
  },
  {
    id: 's-media',
    title: 'Making media look like real work',
    day: 'Tue',
    date: '23',
    when: 'Tuesday 23 September, 6:30 PM, one hour on Google Meet',
    dateText: 'Tuesday 23 September, 6:30 PM',
    length: 'One hour',
    platform: 'Google Meet',
    pod: 'Creative and media pod',
    lead: 'marcus',
    hosted_by: 'marcus',
    seats: 22,
    taken: 9,
    stages: ['subject', 'csec', 'fork'],
    cat: 'Creative and media',
    what: 'School reels, client-style shoots and delivery habits that change how adults talk about a creative route.',
    bring: 'One piece of work you finished on time, and one you did not.',
    qs: [
      'What proof should I collect if people say media is not a real career here?',
      'Do I need expensive gear to start?',
      'How do Mashramani and debate fit a film pathway?'
    ]
  },
  {
    id: 's-fork',
    title: 'After CSEC without a fight at home',
    day: 'Mon',
    date: '29',
    when: 'Monday 29 September, 6:30 PM, one hour on Google Meet',
    dateText: 'Monday 29 September, 6:30 PM',
    length: 'One hour',
    platform: 'Google Meet',
    pod: 'After CSEC pod',
    lead: 'omar',
    hosted_by: 'omar',
    seats: 30,
    taken: 19,
    stages: ['fork', 'special'],
    cat: 'After CSEC',
    what: 'Put CAPE, institute, work and mixed routes on one page with years, cost, first job and backup.',
    bring: 'A one-page comparison of both routes: years, cost, first job and backup.',
    qs: [
      'How do I show TVET is a plan and not giving up?',
      'Can I mix CAPE subjects with a part-time certificate?',
      'What entry list should I print before the family meeting?'
    ]
  }
];

var RES = {
  'opp-stem': { k: 'Opportunity', t: 'STEMGuyana learning pod', s: 'Free coding and robotics pods for ages 8 to 18 in several regions.', ref: 'stem' },
  'opp-pyarg': { k: 'Opportunity', t: "President's Youth Award", s: 'Non-competitive award from age 14. Bronze, Silver and Gold.', ref: 'pyarg' },
  'opp-cso': { k: 'Opportunity', t: 'Caribbean STEM Olympiads', s: 'Regional Maths, Coding and Robotics olympiads. Independent entry allowed.', ref: 'cso' },
  'opp-scratch': { k: 'Opportunity', t: 'National Scratch coding competition', s: 'Grades 1 to 10 build a Scratch animation on a set theme.', ref: 'scratch' },
  'opp-jof': { k: 'Opportunity', t: 'J.O.F. Haynes schools debating competition', s: 'National schools debate, entered through your school.', ref: 'jof' },
  'opp-mash': { k: 'Opportunity', t: "National Children's Mashramani competitions", s: 'Largest youth participation event in Guyana. District round is the entry.', ref: 'mash' },
  'opp-steam': { k: 'Opportunity', t: 'National STEAM fair', s: 'Biennial national fair. The regional fair is the real entry point.', ref: 'steam' },
  'opp-track': { k: 'Opportunity', t: 'National secondary schools track and field', s: 'Main national schools athletics meet, now in March.', ref: 'track' },
  'opp-blue': { k: 'Opportunity', t: 'Blue Ocean student entrepreneur competition', s: 'Fully virtual. Direct registration, no school sponsor required.', ref: 'blue' },
  'opp-sbb': { k: 'Opportunity', t: 'Tertiary entrepreneurship award', s: 'SBB award for TVET students. Training, a pitch, and grants.', ref: 'sbb' },
  'opp-clinic': { k: 'Opportunity', t: 'Weekly past paper clinic', s: 'Free after-school past paper sessions run by mentors who sat the papers.', ref: 'clinic' },
  'sess-s-sci': { k: 'Session', t: 'Pathways into medicine and health', s: 'Saturday 12 September, 5:00 PM', d: '12', dw: 'Sat', ref: 's-sci' },
  'sess-s-clinic': { k: 'Session', t: 'Past paper clinic: Biology and Chemistry', s: 'Wednesday 16 September, 6:30 PM', d: '16', dw: 'Wed', ref: 's-clinic' },
  'sess-s-trades': { k: 'Session', t: 'GTTi, sites and keeping Maths', s: 'Thursday 18 September, 6:00 PM', d: '18', dw: 'Thu', ref: 's-trades' },
  'sess-s-tech': { k: 'Session', t: 'Building proof before a credential', s: 'Saturday 20 September, 4:00 PM', d: '20', dw: 'Sat', ref: 's-tech' },
  'sess-s-sport': { k: 'Session', t: 'Sport pathways without a private academy', s: 'Sunday 21 September, 5:30 PM', d: '21', dw: 'Sun', ref: 's-sport' },
  'sess-s-media': { k: 'Session', t: 'Making media look like real work', s: 'Tuesday 23 September, 6:30 PM', d: '23', dw: 'Tue', ref: 's-media' },
  'sess-s-fork': { k: 'Session', t: 'After CSEC without a fight at home', s: 'Monday 29 September, 6:30 PM', d: '29', dw: 'Mon', ref: 's-fork' },
  'note-mock': { k: 'Note', t: 'Mocks are rehearsal, not judgment.', s: 'Rebuild from past papers the same week, not the same term.' },
  'note-tvet': { k: 'Note', t: 'Write both routes with years, cost and first job.', s: 'Name a certificate and a mentor on the trade side.' },
  'note-travel': { k: 'Note', t: 'Ask about travel funding before meet week.', s: 'A session log is evidence, not paperwork for its own sake.' },
  'note-pod': { k: 'Note', t: 'If your school has no club, the pod is the entry.', s: 'Keep a photo or short note of what you built.' },
  'note-self': { k: 'Note', t: 'If your school will not organise entry, register yourself.', s: 'Keep your project writeup. University apps ask for it.' }
};

var FEED = [
  {
    id: 'q-bio',
    kind: 'question',
    at: '2026-09-04T23:20:00-04:00',
    cat: 'Subject choice',
    anon: true,
    who: 'Form 3 student, Region 4',
    title: 'If I might want medicine later, do I have to keep Biology and Chemistry in Form 3?',
    body: 'If I might want medicine later, do I have to keep Biology and Chemistry in Form 3?',
    askedAt: 'Form 3',
    stage: 'subject',
    res: ['opp-clinic', 'sess-s-sci'],
    similar: ['q-cape', 'q-lethem'],
    asks: 3,
    replies: [
      { a: 'raeka', text: 'Keep both. Some schools let you add Chemistry back in Form 4 and some do not, and you usually find out too late to do anything about it.' },
      { a: 'omar', text: 'Same thinking on a trade path. Keep whichever subject closes the most doors if you drop it.' },
      { a: null, who: 'Form 5 student, Region 6', text: 'I dropped Chemistry in Form 3 and ended up sitting it privately. It cost me a year.' }
    ],
    rel: ['f3', 'f5'],
    opp: 'clinic',
    sess: 's-sci'
  },
  {
    id: 'f2',
    kind: 'opportunity',
    at: '2026-09-03T10:00:00-04:00',
    cat: 'Technology',
    author: 'jerome',
    opp: 'stem',
    stage: 'explore',
    res: ['sess-s-tech', 'sess-s-clinic', 'note-pod'],
    similar: ['cso', 'scratch'],
    text: 'STEMGuyana holiday pods are open for ages 8 to 18 in several regions. Coding, robotics and AI taster weeks, and there is no fee to join.'
  },
  {
    id: 'f-pyarg',
    kind: 'opportunity',
    at: '2026-09-05T09:00:00-04:00',
    cat: 'Sport and coaching',
    author: 'keisha',
    opp: 'pyarg',
    stage: 'explore',
    res: ['sess-s-sport', 'note-travel'],
    similar: ['track', 'clinic'],
    text: "President's Youth Award is open from age 14. Bronze, Silver and Gold over months of service, skill, sport and adventure."
  },
  {
    id: 'f3',
    kind: 'story',
    at: '2026-09-04T20:20:00-04:00',
    cat: 'Science and health',
    author: 'raeka',
    title: 'What I wish I had done the week after my first failed Biology mock.',
    body: [
      'I treated the mock like a verdict. I lost a week to embarrassment before I opened a past paper again.',
      'The rebuild was boring and it worked. Same topics, timed, marked against the scheme, then a short list of the three ideas I kept missing.',
      'If your mock goes badly, start that week. Waiting for the final term is how a weak paper becomes your aggregate.',
      'Mocks are rehearsal, not judgment. Rebuild from past papers the same week, not the same term. Ask a mentor which topics repeat before you reread the whole book.'
    ],
    stage: 'csec',
    res: ['opp-clinic', 'sess-s-clinic', 'note-mock'],
    similar: ['f7', 'f12'],
    insp: 18,
    rel: ['q-bio', 'f5'],
    opp: 'clinic',
    sess: 's-clinic',
    photos: [
      { url: 'assets/hero-crop-520.jpg', alt: 'Students at desks with past papers open during a clinic.', width: 520, height: 347 },
      { url: 'assets/hero-crop-760.jpg', alt: 'A mentor pointing at a worked Biology question on a page.', width: 760, height: 507 },
      { url: 'assets/hero-wide-1100.jpg', alt: 'A classroom in Georgetown with students rewriting a mock paper.', width: 1100, height: 619 }
    ],
    replies: [
      { a: 'keisha', text: 'Start the rebuild that week. I tell students the same thing after a bad PE assessment.' },
      { a: null, who: 'Form 5 student, Region 4', text: 'I waited until Christmas and the paper did not move.' }
    ]
  },
  {
    id: 'f4',
    kind: 'session',
    at: '2026-09-04T10:00:00-04:00',
    cat: 'Building and fixing things',
    session: 's-trades',
    stage: 'fork',
    res: ['opp-sbb', 'note-tvet'],
    similar: ['s-fork', 's-tech']
  },
  {
    id: 'f5',
    kind: 'journey',
    at: '2026-09-02T10:00:00-04:00',
    cat: 'Science and health',
    journey: 'raeka',
    author: 'raeka',
    stage: 'special',
    res: ['opp-clinic', 'sess-s-sci'],
    similar: ['omar', 'jerome']
  },
  {
    id: 'q-lethem',
    kind: 'question',
    at: '2026-08-31T10:00:00-04:00',
    cat: 'Sport and coaching',
    anon: true,
    who: 'Form 2 student, Region 9',
    title: 'There is no private academy in Lethem. How do I build a sport pathway that still looks serious?',
    body: 'There is no private academy in Lethem. How do I build a sport pathway that still looks serious?',
    askedAt: 'Form 2',
    stage: 'explore',
    res: ['opp-track', 'sess-s-sport'],
    similar: ['q-media', 'q-bio'],
    asks: 2,
    replies: [
      { a: 'keisha', text: 'Community leagues, PE subjects, a first aid certificate and a short coaching course. Travel funding is usually the real blocker, so ask about it early.' },
      { a: null, who: 'Form 4 student, Region 9', text: 'I kept a log of every match I helped run. That log is what got me into a regional coaching workshop.' }
    ],
    rel: ['f7', 'f12'],
    opp: 'track',
    sess: 's-sport'
  },
  {
    id: 'f7',
    kind: 'story',
    at: '2026-09-04T10:00:00-04:00',
    cat: 'Building and fixing things',
    author: 'omar',
    title: 'How I stopped the CAPE versus GTTi argument at home.',
    body: [
      'My parents heard electrical work as giving up. I heard CAPE as two more years with no tool in my hand.',
      'I put both plans on one page. Years, cost, first job, and what happens if it does not work out. I named a certificate and a licensed mentor on the trade side.',
      'The fight got quieter when the page was specific. TVET stops sounding like a leftover once the route has names on it.',
      'Write both routes with years, cost and first job. Name a certificate and a mentor on the trade side. Keep Maths and English even when the work is with your hands.'
    ],
    stage: 'fork',
    res: ['opp-sbb', 'sess-s-fork', 'note-tvet'],
    similar: ['f3', 'f12'],
    insp: 27,
    rel: ['q-cape', 'f9'],
    opp: 'sbb',
    sess: 's-fork',
    link: {
      url: 'https://www.gtti.edu.gy',
      host: 'gtti.edu.gy',
      title: 'Government Technical Institute',
      description: 'Electrical and technical programmes after CSEC, with named certificates and workshop hours.'
    }
  },
  {
    id: 'q-cape',
    kind: 'question',
    at: '2026-08-29T10:00:00-04:00',
    cat: 'After CSEC',
    anon: true,
    who: 'Form 5 student, Region 4',
    title: 'My parents want CAPE. I want GTTi electrical after CSEC. How do we decide without it turning into a fight?',
    body: 'My parents want CAPE. I want GTTi electrical after CSEC. How do we decide without it turning into a fight?',
    askedAt: 'Form 5',
    stage: 'fork',
    res: ['opp-sbb', 'sess-s-fork'],
    similar: ['q-bio', 'q-media'],
    asks: 2,
    replies: [
      { a: 'omar', text: 'Put both plans on one page. Years, cost, first job, and what happens if it does not work out. TVET stops sounding like giving up once a certificate and a mentor are named.' },
      { a: 'raeka', text: 'Staying is right for some gates. Pull the actual entry list for the programme you want and compare it against the other one.' }
    ],
    rel: ['f7', 'f9'],
    opp: 'sbb',
    sess: 's-fork'
  },
  {
    id: 'f9',
    kind: 'journey',
    at: '2026-09-01T10:00:00-04:00',
    cat: 'Building and fixing things',
    journey: 'omar',
    author: 'omar',
    stage: 'fork',
    res: ['opp-sbb', 'sess-s-trades'],
    similar: ['raeka', 'keisha']
  },
  {
    id: 'f10',
    kind: 'opportunity',
    at: '2026-09-02T10:00:00-04:00',
    cat: 'Technology',
    author: 'jerome',
    opp: 'cso',
    stage: 'csec',
    res: ['sess-s-tech', 'note-self'],
    similar: ['stem', 'scratch'],
    text: 'Caribbean STEM Olympiads accept independent competitors. If your school will not organise a team, you can still enter.'
  },
  {
    id: 'q-media',
    kind: 'question',
    at: '2026-09-01T10:00:00-04:00',
    cat: 'Creative and media',
    anon: true,
    who: 'Form 4 student, Region 3',
    title: 'People keep telling me media is not a real career in Guyana. What proof should I be collecting?',
    body: 'People keep telling me media is not a real career in Guyana. What proof should I be collecting?',
    askedAt: 'Form 4',
    stage: 'csec',
    res: ['opp-mash', 'sess-s-media'],
    similar: ['q-lethem', 'q-cape'],
    asks: 2,
    replies: [
      { a: 'marcus', text: 'A weekly school reel, three shoots run like client work, and everything delivered on time. Show the work instead of arguing for it.' },
      { a: null, who: 'Form 5 student, Region 4', text: 'Delivering on time is what changed how adults spoke to me about it.' }
    ],
    rel: ['f12', 'f16'],
    opp: 'mash',
    sess: 's-media'
  },
  {
    id: 'f12',
    kind: 'story',
    at: '2026-08-30T10:00:00-04:00',
    cat: 'Sport and coaching',
    author: 'keisha',
    title: 'The week I missed regional trials, and what the log fixed later.',
    body: [
      'There was no transport that week from Lethem. I missed the trials and spent two days convinced the route had closed.',
      'I kept training the younger students and writing every session in the same exercise book I had started at thirteen.',
      'Months later that written log is what got me funded to a regional coaching workshop. The absence still hurt. The paper trail is what travelled.',
      'Ask about travel funding before meet week. A session log is evidence, not paperwork for its own sake. Missing one trial is a setback, not the end of a hinterland route.'
    ],
    stage: 'csec',
    res: ['opp-track', 'sess-s-sport', 'note-travel'],
    similar: ['f3', 'f7'],
    insp: 31,
    rel: ['q-lethem', 'f15'],
    opp: 'track',
    sess: 's-sport',
    photos: [
      { url: 'assets/hero-wide-1600.jpg', alt: 'A community sports field in the late afternoon, with students still training.', width: 1600, height: 900 }
    ]
  },
  {
    id: 'f13',
    kind: 'session',
    at: '2026-09-03T10:00:00-04:00',
    cat: 'Sport and coaching',
    session: 's-sport',
    stage: 'csec',
    res: ['opp-track', 'note-travel'],
    similar: ['s-sci', 's-media']
  },
  {
    id: 'f14',
    kind: 'opportunity',
    at: '2026-08-30T10:00:00-04:00',
    cat: 'Business',
    author: 'omar',
    opp: 'blue',
    stage: 'subject',
    res: ['sess-s-fork', 'opp-sbb'],
    similar: ['sbb', 'pyarg'],
    text: 'Blue Ocean is fully virtual and open to Guyanese secondary students with direct registration. No school sponsor required.'
  },
  {
    id: 'f15',
    kind: 'journey',
    at: '2026-08-31T10:00:00-04:00',
    cat: 'Sport and coaching',
    journey: 'keisha',
    author: 'keisha',
    stage: 'csec',
    res: ['opp-track', 'sess-s-sport'],
    similar: ['omar', 'raeka']
  },
  {
    id: 'f16',
    kind: 'journey',
    at: '2026-08-29T10:00:00-04:00',
    cat: 'Technology',
    journey: 'jerome',
    author: 'jerome',
    stage: 'explore',
    res: ['opp-stem', 'sess-s-tech'],
    similar: ['raeka', 'omar']
  }
];


var CAREER_FILTERS = [
  'Science and health',
  'Technology',
  'Trades and technical',
  'Business',
  'Creative and media',
  'Law and public service',
  'Sport and coaching',
  'Education'
];

var PEOPLE = {
  raeka: {
    name: 'Raeka Persaud',
    role: 'mentor',
    verified: true,
    contactable: true,
    av: 'av-1',
    career: 'Science and health',
    title: 'Junior doctor, Georgetown Public Hospital',
    region: 'Region 4',
    arch: 'investigator',
    about:
      'I treated my first failed Biology mock like a verdict and lost a week before I opened a past paper again. The rebuild was boring and it worked. I kept Biology and Chemistry because those are the gates I actually needed, and I still mentor CSEC science students on weekends at Georgetown Public Hospital.',
    posts: [
      { kind: 'story', id: 'f3' },
      { kind: 'journey', id: 'raeka' },
      { kind: 'session', id: 's-sci' },
      { kind: 'session', id: 's-clinic' }
    ]
  },
  omar: {
    name: 'Omar Khan',
    role: 'mentor',
    verified: true,
    contactable: true,
    av: 'av-2',
    career: 'Trades and technical',
    title: 'Electrician and site supervisor, Berbice',
    region: 'Region 6',
    arch: 'builder',
    about:
      'My parents heard electrical work as giving up. I put both plans on one page, years, cost, first job, and a licensed mentor on the trade side. A certificate is a door. Your hands are what walk you through it.',
    posts: [
      { kind: 'story', id: 'f7' },
      { kind: 'journey', id: 'omar' },
      { kind: 'session', id: 's-trades' },
      { kind: 'session', id: 's-fork' }
    ]
  },
  jerome: {
    name: 'Jerome DaSilva',
    role: 'contributor',
    verified: false,
    contactable: false,
    av: 'av-3',
    career: 'Technology',
    title: 'Software developer, Georgetown',
    region: 'Region 4',
    arch: 'builder',
    about:
      'I shipped small things before I waited for perfect, starting with a simple page on a shared family laptop. I still run a weekend coding circle for secondary students in Georgetown. One small project beats ten unread tutorials.',
    posts: [
      { kind: 'journey', id: 'jerome' },
      { kind: 'session', id: 's-tech' }
    ]
  },
  keisha: {
    name: 'Keisha Daniels',
    role: 'mentor',
    verified: true,
    contactable: true,
    av: 'av-4',
    career: 'Sport and coaching',
    title: 'Community coach and PE teacher, Lethem',
    region: 'Region 9',
    arch: 'organiser',
    about:
      'If nothing is organised where you live, write down what you do until someone can fund the next step. I missed regional trials because there was no transport from Lethem. The session log is what travelled.',
    posts: [
      { kind: 'story', id: 'f12' },
      { kind: 'journey', id: 'keisha' },
      { kind: 'session', id: 's-sport' }
    ]
  },
  marcus: {
    name: 'Marcus Gomes',
    role: 'contributor',
    verified: false,
    contactable: false,
    av: 'av-5',
    career: 'Creative and media',
    title: 'Videographer, Georgetown',
    region: 'Region 4',
    arch: 'storyteller',
    about:
      'Show the work instead of arguing for it. A weekly school reel, three shoots run like client work, and everything delivered on time. That is the proof I tell students to collect.',
    posts: [{ kind: 'session', id: 's-media' }]
  }
};

var SLOTS = [
  { k: 'sport', t: 'A sport', hint: 'Team, club or community league you actually train with.' },
  { k: 'instrument', t: 'An instrument', hint: 'School steel pan, choir instrument, or whatever your music room already has.' },
  { k: 'tvet', t: 'A TVET subject', hint: 'Industrial Technology, EDPM, or another technical subject your school runs.' },
  { k: 'volunteer', t: 'Volunteering', hint: 'Church group, community service, or PYARG service hours with a log.' },
  { k: 'language', t: 'A foreign language', hint: 'Spanish or another language subject, kept long enough to use.' }
];

/* CAREERSV3:BEGIN */
var BUCKETS = {
  "science": {
    "explore": "Use science clubs, health fairs, first-aid activities, laboratory demonstrations and careful observation of health and environmental work. Protect strong English and Mathematics foundations.",
    "csec": "English A, Mathematics, Biology, Chemistry, Physics or Integrated Science; Human and Social Biology is useful for many care routes but is not accepted as a substitute for Biology by every programme.",
    "cape": "Biology, Chemistry, Physics, Pure or Applied Mathematics, Environmental Science, Food and Nutrition and Communication Studies, depending on the intended programme.",
    "after": "UG science/health programmes, Ministry of Health training, approved regional programmes, supervised clinical training and professional registration where required."
  },
  "trade": {
    "explore": "Try practical projects safely, learn measurement and tool care, practise numeracy, join school TVET activities and observe qualified workers. Never substitute unsafe informal work for supervised training.",
    "csec": "English A and Mathematics plus the most relevant technical subject: Industrial Technology, Technical Drawing, Information Technology, EDPM, Agricultural Science, Home Economics, Food and Nutrition or an available CVQ/SCCP occupational area.",
    "cape": "CAPE is not required for many direct TVET routes. Useful options include Building and Mechanical Engineering, Electrical and Electronic Engineering Technology, Design and Technology, Green Engineering, Entrepreneurship and Management of Business.",
    "after": "School CVQ/SCCP, BIT, practical instruction centres, technical institutes, Carnegie, GSA, apprenticeship, employer training and competency/licensing routes."
  },
  "education": {
    "explore": "Tutor peers, read widely, practise presentations, volunteer with supervised youth activities and note whether the student enjoys explaining, planning and supporting learning.",
    "csec": "English A, Mathematics, Information Technology and strong passes in the subject areas the student may later teach. Social Studies, Human and Social Biology and a modern language can be useful.",
    "cape": "Communication Studies, Caribbean Studies and the academic subjects to be taught; Sociology, Literatures in English, History, Mathematics, sciences and Information Technology may support specialisations.",
    "after": "CPCE teacher education, UG education/humanities routes, specialist training and supervised teaching or education-support roles."
  },
  "sports": {
    "explore": "Play more than one sport, learn rules and injury prevention, maintain academics, record verified results and develop teamwork rather than specialising too early.",
    "csec": "English A, Mathematics, Physical Education and Sport, Biology or Human and Social Biology, Information Technology and Principles of Business.",
    "cape": "Physical Education and Sport, Biology, Communication Studies, Caribbean Studies, Entrepreneurship or Management of Business.",
    "after": "Club and federation pathways, coaching/officiating credentials, sport administration, tertiary study and health-science routes for sports medicine and rehabilitation."
  },
  "engineering": {
    "explore": "Build and test small projects, practise measurement and drawing, strengthen algebra and science, learn safe workshop behaviour and join robotics, CAD or problem-solving activities where available.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure and/or Applied Mathematics, Physics, Chemistry, Building and Mechanical Engineering, Electrical and Electronic Engineering Technology, Green Engineering, Design and Technology or Computer Science.",
    "after": "UG engineering/built-environment routes, technical institutes, GTEE/CVQ pathways, approved aviation/maritime training and profession-specific experience or registration."
  },
  "creative": {
    "explore": "Make original work, keep dated drafts, learn copyright and consent, perform or exhibit safely, practise communication and begin a portfolio without abandoning core academics.",
    "csec": "English A, Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business, selected according to the medium.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies, Entrepreneurship or Information Technology.",
    "after": "Portfolio-based work, apprenticeships, CVQ/TVET production routes, UG communication/technology studies, specialist regional study and entrepreneurship."
  },
  "tech": {
    "explore": "Learn safe and responsible computing, build small programs or digital projects, understand privacy and security, practise logical thinking and document work in a portfolio.",
    "csec": "English A, Mathematics, Information Technology, Physics, EDPM and Additional Mathematics where available.",
    "cape": "Computer Science, Information Technology, Pure or Applied Mathematics, Physics, Digital Media, Animation and Game Design or Electrical and Electronic Engineering Technology.",
    "after": "UG computer-science/IT/information-systems routes, technical institutes, vendor training, portfolios, internships and progressively responsible technical work."
  },
  "business": {
    "explore": "Practise budgeting, spreadsheets, selling ethically, teamwork, record-keeping and public speaking. Run small supervised projects rather than taking financial risks.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations, Law, Information Technology and Communication Studies.",
    "after": "UG SEBI and social-science routes, technical/business diplomas, employer apprenticeships, professional qualifications and responsible entrepreneurship."
  },
  "public": {
    "explore": "Join service, debate, student leadership, cadet or community activities; build fitness where relevant; learn civics, ethics, teamwork and accurate record-keeping.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology, Physical Education and a modern language, depending on the role.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology and relevant sciences.",
    "after": "Vacancy-specific government recruitment, UG/CPCE/technical qualifications, uniformed-service selection and training, or public-policy and community-development routes."
  },
  "law": {
    "explore": "Read widely, write evidence-based arguments, debate respectfully, learn source checking and observe civic, cultural and community institutions.",
    "csec": "English A, English B, Caribbean History, Social Studies, Geography, Religious Education, Economics and a modern language. Mathematics remains valuable even where it is not a formal entry requirement.",
    "cape": "Law, Communication Studies, Caribbean Studies, History, Sociology, Literatures in English, Economics, Geography and modern languages.",
    "after": "UG law, social-science and humanities routes, regional professional education, public-service recruitment, research, communication and community work."
  },
  "agri": {
    "explore": "Grow or monitor a small supervised project, record inputs and results, learn soil/water/animal welfare basics, visit farms or agroprocessors and treat agriculture as science plus business.",
    "csec": "English A, Mathematics, Agricultural Science, Biology, Chemistry or Integrated Science, Geography, Food and Nutrition and Principles of Business.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition, Entrepreneurship, Green Engineering and Communication Studies.",
    "after": "GSA, UG agriculture/forestry/science routes, school CVQ, BIT/TVET, farm or fisheries training, research/extension work and agribusiness."
  }
};

var CAREERS = [
  {
    "n": "Accountant / Auditor",
    "s": "confirmed",
    "b": [
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available. English, Mathematics, Principles of Accounts, Economics and business subjects.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "BSc Accountancy or related SEBI route, followed where desired by ACCA or another recognised professional qualification. The Institute of Chartered Accountants of Guyana admits qualified members of recognised overseas accountancy bodies; Guyana does not operate a separate local chartered-accountant examination.",
    "gate": "",
    "dev": "UG's accountancy programme received ACCA accreditation for 2026,2030, with four exemptions reported for qualifying graduates from 2026.",
    "jobs": "accounts assistant, audit associate, tax assistant, finance officer and internal-audit trainee.",
    "src": "https://sebi.uog.edu.gy/srms/departments/246/programmes/865/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Actuary / Statistician / Quantitative-Risk Analyst",
    "s": "varies",
    "b": [
      "science",
      "tech",
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "Mathematics, Statistics, Economics, Finance, Computer Science or Accountancy provide relevant foundations. Actuarial practice normally adds staged examinations from a recognised international professional body; a complete local actuarial-qualification ladder was not confirmed. UG lists Mathematics/Physics/Statistics and business/economics departments.",
    "gate": "",
    "dev": "",
    "jobs": "statistical assistant, risk analyst trainee, insurance analyst, data analyst and research assistant.",
    "src": "https://registry.uog.edu.gy/srms/departments",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Agricultural Engineer / Smart-Farming Technician",
    "s": "varies",
    "b": [
      "trade",
      "engineering",
      "tech",
      "agri"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "combine agriculture with mechanical/electrical engineering, agricultural machinery, irrigation, sensors, GIS or data. A current local degree titled Agricultural Engineering was not confirmed; students can begin through GSA/UG agriculture, engineering or TVET and specialise regionally or through employer training.",
    "gate": "",
    "dev": "",
    "jobs": "irrigation assistant, machinery/precision-agriculture technician, farm-technology assistant and engineering trainee.",
    "src": "https://agriculture.gov.gy/gsa/",
    "tr": [
      "degree",
      "tvet",
      "agri"
    ]
  },
  {
    "n": "Agricultural Scientist / Agronomist",
    "s": "confirmed",
    "b": [
      "science",
      "agri"
    ],
    "f13": "Use a supervised crop, livestock, fisheries or environmental project to practise measurement, record-keeping, science and business thinking.",
    "csec": "English A, Mathematics, Agricultural Science, Biology, Chemistry or Integrated Science, Geography and Principles of Business.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship.",
    "route": "UG's BSc Agriculture accepts five CSEC subjects including English and Mathematics plus the published science combination. Guyana School of Agriculture offers certificate/diploma routes with different entry requirements and may provide an articulation route. First jobs include extension, crop/livestock production, research assistance, quality assurance and agribusiness.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://registry.uog.edu.gy/srms/departments/60/programmes/772/details",
    "tr": [
      "degree",
      "agri"
    ]
  },
  {
    "n": "Agroprocessing / Food-Production Operator",
    "s": "confirmed",
    "b": [
      "trade",
      "business",
      "agri"
    ],
    "f13": "Use a supervised crop, livestock, fisheries or environmental project to practise measurement, record-keeping, science and business thinking.",
    "csec": "English A, Mathematics, Agricultural Science, Biology, Chemistry or Integrated Science, Geography and Principles of Business. Agricultural Science, Food and Nutrition, Chemistry, Mathematics and business subjects.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship.",
    "route": "school CVQ Agro-processing, Commercial Food Preparation, TVET, GSA or supervised production.",
    "gate": "",
    "dev": "",
    "jobs": "processing/packaging operator, production assistant, quality assistant and small food-business operator.",
    "src": "https://education.gov.gy/en/index.php/media2/news-events/7312-vocational-education-deserves-equal-respect",
    "tr": [
      "tvet",
      "agri"
    ]
  },
  {
    "n": "Agroprocessor / Food-Production Technician",
    "s": "confirmed",
    "b": [
      "science",
      "trade",
      "business",
      "agri"
    ],
    "f13": "practise food safety, measurement, record-keeping, Agriculture and small-enterprise projects.",
    "csec": "Agricultural Science, Food and Nutrition, Chemistry, Mathematics, Principles of Accounts/Business and CVQ Agro-processing or Commercial Food Preparation are useful. School CVQ offerings have included agro-processing and commercial food preparation.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship.",
    "route": "routes include CVQ/TVET, Guyana School of Agriculture, UG Food Science or supervised production experience. Food businesses must also meet registration, hygiene, labelling and food-safety rules.",
    "gate": "",
    "dev": "",
    "jobs": "production assistant, quality-control assistant, food-processing technician, packaging operator and small agroprocessing entrepreneur.",
    "src": "https://education.gov.gy/en/index.php/media2/news-events/7312-vocational-education-deserves-equal-respect",
    "tr": [
      "degree",
      "tvet",
      "agri"
    ]
  },
  {
    "n": "Air-Traffic Controller",
    "s": "confirmed",
    "b": [
      "engineering",
      "tech",
      "public"
    ],
    "f13": "strengthen Mathematics, Geography, science, English, concentration and calm decision-making.",
    "csec": "",
    "cape": "",
    "route": "the GCAA publishes a minimum licensing age of 21, completion of approved training, supervised operational experience and a Class 3 medical assessment. Guyana's Civil Aviation Training School trains ATC and aviation personnel and attained ICAO TRAINAIR PLUS Gold Standard status in 2026, but vacancies and trainee intakes are competitive and not continuously open.",
    "gate": "the GCAA publishes a minimum licensing age of 21, completion of approved training, supervised operational experience and a Class 3 medical assessment.",
    "dev": "",
    "jobs": "",
    "src": "https://www.gcaa-gy.org/licensing-and-certification.html",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Aircraft Maintenance / Aeronautical Engineering",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering",
      "tech"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "Air Services Limited reports a GCAA-approved maintenance organisation and an aeronautical engineering school; the Art Williams and Harry Wendt school has historically offered local aircraft-maintenance education. Confirm current admissions, accreditation scope and whether a programme leads to an academic award, a GCAA maintenance licence, or both.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Appliance / Consumer-Electronics Repair Technician",
    "s": "varies",
    "b": [
      "trade",
      "tech"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "Useful foundations include Mathematics, Physics, Electronics, IT, soldering and safe troubleshooting. BIT/private-provider availability varies. First jobs include electronics-repair assistant, appliance technician trainee and phone/device-repair worker. Electrical isolation, batteries and data privacy should be included.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Aquaculture / Fish-Handling and Processing Worker",
    "s": "confirmed",
    "b": [
      "science",
      "trade",
      "agri"
    ],
    "f13": "Use a supervised crop, livestock, fisheries or environmental project to practise measurement, record-keeping, science and business thinking.",
    "csec": "English A, Mathematics, Agricultural Science, Biology, Chemistry or Integrated Science, Geography and Principles of Business. Biology, Agricultural Science, Geography, Mathematics and Food and Nutrition.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship.",
    "route": "school CVQ aquaculture/fish handling, fisheries or agricultural training and supervised sector experience.",
    "gate": "",
    "dev": "",
    "jobs": "aquaculture/farm assistant, fish-processing worker, cold-chain/quality assistant and fisheries data assistant.",
    "src": "https://education.gov.gy/en/index.php/media2/external-news/5695-aquaculture-training-empowers-teachers-to-prepare-students-for-work-2",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Architect",
    "s": "confirmed",
    "b": [
      "engineering",
      "tech"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "UG's BSc Architecture ordinarily requires a Diploma or Associate qualification in Architectural and Building Technology, including the published design/GPA requirements, or an accepted technical qualification and portfolio route. The Associate programme is the principal CSEC-entry pathway.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://registry.uog.edu.gy/srms/departments/70/programmes/905/details",
    "tr": [
      "degree",
      "port"
    ]
  },
  {
    "n": "Audio Production / Event Production Professional",
    "s": "portfolio",
    "b": [
      "creative",
      "tech",
      "business"
    ],
    "f13": "explore music, drama, public speaking, school events, basic audio/video editing and safe equipment handling.",
    "csec": "Music, Theatre Arts, Visual Arts, English, IT, Physics and business subjects can all contribute. Build a portfolio through school concerts, assemblies, podcasts, recordings or community events.",
    "cape": "",
    "route": "Communication Studies, music/performing-arts education, technical short courses, apprenticeship with production teams and business/event-management training are relevant. Government-supported training has included events management, but availability changes by programme and year.",
    "gate": "",
    "dev": "",
    "jobs": "production assistant, stagehand, sound assistant, lighting assistant, event coordinator and freelance audio editor.",
    "src": "https://education.gov.gy/en/index.php/media2/external-news/7262-ug-facilities-fees-abolished-january-2025-min-manickchand",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Auto-Electrical / Vehicle-Electronics Technician",
    "s": "varies",
    "b": [
      "trade",
      "engineering",
      "tech"
    ],
    "f13": "Develop numeracy, measurement, tool safety, practical problem-solving and supervised project experience.",
    "csec": "English A, Mathematics and the most relevant technical, CVQ, SCCP, science, drawing, IT or home-economics subjects available at the school.",
    "cape": "CAPE is optional for many direct vocational routes; relevant engineering, design, technology, business or entrepreneurship subjects can support progression.",
    "route": "Start with electrical/electronic and automotive foundations, then add batteries, charging/starting systems, sensors, diagnostics and safe hybrid/EV procedures. Training availability varies by provider. First jobs include auto-electrician assistant and diagnostic technician trainee; general mechanic training should not be presented as full auto-electrical competence.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Automotive Mechanic / Motor-Vehicle Technician",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject. Mathematics, Physics, Mechanical Technology, Electrical Technology, IT and English.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "Motor Vehicle Repairs/Engine Systems through TVET institutes, BIT or workshop apprenticeship.",
    "gate": "",
    "dev": "",
    "jobs": "workshop assistant, service technician trainee and motor-vehicle mechanic. Light vehicle, diesel, diagnostics and heavy equipment are different competency tracks.",
    "src": "https://tvet.gov.gy/programs?institution=74",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Banker / Banking Operations",
    "s": "confirmed",
    "b": [
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available. English, Mathematics, Principles of Accounts, Principles of Business and Economics.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "UG SEBI programmes in Accountancy, Finance or Management; Diploma in Banking and Finance; or Republic Bank's Youth Link apprenticeship when an intake is advertised. SEBI degree entry generally uses five CSEC subjects including English and Mathematics.",
    "gate": "",
    "dev": "",
    "jobs": "bank teller, customer-service representative, credit assistant, operations clerk, analyst trainee and apprenticeship placements.",
    "src": "https://sebi.uog.edu.gy/sebi-glance",
    "tr": [
      "degree",
      "tvet"
    ]
  },
  {
    "n": "Biomedical-Equipment / Medical-Technology Technician",
    "s": "varies",
    "b": [
      "science",
      "trade",
      "engineering",
      "tech"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "build from electrical/electronic engineering, instrumentation, IT support or medical-technology training, followed by equipment-specific supervised training. A distinct current local school-leaver biomedical-engineering degree was not confirmed; do not treat general electronics training as automatic authority to service regulated medical devices.",
    "gate": "",
    "dev": "",
    "jobs": "biomedical-equipment assistant, maintenance trainee, calibration/support assistant and hospital technology-support worker.",
    "src": "https://registry.uog.edu.gy/engineering-technology",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Boat Master / Local Seafarer",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering"
    ],
    "f13": "Develop numeracy, measurement, tool safety, practical problem-solving and supervised project experience.",
    "csec": "English A, Mathematics and the most relevant technical, CVQ, SCCP, science, drawing, IT or home-economics subjects available at the school.",
    "cape": "CAPE is optional for many direct vocational routes; relevant engineering, design, technology, business or entrepreneurship subjects can support progression.",
    "route": "MARAD licenses and certifies local seafarers and publishes forms/checklists for Bowman/Bow-Woman credentials, Harbour licences, River Master/Navigation certificates and Boat Master Grades 1,3, among other categories. Exact sea-service, medical, training, examination, fee and nationality requirements vary by licence and must come from the corresponding current checklist.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://marad.gov.gy/seafarer-licensing",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Caregiver / Childcare or Patient-Care Worker",
    "s": "confirmed",
    "b": [
      "science",
      "trade",
      "education"
    ],
    "f13": "develop empathy, communication, responsibility, hygiene, first-aid awareness and child/elder safety.",
    "csec": "Human and Social Biology, Food and Nutrition, Social Studies, English and Family and Resource Management are useful. Safeguarding and practical competence matter as much as subjects.",
    "cape": "Communication Studies, Caribbean Studies and the academic subjects connected to the intended teaching specialisation.",
    "route": "the Ministry of Health currently lists a three-month Patient Care Assistant route requiring a sound secondary education. Other childcare, elder-care and home-care programmes may be offered through WIIN, BIT or approved providers; verify the current credential and whether the role is regulated.",
    "gate": "",
    "dev": "",
    "jobs": "patient-care assistant, home-care aide, nursery/childcare assistant and elder-care worker.",
    "src": "https://health.gov.gy/training-opportunities/",
    "tr": [
      "tvet",
      "health"
    ]
  },
  {
    "n": "Carpenter / Joiner / Cabinetmaker",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering",
      "creative"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject. Mathematics, Technical Drawing, Building Technology, Visual Arts and English.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "Carpentry, Furniture Making, Furniture Finishing and related CVQ/technical programmes, BIT or apprenticeship.",
    "gate": "",
    "dev": "",
    "jobs": "carpenter's assistant, joiner, cabinet/furniture-production worker and installation assistant.",
    "src": "https://tvet.gov.gy/programs",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Chef / Culinary Professional",
    "s": "confirmed",
    "b": [
      "trade",
      "creative",
      "business"
    ],
    "f13": "Practise food safety, measurement, costing and supervised preparation; document recipes and service projects without using unsafe equipment unsupervised.",
    "csec": "English A, Mathematics, Food and Nutrition, Family and Resource Management, Integrated Science and Principles of Business.",
    "cape": "Food and Nutrition, Entrepreneurship, Management of Business and Communication Studies; CAPE is optional for many direct culinary/TVET routes.",
    "route": "Carnegie School of Home Economics offers a two-year Diploma in Catering and Hospitality with practical restaurant and work-attachment components. The current intake must confirm fees and availability; private and employer-based alternatives should be compared by accreditation, cost and work placement.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://carnegieguyana.com/programme/catering-and-hospitality/",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Chemical / Process Engineer",
    "s": "varies",
    "b": [
      "science",
      "engineering",
      "tech"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "a current local undergraduate programme titled Chemical Engineering was not confirmed. Strong local foundations include Chemistry, engineering, industrial technology and process/production training, followed where necessary by an accredited regional or international chemical/process-engineering degree. Use the current UG and TVET programme lists rather than treating an adjacent qualification as the same profession.",
    "gate": "",
    "dev": "",
    "jobs": "laboratory/process assistant, production technician and quality assistant; professional engineering work requires appropriate degree-level preparation and experience.",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree",
      "tvet"
    ]
  },
  {
    "n": "Civil / Public Servant",
    "s": "varies",
    "b": [
      "public",
      "law"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences. There is no universal “five CSEC subjects” rule for every government job.",
    "route": "There is no universal “five CSEC subjects” rule for every government job. Clerical, technical, professional, administrative and senior roles carry different vacancy-specific requirements. Use official ministry, agency and National Job Bank advertisements as the controlling source. Scholarships may include service obligations, but a bond must be verified from the actual award terms.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Civil, Mechanical and Electrical Engineer",
    "s": "confirmed",
    "b": [
      "engineering",
      "tech"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects. UG now publishes programme-specific direct-entry bachelor's routes.",
    "route": "UG now publishes programme-specific direct-entry bachelor's routes. Civil Engineering requires five CSEC subjects including English, Mathematics and Physics; Mechanical publishes English, Mathematics and Physics or Chemistry among its core routes; Electrical has its own subject combinations. Generic older UG pages still describe diploma-first structures, so the specific current programme page controls.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://uog.edu.gy/srms/departments/71/programmes/1180/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Cloud, Systems, Database or Network Administrator",
    "s": "confirmed",
    "b": [
      "tech",
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "UG Computer Science, Information Technology and Information Systems include foundations for databases, networks and systems; technical-institute and vendor routes can support entry. UG's current computing entry page uses five CSEC subjects including English and Mathematics, with an IT/EDPM bridging provision for students without those subjects.",
    "gate": "",
    "dev": "",
    "jobs": "help-desk technician, network assistant, systems-support technician, database assistant and cloud-support trainee.",
    "src": "https://registry.uog.edu.gy/srms/departments/7/programmes/805/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Coach, Official and Sports Administrator",
    "s": "varies",
    "b": [
      "education",
      "sports",
      "business"
    ],
    "f13": "Develop safely in more than one activity, record verified performance, learn rules and injury prevention, and protect academic options.",
    "csec": "English A, Mathematics, Physical Education and Sport, Biology or Human and Social Biology, Information Technology and Principles of Business.",
    "cape": "Physical Education and Sport, Biology, Communication Studies, Entrepreneurship or Management of Business. These are distinct careers.",
    "route": "These are distinct careers. Coaching and officiating generally require sport-specific association certifications and safeguarding training; administration may use business, events, communications or sport-management education. Former-athlete status is helpful but not universally required.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Content Creator / Digital-Media Entrepreneur",
    "s": "portfolio",
    "b": [
      "creative",
      "tech",
      "business"
    ],
    "f13": "Build safe, documented digital projects; practise logic, mathematics, typing, privacy and responsible use of technology.",
    "csec": "English A, Mathematics, Information Technology, EDPM, Physics and Additional Mathematics where available.",
    "cape": "Computer Science, Information Technology, Pure or Applied Mathematics, Physics and Digital Media. There is no formal licence or mandatory qualification.",
    "route": "There is no formal licence or mandatory qualification. The pathway is audience development, consistent production, platform literacy, commercial agreements, tax compliance and brand safety. Do not imply that popularity or income is predictable.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Cook / Baker / Pastry or Commercial-Food Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "creative",
      "business"
    ],
    "f13": "Practise food safety, measurement, costing and supervised preparation; document recipes and service projects without using unsafe equipment unsupervised.",
    "csec": "English A, Mathematics, Food and Nutrition, Family and Resource Management, Integrated Science and Principles of Business. Food and Nutrition, Mathematics, English, business subjects and science.",
    "cape": "Food and Nutrition, Entrepreneurship, Management of Business and Communication Studies; CAPE is optional for many direct culinary/TVET routes.",
    "route": "CVQ Commercial Food Preparation, cookery, pastry, Carnegie, practical centres or employer training.",
    "gate": "",
    "dev": "",
    "jobs": "kitchen assistant, cook, baker/pastry assistant, catering assistant and food-service worker. Chef is normally an experience-based progression.",
    "src": "https://tvet.gov.gy/programs?institution=71",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Cosmetologist / Beautician / Wellness Services",
    "s": "varies",
    "b": [
      "trade",
      "creative",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship. Carnegie, BIT and other approved providers may offer cosmetology training.",
    "route": "Carnegie, BIT and other approved providers may offer cosmetology training. Confirm the current provider, course length, credential, sanitation requirements and fees. Separate cosmetology, barbering, nail technology, skincare and spa services in the taxonomy; many lead to self-employment rather than salaried placement.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Cosmetologist / Hair or Beauty-Service Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "creative",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "Current TVET listings include General Cosmetology, Hair Styling and Hair Braiding/Weaving. Other routes include BIT and approved private providers. First work includes salon assistant, stylist/braider, nail/beauty-service trainee and self-employment. Hygiene, chemical safety and business registration must be included.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://tvet.gov.gy/programs?institution=71",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Cricketer",
    "s": "portfolio",
    "b": [
      "sports"
    ],
    "f13": "Develop safely in more than one activity, record verified performance, learn rules and injury prevention, and protect academic options.",
    "csec": "English A, Mathematics, Physical Education and Sport, Biology or Human and Social Biology, Information Technology and Principles of Business.",
    "cape": "Physical Education and Sport, Biology, Communication Studies, Entrepreneurship or Management of Business. The current organisation is Cricket West Indies, not the West Indies Cricket Board.",
    "route": "The current organisation is Cricket West Indies, not the West Indies Cricket Board. Its Republic Bank Five for Fun programme targets primary-school children, principally ages 7,11, and feeds a later U13/U15/U17/U19 structure. Progression remains selection-based through school, club, county, Guyana and regional cricket. Students should check the current age-group and regional competition structure.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://www.windiescricket.com/news/season-4-of-republic-bank-cricket-west-indies-five-for-fun-cricket-programme-launched-in-guyana/",
    "tr": [
      "port"
    ]
  },
  {
    "n": "Crop / Livestock or Farm-Operations Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "agri"
    ],
    "f13": "Use a supervised crop, livestock, fisheries or environmental project to practise measurement, record-keeping, science and business thinking.",
    "csec": "English A, Mathematics, Agricultural Science, Biology, Chemistry or Integrated Science, Geography and Principles of Business. Agricultural Science, Biology, Mathematics, Geography and business subjects.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship.",
    "route": "school CVQ in crop production/livestock rearing, agricultural-machinery programmes, GSA or farm apprenticeship.",
    "gate": "",
    "dev": "",
    "jobs": "farm assistant, crop/livestock worker, nursery assistant and agricultural-machinery assistant. Agricultural Scientist / Agronomist is the related degree-level pathway.",
    "src": "https://education.gov.gy/en/index.php/media2/external-news/5053-job-ready-technical-skills-for-all-secondary-students-in-the-future",
    "tr": [
      "tvet",
      "agri"
    ]
  },
  {
    "n": "Customer-Service / Retail or Banking-Operations Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available. English, Mathematics, EDPM/IT, Principles of Business and Accounts.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "school/customer-service CVQ, employer training and current vocational Banking Operations routes where offered. The TVET Hub lists Banking Operations at Essequibo Technical Institute.",
    "gate": "",
    "dev": "",
    "jobs": "customer-service representative, cashier, retail associate, teller trainee and sales assistant. The vacancy controls cash-handling, background and subject requirements.",
    "src": "https://tvet.gov.gy/programs?institution=67",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Customs Officer / GRA Officer",
    "s": "varies",
    "b": [
      "business",
      "public",
      "law"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences. Customs is a Guyana Revenue Authority function.",
    "route": "Customs is a Guyana Revenue Authority function. Requirements vary by advertised role and grade; there is no standing CSEC minimum for all GRA jobs. For example, some boarding or petroleum-unit roles require technical or tertiary qualifications and experience.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://gra.gov.gy/careers/",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Cybersecurity Analyst",
    "s": "varies",
    "b": [
      "tech"
    ],
    "f13": "build strong digital ethics, logical reasoning, Mathematics and networking foundations.",
    "csec": "IT/Computer Science, Mathematics and English are useful; use legal training labs rather than attempting access to real systems.",
    "cape": "Computer Science, Information Technology, Pure or Applied Mathematics, Physics and Digital Media.",
    "route": "begin with Computer Science, IT, Information Systems or networking, then add security labs, certifications and internships. UG's IT associate includes security fundamentals and its postgraduate Information Systems route includes information assurance, but no current stand-alone school-leaver cybersecurity degree was confirmed.",
    "gate": "",
    "dev": "",
    "jobs": "IT-support or network roles, security-operations trainee and junior governance/risk/compliance work,not automatically “cybersecurity engineer.”",
    "src": "https://fns.uog.edu.gy/department-computer-science/our-programmes/associate-science-asc-information-technology",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Data Analyst / GIS Technician",
    "s": "confirmed",
    "b": [
      "science",
      "engineering",
      "tech"
    ],
    "f13": "prioritise Mathematics, Geography, IT, clear writing and charts.",
    "csec": "Mathematics, Geography, IT/Computer Science, Economics and the sciences are useful; build spreadsheet, mapping and data-visualisation projects.",
    "cape": "Computer Science, Information Technology, Pure or Applied Mathematics, Physics and Digital Media.",
    "route": "Geography, Statistics, Economics, Computer Science or business routes can lead to data work. UG currently offers a Certificate in GIS and postgraduate GIS/remote-sensing study.",
    "gate": "",
    "dev": "",
    "jobs": "data assistant, monitoring-and-evaluation assistant, GIS technician, survey-data clerk and junior analyst.",
    "src": "https://fees.uog.edu.gy/certificate-geographic-information-systems-2023-2024",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Data Scientist / Artificial-Intelligence or Machine-Learning Specialist",
    "s": "varies",
    "b": [
      "science",
      "engineering",
      "tech",
      "business"
    ],
    "f13": "Build safe, documented digital projects; practise logic, mathematics, typing, privacy and responsible use of technology.",
    "csec": "English A, Mathematics, Information Technology, EDPM, Physics and Additional Mathematics where available.",
    "cape": "Computer Science, Information Technology, Pure or Applied Mathematics, Physics and Digital Media.",
    "route": "build from Computer Science, Information Technology, Information Systems, Mathematics, Statistics, Economics or engineering. UG currently offers undergraduate computing routes and an MSc in Artificial Intelligence; the MSc is a postgraduate route, not a Form 5 entry point.",
    "gate": "",
    "dev": "",
    "jobs": "data assistant, junior analyst, software developer, database assistant or research assistant, followed by specialised modelling work.",
    "src": "https://registry.uog.edu.gy/srms/departments/7/programmes/804/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Dentex / Dental Assistant / Dental Technician",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "strengthen English, science, fine-motor skills and patient communication.",
    "csec": "the Ministry currently lists a two-year Dentex route with four CSEC subjects including English, Mathematics and one accepted science, and a one-year Dental Assistant route with two subjects including English and an accepted science.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "the Guyana Dental Council registers dental practitioners, dentist extenders and dental technicians.",
    "gate": "the Guyana Dental Council registers dental practitioners, dentist extenders and dental technicians.",
    "dev": "",
    "jobs": "supervised dental-assisting, community-dental and technical roles; the actual title must match the completed credential and council category.",
    "src": "https://health.gov.gy/training-opportunities/",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Dentist",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme. UG currently lists the Bachelor of Dental Surgery.",
    "route": "UG currently lists the Bachelor of Dental Surgery. Applicants should use the live BDS requirements and offered-programme status for the intended intake rather than assuming its requirements are identical to MBBS. Professional practice requires registration with the Guyana Dental Council, which registers dental practitioners, dentist extenders and dental technicians.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Diplomat / Foreign Service Officer",
    "s": "confirmed",
    "b": [
      "public",
      "law"
    ],
    "f13": "Read widely, write evidence-based arguments, debate respectfully and join supervised civic, service or communication activities.",
    "csec": "English A, English B, Social Studies, Caribbean History, Geography, Economics and a modern language; Mathematics remains useful.",
    "cape": "Law, Communication Studies, Caribbean Studies, History, Sociology, Literatures in English, Economics or a modern language.",
    "route": "UG's BSocSc International Relations is a relevant route and its current entry requirements do not make Mathematics compulsory. Languages, History, Economics, Political Science and Communication Studies are useful. Recruitment occurs when the Ministry of Foreign Affairs and International Cooperation advertises roles; no permanent school-to-diplomat guarantee exists.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://registry.uog.edu.gy/srms/departments/66/programmes/96/details",
    "tr": [
      "degree",
      "service"
    ]
  },
  {
    "n": "Disaster-Risk / Emergency-Management Professional",
    "s": "varies",
    "b": [
      "science",
      "engineering",
      "public"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "useful foundations include Geography, Environmental Science, Engineering, Public Administration, Health, Logistics and GIS. UG lists postgraduate climate-change/disaster-risk programmes, which follow an undergraduate foundation rather than CSEC directly.",
    "gate": "",
    "dev": "",
    "jobs": "emergency-planning assistant, GIS/data assistant, logistics assistant, community-preparedness worker and response-agency trainee.",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Draughtsperson / CAD or BIM Technician",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering",
      "creative",
      "tech"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available. Technical Drawing, Mathematics, English, IT, Physics and Visual Arts.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "UG's Associate in Architectural and Building Technology, technical drafting/CAD study and supervised design-office work. A Region Five secondary-school AutoCAD lab opened in 2026, demonstrating that preparation can begin before tertiary study.",
    "gate": "",
    "dev": "",
    "jobs": "CAD technician, drawing-office assistant, architectural technician and BIM trainee.",
    "src": "https://registry.uog.edu.gy/srms/departments/70/programmes/884/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Early-Childhood / Childcare Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "education"
    ],
    "f13": "Read, explain ideas, tutor peers and volunteer in supervised youth activities to test interest in teaching and support work.",
    "csec": "English A, Mathematics, Information Technology and strong passes in the subjects the student may later teach.",
    "cape": "Communication Studies, Caribbean Studies and the academic subjects connected to the intended teaching specialisation. Current TVET listings include Early Childhood Development Level I.",
    "route": "Current TVET listings include Early Childhood Development Level I. Helpful subjects include English, Human and Social Biology, Social Studies and Family and Resource Management. First jobs include childcare/nursery assistant; teacher status requires an approved teacher-education route; see Teacher.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://tvet.gov.gy/programs?institution=71",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Economics and Supply Chain",
    "s": "varies",
    "b": [
      "tech",
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "Relevant routes include Economics, Finance, Accountancy, Management and UG's BSc Supply Chain Management. Careers include economist, statistician, procurement officer, purchasing assistant and logistics coordinator. Professional or employer-specific certifications may apply; check the current UG offered-programmes list and individual vacancies.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Elected Office / Politics",
    "s": "portfolio",
    "b": [
      "public",
      "law"
    ],
    "f13": "Read widely, write evidence-based arguments, debate respectfully and join supervised civic, service or communication activities.",
    "csec": "English A, English B, Social Studies, Caribbean History, Geography, Economics and a modern language; Mathematics remains useful.",
    "cape": "Law, Communication Studies, Caribbean Studies, History, Sociology, Literatures in English, Economics or a modern language. There is no academic licence for elected office.",
    "route": "There is no academic licence for elected office. Law, public administration, economics and communications may help, but eligibility comes from constitutional/electoral rules and party or independent nomination processes. A degree is required only where the law or a particular appointed office expressly requires one.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Electrician / Electrical-Installation Technician",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject. Mathematics, Physics, Electrical/Electronic Technology, Technical Drawing and English.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "school/practical-centre CVQ, technical institute, BIT or supervised apprenticeship. Current TVET listings include Level I and II Electrical Installation.",
    "gate": "",
    "dev": "",
    "jobs": "electrical-installation assistant, maintenance electrician trainee and electrical technician.",
    "src": "https://tvet.gov.gy/programs?institution=74",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Emergency Medical Technician / Emergency Services Technician",
    "s": "varies",
    "b": [
      "science",
      "public"
    ],
    "f13": "develop science foundations, physical fitness, calm communication and first-aid awareness.",
    "csec": "Biology/Human and Social Biology, Integrated Science, English, Mathematics and Physical Education are helpful.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "enter only through a currently approved emergency-care training route; no single permanently open school-leaver intake was confirmed. EMT and Emergency Services Technician are regulated categories under the Allied Health Professions Council, so recognised training and registration are required.",
    "gate": "",
    "dev": "",
    "jobs": "ambulance/emergency-service roles after training, registration and employer selection.",
    "src": "https://www.alliedhealthguyana.com/about",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Entrepreneur / Business Owner",
    "s": "confirmed",
    "b": [
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology. A degree is optional.",
    "route": "A degree is optional. Routes include UG's BSc Entrepreneurship, business or technical training, and direct entry into a trade or service. Formal milestones include registering the business, meeting tax and sector-licensing rules, opening business banking facilities and arranging finance. The Small Business Bureau publishes grant, loan and development-support information.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://sbb.gov.gy/",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Environmental Scientist / Conservationist",
    "s": "confirmed",
    "b": [
      "science",
      "public",
      "agri"
    ],
    "f13": "Use a supervised crop, livestock, fisheries or environmental project to practise measurement, record-keeping, science and business thinking.",
    "csec": "English A, Mathematics, Agricultural Science, Biology, Chemistry or Integrated Science, Geography and Principles of Business.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship. UG offers separate BSc Environmental Science and Environmental Studies pathways.",
    "route": "UG offers separate BSc Environmental Science and Environmental Studies pathways. For Environmental Science, the current specific programme page requires five subjects including English, Mathematics and two sciences, one of which is Chemistry, and says Integrated Science is not accepted. The current programme-specific page is controlling.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://fees.uog.edu.gy/srms/departments/8/programmes/863/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Fashion Designer / Garment Producer",
    "s": "portfolio",
    "b": [
      "trade",
      "creative",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "Burrowes and Carnegie garment-construction routes may support formal training; BIT and CVQ programmes may also provide production skills. Verify current intake, fees and entry requirements. Self-employment additionally requires costing, sourcing, marketing and business registration.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Filmmaker / Video Producer / Sound Professional",
    "s": "portfolio",
    "b": [
      "creative",
      "tech",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "Communication Studies, visual arts, music and short technical courses provide adjacent skills. Portfolio, crew experience and equipment access are decisive. Separate film direction, editing, cinematography, sound and production management in the site's career taxonomy.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "port"
    ]
  },
  {
    "n": "Firefighter",
    "s": "varies",
    "b": [
      "science",
      "public"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "The Guyana Fire Service's current locations page supports 24 listed stations; that count is no longer unverified. Its site has a “How to Apply” page, but a current CSEC minimum is not published there. Use an active recruitment notice or contact GFS before encoding age, education, training length or volunteer status.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://gfire.moha.gov.gy/locations/",
    "tr": [
      "service"
    ]
  },
  {
    "n": "Fisheries / Aquaculture Technician",
    "s": "confirmed",
    "b": [
      "science",
      "trade",
      "agri"
    ],
    "f13": "build Biology, Agriculture, Mathematics, environmental awareness and safe practical-work habits.",
    "csec": "Biology, Agricultural Science, Geography, Chemistry and CVQ aquaculture/fish-processing opportunities are useful where offered. The Ministry of Education has introduced aquaculture into school vocational training.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship.",
    "route": "agriculture/fisheries training, technical experience or marine/biological study can lead to the sector. Guyana's Fisheries Department covers marine fisheries, aquaculture and inland fisheries, including inspection, licensing, statistics and development.",
    "gate": "",
    "dev": "",
    "jobs": "hatchery/farm assistant, fisheries data assistant, processing/quality assistant, aquaculture technician and fisheries-inspector trainee, subject to vacancy qualifications.",
    "src": "https://education.gov.gy/en/index.php/media2/external-news/5695-aquaculture-training-empowers-teachers-to-prepare-students-for-work-2",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Flight Dispatcher / Aviation-Operations Professional",
    "s": "confirmed",
    "b": [
      "engineering",
      "tech",
      "business"
    ],
    "f13": "develop Mathematics, Geography, English, IT, teamwork and attention to detail.",
    "csec": "Mathematics, English, Geography, Physics, IT and business subjects are useful.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "the GCAA treats Flight Dispatcher/Flight Operations Officer as a non-flight-crew licensed category; applicants must meet the applicable age, knowledge, experience and proficiency requirements. UG's current BSc Aviation Management page lists routes including five CSEC subjects with English and Mathematics, as well as aviation-qualification and mature-entry routes.",
    "gate": "",
    "dev": "",
    "jobs": "flight-operations assistant, ground-operations agent, airport customer-service or cargo assistant and dispatcher trainee.",
    "src": "https://www.gcaa-gy.org/licensing-and-certification.html",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Food-and-Drink / Bar-Service Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "business"
    ],
    "f13": "Practise food safety, measurement, costing and supervised preparation; document recipes and service projects without using unsafe equipment unsupervised.",
    "csec": "English A, Mathematics, Food and Nutrition, Family and Resource Management, Integrated Science and Principles of Business.",
    "cape": "Food and Nutrition, Entrepreneurship, Management of Business and Communication Studies; CAPE is optional for many direct culinary/TVET routes.",
    "route": "Routes include CVQ Food and Drinks Service or Bar Service, hospitality training and employer onboarding. First jobs include server, bar-service assistant and banquet/catering worker. Students and providers must follow age restrictions for alcohol-related duties.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://tvet.gov.gy/programs?institution=71",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Footballer",
    "s": "portfolio",
    "b": [
      "sports"
    ],
    "f13": "Develop safely in more than one activity, record verified performance, learn rules and injury prevention, and protect academic options.",
    "csec": "English A, Mathematics, Physical Education and Sport, Biology or Human and Social Biology, Information Technology and Principles of Business.",
    "cape": "Physical Education and Sport, Biology, Communication Studies, Entrepreneurship or Management of Business.",
    "route": "Progression may run through school/private academies, GFF youth competitions, clubs, the Elite League and national teams. In 2026 the GFF launched a Youth Ensemble programme across U13, U15 and U17 levels and nine regional associations. Selection and sustained performance,not academic qualifications,control progression.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://www.guyanafootball.org/gff-fifa-youth-ensemble-programme-officially-kicks-off-in-historic-first-for-youth-football-in-guyana/",
    "tr": [
      "port"
    ]
  },
  {
    "n": "Forester",
    "s": "confirmed",
    "b": [
      "science",
      "public",
      "agri"
    ],
    "f13": "Use a supervised crop, livestock, fisheries or environmental project to practise measurement, record-keeping, science and business thinking.",
    "csec": "English A, Mathematics, Agricultural Science, Biology, Chemistry or Integrated Science, Geography and Principles of Business.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship.",
    "route": "The current BSc Forestry page allows a direct CSEC route as well as other entry routes; a Forestry diploma is not universally required first. First jobs include forestry inventory, compliance, conservation, community forestry and private-sector operations.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://faf.uog.edu.gy/srms/departments/61/programmes/862/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Game / Animation / Interactive-Media Developer",
    "s": "confirmed",
    "b": [
      "creative",
      "tech",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "combine art/design, animation, storytelling, mathematics and programming. CXC currently lists CAPE Animation and Game Design and Digital Media; UG computing routes provide a programming foundation.",
    "gate": "",
    "dev": "",
    "jobs": "junior animator, asset creator, web/interactivity developer, video editor and game-development portfolio work.",
    "src": "https://www.cxc.org/syllabus-downloads/",
    "tr": [
      "cape",
      "degree"
    ]
  },
  {
    "n": "Garment Maker / Tailor or Fashion-Production Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "creative",
      "business"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "CVQ Garment Making/Production, Carnegie, practical centres or apprenticeship.",
    "gate": "",
    "dev": "",
    "jobs": "sewing-machine operator, garment-production assistant, alteration/tailoring assistant and self-employed maker.",
    "src": "https://tvet.gov.gy/programs?institution=71",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "GDF Officer Cadet",
    "s": "confirmed",
    "b": [
      "public"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "The current GDF enlistment page publishes officer-cadet eligibility of 18,25 and academic routes including five Grades I/II in one sitting or six across two sittings, including English and Mathematics, or accepted technical qualifications. It lists local training and overseas possibilities including Sandhurst, Dartmouth and Brazil.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://gdf.mil.gy/enlist/",
    "tr": [
      "service",
      "port"
    ]
  },
  {
    "n": "GDF Soldier / Enlisted Rank",
    "s": "varies",
    "b": [
      "public"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "The current enlistment page publishes soldier information, so it is no longer accurate to call the minimum unpublished. However, GDF pages are internally inconsistent: the main page states 18,25 and “good Primary Education,” while the FAQ currently shows a wider age range and at least secondary education. Use the active recruitment notice or confirm with GDF before encoding a hard rule.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://gdf.mil.gy/enlist/",
    "tr": [
      "service"
    ]
  },
  {
    "n": "Geographer / GIS / Land-Valuation Professional",
    "s": "confirmed",
    "b": [
      "science",
      "tech",
      "public",
      "agri"
    ],
    "f13": "Use a supervised crop, livestock, fisheries or environmental project to practise measurement, record-keeping, science and business thinking.",
    "csec": "English A, Mathematics, Agricultural Science, Biology, Chemistry or Integrated Science, Geography and Principles of Business.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship. The current UG programme is BSc Geography, not BA Geography.",
    "route": "The current UG programme is BSc Geography, not BA Geography. Its published entry criteria include English, Mathematics and Geography or Social Studies, and its mature-entry route begins at 21 under the listed conditions,not 26. GIS, remote sensing, planning, disaster management and valuation may require further technical training.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://registry.uog.edu.gy/srms/departments/243/programmes/886/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Geologist / Mining Professional",
    "s": "confirmed",
    "b": [
      "science",
      "engineering"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects. UG currently offers BSc Applied and Exploration Geology.",
    "route": "UG currently offers BSc Applied and Exploration Geology. Technical and safety training may also be available through mining-sector institutions, but an unsourced claim that “over 90% of trainees secure jobs” has been removed. First jobs include field/laboratory assistant, junior geologist, mine technician and regulatory roles, subject to vacancy requirements.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://registry.uog.edu.gy/srms/departments/254/programmes/1165/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Graphic Designer / UX Designer / Animator",
    "s": "portfolio",
    "b": [
      "creative",
      "tech"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship. No single Guyanese degree is required.",
    "route": "No single Guyanese degree is required. Routes combine visual-art or computing education with design tools, user research and a strong portfolio. Animation, game art and interface design should be separate searchable careers even if they share this portfolio-first route.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree",
      "port"
    ]
  },
  {
    "n": "Graphic-Arts / Print-Production Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "creative",
      "tech"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "Graphic Arts is offered through school/practical-centre TVET in some locations. Helpful subjects include Visual Arts, IT, English and business. First jobs include print-shop assistant, layout/production assistant and sign/graphics trainee; UX and higher-level digital design remain portfolio and technology pathways; see Graphic Designer / UX Designer / Animator.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://dpi.gov.gy/minister-of-education-commissions-us1-9m-hopetown-practical-instructional-centre/",
    "tr": [
      "tvet",
      "port"
    ]
  },
  {
    "n": "Guidance Counsellor / School Psychologist",
    "s": "varies",
    "b": [
      "science",
      "education"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "Psychology, Social Work, Education or counselling training may be relevant, but “school psychologist” and “guidance counsellor” are not interchangeable. Clinical or psychological practice may trigger Allied Health Professions Council requirements; school welfare and career-guidance posts follow Ministry vacancy rules.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Health-Information / Medical-Records Professional",
    "s": "varies",
    "b": [
      "science",
      "tech",
      "business"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "combine health-service knowledge with records management, office administration, statistics, information systems or data protection. No single universal Guyanese licence was confirmed for this whole career family; employer and programme requirements control entry. Relevant foundations include UG information-systems routes and Ministry health-service training.",
    "gate": "",
    "dev": "",
    "jobs": "records clerk, patient-information assistant, coding/data assistant and health-information trainee.",
    "src": "https://registry.uog.edu.gy/srms/departments/7/programmes/805/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Heavy-Equipment / Agricultural-Machinery Mechanic",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering",
      "agri"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "This is a maintenance career, not the same as operating machinery. The TVET Hub lists Agricultural Machinery Service and Repairs and Heavy Equipment Maintenance at current institutions. First jobs include maintenance assistant, diesel/heavy-equipment technician trainee and agricultural-machinery mechanic.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://tvet.gov.gy/programs?institution=68",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Heavy-Equipment Operator",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering",
      "agri"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "BIT advertises heavy-duty-equipment operation in selected intakes. Students should build Mathematics, technical literacy, safety discipline and mechanical awareness, then verify minimum age, licence, medical/fitness and equipment-specific requirements. Operating excavators, loaders, forklifts or cranes may require different employer authorisations.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://dpi.gov.gy/9331-women-trained-through-bit-over-five-years/",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Hospitality / Tourism-Operations Worker",
    "s": "varies",
    "b": [
      "trade",
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "TVET routes include housekeeping, food-and-drink service, bar service, cookery and other provider-specific tourism/hospitality programmes. First jobs include front-of-house, guest-service, lodge, food-service and operations assistant. Tour guiding and tourism-business licensing are separate pathways; see Tour Guide / Tourism Officer.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Hotel / Resort Manager",
    "s": "confirmed",
    "b": [
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "Routes include Carnegie hospitality training, industry progression and UG's BSc Sustainable Tourism Management. Front-office, housekeeping, food and beverage, events, sales and revenue-management roles can be first steps; “hotel manager” is normally an experienced position.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree",
      "tvet"
    ]
  },
  {
    "n": "Housekeeping / Accommodation-Services Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "business"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject. English, Mathematics, Food and Nutrition, Family and Resource Management and business subjects.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "CVQ Housekeeping Level 1/2, practical-centre or employer training.",
    "gate": "",
    "dev": "",
    "jobs": "room attendant, housekeeping assistant, laundry worker and accommodation-services trainee.",
    "src": "https://tvet.gov.gy/programs?institution=71",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Human Resources Professional",
    "s": "varies",
    "b": [
      "business",
      "law"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "Common routes include Management, Psychology, Labour Studies or Business qualifications, followed by role-specific experience or international HR certifications. There is no single Guyanese licence for general HR practice. Entry rules belong to the vacancy, not to the occupation as a whole.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "ICT / Data-Processing Support Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "tech"
    ],
    "f13": "Build safe, documented digital projects; practise logic, mathematics, typing, privacy and responsible use of technology.",
    "csec": "English A, Mathematics, Information Technology, EDPM, Physics and Additional Mathematics where available. IT/Computer Science, Mathematics and English.",
    "cape": "Computer Science, Information Technology, Pure or Applied Mathematics, Physics and Digital Media.",
    "route": "school CVQ/SCCP, Data Operations, BIT or technical-institute ICT training. This basic digital/data-operations route is separate from the network technician, software developer and cybersecurity profiles.",
    "gate": "",
    "dev": "",
    "jobs": "computer-lab assistant, data-processing clerk, junior help-desk assistant and digital-services trainee.",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Immigration Officer",
    "s": "varies",
    "b": [
      "public",
      "law"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences. Immigration is not a GRA occupation.",
    "route": "Immigration is not a GRA occupation. It falls under the Ministry of Home Affairs and the Guyana Police Force's immigration function. Recruitment rules depend on the relevant Police/Home Affairs vacancy.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://moha.gov.gy/list-of-agencies/",
    "tr": [
      "service"
    ]
  },
  {
    "n": "Industrial / Manufacturing Engineer",
    "s": "confirmed",
    "b": [
      "engineering",
      "tech",
      "business"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "UG offers Associate and Bachelor routes in Industrial Engineering. The associate route currently accepts five CSEC subjects including English, Mathematics and Physics, Chemistry or Integrated Science, or specified technical qualifications. The bachelor's route also admits suitable associate/diploma holders.",
    "gate": "",
    "dev": "",
    "jobs": "production trainee, quality assistant, maintenance planner, process-improvement analyst and industrial-engineering technician.",
    "src": "https://registry.uog.edu.gy/srms/departments/72/programmes/857/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Instrumentation / Process or Production Technician",
    "s": "varies",
    "b": [
      "trade",
      "engineering",
      "tech"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "electrical, mechanical, industrial or petroleum technician foundations followed by employer/equipment-specific instrumentation, control, process and safety training.",
    "gate": "",
    "dev": "",
    "jobs": "instrumentation trainee, plant/process-operator trainee, production technician and maintenance technician.",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Insurance / AML / Compliance Professional",
    "s": "varies",
    "b": [
      "business",
      "law"
    ],
    "f13": "build numeracy, written communication, digital literacy and careful record-keeping.",
    "csec": "Mathematics, English, Principles of Accounts, Principles of Business and Economics are useful; work on spreadsheet and report-writing skills.",
    "cape": "",
    "route": "routes include Accountancy, Finance, Economics, Law, Management or entry-level insurer/bank training, followed by role-specific insurance, risk, anti-money-laundering or compliance education. Guyana has no single school-leaver licence covering this whole group, and vacancy requirements differ.",
    "gate": "",
    "dev": "",
    "jobs": "underwriting assistant, claims assistant, compliance assistant, KYC/onboarding officer and risk or audit trainee.",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Interior-Decoration Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "creative",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship. Carnegie currently lists CVQ Interior Decorating.",
    "route": "Carnegie currently lists CVQ Interior Decorating. Helpful subjects include Visual Arts, Technical Drawing, Mathematics and business. First work may include decorating assistant, display/set-up worker and event-decor production; interior architecture/design is a different tertiary pathway.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://tvet.gov.gy/programs?institution=71",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "IT Support / Network Technician",
    "s": "confirmed",
    "b": [
      "tech"
    ],
    "f13": "learn safe computer use, troubleshooting, communication and basic networking.",
    "csec": "IT, Mathematics, English and Physics are useful; practise hardware setup and documented troubleshooting.",
    "cape": "Choose CAPE subjects only after checking the intended programme's current subject and unit requirements.",
    "route": "technical training or UG's Associate of Science in Information Technology can provide programming, data, communications and security foundations. Vendor certifications may help but do not replace experience.",
    "gate": "",
    "dev": "",
    "jobs": "help-desk technician, desktop-support assistant, network technician and systems-support trainee.",
    "src": "https://fns.uog.edu.gy/department-computer-science/our-programmes/associate-science-asc-information-technology",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Journalist / Broadcaster / Communications Professional",
    "s": "confirmed",
    "b": [
      "creative",
      "public",
      "law"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "UG's Communication Studies degree currently requires six CSEC/GCE subjects including English and Mathematics through its principal route. It supports journalism, public relations, advertising and media work. A portfolio of reporting, audio, video or writing remains important for first jobs.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://fss.uog.edu.gy/srms/departments/198/programmes/555/details",
    "tr": [
      "degree",
      "port"
    ]
  },
  {
    "n": "Laboratory Scientist / Researcher",
    "s": "varies",
    "b": [
      "science",
      "tech",
      "agri"
    ],
    "f13": "Use a supervised crop, livestock, fisheries or environmental project to practise measurement, record-keeping, science and business thinking.",
    "csec": "English A, Mathematics, Agricultural Science, Biology, Chemistry or Integrated Science, Geography and Principles of Business.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship.",
    "route": "Biology, Chemistry, Physics, Environmental Science and Agriculture can lead to laboratory or research-assistant work. Independent scientist and university-research careers normally require postgraduate study, research output and project funding; they are not guaranteed by the bachelor's degree alone.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Land Surveyor",
    "s": "varies",
    "b": [
      "engineering",
      "tech"
    ],
    "f13": "strengthen Mathematics, Geography, science, spatial reasoning and outdoor fieldwork habits.",
    "csec": "Mathematics, English, Geography, Physics, Technical Drawing and IT are useful.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "surveying and land-administration programmes change across UG and technical providers. Confirm the active programme and any statutory registration or supervised-practice requirement before publishing a fixed pathway.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Lawyer / Attorney-at-Law",
    "s": "confirmed",
    "b": [
      "public",
      "law"
    ],
    "f13": "Read widely, write evidence-based arguments, debate respectfully and join supervised civic, service or communication activities.",
    "csec": "English A, English B, Social Studies, Caribbean History, Geography, Economics and a modern language; Mathematics remains useful. English, History, Communication Studies and other writing-intensive subjects.",
    "cape": "Law, Communication Studies, Caribbean Studies, History, Sociology, Literatures in English, Economics or a modern language.",
    "route": "UG LLB through the published CAPE/GCE route or the Preliminary Law route. The current Preliminary route includes a minimum GPA requirement; use the live programme page rather than a generic subject template.",
    "gate": "the current regional arrangement gives 25 Guyanese UG graduates annual direct access to the Hugh Wooding Law School two-year Legal Education Certificate; other routes may require the Council of Legal Education entrance process.",
    "dev": "a regional law school in Guyana was at the design-tender stage in July 2026. It is not yet an operating substitute for Hugh Wooding, but the government says it is intended to remove the present cap.",
    "jobs": "",
    "src": "https://fss.uog.edu.gy/srms/departments/62/programmes/571/details",
    "tr": [
      "cape",
      "degree"
    ]
  },
  {
    "n": "Lecturer / Academic Researcher",
    "s": "varies",
    "b": [
      "science",
      "education",
      "law"
    ],
    "f13": "Read, explain ideas, tutor peers and volunteer in supervised youth activities to test interest in teaching and support work.",
    "csec": "English A, Mathematics, Information Technology and strong passes in the subjects the student may later teach.",
    "cape": "Communication Studies, Caribbean Studies and the academic subjects connected to the intended teaching specialisation.",
    "route": "Normally requires at least a relevant postgraduate qualification, teaching/research ability and a competitive institutional vacancy. Academic promotion depends on experience and scholarship, not a direct Form 1-to-job pipeline.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Librarian / Archivist / Museum or Heritage Professional",
    "s": "varies",
    "b": [
      "education",
      "creative",
      "tech",
      "law"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "history, anthropology, literature, information systems, records management and education are useful foundations; specialist library, archives, conservation or museum training may require regional/online study. A current single local professional-qualification route covering all four roles was not confirmed.",
    "gate": "",
    "dev": "",
    "jobs": "library assistant, records assistant, archive assistant, museum education assistant and collections/digitisation trainee.",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Logistics, Port and Transportation Professional",
    "s": "confirmed",
    "b": [
      "engineering",
      "business"
    ],
    "f13": "build Mathematics, Geography, English, IT, teamwork and organised record-keeping.",
    "csec": "Mathematics, English, Geography, EDPM/IT, Principles of Accounts, Principles of Business and Economics are useful.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "routes include UG's BSc Supply Chain Management, business/operations programmes, CVQ/TVET, employer training and industry credentials. UG also offers an MSc Transportation Management for qualified graduates; it is not the school-leaver route.",
    "gate": "",
    "dev": "",
    "jobs": "warehouse or inventory clerk, logistics assistant, procurement assistant, shipping-documentation clerk, cargo assistant and port-operations trainee.",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree",
      "tvet"
    ]
  },
  {
    "n": "Machinist / Millwright / Industrial-Maintenance Technician",
    "s": "varies",
    "b": [
      "trade",
      "engineering",
      "tech"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject. Mathematics, Physics, Mechanical Technology, Technical Drawing and IT.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "machining, mechanical, industrial-engineering or maintenance training followed by supervised plant experience. No single continuously available national route was confirmed for all three titles. First jobs include machine-shop assistant, mechanical-maintenance trainee and millwright helper.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Magistrate / Judge",
    "s": "varies",
    "b": [
      "public",
      "law"
    ],
    "f13": "Read widely, write evidence-based arguments, debate respectfully and join supervised civic, service or communication activities.",
    "csec": "English A, English B, Social Studies, Caribbean History, Geography, Economics and a modern language; Mathematics remains useful.",
    "cape": "Law, Communication Studies, Caribbean Studies, History, Sociology, Literatures in English, Economics or a modern language. These are appointed legal offices, not school-leaver occupations.",
    "route": "These are appointed legal offices, not school-leaver occupations. The route begins with qualification and admission as an attorney, followed by substantial relevant practice and appointment through the applicable constitutional or judicial process. Serving as a magistrate is not a universal prerequisite to becoming a judge; remove that progression as a hard rule.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Marine Biologist / Blue-Economy Professional",
    "s": "confirmed",
    "b": [
      "science",
      "agri"
    ],
    "f13": "Use a supervised crop, livestock, fisheries or environmental project to practise measurement, record-keeping, science and business thinking.",
    "csec": "English A, Mathematics, Agricultural Science, Biology, Chemistry or Integrated Science, Geography and Principles of Business.",
    "cape": "Agricultural Science, Biology, Chemistry, Environmental Science, Geography, Food and Nutrition or Entrepreneurship.",
    "route": "UG has opened the Institute of Marine and Riverine Ecologies and Economies at Berbice and lists marine-focused training. Careers include marine/fisheries research, water-quality monitoring, coastal management and riverine-economy work.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://uog.edu.gy/press-release-ug-opens-pioneering-institute-marine-and-riverine-ecologies-and-economies-berbice",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Marketing / Advertising Professional",
    "s": "confirmed",
    "b": [
      "creative",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business. English, business subjects, visual arts and information technology.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "UG's BSc Marketing, Communication Studies, portfolio-based digital work or recognised short courses.",
    "gate": "",
    "dev": "",
    "jobs": "marketing assistant, sales-development representative, communications assistant, social-media coordinator and junior designer.",
    "src": "https://www.sebi.uog.edu.gy/srms/departments/248/programmes/869/details",
    "tr": [
      "degree",
      "port"
    ]
  },
  {
    "n": "Mason / Concrete or Construction-Finishing Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available. Mathematics, Building Technology, Technical Drawing, science and English.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "Masonry and combined Masonry/Plumbing CVQ routes, BIT or apprenticeship. Beterverwagting and other practical centres list Level 1 construction training.",
    "gate": "",
    "dev": "",
    "jobs": "mason's assistant, block/concrete worker, tiling or finishing trainee. Site supervision is an experienced role, not an automatic Level 1 outcome.",
    "src": "https://dpi.gov.gy/225m-beterverwagting-practical-instructional-centre-commissioned/",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Medex / Community Health Worker",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "strengthen English, Mathematics, Biology/Human and Social Biology and community-service skills.",
    "csec": "for the direct Medex alternative pathway, preserve English, Mathematics and at least one accepted science. The current Ministry page publishes five CSEC subjects for this route.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "the Ministry lists a 42-month direct Medex route with a five-year contractual obligation, plus an 18-month post-basic route for experienced registered nurses/midwives. It also lists a six-month Community Health Worker route requiring two CSEC subjects including English, with a one-year obligation. These terms are intake-specific.",
    "gate": "",
    "dev": "",
    "jobs": "community health work and supervised public-health assignments. The Ministry describes progression from Community Health Worker toward Nursing Assistant, Registered Nurse",
    "src": "https://health.gov.gy/training-opportunities/",
    "tr": [
      "health"
    ]
  },
  {
    "n": "Medical Doctor",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted. English, Mathematics, Biology, Chemistry and Physics.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "UG MBBS through one of its published admission categories, including recognised CAPE/GCE science routes and approved tertiary-science routes. Students must use the full published admission process rather than a one-line CSEC summary. The programme is competitive and includes regional considerations.",
    "gate": "registration with the Medical Council of Guyana, supervised internship and the appropriate institutional/full-registration steps.",
    "dev": "",
    "jobs": "supervised internship and public/private hospital appointments; employment, bond and placement terms depend on the intake and sponsor.",
    "src": "https://registry.uog.edu.gy/srms/departments/259/programmes/1169/details",
    "tr": [
      "cape",
      "degree"
    ]
  },
  {
    "n": "Medical Laboratory and Environmental Health",
    "s": "confirmed",
    "b": [
      "science",
      "public"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme. Relevant UG programmes and Ministry clinical/technical routes exist.",
    "route": "Relevant UG programmes and Ministry clinical/technical routes exist. These occupations are not unregulated degree-only careers: the Allied Health Professions Council covers Medical Laboratory Technician/Technologist and Environmental Health Assistant/Officer categories. Always pair the education route with the exact current council registration category.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://health.gov.gy/training-opportunities/",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Mining Engineer / Mineral-Processing Technician",
    "s": "confirmed",
    "b": [
      "science",
      "trade",
      "engineering",
      "tech"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "UG's current offered-programme list includes an Associate of Science in Mining Engineering and routes in applied/exploration geology. Technical, laboratory and equipment pathways can lead to technician work; engineering responsibilities require the appropriate higher qualification and experience.",
    "gate": "",
    "dev": "",
    "jobs": "mine technician trainee, sampling assistant, plant/process assistant, survey assistant and health-and-safety trainee.",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Musician / Performing Artist",
    "s": "portfolio",
    "b": [
      "creative",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "Formal options include the National School of Music and other Institute of Creative Arts programmes. Audition, performance history, ensemble work, teaching ability and a portfolio matter more than a single CSEC stream. Keep normal schooling visible alongside the talent pathway.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "port"
    ]
  },
  {
    "n": "NGO / International-Organisation Professional",
    "s": "varies",
    "b": [
      "business",
      "public",
      "law"
    ],
    "f13": "Read widely, write evidence-based arguments, debate respectfully and join supervised civic, service or communication activities.",
    "csec": "English A, English B, Social Studies, Caribbean History, Geography, Economics and a modern language; Mathematics remains useful.",
    "cape": "Law, Communication Studies, Caribbean Studies, History, Sociology, Literatures in English, Economics or a modern language.",
    "route": "Relevant routes include International Relations, Economics, Environmental Science, Social Work, Public Health, Law, Finance, Monitoring and Evaluation and project management. Hiring is vacancy- and donor-specific; languages, writing, data skills and field experience often matter alongside a degree.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Nurse / Midwife",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "The Ministry of Health publishes training opportunities requiring five CSEC subjects including English, Mathematics and at least one science for its main professional-nursing route; exact age, health checks and subject combinations belong to the current notice. UG and approved hospital-based routes also exist.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://health.gov.gy/training-opportunities/",
    "tr": [
      "degree",
      "health"
    ]
  },
  {
    "n": "Nutritionist / Dietitian / Food Scientist",
    "s": "confirmed",
    "b": [
      "science",
      "agri"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme. Carnegie offers nutrition-related training, while UG offers BSc Food Science.",
    "route": "Carnegie offers nutrition-related training, while UG offers BSc Food Science. Nutritionist and Dietitian are Allied Health Professions Council categories, so training alone is not the complete professional pathway.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://fns.uog.edu.gy/srms/departments/5/programmes/895/details",
    "tr": [
      "degree",
      "tvet"
    ]
  },
  {
    "n": "Occupational Safety and Health Officer",
    "s": "confirmed",
    "b": [
      "engineering",
      "public"
    ],
    "f13": "develop science awareness, communication, observation, responsibility and first-aid knowledge.",
    "csec": "English, Mathematics, Biology, Chemistry, Physics and technical subjects are useful.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "UG currently lists a Diploma and bachelor-completion routes in Occupational Health and Safety; approved industry certifications and supervised site experience may also be important. The Ministry of Labour's OSH service explains the national workplace-safety framework.",
    "gate": "",
    "dev": "",
    "jobs": "safety assistant, site-safety representative and HSE trainee; “HSE manager” is an experienced role.",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Ocean-Going Ship's Officer / Maritime Professional",
    "s": "varies",
    "b": [
      "trade",
      "engineering",
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "MARAD's local licence ladder is not a complete maritime academy. A current Guyanese academy route to internationally certificated deck/engineering officer status was not confirmed. Students must plan MARAD recognition or endorsement, approved STCW training, sea time and any regional academy as separate steps.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Office Administration / Customer Service / Sales",
    "s": "confirmed",
    "b": [
      "trade",
      "business"
    ],
    "f13": "practise English, numeracy, keyboarding, email etiquette, teamwork and public speaking.",
    "csec": "English, Mathematics, EDPM/Information Technology and business subjects are useful. School CVQ occupational areas have included customer service, business administration and data administration.",
    "cape": "",
    "route": "students may enter work after CSEC/CVQ, pursue office-administration or business training, or continue to a diploma/degree. Use the vacancy,not a universal “five subjects” rule,for the actual minimum.",
    "gate": "",
    "dev": "",
    "jobs": "receptionist, administrative assistant, records/data clerk, customer-service representative, retail associate and sales assistant.",
    "src": "https://education.gov.gy/en/index.php/media2/external-news/5053-job-ready-technical-skills-for-all-secondary-students-in-the-future",
    "tr": [
      "degree",
      "tvet"
    ]
  },
  {
    "n": "Office Clerk / Business-Administration or Data-Operations Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "business"
    ],
    "f13": "Practise budgeting, spreadsheets, communication, ethical selling, teamwork and accurate records through low-risk supervised projects.",
    "csec": "English A, Mathematics, Principles of Accounts, Principles of Business, Economics, EDPM, Office Administration and Information Technology as available. English, Mathematics, EDPM/IT, Principles of Business and Accounts.",
    "cape": "Accounting, Economics, Management of Business, Entrepreneurship, Financial Services Studies, Logistics and Supply Chain Operations or Information Technology.",
    "route": "CVQ/TVET General Office Administration, Business Administration and Data Operations, or post-CSEC office training. Current centres list Level I/II routes.",
    "gate": "",
    "dev": "",
    "jobs": "office clerk, records assistant, data-entry operator, administrative assistant and inventory clerk.",
    "src": "https://tvet.gov.gy/programs?institution=73",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Older-Adult / Care-Support Worker",
    "s": "confirmed",
    "b": [
      "science",
      "trade"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "Current TVET listings include Care of the Older Adult Level 2, while the Ministry of Health lists Patient Care Assistant training. First jobs include care assistant and home-support worker. A vocational care certificate is not a nursing licence.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://tvet.gov.gy/programs?institution=71",
    "tr": [
      "tvet",
      "health"
    ]
  },
  {
    "n": "Optometrist",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "UG's BSc Optometry has multiple routes, including school-leaver and relevant technician/associate pathways. Use its detailed live criteria because the accepted subject combinations, experience and mature-entry rules differ by route.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://cms.uog.edu.gy/school-medicine/bachelor-science-optometry",
    "tr": [
      "degree",
      "health"
    ]
  },
  {
    "n": "Other Protective and Emergency Careers",
    "s": "varies",
    "b": [
      "science",
      "public"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "Add CANU, immigration, the GDF Coast Guard, customs, intelligence/forensics, private security, occupational safety, emergency medical response and disaster management as separate careers. They belong to different agencies and cannot share one generic “uniformed service” entry rule.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "service"
    ]
  },
  {
    "n": "Painter / Decorator / Furniture Finisher",
    "s": "confirmed",
    "b": [
      "trade",
      "creative"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject. Visual Arts, Mathematics, Building Technology, Chemistry and English.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "furniture-finishing, interior-decoration, construction-finishing or supervised employer training. Current TVET listings include Furniture Finishing at multiple institutes.",
    "gate": "",
    "dev": "",
    "jobs": "painter's assistant, decorator, furniture finisher and surface-preparation worker.",
    "src": "https://tvet.gov.gy/programs",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Paralegal / Legal Clerk / Court Administrator",
    "s": "varies",
    "b": [
      "business",
      "public",
      "law"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "useful routes include law, public management, office administration, records management and supervised legal-office experience. These roles do not make the holder an attorney; admission to practise law requires the LLB-to-legal-education route described in the Lawyer profile.",
    "gate": "",
    "dev": "",
    "jobs": "legal clerk, registry clerk, case-file assistant, court administrative assistant and compliance assistant, subject to vacancy requirements.",
    "src": "https://registry.uog.edu.gy/srms/departments/62/programmes/571/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Petroleum Engineer / Petroleum Technician",
    "s": "confirmed",
    "b": [
      "science",
      "engineering",
      "tech"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "UG currently separates an Associate of Science in Petroleum Engineering from the Bachelor of Applied Science in Petroleum Engineering; the bachelor's principal route builds on the relevant associate qualification. It is separate from the Geology degree pathway.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://registry.uog.edu.gy/srms/departments/254/programmes/898/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Pharmacist / Pharmacy Technician",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme. UG offers the BSc Pharmacy and a Pharmacy Technician Diploma.",
    "route": "UG offers the BSc Pharmacy and a Pharmacy Technician Diploma. The degree page publishes specific CSEC/CAPE science requirements; after training, professional registration and any required supervised practice apply.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://cms.uog.edu.gy/department-pharmacy/bachelor-science-pharmacy",
    "tr": [
      "cape",
      "degree"
    ]
  },
  {
    "n": "Physiotherapist / Rehabilitation Professional",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "build Biology, science, communication, empathy and physical-activity foundations.",
    "csec": "UG's direct BSc Medical Rehabilitation (Physiotherapy) route lists five CSEC subjects including English, Mathematics and at least one accepted science.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "a Rehabilitation Assistant Certificate plus the published grades, experience and performance requirements can also lead into the degree.",
    "gate": "Physiotherapist, Physical Therapist, Occupational Therapist, Rehabilitation Assistant and Speech-Language/Audiology categories are regulated by the Allied Health Professions Council.",
    "dev": "",
    "jobs": "",
    "src": "https://registry.uog.edu.gy/srms/departments/259/programmes/1154/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Pilot",
    "s": "confirmed",
    "b": [
      "engineering",
      "tech"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "Air Services Limited says its GCAA-approved Flight Training School has operated since 2003 and provides Private Pilot Licence, Commercial Pilot Licence, Instrument Rating and Multi-Engine Rating training. The GCAA publishes a minimum age of 16 for a Student Pilot Licence and 18 for a Private Pilot Licence, with medical, knowledge, experience and skill requirements.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://aslgy.com/about/company",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Plumber / Pipefitter",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject. Mathematics, Technical Drawing, Building Technology, Physics and English.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "CVQ/technical-institute plumbing, BIT or apprenticeship. Plumbing is currently listed at several public TVET centres.",
    "gate": "",
    "dev": "",
    "jobs": "plumbing assistant, maintenance plumber and water-services installer. Industrial pipefitting requires additional drawing, material, pressure-system and safety competencies.",
    "src": "https://tvet.gov.gy/programs?institution=73",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Police Officer",
    "s": "varies",
    "b": [
      "public"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "The Police Force moved to a three-CSEC-subject baseline in 2022, with exceptions reported for recruits with special skills. Current recruitment notices, examinations, medical/fitness checks, background requirements and training standards control. An intake's examination pass mark is not a permanent national eligibility rule.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "service"
    ]
  },
  {
    "n": "Policy Analyst / Development Planner / Monitoring-and-Evaluation Professional",
    "s": "varies",
    "b": [
      "tech",
      "business",
      "public",
      "law"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "relevant degrees include Economics, International Relations, Sociology, Public Management, Statistics, Environmental Studies, Social Work and related disciplines. Data analysis, report writing and field-research skills are essential. Recruitment is vacancy-specific; there is no single national licence.",
    "gate": "",
    "dev": "",
    "jobs": "programme assistant, research assistant, monitoring assistant, policy-support officer and project officer.",
    "src": "https://registry.uog.edu.gy/social-sciences",
    "tr": [
      "service"
    ]
  },
  {
    "n": "Prison Officer and Civilian Prison-Service Careers",
    "s": "varies",
    "b": [
      "public"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "The Guyana Prison Service publishes recruitment/application material through its official site and uses a Recruitment Board and selection process. Exact CSEC and age requirements should be taken from the active notice. The Service also hires civilian professionals such as teachers, welfare, finance, communications and IT staff.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://gps.moha.gov.gy/recruitment-board/",
    "tr": [
      "service",
      "port"
    ]
  },
  {
    "n": "Project / Operations Manager",
    "s": "varies",
    "b": [
      "engineering",
      "tech",
      "business",
      "public"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "first qualify in the sector,business, engineering, construction, technology, health, agriculture or public service,then build planning, budgeting, risk, procurement and team-leadership experience. A short project-management certificate does not replace sector competence.",
    "gate": "",
    "dev": "",
    "jobs": "project assistant, operations assistant, scheduler, procurement assistant and site/office coordinator, progressing after demonstrated delivery experience.",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Psychologist / Clinical Psychologist",
    "s": "confirmed",
    "b": [
      "science",
      "education"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "UG offers Psychology training, but clinical practice normally requires training beyond an undergraduate degree. Psychologist and Clinical Psychologist are listed professions under the Allied Health Professions Council.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://health.gov.gy/allied-health-professions-council/",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Public-Health / Epidemiology or Health-Promotion Professional",
    "s": "confirmed",
    "b": [
      "science",
      "public"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "school leavers normally begin with nursing, medicine, environmental health, nutrition, biology, social science or another relevant undergraduate route. UG's Master of Public Health is a postgraduate programme requiring a bachelor's degree, so it must not be presented as direct CSEC entry.",
    "gate": "",
    "dev": "",
    "jobs": "public-health assistant, environmental-health assistant, community-health worker, surveillance/data assistant and health-promotion assistant",
    "src": "https://registry.uog.edu.gy/srms/departments/305/programmes/1030/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Quantity Surveyor / Construction Manager",
    "s": "varies",
    "b": [
      "engineering",
      "tech"
    ],
    "f13": "combine numeracy, communication, technical drawing and organised project work.",
    "csec": "Mathematics, English, Technical Drawing, Physics, Principles of Accounts and Principles of Business are useful.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "architectural/building technology, civil engineering, construction, costing or project-management routes may lead into the field. UG's Architecture Department explicitly teaches construction measurement and costing, construction/project management, building services and BIM, but this is not evidence of a stand-alone quantity-surveying degree.",
    "gate": "",
    "dev": "",
    "jobs": "estimating assistant, site/project assistant, measurement technician and junior construction coordinator; senior titles require experience.",
    "src": "https://fot.uog.edu.gy/department-architecture-0",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Radiographer / Medical-Imaging or Sonography Professional",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "focus on Mathematics, Physics, Biology and careful technical work.",
    "csec": "the Ministry's X-ray Technician route currently lists four CSEC subjects including English, Mathematics and an accepted science; UG also offers BSc Medical Imaging.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme.",
    "route": "sonography may be an advanced route for existing health/imaging personnel rather than a permanent direct school-leaver programme; a one-year hybrid Ministry/Mohawk programme was launched for a selected cohort.",
    "gate": "Radiographer, Medical Imaging Technologist, Sonographer, Ultrasound Sonographer and X-ray Technician are AHPC categories.",
    "dev": "",
    "jobs": "",
    "src": "https://health.gov.gy/training-opportunities/",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Real-Estate / Property / Facilities Professional",
    "s": "varies",
    "b": [
      "engineering",
      "business",
      "public",
      "law"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "business, valuation, land administration, surveying, construction, law and facilities-management experience are relevant. UG currently lists programmes in Land Administration and Management and Valuation. Brokerage, valuation, planning and facilities roles are distinct and may carry different legal or employer requirements.",
    "gate": "",
    "dev": "",
    "jobs": "property assistant, facilities assistant, valuation trainee, leasing/records assistant and site-services coordinator.",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Refrigeration / Air-Conditioning or HVAC Technician",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "BIT and technical institutes offer Refrigeration and Air-Conditioning in selected centres; the TVET Hub lists current CVQ routes.",
    "gate": "",
    "dev": "",
    "jobs": "refrigeration assistant, AC-service technician and facilities-maintenance trainee. Electrical and refrigerant safety are essential.",
    "src": "https://tvet.gov.gy/program-details?program=65",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Religious Vocation",
    "s": "portfolio",
    "b": [
      "education",
      "public",
      "law"
    ],
    "f13": "Read widely, write evidence-based arguments, debate respectfully and join supervised civic, service or communication activities.",
    "csec": "English A, English B, Social Studies, Caribbean History, Geography, Economics and a modern language; Mathematics remains useful.",
    "cape": "Law, Communication Studies, Caribbean Studies, History, Sociology, Literatures in English, Economics or a modern language. Training and recognition are denomination-specific.",
    "route": "Training and recognition are denomination-specific. Routes may involve seminaries, religious institutes, apprenticeship/formation and community approval. Students should identify the faith tradition before choosing a formation pathway.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Renewable-Energy / Energy-Systems Engineer",
    "s": "varies",
    "b": [
      "science",
      "engineering",
      "tech"
    ],
    "f13": "Strengthen algebra, measurement, drawing and science through supervised design, CAD, model-building or problem-solving projects.",
    "csec": "English A, Mathematics, Physics, Chemistry or Integrated Science, Technical Drawing, Information Technology and Additional Mathematics where available.",
    "cape": "Pure or Applied Mathematics, Physics, Chemistry and the most relevant engineering/technology subjects.",
    "route": "begin with Electrical, Mechanical, Industrial or Civil Engineering, Physics or a solar/energy technician route, then specialise through energy coursework or postgraduate study. UG's industrial-engineering curriculum includes renewable-energy technology, while solar technician routes exist in TVET.",
    "gate": "",
    "dev": "",
    "jobs": "solar installation trainee, energy technician, engineering assistant, energy-audit assistant and maintenance trainee.",
    "src": "https://fot.uog.edu.gy/srms/departments/72/programmes/861/details",
    "tr": [
      "degree",
      "tvet"
    ]
  },
  {
    "n": "Respiratory Therapist",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme. UG currently lists a BSc Respiratory Therapy, introduced from 2024,2025.",
    "route": "UG currently lists a BSc Respiratory Therapy, introduced from 2024,2025. Check the current admission page and allied-health registration requirements.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://cms.uog.edu.gy/srms/departments/257/programmes/1157/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Rigger / Scaffolder / Industrial Pipefitter",
    "s": "varies",
    "b": [
      "trade",
      "engineering"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "These are separate high-risk construction/industrial occupations. Routes are normally employer or approved-provider training with medical fitness, working-at-height, lifting, signalling, drawing and task-specific safety requirements. General welding or plumbing training is helpful but not a substitute for certified competence.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Robotics / Automation / Mechatronics Technician",
    "s": "varies",
    "b": [
      "trade",
      "engineering",
      "tech"
    ],
    "f13": "Develop numeracy, measurement, tool safety, practical problem-solving and supervised project experience.",
    "csec": "English A, Mathematics and the most relevant technical, CVQ, SCCP, science, drawing, IT or home-economics subjects available at the school.",
    "cape": "CAPE is optional for many direct vocational routes; relevant engineering, design, technology, business or entrepreneurship subjects can support progression.",
    "route": "electrical/electronic, mechanical, industrial, instrumentation and computer-science routes can provide the foundation. A single current local programme covering the full mechatronics pathway was not confirmed, so verify the actual modules and equipment exposure.",
    "gate": "",
    "dev": "",
    "jobs": "instrumentation trainee, automation assistant, industrial-maintenance technician and controls-support trainee.",
    "src": "https://registry.uog.edu.gy/engineering-technology",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Small-Engine / Generator or Marine-Engine Mechanic",
    "s": "varies",
    "b": [
      "trade",
      "engineering"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "Useful subjects are Mathematics, Physics, Mechanical/Electrical Technology and English. BIT and other providers advertise small-engine or motor-repair courses in selected intakes. Marine propulsion and generator work require equipment-specific, fuel, electrical and safety training; verify the current course rather than treating automotive training as equivalent.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Social Worker",
    "s": "confirmed",
    "b": [
      "education",
      "public",
      "law"
    ],
    "f13": "Read widely, write evidence-based arguments, debate respectfully and join supervised civic, service or communication activities.",
    "csec": "English A, English B, Social Studies, Caribbean History, Geography, Economics and a modern language; Mathematics remains useful.",
    "cape": "Law, Communication Studies, Caribbean Studies, History, Sociology, Literatures in English, Economics or a modern language.",
    "route": "UG's Social Work degree and associate-level routes are relevant to government, hospital, school, community and NGO work. The vacancy controls the exact qualification and experience requirements; social-work roles do not all have the same professional gate.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Software / Web / Mobile Developer",
    "s": "confirmed",
    "b": [
      "tech"
    ],
    "f13": "build Mathematics, English, typing, logic and simple coding projects.",
    "csec": "Mathematics and IT/Computer Science are especially useful; maintain a portfolio on a code-hosting or project platform.",
    "cape": "Computer Science, Information Technology, Pure or Applied Mathematics, Physics and Digital Media.",
    "route": "routes include UG Computer Science/IT plus current Certificate in Web Application Development and Diploma in Mobile Application Development programmes.",
    "gate": "",
    "dev": "",
    "jobs": "junior developer, web assistant, software-support trainee and freelance project work. A qualification alone is not a portfolio or job guarantee.",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Solar / Photovoltaic Technician",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering",
      "tech"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject. Mathematics, Physics, Electrical Technology, Electronics and Technical Drawing.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "electrical foundations followed by recognised PV installation and safety training. The TVET Hub currently lists CVQ Level 2 and Level 3 Photovoltaic Installation at New Amsterdam Technical Institute.",
    "gate": "",
    "dev": "",
    "jobs": "PV roof/fitter assistant, solar-installation technician trainee and system-maintenance assistant.",
    "src": "https://tvet.gov.gy/programs?institution=68",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Special Education / Early Childhood Teacher",
    "s": "confirmed",
    "b": [
      "science",
      "education"
    ],
    "f13": "Read, explain ideas, tutor peers and volunteer in supervised youth activities to test interest in teaching and support work.",
    "csec": "English A, Mathematics, Information Technology and strong passes in the subjects the student may later teach.",
    "cape": "Communication Studies, Caribbean Studies and the academic subjects connected to the intended teaching specialisation. These should be separate pathways, not buried under general teaching.",
    "route": "These should be separate pathways, not buried under general teaching. CPCE introduced additional special-education programmes, and UG offers a BEd Special Education. Entry and practicum requirements vary by programme.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://uog.edu.gy/srms/departments/56/programmes/1176/details",
    "tr": [
      "degree",
      "teach"
    ]
  },
  {
    "n": "Specialist Doctor",
    "s": "confirmed",
    "b": [
      "science"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme. Specialist medicine is no longer merely a study-abroad gap.",
    "route": "Specialist medicine is no longer merely a study-abroad gap. UG's current offerings include postgraduate training in general surgery, orthopaedics, psychiatry, anaesthesia and intensive care, family medicine, internal medicine, emergency medicine, obstetrics and gynaecology, paediatrics, cardiology, diagnostic radiology, neurosurgery, urology and otolaryngology, among others.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://www.turkeyenonline.uog.edu.gy/srms/student/prospective/about_applying/offeredprogs.php",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Sports Medicine and Rehabilitation",
    "s": "varies",
    "b": [
      "science",
      "sports"
    ],
    "f13": "Develop safely in more than one activity, record verified performance, learn rules and injury prevention, and protect academic options.",
    "csec": "English A, Mathematics, Physical Education and Sport, Biology or Human and Social Biology, Information Technology and Principles of Business.",
    "cape": "Physical Education and Sport, Biology, Communication Studies, Entrepreneurship or Management of Business.",
    "route": "Physiotherapy, medicine, nursing, psychology, nutrition and strength-and-conditioning are professional support routes, not extensions of athletic selection. Regulated health roles require the applicable council registration.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "port"
    ]
  },
  {
    "n": "Teacher",
    "s": "confirmed",
    "b": [
      "education"
    ],
    "f13": "Read, explain ideas, tutor peers and volunteer in supervised youth activities to test interest in teaching and support work.",
    "csec": "English A, Mathematics, Information Technology and strong passes in the subjects the student may later teach.",
    "cape": "Communication Studies, Caribbean Studies and the academic subjects connected to the intended teaching specialisation.",
    "route": "CPCE's principal Associate Degree in Education route requires five CSEC subjects including English and Mathematics, with specialisation-specific subjects. CPCE also publishes other teacher-training routes and articulation to UG education degrees. Verify the current programme, bond and placement terms from the intake offer.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://cpce.edu.gy/entry-requirements/",
    "tr": [
      "degree",
      "teach"
    ]
  },
  {
    "n": "Textile / Art-and-Craft Production Worker",
    "s": "confirmed",
    "b": [
      "trade",
      "creative",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "The TVET Hub lists Art and Craft Production in textile/fibre and related practical qualifications. First jobs and self-employment include textile/fibre craft, fabric decoration and product-making. Portfolio, costing and market access matter alongside the certificate.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://tvet.gov.gy/",
    "tr": [
      "tvet",
      "port"
    ]
  },
  {
    "n": "Tour Guide / Tourism Officer",
    "s": "confirmed",
    "b": [
      "creative",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship. Tour guiding is not merely an informal apprenticeship.",
    "route": "Tour guiding is not merely an informal apprenticeship. The Guyana Tourism Authority operates a licensing portal covering Tour Guides, Tour Operators, accommodation and other tourism businesses. Training or a tourism degree may help, but the relevant GTA licensing requirements must be included.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://license.guyanatourism.com/",
    "tr": [
      "degree",
      "tvet"
    ]
  },
  {
    "n": "Track and Field / Other Competitive Sports",
    "s": "portfolio",
    "b": [
      "sports"
    ],
    "f13": "Develop safely in more than one activity, record verified performance, learn rules and injury prevention, and protect academic options.",
    "csec": "English A, Mathematics, Physical Education and Sport, Biology or Human and Social Biology, Information Technology and Principles of Business.",
    "cape": "Physical Education and Sport, Biology, Communication Studies, Entrepreneurship or Management of Business. School competition, clubs, national associations and performance standards form the route.",
    "route": "School competition, clubs, national associations and performance standards form the route. Add basketball, boxing, swimming, cycling, volleyball, rugby and other sports separately rather than treating track and field as the only alternative to cricket and football.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "TV / Video-Production Assistant",
    "s": "confirmed",
    "b": [
      "trade",
      "creative",
      "tech"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "The TVET Hub currently lists CVQ Level 1 Technical Assistance in TV and Video Production. Helpful subjects include English, IT, Visual Arts, Theatre Arts and Physics. First jobs include camera/production assistant, lighting or audio assistant and editing trainee; see the Creative Industry index for portfolio progression.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://tvet.gov.gy/programs",
    "tr": [
      "tvet",
      "port"
    ]
  },
  {
    "n": "Urban Planning, Housing and GIS",
    "s": "varies",
    "b": [
      "engineering",
      "tech",
      "public"
    ],
    "f13": "Build communication, fitness where relevant, civic knowledge, teamwork, service and accurate record-keeping through supervised school or community activities.",
    "csec": "English A, Mathematics, Social Studies, Caribbean History, Geography, Information Technology and Physical Education or a modern language where relevant.",
    "cape": "Communication Studies, Caribbean Studies, Law, Sociology, History, Geography, Economics, Information Technology or relevant sciences.",
    "route": "No current direct-entry undergraduate “Urban Planning and Management” programme was verified. Current adjacent routes include Geography, GIS and UG's postgraduate Housing and Community Development programme. Urban planning is therefore presented as a developing, postgraduate or multidisciplinary pathway rather than a confirmed stand-alone undergraduate route.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "https://uog.edu.gy/srms/departments/243/programmes/1203/details",
    "tr": [
      "degree"
    ]
  },
  {
    "n": "Veterinarian",
    "s": "varies",
    "b": [
      "science",
      "agri"
    ],
    "f13": "Strengthen Mathematics, English and laboratory science; practise first aid, ethical service and careful observation through supervised activities.",
    "csec": "English A, Mathematics, Biology, Chemistry and Physics or Integrated Science; Human and Social Biology is useful where accepted.",
    "cape": "Biology and Chemistry are the safest science pair for many health routes; add Physics or Mathematics according to the target programme. No current local veterinary degree was confirmed.",
    "route": "No current local veterinary degree was confirmed. Veterinary medicine is currently a regional/international study pathway unless a new Guyanese degree or formal scholarship arrangement is identified. Guyana School of Agriculture certificates and diplomas in animal or livestock production support agricultural work but do not qualify someone as a veterinarian.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree",
      "agri"
    ]
  },
  {
    "n": "Visual Artist / Photographer / Craft Artist",
    "s": "portfolio",
    "b": [
      "creative",
      "business"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship. E.R.",
    "route": "E.R. Burrowes School of Art and UG Fine Arts are relevant formal routes, but portfolio development, exhibitions, commissions and entrepreneurship are central. Earlier claims that every Burrowes route is free or accepts applicants with no qualification were not verified for the current intake and should not be hard-coded.",
    "gate": "",
    "dev": "",
    "jobs": "",
    "src": "",
    "tr": [
      "degree",
      "port"
    ]
  },
  {
    "n": "Welder / Fabricator / Metalworker",
    "s": "confirmed",
    "b": [
      "trade",
      "engineering"
    ],
    "f13": "Develop numeracy, measurement, drawing, tool safety and supervised practical problem-solving; keep evidence of completed projects.",
    "csec": "English A, Mathematics and the most relevant Industrial Technology, Technical Drawing, Information Technology, science or available CVQ/SCCP occupational subject. Mathematics, Technical Drawing, Mechanical/Metalwork Technology, Physics and English.",
    "cape": "CAPE is optional for many direct trade routes; relevant engineering, design, technology, business or entrepreneurship subjects can support later progression.",
    "route": "CVQ/technical-institute Welding or Metal Work Engineering, BIT and employer apprenticeship.",
    "gate": "",
    "dev": "",
    "jobs": "welding assistant, fabricator, metalworker and structural-welding trainee. Processes, positions, coded tests and inspection requirements must be stored separately.",
    "src": "https://tvet.gov.gy/programs?institution=72",
    "tr": [
      "tvet"
    ]
  },
  {
    "n": "Writer / Editor / Publisher",
    "s": "portfolio",
    "b": [
      "creative",
      "business",
      "law"
    ],
    "f13": "Create original work, keep dated drafts, learn consent and copyright, and build a portfolio while maintaining core academics.",
    "csec": "English A plus the relevant creative subjects: Visual Arts, Music, Theatre Arts, Information Technology, EDPM and Principles of Business.",
    "cape": "Art and Design, Digital Media, Animation and Game Design, Performing Arts, Literatures in English, Communication Studies or Entrepreneurship.",
    "route": "strong English, literature, history, communication and digital-production skills plus a portfolio. Relevant tertiary study may include Communication Studies, English, History, Journalism, Marketing or another subject area. There is no licence to become a general writer, but copyright, defamation, privacy and publishing agreements matter.",
    "gate": "",
    "dev": "",
    "jobs": "editorial assistant, communications assistant, copywriter, reporter trainee, proofreader and independent creator.",
    "src": "",
    "tr": [
      "port"
    ]
  }
];
/* CAREERSV3:END */

var FIELDS = [
  { k: 'science', n: 'Science and Medicine', g: 'S', c: 'science' },
  { k: 'trade', n: 'Trade and TVET', g: 'T', c: 'trade' },
  { k: 'education', n: 'Education', g: 'E', c: 'education' },
  { k: 'sports', n: 'Sports', g: 'P', c: 'sports' },
  { k: 'engineering', n: 'Engineering', g: 'N', c: 'engineering' },
  { k: 'creative', n: 'Creative Industry', g: 'C', c: 'creative' },
  { k: 'tech', n: 'Technology', g: 'K', c: 'tech' },
  { k: 'business', n: 'Business and Enterprise', g: 'B', c: 'business' },
  { k: 'public', n: 'Public Service', g: 'U', c: 'public' },
  { k: 'law', n: 'Law and Humanities', g: 'L', c: 'law' },
  { k: 'agri', n: 'Agriculture', g: 'A', c: 'agri' }
];

var LEVELS = [
  { k: 'f1', n: 'Form 1', short: 'Form 1' },
  { k: 'f2', n: 'Form 2', short: 'Form 2' },
  { k: 'f3', n: 'Form 3', short: 'Form 3' },
  { k: 'f4', n: 'Form 4', short: 'Form 4' },
  { k: 'f5', n: 'Form 5', short: 'Form 5' },
  { k: 'l6', n: 'Lower Sixth', short: 'Lower Sixth' },
  { k: 'u6', n: 'Upper Sixth', short: 'Upper Sixth' },
  { k: 't1', n: 'Tertiary year 1', short: 'Year 1' },
  { k: 't2', n: 'Tertiary year 2', short: 'Year 2' },
  { k: 't3', n: 'Tertiary year 3', short: 'Year 3' },
  { k: 't4', n: 'Tertiary year 4', short: 'Year 4' },
  { k: 'work', n: 'Working or deciding', short: 'Working' }
];

var REGIONS = [
  { k: 'r1', n: 'Region 1 Barima-Waini', short: 'Region 1' },
  { k: 'r2', n: 'Region 2 Pomeroon-Supenaam', short: 'Region 2' },
  { k: 'r3', n: 'Region 3 Essequibo Islands-West Demerara', short: 'Region 3' },
  { k: 'r4', n: 'Region 4 Demerara-Mahaica', short: 'Region 4' },
  { k: 'r5', n: 'Region 5 Mahaica-Berbice', short: 'Region 5' },
  { k: 'r6', n: 'Region 6 East Berbice-Corentyne', short: 'Region 6' },
  { k: 'r7', n: 'Region 7 Cuyuni-Mazaruni', short: 'Region 7' },
  { k: 'r8', n: 'Region 8 Potaro-Siparuni', short: 'Region 8' },
  { k: 'r9', n: 'Region 9 Upper Takutu-Upper Essequibo', short: 'Region 9' },
  { k: 'r10', n: 'Region 10 Upper Demerara-Berbice', short: 'Region 10' }
];

var SPINE = [
  {
    k: 'f1',
    n: 'Form 1',
    sum: 'Build the base and explore broadly.',
    do: 'Protect English, Mathematics, Science and digital literacy. Explore all 11 fields through clubs, reading, career videos, safe practical projects and conversations with verified practitioners. Start a simple career notebook. Do not choose a single lifetime career.',
    keep: 'A broad base keeps every field available later.',
    risk: 'Choosing one career now, or dropping English or Mathematics.',
    decide: false
  },
  {
    k: 'f2',
    n: 'Form 2',
    sum: 'Test interests through evidence.',
    do: 'Complete at least one small project in three different fields. Practise communication, teamwork, punctuality, safe internet use and personal organisation. Ask what you like doing repeatedly, not only what sounds prestigious. Begin a portfolio folder.',
    keep: 'Evidence from more than one field, kept in a folder.',
    risk: 'Specialising on prestige alone, with nothing written down.',
    decide: false
  },
  {
    k: 'f3',
    n: 'Form 3',
    sum: 'Choose CSEC and CVQ subjects without closing key doors.',
    do: 'Check the subjects the school actually offers. Keep English A and Mathematics whenever possible. Protect the prerequisites for your strongest two or three fields. Compare a degree route, a technical route and a bridging route. Obtain the current programme page before you lock subjects.',
    keep: 'English A, Mathematics, and the subjects your destination still needs.',
    risk: 'Dropping a prerequisite the school cannot add back in Form 4.',
    decide: true
  },
  {
    k: 'f4',
    n: 'Form 4',
    sum: 'Build evidence, not only examination plans.',
    do: 'Begin CSEC and CVQ work seriously and keep SBA evidence organised. Join one sustained activity connected to a likely career. Learn to write a one-page student CV. Review a weak prerequisite each term, not in a panic later.',
    keep: 'Organised SBA evidence and one sustained activity.',
    risk: 'Leaving a weak prerequisite until Form 5.',
    decide: false
  },
  {
    k: 'f5',
    n: 'Form 5',
    sum: 'Complete secondary credentials and apply on time.',
    do: 'Sit the appropriate CSEC or CVQ examinations and keep the portfolio. Apply to Form 6, UG, CPCE, technical institutes, GSA, Ministry training or apprenticeships on their published calendars. Compare the formal minimum with competitive reality, location, cost and any service obligation.',
    keep: 'A first route, a second and a bridging route.',
    risk: 'One disappointing grade with no Plan B.',
    decide: true
  }
];

var FORK = [
  {
    k: 'cape',
    tr: 'cape',
    n: 'Form 6 and CAPE',
    dur: 'Lower Sixth, Upper Sixth',
    steps: [
      { n: 'Lower Sixth', t: 'Choose CAPE units from the intended programme page, not from a friend\'s combination. Complete Unit 1 and Communication Studies or Caribbean Studies as the school requires.' },
      { n: 'Upper Sixth', t: 'Complete Unit 2, apply early, request transcripts and map any licence chain. CAPE is useful for competitive science, medicine, law and overseas routes. It is not automatically required for every UG degree.' }
    ]
  },
  {
    k: 'ug',
    tr: 'degree',
    n: 'University of Guyana',
    dur: 'UG year 1 to 4',
    steps: [
      { n: 'UG year 1', t: 'Approved Guyanese students attend under the Government free-tuition policy from 2025. Admission is still competitive and programme-specific. General degree entry can use five CSEC subjects including English and the published prerequisites.' },
      { n: 'UG year 2 to 4', t: 'Each programme page overrides the general summary. Medicine, dentistry, law and engineering have their own science, CAPE, grade or route rules. Never infer them from five subjects.' }
    ]
  },
  {
    k: 'tvet',
    tr: 'tvet',
    n: 'Technical institute, CVQ or BIT',
    dur: 'Institute year 1, year 2',
    steps: [
      { n: 'Institute year 1', t: 'Craft, competency-based, technician and business programmes have different entry rules. GTI publishes age, CSEC, SCCP and experience routes. The live programme intake remains controlling.' },
      { n: 'Institute year 2', t: 'As of March 2026 the Ministry reported CVQ programmes at 94 secondary schools across all ten regions. Availability differs by school. BIT provides skills training by intake and region.' }
    ]
  },
  {
    k: 'gsa',
    tr: 'agri',
    n: 'Guyana School of Agriculture',
    dur: 'GSA year 1, year 2',
    steps: [
      { n: 'GSA year 1', t: 'GSA currently lists agriculture, forestry, animal-health, fisheries and food or agroprocessing pathways. Exact intake requirements must be checked with GSA.' },
      { n: 'GSA year 2', t: 'The 2026 allocation covers the removal of tuition fees. Students should still verify application, accommodation, equipment and other possible costs.' }
    ]
  },
  {
    k: 'moh',
    tr: 'health',
    n: 'Ministry of Health training',
    dur: 'Training year 1, year 2',
    steps: [
      { n: 'Training year 1', t: 'Programmes range from two or three CSEC passes for some support routes to five including English, Mathematics and science for professional nursing and Medex alternatives.' },
      { n: 'Training year 2', t: 'Current notices may include duration and a service obligation. Confirm the live Ministry training page before planning around a cohort.' }
    ]
  },
  {
    k: 'cpce',
    tr: 'teach',
    n: 'CPCE teacher education',
    dur: 'CPCE year 1, year 2',
    steps: [
      { n: 'CPCE year 1', t: 'Current CPCE pages show programme-specific CSEC and subject-specialisation rules, commonly including English and Mathematics.' },
      { n: 'CPCE year 2', t: 'Teacher status needs an approved teacher-education route and supervised teaching. A childcare certificate is not the same thing.' }
    ]
  },
  {
    k: 'service',
    tr: 'service',
    n: 'Uniformed service',
    dur: 'Recruitment, Training intake',
    steps: [
      { n: 'Recruitment', t: 'Recruitment notices control age, citizenship, fitness, character, academic and medical rules. They can change and may differ for recruits, officers and specialists.' },
      { n: 'Training intake', t: 'Nothing is open until the current notice says so. Fitness and character checks sit beside the academic minimum.' }
    ]
  },
  {
    k: 'work',
    tr: 'port',
    n: 'Work and study',
    dur: 'First job, Part-time credential',
    steps: [
      { n: 'First job', t: 'A first role, an apprenticeship or supervised employment can start after CSEC or another accepted credential. Keep the leaving record with you.' },
      { n: 'Part-time credential', t: 'Add a part-time certificate, CVQ, BIT intake or evening study while you work. A portfolio or trial still decides some careers.' }
    ]
  }
];

var CSEC_SUBJECTS = [
  'Additional Mathematics',
  'Human and Social Biology',
  'Physical Education and Sport',
  'Electronic Document Preparation and Management',
  'Principles of Accounts',
  'Principles of Business',
  'Agricultural Science',
  'Caribbean History',
  'Family and Resource Management',
  'Food and Nutrition',
  'Home Economics',
  'Industrial Technology',
  'Information Technology',
  'Integrated Science',
  'Office Administration',
  'Religious Education',
  'Social Studies',
  'Technical Drawing',
  'Theatre Arts',
  'Visual Arts',
  'Biology',
  'Chemistry',
  'Economics',
  'English A',
  'English B',
  'Geography',
  'Mathematics',
  'Physics',
  'EDPM',
  'English',
  'Music',
  'Spanish'
];

var LEAVING = [
  { k: 'results', n: 'Verified results' },
  { k: 'cv', n: 'A short CV' },
  { k: 'portfolio', n: 'A portfolio or practical evidence' },
  { k: 'refs', n: 'At least two references' },
  { k: 'programmes', n: 'A list of programmes and deadlines' },
  { k: 'routes', n: 'A first route and a backup' }
];

var PW_FLAG_REASONS = [
  { k: 'stale', n: 'Out of date' },
  { k: 'req', n: 'Wrong requirement' },
  { k: 'missing', n: 'A route is missing' },
  { k: 'link', n: 'The link is broken' },
  { k: 'school', n: 'Not true for my school' }
];

var PW_SUGGEST_FIELDS = [
  { k: 'route', n: 'Routes in Guyana' },
  { k: 'csec', n: 'Forms 4 and 5 CSEC' },
  { k: 'cape', n: 'Form 6 CAPE' },
  { k: 'f13', n: 'In Forms 1 to 3' },
  { k: 'gate', n: 'Professional gate' },
  { k: 'dev', n: 'Recent change' },
  { k: 'jobs', n: 'First jobs' }
];

