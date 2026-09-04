#!/usr/bin/env bash
# Assemble app.html from _proto sources.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/app.html"
CSS="$ROOT/_proto/shell.css"
HTML="$ROOT/_proto/shell.html"
DATA="$ROOT/_proto/data.js"
CORE="$ROOT/_proto/app-core.js"
VIEWS="$ROOT/_proto/app-views.js"

{
  cat <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<title>Next Step Guyana · Feed</title>
<link rel="icon" href="favicon.svg" type="image/svg+xml"/>
<link rel="alternate icon" href="logo.png" type="image/png"/>
<link rel="apple-touch-icon" href="logo.png"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
<style>
EOF
  # strip @import line from shell.css (fonts loaded via link)
  sed '/@import/d' "$CSS"
  cat <<'EOF'
</style>
</head>
<body>
EOF
  cat "$HTML"
  cat <<'EOF'
<script src="nsg-cms.js"></script>
<script>
EOF
  cat "$DATA"
  echo
  cat "$CORE"
  echo
  cat "$VIEWS"
  cat <<'EOF'
</script>
</body>
</html>
EOF
} > "$OUT"

echo "Built $OUT ($(wc -c < "$OUT") bytes)"
