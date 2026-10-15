# CURADORIA VISUAL — StoryLab Shanghai

**Revisão editorial de esquemas e controles · v2.11 · outubro de 2026**

## Escopo e método

Coleção presente: **351 esquemas SVG**, sendo **307 associados às 172 aulas curriculares**, **43 distribuídos pelo Atlas descritivo** e **1 na Fraseoteca**, em **18 formatos de representação**. A Academia da Linguagem possui, adicionalmente, **8 diagramas conceituais com três perspectivas interativas cada**. A inspeção cobriu as especificações de conteúdo, os geradores SVG, a paleta de estilos, os estados de interação e verificações automatizadas.

Os testes não substituem inspeção humana de leitura em um aparelho real, nem revisão por especialista em todas as áreas. As telas já enviadas pelo usuário serviram de evidência dos problemas de estado dos diagramas de sintaxe e dêixis, corrigidos anteriormente.

## Critérios de aprovação para novas imagens

| Critério | Requisito |
| --- | --- |
| Necessidade | O desenho deve acrescentar um mecanismo que não seria tão claro apenas com texto. Não publicar imagem apenas para aumentar cobertura. |
| Semântica | Formas significam coisas: setas implicam relação ou direção; círculos sobrepostos implicam interseção; eixos indicam variáveis definidas. |
| Proporção | Nunca transformar exemplos arbitrários em uma escala quantitativa. Posições relativas devem ter fundamento ou ser apresentadas como progressão ordinal sem distâncias numéricas. |
| Afirmação | Um esquema não pode converter possibilidade em certeza, inferência em prova ou correlação em causalidade. |
| Foco | Todo SVG precisa de título e descrição acessíveis; o ponto principal deve ser reconhecível. |
| Microtipografia | Usar rótulos curtos e hierarquia consistente. Textos mais longos devem ir para a legenda, não para dentro do desenho. |
| Interação | Toda etapa selecionável deve mudar o conteúdo, o ponto de vista ou o realce de modo verificável. Estados e rótulos acessíveis devem concordar. |
| Paleta | Verde-petróleo representa seleção/foco; terracota fica reservada para uma ênfase editorial secundária; neutros não indicam aprovação ou erro. |
| Responsividade | Preservar os controles de ampliação, a largura definida pelo usuário e a leitura em temas claro/escuro. |
| Manutenção | Testar toda a coleção, não somente duas ou três amostras escolhidas. |

## Achados concretos e correções implementadas

### 1. Escalas com precisão visual injustificada — alta prioridade

- Havia **148** esquemas do tipo spectrum; **84** compartilhavam as coordenadas **0,1 / 0,5 / 0,9**, apesar de não se basearem em grandezas mensuradas.
- Uma barra de gradiente contínuo com marcas nessas posições poderia sugerir uma medida objetiva.
- **Correção:** substituir por cartões numerados e agrupados em sequências qualitativas, sem inventar distâncias ou percentuais. As **507 propriedades artificiais** de posição foram retiradas da fonte editorial JSON. O desenho informa explicitamente que não há medição quantitativa.
- A repetição de um formato não é considerada um objetivo. Foi removido do teste anterior o incentivo a ter um número mínimo de aulas com escalas.

### 2. Precisão jornalística e científica — alta prioridade

Foram revisadas **16 peças editoriais** dos diagramas e legendas, incluindo:

- Boletim oficial não equivale a verdade verificada; imagem televisiva não é prova automática.
- Expressões como "inequívoca" precisam ser reservadas para afirmações sustentáveis, não para qualquer frase com contexto.
- "Sugere", "indica" e "demonstra" não podem ser ordenados arbitrariamente quando representam força de evidência.
- Uma história, uma contagem e uma amostra representativa são evidências de tipos distintos.
- A licença CC BY-NC e CC BY tem condições específicas, e a inexistência de licença aberta não elimina exceções legais.
- Um ângulo de câmera pode produzir leituras de poder, mas essas leituras não são determinísticas.
- O número f de uma lente não garante nitidez da cena inteira; outros parâmetros importam.
- O pastel não é descrito apenas como dessaturação: sua luminosidade também é relevante.
- **Correção geométrica:** o raio ilustrativo da luz **rasante** foi reposicionado para seguir próximo e quase paralelo à superfície, em vez de incidir perpendicularmente.

### 3. Consistência de estados e cores — prioridade média

- Os botões **01 / 02 / 03** usavam terracota como estado ativo, enquanto outras seleções adotavam verde e superfícies neutras.
- **Correção:** seleção verde-petróleo de contraste elevado, estados inativos neutros, hover sutil, foco visível e alvo de toque de 44 × 44 px; cores próprias para temas claro/escuro.
- O mesmo padrão foi estendido às abas, opções e entradas da Academia da Linguagem. **Nenhuma largura de diagrama foi alterada.**
- A quarta cor dos esquemas genéricos foi harmonizada com cinza-ardósia, eliminando o lilás que destoa da identidade editorial.

### 4. Consistência técnica dos SVGs — prioridade média

- Todos os **351** desenhos usam agora elementos de acessibilidade \`title\` e \`desc\` próprios.
- Identificadores de marcadores SVG são únicos na página, evitando conflitos entre figuras.
- As pirâmides ganharam áreas mínimas mais largas para rótulos, reduzindo risco de texto invadir fronteiras.
- Nos dossiês linguísticos, a curva da prosódia é explicitamente identificada como **ilustração, não medição acústica**, e a resposta a um pedido passa a ser descrita como **possível**, não inevitável.

## Resultado da validação automática

O teste \`test_visual_curator.mjs\` verifica a coleção inteira: estrutura dos SVGs, ausência de coordenadas inválidas, IDs únicos, progressões ordinais, conceitos editoriais de alto risco, contrastes de seleção que atendam WCAG AA e três perspectivas distintas nos oito diagramas de linguística.

O GitHub Actions executa esse teste junto dos testes de currículo, Atlas, navegação, microfone e geração do HTML offline.

## Lacunas que exigem observação humana

1. Percorrer todas as imagens em um navegador real, inclusive Android, em **modo claro e escuro**.
2. Reexaminar rótulos de estruturas arquitetônicas de autoria desenhada, sobretudo quando dependem de interpretação de projeção e materiais.
3. Submeter conceitos de linguística, direito autoral e jornalismo à revisão de especialistas; desenhos didáticos continuam modelos simplificados.
4. Evitar ampliar a coleção apenas por quantidade: o próximo passo preferencial é refinar a explicação e a validade das figuras existentes.

**Princípio editorial:** toda seta, cor e posição precisa ter uma razão didática demonstrável.
