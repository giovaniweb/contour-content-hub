
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Equipment, validateEquipment, hasValidationErrors } from '@/types/equipment';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface EquipmentFormProps {
  equipment?: Equipment;
  onSave: (equipment: Equipment) => Promise<void>;
  onCancel: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onSave, onCancel }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<Equipment>({
    defaultValues: equipment || {
      nome: '',
      tecnologia: '',
      indicacoes: '',
      beneficios: '',
      diferenciais: '',
      linguagem: '',
      ativo: true
    }
  });

  const handleSubmit = async (data: Equipment) => {
    try {
      // Validação manual adicional
      const validationErrors = validateEquipment(data);
      if (hasValidationErrors(validationErrors)) {
        // Exibir erros de validação
        for (const [field, message] of Object.entries(validationErrors)) {
          form.setError(field as any, {
            type: 'manual',
            message: message as string
          });
        }
        
        toast({
          variant: "destructive",
          title: "Erro de validação",
          description: "Verifique os campos obrigatórios e tente novamente.",
        });
        return;
      }
      
      setIsSaving(true);
      await onSave(data);
      toast({
        title: "Sucesso",
        description: (
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            <span>{`Equipamento ${equipment ? 'atualizado' : 'cadastrado'} com sucesso!`}</span>
          </div>
        ),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-destructive mr-2" />
            <span>{`Falha ao ${equipment ? 'atualizar' : 'cadastrar'} equipamento. Tente novamente.`}</span>
          </div>
        ),
      });
      console.error("Erro ao salvar equipamento:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Equipamento*</FormLabel>
              <FormControl>
                <Input required {...field} placeholder="Ex: Hipro" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tecnologia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tecnologia*</FormLabel>
              <FormControl>
                <Textarea 
                  required 
                  {...field} 
                  placeholder="Ex: HIFU – Ultrassom Focalizado de Alta Intensidade" 
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="indicacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indicações*</FormLabel>
              <FormControl>
                <Textarea 
                  required 
                  {...field} 
                  placeholder="Ex: Lifting facial não-cirúrgico; Redução de rugas profundas" 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="beneficios"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefícios*</FormLabel>
              <FormControl>
                <Textarea 
                  required 
                  {...field} 
                  placeholder="Ex: Efeito lifting visível sem cortes ou agulhas" 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diferenciais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diferenciais*</FormLabel>
              <FormControl>
                <Textarea 
                  required 
                  {...field} 
                  placeholder="Ex: Focaliza energia ultrassônica em pontos profundos precisos" 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linguagem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linguagem Recomendada*</FormLabel>
              <FormControl>
                <Textarea 
                  required 
                  {...field} 
                  placeholder="Ex: Convincente e elegante, passando segurança sobre obter rejuvenescimento sem cirurgia" 
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Equipamento Ativo</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Determina se este equipamento está disponível para seleção nos roteiros
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : (equipment ? "Atualizar" : "Cadastrar")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EquipmentForm;
