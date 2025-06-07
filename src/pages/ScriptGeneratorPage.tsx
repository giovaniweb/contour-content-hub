import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { ScriptGeneratorState, FormData, GeneratedScript } from '@/types/script';
import GeneratingStep from '@/components/script-generator/GeneratingStep';
import ResultStep from '@/components/script-generator/ResultStep';
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

  // Load data from location state if available
  useEffect(() => {
    const state = location.state as ScriptGeneratorState | undefined;
    
    if (state?.ideaText) {
      setFormData({
        idea: state.ideaText,
        objective: state.objective === 'emotion' ? 'emotion' : 'sales',
      });
    } else if (state?.validatedIdea) {
      setFormData({
        idea: state.validatedIdea.topic,
        objective: 'emotion',
      });
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleObjectiveChange = (value: 'emotion' | 'sales') => {
    setFormData((prev) => ({ ...prev, objective: value }));
  };

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
🎬 Roteiro Fluida – Intenção: ${formData.objective === 'emotion' ? 'Emocionar' : 'Vender'}

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

  const generateMockScript = (data: FormData): GeneratedScript => {
    // Mock script generation based on input data
    const isEmotion = data.objective === 'emotion';
    
    // Determine title and content based on the theme
    let title = "";
    let opening = "";
    let body = "";
    let closing = "";
    let visualSuggestion = "";
    
    if (data.idea.toLowerCase().includes('massinha')) {
      title = isEmotion 
        ? "Mãos Que Moldam Memórias" 
        : "Presentes Que Transformam: A Magia da Massinha";
      
      opening = isEmotion 
        ? "Lembra quando suas mãozinhas criavam mundos?" 
        : "Cansada de presentes esquecidos em uma semana?";
      
      body = isEmotion 
        ? "Uma mãe observa a filha brincando com massinha. Close nas mãozinhas pequenas moldando algo com dedicação. Flashback: a mesma mãe, quando criança, brincando com massinha enquanto sua mãe a observa. Uma tradição que atravessa gerações, criando memórias que nenhum brinquedo digital substitui." 
        : "Mostrar o produto sendo usado: mães e filhos criando juntos. Demonstrar os benefícios: desenvolvimento motor, criatividade e tempo de qualidade. Inserir depoimento rápido: 'Nunca vi meu filho tão concentrado e feliz.' Mostrar kit completo com embalagem especial para presente.";
      
      closing = isEmotion 
        ? "Algumas memórias não podem ser compradas. Mas podem ser moldadas."
        : "Garante já seu kit de massinha especial e faça parte das memórias de uma família.";
      
      visualSuggestion = "Iluminação suave, tons pastel, close nas mãos trabalhando com a massinha, sorrisos discretos.";
    } 
    else if (data.idea.toLowerCase().includes('antes e depois')) {
      title = isEmotion 
        ? "O Espelho da Transformação" 
        : "Resultados Que Falam: Seu Antes e Depois";
      
      opening = isEmotion 
        ? "Cada rosto carrega uma história de superação." 
        : "Cansada de prometer e não mostrar resultados?";
      
      body = isEmotion 
        ? "Uma paciente olha fotos antigas com expressão melancólica. Vemos flashes de sua jornada de autocuidado, os momentos de dúvida, os pequenos avanços, o apoio recebido dos profissionais. Finalmente, ela se olha no espelho com um sorriso genuíno de reconhecimento e aceitação." 
        : "Mostrar 3 antes e depois impressionantes com time stamp (2 semanas, 1 mês, 3 meses). Explicar rapidamente o procedimento usado. Desmistificar dúvidas comuns: 'Dói? Quanto tempo dura? É seguro?' Apresentar condições especiais para agendamento nesta semana.";
      
      closing = isEmotion 
        ? "O maior resultado não está na pele, mas no olhar de quem se reencontra."
        : "Agende sua avaliação hoje e comece a escrever seu próprio antes e depois.";
      
      visualSuggestion = "Split screen para comparações, iluminação clínica mas acolhedora, evitar música dramática, preferir tons inspiradores.";
    } 
    else {
      // Generic script for any other idea
      title = isEmotion 
        ? "Conexões Que Transformam" 
        : "Solução Que Você Procura";
      
      opening = isEmotion 
        ? "Por trás de cada encontro, existe uma história." 
        : "Resolvemos o problema que ninguém mais resolve.";
      
      body = isEmotion 
        ? "Mostrar pessoas em situações cotidianas sendo impactadas positivamente pelo serviço/produto. Focar em expressões genuínas, momentos de realização e conexão humana. Criar uma narrativa visual que conecta diferentes histórias por um fio condutor emocional." 
        : "Identificar claramente o problema comum. Mostrar como outros métodos falham. Apresentar sua solução como única e eficaz. Incorporar evidências rápidas: números, depoimentos curtos, demonstração prática. Estabelecer credibilidade com selo ou prêmio.";
      
      closing = isEmotion 
        ? "Não vendemos apenas um serviço. Criamos possibilidades."
        : "Clique, agende agora e resolva isso de uma vez por todas.";
      
      visualSuggestion = isEmotion 
        ? "Filmagem em sequência com transições suaves, paleta de cores quentes, música envolvente crescente." 
        : "Ritmo dinâmico, texto na tela para reforçar pontos-chave, call to action claro no final.";
    }
    
    const duration = "60 segundos";
    const finalPhrase = isEmotion 
      ? "Conecte antes de vender. Emocione antes de convencer." 
      : "Na dúvida entre ser sutil ou direto, seja eficiente.";
    
    // Disney refinement
    const refinedScript = isEmotion 
      ? `[ABERTURA CATIVANTE]\n"${opening}"\n\n[IDENTIFICAÇÃO]\nMostramos alguém que representa o público, enfrentando um momento de reflexão.\n\n[CONFLITO]\n${body}\n\n[ELEMENTO SURPRESA]\nUm objeto simbólico conecta passado e presente (como uma peça de massinha guardada por anos).\n\n[VIRADA EMOCIONAL]\nRevelação de que o que parecia comum carrega significado profundo.\n\n[RESOLUÇÃO]\n"${closing}"\n\n[LIÇÃO IMPLÍCITA]\nAlguns valores são eternos e precisam apenas ser redescobertos, não reinventados.`
      : `[GANCHO PODEROSO]\n"${opening}"\n\n[PROBLEMA ESTABELECIDO]\nMostramos claramente a dor ou desejo não atendido.\n\n[JORNADA DE SOLUÇÃO]\n${body}\n\n[ELEMENTO ÚNICO]\nUm diferencial exclusivo que ninguém mais oferece.\n\n[PROVA SOCIAL SURPREENDENTE]\nUm caso extremo bem-sucedido que parecia impossível.\n\n[CHAMADA PARA AÇÃO IRRECUSÁVEL]\n"${closing}"\n\n[SENSO DE URGÊNCIA]\nUma razão genuína para agir agora (oferta limitada ou resultado sazonal).`;
    
    // Generate random scores with refinement always being higher
    const initialScore = 6 + Math.floor(Math.random() * 2.5 * 10) / 10; // Between 6.0 and 8.4
    const finalScore = Math.min(10, initialScore + 1.2 + Math.random() * 0.8); // Between 1.2 and 2.0 points higher
    
    return {
      title,
      opening,
      body,
      closing,
      visualSuggestion,
      duration,
      finalPhrase,
      initialScore: Number(initialScore.toFixed(1)),
      refinedScript,
      finalScore: Number(finalScore.toFixed(1))
    };
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
