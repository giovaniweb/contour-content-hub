
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
  Heart
} from "lucide-react";

// Componente de Loading Mágico com Perfil
const PensamentoMagico: React.FC<{ frase: string; perfil?: string }> = ({ frase, perfil }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="flex flex-col items-center space-y-4 p-8"
  >
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`w-16 h-16 border-4 rounded-full ${
          perfil === "profissional" 
            ? "border-blue-400 border-t-green-400" 
            : "border-purple-400 border-t-yellow-400"
        }`}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {perfil === "profissional" ? (
          <Briefcase className="w-8 h-8 text-green-400" />
        ) : (
          <Brain className="w-8 h-8 text-yellow-400" />
        )}
      </motion.div>
    </div>
    <motion.p
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`text-lg text-center font-medium ${
        perfil === "profissional" 
          ? "text-blue-100" 
          : "text-purple-100"
      }`}
    >
      {frase}
    </motion.p>
  </motion.div>
);

// Componente de Pergunta Melhorado
const PerguntaAnimada: React.FC<{
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
        bg: "from-blue-900/50 to-green-900/50"
      }
    : {
        primary: "purple-400",
        secondary: "yellow-400",
        gradient: "from-yellow-400 via-pink-500 to-purple-500", 
        bg: "from-purple-900/50 to-pink-900/50"
      };

  return (
    <motion.div
      key={pergunta.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", damping: 20 }}
      className="w-full space-y-6"
    >
      {/* Cabeçalho da Pergunta com Perfil */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {perfil === "profissional" ? (
              <UserCheck className={`w-6 h-6 text-${cores.secondary}`} />
            ) : (
              <Wand2 className={`w-6 h-6 text-${cores.secondary}`} />
            )}
          </motion.div>
          <div className="flex flex-col">
            <span className={`text-${cores.primary} font-medium`}>
              {pergunta.tipo === "perfil" ? "Identificação" : `Pergunta ${progresso + 1}`}
            </span>
            {perfil && (
              <span className="text-xs text-gray-300">
                {perfil === "profissional" ? "👩‍⚕️ Modo Profissional" : "✨ Modo Cliente"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className={`w-5 h-5 text-${cores.secondary}`} />
          <span className={`text-${cores.secondary} font-bold`}>{confianca}%</span>
        </div>
      </div>

      {/* Barra de Progresso Contextual */}
      <div className="space-y-2">
        <Progress 
          value={total > 0 ? (progresso / total) * 100 : 0} 
          className={`h-3 ${perfil === "profissional" ? "bg-blue-900/50" : "bg-purple-900/50"}`}
        />
        <div className="flex justify-between text-xs text-gray-300">
          <span>
            {perfil === "profissional" ? "Analisando perfil clínico..." : "Investigando necessidades..."}
          </span>
          <span>{progresso}/{total}</span>
        </div>
      </div>

      {/* Pergunta Principal */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`bg-gradient-to-r ${cores.bg} rounded-xl p-6 border border-${cores.secondary}/30`}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white text-center mb-6"
        >
          {pergunta.texto}
        </motion.h2>

        {/* Opções de Resposta Contextuais */}
        <div className="grid gap-3">
          {pergunta.opcoes.map((opcao: string, index: number) => (
            <motion.div
              key={opcao}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Button
                onClick={() => onResposta(opcao)}
                className={`w-full p-4 text-left bg-gradient-to-r ${cores.gradient} 
                           hover:scale-105 hover:shadow-lg
                           text-white font-semibold text-lg transition-all duration-300`}
              >
                <span className="flex items-center space-x-3">
                  {perfil === "profissional" ? (
                    <Briefcase className="w-5 h-5" />
                  ) : (
                    <Star className="w-5 h-5" />
                  )}
                  <span>{opcao}</span>
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
              {perfil === "profissional" ? "Por que é ideal para sua clínica:" : "Como eu descobri:"}
            </p>
            <p className="text-sm text-gray-300">
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
          {perfil === "profissional" ? "Nova Análise" : "Jogar Novamente"}
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
            ? `Diagnóstico concluído em ${tentativas === 0 ? 1 : tentativas} análise${tentativas !== 1 ? 's' : ''}! 💼`
            : `Descobri em ${tentativas === 0 ? 1 : tentativas} tentativa${tentativas !== 1 ? 's' : ''}! 🎯`}
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

  // Cores dinâmicas baseadas no perfil
  const backgroundClass = akinator.perfil === "profissional"
    ? "from-blue-900 via-cyan-900 to-green-900"
    : "from-purple-900 via-indigo-900 to-pink-900";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass} flex items-center justify-center p-4 transition-all duration-1000`}>
      <div className="max-w-2xl w-full">
        {/* Header Mágico Contextual */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="relative">
              {akinator.perfil === "profissional" ? (
                <UserCheck className="w-16 h-16 text-green-400" />
              ) : (
                <Gem className="w-16 h-16 text-yellow-400" />
              )}
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-full blur-lg ${
                  akinator.perfil === "profissional" ? "bg-green-400/20" : "bg-yellow-400/20"
                }`}
              />
            </div>
          </motion.div>
          
          <h1 className={`text-5xl font-bold bg-gradient-to-r ${
            akinator.perfil === "profissional" 
              ? "from-blue-400 via-green-500 to-cyan-500" 
              : "from-yellow-400 via-pink-500 to-purple-500"
          } bg-clip-text text-transparent mb-2`}>
            {akinator.perfil === "profissional" ? "Consultor Técnico" : "Akinator Estético"}
          </h1>
          <p className="text-lg text-gray-200">
            {akinator.perfil === "profissional" 
              ? "🏥 Encontre o equipamento ideal para sua clínica!"
              : "✨ Pense em um tratamento... Eu vou ler sua mente! 🔮"}
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
              <PerguntaAnimada
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
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {akinator.perfil === "profissional" ? (
                    <Briefcase className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  ) : (
                    <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  )}
                </motion.div>
                <h2 className="text-2xl font-bold text-white">
                  {akinator.fraseMagica}
                </h2>
                <p className="text-gray-200">
                  Estou {akinator.confianca}% confiante. 
                  {akinator.perfil === "profissional" 
                    ? " Posso apresentar minha recomendação técnica?"
                    : " Posso fazer minha revelação mágica?"}
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
                      <UserCheck className="w-5 h-5 mr-2" />
                      Apresentar Recomendação
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Revele Sua Descoberta!
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

        {/* Histórico Contextualizado */}
        {akinator.historico.length > 0 && (akinator.fase === "questionando" || akinator.fase === "perfil") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-black/20 rounded-xl p-4"
          >
            <p className="text-sm text-gray-300 mb-2">
              {akinator.perfil === "profissional" ? "Análise do perfil clínico:" : "Suas respostas até agora:"}
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {akinator.historico.slice(-3).map((item, index) => (
                <div key={index} className="text-xs text-gray-200">
                  <span className={akinator.perfil === "profissional" ? "text-green-300" : "text-yellow-300"}>
                    Q:
                  </span> {item.pergunta.slice(0, 50)}...
                  <br />
                  <span className={akinator.perfil === "profissional" ? "text-blue-300" : "text-pink-300"}>
                    R:
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
