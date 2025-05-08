
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimpleGeneratorProps } from './types';
import { FileText, Sparkles, MessageSquare, ChevronDown } from "lucide-react";
import { CustomGptType } from '@/utils/custom-gpt';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const SimpleGenerator: React.FC<SimpleGeneratorProps> = ({
  selectedEquipment,
  setSelectedEquipment,
  selectedObjective,
  setSelectedObjective,
  equipments,
  equipmentsLoading,
  handleQuickGenerate,
  isSubmitting,
  showAdvancedFields,
  setShowAdvancedFields
}) => {
  
  const renderTypeButton = (type: CustomGptType, label: string, icon: React.ReactNode, description: string) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSubmitting ? 'opacity-50 pointer-events-none' : 'hover:border-primary'
      }`}
      onClick={() => !isSubmitting && selectedEquipment && handleQuickGenerate(type)}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        {icon}
        <h3 className="font-medium text-lg my-2">{label}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <Button 
          disabled={isSubmitting || !selectedEquipment} 
          variant="outline" 
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Gerar {label}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Equipamento</h3>
          <Select 
            value={selectedEquipment || "placeholder"} 
            onValueChange={setSelectedEquipment}
            disabled={equipmentsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um equipamento" />
            </SelectTrigger>
            <SelectContent>
              {equipments
                .filter(eq => eq && eq.id && eq.id !== "")
                .map((eq) => (
                <SelectItem key={eq.id} value={eq.id}>
                  {eq.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Objetivo de Marketing</h3>
          <Select 
            value={selectedObjective || "placeholder"} 
            onValueChange={setSelectedObjective}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="🟡 Atrair Atenção">🟡 Atrair Atenção</SelectItem>
              <SelectItem value="🟢 Criar Conexão">🟢 Criar Conexão</SelectItem>
              <SelectItem value="🔴 Fazer Comprar">🔴 Fazer Comprar</SelectItem>
              <SelectItem value="🔁 Reativar Interesse">🔁 Reativar Interesse</SelectItem>
              <SelectItem value="✅ Fechar Agora">✅ Fechar Agora</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {renderTypeButton(
          'roteiro',
          'Roteiro para Vídeo',
          <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />,
          'Crie roteiros estruturados para vídeos educativos e persuasivos'
        )}
        
        {renderTypeButton(
          'bigIdea',
          'Big Idea',
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />,
          'Desenvolva conceitos criativos poderosos para suas campanhas'
        )}
        
        {renderTypeButton(
          'stories',
          'Stories',
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />,
          'Crie conteúdo atraente para stories com instruções de gravação'
        )}
      </div>
      
      <Collapsible>
        <div className="flex justify-center mt-6">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              onClick={() => setShowAdvancedFields && setShowAdvancedFields(!showAdvancedFields)}
              className="flex items-center"
            >
              {showAdvancedFields ? "Ocultar Opções Avançadas" : "Mostrar Opções Avançadas"}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvancedFields ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-6">
          {/* AdvancedOptions component will be rendered here by the parent component */}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SimpleGenerator;
