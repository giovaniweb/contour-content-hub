
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { ContentStrategyItem } from "@/types/content-strategy";
import { Card, CardContent } from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";
import ContentStrategyHeader from "@/components/content-strategy/ContentStrategyHeader";
import ContentStrategySheet from "@/components/content-strategy/ContentStrategySheet";
import ContentStrategyTabs from "@/components/content-strategy/ContentStrategyTabs";
import { useContentStrategy } from "@/hooks/useContentStrategy";

const ContentStrategy: React.FC = () => {
  const { isAdmin, isOperator } = usePermissions();
  const [activeTab, setActiveTab] = useState("lista");
  
  const {
    items,
    filters,
    equipments,
    users,
    isLoading,
    handleFilterChange,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
    handleGenerateContent,
    handleScheduleContent
  } = useContentStrategy();

  const canEdit = isAdmin() || isOperator();

  return (
    <Layout title="Gestão Estratégica de Conteúdo">
      <Card>
        <ContentStrategyHeader 
          onShowFilters={() => setActiveTab("filtros")}
          canEdit={canEdit}
        />
        <CardContent>
          <ContentStrategyTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            items={items}
            isLoading={isLoading}
            equipments={equipments}
            users={users}
            filters={filters}
            onFilterChange={handleFilterChange}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onGenerateContent={handleGenerateContent}
            onScheduleContent={handleScheduleContent}
          />
        </CardContent>
      </Card>
      
      {/* We need to render the Sheet content separately from the trigger due to the refactoring */}
      {canEdit && (
        <ContentStrategySheet
          equipments={equipments}
          users={users}
          onSave={handleCreateItem}
        />
      )}
    </Layout>
  );
};

export default ContentStrategy;
