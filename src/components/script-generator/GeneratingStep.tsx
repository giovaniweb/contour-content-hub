
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';

const GeneratingStep: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <Wand2 className="h-12 w-12 text-primary" />
            <Loader2 className="h-6 w-6 animate-spin absolute -top-1 -right-1 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Gerando seu roteiro...</h2>
          <p className="text-muted-foreground text-center">
            Nossa IA está criando um roteiro personalizado baseado na sua ideia. 
            Isso pode levar alguns segundos.
          </p>
          <div className="flex space-x-1 mt-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratingStep;
