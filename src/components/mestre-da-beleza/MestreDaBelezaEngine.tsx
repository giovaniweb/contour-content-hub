
import React from 'react';
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  text: string;
  options: string[];
  context: string;
  condition?: (responses: Record<string, any>) => boolean;
}

// Árvore de decisão baseada no perfil e intenção
export const DECISION_TREE: Record<string, Question[]> = {
  // Perguntas para Cliente Final - Resolver Problema
  cliente_final_problema: [
    {
      id: 'area_problema',
      text: 'Algo em você incomoda? 🤔',
      options: ['É o rosto mesmo', 'É o corpo', 'Tô me sentindo derretendo 😭', 'É meio que tudo'],
      context: 'area_problema'
    },
    {
      id: 'rosto_derretendo',
      text: 'Você sente que seu rosto está derretendo? 😱',
      options: ['Sim, exato!', 'Meio que sim', 'Não sei explicar'],
      context: 'rosto_derretendo',
      condition: (r) => r.area_problema?.includes('rosto') || r.area_problema?.includes('derretendo')
    },
    {
      id: 'emagreceu_rapido',
      text: 'Você emagreceu rápido nos últimos meses? 🏃‍♀️',
      options: ['Sim, bastante', 'Um pouco', 'Não emagreceu'],
      context: 'emagreceu_rapido',
      condition: (r) => r.rosto_derretendo === 'Sim, exato!'
    },
    {
      id: 'perdeu_firmeza',
      text: 'Já se olhou no espelho e pensou que perdeu firmeza? 😔',
      options: ['Sim, muito', 'Às vezes', 'Não'],
      context: 'perdeu_firmeza'
    },
    {
      id: 'brasiltricampeao',
      text: 'Você já viu o Brasil ser tetra? ⚽ (pergunta nostálgica!)',
      options: ['Claro! 1994 ❤️', 'Não era nascido(a)', 'Prefiro não dizer'],
      context: 'brasiltricampeao'
    }
  ],

  // Perguntas para Profissionais - Resolver Problema
  profissional_problema: [
    {
      id: 'tem_clinica',
      text: 'Você tem clínica própria? 🏥',
      options: ['Sim, tenho clínica', 'Trabalho em clínica', 'Estou planejando abrir'],
      context: 'tem_clinica'
    },
    {
      id: 'desafio_principal',
      text: 'Qual seu maior desafio atual? 🎯',
      options: ['Reter clientes', 'Equipamentos', 'Marketing', 'Concorrência'],
      context: 'desafio_principal'
    },
    {
      id: 'problema_retencao',
      text: 'Seus clientes voltam com frequência? 🔄',
      options: ['Poucos voltam', 'Alguns voltam', 'A maioria volta'],
      context: 'problema_retencao',
      condition: (r) => r.desafio_principal === 'Reter clientes'
    }
  ],

  // Perguntas para Ideias Novas
  geral_ideias: [
    {
      id: 'equipamento_favorito',
      text: 'Você tem algum equipamento favorito para trabalhar? ⚡',
      options: ['HIPRO', 'Endolaser', 'Peeling', 'Não tenho específico'],
      context: 'equipamento_favorito'
    },
    {
      id: 'tipo_campanha',
      text: 'Que tipo de campanha te anima mais? 🚀',
      options: ['Antes e depois', 'Educativa', 'Promocional', 'Testemunhos'],
      context: 'tipo_campanha'
    }
  ]
};

interface MestreDaBelezaEngineProps {
  currentStep: string;
  userProfile: any;
  onAnswer: (answer: string, context: string) => void;
}

const MestreDaBelezaEngine: React.FC<MestreDaBelezaEngineProps> = ({
  currentStep,
  userProfile,
  onAnswer
}) => {
  const getQuestionsForStep = () => {
    const { perfil, responses } = userProfile;
    let questionsKey = '';

    // Determinar qual conjunto de perguntas usar
    if (perfil === 'cliente_final' && responses.intencao?.includes('problema')) {
      questionsKey = 'cliente_final_problema';
    } else if ((perfil === 'medico' || perfil === 'profissional_estetica') && responses.intencao?.includes('problema')) {
      questionsKey = 'profissional_problema';
    } else if (responses.intencao?.includes('ideia')) {
      questionsKey = 'geral_ideias';
    }

    const questions = DECISION_TREE[questionsKey] || [];
    
    // Filtrar perguntas já respondidas e aplicar condições
    return questions.filter(q => {
      if (responses[q.context]) return false; // Já respondida
      if (q.condition && !q.condition(responses)) return false; // Não atende condição
      return true;
    });
  };

  const currentQuestions = getQuestionsForStep();
  const currentQuestion = currentQuestions[0];

  if (!currentQuestion) return null;

  return (
    <div className="space-y-4">
      <div className="text-white text-lg mb-4">
        {currentQuestion.text}
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswer(option, currentQuestion.context)}
            variant="outline"
            className="bg-white/5 border-purple-400/50 text-purple-100 hover:bg-purple-600/30 hover:border-purple-300 text-left justify-start"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MestreDaBelezaEngine;
