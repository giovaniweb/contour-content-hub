
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AdvancedOptionsProps } from './types';

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="marketingObjective"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objetivo de Marketing</FormLabel>
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

      <FormField
        control={form.control}
        name="bodyArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Área do Corpo</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Rosto, corpo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purposes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Finalidades</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  const currentValues = Array.isArray(field.value) ? field.value : [];
                  if (!currentValues.includes(value)) {
                    field.onChange([...currentValues, value]);
                  }
                }}
                value=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione as finalidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rugas">Rugas</SelectItem>
                  <SelectItem value="flacidez">Flacidez</SelectItem>
                  <SelectItem value="manchas">Manchas</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {Array.isArray(field.value) && field.value.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {field.value.map((item) => (
                  <div key={item} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center">
                    {item}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => {
                        field.onChange(field.value.filter(i => i !== item));
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="resetAfterSubmit"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Limpar após gerar</FormLabel>
              <p className="text-sm text-muted-foreground">
                Limpa os campos após o conteúdo ser gerado
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
    </>
  );
};

export default AdvancedOptions;
