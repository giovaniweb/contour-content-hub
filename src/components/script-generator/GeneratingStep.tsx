
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2, Sparkles, Brain, Lightbulb, Clock } from 'lucide-react';

const GeneratingStep: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const messages = [
    {
      icon: Brain,
      title: "Analisando sua ideia...",
      subtitle: "Nossa IA está processando os detalhes do seu roteiro"
    },
    {
      icon: Lightbulb,
      title: "Criando estrutura narrativa...",
      subtitle: "Organizando o conteúdo para máximo engajamento"
    },
    {
      icon: Wand2,
      title: "Aplicando técnicas de copywriting...",
      subtitle: "Inserindo gatilhos mentais e persuasão"
    },
    {
      icon: Sparkles,
      title: "Finalizando seu roteiro...",
      subtitle: "Ajustando os últimos detalhes para perfeição"
    }
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 500);

    const timeInterval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const currentMessage = messages[currentMessageIndex];
  const CurrentIcon = currentMessage.icon;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="relative">
            <CurrentIcon className="h-16 w-16 text-purple-400 transition-all duration-500" />
            <Loader2 className="h-8 w-8 animate-spin absolute -top-2 -right-2 text-purple-400" />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-purple-400 transition-all duration-500">
              {currentMessage.title}
            </h2>
            <p className="text-muted-foreground transition-all duration-500">
              {currentMessage.subtitle}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% concluído</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(elapsed)}
              </span>
            </div>
          </div>

          {/* Loading dots */}
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
          </div>

          {/* Dynamic tips */}
          <div className="mt-4 p-4 bg-purple-500/10 rounded-lg max-w-md">
            {elapsed < 20 && (
              <p className="text-sm text-center text-purple-300">
                💡 <strong>Dica:</strong> Um bom roteiro pode aumentar o engajamento em até 300%!
              </p>
            )}
            {elapsed >= 20 && elapsed < 40 && (
              <p className="text-sm text-center text-purple-300">
                🎯 <strong>Lembre-se:</strong> Estamos otimizando seu conteúdo para máxima conversão!
              </p>
            )}
            {elapsed >= 40 && (
              <p className="text-sm text-center text-purple-300">
                🚀 <strong>Quase pronto:</strong> Sua IA está aplicando as melhores práticas de copywriting!
              </p>
            )}
          </div>

          {elapsed > 45 && (
            <div className="text-center text-sm text-yellow-400">
              ⏳ Processamento mais complexo detectado - aguarde mais alguns instantes...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratingStep;
