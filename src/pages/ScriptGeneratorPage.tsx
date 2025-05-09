
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Share2, Download, Copy, ThumbsUp, CalendarRange, Lightbulb } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import ScriptToPlannerModal from '@/components/script-generator/ScriptToPlannerModal';
import { ScriptGeneratorState } from '@/types/script';

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
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // Load data from location state if available
  useEffect(() => {
    const state = location.state as ScriptGeneratorState | undefined;
    
    if (state?.ideaText) {
      // Handle direct idea text from ValidationResponse
      setFormData({
        idea: state.ideaText,
        objective: state.objective === 'emotion' ? 'emotion' : 'sales',
      });
    } else if (state?.validatedIdea) {
      // Handle validated idea from AIResponseBlock
      setFormData({
        idea: state.validatedIdea.topic,
        objective: 'emotion', // Default to emotion if not specified
      });
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'idea' && value.length > 10) {
      setIsThinking(true);
      setTimeout(() => setIsThinking(false), 1500);
    }
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

  const handleAddToPlanner = () => {
    if (!generatedScript) return;
    setIsPlannerModalOpen(true);
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

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const typingVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "100%", 
      transition: { 
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  // Typing animation component
  const TypingText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 100);
        
        return () => clearTimeout(timeout);
      }
    }, [currentIndex, text]);
  
    return (
      <div className="relative h-8">
        <span className="text-xl">{displayedText}</span>
        <span className="inline-block w-[2px] h-6 bg-fluida-pink ml-1 animate-pulse"></span>
      </div>
    );
  };

  const renderIdeaInputStep = () => (
    <div className="max-w-4xl mx-auto w-full">
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-8 md:p-12 shadow-xl border border-blue-100/40 dark:border-blue-700/40"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background gradient blobs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-fluida-blue/20 to-fluida-pink/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-r from-fluida-pink/20 to-fluida-blue/20 rounded-full filter blur-3xl"></div>
        
        <div className="relative z-10 space-y-8">
          <motion.div variants={itemVariants} className="space-y-3 text-center max-w-3xl mx-auto">
            <motion.div
              className="inline-block text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Crie roteiros que emocionam ou vendem
            </motion.div>
            
            <motion.div 
              className="mt-4 text-center"
              variants={itemVariants}
            >
              <TypingText text="O que você quer criar hoje?" />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="space-y-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-xl p-6 border border-white/20 shadow-lg"
            variants={itemVariants}
          >
            <div>
              <Label htmlFor="idea" className="text-lg font-medium bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent">Sua ideia para conteúdo</Label>
              <div className="relative mt-2">
                <Textarea 
                  id="idea"
                  name="idea"
                  value={formData.idea}
                  onChange={handleInputChange}
                  className="h-32 text-lg border-2 border-gray-200 hover:border-fluida-blue focus:border-fluida-pink transition-colors pr-12"
                  placeholder="Ex: Vídeo com massinha para o Dia das Mães, Tutorial de skincare, Antes e depois de procedimento..."
                />
                {isThinking && (
                  <motion.div 
                    className="absolute bottom-4 right-4 flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <motion.div 
                      className="w-5 h-5 rounded-full bg-gradient-to-r from-fluida-blue to-fluida-pink"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                )}
              </div>
              {formData.idea.length > 5 && (
                <motion.div 
                  className="mt-2 px-3 py-2 bg-gradient-to-r from-fluida-blue/10 to-fluida-pink/10 rounded-lg text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-fluida-pink flex-shrink-0 mt-0.5" />
                    <span>
                      {formData.idea.toLowerCase().includes('massinha') 
                        ? "Dica: Roteiros sobre produtos para crianças costumam performar melhor quando focam na conexão emocional entre pais e filhos." 
                        : formData.idea.toLowerCase().includes('antes e depois')
                          ? "Dica: Em roteiros de 'antes e depois', use depoimentos reais e timeline clara para maior credibilidade."
                          : "Dica: Roteiros com histórias pessoais costumam ter maior engajamento e compartilhamento."}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <Label className="text-lg font-medium bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent">
                Qual seu objetivo com esse conteúdo?
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <motion.div
                  className={`${
                    formData.objective === 'emotion'
                      ? 'bg-gradient-to-r from-fluida-blue to-fluida-blue/60 text-white'
                      : 'bg-white dark:bg-gray-800'
                  } p-4 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer border border-gray-100 dark:border-gray-700`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleObjectiveChange('emotion')}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-200/20 flex items-center justify-center">
                      <span className="text-2xl">💙</span>
                    </div>
                    <h3 className="font-semibold text-lg">Emocionar</h3>
                    <p className="text-sm">
                      Criar conexão emocional com a audiência
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className={`${
                    formData.objective === 'sales'
                      ? 'bg-gradient-to-r from-fluida-pink to-fluida-pink/60 text-white'
                      : 'bg-white dark:bg-gray-800'
                  } p-4 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer border border-gray-100 dark:border-gray-700`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleObjectiveChange('sales')}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500/20 to-pink-200/20 flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="font-semibold text-lg">Vender</h3>
                    <p className="text-sm">
                      Gerar conversão e resultados diretos
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-4 pt-2"
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="audience" className="text-base text-gray-600 dark:text-gray-300">Quem é o público-alvo? (opcional)</Label>
                  <Input 
                    id="audience"
                    name="audience"
                    value={formData.audience || ''}
                    onChange={handleInputChange}
                    className="mt-2 border-gray-200"
                    placeholder="Ex: Mulheres 30-45 anos interessadas em estética"
                  />
                </div>
                
                <div>
                  <Label htmlFor="theme" className="text-base text-gray-600 dark:text-gray-300">Algum tema ou elemento específico? (opcional)</Label>
                  <Input 
                    id="theme"
                    name="theme"
                    value={formData.theme || ''}
                    onChange={handleInputChange}
                    className="mt-2 border-gray-200"
                    placeholder="Ex: Dia das Mães, Black Friday, Verão..."
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
            variants={itemVariants}
          >
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button 
              className="gap-2 relative overflow-hidden group"
              onClick={handleGenerateScript}
              style={{
                backgroundImage: "linear-gradient(90deg, #0094fb, #f300fc)",
              }}
            >
              <span className="absolute inset-0 bg-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
              <Sparkles className="h-4 w-4" />
              Gerar roteiro mágico
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  const renderGeneratingStep = () => (
    <div className="max-w-3xl mx-auto w-full">
      <motion.div 
        className="p-12 rounded-2xl bg-gradient-to-r from-fluida-blue/5 to-fluida-pink/5 border border-blue-100/40 shadow-lg dark:border-purple-900/40"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-12">
          <div className="flex justify-center mb-12">
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-fluida-blue/30 to-fluida-pink/30 blur-2xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="relative h-24 w-24 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-16 w-16 text-fluida-pink" />
              </motion.div>
            </div>
          </div>
          
          <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent">
            Gerando seu roteiro mágico...
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Estou aplicando técnicas criativas para transformar sua ideia em um roteiro impactante.
          </p>
          
          <div className="mt-12">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3 overflow-hidden">
              <motion.div
                className="h-2.5 rounded-full bg-gradient-to-r from-fluida-blue to-fluida-pink"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
              />
            </div>
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <motion.div 
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center gap-1.5"
              >
                <div className="h-2 w-2 rounded-full bg-fluida-blue" />
                <span>Analisando tema</span>
              </motion.div>
              <span>→</span>
              <motion.div 
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="flex items-center gap-1.5"
              >
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span>Aplicando Magia Disney</span>
              </motion.div>
              <span>→</span>
              <motion.div 
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="flex items-center gap-1.5"
              >
                <div className="h-2 w-2 rounded-full bg-fluida-pink" />
                <span>Refinando script</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderResultStep = () => {
    if (!generatedScript) return null;
    
    return (
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header section */}
          <motion.div
            className="bg-gradient-to-r from-fluida-blue to-fluida-pink text-white p-6 rounded-t-2xl flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Seu Roteiro Mágico</h2>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleCopyScript} title="Copiar roteiro" className="text-white hover:bg-white/20">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Compartilhar roteiro" className="text-white hover:bg-white/20">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Baixar como PDF" className="text-white hover:bg-white/20">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          {/* Content section */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-b-2xl shadow-xl border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="space-y-8">
              {/* Title and metadata */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent">
                  {generatedScript.title}
                </h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm font-medium text-blue-800 dark:text-blue-200">
                    Intenção: {formData.objective === 'emotion' ? 'Emocionar' : 'Vender'}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-sm font-medium text-purple-800 dark:text-purple-200">
                    Duração: {generatedScript.duration}
                  </span>
                  <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-300 text-white rounded-full text-sm font-medium flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Score Final: {generatedScript.finalScore}/10
                  </div>
                </div>
              </motion.div>
              
              {/* Script structure */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  className="col-span-1 lg:col-span-2 space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/30 border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-shadow">
                    <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-semibold tracking-wider">Abertura</h4>
                    <p className="text-lg font-medium">{generatedScript.opening}</p>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/30 border border-purple-100 dark:border-purple-800 hover:shadow-lg transition-shadow">
                    <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-semibold tracking-wider">Parte Principal</h4>
                    <p className="text-base whitespace-pre-line">{generatedScript.body}</p>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-pink-50 dark:from-gray-800 dark:to-pink-900/30 border border-pink-100 dark:border-pink-800 hover:shadow-lg transition-shadow">
                    <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-semibold tracking-wider">Fechamento</h4>
                    <p className="text-lg font-medium">{generatedScript.closing}</p>
                  </div>
                </motion.div>
                
                <motion.div
                  className="col-span-1 space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-3 font-semibold tracking-wider">Visual Sugerido</h4>
                    <p className="text-sm italic">{generatedScript.visualSuggestion}</p>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-semibold tracking-wider">Frase Final</h4>
                      <p className="text-sm font-medium">{generatedScript.finalPhrase}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-300 flex items-center justify-center text-white">
                        <ThumbsUp className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">Avaliação de Impacto</h4>
                        <div className="flex items-center">
                          <div className="flex">
                            {Array.from({ length: Math.round(generatedScript.finalScore) }).map((_, i) => (
                              <div key={i} className="text-amber-500">★</div>
                            ))}
                            {Array.from({ length: 10 - Math.round(generatedScript.finalScore) }).map((_, i) => (
                              <div key={i} className="text-gray-300 dark:text-gray-600">★</div>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">({generatedScript.finalScore}/10)</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formData.objective === 'emotion' 
                        ? "Este roteiro tem alto potencial de engajar emocionalmente sua audiência e criar conexão duradoura."
                        : "Este roteiro foi otimizado para maximizar conversões e possui elementos persuasivos eficazes."}
                    </p>
                  </div>
                </motion.div>
              </div>
              
              {/* Disney magic version */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                  Versão refinada com Magia Disney
                </h3>
                
                <div className="p-6 rounded-xl backdrop-blur-sm bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/60 dark:to-purple-950/60 border border-blue-100 dark:border-blue-800 shadow-lg">
                  <p className="whitespace-pre-line">{generatedScript.refinedScript}</p>
                </div>
              </motion.div>
              
              {/* Actions */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4 mt-8 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={() => setStep('ideaInput')}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar e editar
                </Button>
                
                <div className="flex-1"></div>
                
                <Button 
                  variant="outline"
                  className="gap-2 border-fluida-blue text-fluida-blue"
                  onClick={handleAddToPlanner}
                >
                  <CalendarRange className="h-4 w-4" />
                  Usar no Planner
                </Button>
                
                <Button 
                  className="gap-2"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #0094fb, #f300fc)",
                  }}
                  onClick={() => setStep('ideaInput')}
                >
                  <Sparkles className="h-4 w-4" />
                  Criar novo roteiro
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Modal for adding to planner */}
        <ScriptToPlannerModal
          open={isPlannerModalOpen}
          onOpenChange={setIsPlannerModalOpen}
          scriptTitle={generatedScript.title}
          scriptContent={`${generatedScript.opening}\n\n${generatedScript.body}\n\n${generatedScript.closing}`}
        />
      </div>
    );
  };

  return (
    <Layout title="Gerador de Roteiros" fullWidth={false}>
      <div className="py-8">
        {step === 'ideaInput' && renderIdeaInputStep()}
        {step === 'generating' && renderGeneratingStep()}
        {step === 'result' && renderResultStep()}
      </div>
    </Layout>
  );
};

export default ScriptGeneratorPage;
