
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Trash2, Star, FileText } from "lucide-react";
import { CustomGptResult } from './types';
import { ScriptResponse } from '@/types/script';
import { useToast } from "@/hooks/use-toast";
import ScriptResultCard from './ScriptResultCard';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ResultItemProps {
  result: CustomGptResult;
  onDelete: (id: string) => void;
}

const ResultItem: React.FC<ResultItemProps> = ({ result, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência."
    });
  };

  return (
    <>
      <Card key={result.id} className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex justify-end gap-2 p-3 bg-muted/30">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFullScreen(true)}
            >
              <FileText className="h-4 w-4 mr-1" />
              Expandir
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowValidation(!showValidation)}
            >
              <Star className="h-4 w-4 mr-1" />
              Validar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(result.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </div>
          
          <div className="px-3 pb-3">
            <ScriptResultCard result={result} />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showFullScreen} onOpenChange={setShowFullScreen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>
            {result.title || `Conteúdo para ${result.equipment || 'Equipamento'}`}
          </DialogTitle>
          <DialogDescription>
            Visualize e avalie seu roteiro em tela completa
          </DialogDescription>
          
          <div className="mt-4">
            <ScriptResultCard result={result} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResultItem;
