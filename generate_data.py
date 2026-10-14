#!/usr/bin/env python3
"""Gera data.js a partir do conteúdo editorial JSON (fonte principal)."""
from pathlib import Path
import argparse
import json
ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/'content/storylab_data.json'
TARGET=ROOT/'data.js'
def render():
    data=json.loads(SOURCE.read_text(encoding='utf-8'))
    return 'window.STORYLAB_DATA = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
def main():
    p=argparse.ArgumentParser()
    p.add_argument('--check',action='store_true')
    args=p.parse_args()
    result=render()
    if args.check:
        if not TARGET.exists() or TARGET.read_text(encoding='utf8')!=result:
            raise SystemExit('data.js está defasado. Execute python generate_data.py')
        print('data.js sincronizado')
    else:
        TARGET.write_text(result,encoding='utf8')
        print('data.js atualizado')
if __name__=='__main__':main()
