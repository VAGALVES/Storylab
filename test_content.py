"""Testes editoriais determinísticos e segurança de IDs estáveis."""
from pathlib import Path
import json,subprocess,sys
r=Path(__file__).resolve().parent
d=json.loads((r/'content/storylab_data.json').read_text(encoding='utf8'))
assert len(d['schools'])==6
assert len(d['courses'])==43
assert len(d['phrases'])==657
assert len(d['families'])==30
# Famílias da linguagem jornalística: toda estrutura traz nota de uso específica
JOURNALISM={'encadeamento','atribuicao','leads','telejornalismo','precisao','estilo'}
assert {f['id'] for f in d['families']}>=JOURNALISM
assert all(len(p.get('note',''))>=60 for p in d['phrases'] if p['family'] in JOURNALISM)
assert all(p['family'] in {f['id'] for f in d['families']} for p in d['phrases'])
assert len({p['pt'].strip() for p in d['phrases']})==len(d['phrases']),'Frases duplicadas'
assert len(d['deepLessons'])==172
assert len(d['speechDrills'])==24
assert len(d['missions'])==30
assert len({p['id'] for p in d['phrases']})==len(d['phrases'])
assert len({v['id'] for v in d['speechDrills']})==len(d['speechDrills'])
course_ids={c['id'] for c in d['courses']}
assert all(k.split(':')[0] in course_ids for k in d['deepLessons'])
assert all(len(lesson['steps'])>=3 and lesson['assignment'] and lesson['rubric'] for lesson in d['deepLessons'].values())
# Currículo integral: todas as 43 disciplinas com as 4 aulas publicadas
for c in d['courses']:
 for i in range(4):assert c['id']+':'+str(i) in d['deepLessons'],c['id']+':'+str(i)
assert all(set(l)=={'title','intro','steps','assignment','rubric'} for l in d['deepLessons'].values())
assert all(all(s['title'].strip() and s['body'].strip() and s['example'].strip() for s in l['steps']) for l in d['deepLessons'].values())
assert len({l['title'] for l in d['deepLessons'].values()})==len(d['deepLessons']),'Títulos de aula duplicados'
assert all(p['pt'].strip() for p in d['phrases'])
assert all(set(('weak','strong','why','challenge')).issubset(v) for v in d['speechDrills'])
for name in ('index.html','style.css','app.js','data.js','service-worker.js','manifest.webmanifest'):
 assert (r/name).is_file(),name
subprocess.run([sys.executable,str(r/'generate_data.py'),'--check'],check=True)
print('Conteúdo: 43 disciplinas, 172 aulas, 657 frases em 30 famílias, 24 transformações — OK')

atlas=json.loads((r/'content/atlas_guides.json').read_text(encoding='utf8'))
assert len(atlas)==len(d['atlas'])==28
assert sum(len(group['terms']) for group in atlas)==415
assert sum(len(group['model']) for group in atlas)==112
for i,group in enumerate(atlas):
    assert len(group['terms'])>=10 and len(group['model'])==4
    assert len({t[0] for t in group['terms']})==len(group['terms']),'Termo repetido no campo'
    assert all(len(s)>=60 for s in group['model'])
    for term,definition,example,caution in group['terms']:
        assert term in d['atlas'][i]['terms']
        assert all(len(v)>=15 for v in (definition,example,caution))
assert all([entry[0] for entry in group['terms']]==d['atlas'][i]['terms'] for i,group in enumerate(atlas))
assert (r/'atlas-engine.js').is_file()
assert (r/'atlas-recorder.js').is_file() and (r/'atlas-audio-ui.js').is_file()
# Trocas de precisão: palavra genérica → termos do próprio campo
all_terms={t for topic in d['atlas'] for t in topic['terms']}
assert sum(len(group['swaps']) for group in atlas)==84
for i,group in enumerate(atlas):
    assert len(group['swaps'])==3
    for s in group['swaps']:
        assert set(s)=={'vague','options','weak','strong','flag'}
        assert len(s['options'])==3 and all(o in d['atlas'][i]['terms'] for o in s['options']),s
        assert s['vague'] not in d['atlas'][i]['terms'],s['vague']
        assert not (s['flag'] and s['vague'] in all_terms),'Palavra detectável não pode ser termo oficial: '+s['vague']
        assert len(s['weak'])>=10 and len(s['strong'])>len(s['weak'])
        assert any(o.lower()[:5] in s['strong'].lower() for o in s['options']),'Frase forte deve usar uma das opções: '+s['strong']
subprocess.run([sys.executable,str(r/'generate_atlas.py'),'--check'],check=True)
print('Atlas: 28 campos, 415 verbetes, 112 modelos progressivos e 84 trocas de precisão — OK')
