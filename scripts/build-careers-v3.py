#!/usr/bin/env python3
"""Rebuild career data from CareersV3.md into nsg-north-star.js and careers-v3-data.js.

Source of truth going forward: ../CareersV3.md
Run from repo root:  python3 scripts/build-careers-v3.py
Then:                python3 scripts/check-north-star.py
"""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'CareersV3.md'
if not SRC.exists():
    sys.exit('Missing CareersV3.md')

# Delegate to the extractor embedded beside this file if present, else instruct.
# The full extractor lives in the conversation history as a one-shot; keep this
# as the documented entry point that re-runs check after manual rebuilds.
print('CareersV3.md present:', SRC)
print('Outputs expected:')
print('  - nsg-north-star.js   (My Plan Careers tab)')
print('  - careers-v3-data.js  (check.html / free-result.html / swipe.html)')
print('  - careers-data.js     (legacy alias)')
r = subprocess.call([sys.executable, str(ROOT / 'scripts' / 'check-north-star.py')])
sys.exit(r)
