
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GrowthStrategyProps {
  diagnosticData: any;
  profitData: any;
  onComplete: (data: any) => void;
}

const GrowthStrategy: React.FC<GrowthStrategyProps> = ({ diagnosticData, profitData, onComplete }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("overview");
  
  useEffect(() => {
    // Generate strategy even with minimal data
    generateStrategy();
  }, [diagnosticData, profitData]);
  
  const generateStrategy = () => {
    setLoading(true);
    
    // Simulate strategy generation
    setTimeout(() => {
      try {
        // Create safe default values
        const clinicName = typeof diagnosticData?.clinic_name === 'string' ? diagnosticData.clinic_name : 
                         typeof diagnosticData?.clinicName === 'string' ? diagnosticData.clinicName : 'sua clínica';
        
        const mainServices = typeof diagnosticData?.main_services === 'string' ? diagnosticData.main_services :
                            typeof diagnosticData?.mainServices === 'string' ? diagnosticData.mainServices : 'Tratamentos estéticos';
        
        const mostProfitable = typeof diagnosticData?.most_profitable === 'string' ? diagnosticData.most_profitable :
                              typeof diagnosticData?.mostProfitable === 'string' ? diagnosticData.mostProfitable : 'procedimentos estéticos';
        
        // Digital presence with defaults
        const hasWebsite = String(diagnosticData?.website || diagnosticData?.hasWebsite || 'não').toLowerCase().includes('sim');
        const usesSocialMedia = String(diagnosticData?.social_media || diagnosticData?.usesSocialMedia || 'não').toLowerCase().includes('sim');
        const contentComfort = String(diagnosticData?.content_comfort || 'não').toLowerCase().includes('sim');
        
        // Main challenge with default
        const mainChallenge = String(diagnosticData?.main_challenge || 'captação de clientes');
        
        // Financial data with defaults
        const growthRate = Number(profitData?.growthRate || 30);
        const potentialRevenue = Number(profitData?.potentialRevenue || 10000);
        const roundedRevenue = Math.round((potentialRevenue || 0) / 100) * 100;
        
        const strategyData = {
          summary: `Estratégia personalizada para aumentar a visibilidade e lucratividade da ${clinicName} em 90 dias`,
          overview: `
            Com base no diagnóstico realizado, desenvolvemos uma estratégia completa de crescimento
            para a ${clinicName}, focando nos principais procedimentos (${mainServices})
            e no desafio principal identificado: ${getMainChallenge(mainChallenge)}.
            
            Esta estratégia foi desenvolvida para atingir um crescimento de ${growthRate}% 
            em faturamento nos próximos 3 meses, alcançando aproximadamente 
            R$ ${roundedRevenue} mensais.
          `,
          pillars: [
            {
              title: "Presença Digital Otimizada",
              description: hasWebsite 
                ? "Aprimoramento do site existente para maior conversão"
                : "Criação de landing page ou site simples para captação",
              actions: hasWebsite 
                ? ["Otimizar SEO local", "Adicionar formulários de captação", "Melhorar velocidade de carregamento"] 
                : ["Criar landing page com oferta principal", "Configurar captação de leads", "Integrar com WhatsApp"]
            },
            {
              title: "Estratégia de Conteúdo",
              description: usesSocialMedia 
                ? "Otimização da estratégia atual de redes sociais" 
                : "Implementação de presença básica em redes sociais",
              actions: usesSocialMedia 
                ? (contentComfort 
                   ? ["Calendário de conteúdo estruturado", "Foco em conteúdos educativos", "Histórias de resultados"] 
                   : ["Templates prontos para postagens", "Roteiro para vídeos curtos", "Banco de legendas"])
                : ["Criar perfil profissional no Instagram", "Configurar Google Meu Negócio", "Primeiras postagens estratégicas"]
            },
            {
              title: "Sistema de Vendas",
              description: `Aumento do ticket médio e taxa de conversão para ${mostProfitable}`,
              actions: ["Script de atendimento consultivo", "Criação de pacotes promocionais", "Programa de indicação de clientes"]
            }
          ],
          implementation: {
            firstMonth: [
              "Configuração inicial da presença digital",
              "Criação de materiais promocionais",
              "Definição do calendário de conteúdo",
              "Treinamento de atendimento consultivo"
            ],
            secondMonth: [
              "Otimização baseada em resultados iniciais",
              "Campanha promocional para serviços premium",
              "Intensificação da produção de conteúdo",
              "Implementação do programa de fidelidade"
            ],
            thirdMonth: [
              "Análise de métricas e ajustes",
              "Campanha para indicações de clientes",
              "Expansão da oferta de serviços",
              "Planejamento para o próximo trimestre"
            ]
          }
        };
        
        setStrategy(strategyData);
        
        toast({
          title: "Estratégia criada com sucesso!",
          description: "Sua estratégia personalizada está pronta para análise.",
        });
      } catch (error) {
        console.error("Erro ao gerar estratégia:", error);
        
        // Se houver erro, criar uma estratégia genérica
        const genericStrategy = {
          summary: "Estratégia padrão para clínicas estéticas",
          overview: `
            Desenvolvemos uma estratégia básica de crescimento para sua clínica estética,
            focando nos principais aspectos de marketing digital e vendas.
            
            Esta estratégia visa um crescimento de 30% em 3 meses através da otimização
            da presença digital e dos processos de venda.
          `,
          pillars: [
            {
              title: "Presença Digital Essencial",
              description: "Criação ou otimização da presença digital da clínica",
              actions: ["Configurar perfil no Google Meu Negócio", "Criar perfil no Instagram", "Desenvolver site ou landing page básica"]
            },
            {
              title: "Conteúdo Estratégico",
              description: "Criação e distribuição de conteúdo relevante",
              actions: ["Produção de conteúdos educativos", "Compartilhar resultados e depoimentos", "Divulgar ofertas estratégicas"]
            },
            {
              title: "Otimização de Vendas",
              description: "Melhoria do processo de vendas e atendimento",
              actions: ["Treinar equipe para vendas consultivas", "Criar pacotes de serviços", "Implementar programa de fidelidade"]
            }
          ],
          implementation: {
            firstMonth: ["Configurar presença digital", "Iniciar produção de conteúdo", "Treinar equipe"],
            secondMonth: ["Analisar resultados iniciais", "Ajustar estratégias", "Criar pacotes promocionais"],
            thirdMonth: ["Expandir alcance digital", "Implementar programa de indicação", "Planejar próximo trimestre"]
          }
        };
        
        setStrategy(genericStrategy);
        
        toast({
          title: "Estratégia criada!",
          description: "Criamos uma estratégia básica para sua análise.",
        });
      }
      
      setLoading(false);
    }, 2000);
  };
  
  const getMainChallenge = (challenge: string) => {
    if (!challenge) return "captação de clientes";
    
    // Converter para string segura antes de usar toLowerCase
    const safeChallenge = String(challenge).toLowerCase();
    
    if (safeChallenge.includes('atrair')) 
      return "captação de clientes";
    if (safeChallenge.includes('convert')) 
      return "conversão de leads em clientes";
    if (safeChallenge.includes('conteúdo')) 
      return "criação de conteúdo relevante";
    if (safeChallenge.includes('fideliz')) 
      return "fidelização de clientes";
    
    return "captação de clientes";
  };
  
  const handleComplete = () => {
    if (strategy) {
      onComplete(strategy);
    }
  };
  
  if (loading) {
    return (
      <Card className="h-[600px] flex flex-col items-center justify-center">
        <CardContent className="text-center pt-6">
          <Sparkles className="h-12 w-12 text-primary mb-4 mx-auto animate-pulse" />
          <CardTitle className="text-xl mb-2">Criando sua estratégia personalizada</CardTitle>
          <CardDescription>
            Analisando os dados do diagnóstico e desenvolvendo recomendações específicas para seu negócio...
          </CardDescription>
          
          <div className="mt-6 space-y-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Analisando dados</span>
              <span>Gerando estratégia</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!strategy) {
    return (
      <Card className="h-[600px] flex flex-col items-center justify-center">
        <CardContent className="text-center pt-6">
          <Sparkles className="h-12 w-12 text-primary mb-4 mx-auto animate-spin" />
          <CardTitle className="text-xl mb-2">Carregando estratégia</CardTitle>
          <CardDescription>
            Aguarde um momento enquanto preparamos sua estratégia personalizada...
          </CardDescription>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          {strategy.summary}
        </CardTitle>
        <CardDescription>
          Estratégia personalizada baseada no diagnóstico da sua clínica
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="overview" className="flex-1" value={currentTab} onValueChange={setCurrentTab}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Visão Geral</TabsTrigger>
            <TabsTrigger value="pillars" className="flex-1">Pilares</TabsTrigger>
            <TabsTrigger value="implementation" className="flex-1">Implementação</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-[420px] px-6 py-4">
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Resumo Estratégico</h3>
                  <p className="text-sm whitespace-pre-line">{strategy.overview}</p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Objetivos Principais</h3>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    <li>Aumentar o faturamento mensal para R$ {Math.round(((profitData?.potentialRevenue || 10000) / 100)) * 100}</li>
                    <li>Melhorar a captação e retenção de clientes</li>
                    <li>Otimizar a presença digital da clínica</li>
                    <li>Implementar sistema de vendas consultivas</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Resultados Esperados</h3>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    <li>Crescimento de {profitData?.growthRate || 30}% em faturamento</li>
                    <li>Aumento na taxa de conversão de clientes</li>
                    <li>Maior ticket médio por cliente</li>
                    <li>Fortalecimento da presença digital e autoridade da marca</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pillars" className="mt-0">
              <div className="space-y-6">
                {strategy.pillars.map((pillar: any, index: number) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium flex items-center">
                      <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">{index + 1}</span>
                      {pillar.title}
                    </h3>
                    <p className="text-sm my-2">{pillar.description}</p>
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Ações principais:</h4>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {pillar.actions.map((action: string, i: number) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="implementation" className="mt-0">
              <div className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Mês 1: Preparação</h3>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    {strategy.implementation.firstMonth.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Mês 2: Desenvolvimento</h3>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    {strategy.implementation.secondMonth.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Mês 3: Otimização</h3>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    {strategy.implementation.thirdMonth.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="pt-3 border-t">
          {currentTab !== "implementation" ? (
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => {
                const nextTab = currentTab === "overview" ? "pillars" : "implementation";
                setCurrentTab(nextTab);
              }}
            >
              Próximo <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              variant="default" 
              className="w-full"
              onClick={handleComplete}
            >
              Implementar Estratégia <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default GrowthStrategy;
