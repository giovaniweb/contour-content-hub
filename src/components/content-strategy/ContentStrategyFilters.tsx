
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentStrategyFilter } from "@/types/content-strategy";
import { DateRange } from "react-day-picker";
import { Badge } from "../ui/badge";

const filtersSchema = z.object({
  equipamento_id: z.string().optional(),
  categoria: z.string().optional(),
  formato: z.string().optional(),
  responsavel_id: z.string().optional(),
  objetivo: z.string().optional(),
  prioridade: z.string().optional(),
  status: z.string().optional(),
  distribuicao: z.string().optional(),
});

interface ContentStrategyFiltersProps {
  onFilterChange: (filters: ContentStrategyFilter) => void;
  equipments: { id: string; nome: string }[];
  users: { id: string; nome: string }[];
}

export function ContentStrategyFilters({
  onFilterChange,
  equipments,
  users,
}: ContentStrategyFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const form = useForm<z.infer<typeof filtersSchema>>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      equipamento_id: undefined,
      categoria: undefined,
      formato: undefined,
      responsavel_id: undefined,
      objetivo: undefined,
      prioridade: undefined,
      status: undefined,
      distribuicao: undefined,
    },
  });

  const handleSubmitFilters = (values: z.infer<typeof filtersSchema>) => {
    // Convert empty strings to undefined
    const formattedFilters: ContentStrategyFilter = Object.entries(values).reduce(
      (acc, [key, value]) => {
        if (value === "all") {
          return acc;
        }
        
        if (key === "equipamento_id" && value === "") {
          return { ...acc, [key]: undefined };
        }
        
        if (key === "responsavel_id" && value === "") {
          return { ...acc, [key]: undefined };
        }
        
        return { ...acc, [key]: value || undefined };
      },
      {} as ContentStrategyFilter
    );

    // Add date range if selected
    if (dateRange?.from && dateRange?.to) {
      formattedFilters.dateRange = {
        from: dateRange.from,
        to: dateRange.to,
      };
    }

    // Track active filters for display
    const newActiveFilters = Object.entries(formattedFilters)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => key);
      
    if (dateRange?.from && dateRange?.to) {
      newActiveFilters.push("dateRange");
    }
    
    setActiveFilters(newActiveFilters);
    onFilterChange(formattedFilters);
  };

  const resetFilters = () => {
    form.reset({
      equipamento_id: undefined,
      categoria: undefined,
      formato: undefined,
      responsavel_id: undefined,
      objetivo: undefined,
      prioridade: undefined,
      status: undefined,
      distribuicao: undefined,
    });
    setDateRange(undefined);
    setActiveFilters([]);
    onFilterChange({});
  };

  const getFilterLabel = (filter: string): string => {
    switch (filter) {
      case "equipamento_id":
        return "Equipamento";
      case "categoria":
        return "Categoria";
      case "formato":
        return "Formato";
      case "responsavel_id":
        return "Responsável";
      case "objetivo":
        return "Objetivo";
      case "prioridade":
        return "Prioridade";
      case "status":
        return "Status";
      case "distribuicao":
        return "Distribuição";
      case "dateRange":
        return "Período";
      default:
        return filter;
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitFilters)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="equipamento_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || "all"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {equipments.map((equipment) => (
                        <SelectItem key={equipment.id} value={equipment.id}>
                          {equipment.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    value={field.value || "all"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
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

            <FormField
              control={form.control}
              name="formato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formato</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || "all"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
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

            <FormField
              control={form.control}
              name="responsavel_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || "all"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    value={field.value || "all"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="engajar">Engajar</SelectItem>
                      <SelectItem value="vender">Vender</SelectItem>
                      <SelectItem value="educar">Educar</SelectItem>
                      <SelectItem value="informar">Informar</SelectItem>
                      <SelectItem value="converter">Converter</SelectItem>
                      <SelectItem value="construir autoridade">
                        Construir autoridade
                      </SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prioridade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || "all"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || "all"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
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

            <FormField
              control={form.control}
              name="distribuicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distribuição</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || "all"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="Blog">Blog</SelectItem>
                      <SelectItem value="Múltiplos">Múltiplos</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-2">
              <FormLabel>Período de Publicação</FormLabel>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })}{" "}
                            até {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        )
                      ) : (
                        <span>Selecione um período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      locale={ptBR}
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {activeFilters.length > 0 && (
              <>
                <div className="text-sm text-muted-foreground py-1">
                  Filtros aplicados:
                </div>
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="outline">
                    {getFilterLabel(filter)}
                  </Badge>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs flex items-center"
                  onClick={resetFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpar filtros
                </Button>
              </>
            )}
          </div>

          <Button type="submit" className="mt-4">
            Aplicar filtros
          </Button>
        </form>
      </Form>
    </div>
  );
}
