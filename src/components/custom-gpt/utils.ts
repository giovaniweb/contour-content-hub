
import { CustomGptType, CustomGptRequest, generateCustomContent } from "@/utils/custom-gpt";
import { useToast } from "@/hooks/use-toast";
import { MarketingObjectiveType } from "@/types/script";
import { ScriptResponse } from "@/types/script";
import { Equipment } from "@/hooks/useEquipments";
import { CustomGptResult } from './types';

export const getTypeName = (type: CustomGptType): string => {
  switch (type) {
    case "roteiro":
      return "Roteiro";
    case "bigIdea":
      return "Big Idea";
    case "stories":
      return "Stories";
    default:
      return "Conteúdo";
  }
};

export const generateContent = async (
  request: CustomGptRequest, 
  setIsSubmitting: (value: boolean) => void,
  toast: ReturnType<typeof useToast>["toast"],
  onScriptGenerated?: (script: ScriptResponse) => void,
  onResults?: (results: CustomGptResult[]) => void,
  setResults?: React.Dispatch<React.SetStateAction<CustomGptResult[]>>
) => {
  try {
    setIsSubmitting(true);
    
    console.log("Generating content with request:", request);
    
    // Faz a chamada para o custom GPT
    const content = await generateCustomContent(request);
    
    console.log("Content generated successfully:", content.substring(0, 100) + "...");
    
    // Simula um ID gerado para a resposta
    const responseId = `gen-${Date.now()}`;
    
    // Criar um título com base no tipo e no equipamento
    const title = request.topic || `${getTypeName(request.tipo)} sobre ${request.equipamento}`;
    
    // Create script response object if needed
    if (onScriptGenerated) {
      const scriptResponse: ScriptResponse = {
        id: responseId,
        title: title,
        content: content,
        type: request.tipo === 'roteiro' ? 'videoScript' : 
              request.tipo === 'bigIdea' ? 'bigIdea' : 'dailySales',
        createdAt: new Date().toISOString(),
        suggestedVideos: [],
        captionTips: [],
        equipment: request.equipamento,
        marketingObjective: request.marketingObjective,
      };
      
      console.log("Script response object created:", scriptResponse.id);
      onScriptGenerated(scriptResponse);
    }
    
    // Adiciona o resultado à lista de resultados com as novas propriedades
    const newResult: CustomGptResult = {
      id: responseId,
      content: content,
      title: title,
      type: request.tipo,
      equipment: request.equipamento,
      marketingObjective: request.marketingObjective
    };
    
    console.log("Adding new result:", newResult.id);
    
    if (setResults) {
      setResults(prev => [newResult, ...prev]);
    }
    
    // Chama onResults se fornecido
    if (onResults) {
      onResults([newResult]);
    }
    
    // Notifica o usuário
    toast({
      title: "Conteúdo gerado com sucesso",
      description: `O ${getTypeName(request.tipo)} foi criado e está disponível para uso.`,
    });

    return { success: true, content };
  } catch (error) {
    console.error('Erro ao gerar conteúdo:', error);
    toast({
      variant: "destructive",
      title: "Erro ao gerar conteúdo",
      description: "Ocorreu um erro ao tentar gerar o conteúdo personalizado."
    });
    return { success: false, error };
  } finally {
    setIsSubmitting(false);
  }
};

export const findEquipmentName = (equipmentId: string, equipments: Equipment[]): string => {
  const equipment = equipments.find(eq => eq.id === equipmentId);
  return equipment ? equipment.nome : 'equipamento';
};
