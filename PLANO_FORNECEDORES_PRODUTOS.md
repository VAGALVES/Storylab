# StoryLab — Atlas Universal do Objeto, Fornecedores e Narrativa

**Correção conceitual v2.19 (outubro/2026):** o objetivo do projeto não é acumular glossários industriais. É a **precisão da palavra na descrição do objeto e do seu produtor**, do mesmo modo que o Atlas urbano descreve fachadas, paisagens, materiais, movimentos e escala. Um smartphone, carro, cadeira, câmera ou jaqueta compartilham dimensões sensoriais e físicas; a indústria é uma lente complementar.

**Princípio do desenho pedagógico:** **observar → distinguir → qualificar → contextualizar → narrar**. Características observadas e sensações não são equivalentes a propriedades medidas ou declaradas; nenhuma qualidade ou segurança é inferida só pela aparência.

**Arquitetura prioritária:** Atlas Universal do Objeto → Estúdio de Descrição → Atlas Técnico do Produto / Atlas do Fornecedor → Academia Técnica e Radar Setorial. A linguagem original de fábrica permanece acessível, mas deixa de ser a porta de entrada.

## Rodada v2.23 — ponte trilíngue na narração (17/10/2026)

Cada plano tem um exemplo contextual em português (referência), inglês e mandarim (apoios), com pinyin, áudio sintetizado, cópia e nota de regência ou contraste. A ponte é opcional; não altera roteiro autoral, origem, teleprompter, backups ou rubrica. Inclui ligação com Verbos & regência. Não se inventam dados de produto.

Teste: cinco frases alinhadas, navegação, cópia, síntese de voz e isolamento do conteúdo do usuário. Não há tradução automática da escrita livre; vozes dependem do dispositivo e revisão nativa permanece necessária.

## Entrega v2.19 — precisão descritiva universal

### Atlas da Coisa, sem privilegiar vestuário

- **96 descritores editoriais** em **12 dimensões**: escala e medidas; massa e distribuição; geometria; materiais e constituição; superfície e textura; toque/rigidez/elasticidade; construção e acabamento; ergonomia; movimento e funcionamento; linguagem visual; utilidade e experiência; marca/empresa/fabricação.
- Em cada cartão: definição específica; exemplo observacional aplicável a objetos distintos; **pergunta de precisão** que explicita medição, contexto ou evidência; PT, EN, mandarim e pinyin; cópia e TTS.
- **14 contrastes semânticos**, entre eles macio × maciço, pesado × denso, rígido × duro, flexível × elástico, fosco × áspero, compacto × pequeno, portátil × leve e ergonômico × confortável. Algumas palavras dos contrastes são debatidas pela distinção, sem constituir verbete adicional no corpus.
- Busca por vocabulário e significados, seleção por dimensão e adição de até oito descritores ao estúdio de apresentação.

### Estúdio de Descrição, para vlog, produto e empresa

- Um roteiro de **cinco planos audiovisuais**: contexto, forma/escala, matéria/acabamento, demonstração/uso, conclusão contextualizada.
- Lentes de narração: vlog exploratório, review crítico, apresentação comercial, análise técnica e retrato de marca/fornecedor.
- Campos para identificação, natureza do objeto, contexto, material aparente/declarado e observação autoral.
- **Seis grandezas dimensionais** opcionais com unidade explícita: altura, largura, comprimento, profundidade, espessura e massa (mm/cm/m e g/kg conforme aplicável). O estúdio rejeita valores negativos, zero e formatação inválida; não os inventa nem os converte sem método.
- Atribuição textual dos dados: impressão, observação/manuseio, declaração de terceiro ou medições registradas. Não cria métricas, classificações ou selos falsos.
- Roteiro copiável com instruções de enquadramento e sugestões de fala; os equivalentes trilíngues permanecem acessíveis nos cartões do Atlas. O roteiro completo é redigido em português, e **não se afirma tradução automática integral** para inglês e mandarim.
- Rascunho preservado localmente, inclusive nos backups importados; validação de atributos e campos ao carregar.

**Fronteira da entrega:** esta é a camada central da linguagem descritiva, ainda não uma ontologia exaustiva de todo tipo de produto. Em ciclos futuros, aprofundar descritores relacionais (sobrepor, circundar, encostar), escala perceptiva, composição cromática, sons, cheiros, interação dinâmica, roteiros narrados trilíngues revisados e registros de áudio/imagem autorizados.



**Origem:** conversa de concepção dentro do projeto StoryLab, outubro de 2026.  
**Primeira entrega navegável:** v2.15, commit `6d08bec`, PR #18.

## O que foi efetivamente pedido

A necessidade surgiu da rotina profissional em Xangai: visitar fornecedores, conhecer produtos e aprender a descrevê-los, tanto em seus atributos físicos quanto funcionais. Fornecedores também devem poder ser explicados por porte, especialização, mercados, produtos, processos e demais dimensões pertinentes.

O pedido original estabeleceu **dois instrumentos próprios dentro do StoryLab**:
1. **Atlas dedicado** ao universo de produtos e fornecedores, com profundidade descritiva e termos precisos.
2. **Fraseoteca dedicada** à linguagem utilizada nas visitas, apresentações, perguntas, avaliações e conversas profissionais.

Os dois deveriam manter a qualidade editorial, pedagógica e visual das áreas existentes do StoryLab. O projeto geral havia previsto a linguagem de apresentação de produtos e objetos (material, acabamento, design e funcionalidade), em paralelo ao Atlas Descritivo e à Fraseoteca Contextual.

**Nota de rastreabilidade:** os eixos e recursos detalhados abaixo incluem decisões de implementação tomadas na v2.15; não se afirma que cada um deles constava literalmente da conversa inicial.

## Arquitetura adotada

Navegação principal: **Fornecedores & Produtos**, independente do Atlas Descritivo geral.

### Atlas de Produtos: 8 dimensões

- Identidade e posicionamento: classe, linha, público, proposta de valor.
- Materiais e composição: propriedades de materiais, toque, gramatura, elasticidade.
- Construção e acabamento: junções, costuras, componentes e técnicas.
- Forma, medidas e ergonomia: proporção, modelagem, tolerâncias e conforto.
- Função e desempenho: uso, ensaios, benefícios e limites.
- Qualidade e conformidade: defeitos, critério de aceitação, testes e amostras.
- Valor e viabilidade: custos, diferenciais e possibilidade de fabricação.
- Embalagem e ciclo de vida: rastreabilidade, conservação, lotes e descarte.

### Atlas de Fornecedores: 8 dimensões

- Perfil e mercado: fabricante x trading, segmentos e especialização.
- Capacidade produtiva: volume real x capacidade nominal, linhas e gargalos.
- Processos e tecnologia: fluxo, subcontratação, automação e controles.
- Desenvolvimento e amostras: briefing, ficha, 1ª amostra, pré-produção e revisões.
- Qualidade e gestão: inspeções, indicadores, auditorias e ações corretivas.
- Condições comerciais: preços, MOQ, prazos de produção e pagamento.
- Cadeia e logística: materiais, exportação, entrega e subfornecedores.
- Conformidade e responsabilidade: certificados, requisitos, rastreabilidade e saúde ocupacional.

### Fraseoteca de Campo: 9 situações

Visita e apresentação; descrição do produto; materiais e fabricação; funcionalidade e desempenho; perfil e capacidade; amostras e desenvolvimento; cotação e negociação; inspeção e conformidade; comparação e próximos passos.

Todas as entradas do Atlas apresentam **português, inglês, mandarim, pinyin e definição contextual**. Todas as frases apresentam **português, inglês, mandarim e pinyin**. Há botões de escuta, cópia, busca, filtros e marcações de estudo; o áudio depende do mecanismo de síntese de voz do navegador.

## Dados e escopo da primeira entrega

| Acervo | Quantidade |
| --- | ---: |
| Atlas de Produtos | 48 verbetes |
| Atlas de Fornecedores | 48 verbetes |
| Dimensões analíticas | 16 |
| Frases profissionais trilíngues | 36 |
| Situações de comunicação | 9 |

**Arquivos:** `trade-data.js` (fonte editorial), `trade-hub.js` (visualização e interação), `test_trade.mjs` (cobertura automatizada). Integrado ao `app.js`, `index.html`, `style.css`, `build_standalone.py`, `generate_service_worker.py` e CI.

## Regras editoriais e pedagógicas

1. Distinguir **observável**, **declaração do fornecedor**, **documento**, **medição** e **conclusão**.
2. Não inferir capacidade, certificação, qualidade ou prazo apenas da aparência da fábrica ou do item.
3. Ensinar a **descrever com substantivos e adjetivos**, mas também a **perguntar com verbos e regências**.
4. Preservar a diferença entre inglês técnico preciso e tradução literal de português.
5. Tratar o mandarim como comunicação em contexto profissional: pinyin é apoio, não substituto do caráter chinês.
6. Não confundir o repertório didático com um sistema de cadastro de empresas, PLM ou certificação de fornecedores.

## Evolução v2.16 — Dossiê de Campo

Implementada uma quarta aba: **Dossiês de campo**, com até 20 registros pessoais no armazenamento local, vinculados a uma das duas taxonomias de oito dimensões já publicadas.

- Registro de **produto** ou **fornecedor/visita**, com identificação opcional, data e próximos passos.
- Oito dimensões navegáveis por dossiê; cada dimensão tem sua própria anotação, **origem da informação** e referência à evidência.
- Origem classificada entre: *não apurado*, *observação direta*, *declaração do fornecedor*, *documento apresentado (não validado)* ou *medição registrada*. **Nenhuma dessas classificações equivale a certificação automática.**
- 16 perguntas técnicas exemplares, uma por dimensão, em português, inglês, mandarim simplificado e pinyin, com reprodução por síntese de voz em inglês/mandarim.
- Cópia de relatório integral em texto simples, sem fabricar métricas, conclusões ou avaliações; a versão local também participa da exportação/importação do backup de progresso do aplicativo.
- Salvamento automático de edição textual sem desmontar o campo digitado; exclusão sujeita à confirmação.
- Limites e validação no carregamento: no máximo 20 dossiês; textos e referências limitados; nenhum dado enviado a serviços externos.
- Componentes testados por \`test_trade_field.mjs\`, integrados ao PWA e HTML offline.

**Escopo editorial:** as 16 perguntas são modelos de linguagem de campo, não alegações sobre fábricas reais nem substitutas de investigação técnica. Revisão por tradutores especializados continua recomendável antes de uso contratual.

## Academia Interindustrial e Radar Setorial — v2.17

**Nova abordagem:** a disciplina acadêmica sustenta observação, linguagem de campo e análise verificável em diferentes indústrias. Vestuário é uma especialização entre outras.

- **Academia Técnica:** nove capítulos autorais (produto e valor; sistemas; materiais; operações; metrologia; inovação; suprimentos; energia/ciclo de vida; conformidade), cada um com três seções teóricas e exemplos, vocabulário técnico, estudo de caso em quatro etapas, pergunta de compreensão e construção trilíngue PT/EN/ZH com pinyin e áudio.
- **Radar Setorial:** nove áreas (automotiva, renováveis, baterias, eletrônicos, portáteis/wearables, automação/robótica, vestuário, materiais avançados, IoT). Cada área tem cinco lentes de análise, evidência recomendada, pergunta técnica trilíngue e referência a um capítulo.
- **Dossiês vinculados ao setor:** escolha e troca de especialização industrial no registro de produto ou fornecedor. Critério e pergunta setorial aparecem no registro e a indústria consta no relatório copiado.
- **Progressão local:** marcar capítulo estudado e responder questão salva em backup do aplicativo. Nenhum certificado de proficiência ou conformidade é emitido.
- **Integração:** abas próprias dentro de Fornecedores & Produtos, CSS responsivo, PWA offline, build HTML único e testes dedicados.

**Limites do conteúdo:** modelos ilustrativos de formação profissional; não substituem normas setoriais, ensaios, due diligence ou tradução humana especializada em chinês de documentos contratuais. Expansão prevista para fontes bibliográficas, exercícios aplicados e trilhas setoriais profundas.

## v2.22 — Laboratório de Observação & Narração

**Princípio:** não basta nomear propriedades; o usuário precisa convertê-las em fala contextualizada, fluida, filmável e intelectualmente honesta. Nesta rodada o app não escreve uma falsa análise automática: **a narração é do estudante**, orientada por estruturas, perguntas e critérios de autoverificação.

- **8 situações transversais**: motocicleta, carro, smartphone, câmera portátil, cadeira de trabalho, bateria portátil, ferramenta elétrica e showroom/marca. Cada situação oferece uma ilustração vetorial conceitual distinta, cinco focos de observação, cinco famílias de palavras contextualizadas e armadilhas de imprecisão.
- **5 planos narrativos**: contextualização → forma e relações → matéria e acabamentos → funcionamento e ergonomia → síntese com limites. Em cada plano: pergunta específica, orientação de câmera, estrutura de frase opcional (com lacunas visíveis), campo de texto livre e atribuição da fonte (impressão, observado, declarado, medido).
- **Revisão editorial com cinco critérios declarativos**: contextualização, rigor semântico, atribuição, correspondência entre imagem/fala e limites. Marcar não equivale a validação automática.
- **Resultado que não inventa dados**: reúne somente os trechos redigidos, com a origem que o usuário escolheu; fornece opção de cópia com atribuições ou envio da fala ao teleprompter **já existente no StoryLab**. O teleprompter recebe apenas o texto autoral, sem os rótulos de origem.
- **Persistência isolada por situação:** notas (cinco textos de até 600 caracteres), origem por etapa e critérios marcados. Importações são validadas contra os IDs dos oito cenários e os valores permitidos. Trocar de situação preserva as outras.
- **Sete diagramas de escala distintos:** extensão, massa, firmeza à pressão, flexão, rugosidade, brilho e espessura. Ilustrações qualitativas ajudam a perceber **somente o eixo semântico adequado**. A massa usa silhuetas iguais e símbolo de carga porque aparência não comprova peso. As escalas não possuem valores inferidos, intervalos quantitativos ou medições inventadas.

**Fronteira desta versão:** não capta ou pontua áudio dentro do novo módulo; aproveita o estúdio/teleprompter já existente. Não compara textos com IA, nem certifica atributos técnicos ou traduções. Inspeção visual manual em dispositivos reais e revisão humana da terminologia continuam recomendadas.

## StoryLab v2.21 — Anatomia, relações e percepção

Esta rodada aprofunda a pergunta central **"como descrever precisamente qualquer objeto?"** sem devolver a navegação ao recorte industrial.

- **20 substantivos universais** em quatro famílias: estrutura/sustentação, envoltórios/revestimentos, junções/interfaces e interação/comandos. Cada verbete inclui definição, frase observacional, pergunta de verificação e traduções EN/中文 com pinyin.
- **10 relações entre partes** (circundar, ladear, sobrepor-se a, encaixar-se em, apoiar-se sobre, atravessar, articular-se com, recuar, sobressair de, alinhar-se com). Cada relação recebe **um desenho SVG próprio**, sem reutilizar ícones genéricos ou sugerir valores medidos.
- **15 conceitos sensoriais** em três famílias com cinco descritores cada: cor (matiz, saturação, luminosidade percebida, contraste e temperatura cromática como impressão), luz (fosco, acetinado, brilhante, translúcido, opaco), som (intensidade percebida, altura tonal, timbre, ritmo, vibração). Esses atributos **não são degraus da mesma escala**.
- **6 microdesafios** contextualizados e explicados, com respostas locais persistentes e incluídas em backup/importação após sanitização. Os exercícios desenvolvem discriminação de conceitos; não medem habilidade oral.
- **Conexão com o Estúdio**: perguntas de observação podem ser encaminhadas, mediante clique explícito, ao campo de notas do roteiro. Elas são registradas como **perguntas a verificar**, não como características provadas.
- **Jornada editorial**: O objeto → Partes & relações → Cor, luz & som → Adjetivos & escalas → Verbos & regência → Medidas ilustradas → Estúdio. Ferramentas industriais e de fornecedores continuam como especializações complementares.

**Limites:** definições, ilustrações e traduções são material pedagógico autoral que requer revisão especializada para documentação crítica; o aplicativo não testa materiais, corimetria nem acústica por sensores ou instrumentos. A experiência visual em Android real deve ser inspecionada além dos testes automatizados.

## Refinamento editorial v2.20 — uma hierarquia única

**Diagnóstico que motivou esta rodada:** a página havia acumulado atlas, fichas industriais, laboratórios de inglês e ferramentas operacionais, sem ordem pedagógica nítida. O título inglês *Consist of* contraria a escolha de português como língua-base. O formulário de medidas precisava de uma referência visual de altura, largura, comprimento, profundidade, espessura e massa.

**Percurso principal:** **O objeto → Adjetivos & escalas → Verbos & regência → Medidas ilustradas → Estúdio de Descrição**. As seções antigas continuam disponíveis em um bloco secundário recolhível: academia, indústria, glossário de fábrica, fornecedor, traduções, visita, fichas e comparador. Não foram apagados conteúdos nem rascunhos dos usuários.

**Verbos como protagonistas:** 20 construções em cinco famílias (composição; forma e relações espaciais; movimento; função; avaliação). Cada item traz título, exemplo, decomposição sintática e regência **em português primeiro**, nuance semântica e equivalentes EN/中文/pinyin com áudio. Exemplos de verbos espaciais: circundar, ladear, sobrepor-se a, afilar-se.

**Adjetivos:** sete escalas com cinco graus cada, cada qual representando **uma mesma variável**: dimensão linear, massa, firmeza sob pressão localizada, flexibilidade à flexão, rugosidade, brilho especular e espessura. Pares de outra natureza permanecem contrastes, não degraus: macio ≠ maciço; duro ≠ rígido; fosco ≠ opaco; pesado ≠ denso; compacto ≠ pequeno. Inclui oito qualificadores de intensidade, fonte e condição.

**Medidas visuais:** ilustrações vetoriais responsivas de quatro geometrias (caixa, peça plana, veículo em perfil, cilindro) com seleção interativa das seis grandezas. Ressalvas impedem generalizações erradas: comprimento/largura dependem da orientação; largura de veículo precisa da vista frontal; espessura é local; massa é medida em balança, não por seta dimensional. O mesmo recurso aparece na seção de medidas e dentro do Estúdio.

**Idioma:** os 20 títulos legados do Laboratório Técnico passam a apresentar expressões em português, com diagrama também em português. Inglês e mandarim permanecem como blocos de apoio e prática, preservando o conteúdo de tradução previamente construído.

**Validação:** novos testes automáticos de semântica, navegação, diagramas, estrutura PT e integração ao Estúdio; PWA e HTML offline ajustados. As ilustrações são esquemas conceituais de direção, não desenhos técnicos ou valores de fábrica.

**Próximo salto proposto:** substantivos estruturais de partes e componentes, atlas cromático (matiz/saturação/luminosidade separados), intensidade sonora, sensação térmica, relações espaciais e exercícios de descrição oral aplicados a cenas reais. Curadoria especializada PT/EN/中文 e inspeção visual em navegador Android ainda recomendadas.

## Evolução v2.18 — linguagem, comparação, procedimento e inteligência visual

### Laboratório de Linguagem Técnica

- **20 construções trilíngues PT/EN/ZH/pinyin** distribuídas por estrutura, função, fabricação, evidência e comparação.
- Regências explícitas, alertas para falsos equivalentes, frases contextualizadas e esquema em três posições **referente → relação/regência → complemento/condição**.
- Escuta EN/ZH por TTS local, cópia de construções, busca e filtros; **modo treino** esconde inglês/mandarim até revelação.
- Revisão espaçada por **autoavaliação**, agendada em intervalos de 1, 3, 7, 14 e 30 dias; não há avaliação automática real da pronúncia ou semântica. Salva registros e horários no backup.

### Comparador Técnico por Evidências

- Confronta **dois dossiês reais registrados pelo usuário** do mesmo tipo, com oito dimensões alinhadas, origem, relato e fonte por coluna.
- Exibe dados faltantes e avisa quando setores diferentes podem invalidar a comparação direta.
- Fornece relatório copiável; não calcula pontuações, vencedores, capacidade nem conformidade sem critérios e evidências.

### Modo Visita Profissional

- Protocolo com **4 etapas e 16 verificações**, incluindo objetivos, documentos, capacidade efetiva, condições de ensaio, evidências e síntese.
- Vinculado a dossiês já registrados, assinalações persistentes no dispositivo, indicação de progresso e abertura da ficha correspondente.
- Checklist confirma somente que a ação foi realizada ou solicitada, **não** certifica fornecedor ou produto.

### Mapas Conceituais

- **9 esquemas teóricos distintos** e **9 diagramas de fluxos setoriais exemplificativos**, com navegação responsiva, texto alternativo e ressalvas pedagógicas.
- Não usam figuras genéricas repetidas para representar aparelhos incompatíveis; cada esquema corresponde ao domínio.
- Imagens físicas de equipamentos, instalações e processos ainda dependem de autorização, fontes e curadoria editorial dedicada.

### Dados, integridade e limites

- Sanitização no carregamento e também na **importação de backup** — corrigido o caminho de importação de dados trade pré-existentes.
- PWA, HTML offline, automação de testes e Netlify continuam no mesmo projeto. Nenhuma nova API paga ou envio de informações industriais a terceiros.
- Revisão por técnico especialista e falantes nativos de mandarim continua necessária para aplicações críticas, regulatórias ou contratuais.

## Próximas rodadas — propostas, não entregas

- **Dossiê com anexos autorizados:** imagens/relatórios e seu vínculo verificável com a observação; a versão 2.16 registra textos e referências, mas não armazena fotografias.
- **Roteiro de visita técnica:** perguntas sequenciadas por função e tipo de fornecedor, resumo pós-visita.
- **Comparação orientada:** dois produtos e dois fornecedores sem fabricar métricas.
- **Gramática e regência técnica:** perguntar sobre, depender de, adequar-se a, diferenciar-se de, comply with, specialize in, be made of/from etc., com negação e hipóteses.
- **Aprofundamento das nove especializações:** diagramas por tipo de componente, métricas por contexto, glossários amplos e casos técnicos resolvidos. O Radar v2.17 inaugura, mas não encerra, os setores.
- **Expansão da fraseoteca:** respostas, objeções, negociação, follow-up e comunicação intercultural.
- **Curadoria nativa de mandarim**, testes visuais no Android e verificação humana do conteúdo técnico.

**Condição de conclusão:** funcionalidade visível no menu, dados testados, build offline sincronizado, CI aprovado e código na branch `main`.
