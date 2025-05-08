
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";

const AdminIntegrations: React.FC = () => {
  const { isAdmin } = usePermissions();
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const integrations = [
    {
      name: "Vimeo",
      status: "Connected",
      description: "Integração para armazenamento de vídeos",
      link: "/admin/vimeo-settings"
    },
    {
      name: "Google Drive",
      status: "Not Connected",
      description: "Integração para armazenamento de arquivos",
      link: "#"
    },
    {
      name: "OpenAI",
      status: "Connected",
      description: "Integração para recursos de IA",
      link: "#"
    },
    {
      name: "Zapier",
      status: "Not Connected",
      description: "Automação de fluxos de trabalho",
      link: "#"
    }
  ];

  return (
    <Layout title="Integrações">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Integrações</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{integration.name}</CardTitle>
                <span className={`px-2 py-1 rounded text-xs ${
                  integration.status === "Connected" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {integration.status}
                </span>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{integration.description}</p>
                <Button asChild variant={integration.status === "Connected" ? "outline" : "default"}>
                  <Link to={integration.link}>
                    {integration.status === "Connected" ? "Configure" : "Connect"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminIntegrations;
