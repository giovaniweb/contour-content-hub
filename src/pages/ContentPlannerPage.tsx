
import React from "react";
import { Calendar } from "lucide-react";
import ContentPlannerComponent from '@/components/content-planner/ContentPlanner';

const ContentPlannerPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Calendar className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Planner de Conteúdo</h1>
            <p className="text-slate-400">Organize e planeje seu conteúdo de forma estratégica</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <ContentPlannerComponent />
    </div>
  );
};

export default ContentPlannerPage;
