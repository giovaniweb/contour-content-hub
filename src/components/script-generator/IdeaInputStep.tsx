
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { FormData } from '@/types/script';

interface IdeaInputStepProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onObjectiveChange: (value: 'emotion' | 'sales') => void;
  onGoBack: () => void;
  onSubmit: () => void;
}

const IdeaInputStep: React.FC<IdeaInputStepProps> = ({
  formData,
  onInputChange,
  onObjectiveChange,
  onGoBack,
  onSubmit
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onGoBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Gerador de Roteiros</h1>
          <p className="text-muted-foreground">Crie roteiros profissionais com IA</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Conte sua ideia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="idea">Qual sua ideia para o roteiro?</Label>
            <Textarea
              id="idea"
              name="idea"
              placeholder="Ex: Roteiro sobre os benefícios da harmonização facial..."
              value={formData.idea}
              onChange={onInputChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-3">
            <Label>Objetivo do roteiro</Label>
            <RadioGroup
              value={formData.objective}
              onValueChange={onObjectiveChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emotion" id="emotion" />
                <Label htmlFor="emotion">Emocionar (criar conexão emocional)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sales" id="sales" />
                <Label htmlFor="sales">Vender (foco em conversão)</Label>
              </div>
            </RadioGroup>
          </div>

          <Button 
            onClick={onSubmit} 
            className="w-full"
            disabled={!formData.idea.trim()}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Gerar Roteiro
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdeaInputStep;
