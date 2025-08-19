import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LessonFormData } from '@/hooks/useAcademyLessons';

interface LessonFormProps {
  onSubmit: (data: LessonFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<LessonFormData>;
  nextOrderIndex?: number;
}

export const LessonForm: React.FC<LessonFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  nextOrderIndex = 1
}) => {
  const [formData, setFormData] = useState<LessonFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    vimeo_url: initialData?.vimeo_url || '',
    order_index: initialData?.order_index || nextOrderIndex,
    duration_minutes: initialData?.duration_minutes || 30,
    is_mandatory: initialData?.is_mandatory ?? true
  });

  const validateVimeoUrl = (url: string) => {
    const vimeoRegex = /^https?:\/\/(www\.)?vimeo\.com\/\d+/;
    return vimeoRegex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Título é obrigatório');
      return;
    }
    
    if (!formData.vimeo_url.trim()) {
      alert('URL do Vimeo é obrigatória');
      return;
    }
    
    if (!validateVimeoUrl(formData.vimeo_url)) {
      alert('URL do Vimeo inválida. Use o formato: https://vimeo.com/123456789');
      return;
    }
    
    if (!formData.duration_minutes || formData.duration_minutes < 1) {
      alert('Duração deve ser pelo menos 1 minuto');
      return;
    }
    
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof LessonFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título da Aula *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Digite o título da aula"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Descreva o conteúdo da aula"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vimeo_url">URL do Vídeo Vimeo *</Label>
        <Input
          id="vimeo_url"
          value={formData.vimeo_url}
          onChange={(e) => handleInputChange('vimeo_url', e.target.value)}
          placeholder="https://vimeo.com/123456789"
          required
          className={formData.vimeo_url && !validateVimeoUrl(formData.vimeo_url) ? 
            'border-red-500 focus:border-red-500' : ''}
        />
        {formData.vimeo_url && !validateVimeoUrl(formData.vimeo_url) && (
          <p className="text-xs text-red-400 mt-1">
            URL inválida. Use o formato: https://vimeo.com/123456789
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="order_index">Ordem da Aula</Label>
          <Input
            id="order_index"
            type="number"
            min="1"
            value={formData.order_index}
            onChange={(e) => handleInputChange('order_index', parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration_minutes">Duração (minutos)</Label>
          <Input
            id="duration_minutes"
            type="number"
            min="1"
            value={formData.duration_minutes}
            onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_mandatory"
          checked={formData.is_mandatory}
          onCheckedChange={(checked) => handleInputChange('is_mandatory', checked)}
        />
        <Label htmlFor="is_mandatory">Aula obrigatória</Label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!formData.title || !formData.vimeo_url || isLoading || 
                   !validateVimeoUrl(formData.vimeo_url) || formData.duration_minutes < 1}
        >
          {isLoading ? 'Salvando...' : 'Salvar Aula'}
        </Button>
      </div>
    </form>
  );
};