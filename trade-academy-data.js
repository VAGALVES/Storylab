/* StoryLab Shanghai · Academia Interindustrial e Radar Setorial · conteúdo autoral v2.17
   Modelos didáticos: não substituem normas aplicáveis, relatórios de teste ou due diligence. */
window.STORYLAB_TRADE_ACADEMY={
 chapters:[
 {
 id:'produto-valor',area:'Teoria de Produto',title:'O que é um produto — função, necessidade e valor',
 subtitle:'Da descrição do objeto à compreensão do problema que ele resolve.',
 sections:[
 ['Produto não é apenas objeto','Um produto reúne função, forma, desempenho, contexto de uso, serviços associados e uma promessa de valor. A mesma característica física pode ser desejável para um usuário e inadequada para outro. Comece pelo problema e pelo ambiente em que a solução será empregada.','Um carregador portátil compacto pode facilitar viagens, mas a autonomia útil e a compatibilidade elétrica importam mais do que a aparência.'],
 ['Atributo, benefício e comprovação','Atributo é uma característica descrita: peso, material, potência ou tipo de acabamento. Benefício é o efeito relevante para alguém: portabilidade, conforto, economia ou confiabilidade. Benefícios alegados exigem critérios e circunstâncias; não podem ser inferidos automaticamente do atributo.','“Pesa 180 g” é diferente de “é confortável de transportar por dez horas”. A primeira afirmação requer medição; a segunda depende do uso.'],
 ['Enquadramento comparativo','Comparar produtos requer uma mesma função de referência, um contexto de uso definido e critérios comparáveis. Uma bateria, um tecido e um componente automotivo exigem métricas diferentes. Evite transformar preferência pessoal em superioridade técnica universal.','Antes de comparar dois dispositivos, defina requisitos mínimos de bateria, segurança, compatibilidade, manutenção e custo total.']
 ],
 terms:[['Requisito de uso','use requirement'],['Proposta de valor','value proposition'],['Adequação ao uso','fitness for use']],
 caseStudy:['Dois fones de ouvido oferecem cancelamento de ruído.','Um vendedor afirma que o modelo B é “o melhor do mercado”.','Sem protocolo de teste, condições de uso e critérios independentes, a liderança não está demonstrada.','Descreva funções e métricas verificáveis; classifique “melhor” como alegação comercial.'],
 quiz:['Qual afirmação separa corretamente atributo, benefício e evidência?',['“Potência alta sempre significa maior qualidade.”','“A potência declarada é um atributo; o desempenho precisa ser testado em condições definidas.”','“Se o fornecedor diz que dura mais, a durabilidade foi confirmada.”'],1,'Potência, autonomia ou resistência só têm significado comparativo com condições, método de avaliação e registro.'],
 prompt:['Que necessidade o produto atende e qual evidência sustenta esse benefício?','Which user need does this product address, and what evidence supports that benefit?','这个产品满足什么用户需求？有什么证据支持这个优势？','Zhège chǎnpǐn mǎnzú shénme yònghù xūqiú? Yǒu shénme zhèngjù zhīchí zhège yōushì?']
 },
 {
 id:'arquitetura-sistemas',area:'Engenharia de Sistemas',title:'Arquitetura, componentes e interfaces',
 subtitle:'Entender o produto como sistema integrado, não uma coleção de peças.',
 sections:[
 ['Sistemas e subsistemas','A arquitetura descreve como funções são distribuídas entre partes e como elas interagem. Em um veículo há subsistemas de energia, controle, segurança e comunicação; em um dispositivo eletrônico, hardware, firmware, sensores e alimentação. A integração pode determinar o resultado mesmo quando cada componente funciona isoladamente.','Um sensor preciso não garante uma leitura confiável se o software, a calibração ou a instalação forem inadequados.'],
 ['Interfaces e dependências','Interface é o ponto onde unidades trocam energia, material, informação ou esforço. Avaliar compatibilidade exige observar dimensões, padrões elétricos, protocolos, tolerâncias e limites operacionais conforme o caso. Alterações aparentemente pequenas em um componente podem afetar o conjunto.','Uma porta de conexão fisicamente compatível não garante suporte à mesma tensão ou ao mesmo protocolo de comunicação.'],
 ['Manutenção e modos de falha','Projetar e avaliar um sistema exige considerar reparabilidade, substituição, acesso a peças e consequências de falhas. Não basta perguntar “funciona?”: pergunte o que ocorre se um elemento falhar, como o problema é detectado e quem presta suporte.','Em uma linha automatizada, uma peça de reposição inacessível pode ampliar a parada muito além do tempo necessário ao reparo.']
 ],
 terms:[['Subsistema','subsystem'],['Interface técnica','technical interface'],['Modo de falha','failure mode']],
 caseStudy:['Um equipamento utiliza componentes de três fornecedores.','A equipe confirma individualmente as fichas de cada componente.','Ainda faltam testes da integração, das interfaces e da operação conjunta.','Registre especificações de interface e peça demonstração do sistema completo.'],
 quiz:['Qual risco existe quando se validam apenas componentes isolados?',['Falhas de interface ou integração podem passar despercebidas.','O produto já está automaticamente pronto para produção.','As especificações deixam de ser necessárias.'],0,'A conformidade individual das peças não demonstra o funcionamento seguro e consistente do sistema integrado.'],
 prompt:['Como vocês validam as interfaces entre os componentes do sistema?','How do you validate the interfaces between system components?','你们如何验证系统各组件之间的接口？','Nǐmen rúhé yànzhèng xìtǒng gè zǔjiàn zhījiān de jiēkǒu?']
 },
 {
 id:'materiais-processos',area:'Ciência dos Materiais',title:'Materiais, propriedades e transformação',
 subtitle:'Por que composição e processo não podem ser avaliados separadamente.',
 sections:[
 ['Propriedades relevantes','Resistência, dureza, flexibilidade, condutividade e estabilidade térmica podem ser relevantes, mas sua importância depende da aplicação. O mesmo material apresenta comportamentos diferentes segundo processamento, geometria e condições de uso. Consulte parâmetros mensuráveis, não apenas adjetivos comerciais.','Um polímero “resistente” pode falhar em temperaturas inadequadas ou após exposição prolongada à radiação ultravioleta.'],
 ['Processo muda o resultado','Tratamento térmico, usinagem, moldagem, soldagem, revestimento e beneficiamento têxtil modificam acabamento, propriedades e variabilidade. Duas peças com composição nominal igual podem ter desempenho distinto. O processo deve ser descrito juntamente com tolerâncias e controle.','Duas carcaças de alumínio podem exigir processos e testes diferentes, embora compartilhem a mesma designação geral de material.'],
 ['Compromissos e trade-offs','Projetos envolvem compromissos entre peso, custo, durabilidade, resistência, reciclabilidade e aparência. Não existe material perfeito independente da função. Uma escolha técnica consistente explicita prioridades, limites e impactos para a cadeia produtiva.','Reduzir massa pode alterar rigidez, custo de fabricação e reparabilidade; é preciso confrontar os requisitos reais.']
 ],
 terms:[['Propriedade do material','material property'],['Tratamento superficial','surface treatment'],['Compromisso técnico','engineering trade-off']],
 caseStudy:['Duas amostras apresentam o mesmo material nominal.','O fornecedor assegura que ambas terão durabilidade equivalente.','Acabamento, geometria, processamento e condições de ensaio não foram comparados.','Solicite processo, especificação aplicável, tolerâncias e ensaios sob condições equivalentes.'],
 quiz:['Qual procedimento é tecnicamente mais consistente?',['Concluir que materiais com o mesmo nome têm sempre o mesmo desempenho.','Escolher apenas pela aparência e ignorar processo.','Relacionar material, processamento e condições de uso às propriedades testadas.'],2,'A composição isolada não substitui caracterização, processo e avaliação nas condições de serviço.'],
 prompt:['Quais propriedades do material são críticas para esta aplicação?','Which material properties are critical for this application?','对于这个应用，材料的哪些性能最关键？','Duìyú zhège yìngyòng, cáiliào de nǎxiē xìngnéng zuì guānjiàn?']
 },
 {
 id:'producao-capacidade',area:'Operações Industriais',title:'Processo produtivo, capacidade e gargalos',
 subtitle:'Da visita guiada à compreensão dos fluxos reais de fabricação.',
 sections:[
 ['Fluxo e transformação','Descreva a sequência que converte insumos em produto, incluindo inspeções, transportes internos, estoques intermediários e retrabalho. O fluxo pode envolver fabricação interna e subcontratação. Identificar o que é feito onde evita atribuir à fábrica competências que ela apenas coordena.','Uma empresa de eletrônicos pode executar montagem final localmente e terceirizar a fabricação de placas e a moldagem da carcaça.'],
 ['Capacidade nominal e produção real','Capacidade declarada indica possibilidade sob determinadas condições; produção realizada descreve saída em período concreto. Disponibilidade de máquinas, pessoas, materiais, mix e perdas alteram o resultado. Pergunte sempre a unidade, o período e a base de cálculo.','“20 mil unidades por mês” não esclarece se é capacidade nominal, pico teórico ou média efetivamente alcançada.'],
 ['Gargalo e estabilidade','O gargalo restringe o fluxo do sistema, mas pode mudar com o mix de produtos e com a disponibilidade de recursos. Evidências úteis incluem registros de produção, tempos de ciclo, filas, refugos e histórico de entregas. Uma visita visual é apenas uma parte da apuração.','Uma linha com máquinas modernas pode atrasar porque o ensaio final ou o abastecimento de componentes limita a saída.']
 ],
 terms:[['Capacidade nominal','rated capacity'],['Produção efetiva','actual output'],['Gargalo','bottleneck']],
 caseStudy:['Uma fábrica exibe dez linhas de montagem.','Alega duplicar facilmente o volume mensal.','Não foram apresentados turnos, produtividade, disponibilidade de insumos ou registros históricos.','Trate a expansão como projeção declarada e solicite séries de produção e critérios.'],
 quiz:['O que torna uma comparação de capacidade válida?',['Somar o número de máquinas sem conhecer a operação.','Comparar períodos, unidades, mix e produção efetiva sob condições equivalentes.','Usar a capacidade máxima anunciada como entrega garantida.'],1,'A produção depende do sistema completo e de suas restrições, não de um único número promocional.'],
 prompt:['Essa capacidade é nominal ou baseada na produção real dos últimos meses?','Is that rated capacity or based on actual output over recent months?','这是额定产能，还是根据近几个月的实际产量计算的？','Zhè shì édìng chǎnnéng, háishì gēnjù jìn jǐ gè yuè de shíjì chǎnliàng jìsuàn de?']
 },
 {
 id:'qualidade-metrologia',area:'Metrologia e Qualidade',title:'Medição, ensaio, confiabilidade e aceitação',
 subtitle:'Como transformar uma alegação em uma conclusão sustentada.',
 sections:[
 ['Medir não é apenas ler um número','Todo resultado depende do instrumento, método, unidade, condições e incerteza apropriada. Repetibilidade e rastreabilidade metrológica podem ser relevantes para comparar resultados. Não trate uma leitura isolada como prova da estabilidade de uma população de produtos.','O comprimento de uma peça precisa ser avaliado com método e tolerância definidos; sem isso, “dentro da medida” é ambíguo.'],
 ['Verificação versus validação','Verificar é confrontar características com requisitos especificados. Validar é determinar se o produto atende ao uso pretendido em seu contexto. Um item pode cumprir um desenho técnico e ainda ser inadequado ao consumidor final; por isso as duas perguntas são necessárias.','Um dispositivo pode ter as dimensões previstas e mesmo assim ser difícil de operar por pessoas com necessidades específicas.'],
 ['Amostragem, falhas e causas','Inspeções por amostragem não demonstram ausência de defeitos em todas as unidades. Falhas exigem descrição, frequência observada, severidade, hipótese causal e comprovação; não confunda correlação com causa. Ações corretivas precisam de verificação de eficácia.','Ao encontrar costuras rompidas ou placas eletrônicas intermitentes, registre lote, condição de teste e evidências antes de indicar a causa.']
 ],
 terms:[['Incerteza de medição','measurement uncertainty'],['Validação','validation'],['Critério de aceitação','acceptance criterion']],
 caseStudy:['Três unidades testadas funcionam durante a demonstração.','O fornecedor afirma que o lote completo está livre de defeitos.','A demonstração não informa plano de amostragem, condições ou confiabilidade estatística.','Descreva o teste observado e solicite registros de inspeção e critérios de aceitação.'],
 quiz:['Uma amostra aprovada prova que todo o lote está sem defeitos?',['Sim, se a apresentação for convincente.','Sim, quando o gerente garante a qualidade.','Não; os resultados precisam ser interpretados conforme método e plano de amostragem.'],2,'O alcance de uma conclusão depende das condições e da representatividade das evidências.'],
 prompt:['Qual foi o método de ensaio e quais são os critérios de aceitação?','What test method was used, and what are the acceptance criteria?','采用了什么测试方法？验收标准是什么？','Cǎiyòng le shénme cèshì fāngfǎ? Yànshōu biāozhǔn shì shénme?']
 },
 {
 id:'inovacao-maturidade',area:'Gestão da Inovação',title:'Inovação, protótipos e maturidade tecnológica',
 subtitle:'Separar demonstração, viabilidade e capacidade de escala.',
 sections:[
 ['Novidade não é maturidade','Uma solução pode ser original, mas ainda não funcionar de modo robusto, seguro ou econômico fora do laboratório. Evidências variam do conceito à demonstração de protótipo, validação em ambiente relevante e produção regular. Termos como “pronto para o mercado” precisam ser definidos.','Uma célula de bateria com resultado laboratorial promissor não equivale a um módulo comercial validado para operação prolongada.'],
 ['Riscos em múltiplas dimensões','Maturidade técnica, industrial, regulatória e comercial são distintas. Um produto pode ter desempenho comprovado, mas depender de material escasso ou de processo ainda não estabilizado. Investigue o que já foi demonstrado e o que permanece hipótese.','Um sensor inovador pode operar muito bem, mas não possuir cadeia de manutenção ou integração confiável ao sistema do cliente.'],
 ['Aprendizagem por experimentos','Inovação exige hipóteses explícitas, critérios de sucesso, protótipos e ciclos de feedback. Experimentos bem registrados oferecem mais conhecimento do que demonstrações selecionadas. Diferencie resultado observado, previsão e meta de engenharia.','Em uma visita, peça relatórios de falhas e mudanças de projeto, além do vídeo do protótipo funcionando.']
 ],
 terms:[['Prova de conceito','proof of concept'],['Prontidão tecnológica','technology readiness'],['Escalabilidade','scalability']],
 caseStudy:['Uma startup apresenta protótipo funcional de geração de energia.','Afirma estar pronta para abastecer grandes instalações.','Não há evidência de confiabilidade prolongada, fabricação em escala ou aprovação regulatória.','Classifique a demonstração como marco parcial, não como prontidão comercial demonstrada.'],
 quiz:['Qual pergunta melhor avalia a maturidade?',['Que etapas já foram demonstradas, em quais condições e quais permanecem pendentes?','O vídeo de divulgação tem boa qualidade?','O nome do produto transmite inovação?'],0,'Maturidade é uma progressão apoiada em evidências, não uma impressão estética.'],
 prompt:['O que já foi validado em condições reais e o que ainda está em desenvolvimento?','What has been validated under real-world conditions, and what is still under development?','哪些内容已经在实际条件下得到验证？哪些仍在开发中？','Nǎxiē nèiróng yǐjīng zài shíjì tiáojiàn xià dédào yànzhèng? Nǎxiē réng zài kāifā zhōng?']
 },
 {
 id:'cadeia-custos',area:'Economia e Suprimentos',title:'Custos, cadeia de suprimentos e decisão de compra',
 subtitle:'Avaliar fornecedor e produto para além do preço unitário.',
 sections:[
 ['Custo total de propriedade','Preço de compra é apenas uma parte da decisão. Transporte, instalação, consumo, treinamento, manutenção, peças, retrabalho, descarte e interrupções podem ser relevantes conforme o tipo de produto. Registre hipóteses e horizonte de análise antes de comparar alternativas.','Um equipamento mais barato pode custar mais ao longo do uso se consumir mais energia ou exigir manutenção especializada.'],
 ['Dependências e riscos da cadeia','Uma cadeia produtiva envolve subfornecedores, transporte, disponibilidade e requisitos de origem. Dependência de componente único ou prazo sem margem pode comprometer entregas. Diferencie informação declarada sobre a cadeia de registros efetivamente apresentados.','A fábrica pode controlar a montagem, mas depender de uma única fonte externa para o componente crítico.'],
 ['Condições comerciais verificáveis','MOQ, prazo, Incoterms, moeda, garantia e condições de pagamento precisam de escopo definido na proposta. Prazo estimado de fabricação não é a mesma coisa que prazo total de entrega. Algumas responsabilidades mudam conforme o contrato e a jurisdição; evite generalizar.','Uma cotação com prazo de 30 dias pode excluir transporte, inspeção, desembaraço e eventuais aprovações.']
 ],
 terms:[['Custo total de propriedade','total cost of ownership'],['Risco da cadeia','supply chain risk'],['Prazo de entrega','lead time']],
 caseStudy:['Dois fornecedores cotam o mesmo componente.','A oferta mais barata é considerada automaticamente vencedora.','Custos de teste, logística, garantia e risco de atraso não foram incorporados.','Construa uma comparação com mesmas condições, horizonte e riscos documentados.'],
 quiz:['Qual decisão é melhor fundamentada?',['Escolher sempre o menor preço unitário.','Comparar custo total, desempenho, termos e riscos para a mesma necessidade.','Presumir que maior MOQ garante melhor qualidade.'],1,'A alternativa mais apropriada depende do conjunto de requisitos e dos custos e riscos relevantes.'],
 prompt:['Além do preço unitário, quais custos e riscos devemos considerar?','Beyond unit price, what costs and risks should we consider?','除了单价之外，我们还应该考虑哪些成本和风险？','Chúle dānjià zhīwài, wǒmen hái yīnggāi kǎolǜ nǎxiē chéngběn hé fēngxiǎn?']
 },
 {
 id:'energia-ciclo',area:'Energia e Sustentabilidade',title:'Energia, ciclo de vida e alegações ambientais',
 subtitle:'Comparar soluções em uma mesma base funcional.',
 sections:[
 ['Desempenho energético contextual','Eficiência é uma relação definida por entradas, saídas e condições de operação; não equivale à palavra “econômico”. Potência instantânea, energia acumulada, capacidade de armazenamento e rendimento são grandezas distintas. As unidades e os protocolos utilizados precisam aparecer no registro.','Uma bateria com capacidade declarada em Wh não fornece, sozinha, autonomia garantida para qualquer dispositivo.'],
 ['Pensamento de ciclo de vida','O impacto de um produto pode envolver extração, fabricação, transporte, uso, reparo e fim de vida. Uma etapa mais limpa não assegura menor impacto total. Compare alternativas que prestem uma função equivalente e informe limites e dados utilizados.','Um dispositivo substituível e reparável pode ter perfil de impactos diferente de um descartável, dependendo de como é usado.'],
 ['Evitar greenwashing','Termos como “verde”, “neutro” e “100% sustentável” são vagos sem escopo, período, indicador e evidência. Certificação precisa ser verificada para o produto, instalação e intervalo corretos; um selo apresentado não demonstra automaticamente uma alegação universal.','Para afirmar economia de energia, peça linha de base, condições de teste e resultado numérico comparável.']
 ],
 terms:[['Unidade funcional','functional unit'],['Eficiência energética','energy efficiency'],['Avaliação do ciclo de vida','life cycle assessment']],
 caseStudy:['Um painel solar é anunciado como “totalmente sustentável”.','O folheto mostra geração elétrica durante o uso.','Faltam limites do sistema, dados de fabricação, materiais e fim de vida para essa afirmação ampla.','Restrinja a descrição à função comprovada e solicite avaliação ambiental com escopo declarado.'],
 quiz:['Qual comparação ambiental é mais defensável?',['Comparar impactos na mesma unidade funcional e informar fronteiras do estudo.','Concluir que todo produto renovável tem impacto ambiental zero.','Escolher o que traz mais símbolos verdes na embalagem.'],0,'Comparações ambientais precisam de função, escopo, dados e limitações explícitos.'],
 prompt:['Qual é a base de medição usada para comparar o consumo de energia?','What measurement basis is used to compare energy consumption?','比较能耗时采用什么测量基准？','Bǐjiào nénghào shí cǎiyòng shénme cèliáng jīzhǔn?']
 },
 {
 id:'conformidade-etica',area:'Governança Técnica',title:'Conformidade, segurança e responsabilidade',
 subtitle:'Saber exatamente o que um certificado prova — e o que não prova.',
 sections:[
 ['Requisito depende do mercado','Normas, testes e requisitos legais podem variar por país, aplicação, categoria e período. Um documento genérico não autoriza concluir que um produto pode ser vendido em qualquer mercado. A equipe deve identificar o mercado de destino e verificar a norma e edição aplicáveis.','O requisito para um brinquedo, uma bateria e um componente de máquina depende de finalidade e jurisdição distintas.'],
 ['Escopo dos documentos','Um certificado pode cobrir empresa, sistema de gestão, processo, componente ou produto específico. Verifique emissor, titular, identificação, validade, escopo e forma de confirmação. Documentos apresentados são fontes a examinar, não prova automática de autenticidade.','A certificação de um sistema de gestão não equivale, por si só, à conformidade de cada produto fabricado.'],
 ['Ética e comunicação responsável','Descreva o que viu, o que alguém afirmou e o que foi comprovado como categorias diferentes. Respeite confidencialidade, privacidade, consentimento para imagens e direitos sobre informação técnica. Uma avaliação responsável também reconhece o que não se conseguiu verificar.','Em um relatório de visita, “fornecedor declarou 95% de entregas no prazo” é diferente de “95% foram auditados e confirmados”.']
 ],
 terms:[['Escopo de certificação','certification scope'],['Rastreabilidade documental','document traceability'],['Declaração não verificada','unverified claim']],
 caseStudy:['Durante a visita, o gerente apresenta uma cópia de certificado.','Alega que todos os produtos estão aprovados para exportação global.','O documento pode ter alcance limitado e sua autenticidade ainda não foi confirmada.','Anote número, emissor, validade, categoria abrangida e mercado de destino; verifique por via apropriada.'],
 quiz:['O que comprova diretamente um certificado de sistema de gestão?',['Que todos os produtos têm aprovação regulatória mundial.','Apenas o que estiver dentro do escopo verificável daquele certificado.','Que não haverá qualquer defeito futuro.'],1,'É indispensável distinguir entidade, sistema, processo e produto, além da situação da certificação.'],
 prompt:['Esse certificado abrange esta fábrica, este produto e o mercado de destino?','Does this certificate cover this factory, this product, and the destination market?','这份证书是否涵盖这家工厂、这个产品以及目标市场？','Zhè fèn zhèngshū shìfǒu hángài zhè jiā gōngchǎng, zhège chǎnpǐn yǐjí mùbiāo shìchǎng?']
 }
 ],
 sectors:[
 {
 id:'automotivo',name:'Automotiva & mobilidade elétrica',tag:'Mobilidade',summary:'Veículos, motores elétricos, sistemas embarcados, componentes e recarga.',
 lenses:[['Arquitetura','Sistemas mecânicos, elétricos e de controle e suas interfaces.'],['Segurança','Cenários de uso, risco e evidência de ensaios aplicáveis.'],['Materiais','Durabilidade, corrosão, massa, reparabilidade e processos.'],['Produção','Fornecedores de níveis distintos, rastreabilidade e variabilidade.'],['Pós-venda','Peças, garantia, manutenção e atualização de software.']],
 proof:'Exigir requisitos definidos para a aplicação, relatórios de ensaio pertinentes e rastreio da configuração testada.',
 question:['Como vocês rastreiam a versão do componente e os ensaios correspondentes?','How do you trace the component revision and its corresponding test results?','如何追踪零部件版本及其对应的测试结果？','Rúhé zhuīzōng língbùjiàn bǎnběn jí qí duìyìng de cèshì jiéguǒ?'],
 theory:'arquitetura-sistemas'
 },
 {
 id:'renovaveis',name:'Energias renováveis',tag:'Energia',summary:'Geração solar, eólica, conversão de potência e integração à rede.',
 lenses:[['Conversão','Entradas, saídas, perdas e condições ambientais.'],['Confiabilidade','Degradação, manutenção e desempenho ao longo do uso.'],['Integração','Inversores, proteção, instalação e compatibilidade.'],['Materiais','Procedência, circularidade e fim de vida.'],['Projeto','Escala, dados de campo, transporte e serviço.']],
 proof:'Comparar ensaios e medições sob condições equivalentes e observar restrições locais de instalação.',
 question:['Em quais condições foi medida a eficiência do sistema?','Under what conditions was the system efficiency measured?','系统效率是在什么条件下测量的？','Xìtǒng xiàolǜ shì zài shénme tiáojiàn xià cèliáng de?'],
 theory:'energia-ciclo'
 },
 {
 id:'baterias',name:'Baterias & armazenamento',tag:'Armazenamento',summary:'Células, módulos, sistemas de gerenciamento e infraestrutura de armazenamento.',
 lenses:[['Capacidade','Wh, Ah, taxa de descarga e temperatura de referência.'],['Segurança','Proteção, gestão térmica, transporte e ensaios relevantes.'],['Envelhecimento','Ciclos, calendário e condições de degradação.'],['Integração','Eletrônica de gerenciamento, monitoramento e conectores.'],['Ciclo de vida','Reuso, reparo, rastreabilidade e destino pós-uso.']],
 proof:'Separar resultado de célula, módulo e sistema completo; verificar método de ensaio e condições.',
 question:['A vida útil declarada foi avaliada em quais condições de temperatura e carga?','Under what temperature and charging conditions was the stated service life evaluated?','所宣称的使用寿命是在什么温度和充电条件下评估的？','Suǒ xuānchēng de shǐyòng shòumìng shì zài shénme wēndù hé chōngdiàn tiáojiàn xià pínggū de?'],
 theory:'qualidade-metrologia'
 },
 {
 id:'eletronicos',name:'Eletrônicos & computação',tag:'Eletrônica',summary:'Placas, sensores, dispositivos de computação, conectividade e componentes.',
 lenses:[['Especificação','Processador, memória, sensores e finalidade de uso.'],['Integração','Interfaces de hardware, firmware, software e protocolos.'],['Térmica','Dissipação de calor, energia e condições de operação.'],['Fabricação','Montagem, testes de placa, inspeções e rastreabilidade.'],['Suporte','Atualizações, segurança, reparo e disponibilidade de peças.']],
 proof:'Confirmar a revisão exata do hardware e firmware da unidade ensaiada, sem extrapolar demonstrações.',
 question:['Qual versão de hardware e firmware corresponde aos resultados do teste?','Which hardware and firmware revision corresponds to these test results?','这些测试结果对应哪个硬件和固件版本？','Zhèxiē cèshì jiéguǒ duìyìng nǎge yìngjiàn hé gùjiàn bǎnběn?'],
 theory:'arquitetura-sistemas'
 },
 {
 id:'portateis',name:'Portáteis & wearables',tag:'Dispositivos pessoais',summary:'Acessórios, câmeras, ferramentas compactas e eletrônicos vestíveis.',
 lenses:[['Ergonomia','Massa, dimensões, contato corporal e operação com uma mão.'],['Autonomia','Consumo, bateria, recarga e cenário de uso.'],['Resistência','Quedas, umidade, calor e condições declaradas.'],['Interoperabilidade','Conexão com celulares, aplicativos e acessórios.'],['Privacidade','Coleta de dados, permissões e práticas de atualização.']],
 proof:'Realizar tarefas reais de uso e distinguir percepção pessoal de resultados de ensaios estruturados.',
 question:['Qual é a autonomia medida durante o uso contínuo deste recurso?','What is the measured battery life during continuous use of this feature?','连续使用这项功能时，实测续航时间是多少？','Liánxù shǐyòng zhè xiàng gōngnéng shí, shícè xùháng shíjiān shì duōshǎo?'],
 theory:'produto-valor'
 },
 {
 id:'automacao',name:'Robótica & automação industrial',tag:'Indústria',summary:'Máquinas, robôs, sensores de processo e sistemas de produção conectados.',
 lenses:[['Função','Tarefa automatizada, ciclo e requisitos de precisão.'],['Segurança','Proteções, interação humana e riscos operacionais.'],['Integração','Protocolos, células de produção e sistemas legados.'],['Confiabilidade','Manutenção, falhas, peças e disponibilidade efetiva.'],['Investimento','Instalação, treinamento, produtividade e custo de parada.']],
 proof:'Observar desempenho integrado no ciclo produtivo, e não apenas velocidade nominal em demonstração.',
 question:['Que métricas mostram o desempenho real do equipamento em produção?','Which metrics demonstrate the equipment’s actual performance in production?','哪些指标能够证明设备在实际生产中的表现？','Nǎxiē zhǐbiāo nénggòu zhèngmíng shèbèi zài shíjì shēngchǎn zhōng de biǎoxiàn?'],
 theory:'producao-capacidade'
 },
 {
 id:'vestuario',name:'Vestuário & tecnologia têxtil',tag:'Moda',summary:'Fibras, tecidos funcionais, modelagem, costura, acabamentos e desenvolvimento de amostras.',
 lenses:[['Matérias-primas','Composição, gramatura, elasticidade e estabilidade.'],['Modelagem','Caimento, mobilidade, gancho, cava e cabeça de manga.'],['Construção','Costuras, aviamentos, passadoria e tolerâncias.'],['Amostras','Briefing, revisões, pré-produção e conformidade da peça.'],['Fornecedor','Capacidade real, especialização e consistência por lote.']],
 proof:'Relacionar avaliação de caimento a base, corpo/prova, grade, medidas, material e acabamento.',
 question:['Podemos revisar a modelagem e as tolerâncias antes da amostra de pré-produção?','Can we review the pattern and tolerances before the pre-production sample?','我们能在产前样衣制作之前复核纸样和尺寸公差吗？','Wǒmen néng zài chǎnqián yàngyī zhìzuò zhīqián fùhé zhǐyàng hé chǐcùn gōngchā ma?'],
 theory:'materiais-processos'
 },
 {
 id:'materiais-avancados',name:'Materiais avançados & fabricação aditiva',tag:'Materiais',summary:'Compósitos, polímeros técnicos, tratamentos e manufatura por deposição.',
 lenses:[['Caracterização','Propriedades medidas em condições relevantes.'],['Processamento','Parâmetros, orientação, pós-processamento e variabilidade.'],['Geometria','Limites dimensionais, superfícies e tolerâncias.'],['Escalabilidade','Taxa de produção, repetibilidade e disponibilidade.'],['Aplicação','Fadiga, envelhecimento e validação da peça final.']],
 proof:'Não extrapolar resultado de corpo de prova para componente funcional sem validação apropriada.',
 question:['Como o processo de fabricação afeta as propriedades da peça final?','How does the manufacturing process affect the final part’s properties?','制造工艺如何影响最终零件的性能？','Zhìzào gōngyì rúhé yǐngxiǎng zuìzhōng língjiàn de xìngnéng?'],
 theory:'materiais-processos'
 },
 {
 id:'iot',name:'Internet das Coisas & infraestrutura inteligente',tag:'Conectividade',summary:'Sensoriamento, conectividade, gestão de dados e produtos conectados.',
 lenses:[['Arquitetura','Sensores, rede, energia, processamento e nuvem.'],['Interoperabilidade','Protocolos, integração e dependência de plataformas.'],['Cibersegurança','Atualizações, autenticação e responsabilidade sobre dados.'],['Operação','Manutenção remota, disponibilidade e falhas de conexão.'],['Governança','Privacidade, vida útil de suporte e continuidade do serviço.']],
 proof:'Verificar comportamento em perda de rede, atualização de firmware e ambiente real de instalação.',
 question:['O que acontece se a conexão cair ou o suporte ao software for encerrado?','What happens if the connection fails or software support ends?','如果网络断开或软件停止维护，会发生什么情况？','Rúguǒ wǎngluò duànkāi huò ruǎnjiàn tíngzhǐ wéihù, huì fāshēng shénme qíngkuàng?'],
 theory:'conformidade-etica'
 }
 ]
};
