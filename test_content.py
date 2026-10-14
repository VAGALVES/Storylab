"""Testes editoriais determinísticos e segurança de IDs estáveis."""
from pathlib import Path
import json,subprocess,sys
r=Path(__file__).resolve().parent
d=json.loads((r/'content/storylab_data.json').read_text(encoding='utf8'))
assert len(d['schools'])==6
assert len(d['courses'])==43
assert len(d['phrases'])==552
assert len(d['deepLessons'])==49
assert len(d['speechDrills'])==24
assert len(d['missions'])==30
assert len({p['id'] for p in d['phrases']})==len(d['phrases'])
assert len({v['id'] for v in d['speechDrills']})==len(d['speechDrills'])
course_ids={c['id'] for c in d['courses']}
assert all(k.split(':')[0] in course_ids for k in d['deepLessons'])
assert all(len(lesson['steps'])>=3 and lesson['assignment'] and lesson['rubric'] for lesson in d['deepLessons'].values())
for c in d['courses']:
 if c['school']=='comunicacao':
  for i in range(4):assert c['id']+':'+str(i) in d['deepLessons'],c['id']+':'+str(i)
assert all(p['pt'].strip() for p in d['phrases'])
assert all(set(('weak','strong','why','challenge')).issubset(v) for v in d['speechDrills'])
for name in ('index.html','style.css','app.js','data.js','service-worker.js','manifest.webmanifest'):
 assert (r/name).is_file(),name
subprocess.run([sys.executable,str(r/'generate_data.py'),'--check'],check=True)
print('Conteúdo: 43 disciplinas, 49 aulas, 552 frases, 24 transformações — OK')
