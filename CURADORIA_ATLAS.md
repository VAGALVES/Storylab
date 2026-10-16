# Atlas Descritivo — Curadoria de “Precisão e cuidado”

**Rodada editorial:** 16 de outubro de 2026  
**Âmbito:** 31 campos-base, 465 verbetes, 178 alertas reescritos.  
**Fonte editorial:** `content/atlas_guides.json`, posição 4 de cada entrada (índice `3` no array).

## Por que esta revisão

O alerta de cada termo deve acrescentar conhecimento que a definição e o exemplo não trouxeram. A função é ensinar *quando o termo não pode ser empregado*, com distinções lexicais, implicações gramaticais e limites da evidência. Dizer apenas “confirme”, “evite confundir” ou “observe o contexto” é insuficiente quando não se explica **o quê**, **por quê** e **em que situação**.

## Rubrica editorial obrigatória

1. **Âncora semântica.** A cautela relaciona-se à propriedade, ao contraste ou à regência do próprio termo. Nada de copiar uma recomendação universal em centenas de verbetes.
2. **Contraste funcional.** Sempre que houver vizinho conceitual, mostrar a diferença operacional: *drapeado* não é *prega*; *reverberar* não é sinônimo obrigatório de grande repercussão.
3. **Observável × inferido × comprovado.** Separar indícios da câmera de autoria, intenção, causa, duração e dados que dependem de medição ou fonte.
4. **Uso no relato.** Explicar como o termo altera uma narração, entrevista, roteiro ou legenda; evitar um alerta meramente moralizador.
5. **Linguagem calibrada.** Evitar generalizações categóricas falsas. Modalizadores como “pode”, “geralmente” e “quando” devem refletir a incerteza real, não funcionar como desculpa para imprecisão.
6. **Representação ética.** Aparência, sotaque, gestos e postura não comprovam caráter, saúde, nacionalidade ou intenção. Fotografar uma marca física não autoriza divulgar sua suposta origem.
7. **Concisão com conteúdo.** O alerta precisa oferecer pelo menos uma distinção ou condição útil. Não encher espaço com palavras só para atingir contagem.

## Exemplos reais de antes e depois

### Moda — pesponto

**Antes:** “Não atribua função estrutural sem conhecer a construção.”

**Depois:** “Um pesponto visível pode reforçar a costura, prender margens internas ou apenas ornamentar. Sem observar o avesso e a construção, não conclua que seja estrutural; identifique sua posição e se acompanha uma união de partes.”

**Ganho didático:** apresenta três funções plausíveis e informa a observação necessária para distinguir construção e ornamento.

### Urbanismo — espaço residual

**Antes:** “Residual não significa inútil; observe como as pessoas o ocupam.”

**Depois:** “'Residual' descreve um espaço remanescente de implantação ou infraestrutura, não inutilidade. Um canteiro entre viadutos pode ganhar uso comunitário; diferencie a origem urbanística do espaço de seu uso atual.”

**Ganho didático:** separa categoria de formação do espaço e avaliação de seu uso social.

### Linguística — na medida em que

**Antes:** “Trocá-la por 'à medida que' muda o raciocínio de causa para proporção.”

**Depois:** “'Na medida em que' admite leitura causal ou de proporcionalidade conforme o contexto; não imponha oposição absoluta com 'à medida que'. Quando a relação pretendida for proporção temporal, 'à medida que' costuma torná-la mais clara.”

**Ganho didático:** elimina regra absoluta inadequada e explica a escolha conforme o sentido desejado.

### Comunicação — reverberar

**Antes:** “Mais intenso e duradouro que 'repercutir'. Evite em fatos pequenos: o verbo amplifica.”

**Depois:** “'Reverberar' é prolongar-se por reflexões sonoras e, figuradamente, continuar produzindo efeitos. Não afirma necessariamente intensidade maior que 'repercutir'; em matéria factual, mostre onde e por quanto tempo a consequência persistiu.”

**Ganho didático:** distingue sentido literal e figurado e evita uma hierarquia de intensidade inventada.

### Comportamento coletivo — debandada

**Antes:** “Não use debandada para uma saída gradual; o termo implica pressa e algum grau de pânico.”

**Depois:** “Debandada envolve dispersão rápida e coletiva; não é sinônimo de saída ordenada ao fim de um evento. Mesmo diante de corrida, a causa pode ser desconhecida: não anuncie pânico, ataque ou fuga de perigo sem confirmação.”

**Ganho didático:** nomeia a ação observável sem apresentar pânico como fato automático.

## O que não foi alterado

Esta rodada **não modifica** o nome dos termos, suas definições, frases de narração, lacunas de treino, colocações, sinônimos, desenhos, filtros ou marcações de progresso. O Atlas permanece com 31 campos-base e 465 entradas. As alterações afetam apenas a seção **Precisão e cuidado** de 178 verbetes distribuídos por todos os campos.

Os demais 287 alertas foram examinados e preservados por já trazerem distinções suficientes nesta rodada; isso não significa que nunca precisem de revisão futura.

## Controle de qualidade e limites

- `content/atlas_curation_manifest.json`: registra os 178 verbetes reescritos, agrupados pelos 31 campos, e a rubrica da revisão.
- `python test_atlas_editorial.py`: verifica quantidade, correspondência, textos únicos, tamanho mínimo, pontuação e alertas concretos contra regressão.
- `python generate_atlas.py --check`: confirma que o JSON de origem e o JavaScript distribuído são idênticos.
- `python generate_service_worker.py --check`: confirma a atualização do cache PWA.
- `python build_standalone.py` + comparação Git: confirma que o HTML offline corresponde aos arquivos atuais.

**Limite metodológico:** testes verificam integridade e evitam regressões mecânicas, mas não determinam sozinhos a correção linguística de uma advertência. As observações são editoriais, não revisão por especialistas externos, e pontos técnicos sensíveis ainda podem ser aprimorados com bibliografia e revisores de domínio.
