import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { FileText, CheckCircle2, Presentation, MessageSquare, Database, BrainCircuit } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface AiSystemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  areas: string[];
  useCases: string[];
  technology: string;
  model: string;
}

const SystemIntelligence: React.FC = () => {
  const { hasPermission } = usePermissions();
  const { toast } = useToast();
  
  // Only users with admin role can access this page
  if (!hasPermission("admin")) {
    toast({
      variant: "destructive",
      title: "Acesso Negado",
      description: "Você não possui permissões para acessar esta página",
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  const aiSystems: AiSystemProps[] = [
    {
      title: "Criação de Roteiros",
      description: "Sistema de geração de roteiros para vídeos usando GPT-4 com conhecimento especializado em produção de conteúdo médico e odontológico.",
      icon: <FileText />,
      areas: ["Marketing", "Conteúdo", "Educação"],
      useCases: ["Vídeos educativos", "Conteúdo para redes sociais", "Roteiros personalizados por equipamento"],
      technology: "OpenAI GPT-4",
      model: "custom-gpt"
    },
    {
      title: "Validação de Roteiros",
      description: "Sistema que analisa roteiros gerados para garantir qualidade, precisão científica e adequação ao público-alvo.",
      icon: <CheckCircle2 />,
      areas: ["Qualidade", "Validação", "Revisão"],
      useCases: ["Verificação técnica", "Análise de engajamento", "Validação de estrutura narrativa"],
      technology: "OpenAI GPT-4",
      model: "validate-script"
    },
    {
      title: "Estratégia de Marketing",
      description: "Sistema de geração de estratégias de marketing personalizadas para equipamentos médicos e odontológicos.",
      icon: <Presentation />,
      areas: ["Marketing", "Estratégia", "Planejamento"],
      useCases: ["Calendário de conteúdo", "Táticas de posicionamento", "Análise de mercado"],
      technology: "OpenAI GPT-4",
      model: "content-strategy"
    },
    {
      title: "Consultor de Marketing",
      description: "Assistente de marketing que responde perguntas e oferece orientações estratégicas personalizadas.",
      icon: <MessageSquare />,
      areas: ["Consultoria", "Marketing", "Vendas"],
      useCases: ["Dúvidas sobre marketing", "Análise de resultados", "Recomendações de melhoria"],
      technology: "OpenAI GPT-4",
      model: "marketing-consultant"
    },
    {
      title: "Processamento de Artigos Científicos",
      description: "Sistema que extrai informações relevantes de artigos científicos para embasar conteúdos e roteiros.",
      icon: <Database />,
      areas: ["Pesquisa", "Conteúdo", "Conhecimento"],
      useCases: ["Extração de insights", "Embasamento científico", "Referência bibliográfica"],
      technology: "OpenAI GPT-4",
      model: "process-document"
    }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Inteligência do Sistema</h1>
          <p className="text-muted-foreground max-w-3xl">
            Esta página detalha as capacidades de inteligência artificial do sistema Fluida, mostrando como o sistema utiliza IA para criar roteiros, estratégias de marketing e outras funcionalidades.
          </p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="models">Modelos e Capacidades</TabsTrigger>
            <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {aiSystems.map((system, index) => (
                <Card key={index} className="h-full flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {system.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{system.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{system.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2">Áreas de aplicação:</p>
                      <div className="flex flex-wrap gap-2">
                        {system.areas.map((area, i) => (
                          <Badge key={i} variant="secondary">{area}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Tecnologia:</p>
                      <Badge variant="outline" className="bg-primary/5">{system.technology}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <p className="text-xs text-muted-foreground">Modelo: <code>{system.model}</code></p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="models">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Modelos de Linguagem Utilizados</CardTitle>
                  <CardDescription>
                    Detalhamento dos modelos de IA utilizados no sistema Fluida
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="gpt4">
                      <AccordionTrigger className="text-lg font-medium">
                        OpenAI GPT-4
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Descrição</h4>
                          <p className="text-muted-foreground">
                            Modelo de linguagem avançado usado para geração de conteúdo, análise de roteiros e estratégias de marketing. Oferece capacidades superiores de compreensão contextual e geração de conteúdo especializado.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Aplicações no Sistema</h4>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Geração de roteiros personalizados</li>
                            <li>Validação e análise de qualidade de conteúdo</li>
                            <li>Criação de estratégias de marketing</li>
                            <li>Interpretação de artigos científicos</li>
                            <li>Consultor virtual de marketing</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Personalização</h4>
                          <p className="text-muted-foreground">
                            Prompts especializados foram desenvolvidos para cada função do sistema, permitindo que o modelo gere conteúdo relevante para o contexto médico e odontológico, com conhecimento específico sobre equipamentos e procedimentos.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="embeddings">
                      <AccordionTrigger className="text-lg font-medium">
                        Embeddings e Processamento de Documentos
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Descrição</h4>
                          <p className="text-muted-foreground">
                            Sistema de processamento e indexação de documentos científicos usando embeddings vetoriais para extrair informações relevantes e permitir consultas contextuais.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Aplicações no Sistema</h4>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Processamento de artigos científicos</li>
                            <li>Extração de informações técnicas de documentos</li>
                            <li>Base de conhecimento para embasamento de conteúdos</li>
                            <li>Busca contextual em documentos</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Capacidades do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" /> Criação de Conteúdo
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                        <li>Roteiros para diferentes formatos de vídeo</li>
                        <li>Textos persuasivos para marketing</li>
                        <li>Conteúdo educativo baseado em equipamentos</li>
                        <li>Adaptação de tom e estilo conforme público-alvo</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" /> Análise e Validação
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                        <li>Verificação de precisão técnica</li>
                        <li>Análise de estrutura narrativa</li>
                        <li>Avaliação de potencial de engajamento</li>
                        <li>Sugestões de melhoria baseadas em dados</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Presentation className="h-5 w-5 text-primary" /> Estratégia de Marketing
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                        <li>Planejamento de calendário de conteúdo</li>
                        <li>Definição de táticas por canais</li>
                        <li>Abordagens personalizadas por equipamento</li>
                        <li>Recomendações baseadas em objetivos de negócio</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-primary" /> Inteligência Analítica
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                        <li>Processamento de dados e métricas</li>
                        <li>Sugestões preditivas de conteúdo</li>
                        <li>Análise de tendências e oportunidades</li>
                        <li>Insights baseados em desempenho histórico</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="architecture">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Arquitetura do Sistema de IA</CardTitle>
                <CardDescription>
                  Visão geral da arquitetura e fluxos de processamento dos sistemas de IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fluxo de Processamento</h3>
                  <div className="relative bg-muted/50 p-6 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-background p-4 rounded-lg border shadow-sm">
                        <h4 className="font-medium text-center mb-3">Entrada de Dados</h4>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Dados do equipamento
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Preferências do usuário
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            Parâmetros de conteúdo
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Documentos e artigos
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-background p-4 rounded-lg border shadow-sm">
                        <h4 className="font-medium text-center mb-3">Processamento</h4>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Criação de prompts contextuais
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Modelagem de linguagem
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            Análise de conteúdo
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Processamento vetorial
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-background p-4 rounded-lg border shadow-sm">
                        <h4 className="font-medium text-center mb-3">Saída</h4>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Roteiros formatados
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Planos estratégicos
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            Análises e validações
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Respostas consultivas
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="hidden md:flex justify-between items-center mt-4 mx-12">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent flex-grow"></div>
                      <div className="mx-4 text-sm text-muted-foreground">Fluxo de dados</div>
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent flex-grow"></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Componentes do Sistema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/50 p-5 rounded-lg border">
                      <h4 className="font-medium mb-3">Edge Functions</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Funções serverless que processam solicitações, interagem com APIs de IA e retornam resultados formatados.
                      </p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          custom-gpt
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          validate-script
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          generate-content-description
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          process-document
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 p-5 rounded-lg border">
                      <h4 className="font-medium mb-3">Banco de Dados</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Armazenamento estruturado de dados que alimentam os modelos de IA e armazenam resultados.
                      </p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          equipments
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          scripts
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          content_strategies
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          documents
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 p-5 rounded-lg border">
                      <h4 className="font-medium mb-3">APIs Externas</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Serviços de terceiros que fornecem capacidades de IA ao sistema.
                      </p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          OpenAI API
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          Vector Database
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          PDF Processing API
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 p-5 rounded-lg border">
                      <h4 className="font-medium mb-3">Interface do Usuário</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Componentes de interface que permitem interação com os sistemas de IA.
                      </p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          Formulários de geração
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          Visualizadores de conteúdo
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          Interfaces de análise
                        </li>
                        <li className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          Chat consultivo
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SystemIntelligence;
