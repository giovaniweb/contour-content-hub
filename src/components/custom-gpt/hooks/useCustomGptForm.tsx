
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEquipments } from "@/hooks/useEquipments";
import { CustomGptType, CustomGptRequest } from "@/utils/custom-gpt";
import { MarketingObjectiveType, ScriptResponse } from '@/types/script';
import { customGptFormSchema, CustomGptResult } from '../types';
import { generateContent, findEquipmentName, getTypeName } from '../utils';

export const useCustomGptForm = (
  onResults?: (results: CustomGptResult[]) => void,
  onScriptGenerated?: (script: ScriptResponse) => void,
  initialData?: any,
  mode?: string
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { equipments, loading: equipmentsLoading } = useEquipments();
  const [selectedType, setSelectedType] = useState<CustomGptType>("roteiro");
  const [selectedEquipment, setSelectedEquipment] = useState<string | undefined>(undefined);
  const [selectedObjective, setSelectedObjective] = useState<MarketingObjectiveType | undefined>("🟢 Criar Conexão");
  const [results, setResults] = useState<CustomGptResult[]>([]);
  const [showAdvancedFields, setShowAdvancedFields] = useState(mode === 'advanced');

  const form = useForm({
    resolver: zodResolver(customGptFormSchema),
    defaultValues: {
      topic: "",
      tone: "",
      quantity: "1",
      additionalInfo: "",
      marketingObjective: "🟢 Criar Conexão",
      bodyArea: "",
      purposes: [],
      resetAfterSubmit: false
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        topic: initialData.topic || "",
        tone: initialData.tom || "",
        additionalInfo: initialData.additionalInfo || "",
        marketingObjective: initialData.marketingObjective || "🟢 Criar Conexão",
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
    form.reset({
      topic: "",
      tone: "",
      quantity: "1",
      additionalInfo: "",
      marketingObjective: "🟢 Criar Conexão",
      bodyArea: "",
      purposes: [],
      resetAfterSubmit: false
    });
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
      // Encontrar o equipamento selecionado para obter seus dados completos
      const selectedEquipmentData = equipments.find(eq => eq.id === selectedEquipment);
      
      if (!selectedEquipmentData) {
        toast({
          variant: "destructive",
          title: "Equipamento não encontrado",
          description: "O equipamento selecionado não foi encontrado."
        });
        return;
      }

      // Cria a requisição para a API com dados completos do equipamento
      const request: CustomGptRequest = {
        tipo: selectedType,
        equipamento: selectedEquipment,
        equipamentoData: selectedEquipmentData,
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
      toast({
        variant: "destructive",
        title: "Erro ao gerar conteúdo",
        description: "Ocorreu um erro inesperado. Por favor tente novamente."
      });
    }
  };

  // Função simplificada para gerar conteúdo rápido
  const handleQuickGenerate = async (type: CustomGptType) => {
    console.log("handleQuickGenerate chamado com tipo:", type);
    
    if (!selectedEquipment) {
      toast({
        variant: "destructive",
        title: "Equipamento necessário",
        description: "Por favor selecione um equipamento para gerar conteúdo."
      });
      return;
    }

    setSelectedType(type);
    
    try {
      // Encontrar o equipamento selecionado para obter seus dados completos
      const selectedEquipmentData = equipments.find(eq => eq.id === selectedEquipment);
      
      if (!selectedEquipmentData) {
        toast({
          variant: "destructive",
          title: "Equipamento não encontrado",
          description: "O equipamento selecionado não foi encontrado."
        });
        return;
      }
      
      const equipmentName = findEquipmentName(selectedEquipment, equipments);
      console.log("Equipment name:", equipmentName);
      
      // Cria a requisição simplificada para a API com dados completos do equipamento
      const request: CustomGptRequest = {
        tipo: type,
        equipamento: selectedEquipment,
        equipamentoData: selectedEquipmentData,
        quantidade: 1,
        estrategiaConteudo: selectedObjective as MarketingObjectiveType,
        topic: `${getTypeName(type)} sobre ${equipmentName}`,
        marketingObjective: selectedObjective as MarketingObjectiveType
      };
      
      console.log("Quick generate request:", request);
      
      await generateContent(
        request,
        setIsSubmitting,
        toast,
        onScriptGenerated,
        onResults,
        setResults
      );
    } catch (error) {
      console.error('Erro ao gerar conteúdo rápido:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar conteúdo",
        description: "Ocorreu um erro ao tentar gerar o conteúdo. Por favor tente novamente."
      });
    }
  };

  return {
    form,
    isSubmitting,
    selectedType,
    setSelectedType,
    selectedEquipment,
    setSelectedEquipment,
    selectedObjective,
    setSelectedObjective,
    results,
    setResults,
    showAdvancedFields,
    setShowAdvancedFields,
    equipments,
    equipmentsLoading,
    handleSubmit,
    handleQuickGenerate,
    resetFormFields
  };
};
