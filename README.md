# STORYLAB SHANGHAI
## Journalism Academy · Versão 2.9 — Atlas ilustrado

Uma escola pessoal de Jornalismo, Comunicação Oral e Narrativas Audiovisuais. A proposta é estudar jornalismo com rigor, transformar a cidade de Xangai em laboratório de campo e adquirir um repertório verbal cada vez mais sofisticado para vlogs, crônicas, entrevistas e reportagens.

**Status:** aplicação funcional de fundação acadêmica, não currículo universitário completo nem serviço de ensino credenciado. Todas as 172 unidades curriculares têm aula integral redigida; o conteúdo é autoral e ainda não passou por revisão de especialistas externos.

## NOVO · Academia da Linguagem Ilustrada (v2.7)

Aulas curriculares resumidas e fundamentação linguística aprofundada têm papéis diferentes. Agora há uma biblioteca acadêmica própria, ligada às disciplinas correspondentes e aberta pelo menu **Linguística Aplicada**, sem confundir os dossiês com novas unidades curriculares.

- **8 dossiês integrais** com 4 explicações acadêmicas cada (32 seções), aplicações em fala, entrevista e narrativa.
- **8 desenhos vetoriais específicos e interativos** (não ilustrações genéricas): produção/escuta da fala, prosódia e foco, sintaxe, inferência, dêixis espacial, coesão, ato de fala e organização de turnos.
- **24 termos do miniglossário**, oito curiosidades científicas e oito contrastes entre formulação vaga e formulação mais precisa.
- **8 atividades com roteiro de 3 passos** e 8 perguntas de verificação de compreensão, com justificativa.
- **Bibliografia de consulta** apontando para materiais da International Phonetic Association, MIT OCW, Stanford Encyclopedia of Philosophy, Cambridge University Press e Open University. Os dossiês são autorais e didáticos, sem alegar revisão institucional ou substituição das obras referidas.
- **Integração curricular contextual:** aulas de oratória, locução, reportagem, audiovisual e descrição exibem ligações para os estudos de linguística relacionados.
- **Salvamento local:** capítulos estudados, respostas dos quizzes e anotações pessoais são incluídos no mesmo backup JSON do restante do StoryLab.
- **Offline:** fonte JSON em `content/linguistics_chapters.json`, gerador `generate_linguistics.py`, módulos `linguistics-data.js` e `linguistics-lab.js`, cache PWA e HTML offline autônomo.

### Como acrescentar ou revisar um dossiê

Edite `content/linguistics_chapters.json`, mantenha estrutura com quatro seções, exemplo aplicado, curiosidade, miniglossário, pergunta e ligações curriculares. Depois execute:

```sh
python generate_linguistics.py
python generate_service_worker.py
python build_standalone.py
python generate_linguistics.py --check
node test_linguistics.mjs
python test_content.py
python test_quality.py
```

Os esquemas são modelos pedagógicos simplificados: setas ilustram relações conceituais e não são provas de causas, intenções ou mecanismos universais. O teste de quiz verifica a resposta selecionada contra o gabarito editorial; não é análise de voz por IA.


### Conteúdo desta edição

| Item | Quantidade | Situação |
|---|---:|---|
| Escolas | 6 | Estruturadas |
| Disciplinas | 43 | Ementas e competências publicadas |
| Unidades curriculares | 172 | Todas com aula integral |
| Aulas integrais | 172 | Texto, 3 conceitos, exemplos, atividade, rubrica e esquema explicativo (184 esquemas) |
| Famílias de linguagem | 30 | Com definição de intenção |
| Frases-base em português | 657 | Todas com nota de uso específica; pesquisáveis no app |
| Equivalentes em inglês | 36 | Seleção inicial, explicitamente incompleta |
| Equivalentes em mandarim | 12 | Seleção inicial com pinyin |
| Atlas de vocabulário | 62 campos; 717 verbetes, incluindo 64 famílias de verbos descritivos bilíngues. Os 31 campos-base foram revistos termo a termo e cada verbete traz frase de cena e 4 a 6 colocações (2.042 no total); treino, relações semânticas e revisão espaçada | Publicado |
| Desafios de expressão oral | 48 | Publicados, em 3 modos |
| Missões de campo | 30 | Checklist, perguntas, narração e caderno de campo |
| Percurso guiado | 12 semanas | Vinculado a aulas, famílias verbais e missões |

### Novidades da v2.9 — Atlas ilustrado

- **12 campos do Atlas ganharam esquema**, no painel de vocabulário, logo abaixo do foco do campo: *Escala e proporção, Luz e sombra, Arquitetura, Moda, Fotografia, Relações espaciais, Mudança temporal, Objetos: forma e partes, Animais: aparência, Vista e panorama, Paisagem natural, Céu e clima*. Escolhi só os campos em que o desenho ensina uma estrutura (peças, direções, posições, escala); campos de adjetivos e sensações continuam só com texto, porque uma figura ali seria decorativa.
- **Anatomia rotulada:** novo tipo de esquema com oito desenhos (fachada, vaso, casaco, ave, corte de relevo, perspectiva de uma vista, luz sobre um volume e planta de rua). Cada peça é rotulada com um termo real do campo. **Ao selecionar um termo que aparece no desenho, ele fica em destaque** (linha e rótulo em laranja).
- **Escada narrativa:** na Prática progressiva, um desenho recolhível mostra os quatro níveis (observar, descrever, comparar, interpretar) e destaca o nível atual.
- **Academia:** cada uma das seis escolas ganhou um ícone próprio no cartão.
- **Verificação:** `test_figures.mjs` confirma que todo rótulo é um termo do campo, que as oito anatomias são usadas e que o destaque funciona; `test_atlas.mjs` confirma a presença do esquema só nos campos certos.

### Novidades da v2.8 — Léxico de Letras, esquemas e navegação

- **Atlas revisto termo a termo:** 170 dos 465 termos dos 31 campos-base foram substituídos por escolhas mais precisas dentro de cada campo semântico. Alguns exemplos: *tez, fisionomia, vinco, esgar, impassível, hirto, claudicar* (pessoas); *pátina, puído, carcomido, rebordo, nervura* (objetos); *escarpa, várzea, meandro, dossel, plúmbeo, bruma* (paisagem e céu); *desaguar em, ricochetear, sedimentar, transbordar* (incidência). Saíram termos básicos como “cabo”, “tampa”, “patas”, “crachá” e “óculos de grau”. Nenhum termo se repete entre campos.
- **Colocações:** cada verbete traz de 4 a 6 combinações consagradas (“luz rasante”, “incidir sobre”, “a voz ecoa”), 2.042 no total. Elas aparecem no verbete e nos cartões, entram na busca universal e, com um toque, vão para o texto da prática.
- **Esquemas explicativos nas 172 aulas:** 184 diagramas desenhados em SVG por `illustrations.js` a partir de especificações declarativas (fluxo, ciclo, pirâmide, comparação, matriz, linha do tempo, espectro, núcleo, Venn, camadas, escalas de plano, regra dos terços e barras com base zero). Seguem o tema claro e o escuro e funcionam offline.
- **Botão voltar do celular:** volta à tela anterior do app em vez de fechá-lo. Na tela inicial, o primeiro toque mostra “Toque em voltar de novo para sair do StoryLab”, e o app fecha só com um segundo toque em até 2 segundos. Janelas abertas e o menu fecham antes.

### Novidades da v2.6 — Oficina de Contraste Visual

- **Treino real de escolha do verbo mais preciso:** duas ilustrações específicas lado a lado, uma cena descritiva, duas opções, sem revelar o gabarito antes da resposta. Ao escolher, o aluno vê a justificativa do acerto/erro, a diferença conceitual e uma frase contextual em inglês.
- **Cobertura integral:** `spatial-contrast-data.js` contém **32 pares de contraste e 64 cenas**, uma para cada verbo do laboratório. Exemplos: *ladear × circundar*, *sobrepor × recobrir*, *bifurcar-se × convergir*, *adensar × verticalizar*, *ocultar × revelar*.
- **Quatro entradas pedagógicas:** 8 cenas introdutórias (uma de cada área), reforço inteligente de 8 cenas priorizando erros e conceitos não treinados, percurso completo de 64 cenas e duelo de 2 cenas diretamente no verbete selecionado.
- **Histórico local independente:** cada desafio tem ID estável; o app registra tentativas, acertos e data em `verbContrastStats`, sem alterar a revisão espaçada, a regência ou o progresso já existente.
- **Experiência responsiva e acessível:** cartas vetoriais amplas lado a lado em telas pequenas, indicação de foco, cores de acerto/erro acompanhadas de texto, andamento da rodada e opção de movimento reduzido.
- **Arquitetura:** `spatial-contrast.js` implementa treino e estados; `spatial-verbs.js` fornece entrada ao módulo, navegação e armazenamento existente. `test_spatial_contrast.mjs` valida cobertura, escolhas, bloqueio após resposta, modo de reforço e regressão.
- **Compatibilidade:** mantidos os **62 campos, 712 verbetes, 64 diagramas, 128 construções de regência** e versões PWA e HTML único offline.

### Novidades da v2.5 — Atlas Visual dos 64 Verbos

- **64/64 verbos com pictogramas próprios**: foram desenhados mais 56 SVGs específicos nas sete famílias restantes, além dos oito já implementados para percurso. Cada pictograma codifica uma relação diferente, como *margear versus beirar*, *circundar versus contornar*, *sobrepor versus justapor*, *expandir versus alargar* e *ocultar versus revelar*.
- **Lógica semântica explícita**: 64 legendas curtas explicam o que os traços representam; os SVGs ampliados recebem descrição acessível, enquanto miniaturas decorativas não são narradas em duplicidade por leitores de tela.
- **Comparação didática inteligente**: dois contrastes relacionados são sugeridos editorialmente por verbo, inclusive entre diferentes campos semânticos; botões com miniaturas levam diretamente ao verbete de comparação.
- **UI responsiva**: cartões ilustrados, proporção preservada em telas compactas, legendas ajustadas para mobile e controles com foco acessível. Sem imagens externas e com temas claro/escuro.
- **Arquitetura**: `spatial-verb-icons.js` mantém o catálogo e os 8 primeiros desenhos, `spatial-verb-icons-extra.js` registra os outros 56, e `spatial-verbs-data.js` identifica cada verbo pelo próprio `iconKey`. Não há alteração de índices, resumos, frases de regência ou histórico.
- **Qualidade**: `test_all_spatial_icons.mjs` testa os 64 diagramas, unicidade geométrica, texto semântico, cards, contraste entre áreas, busca, acessibilidade e totais preservados. PWA e versão HTML única permanecem sincronizados.

### Novidades da v2.4 — Diagramas Semânticos por Verbo

- **Precisão visual por verbo, não por grupo:** oito ilustrações SVG distintas para o campo `Percurso e travessia`: **atravessar**, **cruzar**, **transpor**, **percorrer**, **desviar**, **serpentear**, **bifurcar-se** e **convergir**.
- **Distinções visuais explícitas:** bifurcar-se mostra um percurso se dividindo em dois; convergir mostra dois percursos se unindo; serpentear mostra um traçado sinuoso; desviar mostra o contorno de um obstáculo; transpor mostra a superação de uma barreira.
- **Interface integrada e responsiva:** mesmo desenho específico no cartão pequeno do verbo e no detalhe lexical; miniaturas proporcionais em telas móveis, ícones com nome acessível no detalhe e miniaturas decorativas ocultas de leitores de tela.
- **Arquitetura extensível:** os novos desenhos vivem em `spatial-verb-icons.js`, referenciados por `iconKey` na fonte `spatial-verbs-data.js`; os demais 56 verbos continuam com os esquemas de grupo existentes até a próxima expansão, sem figuras vazias.
- **Compatibilidade:** verbetes, regência, exercícios, progresso local, cache do PWA e HTML offline preservados. Não aumenta a quantidade de verbetes (**62 campos e 712 verbetes**).
- **Testes:** `test_spatial_icons.mjs` valida a exclusividade dos oito SVGs, renderização nas duas dimensões, leitura acessível, organização semântica e fallback dos demais campos.

### Novidades da v2.3 — Regência e Construções Descritivas

- **64 verbos / 128 construções PT–EN:** duas estruturas contextualizadas por verbo, frequentemente contrastando voz ativa, voz passiva, pronominalização e locuções de referência espacial.
- **64 exercícios de lacuna:** escolha da preposição ou locução no modelo apresentado, feedback específico, exemplos equivalentes em inglês e registro de tentativas e acertos no armazenamento local.
- **Treinos acessíveis na aba Verbos & famílias:** prática de um único verbo, das oito relações de um campo ou rodada mista com 16 relações; seleção com feedback apenas depois da resposta.
- **Cautela gramatical:** distinguir complemento regido por verbo (sobrepor algo a algo, interpor algo entre outros elementos) de locuções circunstanciais de posição, percurso ou direção (ao longo de, próximo de, após).
- **Crase e contrações no uso real:** sobreposto à cobertura; interligado ao centro; embutido no forro; disperso pelo bairro. Tradução inglesa contextual, sem pressupor equivalências palavra a palavra.
- **Preservação dos índices anteriores:** continuam 62 campos e 712 verbetes; a regência é uma camada vinculada aos 64 verbos, não uma duplicação de verbetes nem uma alteração das chaves da revisão espaçada.
- **Infraestrutura:** nova fonte `spatial-regency-data.js` incorporada à aplicação, PWA e HTML único. Testes dedicados em `test_spatial_regency.mjs`.

### Novidades da v2.2 — Laboratório de Verbos Descritivos

- **Nova aba no Atlas: "Verbos & famílias"**: exploração filtrável e responsiva de 64 verbos divididos em oito campos — lateralidade, cercamento, camadas, travessia, orientação, distribuição, transformação e percepção visual.
- **Família lexical completa e sem falsas derivações**: infinitivo, substantivo, adjetivo ou particípio, com rótulo explícito "derivado" versus "relacionado por sentido", regência, definição, contraste semântico e frase em português e inglês.
- **Rigor de formação:** "lado" é associado a "ladear", não substantivo formado diretamente dele; "sobreposição" e "sobreposto" derivam de "sobrepor"; "circundante" descreve o entorno e "circundado" qualifica o elemento rodeado.
- **Experiência visual contextualizada:** esquemas abstratos de relações espaciais, filtros por campo, busca por qualquer membro da família ou tradução inglesa, botões de copiar frases e acesso ao verbete completo.
- **Treino integrado:** cada um dos 64 verbos também é um termo regular no Atlas com frase-lacuna, exemplo, explicação, aviso de uso, cartões, revisão espaçada e registro de prática. Novos campos são acrescentados após os 54 anteriores: índices antigos e progresso preservados.
- **PWA/offline e QA:** `spatial-verbs-data.js` contém os verbetes editoriais; `spatial-verbs.js` cria a interface e integra o conteúdo; `test_spatial_verbs.mjs` testa a aplicação. Todos são incluídos no HTML offline e no service worker.

### Novidades da v2.1 — Atlas Semântico do Urbanismo (Português ↔ Inglês)

- **Ampliação integrada do Atlas existente:** 23 novos campos ao final dos 31 anteriores, sem renumerar conteúdo e sem perder rascunhos ou progresso de revisão. Total: **54 campos e 648 verbetes**.
- **13 áreas interdisciplinares, 104 conceitos:** mobilidade pendular, engenharia de transportes, morfologia, geografia metropolitana, sociologia, espaços públicos, psicologia ambiental, ecologia, economia urbana, planejamento, geotecnologia, saúde e economia criativa/moda.
- **8 famílias de vocabulário fundamental, 64 palavras:** forma urbana, mobilidade, espaços públicos, infraestrutura, uso do solo, habitação, sustentabilidade e política urbana.
- **Linguagem em uso, 20 entradas:** 12 collocations com equivalentes em inglês e 8 distinções de conceitos frequentemente confundidos.
- **Modo bilíngue nos novos verbetes:** tradução inglesa, definições, exemplos de narração, cautela editorial, frase-lacuna para recuperação ativa, exemplos selecionados em inglês e botões para copiar. Relações semânticas navegáveis ligam fenômenos a outros campos.
- **Estudo integrado:** os novos termos entram no seletor, pesquisa, cartões, treino de precisão, revisão espaçada, prática progressiva e versão offline.
- **Rigor terminológico:** commuting é a tradução corrente de deslocamento pendular, não confundida com migration; em inglês britânico high street é mais contextual do que em inglês americano; bike lane e ciclovia segregada nem sempre são equivalentes exatos.
- **Arquivos dedicados:** `urbanism-concepts.js` (13 campos), `urbanism-lexicon.js` (fundamentos, collocations e distinções), `urbanism-atlas.js` (integração) e `test_urbanism.mjs` (testes). A fonte gerada `data.js` continua intocada.

### Novidades da v2.0 — Curadoria e precisão

- **Fraseoteca curada por inteiro:** as 552 frases originais ganharam nota de uso específica, no padrão das famílias jornalísticas. Cada nota diz quando usar a estrutura (passagem, off, stand-up, lead), como completar as reticências com dado concreto e qual armadilha evitar. Seis frases receberam correção de norma ou de termo técnico (“deste ambiente”, “ângulo mais baixo”, “contraplano”, “Do que mais gostei”, “avaliado em relação ao custo”, “Olhe”).
- **Frases de cena no treino:** os 460 verbetes do Atlas têm agora uma frase-lacuna escrita para o treino, com pistas de contexto, regência, gênero e contraste que isolam o termo entre os do próprio campo. Elas substituem as lacunas automáticas e chegam também aos campos de conectores e de verbos de incidência, que antes só tinham perguntas de definição. Depois da resposta, a frase aparece completada, com o termo destacado.
- **Quase-sinônimos não disputam a mesma pergunta:** pares como garoa/chuvisco, adjacente/contíguo e gradualmente/paulatinamente são agrupados por campo e nunca aparecem como alternativas um do outro.
- **Três novos campos (45 termos):** *Interiores* (pé-direito, mezanino, claraboia, planta livre…), *Multidões e público* (afluência, contingente, estimativa de público, cordão de isolamento…, com cuidados de atribuição de números e contra rótulos que criminalizam) e *Sons da natureza* (farfalhar, marulho, crepitar, cricrilar…, distinguindo o som gravado do apenas ouvido). Cada um tem cena, foco, 15 verbetes, escada de 4 modelos e 3 trocas de precisão (“lotado”, “barulho”, “passarinho”, “teto alto”…).
- **Cartões do Atlas** mostram a frase de cena na frente, como pista de contexto.

### Novidades da v1.9 — Revisão e hábito

- **Revisão do dia** (botão no Painel ou tecla `R`): reúne num só baralho tudo o que venceu hoje — frases da Fraseoteca e termos do Atlas, intercalados. Quando nada venceu, sugere conteúdo novo.
- **Cartões do Atlas**: recordação livre — a definição na frente, o termo, o exemplo e o alerta no verso. A avaliação alimenta o mesmo domínio por termo do Treino de precisão. Disponível no Painel e na aba de treino de cada campo.
- **Cronômetro de fala** na prática do Atlas, com o tempo sugerido de cada nível (20, 40, 60 ou 90 s): anel de progresso, pausa, reinício e sinal sonoro discreto ao fim.
- **12 conquistas** em Minha Evolução (sequências de 3, 7 e 30 dias; 10, 50 e 150 termos dominados; aulas, escola completa, frases e missões), com aviso ao desbloquear e data de obtenção salva no backup.
- Correção: as janelas passam a usar classes com prefixo próprio — o cronômetro herdava `position: relative` do conteúdo e acompanhava a rolagem da página.

### Novidades da v1.8 — Interatividade

- **Busca universal** (lupa, `Ctrl K` ou `/`): procura ao mesmo tempo em aulas, disciplinas, termos do Atlas, frases (inclusive nas notas de uso) e missões; ↑ ↓ e Enter para abrir.
- **Cartões de estudo** na Fraseoteca: o cartão mostra a intenção, você formula a frase e vira (toque ou Espaço). “Lembrei” (`2`) e “De novo” (`1`) — ou arrastar o cartão no celular — alimentam a revisão espaçada já existente.
- **Monte a frase**: as palavras de uma estrutura jornalística chegam embaralhadas; toque para montar na ordem e veja a nota de uso ao final.
- **Atlas com escrita assistida**: termos do campo são inseridos no texto com um toque, na posição do cursor; a contagem de termos usados e de palavras genéricas atualiza enquanto você digita.
- **Meta diária e sequência de estudo**: aulas concluídas, frases e cartões estudados, “Monte a frase”, treino e prática do Atlas, missões e práticas de voz contam para a meta (5, 10 ou 20 por dia). O 🔥 no topo mostra os dias seguidos; o Painel traz anel de progresso e os últimos 7 dias.
- **Atalhos**: `?` mostra todos; `Esc` fecha janelas.
- Novo módulo `interact.js`, com testes em `test_interact.mjs`; progresso diário salvo localmente, incluído no backup e validado na importação.

### Novidades da v1.7 — Atlas mais denso e encadeamento de ideias

- **+5 termos em cada um dos 26 campos** (130 novos), com vocabulário atual e técnico: *penumbra*, *zenital*, *estourada* (luz); *empena*, *beiral*, *brise* (arquitetura); *adensamento*, *uso misto*, *caminhabilidade*, *gentrificação* (cidade); *umami*, *adstringente*, *tostado* (gastronomia); *timbre*, *estridente*, *paisagem sonora* (som); *regra dos terços*, *linhas de condução* (fotografia).
- **2 campos novos para o encadeamento de ideias:**
  - *Conectores e encadeamento* — contudo, portanto, embora, ainda assim, por sua vez, em contrapartida, ou seja, à medida que, na medida em que.
  - *Verbos de incidência e repercussão* — incidir, recair, repercutir, reverberar, ecoar, refletir, irradiar, propagar-se, desdobrar-se, permear, atravessar, decorrer de, acarretar, suscitar, convergir. Verbos com imagem física de ação e efeito (onde algo bate e o que reflete), usados para encadear causa e consequência; cada verbete traz o sentido físico, a extensão figurada e a regência.
- No Treino de precisão, os dois campos de conectores usam só perguntas de definição: numa frase com lacuna, mais de um conector poderia caber.
- Termos novos entram ao final de cada campo e os campos novos ao final da lista: domínio e rascunhos salvos continuam válidos.

### Novidades da v1.6 — Fraseoteca jornalística

- **6 famílias novas e 105 estruturas** com a linguagem que o jornalismo de fato usa: Encadeamento lógico, Atribuição e verbos de declaração, Leads e títulos, Telejornalismo e vídeo, Precisão e cautela, Estilo e clareza.
- **Nota de uso em cada estrutura nova:** sentido exato, nuance e armadilha. Exemplos: *à medida que* (proporção) × *na medida em que* (causa); *desde que* com indicativo (tempo) × com subjuntivo (condição); *alegar* sugere dúvida, *admitir* pressupõe algo desfavorável, *revelar* pressupõe segredo.
- Vocabulário de redação de TV (cabeça, off, passagem, sonora, nota pé, escalada) com modelos de fala e a função de cada trecho.
- A busca da Fraseoteca também encontra o conteúdo das notas (“subjuntivo”, “concessão”, “contraditório”).
- Famílias novas foram acrescentadas ao final: favoritos e revisões já salvos continuam válidos.
- As estruturas novas são apenas em português; nenhuma tradução foi inventada.

### Novidades da v1.5 — Atlas ampliado

- **10 campos novos e 100 termos** (de 160 para 260), voltados ao que mais aparece em vlogs e crônicas de rua: Pessoas (aparência; expressão e gestos; postura e movimento), Objetos (estado e uso; forma e partes), Animais (aparência; comportamento), Vista e panorama, Paisagem natural e Céu e clima.
- Cada campo tem cena hipotética, 10 verbetes com definição, exemplo e alerta editorial, 4 modelos progressivos e 3 trocas de precisão — e entra automaticamente no Treino de precisão e na revisão espaçada.
- Nos campos sobre pessoas, os alertas reforçam a ética de descrição: o observável, sem deduzir idade, origem, profissão, renda ou saúde, e com consentimento para quem aparece em destaque. Nos de animais, os alertas tratam do antropomorfismo.
- O detector de palavras genéricas passa a reconhecer 47 palavras (38 com troca específica no Atlas), como “fofo”, “pintado”, “vista linda” e “chuvinha”. Palavras de emoção (“feliz”, “cansado”) aparecem como trocas didáticas, mas não geram alerta, pois são legítimas na interpretação pessoal.
- Os novos campos foram acrescentados ao final da lista: o progresso já salvo (domínio, rascunhos) continua associado aos campos corretos.
- Importação de backup: o limite de rascunhos do Atlas passa a acompanhar o número de campos (antes, fixo em 64, descartaria rascunhos dos campos novos).

### Novidades da v1.4 — Atlas Descritivo

O Atlas passa a cobrir o ciclo completo de aprendizagem lexical: **entender → discriminar → produzir → revisar**.

- **Treino de precisão:** rodadas de 8 perguntas geradas dos próprios verbetes (definição → termo e frase com lacuna → termo). As alternativas vêm do mesmo campo, para treinar a diferença entre termos vizinhos. A explicação mostra a definição correta, o alerta editorial e o sentido da alternativa escolhida.
- **Domínio e revisão espaçada por termo:** acertos espaçam revisões em 1, 3, 7, 14 e 30 dias; erros trazem o termo de volta no próximo treino. Um termo conta como dominado após três acertos seguidos. Revisões pendentes têm prioridade e aparecem como selo na aba.
- **Trocas de precisão:** 48 pares “palavra genérica → termos do campo”, com frase vaga e frase precisa, exibidos no vocabulário de cada campo.
- **Detector de palavras genéricas ampliado:** passa de 5 palavras fixas para 31 (22 com troca específica no Atlas), com variações de gênero e número, e sugere os termos do Atlas que podem substituí-las. Palavras comuns e legítimas (“lugar”, “bom”, “depois”) não geram alertas falsos.
- Progresso de domínio por campo no seletor, nos chips de termos e nos indicadores do topo; vocabulário do campo visível durante a prática escrita.
- O domínio é salvo localmente, entra no backup JSON e é validado na importação.

### Novidades da v1.3.2

- As 123 unidades que eram apenas plano curricular ganharam aula integral: as 43 disciplinas das seis escolas agora têm 4 aulas cada (172 no total).
- Escolas antes sem conteúdo aprofundado — Fundamentos, Jornalismo e Mídias Digitais e a maior parte de Reportagem, Audiovisual e Laboratórios — passam a ter percurso completo.
- Aulas de Legislação e Direitos são orientativas e indicam verificação de regras locais; aulas de economia ensinam a coletar preços e câmbio com fonte e data, em vez de fixar valores que envelhecem.
- `test_content.py` passa a exigir as 4 aulas em todas as disciplinas, o esquema completo de cada aula e títulos únicos.

### Novidades da v1.3.1

- Corrigida a codificação UTF-8 do texto alternativo do SVG de Xangai.
- Service worker com fingerprint gerado a partir dos arquivos estáticos, estratégia adequada para atualização e fallback offline de navegação.
- Verificação de SVG e textos de codificação, consistência de documentação e equivalência do HTML offline gerado na CI.
- Correção de teste que esperava 64 verbetes após a expansão real para 160.
- Configuração de cache HTTP do Netlify e instruções reais de desenvolvimento.

### Novidades da v1.3

- Os 160 termos do Atlas possuem verbetes completos: definição, exemplo de narração e alerta editorial, com 96 novos verbetes.
- Gravador de áudio vinculado a cada um dos 64 exercícios do Atlas: permissão de microfone, cronômetro, reprodução e download por arquivo.
- Autorrubrica oral de dicção, fluidez, pausas e expressividade (notas de 1–5), registrada junto ao texto, sem avaliação automática.
- Áudio fica somente na memória da aba até download explícito; o backup inclui notas e metadados, nunca os bytes da gravação.
- Testes de integração verificam o fluxo do gravador, a associação do take à prática e o descarte ao trocar de exercício.

### Novidades da v1.2

- Atlas ampliado com 64 verbetes comentados: definições, exemplos e alertas editoriais, preservando os 160 termos originais.
- Busca global no Atlas e 16 cenários hipotéticos detalhados.
- Laboratório progressivo: quatro etapas por campo, totalizando 64 modelos de narração, com escuta por síntese de voz quando disponível.
- Caderno pessoal: rascunhos locais, indicadores lexicais básicos, autoavaliação de 1 a 5, histórico de até 200 práticas, reabertura e teleprompter.
- Rascunhos e registros incluídos no backup principal. Nenhuma análise semântica por IA ou verificação factual automática é anunciada.

### Novidades da v1.1

- Escola de Comunicação: 10 disciplinas x 4 unidades = 40 aulas completas com atividades e rubricas específicas.
- 120 novas estruturas narrativas em português distribuídas entre as 24 famílias, totalizando 552.
- Oficina da Fala com 24 exercícios de reformulação, versões comentadas e registro de prática.
- Construtor de raciocínio com oito situações de campo e quatro registros de narração.
- Roteiros locais podem ser guardados, restaurados, excluídos, copiados, ouvidos ou enviados ao teleprompter.
- A oficina preserva IDs e armazenamento dos usuários existentes; dados novos também entram no backup.

### O que realmente funciona agora

- Navegação por escolas, disciplinas e unidades; pesquisa de disciplinas.
- Leitura das 172 aulas integrais (todas as disciplinas) com demonstrações, prática e avaliação orientada.
- Fraseoteca com busca de texto, 30 famílias (6 delas com notas de uso jornalístico), filtros por idioma, favoritos, detalhes e reprodução por `speechSynthesis` (quando o navegador oferece voz adequada).
- Registro de cartões estudados e agendamento local de revisões em 1, 3, 7, 14 e 30 dias.
- Estúdio da Voz: desafio aleatório, gravação com `MediaRecorder` se o navegador permitir, reprodução, arquivo para salvar manualmente e autorrubrica 1–5.
- Construtor de narração usando apenas observações inseridas pelo estudante, estilos documental, espontâneo, contemplativo e didático.
- Nove camadas de comunicação e teleprompter com rolagem e retirada progressiva do texto.
- Atlas de 415 termos em 28 campos para descrição mais precisa, com treino de precisão, domínio por termo, revisão espaçada e trocas de palavras genéricas.
- 30 missões com plano de imagem, estruturas de fala, cautela e notas pessoais.
- Trilha de 12 semanas e acompanhamento de aulas, prática e missões.
- Tema claro/escuro, navegação móvel, dados em `localStorage`, backup JSON, importação e reinício.

### Como abrir

**Opção A — arquivo único, sem instalação:** abra `storylab-shanghai-offline.html` no navegador. Este arquivo está na raiz do repositório. Contém interface, dados, lógica e ilustração embutidos; não solicita acesso a servidores para exibir as aulas e frases. Recursos de voz e gravação dependem das capacidades e permissões do navegador.

**Opção B — projeto completo:** abra um terminal na pasta `storylab-shanghai` e execute:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`. Em uma hospedagem HTTPS, o aplicativo também registra o service worker para armazenar os arquivos-base em cache e permitir navegação offline após uma visita bem-sucedida.

**Publicação:** o projeto é estático e pode ser hospedado em Netlify, GitHub Pages ou outro host HTTPS de arquivos estáticos. A pasta contendo `index.html` deve ser a raiz da publicação. Não há build, banco de dados remoto, autenticação nem dependências externas.

### Backup, privacidade e limitações

- Aulas concluídas, favoritos, revisões, notas de campo, autorrubricas e missões são guardados apenas no armazenamento local do navegador. Exporte um backup em **Minha Evolução → Exportar progresso**. Ele pode ser reimportado em outro navegador.
- Áudios de treino **não** são enviados nem guardados permanentemente pelo aplicativo: ficam disponíveis apenas durante a sessão para reprodução ou salvamento manual. A exportação JSON não contém áudios.
- Não há correção de pronúncia, transcrição automática, avaliação por IA, mapas, sincronização na nuvem nem publicação de vídeos nesta edição.
- A reprodução de áudio usa vozes do sistema. Em determinados navegadores/idiomas, uma voz pode faltar ou depender de recursos externos.
- Para usar microfone, confirme permissão e contexto seguro (HTTPS ou localhost). No modo de arquivo local a compatibilidade pode variar.
- O app não constitui autorização para filmar ou exercer jornalismo profissional na China. Regras de imagem, privacidade, locais privados, trabalho e publicação devem ser verificadas conforme a situação concreta.
- A trilha de 12 semanas não pretende equivaler a uma graduação; é um percurso inicial para competências selecionadas.

### Estrutura real do repositório

O repositório possui os arquivos diretamente na **raiz**, sem subpasta `storylab-shanghai`.

```text
Storylab/
├── index.html                 # Entrada da aplicação estática
├── app.js                     # Navegação, dados locais e backup
├── style.css                  # Interface editorial responsiva
├── data.js                    # Conteúdo gerado (não edite manualmente)
├── atlas-data.js              # Atlas gerado (não edite manualmente)
├── atlas-engine.js            # Exploração lexical e prática guiada
├── atlas-recorder.js          # Gravação de voz local
├── atlas-audio-ui.js          # UI de gravação e autorrubrica
├── interact.js                # Busca universal, cartões, jogos, meta diária e atalhos
├── content/
│   ├── storylab_data.json     # Fonte das disciplinas e frases
│   └── atlas_guides.json      # Fonte dos verbetes do Atlas
├── generate_data.py           # Gera data.js
├── generate_atlas.py          # Gera atlas-data.js
├── generate_service_worker.py # Gera versão de cache a partir do conteúdo
├── build_standalone.py        # Reconstrói o HTML único
├── service-worker.js          # PWA e fallback de navegação offline
├── storylab-shanghai-offline.html
├── test_content.py            # Integridade editorial
├── test_quality.py            # Integridade SVG, SW e documentação
├── test_atlas.mjs             # Interações do Atlas (Node.js)
├── test_recorder.mjs          # Fluxo de gravação simulado (Node.js)
├── test_interact.mjs          # Busca, revisão, sequência e Monte a frase (Node.js)
├── netlify.toml               # Publicação raiz e headers de atualização
├── manifest.webmanifest
├── assets/
│   ├── icon.svg
│   └── skyline.svg
└── .github/workflows/ci.yml
```

Para editar conteúdo, altere os JSON e execute `python generate_data.py` e `python generate_atlas.py`.
Após qualquer mudança em arquivos estáticos, execute `python generate_service_worker.py` e `python build_standalone.py`.

Verificação local:

```bash
python test_content.py
python test_quality.py
python generate_service_worker.py --check
node --check app.js
node --check atlas-engine.js
node --check atlas-recorder.js
node --check atlas-audio-ui.js
node test_atlas.mjs
node test_recorder.mjs
node test_interact.mjs
```

Na CI, o build offline é regenerado e comparado ao arquivo versionado. Isso impede publicar um HTML único desatualizado.

### Atualização do PWA / cache

O arquivo `service-worker.js` é **gerado**, não editado manualmente. Seu nome de cache contém um fingerprint determinístico dos arquivos da aplicação. O GitHub Actions falha se o worker não acompanhar alterações no código. Uma navegação procura a versão online e retorna ao `index.html` em cache em caso de falha de rede, depois da primeira visita bem-sucedida. A versão offline permanece dependente das permissões e compatibilidade do dispositivo para captação de áudio.

O `netlify.toml` evita cache HTTP prolongado para o worker e o HTML principal. Se um dispositivo ainda exibir a interface anterior, feche e abra novamente o site para permitir a atualização do service worker.

### Princípios de conteúdo

1. **Observação ≠ inferência ≠ fato apurado.** A aula e a interface devem manter essa distinção.
2. **Nenhuma generalização cultural sem contexto.** Identifique local, tempo, fonte e limites do relato.
3. **Toda técnica deve produzir competência observável.** Conceito → demonstração → exercício → feedback → aplicação em campo.
4. **Vocabulário preciso acima de adjetivos vagos.** O glossário é uma biblioteca de construções de pensamento, não apenas de palavras.
5. **Transparência de recursos.** Não contar unidades planejadas como aulas prontas, nem traduções hipotéticas como revisadas.
6. **A mídia é complementar.** A imagem mostra detalhes; a voz acrescenta contexto e pensamento.

### Próxima expansão recomendada

**V1.4 — Evolução da Fala:** conservar gravações opcionalmente no próprio aparelho com IndexedDB, comparar takes e oferecer controles de exclusão e backup separado para mídia.

**V1.5 — Fraseoteca contextual:** expandir construções realmente distintas para vídeos, moda, arquitetura e entrevistas. Traduções precisam de revisão linguística.

**V2 — Redação e estúdio audiovisual:** storyboard visual, biblioteca de enquadramentos, planos de captação, fichas de pauta, fontes e checagem.

**V3 — Avaliação avançada:** transcrição e feedback de fala com consentimento explícito e processamento transparente; revisão assistida de roteiros sem inventar fatos.

**V4 — Formação longa:** revisão editorial especializada das 172 aulas, exercícios de pesquisa com fontes, bibliografia verificável por disciplina, projetos avaliativos e um portfólio editorial.

---

**A base foi construída para expansão de conteúdo sem refazer a arquitetura.**
### Conteúdo do Atlas v1.2

Edite `content/atlas_guides.json` e execute `python generate_atlas.py` para gerar `atlas-data.js`; valide com `python generate_atlas.py --check`. A interface reside em `atlas-engine.js` e compartilha com o aplicativo a mesma chave de armazenamento local. O backup inclui rascunhos e avaliações.

### Privacidade das gravações

A gravação ocorre com a API `MediaRecorder` exclusivamente no navegador, conforme permissão e compatibilidade. Os bytes permanecem num `Blob` temporário. Clique em **Baixar áudio** antes de mudar de exercício ou fechar a aba. Não existe upload, sincronização ou arquivamento automático dos áudios. Apenas os metadados (duração e indicação de take, se houver) e suas autoavaliações entram no backup JSON. A gravação normalmente exige HTTPS e permissão do microfone. Formatos disponíveis dependem do navegador.
