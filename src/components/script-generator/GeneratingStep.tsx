
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2, Sparkles, Brain, Lightbulb } from 'lucide-react';

const GeneratingStep: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

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
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 5;
      });
    }, 300);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const currentMessage = messages[currentMessageIndex];
  const CurrentIcon = currentMessage.icon;

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
            <p className="text-xs text-center text-muted-foreground">
              {Math.round(progress)}% concluído
            </p>
          </div>

          {/* Loading dots */}
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
          </div>

          {/* Fun fact */}
          <div className="mt-4 p-4 bg-purple-500/10 rounded-lg max-w-md">
            <p className="text-sm text-center text-purple-300">
              💡 <strong>Dica:</strong> Um bom roteiro pode aumentar o engajamento em até 300%!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratingStep;
