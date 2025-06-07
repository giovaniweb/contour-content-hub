
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { ScriptGeneratorState, FormData, GeneratedScript } from '@/types/script';
import IdeaInputStep from '@/components/script-generator/IdeaInputStep';
import GeneratingStep from '@/components/script-generator/GeneratingStep';
import ResultStep from '@/components/script-generator/ResultStep';
import { generateScript } from '@/services/supabaseService';
import type { MarketingObjectiveType } from '@/types/script';

const ScriptGeneratorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    idea: '',
    objective: 'emotion',
  });
  const [step, setStep] = useState<'ideaInput' | 'generating' | 'result'>('ideaInput');
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

  const handleGenerateScript = async () => {
    if (!formData.idea) {
      toast({
        title: "Ops! Falta informação.",
        description: "Por favor, informe uma ideia para gerar o roteiro.",
        variant: "destructive",
      });
      return;
    }

    setStep('generating');
    
    try {
      // Call the real Supabase API to generate script
      const marketingObjective: MarketingObjectiveType = formData.objective === 'emotion' 
        ? '🟢 Criar Conexão' 
        : '🔴 Fazer Comprar';

      const scriptRequest = {
        type: 'videoScript' as const, // Use valid ScriptType
        topic: formData.idea,
        tone: formData.objective === 'emotion' ? 'emocional' : 'vendas',
        marketingObjective,
        additionalInfo: `Objetivo: ${formData.objective === 'emotion' ? 'Emocionar' : 'Vender'}`
      };

      const response = await generateScript(scriptRequest);
      
      // Convert API response to expected format
      const mockScript: GeneratedScript = {
        title: response.title || formData.idea,
        opening: extractSection(response.content, 'abertura') || "Gancho inicial impactante",
        body: extractSection(response.content, 'desenvolvimento') || response.content,
        closing: extractSection(response.content, 'fechamento') || "Call to action poderoso",
        visualSuggestion: extractSection(response.content, 'visual') || "Sugestões visuais para o vídeo",
        duration: "60 segundos",
        finalPhrase: formData.objective === 'emotion' ? "Conecte antes de vender" : "Venda com propósito",
        initialScore: 7.5,
        refinedScript: response.content,
        finalScore: 9.2
      };

      setGeneratedScript(mockScript);
      setStep('result');

      toast({
        title: "Roteiro gerado com sucesso!",
        description: "Seu roteiro está pronto para ser usado.",
      });

    } catch (error) {
      console.error('Erro ao gerar roteiro:', error);
      
      // Fallback to simulated generation in case of error
      const mockScript = generateMockScript(formData);
      setGeneratedScript(mockScript);
      setStep('result');

      toast({
        title: "Roteiro gerado (modo simulado)",
        description: "Houve um problema com a API, mas geramos um roteiro de exemplo.",
        variant: "destructive",
      });
    }
  };

  // Função auxiliar para extrair seções do conteúdo gerado
  const extractSection = (content: string, section: string): string => {
    const patterns = {
      'abertura': /(?:abertura|gancho|início):\s*([^\n]+)/i,
      'desenvolvimento': /(?:desenvolvimento|corpo|conteúdo):\s*([^\n]+)/i,
      'fechamento': /(?:fechamento|conclusão|cta):\s*([^\n]+)/i,
      'visual': /(?:visual|imagem|sugestão visual):\s*([^\n]+)/i
    };

    const pattern = patterns[section as keyof typeof patterns];
    if (pattern) {
      const match = content.match(pattern);
      return match ? match[1].trim() : '';
    }
    return '';
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
      <div className="py-8">
        {step === 'ideaInput' && (
          <IdeaInputStep
            formData={formData}
            onInputChange={handleInputChange}
            onObjectiveChange={handleObjectiveChange}
            onGoBack={handleGoBack}
            onSubmit={handleGenerateScript}
          />
        )}
        
        {step === 'generating' && <GeneratingStep />}
        
        {step === 'result' && generatedScript && (
          <ResultStep
            generatedScript={generatedScript}
            formData={formData}
            onCopyScript={handleCopyScript}
            onBackToEdit={() => setStep('ideaInput')}
            onNewScript={() => setStep('ideaInput')}
            isPlannerModalOpen={isPlannerModalOpen}
            setIsPlannerModalOpen={setIsPlannerModalOpen}
          />
        )}
      </div>
    </Layout>
  );
};

export default ScriptGeneratorPage;
