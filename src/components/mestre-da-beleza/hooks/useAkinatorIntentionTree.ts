
import { useState } from "react";
import { INTENTION_TREE, IntentionNode } from "../intentionTree";

type IntentionAnswer = { questionId: string; answer: string };

export function useAkinatorIntentionTree() {
  const [history, setHistory] = useState<IntentionAnswer[]>([]);
  const [currentId, setCurrentId] = useState("root");
  const [completed, setCompleted] = useState(false);

  const getCurrentNode = (): IntentionNode | undefined => INTENTION_TREE.find(n => n.id === currentId);

  const answer = (option: string) => {
    const node = getCurrentNode();
    if (!node) return;

    setHistory(hist => [...hist, { questionId: node.id, answer: option }]);

    // Determinar próximo passo
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
      // Se o nó não tem next (provavelmente chegou ao final)
      setCompleted(true);
    }

    // Chegou ao final?
    if (!node.next || node.id === "final") {
      setCompleted(true);
    }
  };

  const reset = () => {
    setHistory([]);
    setCurrentId("root");
    setCompleted(false);
  };

  return {
    currentNode: getCurrentNode(),
    history,
    completed,
    answer,
    reset,
  };
}
