
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, TrendingUp, Users, MessageSquare, Check } from "lucide-react";

interface GrowthStrategyProps {
  diagnosticData: any;
  profitData: any;
  onComplete: (strategy: any) => void;
}

const GrowthStrategy: React.FC<GrowthStrategyProps> = ({ 
  diagnosticData, 
  profitData, 
  onComplete 
}) => {
  const [activeTab, setActiveTab] = useState<string>('paid');
  const [strategy, setStrategy] = useState({
    paid: {
      enabled: true,
      budget: diagnosticData?.marketingBudget || '2000',
      audience: 'women',
      ageRange: [25, 55],
      objective: 'leads',
      platform: 'meta',
    },
    organic: {
      enabled: true,
      frequency: 'daily',
      contentTypes: ['before-after', 'testimonials', 'educational'],
      primaryTopic: diagnosticData?.mainProcedures[0] || 'Tratamentos estéticos',
    },
    internal: {
      enabled: true,
      referralProgram: true,
      loyaltyProgram: true,
      packages: true,
      events: false,
    }
  });
  
  const handleSwitchChange = (category: string, enabled: boolean) => {
    setStrategy(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        enabled
      }
    }));
  };
  
  const handleInputChange = (category: string, field: string, value: any) => {
    setStrategy(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  const handleComplete = () => {
    // Calculate expected results based on selected strategies
    const expectedResults = {
      newClients: calculateExpectedClients(),
      revenueIncrease: calculateRevenueIncrease(),
      timeline: '3 meses',
    };
    
    onComplete({ 
      ...strategy,
      expectedResults,
      diagnosticData,
      profitData
    });
  };
  
  const calculateExpectedClients = () => {
    // Simple calculation based on strategy settings
    let baseClients = 15; // Base number of new clients per month
    
    if (strategy.paid.enabled) {
      baseClients += parseInt(strategy.paid.budget) / 100; // Rough estimate: 1 client per R$100 spent
    }
    
    if (strategy.organic.enabled) {
      baseClients += strategy.organic.frequency === 'daily' ? 10 : 5;
    }
    
    if (strategy.internal.enabled) {
      if (strategy.internal.referralProgram) baseClients += 5;
      if (strategy.internal.loyaltyProgram) baseClients += 3;
    }
    
    return Math.round(baseClients);
  };
  
  const calculateRevenueIncrease = () => {
    const expectedClients = calculateExpectedClients();
    // Assuming an average ticket of R$500 per client
    return expectedClients * 500;
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Estratégia de Crescimento</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="paid" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Tráfego Pago
            </TabsTrigger>
            <TabsTrigger value="organic" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Tráfego Orgânico
            </TabsTrigger>
            <TabsTrigger value="internal" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Marketing Interno
            </TabsTrigger>
          </TabsList>
          
          {/* Tráfego Pago */}
          <TabsContent value="paid" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enablePaid" className="font-medium">
                Ativar estratégia de tráfego pago
              </Label>
              <Switch 
                id="enablePaid" 
                checked={strategy.paid.enabled}
                onCheckedChange={(checked) => handleSwitchChange('paid', checked)}
              />
            </div>
            
            {strategy.paid.enabled && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="budget">Orçamento mensal para anúncios</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <Input 
                      id="budget"
                      type="number"
                      value={strategy.paid.budget}
                      onChange={(e) => handleInputChange('paid', 'budget', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Plataforma principal</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button
                      type="button"
                      variant={strategy.paid.platform === 'meta' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('paid', 'platform', 'meta')}
                      className="justify-start"
                    >
                      Meta/Facebook
                    </Button>
                    <Button
                      type="button"
                      variant={strategy.paid.platform === 'google' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('paid', 'platform', 'google')}
                      className="justify-start"
                    >
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant={strategy.paid.platform === 'instagram' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('paid', 'platform', 'instagram')}
                      className="justify-start"
                    >
                      Instagram
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Objetivo da campanha</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      type="button"
                      variant={strategy.paid.objective === 'leads' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('paid', 'objective', 'leads')}
                      className="justify-start"
                    >
                      Gerar leads/consultas
                    </Button>
                    <Button
                      type="button"
                      variant={strategy.paid.objective === 'awareness' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('paid', 'objective', 'awareness')}
                      className="justify-start"
                    >
                      Aumentar conhecimento da marca
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Faixa etária do público-alvo</Label>
                  <div className="py-4">
                    <Slider
                      defaultValue={strategy.paid.ageRange}
                      min={18}
                      max={65}
                      step={1}
                      onValueChange={(value) => handleInputChange('paid', 'ageRange', value)}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-muted-foreground">{strategy.paid.ageRange[0]} anos</span>
                      <span className="text-sm text-muted-foreground">{strategy.paid.ageRange[1]} anos</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Tráfego Orgânico */}
          <TabsContent value="organic" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableOrganic" className="font-medium">
                Ativar estratégia de tráfego orgânico
              </Label>
              <Switch 
                id="enableOrganic" 
                checked={strategy.organic.enabled}
                onCheckedChange={(checked) => handleSwitchChange('organic', checked)}
              />
            </div>
            
            {strategy.organic.enabled && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Frequência de postagens</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button
                      type="button"
                      variant={strategy.organic.frequency === 'daily' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('organic', 'frequency', 'daily')}
                      className="justify-start"
                    >
                      Diária
                    </Button>
                    <Button
                      type="button"
                      variant={strategy.organic.frequency === '3x' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('organic', 'frequency', '3x')}
                      className="justify-start"
                    >
                      3x por semana
                    </Button>
                    <Button
                      type="button"
                      variant={strategy.organic.frequency === 'weekly' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('organic', 'frequency', 'weekly')}
                      className="justify-start"
                    >
                      Semanal
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="primaryTopic">Tema principal de conteúdos</Label>
                  <Input 
                    id="primaryTopic"
                    value={strategy.organic.primaryTopic}
                    onChange={(e) => handleInputChange('organic', 'primaryTopic', e.target.value)}
                    placeholder="Ex: Tratamento para flacidez facial"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Tipos de conteúdo</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      type="button"
                      variant={strategy.organic.contentTypes.includes('before-after') ? 'default' : 'outline'}
                      onClick={() => {
                        const updated = strategy.organic.contentTypes.includes('before-after')
                          ? strategy.organic.contentTypes.filter(t => t !== 'before-after')
                          : [...strategy.organic.contentTypes, 'before-after'];
                        handleInputChange('organic', 'contentTypes', updated);
                      }}
                      className="justify-start"
                    >
                      {strategy.organic.contentTypes.includes('before-after') && (
                        <Check className="mr-1 h-4 w-4" />
                      )}
                      Antes e Depois
                    </Button>
                    <Button
                      type="button"
                      variant={strategy.organic.contentTypes.includes('testimonials') ? 'default' : 'outline'}
                      onClick={() => {
                        const updated = strategy.organic.contentTypes.includes('testimonials')
                          ? strategy.organic.contentTypes.filter(t => t !== 'testimonials')
                          : [...strategy.organic.contentTypes, 'testimonials'];
                        handleInputChange('organic', 'contentTypes', updated);
                      }}
                      className="justify-start"
                    >
                      {strategy.organic.contentTypes.includes('testimonials') && (
                        <Check className="mr-1 h-4 w-4" />
                      )}
                      Depoimentos
                    </Button>
                    <Button
                      type="button"
                      variant={strategy.organic.contentTypes.includes('educational') ? 'default' : 'outline'}
                      onClick={() => {
                        const updated = strategy.organic.contentTypes.includes('educational')
                          ? strategy.organic.contentTypes.filter(t => t !== 'educational')
                          : [...strategy.organic.contentTypes, 'educational'];
                        handleInputChange('organic', 'contentTypes', updated);
                      }}
                      className="justify-start"
                    >
                      {strategy.organic.contentTypes.includes('educational') && (
                        <Check className="mr-1 h-4 w-4" />
                      )}
                      Conteúdo Educativo
                    </Button>
                    <Button
                      type="button"
                      variant={strategy.organic.contentTypes.includes('promotions') ? 'default' : 'outline'}
                      onClick={() => {
                        const updated = strategy.organic.contentTypes.includes('promotions')
                          ? strategy.organic.contentTypes.filter(t => t !== 'promotions')
                          : [...strategy.organic.contentTypes, 'promotions'];
                        handleInputChange('organic', 'contentTypes', updated);
                      }}
                      className="justify-start"
                    >
                      {strategy.organic.contentTypes.includes('promotions') && (
                        <Check className="mr-1 h-4 w-4" />
                      )}
                      Promoções
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Marketing Interno */}
          <TabsContent value="internal" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableInternal" className="font-medium">
                Ativar estratégia de marketing interno
              </Label>
              <Switch 
                id="enableInternal" 
                checked={strategy.internal.enabled}
                onCheckedChange={(checked) => handleSwitchChange('internal', checked)}
              />
            </div>
            
            {strategy.internal.enabled && (
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="referralProgram" className="font-medium">Programa de Indicação</Label>
                    <p className="text-sm text-muted-foreground">Clientes ganham bônus ao indicar amigos</p>
                  </div>
                  <Switch 
                    id="referralProgram" 
                    checked={strategy.internal.referralProgram}
                    onCheckedChange={(checked) => handleInputChange('internal', 'referralProgram', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loyaltyProgram" className="font-medium">Programa de Fidelidade</Label>
                    <p className="text-sm text-muted-foreground">Sistema de pontos por procedimentos realizados</p>
                  </div>
                  <Switch 
                    id="loyaltyProgram" 
                    checked={strategy.internal.loyaltyProgram}
                    onCheckedChange={(checked) => handleInputChange('internal', 'loyaltyProgram', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="packages" className="font-medium">Pacotes e Combos</Label>
                    <p className="text-sm text-muted-foreground">Valor especial para combos de procedimentos</p>
                  </div>
                  <Switch 
                    id="packages" 
                    checked={strategy.internal.packages}
                    onCheckedChange={(checked) => handleInputChange('internal', 'packages', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="events" className="font-medium">Eventos de Relacionamento</Label>
                    <p className="text-sm text-muted-foreground">Eventos exclusivos para clientes VIP</p>
                  </div>
                  <Switch 
                    id="events" 
                    checked={strategy.internal.events}
                    onCheckedChange={(checked) => handleInputChange('internal', 'events', checked)}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Resultados esperados mensais com esta estratégia:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Novos clientes estimados</p>
              <p className="text-2xl font-bold">{calculateExpectedClients()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aumento de receita estimado</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(calculateRevenueIncrease())}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-end">
        <Button onClick={handleComplete}>
          Criar Plano de Implementação
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GrowthStrategy;
