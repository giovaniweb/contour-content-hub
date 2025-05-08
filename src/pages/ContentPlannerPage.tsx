
import React from "react";
import Layout from "@/components/Layout";
import ContentPlanner from "@/components/content-planner/ContentPlanner";

const ContentPlannerPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <ContentPlanner />
      </div>
    </Layout>
  );
};

export default ContentPlannerPage;
