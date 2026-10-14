#!/usr/bin/env python3
"""Gera atlas-data.js a partir de content/atlas_guides.json."""
from pathlib import Path
import json
import argparse
root=Path(__file__).resolve().parent
parser=argparse.ArgumentParser()
parser.add_argument('--check',action='store_true')
args=parser.parse_args()
data=json.loads((root/'content/atlas_guides.json').read_text(encoding='utf-8'))
out='window.STORYLAB_ATLAS_GUIDES = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
target=root/'atlas-data.js'
if args.check:
    if not target.exists() or target.read_text(encoding='utf-8')!=out:
        raise SystemExit('atlas-data.js desatualizado. Execute python generate_atlas.py')
    print('Atlas sincronizado')
else:
    target.write_text(out,encoding='utf-8')
    print('Atlas gerado')
