import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalEquipments: number;
  totalDocuments: number;
  totalActions: number;
  totalGamificationUsers: number;
  hotLeads: number;
  averageXP: number;
  topEngagementUser?: {
    name: string;
    xp: number;
  };
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVideos: 0,
    totalEquipments: 0,
    totalDocuments: 0,
    totalActions: 0,
    totalGamificationUsers: 0,
    hotLeads: 0,
    averageXP: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Contar usuários (excluindo admins)
      const { count: usersCount } = await supabase
        .from('perfis')
        .select('*', { count: 'exact', head: true })
        .neq('role', 'admin');

      // Contar vídeos
      const { count: videosCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      // Contar equipamentos ativos
      const { count: equipmentsCount } = await supabase
        .from('equipamentos')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

      // Contar documentos
      const { count: documentsCount } = await supabase
        .from('unified_documents')
        .select('*', { count: 'exact', head: true });

      // Contar ações dos usuários (últimos 30 dias)
      const { count: actionsCount } = await supabase
        .from('user_actions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Usuários com gamificação
      const { count: gamificationCount } = await supabase
        .from('user_gamification')
        .select('*', { count: 'exact', head: true });

      // Hot leads
      const { count: hotLeadsCount } = await supabase
        .from('user_purchase_scores')
        .select('*', { count: 'exact', head: true })
        .in('probability_tier', ['hot', 'very_hot']);

      // XP médio
      const { data: avgXPData } = await supabase
        .from('user_gamification')
        .select('xp_total');

      const averageXP = avgXPData && avgXPData.length > 0 
        ? Math.round(avgXPData.reduce((sum, user) => sum + user.xp_total, 0) / avgXPData.length)
        : 0;

      // Top usuário por engajamento
      const { data: topUser } = await supabase
        .from('user_gamification')
        .select(`
          xp_total,
          user_id,
          perfis!inner(nome)
        `)
        .order('xp_total', { ascending: false })
        .limit(1)
        .single();

      setStats({
        totalUsers: usersCount || 0,
        totalVideos: videosCount || 0,
        totalEquipments: equipmentsCount || 0,
        totalDocuments: documentsCount || 0,
        totalActions: actionsCount || 0,
        totalGamificationUsers: gamificationCount || 0,
        hotLeads: hotLeadsCount || 0,
        averageXP,
        topEngagementUser: topUser ? {
          name: (topUser as any).perfis.nome,
          xp: topUser.xp_total
        } : undefined
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, refetch: fetchStats };
};