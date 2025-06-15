
import { useState } from "react";
import { INTENTION_TREE, IntentionNode } from "../intentionTree";

type IntentionAnswer = { questionId: string; answer: string };

export function useAkinatorIntentionTree() {
  const [history, setHistory] = useState<IntentionAnswer[]>([]);
  const [currentId, setCurrentId] = useState("init");
  const [completed, setCompleted] = useState(false);
  // NOVO: guardar o perfil identificado
  const [profile, setProfile] = useState<"profissional" | "cliente" | null>(null);

  const getCurrentNode = (): IntentionNode | undefined => INTENTION_TREE.find(n => n.id === currentId);

  const answer = (option: string) => {
    const node = getCurrentNode();
    if (!node) return;

    setHistory(hist => [...hist, { questionId: node.id, answer: option }]);

    // Detecta e salva perfil
    if (node.id === "init") {
      if (option === "Eu atendo ou trabalho oferecendo procedimentos estéticos") {
        setProfile("profissional");
      } else {
        setProfile("cliente");
      }
    }

    // Proximo passo
    if (typeof node.next === "string") {
      setCurrentId(node.next);
    } else if (typeof node.next === "object" && node.next !== null) {
      const nextId = node.next[option];
      if (nextId) {
        setCurrentId(nextId);
      } else {
        setCompleted(true);
      }
    } else {
      setCompleted(true);
    }

    // Chegou ao final?
    if (!node.next || node.type === "final" || node.id.endsWith("final")) {
      setCompleted(true);
    }
  };

  const reset = () => {
    setHistory([]);
    setCurrentId("init");
    setCompleted(false);
    setProfile(null);
  };

  return {
    currentNode: getCurrentNode(),
    history,
    completed,
    answer,
    reset,
    profile
  };
}
