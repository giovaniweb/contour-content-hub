
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Wand } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Equipment } from '@/types/equipment';
import { getEquipments } from '@/utils/api-equipment';
import { generateCustomContent, CustomGptType, ConteudoEstrategia } from '@/utils/custom-gpt';
import { ScriptResponse } from '@/utils/api';
import FormControls from './custom-gpt/FormControls';
import GeneratedContent from './custom-gpt/GeneratedContent';
import AdvancedOptions from './custom-gpt/AdvancedOptions';

// Equipamentos padrão para garantir que sempre haja opções
const defaultEquipamentos: Equipment[] = [
  { 
    id: "adella-default", 
    nome: "Adélla Laser", 
    tecnologia: "Laser de alta potência",
    indicacoes: "Tratamento de rugas, manchas e rejuvenescimento",
    beneficios: "Estimulação do colágeno, uniformização da pele",
    diferenciais: "Exclusivo sistema de resfriamento",
    linguagem: "Técnica com toques descontraídos"
  },
  { 
    id: "enygma-default", 
    nome: "Enygma X-Orbital", 
    tecnologia: "Sistema de ondas eletromagnéticas",
    indicacoes: "Flacidez facial e corporal",
    beneficios: "Firmeza e tonificação da pele",
    diferenciais: "Tratamento sem dor e sem tempo de recuperação",
    linguagem: "Informativa e acessível"
  },
  { 
    id: "hive-default", 
    nome: "Hive Pro", 
    tecnologia: "Ultrassom microfocado",
    indicacoes: "Gordura localizada e celulite",
    beneficios: "Redução de medidas e melhora do contorno corporal",
    diferenciais: "Resultados em poucas sessões",
    linguagem: "Direta e motivacional"
  },
  { 
    id: "focuskin-default", 
    nome: "Focuskin", 
    tecnologia: "Radiofrequência fracionada",
    indicacoes: "Estrias e cicatrizes",
    beneficios: "Remodelação do colágeno, melhor textura da pele",
    diferenciais: "Ponteiras específicas para cada tipo de pele",
    linguagem: "Técnica e detalhada"
  },
  { 
    id: "hipro-default", 
    nome: "Hipro", 
    tecnologia: "Eletroestimulação muscular",
    indicacoes: "Tonificação muscular e definição corporal",
    beneficios: "Fortalecimento muscular, redução de gordura",
    diferenciais: "Tratamento equivalente a milhares de contrações musculares",
    linguagem: "Energética e motivacional"
  },
  { 
    id: "crystal-default", 
    nome: "Laser Crystal 3D Plus", 
    tecnologia: "Laser de diodo",
    indicacoes: "Depilação definitiva",
    beneficios: "Pele livre de pelos, conforto durante o procedimento",
    diferenciais: "Sistema de resfriamento, indolor",
    linguagem: "Tranquilizadora e confiante"
  },
  { 
    id: "multi-default", 
    nome: "MultiShape", 
    tecnologia: "Sistema multifuncional",
    indicacoes: "Diversos tratamentos corporais",
    beneficios: "Versatilidade, resultados personalizados",
    diferenciais: "Várias tecnologias em um único aparelho",
    linguagem: "Versátil e adaptável"
  },
  { 
    id: "reverso-default", 
    nome: "Reverso", 
    tecnologia: "Tecnologia de reversão do envelhecimento",
    indicacoes: "Rejuvenescimento facial e corporal",
    beneficios: "Aspecto jovial, revitalização da pele",
    diferenciais: "Protocolo exclusivo anti-aging",
    linguagem: "Sofisticada e elegante"
  },
  { 
    id: "supreme-default", 
    nome: "Supreme Pro", 
    tecnologia: "Alta frequência e estimulação celular",
    indicacoes: "Lifting facial não invasivo",
    beneficios: "Efeito lifting imediato, durabilidade dos resultados",
    diferenciais: "Não requer tempo de recuperação",
    linguagem: "Premium e exclusiva"
  },
  { 
    id: "ultralift-default", 
    nome: "Ultralift - Endolaser", 
    tecnologia: "Ultrassom associado a laser",
    indicacoes: "Tratamento profundo da pele e tecidos",
    beneficios: "Efeito lifting e rejuvenescimento",
    diferenciais: "Tecnologia combinada para resultados superiores",
    linguagem: "Científica e confiável"
  },
  { 
    id: "unyque-default", 
    nome: "Unyque PRO", 
    tecnologia: "Crioterapia avançada",
    indicacoes: "Tratamentos faciais e corporais",
    beneficios: "Rápida recuperação, resultados duradouros",
    diferenciais: "Conforto durante aplicação e eficácia",
    linguagem: "Exclusiva e precisa"
  },
  { 
    id: "xtonus-default", 
    nome: "X-Tonus", 
    tecnologia: "Eletroestimulação avançada",
    indicacoes: "Flacidez e tonificação muscular",
    beneficios: "Fortalecimento muscular sem esforço",
    diferenciais: "Resultados em poucas sessões",
    linguagem: "Dinâmica e objetiva"
  }
];

// Schema de validação do formulário para modo simples
const simpleFormSchema = z.object({
  tipo: z.enum(["roteiro", "bigIdea", "stories"]),
  equipamento: z.string().min(1, "Selecione um equipamento"),
  quantidade: z.number().min(1).max(10).optional(),
  tom: z.string().optional(),
  estrategiaConteudo: z.enum([
    "🟡 Atrair Atenção",
    "🟢 Criar Conexão",
    "🔴 Fazer Comprar",
    "🔁 Reativar Interesse",
    "✅ Fechar Agora"
  ]).optional()
});

// Schema de validação para modo avançado
const advancedFormSchema = z.object({
  tipo: z.enum(["roteiro", "bigIdea", "stories"]),
  equipamento: z.string().min(1, "Selecione um equipamento"),
  quantidade: z.number().min(1).max(10).optional(),
  tom: z.string().optional(),
  estrategiaConteudo: z.enum([
    "🟡 Atrair Atenção",
    "🟢 Criar Conexão",
    "🔴 Fazer Comprar",
    "🔁 Reativar Interesse",
    "✅ Fechar Agora"
  ]).optional(),
  topic: z.string().optional(),
  bodyArea: z.string().optional(),
  purposes: z.array(z.string()).optional(),
  additionalInfo: z.string().optional(),
  marketingObjective: z.string().optional()
});

// Áreas do corpo
const bodyAreas = [
  { value: "face", label: "Face" },
  { value: "pescoco", label: "Pescoço" },
  { value: "abdomen", label: "Abdômen" },
  { value: "coxas", label: "Coxas" },
  { value: "gluteos", label: "Glúteos" },
  { value: "bracos", label: "Braços" },
  { value: "corpotodo", label: "Corpo todo" },
];

// Finalidades de tratamento
const purposes = [
  { value: "rugas", label: "Rugas" },
  { value: "emagrecimento", label: "Emagrecimento" },
  { value: "tonificacao", label: "Tonificação" },
  { value: "hidratacao", label: "Hidratação" },
  { value: "flacidez", label: "Flacidez" },
  { value: "gordura", label: "Gordura localizada" },
  { value: "lipedema", label: "Lipedema" },
  { value: "sarcopenia", label: "Sarcopenia" },
];

interface CustomGptFormProps {
  mode: 'simple' | 'advanced';
  onScriptGenerated?: (script: ScriptResponse) => void;
}

const CustomGptForm = ({ mode, onScriptGenerated }: CustomGptFormProps) => {
  const [loading, setLoading] = useState(false);
  const [equipamentos, setEquipamentos] = useState<Equipment[]>(defaultEquipamentos);
  const [resultado, setResultado] = useState<string>("");
  const [generatedScriptId, setGeneratedScriptId] = useState<string>("");
  const { toast } = useToast();
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  
  // Form setup based on mode
  const form = useForm<z.infer<typeof simpleFormSchema> | z.infer<typeof advancedFormSchema>>({
    resolver: zodResolver(mode === 'simple' ? simpleFormSchema : advancedFormSchema),
    defaultValues: mode === 'simple' ? {
      tipo: "roteiro",
      equipamento: "",
      quantidade: 1
    } : {
      tipo: "roteiro",
      equipamento: "",
      quantidade: 1,
      topic: "",
      bodyArea: "",
      purposes: [],
      additionalInfo: "",
      tom: "professional"
    }
  });

  // Handle checkbox change for purposes
  const handlePurposeChange = (value: string) => {
    setSelectedPurposes(
      selectedPurposes.includes(value)
        ? selectedPurposes.filter((item) => item !== value)
        : [...selectedPurposes, value]
    );
    
    // Update form value if in advanced mode
    if (mode === 'advanced') {
      form.setValue('purposes', 
        selectedPurposes.includes(value)
          ? selectedPurposes.filter((item) => item !== value)
          : [...selectedPurposes, value]
      );
    }
  };

  // Carregar equipamentos ao montar o componente
  useEffect(() => {
    const loadEquipamentos = async () => {
      try {
        console.log("Carregando equipamentos...");
        const data = await getEquipments();
        
        if (data && data.length > 0) {
          console.log(`${data.length} equipamentos carregados da API`);
          // Combinar equipamentos da API com os padrão para evitar duplicidades
          const combinedEquipamentos = [...data];
          
          // Adicionar equipamentos padrão que não estão na lista da API
          defaultEquipamentos.forEach(defaultEq => {
            const exists = data.some(apiEq => 
              apiEq.nome.toLowerCase() === defaultEq.nome.toLowerCase()
            );
            
            if (!exists) {
              combinedEquipamentos.push(defaultEq);
            }
          });
          
          console.log(`Total de ${combinedEquipamentos.length} equipamentos após combinação`);
          setEquipamentos(combinedEquipamentos);
        } else {
          console.log("API retornou lista vazia, usando equipamentos padrão");
          setEquipamentos(defaultEquipamentos);
        }
      } catch (error) {
        console.error("Erro ao carregar equipamentos:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar equipamentos",
          description: "Usando lista de equipamentos padrão."
        });
        setEquipamentos(defaultEquipamentos);
      }
    };

    loadEquipamentos();
  }, [toast]);

  // Prepare script data for validation
  const prepareScriptData = (): ScriptResponse => {
    const scriptType = form.getValues().tipo as CustomGptType;
    let mappedType = "videoScript"; // Default
    
    // Map CustomGptType to ScriptType
    if (scriptType === "bigIdea") {
      mappedType = "bigIdea";
    } else if (scriptType === "stories") {
      mappedType = "dailySales";
    }
    
    return {
      id: generatedScriptId || `temp-${Date.now()}`,
      title: `${form.getValues().equipamento} - ${scriptType.charAt(0).toUpperCase() + scriptType.slice(1)}`,
      content: resultado,
      type: mappedType as any,
      createdAt: new Date().toISOString()
    };
  };

  // Lidar com o envio do formulário
  const onSubmit = async (values: z.infer<typeof simpleFormSchema> | z.infer<typeof advancedFormSchema>) => {
    try {
      setLoading(true);
      setResultado("");
      setGeneratedScriptId(`temp-${Date.now()}`);

      // Encontrar o equipamento selecionado na lista
      const equipamentoSelecionado = equipamentos.find(eq => eq.nome === values.equipamento);
      
      if (!equipamentoSelecionado) {
        throw new Error(`Equipamento ${values.equipamento} não encontrado na lista.`);
      }

      console.log("Enviando requisição para gerar conteúdo com equipamento:", equipamentoSelecionado);
      
      // Preparar dados adicionais para o modo avançado
      let additionalData = {};
      if (mode === 'advanced') {
        const advancedValues = values as z.infer<typeof advancedFormSchema>;
        additionalData = {
          topic: advancedValues.topic,
          bodyArea: advancedValues.bodyArea,
          purposes: selectedPurposes,
          additionalInfo: advancedValues.additionalInfo,
          marketingObjective: advancedValues.marketingObjective
        };
      }

      const response = await generateCustomContent({
        tipo: values.tipo as CustomGptType,
        equipamento: values.equipamento,
        quantidade: values.quantidade,
        tom: values.tom,
        estrategiaConteudo: values.estrategiaConteudo as ConteudoEstrategia,
        equipamentoData: equipamentoSelecionado,
        ...additionalData
      });

      setResultado(response.content);
      setGeneratedScriptId(response.id || generatedScriptId);
      
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: `${values.tipo.charAt(0).toUpperCase() + values.tipo.slice(1)} para ${values.equipamento} criado.`
      });
      
      // Notify parent component when script is generated
      if (onScriptGenerated) {
        const scriptType = values.tipo as CustomGptType;
        let mappedType = "videoScript"; // Default
        
        // Map CustomGptType to ScriptType
        if (scriptType === "bigIdea") {
          mappedType = "bigIdea";
        } else if (scriptType === "stories") {
          mappedType = "dailySales";
        }
        
        const scriptResponse: ScriptResponse = {
          id: response.id || generatedScriptId,
          title: `${values.equipamento} - ${scriptType.charAt(0).toUpperCase() + scriptType.slice(1)}`,
          content: response.content,
          type: mappedType as any,
          createdAt: new Date().toISOString()
        };
        
        onScriptGenerated(scriptResponse);
      }
    } catch (error) {
      console.error("Erro ao gerar conteúdo:", error);
      toast({
        variant: "destructive",
        title: "Erro na geração",
        description: error instanceof Error ? error.message : "Não foi possível gerar o conteúdo solicitado."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            {mode === 'simple' ? (
              <>
                <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                Fluida - Roteiros e Ideias
              </>
            ) : (
              <>
                <Wand className="h-5 w-5 mr-2 text-blue-500" />
                Roteiro Avançado - Personalização Completa
              </>
            )}
          </CardTitle>
          <CardDescription>
            {mode === 'simple' 
              ? "Gere roteiros, big ideas e stories para equipamentos estéticos" 
              : "Crie conteúdo altamente personalizado com opções avançadas de customização"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="roteiro" 
                onValueChange={(value) => form.setValue("tipo", value as CustomGptType)}
                className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="roteiro">Roteiro</TabsTrigger>
                  <TabsTrigger value="bigIdea">Big Idea</TabsTrigger>
                  <TabsTrigger value="stories">Stories 10x</TabsTrigger>
                </TabsList>
                
                <FormField
                  control={form.control}
                  name="equipamento"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Equipamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um equipamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {equipamentos.length > 0 ? (
                            equipamentos.map((eq) => (
                              <SelectItem key={eq.id || eq.nome} value={eq.nome}>
                                {eq.nome}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="carregando">Carregando equipamentos...</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <TabsContent value="roteiro" className="space-y-4">
                  <FormControls form={form} formType="roteiro" />
                </TabsContent>
                
                <TabsContent value="bigIdea" className="space-y-4">
                  <FormControls form={form} formType="bigIdea" />
                </TabsContent>
                
                <TabsContent value="stories" className="space-y-4">
                  <FormControls form={form} formType="stories" />
                </TabsContent>
              </Tabs>
              
              {/* Opções avançadas apenas para o modo advanced */}
              {mode === 'advanced' && (
                <AdvancedOptions 
                  form={form}
                  bodyAreas={bodyAreas}
                  purposes={purposes}
                  selectedPurposes={selectedPurposes}
                  onPurposeChange={handlePurposeChange}
                />
              )}
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar conteúdo personalizado
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {resultado && (
        <GeneratedContent
          content={resultado}
          title="Conteúdo Gerado"
          description={`${form.getValues().tipo.charAt(0).toUpperCase() + form.getValues().tipo.slice(1)} gerado para ${form.getValues().equipamento}`}
          scriptId={generatedScriptId}
          prepareScriptData={prepareScriptData}
        />
      )}
    </div>
  );
};

export default CustomGptForm;
