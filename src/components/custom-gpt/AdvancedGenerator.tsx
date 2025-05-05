
import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AdvancedGeneratorProps } from './types';
import { Sparkles, FileText, MessageSquare } from "lucide-react";
import { MarketingObjectiveType } from '@/types/script';
import AdvancedOptions from './AdvancedOptions';

const AdvancedGenerator: React.FC<AdvancedGeneratorProps> = ({
  form,
  isSubmitting,
  selectedType,
  setSelectedType,
  selectedEquipment,
  setSelectedEquipment,
  selectedObjective,
  setSelectedObjective,
  equipments,
  equipmentsLoading,
  handleSubmit
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedType || 'roteiro');
  
  const handleTypeSelect = (value: string) => {
    setSelectedType(value as 'roteiro' | 'bigIdea' | 'stories');
    setActiveTab(value);
  };
  
  const handleObjectiveSelect = (value: string) => {
    setSelectedObjective(value as MarketingObjectiveType);
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'roteiro':
        return <FileText className="h-4 w-4" />;
      case 'bigIdea':
        return <Sparkles className="h-4 w-4" />;
      case 'stories':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Tipo de Conteúdo</h3>
        <Tabs value={activeTab} onValueChange={handleTypeSelect} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="roteiro" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Roteiro
            </TabsTrigger>
            <TabsTrigger value="bigIdea" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Big Idea
            </TabsTrigger>
            <TabsTrigger value="stories" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Stories
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="roteiro" className="mt-0">
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h4 className="font-medium text-blue-800 mb-1">Roteiro para Vídeo</h4>
              <p className="text-sm text-blue-700">
                Estrutura completa para vídeos educativos e persuasivos seguindo o modelo Disney.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="bigIdea" className="mt-0">
            <div className="bg-purple-50 p-4 rounded-md mb-6">
              <h4 className="font-medium text-purple-800 mb-1">Big Idea</h4>
              <p className="text-sm text-purple-700">
                Conceito criativo poderoso que será o tema central de uma campanha.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="stories" className="mt-0">
            <div className="bg-amber-50 p-4 rounded-md mb-6">
              <h4 className="font-medium text-amber-800 mb-1">Stories</h4>
              <p className="text-sm text-amber-700">
                Formato vertical e dinâmico para Instagram e WhatsApp Stories com instruções de gravação.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Equipamento</h3>
          <Select 
            value={selectedEquipment} 
            onValueChange={setSelectedEquipment}
            disabled={equipmentsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um equipamento" />
            </SelectTrigger>
            <SelectContent>
              {equipments.map((eq) => (
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
            value={selectedObjective} 
            onValueChange={handleObjectiveSelect}
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
      
      <Separator />
      
      <AdvancedOptions form={form} showAdvancedFields={true} />
      
      <div className="flex justify-end mt-6">
        <Button 
          type="submit" 
          onClick={(e) => handleSubmit(e)}
          disabled={isSubmitting || !selectedEquipment}
          className="w-full md:w-auto"
        >
          {isSubmitting ? (
            "Gerando conteúdo..."
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar {getTypeIcon(selectedType)} {selectedType === 'roteiro' ? 'Roteiro' : selectedType === 'bigIdea' ? 'Big Idea' : 'Stories'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdvancedGenerator;
