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
  const { equipments, loading: equipmentsLoading, error: equipmentsError } = useEquipments();
  
  // VALIDAÇÃO do perfil ao carregar session storage
  const ensureValidUserProfile = (profile: any): UserProfile => {
    // verifica se campos obrigatórios existem, se não recria
    if (
      typeof profile !== 'object' ||
      typeof profile.session_id !== 'string' ||
      typeof profile.current_question_index !== 'number'
    ) {
      console.warn('❗ [MestreDaBeleza] Sessão inválida detectada, criando nova.');
      return {
        primeira_interacao: true,
        cadastrado: false,
        equipamento_informado: false,
        step: 'profile',
        responses: {},
        current_question_index: 0,
        session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    }
    // Atualiza campos novos (para retrocompatibilidade)
    return {
      primeira_interacao: profile.primeira_interacao ?? true,
      cadastrado: profile.cadastrado ?? false,
      equipamento_informado: profile.equipamento_informado ?? false,
      step: profile.step ?? 'profile',
      responses: profile.responses ?? {},
      current_question_index: profile.current_question_index ?? 0,
      session_id: profile.session_id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tipo_usuario: profile.tipo_usuario,
      idade_estimada: profile.idade_estimada,
      area_problema: profile.area_problema,
      problema_identificado: profile.problema_identificado,
      perfil: profile.perfil,
    };
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        const validProfile = ensureValidUserProfile(parsed);
        console.log('📱 [MestreDaBeleza] Sessão carregada:', validProfile);
        return validProfile;
      }
    } catch (error) {
      console.warn('⚠️ [MestreDaBeleza] Erro ao carregar sessão salva:', error);
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
    console.log('🆕 [MestreDaBeleza] Nova sessão criada:', initialProfile);
    return initialProfile;
  });

  // Salvar sessão automaticamente
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
      console.log('💾 [MestreDaBeleza] Sessão salva:', userProfile.session_id);
    } catch (error) {
      console.warn('⚠️ [MestreDaBeleza] Erro ao salvar sessão:', error);
    }
  }, [userProfile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    console.log('🔄 [MestreDaBeleza] Atualizando perfil:', updates);
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

  // Função para verificar se um equipamento é válido
  const isValidEquipment = useCallback((equipment: any): equipment is Equipment => {
    if (!equipment) {
      console.warn('⚠️ [MestreDaBeleza] Equipment é null/undefined');
      return false;
    }

    if (typeof equipment !== 'object') {
      console.warn('⚠️ [MestreDaBeleza] Equipment não é um objeto:', typeof equipment);
      return false;
    }

    if (!equipment.hasOwnProperty('id') || !equipment.hasOwnProperty('nome')) {
      console.warn('⚠️ [MestreDaBeleza] Equipment sem propriedades básicas:', Object.keys(equipment || {}));
      return false;
    }

    if (!equipment.id || !equipment.nome) {
      console.warn('⚠️ [MestreDaBeleza] Equipment com propriedades vazias:', { id: equipment.id, nome: equipment.nome });
      return false;
    }

    return true;
  }, []);

  // Sistema de pontuação para equipamentos
  const calculateEquipmentScore = useCallback((equipment: Equipment, responses: Record<string, any>) => {
    console.log('🔍 [MestreDaBeleza] Iniciando cálculo de score para:', equipment?.nome || 'equipment sem nome');

    // Verificação robusta de segurança
    if (!isValidEquipment(equipment)) {
      console.error('❌ [MestreDaBeleza] Equipment inválido no cálculo de score');
      return { score: 0, scoreBreakdown: {} };
    }

    let score = 0;
    const scoreBreakdown: Record<string, number> = {};

    try {
      console.log('🎯 [MestreDaBeleza] Calculando score para:', equipment.nome);

      // Análise por área de aplicação
      const areaAplicacao = Array.isArray(equipment.area_aplicacao) ? equipment.area_aplicacao : [];
      
      if (responses.area_problema === 'Rosto' && areaAplicacao.includes('Facial')) {
        score += 20;
        scoreBreakdown['area_facial'] = 20;
      }
      if (responses.area_problema === 'Corpo' && areaAplicacao.includes('Corporal')) {
        score += 20;
        scoreBreakdown['area_corporal'] = 20;
      }

      // Análise por problemas específicos - Tratamento seguro para string ou array
      let indicacoes = '';
      if (equipment.indicacoes) {
        if (Array.isArray(equipment.indicacoes)) {
          indicacoes = equipment.indicacoes.join(' ').toLowerCase();
        } else if (typeof equipment.indicacoes === 'string') {
          indicacoes = equipment.indicacoes.toLowerCase();
        }
      }
      
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
      let tecnologia = '';
      if (equipment.tecnologia) {
        if (Array.isArray(equipment.tecnologia)) {
          tecnologia = equipment.tecnologia.join(' ').toLowerCase();
        } else if (typeof equipment.tecnologia === 'string') {
          tecnologia = equipment.tecnologia.toLowerCase();
        }
      }
        
      if (tecnologia.includes('laser') || tecnologia.includes('ultrassom')) {
        score += 10;
        scoreBreakdown['tecnologia_avancada'] = 10;
      }

      console.log('📊 [MestreDaBeleza] Score calculado:', { equipment: equipment.nome, score, scoreBreakdown });
      return { score, scoreBreakdown };
    } catch (error) {
      console.error('❌ [MestreDaBeleza] Erro ao calcular score:', error);
      return { score: 0, scoreBreakdown: {} };
    }
  }, [estimateAge, isValidEquipment]);

  // Criar equipamento mock quando necessário
  const createMockEquipment = useCallback((): Equipment => {
    console.log('🔧 [MestreDaBeleza] Criando equipamento mock');
    return {
      id: `mock_${Date.now()}`,
      nome: 'Equipamento Recomendado',
      tecnologia: 'Tecnologia Avançada',
      indicacoes: 'Tratamentos estéticos diversos',
      beneficios: 'Resultados eficazes e seguros',
      diferenciais: 'Equipamento de última geração',
      efeito: 'Tratamento personalizado',
      linguagem: 'Profissional',
      data_cadastro: new Date().toISOString(),
      image_url: '',
      ativo: true,
      categoria: 'estetico' as const,
      area_aplicacao: ['Facial', 'Corporal'],
      tipo_acao: 'Não invasivo' as const,
      possui_consumiveis: false,
      contraindicacoes: [],
      perfil_ideal_paciente: [],
      akinator_enabled: true
    };
  }, []);

  // Sistema de recomendação baseado em equipamentos reais
  const generateRecommendation = useCallback((profile: UserProfile): RecommendationResult | null => {
    const { responses } = profile;
    
    console.log('🔮 [MestreDaBeleza] Gerando recomendação para:', { 
      sessionId: profile.session_id,
      step: profile.step,
      responses: Object.keys(responses).length,
      equipmentsCount: equipments?.length || 0,
      equipmentsLoading,
      equipmentsError: equipmentsError?.message
    });
    
    // Verificar se há erro nos equipamentos
    if (equipmentsError) {
      console.error('❌ [MestreDaBeleza] Erro ao carregar equipamentos:', equipmentsError);
      
      // Criar recomendação com mock em caso de erro
      const mockEquipment = createMockEquipment();
      return {
        equipamento: mockEquipment,
        confianca: 60,
        motivo: 'Recomendação baseada em análise geral do seu perfil',
        cta: `Conheça mais sobre ${mockEquipment.nome}`,
        score_breakdown: {}
      };
    }
    
    // Aguardar carregamento dos equipamentos
    if (equipmentsLoading) {
      console.log('⏳ [MestreDaBeleza] Aguardando carregamento dos equipamentos...');
      return null;
    }
    
    // Verificar se equipments está definido e não está vazio
    if (!equipments || !Array.isArray(equipments)) {
      console.warn('⚠️ [MestreDaBeleza] Equipments não é um array válido:', equipments);
      const mockEquipment = createMockEquipment();
      return {
        equipamento: mockEquipment,
        confianca: 50,
        motivo: 'Equipamento recomendado baseado em suas necessidades',
        cta: `Descubra o ${mockEquipment.nome}`,
        score_breakdown: {}
      };
    }
    
    // Filtrar equipamentos usando nossa função de validação
    const availableEquipments = equipments
      .filter(eq => !!eq && isValidEquipment(eq) && eq.ativo && eq.akinator_enabled);

    console.log('✅ [MestreDaBeleza] Equipamentos válidos encontrados:', availableEquipments.length);

    if (availableEquipments.length === 0) {
      console.warn('⚠️ [MestreDaBeleza] Nenhum equipamento válido disponível');
      const mockEquipment = createMockEquipment();
      return {
        equipamento: mockEquipment,
        confianca: 55,
        motivo: 'Equipamento selecionado com base no seu perfil',
        cta: `Conheça o ${mockEquipment.nome}`,
        score_breakdown: {}
      };
    }

    // Calcular scores para todos os equipamentos válidos
    const scoredEquipments = availableEquipments
      .filter(eq => !!eq) // Proteção absoluta
      .map(equipment => {
        try {
          console.log('🔍 [MestreDaBeleza] Processando equipment válido:', equipment.id, equipment.nome);
          const { score, scoreBreakdown } = calculateEquipmentScore(equipment, responses);
          return {
            equipment,
            score,
            scoreBreakdown
          };
        } catch (error) {
          console.error('❌ [MestreDaBeleza] Erro ao processar equipment:', equipment.id, error);
          return null;
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null && !!item.equipment);

    if (scoredEquipments.length === 0) {
      console.warn('⚠️ [MestreDaBeleza] Nenhum equipamento válido após scoring');
      const mockEquipment = createMockEquipment();
      return {
        equipamento: mockEquipment,
        confianca: 50,
        motivo: 'Equipamento padrão recomendado',
        cta: `Saiba mais sobre ${mockEquipment.nome}`,
        score_breakdown: {}
      };
    }

    // Ordenar por score
    scoredEquipments.sort((a, b) => b.score - a.score);
    
    const bestMatch = scoredEquipments[0];
    
    if (!bestMatch || !bestMatch.equipment || !isValidEquipment(bestMatch.equipment)) {
      console.warn('⚠️ [MestreDaBeleza] Best match inválido');
      const mockEquipment = createMockEquipment();
      return {
        equipamento: mockEquipment,
        confianca: 50,
        motivo: 'Equipamento selecionado por compatibilidade',
        cta: `Explore o ${mockEquipment.nome}`,
        score_breakdown: {}
      };
    }

    if (bestMatch.score === 0) {
      // Fallback para equipamento genérico
      const recommendation = {
        equipamento: bestMatch.equipment,
        confianca: 50,
        motivo: 'Baseado no seu perfil e necessidades gerais de estética',
        cta: `Conheça mais sobre o ${bestMatch.equipment.nome}`,
        score_breakdown: bestMatch.scoreBreakdown
      };
      
      console.log('🎲 [MestreDaBeleza] Recomendação genérica:', recommendation);
      return recommendation;
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

    console.log('🎯 [MestreDaBeleza] Recomendação gerada:', recommendation);
    return recommendation;
  }, [equipments, equipmentsLoading, equipmentsError, calculateEquipmentScore, createMockEquipment, isValidEquipment]);

  // Obter pergunta atual
  const getCurrentQuestion = useCallback((): Question | null => {
    if (userProfile.current_question_index >= questionBank.length) {
      console.log('✅ [MestreDaBeleza] Todas as perguntas foram respondidas');
      return null;
    }
    const question = questionBank[userProfile.current_question_index];
    console.log('❓ [MestreDaBeleza] Pergunta atual:', question.id);
    return question;
  }, [userProfile.current_question_index]);

  // Processar resposta do usuário
  const processUserResponse = useCallback((response: string, context?: string) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) {
      console.log('⚠️ [MestreDaBeleza] Nenhuma pergunta atual disponível');
      return { score: 0, problema: null };
    }

    console.log('💬 [MestreDaBeleza] Processando resposta:', { response, context, question: currentQuestion.id });

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
      console.log('🏁 [MestreDaBeleza] Finalizando questionário, indo para recomendação');
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
    console.log('🔍 [MestreDaBeleza] Obtendo recomendação:', recommendation?.equipamento?.nome || 'null');
    return recommendation;
  }, [userProfile, generateRecommendation]);

  const resetChat = useCallback(() => {
    console.log('🔄 [MestreDaBeleza] Resetando chat');
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
    console.log('✓ [MestreDaBeleza] isCompleted:', completed, 'step:', userProfile.step);
    return completed;
  }, [userProfile.step]);

  const getProgress = useCallback(() => {
    const progress = Math.round((userProfile.current_question_index / questionBank.length) * 100);
    console.log('📈 [MestreDaBeleza] Progress:', progress, 'index:', userProfile.current_question_index, 'total:', questionBank.length);
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
    equipments: Array.isArray(equipments)
      ? equipments.filter(eq => !!eq && isValidEquipment(eq) && eq.ativo)
      : [],
    loading: equipmentsLoading,
    error: equipmentsError
  };
};
