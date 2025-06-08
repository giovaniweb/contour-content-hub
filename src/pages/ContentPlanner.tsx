
import React from 'react';
import Layout from '@/components/Layout';
import ContentPlannerComponent from '@/components/content-planner/ContentPlanner';

const ContentPlanner: React.FC = () => {
  return (
    <Layout title="Planejador de Conteúdo">
      <div className="container mx-auto px-4 py-6">
        <ContentPlannerComponent />
      </div>
    </Layout>
  );
};

export default ContentPlanner;
