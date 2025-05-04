
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { createContentStrategyItem, updateContentStrategyItem } from '@/services/contentStrategyCore';
import { ContentStrategyItem, ContentCategory, ContentFormat, ContentObjective, ContentStatus, ContentDistribution } from '@/types/content-strategy';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateContentWithAI } from '@/services/contentStrategyIntegrations';
import { useToast } from '@/hooks/use-toast';

interface ContentStrategyFormProps {
  item?: ContentStrategyItem;
  equipamentos: { id: string; nome: string }[];
  responsaveis: { id: string; nome: string }[];
  onClose: () => void;
  onSave: () => void;
}

export default function ContentStrategyForm({ item, equipamentos, responsaveis, onClose, onSave }: ContentStrategyFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ContentStrategyItem>>({
    id: item?.id || undefined,
    equipamento_id: item?.equipamento_id || '_none',
    categoria: item?.categoria || 'vendas',
    formato: item?.formato || 'story',
    responsavel_id: item?.responsavel_id || '_none',
    previsao: item?.previsao || null,
    conteudo: item?.conteudo || '',
    objetivo: item?.objetivo || '🟡 Atrair Atenção',
    status: item?.status || 'Planejado',
    distribuicao: item?.distribuicao || 'Instagram',
    equipamento_nome: item?.equipamento_nome,
    responsavel_nome: item?.responsavel_nome,
  });

  const handleChange = (field: keyof ContentStrategyItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const isoDate = date.toISOString();
      handleChange('previsao', isoDate);
    }
  };

  const handleGenerateContent = async () => {
    try {
      setLoading(true);
      const generatedContent = await generateContentWithAI(formData);
      if (generatedContent) {
        handleChange('conteudo', generatedContent);
        toast({
          title: "Conteúdo gerado",
          description: "Conteúdo gerado com sucesso usando IA."
        });
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure we cast the string values to their proper typed enums
      const typedFormData: Partial<ContentStrategyItem> = {
        ...formData,
        categoria: formData.categoria as ContentCategory,
        formato: formData.formato as ContentFormat,
        objetivo: formData.objetivo as ContentObjective,
        status: formData.status as ContentStatus,
        distribuicao: formData.distribuicao as ContentDistribution
      };

      if (item?.id) {
        await updateContentStrategyItem(item.id, typedFormData);
      } else {
        await createContentStrategyItem(typedFormData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving content strategy item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? 'Editar Item de Estratégia' : 'Novo Item de Estratégia'}</DialogTitle>
          <DialogDescription>
            {item ? 'Atualize os detalhes deste item' : 'Adicione um novo item à sua estratégia de conteúdo'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="equipamento">Equipamento</Label>
            <Select
              value={formData.equipamento_id || '_none'}
              onValueChange={(value) => handleChange('equipamento_id', value === '_none' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um equipamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Nenhum</SelectItem>
                {equipamentos.map(equipamento => (
                  <SelectItem key={equipamento.id} value={equipamento.id}>
                    {equipamento.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select
              value={formData.categoria || 'vendas'}
              onValueChange={(value) => handleChange('categoria', value as ContentCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="formato">Formato</Label>
            <Select
              value={formData.formato || 'story'}
              onValueChange={(value) => handleChange('formato', value as ContentFormat)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um formato" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Select
              value={formData.responsavel_id || '_none'}
              onValueChange={(value) => handleChange('responsavel_id', value === '_none' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Nenhum</SelectItem>
                {responsaveis.map(responsavel => (
                  <SelectItem key={responsavel.id} value={responsavel.id}>
                    {responsavel.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="previsao">Previsão</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.previsao ? (
                    format(new Date(formData.previsao), 'PPP', { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.previsao ? new Date(formData.previsao) : undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="conteudo">Conteúdo</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateContent}
                disabled={loading}
              >
                Gerar com IA
              </Button>
            </div>
            <Textarea
              id="conteudo"
              value={formData.conteudo || ''}
              onChange={(e) => handleChange('conteudo', e.target.value)}
              placeholder="Descreva o conteúdo..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo</Label>
            <Select
              value={formData.objetivo || '🟡 Atrair Atenção'}
              onValueChange={(value) => handleChange('objetivo', value as ContentObjective)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="🟡 Atrair Atenção">🟡 Atrair Atenção</SelectItem>
                <SelectItem value="🟢 Criar Conexão">🟢 Criar Conexão</SelectItem>
                <SelectItem value="🔴 Fazer Comprar">🔴 Fazer Comprar</SelectItem>
                <SelectItem value="🔁 Reativar Interesse">🔁 Reativar Interesse</SelectItem>
                <SelectItem value="✅ Fechar Agora">✅ Fechar Agora</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || 'Planejado'}
              onValueChange={(value) => handleChange('status', value as ContentStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planejado">Planejado</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Standby">Standby</SelectItem>
                <SelectItem value="Suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="distribuicao">Distribuição</Label>
            <Select
              value={formData.distribuicao || 'Instagram'}
              onValueChange={(value) => handleChange('distribuicao', value as ContentDistribution)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Blog">Blog</SelectItem>
                <SelectItem value="Múltiplos">Múltiplos</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : item ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
