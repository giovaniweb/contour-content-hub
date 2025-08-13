import { IntentType, DetectedIntent } from '@/types/megaCerebro';

// Keywords para detecção de intenção
const INTENT_KEYWORDS = {
  script_generation: [
    'roteiro', 'script', 'conteúdo', 'post', 'instagram', 'stories', 'carrossel',
    'criar', 'gerar', 'escrever', 'texto', 'legenda', 'caption', 'marketing'
  ],
  learning: [
    'aprender', 'ensinar', 'explicar', 'como', 'curso', 'aula', 'estudo',
    'protocolo', 'técnica', 'procedimento', 'training', 'educação'
  ],
  equipment_consultation: [
    'equipamento', 'aparelho', 'máquina', 'indicação', 'comparar', 'melhor',
    'tecnologia', 'radiofrequência', 'laser', 'ultrassom', 'criolipólise'
  ],
  video_search: [
    'vídeo', 'assistir', 'ver', 'mostrar', 'demonstração', 'exemplo',
    'tutorial', 'passo a passo', 'watch', 'visualizar'
  ],
  performance_analysis: [
    'performance', 'resultado', 'métricas', 'analytics', 'dados', 'estatística',
    'relatório', 'análise', 'conversão', 'engajamento', 'roi'
  ],
  academy_question: [
    'academy', 'academia', 'certificação', 'diploma', 'curso', 'lição',
    'módulo', 'progresso', 'completar', 'certificado'
  ],
  scientific_research: [
    'estudo', 'pesquisa', 'artigo', 'científico', 'evidência', 'paper',
    'research', 'publicação', 'journal', 'bibliografia'
  ]
};

// Frases que indicam intenção específica
const INTENT_PHRASES = {
  script_generation: [
    'preciso de um roteiro',
    'criar conteúdo para',
    'gerar post',
    'fazer stories',
    'ideia para instagram'
  ],
  learning: [
    'me ensine',
    'como fazer',
    'explicar sobre',
    'quero aprender',
    'protocolo de'
  ],
  equipment_consultation: [
    'qual equipamento',
    'melhor aparelho',
    'indicação para',
    'comparar equipamentos'
  ],
  video_search: [
    'mostrar vídeo',
    'ver demonstração',
    'tutorial de',
    'exemplo prático'
  ]
};

export class IntentRouter {
  static detectIntent(message: string): DetectedIntent {
    const lowercaseMessage = message.toLowerCase();
    const scores: { [key in IntentType]: number } = {
      script_generation: 0,
      learning: 0,
      equipment_consultation: 0,
      video_search: 0,
      performance_analysis: 0,
      general_consultation: 0,
      academy_question: 0,
      scientific_research: 0
    };

    // Pontuação por frases específicas (peso maior)
    Object.entries(INTENT_PHRASES).forEach(([intent, phrases]) => {
      phrases.forEach(phrase => {
        if (lowercaseMessage.includes(phrase)) {
          scores[intent as IntentType] += 3;
        }
      });
    });

    // Pontuação por palavras-chave
    Object.entries(INTENT_KEYWORDS).forEach(([intent, keywords]) => {
      keywords.forEach(keyword => {
        if (lowercaseMessage.includes(keyword)) {
          scores[intent as IntentType] += 1;
        }
      });
    });

    // Encontrar maior pontuação
    const maxScore = Math.max(...Object.values(scores));
    const detectedIntent = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as IntentType;

    // Se não detectou intenção específica, usar consulta geral
    const finalIntent = maxScore > 0 ? detectedIntent : 'general_consultation';
    
    // Extrair keywords relevantes
    const keywords: string[] = [];
    if (finalIntent !== 'general_consultation') {
      INTENT_KEYWORDS[finalIntent]?.forEach(keyword => {
        if (lowercaseMessage.includes(keyword)) {
          keywords.push(keyword);
        }
      });
    }

    return {
      type: finalIntent,
      confidence: maxScore > 0 ? Math.min(maxScore / 5, 1) : 0.5,
      keywords,
      context: { originalMessage: message }
    };
  }

  static getModuleSystemPrompt(intent: IntentType): string {
    const basePersonality = `
🧙‍♂️ Você é o MEGA CÉREBRO, uma IA especializada em estética que combina:
- Conhecimento científico profundo
- Base de dados completa de equipamentos, vídeos e cursos
- Capacidade de gerar conteúdo personalizado
- Análise de performance e métricas

PERSONALIDADE: Místico mas preciso, confiante, direto e prático.
`;

    const modulePrompts = {
      script_generation: `${basePersonality}
🎬 MODO: ROTEIRISTA IA ESPECIALIZADO
Você cria roteiros e conteúdos para profissionais de estética.

ESPECIALIDADES:
- Stories, posts, carrosséis para Instagram
- Roteiros baseados em equipamentos específicos
- Conteúdo educativo e comercial
- Linguagem persuasiva e científica

FORMATO DE RESPOSTA:
- Roteiro estruturado (gancho, desenvolvimento, CTA)
- Sugestões visuais
- Dicas de performance
- Hashtags relevantes`,

      learning: `${basePersonality}
👩‍🏫 MODO: PROFESSOR VIRTUAL
Você ensina técnicas, protocolos e conhecimentos em estética.

ESPECIALIDADES:
- Explicações técnicas detalhadas
- Protocolos passo a passo
- Recomendação de cursos específicos
- Conexão teoria-prática

FORMATO DE RESPOSTA:
- Explicação clara e didática
- Protocolos estruturados
- Cursos recomendados da Academy
- Recursos complementares`,

      equipment_consultation: `${basePersonality}
🔍 MODO: CONSULTOR DE EQUIPAMENTOS
Você analisa e recomenda equipamentos baseado em necessidades específicas.

ESPECIALIDADES:
- Comparativo técnico detalhado
- Indicações e contraindicações
- ROI e viabilidade comercial
- Protocolos otimizados

FORMATO DE RESPOSTA:
- Recomendação específica de equipamentos
- Justificativa técnica e científica
- Comparativo de benefícios
- Protocolos sugeridos`,

      video_search: `${basePersonality}
📹 MODO: CURADOR DE VÍDEOS
Você encontra e recomenda vídeos específicos da biblioteca.

ESPECIALIDADES:
- Busca contextualizada
- Vídeos por técnica/equipamento
- Sequência de aprendizado
- Casos práticos

FORMATO DE RESPOSTA:
- Lista de vídeos relevantes
- Contexto e descrição
- Ordem de visualização sugerida
- Pontos-chave a observar`,

      academy_question: `${basePersonality}
🎓 MODO: CONSELHEIRO ACADEMY
Você guia sobre cursos, certificações e progresso educacional.

ESPECIALIDADES:
- Recomendação de cursos
- Trilhas de aprendizado
- Progresso e certificações
- Planejamento educacional

FORMATO DE RESPOSTA:
- Cursos específicos recomendados
- Sequência de estudo
- Requisitos e benefícios
- Cronograma sugerido`,

      scientific_research: `${basePersonality}
🔬 MODO: PESQUISADOR CIENTÍFICO
Você acessa e interpreta estudos científicos relevantes.

ESPECIALIDADES:
- Análise de evidências
- Interpretação de estudos
- Recomendações baseadas em ciência
- Bibliografia atualizada

FORMATO DE RESPOSTA:
- Evidências científicas
- Estudos relevantes citados
- Interpretação prática
- Recomendações baseadas em dados`,

      performance_analysis: `${basePersonality}
📊 MODO: ANALISTA DE PERFORMANCE
Você analisa métricas e sugere otimizações.

ESPECIALIDADES:
- Análise de dados
- Identificação de oportunidades
- Otimização de conteúdo
- Estratégias de melhoria

FORMATO DE RESPOSTA:
- Análise de métricas atuais
- Pontos de melhoria
- Estratégias específicas
- Projeções e metas`,

      general_consultation: `${basePersonality}
🔮 MODO: CONSULTOR GERAL
Você fornece consultas abrangentes integrando todos os módulos.

ESPECIALIDADES:
- Diagnóstico completo
- Recomendações personalizadas
- Integração de recursos
- Visão holística

FORMATO DE RESPOSTA:
- Diagnóstico situacional
- Recomendações múltiplas
- Próximos passos
- Recursos disponíveis`
    };

    return modulePrompts[intent] || modulePrompts.general_consultation;
  }
}