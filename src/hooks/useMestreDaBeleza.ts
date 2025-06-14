
import { useState, useCallback, useEffect } from 'react';
import { useEquipments } from '@/hooks/useEquipments';
import { Equipment } from '@/types/equipment';
import { questionBank, Question } from '@/components/mestre-da-beleza/questionBank';

interface UserProfile {
  perfil?: 'medico' | 'profissional_estetica' | 'cliente_final';
  primeira_interacao: boolean;
  cadastrado: boolean;
  tipo_usuario?: 'cliente_final' | 'clinica_contourline' | 'clinica_externa';
  equipamento_informado: boolean;
  step: 'profile' | 'intention' | 'diagnosis' | 'recommendation' | 'completed';
  responses: Record<string, any>;
  idade_estimada?: number;
  area_problema?: string;
  problema_identificado?: string;
  current_question_index: number;
  session_id: string;
}

interface RecommendationResult {
  equipamento: Equipment;
  confianca: number;
  motivo: string;
  cta: string;
  score_breakdown?: Record<string, number>;
}

const SESSION_KEY = 'mestre_da_beleza_session';

export const useMestreDaBeleza = () => {
  const { equipments, loading: equipmentsLoading } = useEquipments();
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    // Tentar carregar sessão salva
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        console.log('Sessão carregada do localStorage:', parsed);
        return parsed;
      } catch (error) {
        console.warn('Erro ao carregar sessão salva:', error);
      }
    }
    
    const initialProfile = {
      primeira_interacao: true,
      cadastrado: false,
      equipamento_informado: false,
      step: 'profile' as const,
      responses: {},
      current_question_index: 0,
      session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    console.log('Criando nova sessão:', initialProfile);
    return initialProfile;
  });

  // Salvar sessão automaticamente
  useEffect(() => {
    console.log('Salvando sessão:', userProfile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
  }, [userProfile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    console.log('Atualizando perfil:', updates);
    setUserProfile(prev => ({
      ...prev,
      ...updates,
      responses: { ...prev.responses, ...updates.responses }
    }));
  }, []);

  // Função para analisar idade baseada em perguntas nostálgicas
  const estimateAge = useCallback((responses: Record<string, any>): number => {
    if (responses.brasil_tricampeao === 'Sim') return 35; // 1994
    if (responses.brasil_penta === 'Sim') return 25; // 2002
    if (responses.tv_colosso === 'Sim') return 30; // Anos 90
    if (responses.xuxa === 'Sim') return 35; // Anos 80-90
    if (responses.orkut === 'Sim') return 28; // Anos 2000
    return 25; // Padrão jovem
  }, []);

  // Sistema de pontuação para equipamentos
  const calculateEquipmentScore = useCallback((equipment: Equipment, responses: Record<string, any>) => {
    let score = 0;
    const scoreBreakdown: Record<string, number> = {};

    // Análise por área de aplicação
    if (responses.area_problema === 'Rosto' && equipment.area_aplicacao?.includes('Facial')) {
      score += 20;
      scoreBreakdown['area_facial'] = 20;
    }
    if (responses.area_problema === 'Corpo' && equipment.area_aplicacao?.includes('Corporal')) {
      score += 20;
      scoreBreakdown['area_corporal'] = 20;
    }

    // Análise por problemas específicos - Fix para string ou array
    const indicacoes = Array.isArray(equipment.indicacoes) 
      ? equipment.indicacoes.join(' ').toLowerCase()
      : (equipment.indicacoes || '').toLowerCase();
    
    if (responses.flacidez_facial === 'Sim' && indicacoes.includes('flacidez')) {
      score += 25;
      scoreBreakdown['flacidez_facial'] = 25;
    }
    
    if (responses.flacidez_corporal === 'Sim' && indicacoes.includes('flacidez')) {
      score += 25;
      scoreBreakdown['flacidez_corporal'] = 25;
    }
    
    if (responses.gordura_localizada === 'Sim' && indicacoes.includes('gordura')) {
      score += 25;
      scoreBreakdown['gordura_localizada'] = 25;
    }
    
    if (responses.melasma_manchas === 'Sim' && indicacoes.includes('mancha')) {
      score += 25;
      scoreBreakdown['melasma_manchas'] = 25;
    }

    // Análise por faixa etária
    const idade = estimateAge(responses);
    if (idade > 35 && indicacoes.includes('rejuvenescimento')) {
      score += 15;
      scoreBreakdown['idade_madura'] = 15;
    }
    if (idade < 30 && indicacoes.includes('prevenção')) {
      score += 10;
      scoreBreakdown['prevencao_jovem'] = 10;
    }

    // Bonus por tecnologia avançada
    const tecnologia = Array.isArray(equipment.tecnologia) 
      ? equipment.tecnologia.join(' ').toLowerCase()
      : (equipment.tecnologia || '').toLowerCase();
      
    if (tecnologia.includes('laser') || tecnologia.includes('ultrassom')) {
      score += 10;
      scoreBreakdown['tecnologia_avancada'] = 10;
    }

    return { score, scoreBreakdown };
  }, [estimateAge]);

  // Sistema de recomendação baseado em equipamentos reais
  const generateRecommendation = useCallback((profile: UserProfile): RecommendationResult | null => {
    const { responses } = profile;
    
    console.log('Gerando recomendação para:', { profile, equipments: equipments?.length });
    
    // Aguardar carregamento dos equipamentos
    if (equipmentsLoading || !equipments) {
      console.log('Aguardando carregamento dos equipamentos...');
      return null;
    }
    
    // Filtrar equipamentos ativos e habilitados para Akinator
    const availableEquipments = equipments.filter(eq => 
      eq.ativo && eq.akinator_enabled
    );

    console.log('Equipamentos disponíveis:', availableEquipments.length);

    if (availableEquipments.length === 0) {
      console.warn('Nenhum equipamento disponível para recomendação');
      return null;
    }

    // Calcular scores para todos os equipamentos
    const scoredEquipments = availableEquipments.map(equipment => {
      const { score, scoreBreakdown } = calculateEquipmentScore(equipment, responses);
      return {
        equipment,
        score,
        scoreBreakdown
      };
    });

    // Ordenar por score
    scoredEquipments.sort((a, b) => b.score - a.score);
    
    const bestMatch = scoredEquipments[0];
    
    if (bestMatch.score === 0) {
      // Fallback para equipamento genérico
      return {
        equipamento: bestMatch.equipment,
        confianca: 50,
        motivo: 'Baseado no seu perfil e necessidades gerais de estética',
        cta: `Conheça mais sobre o ${bestMatch.equipment.nome}`,
        score_breakdown: bestMatch.scoreBreakdown
      };
    }

    // Calcular confiança baseada no score
    const confianca = Math.min(95, Math.max(60, (bestMatch.score / 100) * 100));
    
    // Gerar motivo personalizado
    const motivos = [];
    if (bestMatch.scoreBreakdown.area_facial) motivos.push('compatível com tratamentos faciais');
    if (bestMatch.scoreBreakdown.area_corporal) motivos.push('indicado para tratamentos corporais');
    if (bestMatch.scoreBreakdown.flacidez_facial) motivos.push('eficaz contra flacidez facial');
    if (bestMatch.scoreBreakdown.flacidez_corporal) motivos.push('excelente para flacidez corporal');
    if (bestMatch.scoreBreakdown.gordura_localizada) motivos.push('ideal para gordura localizada');
    
    const motivo = motivos.length > 0 
      ? `Recomendado porque é ${motivos.join(', ')}`
      : 'Equipamento adequado para suas necessidades estéticas';

    const recommendation = {
      equipamento: bestMatch.equipment,
      confianca: Math.round(confianca),
      motivo,
      cta: `Descubra como o ${bestMatch.equipment.nome} pode transformar seus resultados`,
      score_breakdown: bestMatch.scoreBreakdown
    };

    console.log('Recomendação gerada:', recommendation);
    return recommendation;
  }, [equipments, equipmentsLoading, calculateEquipmentScore]);

  // Obter pergunta atual
  const getCurrentQuestion = useCallback((): Question | null => {
    if (userProfile.current_question_index >= questionBank.length) {
      console.log('Todas as perguntas foram respondidas');
      return null;
    }
    const question = questionBank[userProfile.current_question_index];
    console.log('Pergunta atual:', question);
    return question;
  }, [userProfile.current_question_index]);

  // Processar resposta do usuário
  const processUserResponse = useCallback((response: string, context?: string) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) {
      console.log('Nenhuma pergunta atual disponível');
      return { score: 0, problema: null };
    }

    console.log('Processando resposta:', { response, context, currentQuestion });

    const questionContext = context || currentQuestion.context;
    const newResponses = { ...userProfile.responses, [questionContext]: response };
    
    // Calcular idade estimada se necessário
    const idade_estimada = estimateAge(newResponses);
    
    // Identificar problemas principais
    let problema_identificado = '';
    let area_problema = '';
    
    if (newResponses.flacidez_facial === 'Sim') {
      problema_identificado = 'flacidez_facial';
      area_problema = 'rosto';
    } else if (newResponses.flacidez_corporal === 'Sim') {
      problema_identificado = 'flacidez_corporal';
      area_problema = 'corpo';
    } else if (newResponses.gordura_localizada === 'Sim') {
      problema_identificado = 'gordura_localizada';
      area_problema = 'corpo';
    } else if (newResponses.melasma_manchas === 'Sim') {
      problema_identificado = 'melasma_manchas';
      area_problema = 'rosto';
    }

    // Determinar próximo passo
    let nextStep = userProfile.step;
    let nextQuestionIndex = userProfile.current_question_index + 1;
    
    if (nextQuestionIndex >= questionBank.length) {
      nextStep = 'recommendation';
      console.log('Finalizando questionário, indo para recomendação');
    } else if (userProfile.step === 'profile') {
      nextStep = 'intention';
    } else if (userProfile.step === 'intention') {
      nextStep = 'diagnosis';
    }

    updateProfile({
      responses: newResponses,
      idade_estimada,
      area_problema,
      problema_identificado,
      current_question_index: nextQuestionIndex,
      step: nextStep
    });

    const score = currentQuestion.scoring?.[response] || 0;
    return { score, problema: problema_identificado };
  }, [userProfile, getCurrentQuestion, estimateAge, updateProfile]);

  const getRecommendation = useCallback(() => {
    const recommendation = generateRecommendation(userProfile);
    console.log('Obtendo recomendação:', recommendation);
    return recommendation;
  }, [userProfile, generateRecommendation]);

  const resetChat = useCallback(() => {
    console.log('Resetando chat');
    localStorage.removeItem(SESSION_KEY);
    setUserProfile({
      primeira_interacao: true,
      cadastrado: false,
      equipamento_informado: false,
      step: 'profile',
      responses: {},
      current_question_index: 0,
      session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  }, []);

  const isCompleted = useCallback(() => {
    const completed = userProfile.step === 'recommendation' || userProfile.step === 'completed';
    console.log('isCompleted:', completed, 'step:', userProfile.step);
    return completed;
  }, [userProfile.step]);

  const getProgress = useCallback(() => {
    const progress = Math.round((userProfile.current_question_index / questionBank.length) * 100);
    console.log('Progress:', progress, 'index:', userProfile.current_question_index, 'total:', questionBank.length);
    return progress;
  }, [userProfile.current_question_index]);

  return {
    userProfile,
    updateProfile,
    processUserResponse,
    getRecommendation,
    resetChat,
    getCurrentQuestion,
    isCompleted,
    getProgress,
    equipments: equipments?.filter(eq => eq.ativo) || []
  };
};
