
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface GamificationReward {
  mensagem: string;
  efeito: 'confetes' | 'badge' | 'elogio';
  xp_ganho: number;
  nivel: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  badges: string[];
  progresso_para_proximo_nivel: string;
  registro: boolean;
}

export interface UserProgress {
  xp_total: number;
  nivel: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  badges: string[];
}

// Interface for user_gamification table (temporary until types are regenerated)
interface UserGamificationRow {
  id: string;
  user_id: string;
  xp_total: number;
  badges: string[];
  created_at: string;
  updated_at: string;
}

const LEVEL_THRESHOLDS = {
  Bronze: { min: 0, max: 99 },
  Prata: { min: 100, max: 249 },
  Ouro: { min: 250, max: 499 },
  Diamante: { min: 500, max: Infinity }
};

const MOTIVATIONAL_PHRASES = [
  "Seu conteúdo está fluindo como nunca!",
  "Essa consistência é digna de ouro!",
  "Você está transformando ideias em impacto real!",
  "Seus resultados são inspiradores!",
  "Continue documentando essa jornada incrível!",
  "Cada antes e depois conta uma história de sucesso!"
];

export const useGamification = () => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    xp_total: 0,
    nivel: 'Bronze',
    badges: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar progresso do usuário
  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Buscar ou criar progresso do usuário usando query raw
      const { data: progress, error } = await supabase
        .from('user_gamification' as any)
        .select('*')
        .eq('user_id', userData.user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Criar registro inicial
        const { data: newProgress } = await supabase
          .from('user_gamification' as any)
          .insert({
            user_id: userData.user.id,
            xp_total: 0,
            badges: []
          })
          .select()
          .single();

        if (newProgress) {
          setUserProgress({
            xp_total: 0,
            nivel: 'Bronze',
            badges: []
          });
        }
      } else if (progress) {
        const gamificationData = progress as unknown as UserGamificationRow;
        setUserProgress({
          xp_total: gamificationData.xp_total,
          nivel: calculateLevel(gamificationData.xp_total),
          badges: gamificationData.badges || []
        });
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLevel = (xp: number): 'Bronze' | 'Prata' | 'Ouro' | 'Diamante' => {
    if (xp >= 500) return 'Diamante';
    if (xp >= 250) return 'Ouro';
    if (xp >= 100) return 'Prata';
    return 'Bronze';
  };

  const getProgressToNextLevel = (xp: number): string => {
    if (xp < 100) return `${xp}/100`;
    if (xp < 250) return `${xp}/250`;
    if (xp < 500) return `${xp}/500`;
    return `${xp}/∞`;
  };

  const awardBeforeAfterUpload = async (): Promise<GamificationReward> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Usuário não autenticado');

    const xpGanho = 25;
    const novoXp = userProgress.xp_total + xpGanho;
    const nivelAnterior = userProgress.nivel;
    const novoNivel = calculateLevel(novoXp);
    const novasBadges = [...userProgress.badges];

    // Verificar se ganhou nova badge
    if (!novasBadges.includes('Documentador de Resultados')) {
      novasBadges.push('Documentador de Resultados');
    }

    // Badge especial para múltiplos uploads
    const { data: totalUploads } = await supabase
      .from('before_after_photos')
      .select('id', { count: 'exact' })
      .eq('user_id', userData.user.id);

    if (totalUploads && totalUploads.length >= 5 && !novasBadges.includes('Mestre da Transformação')) {
      novasBadges.push('Mestre da Transformação');
    }

    // Atualizar no banco usando type assertion
    await supabase
      .from('user_gamification' as any)
      .upsert({
        user_id: userData.user.id,
        xp_total: novoXp,
        badges: novasBadges,
        updated_at: new Date().toISOString()
      });

    // Atualizar estado local
    setUserProgress({
      xp_total: novoXp,
      nivel: novoNivel,
      badges: novasBadges
    });

    // Gerar mensagem
    let mensagem = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
    
    if (nivelAnterior !== novoNivel) {
      mensagem = `🎉 Parabéns! Você subiu para o nível ${novoNivel}! ${mensagem}`;
    }

    const reward: GamificationReward = {
      mensagem,
      efeito: nivelAnterior !== novoNivel ? 'confetes' : 'badge',
      xp_ganho: xpGanho,
      nivel: novoNivel,
      badges: novasBadges.filter(badge => !userProgress.badges.includes(badge)),
      progresso_para_proximo_nivel: getProgressToNextLevel(novoXp),
      registro: true
    };

    // Mostrar toast com reward
    showGamificationToast(reward);

    return reward;
  };

  const showGamificationToast = (reward: GamificationReward) => {
    toast.success(`+${reward.xp_ganho} XP! 🎯`, {
      description: reward.mensagem,
      duration: 4000,
      action: reward.badges.length > 0 ? {
        label: `🏆 ${reward.badges[0]}`,
        onClick: () => {}
      } : undefined
    });

    // Efeito visual adicional
    if (reward.efeito === 'confetes') {
      // Trigger confetti effect (poderia integrar com uma lib de confetti)
      console.log('🎊 Confetes liberados!');
    }
  };

  return {
    userProgress,
    isLoading,
    awardBeforeAfterUpload,
    loadUserProgress
  };
};
