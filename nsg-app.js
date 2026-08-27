/* Next Step Guyana app: Feed + My Pathway */
window.NSG_APP = (function () {
  var D = window.NSG_DATA;
  var KEYS = {
    store: 'nsg_pathway_v2',
    tuneDismissed: 'nsg_tune_dismissed',
    tuned: 'nsg_tuned'
  };

  var DUPE_KEYS = [
    { words: ['biology', 'chemistry', 'medicine', 'science', 'doctor', 'nursing'], id: 'f1' },
    { words: ['cape', 'tvet', 'gtti', 'electrical', 'after csec', 'trade'], id: 'f8' },
    { words: ['sport', 'coach', 'academy', 'lethem', 'football', 'cricket'], id: 'f6' },
    { words: ['media', 'film', 'camera', 'photograph', 'design'], id: 'f11' }
  ];

  var ARCH = ['The Artisan', 'The Steward', 'The Advocate', 'The Pioneer'];

  function defaultState() {
    return {
      form: 'Form 3',
      region: 'Region 4',
      name: 'You',
      initials: 'YO',
      stageIndex: 1,
      archetype: '',
      tuned: false,
      steps: [],
      following: [],
      saved: [],
      feedExtra: []
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEYS.store);
      if (!raw) return defaultState();
      var s = JSON.parse(raw);
      var base = defaultState();
      Object.keys(base).forEach(function (k) {
        if (s[k] !== undefined) base[k] = s[k];
      });
      if (localStorage.getItem(KEYS.tuned) === '1') base.tuned = true;
      return base;
    } catch (e) {
      return defaultState();
    }
  }

  function save(state) {
    localStorage.setItem(KEYS.store, JSON.stringify(state));
    if (state.tuned) localStorage.setItem(KEYS.tuned, '1');
  }

  var state = load();
  var feedItems = (state.feedExtra || []).concat(D.FEED.slice());
  var toastTimer = null;
  var openSheetEl = null;
  var feedUi = { filter: 'all', q: '', mode: 'question', dupeId: null };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toast(msg) {
    var el = document.getElementById('nsgToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'nsgToast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2400);
  }

  function stageName() {
    return D.STAGES[state.stageIndex] ? D.STAGES[state.stageIndex].name : 'Form 3';
  }

  function headerPillText() {
    if (state.tuned && state.archetype) {
      return state.archetype + ', ' + stageName();
    }
    return stageName() + ', ' + state.region;
  }

  function anonLabel() {
    return stageName() + ' student, ' + state.region;
  }

  function journeyById(id) {
    return D.JOURNEYS[id] || null;
  }

  function isFollowing(id) {
    return state.following.indexOf(id) >= 0;
  }

  function toggleFollow(id) {
    var i = state.following.indexOf(id);
    if (i >= 0) state.following.splice(i, 1);
    else state.following.push(id);
    save(state);
    refreshChrome();
  }

  function stepKey(journeyId, label) {
    return journeyId + ':' + label;
  }

  function hasStep(key) {
    return state.steps.some(function (s) { return s.key === key; });
  }

  function addStep(step) {
    if (hasStep(step.key)) return false;
    state.steps.push(step);
    save(state);
    return true;
  }

  function removeStep(key) {
    state.steps = state.steps.filter(function (s) { return s.key !== key; });
    save(state);
  }

  function saveItem(item) {
    if (state.saved.some(function (s) { return s.key === item.key; })) return false;
    state.saved.push(item);
    save(state);
    return true;
  }

  function removeSaved(key) {
    state.saved = state.saved.filter(function (s) { return s.key !== key; });
    save(state);
  }

  function profileScore() {
    var score = 0;
    if (state.tuned) score += 35;
    score += Math.min(40, state.steps.length * 8);
    score += Math.min(15, state.following.length * 7);
    score += Math.min(10, state.saved.length * 5);
    return Math.min(100, score);
  }

  function plural(n, one, many) {
    return n + ' ' + (n === 1 ? one : many);
  }

  function kindLabel(kind, update) {
    if (update) return 'update';
    if (kind === 'tip') return 'mentor tip';
    return kind;
  }

  function lockBody(on) {
    document.body.style.overflow = on ? 'hidden' : '';
  }

  function closeSheet() {
    if (openSheetEl) {
      openSheetEl.remove();
      openSheetEl = null;
      lockBody(false);
    }
  }

  function openSheet(title, bodyHtml, onMount) {
    closeSheet();
    var scrim = document.createElement('div');
    scrim.className = 'sheet-scrim';
    scrim.innerHTML =
      '<div class="sheet-panel" role="dialog" aria-modal="true" aria-label="' + esc(title) + '">' +
        '<div class="sheet-bar"><h2>' + esc(title) + '</h2>' +
        '<button type="button" class="sheet-close" aria-label="Close">×</button></div>' +
        '<div class="sheet-body">' + bodyHtml + '</div>' +
      '</div>';
    document.body.appendChild(scrim);
    openSheetEl = scrim;
    lockBody(true);
    scrim.addEventListener('click', function (e) {
      if (e.target === scrim) closeSheet();
    });
    scrim.querySelector('.sheet-close').addEventListener('click', closeSheet);
    if (onMount) onMount(scrim.querySelector('.sheet-body'), scrim);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openSheetEl) closeSheet();
  });

  function svgIcon(name) {
    if (name === 'feed') {
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>';
    }
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  }

  function mountShell(active) {
    if (document.getElementById('nsgHeader')) {
      refreshChrome();
      return;
    }
    var header = document.createElement('header');
    header.id = 'nsgHeader';
    header.className = 'app-header';
    header.innerHTML =
      '<a class="brand" href="index.html">' +
        '<span class="mark"><img src="logotop.jpg" alt="Next Step Guyana"></span>' +
        '<span><strong>NEXT STEP</strong><small>GUYANA</small></span>' +
      '</a>' +
      '<div class="stage-pill" id="stagePill"><span class="av" id="stageAv">YO</span><span id="stageTxt"></span></div>';

    var dock = document.createElement('nav');
    dock.className = 'bottom-nav';
    dock.setAttribute('aria-label', 'Primary');
    dock.innerHTML =
      '<a href="feed.html" data-nav="feed">' + svgIcon('feed') + '<span>Feed</span></a>' +
      '<a href="my-pathway.html" data-nav="pathway">' + svgIcon('path') + '<span>My Pathway</span></a>';

    var left = document.createElement('nav');
    left.className = 'left-rail';
    left.setAttribute('aria-label', 'Primary');
    left.innerHTML =
      '<a href="feed.html" data-nav="feed">' + svgIcon('feed') + '<span>Feed</span></a>' +
      '<a href="my-pathway.html" data-nav="pathway">' + svgIcon('path') + '<span>My Pathway</span></a>';

    document.body.prepend(header);
    document.body.appendChild(dock);
    document.body.appendChild(left);

    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === active) a.classList.add('on');
    });
    refreshChrome();
  }

  function refreshChrome() {
    var txt = document.getElementById('stageTxt');
    var av = document.getElementById('stageAv');
    if (txt) txt.textContent = headerPillText();
    if (av) av.textContent = state.initials || 'YO';
  }

  /* ---------- Tune check ---------- */
  function openTuneCheck() {
    var q = 0;
    var picks = [null, null, null];
    var stageMap = [0, 1, 2, 3];
    var q2 = [
      { t: 'Take it apart', a: 0 },
      { t: 'Check on whoever it affected', a: 1 },
      { t: 'Argue for a better rule', a: 2 },
      { t: 'Build the replacement', a: 3 }
    ];
    var q3 = [
      { t: 'Making or fixing something with your hands', a: 0 },
      { t: 'Helping someone who needs it', a: 1 },
      { t: 'Organising people around something that matters', a: 2 },
      { t: 'Starting something nobody asked for yet', a: 3 }
    ];

    function render(body) {
      if (q >= 3) {
        var counts = [0, 0, 0, 0];
        if (picks[1] != null) counts[picks[1]]++;
        if (picks[2] != null) counts[picks[2]]++;
        var best = 3;
        var max = -1;
        counts.forEach(function (c, i) {
          if (c > max) { max = c; best = i; }
        });
        if (counts[0] === counts[1] && counts[1] === counts[2] && counts[2] === counts[3]) {
          best = picks[2] != null ? picks[2] : -1;
        } else {
          var tied = [];
          counts.forEach(function (c, i) { if (c === max) tied.push(i); });
          if (tied.length > 1) best = picks[2] != null && tied.indexOf(picks[2]) >= 0 ? picks[2] : tied[0];
        }
        var arch = best >= 0 ? ARCH[best] : 'The Explorer';
        state.stageIndex = stageMap[picks[0]] != null ? stageMap[picks[0]] : 1;
        state.archetype = arch;
        state.tuned = true;
        localStorage.setItem(KEYS.tuned, '1');
        localStorage.removeItem(KEYS.tuneDismissed);
        save(state);
        refreshChrome();
        body.innerHTML =
          '<p class="eyebrow">DONE</p>' +
          '<h3 style="font-size:24px;margin:8px 0 10px">You read as ' + esc(arch) + ', at ' + esc(stageName()) + '.</h3>' +
          '<p style="color:var(--body);margin:0 0 16px">That changes the order of your feed and what shows up under your next node. Nobody is removed, and you can redo this whenever it stops fitting.</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
            '<a class="btn" href="feed.html">See my feed</a>' +
            '<a class="btn ghost" href="my-pathway.html">Open My Pathway</a>' +
          '</div>';
        return;
      }

      var bars = '';
      for (var i = 0; i < 3; i++) bars += '<i class="' + (i <= q ? 'on' : '') + '"></i>';
      var title = 'QUESTION ' + (q + 1) + ' OF 3';
      var html = '<div class="check-progress">' + bars + '</div><p class="eyebrow">' + title + '</p>';

      if (q === 0) {
        html += '<div class="check-q"><h3 style="font-size:22px;margin:8px 0 12px">Where are you now?</h3><div class="opts">';
        [
          { t: 'Form 1 or 2', s: 'Still working out what I like.' },
          { t: 'Form 3', s: 'Choosing subjects.' },
          { t: 'Form 4 or 5', s: 'CSEC is close.' },
          { t: 'Finished CSEC', s: 'Deciding what comes next.' }
        ].forEach(function (o, i) {
          html += '<button type="button" class="opt" data-i="' + i + '">' + esc(o.t) + '<small>' + esc(o.s) + '</small></button>';
        });
        html += '</div></div>';
      } else if (q === 1) {
        html += '<div class="check-q"><h3 style="font-size:22px;margin:8px 0 12px">When something in front of you is broken, what do you do?</h3><div class="opts">';
        q2.forEach(function (o, i) {
          html += '<button type="button" class="opt" data-i="' + i + '">' + esc(o.t) + '</button>';
        });
        html += '</div></div>';
      } else {
        html += '<div class="check-q"><h3 style="font-size:22px;margin:8px 0 12px">How would you rather spend a free Saturday?</h3><div class="opts">';
        q3.forEach(function (o, i) {
          html += '<button type="button" class="opt" data-i="' + i + '">' + esc(o.t) + '</button>';
        });
        html += '</div></div>';
      }
      body.innerHTML = html;
      body.querySelectorAll('.opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var i = +btn.getAttribute('data-i');
          if (q === 0) picks[0] = i;
          else if (q === 1) picks[1] = q2[i].a;
          else picks[2] = q3[i].a;
          q++;
          render(body);
        });
      });
    }

    openSheet('Tune your feed', '<div id="checkRoot"></div>', function (body) {
      render(body.querySelector('#checkRoot') || body);
    });
  }

  /* ---------- Thread sheet ---------- */
  function findFeedItem(id) {
    for (var i = 0; i < feedItems.length; i++) if (feedItems[i].id === id) return feedItems[i];
    return null;
  }

  function openThread(id) {
    var item = findFeedItem(id);
    if (!item) return;
    function draw(body) {
      var replies = item.replies || [];
      var html =
        '<article class="card" style="margin-bottom:14px">' +
          '<div class="item-head"><span class="avatar anon">S</span><div><strong>' + esc(item.who) + '</strong>' +
          '<p class="meta">' + esc(item.time) + ' · question</p></div></div>' +
          '<h3>' + esc(item.title) + '</h3>' +
          (item.tag ? '<div class="tagrow"><span class="pill">' + esc(item.tag) + '</span></div>' : '') +
        '</article>';
      replies.forEach(function (r) {
        html +=
          '<div class="card" style="margin-bottom:10px">' +
            '<strong style="font-family:var(--serif);font-size:17px">' + esc(r.who) + '</strong>' +
            '<p class="meta">' + esc(r.role || 'Student') + '</p>' +
            '<p style="margin:8px 0 0;color:var(--body)">' + esc(r.text) + '</p>' +
          '</div>';
      });
      html +=
        '<div class="composer" style="margin-top:12px">' +
          '<label class="sr" for="replyBox">Your reply</label>' +
          '<textarea id="replyBox" placeholder="Write a reply"></textarea>' +
          '<div class="composer-foot"><button type="button" class="btn" id="postReply">Post reply</button></div>' +
        '</div>';
      body.innerHTML = html;
      body.querySelector('#postReply').addEventListener('click', function () {
        var ta = body.querySelector('#replyBox');
        var text = (ta.value || '').trim();
        if (!text) { toast('Write something first.'); ta.focus(); return; }
        if (!item.replies) item.replies = [];
        item.replies.push({ who: anonLabel(), role: 'Student', text: text });
        toast('Reply posted.');
        draw(body);
        var stream = document.getElementById('feedStream');
        if (stream) renderStream();
      });
    }
    openSheet('Thread', '', function (body) { draw(body); });
  }

  /* ---------- Feed ---------- */
  function allFeed() {
    return feedItems;
  }

  function matchSearch(item, q) {
    if (!q) return true;
    var j = item.kind === 'journey' ? journeyById(item.journey) : null;
    var blob = [
      item.title, item.text, item.who, item.tag, item.time
    ].join(' ').toLowerCase();
    if (item.replies) {
      item.replies.forEach(function (r) {
        blob += ' ' + (r.who || '') + ' ' + (r.text || '');
      });
    }
    if (j) {
      blob += ' ' + [j.name, j.field, j.place, j.hook, j.now, j.role].join(' ');
    }
    return blob.toLowerCase().indexOf(q) >= 0;
  }

  function matchFilter(item, filter) {
    if (filter === 'all') return true;
    if (filter === 'story') return item.kind === 'story' || item.update === true;
    return item.kind === filter;
  }

  function filteredFeed() {
    var q = (feedUi.q || '').trim().toLowerCase();
    return allFeed().filter(function (item) {
      return matchFilter(item, feedUi.filter) && matchSearch(item, q);
    });
  }

  function countLine() {
    var list = filteredFeed();
    var q = (feedUi.q || '').trim();
    if (q) {
      return list.length === 1
        ? '1 result for "' + q + '"'
        : list.length + ' results for "' + q + '"';
    }
    if (feedUi.filter !== 'all') {
      var labels = {
        question: 'questions', story: 'stories', tip: 'mentor tips',
        opportunity: 'opportunities', journey: 'journeys'
      };
      return list.length + ' under ' + (labels[feedUi.filter] || feedUi.filter);
    }
    return list.length + ' posts';
  }

  function renderJourneyCard(j) {
    var following = isFollowing(j.id);
    return (
      '<article class="card jcard" data-journey="' + esc(j.id) + '">' +
        '<div class="jhead">' +
          '<span class="avatar gold">' + esc(j.init) + '</span>' +
          '<div><strong>' + esc(j.name) + '</strong><small>' + esc(j.place) + '</small></div>' +
          '<div class="age"><b>' + esc(j.age) + '</b><small>AT THE TIME</small></div>' +
        '</div>' +
        '<div class="jbody">' +
          '<div class="tagrow">' +
            '<span class="pill gold dot">' + esc(j.role) + '</span>' +
            '<span class="pill">' + esc(j.field) + '</span>' +
          '</div>' +
          '<p class="hook">' + esc(j.hook) + '</p>' +
          '<p class="now"><b>NOW</b>' + esc(j.now) + '</p>' +
          '<div class="actions">' +
            '<a class="btn" href="mentor-story.html?id=' + encodeURIComponent(j.id) + '">Read their journey</a>' +
            '<button type="button" class="btn ghost' + (following ? ' following' : '') + '" data-follow="' + esc(j.id) + '">' +
              (following ? 'Following' : 'Follow') +
            '</button>' +
            '<button type="button" class="btn ghost" data-take="' + esc(j.id) + '">Take their steps</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderPostCard(item) {
    if (item.kind === 'journey') {
      var j = journeyById(item.journey);
      return j ? renderJourneyCard(j) : '';
    }
    var avClass = 'avatar';
    var init = item.init || '';
    if (item.anon) { avClass += ' anon'; init = (item.who || 'S').charAt(0); }
    else if (item.kind === 'tip') avClass += ' gold';
    if (!init && item.who) {
      var parts = item.who.split(/\s+/);
      init = ((parts[0] || '')[0] || '') + ((parts[1] || '')[0] || '');
      init = init.toUpperCase() || 'NS';
    }
    var byline = esc(item.time) + ' · ' + esc(kindLabel(item.kind, item.update));
    var html =
      '<article class="card item" data-id="' + esc(item.id) + '">' +
        '<div class="item-head">' +
          '<span class="' + avClass + '">' + esc(init) + '</span>' +
          '<div><strong>' + esc(item.who) + '</strong><p class="meta">' + byline + '</p></div>' +
        '</div>';
    if (item.title) html += '<h3>' + esc(item.title) + '</h3>';
    if (item.text) html += '<p class="text">' + esc(item.text) + '</p>';
    if (item.tag) html += '<div class="tagrow"><span class="pill">' + esc(item.tag) + '</span></div>';
    if (item.kind === 'question') {
      var replies = item.replies || [];
      if (replies.length) {
        html +=
          '<div class="reply-preview"><strong>' + esc(replies[0].who) + '</strong>' +
          '<p>' + esc(replies[0].text) + '</p></div>';
      }
      var rlabel = replies.length === 0 ? 'No replies yet' : plural(replies.length, 'reply', 'replies');
      html += '<div class="actions"><button type="button" class="btn ghost sm" data-thread="' + esc(item.id) + '">' + rlabel + '</button></div>';
    } else {
      html += '<div class="actions">';
      if (item.journey) {
        html += '<a class="btn ghost sm" href="mentor-story.html?id=' + encodeURIComponent(item.journey) + '">Read their journey</a>';
      }
      if (item.wish) {
        var saved = state.saved.some(function (s) { return s.key === item.wish.key; });
        html += '<button type="button" class="btn ghost sm" data-save=\'' + esc(JSON.stringify(item.wish)) + '\'>' +
          (saved ? 'Saved' : 'Save this') + '</button>';
      }
      html += '</div>';
    }
    html += '</article>';
    return html;
  }

  function takeAllSteps(journeyId) {
    var j = journeyById(journeyId);
    if (!j) return;
    var added = 0;
    (j.steps || []).forEach(function (st) {
      var key = stepKey(j.id, st.label);
      if (addStep({
        key: key,
        label: st.label,
        kind: st.kind,
        stage: st.stage,
        from: j.name
      })) added++;
    });
    if (!isFollowing(j.id)) {
      state.following.push(j.id);
      save(state);
    }
    toast(added ? (added + ' steps added to your road.') : 'You already have all of those.');
    refreshChrome();
  }

  function bindStream(root) {
    root.querySelectorAll('[data-thread]').forEach(function (btn) {
      btn.addEventListener('click', function () { openThread(btn.getAttribute('data-thread')); });
    });
    root.querySelectorAll('[data-follow]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-follow');
        toggleFollow(id);
        toast(isFollowing(id) ? 'Following.' : 'Unfollowed.');
        renderStream();
      });
    });
    root.querySelectorAll('[data-take]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        takeAllSteps(btn.getAttribute('data-take'));
        renderStream();
      });
    });
    root.querySelectorAll('[data-save]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        try {
          var wish = JSON.parse(btn.getAttribute('data-save'));
          if (saveItem(wish)) {
            btn.textContent = 'Saved';
            toast('Saved.');
          } else toast('Already saved.');
        } catch (e) {}
      });
    });
  }

  function renderStream() {
    var root = document.getElementById('feedStream');
    var count = document.getElementById('countLine');
    if (!root) return;
    var list = filteredFeed();
    if (count) count.textContent = countLine();
    if (!list.length) {
      root.innerHTML =
        '<div class="card"><h3>Nothing matches</h3>' +
        '<p style="margin:8px 0 0;color:var(--muted)">Clear the search or switch back to Everything. Nothing has been removed.</p></div>';
      return;
    }
    root.innerHTML = list.map(renderPostCard).join('');
    bindStream(root);
  }

  function dupeMatch(text) {
    var t = text.toLowerCase();
    if (t.length < 12) return null;
    for (var i = 0; i < DUPE_KEYS.length; i++) {
      var set = DUPE_KEYS[i];
      for (var w = 0; w < set.words.length; w++) {
        if (t.indexOf(set.words[w]) >= 0) return set.id;
      }
    }
    return null;
  }

  function renderDupe(panel, id) {
    if (!id) { panel.classList.add('hidden'); panel.innerHTML = ''; return; }
    var item = findFeedItem(id);
    if (!item) { panel.classList.add('hidden'); return; }
    var replies = item.replies || [];
    var line = replies.length
      ? (replies.length + ' replies, including one from ' + replies[0].who + '.')
      : 'No replies yet.';
    panel.classList.remove('hidden');
    panel.innerHTML =
      '<p class="eyebrow">SOMEONE ALREADY ASKED THIS</p>' +
      '<h4>' + esc(item.title) + '</h4>' +
      '<p>' + esc(line) + '</p>' +
      '<div class="row">' +
        '<button type="button" class="btn sm" id="readDupe">Read that thread</button>' +
        '<button type="button" class="btn ghost sm" id="askAnyway">Ask mine anyway</button>' +
      '</div>';
    panel.querySelector('#readDupe').addEventListener('click', function () { openThread(id); });
    panel.querySelector('#askAnyway').addEventListener('click', function () {
      feedUi.dupeId = null;
      renderDupe(panel, null);
    });
  }

  function renderRightRail(el) {
    if (!el) return;
    var qs = allFeed().filter(function (i) { return i.kind === 'question'; }).slice(0, 4);
    var qHtml = qs.map(function (q) {
      var n = (q.replies || []).length;
      return '<li><button type="button" data-thread="' + esc(q.id) + '">' + esc(q.title) +
        '<small>' + plural(n, 'reply', 'replies') + '</small></button></li>';
    }).join('');
    var jHtml = Object.keys(D.JOURNEYS).map(function (id) {
      var j = D.JOURNEYS[id];
      var on = isFollowing(id);
      return '<li style="display:flex;gap:8px;align-items:center">' +
        '<span style="flex:1;font-size:13.5px;font-weight:700">' + esc(j.name) + '</span>' +
        '<button type="button" class="btn ghost sm' + (on ? ' following' : '') + '" data-follow="' + esc(id) + '">' +
        (on ? 'Following' : 'Follow') + '</button></li>';
    }).join('');
    el.innerHTML =
      '<div class="card"><h3>Threads moving now</h3><ul class="rail-list">' + qHtml + '</ul></div>' +
      '<div class="card"><h3>Journeys to follow</h3><ul class="rail-list">' + jHtml + '</ul></div>';
    el.querySelectorAll('[data-thread]').forEach(function (btn) {
      btn.addEventListener('click', function () { openThread(btn.getAttribute('data-thread')); });
    });
    el.querySelectorAll('[data-follow]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-follow');
        toggleFollow(id);
        toast(isFollowing(id) ? 'Following.' : 'Unfollowed.');
        renderRightRail(el);
        renderStream();
      });
    });
  }

  function renderFeed(root) {
    var params = new URLSearchParams(location.search);
    var f = params.get('filter');
    var valid = D.FILTERS.map(function (x) { return x.value; });
    feedUi.filter = valid.indexOf(f) >= 0 ? f : 'all';

    var tuned = state.tuned || localStorage.getItem(KEYS.tuned) === '1';
    var dismissed = localStorage.getItem(KEYS.tuneDismissed) === '1';
    var showTune = !tuned && !dismissed;

    var chips = D.FILTERS.map(function (c) {
      return '<button type="button" data-filter="' + c.value + '"' +
        (c.value === feedUi.filter ? ' class="on"' : '') + '>' + esc(c.label) + '</button>';
    }).join('');

    var topics = D.TOPICS.map(function (t) {
      return '<option value="' + esc(t) + '">' + esc(t) + '</option>';
    }).join('');

    root.innerHTML =
      '<div class="wrap wide"><div class="app-layout">' +
        '<div>' +
          '<p class="eyebrow">TIMELY</p>' +
          '<h1 style="font-size:clamp(28px,6vw,36px);margin:6px 0 0">Feed</h1>' +
          '<div class="search">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
              '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
            '<label class="sr" for="q">Search the feed</label>' +
            '<input id="q" placeholder="Search the feed">' +
          '</div>' +
          '<div class="filters" id="filters">' + chips + '</div>' +
          (showTune
            ? '<div class="tune" id="tune">' +
                '<p><b>Your feed is not tuned yet.</b> Three questions change the order of what you see.</p>' +
                '<button class="btn sm" id="startCheck" type="button">Tune it</button>' +
                '<button class="btn ghost sm" id="skipCheck" type="button">Not now</button>' +
              '</div>'
            : '') +
          '<div class="composer" id="composer">' +
            '<div class="seg" id="seg">' +
              '<button type="button" data-mode="question" class="on">Ask a question</button>' +
              '<button type="button" data-mode="story">Share a story</button>' +
              '<button type="button" data-mode="update">Post an update</button>' +
            '</div>' +
            '<label class="sr" for="postBody">Post</label>' +
            '<textarea id="postBody" placeholder="What are you trying to figure out?"></textarea>' +
            '<div class="dupe hidden" id="dupe"></div>' +
            '<div class="composer-foot">' +
              '<select id="topic" aria-label="Topic">' + topics + '</select>' +
              '<label><input type="checkbox" id="anon" checked> Post without my name</label>' +
              '<button type="button" class="btn" id="postBtn">Post question</button>' +
            '</div>' +
          '</div>' +
          '<p class="count-line" id="countLine"></p>' +
          '<div id="feedStream"></div>' +
        '</div>' +
        '<aside class="rail" id="rightRail"></aside>' +
      '</div></div>';

    var placeholders = {
      question: 'What are you trying to figure out?',
      story: 'Something you did, went to, or learned, and what someone younger should take from it.',
      update: 'A short update for people on a similar path.'
    };
    var btnLabels = { question: 'Post question', story: 'Post story', update: 'Post update' };

    function setMode(mode) {
      feedUi.mode = mode;
      root.querySelectorAll('#seg button').forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-mode') === mode);
      });
      root.querySelector('#postBody').placeholder = placeholders[mode];
      root.querySelector('#postBtn').textContent = btnLabels[mode];
      root.querySelector('#anon').checked = mode === 'question';
      feedUi.dupeId = null;
      renderDupe(root.querySelector('#dupe'), null);
    }

    root.querySelectorAll('#seg button').forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });

    root.querySelectorAll('#filters button').forEach(function (b) {
      b.addEventListener('click', function () {
        feedUi.filter = b.getAttribute('data-filter');
        root.querySelectorAll('#filters button').forEach(function (x) {
          x.classList.toggle('on', x === b);
        });
        var url = new URL(location.href);
        if (feedUi.filter === 'all') url.searchParams.delete('filter');
        else url.searchParams.set('filter', feedUi.filter);
        history.replaceState({}, '', url);
        renderStream();
      });
    });

    root.querySelector('#q').addEventListener('input', function (e) {
      feedUi.q = e.target.value;
      renderStream();
    });

    var ta = root.querySelector('#postBody');
    ta.addEventListener('input', function () {
      if (feedUi.mode !== 'question') return;
      feedUi.dupeId = dupeMatch(ta.value);
      renderDupe(root.querySelector('#dupe'), feedUi.dupeId);
    });

    root.querySelector('#postBtn').addEventListener('click', function () {
      var text = (ta.value || '').trim();
      if (!text) { toast('Write something first.'); ta.focus(); return; }
      var mode = feedUi.mode;
      var anon = root.querySelector('#anon').checked;
      var tag = root.querySelector('#topic').value;
      var id = 'u' + Date.now();
      var item = {
        id: id,
        kind: mode === 'update' ? 'story' : mode,
        update: mode === 'update',
        anon: anon,
        who: anon ? anonLabel() : (state.name || 'You'),
        init: anon ? '' : (state.initials || 'YO'),
        time: 'just now',
        tag: tag,
        title: mode === 'question' ? text : '',
        text: mode === 'question' ? '' : text,
        replies: mode === 'question' ? [] : undefined
      };
      if (mode === 'question') {
        item.title = text;
        delete item.text;
      }
      state.feedExtra = state.feedExtra || [];
      state.feedExtra.unshift(item);
      save(state);
      feedItems = [item].concat(feedItems);
      ta.value = '';
      feedUi.dupeId = null;
      renderDupe(root.querySelector('#dupe'), null);
      renderStream();
      renderRightRail(root.querySelector('#rightRail'));
      toast(mode === 'question' ? 'Question posted.' : 'Posted.');
    });

    if (showTune) {
      root.querySelector('#startCheck').addEventListener('click', openTuneCheck);
      root.querySelector('#skipCheck').addEventListener('click', function () {
        localStorage.setItem(KEYS.tuneDismissed, '1');
        var t = root.querySelector('#tune');
        if (t) t.remove();
      });
    }

    renderStream();
    renderRightRail(root.querySelector('#rightRail'));
  }

  /* ---------- My Pathway ---------- */
  function bindFyRail(rail, prev, next) {
    function update() {
      var atStart = rail.scrollLeft <= 0;
      var atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1;
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
    }
    function step(dir) {
      var card = rail.querySelector('.fy-card');
      if (!card) return;
      var gap = 13;
      rail.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function renderPathway(root) {
    var stage = D.STAGES[state.stageIndex] || D.STAGES[1];
    var tuned = state.tuned || localStorage.getItem(KEYS.tuned) === '1';
    var score = profileScore();
    var sub = tuned && state.archetype
      ? state.archetype + ', ' + stage.name + ', ' + state.region
      : stage.name + ', ' + state.region;

    var roadHtml = D.STAGES.map(function (s, i) {
      var cls = i < state.stageIndex ? 'done' : (i === state.stageIndex ? 'now' : '');
      var node = i < state.stageIndex ? '✓' : (i === state.stageIndex ? String(i + 1) : String(i + 1));
      var steps = state.steps.filter(function (st) { return st.stage === s.key; });
      var body = steps.length
        ? steps.map(function (st) {
            return '<div class="step-row"><div><strong>' + esc(st.label) + '</strong>' +
              '<small>' + esc(st.kind) + ', from ' + esc(st.from) + '</small></div>' +
              '<button type="button" class="rm" data-rm="' + esc(st.key) + '">Remove</button></div>';
          }).join('')
        : '<div class="road-empty">' + esc(s.note) + '</div>';
      var lab = s.label + (i === state.stageIndex ? ', you are here' : '');
      return (
        '<div class="road-item ' + cls + '">' +
          '<div class="node">' + node + '</div>' +
          '<div><h4>' + esc(s.name) + '</h4><div class="lab">' + esc(lab) + '</div>' + body + '</div>' +
        '</div>'
      );
    }).join('');

    var fy = D.FY[stage.key] || [];
    var fyCards = fy.map(function (a) {
      var saved = state.saved.some(function (s) { return s.key === a.key; });
      return (
        '<article class="fy-card">' +
          '<h4>' + esc(a.t) + '</h4>' +
          '<p>' + esc(a.d) + '</p>' +
          '<div class="fy-foot">' +
            '<button type="button" class="btn ghost sm" data-details="' + esc(a.t) + '">Details</button>' +
            '<button type="button" class="btn ghost sm" data-save-fy="' + esc(a.key) + '" data-title="' + esc(a.t) + '" data-note="' + esc(a.d) + '">' +
              (saved ? 'Saved' : 'Save this') +
            '</button>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    var fyNote = D.FY_CATALOGUE_EXTRA
      ? (D.FY_CATALOGUE_EXTRA + ' others in the catalogue are not open to ' + stage.name +
        '. The age and grade limits are set by the organisers, not by us.')
      : '';

    var savedHtml = state.saved.length
      ? state.saved.map(function (s) {
          return '<div class="list-row"><div class="sum"><strong>' + esc(s.title) + '</strong>' +
            '<small>' + esc(s.note || '') + '</small></div>' +
            '<button type="button" class="btn ghost sm" data-unsave="' + esc(s.key) + '">Remove</button></div>';
        }).join('')
      : '<p class="empty-soft">Nothing saved yet. When a story mentions a programme or event, save it here.</p>';

    var followHtml = state.following.length
      ? state.following.map(function (id) {
          var j = journeyById(id);
          if (!j) return '';
          var status = j.ongoing ? 'still adding nodes' : 'documented';
          return '<div class="list-row">' +
            '<span class="avatar gold">' + esc(j.init) + '</span>' +
            '<div class="sum"><strong>' + esc(j.name) + '</strong>' +
            '<small>' + esc(j.field) + ', ' + status + '</small></div>' +
            '<a class="btn ghost sm" href="mentor-story.html?id=' + encodeURIComponent(j.id) + '">Open</a></div>';
        }).join('')
      : '<p class="empty-soft">Follow a journey from the feed and new nodes show up here.</p>';

    var profileSub = score === 0
      ? 'Nothing set yet.'
      : plural(state.steps.length, 'step', 'steps') + ' on your road, ' +
        plural(state.following.length, 'journey', 'journeys') + ' followed.';

    root.innerHTML =
      '<div class="wrap">' +
        '<section class="path-hero">' +
          '<p class="eyebrow">MY PATHWAY</p>' +
          '<h1>You</h1>' +
          '<p class="sub">' + esc(sub) + '</p>' +
          '<div class="stat-pills">' +
            '<span>' + plural(state.steps.length, 'step taken', 'steps taken') + '</span>' +
            '<span>' + plural(state.following.length, 'journey followed', 'journeys followed') + '</span>' +
            '<span>' + plural(state.saved.length, 'saved', 'saved') + '</span>' +
          '</div>' +
        '</section>' +
        (!tuned
          ? '<div class="tune" style="margin-bottom:16px">' +
              '<p><b>Tune your pathway.</b> Three questions set your stage and what shows under For you.</p>' +
              '<button class="btn sm" type="button" id="pathTune">Tune it</button>' +
            '</div>'
          : '') +
        '<div class="profile-row">' +
          '<div class="ring" style="--p:' + score + '"><i>' + score + '%</i></div>' +
          '<div class="sum"><strong>Your profile</strong><small>' + esc(profileSub) + '</small></div>' +
          '<button type="button" class="btn ghost sm" id="pathUpdate">Update</button>' +
        '</div>' +
        '<section>' +
          '<p class="eyebrow">THE ROAD</p>' +
          '<h2 style="font-size:24px;margin:6px 0 14px">The road ahead</h2>' +
          '<div class="road">' + roadHtml + '</div>' +
        '</section>' +
        '<section class="foryou">' +
          '<div class="sec-head">' +
            '<div>' +
              '<span class="eyebrow">Because of your next node</span>' +
              '<h3>For you</h3>' +
              '<p>Activities open to you at ' + esc(stage.name) + ', and worth doing before the decision.</p>' +
            '</div>' +
            '<div class="rail-arrows">' +
              '<button class="arrow" id="fyPrev" type="button" aria-label="Previous activities">←</button>' +
              '<button class="arrow" id="fyNext" type="button" aria-label="More activities">→</button>' +
            '</div>' +
          '</div>' +
          '<div class="fy-rail" id="fyRail" tabindex="0" role="group" aria-label="Suggested activities">' +
            fyCards +
          '</div>' +
          '<p class="fy-note" id="fyNote">' + esc(fyNote) + '</p>' +
        '</section>' +
        '<section class="list-sec"><h3>Saved</h3>' + savedHtml + '</section>' +
        '<section class="list-sec"><h3>Following</h3>' + followHtml + '</section>' +
        '<p class="page-foot">Prototype. Mentors and contributors are placeholders until consented interviews replace them.</p>' +
      '</div>';

    if (!tuned) {
      root.querySelector('#pathTune').addEventListener('click', openTuneCheck);
    }
    root.querySelector('#pathUpdate').addEventListener('click', openTuneCheck);

    root.querySelectorAll('[data-rm]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        removeStep(btn.getAttribute('data-rm'));
        toast('Removed from your pathway.');
        renderPathway(root);
      });
    });

    root.querySelectorAll('[data-save-fy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ok = saveItem({
          key: btn.getAttribute('data-save-fy'),
          title: btn.getAttribute('data-title'),
          note: btn.getAttribute('data-note')
        });
        if (ok) { btn.textContent = 'Saved'; toast('Saved.'); renderPathway(root); }
        else toast('Already saved.');
      });
    });

    root.querySelectorAll('[data-details]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openSheet('Details', '<p style="margin:0;color:var(--body)">' + esc(btn.getAttribute('data-details')) +
          '. Check dates and eligibility with the organiser.</p>');
      });
    });

    root.querySelectorAll('[data-unsave]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        removeSaved(btn.getAttribute('data-unsave'));
        toast('Removed.');
        renderPathway(root);
      });
    });

    bindFyRail(root.querySelector('#fyRail'), root.querySelector('#fyPrev'), root.querySelector('#fyNext'));
  }

  /* ---------- Journey page ---------- */
  function renderJourney(root, id) {
    var j = journeyById(id);
    if (!j) {
      root.innerHTML = '<div class="wrap"><div class="card"><h2>Journey not found</h2>' +
        '<p><a href="feed.html?filter=journey">Back to journeys</a></p></div></div>';
      return;
    }
    var first = j.name.split(' ')[0];
    var following = isFollowing(j.id);
    var status = j.ongoing ? 'still adding nodes' : 'documented';

    var moments = (j.moments || []).map(function (m) {
      return '<div class="moment-card">' +
        '<div class="age-box"><b>' + esc(m.age) + '</b><span>AT THE TIME</span></div>' +
        '<p class="body">' + esc(m.text) + '</p>' +
        (m.flag ? '<p class="flag">' + esc(m.flag) + '</p>' : '') +
        '</div>';
    }).join('');

    var route = (j.route || []).map(function (r) {
      return '<div class="route-card">' +
        '<div class="stage">' + esc(D.STAGE_LABEL[r.stage] || r.stage) + '</div>' +
        '<div class="did">' + esc(r.text) + '</div>' +
        '<p class="tip">' + esc(r.lesson) + '</p></div>';
    }).join('');

    var groups = {};
    (j.steps || []).forEach(function (s) {
      groups[s.kind] = groups[s.kind] || [];
      groups[s.kind].push(s);
    });
    var chips = Object.keys(groups).map(function (kind) {
      var html = '<p class="eyebrow" style="margin:12px 0 6px">' + esc(kind.toUpperCase()) + '</p>';
      groups[kind].forEach(function (s) {
        var key = stepKey(j.id, s.label);
        var on = hasStep(key);
        html += '<button type="button" class="chip-btn' + (on ? ' on' : '') + '" data-chip="' + esc(key) + '" ' +
          'data-label="' + esc(s.label) + '" data-kind="' + esc(s.kind) + '" data-stage="' + esc(s.stage) + '">' +
          esc(s.label) + '</button>';
      });
      return html;
    }).join('');

    root.innerHTML =
      '<div class="wrap">' +
        '<section class="journey-hero">' +
          '<span class="pill gold">' + esc(j.role) + '</span>' +
          '<h1>' + esc(j.name) + '</h1>' +
          '<p class="meta-line">' + esc(j.place) + ', ' + esc(j.type) + ', ' + esc(j.field) + '</p>' +
          '<p class="blurb">' + esc(j.blurb) + '</p>' +
          '<p style="margin:0 0 12px;font-size:12.5px;color:#b3cae0;font-weight:700">' + esc(status) + '</p>' +
          '<button type="button" class="btn' + (following ? ' ghost following' : '') + '" id="followJourney">' +
            (following ? 'Following' : 'Follow this journey') +
          '</button>' +
        '</section>' +
        '<p class="quote">“' + esc(j.quote) + '”</p>' +
        '<p class="now"><b>NOW</b>' + esc(j.now) + '</p>' +
        '<p class="eyebrow" style="margin:22px 0 10px">MOMENTS</p>' + moments +
        '<p class="eyebrow" style="margin:22px 0 10px">ROUTE</p>' + route +
        '<p class="eyebrow" style="margin:22px 0 10px">DEEP DIVE</p>' +
        '<div class="dive-card">' +
          '<h3>' + esc(j.dive.title) + '</h3>' +
          '<p style="margin:10px 0 0"><b>Requirement.</b> ' + esc(j.dive.req) + '</p>' +
          '<p style="margin:8px 0 0"><b>Cost.</b> ' + esc(j.dive.cost) + '</p>' +
          '<p style="margin:8px 0 0;color:var(--muted)">' + esc(j.dive.caveat) + '</p>' +
        '</div>' +
        '<div class="card" style="margin-top:16px">' +
          '<h3>What ' + esc(first) + ' did</h3>' +
          '<p style="margin:8px 0 12px;font-size:14px;color:var(--muted)">Tap anything to add it to your pathway at the stage where it happens. Tap again to remove it.</p>' +
          '<div id="chips">' + chips + '</div>' +
          '<button type="button" class="btn full" id="addAll" style="margin-top:12px">Add everything ' + esc(first) + ' did</button>' +
        '</div>' +
        '<div class="dyk">' +
          '<h3>Did you know</h3>' +
          '<p>' + esc(j.did.text) + '</p>' +
          '<p class="src">Source: ' + esc(j.did.src) + '</p>' +
        '</div>' +
        '<p style="margin:20px 0"><a href="feed.html?filter=journey">Back to journeys</a></p>' +
      '</div>';

    root.querySelector('#followJourney').addEventListener('click', function () {
      toggleFollow(j.id);
      toast(isFollowing(j.id) ? 'Following.' : 'Unfollowed.');
      renderJourney(root, id);
    });

    root.querySelectorAll('[data-chip]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-chip');
        if (hasStep(key)) {
          removeStep(key);
          toast('Removed from your pathway.');
        } else {
          addStep({
            key: key,
            label: btn.getAttribute('data-label'),
            kind: btn.getAttribute('data-kind'),
            stage: btn.getAttribute('data-stage'),
            from: j.name
          });
          var lab = D.STAGE_LABEL[btn.getAttribute('data-stage')] || 'your pathway';
          toast('Added to ' + lab + '.');
        }
        renderJourney(root, id);
      });
    });

    root.querySelector('#addAll').addEventListener('click', function () {
      takeAllSteps(j.id);
      renderJourney(root, id);
    });
  }

  return {
    mountShell: mountShell,
    renderFeed: renderFeed,
    renderPathway: renderPathway,
    renderJourney: renderJourney,
    openTuneCheck: openTuneCheck,
    state: function () { return state; }
  };
})();
