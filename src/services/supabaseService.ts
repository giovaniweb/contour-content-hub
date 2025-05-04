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
        query = query.eq('tipo_video', filters.type);
      }
      
      if (filters.query) {
        query = query.or(`titulo.ilike.%${filters.query}%,descricao_curta.ilike.%${filters.query}%,descricao_detalhada.ilike.%${filters.query}%`);
      }
      
      if (filters.equipment?.length && !filters.equipment.includes('all-equipment')) {
        // Para arrays, usamos contains
        query = query.contains('equipamentos', filters.equipment);
      }
      
      if (filters.bodyArea?.length && !filters.bodyArea.includes('all-areas')) {
        // Para área do corpo que não é array
        query = query.eq('area_corpo', filters.bodyArea[0]);
      }
      
      if (filters.purpose?.length && !filters.purpose.includes('all-purposes')) {
        // Para finalidades que são array
        query = query.contains('finalidade', filters.purpose);
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
      type: video.tipo_video as 'video_pronto' | 'take' | 'image',
      equipment: video.equipamentos || [],
      bodyArea: [video.area_corpo || 'Não especificado'],
      purpose: video.finalidade || [],
      duration: video.duracao,
      rating: avaliacoesMap.get(video.id) || 0,
      isFavorite: favoritosMap.has(video.id),
      shortDescription: video.descricao_curta || ''
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
      
      // Atualizar contagem na tabela de vídeos
      await supabase.rpc('decrement_favorites_count', {
        video_id: mediaId
      }).then(null, (err) => {
        console.error('Erro ao decrementar contagem de favoritos:', err);
        // Continue even if this fails
      });
      
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
      
      // Atualizar contagem na tabela de vídeos
      await supabase.rpc('increment_favorites_count', {
        video_id: mediaId
      }).then(null, (err) => {
        console.error('Erro ao incrementar contagem de favoritos:', err);
        // Continue even if this fails
      });
      
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

// Função para atualizar preferências do usuário
export const updateUserPreferences = async (observations: string): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Atualizar perfil do usuário com as observações
    const { error } = await supabase
      .from('perfis')
      .update({
        observacoes_conteudo: observations
      })
      .eq('id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar preferências:', error);
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
    
    // Verificar se já existe registro de alerta
    const { data, error } = await supabase
      .from('alertas_email')
      .select('id')
      .eq('usuario_id', userId)
      .eq('tipo', 'agenda_criativa')
      .maybeSingle();
      
    if (error) throw error;
    
    if (data) {
      // Se já existe, atualizar
      const { error: updateError } = await supabase
        .from('alertas_email')
        .update({
          ativo: enabled,
          config: { frequency }
        })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
    } else {
      // Se não existe, criar novo
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
    console.error('Erro ao salvar preferências de email:', error);
    throw error;
  }
};

// Função para obter sugestões do calendário
export const getCalendarSuggestions = async (): Promise<CalendarSuggestion[]> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Buscar preferências do usuário
    const { data: userProfile, error: profileError } = await supabase
      .from('perfis')
      .select('equipamentos, observacoes_conteudo')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Erro ao buscar perfil do usuário:', profileError);
      // Continue even if this fails
    }
    
    const userEquipments = userProfile?.equipamentos || [];
    const userObservations = userProfile?.observacoes_conteudo || '';
    
    // Buscar agenda existente no banco
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
      // Converter do formato do banco para o formato da UI
      return agendaItems.map(item => ({
        date: item.data,
        title: item.titulo,
        description: item.descricao || '',
        format: item.formato as "video" | "story" | "image",
        completed: item.status === 'concluido',
        equipment: item.equipamento,
        purpose: item.objetivo,
        hook: item.gancho,
        caption: item.legenda,
        evento_agenda_id: item.id
      }));
    } else {
      // Se não existir agenda, gerar sugestões
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const frequency = 2; // padrão, 2 conteúdos por semana
      const interval = Math.floor(daysInMonth / (frequency * 4)); // distribuir ao longo de 4 semanas
      
      const suggestions: CalendarSuggestion[] = [];
      
      // Tópicos possíveis baseados nas preferências do usuário
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
      
      // Tópicos específicos baseados nas observações do usuário
      let userTopics: string[] = [];
      if (userObservations) {
        // Extrair possíveis tópicos das observações do usuário
        const keywords = ["lipedema", "flacidez", "gordura", "celulite", "rejuvenescimento", "pós-operatório", "drenagem"];
        keywords.forEach(keyword => {
          if (userObservations.toLowerCase().includes(keyword)) {
            userTopics.push(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: tratamentos e cuidados`);
          }
        });
      }
      
      // Combinar tópicos
      const topics = userTopics.length > 0 ? [...userTopics, ...possibleTopics] : possibleTopics;
      
      // Equipamento selecionado ou equipamentos do usuário
      const equipments = userEquipments.length > 0 ? 
          userEquipments : 
          ["Adélla", "Enygma", "Hipro", "Reverso", "Ultralift"];
      
      // Tipos de conteúdo permitidos
      const availableFormats: Array<"video" | "story" | "image"> = ["video", "story", "image"];
      
      // Criar sugestões para cada dia selecionado
      for (let i = 1; i <= frequency * 4; i++) {
        const day = i * interval;
        if (day <= daysInMonth) {
          // Selecionar um formato aleatório
          const randomFormat = availableFormats[Math.floor(Math.random() * availableFormats.length)];
          
          // Definir tipo de script com base no formato
          const scriptType: ScriptType = randomFormat === "video" ? "videoScript" : 
                                        randomFormat === "story" ? "dailySales" : "bigIdea";
          
          // Selecionar um tópico aleatório
          const randomTopic = topics[Math.floor(Math.random() * topics.length)];
          
          // Selecionar um equipamento aleatório
          const randomEquipment = equipments[Math.floor(Math.random() * equipments.length)];
          
          // Definir o objetivo com base no tipo de script
          const purpose = scriptType === "videoScript" ? "educate" : 
                        scriptType === "bigIdea" ? "engage" : "sell";
          
          // Ganchos criativos baseados no tipo
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
          
          // Selecionar um gancho aleatório
          const randomHook = hooks[scriptType][Math.floor(Math.random() * hooks[scriptType].length)];
          
          // Criar a sugestão
          suggestions.push({
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
            caption: scriptType === "dailySales" ? "Toque para mais informações! ↗️ #saude #beleza" : undefined
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

// Função para limpar o planejamento do calendário
export const clearCalendarPlanning = async (): Promise<void> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Definir intervalo de datas para o mês atual
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    // Excluir todos os itens da agenda para o mês selecionado
    const { error } = await supabase
      .from('agenda')
      .delete()
      .eq('usuario_id', userId)
      .gte('data', startDate.toISOString().split('T')[0])
      .lte('data', endDate.toISOString().split('T')[0]);
      
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao limpar planejamento do calendário:', error);
    throw error;
  }
};

// Função para aprovar o planejamento do calendário
export const approveCalendarPlanning = async (
  suggestions: CalendarSuggestion[]
): Promise<void> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Criar ou atualizar itens da agenda com status "aprovado"
    const agendaItems = suggestions.map(suggestion => ({
      usuario_id: userId,
      data: suggestion.date,
      titulo: suggestion.title,
      tipo: suggestion.type || 'videoScript', // Use o tipo fornecido ou padrão
      descricao: suggestion.description,
      status: 'aprovado',
      equipamento: suggestion.equipment,
      objetivo: suggestion.purpose,
      formato: suggestion.format,
      gancho: suggestion.hook,
      legenda: suggestion.caption
    }));
    
    // Remover itens existentes para o mês atual
    await clearCalendarPlanning();
    
    // Inserir novos itens aprovados
    const { error } = await supabase
      .from('agenda')
      .insert(agendaItems);
      
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao aprovar planejamento do calendário:', error);
    throw error;
  }
};

// Função para atualizar preferências do calendário
export const updateCalendarPreferences = async (
  preferences: CalendarPreferences
): Promise<boolean> => {
  try {
    // Esta função apenas armazena as preferências temporariamente
    // Em uma aplicação real, você poderia armazenar isso no banco de dados
    
    // No caso, não precisamos armazenar nada no banco já que usamos
    // as preferências diretamente na chamada de getCalendarSuggestions
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar preferências do calendário:', error);
    throw error;
  }
};
