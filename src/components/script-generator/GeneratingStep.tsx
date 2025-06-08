
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Wand2, Sparkles, Brain, Lightbulb, Clock, Zap } from 'lucide-react';

const GeneratingStep: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0.5);

  const messages = [
    {
      icon: Brain,
      title: "Analisando sua intenção...",
      subtitle: "Nossa IA está decodificando os detalhes do seu roteiro",
      color: "text-purple-400"
    },
    {
      icon: Lightbulb,
      title: "Criando estrutura narrativa...",
      subtitle: "Organizando o conteúdo para máximo engajamento",
      color: "text-blue-400"
    },
    {
      icon: Wand2,
      title: "Aplicando técnicas de copywriting...",
      subtitle: "Inserindo gatilhos mentais e persuasão",
      color: "text-green-400"
    },
    {
      icon: Zap,
      title: "Otimizando para conversão...",
      subtitle: "Ajustando tom e chamadas para ação",
      color: "text-yellow-400"
    },
    {
      icon: Sparkles,
      title: "Finalizando seu roteiro...",
      subtitle: "Aplicando os últimos toques de perfeição",
      color: "text-pink-400"
    }
  ];

  const motivationalTips = [
    "💡 Um bom roteiro pode aumentar o engajamento em até 300%!",
    "🎯 Estamos otimizando seu conteúdo para máxima conversão!",
    "🚀 Sua IA está aplicando as melhores práticas de copywriting!",
    "✨ Roteiros inteligentes geram 5x mais resultados!",
    "🔥 Cada palavra está sendo escolhida estrategicamente!",
    "💪 Seu conteúdo será irresistível para sua audiência!"
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 2 + 0.5;
      });
    }, 400);

    const timeInterval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    const pulseInterval = setInterval(() => {
      setPulseIntensity(Math.random() * 0.5 + 0.5);
    }, 800);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(timeInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  const currentMessage = messages[currentMessageIndex];
  const CurrentIcon = currentMessage.icon;
  const currentTip = motivationalTips[Math.floor(elapsed / 8) % motivationalTips.length];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-8">
          
          {/* Energia Sphere */}
          <div className="relative w-32 h-32">
            {/* Outer glow */}
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 animate-pulse"
              style={{
                transform: `scale(${1 + pulseIntensity * 0.3})`,
                filter: `blur(${10 + pulseIntensity * 5}px)`
              }}
            ></div>
            
            {/* Middle sphere */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-60 animate-spin" 
                 style={{ animationDuration: '4s' }}>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-white to-purple-200 opacity-80"></div>
            </div>
            
            {/* Inner energy core */}
            <div 
              className="absolute inset-8 rounded-full bg-gradient-to-r from-white to-purple-100 animate-pulse"
              style={{
                boxShadow: `0 0 ${20 + pulseIntensity * 15}px rgba(147, 51, 234, 0.8)`,
                transform: `scale(${0.8 + pulseIntensity * 0.4})`
              }}
            >
              <div className="absolute inset-2 rounded-full bg-white animate-spin" 
                   style={{ animationDuration: '2s' }}>
                <CurrentIcon className={`h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${currentMessage.color}`} />
              </div>
            </div>
            
            {/* Particle effects */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
                  style={{
                    top: `${20 + Math.sin(i * 45 * Math.PI / 180) * 40}%`,
                    left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 40}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Current Action */}
          <div className="text-center space-y-3">
            <h2 className={`text-3xl font-bold transition-all duration-500 ${currentMessage.color}`}>
              {currentMessage.title}
            </h2>
            <p className="text-lg text-muted-foreground transition-all duration-500 max-w-md">
              {currentMessage.subtitle}
            </p>
          </div>

          {/* Progress Section */}
          <div className="w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progresso da geração</span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatTime(elapsed)}
              </span>
            </div>
            
            <Progress value={progress} className="w-full h-3 bg-gray-800">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </Progress>
            
            <div className="text-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {Math.round(progress)}%
              </span>
              <span className="text-sm text-muted-foreground ml-2">concluído</span>
            </div>
          </div>

          {/* Motivational Tip */}
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 max-w-md">
            <p className="text-center text-purple-300 font-medium animate-pulse">
              {currentTip}
            </p>
          </div>

          {/* Processing Status */}
          {elapsed > 30 && (
            <div className="text-center text-sm text-yellow-400 animate-pulse">
              ⚡ Processamento avançado detectado - criando algo especial...
            </div>
          )}

          {elapsed > 45 && (
            <div className="text-center text-sm text-orange-400">
              🔥 Quase pronto - aplicando toques finais de genialidade!
            </div>
          )}

          {/* Loading Animation */}
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratingStep;
