
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { generateScript, saveScriptFeedback, ScriptRequest, ScriptType } from "@/utils/api";
import ScriptCard from "@/components/ScriptCard";

// List of equipment options
const equipmentOptions = [
  { id: "adella", label: "Adélla Laser" },
  { id: "enygma", label: "Enygma X-Orbital" },
  { id: "focuskin", label: "Focuskin" },
  { id: "hipro", label: "Hipro" },
  { id: "hive", label: "Hive Pro" },
  { id: "crystal", label: "Laser Crystal 3D Plus" },
  { id: "multi", label: "MultiShape" },
  { id: "reverso", label: "Reverso" },
  { id: "supreme", label: "Supreme Pro" },
  { id: "ultralift", label: "Ultralift - Endolaser" },
  { id: "unyque", label: "Unyque PRO" },
  { id: "xtonus", label: "X-Tonus" },
];

// Areas of the body
const bodyAreas = [
  { value: "face", label: "Face" },
  { value: "pescoco", label: "Pescoço" },
  { value: "abdomen", label: "Abdômen" },
  { value: "coxas", label: "Coxas" },
  { value: "gluteos", label: "Glúteos" },
  { value: "bracos", label: "Braços" },
  { value: "corpotodo", label: "Corpo todo" },
];

// Treatment purposes
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

const ScriptGenerator: React.FC = () => {
  const { toast } = useToast();
  const [scriptType, setScriptType] = useState<ScriptType>("videoScript");
  const [topic, setTopic] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [bodyArea, setBodyArea] = useState("");
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("professional");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<any | null>(null);
  
  // Handle checkbox change for equipment
  const handleEquipmentChange = (value: string) => {
    setSelectedEquipment(
      selectedEquipment.includes(value)
        ? selectedEquipment.filter((item) => item !== value)
        : [...selectedEquipment, value]
    );
  };
  
  // Handle checkbox change for purposes
  const handlePurposeChange = (value: string) => {
    setSelectedPurposes(
      selectedPurposes.includes(value)
        ? selectedPurposes.filter((item) => item !== value)
        : [...selectedPurposes, value]
    );
  };
  
  // Handle script generation
  const handleGenerateScript = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!topic.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha o tema do roteiro",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const request: ScriptRequest = {
        type: scriptType,
        topic,
        equipment: selectedEquipment.length > 0 ? selectedEquipment : undefined,
        bodyArea: bodyArea || undefined,
        purpose: selectedPurposes.length > 0 ? selectedPurposes : undefined,
        additionalInfo: additionalInfo || undefined,
        tone: tone || undefined,
        language: "pt",
      };
      
      const result = await generateScript(request);
      setGeneratedScript(result);
      
      toast({
        title: "Roteiro gerado",
        description: "Seu roteiro foi criado com sucesso!",
      });
    } catch (error) {
      console.error("Error generating script:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao gerar roteiro",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle script feedback
  const handleScriptFeedback = async (scriptId: string, feedback: string, approved: boolean) => {
    try {
      await saveScriptFeedback(scriptId, feedback, approved);
      
      toast({
        title: approved ? "Roteiro aprovado" : "Roteiro editado",
        description: approved
          ? "O roteiro foi aprovado e salvo"
          : "Suas observações foram salvas para melhorias futuras",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o feedback",
      });
    }
  };
  
  const resetForm = () => {
    setScriptType("videoScript");
    setTopic("");
    setSelectedEquipment([]);
    setBodyArea("");
    setSelectedPurposes([]);
    setAdditionalInfo("");
    setTone("professional");
    setGeneratedScript(null);
  };
  
  return (
    <Layout title="Gerador de Roteiros">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Roteiro</CardTitle>
              <CardDescription>
                Personalize seu roteiro para gerar conteúdo específico para seus tratamentos e equipamentos
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleGenerateScript} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scriptType">Tipo de Roteiro</Label>
                  <Tabs
                    value={scriptType}
                    onValueChange={(value) => setScriptType(value as ScriptType)}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="videoScript">Vídeo</TabsTrigger>
                      <TabsTrigger value="bigIdea">Campanha</TabsTrigger>
                      <TabsTrigger value="dailySales">Vendas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="videoScript">
                      Roteiro para vídeos educativos de tratamentos
                    </TabsContent>
                    <TabsContent value="bigIdea">
                      Campanha de marketing para mídia social
                    </TabsContent>
                    <TabsContent value="dailySales">
                      Textos curtos para promoções e vendas
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Tema/Assunto Principal*</Label>
                  <Input
                    id="topic"
                    placeholder="Ex: Tratamento para flacidez facial"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="equipment">
                    <AccordionTrigger>Equipamentos</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {equipmentOptions.map((equipment) => (
                          <div key={equipment.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`equipment-${equipment.id}`}
                              checked={selectedEquipment.includes(equipment.label)}
                              onCheckedChange={() => handleEquipmentChange(equipment.label)}
                            />
                            <Label
                              htmlFor={`equipment-${equipment.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {equipment.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="bodyArea">
                    <AccordionTrigger>Área do Corpo</AccordionTrigger>
                    <AccordionContent>
                      <Select value={bodyArea} onValueChange={setBodyArea}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma área" />
                        </SelectTrigger>
                        <SelectContent>
                          {bodyAreas.map((area) => (
                            <SelectItem key={area.value} value={area.label}>
                              {area.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="purpose">
                    <AccordionTrigger>Finalidade do Tratamento</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {purposes.map((purpose) => (
                          <div key={purpose.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`purpose-${purpose.value}`}
                              checked={selectedPurposes.includes(purpose.label)}
                              onCheckedChange={() => handlePurposeChange(purpose.label)}
                            />
                            <Label
                              htmlFor={`purpose-${purpose.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {purpose.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="additionalInfo">
                    <AccordionTrigger>Informações Adicionais</AccordionTrigger>
                    <AccordionContent>
                      <Textarea
                        id="additionalInfo"
                        placeholder="Detalhes específicos, pontos-chave, públicos especiais, etc."
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        rows={4}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="tone">
                    <AccordionTrigger>Tom da Comunicação</AccordionTrigger>
                    <AccordionContent>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tom" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Profissional</SelectItem>
                          <SelectItem value="friendly">Amigável</SelectItem>
                          <SelectItem value="authoritative">Autoridade</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="excited">Animado</SelectItem>
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? "Gerando..." : "Gerar Roteiro"}
                  </Button>
                  {generatedScript && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Novo Roteiro
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {generatedScript ? (
            <ScriptCard 
              script={generatedScript}
              onFeedback={handleScriptFeedback}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="py-10 text-center text-muted-foreground">
                <p>Preencha o formulário e clique em "Gerar Roteiro" para criar seu conteúdo personalizado.</p>
                <p className="mt-2">
                  <Badge variant="outline">Dica</Badge> Quanto mais detalhes você fornecer, mais personalizado será o resultado.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ScriptGenerator;
