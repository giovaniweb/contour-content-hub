
export interface ScriptTemplate {
  id: string;
  tema: string;
  keywords: string[];
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
}

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    id: 'harmonizacao_facial',
    tema: 'harmonização facial',
    keywords: ['harmonização', 'facial', 'ácido hialurônico', 'botox', 'preenchimento'],
    roteiro: `🌟 Você já imaginou como seria ter o rosto dos seus sonhos?

A harmonização facial pode ser a chave para realçar sua beleza natural!

✨ Com procedimentos como:
• Preenchimento labial
• Aplicação de botox
• Contorno facial com ácido hialurônico

O resultado? Um rosto mais equilibrado e uma autoestima renovada!

👩‍⚕️ Agende sua avaliação e descubra como pequenos ajustes podem fazer uma grande diferença.

📲 Entre em contato e transforme sua beleza!`,
    formato: 'carrossel',
    emocao_central: 'confiança',
    intencao: 'atrair',
    objetivo: 'Atrair novos clientes para harmonização facial',
    mentor: 'Paulo Cuenca'
  },
  {
    id: 'skincare_rejuvenescimento',
    tema: 'skincare rejuvenescimento',
    keywords: ['skincare', 'rejuvenescimento', 'pele', 'laser', 'peeling'],
    roteiro: `⏰ O tempo passa, mas sua pele não precisa mostrar isso!

Que tal descobrir os segredos de um skincare profissional?

🔬 Nossos tratamentos incluem:
• Laser de rejuvenescimento
• Peelings químicos personalizados
• Protocolos anti-idade

💡 Resultado: pele renovada, uniforme e com aspecto jovem!

🎯 Não deixe para amanhã o cuidado que sua pele merece hoje.

📅 Marque sua consulta e comece sua jornada de transformação!`,
    formato: 'carrossel',
    emocao_central: 'esperança',
    intencao: 'educar',
    objetivo: 'Educar sobre cuidados com a pele',
    mentor: 'Camila Porto'
  },
  {
    id: 'emagrecimento_corporal',
    tema: 'emagrecimento corporal',
    keywords: ['emagrecimento', 'corporal', 'criolipólise', 'gordura localizada'],
    roteiro: `🔥 Aquela gordurinha teimosa que não sai nem com dieta?

A ciência tem a solução para você!

⚡ Tratamentos corporais avançados:
• Criolipólise - congela a gordura
• Radiofrequência - firma a pele
• Drenagem linfática - elimina toxinas

📊 Estudos comprovam: até 25% de redução de gordura localizada!

💪 Seu corpo dos sonhos está mais perto do que imagina.

🚀 Comece hoje sua transformação corporal!`,
    formato: 'carrossel',
    emocao_central: 'determinação',
    intencao: 'vender',
    objetivo: 'Promover tratamentos corporais',
    mentor: 'Leandro Ladeira'
  },
  {
    id: 'acne_tratamento',
    tema: 'acne tratamento',
    keywords: ['acne', 'espinhas', 'oleosidade', 'pele'],
    roteiro: `😰 Cansado de lutar contra as espinhas?

Você não está sozinho nessa batalha!

🎯 Protocolo anti-acne personalizado:
• Limpeza profunda profissional
• Laser específico para acne
• Home care orientado

✨ Em 30 dias: pele mais limpa e autoestima renovada!

💚 Cada pele é única, cada tratamento também deve ser.

📞 Fale conosco e diga adeus às espinhas!`,
    formato: 'stories',
    emocao_central: 'alívio',
    intencao: 'conectar',
    objetivo: 'Conectar com pessoas com acne',
    mentor: 'Ícaro de Carvalho'
  },
  {
    id: 'laser_depilacao',
    tema: 'depilação a laser',
    keywords: ['depilação', 'laser', 'pelos', 'definitiva'],
    roteiro: `⚡ Imagina nunca mais se preocupar com pelos indesejados?

A depilação a laser chegou para revolucionar sua rotina!

🎯 Vantagens que vão mudar sua vida:
• Redução de até 95% dos pelos
• Pele sempre lisinha
• Economia de tempo e dinheiro

💡 Tecnologia de ponta + profissionais especializados = resultado garantido!

🌟 Liberdade total para curtir sua pele sem limitações.

📲 Agende e comece sua libertação dos pelos hoje mesmo!`,
    formato: 'carrossel',
    emocao_central: 'liberdade',
    intencao: 'vender',
    objetivo: 'Promover depilação a laser',
    mentor: 'Washington Olivetto'
  }
];

export const findBestTemplate = (tema: string, equipamentos?: string[]): ScriptTemplate => {
  const temaLower = tema.toLowerCase();
  const equipamentosLower = equipamentos?.map(eq => eq.toLowerCase()) || [];
  
  // Buscar template por palavras-chave
  const template = SCRIPT_TEMPLATES.find(template => {
    return template.keywords.some(keyword => 
      temaLower.includes(keyword) || 
      equipamentosLower.some(eq => eq.includes(keyword))
    );
  });
  
  // Template genérico se não encontrar específico
  if (!template) {
    return {
      id: 'generico',
      tema: tema,
      keywords: [],
      roteiro: `✨ ${tema} - Transforme sua beleza!

Descubra como nossos tratamentos podem realçar sua beleza natural.

🎯 Benefícios:
• Resultados comprovados
• Tecnologia avançada
• Acompanhamento personalizado

💡 Cada pessoa é única, cada tratamento também deve ser.

🌟 Sua jornada de transformação começa aqui!

📲 Entre em contato e agende sua avaliação!`,
      formato: 'carrossel',
      emocao_central: 'confiança',
      intencao: 'atrair',
      objetivo: `Promover ${tema}`,
      mentor: 'Criativo'
    };
  }
  
  return template;
};

export const personalizeTemplate = (template: ScriptTemplate, tema: string, equipamentos?: string[]): ScriptTemplate => {
  // Personalizar template com dados específicos
  let roteirPersonalizado = template.roteiro;
  
  // Substituir placeholders se necessário
  if (equipamentos && equipamentos.length > 0) {
    const equipamentosText = equipamentos.slice(0, 2).join(' e ');
    roteirPersonalizado = roteirPersonalizado.replace(
      /nossos tratamentos/g, 
      `nossos tratamentos com ${equipamentosText}`
    );
  }
  
  return {
    ...template,
    tema: tema,
    roteiro: roteirPersonalizado,
    objetivo: `${template.objetivo} - ${tema}`
  };
};
