/* Community pods. Prefix: pod-. People grid stays on pcard-. */
var PODS = [
  { id: 'life-csec', name: 'Life after CSEC', kind: 'decision', blurb: 'What happens between results day and whatever comes next.', tone: '#1f6feb', tint: '#e9f2fe', members: 418, open: true },
  { id: 'cape-subjects', name: 'Choosing CAPE subjects', kind: 'decision', blurb: 'Units, combinations and what they close off.', tone: '#7b3fe4', tint: '#f2ecfe', members: 312, open: true },
  { id: 'scholarships', name: 'Scholarships and paying for it', kind: 'decision', blurb: 'GOAL, government scholarships, fees and what is actually free.', tone: '#0a9d57', tint: '#e6faef', members: 287, open: true },
  { id: 'study-abroad', name: 'Study abroad', kind: 'decision', blurb: 'Applications, recognition and getting back to practise here.', tone: '#0891b2', tint: '#e4f6fb', members: 196, open: true },
  { id: 'science-health', name: 'Science and health', kind: 'career', blurb: 'Nursing, medicine, pharmacy, allied health.', tone: '#e11d48', tint: '#fdebf0', members: 154, open: true },
  { id: 'law-public', name: 'Law and public service', kind: 'career', blurb: 'UG LLB, Hugh Wooding, the public service route.', tone: '#4f46e5', tint: '#ecebfe', members: 98, open: true },
  { id: 'trades-tech', name: 'Trades and technical', kind: 'career', blurb: 'GTI, CVQ, apprenticeships, the sites.', tone: '#ea7317', tint: '#fdf0e4', members: 121, open: true },
  { id: 'technology', name: 'Technology', kind: 'career', blurb: 'Development, support, data, the oil-sector tech jobs.', tone: '#0ea5e9', tint: '#e6f5fe', members: 143, open: true },
  { id: 'creative-media', name: 'Creative and media', kind: 'career', blurb: 'Film, design, journalism and making work people can see.', tone: '#db2777', tint: '#fdebf4', members: 34, open: false, mentorsNeed: 4, mentorsHave: 2 },
  { id: 'sport-coaching', name: 'Sport and coaching', kind: 'career', blurb: 'School sport, coaching badges and how trials actually work.', tone: '#16a34a', tint: '#e8f9ee', members: 21, open: false, mentorsNeed: 4, mentorsHave: 2 }
];

var POD_STAFF = {
  'life-csec': ['raeka', 'omar', 'jerome', 'keisha'],
  'cape-subjects': ['raeka', 'jerome', 'keisha', 'marcus'],
  scholarships: ['raeka', 'omar', 'jerome', 'keisha'],
  'study-abroad': ['raeka', 'jerome', 'marcus', 'keisha'],
  'science-health': ['raeka', 'omar', 'jerome', 'keisha'],
  'law-public': ['raeka', 'jerome', 'keisha', 'marcus'],
  'trades-tech': ['omar', 'raeka', 'jerome', 'keisha'],
  technology: ['jerome', 'raeka', 'omar', 'marcus'],
  'creative-media': ['marcus', 'keisha'],
  'sport-coaching': ['keisha', 'omar']
};

var POD_THREADS = [];
var POD_PROPOSALS = [];
var POD_LOG = [];

function podIsoAgo(days, hours) {
  var d = new Date();
  d.setDate(d.getDate() - (days || 0));
  if (hours) d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function podSeedThreads() {
  if (POD_THREADS.length) return;
  POD_THREADS.push(
    {
      id: 'pt-life-1',
      podId: 'life-csec',
      type: 'question',
      title: 'Do I pick a job first or sit CAPE if my CSEC grades are mixed?',
      anon: false,
      askerId: 'darnell',
      askerName: 'Darnell J.',
      form: 'Form 5',
      region: 'Region 6',
      at: podIsoAgo(8),
      lastAt: podIsoAgo(0, 2),
      status: 'answered',
      answerId: 'pm-life-1b',
      shoutout: false,
      feedId: '',
      unread: 1,
      msgs: [
        {
          id: 'pm-life-1a',
          authorId: 'darnell',
          role: 'student',
          name: 'Darnell J.',
          initials: 'DJ',
          text: 'Do I pick a job first or sit CAPE if my CSEC grades are mixed?',
          at: podIsoAgo(8),
          isOp: true,
          likes: 0
        },
        {
          id: 'pm-life-1b',
          authorId: 'raeka',
          role: 'mentor',
          name: 'Raeka Persaud',
          initials: 'RP',
          text: 'Write both plans on one page. If Biology and Maths are the weak ones, CAPE science is a closed door this year. A job plus one evening subject is still a plan.',
          at: podIsoAgo(7),
          likes: 4
        },
        {
          id: 'pm-life-1c',
          authorId: 'nadia',
          role: 'student',
          name: 'Nadia',
          initials: 'N',
          text: 'Same in nursing. I have never met anyone who waited for perfect grades before they started.',
          at: podIsoAgo(0, 2),
          likes: 1
        }
      ]
    },
    {
      id: 'pt-life-2',
      podId: 'life-csec',
      type: 'question',
      title: 'If I fail English, can I still take a GTI trade this September?',
      anon: true,
      askerId: 'stu-anon-1',
      askerName: 'a student',
      realName: 'Kiran Ali',
      form: 'Form 4',
      region: 'Region 3',
      at: podIsoAgo(1),
      lastAt: podIsoAgo(1),
      status: 'waiting',
      answerId: '',
      shoutout: false,
      unread: 0,
      msgs: [
        {
          id: 'pm-life-2a',
          authorId: 'stu-anon-1',
          role: 'student',
          name: 'a student',
          realName: 'Kiran Ali',
          initials: 'S',
          text: 'If I fail English, can I still take a GTI trade this September?',
          at: podIsoAgo(1),
          isOp: true,
          anon: true,
          likes: 0
        }
      ]
    },
    {
      id: 'pt-cape-1',
      podId: 'cape-subjects',
      type: 'thought',
      title: 'I dropped a third CAPE unit and my week got usable again.',
      anon: false,
      askerId: 'aisha',
      askerName: 'Aisha Mohamed',
      form: 'Form 6',
      region: 'Region 4',
      at: podIsoAgo(3),
      lastAt: podIsoAgo(3),
      status: 'thought',
      answerId: '',
      shoutout: false,
      unread: 0,
      msgs: [
        {
          id: 'pm-cape-1a',
          authorId: 'aisha',
          role: 'student',
          name: 'Aisha Mohamed',
          initials: 'AM',
          text: 'I dropped a third CAPE unit and my week got usable again.',
          at: podIsoAgo(3),
          isOp: true,
          likes: 2
        }
      ]
    },
    {
      id: 'pt-sci-1',
      podId: 'science-health',
      type: 'question',
      title: 'Is nursing still open if I did not sit Biology in fourth form?',
      anon: true,
      askerId: 'stu-anon-2',
      askerName: 'a student',
      realName: 'Priya Singh',
      form: 'Form 4',
      region: 'Region 3',
      at: podIsoAgo(6),
      lastAt: podIsoAgo(5),
      status: 'answered',
      answerId: 'pm-sci-1b',
      shoutout: true,
      feedId: 'q-shout-pt-sci-1',
      unread: 0,
      msgs: [
        {
          id: 'pm-sci-1a',
          authorId: 'stu-anon-2',
          role: 'student',
          name: 'a student',
          realName: 'Priya Singh',
          initials: 'S',
          text: 'Is nursing still open if I did not sit Biology in fourth form?',
          at: podIsoAgo(6),
          isOp: true,
          anon: true,
          likes: 0
        },
        {
          id: 'pm-sci-1b',
          authorId: 'raeka',
          role: 'mentor',
          name: 'Raeka Persaud',
          initials: 'RP',
          text: 'Yes, if you pick Biology up now and keep Chemistry. Schools ask for the certificate, not the year you first sat it.',
          at: podIsoAgo(5),
          likes: 6
        }
      ]
    },
    {
      id: 'pt-sci-2',
      podId: 'science-health',
      type: 'question',
      title: 'Pharmacy vs med tech if I want to stay in Georgetown?',
      anon: false,
      askerId: 'form4-geo',
      askerName: 'Liam C.',
      form: 'Form 5',
      region: 'Region 4',
      at: podIsoAgo(2),
      lastAt: podIsoAgo(2),
      status: 'waiting',
      answerId: '',
      shoutout: false,
      unread: 0,
      msgs: [
        {
          id: 'pm-sci-2a',
          authorId: 'form4-geo',
          role: 'student',
          name: 'Liam C.',
          initials: 'LC',
          text: 'Pharmacy vs med tech if I want to stay in Georgetown?',
          at: podIsoAgo(2),
          isOp: true,
          likes: 0
        }
      ]
    },
    {
      id: 'pt-sci-3',
      podId: 'science-health',
      type: 'question',
      title: 'Can I do the GPHC volunteer hours while I am still in fifth form?',
      anon: false,
      askerId: 'form5-2',
      askerName: 'Maya R.',
      form: 'Form 5',
      region: 'Region 4',
      at: podIsoAgo(0, 5),
      lastAt: podIsoAgo(0, 5),
      status: 'waiting',
      answerId: '',
      shoutout: false,
      unread: 0,
      msgs: [
        {
          id: 'pm-sci-3a',
          authorId: 'form5-2',
          role: 'student',
          name: 'Maya R.',
          initials: 'MR',
          text: 'Can I do the GPHC volunteer hours while I am still in fifth form?',
          at: podIsoAgo(0, 5),
          isOp: true,
          likes: 0
        }
      ]
    }
  );
}

function podSeedFeedShout() {
  var i;
  var th = podThreadById('pt-sci-1');
  var item;
  if (!th || !FEED) return;
  for (i = 0; i < FEED.length; i++) {
    if (FEED[i].id === 'q-shout-pt-sci-1') return;
  }
  item = podFeedItemFromThread(th);
  if (item) FEED.unshift(item);
}

function ensurePod() {
  if (!S.pod) {
    S.pod = {
      tab: 'pods',
      sub: '',
      podId: '',
      threadId: '',
      threadFilter: 'all',
      composeKind: 'question',
      composeOpen: false,
      composeAnon: false,
      composeDraft: '',
      replyDraft: '',
      editMsgId: '',
      editText: '',
      deleteMsgId: '',
      reportMsgId: '',
      peopleFiltersOpen: false,
      msgMenuId: '',
      propose: { name: '', blurb: '', kind: 'decision', who: '' },
      joined: {},
      memberBump: {},
      unread: { 'life-csec': 2 },
      notices: [],
      shareBy: {},
      lastPostAt: 0,
      log: POD_LOG
    };
  }
  if (!S.safeguardCases) S.safeguardCases = [];
  if (!S.reported) S.reported = [];
  podSeedThreads();
  podSeedFeedShout();
  return S.pod;
}

function podIsStaffRole() {
  var r = postingRole();
  return r === 'mentor' || r === 'contributor' || r === 'admin';
}

function podCanPropose() {
  return podIsStaffRole();
}

function podIsoWeek(d) {
  var date = d ? new Date(d) : new Date();
  var onejan = new Date(date.getFullYear(), 0, 1);
  return date.getFullYear() + '-W' + String(Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7));
}

function podShareState() {
  var id = currentPosterId() || postingRole() || 'anon';
  var week = podIsoWeek();
  var row = S.pod.shareBy[id];
  if (!row || row.week !== week) {
    row = { week: week, count: 0 };
    S.pod.shareBy[id] = row;
  }
  return row;
}

function podSharesLeft() {
  return Math.max(0, 3 - podShareState().count);
}

function podById(id) {
  var i;
  for (i = 0; i < PODS.length; i++) {
    if (PODS[i].id === id) return PODS[i];
  }
  return null;
}

function podStaffIds(id) {
  return (POD_STAFF[id] || []).slice();
}

function podStaffCount(id) {
  return podStaffIds(id).length;
}

function podIsOpen(p) {
  if (!p) return false;
  if (p.kind === 'decision') return !!p.open;
  return !!p.open && podStaffCount(p.id) >= 4;
}

function podMentorsHave(p) {
  if (!p) return 0;
  if (p.mentorsHave != null) return p.mentorsHave;
  return podStaffCount(p.id);
}

function podNamesForPerson(id) {
  var names = [];
  var k;
  var i;
  var p;
  for (k in POD_STAFF) {
    if (!POD_STAFF.hasOwnProperty(k)) continue;
    if (POD_STAFF[k].indexOf(id) === -1) continue;
    p = podById(k);
    if (p) names.push(p.name);
  }
  return names;
}

function podAnswersInLine(id) {
  var names = podNamesForPerson(id);
  if (!names.length) return '';
  if (names.length === 1) return 'Answers in ' + names[0];
  if (names.length === 2) return 'Answers in ' + names[0] + ', ' + names[1];
  return 'Answers in ' + names[0] + ', ' + names[1];
}

function podMemberCount(p) {
  var extra = (S.pod.memberBump && S.pod.memberBump[p.id]) || 0;
  return (p.members || 0) + extra;
}

function podIsJoined(id) {
  return !!(S.pod.joined && S.pod.joined[id]);
}

function podJoin(id, quiet) {
  var p = podById(id);
  if (!p || podIsJoined(id)) return;
  S.pod.joined[id] = true;
  S.pod.memberBump[id] = (S.pod.memberBump[id] || 0) + 1;
  if (!quiet) toast('Joined ' + p.name + '.');
}

function podLeave(id) {
  if (!podIsJoined(id)) return;
  delete S.pod.joined[id];
  S.pod.memberBump[id] = Math.max(0, (S.pod.memberBump[id] || 1) - 1);
  toast('Left. Nobody is told.');
}

function podThreadsIn(podId) {
  var out = [];
  var i;
  for (i = 0; i < POD_THREADS.length; i++) {
    if (POD_THREADS[i].podId === podId) out.push(POD_THREADS[i]);
  }
  return out;
}

function podThreadById(id) {
  var i;
  for (i = 0; i < POD_THREADS.length; i++) {
    if (POD_THREADS[i].id === id) return POD_THREADS[i];
  }
  return null;
}

function podWaitingCount(podId) {
  var n = 0;
  var list = podThreadsIn(podId);
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].type === 'question' && list[i].status === 'waiting') n += 1;
  }
  return n;
}

function podMsgById(th, id) {
  var i;
  if (!th || !th.msgs) return null;
  for (i = 0; i < th.msgs.length; i++) {
    if (th.msgs[i].id === id) return th.msgs[i];
  }
  return null;
}

function podPeopleInThread(th) {
  var seen = {};
  var n = 0;
  var i;
  var id;
  if (!th || !th.msgs) return 0;
  for (i = 0; i < th.msgs.length; i++) {
    id = th.msgs[i].authorId || th.msgs[i].name || String(i);
    if (seen[id]) continue;
    seen[id] = true;
    n += 1;
  }
  return n;
}

function podAgoShort(iso) {
  if (typeof qaTimeAgo === 'function') return qaTimeAgo(iso);
  return timeAgo(iso);
}

function podChatAgo(iso) {
  if (!iso) return '';
  var then = new Date(iso);
  if (isNaN(then.getTime())) return '';
  var diff = Date.now() - then.getTime();
  if (diff < 0) diff = 0;
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return String(mins) + 'm ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return String(hrs) + 'h ago';
  var days = Math.floor(hrs / 24);
  if (days === 1) return '1d ago';
  if (days < 7) return String(days) + 'd ago';
  return podDayLabel(iso);
}

function podDayLabel(iso) {
  var d = new Date(iso);
  var now = new Date();
  if (isNaN(d.getTime())) return '';
  if (d.toDateString() === now.toDateString()) return 'Today';
  now.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return 'Yesterday';
  return String(d.getDate()) + ' ' + MONTHS_SHORT()[d.getMonth()];
}

function podViewer() {
  var form = S.form || (S.me && S.me.form) || 'Form 4';
  var region = S.region || (S.me && S.me.region) || 'Region 4';
  var name = (S.pw && S.pw.name && S.pw.name !== 'You' ? S.pw.name : '') || youName();
  var id = (typeof qaViewerId === 'function' && qaViewerId()) || currentPosterId() || 'you-student';
  var a = currentPosterId() ? author(currentPosterId()) : null;
  return {
    id: id,
    name: a && a.name ? a.name : name,
    initials: a && a.init ? a.init : (name.charAt(0) || 'Y').toUpperCase(),
    form: form,
    region: region,
    role: postingRole()
  };
}

function podRateOk() {
  var now = Date.now();
  if (S.pod.lastPostAt && now - S.pod.lastPostAt < 8000) return false;
  S.pod.lastPostAt = now;
  return true;
}

function podLog(kind, rec) {
  POD_LOG.push({ kind: kind, at: nowIso(), rec: rec });
  S.pod.log = POD_LOG;
}

function podAskerLine(th, withAsked) {
  var who;
  if (!th) return '';
  if (th.anon) who = 'a student, ' + th.form + ', ' + th.region;
  else who = th.askerName + ', ' + th.form + ', ' + th.region;
  return (withAsked ? 'Asked by ' : '') + who;
}

function podNewId(prefix) {
  return prefix + '-' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}

function podPostThread() {
  var p = podById(S.pod.podId);
  var kind = S.pod.composeKind || 'question';
  var text = (S.pod.composeDraft || '').trim();
  var me;
  var th;
  if (!p || !podIsOpen(p)) return;
  if (postingRole() === 'visitor') {
    toast('Sign in to post.');
    return;
  }
  if (!text) return;
  if (!podRateOk()) {
    toast('Wait a few seconds before the next post.');
    return;
  }
  me = podViewer();
  th = {
    id: podNewId('pt'),
    podId: p.id,
    type: kind,
    title: text,
    anon: !!(S.pod.composeAnon && postingRole() === 'student'),
    askerId: me.id,
    askerName: S.pod.composeAnon ? 'a student' : me.name,
    realName: me.name,
    form: me.form,
    region: me.region,
    at: nowIso(),
    lastAt: nowIso(),
    status: kind === 'thought' ? 'thought' : 'waiting',
    answerId: '',
    shoutout: false,
    unread: 0,
    msgs: [
      {
        id: podNewId('pm'),
        authorId: me.id,
        role: me.role,
        name: S.pod.composeAnon ? 'a student' : me.name,
        realName: me.name,
        initials: S.pod.composeAnon ? 'S' : me.initials,
        text: text,
        at: nowIso(),
        isOp: true,
        anon: !!(S.pod.composeAnon && postingRole() === 'student'),
        likes: 0,
        mine: true
      }
    ]
  };
  POD_THREADS.unshift(th);
  podJoin(p.id, true);
  S.pod.composeDraft = '';
  S.pod.composeOpen = false;
  podLog('thread', { id: th.id, podId: p.id });
  toast(kind === 'thought' ? 'Thought posted.' : 'Question posted.');
  render();
}

function podPostReply() {
  var th = podThreadById(S.pod.threadId);
  var text = (S.pod.replyDraft || '').trim();
  var me;
  var msg;
  if (!th) return;
  if (postingRole() === 'visitor') {
    toast('Sign in to post.');
    return;
  }
  if (!text) return;
  if (!podRateOk()) {
    toast('Wait a few seconds before the next post.');
    return;
  }
  me = podViewer();
  msg = {
    id: podNewId('pm'),
    authorId: me.id,
    role: me.role,
    name: me.name,
    realName: me.name,
    initials: me.initials,
    text: text,
    at: nowIso(),
    likes: 0,
    mine: true
  };
  th.msgs.push(msg);
  th.lastAt = msg.at;
  S.pod.replyDraft = '';
  podJoin(th.podId, true);
  podLog('msg', { id: msg.id, threadId: th.id });
  render();
}

function podMarkAnswer(threadId, msgId) {
  var th = podThreadById(threadId);
  var msg = th ? podMsgById(th, msgId) : null;
  if (!th || !msg || !podIsStaffRole()) return;
  if (msg.role !== 'mentor' && msg.role !== 'contributor' && msg.role !== 'admin') {
    toast('Mark a mentor message.');
    return;
  }
  th.answerId = msg.id;
  if (th.type === 'question') th.status = 'answered';
  S.pod.msgMenuId = '';
  toast(th.type === 'thought' ? 'Reply marked.' : 'Answer marked.');
  render();
}

function podFeedItemFromThread(th) {
  var p = podById(th.podId);
  var ans = podMsgById(th, th.answerId);
  var replies = [];
  if (ans) {
    replies.push({
      a: ans.authorId,
      authorId: ans.authorId,
      text: ans.text,
      createdAt: ans.at
    });
  }
  return {
    id: th.feedId || 'q-shout-' + th.id,
    kind: 'question',
    shoutout: true,
    shoutType: th.type,
    podId: th.podId,
    podName: p ? p.name : '',
    podThreadId: th.id,
    at: nowIso(),
    cat: '',
    topics: [],
    anon: !!th.anon,
    who: podAskerLine(th, false),
    asker: th.anon ? 'a student, ' + th.form + ', ' + th.region : th.askerName,
    title: th.title,
    question: th.title,
    askedAt: th.form,
    form: th.form,
    region: th.region,
    replies: replies
  };
}

function podShareThread(threadId) {
  var th = podThreadById(threadId);
  var item;
  var left;
  var notice;
  if (!th || !podIsStaffRole()) return;
  if (!th.answerId) {
    toast('Mark a message as the answer to share it.');
    return;
  }
  left = podSharesLeft();
  if (left <= 0) {
    toast('No shares left this week.');
    return;
  }
  if (th.shoutout && th.feedId) {
    toast('Already shared.');
    return;
  }
  th.shoutout = true;
  th.feedId = 'q-shout-' + th.id;
  item = podFeedItemFromThread(th);
  FEED.unshift(item);
  podShareState().count += 1;
  notice = {
    id: podNewId('pn'),
    threadId: th.id,
    podId: th.podId,
    askerId: th.askerId,
    title: th.title,
    at: nowIso()
  };
  S.pod.notices.push(notice);
  if (S.view !== 'alerts') S.unread = (S.unread || 0) + 1;
  podLog('share', { threadId: th.id, feedId: th.feedId });
  toast('Shared. The asker is told.');
  render();
}

function podOwnMsg(msg) {
  var me = podViewer();
  if (!msg) return false;
  if (msg.mine) return true;
  if (msg.authorId && msg.authorId === me.id) return true;
  return false;
}

function podSaveEdit() {
  var th = podThreadById(S.pod.threadId);
  var msg = th ? podMsgById(th, S.pod.editMsgId) : null;
  var text = (S.pod.editText || '').trim();
  if (!msg || !podOwnMsg(msg) || !text) return;
  msg.text = text;
  msg.edited = true;
  if (msg.isOp) th.title = text;
  S.pod.editMsgId = '';
  S.pod.editText = '';
  render();
}

function podDeleteMsg(threadId, msgId) {
  var th = podThreadById(threadId);
  var msg;
  var i;
  if (!th) return;
  msg = podMsgById(th, msgId);
  if (!msg || !podOwnMsg(msg)) return;
  if (th.answerId === msgId) {
    th.answerId = '';
    if (th.type === 'question') th.status = 'waiting';
  }
  th.msgs = th.msgs.filter(function (m) {
    return m.id !== msgId;
  });
  S.pod.deleteMsgId = '';
  if (!th.msgs.length) {
    for (i = 0; i < POD_THREADS.length; i++) {
      if (POD_THREADS[i].id === th.id) {
        POD_THREADS.splice(i, 1);
        break;
      }
    }
    if (th.feedId) {
      FEED = FEED.filter(function (it) {
        return it.id !== th.feedId;
      });
    }
    S.pod.sub = 'pod';
    S.pod.threadId = '';
    toast('Thread removed.');
    render();
    return;
  }
  th.lastAt = th.msgs[th.msgs.length - 1].at;
  toast('Deleted.');
  render();
}

function podLike(threadId, msgId) {
  var th = podThreadById(threadId);
  var msg = th ? podMsgById(th, msgId) : null;
  if (!msg || msg.isOp) return;
  if (msg.liked) {
    msg.liked = false;
    msg.likes = Math.max(0, (msg.likes || 0) - 1);
  } else {
    msg.liked = true;
    msg.likes = (msg.likes || 0) + 1;
  }
  render();
}

function podReportMsg(threadId, msgId, reason) {
  var th = podThreadById(threadId);
  var msg = th ? podMsgById(th, msgId) : null;
  var key;
  if (!msg) return;
  key = 'podmsg:' + th.id + ':' + msg.id;
  if (reason === 'worry') {
    S.safeguardCases.push({
      key: key,
      reason: reason,
      at: nowIso(),
      queue: 'safeguarding',
      authorTrue: msg.realName || msg.name,
      text: msg.text
    });
    toast('Sent to the safeguarding team. Someone will review it today.');
  } else {
    S.reported.push({
      key: key,
      reason: reason || 'unkind',
      at: nowIso(),
      queue: 'desk',
      authorTrue: msg.realName || msg.name,
      text: msg.text
    });
    toast('Report sent. Thank you for telling us.');
  }
  S.pod.reportMsgId = '';
  render();
}

function podSubmitPropose() {
  var pr = S.pod.propose;
  var name = (pr.name || '').trim();
  var me;
  if (!podCanPropose() || !name) return;
  me = podViewer();
  POD_PROPOSALS.unshift({
    id: podNewId('pp'),
    name: name,
    blurb: (pr.blurb || '').trim(),
    kind: pr.kind === 'career' ? 'career' : 'decision',
    who: (pr.who || '').trim(),
    byId: me.id,
    byName: me.name,
    at: nowIso()
  });
  S.pod.propose = { name: '', blurb: '', kind: 'decision', who: '' };
  S.pod.sub = '';
  toast('Sent for review.');
  render();
}

function podApproveProposal(id) {
  var i;
  var pr;
  var slug;
  var pod;
  if (postingRole() !== 'admin') return;
  for (i = 0; i < POD_PROPOSALS.length; i++) {
    if (POD_PROPOSALS[i].id === id) {
      pr = POD_PROPOSALS[i];
      POD_PROPOSALS.splice(i, 1);
      break;
    }
  }
  if (!pr) return;
  slug = pr.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 28) || podNewId('pod');
  pod = {
    id: slug,
    name: pr.name,
    kind: pr.kind,
    blurb: pr.blurb || pr.name,
    tone: '#64748b',
    tint: '#f3f4f6',
    members: 0,
    open: false,
    mentorsNeed: 4,
    mentorsHave: 0,
    fromProposal: true
  };
  PODS.push(pod);
  POD_STAFF[pod.id] = [];
  toast('Opened as Opening soon.');
  render();
}

function podRejectProposal(id) {
  var i;
  if (postingRole() !== 'admin') return;
  for (i = 0; i < POD_PROPOSALS.length; i++) {
    if (POD_PROPOSALS[i].id === id) {
      POD_PROPOSALS.splice(i, 1);
      break;
    }
  }
  toast('Proposal rejected.');
  render();
}

function podOpenRoom(id) {
  var p = podById(id);
  if (!p || !podIsOpen(p)) return;
  hideSheetUi();
  S.view = 'community';
  S.pod.sub = 'pod';
  S.pod.podId = id;
  S.pod.threadId = '';
  S.pod.threadFilter = 'all';
  S.pod.unread[id] = 0;
  render();
}

function podOpenThread(podId, threadId) {
  var th = podThreadById(threadId);
  hideSheetUi();
  S.view = 'community';
  S.pod.tab = 'pods';
  S.pod.sub = 'thread';
  S.pod.podId = podId || (th && th.podId) || S.pod.podId;
  S.pod.threadId = threadId;
  if (th) th.unread = 0;
  render();
}

function podOpenFromFeed(item) {
  if (!item || !item.podThreadId) return false;
  ensurePod();
  podOpenThread(item.podId, item.podThreadId);
  return true;
}

function podSvgTick() {
  return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.4 2.4L16 9"/></svg>';
}
function podSvgQ() {
  return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.2 2.4c-.8.4-1.2.9-1.2 1.8"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>';
}
function podSvgTalk() {
  return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 16V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3z"/></svg>';
}
function podSvgChevron() {
  return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
}
function podSvgMore() {
  return '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
}
function podBackBtn(target, label) {
  return (
    '<button type="button" class="pod-back" data-pod-back="' +
    esc(target) +
    '">' +
    podSvgChevron() +
    esc(label) +
    '</button>'
  );
}
function podMsgAvClass(msg) {
  var pe = msg.authorId && typeof personById === 'function' ? personById(msg.authorId) : null;
  var n = 0;
  var i;
  if (pe && pe.av) return pe.av;
  if (msg.role === 'mentor') return 'av-1';
  if (msg.role === 'contributor') return 'av-3';
  if (msg.authorId) {
    for (i = 0; i < msg.authorId.length; i++) n += msg.authorId.charCodeAt(i);
    return ['av-2', 'av-4', 'av-5', 'av-3'][n % 4];
  }
  return 'av-5';
}
function podMsgKind(msg) {
  if (msg.role === 'mentor') return 'mentor';
  if (msg.role === 'contributor' || msg.role === 'admin') return 'staff';
  return 'student';
}

function podOpMsg(th) {
  var i;
  if (!th || !th.msgs) return null;
  for (i = 0; i < th.msgs.length; i++) {
    if (th.msgs[i].isOp) return th.msgs[i];
  }
  return th.msgs[0] || null;
}

function podRenderTabs() {
  return (
    '<div class="pod-tabs" role="tablist">' +
    '<button type="button" class="pod-tab" role="tab" aria-selected="' +
    (S.pod.tab !== 'people' ? 'true' : 'false') +
    '" data-pod-tab="pods">Pods</button>' +
    '<button type="button" class="pod-tab" role="tab" aria-selected="' +
    (S.pod.tab === 'people' ? 'true' : 'false') +
    '" data-pod-tab="people">People</button></div>'
  );
}

function podCardMark(p) {
  var unread = S.pod.unread[p.id] || 0;
  if (unread > 0) return '<span class="pod-unread">' + unread + '</span>';
  if (podIsJoined(p.id)) return '<span class="pod-joined">✓ Joined</span>';
  return '';
}

function podRenderCard(p) {
  var wait = podWaitingCount(p.id);
  var threads = podThreadsIn(p.id).length;
  var open = podIsOpen(p);
  var have = podMentorsHave(p);
  var need = p.mentorsNeed || 4;
  var html =
    '<button type="button" class="pod-card' +
    (open ? '' : ' is-closed') +
    '" style="--pod-tone:' +
    esc(p.tone) +
    ';--pod-tint:' +
    esc(p.tint) +
    '"' +
    (open ? ' data-pod-open="' + esc(p.id) + '"' : ' disabled') +
    '>' +
    '<div class="pod-card-top"><strong class="pod-card-name">' +
    esc(p.name) +
    '</strong>' +
    podCardMark(p) +
    '</div><p class="pod-card-blurb">' +
    esc(p.blurb) +
    '</p><div class="pod-card-foot">';
  if (open) {
    html +=
      '<span>' +
      podMemberCount(p) +
      ' members · ' +
      threads +
      (threads === 1 ? ' thread' : ' threads') +
      '</span>';
    if (wait) {
      html +=
        '<span class="pod-wait"><i></i>' + wait + ' waiting</span>';
    }
  } else {
    html +=
      '<span>' +
      podMemberCount(p) +
      ' members</span><span class="pod-meter"><span class="pod-meter-bar"><span style="width:' +
      Math.round((have / need) * 100) +
      '%"></span></span>' +
      have +
      ' of ' +
      need +
      ' mentors</span>';
  }
  html += '</div></button>';
  return html;
}

function podRenderProposalCard(pr) {
  var html =
    '<article class="pod-card is-proposed" style="--pod-tone:#9aa3ad;--pod-tint:#f3f4f6">' +
    '<div class="pod-card-top"><strong class="pod-card-name">' +
    esc(pr.name) +
    '</strong></div><p class="pod-card-blurb">' +
    esc(pr.blurb || 'Waiting on review') +
    '</p><div class="pod-card-foot"><span>Proposed by ' +
    esc(pr.byName) +
    '</span><span>Waiting on review</span></div>';
  if (postingRole() === 'admin') {
    html +=
      '<div class="pod-admin-acts"><button type="button" class="pod-open-it" data-pod-approve="' +
      esc(pr.id) +
      '">Open it</button><button type="button" class="pod-reject" data-pod-reject="' +
      esc(pr.id) +
      '">Reject</button></div>';
  }
  html += '</article>';
  return html;
}

function podRenderGroup(title, list, proposed) {
  var html;
  var i;
  if (!list.length && !(proposed && proposed.length)) return '';
  html = '<section class="pod-group"><h2>' + esc(title) + '</h2><div class="pod-grid">';
  if (proposed) {
    for (i = 0; i < proposed.length; i++) html += podRenderProposalCard(proposed[i]);
  }
  for (i = 0; i < list.length; i++) html += podRenderCard(list[i]);
  html += '</div></section>';
  return html;
}

function podNoticesHtml() {
  var me = podViewer();
  var out = [];
  var i;
  var n;
  for (i = 0; i < S.pod.notices.length; i++) {
    n = S.pod.notices[i];
    if (n.askerId && (n.askerId === me.id || n.askerId === 'you-student')) out.push(n);
  }
  if (!out.length) return '';
  return (
    '<p class="pod-note">Your question was shared to the Feed: ' +
    esc(out[out.length - 1].title) +
    '.</p>'
  );
}

function podRenderPodsHome() {
  var decision = [];
  var career = [];
  var soon = [];
  var i;
  var p;
  for (i = 0; i < PODS.length; i++) {
    p = PODS[i];
    if (!podIsOpen(p)) soon.push(p);
    else if (p.kind === 'decision') decision.push(p);
    else career.push(p);
  }
  return (
    '<div class="pod-home-head"><h2>Pods</h2>' +
    (podCanPropose()
      ? '<button type="button" class="pod-propose-btn" data-pod-propose="1">Propose a pod</button>'
      : '') +
    '</div>' +
    podNoticesHtml() +
    podRenderGroup('Proposed', [], POD_PROPOSALS) +
    podRenderGroup('By where you are', decision) +
    podRenderGroup('By field', career) +
    podRenderGroup('Opening soon', soon)
  );
}

function podPeopleTools() {
  var open = !!S.pod.peopleFiltersOpen;
  var html =
    '<div class="pod-people-tools"><div class="comm-search">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
    '<input type="search" id="q" value="' +
    esc(S.commQ || '') +
    '" placeholder="Search a name or a career" aria-label="Search a name or a career" autocomplete="off"/></div>' +
    '<button type="button" class="pod-filters-btn" data-pod-filters="1" aria-expanded="' +
    (open ? 'true' : 'false') +
    '">Filters</button></div>';
  if (open) {
    html += '<div class="pod-filter-panel" id="pod-filter-panel">';
    html += '<h3>Who</h3><div class="pod-filter-row">';
    html += commChip('Everyone', S.commRole === 'all', 'data-comm-role="all"');
    html += commChip('Mentors', S.commRole === 'mentors', 'data-comm-role="mentors"');
    html += commChip('Contributors', S.commRole === 'contributors', 'data-comm-role="contributors"');
    html += '</div><h3>Field</h3><div class="pod-filter-row">';
    html += commChip('All careers', !S.commCareer, 'data-comm-career=""');
    for (var i = 0; i < CAREER_FILTERS.length; i++) {
      html += commChip(
        CAREER_FILTERS[i],
        S.commCareer === CAREER_FILTERS[i],
        'data-comm-career="' + esc(CAREER_FILTERS[i]) + '"'
      );
    }
    html +=
      '</div><div class="pod-filter-acts"><button type="button" class="pod-filter-clear" data-pod-clear="1">Clear all</button>' +
      '<button type="button" class="pod-filter-done" data-pod-filters-done="1">Done</button></div></div>';
  } else {
    html += '<div class="pod-applied">';
    if (S.commRole === 'mentors') {
      html +=
        '<span class="pod-applied-chip">Mentors <button type="button" class="pod-applied-x" data-comm-role="all" aria-label="Clear Mentors">✕</button></span>';
    }
    if (S.commRole === 'contributors') {
      html +=
        '<span class="pod-applied-chip">Contributors <button type="button" class="pod-applied-x" data-comm-role="all" aria-label="Clear Contributors">✕</button></span>';
    }
    if (S.commCareer) {
      html +=
        '<span class="pod-applied-chip">' +
        esc(S.commCareer) +
        ' <button type="button" class="pod-applied-x" data-comm-career="" aria-label="Clear field">✕</button></span>';
    }
    html += '</div>';
  }
  return html;
}

function podRenderPeople() {
  var dir = filteredPeople();
  var followed = followedPeople();
  var html = podPeopleTools();
  if (followed.length) {
    html +=
      '<section class="comm-sec"><h2>People you follow · ' +
      followed.length +
      '</h2>' +
      personCardsHtml(followed) +
      '</section>';
  }
  html += '<section class="comm-sec"><h2>Mentors and contributors · ' + dir.length + '</h2>';
  if (!dir.length) {
    html +=
      '<div class="comm-empty"><p class="comm-empty-t">Nobody matches that</p><p>Try a shorter word, or clear the filters.</p></div>';
  } else html += personCardsHtml(dir);
  html += '</section>';
  return html;
}

function renderPodCommunity() {
  ensurePod();
  if (S.commRole === 'likeme') S.commRole = 'all';
  if (S.pod.sub === 'thread') return podRenderThread();
  if (S.pod.sub === 'pod') return podRenderRoom();
  if (S.pod.sub === 'propose') return podRenderPropose();
  if (S.pod.sub === 'staff') return podRenderStaff();
  return (
    '<div class="page-comm pod-page"><h1>Community</h1>' +
    podRenderTabs() +
    (S.pod.tab === 'people' ? podRenderPeople() : podRenderPodsHome()) +
    '</div>'
  );
}

function podAvHtml(id) {
  var a = author(id);
  var p = personById(id);
  var cls = (p && p.av) || 'av-1';
  return (
    '<span class="pod-av av ' +
    esc(cls) +
    '">' +
    esc((a && a.init) || '?') +
    '</span>'
  );
}

function podRenderRoom() {
  var p = podById(S.pod.podId);
  var staff;
  var i;
  var list;
  var html;
  var wait;
  if (!p) return '<div class="page-comm pod-page"><p class="pod-note">Missing pod.</p></div>';
  staff = podStaffIds(p.id);
  wait = podWaitingCount(p.id);
  list = podFilteredThreads(p.id);
  html =
    '<div class="page-comm pod-page pod-room">' +
    podBackBtn('home', 'Back to pods') +
    '<header class="pod-hero" style="--pod-tone:' +
    esc(p.tone || '#1f6feb') +
    ';--pod-tint:' +
    esc(p.tint || '#e9f2fe') +
    '"><p class="pod-kicker">' +
    (p.kind === 'career' ? 'Career pod' : 'Decision pod') +
    '</p><h1 class="pod-title">' +
    esc(p.name) +
    '</h1><p class="pod-blurb">' +
    esc(p.blurb) +
    '</p><div class="pod-hero-bar"><div class="pod-hero-meta"><div class="pod-avs">';
  for (i = 0; i < staff.length && i < 4; i++) html += podAvHtml(staff[i]);
  html +=
    '</div><span class="pod-members">' +
    podMemberCount(p) +
    ' members</span></div><div class="pod-hero-acts">' +
    '<button type="button" class="pod-join' +
    (podIsJoined(p.id) ? ' is-on' : '') +
    '" data-pod-toggle="' +
    esc(p.id) +
    '">' +
    (podIsJoined(p.id) ? 'Leave pod' : 'Join pod') +
    '</button><button type="button" class="pod-staff-btn" data-pod-staff="' +
    esc(p.id) +
    '">Mentors · ' +
    staff.length +
    '</button></div></div></header>';
  html +=
    '<section class="pod-ask' +
    (S.pod.composeOpen ? ' is-open' : '') +
    '"><h2>Ask a question or share a thought</h2><div class="pod-kinds">' +
    '<button type="button" class="pod-kind" aria-pressed="' +
    (S.pod.composeOpen && S.pod.composeKind !== 'thought' ? 'true' : 'false') +
    '" data-pod-kind="question">A question</button>' +
    '<button type="button" class="pod-kind" aria-pressed="' +
    (S.pod.composeOpen && S.pod.composeKind === 'thought' ? 'true' : 'false') +
    '" data-pod-kind="thought">A thought</button></div>';
  if (S.pod.composeOpen) {
    html +=
      '<textarea id="pod-ask-text" rows="3" placeholder="' +
      (S.pod.composeKind === 'thought'
        ? 'Something you worked out, or something you are turning over.'
        : 'Ask the thing you actually want to know.') +
      '">' +
      esc(S.pod.composeDraft || '') +
      '</textarea><div class="pod-ask-foot"><label class="pod-anon"><input type="checkbox" id="pod-anon"' +
      (S.pod.composeAnon ? ' checked' : '') +
      '/> Ask anonymously</label>' +
      '<button type="button" class="pod-post" data-pod-ask="1"' +
      ((S.pod.composeDraft || '').trim() ? '' : ' disabled') +
      '>Post</button></div>';
  }
  html += '</section>';
  html +=
    '<div class="pod-chips" role="group">' +
    '<button type="button" class="pod-chip" aria-pressed="' +
    (S.pod.threadFilter === 'all' ? 'true' : 'false') +
    '" data-pod-tfilter="all">All</button>' +
    '<button type="button" class="pod-chip" aria-pressed="' +
    (S.pod.threadFilter === 'answered' ? 'true' : 'false') +
    '" data-pod-tfilter="answered">Answered</button>' +
    '<button type="button" class="pod-chip" aria-pressed="' +
    (S.pod.threadFilter === 'waiting' ? 'true' : 'false') +
    '" data-pod-tfilter="waiting">Waiting · ' +
    wait +
    '</button>' +
    '<button type="button" class="pod-chip" aria-pressed="' +
    (S.pod.threadFilter === 'thoughts' ? 'true' : 'false') +
    '" data-pod-tfilter="thoughts">Thoughts</button></div>';
  html += '<div class="pod-list">';
  for (i = 0; i < list.length; i++) html += podRenderRow(list[i]);
  if (!list.length) html += '<p class="pod-note">Nothing in this filter yet.</p>';
  html += '</div></div>';
  return html;
}

function podFilteredThreads(podId) {
  var list = podThreadsIn(podId);
  var f = S.pod.threadFilter || 'all';
  var out = [];
  var i;
  var th;
  for (i = 0; i < list.length; i++) {
    th = list[i];
    if (f === 'answered' && th.status !== 'answered') continue;
    if (f === 'waiting' && (th.type !== 'question' || th.status !== 'waiting')) continue;
    if (f === 'thoughts' && th.type !== 'thought') continue;
    out.push(th);
  }
  out.sort(function (a, b) {
    return new Date(b.lastAt || b.at) - new Date(a.lastAt || a.at);
  });
  return out;
}

function podLastPreview(th) {
  var msg;
  if (!th.msgs || !th.msgs.length) return '';
  msg = th.msgs[th.msgs.length - 1];
  return (msg.name || 'Someone') + ': ' + (msg.text || '');
}

function podRowStatus(th) {
  if (th.type === 'thought') return { svg: podSvgTalk(), badge: 'Thought', cls: '' };
  if (th.status === 'answered') return { svg: podSvgTick(), badge: 'Answered', cls: 'is-ans' };
  return { svg: podSvgQ(), badge: 'Waiting', cls: 'is-wait' };
}

function podRenderRow(th) {
  var st = podRowStatus(th);
  var left = podIsStaffRole() ? podSharesLeft() : 0;
  var html =
    '<article class="pod-row-wrap"><button type="button" class="pod-row" data-pod-thread="' +
    esc(th.id) +
    '"><span class="pod-status is-' +
    (th.type === 'thought' ? 'thought' : th.status === 'answered' ? 'ans' : 'wait') +
    '">' +
    st.svg +
    '</span><span class="pod-row-main"><strong class="pod-row-q">' +
    esc(th.title) +
    '</strong><span class="pod-row-last">' +
    esc(podLastPreview(th)) +
    '</span><span class="pod-row-meta">' +
    esc(th.form + ', ' + th.region) +
    ' · ' +
    th.msgs.length +
    (th.msgs.length === 1 ? ' message' : ' messages') +
    ' · ' +
    podPeopleInThread(th) +
    ' in it · ' +
    esc(podAgoShort(th.lastAt || th.at)) +
    '</span></span><span class="pod-row-side">';
  if (th.unread) html += '<span class="pod-unread">' + th.unread + '</span>';
  html += '<span class="pod-badge ' + st.cls + '">' + esc(st.badge) + '</span>';
  if (th.shoutout) html += '<span class="pod-shout">Shoutout</span>';
  html += '</span></button>';
  if (podIsStaffRole() && th.answerId && !th.shoutout) {
    html +=
      '<div class="pod-row-bar"><button type="button" class="pod-share" data-pod-share="' +
      esc(th.id) +
      '"' +
      (left ? '' : ' disabled') +
      '>Share' +
      (left ? ' · ' + left + ' left' : '') +
      '</button></div>';
  }
  html += '</article>';
  return html;
}

function podRenderStaff() {
  var p = podById(S.pod.podId);
  var staff = p ? podStaffIds(p.id) : [];
  var html;
  var i;
  var id;
  var a;
  var pe;
  html =
    '<div class="page-comm pod-page pod-staff">' +
    podBackBtn('pod', 'Back to pod') +
    '<header class="pod-hero"><p class="pod-kicker">Who answers here</p><h1 class="pod-title">' +
    esc(p ? p.name : 'Pod') +
    '</h1></header>';
  for (i = 0; i < staff.length; i++) {
    id = staff[i];
    a = author(id);
    pe = personById(id);
    html +=
      '<div class="pod-staff-row"><span class="pod-staff-av av ' +
      esc((pe && pe.av) || 'av-1') +
      '">' +
      esc((a && a.init) || '?') +
      '</span><div class="minw"><strong>' +
      esc((a && a.name) || id) +
      '</strong><p class="pod-row-meta">' +
      esc((pe && pe.title) || (a && a.pos) || '') +
      '</p>' +
      roleBadgeHtml(a) +
      '</div>' +
      followPersonBtn(id, '') +
      '</div>';
  }
  return html + '</div>';
}

function podRenderPropose() {
  var pr = S.pod.propose;
  var can = !!(pr.name || '').trim();
  return (
    '<div class="page-comm pod-page pod-propose-page">' +
    podBackBtn('home', 'Back to pods') +
    '<header class="pod-hero"><p class="pod-kicker">Mentors and contributors</p><h1 class="pod-title">Propose a pod</h1></header>' +
    '<form class="pod-form" onsubmit="return false">' +
    '<label>Name<input type="text" id="pod-pr-name" value="' +
    esc(pr.name) +
    '"/></label>' +
    '<label>What it is for<input type="text" id="pod-pr-blurb" value="' +
    esc(pr.blurb) +
    '"/></label>' +
    '<label>Kind<select id="pod-pr-kind"><option value="decision"' +
    (pr.kind !== 'career' ? ' selected' : '') +
    '>Where you are</option><option value="career"' +
    (pr.kind === 'career' ? ' selected' : '') +
    '>By field</option></select></label>' +
    '<label>Who would answer<textarea id="pod-pr-who" rows="3">' +
    esc(pr.who) +
    '</textarea></label>' +
    '<button type="button" class="pod-form-send" data-pod-propose-send="1"' +
    (can ? '' : ' disabled') +
    '>Send</button></form></div>'
  );
}

function podRenderThread() {
  var th = podThreadById(S.pod.threadId);
  var p = th ? podById(th.podId) : null;
  var html;
  var left;
  var st;
  var op;
  if (!th) return '<div class="page-comm pod-page"><p class="pod-note">Missing thread.</p></div>';
  st = podRowStatus(th);
  left = podSharesLeft();
  op = podOpMsg(th);
  html =
    '<div class="page-comm pod-page pod-thread">' +
    podBackBtn('pod', 'Back') +
    '<header class="pod-banner" style="--pod-tone:' +
    esc((p && p.tone) || '#1f6feb') +
    '"><p class="pod-banner-kicker">' +
    esc(p ? p.name + ' pod' : 'Pod') +
    '</p>';
  if (op && S.pod.editMsgId === op.id) {
    html +=
      '<textarea class="pod-banner-edit" id="pod-edit-text">' +
      esc(S.pod.editText || th.title) +
      '</textarea><div class="pod-banner-acts"><button type="button" class="pod-banner-share" data-pod-edit-save="1">Save</button>' +
      '<button type="button" class="pod-banner-act" data-pod-edit-cancel="1">Keep</button></div>';
  } else {
    html += '<h1 class="pod-banner-title">' + esc(th.title) + '</h1>';
  }
  html +=
    '<p class="pod-banner-meta">' +
    esc(podAskerLine(th, true)) +
    ' · ' +
    esc(podChatAgo(th.at)) +
    ' · ' +
    th.msgs.length +
    (th.msgs.length === 1 ? ' message' : ' messages') +
    '</p><div class="pod-banner-acts"><span class="pod-banner-badge">' +
    st.svg +
    esc(st.badge) +
    '</span>';
  if (podIsStaffRole()) {
    if (th.answerId) {
      html +=
        '<button type="button" class="pod-banner-share" data-pod-share="' +
        esc(th.id) +
        '"' +
        (th.shoutout || !left ? ' disabled' : '') +
        '>' +
        (th.shoutout ? 'Shared' : 'Share · ' + left + ' left') +
        '</button>';
    } else {
      html += '<span class="pod-banner-hint">Mark a message as the answer to share it</span>';
    }
  }
  if (op && S.pod.editMsgId !== op.id) {
    html +=
      '<button type="button" class="pod-banner-act" data-pod-report="' +
      esc(op.id) +
      '">Report</button>';
    if (podOwnMsg(op)) {
      html +=
        '<button type="button" class="pod-banner-act" data-pod-edit="' +
        esc(op.id) +
        '">Edit</button><button type="button" class="pod-banner-act" data-pod-del="' +
        esc(op.id) +
        '">Delete</button>';
    }
  }
  html += '</div>';
  if (op && S.pod.deleteMsgId === op.id) {
    html +=
      '<div class="pod-confirm is-on-banner"><button type="button" class="pod-confirm-yes" data-pod-del-sure="' +
      esc(op.id) +
      '">Delete for good</button><button type="button" class="pod-confirm-keep" data-pod-del-keep="1">Keep</button></div>';
  }
  if (op && S.pod.reportMsgId === op.id) {
    html +=
      '<div class="pod-confirm is-on-banner"><button type="button" class="pod-confirm-yes" data-pod-report-go="worry">Someone may be at risk</button>' +
      '<button type="button" class="pod-confirm-keep" data-pod-report-go="unkind">Unkind</button>' +
      '<button type="button" class="pod-confirm-keep" data-pod-report-keep="1">Keep</button></div>';
  }
  html += '</header><div class="pod-chat">' + podRenderLog(th) + '</div>';
  html +=
    '<div class="pod-composer"><label class="sr" for="pod-reply">Message the pod</label>' +
    '<textarea id="pod-reply" rows="1" placeholder="Message the pod">' +
    esc(S.pod.replyDraft || '') +
    '</textarea><button type="button" class="pod-send" data-pod-reply="1" aria-label="Send">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
    '</button></div></div>';
  return html;
}

function podRenderLog(th) {
  var html = '';
  var i;
  var msg;
  var day;
  var prevDay = '';
  if (!th.msgs || !th.msgs.length) return '';
  for (i = 0; i < th.msgs.length; i++) {
    msg = th.msgs[i];
    if (msg.isOp) continue;
    day = podDayLabel(msg.at);
    if (day && day !== prevDay) {
      html += '<div class="pod-day"><span>' + esc(day) + '</span></div>';
      prevDay = day;
    }
    html += podRenderBubble(th, msg);
  }
  return html;
}

function podMsgName(msg) {
  if (msg.anon) return 'Anonymous';
  return msg.name || 'A student';
}

function podMsgTools(th, msg) {
  var staff = msg.role === 'mentor' || msg.role === 'contributor' || msg.role === 'admin';
  var html = '<div class="pod-tools">';
  if (!msg.isOp) {
    html +=
      '<button type="button" class="pod-react' +
      (msg.liked ? ' is-on' : '') +
      '" data-pod-like="' +
      esc(msg.id) +
      '" aria-label="Thumbs up">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 11v9H4v-9h3zm3 9h7.2a2 2 0 0 0 1.9-1.4l1.3-4.2A1.5 1.5 0 0 0 19 12h-5l.8-4.2A1.6 1.6 0 0 0 15 6c-.8 0-1.4.5-1.7 1.2L10 12v8z"/></svg>' +
      (msg.likes ? '<span>' + msg.likes + '</span>' : '') +
      '</button>';
  }
  html +=
    '<button type="button" class="pod-msg-act" data-pod-report="' +
    esc(msg.id) +
    '">Report</button>';
  if (podIsStaffRole() && staff && !msg.isOp) {
    html +=
      '<button type="button" class="pod-msg-act" data-pod-mark="' +
      esc(msg.id) +
      '">Mark as the answer</button>';
  }
  if (podOwnMsg(msg) && S.pod.editMsgId !== msg.id) {
    html +=
      '<button type="button" class="pod-msg-act" data-pod-edit="' +
      esc(msg.id) +
      '">Edit</button><button type="button" class="pod-msg-act" data-pod-del="' +
      esc(msg.id) +
      '">Delete</button>';
  }
  if (S.pod.deleteMsgId === msg.id) {
    html +=
      '<div class="pod-confirm"><button type="button" class="pod-confirm-yes" data-pod-del-sure="' +
      esc(msg.id) +
      '">Delete for good</button><button type="button" class="pod-confirm-keep" data-pod-del-keep="1">Keep</button></div>';
  }
  if (S.pod.reportMsgId === msg.id) {
    html +=
      '<div class="pod-confirm"><button type="button" class="pod-confirm-yes" data-pod-report-go="worry">Someone may be at risk</button>' +
      '<button type="button" class="pod-confirm-keep" data-pod-report-go="unkind">Unkind</button>' +
      '<button type="button" class="pod-confirm-keep" data-pod-report-keep="1">Keep</button></div>';
  }
  html += '</div>';
  return html;
}

function podRenderBubble(th, msg) {
  var kind = podMsgKind(msg);
  var html =
    '<div class="pod-msg is-' +
    kind +
    (th.answerId === msg.id ? ' is-answer' : '') +
    (msg.isOp ? ' is-op' : '') +
    '"><span class="pod-msg-av ' +
    esc(msg.anon ? 'is-anon' : podMsgAvClass(msg)) +
    '" aria-hidden="true">' +
    esc(msg.anon ? 'A' : msg.initials || '?') +
    '</span><div class="pod-msg-body"><p class="pod-msg-head"><span class="pod-msg-name">' +
    esc(podMsgName(msg)) +
    '</span>' +
    (msg.role === 'mentor' ? '<span class="pod-msg-role">Mentor</span>' : '') +
    (msg.role === 'contributor' ? '<span class="pod-msg-role is-con">Contributor</span>' : '') +
    '<span class="pod-msg-when">' +
    esc(podChatAgo(msg.at)) +
    (msg.edited ? ' · edited' : '') +
    '</span></p>';
  if (S.pod.editMsgId === msg.id) {
    html +=
      '<textarea class="pod-edit-box" id="pod-edit-text">' +
      esc(S.pod.editText || msg.text) +
      '</textarea><div class="pod-confirm"><button type="button" class="pod-filter-done" data-pod-edit-save="1">Save</button>' +
      '<button type="button" class="pod-confirm-keep" data-pod-edit-cancel="1">Keep</button></div>';
  } else {
    html += '<p class="pod-msg-text">' + esc(msg.text) + '</p>';
  }
  html += podMsgTools(th, msg) + '</div></div>';
  return html;
}

function podHandleClick(e, t) {
  var btn;
  var id;
  ensurePod();
  btn = closestEl(t, '[data-pod-tab]');
  if (btn) {
    S.pod.tab = btn.getAttribute('data-pod-tab') || 'pods';
    S.pod.sub = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-open]');
  if (btn) {
    podOpenRoom(btn.getAttribute('data-pod-open'));
    return true;
  }
  btn = closestEl(t, '[data-pod-back]');
  if (btn) {
    id = btn.getAttribute('data-pod-back');
    if (id === 'home') {
      S.pod.sub = '';
      S.pod.podId = '';
      S.pod.threadId = '';
    } else if (id === 'pod') {
      S.pod.sub = 'pod';
      S.pod.threadId = '';
    }
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-toggle]');
  if (btn) {
    id = btn.getAttribute('data-pod-toggle');
    if (podIsJoined(id)) podLeave(id);
    else podJoin(id, false);
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-staff]');
  if (btn) {
    S.pod.sub = 'staff';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-kind]');
  if (btn) {
    id = btn.getAttribute('data-pod-kind') || 'question';
    if (S.pod.composeOpen && S.pod.composeKind === id) {
      S.pod.composeOpen = false;
    } else {
      S.pod.composeKind = id;
      S.pod.composeOpen = true;
      S.pod.focusAsk = true;
    }
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-ask]');
  if (btn) {
    podPostThread();
    return true;
  }
  btn = closestEl(t, '[data-pod-tfilter]');
  if (btn) {
    S.pod.threadFilter = btn.getAttribute('data-pod-tfilter') || 'all';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-thread]');
  if (btn) {
    podOpenThread(S.pod.podId, btn.getAttribute('data-pod-thread'));
    return true;
  }
  btn = closestEl(t, '[data-pod-share]');
  if (btn) {
    podShareThread(btn.getAttribute('data-pod-share'));
    return true;
  }
  btn = closestEl(t, '[data-pod-reply]');
  if (btn) {
    podPostReply();
    return true;
  }
  btn = closestEl(t, '[data-pod-mark]');
  if (btn) {
    podMarkAnswer(S.pod.threadId, btn.getAttribute('data-pod-mark'));
    return true;
  }
  btn = closestEl(t, '[data-pod-more]');
  if (btn) {
    id = btn.getAttribute('data-pod-more');
    S.pod.msgMenuId = S.pod.msgMenuId === id ? '' : id;
    S.pod.deleteMsgId = '';
    S.pod.reportMsgId = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-like]');
  if (btn) {
    podLike(S.pod.threadId, btn.getAttribute('data-pod-like'));
    return true;
  }
  btn = closestEl(t, '[data-pod-edit]');
  if (btn) {
    id = btn.getAttribute('data-pod-edit');
    S.pod.editMsgId = id;
    S.pod.editText = (podMsgById(podThreadById(S.pod.threadId), id) || {}).text || '';
    S.pod.deleteMsgId = '';
    S.pod.msgMenuId = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-edit-save]');
  if (btn) {
    podSaveEdit();
    return true;
  }
  btn = closestEl(t, '[data-pod-edit-cancel]');
  if (btn) {
    S.pod.editMsgId = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-del]');
  if (btn) {
    S.pod.deleteMsgId = btn.getAttribute('data-pod-del');
    S.pod.editMsgId = '';
    S.pod.msgMenuId = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-del-sure]');
  if (btn) {
    podDeleteMsg(S.pod.threadId, btn.getAttribute('data-pod-del-sure'));
    return true;
  }
  btn = closestEl(t, '[data-pod-del-keep]');
  if (btn) {
    S.pod.deleteMsgId = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-report]');
  if (btn) {
    S.pod.reportMsgId = btn.getAttribute('data-pod-report');
    S.pod.msgMenuId = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-report-go]');
  if (btn) {
    podReportMsg(S.pod.threadId, S.pod.reportMsgId, btn.getAttribute('data-pod-report-go'));
    return true;
  }
  btn = closestEl(t, '[data-pod-report-keep]');
  if (btn) {
    S.pod.reportMsgId = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-propose]');
  if (btn) {
    if (!podCanPropose()) return true;
    S.pod.sub = 'propose';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-propose-send]');
  if (btn) {
    podSubmitPropose();
    return true;
  }
  btn = closestEl(t, '[data-pod-approve]');
  if (btn) {
    podApproveProposal(btn.getAttribute('data-pod-approve'));
    return true;
  }
  btn = closestEl(t, '[data-pod-reject]');
  if (btn) {
    podRejectProposal(btn.getAttribute('data-pod-reject'));
    return true;
  }
  btn = closestEl(t, '[data-pod-filters]');
  if (btn) {
    S.pod.peopleFiltersOpen = true;
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-filters-done]');
  if (btn) {
    S.pod.peopleFiltersOpen = false;
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-clear]');
  if (btn) {
    S.commRole = 'all';
    S.commCareer = '';
    render();
    return true;
  }
  btn = closestEl(t, '[data-pod-open-thread]');
  if (btn) {
    S.pod.msgMenuId = '';
    podOpenThread(btn.getAttribute('data-pod-pod'), btn.getAttribute('data-pod-open-thread'));
    return true;
  }
  if (S.pod.msgMenuId && !closestEl(t, '.pod-more-panel') && !closestEl(t, '.pod-confirm')) {
    S.pod.msgMenuId = '';
    render();
    return true;
  }
  return false;
}

function podHandleInput(e) {
  var t = e.target;
  var btn;
  if (!t) return false;
  ensurePod();
  if (t.id === 'pod-ask-text') {
    S.pod.composeDraft = t.value;
    btn = document.querySelector('[data-pod-ask]');
    if (btn) btn.disabled = !t.value.trim();
    return true;
  }
  if (t.id === 'pod-anon') {
    S.pod.composeAnon = !!t.checked;
    return true;
  }
  if (t.id === 'pod-reply') {
    S.pod.replyDraft = t.value;
    return true;
  }
  if (t.id === 'pod-edit-text') {
    S.pod.editText = t.value;
    return true;
  }
  if (t.id === 'pod-pr-name') {
    S.pod.propose.name = t.value;
    btn = document.querySelector('[data-pod-propose-send]');
    if (btn) btn.disabled = !t.value.trim();
    return true;
  }
  if (t.id === 'pod-pr-blurb') {
    S.pod.propose.blurb = t.value;
    return true;
  }
  if (t.id === 'pod-pr-kind') {
    S.pod.propose.kind = t.value;
    return true;
  }
  if (t.id === 'pod-pr-who') {
    S.pod.propose.who = t.value;
    return true;
  }
  return false;
}

function podHandleKey(e) {
  var t = e.target;
  if (!t || t.id !== 'pod-reply') return false;
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    S.pod.replyDraft = t.value;
    podPostReply();
    return true;
  }
  return false;
}

function podAfterPaint() {
  var box;
  var btn;
  if (S.view !== 'community') return;
  box = byId('pod-ask-text');
  if (box && S.pod && S.pod.sub === 'pod' && S.pod.focusAsk) {
    S.pod.focusAsk = false;
    box.focus();
    return;
  }
  if (box && S.pod && S.pod.sub === 'pod' && document.activeElement === box) return;
  box = byId('pod-pr-name');
  if (box && S.pod && S.pod.sub === 'propose') {
    btn = document.querySelector('[data-pod-propose-send]');
    if (btn) btn.disabled = !(S.pod.propose.name || '').trim();
  }
  box = byId('pod-reply');
  if (box && S.pod && S.pod.sub === 'thread') {
    box.style.height = 'auto';
    box.style.height = Math.min(box.scrollHeight, 120) + 'px';
  }
}
