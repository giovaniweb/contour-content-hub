
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScriptResponse } from "@/types/script";
import { FileText } from "lucide-react";

import ScriptCardHeader from "@/components/script/ScriptCardHeader";
import ScriptContent from "@/components/script/ScriptContent";
import ScriptSuggestedVideos from "@/components/script/ScriptSuggestedVideos";
import ScriptCaptionTips from "@/components/script/ScriptCaptionTips";
import ScriptActionButtons from "@/components/script/ScriptActionButtons";
import ScriptValidationScores from "@/components/script/ScriptValidationScores";
import StructuredScriptValidation from "@/components/script-generator/StructuredScriptValidation";

interface ScriptCardProps {
  script: ScriptResponse;
  onApprove?: () => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  mentor?: {
    nome: string;
    estilo: string;
    tom: string;
    exemplos: string[];
  };
  objective?: string;
  contentType?: string;
  theme?: string;
  style?: string;
  channel?: string;
  onGenerateImage?: (prompt: string) => void;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ 
  script,
  onApprove,
  onReject,
  mentor,
  objective,
  contentType,
  theme,
  style,
  channel,
  onGenerateImage
}) => {
  const [activeTab, setActiveTab] = useState("conteudo");
  const [showVideos, setShowVideos] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);

  // Generate mock validation scores for demonstration
  // In a real implementation, these should come from the API
  const mockValidationScores = {
    hookScore: 7.8,
    clarityScore: 8.2,
    ctaScore: 6.9,
    emotionalScore: 7.5,
    totalScore: 7.6
  };

  const mockSuggestions = [
    "Fortaleça o gancho inicial com uma estatística ou pergunta que desperte curiosidade.",
    "Adicione mais detalhes sobre os resultados específicos que o cliente pode esperar.",
    "Inclua um chamado à ação mais claro e urgente no final do roteiro."
  ];

  return (
    <Card className="w-full">
      <ScriptCardHeader script={script} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-2 w-full">
          <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
          <TabsTrigger value="sugestoes" disabled={script.suggestedVideos.length === 0}>
            Sugestões de Vídeos
          </TabsTrigger>
          <TabsTrigger value="validacao">
            Validação IA
          </TabsTrigger>
          <TabsTrigger value="validacao-estruturada">
            Val. Estruturada
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[400px] w-full rounded-md border p-0">
          <ScriptContent content={script.content} />
          <ScriptSuggestedVideos videos={script.suggestedVideos} />
          
          <TabsContent value="validacao" className="mt-0 p-0">
            <ScriptValidationScores 
              scores={mockValidationScores} 
              suggestions={mockSuggestions} 
            />
          </TabsContent>

          <TabsContent value="validacao-estruturada" className="mt-0 p-4">
            <StructuredScriptValidation
              script={script.content}
              objective={objective || script.objective || script.marketingObjective}
              mentor={mentor}
              contentType={contentType}
              theme={theme}
              style={style}
              channel={channel}
              onGenerateImage={onGenerateImage}
              onValidationComplete={(result) => {
                console.log("Validação estruturada concluída:", result);
              }}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
      
      <CardFooter className="flex justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          <FileText className="inline-block mr-1 h-4 w-4" /> 
          {new Date(script.createdAt).toLocaleDateString('pt-BR')}
        </div>
        
        <ScriptActionButtons 
          script={script}
          onApprove={onApprove}
          onReject={onReject}
        />
      </CardFooter>
      
      <Dialog open={showFullScreen} onOpenChange={setShowFullScreen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {script.title || `Conteúdo para ${script.equipment || 'Equipamento'}`}
            </DialogTitle>
            <DialogDescription>
              Visualize e avalie seu roteiro em tela completa
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Tabs defaultValue="conteudo" className="w-full">
              <TabsList className="grid grid-cols-4 mb-2 w-full">
                <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                <TabsTrigger value="sugestoes" disabled={script.suggestedVideos.length === 0}>
                  Sugestões de Vídeos
                </TabsTrigger>
                <TabsTrigger value="validacao">
                  Validação
                </TabsTrigger>
                <TabsTrigger value="validacao-estruturada">
                  Val. Estruturada
                </TabsTrigger>
              </TabsList>
              
              <div className="p-0 border rounded-md">
                <ScriptContent content={script.content} />
                <ScriptSuggestedVideos videos={script.suggestedVideos} />
                
                <TabsContent value="validacao" className="mt-0 p-0">
                  <ScriptValidationScores 
                    scores={mockValidationScores} 
                    suggestions={mockSuggestions} 
                  />
                </TabsContent>

                <TabsContent value="validacao-estruturada" className="mt-0 p-4">
                  <StructuredScriptValidation
                    script={script.content}
                    objective={objective || script.objective || script.marketingObjective}
                    mentor={mentor}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ScriptCard;
