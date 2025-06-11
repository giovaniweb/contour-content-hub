
import React from "react";
import ContentPlannerComponent from '@/components/content-planner/ContentPlanner';

const ContentPlannerPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Planner de Conteúdo</h1>
        <p className="text-white/70">Organize e planeje seu conteúdo de forma estratégica</p>
      </div>
      <ContentPlannerComponent />
    </div>
  );
};

export default ContentPlannerPage;
