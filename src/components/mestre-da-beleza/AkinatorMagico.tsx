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
  const { currentNode, history, completed, answer, reset, profile } = useAkinatorIntentionTree();

  // Progresso atualizado: dividir por quantidade real de perguntas do fluxo do perfil
  const totalQuestions =
    profile === "profissional"
      ? 4 // init + perfil_profissional + pro_motivacao + pro_dificuldade + pro_final (final conta numa view, não no progresso)
      : profile === "cliente"
      ? 4 // init + perfil_cliente + cli_area_desejo + cli_sentimento + cli_final
      : 1; // só primeira

  const answeredCount = history.length;
  const progress = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));

  // UX: frase divertida para o topo (simples demonstrativo)
  const mysticalPhrases = [
    "O universo da beleza conspira a seu favor...",
    "A lâmpada mágica sente sua energia!",
    "Cada desejo conta, não economize sonhos.",
    "Seu futuro estético está sendo revelado...",
    "Pense bem: gênios também têm limite de pedidos!",
    "A verdadeira beleza começa na intenção."
  ];
  const mysticalPhrase = mysticalPhrases[answeredCount % mysticalPhrases.length];

  // Mensagem final com "adivinhação" de perfil
  function getFinalDiagnosis() {
    if (profile === "profissional") {
      // pega respostas chaves
      const experiencia = history.find(h => h.questionId === "perfil_profissional")?.answer;
      const motivacao = history.find(h => h.questionId === "pro_motivacao")?.answer;
      const desafio = history.find(h => h.questionId === "pro_dificuldade")?.answer;
      return (
        <div>
          <div className="text-2xl font-bold text-pink-300 mb-2">
            💼 Você é um(a) PROFISSIONAL da estética!
          </div>
          <div className="text-purple-200 mb-4">
            Nível: <b>{experiencia || "Indefinido"}</b><br />
            Inspiração: <b>{motivacao || "Indefinida"}</b><br />
            Desafio atual: <b>{desafio || "Indefinido"}</b>
          </div>
          <div className="mb-3 text-purple-400">
            Diagnóstico: Seu sucesso vai acelerar juntando <b>novas tecnologias</b> e focando em <b>{desafio}</b>. <br />
            Lembre-se: <span className="italic">A verdadeira inovação começa com autoconfiança!</span>
          </div>
        </div>
      );
    }
    if (profile === "cliente") {
      const motivacao = history.find(h => h.questionId === "perfil_cliente")?.answer;
      const sonho = history.find(h => h.questionId === "cli_area_desejo")?.answer;
      const humor = history.find(h => h.questionId === "cli_sentimento")?.answer;
      return (
        <div>
          <div className="text-2xl font-bold text-pink-300 mb-2">🪞 Você é CLIENTE da estética!</div>
          <div className="text-purple-200 mb-4">
            <span>Motivação: <b>{motivacao || "Indefinida"}</b></span><br />
            <span>Maior desejo: <b>{sonho || "Indefinido"}</b></span><br />
            <span>Humor do espelho: <b>{humor || "Indefinido"}</b></span>
          </div>
          <div className="mb-3 text-purple-400">
            Diagnóstico: O melhor cuidado começa pelo autoconhecimento. <br />
            <span className="italic">Continue buscando autoestima — ela é seu maior poder mágico!</span>
          </div>
        </div>
      );
    }
    // fallback caso a pessoa não respondeu nem a primeira
    return (
      <div className="text-purple-300">
        Perfil não identificado. <br /> Tente novamente!
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
              <Card className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-2 border-purple-400/50">
                <CardContent className="p-8 text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Consulta Finalizada!
                  </h3>
                  {getFinalDiagnosis()}
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
                  Pergunta {answeredCount + 1}
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
