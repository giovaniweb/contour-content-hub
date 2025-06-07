
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
      // Convert smart generation data to script request format
      const scriptRequest = {
        type: 'videoScript' as const,
        topic: data.theme,
        tone: data.style.toLowerCase(),
        marketingObjective: mapObjectiveToMarketingType(data.objective),
        additionalInfo: `Canal: ${data.channel}\nEstilo: ${data.style}\nMentor: ${data.selectedMentor}\n${data.additionalNotes || ''}`
      };

      const response = await generateScript(scriptRequest);
      
      // Format content based on type
      const formattedContent = formatContentByType(response.content, data.contentType, data);
      
      const smartContent: GeneratedContent = {
        type: data.contentType,
        content: formattedContent,
        mentor: getMentorName(data.selectedMentor),
        suggestions: getSuggestionsForType(data.contentType)
      };

      setGeneratedContent(smartContent);
      setStep('smartResult');

      toast({
        title: "Roteiro gerado com sucesso!",
        description: `Conteúdo ${data.contentType} criado com base no estilo ${data.selectedMentor}.`,
      });

    } catch (error) {
      console.error('Erro ao gerar roteiro:', error);
      
      // Fallback to mock generation
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

  const mapObjectiveToMarketingType = (objective: string): MarketingObjectiveType => {
    if (objective.includes('Vender')) return '🔴 Fazer Comprar';
    if (objective.includes('Atrair')) return '🟡 Atrair Atenção';
    if (objective.includes('Engajar')) return '🟢 Criar Conexão';
    if (objective.includes('autoridade')) return '🟢 Criar Conexão';
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

  const formatContentByType = (content: string, type: string, data: ScriptGenerationData): string => {
    switch (type) {
      case 'bigIdea':
        return generateBigIdeas(data);
      case 'carousel':
        return generateCarouselContent(data);
      case 'image':
        return generateImageContent(data);
      case 'video':
        return formatVideoScript(content);
      case 'stories':
        return generateStoriesContent(data);
      default:
        return content;
    }
  };

  const generateBigIdeas = (data: ScriptGenerationData): string => {
    const ideas = [
      `${data.theme}: A verdade que ninguém te conta`,
      `3 erros fatais sobre ${data.theme.toLowerCase()} que estão sabotando seus resultados`,
      `Por que ${data.theme.toLowerCase()} não funciona para 90% das pessoas`,
      `O método secreto dos profissionais para ${data.theme.toLowerCase()}`,
      `${data.theme}: Antes vs Depois - transformação real em 30 dias`
    ];
    
    return ideas.map((idea, index) => `${index + 1}. ${idea}`).join('\n\n');
  };

  const generateCarouselContent = (data: ScriptGenerationData): string => {
    return `SLIDE 1 - CAPA:
${data.theme}
"A transformação que você precisa ver"

SLIDE 2 - PROBLEMA:
"Você já tentou de tudo e nada funcionou?"

SLIDE 3 - SOLUÇÃO:
"Descobri o método que realmente funciona"

SLIDE 4 - PROVA:
"Resultados reais em [tempo]"

SLIDE 5 - CTA:
"Quer saber como? Manda DM que eu explico!"`;
  };

  const generateImageContent = (data: ScriptGenerationData): string => {
    return `TÍTULO PRINCIPAL:
${data.theme}

SUBTÍTULO:
A solução definitiva que você estava procurando

CALL TO ACTION:
👆 Toque para mais informações
📩 Envie DM para saber mais

HASHTAGS:
#${data.theme.toLowerCase().replace(/\s+/g, '')} #resultados #transformacao`;
  };

  const formatVideoScript = (content: string): string => {
    // Try to identify sections in the content
    if (content.includes('Gancho') || content.includes('🎬')) {
      return content;
    }
    
    // Format as structured video script
    const lines = content.split('\n').filter(line => line.trim());
    const scriptParts = {
      gancho: lines.slice(0, 2).join(' '),
      conflito: lines.slice(2, 4).join(' '),
      virada: lines.slice(4, 6).join(' '),
      cta: lines.slice(-2).join(' ')
    };
    
    return `🎬 Gancho:
${scriptParts.gancho}

🎯 Conflito:
${scriptParts.conflito}

🔁 Virada:
${scriptParts.virada}

📣 CTA:
${scriptParts.cta}`;
  };

  const generateStoriesContent = (data: ScriptGenerationData): string => {
    return `STORIES - ${data.theme}

FRAME 1:
"Você sabia que..."
[Texto chamativo sobre o tema]

FRAME 2:
"Eu descobri que..."
[Revelação interessante]

FRAME 3:
"E o resultado foi..."
[Demonstração do benefício]

FRAME 4:
"Quer saber mais?"
[CTA para DM ou link]`;
  };

  const getSuggestionsForType = (type: string) => {
    return {
      generateImage: type === 'image' || type === 'carousel',
      generateVoice: type === 'video' || type === 'stories',
      relatedVideos: type === 'video' ? ['video-related-1', 'video-related-2'] : undefined
    };
  };

  const generateMockContent = (data: ScriptGenerationData): GeneratedContent => {
    return {
      type: data.contentType,
      content: formatContentByType("Conteúdo gerado com base nos seus parâmetros...", data.contentType, data),
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
