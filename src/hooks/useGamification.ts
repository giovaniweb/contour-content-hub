
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUserActions } from './useUserActions';

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
  const { trackAction } = useUserActions();

  // Carregar progresso do usuário
  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Buscar progresso na nova tabela user_gamification
      const { data: progress, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Criar registro inicial na nova estrutura
        const { data: newProgress } = await supabase
          .from('user_gamification')
          .insert({
            user_id: userData.user.id,
            xp_total: 0,
            level_current: 'Bronze',
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
        setUserProgress({
          xp_total: progress.xp_total,
          nivel: calculateLevel(progress.xp_total),
          badges: progress.badges || []
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

    // Registrar ação no sistema de tracking
    await trackAction({
      action_type: 'photo_upload',
      target_type: 'before_after_photo'
    });

    // Recarregar progresso para pegar dados atualizados do trigger
    await loadUserProgress();

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

    // Atualizar badges no banco
    await supabase
      .from('user_gamification')
      .update({
        badges: novasBadges,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userData.user.id);

    // Atualizar estado local
    setUserProgress(prev => ({
      ...prev,
      badges: novasBadges
    }));

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

  // Função para rastrear assistir vídeo
  const awardVideoWatch = async (videoId: string) => {
    await trackAction({
      action_type: 'video_watch',
      target_id: videoId,
      target_type: 'video'
    });
    toast.success('+10 XP - Vídeo assistido! 🎬');
  };

  // Função para rastrear download
  const awardDownload = async (targetId: string, targetType: string) => {
    await trackAction({
      action_type: 'video_download',
      target_id: targetId,
      target_type: targetType
    });
    toast.success('+5 XP - Download realizado! 📥');
  };

  // Função para rastrear diagnóstico
  const awardDiagnostic = async () => {
    await trackAction({
      action_type: 'diagnostic_complete',
      target_type: 'diagnostic'
    });
    toast.success('+50 XP - Diagnóstico completo! 🩺', {
      description: 'Parabéns! Você é um verdadeiro especialista!'
    });
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
    awardVideoWatch,
    awardDownload,
    awardDiagnostic,
    loadUserProgress
  };
};
