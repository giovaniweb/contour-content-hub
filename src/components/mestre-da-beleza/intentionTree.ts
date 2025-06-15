/**
 * Intention Tree Akinator Style – Versão Ramificada (descoberta)
 */

export type IntentionNode = {
  id: string;
  text: string;
  options: string[];
  type: 'inicio' | 'area' | 'sintoma' | 'profundidade' | 'final' | 'perfil';
  next?: Record<string, string> | string;
  emoji?: string;
  destaque?: boolean;
};

export const INTENTION_TREE: IntentionNode[] = [
  // INÍCIO: Detecção de perfil
  {
    id: 'init',
    type: 'inicio',
    text: 'Com qual das situações abaixo você mais se identifica?',
    emoji: '🔍',
    options: [
      'Quero tratar algo na minha pele ou corpo',
      'Atendo clientes na área da estética',
      'Só curioso(a), não estou buscando nada',
    ],
    next: {
      'Quero tratar algo na minha pele ou corpo': 'area_desejo',
      'Atendo clientes na área da estética': 'perfil_profissional',
      'Só curioso(a), não estou buscando nada': 'final_curioso',
    }
  },

  // CLIENTE FINAL - MAIS ETAPAS
  {
    id: 'area_desejo',
    type: 'area',
    text: 'Qual dessas áreas você deseja melhorar?',
    emoji: '🪞',
    options: ['Rosto', 'Corpo', 'Ambos'],
    next: {
      'Rosto': 'rosto_preocupacao',
      'Corpo': 'corpo_preocupacao',
      'Ambos': 'preferencia_foco',
    }
  },

  {
    id: 'preferencia_foco',
    type: 'area',
    text: 'Você prefere começar pelo rosto ou corpo?',
    emoji: '📍',
    options: ['Rosto', 'Corpo', 'Tanto faz'],
    next: {
      'Rosto': 'rosto_preocupacao',
      'Corpo': 'corpo_preocupacao',
      'Tanto faz': 'preven_orientacao'
    }
  },

  // Novas perguntas ROSto
  {
    id: 'rosto_preocupacao',
    type: 'sintoma',
    text: 'Qual dessas situações mais te incomoda no rosto?',
    emoji: '🧑‍🔬',
    options: [
      'Gordura na papada',
      'Flacidez',
      'Manchas ou melasma',
      'Linhas de expressão'
    ],
    next: {
      'Gordura na papada': 'papada_alternativa',
      'Flacidez': 'rosto_foco_tratamento',
      'Manchas ou melasma': 'rosto_foco_tratamento',
      'Linhas de expressão': 'rosto_foco_tratamento',
    }
  },
  {
    id: 'papada_alternativa',
    type: 'profundidade',
    text: 'Quando pensa em tratar a papada, o que faz mais sentido pra você?',
    emoji: '💡',
    options: [
      'Só lipo resolve',
      'Prefiro algo não invasivo',
      'Já tentei massagem facial',
      'Quero opinião de especialista',
    ],
    next: {
      'Só lipo resolve': 'final_rosto_papada_sonho',
      'Prefiro algo não invasivo': 'final_rosto_papada_naoinvasivo',
      'Já tentei massagem facial': 'final_rosto_massagem',
      'Quero opinião de especialista': 'final_rosto_consulta'
    }
  },

  {
    id: 'rosto_foco_tratamento',
    type: 'profundidade',
    text: 'O que você já tentou até hoje para essa questão?',
    emoji: '🔬',
    options: [
      'Nenhum tratamento ainda',
      'Produtinhos em casa',
      'Fiz algum protocolo na estética',
      'Busco diagnóstico profissional',
    ],
    next: {
      'Nenhum tratamento ainda': 'final_rosto_iniciante',
      'Produtinhos em casa': 'final_rosto_autocuidado',
      'Fiz algum protocolo na estética': 'final_rosto_experiente',
      'Busco diagnóstico profissional': 'final_rosto_consulta',
    }
  },

  // CORPO: perguntas aninhadas, estudo de caso leve
  {
    id: 'corpo_preocupacao',
    type: 'sintoma',
    text: 'No corpo, o que gostaria de melhorar primeiro?',
    emoji: '🏃‍♀️',
    options: ['Gordura localizada', 'Flacidez', 'Dores ou inchaço', 'Outra coisa'],
    next: {
      'Gordura localizada': 'corpo_gordura_caso',
      'Flacidez': 'corpo_flacidez_idade',
      'Dores ou inchaço': 'corpo_inchaco_exemplo',
      'Outra coisa': 'final_corpo_outra'
    }
  },

  {
    id: 'corpo_gordura_caso',
    type: 'profundidade',
    text: 'Já pensou em fazer algum procedimento ou está só pesquisando opções?',
    emoji: '🔎',
    options: [
      'Sonho com lipoescultura',
      'Queria tratar sem cortes',
      'Já tentei dietas e exercícios',
      'Quero ver protocolos com aparelhos',
    ],
    next: {
      'Sonho com lipoescultura': 'final_corpo_lipo_sonho',
      'Queria tratar sem cortes': 'final_corpo_naoinvasivo',
      'Já tentei dietas e exercícios': 'final_corpo_esforco',
      'Quero ver protocolos com aparelhos': 'final_corpo_aparelho'
    }
  },

  {
    id: 'corpo_flacidez_idade',
    type: 'profundidade',
    text: 'Percebe a flacidez após emagrecer, após gravidez ou ela veio com a idade?',
    emoji: '⏳',
    options: [
      'Depois do emagrecimento',
      'Após a gravidez',
      'Veio com a idade',
      'Sempre tive tendencia',
    ],
    next: {
      'Depois do emagrecimento': 'final_corpo_flacidez_emagreceu',
      'Após a gravidez': 'final_corpo_flacidez_gravidez',
      'Veio com a idade': 'final_corpo_flacidez_idade',
      'Sempre tive tendencia': 'final_corpo_flacidez_tendencia'
    }
  },

  {
    id: 'corpo_inchaco_exemplo',
    type: 'profundidade',
    text: 'Você sente mais inchaço nas pernas ou em outra região?',
    emoji: '🦵',
    options: [
      'Pernas inchadas e doloridas',
      'Inchaço no abdômen',
      'Retenção em todo corpo',
      'Quero entender melhor'
    ],
    next: {
      'Pernas inchadas e doloridas': 'final_corpo_lipedema',
      'Inchaço no abdômen': 'final_corpo_abdomen',
      'Retenção em todo corpo': 'final_corpo_retencao',
      'Quero entender melhor': 'final_corpo_aparelho'
    }
  },

  // Caminhos finais para cliente
  {
    id: 'final_rosto_papada_sonho',
    type: 'final',
    destaque: true,
    text: '😏 Sonhar com lipo é natural, mas novas tecnologias permitem tratar papada de forma não invasiva! Que tal conhecer protocolos modernos?',
    options: []
  },
  {
    id: 'final_rosto_papada_naoinvasivo',
    type: 'final',
    destaque: true,
    text: '🟣 Opção não invasiva é tendência! Radiofrequência e ultrassom podem ajudar muito no contorno sem cortes.',
    options: []
  },
  {
    id: 'final_rosto_massagem',
    type: 'final',
    destaque: true,
    text: '😊 Massagem facial traz benefícios, mas os melhores resultados são com tecnologia em clínica combinada!',
    options: []
  },
  {
    id: 'final_rosto_consulta',
    type: 'final',
    destaque: true,
    text: '👩‍⚕️ Agende uma avaliação para ter uma indicação personalizada – cada rosto merece cuidado exclusivo!',
    options: []
  },
  {
    id: 'final_rosto_iniciante',
    type: 'final',
    destaque: true,
    text: '✨ Você está no início da jornada de cuidados! Vamos juntos montar um plano especial para seu caso.',
    options: []
  },
  {
    id: 'final_rosto_autocuidado',
    type: 'final',
    destaque: true,
    text: '💡 O autocuidado é essencial, mas o toque profissional faz a diferença para melhores resultados.',
    options: []
  },
  {
    id: 'final_rosto_experiente',
    type: 'final',
    destaque: true,
    text: '🎯 Já experiente em protocolos! Podemos avançar para tecnologias mais avançadas para seu objetivo.',
    options: []
  },

  // Corpo finais:
  {
    id: 'final_corpo_lipo_sonho',
    type: 'final',
    destaque: true,
    text: '😮‍💨 Sonhar com lipo é comum, mas hoje há opções menos invasivas e super eficazes com nossos aparelhos.',
    options: []
  },
  {
    id: 'final_corpo_naoinvasivo',
    type: 'final',
    destaque: true,
    text: '🟢 Opções não invasivas como radiofrequência ajudam muito a remodelar o corpo sem cortes!',
    options: []
  },
  {
    id: 'final_corpo_esforco',
    type: 'final',
    destaque: true,
    text: '💪 Seu esforço é admirável! Vamos potencializar com protocolos tecnológicos especialmente para seu perfil.',
    options: []
  },
  {
    id: 'final_corpo_aparelho',
    type: 'final',
    destaque: true,
    text: '🔬 Protocolos com aparelhos de última geração podem acelerar seus resultados!',
    options: []
  },
  {
    id: 'final_corpo_flacidez_emagreceu',
    type: 'final',
    destaque: true,
    text: '🟣 Após emagrecer, a flacidez pode incomodar. Radiofrequência e bioestímulo de colágeno são grandes aliados.',
    options: []
  },
  {
    id: 'final_corpo_flacidez_gravidez',
    type: 'final',
    destaque: true,
    text: '👶 Após gravidez, resultados mais delicados exigem protocolos personalizados e seguros.',
    options: []
  },
  {
    id: 'final_corpo_flacidez_idade',
    type: 'final',
    destaque: true,
    text: '⏳ Com o tempo, colágeno diminui – tratamentos específicos podem devolver firmeza à pele.',
    options: []
  },
  {
    id: 'final_corpo_flacidez_tendencia',
    type: 'final',
    destaque: true,
    text: '🧬 Tendência genética precisa de acompanhamento especial. Vamos inovar nos cuidados!',
    options: []
  },
  {
    id: 'final_corpo_lipedema',
    type: 'final',
    destaque: true,
    text: '🦵 Sintomas sugerem um quadro de lipedema leve. Massagem linfática e aparelhos podem aliviar bastante.',
    options: []
  },
  {
    id: 'final_corpo_abdomen',
    type: 'final',
    destaque: true,
    text: '👗 O inchaço abdominal pode indicar retenção: drenagem e radiofrequência são bastante recomendados.',
    options: []
  },
  {
    id: 'final_corpo_retencao',
    type: 'final',
    destaque: true,
    text: '💧 Retenção generalizada precisa de avaliação, mas nossos protocolos auxiliam nessa jornada!',
    options: []
  },
  {
    id: 'final_corpo_outra',
    type: 'final',
    destaque: true,
    text: '👇 Conte para a gente sua preocupação! Quanto mais detalhes, melhor conseguimos ajudar.',
    options: []
  },
  {
    id: 'preven_orientacao',
    type: 'final',
    destaque: true,
    text: '🛡️ Parabéns pelo foco em prevenção! Cuidados contínuos, ativos e tecnologia garantem bons resultados.',
    options: []
  },

  // PROFISSIONAL: camadas extras + Estudo de caso clínico dinâmico
  {
    id: 'perfil_profissional',
    type: 'perfil',
    text: 'Você já atua na estética ou está começando?',
    emoji: '👩‍⚕️',
    options: ['Já atuo', 'Começando agora', 'Quero transição de carreira'],
    next: {
      'Já atuo': 'prof_area_atuacao',
      'Começando agora': 'final_novato',
      'Quero transição de carreira': 'final_transicao'
    }
  },
  {
    id: 'prof_area_atuacao',
    type: 'area',
    text: 'Qual sua maior especialidade?',
    emoji: '💼',
    options: ['Corpo', 'Rosto', 'Ambos'],
    next: {
      'Corpo': 'prof_caso_clinico_corpo',
      'Rosto': 'prof_caso_clinico_rosto',
      'Ambos': 'prof_caso_clinico_duplo'
    }
  },

  // Estudo de caso - CORPO (exemplo lipedema ou sarcopenia)
  {
    id: 'prof_caso_clinico_corpo',
    type: 'sintoma',
    text: 'Estudo de caso: Paciente feminina, 40 anos, pernas inchadas, dores e gordura no quadril. O que você sugeriria?',
    emoji: '🦵',
    options: ['Exercício físico', 'Radiofrequência', 'Massagem linfática', 'Canetas emagrecedoras', 'Combinação'],
    next: {
      'Exercício físico': 'final_prof_resposta_erro',
      'Radiofrequência': 'final_prof_resposta_acerto',
      'Massagem linfática': 'final_prof_resposta_acerto',
      'Canetas emagrecedoras': 'final_prof_resposta_parcial',
      'Combinação': 'final_prof_resposta_ideal'
    }
  },

  {
    id: 'final_prof_resposta_erro',
    type: 'final',
    destaque: true,
    text: '💭 Exercício ajuda, mas para esse quadro, tecnologia em radiofrequência + drenagem acelera o resultado e atua no sintoma!',
    options: []
  },
  {
    id: 'final_prof_resposta_acerto',
    type: 'final',
    destaque: true,
    text: '✅ Ótima escolha! Radiofrequência ou massagem linfática fazem parte dos protocolos mais modernos para o quadro apresentado.',
    options: []
  },
  {
    id: 'final_prof_resposta_parcial',
    type: 'final',
    destaque: true,
    text: '🔍 Canetas são uma alternativa, mas associar radiofrequência ou drenagem aumenta o sucesso do tratamento!',
    options: []
  },
  {
    id: 'final_prof_resposta_ideal',
    type: 'final',
    destaque: true,
    text: '🏅 Combinar técnicas é um diferencial do profissional moderno! Protocolos multimodais costumam gerar os melhores resultados.',
    options: []
  },

  // Estudo de caso: rosto (papada)
  {
    id: 'prof_caso_clinico_rosto',
    type: 'sintoma',
    text: 'Estudo de caso: Paciente com gordura localizada na papada, sem querer passar por cirurgia. Qual protocolo sugere?',
    emoji: '👤',
    options: ['Massagem facial', 'Radiofrequência', 'Ultrassom', 'Combinação'],
    next: {
      'Massagem facial': 'final_prof_rosto_massagem',
      'Radiofrequência': 'final_prof_rosto_ideal',
      'Ultrassom': 'final_prof_rosto_ideal',
      'Combinação': 'final_prof_rosto_ideal'
    }
  },
  {
    id: 'final_prof_rosto_massagem',
    type: 'final',
    destaque: true,
    text: '💪 Massagem facial auxilia, mas para reduzir gordura localizada na papada, tecnologias como ultrassom e radiofrequência são ideais!',
    options: []
  },
  {
    id: 'final_prof_rosto_ideal',
    type: 'final',
    destaque: true,
    text: '🤩 Excelente! Associando radiofrequência e ultrassom tem resultados surpreendentes na definição de contorno facial sem ser invasivo.',
    options: []
  },

  // Estudo de caso: ambos
  {
    id: 'prof_caso_clinico_duplo',
    type: 'sintoma',
    text: 'Situação composta: Dois pacientes, um com sinais de lipedema, outro com flacidez pós-emagrecimento. Como você monta seu protocolo?',
    emoji: '🧑‍💼',
    options: [
      'Drenagem linfática para lipedema, radiofrequência para flacidez',
      'Só drenagem',
      'Só radiofrequência',
      'Canetas/estímulo muscular em ambos',
    ],
    next: {
      'Drenagem linfática para lipedema, radiofrequência para flacidez': 'final_prof_duplo_ideal',
      'Só drenagem': 'final_prof_duplo_parcial',
      'Só radiofrequência': 'final_prof_duplo_parcial',
      'Canetas/estímulo muscular em ambos': 'final_prof_duplo_parcial'
    }
  },
  {
    id: 'final_prof_duplo_ideal',
    type: 'final',
    destaque: true,
    text: '✌️ Perfeito! O melhor tratamento é individualizado por quadro. Ótima conduta!',
    options: []
  },
  {
    id: 'final_prof_duplo_parcial',
    type: 'final',
    destaque: true,
    text: '💡 Lembre: resultados otimizados vêm da associação de técnicas certas para cada quadro.',
    options: []
  },

  // PROFISSIONAL finais demais
  {
    id: 'final_novato',
    type: 'final',
    destaque: true,
    text: '🚀 Novato(a) na estética! Invista em formação continuada para potencializar resultados dos seus clientes.',
    options: []
  },
  {
    id: 'final_transicao',
    type: 'final',
    destaque: true,
    text: '🔄 Pronto(a) para transição! Conte com mentoria e protocolos modernos de equipamentos!',
    options: []
  },

  // Curioso/Prevenção
  {
    id: 'final_curioso',
    type: 'final',
    destaque: true,
    text: '🙃 Curiosidade nunca é demais! Volte quando quiser descobrir mais sobre beleza avançada 😉',
    options: []
  }
];
