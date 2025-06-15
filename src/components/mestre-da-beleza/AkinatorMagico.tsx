import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useAkinatorIntentionTree } from "./hooks/useAkinatorIntentionTree";
import { IntentionNode } from "./intentionTree";
import { INTENTION_TREE } from "./intentionTree";
import GenioMestreHeader from "./components/GenioMestreHeader";
import { mysticalIntroPhrases, mysticalThinkingPhrases, genioQuestionPhrases } from "./genioPhrases";
import { useRef, useState } from "react";

import AuroraParticles from "./components/AuroraParticles";

const genieNames = ["Jasmin", "Akinario", "Mirabella", "O Gênio Fluido", "Aura"];
function getRandom(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

const AkinatorMagico: React.FC = () => {
  const { currentNode, history, completed, answer, reset, profile } = useAkinatorIntentionTree();
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Progresso intuitivo
  const totalQuestionsEstimate = 5;
  const progress = Math.min(100, Math.round((history.length / totalQuestionsEstimate) * 100));
  const genieName = useRef(getRandom(genieNames)).current;

  function handleGenioAnswer(option: string) {
    if (isThinking) return;
    setIsThinking(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      answer(option);
      setIsThinking(false);
    }, 1200 + Math.random() * 1000);
  }

  // Frase mágica para cada passo
  let genieStep: "intro" | "question" | "thinking" | "final" = "intro";
  let geniePhrase = mysticalIntroPhrases[history.length % mysticalIntroPhrases.length];
  if (completed) {
    genieStep = "final";
    geniePhrase = `Eis sua revelação, buscador da beleza! 🌟`;
  } else if (isThinking) {
    genieStep = "thinking";
    geniePhrase = getRandom(mysticalThinkingPhrases);
  } else if (currentNode) {
    genieStep = "question";
    geniePhrase = getRandom(genioQuestionPhrases);
  }

  function getFinalDiagnosis() {
    let lastFinalNode: IntentionNode | undefined =
      currentNode && currentNode.type === "final"
        ? currentNode
        : INTENTION_TREE.find(n =>
            n.id === history[history.length - 1]?.questionId && n.type === "final"
          );
    if (!lastFinalNode && history.length > 0) {
      lastFinalNode = INTENTION_TREE.find(n => n.id === history[history.length - 1].questionId);
    }
    if (lastFinalNode && lastFinalNode.type === "final") {
      const emojiRe = /([^\w\s,.!?'"“”‘’]+)/;
      const parts = lastFinalNode.text.split(emojiRe);
      const emoji = parts.find(p => emojiRe.test(p));
      const text = lastFinalNode.text.replace(emoji || "", "").trim();
      return (
        <div className="flex flex-col items-center">
          {emoji && (
            <span className="text-4xl mb-2 animate-bounce">{emoji}</span>
          )}
          <h3 className="text-xl font-extrabold mb-2 text-pink-300 text-center drop-shadow font-playfair">
            {genieName} teve uma visão!
          </h3>
          <div className="font-bold mb-2 text-white text-lg text-center">
            <span className="block italic text-purple-200 mb-2">"{getRandom([
              "Vejo esta recomendação envolta em névoas brilhantes...",
              "O destino sorri para você com esta revelação!",
              "As energias místicas convergem para esta escolha.",
            ])}"</span>
            {text.split('\n').map((t, idx) => (
              <span key={idx} className="block">{t}</span>
            ))}
          </div>
          <div className="mt-3 italic text-purple-200 text-center text-sm">
            Obrigado por confiar seu mistério ao {genieName}!<br/>Continue explorando o universo da beleza.
          </div>
        </div>
      );
    }
    return (
      <div className="text-purple-300">
        O gênio ainda não decifrou este destino.<br /> Tente novamente!
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center aurora-gradient-bg px-2 py-8">
      {/* Aurora Partículas mágicas de fundo */}
      <AuroraParticles />

      <div className="relative z-10 mx-auto w-full max-w-2xl flex flex-col gap-10 py-9 px-2 sm:px-4">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 68 }}
        >
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="animate-pulse shadow-xl crystal-pulse rounded-full p-4 bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600 border-4 border-yellow-400/30">
              <Sparkles className="text-white drop-shadow" size={52} />
            </span>
            <GenioMestreHeader step={genieStep} phrase={geniePhrase} />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.90, y: 80 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 64 }}
              className="space-y-6"
            >
              <Card className="aurora-card border-2 border-purple-400/50 shadow-2xl backdrop-blur-lg">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  {getFinalDiagnosis()}
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="mt-6 rounded-full font-bold bg-gradient-to-r from-purple-700 to-pink-500 text-white shadow-lg hover:from-purple-800 hover:to-pink-600 transition"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Invocar o Gênio Novamente
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : currentNode ? (
            <motion.div
              key={currentNode.id}
              initial={{ opacity: 0, x: 24, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -16, scale: 0.96 }}
              className="space-y-10"
            >
              <div className="flex flex-col gap-2 items-center">
                <span className="text-xl md:text-2xl text-purple-200 animate-bounce">💫 Energia mística: <span className="font-bold text-yellow-200">{progress}%</span></span>
                <div className="w-full max-w-md">
                  <Progress value={progress} className="h-3 bg-purple-900/40 magical-glow rounded-lg" />
                </div>
              </div>
              <Card className="aurora-card border-2 border-purple-400/50 shadow-xl magical-glow backdrop-blur-lg">
                <CardContent className="p-8">
                  <div className="text-2xl font-bold text-magical text-center mb-4 font-playfair drop-shadow">
                    {getRandom([
                      "O gênio indaga:",
                      "A aura revela:",
                      "Seu destino pergunta:",
                      "A dúvida paira no ar:"
                    ])}
                    <br />
                    <span className="block mt-2 text-white">{currentNode.text}</span>
                  </div>
                  {isThinking ? (
                    <div className="flex flex-col items-center gap-4 my-8">
                      <span className="crystal-pulse rounded-full w-16 h-16 flex items-center justify-center bg-amber-300/30 border-2 border-pink-200/30 shadow-lg">
                        <Sparkles className="text-pink-200 animate-pulse" size={40} />
                      </span>
                      <div className="text-lg text-pink-200 italic text-center animate-bounce-slow">
                        {getRandom(mysticalThinkingPhrases)}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {currentNode.options.map((option, idx) => (
                        <Button
                          key={idx}
                          onClick={() => handleGenioAnswer(option)}
                          variant="outline"
                          className="w-full p-6 text-left h-auto rounded-xl hover:bg-purple-500/30 hover:border-yellow-300 transition-all duration-300 text-white backdrop-blur shadow-lg font-medium bg-purple-800/30"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-lg">{option}</span>
                            <ArrowRight className="h-4 w-4 text-yellow-300 flex-shrink-0 ml-2" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Reiniciar */}
              <div className="text-center">
                <Button
                  onClick={reset}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Recomeçar consulta
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AkinatorMagico;
