import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { ScriptRequest, ScriptResponse, generateScript } from "@/utils/api";

const ScriptGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const language = user?.idioma || "pt-BR";

  const [activeTab, setActiveTab] = useState("videoScript");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [script, setScript] = useState<ScriptResponse | null>(null);

  const [formData, setFormData] = useState({
    type: "videoScript" as "videoScript" | "bigIdea" | "dailySales",
    topic: "",
    equipment: [] as string[],
    bodyArea: "",
    purpose: [] as string[],
    additionalInfo: "",
    tone: "professional",
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleMultiSelectChange = useCallback(
    (name: string, value: string[]) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setFormData((prev) => ({
      ...prev,
      type: value as "videoScript" | "bigIdea" | "dailySales",
    }));
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    setScript(null);

    try {
      // Convert string to array if it's not already an array
      const equipmentArray = typeof formData.equipment === 'string' ? 
        [formData.equipment] : formData.equipment || [];

      const scriptRequest: ScriptRequest = {
        type: formData.type,
        topic: formData.topic,
        equipment: equipmentArray, // Ensure this is always an array
        bodyArea: formData.bodyArea,
        purpose: formData.purpose,
        additionalInfo: formData.additionalInfo,
        tone: formData.tone,
        language: language
      };

      const response = await generateScript(scriptRequest);
      setScript(response);
      
      // Log successful generation
      toast({
        title: "Roteiro gerado com sucesso!",
        description: "Seu roteiro foi criado e está pronto para uso.",
      });
    } catch (err) {
      console.error("Error generating script:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao gerar o roteiro. Por favor, tente novamente."
      );
      
      toast({
        variant: "destructive",
        title: "Erro ao gerar roteiro",
        description: err instanceof Error
          ? err.message
          : "Ocorreu um erro ao gerar o roteiro. Por favor, tente novamente.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewScript = useCallback(() => {
    if (script) {
      navigate(`/scripts/${script.id}`);
    }
  }, [navigate, script]);

  return (
    <Layout title="Gerador de Roteiros">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Gerador de Roteiros</h1>
          <p className="text-muted-foreground">
            Crie roteiros personalizados para seus vídeos e conteúdos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Roteiro</CardTitle>
                <CardDescription>
                  Escolha o tipo de conteúdo que deseja criar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="videoScript"
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="videoScript">Vídeo</TabsTrigger>
                    <TabsTrigger value="bigIdea">Big Idea</TabsTrigger>
                    <TabsTrigger value="dailySales">Vendas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="videoScript">
                    <p className="text-sm text-muted-foreground mb-4">
                      Crie um roteiro detalhado para um vídeo educativo ou
                      demonstrativo sobre tratamentos estéticos.
                    </p>
                  </TabsContent>

                  <TabsContent value="bigIdea">
                    <p className="text-sm text-muted-foreground mb-4">
                      Desenvolva uma estratégia de conteúdo completa para uma
                      campanha de marketing de longo prazo.
                    </p>
                  </TabsContent>

                  <TabsContent value="dailySales">
                    <p className="text-sm text-muted-foreground mb-4">
                      Crie uma mensagem persuasiva para promover um tratamento ou
                      serviço específico com chamada para ação.
                    </p>
                  </TabsContent>
                </Tabs>

                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Tópico Principal</Label>
                    <Input
                      id="topic"
                      name="topic"
                      placeholder="Ex: Tratamento para flacidez facial"
                      value={formData.topic}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipamento</Label>
                    <Select
                      value={Array.isArray(formData.equipment) && formData.equipment.length > 0 ? formData.equipment[0] : ""}
                      onValueChange={(value) => handleMultiSelectChange("equipment", [value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um equipamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Adélla Laser">Adélla Laser</SelectItem>
                        <SelectItem value="Enygma X-Orbital">Enygma X-Orbital</SelectItem>
                        <SelectItem value="Focuskin">Focuskin</SelectItem>
                        <SelectItem value="Hipro">Hipro</SelectItem>
                        <SelectItem value="Hive Pro">Hive Pro</SelectItem>
                        <SelectItem value="Laser Crystal 3D Plus">Laser Crystal 3D Plus</SelectItem>
                        <SelectItem value="MultiShape">MultiShape</SelectItem>
                        <SelectItem value="Reverso">Reverso</SelectItem>
                        <SelectItem value="Supreme Pro">Supreme Pro</SelectItem>
                        <SelectItem value="Ultralift - Endolaser">Ultralift - Endolaser</SelectItem>
                        <SelectItem value="Unyque PRO">Unyque PRO</SelectItem>
                        <SelectItem value="X-Tonus">X-Tonus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyArea">Área do Corpo</Label>
                    <Select
                      value={formData.bodyArea}
                      onValueChange={(value) => handleSelectChange("bodyArea", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Face">Face</SelectItem>
                        <SelectItem value="Pescoço">Pescoço</SelectItem>
                        <SelectItem value="Abdômen">Abdômen</SelectItem>
                        <SelectItem value="Coxas">Coxas</SelectItem>
                        <SelectItem value="Glúteos">Glúteos</SelectItem>
                        <SelectItem value="Braços">Braços</SelectItem>
                        <SelectItem value="Corpo todo">Corpo todo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Finalidade</Label>
                    <Select
                      value={Array.isArray(formData.purpose) && formData.purpose.length > 0 ? formData.purpose[0] : ""}
                      onValueChange={(value) => handleMultiSelectChange("purpose", [value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma finalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rugas">Rugas</SelectItem>
                        <SelectItem value="Emagrecimento">Emagrecimento</SelectItem>
                        <SelectItem value="Tonificação">Tonificação</SelectItem>
                        <SelectItem value="Hidratação">Hidratação</SelectItem>
                        <SelectItem value="Flacidez">Flacidez</SelectItem>
                        <SelectItem value="Gordura localizada">Gordura localizada</SelectItem>
                        <SelectItem value="Lipedema">Lipedema</SelectItem>
                        <SelectItem value="Sarcopenia">Sarcopenia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Informações Adicionais</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Detalhes específicos que você gostaria de incluir no roteiro"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Tom da Comunicação</Label>
                    <Select
                      value={formData.tone}
                      onValueChange={(value) => handleSelectChange("tone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tom" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="friendly">Amigável</SelectItem>
                        <SelectItem value="authoritative">Autoritativo</SelectItem>
                        <SelectItem value="educational">Educativo</SelectItem>
                        <SelectItem value="persuasive">Persuasivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleGenerate}
                  className="w-full"
                  disabled={isGenerating || !formData.topic}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Gerar Roteiro"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
                <CardDescription>
                  Seu roteiro personalizado aparecerá aqui
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p className="text-muted-foreground">
                      Gerando seu roteiro personalizado...
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Isso pode levar alguns segundos
                    </p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-destructive mb-2">Erro ao gerar roteiro</p>
                    <p className="text-sm text-muted-foreground text-center">
                      {error}
                    </p>
                  </div>
                ) : script ? (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">{script.title}</h2>
                    <div className="whitespace-pre-wrap text-sm">
                      {script.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-muted-foreground">
                      Preencha os campos ao lado e clique em "Gerar Roteiro"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Quanto mais detalhes você fornecer, melhor será o resultado
                    </p>
                  </div>
                )}
              </CardContent>
              {script && (
                <CardFooter>
                  <Button onClick={handleViewScript} className="w-full">
                    Ver Roteiro Completo
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScriptGenerator;
