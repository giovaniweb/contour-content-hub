
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import { AlertCircle, Check, ExternalLink, ShieldAlert, Globe, LayoutGrid } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const AdminIntegrations: React.FC = () => {
  const { isAdmin } = usePermissions();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const integrations = [
    {
      name: "Vimeo",
      status: "Connected",
      description: "Integração para armazenamento de vídeos e streaming de conteúdo.",
      link: "/admin/vimeo-settings",
      icon: "https://cdn.icon-icons.com/icons2/2429/PNG/512/vimeo_logo_icon_147212.png"
    },
    {
      name: "Google Drive",
      status: "Not Connected",
      description: "Integração para armazenamento de arquivos e organização de documentos.",
      link: "#",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/1200px-Google_Drive_icon_%282020%29.svg.png"
    },
    {
      name: "OpenAI",
      status: "Connected",
      description: "Integração para recursos de IA, geração de conteúdo e análise de dados.",
      link: "#",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1280px-OpenAI_Logo.svg.png"
    },
    {
      name: "Zapier",
      status: "Not Connected",
      description: "Automação de fluxos de trabalho e integração entre diferentes plataformas.",
      link: "#",
      icon: "https://cdn.worldvectorlogo.com/logos/zapier-1.svg"
    },
    {
      name: "Slack",
      status: "Not Connected",
      description: "Integração para comunicação e notificações da equipe.",
      link: "#",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png"
    },
    {
      name: "HubSpot",
      status: "Not Connected",
      description: "Integração para CRM, marketing e gestão de relacionamento com clientes.",
      link: "#",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968872.png"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-10 bg-gradient-to-r from-violet-50 to-indigo-50 p-6 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Globe className="h-8 w-8 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Integrações do Sistema
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Conecte o Fluida com outras plataformas para expandir suas funcionalidades
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/80 p-4 rounded-lg shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">2 Ativas</span>
            </div>
            <div className="bg-white/80 p-4 rounded-lg shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium">0 Com erro</span>
            </div>
            <div className="bg-white/80 p-4 rounded-lg shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-sm font-medium">4 Pendentes</span>
            </div>
            <div className="bg-white/80 p-4 rounded-lg shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium">6 Disponíveis</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Integrações disponíveis</h2>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            Verificar atualizações
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <Card key={index} className="overflow-hidden border border-border/50 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-white p-2 border border-border/50 shadow-sm">
                    <img 
                      src={integration.icon} 
                      alt={integration.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl">{integration.name}</CardTitle>
                </div>
                <Badge className={`px-2 py-1 ${
                  integration.status === "Connected" 
                    ? "bg-green-100 text-green-800 hover:bg-green-200" 
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}>
                  {integration.status === "Connected" && <Check className="w-3 h-3 mr-1" />}
                  {integration.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="mb-6 text-sm">{integration.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <Button 
                    asChild={integration.link !== "#"} 
                    variant={integration.status === "Connected" ? "outline" : "default"}
                    className="rounded-full shadow-sm"
                    onClick={() => integration.link === "#" && setSelectedIntegration(integration.name)}
                  >
                    {integration.link !== "#" ? (
                      <Link to={integration.link} className="flex items-center">
                        {integration.status === "Connected" ? "Configurar" : "Conectar"}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    ) : (
                      <span>
                        {integration.status === "Connected" ? "Configurar" : "Conectar"}
                      </span>
                    )}
                  </Button>
                  {integration.status === "Connected" && (
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      Desconectar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Dialog for integration setup */}
      <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar {selectedIntegration}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2 bg-amber-50 text-amber-800 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">Esta integração requer credenciais da API.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">Chave API</Label>
              <Input id="api-key" placeholder="Insira sua chave API..." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-secret">API Secret</Label>
              <Input id="api-secret" type="password" placeholder="Insira seu API secret..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedIntegration(null)}>Cancelar</Button>
            <Button>Conectar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminIntegrations;
