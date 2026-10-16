#!/usr/bin/env python3
"""Gera a fonte de Encaixes da Fraseoteca a partir de JSON editorial."""
from pathlib import Path
import argparse
import json
ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'content' / 'phrase_encaixes.json'
TARGET = ROOT / 'encaixes-data.js'

def render():
    data = json.loads(SOURCE.read_text(encoding='utf-8'))
    return 'window.STORYLAB_ENCAIXES = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    result = render()
    if args.check:
        if not TARGET.is_file() or TARGET.read_text(encoding='utf-8') != result:
            raise SystemExit('encaixes-data.js está desatualizado; execute python generate_encaixes.py')
        print('Encaixes sincronizados.')
    else:
        TARGET.write_text(result, encoding='utf-8')
        print('Encaixes gerados.')
if __name__ == '__main__':
    main()
