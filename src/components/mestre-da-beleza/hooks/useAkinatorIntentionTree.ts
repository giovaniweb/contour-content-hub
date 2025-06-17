
import { useState } from "react";
import { DYNAMIC_INTENTION_TREE, DynamicIntentionNode } from "../dynamicIntentionTree";

type IntentionAnswer = { questionId: string; answer: string | Record<string, any>; rawAnswer?: string };

export function useAkinatorIntentionTree() {
  const [history, setHistory] = useState<Array<{ questionId: string; answer: string | Record<string, any>; rawAnswer?: string }>>([]);
  const [currentId, setCurrentId] = useState("perfil_inicial");
  const [completed, setCompleted] = useState(false);
  const [profile, setProfile] = useState<"profissional" | "cliente" | "explorador" | null>(null);

  const getCurrentNode = (): DynamicIntentionNode | undefined => DYNAMIC_INTENTION_TREE.find(n => n.id === currentId);

  const answer = (optionValue: string | Record<string, any>, rawAnswer?: string) => {
    const node = getCurrentNode();
    if (!node) return;

    setHistory(hist => [...hist, { questionId: node.id, answer: optionValue, rawAnswer }]);

    // Detecta perfil logico
    if (node.id === "perfil_inicial") {
      // Assuming optionValue is string for 'perfil_inicial' node
      const perfilNode = DYNAMIC_INTENTION_TREE.find(n => n.id === 'perfil_inicial');
      if (perfilNode && perfilNode.options) {
        const selectedOption = perfilNode.options.find(opt => opt.label === optionValue);
        if (selectedOption) {
          if (selectedOption.label === "Atendo clientes na área da estética") {
            setProfile("profissional");
          } else if (selectedOption.label === "Quero tratar algo na minha pele ou corpo") {
            setProfile("cliente");
          } else {
            setProfile("explorador");
          }
        }
      }
    }

    let nextId: string | undefined | null = null;

    const answersObject = history.reduce((acc, curr) => {
      acc[curr.questionId] = curr.answer;
      return acc;
    }, {} as Record<string, string | Record<string, any>>);
    answersObject[node.id] = optionValue;


    if (node.options) {
      const matchedOption = node.options.find(opt => opt.label === (rawAnswer || optionValue));
      if (matchedOption && matchedOption.next) {
        if (typeof matchedOption.next === "function") {
          nextId = matchedOption.next(answersObject);
        } else {
          nextId = matchedOption.next;
        }
      }
    }

    if (!nextId && node.next) {
      if (typeof node.next === "function") {
        nextId = node.next(answersObject);
      } else {
        nextId = node.next;
      }
    }

    if (nextId) {
      setCurrentId(nextId);
    } else {
      setCompleted(true);
    }

    if (node.type === "final" || !nextId) {
      setCompleted(true);
    }
  };

  const reset = () => {
    setHistory([]);
    setCurrentId("perfil_inicial");
    setCompleted(false);
    setProfile(null);
  };

  return {
    currentNode: getCurrentNode() as DynamicIntentionNode | undefined,
    history,
    completed,
    answer,
    reset,
    profile
  };
}
