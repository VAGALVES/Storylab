# STORYLAB SHANGHAI
## Journalism Academy · Versão 1.1 — Escola da Fala expandida

Uma escola pessoal de Jornalismo, Comunicação Oral e Narrativas Audiovisuais. A proposta é estudar jornalismo com rigor, transformar a cidade de Xangai em laboratório de campo e adquirir um repertório verbal cada vez mais sofisticado para vlogs, crônicas, entrevistas e reportagens.

**Status:** aplicação funcional de fundação acadêmica, não currículo universitário completo nem serviço de ensino credenciado. O projeto distingue intencionalmente aulas já redigidas de unidades apenas planejadas.

### Conteúdo desta edição

| Item | Quantidade | Situação |
|---|---:|---|
| Escolas | 6 | Estruturadas |
| Disciplinas | 43 | Ementas e competências publicadas |
| Unidades curriculares | 172 | Planejadas, com objetivos |
| Aulas integrais | 49 | Texto, 3 conceitos, exemplos, atividade e rubrica |
| Famílias de linguagem | 24 | Com definição de intenção |
| Frases-base em português | 552 | Editáveis em conteúdo-fonte, pesquisáveis no app |
| Equivalentes em inglês | 36 | Seleção inicial, explicitamente incompleta |
| Equivalentes em mandarim | 12 | Seleção inicial com pinyin |
| Atlas de vocabulário | 16 campos; 160 termos | Publicado |
| Desafios de expressão oral | 48 | Publicados, em 3 modos |
| Missões de campo | 30 | Checklist, perguntas, narração e caderno de campo |
| Percurso guiado | 12 semanas | Vinculado a aulas, famílias verbais e missões |

### Novidades da v1.1

- Escola de Comunicação: 10 disciplinas x 4 unidades = 40 aulas completas com atividades e rubricas específicas.
- 120 novas estruturas narrativas em português distribuídas entre as 24 famílias, totalizando 552.
- Oficina da Fala com 24 exercícios de reformulação, versões comentadas e registro de prática.
- Construtor de raciocínio com oito situações de campo e quatro registros de narração.
- Roteiros locais podem ser guardados, restaurados, excluídos, copiados, ouvidos ou enviados ao teleprompter.
- A oficina preserva IDs e armazenamento dos usuários existentes; dados novos também entram no backup.

### O que realmente funciona agora

- Navegação por escolas, disciplinas e unidades; pesquisa de disciplinas.
- Leitura das 49 aulas integrais com demonstrações, prática e avaliação orientada.
- Fraseoteca com busca de texto, 24 famílias, filtros por idioma, favoritos, detalhes e reprodução por `speechSynthesis` (quando o navegador oferece voz adequada).
- Registro de cartões estudados e agendamento local de revisões em 1, 3, 7, 14 e 30 dias.
- Estúdio da Voz: desafio aleatório, gravação com `MediaRecorder` se o navegador permitir, reprodução, arquivo para salvar manualmente e autorrubrica 1–5.
- Construtor de narração usando apenas observações inseridas pelo estudante, estilos documental, espontâneo, contemplativo e didático.
- Nove camadas de comunicação e teleprompter com rolagem e retirada progressiva do texto.
- Atlas de 160 termos para descrição mais precisa.
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

### Estrutura do código

```text
storylab-shanghai/
├── index.html                # Entrada PWA
├── style.css                 # Design editorial responsivo
├── app.js                    # Interface, eventos, estado, gravação, backup
├── data.js                   # Dados gerados (não edite diretamente)
├── generate_data.py          # Fonte principal de disciplinas e frases
├── build_standalone.py       # Produz o HTML único
├── service-worker.js         # Cache da versão estática
├── manifest.webmanifest      # Instalação PWA
├── assets/
│   ├── icon.svg
│   └── skyline.svg
├── test_app.py               # Testes básicos de ponta a ponta
├── PLANO_MESTRE.md           # Conteúdo e roteiro de expansão
└── README.md
```

Para alterar disciplinas, aulas, frases, traduções e missões, edite `generate_data.py` e execute `python generate_data.py`. Para refazer o HTML único, execute `python build_standalone.py`. Para testar, instale Playwright para Python e um Chromium compatível, depois execute `python test_app.py`.

### Princípios de conteúdo

1. **Observação ≠ inferência ≠ fato apurado.** A aula e a interface devem manter essa distinção.
2. **Nenhuma generalização cultural sem contexto.** Identifique local, tempo, fonte e limites do relato.
3. **Toda técnica deve produzir competência observável.** Conceito → demonstração → exercício → feedback → aplicação em campo.
4. **Vocabulário preciso acima de adjetivos vagos.** O glossário é uma biblioteca de construções de pensamento, não apenas de palavras.
5. **Transparência de recursos.** Não contar unidades planejadas como aulas prontas, nem traduções hipotéticas como revisadas.
6. **A mídia é complementar.** A imagem mostra detalhes; a voz acrescenta contexto e pensamento.

### Próxima expansão recomendada

**V1.1 — Profundidade da Escola da Fala:** acrescentar novos exemplos em cada uma das nove camadas, cinquenta exercícios de transformação de frase e ampliar aulas dos quatro módulos de Comunicação Verbal, Linguagem Descritiva, Improvisação e Locução.

**V1.2 — Fraseoteca expandida:** acrescentar novas estruturas revisadas, combinações e variantes contextualizadas por moda, arquitetura, gastronomia, entrevistas e audiovisual, com revisão bilíngue/trilíngue de alto nível.

**V2 — Redação e estúdio audiovisual:** storyboard visual, biblioteca de enquadramentos, planos de captação, fichas de pauta, fontes e checagem.

**V3 — Avaliação avançada:** transcrição e feedback de fala com consentimento explícito e processamento transparente; revisão assistida de roteiros sem inventar fatos.

**V4 — Formação longa:** aprofundar os demais módulos das 43 disciplinas, exercícios de pesquisa com fontes, bibliografia verificável, projetos avaliativos e um portfólio editorial.

---

**A base foi construída para expansão de conteúdo sem refazer a arquitetura.**