#!/usr/bin/env python3
"""Build nsg-schools.js from guyana-schools.json.
Drops regionName, strips id backticks, sets apex-academy-r4 Georgetown district."""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
src = ROOT / 'guyana-schools.json'
dst = ROOT / 'nsg-schools.js'

raw = json.loads(src.read_text(encoding='utf-8'))
out = []
for s in raw:
    sid = str(s['id']).strip('`')
    district = s.get('district')
    if sid == 'apex-academy-r4' and not district:
        district = 'Georgetown Education District'
    aka = []
    for a in (s.get('aka') or []):
        if not a:
            continue
        for part in re.split(r'\s*;\s*', str(a)):
            part = part.strip()
            if part and part not in aka:
                aka.append(part)
    rec = {
        'id': sid,
        'name': s['name'],
        'aka': aka,
        'region': int(s['region']),
        'district': district,
        'type': s.get('type'),
        'status': s.get('status') or 'unknown',
        'confidence': s.get('confidence') or 'medium',
        'sixthForm': s.get('sixthForm') or 'no',
        'sixthFormBasis': s.get('sixthFormBasis') or 'not-on-team-list',
        'offersCVQ': s.get('offersCVQ') or 'unknown',
        'dormitory': s.get('dormitory') or 'unknown',
        'cvqSubjects': s.get('cvqSubjects') or [],
        'formerName': s.get('formerName'),
        'notes': s.get('notes'),
        'sources': s.get('sources') or [],
    }
    if 'regionName' in rec:
        sys.exit('regionName leaked into shipped record')
    out.append(rec)

r4_null = [x['id'] for x in out if x['region'] == 4 and not x['district']]
if r4_null:
    sys.exit('null district in Region 4: ' + ', '.join(r4_null))

# Append search + helpers by reading template after marker — keep logic in nsg-schools.js body below data
helpers = (ROOT / 'scripts' / '_nsg-schools-helpers.js').read_text(encoding='utf-8') if (ROOT / 'scripts' / '_nsg-schools-helpers.js').exists() else None

if helpers is None:
    # helpers live at end of existing nsg-schools.js after SCHOOLS assignment — regenerate full file
    pass

print(f'OK {len(out)} schools → {dst.name}')
# Always rewrite data+helpers together from embedded template in this script via reading current helpers from nsg-schools.js
existing = dst.read_text(encoding='utf-8') if dst.exists() else ''
# Extract helpers: from "var STOP" or "function locationLabel"
idx = existing.find('var STOP =')
if idx < 0:
    idx = existing.find('function locationLabel')
if idx < 0:
    sys.exit('helpers section missing in nsg-schools.js — run full generator once')
# Find start of IIFE content after SCHOOLS
marker = 'var SCHOOLS = '
start = existing.index(marker)
# find end of JSON array
rest = existing[start + len(marker):]
depth = 0
end = None
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
    if ch == '[':
        depth += 1
    elif ch == ']':
        depth -= 1
        if depth == 0:
            end = i + 1
            break
helpers_tail = rest[end:]  # starts with ';\n\n  var STOP...'
new = existing[:start + len(marker)] + json.dumps(out, ensure_ascii=False) + helpers_tail
dst.write_text(new, encoding='utf-8')
print('rewrote data payload; helpers preserved')
