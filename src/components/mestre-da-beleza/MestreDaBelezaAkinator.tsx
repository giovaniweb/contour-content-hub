import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Crown, Wand2, Sparkles, Trophy, RefreshCw, CheckCircle, Star } from "lucide-react";
import { useEquipments } from "@/hooks/useEquipments";
import { useEsteticaAkinator, AKINATOR_QUESTIONS } from "@/hooks/useEsteticaAkinator";

const MestreDaBelezaAkinator: React.FC = () => {
  const { equipments } = useEquipments();
  const akinator = useEsteticaAkinator(equipments);

  // Mostra explicações do score para debugging/validação;
  function explicacaoDetalhada(eq: any) {
    if (!eq._explicacao?.length) return null;
    return (
      <div className="text-xs text-purple-300 mt-2">
        <span className="font-bold text-purple-200">Por que?</span>
        {eq._neg && (
          <span className="ml-2 text-red-400 font-semibold">(Respondeu 'Não' para sintomas ligados)</span>
        )}
        <ul className="mt-1 list-inside list-disc">
          {eq._explicacao.map((fx: any, i: number) => (
            <li key={i}>
              <span className="text-yellow-200">{fx.chave}</span>
              {" em "}
              <span className="italic">{fx.campo}</span>
              {" (peso +" + fx.peso + ")"}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-6">
      <div className="max-w-3xl mx-auto flex flex-col items-center space-y-8 animate-fade-in">
        {/* Cabeçalho Akinator */}
        <motion.div 
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 shadow-glow flex items-center justify-center scale-110">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Akinator Estético
          </h1>
          <p className="text-white/80">Responda sinceramente — eu vou adivinhar o melhor equipamento para você 🚀</p>
        </motion.div>

        {/* Barra de perguntas */}
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-purple-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>Pergunta {akinator.history.length + 1}/{AKINATOR_QUESTIONS.length}</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-300">
            <Star className="w-4 h-4" />
            Confiança:
            <span className="font-bold text-xl text-yellow-400">{akinator.confidence}%</span>
          </div>
        </div>
        <Progress value={100 * (akinator.history.length) / AKINATOR_QUESTIONS.length} 
                  className="h-3 bg-purple-900/50" />

        {/* Painel Pergunta ou Resultados */}
        <div className="w-full mt-2">
          <AnimatePresence mode="wait">
            {!akinator.ended && akinator.nextQuestion && (
              <motion.div
                key={akinator.nextQuestion.context}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="p-6 bg-white/10 rounded-xl border border-purple-500/20 shadow-xl flex flex-col items-center space-y-5"
              >
                <div className="text-2xl text-white font-medium text-center">{akinator.nextQuestion.text}</div>
                <div className="flex flex-col gap-3 w-full max-w-md">
                  {akinator.nextQuestion.options.map(op => (
                    <Button
                      key={op}
                      onClick={() => akinator.answer(akinator.nextQuestion!.context, op)}
                      variant="outline"
                      className="w-full p-4 bg-white/5 border-purple-400/50 text-purple-100 hover:bg-purple-600/30 hover:border-purple-300 text-left justify-start text-lg"
                    >
                      {op}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
            {akinator.ended && (
              <motion.div
                key="akinator-guess"
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-br from-yellow-50/25 via-pink-100/10 to-purple-200/10 rounded-2xl border-2 border-yellow-300/30 shadow-2xl flex flex-col items-center space-y-8"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <span className="text-3xl font-bold text-yellow-400 drop-shadow">Akinator adivinhou!</span>
                </div>
                <div className="text-xl text-purple-900/80 mb-2">Meu melhor palpite:</div>
                
                {/* Exibe top-3 explicando os motivos */}
                <div className="flex flex-wrap gap-4 justify-center w-full">
                  {akinator.ranking.slice(0, 3).map((eq, idx) => (
                    <div key={eq.id} className="p-4 bg-gradient-to-br from-purple-900/50 to-pink-900/30 rounded-xl flex flex-col items-center w-60 border border-purple-400/30 shadow">
                      <div className="text-lg text-yellow-200 mb-1 font-semibold">#{idx+1}</div>
                      <div className="text-white font-bold mb-1">{eq.nome}</div>
                      <div className="text-xs text-purple-200 mb-2">{eq.tecnologia}</div>
                      {eq.image_url && (
                        <img src={eq.image_url} alt={eq.nome} className="w-full h-16 object-cover mb-2 rounded"/>
                      )}
                      <div className="text-xs text-yellow-300">Score: {eq._score}</div>
                      {explicacaoDetalhada(eq)}
                    </div>
                  ))}
                </div>

                <div className="my-4 flex flex-col items-center space-y-1">
                  <span className="text-purple-900/70">Concorda com o palpite ou quer tentar de novo?</span>
                  <Button onClick={akinator.reset} variant="ghost" className="mt-2 text-purple-500 hover:text-yellow-500">
                    <RefreshCw className="w-4 h-4 mr-2" /> Nova rodada
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Histórico das respostas para debug/UX opcional */}
        <div className="w-full max-w-xl mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-xl p-4 text-xs text-purple-100"
          >
            <div className="mb-2 font-bold text-yellow-200">Histórico:</div>
            {akinator.history.map((h, i) => (
              <div key={i}>
                <span className="text-purple-200">{i+1}.</span> <span className="font-semibold">{h.context}</span>: <span>{h.answer}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MestreDaBelezaAkinator;
