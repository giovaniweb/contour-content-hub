
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { generateScript, ScriptType, ScriptResponse } from "@/utils/api";
import ScriptCard from "@/components/ScriptCard";
import { useToast } from "@/hooks/use-toast";
import { FileText, Sparkles, MessageSquare, LoaderIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const scriptFormSchema = z.object({
  topic: z.string().min(3, { message: "O tópico deve ter pelo menos 3 caracteres" }),
  additionalInfo: z.string().optional(),
  bodyArea: z.string().optional(),
  purpose: z.string().optional(),
  tone: z.string().default("professional"),
  equipment: z.array(z.string()).optional(),
});

const ScriptGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const initialScriptType = (searchParams.get("type") || "videoScript") as ScriptType;
  
  const [activeTab, setActiveTab] = useState<ScriptType>(initialScriptType);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScripts, setGeneratedScripts] = useState<ScriptResponse[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof scriptFormSchema>>({
    resolver: zodResolver(scriptFormSchema),
    defaultValues: {
      topic: "",
      additionalInfo: "",
      bodyArea: "",
      purpose: "",
      tone: "professional",
      equipment: [],
    },
  });
  
  // Set equipment from user profile if available
  useEffect(() => {
    if (user?.equipment && user.equipment.length > 0) {
      setAvailableEquipment(user.equipment);
      
      // If user has only one equipment, select it automatically
      if (user.equipment.length === 1) {
        form.setValue("equipment", user.equipment);
      }
    }
  }, [user, form]);
  
  const handleGenerateScript = async (values: z.infer<typeof scriptFormSchema>) => {
    try {
      setIsGenerating(true);
      
      const script = await generateScript({
        type: activeTab,
        topic: values.topic,
        equipment: values.equipment || [],
        bodyArea: values.bodyArea,
        purpose: values.purpose,
        additionalInfo: values.additionalInfo,
        tone: values.tone,
        language: user?.language || "PT",
      });
      
      setGeneratedScripts(prev => [script, ...prev]);
      
      toast({
        title: "Script gerado com sucesso",
        description: "Seu novo roteiro está pronto",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha na geração",
        description: "Não foi possível gerar o roteiro",
      });
      console.error("Script generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const getTabIcon = (type: ScriptType) => {
    switch (type) {
      case "videoScript":
        return <FileText className="h-4 w-4 mr-2" />;
      case "bigIdea":
        return <Sparkles className="h-4 w-4 mr-2" />;
      case "dailySales":
        return <MessageSquare className="h-4 w-4 mr-2" />;
    }
  };
  
  const getTabLabel = (type: ScriptType) => {
    switch (type) {
      case "videoScript":
        return "Roteiro para Seu Vídeo";
      case "bigIdea":
        return "Agenda Criativa";
      case "dailySales":
        return "Ideia para seu Stories";
    }
  };
  
  const getTabDescription = (type: ScriptType) => {
    switch (type) {
      case "videoScript":
        return "Crie roteiros detalhados para vídeos educativos sobre tratamentos";
      case "bigIdea":
        return "Desenvolva campanhas estratégicas de conteúdo para sua marca";
      case "dailySales":
        return "Gere histórias persuasivas rápidas para redes sociais";
    }
  };
  
  return (
    <Layout title="Gerador de Roteiros">
      <div className="grid gap-6">
        {/* Script generator form */}
        <Card>
          <CardHeader>
            <CardTitle>Gerar Novo Conteúdo</CardTitle>
            <CardDescription>
              Selecione o tipo de conteúdo e forneça detalhes para criar seu roteiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ScriptType)}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="videoScript" className="flex items-center">
                  {getTabIcon("videoScript")}
                  <span className="hidden sm:inline">Roteiro para Seu Vídeo</span>
                  <span className="sm:hidden">Vídeo</span>
                </TabsTrigger>
                <TabsTrigger value="bigIdea" className="flex items-center">
                  {getTabIcon("bigIdea")}
                  <span className="hidden sm:inline">Agenda Criativa</span>
                  <span className="sm:hidden">Agenda</span>
                </TabsTrigger>
                <TabsTrigger value="dailySales" className="flex items-center">
                  {getTabIcon("dailySales")}
                  <span className="hidden sm:inline">Ideia para seu Stories</span>
                  <span className="sm:hidden">Stories</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    {getTabIcon(activeTab)}
                    {getTabLabel(activeTab)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getTabDescription(activeTab)}
                  </p>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleGenerateScript)} className="space-y-6">
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tópico / Assunto *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="ex: Ultrassom Microfocado" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bodyArea"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Área de tratamento</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="ex: rosto, abdômen, coxas" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="purpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de tratamento</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="ex: flacidez, gordura localizada" 
                                  {...field} 
                                />
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tom" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="professional">Profissional</SelectItem>
                                <SelectItem value="friendly">Descontraído</SelectItem>
                                <SelectItem value="provocative">Provocativo</SelectItem>
                                <SelectItem value="educational">Educativo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {availableEquipment.length > 1 && (
                        <FormField
                          control={form.control}
                          name="equipment"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Equipamentos</FormLabel>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {availableEquipment.map((item) => (
                                  <FormField
                                    key={item}
                                    control={form.control}
                                    name="equipment"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={item}
                                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(item)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value || [], item])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== item
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal cursor-pointer">
                                            {item}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Considerações</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="ex: roteiro para Dia das Mães"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full sm:w-auto"
                      >
                        {isGenerating ? (
                          <>
                            <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            {getTabIcon(activeTab)}
                            Gerar {getTabLabel(activeTab)}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Generated scripts */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {generatedScripts.length === 0
              ? "Seus roteiros gerados aparecerão aqui"
              : "Roteiros Gerados"}
          </h2>
          
          {generatedScripts.length === 0 ? (
            <Card className="bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Nenhum roteiro gerado ainda. Preencha o formulário acima para criar seu primeiro roteiro.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {generatedScripts.map((script) => (
                <ScriptCard
                  key={script.id}
                  script={script}
                  onFeedbackSubmit={() => {
                    toast({
                      title: "Feedback enviado",
                      description: "Obrigado pelo seu feedback"
                    });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ScriptGenerator;
