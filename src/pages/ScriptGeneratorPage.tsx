
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Share2, Download, Copy, ThumbsUp } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface ScriptGeneratorState {
  ideaText?: string;
  objective?: 'emotion' | 'sales';
}

interface FormData {
  idea: string;
  objective: 'emotion' | 'sales';
  audience?: string;
  theme?: string;
}

interface GeneratedScript {
  title: string;
  opening: string;
  body: string;
  closing: string;
  visualSuggestion: string;
  duration: string;
  finalPhrase: string;
  initialScore: number;
  refinedScript: string;
  finalScore: number;
}

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

  // Load data from location state if available
  useEffect(() => {
    const state = location.state as ScriptGeneratorState | undefined;
    
    if (state?.ideaText) {
      setFormData({
        idea: state.ideaText,
        objective: state.objective || 'emotion',
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
    
    // Simulated API call with timeout
    setTimeout(() => {
      const mockScript = generateMockScript(formData);
      setGeneratedScript(mockScript);
      setStep('result');
    }, 3000);
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

    ✨ Versão refinada com Magia Disney:
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
        : "Garanta já seu kit de massinha especial e faça parte das memórias de uma família.";
      
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

  const renderIdeaInputStep = () => (
    <div className="max-w-3xl mx-auto w-full">
      <Card className="p-6 md:p-8 shadow-lg">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <h2 className="text-2xl font-bold">Fluida, a Assistente Criativa</h2>
          </div>
          
          <p className="text-muted-foreground">
            Vou te ajudar a transformar sua ideia em um roteiro impactante para redes sociais.
          </p>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="idea" className="text-base">Sua ideia para conteúdo</Label>
              <Textarea 
                id="idea"
                name="idea"
                value={formData.idea}
                onChange={handleInputChange}
                className="mt-2 h-32"
                placeholder="Ex: Vídeo com massinha para o Dia das Mães, Tutorial de skincare, Antes e depois de procedimento..."
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-base">Qual seu objetivo com esse conteúdo?</Label>
              <RadioGroup 
                value={formData.objective} 
                onValueChange={value => handleObjectiveChange(value as 'emotion' | 'sales')}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emotion" id="emotion" className="text-pink-500" />
                  <Label htmlFor="emotion" className="cursor-pointer">
                    Emocionar (criar conexão)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sales" id="sales" className="text-amber-500" />
                  <Label htmlFor="sales" className="cursor-pointer">
                    Vender (gerar conversão)
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="audience" className="text-base">Quem é o público-alvo? (opcional)</Label>
                <Input 
                  id="audience"
                  name="audience"
                  value={formData.audience || ''}
                  onChange={handleInputChange}
                  className="mt-2"
                  placeholder="Ex: Mulheres 30-45 anos interessadas em estética"
                />
              </div>
              
              <div>
                <Label htmlFor="theme" className="text-base">Algum tema ou elemento específico? (opcional)</Label>
                <Input 
                  id="theme"
                  name="theme"
                  value={formData.theme || ''}
                  onChange={handleInputChange}
                  className="mt-2"
                  placeholder="Ex: Dia das Mães, Black Friday, Verão..."
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button 
              className="gap-2 bg-gradient-to-r from-fluida-blue to-fluida-pink text-white"
              onClick={handleGenerateScript}
            >
              <Sparkles className="h-4 w-4" />
              Gerar roteiro mágico
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderGeneratingStep = () => (
    <div className="max-w-3xl mx-auto w-full">
      <Card className="p-6 md:p-8 shadow-lg">
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-6 w-16 h-16 text-pink-500"
          >
            <Sparkles className="h-16 w-16" />
          </motion.div>
          
          <h3 className="text-2xl font-bold mb-3">Gerando seu roteiro mágico...</h3>
          <p className="text-muted-foreground">
            Estou aplicando técnicas criativas para transformar sua ideia em um roteiro impactante.
          </p>
          
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-fluida-blue to-fluida-pink"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
              />
            </div>
            <p className="text-sm text-muted-foreground">Aplicando magia Disney...</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderResultStep = () => {
    if (!generatedScript) return null;
    
    return (
      <div className="max-w-4xl mx-auto w-full">
        <Card className="p-6 md:p-8 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-pink-500" />
                <h2 className="text-2xl font-bold">Roteiro Fluida</h2>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleCopyScript} title="Copiar roteiro">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Compartilhar roteiro">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Baixar como PDF">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50 border">
              <h3 className="text-xl font-semibold mb-3">
                {generatedScript.title}
              </h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 bg-muted rounded-full text-sm font-medium">
                  Intenção: {formData.objective === 'emotion' ? 'Emocionar' : 'Vender'}
                </span>
                <span className="px-3 py-1 bg-muted rounded-full text-sm font-medium">
                  Duração: {generatedScript.duration}
                </span>
                <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-300 text-white rounded-full text-sm font-medium flex items-center">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Score Final: {generatedScript.finalScore}/10
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">Abertura</h4>
                  <p className="text-lg">{generatedScript.opening}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">Parte principal</h4>
                  <p className="text-base whitespace-pre-line">{generatedScript.body}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">Fechamento</h4>
                  <p className="text-lg font-medium">{generatedScript.closing}</p>
                </div>
                
                <div className="pt-2">
                  <h4 className="font-medium text-muted-foreground mb-1">Visual sugerido</h4>
                  <p className="text-sm italic">{generatedScript.visualSuggestion}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
                Versão refinada com Magia Disney
                <span className="ml-3 text-sm px-2 py-0.5 bg-gradient-to-r from-amber-600 to-pink-600 text-white rounded-full">
                  Score: {generatedScript.finalScore}/10
                </span>
              </h3>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-100 dark:border-blue-900">
                <p className="whitespace-pre-line">{generatedScript.refinedScript}</p>
                
                <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-900">
                  <p className="text-sm italic text-muted-foreground">
                    Frase final: {generatedScript.finalPhrase}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleGoBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button 
                className="gap-2 bg-gradient-to-r from-fluida-blue to-fluida-pink text-white"
                onClick={() => setStep('ideaInput')}
              >
                <Sparkles className="h-4 w-4" />
                Criar novo roteiro
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <Layout title="Gerador de Roteiros" fullWidth={false}>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerador de Roteiros</h1>
          <p className="text-muted-foreground">
            Transforme suas ideias em roteiros de conteúdo com técnicas inspiradas em grandes criativos.
          </p>
        </div>
        
        {step === 'ideaInput' && renderIdeaInputStep()}
        {step === 'generating' && renderGeneratingStep()}
        {step === 'result' && renderResultStep()}
      </div>
    </Layout>
  );
};

export default ScriptGeneratorPage;
