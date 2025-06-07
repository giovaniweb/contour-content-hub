
import React from 'react';
import Layout from '@/components/Layout';
import ContentPlannerComponent from '@/components/content-planner/ContentPlanner';

const ContentPlanner: React.FC = () => {
  return (
    <Layout title="Planejador de Conteúdo">
      <ContentPlannerComponent />
    </Layout>
  );
};

export default ContentPlanner;
