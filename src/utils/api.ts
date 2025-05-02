
import { supabase } from '@/integrations/supabase/client';

export type ScriptType = 'videoScript' | 'bigIdea' | 'dailySales';
export type MarketingObjectiveType = 'atrair_atencao' | 'criar_conexao' | 'fazer_comprar' | 'reativar_interesse' | 'fechar_agora';

export interface ScriptResponse {
  id: string;
  title: string;
  content: string;
  type: ScriptType;
  equipment?: string;
  createdAt: string;
  updatedAt?: string;
  marketingObjective?: string;
  suggestedVideos?: {
    title: string;
    thumbnailUrl?: string;
    duration: string;
  }[];
  captionTips?: string[];
  pdf_url?: string;
}

export interface ScriptRequest {
  type: ScriptType;
  topic: string;
  title?: string;
  equipment?: string[];
  bodyArea?: string;
  purpose?: string[];
  additionalInfo?: string;
  tone?: string;
  language?: string;
  marketingObjective?: MarketingObjectiveType;
}

export interface ScriptHistoryItem {
  id: string;
  title: string;
  content: string;
  contentHtml: string;
  type: ScriptType;
  status: string;
  createdAt: string;
  updatedAt?: string;
  equipment?: string;
  marketingObjective?: string;
  observation?: string;
  pdf_url?: string;
  evento_agenda_id?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  type: string;
  equipment: string[];
  bodyArea: string[];
  purpose: string[];
  duration?: string;
  rating: number;
  isFavorite: boolean;
}

export interface CalendarSuggestion {
  date: string;
  title: string;
  description: string;
  format: 'video' | 'image' | 'story';
  hook?: string;
  caption?: string;
  equipment?: string;
  purpose?: string;
  completed?: boolean;
  evento_agenda_id?: string;
  type?: ScriptType;
}

export interface CalendarPreferences {
  postFrequency: string;
  preferredDays: string[];
  preferredTimes: string[];
  contentTypes: { video: boolean; story: boolean; image: boolean; };
  frequency?: number;
  equipment?: string;
}

export const generateScript = async (
  request: ScriptRequest
): Promise<ScriptResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-script', {
      body: request
    });

    if (error) {
      console.error('Erro ao gerar script:', error);
      throw error;
    }

    return data as ScriptResponse;
  } catch (error) {
    console.error('Erro ao chamar a função generate-script:', error);
    throw error;
  }
};

// Gerar PDF do roteiro
export const generatePDF = async (scriptId: string): Promise<string> => {
  try {
    // Obter dados do roteiro para enviar para a função de geração do PDF
    const scriptData = await getScriptById(scriptId);
    
    if (!scriptData) {
      throw new Error('Roteiro não encontrado');
    }
    
    console.log(`Enviando solicitação para gerar PDF do roteiro ${scriptId}`);
    
    // Chamar edge function para gerar o PDF
    const { data, error } = await supabase.functions.invoke('generate-pdf', {
      body: {
        scriptId,
        content: scriptData.content,
        title: scriptData.title,
        type: scriptData.type
      }
    });
    
    if (error) {
      console.error('Erro na chamada da função generate-pdf:', error);
      throw error;
    }
    
    if (!data || !data.pdfUrl) {
      throw new Error('URL do PDF não retornada');
    }
    
    console.log('PDF gerado com sucesso:', data.pdfUrl);
    
    // Aqui normalmente atualizaríamos o banco de dados com a URL do PDF
    // Por simplicidade, vamos apenas retornar a URL
    return data.pdfUrl;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};

export const submitFeedback = async (scriptId: string, feedback: string, approved: boolean): Promise<void> => {
  try {
    console.log(`Submitting feedback for script ${scriptId}: ${feedback} - Approved: ${approved}`);
    // Aqui você pode adicionar a lógica para enviar o feedback para o seu backend
    // ou armazená-lo em um banco de dados.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula uma chamada de API
    console.log('Feedback enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    throw error;
  }
};

export const rejectScript = async (scriptId: string): Promise<void> => {
  try {
    console.log(`Rejecting script with ID: ${scriptId}`);
    // Aqui você pode adicionar a lógica para rejeitar o script e solicitar uma nova geração
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula uma chamada de API
    console.log('Script rejeitado com sucesso!');
  } catch (error) {
    console.error('Erro ao rejeitar script:', error);
    throw error;
  }
};

export const getScriptById = async (scriptId: string): Promise<ScriptResponse> => {
  // Aqui normalmente buscaríamos o roteiro do banco de dados
  // Por simplicidade, vamos retornar um objeto simulado
  return {
    id: scriptId,
    title: "Roteiro de exemplo",
    content: "Conteúdo do roteiro...",
    type: "videoScript",
    createdAt: new Date().toISOString(),
    marketingObjective: "atrair_atencao",
    equipment: "Unyque PRO"
  };
};

// Vincular roteiro ao evento da agenda
export const linkScriptToCalendar = async (scriptId: string, eventId: string): Promise<boolean> => {
  try {
    console.log(`Vinculando roteiro ${scriptId} ao evento ${eventId}`);
    // Aqui simularemos uma atualização bem-sucedida
    // Em um caso real, faríamos uma chamada à API para atualizar o banco de dados
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulando uma chamada de rede
    
    return true;
  } catch (error) {
    console.error('Erro ao vincular roteiro à agenda:', error);
    return false;
  }
};

// Add missing functions to fix errors

export const saveScriptFeedback = async (
  scriptId: string, 
  feedback: string, 
  approved: boolean
): Promise<void> => {
  try {
    console.log(`Saving feedback for script ${scriptId}: ${feedback} - Approved: ${approved}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Feedback saved successfully');
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
};

export const updateScript = async (
  scriptId: string, 
  newContent: string,
  feedback?: string,
  status?: string
): Promise<void> => {
  try {
    console.log(`Updating script ${scriptId} with new content`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Script updated successfully');
  } catch (error) {
    console.error('Error updating script:', error);
    throw error;
  }
};

export const getScriptHistory = async (): Promise<ScriptHistoryItem[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      {
        id: '1',
        title: 'Roteiro para vídeo sobre Unyque PRO',
        content: 'Conteúdo do roteiro...',
        contentHtml: '<p>Conteúdo do roteiro formatado como HTML...</p>',
        type: 'videoScript',
        status: 'aprovado',
        createdAt: new Date().toISOString(),
        equipment: 'Unyque PRO',
        marketingObjective: 'atrair_atencao',
        pdf_url: 'https://example.com/pdf/script1.pdf',
        evento_agenda_id: '123',
        observation: 'Observações sobre o roteiro'
      },
      {
        id: '2',
        title: 'Campanha para Venus Freeze',
        content: 'Conteúdo da campanha...',
        contentHtml: '<p>Conteúdo da campanha formatado como HTML...</p>',
        type: 'bigIdea',
        status: 'gerado',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        equipment: 'Venus Freeze',
        marketingObjective: 'fazer_comprar'
      }
    ];
  } catch (error) {
    console.error('Error fetching script history:', error);
    throw error;
  }
};

export const getMediaItems = async (): Promise<MediaItem[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      {
        id: '1',
        title: 'Como funciona o Unyque PRO',
        description: 'Vídeo explicativo sobre o equipamento',
        thumbnailUrl: 'https://placehold.co/600x400',
        videoUrl: 'https://vimeo.com/123456789',
        type: 'video_pronto',
        equipment: ['Unyque PRO'],
        bodyArea: ['Face', 'Pescoço'],
        purpose: ['educação', 'vendas'],
        duration: '2:30',
        rating: 4.5,
        isFavorite: true
      },
      {
        id: '2',
        title: 'Take rápido sobre Venus Freeze',
        description: 'Take sobre benefícios do tratamento',
        thumbnailUrl: 'https://placehold.co/600x400',
        videoUrl: 'https://vimeo.com/123456790',
        type: 'take',
        equipment: ['Venus Freeze'],
        bodyArea: ['Abdômen'],
        purpose: ['engajamento'],
        duration: '0:45',
        rating: 3.5,
        isFavorite: false
      }
    ];
  } catch (error) {
    console.error('Error fetching media items:', error);
    throw error;
  }
};

export const toggleFavorite = async (mediaId: string): Promise<void> => {
  try {
    console.log(`Toggling favorite for media ${mediaId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const rateMedia = async (mediaId: string, rating: number): Promise<void> => {
  try {
    console.log(`Rating media ${mediaId} with ${rating} stars`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.error('Error rating media:', error);
    throw error;
  }
};

export const getCalendarSuggestions = async (): Promise<CalendarSuggestion[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return [
      {
        date: today.toISOString().split('T')[0],
        title: 'Vídeo sobre benefícios do Unyque PRO',
        description: 'Explique os principais benefícios do equipamento para tratamentos estéticos',
        format: 'video',
        hook: 'Sabia que apenas 3 sessões já mostram resultados?',
        caption: 'Conheça o poder transformador do Unyque PRO! #estetica #beleza',
        equipment: 'Unyque PRO',
        purpose: 'educate',
        completed: false,
        type: 'videoScript'
      },
      {
        date: tomorrow.toISOString().split('T')[0],
        title: 'Story mostrando antes e depois',
        description: 'Compartilhe resultados reais de clientes com consentimento',
        format: 'story',
        hook: 'Transformação incrível em apenas 30 dias!',
        equipment: 'Venus Freeze',
        purpose: 'engage',
        completed: true,
        evento_agenda_id: '123',
        type: 'dailySales'
      },
      {
        date: nextWeek.toISOString().split('T')[0],
        title: 'Promoção limitada de tratamentos',
        description: 'Anuncie pacote promocional com desconto por tempo limitado',
        format: 'image',
        caption: 'ÚLTIMA CHANCE! Pacote com 50% OFF só até sexta-feira. Agende já!',
        equipment: 'Unyque PRO',
        purpose: 'sell',
        completed: false,
        type: 'bigIdea'
      }
    ];
  } catch (error) {
    console.error('Error fetching calendar suggestions:', error);
    throw error;
  }
};

export const updateCalendarCompletion = async (
  date: string, 
  completed: boolean
): Promise<void> => {
  try {
    console.log(`Updating calendar task on ${date} to ${completed ? 'completed' : 'pending'}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.error('Error updating calendar completion:', error);
    throw error;
  }
};

export const clearPlanning = async (): Promise<void> => {
  try {
    console.log('Clearing all planning data');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('Error clearing planning:', error);
    throw error;
  }
};

export const approvePlanning = async (): Promise<void> => {
  try {
    console.log('Approving current planning');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('Error approving planning:', error);
    throw error;
  }
};

export const setCalendarPreferences = async (
  preferences: CalendarPreferences
): Promise<void> => {
  try {
    console.log('Setting calendar preferences:', preferences);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('Error setting calendar preferences:', error);
    throw error;
  }
};

export const getEquipments = async (): Promise<any[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data converted to match Equipment type in types/equipment.ts
    return [
      {
        id: '1',
        nome: 'Unyque PRO',
        tecnologia: 'Radiofrequência',
        indicacoes: 'Equipamento avançado de radiofrequência para tratamentos estéticos',
        beneficios: 'Resultados rápidos e duradouros',
        diferenciais: 'Tecnologia exclusiva',
        linguagem: 'Técnica',
        ativo: true
      },
      {
        id: '2',
        nome: 'Venus Freeze',
        tecnologia: 'Criolipólise',
        indicacoes: 'Equipamento para tratamento de gordura localizada',
        beneficios: 'Redução de medidas',
        diferenciais: 'Sem dor durante o procedimento',
        linguagem: 'Simples',
        ativo: true
      }
    ];
  } catch (error) {
    console.error('Error fetching equipments:', error);
    throw error;
  }
};

export const createEquipment = async (equipment: any): Promise<any> => {
  try {
    console.log('Creating new equipment:', equipment);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: Date.now().toString(), ...equipment };
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
};

export const updateEquipment = async (equipment: any): Promise<any> => {
  try {
    console.log(`Updating equipment ${equipment.id}:`, equipment);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return equipment;
  } catch (error) {
    console.error(`Error updating equipment ID ${equipment.id}:`, error);
    throw error;
  }
};

export const deleteEquipment = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting equipment ${id}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error(`Error deleting equipment ID ${id}:`, error);
    throw error;
  }
};

export const importEquipments = async (file: File): Promise<{imported: number, total: number}> => {
  try {
    console.log(`Importing equipments from file ${file.name}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { imported: 5, total: 5 };
  } catch (error) {
    console.error('Error importing equipments:', error);
    throw error;
  }
};
