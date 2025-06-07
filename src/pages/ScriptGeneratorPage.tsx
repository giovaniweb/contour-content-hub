
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { ScriptGeneratorState, GeneratedScript } from '@/types/script';
import GeneratingStep from '@/components/script-generator/GeneratingStep';
import SmartScriptGenerator from '@/components/smart-script-generator/SmartScriptGenerator';
import SmartResultDisplay from '@/components/smart-script-generator/SmartResultDisplay';
import { ScriptGenerationData, GeneratedContent } from '@/components/smart-script-generator/types';
import { generateScript } from '@/services/supabaseService';
import type { MarketingObjectiveType } from '@/types/script';

const ScriptGeneratorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'smartInput' | 'generating' | 'result' | 'smartResult'>('smartInput');
  const [generationData, setGenerationData] = useState<ScriptGenerationData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSmartGenerate = async (data: ScriptGenerationData) => {
    setGenerationData(data);
    setStep('generating');
    
    try {
      // Preparar requisição correta para a API
      const scriptRequest = {
        type: data.contentType === 'video' ? 'videoScript' : data.contentType === 'bigIdea' ? 'bigIdea' : 'dailySales',
        topic: data.theme,
        tone: data.style.toLowerCase(),
        marketingObjective: mapObjectiveToMarketingType(data.objective),
        additionalInfo: buildAdditionalInfo(data),
        // Novos parâmetros para SmartScriptGenerator
        contentType: data.contentType,
        objective: data.objective,
        channel: data.channel,
        style: data.style,
        mentor: data.selectedMentor
      };

      console.log('Enviando requisição para API:', scriptRequest);

      const response = await generateScript(scriptRequest);
      
      console.log('Resposta da API recebida:', response);
      
      const smartContent: GeneratedContent = {
        type: data.contentType,
        content: response.content,
        mentor: getMentorName(data.selectedMentor),
        suggestions: getSuggestionsForType(data.contentType)
      };

      setGeneratedContent(smartContent);
      setStep('smartResult');

      toast({
        title: "Roteiro gerado com sucesso!",
        description: `Conteúdo ${data.contentType} criado com base no estilo ${getMentorName(data.selectedMentor)}.`,
      });

    } catch (error) {
      console.error('Erro ao gerar roteiro:', error);
      
      // Fallback para conteúdo mock em caso de erro
      const mockContent = generateMockContent(data);
      setGeneratedContent(mockContent);
      setStep('smartResult');

      toast({
        title: "Roteiro gerado (modo simulado)",
        description: "Houve um problema com a API, mas geramos um conteúdo de exemplo.",
        variant: "destructive",
      });
    }
  };

  const buildAdditionalInfo = (data: ScriptGenerationData): string => {
    const parts = [
      `Canal: ${data.channel}`,
      `Estilo: ${data.style}`,
      `Mentor: ${getMentorName(data.selectedMentor)}`,
      `Objetivo: ${data.objective}`
    ];
    
    if (data.additionalNotes) {
      parts.push(`Observações: ${data.additionalNotes}`);
    }
    
    return parts.join('\n');
  };

  const mapObjectiveToMarketingType = (objective: string): MarketingObjectiveType => {
    if (objective.includes('Vender')) return '🔴 Fazer Comprar';
    if (objective.includes('Atrair')) return '🟡 Atrair Atenção';
    if (objective.includes('Engajar')) return '🟢 Criar Conexão';
    if (objective.includes('autoridade')) return '🟢 Criar Conexão';
    if (objective.includes('leads')) return '🟡 Atrair Atenção';
    return '🟢 Criar Conexão';
  };

  const getMentorName = (mentorId: string): string => {
    const mentors: Record<string, string> = {
      'leandro_ladeira': 'Leandro Ladeira',
      'icaro_carvalho': 'Ícaro de Carvalho',
      'paulo_cuenca': 'Paulo Cuenca',
      'pedro_sobral': 'Pedro Sobral',
      'camila_porto': 'Camila Porto',
      'hyeser_souza': 'Hyeser Souza',
      'washington_olivetto': 'Washington Olivetto'
    };
    return mentors[mentorId] || 'Mentor Especializado';
  };

  const getSuggestionsForType = (type: string) => {
    return {
      generateImage: type === 'image' || type === 'carousel',
      generateVoice: type === 'video' || type === 'stories',
      relatedVideos: type === 'video' ? ['video-related-1', 'video-related-2'] : undefined
    };
  };

  const generateMockContent = (data: ScriptGenerationData): GeneratedContent => {
    let mockContent = '';
    
    switch (data.contentType) {
      case 'bigIdea':
        mockContent = `1. ${data.theme}: A verdade que ninguém te conta
2. 3 erros fatais sobre ${data.theme.toLowerCase()} que estão sabotando seus resultados  
3. Por que ${data.theme.toLowerCase()} não funciona para 90% das pessoas
4. O método secreto dos profissionais para ${data.theme.toLowerCase()}
5. ${data.theme}: Antes vs Depois - transformação real em 30 dias`;
        break;
        
      case 'carousel':
        mockContent = `SLIDE 1 - CAPA:
${data.theme}
"A transformação que você precisa ver"

SLIDE 2 - PROBLEMA:
"Você já tentou de tudo e nada funcionou?"

SLIDE 3 - SOLUÇÃO:
"Descobri o método que realmente funciona"

SLIDE 4 - BENEFÍCIOS:
"Resultados reais em [tempo]"

SLIDE 5 - CTA:
"Quer saber como? Manda DM que eu explico!"`;
        break;
        
      case 'image':
        mockContent = `TÍTULO PRINCIPAL:
${data.theme}

SUBTÍTULO:
A solução definitiva que você estava procurando

TEXTO PRINCIPAL:
Descubra o método que já transformou milhares de vidas

CTA:
👆 Toque para mais informações
📩 Envie DM para saber mais

HASHTAGS:
#${data.theme.toLowerCase().replace(/\s+/g, '')} #resultados #transformacao #sucesso #dicas`;
        break;
        
      case 'video':
        mockContent = `🎬 Gancho:
"Se você ainda não conseguiu [resultado desejado], é porque ninguém te contou isso..."

🎯 Conflito:
"A maioria das pessoas tenta [método comum] e falha porque não sabem do segredo que vou revelar agora."

🔁 Virada:
"O verdadeiro segredo do ${data.theme.toLowerCase()} é [solução específica]. Quando descobri isso, tudo mudou."

📣 CTA:
"Manda DM que eu te explico o passo a passo completo!"`;
        break;
        
      case 'stories':
        mockContent = `STORIES 1:
"Você sabia que..."
[Gancho sobre o tema]

STORIES 2:
"Eu descobri que..."
[Revelação interessante]

STORIES 3:
"E o resultado foi..."
[Demonstração do benefício]

STORIES 4:
"Quer saber mais?"
[CTA para DM ou link]`;
        break;
        
      default:
        mockContent = `Conteúdo ${data.contentType} sobre ${data.theme} no estilo ${getMentorName(data.selectedMentor)}`;
    }
    
    return {
      type: data.contentType,
      content: mockContent,
      mentor: getMentorName(data.selectedMentor),
      suggestions: getSuggestionsForType(data.contentType)
    };
  };

  const handleGenerateImage = () => {
    toast({
      title: "Geração de imagem",
      description: "Funcionalidade de geração de imagem com IA será implementada em breve.",
    });
  };

  const handleGenerateVoice = () => {
    toast({
      title: "Geração de voz",
      description: "Funcionalidade de geração de voz com ElevenLabs será implementada em breve.",
    });
  };

  const handleNewScript = () => {
    setStep('smartInput');
    setGenerationData(null);
    setGeneratedContent(null);
  };

  const handleCopyScript = () => {
    if (!generatedScript) return;
    
    const scriptText = `
🎬 Roteiro Fluida – Intenção: ${generatedScript.title}

1. Título: ${generatedScript.title}
2. Abertura: ${generatedScript.opening}
3. Parte principal: ${generatedScript.body}
4. Fechamento: ${generatedScript.closing}
5. Visual sugerido: ${generatedScript.visualSuggestion}
6. Duração: ${generatedScript.duration}
7. Frase final: ${generatedScript.finalPhrase}
🧠 SCORE antes: ${generatedScript.initialScore}/10

✨ Versão refinada:
${generatedScript.refinedScript}

🌟 SCORE após validação: ${generatedScript.finalScore}/10
    `;
    
    navigator.clipboard.writeText(scriptText);
    toast({
      title: "Roteiro copiado!",
      description: "O texto foi copiado para a área de transferência.",
    });
  };

  return (
    <Layout title="Gerador de Roteiros" fullWidth={false}>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        {step === 'smartInput' && (
          <SmartScriptGenerator
            onGenerate={handleSmartGenerate}
            isGenerating={false}
          />
        )}
        
        {step === 'generating' && <GeneratingStep />}
        
        {step === 'smartResult' && generationData && generatedContent && (
          <SmartResultDisplay
            generationData={generationData}
            generatedContent={generatedContent}
            onGenerateImage={handleGenerateImage}
            onGenerateVoice={handleGenerateVoice}
            onNewScript={handleNewScript}
          />
        )}
      </div>
    </Layout>
  );
};

export default ScriptGeneratorPage;
