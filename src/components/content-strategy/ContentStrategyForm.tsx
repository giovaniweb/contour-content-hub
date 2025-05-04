import React, { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ContentStrategyItem } from "@/types/content-strategy";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as z from "zod";
import MarketingObjectiveSelector from "./MarketingObjectiveSelector";

const formSchema = z.object({
  equipamento_id: z.string().nullable(),
  categoria: z.string().min(1, {
    message: "Selecione uma categoria.",
  }),
  formato: z.string().min(1, {
    message: "Selecione um formato.",
  }),
  responsavel_id: z.string().nullable(),
  previsao: z.string().nullable(),
  conteudo: z.string().nullable(),
  objetivo: z.string().min(1, {
    message: "Selecione um objetivo.",
  }),
  status: z.string().min(1, {
    message: "Selecione um status.",
  }),
  distribuicao: z.string().min(1, {
    message: "Selecione uma plataforma de distribuição.",
  }),
});

interface ContentStrategyFormProps {
  onSubmit: (values: Partial<ContentStrategyItem>) => Promise<void>;
  equipments: { id: string; nome: string }[];
  users: { id: string; nome: string }[];
  isLoading?: boolean;
}

export const ContentStrategyForm: React.FC<ContentStrategyFormProps> = ({
  onSubmit,
  equipments,
  users,
  isLoading,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipamento_id: null,
      categoria: "",
      formato: "",
      responsavel_id: null,
      previsao: null,
      conteudo: null,
      objetivo: "",
      status: "",
      distribuicao: "",
    },
  });

  const handleDateSelect = useCallback((date: Date | undefined) => {
    form.setValue(
      "previsao",
      date ? format(date, "yyyy-MM-dd") : null,
      {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      }
    );
  }, [form.setValue]);

  const onSubmitForm = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
        <FormField
          control={form.control}
          name="equipamento_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipamento</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um equipamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="_none">Nenhum</SelectItem>
                  {equipments.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="branding">Branding</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="educativo">Educativo</SelectItem>
                  <SelectItem value="informativo">Informativo</SelectItem>
                  <SelectItem value="engajamento">Engajamento</SelectItem>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="formato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formato</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um formato" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="vídeo">Vídeo</SelectItem>
                  <SelectItem value="layout">Layout</SelectItem>
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
          name="responsavel_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="_none">Nenhum</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previsao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previsão</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[240px] pl-3 text-left font-normal"
                  >
                    {field.value ? (
                      format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={handleDateSelect}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="conteudo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Big Idea / Conteúdo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva a ideia ou conteúdo a ser trabalhado"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objetivo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivo</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um objetivo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="🟡 Atrair Atenção">
                    🟡 Atrair Atenção
                  </SelectItem>
                  <SelectItem value="🟢 Criar Conexão">
                    🟢 Criar Conexão
                  </SelectItem>
                  <SelectItem value="🔴 Fazer Comprar">
                    🔴 Fazer Comprar
                  </SelectItem>
                  <SelectItem value="🔁 Reativar Interesse">
                    🔁 Reativar Interesse
                  </SelectItem>
                  <SelectItem value="✅ Fechar Agora">
                    ✅ Fechar Agora
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Planejado">Planejado</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                  <SelectItem value="Standby">Standby</SelectItem>
                  <SelectItem value="Suspenso">Suspenso</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="distribuicao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plataforma de Distribuição</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma plataforma" />
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

        <Button type="submit" disabled={isLoading}>
          Salvar
        </Button>
      </form>
    </Form>
  );
};
