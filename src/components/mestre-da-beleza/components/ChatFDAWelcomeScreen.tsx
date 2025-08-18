import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Search, FileText, Video, Zap } from "lucide-react";

interface ChatFDAWelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const ChatFDAWelcomeScreen: React.FC<ChatFDAWelcomeScreenProps> = ({
  onSuggestionClick,
}) => {
  const suggestions = [
    {
      icon: Brain,
      title: "Diagnóstico Inteligente",
      description: "Análise personalizada do seu perfil estético",
      prompt: "Quero fazer um diagnóstico completo do meu perfil",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Search,
      title: "Equipamentos",
      description: "Qual equipamento é ideal para meus objetivos?",
      prompt: "Preciso de ajuda para escolher um equipamento",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      title: "Protocolos",
      description: "Protocolos e técnicas avançadas de tratamento",
      prompt: "Quero conhecer protocolos para tratamentos estéticos",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Video,
      title: "Conteúdo para Redes",
      description: "Roteiros e ideias para suas redes sociais",
      prompt: "Preciso de ideias para conteúdo no Instagram",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Zap,
      title: "Técnicas Inovadoras",
      description: "Últimas tendências em estética",
      prompt: "Quais são as técnicas mais inovadoras em estética?",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Sparkles,
      title: "Pergunta Personalizada",
      description: "Tire qualquer dúvida específica",
      prompt: "Tenho uma dúvida específica sobre estética",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Logo e Título */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Brain className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          ChatFDA
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          👋 Sua IA especializada em estética. Como posso te ajudar hoje?
        </p>
      </motion.div>

      {/* Sugestões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className="group relative p-6 rounded-xl border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-card/50 backdrop-blur-sm text-left"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${suggestion.color} flex-shrink-0`}>
                <suggestion.icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-2 text-foreground group-hover:text-primary transition-colors">
                  {suggestion.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Rodapé */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-muted-foreground">
          ✨ Powered by AI • Especializado em Estética Avançada
        </p>
      </motion.div>
    </div>
  );
};

export default ChatFDAWelcomeScreen;