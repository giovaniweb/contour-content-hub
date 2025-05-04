
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentStrategyItem } from "@/types/content-strategy";

const formSchema = z.object({
  linha: z.string().optional().nullable(),
  equipamento_id: z.string().optional().nullable(),
  categoria: z.string({ required_error: "Categoria é obrigatória" }),
  formato: z.string({ required_error: "Formato é obrigatório" }),
  responsavel_id: z.string().optional().nullable(),
  previsao: z.date().optional().nullable(),
  conteudo: z.string().optional().nullable(),
  objetivo: z.string({ required_error: "Objetivo é obrigatório" }),
  prioridade: z.string().default("Média"),
  status: z.string().default("Planejado"),
  impedimento: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContentStrategyFormProps {
  onSubmit: (data: Partial<ContentStrategyItem>) => Promise<void>;
  equipments: { id: string; nome: string }[];
  users: { id: string; nome: string }[];
  isLoading: boolean;
}

export function ContentStrategyForm({
  onSubmit,
  equipments,
  users,
  isLoading,
}: ContentStrategyFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linha: "",
      equipamento_id: "",
      categoria: "",
      formato: "",
      responsavel_id: "",
      previsao: undefined,
      conteudo: "",
      objetivo: "",
      prioridade: "Média",
      status: "Planejado",
      impedimento: "",
    },
  });

  async function handleSubmit(data: FormValues) {
    const formattedData = {
      ...data,
      previsao: data.previsao ? format(data.previsao, 'yyyy-MM-dd') : null,
    };
    await onSubmit(formattedData);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Linha/Marca */}
          <FormField
            control={form.control}
            name="linha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linha/Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a linha ou marca" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Nome da marca ou linha de produtos.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Equipamento */}
          <FormField
            control={form.control}
            name="equipamento_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipamento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ''}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um equipamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {equipments.map(equipment => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Equipamento relacionado ao conteúdo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categoria */}
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormDescription>
                  Categoria do conteúdo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Formato */}
          <FormField
            control={form.control}
            name="formato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formato</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormDescription>
                  Formato de mídia do conteúdo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Responsável */}
          <FormField
            control={form.control}
            name="responsavel_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ''}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Não definido</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Pessoa responsável pela criação do conteúdo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Previsão */}
          <FormField
            control={form.control}
            name="previsao"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Previsão</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Data prevista para publicação.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Objetivo */}
          <FormField
            control={form.control}
            name="objetivo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objetivo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um objetivo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="engajar">Engajar</SelectItem>
                    <SelectItem value="vender">Vender</SelectItem>
                    <SelectItem value="educar">Educar</SelectItem>
                    <SelectItem value="informar">Informar</SelectItem>
                    <SelectItem value="converter">Converter</SelectItem>
                    <SelectItem value="construir autoridade">Construir autoridade</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Objetivo principal do conteúdo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prioridade */}
          <FormField
            control={form.control}
            name="prioridade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Nível de prioridade do conteúdo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormDescription>
                  Status atual do item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Conteúdo */}
        <FormField
          control={form.control}
          name="conteudo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Big Idea / Conteúdo</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o conteúdo ou a ideia principal..." 
                  className="min-h-[120px]" 
                  {...field}
                  value={field.value || ''} 
                />
              </FormControl>
              <FormDescription>
                Descrição detalhada do conteúdo a ser criado.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Impedimento */}
        <FormField
          control={form.control}
          name="impedimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impedimento</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Informe algum impedimento ou consideração especial"
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormDescription>
                Alguma observação ou impedimento para este conteúdo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Adicionar Item'
          )}
        </Button>
      </form>
    </Form>
  );
}
