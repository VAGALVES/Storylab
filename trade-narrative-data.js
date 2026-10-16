/* StoryLab v2.23 · Cenas de estudo e roteiro oral. São situações hipotéticas,
   nunca fichas de produtos reais nem alegações de fabricantes. */
window.STORYLAB_NARRATIVE_DATA={
 phases:[
  {id:'contexto',name:'Contextualizar',kind:'Plano geral',focus:'O que é, para quem existe e em qual situação você está observando?',camera:'Plano geral com referência de escala; segure a tomada antes de avançar.',frame:'Aqui observamos [objeto], pensado para [tarefa], no contexto de [situação].',guard:'Não apresente público-alvo ou finalidade como fato sem informação confiável.'},
  {id:'forma',name:'Forma & relações',kind:'Plano de perfil',focus:'Que proporção, orientação e relação entre partes realmente aparece?',camera:'Perfil e três quartos. Revele frente, profundidade e elementos estruturais.',frame:'De [ângulo], a [parte] [verbo espacial] a [parte de referência]; essa disposição [efeito observado].',guard:'Evite afirmar materiais e valores de dimensão apenas pela aparência.'},
  {id:'materia',name:'Matéria & acabamento',kind:'Detalhe / macro',focus:'Qual textura, brilho, junta, borda e superfície você consegue verificar?',camera:'Close estável e luz lateral para mostrar textura, borda e transições.',frame:'Ao observar [superfície], noto [textura]; [material] é [aparente/declarado/confirmado], não uma suposição disfarçada.',guard:'Liso ≠ fosco; revestido ≠ feito inteiramente de determinado material.'},
  {id:'interacao',name:'Função & ergonomia',kind:'Demonstração',focus:'Qual movimento, pega, comando ou resposta foi efetivamente testado?',camera:'Mostre a mão, o objeto e o resultado da ação. Informe duração e condição.',frame:'Durante [tarefa/teste], [parte] [ação]; nessa condição, a experiência [observação com limite].',guard:'Uma demonstração curta não comprova durabilidade, eficiência ou segurança geral.'},
  {id:'sintese',name:'Síntese responsável',kind:'Fechamento',focus:'O que você pode concluir e o que ainda depende de teste ou documentação?',camera:'Retorne ao plano geral e destaque um detalhe que sustente sua conclusão.',frame:'A principal característica observada é [atributo] em [situação]. Falta verificar [evidência] antes de concluir [afirmação].',guard:'Separe opinião, observação, declaração e medição; evite elogio ou crítica sem fundamento.'}
 ],
 languageBridges:[
  {id:'contexto',
   pt:'Neste plano, apresento o objeto no ambiente em que está.',
   en:'In this shot, I introduce the object in its setting.',
   zh:'在这个镜头中，我介绍物品及其所处的环境。',
   py:'Zài zhège jìngtóu zhōng, wǒ jièshào wùpǐn jí qí suǒ chǔ de huánjìng.',
   insight:'Plano de filmagem é shot, não plan. 镜头 (jìngtóu) pode indicar tomada ou enquadramento; 环境 (huánjìng) situa o objeto sem inferir finalidade.'},
  {id:'forma',
   pt:'Deste ângulo, observo como uma parte se relaciona com outra.',
   en:'From this angle, I observe how one part relates to another.',
   zh:'从这个角度，我观察一个部件与另一个部件之间的关系。',
   py:'Cóng zhège jiǎodù, wǒ guānchá yí gè bùjiàn yǔ lìng yí gè bùjiàn zhījiān de guānxì.',
   insight:'Relacionar-se com é mais amplo que conectar-se a. Relates to / 与……之间的关系 não exige contato; connects to / 连接 descrevem ligação observável.'},
  {id:'materia',
   pt:'A superfície parece lisa, mas ainda não confirmei o material.',
   en:'The surface looks smooth, but I have not verified the material.',
   zh:'表面看起来很光滑，但我还没有确认材质。',
   py:'Biǎomiàn kàn qǐlái hěn guānghuá, dàn wǒ hái méiyǒu quèrèn cáizhì.',
   insight:'Looks / 看起来 indicam aparência, não composição comprovada. Smooth / 光滑 não são sinônimos de glossy / 有光泽.'},
  {id:'interacao',
   pt:'Nesta demonstração, observo como o objeto se comporta durante o uso.',
   en:'In this demonstration, I observe how the object behaves during use.',
   zh:'在这次演示中，我观察物品在使用时的表现。',
   py:'Zài zhè cì yǎnshì zhōng, wǒ guānchá wùpǐn zài shǐyòng shí de biǎoxiàn.',
   insight:'During use / 在使用时 delimitam a situação. Uma demonstração curta não comprova desempenho duradouro, segurança ou confiabilidade.'},
  {id:'sintese',
   pt:'Posso descrever o que observei, mas ainda preciso confirmar os dados técnicos.',
   en:'I can describe what I observed, but I still need to verify the technical data.',
   zh:'我可以描述观察到的情况，但还需要核实技术数据。',
   py:'Wǒ kěyǐ miáoshù guānchá dào de qíngkuàng, dàn hái xūyào héshí jìshù shùjù.',
   insight:'Describe / 描述 não significa verify / 核实. A conclusão distingue observação, declaração de terceiros e medição verificável.'}
 ],
 scenes:[
 {id:'moto',name:'Motocicleta',tag:'Mobilidade',illustration:'moto',intro:'Uma moto vista em um showroom. Nenhuma potência, autonomia ou medida é conhecida.',nouns:['carenagem','chassi','guidão','banco','comando'],verbs:['contornar','sustentar','articular','alinhar','amortecer'],adjectives:['angular','esguio','aderente','equilibrado','volumoso'],questions:[
 'Que tipo de motocicleta está diante de você? Há referência visual de escala, sem inferir cilindrada ou potência?',
 'Como carenagem, guidão e banco se distribuem? Qual vista permite observar cada dimensão?',
 'Quais superfícies parecem metálicas, poliméricas ou têxteis? Há juntas, folgas ou rebarbas perceptíveis?',
 'Em uma demonstração autorizada, como se alcançam comandos e como a massa é percebida na manobra estática?',
 'Quais impressões se sustentam? O que exigiria ensaio de segurança, medição ou especificação técnica?'],
 pitfalls:['Afirmar potência a partir do aspecto esportivo.','Chamar a moto de leve sem manusear ou pesar.']},
 {id:'carro',name:'Automóvel',tag:'Automotivo',illustration:'carro',intro:'Um automóvel estacionado, observado externamente e depois no interior, se houver autorização.',nouns:['carroceria','painel','console','banco','porta'],verbs:['ladear','envolver','articular','abrir','sustentar'],adjectives:['baixo','alongado','contínuo','fosco','harmônico'],questions:[
 'De onde o carro está sendo visto? Que referência ajuda a explicar a escala sem inventar medidas?',
 'Quais linhas definem a silhueta? Como rodas, teto e vidros se relacionam nas vistas de perfil e frente?',
 'Quais materiais são aparentes? Bordas, juntas e ajustes entre painéis estão visualmente uniformes?',
 'Como se alcançam comandos e portas em uma postura concreta? Qual tempo de uso realmente foi observado?',
 'O que é apreciação estética e o que exigiria uma medição de conforto, consumo ou segurança?'],
 pitfalls:['Usar aparência robusta como prova de segurança.','Dizer que é ergonômico após poucos segundos sentado.']},
 {id:'telefone',name:'Smartphone',tag:'Eletrônicos',illustration:'telefone',intro:'Um smartphone manuseado por um curto período, sem conhecer as especificações internas.',nouns:['carcaça','tela','moldura','botão','módulo de câmeras'],verbs:['circundar','sobressair','encaixar','responder','refletir'],adjectives:['achatado','fino','liso','fosco','escorregadio'],questions:[
 'Como mostrar a escala do telefone na mão sem distorcer perspectiva ou proporções?',
 'Onde ficam botões, moldura, tela e módulo de câmeras? A câmera sobressai do corpo?',
 'Quais áreas são lisas ou rugosas, brilhantes ou foscas? A composição do material foi confirmada?',
 'Como o produto se acomoda na mão e como os botões respondem durante ações específicas?',
 'Quais percepções de fluidez são situadas e quais conclusões precisam de dados de desempenho ou bateria?'],
 pitfalls:['Confundir tamanho de câmera com qualidade da imagem.','Inferir alumínio ou vidro apenas pelo brilho.']},
 {id:'camera',name:'Câmera portátil',tag:'Imagem',illustration:'camera',intro:'Uma câmera compacta apresentada para gravação urbana, ainda sem ensaio de imagem.',nouns:['lente','empunhadura','corpo','tela','suporte'],verbs:['retrair','girar','estabilizar','encaixar','recuar'],adjectives:['compacto','leve','equilibrado','articulado','discreto'],questions:[
 'Qual é a função provável e o que você sabe, ou ainda não sabe, sobre o equipamento?',
 'Como lente, tela e empunhadura se articulam? Em qual posição o corpo ocupa menos volume?',
 'Como são as bordas, textura de pega, botões e transições de revestimento?',
 'Você realmente testou estabilização, foco, comandos ou equilíbrio com acessórios? Em quais condições?',
 'Quais vantagens são apenas potenciais e quais foram demonstradas? O que requer um teste de vídeo?'],
 pitfalls:['Prometer estabilização perfeita sem gravar.','Chamar compacto e leve de sinônimos.']},
 {id:'cadeira',name:'Cadeira de trabalho',tag:'Design & ergonomia',illustration:'cadeira',intro:'Uma cadeira examinada por forma, ajustes e conforto durante uma experiência limitada.',nouns:['assento','encosto','base','apoio de braço','alavanca'],verbs:['sustentar','inclinar','reclinar','ajustar','articular'],adjectives:['macio','firme','estável','acolchoado','ajustável'],questions:[
 'Que tipo de tarefa e postura se pretende atender? Por quanto tempo alguém utilizou a cadeira?',
 'Como assento, encosto e apoios se relacionam? Há mecanismos visíveis de ajuste?',
 'O revestimento é áspero, liso ou macio? Há costuras, folgas e cantos aparentes?',
 'Que regulações foram testadas? Como o apoio se comportou para uma pessoa específica?',
 'A cadeira parece confortável nesta sessão. O que ainda é necessário para avaliar ergonomia prolongada?'],
 pitfalls:['Tomar uma boa impressão de conforto como certificação ergonômica.','Usar firme e rígido indiscriminadamente.']},
 {id:'bateria',name:'Bateria portátil',tag:'Energia',illustration:'bateria',intro:'Um banco de energia portátil observado externamente, sem medir capacidade ou potência.',nouns:['célula','carcaça','porta','indicador','circuito de proteção'],verbs:['armazenar','fornecer','indicar','dissipar','conectar'],adjectives:['portátil','espesso','robusto','liso','volumoso'],questions:[
 'Para qual situação de uso o produto é apresentado? O que foi informado, e por quem?',
 'Como portas, indicadores e carcaça estão distribuídos? Onde cabem cabos e conectores?',
 'Como a superfície parece construída? Material interno e composição das células são conhecidos?',
 'Alguma função foi testada em condição controlada? Houve observação de aquecimento ou indicador?',
 'Há dados verificáveis de Wh, W, proteção e ensaios, ou apenas alegações promocionais?'],
 pitfalls:['Confundir energia (Wh), potência (W) e corrente (A).','Anunciar capacidade real a partir do tamanho físico.']},
 {id:'ferramenta',name:'Ferramenta elétrica',tag:'Ferramentas',illustration:'ferramenta',intro:'Uma ferramenta de uso manual apresentada em exposição, sem teste de carga ou ruído.',nouns:['empunhadura','gatilho','mandril','carcaça','bateria'],verbs:['acionar','girar','fixar','transmitir','dissipar'],adjectives:['aderente','compacto','robusto','angular','cansativo'],questions:[
 'Qual tarefa ela se propõe a executar? O que está documentado pelo expositor?',
 'Onde estão o gatilho, a empunhadura e a área de trabalho? Que relações geométricas importam?',
 'Qual textura favorece a pega? Há fixadores, juntas ou saliências que mereçam comentário?',
 'Em demonstração permitida, como o comando responde? Houve vibração, ruído ou esforço percebido?',
 'O que ainda exige teste de torque, segurança, autonomia ou fadiga?'],
 pitfalls:['Afirmar torque e potência sem medir.','Inferir segurança de uma carcaça grossa.']},
 {id:'showroom',name:'Marca & showroom',tag:'Fornecedor / marca',illustration:'showroom',intro:'Uma visita a um showroom, onde portfólio e narrativa de marca podem ser observados sem presumir a fabricação.',nouns:['portfólio','mostruário','linha de produtos','identidade','processo'],verbs:['apresentar','distribuir','especializar-se','fabricar','demonstrar'],adjectives:['diversificado','coeso','especializado','modular','inovador'],questions:[
 'O local pertence à marca, fabricante, distribuidor ou empresa comercial? O que foi confirmado?',
 'Como as linhas de produtos são organizadas e que diferenças estruturais são observáveis?',
 'O que os acabamentos e materiais dos exemplares mostram, e o que permanece no discurso comercial?',
 'Quais demonstrações foram feitas e quais dados foram apenas declarados?',
 'Como descrever a proposta de valor sem confundir catálogo, capacidade fabril e certificações?'],
 pitfalls:['Tomar showroom como evidência de fábrica própria.','Confundir portfólio amplo com capacidade produtiva integrada.']}
 ],
 rubric:[
 ['referencia','Contextualizei o objeto e a situação de uso.'],
 ['semantica','Usei substantivos, verbos e adjetivos sem misturar conceitos.'],
 ['evidencia','Separei o que observei do que foi declarado ou medido.'],
 ['imagem','Minha narração acompanha planos que realmente mostram o detalhe citado.'],
 ['limite','Minha conclusão identifica limites e pontos ainda não verificados.']
 ],
 sources:[
 ['impressao','Impressão / aparência'],
 ['observado','Observação ou teste pessoal'],
 ['declarado','Declaração de terceiro'],
 ['medido','Medição registrada']
 ]
};