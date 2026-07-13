#!/usr/bin/env python3
"""Build the production CSS/JavaScript files without changing source files."""
from pathlib import Path
import sys

try:
    import rcssmin
    import rjsmin
except ImportError as exc:
    raise SystemExit(
        "Missing build dependency. Run: python -m pip install -r requirements-dev.txt"
    ) from exc

ROOT = Path(__file__).resolve().parents[1]

css_source = (ROOT / "styles/main.css").read_text(encoding="utf-8")
css_output = rcssmin.cssmin(css_source, keep_bang_comments=True)
(ROOT / "styles/main.min.css").write_text(css_output, encoding="utf-8")

catalog_source = (ROOT / "content/catalog.js").read_text(encoding="utf-8")
app_source = (ROOT / "scripts/app.js").read_text(encoding="utf-8")
site_output = rjsmin.jsmin(catalog_source) + ";" + rjsmin.jsmin(app_source)
(ROOT / "scripts/site.min.js").write_text(site_output, encoding="utf-8")

print(f"CSS: {len(css_source.encode()):,} → {len(css_output.encode()):,} bytes")
print(
    "JS: "
    f"{len((catalog_source + app_source).encode()):,} → "
    f"{len(site_output.encode()):,} bytes"
)
