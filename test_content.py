#!/usr/bin/env python3
"""Verificações de integridade editorial e sincronização de conteúdo."""
from pathlib import Path
import json
import subprocess
import sys

root = Path(__file__).resolve().parent
data = json.loads((root / "content" / "storylab_data.json").read_text(encoding="utf-8"))
assert len(data["courses"]) == 43, "disciplinas"
assert len(data["phrases"]) == 432, "fraseoteca"
assert len(data["missions"]) == 30, "missões"
for p in ("index.html", "style.css", "app.js", "data.js", "manifest.webmanifest", "service-worker.js"):
    assert (root / p).is_file(), f"arquivo ausente: {p}"
subprocess.run([sys.executable, str(root / "generate_data.py"), "--check"], check=True)
print("Integridade editorial: OK")
