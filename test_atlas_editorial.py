#!/usr/bin/env python3
"""Verificações editoriais do Atlas — precisão lexical e cuidados de uso.

Testes automáticos protegem integridade e repetição; avaliação linguística
substantiva continua exigindo leitura e curadoria humana.
"""
from pathlib import Path
from collections import Counter
import json
import re
import unicodedata

ROOT = Path(__file__).resolve().parent
CONTENT = ROOT / "content"
atlas = json.loads((CONTENT / "atlas_guides.json").read_text(encoding="utf-8"))
syllabus = json.loads((CONTENT / "storylab_data.json").read_text(encoding="utf-8"))["atlas"]
audit = json.loads((CONTENT / "atlas_curation_manifest.json").read_text(encoding="utf-8"))

def fold(value):
    return "".join(
        c for c in unicodedata.normalize("NFD", value.casefold())
        if unicodedata.category(c) != "Mn"
    )

assert len(atlas) == len(syllabus) == len(audit["fields"]) == 31
assert audit["reviewed"] == 465
assert audit["changed"] == 178
assert audit["edition"] == "curadoria-precisao-cuidado-2026-10-16"

warnings = []
edited = set()
for index, (field, known, record) in enumerate(zip(atlas, syllabus, audit["fields"])):
    assert record["index"] == index
    assert record["title"] == known["title"]
    assert len(field["terms"]) == len(known["terms"]) == 15
    assert [item[0] for item in field["terms"]] == known["terms"]
    assert len(record["edited"]) == len(set(record["edited"]))
    assert set(record["edited"]).issubset(set(known["terms"]))
    for term, definition, example, caution, scene, collocations in field["terms"]:
        label = (index, term)
        assert isinstance(caution, str) and caution.strip() == caution, label
        assert 95 <= len(caution) <= 430, ("Alerta muito curto ou longo", label, len(caution))
        assert re.search(r"[.!?]$", caution), ("Alerta sem pontuação final", label)
        assert not re.search(r"\b(TODO|FIXME|Lorem ipsum|preencher depois)\b", caution, re.I), label
        assert len(definition) >= 25 and len(example) >= 25, label
        assert scene.count("_____") == 1, label
        assert 4 <= len(collocations) <= 6, label
        if term in record["edited"]:
            assert len(caution) >= 105, ("Alerta revisto sem aprofundamento", label)
            edited.add(label)
        warnings.append((label, caution))

assert len(warnings) == 465 and len(edited) == 178
normalized = [fold(re.sub(r"\s+", " ", warning)).strip() for _, warning in warnings]
duplicates = [text for text, count in Counter(normalized).items() if count > 1]
assert not duplicates, ("Alertas repetidos entre verbetes", duplicates[:5])

# Erros editoriais concretos que motivaram a revisão: prevenir regressão
# para cautelas genéricas, e distinguir explicitamente os mecanismos.
checks = {
    (9, "pesponto"): ("avesso", "estrutura"),
    (9, "oversized"): ("silhueta", "modelagem"),
    (8, "gentrificação"): ("preços", "deslocamento"),
    (8, "espaço residual"): ("uso", "implantação"),
    (10, "caramelizado"): ("maillard", "açúcares"),
    (11, "ruído de fundo"): ("inteligibilidade", "tráfego"),
    (14, "centralizado"): ("praça", "imagem"),
    (16, "cicatriz"): ("origem", "íntima"),
    (21, "iridescente"): ("ângulo", "iluminação"),
    (25, "garoa"): ("gotículas", "continuidade"),
    (26, "na medida em que"): ("causal", "proporcional"),
    (27, "reverberar"): ("repercutir", "sonoras"),
    (29, "debandada"): ("coletiva", "pânico"),
    (30, "coaxar"): ("espécie", "edição"),
}
for (category, term), terms in checks.items():
    caution = next(
        row[3] for row in atlas[category]["terms"] if row[0] == term
    )
    for required in terms:
        assert fold(required) in fold(caution), (category, term, required)

print(
    "Curadoria do Atlas: 465 alertas únicos em 31 campos; "
    "178 reescritos com distinções e limites de uso — OK"
)
