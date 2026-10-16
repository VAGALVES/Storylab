"""Validação editorial de encaixes: concordância de lacunas, exemplos únicos e montagem."""
from pathlib import Path
import json, re, subprocess, sys
root=Path(__file__).resolve().parent
phrases=json.loads((root/'content/storylab_data.json').read_text(encoding='utf8'))['phrases']
source=json.loads((root/'content/phrase_encaixes.json').read_text(encoding='utf8'))
pairs=source['optionsByPhrase']
eligible={p['id']:p for p in phrases if re.search(r'\.{3}|…',p['pt'])}
assert source['schema']==1
assert set(pairs)==set(eligible), 'Toda frase com lacunas deve ter encaixes'
assert len(pairs)==208 and sum(len(v) for v in pairs.values())==416
assert len({p['pt'] for p in phrases})==len(phrases)
for phrase_id, options in pairs.items():
    base=eligible[phrase_id]['pt']
    blanks=len(re.findall(r'\.{3}|…',base))
    assert len(options)==2,phrase_id
    for option in options:
        assert isinstance(option['label'],str) and 3<=len(option['label'])<=40,phrase_id
        assert len(option['slots'])==blanks,phrase_id
        assert all(isinstance(s,str) and 3<=len(s)<=240 for s in option['slots']),phrase_id
        parts=iter(option['slots'])
        def insert(match):
            value=next(parts)
            prior=base[match.start()-1] if match.start() else ''
            return (' ' if prior.isalnum() and value[0].isalnum() else '')+value
        sample=re.sub(r'\.{3}|…',insert,base)
        assert '...' not in sample and '…' not in sample,phrase_id
        assert not re.search(r'\b(a|de|com|por|sobre|que|entre)(um|uma|o|os|as|a|como)\b',sample,re.I),phrase_id
    assert options[0]['slots'] != options[1]['slots'],phrase_id
assert sum(bool(re.search(r'\.{3}|…',p['pt'])) for p in phrases)==len(pairs)
subprocess.run([sys.executable,str(root/'generate_encaixes.py'),'--check'],check=True)
print('Fraseoteca: 208 estruturas abertas e 416 encaixes editoriais — OK')
