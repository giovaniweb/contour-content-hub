
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";

interface DiagnosticFormProps {
  onComplete: (data: any) => void;
}

const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [diagnosticData, setDiagnosticData] = useState({
    // Seção 1 - Perfil da Clínica
    clinicName: '',
    yearsInBusiness: '',
    teamSize: '',
    mainProcedures: [''],
    equipments: [''],
    cityAndTargetAudience: '',
    
    // Seção 2 - Financeiro
    currentRevenue: '',
    revenueGoal: '',
    weeklyAppointments: '',
    mostProfitableProcedures: [''],
    salesModel: '',
    
    // Seção 3 - Marketing
    usesSocialMedia: '',
    postingFrequency: '',
    paidAds: '',
    contentCreationComfort: '',
    hasWebsite: '',
    
    // Seção 4 - Metas
    mainChallenge: '',
    threeMonthGoal: '',
    marketingSuccessMetrics: '',
    
    // Seção 5 - Sentimento
    currentFeeling: '',
    routineChangeDesire: '',
    biggestProblemSolution: '',
    
    // Campo adicional
    additionalInfo: ''
  });
  
  const handleInputChange = (field: string, value: string) => {
    setDiagnosticData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleArrayChange = (field: string, index: number, value: string) => {
    const updatedArray = [...diagnosticData[field as keyof typeof diagnosticData] as string[]];
    updatedArray[index] = value;
    setDiagnosticData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };
  
  const addArrayItem = (field: string) => {
    const currentArray = [...diagnosticData[field as keyof typeof diagnosticData] as string[]];
    setDiagnosticData(prev => ({
      ...prev,
      [field]: [...currentArray, '']
    }));
  };
  
  const removeArrayItem = (field: string, index: number) => {
    const updatedArray = [...diagnosticData[field as keyof typeof diagnosticData] as string[]];
    updatedArray.splice(index, 1);
    setDiagnosticData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = () => {
    onComplete(diagnosticData);
  };

  const renderStep = () => {
    switch (step) {
      // Seção 1 - Perfil da Clínica
      case 1:
        return (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Perfil da Clínica</h2>
              
              <div>
                <Label htmlFor="clinicName">Nome da clínica</Label>
                <Input 
                  id="clinicName" 
                  placeholder="Estética Bem Estar" 
                  value={diagnosticData.clinicName}
                  onChange={(e) => handleInputChange('clinicName', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="yearsInBusiness">Tempo de mercado</Label>
                <Input 
                  id="yearsInBusiness" 
                  placeholder="2 anos" 
                  value={diagnosticData.yearsInBusiness}
                  onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="teamSize">Quantidade de profissionais na equipe</Label>
                <Input 
                  id="teamSize" 
                  placeholder="5 profissionais" 
                  value={diagnosticData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Principais procedimentos oferecidos</Label>
                {diagnosticData.mainProcedures.map((procedure, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input 
                      placeholder={`Procedimento ${index + 1}`}
                      value={procedure}
                      onChange={(e) => handleArrayChange('mainProcedures', index, e.target.value)}
                      className="flex-1"
                    />
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeArrayItem('mainProcedures', index)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addArrayItem('mainProcedures')}
                  className="mt-2"
                >
                  + Adicionar procedimento
                </Button>
              </div>
              
              <div>
                <Label>Equipamentos utilizados atualmente</Label>
                {diagnosticData.equipments.map((equipment, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input 
                      placeholder={`Equipamento ${index + 1}`}
                      value={equipment}
                      onChange={(e) => handleArrayChange('equipments', index, e.target.value)}
                      className="flex-1"
                    />
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeArrayItem('equipments', index)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addArrayItem('equipments')}
                  className="mt-2"
                >
                  + Adicionar equipamento
                </Button>
              </div>
              
              <div>
                <Label htmlFor="cityAndTargetAudience">Cidade e público-alvo principal</Label>
                <Input 
                  id="cityAndTargetAudience" 
                  placeholder="São Paulo, mulheres 30-50 anos" 
                  value={diagnosticData.cityAndTargetAudience}
                  onChange={(e) => handleInputChange('cityAndTargetAudience', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <CardFooter className="flex justify-between pt-6">
              <div></div> {/* Espaço vazio para alinhamento */}
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
      
      // Seção 2 - Financeiro
      case 2:
        return (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Situação Financeira e Comercial</h2>
              
              <div>
                <Label htmlFor="currentRevenue">Faturamento médio atual (mensal)</Label>
                <Input 
                  id="currentRevenue" 
                  placeholder="R$ 30.000,00" 
                  value={diagnosticData.currentRevenue}
                  onChange={(e) => handleInputChange('currentRevenue', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="revenueGoal">Meta de faturamento ideal por mês</Label>
                <Input 
                  id="revenueGoal" 
                  placeholder="R$ 50.000,00" 
                  value={diagnosticData.revenueGoal}
                  onChange={(e) => handleInputChange('revenueGoal', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="weeklyAppointments">Quantos atendimentos realiza por semana, em média?</Label>
                <Input 
                  id="weeklyAppointments" 
                  placeholder="25 atendimentos" 
                  value={diagnosticData.weeklyAppointments}
                  onChange={(e) => handleInputChange('weeklyAppointments', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Procedimentos mais lucrativos atualmente</Label>
                {diagnosticData.mostProfitableProcedures.map((procedure, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input 
                      placeholder={`Procedimento ${index + 1}`}
                      value={procedure}
                      onChange={(e) => handleArrayChange('mostProfitableProcedures', index, e.target.value)}
                      className="flex-1"
                    />
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeArrayItem('mostProfitableProcedures', index)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addArrayItem('mostProfitableProcedures')}
                  className="mt-2"
                >
                  + Adicionar procedimento
                </Button>
              </div>
              
              <div>
                <Label>Você vende pacotes ou trabalha por sessão única?</Label>
                <RadioGroup 
                  value={diagnosticData.salesModel}
                  onValueChange={(value) => handleInputChange('salesModel', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="packages" id="packages" />
                    <Label htmlFor="packages">Pacotes de sessões</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single">Sessões avulsas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both-sales" />
                    <Label htmlFor="both-sales">Ambos, depende do procedimento</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <CardFooter className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
      
      // Seção 3 - Marketing
      case 3:
        return (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Marketing e Comunicação</h2>
              
              <div>
                <Label>Você usa redes sociais para divulgar seus serviços?</Label>
                <RadioGroup 
                  value={diagnosticData.usesSocialMedia}
                  onValueChange={(value) => handleInputChange('usesSocialMedia', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="social-yes" />
                    <Label htmlFor="social-yes">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="social-no" />
                    <Label htmlFor="social-no">Não</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {diagnosticData.usesSocialMedia === 'yes' && (
                <div>
                  <Label>Com que frequência publica conteúdos?</Label>
                  <RadioGroup 
                    value={diagnosticData.postingFrequency}
                    onValueChange={(value) => handleInputChange('postingFrequency', value)}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="freq-daily" />
                      <Label htmlFor="freq-daily">Diária</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2-3x" id="freq-2-3x" />
                      <Label htmlFor="freq-2-3x">2–3x por semana</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rarely" id="freq-rarely" />
                      <Label htmlFor="freq-rarely">Raramente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="freq-never" />
                      <Label htmlFor="freq-never">Nunca</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              <div>
                <Label>Você impulsiona publicações (tráfego pago)?</Label>
                <RadioGroup 
                  value={diagnosticData.paidAds}
                  onValueChange={(value) => handleInputChange('paidAds', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="ads-yes" />
                    <Label htmlFor="ads-yes">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="ads-no" />
                    <Label htmlFor="ads-no">Não</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tried" id="ads-tried" />
                    <Label htmlFor="ads-tried">Já tentei mas não funcionou</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>Você se sente confortável criando conteúdo?</Label>
                <RadioGroup 
                  value={diagnosticData.contentCreationComfort}
                  onValueChange={(value) => handleInputChange('contentCreationComfort', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="comfort-yes" />
                    <Label htmlFor="comfort-yes">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="somewhat" id="comfort-somewhat" />
                    <Label htmlFor="comfort-somewhat">Mais ou menos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="comfort-no" />
                    <Label htmlFor="comfort-no">Não sei o que postar</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>Você possui site ou landing page de captação?</Label>
                <RadioGroup 
                  value={diagnosticData.hasWebsite}
                  onValueChange={(value) => handleInputChange('hasWebsite', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="site-yes" />
                    <Label htmlFor="site-yes">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="site-no" />
                    <Label htmlFor="site-no">Não</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <CardFooter className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
      
      // Seção 4 - Metas e Desafios
      case 4:
        return (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Metas e Desafios</h2>
              
              <div>
                <Label htmlFor="mainChallenge">Qual é o seu maior desafio hoje?</Label>
                <Select 
                  value={diagnosticData.mainChallenge}
                  onValueChange={(value) => handleInputChange('mainChallenge', value)}
                >
                  <SelectTrigger id="mainChallenge" className="mt-1">
                    <SelectValue placeholder="Selecione seu maior desafio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attract">Atrair mais clientes</SelectItem>
                    <SelectItem value="convert">Converter consultas em vendas</SelectItem>
                    <SelectItem value="content">Criar conteúdo para redes sociais</SelectItem>
                    <SelectItem value="retention">Fidelizar clientes existentes</SelectItem>
                    <SelectItem value="pricing">Definir preços competitivos</SelectItem>
                    <SelectItem value="time">Falta de tempo para o marketing</SelectItem>
                    <SelectItem value="team">Gestão da equipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="threeMonthGoal">O que você gostaria de melhorar na sua clínica nos próximos 3 meses?</Label>
                <Textarea 
                  id="threeMonthGoal" 
                  placeholder="Descreva suas metas para os próximos 3 meses..." 
                  value={diagnosticData.threeMonthGoal}
                  onChange={(e) => handleInputChange('threeMonthGoal', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="marketingSuccessMetrics">Quais resultados você considera satisfatórios com marketing?</Label>
                <Textarea 
                  id="marketingSuccessMetrics" 
                  placeholder="Ex: mais pacientes, mais pacotes vendidos, mais autoridade no Instagram..." 
                  value={diagnosticData.marketingSuccessMetrics}
                  onChange={(e) => handleInputChange('marketingSuccessMetrics', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            
            <CardFooter className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
      
      // Seção 5 - Sentimento do Dono
      case 5:
        return (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Sentimento do Profissional</h2>
              
              <div>
                <Label>Como você está se sentindo em relação ao seu negócio hoje?</Label>
                <RadioGroup 
                  value={diagnosticData.currentFeeling}
                  onValueChange={(value) => handleInputChange('currentFeeling', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excited" id="feeling-excited" />
                    <Label htmlFor="feeling-excited">Animado(a)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tired" id="feeling-tired" />
                    <Label htmlFor="feeling-tired">Cansado(a)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frustrated" id="feeling-frustrated" />
                    <Label htmlFor="feeling-frustrated">Frustrado(a)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="optimistic" id="feeling-optimistic" />
                    <Label htmlFor="feeling-optimistic">Otimista</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="routineChangeDesire">O que você gostaria de mudar na sua rotina como profissional?</Label>
                <Textarea 
                  id="routineChangeDesire" 
                  placeholder="Descreva o que gostaria de mudar..." 
                  value={diagnosticData.routineChangeDesire}
                  onChange={(e) => handleInputChange('routineChangeDesire', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="biggestProblemSolution">Se tivesse uma solução agora para seu maior problema, o que ela faria?</Label>
                <Textarea 
                  id="biggestProblemSolution" 
                  placeholder="Descreva a solução ideal..." 
                  value={diagnosticData.biggestProblemSolution}
                  onChange={(e) => handleInputChange('biggestProblemSolution', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="additionalInfo">Informações adicionais que você gostaria de compartilhar:</Label>
                <Textarea 
                  id="additionalInfo" 
                  placeholder="Comentários ou informações adicionais..." 
                  value={diagnosticData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            
            <CardFooter className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button onClick={handleSubmit}>
                Concluir Diagnóstico
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Diagnóstico Estratégico da Clínica</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step === stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : step > stepNumber 
                    ? 'bg-green-500 text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                {stepNumber === 1 && 'Perfil'}
                {stepNumber === 2 && 'Financeiro'}
                {stepNumber === 3 && 'Marketing'}
                {stepNumber === 4 && 'Metas'}
                {stepNumber === 5 && 'Sentimento'}
              </p>
            </div>
          ))}
        </div>
        
        <ScrollArea className="h-[calc(100%-40px)] pr-4">
          {renderStep()}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DiagnosticForm;
