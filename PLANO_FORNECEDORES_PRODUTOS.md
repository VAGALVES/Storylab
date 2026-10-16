# StoryLab — Repertório de Fornecedores e Produtos

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

## Próximas rodadas — propostas, não entregas

- **Dossiê de produto por dimensões:** texto autoral, dados observados, lacunas e evidências, com fotos quando autorizadas.
- **Roteiro de visita técnica:** perguntas sequenciadas por função e tipo de fornecedor, resumo pós-visita.
- **Comparação orientada:** dois produtos e dois fornecedores sem fabricar métricas.
- **Gramática e regência técnica:** perguntar sobre, depender de, adequar-se a, diferenciar-se de, comply with, specialize in, be made of/from etc., com negação e hipóteses.
- **Especialização em vestuário e modelagem:** caimento, gancho, cava, cabeça de manga, acabamento, PIP/PP samples, tolerâncias e revisões.
- **Expansão da fraseoteca:** respostas, objeções, negociação, follow-up e comunicação intercultural.
- **Curadoria nativa de mandarim**, testes visuais no Android e verificação humana do conteúdo técnico.

**Condição de conclusão:** funcionalidade visível no menu, dados testados, build offline sincronizado, CI aprovado e código na branch `main`.
