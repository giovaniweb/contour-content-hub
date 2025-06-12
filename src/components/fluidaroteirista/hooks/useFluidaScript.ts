
import { useState } from 'react';
import { toast } from 'sonner';

interface FluidaScriptData {
  tipo_conteudo: string;
  objetivo: string;
  canal: string;
  estilo: string;
  equipamento: string;
  tema: string;
}

export const useFluidaScript = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateScript = async (data: FluidaScriptData) => {
    console.log('🚀 [useFluidaScript] Iniciando geração de roteiro');
    setIsGenerating(true);
    
    try {
      const systemPrompt = `
        Você é o FLUIDAROTEIRISTA — roteirista oficial da plataforma para clínicas estéticas e médicas.
        
        Sua missão é gerar roteiros criativos, impactantes e prontos para redes sociais.
        
        Contexto da clínica:
        - Tipo: estetico
        - Especialidade: 
        - Equipamentos: ${data.equipamento}
        - Protocolo mais vendido: 
        - Ticket médio: 
        - Público ideal: 
        - Estilo da clínica: 
        - Mentor: FLUIDAROTEIRISTA
        
        ESTRUTURA OBRIGATÓRIA:
        1. Gancho (capturar atenção)
        2. Conflito (apresentar problema)
        3. Virada (mostrar solução)
        4. CTA (chamada para ação)
        
        FORMATO: ${data.tipo_conteudo}
        
        Retorne APENAS JSON válido:
        {
          "roteiro": "Conteúdo do roteiro estruturado",
          "formato": "carrossel/stories/imagem/video",
          "emocao_central": "esperança/confiança/urgência/etc",
          "intencao": "atrair/vender/educar/conectar",
          "objetivo": "Objetivo específico do post",
          "mentor": "FLUIDAROTEIRISTA"
        }
      `;

      const userPrompt = `
        Tema: ${data.tema}
        Tipo de conteúdo: ${data.tipo_conteudo}
        Objetivo: ${data.objetivo}
        Canal: ${data.canal}
        Estilo: ${data.estilo}
        
        Crie um roteiro seguindo o modelo FLUIDAROTEIRISTA com estrutura clara e impactante.
      `;

      const requestBody = {
        request: {
          type: 'custom',
          systemPrompt,
          userPrompt,
          topic: data.tema,
          additionalInfo: JSON.stringify({
            tipo_de_clinica: 'estetico',
            especialidade: '',
            equipamentos: data.equipamento,
            protocolo: '',
            ticket_medio: '',
            publico_ideal: '',
            estilo_clinica: '',
            estilo_linguagem: '',
            mentor_nome: 'FLUIDAROTEIRISTA'
          }),
          tone: data.estilo,
          marketingObjective: data.objetivo
        }
      };

      console.log('📤 [useFluidaScript] Enviando request:', requestBody);

      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [useFluidaScript] Erro na resposta:', response.status, errorText);
        throw new Error(`Erro na API: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ [useFluidaScript] Resultado recebido:', result);

      // Tentar fazer parse do conteúdo se for JSON
      let scriptData = result;
      if (result.content) {
        try {
          const parsedContent = JSON.parse(result.content);
          scriptData = { ...result, ...parsedContent };
          console.log('🔄 [useFluidaScript] Conteúdo JSON parseado:', scriptData);
        } catch (parseError) {
          console.log('ℹ️ [useFluidaScript] Conteúdo não é JSON, usando como texto');
          scriptData = {
            ...result,
            roteiro: result.content,
            formato: data.tipo_conteudo,
            emocao_central: 'criatividade',
            intencao: data.objetivo,
            objetivo: data.tema,
            mentor: 'FLUIDAROTEIRISTA'
          };
        }
      }

      // Garantir que temos os campos necessários
      if (!scriptData.roteiro && !scriptData.content) {
        console.error('❌ [useFluidaScript] Roteiro vazio');
        throw new Error('Roteiro gerado está vazio');
      }

      setResults([scriptData]);
      console.log('✅ [useFluidaScript] Roteiro salvo nos resultados');
      
      toast.success('✨ Roteiro gerado com sucesso!', {
        description: 'Seu roteiro FLUIDA está pronto para ser usado.'
      });

      return scriptData;

    } catch (error) {
      console.error('🔥 [useFluidaScript] Erro ao gerar roteiro:', error);
      
      toast.error('❌ Erro ao gerar roteiro', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      
      throw error;
    } finally {
      setIsGenerating(false);
      console.log('🏁 [useFluidaScript] Geração finalizada');
    }
  };

  const applyDisneyMagic = async (script: any) => {
    console.log('✨ [useFluidaScript] Aplicando Disney Magic');
    const disneyScript = {
      ...script,
      roteiro: script.roteiro.replace(/tratamento/g, 'jornada de transformação')
        .replace(/procedimento/g, 'ritual de beleza')
        .replace(/resultado/g, 'metamorfose')
        .replace(/cliente/g, 'pessoa especial'),
      emocao_central: 'encantamento',
      mentor: 'Fluida Encantadora'
    };
    
    setResults([disneyScript]);
    toast.success('🏰 Disney Magic aplicada!', {
      description: 'Seu roteiro agora tem a magia Disney.'
    });
  };

  const clearResults = () => {
    console.log('🗑️ [useFluidaScript] Limpando resultados');
    setResults([]);
  };

  const generateImage = async (script: any) => {
    console.log('🖼️ [useFluidaScript] Gerando imagem para script');
    toast.info('🖼️ Geração de imagem', {
      description: 'Funcionalidade em desenvolvimento.'
    });
  };

  const generateAudio = async (script: any) => {
    console.log('🎙️ [useFluidaScript] Gerando áudio para script');
    toast.info('🎙️ Geração de áudio', {
      description: 'Funcionalidade em desenvolvimento.'
    });
  };

  return {
    results,
    isGenerating,
    generateScript,
    applyDisneyMagic,
    clearResults,
    generateImage,
    generateAudio
  };
};
