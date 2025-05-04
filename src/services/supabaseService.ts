import { supabase, SUPABASE_BASE_URL } from '@/integrations/supabase/client';
import { ScriptType, ScriptRequest, ScriptResponse, MediaItem, CalendarSuggestion, CalendarPreferences } from '@/utils/api';

// Função para converter um roteiro do formato do banco para o formato da UI
const convertRoteiro = (roteiro: any): ScriptResponse => {
  return {
    id: roteiro.id,
    content: roteiro.conteudo,
    title: roteiro.titulo,
    type: roteiro.tipo as ScriptType,
    createdAt: roteiro.data_criacao,
    suggestedVideos: [],
    captionTips: []
  };
};

// Função para gerar um roteiro usando a Edge Function
export const generateScript = async (request: ScriptRequest): Promise<ScriptResponse> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    const token = await supabase.auth.getSession().then(res => res.data.session?.access_token || '');

    console.log('Iniciando geração de roteiro com os parâmetros:', request);

    // Use the SUPABASE_BASE_URL exported from the client
    if (!SUPABASE_BASE_URL) {
      throw new Error('URL do Supabase não definida');
    }
    
    // Chamar a Edge Function para gerar o roteiro usando o URL base do Supabase
    console.log(`Chamando Edge Function em: ${SUPABASE_BASE_URL}/functions/v1/generate-script`);
    
    let response;
    try {
      response = await fetch(`${SUPABASE_BASE_URL}/functions/v1/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          request
        })
      });
      
      console.log('Status da resposta Edge Function:', response.status);
    } catch (fetchError) {
      console.error('Erro na chamada da Edge Function:', fetchError);
      throw new Error(`Falha na conexão com a Edge Function: ${fetchError.message}`);
    }

    if (!response.ok) {
      let errorMessage = '';
      try {
        // Tentar processar como JSON primeiro
        const errorJson = await response.json();
        errorMessage = errorJson.error || `Status: ${response.status}`;
      } catch (jsonError) {
        // Caso não seja JSON, tentar obter como texto
        try {
          const errorText = await response.text();
          errorMessage = errorText || `Status: ${response.status}`;
        } catch (textError) {
          errorMessage = `Status: ${response.status}`;
        }
      }
      
      console.error('Resposta da Edge Function:', response.status, errorMessage);
      throw new Error(`Erro ao chamar a Edge Function: ${errorMessage}`);
    }

    let scriptResponse;
    try {
      scriptResponse = await response.json();
    } catch (jsonError) {
      console.error('Erro ao processar resposta JSON:', jsonError);
      throw new Error('A resposta da Edge Function não é um JSON válido');
    }
    
    if (scriptResponse.error) {
      throw new Error(`Erro retornado pela Edge Function: ${scriptResponse.error}`);
    }
    
    console.log('Roteiro gerado com sucesso');
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
export async function getMediaItems(filters?: any): Promise<MediaItem[]> {
  try {
    let query = supabase.from('videos').select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.type && filters.type !== 'all') {
        query = query.eq('tipo_video', filters.type);
      }
      
      if (filters.query) {
        query = query.or(`titulo.ilike.%${filters.query}%,descricao_curta.ilike.%${filters.query}%,descricao_detalhada.ilike.%${filters.query}%`);
      }
      
      if (filters.equipment?.length && !filters.equipment.includes('all-equipment')) {
        // For arrays, use contains
        query = query.contains('equipamentos', filters.equipment);
      }
      
      if (filters.bodyArea?.length && !filters.bodyArea.includes('all-areas')) {
        // For area
        query = query.eq('area_corpo', filters.bodyArea[0]);
      }
      
      if (filters.purpose?.length && !filters.purpose.includes('all-purposes')) {
        // For purposes
        query = query.contains('finalidade', filters.purpose);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Get favorites for the current user
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data: favoritos, error: favoritosError } = await supabase
      .from('favoritos')
      .select('video_id')
      .eq('usuario_id', userId);
      
    if (favoritosError) {
      console.error('Error fetching favorites:', favoritosError);
    }
    
    // Get ratings for videos
    const { data: avaliacoes, error: avaliacoesError } = await supabase
      .from('avaliacoes')
      .select('video_id, nota')
      .eq('usuario_id', userId);
      
    if (avaliacoesError) {
      console.error('Error fetching ratings:', avaliacoesError);
    }
    
    // Create maps for quick lookup
    const favoritosMap = new Map();
    favoritos?.forEach(fav => favoritosMap.set(fav.video_id, true));
    
    const avaliacoesMap = new Map();
    avaliacoes?.forEach(aval => avaliacoesMap.set(aval.video_id, aval.nota));
    
    // Convert database format to UI format
    const formattedData: MediaItem[] = (data || []).map(video => ({
      id: video.id,
      title: video.titulo,
      description: video.descricao,
      thumbnailUrl: video.preview_url || '/placeholder.svg',
      videoUrl: video.url_video,
      type: video.tipo_video as 'video_pronto' | 'take' | 'image',
      isFavorite: favoritosMap.has(video.id),
      rating: avaliacoesMap.get(video.id) || 0,
      equipment: video.equipamentos || [],
      purpose: video.finalidade || [],
      bodyArea: video.area_corpo || 'Não especificado',
      duration: video.duracao,
      shortDescription: video.descricao_curta || ''
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

// Função para alternar status de favorito
export const toggleFavorite = async (mediaId: string): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Verify if it's already a favorite
    const { data, error } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', userId)
      .eq('video_id', mediaId)
      .maybeSingle();
      
    if (error) throw error;
    
    if (data) {
      // If it's already a favorite, remove it
      const { error: deleteError } = await supabase
        .from('favoritos')
        .delete()
        .eq('id', data.id);
        
      if (deleteError) throw deleteError;
      
      // Update count in videos table
      await supabase.rpc('decrement_favorites_count', {
        video_id: mediaId
      }).then(null, (err) => {
        console.error('Error decrementing favorites count:', err);
        // Continue even if this fails
      });
      
      return false; // Not a favorite anymore
    } else {
      // If not a favorite, add it
      const { error: insertError } = await supabase
        .from('favoritos')
        .insert({
          usuario_id: userId,
          video_id: mediaId
        });
        
      if (insertError) throw insertError;
      
      // Update count in videos table
      await supabase.rpc('increment_favorites_count', {
        video_id: mediaId
      }).then(null, (err) => {
        console.error('Error incrementing favorites count:', err);
        // Continue even if this fails
      });
      
      return true; // Now a favorite
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

// Função para avaliar um item de mídia
export const rateMedia = async (mediaId: string, rating: number): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Verify if there's already an evaluation
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('id')
      .eq('usuario_id', userId)
      .eq('video_id', mediaId)
      .maybeSingle();
      
    if (error) throw error;
    
    if (data) {
      // If there's already an evaluation, update it
      const { error: updateError } = await supabase
        .from('avaliacoes')
        .update({ nota: rating })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
    } else {
      // If not, create a new one
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
    console.error('Error rating media:', error);
    throw error;
  }
};

// Função para atualizar preferências do usuário
export const updateUserPreferences = async (observations: string): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Update user profile with observations
    const { error } = await supabase
      .from('perfis')
      .update({
        observacoes_conteudo: observations
      })
      .eq('id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

// Função para atualizar preferências de alertas por email
export const saveEmailAlertPreferences = async (
  enabled: boolean,
  frequency: "daily" | "weekly" | "intelligent"
): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Verify if there's already an alert record
    const { data, error } = await supabase
      .from('alertas_email')
      .select('id')
      .eq('usuario_id', userId)
      .eq('tipo', 'agenda_criativa')
      .maybeSingle();
      
    if (error) throw error;
    
    if (data) {
      // If there's already an alert, update it
      const { error: updateError } = await supabase
        .from('alertas_email')
        .update({
          ativo: enabled,
          config: { frequency }
        })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
    } else {
      // If not, create a new one
      const { error: insertError } = await supabase
        .from('alertas_email')
        .insert({
          usuario_id: userId,
          tipo: 'agenda_criativa',
          ativo: enabled,
          config: { frequency }
        });
        
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving email alert preferences:', error);
    throw error;
  }
};

// Função para obter sugestões do calendário
export async function getCalendarSuggestions(): Promise<CalendarSuggestion[]> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('perfis')
      .select('equipamentos, observacoes_conteudo')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }
    
    const userEquipments = userProfile?.equipamentos || [];
    const userObservations = userProfile?.observacoes_conteudo || '';
    
    // Get existing calendar items
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
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
      // Convert database format to UI format
      return agendaItems.map(item => ({
        id: item.id,
        date: item.data,
        title: item.titulo,
        description: item.descricao || '',
        format: item.formato as "video" | "story" | "image",
        completed: item.status === 'concluido',
        equipment: item.equipamento,
        purpose: item.objetivo,
        hook: item.gancho,
        caption: item.legenda,
        type: item.tipo
      }));
    } else {
      // If no calendar items exist, generate suggestions
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const frequency = 2; // Default, 2 posts per week
      const interval = Math.floor(daysInMonth / (frequency * 4)); // Distribute over 4 weeks
      
      const suggestions: CalendarSuggestion[] = [];
      
      // Possible topics based on user preferences
      const possibleTopics = [
        "Lipedema: diagnóstico e tratamento",
        "Flacidez facial: tratamentos não-invasivos",
        "Gordura localizada: mitos e verdades",
        "Tratamentos para pós-operatório",
        "Rejuvenescimento da pele",
        "Redução de medidas sem cirurgia",
        "Combate à celulite com tecnologia avançada",
        "Tratamentos para os diferentes tipos de pele",
        "Drenagem linfática: benefícios e indicações",
        "Massagem modeladora: resultados reais"
      ];
      
      // Specific topics from user observations
      let userTopics: string[] = [];
      if (userObservations) {
        // Extract topics from user observations
        const keywords = ["lipedema", "flacidez", "gordura", "celulite", "rejuvenescimento", "pós-operatório", "drenagem"];
        keywords.forEach(keyword => {
          if (userObservations.toLowerCase().includes(keyword)) {
            userTopics.push(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: tratamentos e cuidados`);
          }
        });
      }
      
      // Combine topics
      const topics = userTopics.length > 0 ? [...userTopics, ...possibleTopics] : possibleTopics;
      
      // Equipment selection
      const equipments = userEquipments.length > 0 ? 
          userEquipments : 
          ["Adélla", "Enygma", "Hipro", "Reverso", "Ultralift"];
      
      // Available content formats
      const availableFormats: Array<"video" | "story" | "image"> = ["video", "story", "image"];
      
      // Create suggestions for each selected day
      for (let i = 1; i <= frequency * 4; i++) {
        const day = i * interval;
        if (day <= daysInMonth) {
          // Select random format
          const randomFormat = availableFormats[Math.floor(Math.random() * availableFormats.length)];
          
          // Define script type based on format
          const scriptType: ScriptType = randomFormat === "video" ? "videoScript" : 
                                        randomFormat === "story" ? "dailySales" : "bigIdea";
          
          // Select random topic
          const randomTopic = topics[Math.floor(Math.random() * topics.length)];
          
          // Select random equipment
          const randomEquipment = equipments[Math.floor(Math.random() * equipments.length)];
          
          // Define purpose based on script type
          const purpose = scriptType === "videoScript" ? "educate" : 
                        scriptType === "bigIdea" ? "engage" : "sell";
          
          // Creative hooks based on type
          const hooks = {
            videoScript: [
              "Você sabia que 80% das mulheres...",
              "A ciência por trás de...",
              "3 mitos sobre tratamentos que você precisa conhecer",
              "Antes e depois: resultados impressionantes"
            ],
            bigIdea: [
              "Transforme sua pele em apenas 30 dias",
              "A revolução do tratamento estético chegou",
              "Descubra o segredo das celebridades",
              "Sua melhor versão está esperando por você"
            ],
            dailySales: [
              "Última chance: promoção imperdível",
              "Apenas hoje: 30% de desconto",
              "Agende agora e ganhe uma sessão extra",
              "Verão está chegando: prepare-se agora"
            ]
          };
          
          // Select random hook
          const randomHook = hooks[scriptType][Math.floor(Math.random() * hooks[scriptType].length)];
          
          // Create suggestion
          suggestions.push({
            id: `suggestion-${i}-${Date.now()}`,
            date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            title: randomTopic,
            description: scriptType === "videoScript" 
              ? "Mostre sua expertise com um vídeo informativo sobre tratamento" 
              : scriptType === "bigIdea" 
                ? "Construa a autoridade da marca com uma série de conteúdo estratégico" 
                : "Impulsione conversões com uma oferta por tempo limitado",
            completed: false,
            equipment: randomEquipment,
            purpose: purpose,
            format: randomFormat,
            hook: randomHook,
            caption: scriptType === "dailySales" ? "Toque para mais informações! ↗️ #saude #beleza" : undefined,
            type: scriptType
          });
        }
      }
      
      return suggestions;
    }
  } catch (error) {
    console.error('Error getting calendar suggestions:', error);
    throw error;
  }
};

// Função para atualizar conclusão do calendário
export async function updateCalendarCompletion(date: string, completed: boolean): Promise<void> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Get the existing calendar item
    const { data, error } = await supabase
      .from('agenda')
      .select('id')
      .eq('usuario_id', userId)
      .eq('data', date)
      .maybeSingle();
      
    if (error) throw error;
    
    if (data) {
      // Update the status of the existing item
      const { error: updateError } = await supabase
        .from('agenda')
        .update({
          status: completed ? 'concluido' : 'pendente'
        })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
    } else {
      // Create a new item with the status
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
    console.error('Error updating calendar completion:', error);
    throw error;
  }
};

// Função para limpar o planejamento do calendário
export async function clearCalendarPlanning(): Promise<void> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Define the date range for the current month
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    // Delete all agenda items for the current month
    const { error } = await supabase
      .from('agenda')
      .delete()
      .eq('usuario_id', userId)
      .gte('data', startDate.toISOString().split('T')[0])
      .lte('data', endDate.toISOString().split('T')[0]);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error clearing calendar planning:', error);
    throw error;
  }
};

// Função para aprovar o planejamento do calendário
export async function approveCalendarPlanning(suggestions: CalendarSuggestion[]): Promise<void> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Create or update calendar items with "approved" status
    const agendaItems = suggestions.map(suggestion => ({
      usuario_id: userId,
      data: suggestion.date,
      titulo: suggestion.title,
      tipo: suggestion.type || 'videoScript',
      descricao: suggestion.description,
      status: 'aprovado',
      equipamento: suggestion.equipment,
      objetivo: suggestion.purpose,
      formato: suggestion.format,
      gancho: suggestion.hook,
      legenda: suggestion.caption
    }));
    
    // Remove existing items for the current month
    await clearCalendarPlanning();
    
    // Insert new approved items
    const { error } = await supabase
      .from('agenda')
      .insert(agendaItems);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error approving calendar planning:', error);
    throw error;
  }
};

// Função para atualizar preferências do calendário
export async function updateCalendarPreferences(preferences: CalendarPreferences): Promise<boolean> {
  try {
    // This function only stores preferences temporarily
    // In a real application, you could store this in the database
    
    // In this case, we don't need to store anything in the database
    // because we use the preferences directly in the getCalendarSuggestions function
    
    return true;
  } catch (error) {
    console.error('Error updating calendar preferences:', error);
    throw error;
  }
};
