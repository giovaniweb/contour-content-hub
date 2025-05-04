
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
    // Only generate strategy if we have valid data
    if (diagnosticData && profitData) {
      generateStrategy();
    } else {
      // Show error if missing data
      toast({
        title: "Dados insuficientes",
        description: "Não foi possível gerar a estratégia com os dados fornecidos.",
        variant: "destructive"
      });
    }
  }, [diagnosticData, profitData]);
  
  const generateStrategy = () => {
    setLoading(true);
    
    // Simulate strategy generation
    setTimeout(() => {
      try {
        // Ensure we have safe default values for everything
        const safeData = {
          // Clinic information
          clinic_name: String(diagnosticData?.clinic_name || diagnosticData?.clinicName || 'sua clínica'),
          main_services: String(diagnosticData?.main_services || diagnosticData?.mainServices || 'Tratamentos estéticos'),
          most_profitable: String(diagnosticData?.most_profitable || diagnosticData?.mostProfitable || 'procedimentos estéticos'),
          
          // Digital presence
          website: String(diagnosticData?.website || diagnosticData?.hasWebsite || '').toLowerCase(),
          social_media: String(diagnosticData?.social_media || diagnosticData?.usesSocialMedia || '').toLowerCase(),
          content_comfort: String(diagnosticData?.content_comfort || '').toLowerCase(),
          
          // Challenge
          main_challenge: String(diagnosticData?.main_challenge || 'captação de clientes'),
          
          // Financial
          growthRate: Number(profitData?.growthRate || 30),
          potentialRevenue: Number(profitData?.potentialRevenue || 10000)
        };
        
        // Process boolean values safely
        const hasWebsite = safeData.website.includes('sim') || safeData.website === 'yes';
        const usesSocialMedia = safeData.social_media === 'sim' || safeData.social_media === 'yes';
        const contentComfort = safeData.content_comfort === 'sim' || safeData.content_comfort === 'yes';
        
        // Safe calculation
        const roundedRevenue = Math.round((safeData.potentialRevenue || 0) / 100) * 100;
        
        const strategyData = {
          summary: `Estratégia personalizada para aumentar a visibilidade e lucratividade da ${safeData.clinic_name} em 90 dias`,
          overview: `
            Com base no diagnóstico realizado, desenvolvemos uma estratégia completa de crescimento
            para a ${safeData.clinic_name}, focando nos principais procedimentos (${safeData.main_services})
            e no desafio principal identificado: ${getMainChallenge(safeData.main_challenge)}.
            
            Esta estratégia foi desenvolvida para atingir um crescimento de ${safeData.growthRate}% 
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
              description: `Aumento do ticket médio e taxa de conversão para ${safeData.most_profitable}`,
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
        toast({
          title: "Erro ao criar estratégia",
          description: "Ocorreu um problema ao processar os dados. Por favor, tente novamente.",
          variant: "destructive"
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
                    <li>Aumentar o faturamento mensal para R$ {Math.round(((profitData?.potentialRevenue || 0) / 100)) * 100}</li>
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
