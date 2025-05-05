import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Wand, PlayCircle, FileText, Sparkles, MessageSquare } from 'lucide-react';
import { useEquipments } from "@/hooks/useEquipments";
import { CustomGptType, CustomGptRequest, CustomGptResult, generateCustomContent } from "@/utils/custom-gpt";
import { ScriptResponse, MarketingObjectiveType } from '@/types/script';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "O tópico deve ter pelo menos 2 caracteres.",
  }).optional(),
  tone: z.string().optional(),
  quantity: z.string().optional(),
  additionalInfo: z.string().optional(),
  resetAfterSubmit: z.boolean().default(false),
  marketingObjective: z.string().optional(),
  bodyArea: z.string().optional(),
  purposes: z.array(z.string()).optional(),
});

export interface CustomGptFormProps {
  onResults?: (results: CustomGptResult[]) => void;
  onScriptGenerated?: (script: ScriptResponse) => void;
  initialData?: any;
  mode?: string;
}

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "",
      quantity: "1",
      additionalInfo: "",
      resetAfterSubmit: false,
      marketingObjective: "🟡 Atrair Atenção",
      bodyArea: "",
      purposes: [],
    },
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

  const getTypeName = (type: CustomGptType) => {
    switch (type) {
      case "roteiro":
        return "Roteiro";
      case "bigIdea":
        return "Big Idea";
      case "stories":
        return "Stories";
      default:
        return "Conteúdo";
    }
  };

  const resetFormFields = () => {
    form.reset();
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
      setIsSubmitting(true);
      
      // Cria a requisição para a API
      const request: CustomGptRequest = {
        tipo: selectedType,
        equipamento: selectedEquipment || '',
        quantidade: parseInt(form.getValues().quantity || "1") || 1,
        tom: form.getValues().tone,
        estrategiaConteudo: selectedObjective as MarketingObjectiveType,
        topic: form.getValues().topic || `Conteúdo sobre ${equipments.find(eq => eq.id === selectedEquipment)?.nome || 'equipamento'}`,
        bodyArea: form.getValues().bodyArea,
        purposes: form.getValues().purposes || [],
        additionalInfo: form.getValues().additionalInfo,
        marketingObjective: selectedObjective as MarketingObjectiveType
      };
      
      // Faz a chamada para o custom GPT
      const content = await generateCustomContent(request);
      
      // Simula um ID gerado para a resposta
      const responseId = `gen-${Date.now()}`;
      
      // Create script response object if needed
      if (onScriptGenerated) {
        const scriptResponse: ScriptResponse = {
          id: responseId,
          title: request.topic || 'Conteúdo gerado',
          content: content,
          type: selectedType === 'roteiro' ? 'videoScript' : 
                selectedType === 'bigIdea' ? 'bigIdea' : 'dailySales',
          createdAt: new Date().toISOString(),
          suggestedVideos: [],
          captionTips: [],
          equipment: selectedEquipment,
          marketingObjective: request.marketingObjective,
        };
        
        onScriptGenerated(scriptResponse);
      }
      
      // Adiciona o resultado à lista de resultados
      if (onResults) {
        setResults(prev => [
          {
            id: responseId,
            content: content
          },
          ...prev
        ]);
      }
      
      // Reset do formulário
      if (form.getValues().resetAfterSubmit) {
        resetFormFields();
      }
      
      toast({
        title: "Conteúdo gerado com sucesso",
        description: `O ${getTypeName(selectedType)} foi criado e está disponível para uso.`,
      });
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar conteúdo",
        description: "Ocorreu um erro ao tentar gerar o conteúdo personalizado."
      });
    } finally {
      setIsSubmitting(false);
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
    
    try {
      setIsSubmitting(true);
      
      // Cria a requisição simplificada para a API
      const request: CustomGptRequest = {
        tipo: type,
        equipamento: selectedEquipment,
        quantidade: 1,
        estrategiaConteudo: selectedObjective as MarketingObjectiveType,
        topic: `${getTypeName(type)} sobre ${equipments.find(eq => eq.id === selectedEquipment)?.nome || 'equipamento'}`,
        marketingObjective: selectedObjective as MarketingObjectiveType
      };
      
      // Faz a chamada para o custom GPT
      const content = await generateCustomContent(request);
      
      // Simula um ID gerado para a resposta
      const responseId = `gen-${Date.now()}`;
      
      // Adiciona o resultado à lista de resultados
      setResults(prev => [
        {
          id: responseId,
          content: content
        },
        ...prev
      ]);
      
      toast({
        title: "Conteúdo gerado com sucesso",
        description: `O ${getTypeName(type)} foi criado e está disponível para uso.`,
      });
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar conteúdo",
        description: "Ocorreu um erro ao tentar gerar o conteúdo personalizado."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSimpleMode = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="equipment">Equipamento</Label>
            <Select 
              value={selectedEquipment} 
              onValueChange={setSelectedEquipment}
              disabled={isSubmitting}
            >
              <SelectTrigger id="equipment" className="w-full">
                <SelectValue placeholder="Selecione o equipamento" />
              </SelectTrigger>
              <SelectContent>
                {equipmentsLoading ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </SelectItem>
                ) : (
                  equipments.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Selecione o equipamento para o qual deseja gerar conteúdo
            </p>
          </div>

          <div>
            <Label htmlFor="objective">Objetivo de Marketing</Label>
            <Select 
              value={selectedObjective} 
              onValueChange={(value) => setSelectedObjective(value as MarketingObjectiveType)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="objective">
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="🟡 Atrair Atenção">🟡 Atrair Atenção</SelectItem>
                <SelectItem value="🟢 Criar Conexão">🟢 Criar Conexão</SelectItem>
                <SelectItem value="🔴 Fazer Comprar">🔴 Fazer Comprar</SelectItem>
                <SelectItem value="🔁 Reativar Interesse">🔁 Reativar Interesse</SelectItem>
                <SelectItem value="✅ Fechar Agora">✅ Fechar Agora</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Selecione o objetivo de marketing para o seu conteúdo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="py-8 flex flex-col items-center justify-center gap-2 h-auto"
            onClick={() => handleQuickGenerate("roteiro")}
            disabled={isSubmitting || !selectedEquipment}
          >
            <FileText className="h-6 w-6" />
            <span className="font-semibold">Gerar Roteiro</span>
          </Button>

          <Button 
            variant="outline" 
            className="py-8 flex flex-col items-center justify-center gap-2 h-auto"
            onClick={() => handleQuickGenerate("bigIdea")}
            disabled={isSubmitting || !selectedEquipment}
          >
            <Sparkles className="h-6 w-6" />
            <span className="font-semibold">Gerar Big Idea</span>
          </Button>

          <Button 
            variant="outline" 
            className="py-8 flex flex-col items-center justify-center gap-2 h-auto"
            onClick={() => handleQuickGenerate("stories")}
            disabled={isSubmitting || !selectedEquipment}
          >
            <MessageSquare className="h-6 w-6" />
            <span className="font-semibold">Gerar Stories</span>
          </Button>
        </div>

        {results.length > 0 && (
          <div className="mt-6 border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Conteúdo Gerado</h3>
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
              {results[0].content}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(results[0].content);
                  toast({
                    title: "Conteúdo copiado",
                    description: "O conteúdo foi copiado para a área de transferência.",
                  });
                }}
              >
                Copiar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setResults([])}
              >
                Limpar
              </Button>
            </div>
          </div>
        )}
        
        <div className="border-t pt-4">
          <Button 
            variant="link" 
            size="sm" 
            className="px-0 text-xs"
            onClick={() => setShowAdvancedFields(!showAdvancedFields)}
          >
            {showAdvancedFields ? "Ocultar opções avançadas" : "Mostrar opções avançadas"}
          </Button>
        </div>
      </div>
    );
  };

  const renderAdvancedFields = () => {
    if (!showAdvancedFields) return null;
    
    return (
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo de Conteúdo</Label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as CustomGptType)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roteiro">Roteiro para Vídeo</SelectItem>
                  <SelectItem value="bigIdea">Big Idea</SelectItem>
                  <SelectItem value="stories">Stories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tópico</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Dicas de skincare" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tom de voz</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Entusiasmado, informativo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bodyArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área do Corpo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Rosto, corpo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informações adicionais</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Mencionar a importância da proteção solar"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purposes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finalidades</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const currentValues = Array.isArray(field.value) ? field.value : [];
                      if (!currentValues.includes(value)) {
                        field.onChange([...currentValues, value]);
                      }
                    }}
                    value=""
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione as finalidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rugas">Rugas</SelectItem>
                      <SelectItem value="flacidez">Flacidez</SelectItem>
                      <SelectItem value="manchas">Manchas</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                {Array.isArray(field.value) && field.value.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {field.value.map((item) => (
                      <div key={item} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center">
                        {item}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            field.onChange(field.value.filter(i => i !== item));
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resetAfterSubmit"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Limpar após gerar</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Limpa os campos após o conteúdo ser gerado
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Wand className="mr-2 h-4 w-4" />
                Gerar Conteúdo Personalizado
              </>
            )}
          </Button>
        </form>
      </Form>
    );
  };

  return (
    <div>
      {mode === 'simple' ? (
        <>
          {renderSimpleMode()}
          {renderAdvancedFields()}
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Tipo de Conteúdo</Label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as CustomGptType)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roteiro">Roteiro para Vídeo</SelectItem>
                  <SelectItem value="bigIdea">Big Idea</SelectItem>
                  <SelectItem value="stories">Stories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="equipment">Equipamento</Label>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger id="equipment">
                  <SelectValue placeholder="Selecione o equipamento" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentsLoading ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando...
                    </SelectItem>
                  ) : (
                    equipments.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tópico</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Dicas de skincare" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tom de voz</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Entusiasmado, informativo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informações adicionais</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Mencionar a importância da proteção solar"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingObjective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo de Marketing</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o objetivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="🟡 Atrair Atenção">🟡 Atrair Atenção</SelectItem>
                      <SelectItem value="🟢 Criar Conexão">🟢 Criar Conexão</SelectItem>
                      <SelectItem value="🔴 Fazer Comprar">🔴 Fazer Comprar</SelectItem>
                      <SelectItem value="🔁 Reativar Interesse">🔁 Reativar Interesse</SelectItem>
                      <SelectItem value="✅ Fechar Agora">✅ Fechar Agora</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bodyArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área do Corpo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rosto, corpo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purposes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finalidades</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        const currentValues = Array.isArray(field.value) ? field.value : [];
                        if (!currentValues.includes(value)) {
                          field.onChange([...currentValues, value]);
                        }
                      }}
                      value=""
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione as finalidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rugas">Rugas</SelectItem>
                        <SelectItem value="flacidez">Flacidez</SelectItem>
                        <SelectItem value="manchas">Manchas</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {Array.isArray(field.value) && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {field.value.map((item) => (
                        <div key={item} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center">
                          {item}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => {
                              field.onChange(field.value.filter(i => i !== item));
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resetAfterSubmit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Limpar após gerar</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Limpa os campos após o conteúdo ser gerado
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Gerar Conteúdo
                </>
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CustomGptForm;
