
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Trash2, Star } from "lucide-react";
import { CustomGptResult } from './types';
import { ScriptResponse } from '@/types/script';
import { ScriptValidation } from '@/components/ui/sheet';
import { useToast } from "@/hooks/use-toast";

interface ResultItemProps {
  result: CustomGptResult;
  onDelete: (id: string) => void;
}

const ResultItem: React.FC<ResultItemProps> = ({ result, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const prepareScriptData = (): ScriptResponse => {
    // Map CustomGptType to ScriptResponse type
    const scriptType = (() => {
      if (result.type === 'roteiro') return 'videoScript';
      if (result.type === 'bigIdea') return 'bigIdea';
      if (result.type === 'stories') return 'dailySales';
      return 'videoScript'; // Default fallback
    })();

    return {
      id: result.id,
      title: result.title || 'Conteúdo gerado',
      content: result.content,
      type: scriptType, // Fixed type mapping
      createdAt: new Date().toISOString(),
      suggestedVideos: [],
      captionTips: [],
      equipment: result.equipment || '',
      marketingObjective: result.marketingObjective || '🟢 Criar Conexão',
    };
  };

  return (
    <Card key={result.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-end gap-2 mb-2">
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
        
        <div className="whitespace-pre-wrap bg-muted p-3 rounded-md text-sm">
          {result.content}
        </div>

        {showValidation && (
          <div className="mt-4 border-t pt-4">
            <ScriptValidation 
              script={prepareScriptData()}
              onValidationComplete={() => {
                toast({
                  title: "Validação concluída",
                  description: "Seu roteiro foi avaliado com sucesso"
                });
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultItem;
