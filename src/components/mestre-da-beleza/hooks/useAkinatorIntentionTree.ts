
import { useState } from "react";
import { INTENTION_TREE, IntentionNode } from "../intentionTree";

type IntentionAnswer = { questionId: string; answer: string };

export function useAkinatorIntentionTree() {
  const [history, setHistory] = useState<IntentionAnswer[]>([]);
  const [currentId, setCurrentId] = useState("init");
  const [completed, setCompleted] = useState(false);
  const [profile, setProfile] = useState<"profissional" | "cliente" | "explorador" | null>(null);

  const getCurrentNode = (): IntentionNode | undefined => INTENTION_TREE.find(n => n.id === currentId);

  const answer = (option: string) => {
    const node = getCurrentNode();
    if (!node) return;

    setHistory(hist => [...hist, { questionId: node.id, answer: option }]);

    // Detecta perfil logico
    if (node.id === "init") {
      if (option === "Atendo clientes na área da estética") {
        setProfile("profissional");
      } else if (option === "Quero tratar algo na minha pele ou corpo") {
        setProfile("cliente");
      } else {
        setProfile("explorador");
      }
    }

    // Ramifica caminhos ou termina
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

    // Nodo final sempre encerra
    if (node.type === "final" || !node.next) {
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
