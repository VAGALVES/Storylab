#!/usr/bin/env python3
"""Prepara uma distribuição estática do StoryLab para GitHub Pages.

Usa os mesmos arquivos da lista de pré-cache do PWA e gera a edição HTML
autocontida a partir das fontes atuais. Não publica código de testes ou backups.
"""
from pathlib import Path
import shutil

from generate_service_worker import FILES

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "_site"

def main():
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()

    # Os arquivos são sempre relativos à raiz e compartilhados com o PWA.
    for filename in ["index.html", "service-worker.js", *FILES]:
        src = ROOT / filename
        if not src.is_file():
            raise SystemExit(f"Arquivo necessário ausente: {filename}")
        dst = OUTPUT / filename
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)

    # Gerado no workflow pelo build_standalone.py, jamais uma cópia histórica.
    offline = ROOT / "storylab-shanghai-offline.html"
    if not offline.is_file():
        raise SystemExit("Execute python build_standalone.py antes de build_pages.py")
    shutil.copy2(offline, OUTPUT / offline.name)

    (OUTPUT / ".nojekyll").write_text("", encoding="utf-8")
    assert (OUTPUT / "index.html").exists()
    assert (OUTPUT / "service-worker.js").exists()
    assert (OUTPUT / "trade-field.js").exists()
    print(f"GitHub Pages pronto: {sum(1 for path in OUTPUT.rglob('*') if path.is_file())} arquivos")

if __name__ == "__main__":
    main()
