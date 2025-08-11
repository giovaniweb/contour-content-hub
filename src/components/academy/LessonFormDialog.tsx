import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Save, Loader2, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LessonFormData {
  title: string;
  description: string;
  vimeo_url: string;
  duration_minutes: number;
  is_mandatory: boolean;
  order_index: number;
}

interface LessonFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LessonFormData) => Promise<void>;
  courseId: string;
  initialData?: Partial<LessonFormData>;
  isLoading?: boolean;
}

export const LessonFormDialog: React.FC<LessonFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courseId,
  initialData,
  isLoading = false
}) => {
  const { toast } = useToast();
  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  
  const [formData, setFormData] = useState<LessonFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    vimeo_url: initialData?.vimeo_url || '',
    duration_minutes: initialData?.duration_minutes || 0,
    is_mandatory: initialData?.is_mandatory ?? true,
    order_index: initialData?.order_index || 0
  });

  const fetchVimeoMetadata = async () => {
    if (!formData.vimeo_url) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL do Vimeo primeiro",
        variant: "destructive"
      });
      return;
    }

    setFetchingMetadata(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-vimeo-metadata', {
        body: { vimeoUrl: formData.vimeo_url }
      });

      if (error) {
        throw error;
      }

      // Auto-fill form with Vimeo data
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        duration_minutes: data.duration_minutes || prev.duration_minutes
      }));

      toast({
        title: "Sucesso!",
        description: "Dados do Vimeo carregados com sucesso",
      });

    } catch (error) {
      console.error('Error fetching Vimeo metadata:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar dados do Vimeo. Verifique a URL e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setFetchingMetadata(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof LessonFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Aula' : 'Nova Aula'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Título da Aula *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Introdução ao equipamento"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva o conteúdo da aula..."
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="vimeo_url">URL do Vídeo (Vimeo) *</Label>
              <div className="flex gap-2">
                <Input
                  id="vimeo_url"
                  value={formData.vimeo_url}
                  onChange={(e) => handleInputChange('vimeo_url', e.target.value)}
                  placeholder="https://vimeo.com/..."
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchVimeoMetadata}
                  disabled={fetchingMetadata || !formData.vimeo_url}
                  className="shrink-0"
                >
                  {fetchingMetadata ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Cole a URL completa do vídeo no Vimeo e clique no botão para buscar os dados automaticamente
              </p>
            </div>

            <div>
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={formData.duration_minutes}
                onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="order">Ordem da Aula</Label>
              <Input
                id="order"
                type="number"
                min="0"
                value={formData.order_index}
                onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="col-span-2 flex items-center space-x-3">
              <Switch
                id="mandatory"
                checked={formData.is_mandatory}
                onCheckedChange={(checked) => handleInputChange('is_mandatory', checked)}
              />
              <Label htmlFor="mandatory">Aula obrigatória</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Aula'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};