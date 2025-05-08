
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { MediaItem, generateIdeasFromMedia } from "./mockData";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DownloadIdeasModalProps {
  item: MediaItem | null;
  open: boolean;
  onClose: () => void;
}

const DownloadIdeasModal: React.FC<DownloadIdeasModalProps> = ({
  item,
  open,
  onClose,
}) => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [approvedIdea, setApprovedIdea] = useState<string | null>(null);
  const [showThanks, setShowThanks] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Generate ideas when the item changes
  React.useEffect(() => {
    if (item) {
      setIdeas(generateIdeasFromMedia(item));
      setCurrentIdeaIndex(0);
      setApprovedIdea(null);
      setShowThanks(false);
    }
  }, [item]);
  
  const handleSwipe = (approved: boolean) => {
    if (!ideas.length) return;
    
    if (approved) {
      setApprovedIdea(ideas[currentIdeaIndex]);
      setShowThanks(true);
    } else {
      if (currentIdeaIndex < ideas.length - 1) {
        setCurrentIdeaIndex(currentIdeaIndex + 1);
      } else {
        // No more ideas
        onClose();
        toast({
          title: "Sem mais ideias",
          description: "Não temos mais sugestões para este item.",
        });
      }
    }
  };
  
  const handleTurnIntoScript = () => {
    // Mock redirection to script generator with the approved idea
    navigate("/custom-gpt", { 
      state: { 
        prefilledIdea: approvedIdea,
        mediaTitle: item?.title,
        mediaType: item?.type
      } 
    });
    
    toast({
      title: "Ideia enviada para o gerador de roteiros",
      description: "Você será redirecionado para criar um roteiro baseado nesta ideia.",
    });
    
    onClose();
  };
  
  if (!item) return null;
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-fluida-blue to-fluida-pink p-1.5 rounded-full">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            Ideias de conteúdo
          </DialogTitle>
          <DialogDescription>
            {!showThanks 
              ? "Gostaria de receber ideias de conteúdo baseadas neste item?" 
              : "Ótima escolha! O que gostaria de fazer com esta ideia?"}
          </DialogDescription>
        </DialogHeader>
        
        {!showThanks ? (
          <div className="py-4">
            {ideas.length > 0 && (
              <Card className="border border-fluida-blue/10 p-6 my-2 bg-gradient-to-r from-blue-50 to-purple-50">
                <p className="text-lg font-medium text-center mb-6">
                  {ideas[currentIdeaIndex]}
                </p>
                
                <div className="flex justify-center gap-4 mt-4">
                  <Button 
                    variant="outline" 
                    className="rounded-full w-12 h-12 p-0"
                    onClick={() => handleSwipe(false)}
                  >
                    <ThumbsDown className="h-5 w-5 text-red-500" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full w-12 h-12 p-0 border-green-500"
                    onClick={() => handleSwipe(true)}
                  >
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                  </Button>
                </div>
                
                <div className="flex justify-center mt-4">
                  <span className="text-xs text-muted-foreground">
                    {currentIdeaIndex + 1} de {ideas.length}
                  </span>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="py-4">
            <Card className="border border-green-200 p-6 my-2 bg-green-50">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-center text-lg font-medium">{approvedIdea}</p>
            </Card>
          </div>
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {showThanks ? (
            <>
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                Apenas baixar
              </Button>
              <Button 
                onClick={handleTurnIntoScript}
                className="bg-gradient-to-r from-fluida-blue to-fluida-pink text-white"
              >
                Transformar em roteiro
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Apenas baixar mídia
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadIdeasModal;
