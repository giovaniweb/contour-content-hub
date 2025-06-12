
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateScript } from '@/services/supabaseService';
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';

interface FluidaScriptRequest {
  tipo_conteudo: string;
  objetivo: string;
  canal: string;
  estilo: string;
  equipamento?: string;
  tema: string;
  conversa?: any[];
}

interface FluidaScriptResult {
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
}

export const useFluidaScript = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<FluidaScriptResult[]>([]);
  const { currentSession } = useDiagnosticPersistence();

  const generateFluidaScript = async (request: FluidaScriptRequest): Promise<FluidaScriptResult[]> => {
    console.log('🎬 FLUIDAROTEIRISTA - Iniciando geração', request);
    
    setIsGenerating(true);
    
    try {
      // Usar dados do diagnóstico se disponível
      const diagnosticData = currentSession?.state || {};
      const clinicType = diagnosticData.clinicType || 'estetico';
      
      // Construir contexto enriquecido
      const enrichedContext = {
        tipo_de_clinica: clinicType,
        especialidade: diagnosticData.medicalSpecialty || diagnosticData.aestheticFocus || '',
        equipamentos: request.equipamento || '',
        protocolo: diagnosticData.medicalBestSeller || diagnosticData.aestheticBestSeller || '',
        ticket_medio: diagnosticData.medicalTicket || diagnosticData.aestheticTicket || '',
        publico_ideal: diagnosticData.targetAudience || '',
        estilo_clinica: diagnosticData.medicalClinicStyle || diagnosticData.aestheticClinicStyle || '',
        estilo_linguagem: diagnosticData.communicationStyle || '',
        mentor_nome: 'FLUIDAROTEIRISTA'
      };

      // Prompt FLUIDAROTEIRISTA completo
      const systemPrompt = `
        Você é o FLUIDAROTEIRISTA — roteirista oficial da plataforma para clínicas estéticas e médicas.
        
        Sua missão é gerar roteiros criativos, impactantes e prontos para redes sociais.
        
        Contexto da clínica:
        - Tipo: ${enrichedContext.tipo_de_clinica}
        - Especialidade: ${enrichedContext.especialidade}
        - Equipamentos: ${enrichedContext.equipamentos}
        - Protocolo mais vendido: ${enrichedContext.protocolo}
        - Ticket médio: ${enrichedContext.ticket_medio}
        - Público ideal: ${enrichedContext.publico_ideal}
        - Estilo da clínica: ${enrichedContext.estilo_clinica}
        - Mentor: ${enrichedContext.mentor_nome}
        
        ESTRUTURA OBRIGATÓRIA:
        1. Gancho (capturar atenção)
        2. Conflito (apresentar problema)
        3. Virada (mostrar solução)
        4. CTA (chamada para ação)
        
        FORMATO: ${request.tipo_conteudo || 'carrossel'}
        
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
        Tema: ${request.tema}
        Tipo de conteúdo: ${request.tipo_conteudo}
        Objetivo: ${request.objetivo || 'Atrair novos clientes'}
        Canal: ${request.canal || 'Instagram'}
        Estilo: ${request.estilo || 'Criativo'}
        
        Crie um roteiro seguindo o modelo FLUIDAROTEIRISTA com estrutura clara e impactante.
      `;

      const response = await generateScript({
        type: 'custom',
        systemPrompt,
        userPrompt,
        topic: request.tema,
        additionalInfo: JSON.stringify(enrichedContext),
        tone: request.estilo || 'professional',
        marketingObjective: request.objetivo as any
      });

      // Tentar parsear como JSON
      let scriptResult: FluidaScriptResult;
      try {
        scriptResult = JSON.parse(response.content);
      } catch {
        // Fallback se não for JSON válido
        scriptResult = {
          roteiro: response.content,
          formato: request.tipo_conteudo || 'carrossel',
          emocao_central: 'confiança',
          intencao: 'atrair',
          objetivo: request.objetivo || 'Atrair novos clientes',
          mentor: 'FLUIDAROTEIRISTA'
        };
      }

      const results = [scriptResult];
      setResults(results);

      toast({
        title: "🎬 Roteiro FLUIDA gerado!",
        description: `Criado com ${scriptResult.mentor} - ${scriptResult.formato}`,
      });

      return results;

    } catch (error) {
      console.error('❌ Erro no FLUIDAROTEIRISTA:', error);
      
      // Sistema de fallback
      const fallbackScript: FluidaScriptResult = {
        roteiro: `Roteiro não pôde ser gerado agora. Suas respostas foram salvas.
        
Sugestão básica: Fale sobre ${request.tema} e destaque os benefícios únicos dos seus tratamentos.

📱 Slide 1: Gancho sobre ${request.tema}
📱 Slide 2: Problema que seu público enfrenta  
📱 Slide 3: Solução que sua clínica oferece
📱 Slide 4: CTA para agendar consulta`,
        formato: request.tipo_conteudo || 'carrossel',
        emocao_central: 'confiança',
        intencao: 'educar',
        objetivo: 'Manter engajamento',
        mentor: 'Básico'
      };

      setResults([fallbackScript]);

      toast({
        title: "⚠️ Modo Fallback",
        description: "Sistema básico ativado. Tente novamente em instantes.",
        variant: "destructive"
      });

      return [fallbackScript];

    } finally {
      setIsGenerating(false);
    }
  };

  const applyDisneyMagic = async (script: any) => {
    setIsGenerating(true);
    
    try {
      // Prompt Disney 1928 em 5 partes
      const disneySystemPrompt = `
        Assuma a identidade de Walt Disney em seu estúdio em 1928, criando narrativas mágicas e emocionais.
        
        Transform o roteiro usando a estrutura clássica Disney:
        
        🏰 Era uma vez... (situação inicial que gera identificação)
        ⚡ Até que um dia... (conflito/problema que muda tudo)  
        ✨ Então ela descobriu... (solução mágica/transformação)
        🌟 E eles viveram felizes... (resultado final inspirador)
        
        Adicione:
        - Elemento Disney Único (metáfora mágica)
        - Lição Universal (aprendizado inspirador)
        - Assinatura Disney 1928 (frase motivacional final)
        
        Mantenha o mesmo objetivo comercial, mas com alma emocional Disney.
        Não cite Disney ou IA no resultado.
        
        Retorne JSON:
        {
          "roteiro": "Roteiro transformado com magia Disney",
          "formato": "${script.formato}",
          "emocao_central": "encantamento", 
          "intencao": "inspirar",
          "objetivo": "Transformar vidas",
          "mentor": "Fluida Encantadora"
        }
      `;

      const disneyUserPrompt = `
        Roteiro original para transformar:
        ${script.roteiro}
        
        Contexto:
        - Tipo: ${script.formato}
        - Objetivo: ${script.objetivo}
        - Emoção atual: ${script.emocao_central}
        
        Transforme com a magia Disney 1928 mantendo o propósito comercial.
      `;

      const response = await generateScript({
        type: 'custom',
        systemPrompt: disneySystemPrompt,
        userPrompt: disneyUserPrompt,
        topic: 'Transformação Disney',
        additionalInfo: 'Disney Magic 1928',
        tone: 'magical',
        marketingObjective: 'inspire' as any
      });

      let disneyScript;
      try {
        disneyScript = JSON.parse(response.content);
      } catch {
        disneyScript = {
          ...script,
          roteiro: response.content,
          emocao_central: 'encantamento',
          mentor: 'Fluida Encantadora'
        };
      }

      // Substituir script atual
      setResults(prev => prev.map((s, i) => i === 0 ? disneyScript : s));

      toast({
        title: "✨ Magia Disney 1928 Aplicada!",
        description: "Walt Disney transformou seu roteiro com narrativa encantadora."
      });

    } catch (error) {
      console.error('❌ Erro na transformação Disney:', error);
      toast({
        title: "Erro na transformação",
        description: "Não foi possível aplicar a magia Disney.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async (script: any) => {
    toast({
      title: "🖼️ Gerando imagem...",
      description: "Sua arte está sendo criada pela IA!"
    });
    // TODO: Implementar geração de imagem real
  };

  const generateAudio = async (script: any) => {
    toast({
      title: "🎧 Gerando áudio...",
      description: "Sua narração encantadora está sendo criada!"
    });
    // TODO: Implementar geração de áudio com ElevenLabs
  };

  const clearResults = () => {
    setResults([]);
  };

  return {
    generateScript: generateFluidaScript,
    applyDisneyMagic,
    generateImage,
    generateAudio,
    isGenerating,
    results,
    clearResults
  };
};
