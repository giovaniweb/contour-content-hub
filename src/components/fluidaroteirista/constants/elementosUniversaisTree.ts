
// Árvore de navegação para o fluxo dos 10 elementos universais

export const ELEMENTOS_UNIVERSAIS_TREE = {
  storytelling: {
    id: 'storytelling',
    titulo: '📖 Storytelling',
    subtitulo: 'Que história sua marca vai contar hoje?',
    descricao: 'Escolha o tipo de narrativa que melhor conecta com sua audiência',
    elemento: 'storytelling',
    options: [
      {
        value: 'jornada_transformadora',
        label: '✨ Jornada Transformadora',
        emoji: '✨',
        description: 'A viagem da cliente até sua melhor versão',
        exemplo: '"De insegura a radiante em 30 dias"',
        leads_to: 'conhecimento_publico'
      },
      {
        value: 'antes_depois',
        label: '🔄 Antes/Depois Inspirador',
        emoji: '🔄',
        description: 'Mostra resultados reais e impactantes',
        exemplo: '"Veja como Maria transformou sua pele"',
        leads_to: 'conhecimento_publico'
      },
      {
        value: 'caso_real',
        label: '👥 Caso Real Emocionante',
        emoji: '👥',
        description: 'História verdadeira de uma cliente',
        exemplo: '"A história de Ana que mudou minha vida"',
        leads_to: 'conhecimento_publico'
      },
      {
        value: 'segredo_revelado',
        label: '🔓 Segredo Revelado',
        emoji: '🔓',
        description: 'Conhecimento exclusivo compartilhado',
        exemplo: '"O segredo que dermatologistas não contam"',
        leads_to: 'conhecimento_publico'
      }
    ]
  },
  conhecimento_publico: {
    id: 'conhecimento_publico',
    titulo: '👥 Conhecimento do Público',
    subtitulo: 'Quem é sua pessoa especial que precisa dessa transformação?',
    descricao: 'Vamos entender profundamente seu público-alvo',
    elemento: 'conhecimento_publico',
    options: [
      {
        value: 'mulher_insegura',
        label: '🙋‍♀️ Mulher 30-45 Insegura',
        emoji: '🙋‍♀️',
        description: 'Busca autoestima e confiança',
        exemplo: 'Preocupada com sinais de idade',
        leads_to: 'headlines'
      },
      {
        value: 'noiva_ansiosa',
        label: '👰 Noiva Ansiosa',
        emoji: '👰',
        description: 'Quer estar perfeita no grande dia',
        exemplo: 'Casamento em 3 meses, precisa de resultados',
        leads_to: 'headlines'
      },
      {
        value: 'executiva_estressada',
        label: '💼 Executiva Estressada',
        emoji: '💼',
        description: 'Pouco tempo, quer eficiência',
        exemplo: 'Resultados rápidos sem cirurgia',
        leads_to: 'headlines'
      },
      {
        value: 'mae_cuidadora',
        label: '👩‍👧‍👦 Mãe que Quer se Cuidar',
        emoji: '👩‍👧‍👦',
        description: 'Sempre cuidou dos outros, agora é sua vez',
        exemplo: 'Redescobrir sua feminilidade',
        leads_to: 'headlines'
      }
    ]
  },
  headlines: {
    id: 'headlines',
    titulo: '🎯 Headlines Magnéticos',
    subtitulo: 'Que tipo de título vai parar o scroll?',
    descricao: 'Escolha o estilo de headline que mais gera curiosidade',
    elemento: 'headlines',
    options: [
      {
        value: 'pergunta_provocativa',
        label: '❓ Pergunta Provocativa',
        emoji: '❓',
        description: 'Questiona crenças ou desperta reflexão',
        exemplo: '"Por que sua pele não melhora?"',
        leads_to: 'gatilhos_mentais'
      },
      {
        value: 'promessa_especifica',
        label: '🎯 Promessa Específica',
        emoji: '🎯',
        description: 'Resultado claro e mensurável',
        exemplo: '"Rugas 50% menores em 21 dias"',
        leads_to: 'gatilhos_mentais'
      },
      {
        value: 'curiosidade_intrigante',
        label: '🔮 Curiosidade Intrigante',
        emoji: '🔮',
        description: 'Desperta o desejo de saber mais',
        exemplo: '"O truque que dermatologistas odeiam"',
        leads_to: 'gatilhos_mentais'
      },
      {
        value: 'urgencia_motivadora',
        label: '⏰ Urgência Motivadora',
        emoji: '⏰',
        description: 'Cria necessidade de ação imediata',
        exemplo: '"Últimos dias para garantir"',
        leads_to: 'gatilhos_mentais'
      }
    ]
  },
  gatilhos_mentais: {
    id: 'gatilhos_mentais',
    titulo: '⚡ Gatilhos Mentais',
    subtitulo: 'Qual gatilho vai despertar o desejo?',
    descricao: 'Escolha o gatilho psicológico mais eficaz para sua oferta',
    elemento: 'gatilhos_mentais',
    options: [
      {
        value: 'escassez',
        label: '🔥 Escassez',
        emoji: '🔥',
        description: 'Quantidade limitada disponível',
        exemplo: '"Últimas 3 vagas da semana"',
        leads_to: 'logica_argumentativa'
      },
      {
        value: 'prova_social',
        label: '👥 Prova Social',
        emoji: '👥',
        description: 'Outras pessoas já aprovaram',
        exemplo: '"Mais de 500 clientes satisfeitas"',
        leads_to: 'logica_argumentativa'
      },
      {
        value: 'autoridade',
        label: '👨‍⚕️ Autoridade',
        emoji: '👨‍⚕️',
        description: 'Aprovação de especialistas',
        exemplo: '"Aprovado por dermatologistas"',
        leads_to: 'logica_argumentativa'
      },
      {
        value: 'reciprocidade',
        label: '🎁 Reciprocidade',
        emoji: '🎁',
        description: 'Oferecer algo valioso primeiro',
        exemplo: '"Avaliação gratuita incluída"',
        leads_to: 'logica_argumentativa'
      }
    ]
  },
  logica_argumentativa: {
    id: 'logica_argumentativa',
    titulo: '🧠 Lógica Argumentativa',
    subtitulo: 'Como você vai convencer logicamente?',
    descricao: 'Estruture seus argumentos de forma convincente',
    elemento: 'logica_argumentativa',
    options: [
      {
        value: 'problema_solucao',
        label: '🔧 Problema → Solução',
        emoji: '🔧',
        description: 'Identifica dor e apresenta cura',
        exemplo: '"Flacidez incomoda? HIFU resolve"',
        leads_to: 'premissas_educativas'
      },
      {
        value: 'causa_efeito',
        label: '🎯 Causa → Efeito',
        emoji: '🎯',
        description: 'Explica o porquê dos resultados',
        exemplo: '"Colágeno estimulado = pele firme"',
        leads_to: 'premissas_educativas'
      },
      {
        value: 'dados_cientificos',
        label: '📊 Dados Científicos',
        emoji: '📊',
        description: 'Estudos e evidências comprovadas',
        exemplo: '"95% eficácia comprovada em estudos"',
        leads_to: 'premissas_educativas'
      },
      {
        value: 'comparacao_antes_depois',
        label: '⚖️ Comparação Antes/Depois',
        emoji: '⚖️',
        description: 'Mostra transformação visual',
        exemplo: '"Veja a diferença em 30 dias"',
        leads_to: 'premissas_educativas'
      }
    ]
  },
  premissas_educativas: {
    id: 'premissas_educativas',
    titulo: '🎓 Premissas Educativas',
    subtitulo: 'Que conhecimento você vai compartilhar primeiro?',
    descricao: 'Eduque antes de vender para criar confiança',
    elemento: 'premissas_educativas',
    options: [
      {
        value: 'educar_problema',
        label: '🔍 Educar sobre o Problema',
        emoji: '🔍',
        description: 'Ajuda a entender a causa raiz',
        exemplo: '"Por que a flacidez aparece aos 30?"',
        leads_to: 'mapas_empatia'
      },
      {
        value: 'desmistificar_mitos',
        label: '💭 Desmistificar Mitos',
        emoji: '💭',
        description: 'Quebra crenças limitantes',
        exemplo: '"Mito: só cirurgia resolve flacidez"',
        leads_to: 'mapas_empatia'
      },
      {
        value: 'explicar_tecnologia',
        label: '⚗️ Explicar Tecnologia',
        emoji: '⚗️',
        description: 'Como o tratamento funciona',
        exemplo: '"HIFU: ultrassom que rejuvenesce"',
        leads_to: 'mapas_empatia'
      },
      {
        value: 'mostrar_processo',
        label: '📋 Mostrar Processo',
        emoji: '📋',
        description: 'Passo a passo do atendimento',
        exemplo: '"Como é uma sessão na prática"',
        leads_to: 'mapas_empatia'
      }
    ]
  },
  mapas_empatia: {
    id: 'mapas_empatia',
    titulo: '❤️ Mapas de Empatia',
    subtitulo: 'Qual é a dor mais profunda da sua cliente?',
    descricao: 'Conecte-se emocionalmente com sua audiência',
    elemento: 'mapas_empatia',
    options: [
      {
        value: 'baixa_autoestima',
        label: '😔 Baixa Autoestima',
        emoji: '😔',
        description: 'Não se sente bonita o suficiente',
        exemplo: '"Se esconde nas fotos"',
        leads_to: 'copywriting'
      },
      {
        value: 'medo_julgamento',
        label: '😨 Medo do Julgamento',
        emoji: '😨',
        description: 'Preocupa-se com opinião alheia',
        exemplo: '"O que vão pensar de mim?"',
        leads_to: 'copywriting'
      },
      {
        value: 'frustracao_resultados',
        label: '😤 Frustração com Resultados',
        emoji: '😤',
        description: 'Já tentou tudo sem sucesso',
        exemplo: '"Gastei tanto e nada funcionou"',
        leads_to: 'copywriting'
      },
      {
        value: 'falta_tempo',
        label: '⏰ Falta de Tempo',
        emoji: '⏰',
        description: 'Vida corrida, quer praticidade',
        exemplo: '"Não tenho tempo para me cuidar"',
        leads_to: 'copywriting'
      }
    ]
  },
  copywriting: {
    id: 'copywriting',
    titulo: '✍️ Copywriting Persuasivo',
    subtitulo: 'Que tom vai conectar com ela?',
    descricao: 'Escolha a linguagem que mais ressoa com seu público',
    elemento: 'copywriting',
    options: [
      {
        value: 'consultivo_acolhedor',
        label: '🤗 Consultivo e Acolhedor',
        emoji: '🤗',
        description: 'Tom de conselheira e amiga',
        exemplo: '"Entendo sua preocupação..."',
        leads_to: 'ferramentas_especificas'
      },
      {
        value: 'desafiador_motivador',
        label: '💪 Desafiador e Motivador',
        emoji: '💪',
        description: 'Desperta coragem e ação',
        exemplo: '"Chegou a hora de se priorizar!"',
        leads_to: 'ferramentas_especificas'
      },
      {
        value: 'cientifico_confiavel',
        label: '🔬 Científico e Confiável',
        emoji: '🔬',
        description: 'Baseado em evidências',
        exemplo: '"Estudos comprovam eficácia..."',
        leads_to: 'ferramentas_especificas'
      },
      {
        value: 'amigavel_proximo',
        label: '😊 Amigável e Próximo',
        emoji: '😊',
        description: 'Conversa de igual para igual',
        exemplo: '"Menina, preciso te contar..."',
        leads_to: 'ferramentas_especificas'
      }
    ]
  },
  ferramentas_especificas: {
    id: 'ferramentas_especificas',
    titulo: '🔧 Ferramentas Específicas',
    subtitulo: 'Como ela vai dar o próximo passo?',
    descricao: 'Defina a ação específica que deseja da audiência',
    elemento: 'ferramentas_especificas',
    options: [
      {
        value: 'whatsapp_direto',
        label: '📱 WhatsApp Direto',
        emoji: '📱',
        description: 'Conversa pessoal e imediata',
        exemplo: '"Chama no WhatsApp agora!"',
        leads_to: 'analises_dados'
      },
      {
        value: 'agendamento_online',
        label: '📅 Agendamento Online',
        emoji: '📅',
        description: 'Sistema automatizado de agenda',
        exemplo: '"Agenda sua avaliação aqui"',
        leads_to: 'analises_dados'
      },
      {
        value: 'landing_page',
        label: '🌐 Landing Page',
        emoji: '🌐',
        description: 'Página dedicada com mais info',
        exemplo: '"Saiba tudo no link da bio"',
        leads_to: 'analises_dados'
      },
      {
        value: 'dm_instagram',
        label: '💌 DM no Instagram',
        emoji: '💌',
        description: 'Mensagem privada na rede social',
        exemplo: '"Manda DM com a palavra TRANSFORM"',
        leads_to: 'analises_dados'
      }
    ]
  },
  analises_dados: {
    id: 'analises_dados',
    titulo: '📊 Análises e Dados',
    subtitulo: 'Que resultado você quer medir?',
    descricao: 'Defina a métrica principal do seu conteúdo',
    elemento: 'analises_dados',
    options: [
      {
        value: 'mais_agendamentos',
        label: '📅 Mais Agendamentos',
        emoji: '📅',
        description: 'Foco em conversão direta',
        exemplo: 'Medir agendamentos por dia',
        leads_to: 'tema'
      },
      {
        value: 'maior_engajamento',
        label: '❤️ Maior Engajamento',
        emoji: '❤️',
        description: 'Curtidas, comentários e shares',
        exemplo: 'Aumentar interação 30%',
        leads_to: 'tema'
      },
      {
        value: 'aumento_seguidores',
        label: '👥 Aumento de Seguidores',
        emoji: '👥',
        description: 'Crescimento da base',
        exemplo: 'Ganhar 100 seguidores/semana',
        leads_to: 'tema'
      },
      {
        value: 'conversao_vendas',
        label: '💰 Conversão em Vendas',
        emoji: '💰',
        description: 'ROI e faturamento',
        exemplo: 'Aumentar vendas em 40%',
        leads_to: 'tema'
      }
    ]
  },
  tema: {
    id: 'tema',
    question: '📝 Agora conte sua história...',
    subtitulo: 'Baseado em tudo que você escolheu, descreva o tema do seu roteiro',
    descricao: 'Seja específico sobre o que quer comunicar',
    isTextInput: true,
    mentorPhrase: 'Com todos os elementos escolhidos, vou criar algo incrível para você! ✨'
  }
};

export const ELEMENTOS_CONFIG = [
  { key: 'storytelling', label: 'Storytelling', icon: '📖', cor: 'purple' },
  { key: 'conhecimento_publico', label: 'Conhecimento do Público', icon: '👥', cor: 'green' },
  { key: 'headlines', label: 'Headlines', icon: '🎯', cor: 'blue' },
  { key: 'gatilhos_mentais', label: 'Gatilhos Mentais', icon: '⚡', cor: 'yellow' },
  { key: 'logica_argumentativa', label: 'Lógica Argumentativa', icon: '🧠', cor: 'red' },
  { key: 'premissas_educativas', label: 'Premissas Educativas', icon: '🎓', cor: 'indigo' },
  { key: 'mapas_empatia', label: 'Mapas de Empatia', icon: '❤️', cor: 'pink' },
  { key: 'copywriting', label: 'Copywriting', icon: '✍️', cor: 'cyan' },
  { key: 'ferramentas_especificas', label: 'Ferramentas Específicas', icon: '🔧', cor: 'gray' },
  { key: 'analises_dados', label: 'Análises e Dados', icon: '📊', cor: 'orange' }
];
