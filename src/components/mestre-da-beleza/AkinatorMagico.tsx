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
  Gem
} from "lucide-react";

// Componente de Loading Mágico
const PensamentoMagico: React.FC<{ frase: string }> = ({ frase }) => (
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
        className="w-16 h-16 border-4 border-purple-400 border-t-yellow-400 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Brain className="w-8 h-8 text-yellow-400" />
      </motion.div>
    </div>
    <motion.p
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="text-lg text-purple-100 text-center font-medium"
    >
      {frase}
    </motion.p>
  </motion.div>
);

// Componente de Pergunta com Animação
const PerguntaAnimada: React.FC<{
  pergunta: any;
  onResposta: (resposta: string) => void;
  confianca: number;
  progresso: number;
  total: number;
}> = ({ pergunta, onResposta, confianca, progresso, total }) => (
  <motion.div
    key={pergunta.id}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ type: "spring", damping: 20 }}
    className="w-full space-y-6"
  >
    {/* Cabeçalho da Pergunta */}
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Wand2 className="w-6 h-6 text-yellow-400" />
        </motion.div>
        <span className="text-purple-200 font-medium">
          Pergunta {progresso + 1}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Eye className="w-5 h-5 text-yellow-400" />
        <span className="text-yellow-300 font-bold">{confianca}%</span>
      </div>
    </div>

    {/* Barra de Progresso */}
    <div className="space-y-2">
      <Progress 
        value={(progresso / total) * 100} 
        className="h-3 bg-purple-900/50"
      />
      <div className="flex justify-between text-xs text-purple-300">
        <span>Investigando...</span>
        <span>{progresso}/{total}</span>
      </div>
    </div>

    {/* Pergunta Principal */}
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-yellow-400/30"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-white text-center mb-6"
      >
        {pergunta.texto}
      </motion.h2>

      {/* Opções de Resposta */}
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
              className="w-full p-4 text-left bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 
                         hover:from-yellow-300 hover:via-pink-400 hover:to-purple-400
                         text-white font-semibold text-lg transition-all duration-300
                         hover:scale-105 hover:shadow-lg"
            >
              <span className="flex items-center space-x-3">
                <Star className="w-5 h-5" />
                <span>{opcao}</span>
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

// Componente de Revelação Épica
const RevelacaoEpica: React.FC<{
  equipamentos: any[];
  tentativas: number;
  onReset: () => void;
}> = ({ equipamentos, tentativas, onReset }) => {
  const equipamentoEscolhido = equipamentos[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15 }}
      className="w-full space-y-8"
    >
      {/* Explosão de Estrelas */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 1, type: "spring" }}
        className="flex justify-center"
      >
        <div className="relative">
          <Crown className="w-20 h-20 text-yellow-400" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -inset-4"
          >
            <Sparkles className="w-28 h-28 text-yellow-300 opacity-50" />
          </motion.div>
        </div>
      </motion.div>

      {/* Proclamação */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-4"
      >
        <motion.h1
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
        >
          EU ADIVINHEI!
        </motion.h1>
        <p className="text-xl text-purple-100">
          Você está pensando em...
        </p>
      </motion.div>

      {/* Card do Equipamento */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="bg-gradient-to-br from-yellow-100/20 to-purple-100/20 rounded-2xl p-8 border-2 border-yellow-400/50"
      >
        <div className="text-center space-y-4">
          <motion.h2
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-3xl font-bold text-yellow-300"
          >
            {equipamentoEscolhido?.nome || "Equipamento Mágico"}
          </motion.h2>
          
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-lg text-purple-100">
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
            <p className="text-purple-200 font-medium">Por que escolhi este?</p>
            <p className="text-sm text-purple-300">
              {equipamentoEscolhido?.indicacoes || "Baseado nas suas respostas únicas"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Ações */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex justify-center space-x-4"
      >
        <Button
          onClick={onReset}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Jogar Novamente
        </Button>
      </motion.div>

      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center text-sm text-purple-300"
      >
        <p>Descobri em {tentativas === 0 ? 1 : tentativas} tentativa{tentativas !== 1 ? 's' : ''}! 🎯</p>
      </motion.div>
    </motion.div>
  );
};

export const AkinatorMagico: React.FC = () => {
  const { equipments } = useEquipments();
  const akinator = useAkinatorMagico(equipments);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header Mágico */}
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
              <Gem className="w-16 h-16 text-yellow-400" />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-yellow-400/20 rounded-full blur-lg"
              />
            </div>
          </motion.div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Akinator Estético
          </h1>
          <p className="text-lg text-purple-200">
            Pense em um equipamento... Eu vou ler sua mente! 🔮
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
              <PensamentoMagico frase={akinator.frasePensando} />
            )}
            
            {!akinator.pensando && akinator.fase === "questionando" && akinator.perguntaAtual && (
              <PerguntaAnimada
                pergunta={akinator.perguntaAtual}
                onResposta={akinator.responder}
                confianca={akinator.confianca}
                progresso={akinator.progressoPerguntas}
                total={akinator.totalPerguntas}
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
                  <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">
                  {akinator.fraseMagica}
                </h2>
                <p className="text-purple-200">
                  Estou {akinator.confianca}% confiante. Posso fazer minha revelação?
                </p>
                <Button
                  onClick={akinator.fazerTentativa}
                  className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 text-white font-bold text-lg px-8 py-3"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Revele Sua Descoberta!
                </Button>
              </motion.div>
            )}
            
            {akinator.fase === "revelacao" && (
              <RevelacaoEpica
                equipamentos={akinator.equipamentosRestantes}
                tentativas={akinator.tentativas}
                onReset={akinator.reset}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Histórico/Debug */}
        {akinator.historico.length > 0 && akinator.fase === "questionando" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-black/20 rounded-xl p-4"
          >
            <p className="text-sm text-purple-300 mb-2">Suas respostas até agora:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {akinator.historico.slice(-3).map((item, index) => (
                <div key={index} className="text-xs text-purple-200">
                  <span className="text-yellow-300">Q:</span> {item.pergunta.slice(0, 50)}...
                  <br />
                  <span className="text-pink-300">R:</span> {item.resposta}
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
