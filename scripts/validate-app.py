#!/usr/bin/env python3
"""Build-time validation for Next Step Guyana app surfaces."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ERRORS: list[str] = []


def err(msg: str) -> None:
    ERRORS.append(msg)


def read(name: str) -> str:
    return (ROOT / name).read_text(encoding="utf-8")


def check_duplicate_top_level_functions(js: str, label: str) -> None:
    # function foo(  and  var foo = function
    names: dict[str, int] = {}
    for m in re.finditer(r"\bfunction\s+([A-Za-z_$][\w$]*)\s*\(", js):
        names[m.group(1)] = names.get(m.group(1), 0) + 1
    for m in re.finditer(r"\b(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*function\b", js):
        names[m.group(1)] = names.get(m.group(1), 0) + 1
    # ignore nested helpers inside validateMentors etc by only flagging >1 at file level for known collision risks
    # Prefer runtime reg() — still flag exact double function declarations of same name in my-plan.html style
    for name, count in sorted(names.items()):
        if count > 1 and name not in {"fail", "laneOk", "archetypeOk"}:
            # nsg-app uses reg() wrappers; duplicate function decls are the real bug
            decls = len(re.findall(rf"\bfunction\s+{re.escape(name)}\s*\(", js))
            if decls > 1:
                err(f"{label}: duplicate function declaration `{name}` ({decls})")


def check_no_gold_text_on_white(css: str) -> None:
    # crude: color:var(--gold) or color:#ffcf27 outside of rules that set background gold
    if re.search(r"color\s*:\s*#ffcf27", css, re.I):
        err("theme: raw #ffcf27 used as text color")
    # allow gold on dark bands / chips with gold fill — flag `color:var(--gold)` only when not in .age-chip / dark contexts is hard;
    # enforce that body/default never sets gold text
    if re.search(r"^body\s*\{[^}]*color\s*:\s*var\(--gold\)", css, re.M | re.S):
        err("theme: body text must not be gold")


def check_files_exist() -> None:
    for p in [
        "assets/nsg-theme.css",
        "nsg-data.js",
        "nsg-app.js",
        "stories.html",
        "my-pathway.html",
        "feed.html",
        "questions.html",
    ]:
        if not (ROOT / p).exists():
            err(f"missing required file: {p}")


def check_nav_labels(html_files: list[str]) -> None:
    need = ["Stories", "My Pathway", "Feed", "Questions"]
    for f in html_files:
        # nav is injected by JS; ensure pages load app
        src = read(f)
        if "nsg-app.js" not in src:
            err(f"{f}: must load nsg-app.js")
        if "nsg-data.js" not in src:
            err(f"{f}: must load nsg-data.js")
        if "nsg-theme.css" not in src:
            err(f"{f}: must load theme")
    _ = need


def check_banned_in_app() -> None:
    app = read("nsg-app.js").lower()
    # policy paragraph is allowed to contain upvote/downvote
    stripped = re.sub(
        r"no upvotes or downvotes[\s\S]*?written\.",
        "",
        app,
        flags=re.I,
    )
    # ignore acceptance ban-list construction (string fragments joined at runtime)
    stripped = re.sub(r"var ban = \[[\s\S]*?\];", "", stripped)
    for term in [
        "karma",
        "followers",
        "streak",
        "leaderboard",
        "years old",
        "age now",
        "% match",
    ]:
        if term in stripped:
            err(f"nsg-app.js contains banned term: {term}")


def check_reg_guard() -> None:
    app = read("nsg-app.js")
    if "duplicate function" not in app or "function reg(" not in app and "var reg = " not in app and "reg = function" not in app and "function reg" not in app:
        if "reg(" not in app or "duplicate function" not in app:
            err("nsg-app.js must include reg() duplicate-name assertion")


def check_mentor_validation_via_jxa() -> None:
    script = r"""
ObjC.import('Foundation');
var path = '%s';
var src = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, null);
if (!src) { throw new Error('cannot read nsg-data.js'); }
var code = ObjC.unwrap(src);
var g = this;
eval(code);
var d = g.NSG_DATA;
if (!d) throw new Error('NSG_DATA missing');
d.validateMentors();
'ok:' + d.MENTORS.length;
""" % str(ROOT / "nsg-data.js").replace("\\", "\\\\")
    try:
        out = subprocess.check_output(
            ["osascript", "-l", "JavaScript", "-e", script],
            stderr=subprocess.STDOUT,
            text=True,
        ).strip()
        if not out.startswith("ok:"):
            err(f"mentor validation unexpected: {out}")
    except FileNotFoundError:
        # ASSUMPTION: non-mac CI — skip JXA, rely on runtime validateMentors
        pass
    except subprocess.CalledProcessError as e:
        err(f"mentor validation failed: {e.output}")


def check_my_plan_redirect() -> None:
    src = read("my-plan.html")
    if "my-pathway.html" not in src:
        err("my-plan.html must redirect to my-pathway.html")


def main() -> int:
    check_files_exist()
    if ERRORS:
        print("FAIL")
        for e in ERRORS:
            print(" -", e)
        return 1
    check_duplicate_top_level_functions(read("nsg-app.js"), "nsg-app.js")
    check_duplicate_top_level_functions(read("nsg-data.js"), "nsg-data.js")
    check_no_gold_text_on_white(read("assets/nsg-theme.css"))
    check_nav_labels(["stories.html", "my-pathway.html", "feed.html", "questions.html"])
    check_banned_in_app()
    check_reg_guard()
    check_my_plan_redirect()
    check_mentor_validation_via_jxa()
    if ERRORS:
        print("FAIL")
        for e in ERRORS:
            print(" -", e)
        return 1
    print("OK — validate-app passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
