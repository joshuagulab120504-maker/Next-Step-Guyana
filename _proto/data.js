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
    role: 'Mentor',
    pos: 'Junior doctor, Georgetown Public Hospital',
    journey: 'raeka',
    pod: 'Science and health pod',
    cats: ['Science and health', 'Subject choice'],
    similar: ['omar', 'jerome']
  },
  omar: {
    name: 'Omar Khan',
    init: 'OK',
    role: 'Mentor',
    pos: 'Electrician and site supervisor, Berbice',
    journey: 'omar',
    pod: 'Trades pod',
    cats: ['Building and fixing things'],
    similar: ['raeka', 'keisha']
  },
  jerome: {
    name: 'Jerome DaSilva',
    init: 'JD',
    role: 'Contributor',
    pos: 'Software developer, Georgetown',
    journey: 'jerome',
    cats: ['Technology'],
    similar: ['omar', 'raeka']
  },
  keisha: {
    name: 'Keisha Daniels',
    init: 'KD',
    role: 'Mentor',
    pos: 'Community coach and PE teacher, Lethem',
    journey: 'keisha',
    pod: 'Sport and coaching pod',
    cats: ['Sport and coaching'],
    similar: ['omar', 'marcus']
  },
  marcus: {
    name: 'Marcus Gomes',
    init: 'MG',
    role: 'Contributor',
    pos: 'Videographer, Georgetown',
    journey: 'marcus',
    cats: ['Creative and media'],
    similar: ['jerome', 'keisha']
  },
  aisha: {
    name: 'Aisha Mohamed',
    init: 'AM',
    role: 'Student',
    pos: 'Form 5 student, Region 4',
    cats: ['Business']
  },
  desk: {
    name: 'Opportunities desk',
    init: 'OD',
    role: 'Next Step',
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
    independent: false
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
    who: 'Ages 14 to 25, open across neighbourhoods and abilities',
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
    independent: true
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
    independent: true
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
    independent: false
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
    independent: false
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
    independent: false
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
    independent: false
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
    independent: false
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
    independent: true
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
    independent: false
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
    independent: false
  }
};

var SESSIONS = [
  {
    id: 's-sci',
    title: 'Pathways into medicine and health',
    day: 'Sat',
    date: '12',
    when: 'Saturday 12 September, 5:00 PM, one hour on Google Meet',
    pod: 'Science and health pod',
    lead: 'raeka',
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
    pod: 'Science and health pod',
    lead: 'raeka',
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
    pod: 'Trades pod',
    lead: 'omar',
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
    pod: 'Technology pod',
    lead: 'jerome',
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
    pod: 'Sport and coaching pod',
    lead: 'keisha',
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
    pod: 'Creative and media pod',
    lead: 'marcus',
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
    pod: 'After CSEC pod',
    lead: 'omar',
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

var FEED = [
  {
    id: 'q-bio',
    kind: 'question',
    time: '2h ago',
    cat: 'Subject choice',
    anon: true,
    who: 'Form 3 student, Region 4',
    title: 'If I might want medicine later, do I have to keep Biology and Chemistry in Form 3?',
    askedAt: 'Form 3',
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
    time: '2 days ago',
    cat: 'Technology',
    author: 'desk',
    opp: 'stem',
    text: 'STEMGuyana holiday pods are open for ages 8 to 18 in several regions. Coding, robotics and AI taster weeks, and there is no fee to join.'
  },
  {
    id: 'f3',
    kind: 'story',
    time: '5h ago',
    cat: 'Science and health',
    author: 'raeka',
    title: 'What I wish I had done the week after my first failed Biology mock.',
    body: [
      'I treated the mock like a verdict. I lost a week to embarrassment before I opened a past paper again.',
      'The rebuild was boring and it worked. Same topics, timed, marked against the scheme, then a short list of the three ideas I kept missing.',
      'If your mock goes badly, start that week. Waiting for the final term is how a weak paper becomes your aggregate.'
    ],
    takeaways: [
      'Mocks are rehearsal, not judgment.',
      'Rebuild from past papers the same week, not the same term.',
      'Ask a mentor which topics repeat before you reread the whole book.'
    ],
    insp: 18,
    rel: ['q-bio', 'f5'],
    opp: 'clinic',
    sess: 's-clinic'
  },
  {
    id: 'f4',
    kind: 'session',
    time: 'Yesterday',
    cat: 'Building and fixing things',
    session: 's-trades'
  },
  {
    id: 'f5',
    kind: 'journey',
    time: '3 days ago',
    cat: 'Science and health',
    journey: 'raeka'
  },
  {
    id: 'q-lethem',
    kind: 'question',
    time: '5 days ago',
    cat: 'Sport and coaching',
    anon: true,
    who: 'Form 2 student, Region 9',
    title: 'There is no private academy in Lethem. How do I build a sport pathway that still looks serious?',
    askedAt: 'Form 2',
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
    time: 'Yesterday',
    cat: 'Building and fixing things',
    author: 'omar',
    title: 'How I stopped the CAPE versus GTTi argument at home.',
    body: [
      'My parents heard electrical work as giving up. I heard CAPE as two more years with no tool in my hand.',
      'I put both plans on one page. Years, cost, first job, and what happens if it does not work out. I named a certificate and a licensed mentor on the trade side.',
      'The fight got quieter when the page was specific. TVET stops sounding like a leftover once the route has names on it.'
    ],
    takeaways: [
      'Write both routes with years, cost and first job.',
      'Name a certificate and a mentor on the trade side.',
      'Keep Maths and English even when the work is with your hands.'
    ],
    insp: 27,
    rel: ['q-cape', 'f9'],
    opp: 'sbb',
    sess: 's-fork'
  },
  {
    id: 'q-cape',
    kind: 'question',
    time: '1 week ago',
    cat: 'After CSEC',
    anon: true,
    who: 'Form 5 student, Region 4',
    title: 'My parents want CAPE. I want GTTi electrical after CSEC. How do we decide without it turning into a fight?',
    askedAt: 'Form 5',
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
    time: '4 days ago',
    cat: 'Building and fixing things',
    journey: 'omar'
  },
  {
    id: 'f10',
    kind: 'opportunity',
    time: '3 days ago',
    cat: 'Technology',
    author: 'desk',
    opp: 'cso',
    text: 'Caribbean STEM Olympiads accept independent competitors. If your school will not organise a team, you can still enter.'
  },
  {
    id: 'q-media',
    kind: 'question',
    time: '4 days ago',
    cat: 'Creative and media',
    anon: true,
    who: 'Form 4 student, Region 3',
    title: 'People keep telling me media is not a real career in Guyana. What proof should I be collecting?',
    askedAt: 'Form 4',
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
    time: '6 days ago',
    cat: 'Sport and coaching',
    author: 'keisha',
    title: 'The week I missed regional trials, and what the log fixed later.',
    body: [
      'There was no transport that week from Lethem. I missed the trials and spent two days convinced the route had closed.',
      'I kept training the younger students and writing every session in the same exercise book I had started at thirteen.',
      'Months later that written log is what got me funded to a regional coaching workshop. The absence still hurt. The paper trail is what travelled.'
    ],
    takeaways: [
      'Ask about travel funding before meet week.',
      'A session log is evidence, not paperwork for its own sake.',
      'Missing one trial is a setback, not the end of a hinterland route.'
    ],
    insp: 31,
    rel: ['q-lethem', 'f15'],
    opp: 'track',
    sess: 's-sport'
  },
  {
    id: 'f13',
    kind: 'session',
    time: '2 days ago',
    cat: 'Sport and coaching',
    session: 's-sport'
  },
  {
    id: 'f14',
    kind: 'opportunity',
    time: '6 days ago',
    cat: 'Business',
    author: 'desk',
    opp: 'blue',
    text: 'Blue Ocean is fully virtual and open to Guyanese secondary students with direct registration. No school sponsor required.'
  },
  {
    id: 'f15',
    kind: 'journey',
    time: '5 days ago',
    cat: 'Sport and coaching',
    journey: 'keisha'
  },
  {
    id: 'f16',
    kind: 'journey',
    time: '1 week ago',
    cat: 'Technology',
    journey: 'jerome'
  }
];


var SLOTS = [
  { k: 'sport', t: 'A sport', hint: 'Team, club or community league you actually train with.' },
  { k: 'instrument', t: 'An instrument', hint: 'School steel pan, choir instrument, or whatever your music room already has.' },
  { k: 'tvet', t: 'A TVET subject', hint: 'Industrial Technology, EDPM, or another technical subject your school runs.' },
  { k: 'volunteer', t: 'Volunteering', hint: 'Church group, community service, or PYARG service hours with a log.' },
  { k: 'language', t: 'A foreign language', hint: 'Spanish or another language subject, kept long enough to use.' }
];
