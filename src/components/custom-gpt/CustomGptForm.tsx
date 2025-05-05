
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEquipments } from "@/hooks/useEquipments";
import { Form } from "@/components/ui/form";
import { CustomGptType, CustomGptRequest, CustomGptResult } from "@/utils/custom-gpt";
import { MarketingObjectiveType, ScriptResponse } from '@/types/script';
import { customGptFormSchema, defaultFormValues } from './schema';
import { CustomGptFormProps } from './types';
import { getTypeName, generateContent, findEquipmentName } from './utils';
import SimpleGenerator from './SimpleGenerator';
import AdvancedGenerator from './AdvancedGenerator';
import ResultDisplay from './ResultDisplay';
import AdvancedOptions from './AdvancedOptions';

const CustomGptForm: React.FC<CustomGptFormProps> = ({ 
  onResults, 
  onScriptGenerated, 
  initialData, 
  mode = 'simple' 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { equipments, loading: equipmentsLoading } = useEquipments();
  const [selectedType, setSelectedType] = useState<CustomGptType>("roteiro");
  const [selectedEquipment, setSelectedEquipment] = useState<string | undefined>(undefined);
  const [selectedObjective, setSelectedObjective] = useState<MarketingObjectiveType | undefined>("🟡 Atrair Atenção");
  const [results, setResults] = useState<CustomGptResult[]>([]);
  const [showAdvancedFields, setShowAdvancedFields] = useState(mode === 'advanced');

  const form = useForm({
    resolver: zodResolver(customGptFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        topic: initialData.topic || "",
        tone: initialData.tom || "",
        additionalInfo: initialData.additionalInfo || "",
        marketingObjective: initialData.marketingObjective || "🟡 Atrair Atenção",
        bodyArea: initialData.bodyArea || "",
        purposes: initialData.purposes || [],
      });
      
      if (initialData.equipamento) {
        setSelectedEquipment(initialData.equipamento);
      }
    }
  }, [initialData, form]);

  useEffect(() => {
    if (onResults && results.length > 0) {
      onResults(results);
    }
  }, [results, onResults]);

  useEffect(() => {
    setShowAdvancedFields(mode === 'advanced');
  }, [mode]);

  const resetFormFields = () => {
    form.reset(defaultFormValues);
    setSelectedEquipment(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEquipment) {
      toast({
        variant: "destructive",
        title: "Equipamento necessário",
        description: "Por favor selecione um equipamento para gerar conteúdo."
      });
      return;
    }

    try {
      // Cria a requisição para a API
      const request: CustomGptRequest = {
        tipo: selectedType,
        equipamento: selectedEquipment || '',
        quantidade: parseInt(form.getValues().quantity || "1") || 1,
        tom: form.getValues().tone,
        estrategiaConteudo: selectedObjective as MarketingObjectiveType,
        topic: form.getValues().topic || `Conteúdo sobre ${findEquipmentName(selectedEquipment, equipments)}`,
        bodyArea: form.getValues().bodyArea,
        purposes: form.getValues().purposes || [],
        additionalInfo: form.getValues().additionalInfo,
        marketingObjective: selectedObjective as MarketingObjectiveType
      };
      
      console.log("Form submit request:", request);
      
      const result = await generateContent(
        request,
        setIsSubmitting,
        toast,
        onScriptGenerated,
        onResults,
        setResults
      );
      
      // Reset do formulário
      if (form.getValues().resetAfterSubmit && result.success) {
        resetFormFields();
      }
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
    }
  };

  // Função simplificada para gerar conteúdo rápido
  const handleQuickGenerate = async (type: CustomGptType) => {
    if (!selectedEquipment) {
      toast({
        variant: "destructive",
        title: "Equipamento necessário",
        description: "Por favor selecione um equipamento para gerar conteúdo."
      });
      return;
    }

    setSelectedType(type);
    
    // Cria a requisição simplificada para a API
    const request: CustomGptRequest = {
      tipo: type,
      equipamento: selectedEquipment,
      quantidade: 1,
      estrategiaConteudo: selectedObjective as MarketingObjectiveType,
      topic: `${getTypeName(type)} sobre ${findEquipmentName(selectedEquipment, equipments)}`,
      marketingObjective: selectedObjective as MarketingObjectiveType
    };
    
    console.log("Quick generate request:", request);
    console.log("Selected equipment:", selectedEquipment);
    console.log("Equipment name:", findEquipmentName(selectedEquipment, equipments));
    
    await generateContent(
      request,
      setIsSubmitting,
      toast,
      onScriptGenerated,
      onResults,
      setResults
    );
  };

  return (
    <div>
      {mode === 'simple' ? (
        <>
          <SimpleGenerator
            selectedEquipment={selectedEquipment}
            setSelectedEquipment={setSelectedEquipment}
            selectedObjective={selectedObjective}
            setSelectedObjective={setSelectedObjective}
            equipments={equipments}
            equipmentsLoading={equipmentsLoading}
            handleQuickGenerate={handleQuickGenerate}
            isSubmitting={isSubmitting}
            results={results}
            setResults={setResults}
            showAdvancedFields={showAdvancedFields}
            setShowAdvancedFields={setShowAdvancedFields}
          />
          
          {showAdvancedFields && (
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <AdvancedGenerator
                  form={form}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedEquipment={selectedEquipment}
                  setSelectedEquipment={setSelectedEquipment}
                  equipments={equipments}
                  equipmentsLoading={equipmentsLoading}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </form>
            </Form>
          )}
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdvancedGenerator
              form={form}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment}
              equipments={equipments}
              equipmentsLoading={equipmentsLoading}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      )}
    </div>
  );
};

export default CustomGptForm;
