
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Clipboard, Check, Trash2 } from "lucide-react";
import { CustomGptResult } from '@/utils/custom-gpt';
import { useState } from 'react';

interface ResultDisplayProps {
  results: CustomGptResult[];
  setResults: React.Dispatch<React.SetStateAction<CustomGptResult[]>>;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ results, setResults }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setResults(prev => prev.filter(result => result.id !== id));
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Resultados gerados</h3>
        {results.length > 1 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setResults([])}
          >
            Limpar todos
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {results.map((result) => (
          <Card key={result.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-end gap-2 mb-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(result.id, result.content)}
                >
                  {copiedId === result.id ? (
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
                  onClick={() => handleDelete(result.id)}
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
        ))}
      </div>
    </div>
  );
};

export default ResultDisplay;
