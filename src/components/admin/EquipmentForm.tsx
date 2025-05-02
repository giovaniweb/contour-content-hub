
import React, { useState, useRef } from 'react';
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
import { AlertCircle, CheckCircle2, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface EquipmentFormProps {
  equipment?: Equipment;
  onSave: (equipment: Equipment) => Promise<void>;
  onCancel: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onSave, onCancel }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(equipment?.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<Equipment>({
    defaultValues: equipment || {
      nome: '',
      tecnologia: '',
      indicacoes: '',
      beneficios: '',
      diferenciais: '',
      linguagem: '',
      image_url: '',
      ativo: true,
      efeito: '' // Add new efeito field
    }
  });

  // Function to handle image selection
  const handleSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor, envie apenas arquivos de imagem."
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é de 5MB."
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `equipment/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('images')
        .getPublicUrl(filePath);

      // Update form with image URL
      form.setValue('image_url', publicUrl);
      
      toast({
        title: "Imagem enviada",
        description: "A imagem foi carregada com sucesso."
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem. Tente novamente."
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Function to remove the image
  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue('image_url', '');
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
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
          </div>

          <div className="space-y-4">
            {/* Image upload section */}
            <div>
              <Label>Imagem do Equipamento</Label>
              <div className="mt-2">
                <input 
                  ref={fileInputRef}
                  type="file" 
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {!imagePreview ? (
                  <div 
                    onClick={handleSelectImage}
                    className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      Clique para fazer upload de uma imagem
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG ou GIF (máximo 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative border border-gray-200 rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview da imagem" 
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {isUploading && (
                  <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    <span>Enviando imagem...</span>
                  </div>
                )}
              </div>
            </div>

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
              name="efeito"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Efeito*</FormLabel>
                  <FormControl>
                    <Textarea 
                      required 
                      {...field} 
                      placeholder="Ex: Estimula produção de colágeno em camadas profundas da pele" 
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
          </div>
        </div>

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
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving || isUploading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving || isUploading}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                {equipment ? "Atualizar" : "Cadastrar"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EquipmentForm;
