
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useAkinatorIntentionTree } from "./hooks/useAkinatorIntentionTree";
import { IntentionNode } from "./intentionTree";

// Mantém visual moderno e responsivo
const AkinatorMagico: React.FC = () => {
  const { currentNode, history, completed, answer, reset } = useAkinatorIntentionTree();

  // Progresso artificial só para UX visual (100% no final)
  const progress = currentNode
    ? Math.round((history.length / 9) * 100)
    : 100;

  // UX: frase divertida para o topo (simples demonstrativo)
  const mysticalPhrases = [
    "O universo da beleza conspira a seu favor...",
    "A lâmpada mágica sente sua energia!",
    "Cada desejo conta, não economize sonhos.",
    "Seu futuro estético está sendo revelado...",
    "Pense bem: gênios também têm limite de pedidos!",
    "A verdadeira beleza começa na intenção."
  ];
  const mysticalPhrase = mysticalPhrases[(history.length || 0) % mysticalPhrases.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-10 py-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">{currentNode?.emoji || "✨"}</span>
          <h2 className="text-white text-2xl font-bold text-center">Diagnóstico Estético Descontraído</h2>
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
              <Card className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-2 border-purple-400/50">
                <CardContent className="p-8 text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Consulta Finalizada!
                  </h3>
                  <div className="text-purple-300 mb-4">
                    Parabéns por compartilhar seus desejos e inspirações. <br />
                    Agora é hora de buscar o tratamento mais alinhado ao seu sonho!
                  </div>
                  <div className="mb-4">
                    <span className="font-medium text-white">Suas respostas:</span>
                    <ul className="mt-2 space-y-1">
                      {history.map((h, i) => (
                        <li key={i} className="text-sm text-purple-300">
                          <span className="font-semibold text-purple-200">{i + 1}.</span> {h.answer}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button onClick={reset} variant="outline" className="mt-4">
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
              <Card className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-2 border-purple-400/50">
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
