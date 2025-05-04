
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label";
import { Check, ArrowRight } from "lucide-react";

interface DiagnosticFormProps {
  onComplete: (data: any) => void;
}

const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [diagnosticData, setDiagnosticData] = useState({
    revenueGoal: '',
    currentRevenue: '',
    mainProcedures: [''],
    marketingStatus: '',
    marketingBudget: '',
    mainChallenge: '',
    additionalInfo: ''
  });
  
  const handleInputChange = (field: string, value: string) => {
    setDiagnosticData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleProcedureChange = (index: number, value: string) => {
    const updatedProcedures = [...diagnosticData.mainProcedures];
    updatedProcedures[index] = value;
    setDiagnosticData(prev => ({
      ...prev,
      mainProcedures: updatedProcedures
    }));
  };
  
  const addProcedure = () => {
    setDiagnosticData(prev => ({
      ...prev,
      mainProcedures: [...prev.mainProcedures, '']
    }));
  };
  
  const removeProcedure = (index: number) => {
    const updatedProcedures = [...diagnosticData.mainProcedures];
    updatedProcedures.splice(index, 1);
    setDiagnosticData(prev => ({
      ...prev,
      mainProcedures: updatedProcedures
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
      case 1:
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="revenueGoal">Quanto você gostaria de faturar por mês com sua clínica?</Label>
                <Input 
                  id="revenueGoal" 
                  placeholder="R$ 30.000,00" 
                  value={diagnosticData.revenueGoal}
                  onChange={(e) => handleInputChange('revenueGoal', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="currentRevenue">Quanto você fatura atualmente (aproximadamente)?</Label>
                <Input 
                  id="currentRevenue" 
                  placeholder="R$ 15.000,00" 
                  value={diagnosticData.currentRevenue}
                  onChange={(e) => handleInputChange('currentRevenue', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <CardFooter className="flex justify-end pt-4">
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
      
      case 2:
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Quais procedimentos você mais vende hoje?</Label>
                {diagnosticData.mainProcedures.map((procedure, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input 
                      placeholder={`Procedimento ${index + 1}`}
                      value={procedure}
                      onChange={(e) => handleProcedureChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeProcedure(index)}
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
                  onClick={addProcedure}
                  className="mt-2"
                >
                  + Adicionar procedimento
                </Button>
              </div>
            </div>
            
            <CardFooter className="flex justify-between pt-4">
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
      
      case 3:
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Você faz marketing atualmente?</Label>
                <RadioGroup 
                  value={diagnosticData.marketingStatus}
                  onValueChange={(value) => handleInputChange('marketingStatus', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="organic" id="organic" />
                    <Label htmlFor="organic">Sim, apenas orgânico (sem investimento)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="paid" />
                    <Label htmlFor="paid">Sim, com tráfego pago (investimento em ads)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Sim, ambos (orgânico e pago)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">Não faço marketing atualmente</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {(diagnosticData.marketingStatus === 'paid' || diagnosticData.marketingStatus === 'both') && (
                <div>
                  <Label htmlFor="marketingBudget">Qual seu orçamento mensal para marketing?</Label>
                  <Input 
                    id="marketingBudget" 
                    placeholder="R$ 2.000,00" 
                    value={diagnosticData.marketingBudget}
                    onChange={(e) => handleInputChange('marketingBudget', e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
            
            <CardFooter className="flex justify-between pt-4">
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
      
      case 4:
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="mainChallenge">Qual sua maior dificuldade hoje?</Label>
                <Select 
                  value={diagnosticData.mainChallenge}
                  onValueChange={(value) => handleInputChange('mainChallenge', value)}
                >
                  <SelectTrigger id="mainChallenge" className="mt-1">
                    <SelectValue placeholder="Selecione sua maior dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">Criar conteúdo para redes sociais</SelectItem>
                    <SelectItem value="leads">Atrair novos clientes/pacientes</SelectItem>
                    <SelectItem value="sales">Converter consultas em vendas</SelectItem>
                    <SelectItem value="retention">Fidelizar clientes existentes</SelectItem>
                    <SelectItem value="engagement">Conseguir engajamento nas redes</SelectItem>
                    <SelectItem value="time">Falta de tempo para o marketing</SelectItem>
                    <SelectItem value="knowledge">Entender estratégias eficazes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="additionalInfo">Alguma informação adicional sobre seu negócio?</Label>
                <Textarea 
                  id="additionalInfo" 
                  placeholder="Conte mais sobre sua clínica, público, desafios específicos..." 
                  value={diagnosticData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
            
            <CardFooter className="flex justify-between pt-4">
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Diagnóstico da Clínica</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((stepNumber) => (
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
                {stepNumber === 1 && 'Faturamento'}
                {stepNumber === 2 && 'Procedimentos'}
                {stepNumber === 3 && 'Marketing'}
                {stepNumber === 4 && 'Desafios'}
              </p>
            </div>
          ))}
        </div>
        
        {renderStep()}
      </CardContent>
    </Card>
  );
};

export default DiagnosticForm;
