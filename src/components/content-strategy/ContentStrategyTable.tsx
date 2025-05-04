
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ContentStrategyItem } from "@/types/content-strategy";
import {
  Calendar as CalendarIcon,
  FileEdit,
  Sparkles,
  CalendarPlus,
  Check,
  X,
  Loader2,
  TrashIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MarketingObjectiveSelector from "./MarketingObjectiveSelector";

interface ContentStrategyTableProps {
  data: ContentStrategyItem[];
  equipments: { id: string; nome: string }[];
  users: { id: string; nome: string }[];
  onUpdate: (id: string, updates: Partial<ContentStrategyItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onGenerateContent: (item: ContentStrategyItem) => Promise<void>;
  onSchedule: (item: ContentStrategyItem) => Promise<void>;
}

export function ContentStrategyTable({
  data,
  equipments,
  users,
  onUpdate,
  onDelete,
  onGenerateContent,
  onSchedule,
}: ContentStrategyTableProps) {
  const [editableRow, setEditableRow] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ContentStrategyItem>>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; itemId: string | null }>({ open: false, itemId: null });

  const handleEditClick = (item: ContentStrategyItem) => {
    setEditableRow(item.id);
    setEditValues({ ...item });
  };

  const handleSaveClick = async () => {
    if (editableRow && editValues) {
      setIsLoading(prev => ({ ...prev, [editableRow]: true }));
      await onUpdate(editableRow, editValues);
      setIsLoading(prev => ({ ...prev, [editableRow]: false }));
      setEditableRow(null);
      setEditValues({});
    }
  };

  const handleCancelClick = () => {
    setEditableRow(null);
    setEditValues({});
  };

  const handleInputChange = (
    field: keyof ContentStrategyItem,
    value: any
  ) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateContent = async (item: ContentStrategyItem) => {
    setIsLoading(prev => ({ ...prev, [`generate-${item.id}`]: true }));
    await onGenerateContent(item);
    setIsLoading(prev => ({ ...prev, [`generate-${item.id}`]: false }));
  };

  const handleSchedule = async (item: ContentStrategyItem) => {
    setIsLoading(prev => ({ ...prev, [`schedule-${item.id}`]: true }));
    await onSchedule(item);
    setIsLoading(prev => ({ ...prev, [`schedule-${item.id}`]: false }));
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.itemId) {
      setIsLoading(prev => ({ ...prev, [`delete-${deleteDialog.itemId}`]: true }));
      await onDelete(deleteDialog.itemId);
      setIsLoading(prev => ({ ...prev, [`delete-${deleteDialog.itemId}`]: false }));
      setDeleteDialog({ open: false, itemId: null });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planejado': return 'bg-blue-100 text-blue-800';
      case 'Em andamento': return 'bg-yellow-100 text-yellow-800';
      case 'Finalizado': return 'bg-green-100 text-green-800';
      case 'Standby': return 'bg-purple-100 text-purple-800';
      case 'Suspenso': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="whitespace-nowrap">Equipamento</TableHead>
              <TableHead className="whitespace-nowrap">Categoria</TableHead>
              <TableHead className="whitespace-nowrap">Formato</TableHead>
              <TableHead className="whitespace-nowrap">Responsável</TableHead>
              <TableHead className="whitespace-nowrap">Previsão</TableHead>
              <TableHead className="whitespace-nowrap">Big Idea / Conteúdo</TableHead>
              <TableHead className="whitespace-nowrap">Objetivo</TableHead>
              <TableHead className="whitespace-nowrap">Prioridade</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  Nenhum item de estratégia de conteúdo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className={editableRow === item.id ? 'bg-muted/20' : ''}>
                  <TableCell>
                    {editableRow === item.id ? (
                      <Select
                        value={editValues.equipamento_id || ''}
                        onValueChange={(value) => handleInputChange('equipamento_id', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipments.map((equipment) => (
                            <SelectItem key={equipment.id} value={equipment.id}>
                              {equipment.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      item.equipamento_nome || '-'
                    )}
                  </TableCell>

                  <TableCell>
                    {editableRow === item.id ? (
                      <Select
                        value={editValues.categoria || ''}
                        onValueChange={(value) => handleInputChange('categoria', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
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
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-100">
                        {item.categoria}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    {editableRow === item.id ? (
                      <Select
                        value={editValues.formato || ''}
                        onValueChange={(value) => handleInputChange('formato', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
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
                    ) : (
                      <Badge variant="outline" className="bg-purple-50 text-purple-800 hover:bg-purple-100">
                        {item.formato}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    {editableRow === item.id ? (
                      <Select
                        value={editValues.responsavel_id || ''}
                        onValueChange={(value) => handleInputChange('responsavel_id', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      item.responsavel_nome || '-'
                    )}
                  </TableCell>

                  <TableCell>
                    {editableRow === item.id ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-[180px] justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editValues.previsao
                              ? format(new Date(editValues.previsao), "dd/MM/yyyy", { locale: ptBR })
                              : "Selecione uma data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            locale={ptBR}
                            mode="single"
                            selected={editValues.previsao ? new Date(editValues.previsao) : undefined}
                            onSelect={(date) => handleInputChange('previsao', date ? format(date, 'yyyy-MM-dd') : null)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      item.previsao ? format(new Date(item.previsao), "dd/MM/yyyy", { locale: ptBR }) : '-'
                    )}
                  </TableCell>

                  <TableCell className="max-w-xs">
                    {editableRow === item.id ? (
                      <Textarea
                        value={editValues.conteudo || ''}
                        onChange={(e) => handleInputChange('conteudo', e.target.value)}
                        className="w-full h-28 resize-none"
                        placeholder="Descreva o conteúdo..."
                      />
                    ) : (
                      <div className="max-h-32 overflow-y-auto break-words">
                        {item.conteudo || '-'}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {editableRow === item.id ? (
                      <Select
                        value={editValues.objetivo || ''}
                        onValueChange={(value) => handleInputChange('objetivo', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="🟡 Atrair Atenção">🟡 Atrair Atenção</SelectItem>
                          <SelectItem value="🟢 Criar Conexão">🟢 Criar Conexão</SelectItem>
                          <SelectItem value="🔴 Fazer Comprar">🔴 Fazer Comprar</SelectItem>
                          <SelectItem value="🔁 Reativar Interesse">🔁 Reativar Interesse</SelectItem>
                          <SelectItem value="✅ Fechar Agora">✅ Fechar Agora</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      item.objetivo
                    )}
                  </TableCell>

                  <TableCell>
                    {editableRow === item.id ? (
                      <Select
                        value={editValues.prioridade || ''}
                        onValueChange={(value) => handleInputChange('prioridade', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Média">Média</SelectItem>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getPriorityColor(item.prioridade)}>
                        {item.prioridade}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    {editableRow === item.id ? (
                      <Select
                        value={editValues.status || ''}
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planejado">Planejado</SelectItem>
                          <SelectItem value="Em andamento">Em andamento</SelectItem>
                          <SelectItem value="Finalizado">Finalizado</SelectItem>
                          <SelectItem value="Standby">Standby</SelectItem>
                          <SelectItem value="Suspenso">Suspenso</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    {editableRow === item.id ? (
                      <>
                        <Button 
                          variant="ghost"
                          size="sm" 
                          onClick={handleCancelClick}
                          className="mr-1"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancelar</span>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={handleSaveClick}
                          disabled={isLoading[item.id]}
                        >
                          {isLoading[item.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          <span className="sr-only">Salvar</span>
                        </Button>
                      </>
                    ) : (
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(item)}
                          title="Editar"
                        >
                          <FileEdit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateContent(item)}
                          disabled={isLoading[`generate-${item.id}`]}
                          title="Gerar conteúdo com IA"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          {isLoading[`generate-${item.id}`] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                          <span className="sr-only">Gerar conteúdo</span>
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleSchedule(item)}
                          disabled={isLoading[`schedule-${item.id}`] || !item.previsao}
                          title="Adicionar à agenda"
                          className="text-green-600 hover:text-green-700"
                        >
                          {isLoading[`schedule-${item.id}`] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CalendarPlus className="h-4 w-4" />
                          )}
                          <span className="sr-only">Agendar</span>
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteDialog({ open: true, itemId: item.id })}
                          title="Excluir"
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este item da estratégia de conteúdo? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertDescription>
              Todos os dados relacionados a este item serão perdidos permanentemente.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false, itemId: null })}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isLoading[`delete-${deleteDialog.itemId}`]}
            >
              {isLoading[`delete-${deleteDialog.itemId}`] ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
