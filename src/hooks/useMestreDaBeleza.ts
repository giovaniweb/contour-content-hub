import { useState, useCallback } from 'react';
import { useEquipments } from '@/hooks/useEquipments';
import { Equipment } from '@/types/equipment';
import { questionBank } from '@/components/mestre-da-beleza/questionBank';

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
}

interface RecommendationResult {
  equipamento: Equipment;
  confianca: number;
  motivo: string;
  cta: string;
}

export const useMestreDaBeleza = () => {
  const { equipments } = useEquipments();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    primeira_interacao: true,
    cadastrado: false,
    equipamento_informado: false,
    step: 'profile',
    responses: {}
  });

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...updates,
      responses: { ...prev.responses, ...updates.responses }
    }));
  }, []);

  // Função para analisar idade baseada em perguntas nostálgicas
  const estimateAge = useCallback((responses: Record<string, any>): number => {
    if (responses.brasiltricampeao === 'sim') return 35; // 1994
    if (responses.brasilpenta === 'sim') return 25; // 2002
    if (responses.tvcolosso === 'sim') return 30; // Anos 90
    if (responses.xuxa === 'sim') return 35; // Anos 80-90
    return 25; // Padrão jovem
  }, []);

  // Sistema de recomendação baseado em equipamentos reais
  const generateRecommendation = useCallback((profile: UserProfile): RecommendationResult | null => {
    const { responses, perfil, problema_identificado, idade_estimada } = profile;
    
    // Buscar equipamentos por categoria baseada no perfil
    const availableEquipments = equipments.filter(eq => {
      if (perfil === 'cliente_final') return eq.categoria === 'estetico';
      return eq.ativo; // Médicos e profissionais veem todos
    });

    // Lógica de recomendação para flacidez (HIPRO)
    if (problema_identificado === 'flacidez_facial') {
      const hipro = availableEquipments.find(eq => 
        eq.nome.toLowerCase().includes('hipro') || 
        eq.tecnologia.toLowerCase().includes('hipro')
      );
      
      if (hipro) {
        return {
          equipamento: hipro,
          confianca: 95,
          motivo: 'Baseado nas suas respostas sobre firmeza facial e idade estimada',
          cta: 'Conheça o HIPRO - lifting sem agulha'
        };
      }
    }

    // Lógica para flacidez corporal
    if (problema_identificado === 'flacidez_corporal') {
      const endolaser = availableEquipments.find(eq => 
        eq.nome.toLowerCase().includes('endolaser') ||
        eq.area_aplicacao?.includes('Corpo')
      );
      
      if (endolaser) {
        return {
          equipamento: endolaser,
          confianca: 90,
          motivo: 'Indicado para flacidez corporal e tonificação',
          cta: 'Descubra como o Endolaser pode te ajudar'
        };
      }
    }

    // Recomendação genérica baseada na área do problema
    const equipamentoRecomendado = availableEquipments.find(eq => {
      const indicacoes = Array.isArray(eq.indicacoes) 
        ? eq.indicacoes.join(' ').toLowerCase()
        : eq.indicacoes.toLowerCase();
      
      if (responses.area_problema === 'rosto') {
        return indicacoes.includes('facial') || indicacoes.includes('rosto');
      }
      if (responses.area_problema === 'corpo') {
        return indicacoes.includes('corporal') || indicacoes.includes('corpo');
      }
      return false;
    });

    if (equipamentoRecomendado) {
      return {
        equipamento: equipamentoRecomendado,
        confianca: 75,
        motivo: 'Baseado na área do problema identificada',
        cta: `Saiba mais sobre o ${equipamentoRecomendado.nome}`
      };
    }

    return null;
  }, [equipments]);

  // Analisar respostas e identificar problema
  const analyzeResponses = useCallback((responses: Record<string, any>) => {
    let problema = '';
    let area = '';
    
    // Detecção de flacidez facial
    if (responses.rosto_derretendo === 'sim' && 
        responses.perdeu_firmeza === 'sim' && 
        responses.emagreceu_rapido === 'sim') {
      problema = 'flacidez_facial';
      area = 'rosto';
    }
    
    // Detecção de flacidez corporal
    if (responses.corpo_flacido === 'sim' && 
        responses.area_problema === 'corpo') {
      problema = 'flacidez_corporal';
      area = 'corpo';
    }

    // Outros problemas comuns
    if (responses.manchas_rosto === 'sim') {
      problema = 'melasma_manchas';
      area = 'rosto';
    }

    if (responses.gordura_localizada === 'sim') {
      problema = 'gordura_localizada';
      area = 'corpo';
    }

    return { problema, area };
  }, []);

  const processUserResponse = useCallback((response: string, context: string) => {
    // Nova lógica: associar scoring/contextos via questionBank
    let score = 0;
    const q = questionBank.find(q => q.context === context);
    if (q && q.scoring && q.scoring[response]) {
      score = q.scoring[response];
    }
    // Usar score para gerar recomendação futura se desejar
    const newResponses = { ...userProfile.responses, [context]: response };
    const idade_estimada = estimateAge(newResponses);
    const { problema, area } = analyzeResponses(newResponses);
    
    updateProfile({
      responses: newResponses,
      idade_estimada,
      area_problema: area,
      problema_identificado: problema
    });

    return { score };
  }, [userProfile.responses, estimateAge, analyzeResponses, updateProfile]);

  const getRecommendation = useCallback(() => {
    return generateRecommendation(userProfile);
  }, [userProfile, generateRecommendation]);

  const resetChat = useCallback(() => {
    setUserProfile({
      primeira_interacao: true,
      cadastrado: false,
      equipamento_informado: false,
      step: 'profile',
      responses: {}
    });
  }, []);

  return {
    userProfile,
    updateProfile,
    processUserResponse,
    getRecommendation,
    resetChat,
    equipments: equipments.filter(eq => eq.ativo)
  };
};
