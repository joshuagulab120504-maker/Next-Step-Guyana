/* Next Step Guyana seed data: feed + journeys */
window.NSG_DATA = (function () {
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
      { t: 'STEMGuyana learning pod', d: 'After school coding and robotics pods in several regions. Low barrier to try digital making.', key: 'stem-pod' },
      { t: "President's Youth Award", d: 'Open from age 14 and not a competition. Service, skill and adventure sections build evidence early.', key: 'pya' },
      { t: 'School club with a record', d: 'Any club counts if you keep a log of what you actually did in it.', key: 'club-log' }
    ],
    subject: [
      { t: 'Compare two subject combinations', d: 'Put the science one and the technical one side by side, with the gate each keeps open.', key: 'subj-compare' },
      { t: 'Talk to whoever teaches the subject you might drop', d: 'Ask specifically whether it can be added back in Form 4 at your school.', key: 'subj-teacher' },
      { t: 'Regional STEAM fair', d: 'The regional round is the entry point. The national fair is the final stage, not where you sign up.', key: 'steam-fair' }
    ],
    csec: [
      { t: 'Free past paper clinic', d: 'Weekly, after school. The mentors who run it are answering questions in your feed.', key: 'past-paper' },
      { t: 'Fix the weakest paper first', d: 'Pick the subject you would rather avoid and give it the first hour, not the last.', key: 'weak-paper' },
      { t: 'J.O.F. Haynes debating competition', d: 'Entered through your school. Ask the English or Social Studies teacher about the round dates.', key: 'debate' }
    ],
    fork: [
      { t: 'GTTi and CAPE on one page', d: 'Years, cost, first job and backup for each. The comparison is what ends the argument at home.', key: 'gtti-cape' },
      { t: 'Find the gate, not the school', d: 'Pull the entry list for the programme you want and work backwards from it.', key: 'find-gate' }
    ],
    special: [
      { t: 'Match your units to the entry list', d: 'Check the published requirement for this cycle rather than last year.', key: 'units-match' },
      { t: 'Line up one reference early', d: 'Whoever writes it needs months of you, not a week.', key: 'ref-early' }
    ],
    led: [
      { t: 'Contribute your own journey', d: 'The route you just walked is the one somebody in Form 2 is looking for.', key: 'contribute' },
      { t: 'Keep one node ahead', d: 'The destination can change. The habit of planning is what carries.', key: 'one-node' }
    ]
  };

  var FY_CATALOGUE_EXTRA = 6;

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
      quote: 'Keep the subjects that close the most doors if you drop them. You can always specialise later.',
      blurb: 'Helps Form 3 to Form 5 students who are thinking about medicine, nursing or lab work, and who need a clear subject path.',
      moments: [
        { age: 12, text: "Joined the science club and stayed after every lab to clean glassware. That is where a teacher first said medicine might fit." },
        { age: 15, text: 'Kept Biology and Chemistry through Form 3 even when friends dropped one. The school could not always add Chemistry back later.' },
        { age: 16, text: 'Failed a Biology mock mid-term. Rebuilt from past papers the same week instead of waiting for the final term.', flag: 'Setback' },
        { age: 18, text: 'Stayed for CAPE Sciences, then entered medical training with a weekend tutoring habit that never stopped.' }
      ],
      route: [
        { stage: 'explore', text: 'Joined the school science club and kept a log of every session.', lesson: 'Evidence starts before grades do.' },
        { stage: 'subject', text: 'Kept Biology and Chemistry in Form 3.', lesson: 'Some schools will not let you add Chemistry back in Form 4.' },
        { stage: 'csec', text: 'Used mocks as rehearsal and rebuilt from past papers the same week a paper went badly.', lesson: 'Do not wait for the final term to fix a weak paper.' },
        { stage: 'fork', text: 'Stayed for CAPE Sciences instead of leaving after CSEC.', lesson: 'Name the gate before you argue about the school.' },
        { stage: 'special', text: 'Mapped CAPE units to the medical school entry list for that cycle.', lesson: 'Confirm requirements with the institution directly.' },
        { stage: 'led', text: 'Junior doctor role plus weekend mentoring for CSEC science students.', lesson: 'The destination can shift. The habit of helping stays.' }
      ],
      dive: {
        title: 'University of Guyana, medical pathway',
        req: 'Strong CSEC and CAPE sciences. Exact grades change by cycle.',
        cost: 'Public fees plus books, travel and living costs in Georgetown.',
        caveat: 'Confirm current requirements and fees with the institution directly before you plan around last year\'s list.'
      },
      did: {
        text: 'A junior doctor who still runs weekend science sessions because Form 3 is where doors close quietly.',
        src: 'Mentor interview notes, Next Step Guyana prototype'
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
      place: 'New Amsterdam, Region 6',
      age: 14,
      ongoing: true,
      hook: 'Fixed neighbours\' fans and radios after school long before anyone called it a trade path.',
      now: 'Licensed electrician in Berbice. Mentors students who are weighing GTTi against CAPE.',
      quote: 'TVET stops sounding like giving up once a certificate and a mentor are named on the same page.',
      blurb: 'Helps students who want electrical or trade work after CSEC, and families who need a plan that is not only CAPE.',
      moments: [
        { age: 14, text: 'Kept Maths and English while spending evenings fixing small appliances for neighbours.' },
        { age: 16, text: 'Chose GTTi electrical after CSEC when the family still expected CAPE. Put both plans on one page with cost and first job.', flag: 'Fork' },
        { age: 18, text: 'Finished the certificate, then worked under a licensed electrician before sitting his own licence exams.' },
        { age: 22, text: 'Started mentoring Form 5 students who were stuck in the CAPE versus trade argument at home.' }
      ],
      route: [
        { stage: 'explore', text: 'Took every chance to fix something real, not only theory in class.', lesson: 'Hands-on hours count as evidence.' },
        { stage: 'subject', text: 'Kept Maths and English on a trade path.', lesson: 'Sites and certificates still ask for both.' },
        { stage: 'csec', text: 'Sat CSEC with trade entry lists already printed.', lesson: 'Know the gate before results day.' },
        { stage: 'fork', text: 'Chose GTTi electrical and wrote CAPE as the backup on the same page.', lesson: 'A named certificate ends the fight faster than a slogan.' },
        { stage: 'special', text: 'Completed the electrical programme and logged supervised site hours.', lesson: 'The licence path is longer than the brochure suggests.' },
        { stage: 'led', text: 'Licensed work in Berbice plus mentoring on the CAPE versus TVET fork.', lesson: 'You can mentor the argument you already survived.' }
      ],
      dive: {
        title: 'GTTi electrical programmes',
        req: 'CSEC Maths and English are commonly asked for. Check the current intake list.',
        cost: 'Programme fees plus tools, travel and materials. Ask about support early.',
        caveat: 'Confirm current entry requirements, fees and start dates with GTTi directly.'
      },
      did: {
        text: 'An electrician who treats the CAPE versus TVET talk as a planning problem, not a loyalty test.',
        src: 'Mentor interview notes, Next Step Guyana prototype'
      },
      steps: [
        { kind: 'Subject', label: 'CSEC Mathematics', stage: 'subject' },
        { kind: 'Subject', label: 'CSEC English', stage: 'subject' },
        { kind: 'Route step', label: 'Fix real appliances after school', stage: 'explore' },
        { kind: 'Opportunity', label: 'GTTi electrical programme', stage: 'fork' },
        { kind: 'Route step', label: 'Supervised site hours', stage: 'special' },
        { kind: 'Career', label: 'Licensed electrician', stage: 'led' }
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
      age: 13,
      ongoing: false,
      hook: 'Learned to code on a shared family laptop after everyone else went to sleep.',
      now: 'Developer in Georgetown. Speaks at free monthly meetups open to secondary students.',
      quote: 'Nobody asked what school anyone went to. They asked what you had built.',
      blurb: 'Shares how a Georgetown student turned late-night practice and one public meetup into contract work.',
      moments: [
        { age: 13, text: 'Borrowed the family laptop after 10pm and followed free tutorials. Kept a folder of tiny projects nobody asked for.' },
        { age: 16, text: 'Built a one-page site for a family business. That page later led to a short paid contract.', flag: 'Proof' },
        { age: 17, text: 'Went to a free Georgetown developer meetup. Found out secondary students were welcome.' },
        { age: 19, text: 'Took contract work from people who had seen the work, not the school name.' }
      ],
      route: [
        { stage: 'explore', text: 'Built tiny projects on a shared laptop after hours.', lesson: 'A folder of finished things beats a speech about talent.' },
        { stage: 'subject', text: 'Kept enough core subjects to leave doors open while coding at night.', lesson: 'You can explore tech without dropping Maths and English.' },
        { stage: 'csec', text: 'Sat CSEC while shipping small sites for people who needed them.', lesson: 'Client-shaped work teaches delivery.' },
        { stage: 'fork', text: 'Chose building and meetups over waiting for a perfect school route.', lesson: 'Show the work instead of arguing for the field.' },
        { stage: 'special', text: 'Used public meetups and shipped pages as the portfolio.', lesson: 'The monthly session is free. Almost nobody knows.' },
        { stage: 'led', text: 'Developer work plus speaking to secondary students at meetups.', lesson: 'Pass the room on to the next Form 4 student.' }
      ],
      dive: {
        title: 'Self-taught developer path plus local meetups',
        req: 'A public body of work. Formal degrees help some jobs, not all entry work.',
        cost: 'Mostly time. Meetups are free. Internet and a usable machine are the real costs.',
        caveat: 'Confirm any programme fees or entry rules with the organiser. Meetup openness can change.'
      },
      did: {
        text: 'A contributor who learned that delivery on time changes how adults talk about media and tech careers.',
        src: 'Contributor interview notes, Next Step Guyana prototype'
      },
      steps: [
        { kind: 'Route step', label: 'Build tiny projects after hours', stage: 'explore' },
        { kind: 'Subject', label: 'Keep Maths and English', stage: 'subject' },
        { kind: 'Opportunity', label: 'Georgetown developer meetup', stage: 'fork' },
        { kind: 'Route step', label: 'Ship a page for a real need', stage: 'csec' },
        { kind: 'Career', label: 'Developer, contract pathway', stage: 'led' }
      ]
    }
  };

  var FEED = [
    {
      id: 'f1', kind: 'question', anon: true, who: 'Form 3 student, Region 4', time: '2h ago', tag: 'Subject choice',
      title: 'If I might want medicine later, do I have to keep Biology and Chemistry in Form 3?',
      replies: [
        { who: 'Raeka Persaud', role: 'Mentor', text: 'Keep both. Some schools let you add Chemistry back in Form 4 and some do not, and you usually find out too late to do anything about it.' },
        { who: 'Omar Khan', role: 'Mentor', text: 'Same thinking on a trade path. Keep whichever subject closes the most doors if you drop it.' },
        { who: 'Form 5 student, Region 6', role: 'Student', text: 'I dropped Chemistry in Form 3 and ended up sitting it privately. It cost me a year.' }
      ]
    },
    {
      id: 'f2', kind: 'opportunity', anon: false, who: 'Opportunities desk', init: 'OD', time: '2 days ago', tag: 'STEM',
      text: 'STEMGuyana holiday pods are open for ages 8 to 18 in several regions. Coding, robotics and AI taster weeks, and there is no fee to join.',
      wish: { key: 'stem-pod', title: 'STEMGuyana holiday pod', note: 'Ages 8 to 18, several regions' }
    },
    {
      id: 'f3', kind: 'tip', anon: false, who: 'Raeka Persaud', init: 'RP', time: '5h ago', tag: 'Science and health', journey: 'raeka',
      text: 'Mocks are rehearsal. If Biology goes badly, start rebuilding from past papers that same week. Do not wait for the final term.'
    },
    {
      id: 'f4', kind: 'story', anon: false, who: 'Jerome DaSilva', init: 'JD', time: 'Yesterday', tag: 'Technology', journey: 'jerome',
      title: 'Went to a developer meetup in Georgetown on Saturday. Three things worth passing on.',
      text: 'Nobody asked what school anyone went to. They asked what you had built. Two people picked up contract work from a single page they made for a family business. And the monthly session is free and open to secondary students, which almost nobody in the room seemed to know.',
      wish: { key: 'gt-meetup', title: 'Georgetown developer meetup', note: 'Monthly, open to secondary students' }
    },
    { id: 'f5', kind: 'journey', journey: 'raeka' },
    {
      id: 'f6', kind: 'question', anon: true, who: 'Form 2 student, Region 9', time: '5 days ago', tag: 'Sport and coaching',
      title: 'There is no private academy in Lethem. How do I build a sport pathway that still looks serious?',
      replies: [
        { who: 'Keisha Daniels', role: 'Contributor', text: 'Community leagues, PE subjects, a first aid certificate and a short coaching course. Travel funding is usually the real blocker, so ask about it early.' },
        { who: 'Form 4 student, Region 9', role: 'Student', text: 'I kept a log of every match I helped run. That log is what got me into a regional coaching workshop.' }
      ]
    },
    {
      id: 'f7', kind: 'tip', anon: false, who: 'Omar Khan', init: 'OK', time: 'Yesterday', tag: 'Building and fixing things', journey: 'omar',
      text: 'Keep Maths and English on a trade path. Sites and certificates still ask for both, even when the work is with your hands.'
    },
    {
      id: 'f8', kind: 'question', anon: true, who: 'Form 5 student, Region 4', time: '1 week ago', tag: 'After CSEC',
      title: 'My parents want CAPE. I want GTTi electrical after CSEC. How do we decide without it turning into a fight?',
      replies: [
        { who: 'Omar Khan', role: 'Mentor', text: 'Put both plans on one page. Years, cost, first job, and what happens if it does not work out. TVET stops sounding like giving up once a certificate and a mentor are named.' },
        { who: 'Raeka Persaud', role: 'Mentor', text: 'Staying is right for some gates. Pull the actual entry list for the programme you want and compare it against the other one.' }
      ]
    },
    { id: 'f9', kind: 'journey', journey: 'omar' },
    {
      id: 'f10', kind: 'story', anon: false, who: 'Aisha Mohamed', init: 'AM', time: '3 days ago', tag: 'Business',
      title: 'Ran the school stall for a term and kept a cash book.',
      text: 'The margin was smaller than I expected, and keeping records turned out to be the actual lesson. I stopped two weeks before exam block, which was the right call, because the stall would have eaten revision time it could not pay back.'
    },
    {
      id: 'f11', kind: 'question', anon: true, who: 'Form 4 student, Region 3', time: '4 days ago', tag: 'Creative and media',
      title: 'People keep telling me media is not a real career in Guyana. What proof should I be collecting?',
      replies: [
        { who: 'Marcus Gomes', role: 'Contributor', text: 'A weekly school reel, three shoots run like client work, and everything delivered on time. Show the work instead of arguing for it.' },
        { who: 'Form 5 student, Region 4', role: 'Student', text: 'Delivering on time is what changed how adults spoke to me about it.' }
      ]
    }
  ];

  var TOPICS = [
    'Subject choice',
    'Science and health',
    'Technology',
    'Building and fixing things',
    'Business',
    'Creative and media',
    'Sport and coaching',
    'After CSEC'
  ];

  var FILTERS = [
    { value: 'all', label: 'Everything' },
    { value: 'question', label: 'Questions' },
    { value: 'story', label: 'Stories' },
    { value: 'tip', label: 'Mentor tips' },
    { value: 'opportunity', label: 'Opportunities' },
    { value: 'journey', label: 'Journeys' }
  ];

  var STAGE_LABEL = {
    explore: 'Form 1 to 2, exploration',
    subject: 'Form 3, subject choice',
    csec: 'Form 4 to 5, CSEC',
    fork: 'After CSEC, the fork',
    special: 'Form 6 or institute, specialise',
    led: 'After that, where it led'
  };

  return {
    STAGES: STAGES,
    FY: FY,
    FY_CATALOGUE_EXTRA: FY_CATALOGUE_EXTRA,
    JOURNEYS: JOURNEYS,
    FEED: FEED,
    TOPICS: TOPICS,
    FILTERS: FILTERS,
    STAGE_LABEL: STAGE_LABEL
  };
})();
