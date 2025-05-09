
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentPlannerItem } from "@/types/content-planner";

const formSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  format: z.string(),
  objective: z.string(),
  distribution: z.string(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddContentPlannerItemFormProps {
  onSubmit: (data: Partial<ContentPlannerItem>) => void;
}

const AddContentPlannerItemForm: React.FC<AddContentPlannerItemFormProps> = ({ onSubmit }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      format: 'vídeo',
      objective: '🟡 Atrair Atenção',
      distribution: 'Instagram',
      tags: '',
    },
  });

  const handleSubmit = (data: FormValues) => {
    const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    
    onSubmit({
      title: data.title,
      description: data.description || '',
      format: data.format as any,
      objective: data.objective,
      distribution: data.distribution as any,
      tags: tagsArray,
      authorId: "user-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do conteúdo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o conteúdo" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formato</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="vídeo">Vídeo</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="carrossel">Carrossel</SelectItem>
                    <SelectItem value="reels">Reels</SelectItem>
                    <SelectItem value="texto">Texto</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="objective"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objetivo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="🟡 Atrair Atenção">🟡 Atrair Atenção</SelectItem>
                    <SelectItem value="🟢 Criar Conexão">🟢 Criar Conexão</SelectItem>
                    <SelectItem value="🔴 Fazer Comprar">🔴 Fazer Comprar</SelectItem>
                    <SelectItem value="🔁 Reativar Interesse">🔁 Reativar Interesse</SelectItem>
                    <SelectItem value="✅ Fechar Agora">✅ Fechar Agora</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="distribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canal de Distribuição</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o canal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Blog">Blog</SelectItem>
                    <SelectItem value="Múltiplos">Múltiplos</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (separadas por vírgula)</FormLabel>
                <FormControl>
                  <Input placeholder="dermato, procedimento, etc" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">Adicionar Conteúdo</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddContentPlannerItemForm;
