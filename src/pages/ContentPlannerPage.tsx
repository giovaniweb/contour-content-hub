
import React from "react";
import Layout from "@/components/Layout";
import KanbanBoard from "@/components/content-planner/KanbanBoard";
import { useNavigate } from 'react-router-dom';
import { ContentPlannerItem } from '@/types/content-planner';

const ContentPlannerPage: React.FC = () => {
  const navigate = useNavigate();

  const handleViewDetails = (item: ContentPlannerItem) => {
    console.log('View details for:', item.title);
  };

  const handleGenerateScript = (item: ContentPlannerItem) => {
    navigate('/script-generator', { 
      state: { 
        contentItem: item
      }
    });
  };

  const handleValidate = (item: ContentPlannerItem) => {
    navigate('/content-ideas', { 
      state: { 
        ideaToValidate: {
          content: item.title,
          objective: item.objective,
          format: item.format
        }
      }
    });
  };

  return (
    <Layout title="Planner de Conteúdo">
      <div className="container mx-auto py-6">
        <KanbanBoard 
          onViewDetails={handleViewDetails}
          onGenerateScript={handleGenerateScript}
          onValidate={handleValidate}
        />
      </div>
    </Layout>
  );
};

export default ContentPlannerPage;
