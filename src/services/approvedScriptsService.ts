
import { supabase } from '@/integrations/supabase/client';
import { ApprovedScript, ScriptPerformance, ApprovedScriptWithPerformance } from '@/types/approved-scripts';

export const approvedScriptsService = {
  // Criar roteiro aprovado
  async createApprovedScript(scriptData: Partial<ApprovedScript>): Promise<ApprovedScript | null> {
    try {
      const { data, error } = await supabase
        .from('approved_scripts')
        .insert([{
          script_content: scriptData.script_content,
          title: scriptData.title,
          format: scriptData.format || 'carrossel',
          equipment_used: scriptData.equipment_used || [],
          approval_status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar roteiro aprovado:', error);
      return null;
    }
  },

  // Buscar roteiros aprovados do usuário
  async getApprovedScripts(): Promise<ApprovedScriptWithPerformance[]> {
    try {
      const { data, error } = await supabase
        .from('approved_scripts')
        .select(`
          *,
          script_performance (*)
        `)
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(script => ({
        ...script,
        performance: script.script_performance?.[0]
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar roteiros aprovados:', error);
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
      const { data, error } = await supabase
        .from('script_performance')
        .insert([{
          approved_script_id: scriptId,
          performance_rating: rating,
          metrics,
          feedback_notes: notes,
          evaluated_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar performance:', error);
      return null;
    }
  },

  // Buscar roteiros com melhor performance para IA
  async getBestPerformingScripts(): Promise<ApprovedScriptWithPerformance[]> {
    try {
      const { data, error } = await supabase
        .from('approved_scripts')
        .select(`
          *,
          script_performance!inner (*)
        `)
        .eq('script_performance.performance_rating', 'bombou')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      return data?.map(script => ({
        ...script,
        performance: script.script_performance?.[0]
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar roteiros de alta performance:', error);
      return [];
    }
  },

  // Enviar roteiro para content planner
  async sendToContentPlanner(scriptId: string, plannerData: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content_planner_items')
        .insert([{
          ...plannerData,
          approved_script_id: scriptId,
          ai_generated: false,
          status: 'approved'
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao enviar para content planner:', error);
      return false;
    }
  }
};
