
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Bot, Sparkles, Wand2, Eye, Heart, Target, Users, TrendingUp } from 'lucide-react';

interface FluiAQuestion {
  id: number;
  question: string;
  options: string[];
  fluirPun: string;
}

interface FluiAResult {
  objective: string;
  mentor: string;
  description: string;
  fluirMessage: string;
}

const FluiAAkinatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [result, setResult] = useState<FluiAResult | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const questions: FluiAQuestion[] = [
    {
      id: 1,
      question: "Para deixar sua estratégia fluir perfeitamente, me diga: qual é seu foco principal?",
      options: [
        "Atrair novos clientes para minha clínica",
        "Vender mais tratamentos específicos", 
        "Melhorar a percepção da minha marca",
        "Reativar clientes antigos"
      ],
      fluirPun: "✨ Sinto que sua energia já está começando a fluir..."
    },
    {
      id: 2,
      question: "Hmm... deixe eu sentir como suas ideias fluem... Que tipo de conteúdo faz seu coração acelerar?",
      options: [
        "Vídeos educativos e informativos",
        "Antes e depois transformadores",
        "Stories do dia a dia da clínica",
        "Carrosséis explicativos"
      ],
      fluirPun: "🌊 Perfeito! Sua essência criativa está fluindo como um rio..."
    },
    {
      id: 3,
      question: "Interessante... sinto que sua paixão flui em uma direção específica. Qual tratamento te emociona mais?",
      options: [
        "Harmonização facial",
        "Skincare e cuidados básicos", 
        "Tratamentos corporais",
        "Procedimentos íntimos"
      ],
      fluirPun: "💫 Uau! Sua dedicação está fluindo intensamente aqui..."
    },
    {
      id: 4,
      question: "Quase lá! Deixe sua intuição fluir... Como seus clientes preferem se conectar com você?",
      options: [
        "Através de educação e informação",
        "Vendo resultados reais",
        "Sentindo confiança e acolhimento",
        "Através de histórias pessoais"
      ],
      fluirPun: "🎭 Sinto uma energia especial fluindo... estou quase descobrindo!"
    }
  ];

  const getResult = (userAnswers: string[]): FluiAResult => {
    // Lógica simplificada para demonstração
    const objectives = {
      "Atrair novos clientes para minha clínica": {
        objective: "🟡 Atrair Atenção",
        mentor: "Dr. Marcus Visionário", 
        description: "Estratégias magnéticas para conquistar novos clientes",
        fluirMessage: "Perfeito! Senti sua energia fluir na direção da expansão. Você quer que novos clientes fluam naturalmente para sua clínica!"
      },
      "Vender mais tratamentos específicos": {
        objective: "🔴 Fazer Comprar",
        mentor: "Dra. Sandra Persuasiva",
        description: "Técnicas de conversão que geram resultados",
        fluirMessage: "Incrível! Sua determinação comercial está fluindo como uma correnteza poderosa. Você quer que as vendas fluam sem parar!"
      },
      "Melhorar a percepção da minha marca": {
        objective: "🟢 Criar Conexão", 
        mentor: "Dra. Elena Empática",
        description: "Construção de relacionamentos duradouros",
        fluirMessage: "Maravilhoso! Sinto sua essência fluir em direção ao coração das pessoas. Você quer que o amor pela sua marca flua naturalmente!"
      },
      "Reativar clientes antigos": {
        objective: "🔁 Reativar Interesse",
        mentor: "Dr. Carlos Reconectador", 
        description: "Estratégias de reativação inteligente",
        fluirMessage: "Fantástico! Sua nostalgia está fluindo em direção ao passado. Você quer que antigos clientes fluam de volta para seus braços!"
      }
    };

    const firstAnswer = userAnswers[0] || "Atrair novos clientes para minha clínica";
    return objectives[firstAnswer as keyof typeof objectives] || objectives["Atrair novos clientes para minha clínica"];
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setCurrentQuestion(currentQuestion + 1);
      }, 2000);
    } else {
      // Final revelation
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setIsRevealing(true);
        const finalResult = getResult(newAnswers);
        setResult(finalResult);
      }, 3000);
    }
  };

  const handleCreateScript = () => {
    if (result) {
      navigate('/content/scripts/generator', {
        state: {
          fluiAResult: result,
          mode: 'akinator'
        }
      });
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isRevealing && result) {
    return (
      <div className="min-h-screen aurora-dark-bg relative overflow-hidden">
        {/* Aurora Background */}
        <div className="aurora-particles">
          {Array.from({ length: 30 }, (_, i) => (
            <div 
              key={i} 
              className="aurora-particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }} 
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/content/scripts')} 
            className="mb-6 aurora-glass border-purple-300/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Roteiros
          </Button>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center space-y-8"
          >
            {/* FluiA Avatar */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="mx-auto w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center aurora-glow"
            >
              <Bot className="h-16 w-16 text-white" />
            </motion.div>

            {/* Revelation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="aurora-text-gradient text-4xl font-bold mb-4">
                🎉 FluiA Descobriu! 🎉
              </h1>
              <p className="aurora-body text-xl mb-6">
                {result.fluirMessage}
              </p>
            </motion.div>

            {/* Result Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="aurora-card border-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
                
                <CardHeader className="relative z-10 text-center">
                  <CardTitle className="aurora-text-gradient text-3xl mb-4">
                    {result.objective}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                    <span className="aurora-accent text-xl font-semibold">
                      Mentor: {result.mentor}
                    </span>
                    <Wand2 className="h-6 w-6 text-pink-400" />
                  </div>
                  <p className="aurora-body">
                    {result.description}
                  </p>
                </CardHeader>

                <CardContent className="relative z-10 text-center space-y-6">
                  <div className="p-6 aurora-glass rounded-xl">
                    <h3 className="aurora-accent font-semibold mb-3">
                      🌊 Como FluiA chegou nessa conclusão:
                    </h3>
                    <div className="space-y-2 text-sm aurora-body opacity-80">
                      <p>• Analisei como suas respostas fluíam</p>
                      <p>• Senti a energia dos seus objetivos</p>
                      <p>• Deixei a intuição fluir naturalmente</p>
                      <p>• E voilà! Sua essência se revelou!</p>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleCreateScript}
                      size="lg"
                      className="aurora-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg"
                    >
                      <Sparkles className="h-6 w-6 mr-3 aurora-pulse" />
                      Criar Meu Roteiro Perfeito
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isThinking) {
    return (
      <div className="min-h-screen aurora-dark-bg relative overflow-hidden flex items-center justify-center">
        <div className="aurora-particles">
          {Array.from({ length: 20 }, (_, i) => (
            <div 
              key={i} 
              className="aurora-particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }} 
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center aurora-glow mb-6"
          >
            <Eye className="h-12 w-12 text-white" />
          </motion.div>

          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="aurora-text-gradient text-2xl font-bold mb-4"
          >
            FluiA está analisando...
          </motion.h2>

          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="aurora-body text-lg"
          >
            Deixando a intuição fluir...
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen aurora-dark-bg relative overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora-particles">
        {Array.from({ length: 15 }, (_, i) => (
          <div 
            key={i} 
            className="aurora-particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`
            }} 
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/content/scripts')} 
            className="mb-6 aurora-glass border-purple-300/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Roteiros
          </Button>

          <div className="text-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center aurora-glow mb-4"
            >
              <Bot className="h-10 w-10 text-white" />
            </motion.div>
            
            <h1 className="aurora-text-gradient text-3xl font-bold mb-2">
              FluiA Akinator
            </h1>
            <p className="aurora-body">
              Deixe que eu adivinhe exatamente o que você precisa...
            </p>
          </div>

          {/* Progress */}
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="mb-2" />
            <p className="text-center aurora-body text-sm">
              Pergunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="aurora-card border-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
            
            <CardHeader className="relative z-10 text-center">
              <CardTitle className="aurora-text-gradient text-xl mb-4">
                {currentQ.question}
              </CardTitle>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="aurora-body text-sm italic opacity-80"
              >
                {currentQ.fluirPun}
              </motion.p>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Button
                      onClick={() => handleAnswer(option)}
                      variant="outline"
                      className="w-full text-left h-auto p-4 aurora-glass border-purple-300/30 hover:border-purple-400/50 hover:aurora-glow transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                        <span className="aurora-body">{option}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FluiAAkinatorPage;
