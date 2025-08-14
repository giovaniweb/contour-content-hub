import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Instagram, BookOpen, Wrench, FlaskConical, FileText, Video, Search, Lightbulb } from 'lucide-react';

interface ChatFDAWelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const ChatFDAWelcomeScreen: React.FC<ChatFDAWelcomeScreenProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      icon: Instagram,
      title: "Criar roteiro para Instagram",
      description: "Roteiros prontos para posts e stories sobre estética",
      prompt: "Crie um roteiro para Instagram sobre preenchimento labial com dicas profissionais",
      color: "from-pink-500/20 to-purple-500/20 border-pink-500/30"
    },
    {
      icon: BookOpen,
      title: "Protocolos avançados",
      description: "Técnicas e protocolos para tratamentos estéticos",
      prompt: "Me ensine um protocolo completo de harmonização facial passo a passo",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
    },
    {
      icon: Wrench,
      title: "Escolher equipamentos",
      description: "Recomendações de equipamentos para sua clínica",
      prompt: "Qual o melhor equipamento para tratar flacidez corporal e facial?",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30"
    },
    {
      icon: FlaskConical,
      title: "Estudos científicos",
      description: "Artigos e pesquisas da base científica",
      prompt: "Preciso de estudos científicos sobre eficácia da radiofrequência",
      color: "from-orange-500/20 to-red-500/20 border-orange-500/30"
    },
    {
      icon: Video,
      title: "Vídeos específicos",
      description: "Encontrar vídeos sobre técnicas e procedimentos",
      prompt: "Mostre vídeos sobre técnicas de aplicação de botox",
      color: "from-violet-500/20 to-indigo-500/20 border-violet-500/30"
    },
    {
      icon: Search,
      title: "Pesquisa personalizada",
      description: "Busca inteligente na base de conhecimento",
      prompt: "Quero aprender sobre criolipólise: equipamentos, protocolos e estudos",
      color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      {/* Avatar e Título */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          ChatFDA
        </h1>
        <p className="text-muted-foreground text-sm max-w-md">
          Sua IA especializada em estética. Como posso ajudar você hoje?
        </p>
      </motion.div>

      {/* Cards de Sugestões */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-4xl"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className={`group relative p-4 rounded-xl border bg-gradient-to-br ${suggestion.color} hover:scale-[1.02] transition-all duration-200 text-left`}
            whileHover={{ y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-background/50">
                <suggestion.icon className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground text-sm mb-1">
                  {suggestion.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Footer com informações */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          <span>Baseado em mais de 1000+ equipamentos e estudos científicos</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatFDAWelcomeScreen;