
import React, { useState } from 'react';
import { createEquipment } from '@/utils/api-equipment';
import { Equipment } from '@/types/equipment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EquipmentCreateFormProps {
  onSuccess?: (equipment: Equipment) => void;
  onCancel?: () => void;
}

const EquipmentCreateForm: React.FC<EquipmentCreateFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [equipment, setEquipment] = useState<Omit<Equipment, 'id'>>({
    nome: '',
    tecnologia: '',
    indicacoes: '',
    beneficios: '',
    diferenciais: '',
    linguagem: '',
    ativo: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEquipment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!equipment.nome || !equipment.tecnologia || !equipment.indicacoes || 
        !equipment.beneficios || !equipment.diferenciais || !equipment.linguagem) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Todos os campos são obrigatórios."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const newEquipment = await createEquipment(equipment as Equipment);
      toast({
        title: "Equipamento cadastrado",
        description: `${newEquipment.nome} foi adicionado com sucesso.`
      });
      
      if (onSuccess) {
        onSuccess(newEquipment);
      }
    } catch (error) {
      console.error('Erro ao cadastrar equipamento:', error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Não foi possível adicionar o equipamento. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Cadastrar Novo Equipamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Equipamento</Label>
            <Input 
              id="nome"
              name="nome"
              value={equipment.nome}
              onChange={handleChange}
              placeholder="Ex: Ultralift HIFU"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="tecnologia">Tecnologia</Label>
            <Textarea 
              id="tecnologia"
              name="tecnologia"
              value={equipment.tecnologia}
              onChange={handleChange}
              placeholder="Descreva a tecnologia do equipamento..."
              className="mt-1 h-24"
            />
          </div>
          
          <div>
            <Label htmlFor="indicacoes">Indicações</Label>
            <Textarea 
              id="indicacoes"
              name="indicacoes"
              value={equipment.indicacoes}
              onChange={handleChange}
              placeholder="Liste as indicações e usos do equipamento..."
              className="mt-1 h-24"
            />
          </div>
          
          <div>
            <Label htmlFor="beneficios">Benefícios</Label>
            <Textarea 
              id="beneficios"
              name="beneficios"
              value={equipment.beneficios}
              onChange={handleChange}
              placeholder="Descreva os benefícios do tratamento..."
              className="mt-1 h-24"
            />
          </div>
          
          <div>
            <Label htmlFor="diferenciais">Diferenciais</Label>
            <Textarea 
              id="diferenciais"
              name="diferenciais"
              value={equipment.diferenciais}
              onChange={handleChange}
              placeholder="Descreva os diferenciais deste equipamento..."
              className="mt-1 h-24"
            />
          </div>
          
          <div>
            <Label htmlFor="linguagem">Linguagem Recomendada</Label>
            <Textarea 
              id="linguagem"
              name="linguagem"
              value={equipment.linguagem}
              onChange={handleChange}
              placeholder="Descreva a linguagem recomendada para falar deste equipamento..."
              className="mt-1 h-24"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Equipamento
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EquipmentCreateForm;
