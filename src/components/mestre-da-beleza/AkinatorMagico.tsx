import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAkinatorMagico } from "@/hooks/useAkinatorMagico";
import { useEquipments } from "@/hooks/useEquipments";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Crown, 
  Star, 
  Wand2, 
  Eye, 
  RefreshCw, 
  Zap,
  Brain,
  Gem,
  UserCheck,
  Briefcase,
  Heart,
  Lightbulb,
  Crystal
} from "lucide-react";

// Componente de Loading Mágico Melhorado
const PensamentoMagico: React.FC<{ frase: string; perfil?: string }> = ({ frase, perfil }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="flex flex-col items-center space-y-6 p-8"
  >
    {/* Cristal Mágico Animado */}
    <div className="relative">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity }
        }}
        className={`w-20 h-20 rounded-full border-4 ${
          perfil === "profissional" 
            ? "border-blue-400 border-t-green-400 bg-gradient-to-r from-blue-500/20 to-green-500/20" 
            : "border-purple-400 border-t-yellow-400 bg-gradient-to-r from-purple-500/20 to-yellow-500/20"
        }`}
      />
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Crystal className={`w-10 h-10 ${
          perfil === "profissional" ? "text-green-400" : "text-yellow-400"
        }`} />
      </motion.div>
      
      {/* Partículas Mágicas */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${
            perfil === "profissional" ? "bg-green-400" : "bg-yellow-400"
          }`}
          animate={{
            x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
            y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2
          }}
          style={{
            left: '50%',
            top: '50%'
          }}
        />
      ))}
    </div>
    
    <motion.p
      animate={{ 
        opacity: [0.7, 1, 0.7],
        y: [0, -5, 0]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`text-xl text-center font-medium ${
        perfil === "profissional" 
          ? "text-blue-100" 
          : "text-purple-100"
      }`}
    >
      {frase}
    </motion.p>
    
    {/* Indicador de Análise Comportamental */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="flex items-center space-x-2 text-sm text-gray-300"
    >
      <Brain className="w-4 h-4" />
      <span>Analisando padrões comportamentais...</span>
    </motion.div>
  </motion.div>
);

// Componente de Pergunta Intuitiva Melhorada
const PerguntaIntuitiva: React.FC<{
  pergunta: any;
  onResposta: (resposta: string) => void;
  confianca: number;
  progresso: number;
  total: number;
  perfil?: string;
}> = ({ pergunta, onResposta, confianca, progresso, total, perfil }) => {
  
  const cores = perfil === "profissional" 
    ? {
        primary: "blue-400",
        secondary: "green-400", 
        gradient: "from-blue-400 via-green-500 to-cyan-500",
        bg: "from-blue-900/50 to-green-900/50",
        icon: UserCheck
      }
    : {
        primary: "purple-400",
        secondary: "yellow-400",
        gradient: "from-yellow-400 via-pink-500 to-purple-500", 
        bg: "from-purple-900/50 to-pink-900/50",
        icon: Heart
      };

  const getTipoIcon = (tipo: string) => {
    const icons = {
      comportamental: Brain,
      psicologica: Heart,
      nostalgica: Star,
      lifestyle: Lightbulb,
      emocional: Gem
    };
    return icons[tipo as keyof typeof icons] || Brain;
  };

  const TipoIcon = getTipoIcon(pergunta.tipo);
  const IconePerfil = cores.icon;

  return (
    <motion.div
      key={pergunta.id}
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ type: "spring", damping: 20 }}
      className="w-full space-y-6"
    >
      {/* Cabeçalho Mágico da Pergunta */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative"
          >
            <div className={`p-3 bg-gradient-to-r ${cores.gradient} rounded-full`}>
              <TipoIcon className="w-6 h-6 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute -inset-1 bg-${cores.secondary}/20 rounded-full blur-sm`}
            />
          </motion.div>
          
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className={`text-${cores.primary} font-medium`}>
                {pergunta.tipo === "comportamental" ? "🧠 Insight Comportamental" : 
                 pergunta.tipo === "psicologica" ? "💭 Análise Psicológica" :
                 pergunta.tipo === "nostalgica" ? "⭐ Memória Nostálgica" :
                 pergunta.tipo === "lifestyle" ? "💡 Estilo de Vida" :
                 "💎 Essência Emocional"}
              </span>
            </div>
            {perfil && (
              <div className="flex items-center space-x-1">
                <IconePerfil className="w-4 h-4 text-gray-300" />
                <span className="text-xs text-gray-300">
                  {perfil === "profissional" ? "👩‍⚕️ Análise Profissional" : "✨ Leitura Pessoal"}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Eye className={`w-5 h-5 text-${cores.secondary}`} />
            <span className={`text-${cores.secondary} font-bold text-lg`}>{confianca}%</span>
          </div>
          {confianca > 60 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Barra de Progresso Mágica */}
      <div className="space-y-3">
        <div className="relative">
          <Progress 
            value={total > 0 ? (progresso / total) * 100 : 0} 
            className={`h-4 ${perfil === "profissional" ? "bg-blue-900/50" : "bg-purple-900/50"} rounded-full overflow-hidden`}
          />
          <motion.div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${cores.gradient} rounded-full opacity-60`}
            initial={{ width: 0 }}
            animate={{ width: `${total > 0 ? (progresso / total) * 100 : 0}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-300">
          <span>
            {perfil === "profissional" 
              ? "🔬 Analisando seu perfil clínico..." 
              : "🔮 Interpretando sua essência..."}
          </span>
          <span className="font-medium">{progresso + 1}/{total}</span>
        </div>
      </div>

      {/* Pergunta Principal com Contexto Mágico */}
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`bg-gradient-to-r ${cores.bg} rounded-2xl p-8 border-2 border-${cores.secondary}/30 relative overflow-hidden`}
      >
        {/* Efeito de Brilho */}
        <motion.div
          animate={{
            x: [-100, 300],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className={`absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-${cores.secondary}/30 to-transparent skew-x-12`}
        />
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white text-center mb-8 leading-relaxed"
        >
          {pergunta.texto}
        </motion.h2>

        {/* Opções de Resposta Intuitivas */}
        <div className="grid gap-4">
          {pergunta.opcoes.map((opcao: string, index: number) => (
            <motion.div
              key={opcao}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.4 }}
            >
              <Button
                onClick={() => onResposta(opcao)}
                className={`w-full p-6 text-left bg-gradient-to-r ${cores.gradient} 
                           hover:scale-105 hover:shadow-2xl
                           text-white font-semibold text-lg transition-all duration-300
                           border border-white/20 hover:border-white/40
                           group relative overflow-hidden`}
              >
                {/* Efeito Hover */}
                <motion.div
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                
                <span className="flex items-center space-x-4 relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="opacity-60 group-hover:opacity-100"
                  >
                    {perfil === "profissional" ? (
                      <Briefcase className="w-6 h-6" />
                    ) : (
                      <Star className="w-6 h-6" />
                    )}
                  </motion.div>
                  <span className="group-hover:text-yellow-100 transition-colors">
                    {opcao}
                  </span>
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente de Revelação com Contexto
const RevelacaoEpica: React.FC<{
  equipamentos: any[];
  tentativas: number;
  onReset: () => void;
  explicacao: string;
  perfil?: string;
}> = ({ equipamentos, tentativas, onReset, explicacao, perfil }) => {
  const equipamentoEscolhido = equipamentos[0];
  
  const cores = perfil === "profissional"
    ? {
        title: "text-blue-300",
        accent: "text-green-400",
        gradient: "from-blue-100/20 to-green-100/20",
        border: "border-green-400/50"
      }
    : {
        title: "text-yellow-300", 
        accent: "text-purple-300",
        gradient: "from-yellow-100/20 to-purple-100/20",
        border: "border-yellow-400/50"
      };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15 }}
      className="w-full space-y-8"
    >
      {/* Explosão de Celebração Contextual */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 1, type: "spring" }}
        className="flex justify-center"
      >
        <div className="relative">
          {perfil === "profissional" ? (
            <UserCheck className="w-20 h-20 text-green-400" />
          ) : (
            <Crown className="w-20 h-20 text-yellow-400" />
          )}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -inset-4"
          >
            <Sparkles className="w-28 h-28 text-green-300 opacity-50" />
          </motion.div>
        </div>
      </motion.div>

      {/* Proclamação Contextual */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-4"
      >
        <motion.h1
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`text-4xl font-bold bg-gradient-to-r from-blue-400 via-green-500 to-cyan-500 bg-clip-text text-transparent`}
        >
          {perfil === "profissional" ? "IDENTIFIQUEI SEU EQUIPAMENTO!" : "EU ADIVINHEI!"}
        </motion.h1>
        <p className="text-xl text-gray-100">
          {perfil === "profissional" 
            ? "O equipamento ideal para sua clínica é..." 
            : "Você está pensando em..."}
        </p>
      </motion.div>

      {/* Card do Equipamento Contextual */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
        className={`bg-gradient-to-br ${cores.gradient} rounded-2xl p-8 border-2 ${cores.border}`}
      >
        <div className="text-center space-y-4">
          <motion.h2
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`text-3xl font-bold ${cores.title}`}
          >
            {equipamentoEscolhido?.nome || "Equipamento Recomendado"}
          </motion.h2>
          
          <div className="bg-black/20 rounded-lg p-4">
            <p className={`text-lg ${cores.accent}`}>
              {equipamentoEscolhido?.tecnologia || "Tecnologia avançada"}
            </p>
          </div>

          {equipamentoEscolhido?.image_url && (
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              src={equipamentoEscolhido.image_url}
              alt={equipamentoEscolhido.nome}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <div className="space-y-2">
            <p className="text-gray-200 font-medium">
              {perfil === "profissional" ? "Como descobri através da sua essência profissional:" : "Como li em sua alma:"}
            </p>
            <p className="text-sm text-gray-300 italic">
              {explicacao}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Ações Finais */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex justify-center space-x-4"
      >
        <Button
          onClick={onReset}
          className={`bg-gradient-to-r ${
            perfil === "profissional" 
              ? "from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500"
              : "from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
          }`}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {perfil === "profissional" ? "Nova Leitura" : "Jogar Novamente"}
        </Button>
      </motion.div>

      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center text-sm text-gray-300"
      >
        <p>
          {perfil === "profissional" 
            ? `✨ Análise comportamental concluída em ${tentativas === 0 ? 1 : tentativas} leitura${tentativas !== 1 ? 's' : ''}! 💼`
            : `🔮 Li sua mente em ${tentativas === 0 ? 1 : tentativas} tentativa${tentativas !== 1 ? 's' : ''}! ✨`}
        </p>
      </motion.div>
    </motion.div>
  );
};

export const AkinatorMagico: React.FC = () => {
  const { equipments } = useEquipments();
  const akinator = useAkinatorMagico(equipments);

  if (!equipments || equipments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Carregando equipamentos...</h2>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  const backgroundClass = akinator.perfil === "profissional"
    ? "from-blue-900 via-cyan-900 to-green-900"
    : "from-purple-900 via-indigo-900 to-pink-900";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass} flex items-center justify-center p-4 transition-all duration-1000`}>
      <div className="max-w-2xl w-full">
        {/* Header Mágico Melhorado */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="relative">
              {akinator.perfil === "profissional" ? (
                <UserCheck className="w-16 h-16 text-green-400" />
              ) : (
                <Crystal className="w-16 h-16 text-yellow-400" />
              )}
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute inset-0 rounded-full blur-xl ${
                  akinator.perfil === "profissional" ? "bg-green-400/30" : "bg-yellow-400/30"
                }`}
              />
            </div>
          </motion.div>
          
          <h1 className={`text-5xl font-bold bg-gradient-to-r ${
            akinator.perfil === "profissional" 
              ? "from-blue-400 via-green-500 to-cyan-500" 
              : "from-yellow-400 via-pink-500 to-purple-500"
          } bg-clip-text text-transparent mb-2`}>
            {akinator.perfil === "profissional" ? "🔬 Analista Comportamental" : "🔮 Leitor de Mentes"}
          </h1>
          <p className="text-lg text-gray-200">
            {akinator.perfil === "profissional" 
              ? "🧠 Analisando seu perfil profissional através de insights comportamentais!"
              : "✨ Decifrando sua personalidade para revelar o tratamento dos seus sonhos! 💫"}
          </p>
        </motion.div>

        {/* Container Principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {akinator.pensando && (
              <PensamentoMagico frase={akinator.frasePensando} perfil={akinator.perfil || undefined} />
            )}
            
            {!akinator.pensando && (akinator.fase === "perfil" || akinator.fase === "questionando") && akinator.perguntaAtual && (
              <PerguntaIntuitiva
                pergunta={akinator.perguntaAtual}
                onResposta={akinator.responder}
                confianca={akinator.confianca}
                progresso={akinator.progressoPerguntas}
                total={akinator.totalPerguntas}
                perfil={akinator.perfil || undefined}
              />
            )}
            
            {akinator.fase === "tentativa" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {akinator.perfil === "profissional" ? (
                    <Brain className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  ) : (
                    <Crystal className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  )}
                </motion.div>
                <h2 className="text-2xl font-bold text-white">
                  {akinator.fraseMagica}
                </h2>
                <p className="text-gray-200">
                  {akinator.perfil === "profissional" 
                    ? `🎯 Minha análise comportamental está ${akinator.confianca}% precisa. Posso revelar minha descoberta?`
                    : `🔮 Li sua mente com ${akinator.confianca}% de clareza. Posso fazer minha revelação mágica?`}
                </p>
                <Button
                  onClick={akinator.fazerTentativa}
                  className={`bg-gradient-to-r ${
                    akinator.perfil === "profissional"
                      ? "from-blue-400 to-green-500 hover:from-blue-300 hover:to-green-400"
                      : "from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400"
                  } text-white font-bold text-lg px-8 py-3`}
                >
                  {akinator.perfil === "profissional" ? (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      🔬 Revelar Análise
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      🔬 Revelar Segredo!
                    </>
                  )}
                </Button>
              </motion.div>
            )}
            
            {akinator.fase === "revelacao" && (
              <RevelacaoEpica
                equipamentos={akinator.equipamentosRestantes}
                tentativas={akinator.tentativas}
                onReset={akinator.reset}
                explicacao={akinator.explicacaoEscolha}
                perfil={akinator.perfil || undefined}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Histórico Comportamental */}
        {akinator.historico.length > 0 && (akinator.fase === "questionando" || akinator.fase === "perfil") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-black/20 rounded-xl p-4"
          >
            <p className="text-sm text-gray-300 mb-2 flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>
                {akinator.perfil === "profissional" 
                  ? "🧠 Insights comportamentais captados:" 
                  : "✨ Pistas da sua personalidade:"}
              </span>
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {akinator.historico.slice(-3).map((item, index) => (
                <div key={index} className="text-xs text-gray-200">
                  <span className={akinator.perfil === "profissional" ? "text-green-300" : "text-yellow-300"}>
                    💭:
                  </span> {item.pergunta.slice(0, 40)}...
                  <br />
                  <span className={akinator.perfil === "profissional" ? "text-blue-300" : "text-pink-300"}>
                    💫:
                  </span> {item.resposta}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AkinatorMagico;
