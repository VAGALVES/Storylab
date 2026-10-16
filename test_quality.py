"""Quality gates for SVG encoding, generated bundles, and deploy essentials."""
from pathlib import Path
from xml.etree import ElementTree as ET
import re
import json

root = Path(__file__).resolve().parent
index = (root / 'index.html').read_text(encoding='utf-8')
assert 'atlas-recorder.js' in index and 'atlas-audio-ui.js' in index
assert 'linguistics-data.js' in index and 'linguistics-lab.js' in index
assert all(name in index for name in ('trade-data.js','trade-academy-data.js','trade-academy.js','trade-object-data.js','trade-object.js','trade-precision-data.js','trade-precision.js','trade-language-data.js','trade-tools.js','trade-field.js','trade-hub.js'))
assert index.index('trade-data.js') < index.index('trade-academy-data.js') < index.index('trade-academy.js') < index.index('trade-object-data.js') < index.index('trade-object.js') < index.index('trade-precision-data.js') < index.index('trade-precision.js') < index.index('trade-language-data.js') < index.index('trade-tools.js') < index.index('trade-field.js') < index.index('trade-hub.js') < index.index('app.js')
assert 'audio-speech.js' in index and index.index('audio-speech.js') < index.index('app.js')
assert 'encaixes-data.js' in index and 'encaixes-engine.js' in index
assert index.index('encaixes-data.js') < index.index('encaixes-engine.js') < index.index('app.js')
assert index.index('linguistics-data.js') < index.index('linguistics-lab.js') < index.index('app.js')
assert index.index('interact.js') < index.index('app.js'), 'interact.js deve carregar antes do app'
assert index.index('illustrations.js') < index.index('app.js'), 'illustrations.js deve carregar antes do app'
# Botão voltar do celular: navegação interna e confirmação antes de sair
app = (root / 'app.js').read_text(encoding='utf-8')
assert "addEventListener('popstate',onBack)" in app and 'Toque em voltar de novo para sair' in app
assert '<html lang="pt-BR">' in index
assert 'service-worker.js' in (root / 'app.js').read_text(encoding='utf-8')
app_js = (root / 'app.js').read_text(encoding='utf-8')
assert 'controllerchange' in app_js and 'update-banner' in app_js, 'Aviso de nova versão do PWA ausente'

for path in sorted((root / 'assets').glob('*.svg')):
    raw = path.read_text(encoding='utf-8')
    assert '\ufffd' not in raw, f'Unicode replacement marker in {path}'
    assert not re.search(r'Ã[\u0080-\u00bf\u00a0-\u00ff]', raw), f'Likely mojibake in {path}'
    ET.fromstring(raw)  # XML well-formedness
skyline = (root / 'assets/skyline.svg').read_text(encoding='utf-8')
assert 'Ilustração editorial' in skyline
assert 'IlustraÃ' not in skyline

data = json.loads((root / 'content/storylab_data.json').read_text(encoding='utf-8'))
guides = json.loads((root / 'content/atlas_guides.json').read_text(encoding='utf-8'))
assert len(data['atlas']) == len(guides) == 31
assert all(len(topic['terms']) == len(guide['terms']) >= 10 for topic, guide in zip(data['atlas'], guides))
assert all([entry[0] for entry in guide['terms']] == topic['terms'] for topic, guide in zip(data['atlas'], guides))

worker = (root / 'service-worker.js').read_text(encoding='utf-8')
assert 'storylab-static-' in worker and '__HASH__' not in worker
assert "request.mode === 'navigate'" in worker
assert "caches.match(OFFLINE_PAGE)" in worker
for name in ('app.js','style.css','data.js','atlas-engine.js','atlas-recorder.js','atlas-audio-ui.js','interact.js','illustrations.js','linguistics-data.js','linguistics-lab.js','encaixes-data.js','encaixes-engine.js','trade-data.js','trade-academy-data.js','trade-academy.js','trade-object-data.js','trade-object.js','trade-precision-data.js','trade-precision.js','trade-language-data.js','trade-tools.js','trade-field.js','trade-hub.js','audio-speech.js'):
    assert "'./" + name + "'" in worker

readme = (root / 'README.md').read_text(encoding='utf-8')
assert 'test_app.py' not in readme, 'Documentação menciona teste que não existe'
assert 'generate_service_worker.py' in readme
assert 'python test_content.py' in readme
assert 'python test_atlas.mjs' not in readme
print('Qualidade: SVG, codificação, cache offline, dados e documentação — OK')
