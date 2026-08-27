#!/usr/bin/env python3
"""Build check for North Star + plan engine data.

Fails on: em dashes, changelog-shaped src strings, American spellings in student-facing JS,
starKey writes, duplicate CAREERS arrays, stage lists defined outside nsg-stages.js,
and every canonical stage unmapped in my-plan.html.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CHANGELOG = re.compile(r'\b(removed|replaced|former|corrected|note)\b', re.I)
EM = re.compile(r'\u2014|&mdash;|—')
AMERICAN = re.compile(
    r'\b(favor|colored|center|organize|analyze|behavior|personalized|favorite|counselor)\b',
    re.I,
)

CANONICAL_STAGES = [
    'form1', 'form2', 'form3', 'form4', 'form5',
    'postcsec', 'lowersixth', 'uppersixth', 'postcape', 'out'
]

LIVE_HTML = [
    'check.html', 'my-plan.html', 'account.html', 'report-form1-2.html',
    'ask.html', 'my-sessions.html', 'mentors.html', 'parent-landing.html',
    'dashboard.html', 'profile.html', 'explore.html', 'community.html',
    'index.html', 'about.html', 'feed.html', 'sessions.html', 'swipe.html'
]
LIVE_JS = [
    'nsg-north-star.js', 'nsg-plan-engine.js', 'nsg-careers-tab.js',
    'nsg-stages.js', 'nsg-mentors.js', 'careers-v3-data.js', 'careers-data.js'
]


def extract_json_array(code, var_name):
    marker = f'var {var_name} = '
    start = code.index(marker) + len(marker)
    rest = code[start:]
    depth = 0
    in_str = False
    esc = False
    for i, ch in enumerate(rest):
        if in_str:
            if esc:
                esc = False
            elif ch == '\\':
                esc = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
            continue
        if ch in '[{':
            depth += 1
        elif ch in ']}':
            depth -= 1
            if depth == 0:
                return json.loads(rest[: i + 1])
    raise ValueError(f'Could not parse {var_name}')


errors = []
warnings = []

ns = (ROOT / 'nsg-north-star.js').read_text(encoding='utf-8')
engine = (ROOT / 'nsg-plan-engine.js').read_text(encoding='utf-8')
tab = (ROOT / 'nsg-careers-tab.js').read_text(encoding='utf-8')
myplan = (ROOT / 'my-plan.html').read_text(encoding='utf-8')

for path, text in [
    ('nsg-north-star.js', ns),
    ('nsg-plan-engine.js', engine),
    ('nsg-careers-tab.js', tab),
]:
    for m in EM.finditer(text):
        line_start = text.rfind('\n', 0, m.start()) + 1
        line = text[line_start:text.find('\n', m.start())]
        if 'EM_DASH' in line or 'EM =' in line or 'em dash' in line.lower():
            continue
        errors.append(f'{path}: em dash or &mdash; found near offset {m.start()}')
    for m in AMERICAN.finditer(text):
        line_start = text.rfind('\n', 0, m.start()) + 1
        line = text[line_start:text.find('\n', m.start())]
        if 'AMERICAN' in line or 'American spelling' in line or 'validateLanguage' in line:
            continue
        errors.append(f'{path}: American spelling "{m.group()}" near offset {m.start()}')

careers = extract_json_array(ns, 'CAREERS')
opps = extract_json_array(ns, 'OPPORTUNITIES')

if len(careers) != 145:
    errors.append(f'expected 145 careers in nsg-north-star.js, found {len(careers)}')

for c in careers:
    if not c.get('keys') and not c.get('buckets'):
        errors.append(f"{c.get('id')}: missing buckets")
    if not c.get('status'):
        errors.append(f"{c.get('id')}: missing status")
    for pair in c.get('src') or []:
        blob = ' '.join(pair)
        if CHANGELOG.search(blob):
            errors.append(f"{c.get('id')}: changelog word in src: {blob}")
    if EM.search(json.dumps(c, ensure_ascii=False)):
        errors.append(f"{c.get('id')}: em dash in career record")

null_age = []
for o in opps:
    if not o.get('serves'):
        errors.append(f"{o.get('id')}: missing serves")
    if not o.get('buckets'):
        errors.append(f"{o.get('id')}: missing buckets")
    if not o.get('entryRoute'):
        errors.append(f"{o.get('id')}: missing entryRoute")
    if o.get('ageFrom') is None:
        null_age.append(o.get('id'))

STAR_WRITE = re.compile(
    r'(starKey\s*[:=]|pickPrimaryCareer\s*\(|["\']starKey["\']\s*:)',
)
for name in LIVE_HTML + LIVE_JS:
    path = ROOT / name
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8')
    for i, line in enumerate(text.splitlines(), 1):
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('*') or stripped.startswith('/*'):
            continue
        if 'No starKey' in line or 'no starKey' in line:
            continue
        if 'raw.starKey' in line or 'old.starKey' in line:
            continue
        if STAR_WRITE.search(line) and 'removeItem' not in line:
            if re.search(r'starKey\s*=', line) or re.search(r'["\']starKey["\']\s*:', line) or 'pickPrimaryCareer' in line:
                errors.append(f'{name}:{i}: starKey write or pickPrimaryCareer: {stripped[:120]}')

CAREERS_DECL = re.compile(r'\b(?:const|var|let)\s+CAREERS\s*=\s*\[')
for name in LIVE_HTML + LIVE_JS + [
    'explore-legacy.html', 'profile-legacy.html', 'community-legacy.html',
    'my-plan-v1-legacy.html', '_test-free-result.html', 'free-result.html'
]:
    path = ROOT / name
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8')
    if name in ('nsg-north-star.js', 'careers-v3-data.js', 'careers-data.js'):
        continue
    if CAREERS_DECL.search(text):
        errors.append(f'{name}: inline CAREERS array (duplicate library)')

cdata = (ROOT / 'careers-data.js').read_text(encoding='utf-8')
cv3 = (ROOT / 'careers-v3-data.js').read_text(encoding='utf-8')

def strip_head_comment(s):
    return re.sub(r'^/\*.*?\*/\s*', '', s, count=1, flags=re.S)

if 'Alias of careers-v3-data' not in cdata and strip_head_comment(cdata) != strip_head_comment(cv3):
    errors.append('careers-data.js diverges from careers-v3-data.js')

for legacy in [
    'explore-legacy.html', 'profile-legacy.html', 'community-legacy.html',
    'my-plan-v1-legacy.html', '_test-free-result.html'
]:
    if (ROOT / legacy).exists():
        errors.append(f'{legacy}: legacy file still present (delete)')

fr = ROOT / 'free-result.html'
if fr.exists():
    frt = fr.read_text(encoding='utf-8')
    if CAREERS_DECL.search(frt) or 'Village Salvage' in frt or 'The Arbiter' in frt:
        errors.append('free-result.html still carries legacy career/archetype content')

STAGE_LIST_PAT = re.compile(
    r"(?:const|var|let)\s+STAGES\s*=\s*\[|"
    r"STAGE_LABELS\s*=\s*\{[^}]*form1|"
    r"form1\s*:\s*['\"]Form 1['\"]"
)
for name in LIVE_HTML + LIVE_JS:
    if name == 'nsg-stages.js':
        continue
    path = ROOT / name
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8')
    for i, line in enumerate(text.splitlines(), 1):
        if 'NSG_STAGES' in line and 'STAGES' in line:
            continue
        if 'STAGE_LABELS = (window.NSG_STAGES' in line:
            continue
        if STAGE_LIST_PAT.search(line):
            errors.append(f'{name}:{i}: stage list defined outside nsg-stages.js: {line.strip()[:100]}')

if re.search(r'var map = \{\s*form1:\s*1,\s*form2:\s*2', engine):
    warnings.append('nsg-plan-engine.js still has a fallback stage map (prefer NSG_STAGES only)')

for st in CANONICAL_STAGES:
    if st == 'out':
        if 'outChrome' not in myplan and "stageKey==='out'" not in myplan:
            errors.append('my-plan.html: out stage has no chrome mapping')
        continue
    if not re.search(rf'{st}\s*:\s*\[', myplan):
        errors.append(f'my-plan.html: stageLabels missing distinct entry for {st}')

if re.search(r"goals\s*=\s*\[['\"]tech['\"].*eng.*sci", tab):
    errors.append('nsg-careers-tab.js: fabricated interest default tech/eng/sci')

mentors = (ROOT / 'mentors.html').read_text(encoding='utf-8')
if re.search(r'\d+\s*%\s+\w*\s*MATCH', mentors, re.I) or re.search(r'\d+% (PREPARATION|JOURNEY|MATCH)', mentors, re.I):
    errors.append('mentors.html: hand-typed match percentage remains')

fake_bad = 'former route note — personalized center'
if not CHANGELOG.search(fake_bad) or not EM.search(fake_bad) or not AMERICAN.search(fake_bad):
    errors.append('self-test: detectors failed')

if 'School type, name or perceived rank must never affect' not in engine:
    errors.append('nsg-plan-engine.js: missing region vs school-type boundary comment')

if errors:
    print('FAIL')
    for e in errors[:100]:
        print(' -', e)
    if len(errors) > 100:
        print(f' ... and {len(errors)-100} more')
    sys.exit(1)

print(f'OK {len(careers)} careers, {len(opps)} opportunities')
print(f'null ageFrom: {null_age}')
print('no em dashes, no changelog src strings, no American spellings in checked files')
print('no starKey writes, no duplicate CAREERS arrays, stages from nsg-stages.js, my-plan maps all stages')
for w in warnings:
    print('WARN:', w)
