
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentStrategyFilter } from "@/types/content-strategy";

const filterSchema = z.object({
  linha: z.string().optional(),
  equipamento_id: z.string().optional(),
  categoria: z.enum(['branding', 'vendas', 'educativo', 'informativo', 'engajamento', 'produto', 'outro', 'all']).optional(),
  formato: z.enum(['story', 'vídeo', 'layout', 'carrossel', 'reels', 'texto', 'outro', 'all']).optional(),
  responsavel_id: z.string().optional(),
  objetivo: z.enum(['engajar', 'vender', 'educar', 'informar', 'converter', 'construir autoridade', 'outro', 'all']).optional(),
  prioridade: z.enum(['Alta', 'Média', 'Baixa', 'all']).optional(),
  status: z.enum(['Planejado', 'Em andamento', 'Finalizado', 'Standby', 'Suspenso', 'all']).optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface ContentStrategyFiltersProps {
  onFilterChange: (filters: ContentStrategyFilter) => void;
  equipments: { id: string; nome: string }[];
  users: { id: string; nome: string }[];
}

export function ContentStrategyFilters({ 
  onFilterChange, 
  equipments, 
  users 
}: ContentStrategyFiltersProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      linha: "",
      equipamento_id: "",
      categoria: "all",
      formato: "all",
      responsavel_id: "",
      objetivo: "all",
      prioridade: "all",
      status: "all",
      dateRange: { from: undefined, to: undefined },
    },
  });

  function onSubmit(data: FilterFormValues) {
    // Convert special 'all' values to undefined to correctly apply the filters
    const filters: ContentStrategyFilter = {
      linha: data.linha || undefined,
      equipamento_id: data.equipamento_id || undefined,
      categoria: data.categoria === 'all' ? undefined : data.categoria as ContentStrategyFilter["categoria"],
      formato: data.formato === 'all' ? undefined : data.formato as ContentStrategyFilter["formato"],
      responsavel_id: data.responsavel_id || undefined,
      objetivo: data.objetivo === 'all' ? undefined : data.objetivo as ContentStrategyFilter["objetivo"],
      prioridade: data.prioridade === 'all' ? undefined : data.prioridade as ContentStrategyFilter["prioridade"],
      status: data.status === 'all' ? undefined : data.status as ContentStrategyFilter["status"],
      dateRange: data.dateRange?.from && data.dateRange?.to ? data.dateRange : undefined
    };
    
    onFilterChange(filters);
  }

  function handleReset() {
    form.reset({
      linha: "",
      equipamento_id: "",
      categoria: "all",
      formato: "all",
      responsavel_id: "",
      objetivo: "all",
      prioridade: "all",
      status: "all",
      dateRange: { from: undefined, to: undefined },
    });
    onFilterChange({});
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Linha/Marca */}
          <FormField
            control={form.control}
            name="linha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linha/Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a linha ou marca" {...field} />
                </FormControl>
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
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um equipamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {equipments.map(equipment => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="branding">Branding</SelectItem>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="educativo">Educativo</SelectItem>
                    <SelectItem value="informativo">Informativo</SelectItem>
                    <SelectItem value="engajamento">Engajamento</SelectItem>
                    <SelectItem value="produto">Produto</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um formato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="vídeo">Vídeo</SelectItem>
                    <SelectItem value="layout">Layout</SelectItem>
                    <SelectItem value="carrossel">Carrossel</SelectItem>
                    <SelectItem value="reels">Reels</SelectItem>
                    <SelectItem value="texto">Texto</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
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
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um objetivo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="engajar">Engajar</SelectItem>
                    <SelectItem value="vender">Vender</SelectItem>
                    <SelectItem value="educar">Educar</SelectItem>
                    <SelectItem value="informar">Informar</SelectItem>
                    <SelectItem value="converter">Converter</SelectItem>
                    <SelectItem value="construir autoridade">Construir autoridade</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Planejado">Planejado</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                    <SelectItem value="Standby">Standby</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Date Range */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Período</FormLabel>
                <div className={cn("grid gap-2")}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value?.from && !field.value?.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from && field.value?.to ? (
                          <>
                            {format(field.value.from, "P", { locale: ptBR })} - {format(field.value.to, "P", { locale: ptBR })}
                          </>
                        ) : (
                          <span>Selecione um período</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        locale={ptBR}
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={{
                          from: field.value?.from,
                          to: field.value?.to,
                        }}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
          <Button type="submit">Aplicar filtros</Button>
        </div>
      </form>
    </Form>
  );
}
