
import React from 'react';
import InsightCard from './InsightCard';

const InsightsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <InsightCard 
        title="Tendências" 
        description="Tópicos populares e tendências atuais"
      >
        <ul className="space-y-3">
          <li className="flex justify-between items-center">
            <span>Vídeos curtos para redes sociais</span>
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">Em alta</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Conteúdo educativo sobre saúde</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Estável</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Tutoriais de procedimentos</span>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Crescendo</span>
          </li>
        </ul>
      </InsightCard>
      
      <InsightCard 
        title="Recomendações" 
        description="Sugeridas com base na sua atividade"
      >
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Criar roteiro para demonstração de equipamento</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Atualizar estratégia de conteúdo mensal</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span>Revisar estatísticas de engajamento</span>
          </li>
        </ul>
      </InsightCard>
    </div>
  );
};

export default InsightsSection;
