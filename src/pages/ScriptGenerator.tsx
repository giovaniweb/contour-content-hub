import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateScript, saveScriptFeedback, ScriptRequest, ScriptType, MarketingObjectiveType } from "@/utils/api";
import ScriptCard from "@/components/ScriptCard";
import ScriptForm from "@/components/script-generator/ScriptForm";

const ScriptGenerator: React.FC = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [scriptType, setScriptType] = useState<ScriptType>("videoScript");
  const [topic, setTopic] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [bodyArea, setBodyArea] = useState("");
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("professional");
  const [marketingObjective, setMarketingObjective] = useState<MarketingObjectiveType | undefined>(undefined);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<any | null>(null);
  
  // Parse query parameters to pre-fill form from calendar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    const topicParam = params.get('topic');
    
    if (typeParam && ['videoScript', 'bigIdea', 'dailySales'].includes(typeParam)) {
      setScriptType(typeParam as ScriptType);
    }
    
    if (topicParam) {
      setTopic(decodeURIComponent(topicParam));
    }
    
    const equipmentParam = params.get('equipment');
    if (equipmentParam) {
      // Find if equipment exists in our options
      setSelectedEquipment([decodeURIComponent(equipmentParam)]);
    }
    
    const purposeParam = params.get('purpose');
    if (purposeParam) {
      let mappedPurpose;
      
      if (purposeParam === 'educate') {
        mappedPurpose = "Rugas";
      } else if (purposeParam === 'engage') {
        mappedPurpose = "Flacidez";
      } else if (purposeParam === 'sell') {
        mappedPurpose = "Lipedema";
      }
      
      if (mappedPurpose) {
        setSelectedPurposes([mappedPurpose]);
      }
    }
  }, [location]);
  
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
    
    if (!marketingObjective) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um objetivo de marketing",
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
        marketingObjective: marketingObjective
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
  
  // Handle script rejection
  const handleScriptReject = async (scriptId: string) => {
    try {
      await saveScriptFeedback(scriptId, "Roteiro precisa ser refeito", false);
      
      toast({
        title: "Roteiro marcado para ser refeito",
        description: "O roteiro foi rejeitado e voltará para edição",
      });
      
      // Reset the generated script to start over
      setGeneratedScript(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar a ação",
      });
    }
  };
  
  // Reset form
  const resetForm = () => {
    setScriptType("videoScript");
    setTopic("");
    setSelectedEquipment([]);
    setBodyArea("");
    setSelectedPurposes([]);
    setAdditionalInfo("");
    setTone("professional");
    setMarketingObjective(undefined);
    setGeneratedScript(null);
    
    // Clear URL parameters
    navigate("/script-generator");
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
              <ScriptForm
                scriptType={scriptType}
                topic={topic}
                setTopic={setTopic}
                selectedEquipment={selectedEquipment}
                setSelectedEquipment={setSelectedEquipment}
                bodyArea={bodyArea}
                setBodyArea={setBodyArea}
                selectedPurposes={selectedPurposes}
                setSelectedPurposes={setSelectedPurposes}
                additionalInfo={additionalInfo}
                setAdditionalInfo={setAdditionalInfo}
                tone={tone}
                setTone={setTone}
                marketingObjective={marketingObjective}
                setMarketingObjective={setMarketingObjective}
                isGenerating={isGenerating}
                handleGenerateScript={handleGenerateScript}
                resetForm={resetForm}
                generatedScript={generatedScript}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {generatedScript ? (
            <ScriptCard 
              script={generatedScript}
              onFeedbackSubmit={handleScriptFeedback}
              onReject={handleScriptReject}
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
