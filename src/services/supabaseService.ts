import { supabase } from '@/integrations/supabase/client';
import { ScriptType, ScriptRequest, ScriptResponse, MediaItem, CalendarSuggestion } from '@/utils/api';

// Função para converter um roteiro do formato do banco para o formato da UI
const convertRoteiro = (roteiro: any): ScriptResponse => {
  return {
    id: roteiro.id,
    content: roteiro.conteudo,
    title: roteiro.titulo,
    type: roteiro.tipo as ScriptType,
    createdAt: roteiro.data_criacao,
    suggestedVideos: [],
    suggestedMusic: [],
    suggestedFonts: [],
    captionTips: []
  };
};

// Função para gerar um roteiro usando a Edge Function
export const generateScript = async (request: ScriptRequest): Promise<ScriptResponse> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    const token = await supabase.auth.getSession().then(res => res.data.session?.access_token || '');

    // Chamar a Edge Function para gerar o roteiro
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-script`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        request
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao chamar a Edge Function: ${errorText}`);
    }

    const scriptResponse = await response.json();
    return scriptResponse;
  } catch (error) {
    console.error('Erro ao gerar roteiro:', error);
    throw error;
  }
};

// Função para salvar feedback de um roteiro
export const saveScriptFeedback = async (
  scriptId: string, 
  feedback: string, 
  approved: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('roteiros')
      .update({
        observacoes: feedback,
        status: approved ? 'aprovado' : 'editado'
      })
      .eq('id', scriptId);
      
    if (error) throw error;
    
  } catch (error) {
    console.error('Erro ao salvar feedback:', error);
    throw error;
  }
};

// Função para obter itens de mídia com filtros
export const getMediaItems = async (filters?: {
  type?: string;
  equipment?: string[];
  bodyArea?: string[];
  purpose?: string[];
  query?: string;
}): Promise<MediaItem[]> => {
  try {
    let query = supabase.from('videos').select('*');
    
    // Aplicar filtros se fornecidos
    if (filters) {
      if (filters.type && filters.type !== 'all') {
        query = query.eq('tipo', filters.type);
      }
      
      if (filters.query) {
        query = query.or(`titulo.ilike.%${filters.query}%,descricao.ilike.%${filters.query}%`);
      }
      
      if (filters.equipment?.length && !filters.equipment.includes('all-equipment')) {
        query = query.in('equipamento', filters.equipment);
      }
      
      if (filters.bodyArea?.length && !filters.bodyArea.includes('all-areas')) {
        query = query.in('area_corpo', filters.bodyArea);
      }
      
      if (filters.purpose?.length && !filters.purpose.includes('all-purposes')) {
        query = query.in('finalidade', filters.purpose);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Buscar informações de favoritos para o usuário atual
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data: favoritos, error: favoritosError } = await supabase
      .from('favoritos')
      .select('video_id')
      .eq('usuario_id', userId);
      
    if (favoritosError) {
      console.error('Erro ao buscar favoritos:', favoritosError);
    }
    
    // Buscar avaliações para os vídeos
    const { data: avaliacoes, error: avaliacoesError } = await supabase
      .from('avaliacoes')
      .select('video_id, nota')
      .eq('usuario_id', userId);
      
    if (avaliacoesError) {
      console.error('Erro ao buscar avaliações:', avaliacoesError);
    }
    
    // Criar um mapa de favoritos para consulta rápida
    const favoritosMap = new Map();
    favoritos?.forEach(fav => favoritosMap.set(fav.video_id, true));
    
    // Criar um mapa de avaliações para consulta rápida
    const avaliacoesMap = new Map();
    avaliacoes?.forEach(aval => avaliacoesMap.set(aval.video_id, aval.nota));
    
    // Converter do formato do banco para o formato da UI
    return (data || []).map(video => ({
      id: video.id,
      title: video.titulo,
      thumbnailUrl: video.preview_url || '/placeholder.svg',
      videoUrl: video.url_video,
      type: video.tipo as 'video' | 'raw' | 'image',
      equipment: [video.equipamento],
      bodyArea: [video.area_corpo],
      purpose: [video.finalidade],
      duration: video.duracao,
      rating: avaliacoesMap.get(video.id) || 0,
      isFavorite: favoritosMap.has(video.id)
    }));
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    throw error;
  }
};

// Função para alternar status de favorito
export const toggleFavorite = async (mediaId: string): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Verificar se já é favorito
    const { data, error } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', userId)
      .eq('video_id', mediaId)
      .maybeSingle();
      
    if (error) throw error;
    
    if (data) {
      // Se já é favorito, remover
      const { error: deleteError } = await supabase
        .from('favoritos')
        .delete()
        .eq('id', data.id);
        
      if (deleteError) throw deleteError;
      return false; // Não é mais favorito
    } else {
      // Se não é favorito, adicionar
      const { error: insertError } = await supabase
        .from('favoritos')
        .insert({
          usuario_id: userId,
          video_id: mediaId
        });
        
      if (insertError) throw insertError;
      return true; // Agora é favorito
    }
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    throw error;
  }
};

// Função para avaliar um item de mídia
export const rateMedia = async (mediaId: string, rating: number): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Verificar se já existe avaliação
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('id')
      .eq('usuario_id', userId)
      .eq('video_id', mediaId)
      .maybeSingle();
      
    if (error) throw error;
    
    if (data) {
      // Se já existe avaliação, atualizar
      const { error: updateError } = await supabase
        .from('avaliacoes')
        .update({ nota: rating })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
    } else {
      // Se não existe avaliação, criar nova
      const { error: insertError } = await supabase
        .from('avaliacoes')
        .insert({
          usuario_id: userId,
          video_id: mediaId,
          nota: rating
        });
        
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao avaliar mídia:', error);
    throw error;
  }
};

// Função para obter sugestões do calendário
export const getCalendarSuggestions = async (
  month: number,
  year: number,
  frequency: 1 | 2 | 3 = 2
): Promise<CalendarSuggestion[]> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Buscar agenda existente no banco
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const { data: agendaItems, error } = await supabase
      .from('agenda')
      .select('*')
      .eq('usuario_id', userId)
      .gte('data', startDate.toISOString().split('T')[0])
      .lte('data', endDate.toISOString().split('T')[0]);
      
    if (error) throw error;
    
    if (agendaItems && agendaItems.length > 0) {
      // Converter do formato do banco para o formato da UI
      return agendaItems.map(item => ({
        date: item.data,
        title: item.titulo,
        type: item.tipo as ScriptType,
        description: item.descricao,
        completed: item.status === 'concluido'
      }));
    } else {
      // Se não existir agenda, gerar sugestões
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const interval = Math.floor(daysInMonth / (frequency * 4)); // distribuir ao longo de 4 semanas
      
      const suggestions: CalendarSuggestion[] = [];
      
      // Criar sugestões para cada dia selecionado
      for (let i = 1; i <= frequency * 4; i++) {
        const day = i * interval;
        if (day <= daysInMonth) {
          // Alternar entre diferentes tipos de roteiro
          const scriptType: ScriptType = i % 3 === 0 ? "dailySales" : i % 2 === 0 ? "bigIdea" : "videoScript";
          
          // Criar a sugestão
          suggestions.push({
            date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            title: scriptType === "videoScript" 
              ? "Criar um vídeo de tratamento" 
              : scriptType === "bigIdea" 
                ? "Desenvolver uma campanha estratégica" 
                : "Compartilhar uma promoção rápida",
            type: scriptType,
            description: scriptType === "videoScript"
              ? "Mostre sua expertise com um vídeo informativo sobre tratamento"
              : scriptType === "bigIdea"
                ? "Construa a autoridade da marca com uma série de conteúdo estratégico"
                : "Impulsione conversões com uma oferta por tempo limitado",
            completed: false
          });
        }
      }
      
      return suggestions;
    }
  } catch (error) {
    console.error('Erro ao obter sugestões de calendário:', error);
    throw error;
  }
};

// Função para atualizar conclusão do calendário
export const updateCalendarCompletion = async (
  date: string,
  completed: boolean
): Promise<void> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Buscar o item da agenda
    const { data, error } = await supabase
      .from('agenda')
      .select('id')
      .eq('usuario_id', userId)
      .eq('data', date)
      .maybeSingle();
      
    if (error) throw error;
    
    if (data) {
      // Atualizar status do item existente
      const { error: updateError } = await supabase
        .from('agenda')
        .update({
          status: completed ? 'concluido' : 'pendente'
        })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
    } else {
      // Criar novo item com o status
      const { error: insertError } = await supabase
        .from('agenda')
        .insert({
          usuario_id: userId,
          data: date,
          titulo: completed ? 'Tarefa concluída' : 'Tarefa pendente',
          tipo: 'videoScript',
          descricao: 'Tarefa de calendário criativa',
          status: completed ? 'concluido' : 'pendente'
        });
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Erro ao atualizar conclusão do calendário:', error);
    throw error;
  }
};
