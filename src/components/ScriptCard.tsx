
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScriptResponse } from "@/utils/api";
import { Loader2, ThumbsUp, ThumbsDown, Download, FileText, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CalendarDialog from "@/components/script/CalendarDialog";
import { Badge } from "@/components/ui/badge";

interface ScriptCardProps {
  script: ScriptResponse;
  onApprove?: () => Promise<void>;
  onReject?: (id: string) => Promise<void>;
}

interface ScriptActionButtonsProps {
  script: ScriptResponse;
  onApprove?: () => Promise<void>;
  onReject?: (id: string) => Promise<void>;
}

function ScriptActionButtons({ script, onApprove, onReject }: ScriptActionButtonsProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    if (!onApprove) return;
    
    try {
      setIsApproving(true);
      await onApprove();
      toast({
        title: "Roteiro aprovado",
        description: "O roteiro foi aprovado com sucesso.",
      });
    } catch (error) {
      console.error("Error approving script:", error);
      toast({
        variant: "destructive",
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o roteiro.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    
    try {
      setIsRejecting(true);
      await onReject(script.id);
      toast({
        variant: "default",
        title: "Roteiro rejeitado",
        description: "Uma nova versão será gerada em breve.",
      });
    } catch (error) {
      console.error("Error rejecting script:", error);
      toast({
        variant: "destructive",
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o roteiro.",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (script.pdf_url) {
      window.open(script.pdf_url, '_blank');
    } else {
      toast({
        variant: "destructive",
        title: "PDF não disponível",
        description: "O PDF deste roteiro não está disponível no momento.",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {onReject && (
        <Button variant="outline" onClick={handleReject} disabled={isRejecting || isApproving}>
          {isRejecting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ThumbsDown className="mr-2 h-4 w-4" />
          )}
          Rejeitar
        </Button>
      )}
      
      {script.pdf_url && (
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>
      )}
      
      {onApprove && (
        <Button onClick={handleApprove} disabled={isApproving || isRejecting}>
          {isApproving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ThumbsUp className="mr-2 h-4 w-4" />
          )}
          Aprovar
        </Button>
      )}
    </div>
  );
}

const ScriptCard: React.FC<ScriptCardProps> = ({ 
  script,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState("conteudo");
  const [showVideos, setShowVideos] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Format the content
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-6 mb-3">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mt-3 mb-1">{line.substring(4)}</h3>;
        } else if (line.startsWith('- ')) {
          return <li key={index} className="ml-5 mt-1">{line.substring(2)}</li>;
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index} className="mt-1">{line}</p>;
        }
      });
  };

  const getScriptTypeLabel = () => {
    switch (script.type) {
      case "videoScript":
        return "Roteiro para Vídeo";
      case "bigIdea":
        return "Big Idea";
      case "dailySales":
        return "Stories";
      case "reelsScript":
        return "Reels";
      default:
        return "Roteiro";
    }
  };
  
  const getScriptTypeColor = () => {
    switch (script.type) {
      case "videoScript":
        return "bg-blue-500";
      case "bigIdea":
        return "bg-purple-500";
      case "dailySales":
        return "bg-amber-500";
      case "reelsScript":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className={cn("px-2", getScriptTypeColor())}>
                {getScriptTypeLabel()}
              </Badge>
              {script.marketingObjective && (
                <Badge variant="outline">{script.marketingObjective}</Badge>
              )}
            </div>
            <CardTitle className="text-xl">{script.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-2 w-full">
          <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
          <TabsTrigger value="sugestoes" disabled={script.suggestedVideos.length === 0}>
            Sugestões de Vídeos
          </TabsTrigger>
          <TabsTrigger value="legenda" disabled={script.captionTips.length === 0}>
            Dicas de Legenda
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <TabsContent value="conteudo" className="mt-0 p-0">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {formatContent(script.content)}
            </div>
          </TabsContent>
          
          <TabsContent value="sugestoes" className="mt-0 p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {script.suggestedVideos.map((video, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{video.duration}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="legenda" className="mt-0 p-0">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Dicas para sua legenda</h3>
                <ul className="space-y-2">
                  {script.captionTips.map((tip, index) => (
                    <li key={index} className="flex gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
      
      <Dialog open={showVideos} onOpenChange={setShowVideos}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vídeos Sugeridos</DialogTitle>
            <DialogDescription>
              Baseados no seu roteiro "{script.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {script.suggestedVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{video.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ScriptCard;
