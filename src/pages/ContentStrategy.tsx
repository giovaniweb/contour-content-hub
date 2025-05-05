
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";
import ContentStrategyHeader from "@/components/content-strategy/ContentStrategyHeader";
import ContentStrategySheet from "@/components/content-strategy/ContentStrategySheet";
import ContentStrategyTabs from "@/components/content-strategy/ContentStrategyTabs";
import { useContentStrategy } from "@/hooks/useContentStrategy";

const ContentStrategy: React.FC = () => {
  const { isAdmin, isOperator } = usePermissions();
  const [activeTab, setActiveTab] = useState("lista");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
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
          onNewItem={() => setIsSheetOpen(true)}
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
      
      {/* Sheet is now properly wrapped with the Sheet context */}
      {canEdit && (
        <ContentStrategySheet
          equipments={equipments}
          users={users}
          onSubmit={handleCreateItem}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        />
      )}
    </Layout>
  );
};

export default ContentStrategy;
