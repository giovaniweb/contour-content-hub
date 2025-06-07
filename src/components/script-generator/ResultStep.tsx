
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Edit, RotateCcw, Calendar } from 'lucide-react';
import { GeneratedScript, FormData } from '@/types/script';

interface ResultStepProps {
  generatedScript: GeneratedScript;
  formData: FormData;
  onCopyScript: () => void;
  onBackToEdit: () => void;
  onNewScript: () => void;
  isPlannerModalOpen: boolean;
  setIsPlannerModalOpen: (open: boolean) => void;
}

const ResultStep: React.FC<ResultStepProps> = ({
  generatedScript,
  formData,
  onCopyScript,
  onBackToEdit,
  onNewScript
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roteiro Gerado</h1>
          <p className="text-muted-foreground">
            Objetivo: {formData.objective === 'emotion' ? 'Emocionar' : 'Vender'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBackToEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={onNewScript}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Novo Roteiro
          </Button>
          <Button onClick={onCopyScript}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Roteiro Estruturado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Título</h3>
              <p className="text-sm text-muted-foreground">{generatedScript.title}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Abertura</h3>
              <p className="text-sm text-muted-foreground">{generatedScript.opening}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Desenvolvimento</h3>
              <p className="text-sm text-muted-foreground">{generatedScript.body}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Fechamento</h3>
              <p className="text-sm text-muted-foreground">{generatedScript.closing}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Sugestão Visual</h3>
              <p className="text-sm text-muted-foreground">{generatedScript.visualSuggestion}</p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Badge variant="secondary">{generatedScript.duration}</Badge>
              <Badge variant="outline">Score: {generatedScript.finalScore}/10</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Versão Refinada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm text-muted-foreground">
              {generatedScript.refinedScript}
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{generatedScript.finalPhrase}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultStep;
