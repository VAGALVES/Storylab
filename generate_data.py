#!/usr/bin/env python3
"""Gera data.js a partir do conteúdo editorial em JSON (fonte editável)."""
from pathlib import Path
import argparse
import json

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "content" / "storylab_data.json"
TARGET = ROOT / "data.js"

def render() -> str:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    return "window.STORYLAB_DATA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="verifica se data.js foi gerado a partir do JSON")
    args = parser.parse_args()
    output = render()
    if args.check:
        if not TARGET.is_file() or TARGET.read_text(encoding="utf-8") != output:
            raise SystemExit("data.js desatualizado: execute python generate_data.py")
        print("data.js sincronizado com content/storylab_data.json")
    else:
        TARGET.write_text(output, encoding="utf-8")
        print("Gerado:", TARGET)

if __name__ == "__main__":
    main()
