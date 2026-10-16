/* StoryLab v2.21 — precisão do objeto, nunca lista setorial avulsa.
   PT é referência; traduções EN/中文 e pinyin são apoio pedagógico. */
window.STORYLAB_OBSERVATION_DATA={
 parts:[
  ['estrutura','Estrutura e sustentação',[
   ['base','base','底座','dǐzuò','Região inferior que serve de apoio; a base não é necessariamente o ponto de fixação.','A base repousa sobre uma superfície plana.','Qual parte recebe e transmite as cargas?'],
   ['chassi','chassis / frame','底盘','dǐpán','Estrutura portante de um veículo ou equipamento; seu sentido varia conforme o projeto.','O chassi serve de suporte para vários conjuntos.','O que está preso ao chassi e o que pertence à carroceria?'],
   ['armação','frame','框架','kuàngjià','Conjunto de elementos que dá sustentação ou delimita uma forma.','A armação sustenta a estrutura externa.','É estrutural, decorativa ou ambas?'],
   ['suporte','bracket / support','支架','zhījià','Peça que segura, posiciona ou transmite carga de outro elemento.','O suporte mantém o módulo elevado.','Em que direção atua a carga?'],
   ['nervura','rib / reinforcing rib','加强筋','jiāqiángjīn','Saliência ou elemento que pode aumentar rigidez local sem preencher todo o volume.','A face interna apresenta nervuras de reforço.','São reforços estruturais ou apenas forma de fabricação?']
  ]],
  ['envoltorio','Corpo e revestimento',[
   ['carcaça','housing / casing','外壳','wàiké','Invólucro externo que aloja ou protege componentes.','A carcaça envolve o mecanismo interno.','É estrutural, protetora ou apenas estética?'],
   ['painel','panel','面板','miànbǎn','Superfície ou peça delimitada que fecha, organiza ou permite acesso.','O painel frontal concentra os comandos.','É removível? Como se fixa?'],
   ['tampa','lid / cover','盖子','gàizi','Elemento que cobre uma abertura ou compartimento.','A tampa fecha o compartimento de cabos.','A vedação faz parte da tampa ou do alojamento?'],
   ['revestimento','coating / cladding','覆层','fùcéng','Camada aplicada sobre um substrato; sua espessura e material podem variar.','O revestimento altera o toque da empunhadura.','Qual é o substrato sob a camada?'],
   ['moldura','bezel / frame','边框','biānkuàng','Elemento que contorna uma abertura, tela ou superfície.','Uma moldura estreita acompanha a tela.','A moldura é protetora ou somente visual?']
  ]],
  ['juncao','Junção e interface',[
   ['dobradiça','hinge','铰链','jiǎoliàn','Junta que permite rotação entre partes ao redor de um eixo.','A dobradiça articula a tampa.','Qual a amplitude, folga e resistência do movimento?'],
   ['encaixe','fitting / joint','配合部位','pèihé bùwèi','Região em que peças se ajustam ou se unem, por contato ou geometria.','O encaixe aproxima duas superfícies.','É fixo, removível ou articulado?'],
   ['fixador','fastener','紧固件','jǐngùjiàn','Elemento que mantém peças unidas, como parafuso, rebite ou presilha.','Um fixador prende o suporte à base.','Pode ser removido sem dano?'],
   ['vedação','seal / sealing','密封件','mìfēngjiàn','Interface que limita passagem de líquidos, gases ou partículas.','A vedação contorna o alojamento.','Há indicação e ensaio da proteção oferecida?'],
   ['conector','connector','连接器','liánjiēqì','Interface para estabelecer ligação mecânica, elétrica ou de dados.','O conector fica na lateral do dispositivo.','Que padrão físico e funcional utiliza?']
  ]],
  ['interacao','Operação e interação',[
   ['empunhadura','grip','握持部','wòchíbù','Área desenhada para segurar, orientar ou controlar o objeto.','A empunhadura altera a distribuição percebida do peso.','É confortável para quais mãos e tarefas?'],
   ['gatilho','trigger','扳机','bānjī','Comando acionado por pressão, frequentemente com os dedos.','O gatilho inicia o movimento do mecanismo.','Exige qual força e curso?'],
   ['seletor','selector / switch','选择开关','xuǎnzé kāiguān','Comando que escolhe entre estados ou modos de operação.','O seletor alterna entre dois modos.','A posição atual fica visível?'],
   ['indicador','indicator','指示器','zhǐshìqì','Elemento que comunica um estado ou uma grandeza ao usuário.','O indicador luminoso informa a condição da bateria.','Que estado indica e com que precisão?'],
   ['batente','stop / end stop','限位块','xiànwèikuài','Elemento que limita deslocamento ou rotação.','O batente impede que a tampa abra além do curso.','A limitação é mecânica ou controlada por software?']
  ]]
 ],
 relations:[
  {id:'circunda',pt:'circunda',en:'surrounds',zh:'环绕',py:'huánrào',frame:['A moldura','circunda','a tela.'],meaning:'A moldura envolve o contorno da tela. Circundar não exige contato físico entre as peças.',question:'A moldura forma um contorno completo ou apenas parcial?',geometry:'surround'},
  {id:'ladeia',pt:'ladeia',en:'flanks',zh:'位于……两侧',py:'wèiyú… liǎngcè',frame:['Os botões','ladeiam','o visor.'],meaning:'Os botões ficam lateralmente ao visor. Com dois botões, o exemplo representa um de cada lado.',question:'Estão de fato em lados opostos ou ambos no mesmo lado?',geometry:'flank'},
  {id:'sobrepoe',pt:'sobrepõe-se a',en:'overlaps',zh:'与……重叠',py:'yǔ… chóngdié',frame:['O painel','sobrepõe-se à','carcaça.'],meaning:'Partes compartilham uma região projetada ou uma área de cobertura. Sobreposição não implica fixação.',question:'A sobreposição existe em qual vista e qual extensão?',geometry:'overlap'},
  {id:'encaixa',pt:'encaixa-se em',en:'fits into',zh:'嵌入',py:'qiànrù',frame:['O conector','encaixa-se na','entrada lateral.'],meaning:'Uma forma é recebida por outra, por compatibilidade geométrica. Encaixar-se não assegura vedação nem travamento.',question:'O encaixe trava, gira ou só se apoia?',geometry:'insert'},
  {id:'apoia',pt:'apoia-se sobre',en:'rests on',zh:'放置在……上',py:'fàngzhì zài… shàng',frame:['A base','apoia-se sobre','a bancada.'],meaning:'A peça recebe suporte da superfície de contato. Apoiar-se não significa estar presa.',question:'O apoio é contínuo ou ocorre em pontos?',geometry:'rest'},
  {id:'atravessa',pt:'atravessa',en:'passes through',zh:'穿过',py:'chuānguò',frame:['O eixo','atravessa','o corpo cilíndrico.'],meaning:'Um elemento cruza o interior ou a espessura de outro. Diferente de apenas passar ao lado.',question:'O elemento sai do outro lado ou termina internamente?',geometry:'cross'},
  {id:'articula',pt:'articula-se com',en:'is hinged to',zh:'与……铰接',py:'yǔ… jiǎojiē',frame:['A tampa','articula-se com','a base.'],meaning:'A conexão permite movimento relativo em uma junta. Não equivale a encaixe rígido.',question:'Qual é o eixo e o limite de rotação?',geometry:'hinge'},
  {id:'recuada',pt:'fica recuada em relação a',en:'is recessed relative to',zh:'相对于……内凹',py:'xiāngduì yú… nèi\'āo',frame:['A lente','fica recuada em relação à','moldura.'],meaning:'A lente está em posição mais interna que a superfície de referência. Recuo é relativo a uma direção.',question:'Recuada em qual face e quanto?',geometry:'recess'},
  {id:'sali',pt:'sobressai de',en:'protrudes from',zh:'从……凸出',py:'cóng… tūchū',frame:['O botão','sobressai da','superfície.'],meaning:'Uma parte projeta-se além da superfície vizinha, de acordo com uma direção de observação.',question:'O quanto projeta e interfere no uso?',geometry:'protrude'},
  {id:'alinhado',pt:'está alinhado com',en:'is aligned with',zh:'与……对齐',py:'yǔ… duìqí',frame:['O visor','está alinhado com','o centro do painel.'],meaning:'Elementos compartilham uma linha ou referência definida; aparência de alinhamento não confirma tolerância.',question:'Qual eixo ou centro geométrico foi usado como referência?',geometry:'align'}
 ],
 senses:[
  ['cor','Cor e aparência cromática','Não misture matiz, saturação e luminosidade.',[
   ['matiz','Família da cor','hue','色相','sèxiàng','Vermelho, verde ou azul descrevem regiões de matiz; não representam automaticamente saturação ou luminosidade.','Que família de cor você observa?'],
   ['saturação','Intensidade cromática','saturation','饱和度','bǎohédù','Uma cor saturada é intensa; uma cor pouco saturada tende a parecer acinzentada. Não se confunde com brilho da superfície.','A cor parece viva ou dessaturada?'],
   ['luminosidade aparente','Clareza percebida da cor','perceived lightness','明度','míngdù','Quanto a cor aparenta ser clara ou escura sob condições de luz. Diferente de transmissão luminosa e refletância medida.','A iluminação mudou a percepção da clareza?'],
   ['contraste cromático','Relação entre cores','color contrast','色彩对比','sècǎi duìbǐ','Diferença percebida entre áreas cromáticas em uma mesma composição; especifique que aspecto contrasta.','O contraste é de matiz, clareza ou saturação?'],
   ['temperatura cromática percebida','Quente ou frio como impressão','warm / cool color impression','冷暖色调','lěngnuǎn sèdiào','Classificação perceptiva e cultural (laranja/azul, por exemplo); não representa necessariamente temperatura de cor medida em kelvin.','É uma impressão cromática ou especificação de iluminação?']
  ]],
  ['luz','Luz, reflexão e transparência','A superfície e a luz têm propriedades distintas.',[
   ['fosco','Reflexão menos especular','matte','哑光','yǎguāng','A superfície dispersa reflexos; pode ser fisicamente lisa e opaca ou translúcida.','Reflete luz em pontos concentrados ou difusos?'],
   ['acetinado','Brilho intermediário sutil','satin finish','缎面光泽','duànmiàn guāngzé','Acabamento com brilho suave entre fosco e brilhante nas condições de observação.','O reflexo muda com o ângulo de visão?'],
   ['brilhante','Reflexo concentrado','glossy','亮面','liàngmiàn','O material apresenta realces definidos, mas brilho não garante dureza, durabilidade ou qualidade.','A luz ambiente está criando esse efeito?'],
   ['translúcido','Transmite luz sem imagem nítida','translucent','半透明','bàn tòumíng','Permite passagem de luz, com dispersão que dificulta enxergar nitidamente através dele.','Você consegue distinguir um objeto através do material?'],
   ['opaco','Não permite ver através','opaque','不透明','bù tòumíng','É uma característica de transmissão de luz, não um grau de brilho. Algo opaco pode ser fosco ou brilhante.','A superfície deixa passar luz visível ou não?']
  ]],
  ['som','Som e comportamento acústico','Volume, altura tonal, timbre e ritmo são dimensões independentes.',[
   ['intensidade sonora percebida','Som fraco ou forte','perceived loudness','响度','xiǎngdù','Sensação de força do som. Decibéis exigem instrumento, distância e condições; impressão não é nível medido.','A que distância e ambiente o som foi percebido?'],
   ['altura tonal','Som grave ou agudo','pitch','音高','yīngāo','Relaciona-se à frequência fundamental ou percepção tonal; agudo não significa necessariamente alto volume.','O som é grave ou agudo, independentemente de ser forte?'],
   ['timbre','Qualidade reconhecível do som','timbre','音色','yīnsè','Caráter do som que distingue fontes com mesma altura e intensidade, como metálico, abafado ou áspero.','Qual propriedade permite reconhecer a fonte?'],
   ['ritmo','Padrão temporal','rhythm','节奏','jiézòu','Distribuição de eventos sonoros no tempo; não se confunde com volume ou altura tonal.','O som é regular, intermitente ou pulsante?'],
   ['vibração','Oscilação mecânica','vibration','振动','zhèndòng','Movimento oscilatório que pode ou não gerar som audível. Não se infere sua amplitude apenas pelo ruído.','A vibração foi sentida, vista ou medida?']
  ]]
 ],
 challenges:[
  {id:'c1',situation:'A câmera parece pesada, mas você não a pesou.',ask:'Qual formulação preserva a evidência?',options:['A câmera pesa 2 kg.','Durante o manuseio, a câmera pareceu pesada.','A câmera tem alta densidade.'],correct:1,reason:'Atribua a percepção à experiência. Massa e densidade exigem medidas.'},
  {id:'c2',situation:'A superfície é lisa ao toque e não tem reflexos fortes.',ask:'Que duas dimensões você pode combinar?',options:['Lisa e fosca.','Maciça e rígida.','Transparente e muito densa.'],correct:0,reason:'Textura ao toque e brilho visual são eixos distintos e compatíveis.'},
  {id:'c3',situation:'Uma moldura envolve a tela, sem necessariamente tocá-la.',ask:'Qual verbo é mais preciso?',options:['Atravessa.','Ladeia.','Circunda.'],correct:2,reason:'Circundar expressa disposição envolvente; não implica contato.'},
  {id:'c4',situation:'O motor emite um som agudo e relativamente baixo em intensidade.',ask:'Qual descrição evita confundir altura tonal com volume?',options:['O motor é alto porque é agudo.','O som é agudo, mas pouco intenso nesta distância.','O motor tem muitos decibéis.'],correct:1,reason:'Agudo indica altura tonal; volume percebido é outra dimensão.'},
  {id:'c5',situation:'Uma caixa tem 30 cm em uma direção horizontal.',ask:'O que falta para afirmar que isso é comprimento?',options:['Definir a orientação e o eixo da medida.','Determinar a cor da caixa.','Saber se ela é de metal.'],correct:0,reason:'Comprimento e largura são dependentes da referência de orientação.'},
  {id:'c6',situation:'Uma peça tem brilho intenso, mas não conseguimos ver através dela.',ask:'A expressão correta pode ser:',options:['Fosca e transparente.','Opaca e brilhante.','Translúcida e sem brilho.'],correct:1,reason:'Opacidade é transmissão; brilho é reflexão. Podem coexistir.'}
 ]
};