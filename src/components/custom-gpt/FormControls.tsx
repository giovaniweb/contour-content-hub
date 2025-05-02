
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { ConteudoEstrategia, CustomGptType } from '@/utils/custom-gpt';

interface FormControlsProps {
  form: UseFormReturn<any>;
  formType: CustomGptType;
}

const FormControls: React.FC<FormControlsProps> = ({ form, formType }) => {
  return (
    <>
      {formType === "roteiro" && (
        <>
          <FormField
            control={form.control}
            name="quantidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de roteiros</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    max={5} 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Máximo 5 roteiros por vez
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tom de linguagem (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: descontraído, técnico, motivacional..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="estrategiaConteudo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estratégia de conteúdo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma estratégia" />
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
        </>
      )}

      {formType === "bigIdea" && (
        <FormField
          control={form.control}
          name="estrategiaConteudo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estratégia de conteúdo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma estratégia" />
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
      )}

      {formType === "stories" && (
        <>
          <FormField
            control={form.control}
            name="quantidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de ideias</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    max={10} 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Máximo 10 ideias por vez
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tom de linguagem (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: descontraído, técnico, motivacional..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  );
};

export default FormControls;
