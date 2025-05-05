
import React from "react";
import { FileText, BrainCircuit, Calendar, Shield, Sparkles } from "lucide-react";

export interface ActionItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export const getQuickActions = (): ActionItem[] => {
  return [
    {
      label: "Criar um roteiro",
      icon: <FileText className="h-5 w-5" />,
      path: "/custom-gpt",
      color: "bg-blue-100 text-blue-700"
    },
    {
      label: "Consultor de Marketing",
      icon: <BrainCircuit className="h-5 w-5" />,
      path: "/marketing-consultant",
      color: "bg-amber-100 text-amber-700"
    },
    {
      label: "Planejar agenda",
      icon: <Calendar className="h-5 w-5" />,
      path: "/calendar",
      color: "bg-purple-100 text-purple-700"
    },
    {
      label: "Diagnóstico do Sistema",
      icon: <Shield className="h-5 w-5" />,
      path: "/system-diagnostics",
      color: "bg-green-100 text-green-700"
    }
  ];
};

export const getAdditionalActions = (): ActionItem[] => {
  return [
    {
      label: "Validar roteiro",
      icon: <Sparkles className="h-5 w-5" />,
      path: "/script-validation",
      color: "bg-violet-100 text-violet-700"
    }
  ];
};
