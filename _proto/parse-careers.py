# CareersV3 parser. Reads the markdown guide and writes:
#   _proto/careers.json  seed (full card schema; overlays live elsewhere)
#   _proto/data.js       compact CAREERS + BUCKETS (My Pathway indexes)
# Re-run when the guide is updated. Approved edits are not in this file.
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD_PATH = ROOT / "CareersV3(1).md"
if not MD_PATH.exists():
    MD_PATH = ROOT / "CareersV3.md"
MD = MD_PATH.read_text(encoding="utf-8")
DATA = ROOT / "_proto" / "data.js"

BUCKET_MAP = [
    ("science", ["Science & Medicine", "Science and Medicine"]),
    ("trade", ["Trade & TVET", "Trade and TVET"]),
    ("education", ["Education & Community", "Education and Community"]),
    ("engineering", ["Engineering & Energy", "Engineering and Energy"]),
    ("tech", ["Technology"]),
    (
        "business",
        [
            "Business & Entrepreneurship",
            "Business and Entrepreneurship",
            "Business and Enterprise",
        ],
    ),
    ("public", ["Public Service & Law", "Public Service and Law", "Public Service"]),
    ("agri", ["Agriculture & Environment", "Agriculture and Environment"]),
    ("transport", ["Transport & Logistics", "Transport and Logistics"]),
    ("creative", ["Creative Industries", "Creative Industry"]),
    ("hospitality", ["Hospitality & Tourism", "Hospitality and Tourism"]),
]

PART2_HEADS = [
    ("science", "Science & Medicine"),
    ("trade", "Trade & TVET"),
    ("education", "Education & Community"),
    ("engineering", "Engineering & Energy"),
    ("tech", "Technology"),
    ("business", "Business & Entrepreneurship"),
    ("public", "Public Service & Law"),
    ("agri", "Agriculture & Environment"),
    ("transport", "Transport & Logistics"),
    ("creative", "Creative Industries"),
    ("hospitality", "Hospitality & Tourism"),
]

ROUTE_LABELS = [
    "Guyana pathway",
    "Current routes",
    "Current route",
    "Post-CSEC routes",
    "Form 6 / post-CSEC route",
    "Form 6 or post-CSEC",
    "Post-CSEC",
    "Professional route",
    "Alternative route",
    "Specialisation",
    "Entry route",
    "Training route",
    "Routes",
    "Route",
]

GATE_LABELS = [
    "Professional gate",
    "Licensing",
    "Registration",
]

EXPECT_FIELDS = {
    "trade": 50,
    "business": 47,
    "science": 45,
    "tech": 45,
    "engineering": 43,
    "public": 29,
    "creative": 25,
    "agri": 16,
    "education": 15,
    "transport": 13,
    "hospitality": 7,
}

DOMAIN_INST = [
    ("uog.edu.gy", "University of Guyana"),
    ("goal.edu.gy", "GOAL"),
    ("agriculture.gov.gy", "Guyana School of Agriculture"),
    ("labour.gov.gy", "Board of Industrial Training"),
    ("tvet.gov.gy", "TVET Hub"),
    ("icag.org.gy", "Institute of Chartered Accountants of Guyana"),
]

PROSE_INST = [
    (re.compile(r"University of Guyana|\bUG\b", re.I), "University of Guyana"),
    (re.compile(r"\bGOAL\b", re.I), "GOAL"),
    (re.compile(r"Guyana School of Agriculture|\bGSA\b", re.I), "Guyana School of Agriculture"),
    (re.compile(r"Board of Industrial Training|\bBIT\b", re.I), "Board of Industrial Training"),
    (re.compile(r"Government Technical Institute|\bGTI\b", re.I), "Government Technical Institute"),
    (re.compile(r"New Amsterdam Technical Institute|\bNATI\b", re.I), "New Amsterdam Technical Institute"),
    (re.compile(r"Cyril Potter(?: College of Education)?|\bCPCE\b", re.I), "Cyril Potter College of Education"),
    (re.compile(r"Institute of Chartered Accountants of Guyana|\bICAG\b", re.I), "Institute of Chartered Accountants of Guyana"),
    (re.compile(r"Hugh Wooding Law School", re.I), "Hugh Wooding Law School"),
    (re.compile(r"TVET Hub", re.I), "TVET Hub"),
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
    s = s or ""
    s = re.sub(r"(\d)\s*[—–]\s*(\d)", r"\1 to \2", s)
    return re.sub(r"[—–]", ",", s)


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


def derive_tr(*parts):
    text = " ".join(parts)
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
        after = clean(
            labeled_one(
                block,
                [
                    "Form 6/after CSEC",
                    "Form 6 / after CSEC",
                    "After CSEC/Form 6",
                    "After CSEC or Form 6",
                ],
            )
        )
        buckets[key] = {
            "explore": clean(
                labeled_one(
                    block,
                    [
                        "Forms 1–3",
                        "Forms 1-3",
                        "Forms 1–3 exploration",
                        "Forms 1-3 exploration",
                    ],
                )
            ),
            "csec": clean(
                labeled_one(
                    block,
                    [
                        "Forms 4–5",
                        "Forms 4-5",
                        "Recommended CSEC planning",
                    ],
                )
            ),
            "cape": clean(labeled_one(block, ["Recommended CAPE planning"])) or after,
            "after": after,
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
                "Forms 4–5 — recommended CSEC/CVQ",
                "Forms 4-5 — recommended CSEC/CVQ",
                "Forms 4–5 — recommended CSEC",
                "Forms 4-5 — recommended CSEC",
                "Forms 4–6 — recommended subjects",
                "Forms 4-6 — recommended subjects",
                "Forms 4–5",
                "Forms 4-5",
            ],
        )
        helpful = labeled_one(block, ["Helpful subjects"])
        if helpful:
            csec = (csec + " " + helpful).strip()
        cape = labeled_one(
            block,
            [
                "Form 6 — recommended CAPE",
                "Form 6 – recommended CAPE",
                "Form 6 - recommended CAPE",
            ],
        )
        steam = labeled_one(block, ["STEAM focus"])
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
        if not clean(jobs):
            m_jobs = re.search(
                r"First (?:jobs|roles) include[:\s]+(.+?)(?:\.\s|$)",
                block,
                re.I,
            )
            if m_jobs:
                jobs = m_jobs.group(1)
        cape_clean = clean(cape)
        cape_for_tr = (
            cape_clean + " CAPE"
            if cape_clean and not re.search(r"CAPE is optional", cape_clean, re.I)
            else ""
        )
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
                "steam": cap(steam, 180),
                "src": first_url(block),
                "tr": derive_tr(
                    clean(route),
                    clean(gate),
                    clean(dev),
                    cape_for_tr,
                    clean(csec),
                ),
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
    fields = ["f13", "csec", "cape", "route", "gate", "dev", "jobs", "steam"]
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
    print("source", MD_PATH.name)
    print("careers", len(careers))
    print("buckets", len(buckets))
    by_b = {k: 0 for k, _ in PART2_HEADS}
    for c in careers:
        for k in c["b"]:
            by_b[k] = by_b.get(k, 0) + 1
    print("per bucket", json.dumps(by_b))
    print("status", json.dumps(status))
    print("tr", json.dumps(tr))
    print("empty buckets", " | ".join(empty_bucket) if empty_bucket else "none")
    print("empty route", " | ".join(empty_route) if empty_route else "none")
    print("html leftovers", " | ".join(html_hits) if html_hits else "none")
    print("dash leftovers", " | ".join(dash_hits) if dash_hits else "none")


def slug(name):
    s = re.sub(r"[^a-z0-9]+", "-", (name or "").lower()).strip("-")
    return s or "career"


def host_of(url):
    m = re.search(r"https?://([^/\s]+)", url or "")
    return (m.group(1) if m else "").lower().replace("www.", "")


def inst_for_host(host):
    for dom, name in DOMAIN_INST:
        if host == dom or host.endswith("." + dom):
            return name
    return ""


def extract_links(block):
    seen = set()
    out = []
    for label, url in re.findall(r"\[([^\]]+)\]\((https?://[^)]+)\)", block or ""):
        url = re.sub(r"[.,;]+$", "", url)
        if url in seen:
            continue
        seen.add(url)
        out.append({"label": clean(label) or url, "url": url})
    for url in re.findall(r"https?://[^\s)\]>\"']+", block or ""):
        url = re.sub(r"[.,;]+$", "", url)
        if url in seen:
            continue
        seen.add(url)
        out.append({"label": url, "url": url})
    return out


def seed_study(block):
    links = extract_links(block)
    rows = {}
    other = []
    for link in links:
        name = inst_for_host(host_of(link["url"]))
        if not name:
            other.append(link)
            continue
        row = rows.setdefault(name, {"institution": name, "course": "", "links": []})
        row["links"].append(link)
    text = strip_links(block or "")
    for rx, name in PROSE_INST:
        if name in rows:
            continue
        if rx.search(text):
            rows[name] = {"institution": name, "course": "", "links": []}
    study = list(rows.values())
    study.sort(key=lambda r: r["institution"])
    return study, other


def parse_helpful(block):
    return clean(labeled_one(block, ["Helpful subjects"]))


def rich_career(c, block, ix):
    helpful = parse_helpful(block)
    study, other = seed_study(block)
    return {
        "id": slug(c["n"]),
        "ix": ix,
        "title": c["n"],
        "status": c["s"],
        "fields": c["b"][:],
        "entryFrom": "",
        "timeTakes": "",
        "licence": "",
        "routes": [],
        "routeGuide": c["route"],
        "study": study,
        "otherLinks": other,
        "forms13": c["f13"],
        "development": c["dev"],
        "gate": c["gate"],
        "firstJobs": c["jobs"],
        "csec": c["csec"],
        "cape": c["cape"],
        "helpful": helpful,
        "verified": "2026-09-07",
        "published": True,
    }


def assert_field_counts(careers):
    by_b = {k: 0 for k in EXPECT_FIELDS}
    empty = []
    total = 0
    for c in careers:
        if not c.get("b"):
            empty.append(c["n"])
        for k in c.get("b") or []:
            if k in by_b:
                by_b[k] += 1
                total += 1
    if empty:
        raise SystemExit("parse failed: careers with zero fields: " + " | ".join(empty))
    if len(careers) != 142:
        raise SystemExit("parse failed: expected 142 careers, got " + str(len(careers)))
    if total != 335:
        raise SystemExit("parse failed: expected 335 field memberships, got " + str(total))
    bad = {k: by_b[k] for k in EXPECT_FIELDS if by_b[k] != EXPECT_FIELDS[k]}
    if bad:
        raise SystemExit("parse failed: field counts " + json.dumps(bad) + " vs " + json.dumps(EXPECT_FIELDS))


def main():
    buckets = parse_buckets(MD)
    start = MD.find("# PART 5")
    part = MD[start:]
    matches = list(re.finditer(r"^## (.+)$", part, re.M))
    careers = parse_careers(MD)
    rich = []
    used = {}
    for i, c in enumerate(careers):
        ident = slug(c["n"])
        if ident in used:
            ident = ident + "-" + str(i)
        used[ident] = True
        c["id"] = ident
        block = ""
        for j, m in enumerate(matches):
            raw_h = m.group(1).strip()
            name = re.sub(r"[\s✅🟡⚠️\uFE0F]+$", "", raw_h).strip()
            if name == c["n"]:
                end = matches[j + 1].start() if j + 1 < len(matches) else len(part)
                block = part[m.start() : end]
                break
        row = rich_career(c, block, i)
        row["id"] = ident
        rich.append(row)
    assert_field_counts(careers)
    report(careers, buckets)
    seed = {"careers": rich, "guides": buckets, "generatedFrom": MD_PATH.name}
    out_json = ROOT / "_proto" / "careers.json"
    out_json.write_text(json.dumps(seed, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("wrote", out_json)
    with_links = sum(1 for r in rich if r["study"] or r["otherLinks"])
    study_rows = sum(len(r["study"]) for r in rich)
    study_linked = sum(1 for r in rich for s in r["study"] if s["links"])
    other_n = sum(len(r["otherLinks"]) for r in rich)
    other_c = sum(1 for r in rich if r["otherLinks"])
    print("study careers", with_links, "rows", study_rows, "rows with link", study_linked)
    print("other links", other_n, "across", other_c, "careers")
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
