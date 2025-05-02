
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, BrainCircuit, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScriptResponse } from '@/utils/api';
import ScriptValidation from '@/components/script-generator/ScriptValidation';

interface GeneratedContentProps {
  content: string;
  title: string;
  description: string;
  scriptId: string;
  prepareScriptData: () => ScriptResponse;
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({ 
  content, 
  title, 
  description, 
  scriptId,
  prepareScriptData 
}) => {
  const [showValidation, setShowValidation] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência."
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              {title}
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button 
                variant={showValidation ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowValidation(!showValidation)}
              >
                <BrainCircuit className="h-4 w-4 mr-1" />
                {showValidation ? "Ocultar Validação" : "Validar com IA"}
              </Button>
            </div>
          </div>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-line border">
            {content}
          </div>
        </CardContent>
      </Card>

      {showValidation && (
        <ScriptValidation 
          script={prepareScriptData()}
          onValidationComplete={() => {}}
        />
      )}
    </>
  );
};

export default GeneratedContent;
