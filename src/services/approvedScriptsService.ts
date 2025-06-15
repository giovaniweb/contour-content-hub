import { supabase } from '@/integrations/supabase/client';
import { ApprovedScript, ScriptPerformance, ApprovedScriptWithPerformance } from '@/types/approved-scripts';

export const approvedScriptsService = {
  // Criar roteiro aprovado
  async createApprovedScript(scriptData: Partial<ApprovedScript>): Promise<ApprovedScript | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.log('❌ Usuário não autenticado');
        return null;
      }

      console.log('📝 Criando roteiro aprovado:', scriptData.title);

      const { data, error } = await supabase
        .from('approved_scripts')
        .insert({
          user_id: userData.user.id,
          script_content: scriptData.script_content!,
          title: scriptData.title!,
          format: scriptData.format || 'carrossel',
          equipment_used: scriptData.equipment_used || [],
          approval_status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: userData.user.id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar roteiro:', error);
        throw error;
      }
      
      console.log('✅ Roteiro aprovado criado:', data.id);
      return data as ApprovedScript;
    } catch (error) {
      console.error('❌ Erro ao criar roteiro aprovado:', error);
      return null;
    }
  },

  // Buscar roteiros aprovados do usuário
  async getApprovedScripts(): Promise<ApprovedScriptWithPerformance[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.log('❌ Usuário não autenticado');
        return [];
      }

      console.log('🔍 Buscando roteiros aprovados para usuário:', userData.user.id);

      const { data, error } = await supabase
        .from('approved_scripts')
        .select(`
          *,
          script_performance (*)
        `)
        .eq('user_id', userData.user.id)
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro na query:', error);
        throw error;
      }
      
      console.log('📊 Roteiros encontrados:', data?.length || 0);

      return data?.map(script => ({
        ...script,
        format: script.format as 'carrossel' | 'stories' | 'imagem' | 'reels',
        approval_status: script.approval_status as 'pending' | 'approved' | 'rejected',
        performance: script.script_performance?.[0] ? {
          ...script.script_performance[0],
          performance_rating: script.script_performance[0].performance_rating as 'bombou' | 'flopou' | 'neutro' | 'pending',
          metrics: (script.script_performance[0].metrics as any) || {}
        } : undefined
      })) || [];
    } catch (error) {
      console.error('❌ Erro ao buscar roteiros aprovados:', error);
      return [];
    }
  },

  // Adicionar performance a um roteiro
  async addPerformanceRating(
    scriptId: string, 
    rating: 'bombou' | 'flopou' | 'neutro',
    metrics: any = {},
    notes?: string
  ): Promise<ScriptPerformance | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;

      console.log('⭐ Adicionando performance:', rating, 'para script:', scriptId);

      const { data, error } = await supabase
        .from('script_performance')
        .insert({
          approved_script_id: scriptId,
          performance_rating: rating,
          metrics,
          feedback_notes: notes,
          evaluated_by: userData.user.id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao adicionar performance:', error);
        throw error;
      }
      
      console.log('✅ Performance adicionada:', data.id);
      return {
        ...data,
        performance_rating: data.performance_rating as 'bombou' | 'flopou' | 'neutro' | 'pending',
        metrics: (data.metrics as any) || {}
      } as ScriptPerformance;
    } catch (error) {
      console.error('❌ Erro ao adicionar performance:', error);
      return null;
    }
  },

  // Buscar roteiros com melhor performance para IA
  async getBestPerformingScripts(): Promise<ApprovedScriptWithPerformance[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];

      const { data, error } = await supabase
        .from('approved_scripts')
        .select(`
          *,
          script_performance!inner (*)
        `)
        .eq('user_id', userData.user.id)
        .eq('script_performance.performance_rating', 'bombou')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      return data?.map(script => ({
        ...script,
        format: script.format as 'carrossel' | 'stories' | 'imagem' | 'reels',
        approval_status: script.approval_status as 'pending' | 'approved' | 'rejected',
        performance: script.script_performance?.[0] ? {
          ...script.script_performance[0],
          performance_rating: script.script_performance[0].performance_rating as 'bombou' | 'flopou' | 'neutro' | 'pending',
          metrics: (script.script_performance[0].metrics as any) || {}
        } : undefined
      })) || [];
    } catch (error) {
      console.error('❌ Erro ao buscar roteiros de alta performance:', error);
      return [];
    }
  },

  // Enviar roteiro para content planner
  async sendToContentPlanner(scriptId: string, plannerData: any): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;

      console.log('📅 Enviando para content planner:', scriptId);

      const { error } = await supabase
        .from('content_planner_items')
        .insert({
          ...plannerData,
          user_id: userData.user.id,
          approved_script_id: scriptId,
          ai_generated: false,
          status: 'approved'
        });

      if (error) {
        console.error('❌ Erro ao enviar para planner:', error);
        throw error;
      }
      
      console.log('✅ Enviado para content planner');
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar para content planner:', error);
      return false;
    }
  },

  // Novo método utilitário (admin/dev) para popular scripts manualmente:
  async adminSeedApprovedScripts(userId: string) {
    const demoScripts = [
      {
        title: "Roteiro Carrossel: Cuidados com a Pele",
        format: "carrossel",
        script_content: "1. Limpe o rosto diariamente...\n2. Use protetor solar...",
        equipment_used: ["Adella", "Dermalux"],
      },
      {
        title: "Roteiro Story: Rotina Matinal",
        format: "stories",
        script_content: "Bom dia! Prepare sua pele para o dia com esses passos...",
        equipment_used: ["Hipro"],
      },
      {
        title: "Roteiro Reels: Laser CO2 antes e depois",
        format: "reels",
        script_content: "Veja o resultado do laser CO2 em rugas profundas...",
        equipment_used: ["Laser CO2"],
      },
      {
        title: "Roteiro Imagem: Frase de impacto sobre autoestima",
        format: "imagem",
        script_content: "Sua autoestima merece esse cuidado! #beleza",
        equipment_used: ["Adella"],
      },
      // Adicione outros exemplos aqui...
    ];
    for (const item of demoScripts) {
      const { error } = await supabase.from("approved_scripts").insert({
        user_id: userId,
        script_content: item.script_content,
        title: item.title,
        format: item.format,
        equipment_used: item.equipment_used,
        approval_status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: userId,
      });
      if (error) {
        console.error("Erro ao popular roteiro:", item.title, error);
      } else {
        console.log("Roteiro adicionado:", item.title);
      }
    }
  }
};
