
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/PageHeader";
import { pageMetadata } from "@/page-metadata";

const meta = pageMetadata["/script-history"];

const ScriptHistory: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <PageHeader
          icon={meta.icon}
          title={meta.title}
          subtitle={meta.subtitle}
          breadcrumbs={meta.breadcrumbs}
        />
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Roteiros</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Veja o histórico de roteiros que você já validou.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ScriptHistory;
