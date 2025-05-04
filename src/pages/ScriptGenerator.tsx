
import React, { useState } from 'react';
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useToast } from "@/hooks/use-toast";
import { useEquipments } from "@/hooks/useEquipments";
import { FileText, Sparkles, MessageSquare, Loader2 } from "lucide-react";
import { ScriptResponse, MarketingObjectiveType } from "@/types/script";
import ScriptEditor from "@/components/script-generator/ScriptEditor";

const ScriptGenerator: React.FC = () => {
  const { toast } = useToast();
  const { equipments } = useEquipments();
  const [activeTab, setActiveTab] = useState<string>("videoScript");
  const [topic, setTopic] = useState<string>("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [bodyArea, setBodyArea] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [marketingObjective, setMarketingObjective] = useState<MarketingObjectiveType | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedScript, setGeneratedScript] = useState<ScriptResponse | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setGeneratedScript(null);
  };

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic) {
      toast({
        title: "Tópico obrigatório",
        description: "Por favor, informe um tópico para o script",
        variant: "destructive"
      });
      return;
    }

    if (!marketingObjective) {
      toast({
        title: "Objetivo de marketing obrigatório",
        description: "Por favor, selecione um objetivo de marketing",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulating API call to generate script
      const equipmentName = equipments.find(e => e.id === selectedEquipment)?.nome || "";
      
      setTimeout(() => {
        const mockResponse: ScriptResponse = {
          id: `script-${Date.now()}`,
          title: topic,
          content: `# ${topic}\n\n## Introdução\nEste é um ${activeTab === 'videoScript' ? 'roteiro de vídeo' : activeTab === 'bigIdea' ? 'big idea' : 'script de vendas diárias'} sobre ${topic}${equipmentName ? ` usando ${equipmentName}` : ''}${bodyArea ? ` para a área do corpo: ${bodyArea}` : ''}.\n\n## Objetivo: ${marketingObjective}\n\n## Conteúdo Principal\n${additionalInfo ? `Considerando: ${additionalInfo}\n\n` : ''}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel diam at nunc finibus tempor. Sed euismod, velit at congue tincidunt, nisl nunc aliquet nisl, nec tincidunt nisl velit at magna.\n\n## Conclusão\nChame para ação específica com foco no objetivo: ${marketingObjective}`,
          type: activeTab as 'videoScript' | 'bigIdea' | 'dailySales',
          createdAt: new Date().toISOString(),
          suggestedVideos: [],
          captionTips: [],
          equipment: selectedEquipment,
          marketingObjective: marketingObjective
        };
        
        setGeneratedScript(mockResponse);
        setIsGenerating(false);
        
        toast({
          title: "Script gerado com sucesso",
          description: `Seu ${activeTab === 'videoScript' ? 'roteiro de vídeo' : activeTab === 'bigIdea' ? 'big idea' : 'script de vendas diárias'} foi criado.`,
        });
      }, 2000);

    } catch (error) {
      console.error("Error generating script:", error);
      toast({
        title: "Erro ao gerar script",
        description: "Não foi possível gerar o script. Tente novamente.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setTopic("");
    setSelectedEquipment("");
    setBodyArea("");
    setAdditionalInfo("");
    setMarketingObjective(undefined);
    setGeneratedScript(null);
  };

  const renderTabIcon = (type: string) => {
    switch (type) {
      case 'videoScript':
        return <FileText className="h-5 w-5 mr-2" />;
      case 'bigIdea':
        return <Sparkles className="h-5 w-5 mr-2" />;
      case 'dailySales':
        return <MessageSquare className="h-5 w-5 mr-2" />;
      default:
        return null;
    }
  };

  const getTabTitle = (type: string) => {
    switch (type) {
      case 'videoScript':
        return "Roteiro para Vídeo";
      case 'bigIdea':
        return "Big Idea";
      case 'dailySales':
        return "Vendas Diárias";
      default:
        return type;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-2">Gerar Novo Script</h1>
        <p className="text-muted-foreground mb-8">Selecione o tipo de conteúdo e forneça detalhes para criar seu script</p>

        {!generatedScript ? (
          <>
            {/* Content Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className={`cursor-pointer transition-all hover:shadow-md ${activeTab === 'videoScript' ? 'border-primary' : ''}`}
                onClick={() => handleTabChange('videoScript')}>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-medium">Roteiro para Vídeo</h3>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-all hover:shadow-md ${activeTab === 'bigIdea' ? 'border-primary' : ''}`}
                onClick={() => handleTabChange('bigIdea')}>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-medium">Big Idea</h3>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-all hover:shadow-md ${activeTab === 'dailySales' ? 'border-primary' : ''}`}
                onClick={() => handleTabChange('dailySales')}>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-medium">Vendas Diárias</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold mb-2">
                  {renderTabIcon(activeTab)}
                </div>
                <div className="border-l-2 border-primary h-full"></div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">{getTabTitle(activeTab)}</h2>
                <p className="text-muted-foreground mb-6">
                  {activeTab === 'videoScript' 
                    ? 'Crie roteiros detalhados para vídeos educativos sobre tratamentos' 
                    : activeTab === 'bigIdea' 
                      ? 'Desenvolva conceitos criativos poderosos para suas campanhas'
                      : 'Crie textos persuasivos para stories e posts de vendas'}
                </p>

                <form onSubmit={handleGenerateScript} className="space-y-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="marketingObjective">Objetivo de Marketing*</Label>
                    <Select
                      value={marketingObjective}
                      onValueChange={(value) => setMarketingObjective(value as MarketingObjectiveType)}
                    >
                      <SelectTrigger id="marketingObjective">
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

                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipamento (opcional)</Label>
                    <Select
                      value={selectedEquipment}
                      onValueChange={setSelectedEquipment}
                    >
                      <SelectTrigger id="equipment">
                        <SelectValue placeholder="Selecione um equipamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipments.map((equipment) => (
                          <SelectItem key={equipment.id} value={equipment.id}>
                            {equipment.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyArea">Área do Corpo (opcional)</Label>
                    <Input
                      id="bodyArea"
                      placeholder="Ex: Rosto, abdômen, pernas..."
                      value={bodyArea}
                      onChange={(e) => setBodyArea(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Informações Adicionais (opcional)</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Inclua detalhes específicos, pontos-chave que deseja abordar..."
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={isGenerating || !topic || !marketingObjective} className="w-full">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        Gerar {getTabTitle(activeTab)}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{generatedScript.title}</h2>
              <Button variant="outline" onClick={resetForm}>Criar Novo Script</Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <ScriptEditor 
                  content={generatedScript.content} 
                  onChange={() => {}} 
                  readOnly={true}
                />
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button>Salvar Script</Button>
              <Button variant="outline">Copiar Conteúdo</Button>
              <Button variant="outline">Validar com IA</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScriptGenerator;
