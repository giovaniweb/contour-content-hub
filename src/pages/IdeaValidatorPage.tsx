
import React from "react";
import Layout from "@/components/Layout";
import IdeaValidator from "@/components/idea-validator/IdeaValidator";

const IdeaValidatorPage: React.FC = () => {
  return (
    <Layout 
      title="Validador de Ideias" 
      fullWidth 
      transparentHeader
    >
      <div className="flex-1 flex flex-col">
        <IdeaValidator />
      </div>
    </Layout>
  );
};

export default IdeaValidatorPage;
