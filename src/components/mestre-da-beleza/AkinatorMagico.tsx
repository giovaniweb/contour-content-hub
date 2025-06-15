
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useAkinatorIntentionTree } from "./hooks/useAkinatorIntentionTree";
import { IntentionNode } from "./intentionTree";

// Frase mística
const mysticalPhrases = [
  "O universo da beleza conspira por você.",
  "Cada escolha revela um novo caminho.",
  "O diagnóstico mágico está quase pronto!",
  "Sua jornada estética é única.",
  "Siga as pistas da sua transformação."
];

const AkinatorMagico: React.FC = () => {
  const { currentNode, history, completed, answer, reset, profile } = useAkinatorIntentionTree();

  // Calcula progresso com base no histórico
  const totalQuestionsEstimate = 5;
  const progress = Math.min(100, Math.round((history.length / totalQuestionsEstimate) * 100));
  const mysticalPhrase = mysticalPhrases[history.length % mysticalPhrases.length];

  // Busca o texto final na node
  function getFinalDiagnosis() {
    // Pega o último nó do histórico do usuário (deve ser final)
    let lastFinalNode: IntentionNode | undefined =
      currentNode && currentNode.type === "final"
        ? currentNode
        : INTENTION_TREE.find(n =>
            n.id === history[history.length - 1]?.questionId && n.type === "final"
          );
    // fallback: busca pelo id caso type diferente
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
            <span className="text-4xl mb-2">{emoji}</span>
          )}
          <h3 className="text-xl font-extrabold mb-2 text-pink-300 text-center drop-shadow">
            Consulta Finalizada!
          </h3>
          <div className="font-bold mb-2 text-white text-lg text-center">
            {/* Palpite do Akinator/Diagnóstico personalizado */}
            {text.split('\n').map((t, idx) => (
              <span key={idx} className="block">{t}</span>
            ))}
          </div>
          <div className="mt-3 italic text-purple-200 text-center text-sm">
            Obrigado por confiar na Jornada Fluida!
          </div>
        </div>
      );
    }

    // Se não houve final node clara
    return (
      <div className="text-purple-300">
        Perfil não identificado.<br /> Tente novamente!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-10 py-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">{currentNode?.emoji || "✨"}</span>
          <h2 className="text-white text-2xl font-bold text-center">Diagnóstico Estético Interativo</h2>
        </div>
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-2 border-purple-400/50 shadow-xl">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  {getFinalDiagnosis()}
                  <Button onClick={reset} variant="outline" className="mt-6">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Fazer novamente
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : currentNode ? (
            <motion.div
              key={currentNode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="border-purple-400 text-purple-400">
                  Pergunta {history.length + 1}
                </Badge>
                <span className="text-purple-300 italic text-sm">{mysticalPhrase}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-purple-300">
                  <span>Progresso</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-purple-900/50" />
              </div>
              <Card className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-2 border-purple-400/50 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-2xl font-bold text-white text-center mb-4">{currentNode.text}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentNode.options.map((option, idx) => (
                      <Button
                        key={idx}
                        onClick={() => answer(option)}
                        variant="outline"
                        className="w-full p-6 text-left h-auto hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 text-white"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{option}</span>
                          <ArrowRight className="h-4 w-4 text-purple-400 flex-shrink-0 ml-2" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="text-center">
                <Button
                  onClick={reset}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
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
