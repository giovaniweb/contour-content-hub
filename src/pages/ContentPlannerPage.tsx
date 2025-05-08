
import React from "react";
import Layout from "@/components/Layout";
import KanbanBoard from "@/components/content-planner/KanbanBoard";

const ContentPlannerPage: React.FC = () => {
  return (
    <Layout title="Planner de Conteúdo">
      <div className="container mx-auto py-6">
        <KanbanBoard />
      </div>
    </Layout>
  );
};

export default ContentPlannerPage;
