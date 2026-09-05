# One-off parser: CareersV3.md Part 2 + Part 5 -> _proto/data.js
# Not loaded by the app.
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD = (ROOT / "CareersV3.md").read_text(encoding="utf-8")
DATA = ROOT / "_proto" / "data.js"

BUCKET_MAP = [
    ("science", ["Science & Medicine", "Science and Medicine"]),
    ("trade", ["Trade & TVET", "Trade and TVET"]),
    ("education", ["Education"]),
    ("sports", ["Sports"]),
    ("engineering", ["Engineering"]),
    ("creative", ["Creative Industry"]),
    ("tech", ["Technology"]),
    (
        "business",
        [
            "Business & Entrepreneurship",
            "Business and Entrepreneurship",
            "Business and Enterprise",
        ],
    ),
    ("public", ["Public Service & Government", "Public Service"]),
    ("law", ["Law & Humanities"]),
    ("agri", ["Agriculture"]),
]

PART2_HEADS = [
    ("science", "Science & Medicine"),
    ("trade", "Trade & TVET"),
    ("education", "Education"),
    ("sports", "Sports"),
    ("engineering", "Engineering"),
    ("creative", "Creative Industry"),
    ("tech", "Technology"),
    ("business", "Business & Entrepreneurship"),
    ("public", "Public Service & Government"),
    ("law", "Law & Humanities"),
    ("agri", "Agriculture"),
]

ROUTE_LABELS = [
    "Current routes",
    "Current route",
    "Guyana pathway",
    "Post-CSEC routes",
    "Form 6 or post-CSEC",
    "Post-CSEC",
    "Alternative route",
    "Entry route",
    "Training route",
    "Specialisation",
    "Routes",
    "Route",
]

GATE_LABELS = [
    "Professional gate",
    "Professional route",
    "Licensing",
    "Registration",
]

TR_RULES = [
    ("cape", re.compile(r"\bCAPE\b|sixth form", re.I)),
    ("degree", re.compile(r"\bUG\b|University of Guyana|BSc|BA\b|\bdegree\b|SEBI", re.I)),
    (
        "tvet",
        re.compile(
            r"\bGTI\b|technical institute|\bCVQ\b|\bTVET\b|\bBIT\b|Carnegie|apprentic|craft|competenc",
            re.I,
        ),
    ),
    ("health", re.compile(r"Ministry of Health|health training|\bMedex\b", re.I)),
    ("teach", re.compile(r"\bCPCE\b|teacher education|Cyril Potter", re.I)),
    ("agri", re.compile(r"\bGSA\b|Guyana School of Agriculture", re.I)),
    ("service", re.compile(r"recruit|\bGDF\b|Police|Prison|Fire Service|cadet", re.I)),
    ("port", re.compile(r"portfolio|talent|audition|selection trial|election", re.I)),
]


def strip_html(s):
    s = re.sub(r"<[^>]*>", "", s or "")
    s = re.sub(r"<[a-zA-Z/][^>]*$", "", s)
    return s


def strip_links(s):
    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1", s or "")


def strip_sources(s):
    s = s or ""
    s = re.sub(r"\s*Sources?:\s*https?://\S+", "", s, flags=re.I)
    s = re.sub(r"\s*Sources?:\s+[^.]+\.?", "", s, flags=re.I)
    s = re.sub(r"\s*Sources?:\s*", " ", s, flags=re.I)
    return s


def dash_to_comma(s):
    return re.sub(r"[—–]", ",", s or "")


def tidy(s):
    s = (s or "").replace("\u00a0", " ")
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"\s+([,.;:])", r"\1", s)
    s = re.sub(r",\s*,", ",", s)
    s = re.sub(r"^[·•\-\s,]+", "", s)
    s = re.sub(r"[·•\s,]+$", "", s)
    return s.strip()


def clean(s):
    s = strip_links(s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    s = s.replace("**", "")
    s = strip_sources(s)
    s = strip_html(s)
    s = dash_to_comma(s)
    return tidy(s)


def cap(s, n):
    s = clean(s)
    if not s:
        return ""
    if len(s) <= n:
        return strip_html(s)
    slice_ = s[:n]
    cut = slice_.rfind(". ")
    if cut < n * 0.45:
        cut = slice_.rfind("! ")
    if cut < n * 0.45:
        cut = slice_.rfind("? ")
    if cut >= n * 0.45:
        s = slice_[: cut + 1]
    else:
        comma = slice_.rfind(", ")
        if comma >= n * 0.45:
            s = slice_[:comma]
        else:
            s = re.sub(r"\s+\S*$", "", slice_)
    return strip_html(tidy(s))


def first_url(block):
    m = re.search(r"https?://[^\s)\]>\"']+", block or "")
    if not m:
        return ""
    return re.sub(r"[.,;]+$", "", m.group(0))


def labeled(block, labels):
    out = []
    for lab in labels:
        re_lab = re.escape(lab)
        m = re.search(
            r"\*\*"
            + re_lab
            + r":\*\*\s*([\s\S]*?)(?=\n\s*\*\*[^*\n]+:\*\*|\n\s*---\s*|$)",
            block,
            re.I,
        )
        if m and tidy(m.group(1)):
            out.append(m.group(1))
    return out


def labeled_one(block, labels):
    parts = labeled(block, labels)
    return " ".join(parts) if parts else ""


def bucket_keys(line):
    keys = []
    for key, names in BUCKET_MAP:
        if any(name in line for name in names):
            keys.append(key)
    return keys


def derive_tr(route, gate, dev):
    text = " ".join([route, gate, dev])
    out = [k for k, rx in TR_RULES if rx.search(text)]
    return out or ["degree"]


def parse_buckets(md):
    start = md.find("# PART 2")
    end = md.find("# PART 3")
    part = md[start:end]
    buckets = {}
    for key, head in PART2_HEADS:
        m = re.search(
            r"## " + re.escape(head) + r"\s*([\s\S]*?)(?=\n## |$)",
            part,
        )
        block = m.group(1) if m else ""
        buckets[key] = {
            "explore": clean(
                labeled_one(block, ["Forms 1–3 exploration", "Forms 1-3 exploration"])
            ),
            "csec": clean(labeled_one(block, ["Recommended CSEC planning"])),
            "cape": clean(labeled_one(block, ["Recommended CAPE planning"])),
            "after": clean(
                labeled_one(block, ["After CSEC/Form 6", "After CSEC or Form 6"])
            ),
        }
    return buckets


def untagged_paragraphs(block):
    paras = []
    buf = []

    def flush():
        t = tidy(" ".join(buf))
        if t:
            paras.append(t)
        buf.clear()

    for line in block.split("\n"):
        line = line.strip()
        if not line:
            flush()
            continue
        if re.match(r"^<a\s", line, re.I) or re.match(r"^---+$", line):
            continue
        if re.match(r"^\*\*[^*]+:\*\*", line):
            flush()
            continue
        buf.append(line)
    flush()
    return paras


def parse_careers(md):
    start = md.find("# PART 5")
    part = md[start:]
    matches = list(re.finditer(r"^## (.+)$", part, re.M))
    careers = []
    for i, m in enumerate(matches):
        raw = m.group(1).strip()
        if "✅" in raw:
            glyph = "✅"
        elif "🟡" in raw:
            glyph = "🟡"
        elif "⚠" in raw:
            glyph = "⚠️"
        else:
            continue
        name = re.sub(r"[\s✅🟡⚠️\uFE0F]+$", "", raw).strip()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(part)
        block = part[m.start() : end]
        status = "confirmed" if glyph == "✅" else "varies" if glyph == "🟡" else "portfolio"
        buckets_line = labeled_one(block, ["Buckets"])
        f13 = labeled_one(block, ["Forms 1–3", "Forms 1-3"])
        csec = labeled_one(
            block,
            [
                "Forms 4–5 — recommended CSEC",
                "Forms 4-5 — recommended CSEC",
                "Forms 4–5",
                "Forms 4-5",
            ],
        )
        helpful = labeled_one(block, ["Helpful subjects"])
        if helpful:
            csec = (csec + " " + helpful).strip()
        cape = labeled_one(
            block,
            ["Form 6 — recommended CAPE", "Form 6 - recommended CAPE", "Form 6"],
        )
        route_parts = labeled(block, ROUTE_LABELS)
        route = " ".join(route_parts)
        gate = labeled_one(block, GATE_LABELS)
        if not clean(route):
            for para in untagged_paragraphs(block):
                if len(clean(para)) > 80:
                    route = para
                    break
        if not clean(route) and clean(gate):
            route = gate
        dev = labeled_one(block, ["Current development"])
        jobs = labeled_one(block, ["First jobs", "First roles"])
        careers.append(
            {
                "n": name,
                "s": status,
                "b": bucket_keys(buckets_line),
                "f13": cap(f13, 200),
                "csec": cap(csec, 260),
                "cape": cap(cape, 220),
                "route": cap(route, 420),
                "gate": cap(gate, 260),
                "dev": cap(dev, 200),
                "jobs": cap(jobs, 180),
                "src": first_url(block),
                "tr": derive_tr(clean(route), clean(gate), clean(dev)),
            }
        )
    return careers


def report(careers, buckets):
    tr = {k: 0 for k, _ in TR_RULES}
    status = {"confirmed": 0, "varies": 0, "portfolio": 0}
    html_hits = []
    dash_hits = []
    empty_route = []
    empty_bucket = []
    fields = ["f13", "csec", "cape", "route", "gate", "dev", "jobs"]
    for c in careers:
        status[c["s"]] = status.get(c["s"], 0) + 1
        for k in c["tr"]:
            tr[k] = tr.get(k, 0) + 1
        if not c["b"]:
            empty_bucket.append(c["n"])
        if not c["route"]:
            empty_route.append(c["n"])
        for f in fields:
            val = c.get(f) or ""
            if "<" in val:
                html_hits.append(c["n"] + " " + f)
            if re.search(r"[—–]", val):
                dash_hits.append(c["n"] + " " + f)
    print("careers", len(careers))
    print("buckets", len(buckets))
    print("status", json.dumps(status))
    print("tr", json.dumps(tr))
    print("empty buckets", " | ".join(empty_bucket) if empty_bucket else "none")
    print("empty route", " | ".join(empty_route) if empty_route else "none")
    print("html leftovers", " | ".join(html_hits) if html_hits else "none")
    print("dash leftovers", " | ".join(dash_hits) if dash_hits else "none")


def main():
    buckets = parse_buckets(MD)
    careers = parse_careers(MD)
    report(careers, buckets)
    block = (
        "/* CAREERSV3:BEGIN */\n"
        "var BUCKETS = "
        + json.dumps(buckets, indent=2, ensure_ascii=False)
        + ";\n\n"
        "var CAREERS = "
        + json.dumps(careers, indent=2, ensure_ascii=False)
        + ";\n"
        "/* CAREERSV3:END */"
    )
    src = DATA.read_text(encoding="utf-8")
    if "/* CAREERSV3:BEGIN */" not in src:
        raise SystemExit("CAREERSV3 markers missing in data.js")
    src = re.sub(
        r"/\* CAREERSV3:BEGIN \*/[\s\S]*?/\* CAREERSV3:END \*/",
        block,
        src,
        count=1,
    )
    DATA.write_text(src, encoding="utf-8")
    print("wrote", DATA)


if __name__ == "__main__":
    main()
