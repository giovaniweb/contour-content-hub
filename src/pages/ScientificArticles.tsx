
import React from "react";
import Layout from "@/components/Layout";

const ScientificArticles: React.FC = () => {
  return (
    <Layout title="Scientific Articles">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Scientific Articles</h1>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-center text-muted-foreground py-10">
            Scientific articles module is coming soon...
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ScientificArticles;
