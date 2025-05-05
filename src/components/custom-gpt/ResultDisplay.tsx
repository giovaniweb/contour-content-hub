
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResultDisplayProps } from './types';

const ResultDisplay: React.FC<ResultDisplayProps> = ({ results, setResults }) => {
  const { toast } = useToast();

  return (
    <div className="mt-6 border rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-2">Conteúdo Gerado</h3>
      <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
        {results[0].content}
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(results[0].content);
            toast({
              title: "Conteúdo copiado",
              description: "O conteúdo foi copiado para a área de transferência.",
            });
          }}
        >
          Copiar
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setResults([])}
        >
          Limpar
        </Button>
      </div>
    </div>
  );
};

export default ResultDisplay;
