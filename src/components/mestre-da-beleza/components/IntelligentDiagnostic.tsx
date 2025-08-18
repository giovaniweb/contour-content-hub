import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Brain, Sparkles, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { perguntasInteligentes, PerguntaInteligente } from '../perguntasInteligentes';
import { useMestreDaBelezaSession } from '@/hooks/useMestreDaBelezaSession';

interface IntelligentDiagnosticProps {
  onComplete: (result: any) => void;
}

const IntelligentDiagnostic: React.FC<IntelligentDiagnosticProps> = ({ onComplete }) => {
  const { session, saveResponse, nextStep } = useMestreDaBelezaSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const currentQuestion = perguntasInteligentes[currentQuestionIndex];

  const handleAnswer = useCallback(async (answer: string) => {
    if (!currentQuestion) return;

    const newResponses = { ...responses, [currentQuestion.id]: answer };
    setResponses(newResponses);

    // Salvar no banco de dados
    await saveResponse(currentQuestion.id, answer);

    // Verificar se deve ramificar ou pular perguntas
    let nextIndex = currentQuestionIndex + 1;
    
    if (currentQuestion.ramifica) {
      const shouldSkip = currentQuestion.ramifica(newResponses);
      if (shouldSkip) {
        nextIndex = currentQuestionIndex + 2; // Pular próxima pergunta
      }
    }

    // Verificar se chegou ao fim
    if (nextIndex >= perguntasInteligentes.length) {
      setIsProcessing(true);
      
      // Calcular resultado baseado nas respostas
      const diagnosticResult = calculateDiagnosticResult(newResponses);
      
      await nextStep('completed', {
        diagnostic_result: diagnosticResult,
        score_data: diagnosticResult.scores
      });

      onComplete(diagnosticResult);
      return;
    }

    setCurrentQuestionIndex(nextIndex);
  }, [currentQuestion, currentQuestionIndex, responses, saveResponse, nextStep, onComplete]);

  const calculateDiagnosticResult = (userResponses: Record<string, any>) => {
    const scores: Record<string, number> = {
      experiencia: 0,
      conhecimento_tecnico: 0,
      foco_resultados: 0,
      interesse_inovacao: 0,
      perfil_cliente: 0
    };

    // Calcular scores baseado nas respostas (implementação simplificada)
    Object.entries(userResponses).forEach(([questionId, answer]) => {
      const question = perguntasInteligentes.find(q => q.id === questionId);
      if (question) {
        // Scoring básico por tipo de pergunta
        if (question.tipo === 'tecnica') scores.conhecimento_tecnico += 1;
        if (question.tipo === 'comportamental') scores.experiencia += 1;
        if (question.tipo === 'emocional') scores.foco_resultados += 1;
      }
    });

    // Determinar perfil principal
    const maxScore = Math.max(...Object.values(scores));
    const primaryProfile = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'iniciante';

    // Gerar recomendações específicas
    const recommendations = generateRecommendations(primaryProfile, scores, userResponses);

    return {
      primaryProfile,
      scores,
      recommendations,
      completedAt: new Date().toISOString(),
      totalQuestions: perguntasInteligentes.length,
      userResponses
    };
  };

  const generateRecommendations = (profile: string, scores: Record<string, number>, responses: Record<string, any>) => {
    const recommendations = [];

    // Recomendações baseadas no perfil
    switch (profile) {
      case 'experiencia':
        recommendations.push({
          type: 'equipment',
          title: 'Equipamentos Profissionais',
          description: 'Considere equipamentos de alta tecnologia para expandir seus serviços',
          priority: 'high'
        });
        break;
      
      case 'conhecimento_tecnico':
        recommendations.push({
          type: 'education',
          title: 'Especialização Avançada',
          description: 'Cursos de aperfeiçoamento em técnicas específicas',
          priority: 'medium'
        });
        break;
      
      case 'interesse_inovacao':
        recommendations.push({
          type: 'innovation',
          title: 'Tecnologias Emergentes',
          description: 'Mantenha-se atualizado com as últimas tendências do mercado',
          priority: 'high'
        });
        break;
    }

    return recommendations;
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / perguntasInteligentes.length) * 100;
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="w-16 h-16 text-primary" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Analisando suas respostas...</h3>
          <p className="text-muted-foreground">Gerando seu diagnóstico personalizado</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Erro ao carregar perguntas do diagnóstico.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Pergunta {currentQuestionIndex + 1} de {perguntasInteligentes.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(getProgressPercentage())}%
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentQuestion.tipo === 'perfil' && <Users className="w-5 h-5" />}
            {currentQuestion.tipo === 'tecnica' && <Brain className="w-5 h-5" />}
            {currentQuestion.tipo === 'comportamental' && <Target className="w-5 h-5" />}
            {currentQuestion.tipo === 'emocional' && <Sparkles className="w-5 h-5" />}
            {currentQuestion.contexto}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-6">{currentQuestion.texto}</h3>
          
          <div className="space-y-3">
            {currentQuestion.opcoes.map((opcao, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-between text-left h-auto p-4 hover:bg-primary/5 hover:border-primary/20"
                  onClick={() => handleAnswer(opcao)}
                >
                  <span className="flex-1">{opcao}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Context Info */}
      {currentQuestion.contexto && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Categoria: {currentQuestion.contexto}</p>
        </div>
      )}
    </div>
  );
};

export default IntelligentDiagnostic;