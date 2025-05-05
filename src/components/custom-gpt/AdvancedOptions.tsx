
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AdvancedOptionsProps } from './types';

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ form, showAdvancedFields }) => {
  if (!showAdvancedFields) return null;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Opções Avançadas</h3>
      
      <FormField
        control={form.control}
        name="topic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tópico Específico</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Redução de celulite" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tom de Voz</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tom" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="informativo">Informativo e Educativo</SelectItem>
                  <SelectItem value="persuasivo">Persuasivo e Convincente</SelectItem>
                  <SelectItem value="emocional">Emocional e Empático</SelectItem>
                  <SelectItem value="direto">Direto e Objetivo</SelectItem>
                  <SelectItem value="autoridade">Autoridade e Especialista</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bodyArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área Corporal (opcional)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="rosto">Rosto</SelectItem>
                  <SelectItem value="abdomen">Abdômen</SelectItem>
                  <SelectItem value="gluteos">Glúteos</SelectItem>
                  <SelectItem value="pernas">Pernas</SelectItem>
                  <SelectItem value="bracos">Braços</SelectItem>
                  <SelectItem value="costas">Costas</SelectItem>
                  <SelectItem value="corpo_todo">Corpo Todo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Informações Adicionais</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Inclua aqui qualquer informação adicional importante para a geração do conteúdo..." 
                className="min-h-24"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="resetAfterSubmit"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Limpar formulário após envio</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdvancedOptions;
