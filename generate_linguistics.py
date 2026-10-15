#!/usr/bin/env python3
"""Fonte acadêmica curada: content/linguistics_chapters.json.

Gera linguistics-data.js para o navegador. Nenhuma dependência externa.
Use --check para verificar a sincronização sem alterar arquivos.
"""
from pathlib import Path
import json
import argparse
ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/'content'/'linguistics_chapters.json'
TARGET=ROOT/'linguistics-data.js'

def render():
    chapters=json.loads(SOURCE.read_text(encoding='utf-8'))
    return 'window.STORYLAB_LINGUISTICS = '+json.dumps(chapters,ensure_ascii=False,separators=(',',':'))+';\n'

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--check',action='store_true')
    args=parser.parse_args()
    output=render()
    if args.check:
        if not TARGET.is_file() or TARGET.read_text(encoding='utf-8') != output:
            raise SystemExit('linguistics-data.js desatualizado; execute python generate_linguistics.py')
        print('Dossiês de linguística sincronizados.')
    else:
        TARGET.write_text(output,encoding='utf-8')
        print('Dossiês de linguística gerados:',TARGET)

if __name__=='__main__':
    main()
