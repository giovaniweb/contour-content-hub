
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, CopyCheck, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Equipment } from '@/types/equipment';
import { getEquipments } from '@/utils/api-equipment';
import { 
  generateCustomContent, 
  CustomGptType, 
  ConteudoEstrategia 
} from '@/utils/custom-gpt';

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
  }
];

// Schema de validação do formulário
const formSchema = z.object({
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

const CustomGptForm = () => {
  const [loading, setLoading] = useState(false);
  const [equipamentos, setEquipamentos] = useState<Equipment[]>(defaultEquipamentos);
  const [resultado, setResultado] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "roteiro",
      equipamento: "",
      quantidade: 1
    }
  });

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

  // Lidar com o envio do formulário
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setResultado("");

      const response = await generateCustomContent({
        tipo: values.tipo as CustomGptType,
        equipamento: values.equipamento,
        quantidade: values.quantidade,
        tom: values.tom,
        estrategiaConteudo: values.estrategiaConteudo as ConteudoEstrategia
      });

      setResultado(response.content);
      
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: `${values.tipo.charAt(0).toUpperCase() + values.tipo.slice(1)} para ${values.equipamento} criado.`
      });
    } catch (error) {
      console.error("Erro ao gerar conteúdo:", error);
      toast({
        variant: "destructive",
        title: "Erro na geração",
        description: "Não foi possível gerar o conteúdo solicitado."
      });
    } finally {
      setLoading(false);
    }
  };

  // Copiar resultado para a área de transferência
  const handleCopy = () => {
    navigator.clipboard.writeText(resultado);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
            GPT Personalizado - Roteiros e Ideias
          </CardTitle>
          <CardDescription>
            Gere roteiros, big ideas e stories para equipamentos estéticos
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
                  <FormField
                    control={form.control}
                    name="quantidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de roteiros</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={5} 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Máximo 5 roteiros por vez
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tom de linguagem (opcional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: descontraído, técnico, motivacional..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="estrategiaConteudo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estratégia de conteúdo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma estratégia" />
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
                </TabsContent>
                
                <TabsContent value="bigIdea" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="estrategiaConteudo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estratégia de conteúdo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma estratégia" />
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
                </TabsContent>
                
                <TabsContent value="stories" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="quantidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de ideias</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={10} 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Máximo 10 ideias por vez
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tom de linguagem (opcional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: descontraído, técnico, motivacional..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resultado</CardTitle>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-line border">
              {resultado}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomGptForm;
