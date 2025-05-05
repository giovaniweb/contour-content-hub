
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Sparkles, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { SimpleGeneratorProps } from './types';

const SimpleGenerator: React.FC<SimpleGeneratorProps> = ({
  selectedEquipment,
  setSelectedEquipment,
  selectedObjective,
  setSelectedObjective,
  equipments,
  equipmentsLoading,
  handleQuickGenerate,
  isSubmitting,
  results,
  setResults,
  showAdvancedFields,
  setShowAdvancedFields
}) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="equipment">Equipamento</Label>
          <Select 
            value={selectedEquipment} 
            onValueChange={setSelectedEquipment}
            disabled={isSubmitting}
          >
            <SelectTrigger id="equipment" className="w-full">
              <SelectValue placeholder="Selecione o equipamento" />
            </SelectTrigger>
            <SelectContent>
              {equipmentsLoading ? (
                <SelectItem value="loading" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </SelectItem>
              ) : (
                equipments.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.nome}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Selecione o equipamento para o qual deseja gerar conteúdo
          </p>
        </div>

        <div>
          <Label htmlFor="objective">Objetivo de Marketing</Label>
          <Select 
            value={selectedObjective} 
            onValueChange={(value) => setSelectedObjective(value as any)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="objective">
              <SelectValue placeholder="Selecione o objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="🟡 Atrair Atenção">🟡 Atrair Atenção</SelectItem>
              <SelectItem value="🟢 Criar Conexão">🟢 Criar Conexão</SelectItem>
              <SelectItem value="🔴 Fazer Comprar">🔴 Fazer Comprar</SelectItem>
              <SelectItem value="🔁 Reativar Interesse">🔁 Reativar Interesse</SelectItem>
              <SelectItem value="✅ Fechar Agora">✅ Fechar Agora</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Selecione o objetivo de marketing para o seu conteúdo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="py-8 flex flex-col items-center justify-center gap-2 h-auto"
          onClick={() => handleQuickGenerate("roteiro")}
          disabled={isSubmitting || !selectedEquipment}
        >
          <FileText className="h-6 w-6" />
          <span className="font-semibold">Gerar Roteiro</span>
        </Button>

        <Button 
          variant="outline" 
          className="py-8 flex flex-col items-center justify-center gap-2 h-auto"
          onClick={() => handleQuickGenerate("bigIdea")}
          disabled={isSubmitting || !selectedEquipment}
        >
          <Sparkles className="h-6 w-6" />
          <span className="font-semibold">Gerar Big Idea</span>
        </Button>

        <Button 
          variant="outline" 
          className="py-8 flex flex-col items-center justify-center gap-2 h-auto"
          onClick={() => handleQuickGenerate("stories")}
          disabled={isSubmitting || !selectedEquipment}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="font-semibold">Gerar Stories</span>
        </Button>
      </div>

      {results.length > 0 && <ResultDisplay results={results} setResults={setResults} />}
      
      <div className="border-t pt-4">
        <Button 
          variant="link" 
          size="sm" 
          className="px-0 text-xs"
          onClick={() => setShowAdvancedFields(!showAdvancedFields)}
        >
          {showAdvancedFields ? "Ocultar opções avançadas" : "Mostrar opções avançadas"}
        </Button>
      </div>
    </div>
  );
};

export default SimpleGenerator;
