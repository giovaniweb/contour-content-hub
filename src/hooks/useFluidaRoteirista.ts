
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateScript } from '@/services/supabaseService';
import { useClinicSegmentation } from './useClinicSegmentation';
import { useDiagnosticPersistence } from './useDiagnosticPersistence';

interface FluidaScriptRequest {
  tema: string;
  equipamentos: string[];
  objetivo?: string;
  mentor?: string;
  formato?: 'carrossel' | 'stories' | 'imagem';
}

interface FluidaScriptResult {
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
}

// Interface para dados do diagnóstico
interface DiagnosticData {
  clinicType?: string;
  medicalSpecialty?: string;
  aestheticFocus?: string;
  medicalBestSeller?: string;
  aestheticBestSeller?: string;
  medicalTicket?: string;
  aestheticTicket?: string;
  targetAudience?: string;
  medicalClinicStyle?: string;
  aestheticClinicStyle?: string;
  communicationStyle?: string;
}

export const useFluidaRoteirista = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<FluidaScriptResult[]>([]);
  const { currentSession } = useDiagnosticPersistence();

  const generateFluidaScript = async (request: FluidaScriptRequest): Promise<FluidaScriptResult[]> => {
    console.log('🎬 FLUIDAROTEIRISTA - Iniciando geração', request);
    
    setIsGenerating(true);
    
    try {
      // Usar dados do diagnóstico se disponível, com verificação de tipos
      const diagnosticData: DiagnosticData = currentSession?.state || {};
      const clinicType = diagnosticData.clinicType || 'estetico';
      
      // Construir contexto enriquecido com verificações seguras
      const enrichedContext = {
        tipo_de_clinica: clinicType,
        especialidade: diagnosticData.medicalSpecialty || diagnosticData.aestheticFocus || '',
        equipamentos: request.equipamentos.join(', '),
        protocolo: diagnosticData.medicalBestSeller || diagnosticData.aestheticBestSeller || '',
        ticket_medio: diagnosticData.medicalTicket || diagnosticData.aestheticTicket || '',
        publico_ideal: diagnosticData.targetAudience || '',
        estilo_clinica: diagnosticData.medicalClinicStyle || diagnosticData.aestheticClinicStyle || '',
        estilo_linguagem: diagnosticData.communicationStyle || '',
        mentor_nome: request.mentor || 'Criativo'
      };

      // Prompt FLUIDAROTEIRISTA
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
        
        FORMATO: ${request.formato || 'carrossel'}
        
        Retorne APENAS JSON válido:
        {
          "roteiro": "Conteúdo do roteiro",
          "formato": "carrossel/stories/imagem",
          "emocao_central": "esperança/confiança/urgência/etc",
          "intencao": "atrair/vender/educar/conectar",
          "objetivo": "Objetivo específico do post",
          "mentor": "Nome do mentor usado"
        }
      `;

      const userPrompt = `
        Tema: ${request.tema}
        Objetivo: ${request.objetivo || 'Atrair novos clientes'}
        
        Crie um roteiro seguindo o modelo FLUIDAROTEIRISTA.
      `;

      const response = await generateScript({
        type: 'custom',
        systemPrompt,
        userPrompt,
        topic: request.tema,
        additionalInfo: JSON.stringify(enrichedContext),
        tone: enrichedContext.estilo_linguagem || 'professional',
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
          formato: request.formato || 'carrossel',
          emocao_central: 'confiança',
          intencao: 'atrair',
          objetivo: request.objetivo || 'Atrair novos clientes',
          mentor: request.mentor || 'Criativo'
        };
      }

      const results = [scriptResult]; // Por agora, 1 roteiro por geração
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
        
        Sugestão básica: Fale sobre ${request.tema} e destaque os benefícios únicos dos seus tratamentos com ${request.equipamentos.join(' e ')}.`,
        formato: request.formato || 'carrossel',
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

  const clearResults = () => {
    setResults([]);
  };

  return {
    generateFluidaScript,
    isGenerating,
    results,
    clearResults
  };
};
