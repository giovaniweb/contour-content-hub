
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Trash2 } from "lucide-react";
import { CustomGptResult } from './types';

interface ResultItemProps {
  result: CustomGptResult;
  onDelete: (id: string) => void;
}

const ResultItem: React.FC<ResultItemProps> = ({ result, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card key={result.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-end gap-2 mb-2">
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
      </CardContent>
    </Card>
  );
};

export default ResultItem;
