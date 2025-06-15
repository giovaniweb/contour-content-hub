
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import IdeaValidator from "@/components/idea-validator/IdeaValidator";

const IdeaValidatorPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col">
        <IdeaValidator />
      </div>
    </AppLayout>
  );
};

export default IdeaValidatorPage;
