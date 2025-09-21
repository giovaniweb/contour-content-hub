import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { photoService, UpdatePhotoData } from '@/services/photoService';
import TagInput from '@/components/ui/TagInput';

interface BulkPhotoEditorProps {
  selectedPhotos: Set<string>;
  onComplete: () => void;
  onCancel: () => void;
}

interface BulkUpdateFields {
  titulo?: boolean;
  descricao_curta?: boolean;
  categoria?: boolean;
  tags?: boolean;
}

const BulkPhotoEditor: React.FC<BulkPhotoEditorProps> = ({
  selectedPhotos,
  onComplete,
  onCancel
}) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  
  const [fieldsToUpdate, setFieldsToUpdate] = useState<BulkUpdateFields>({});
  const [formData, setFormData] = useState<UpdatePhotoData>({
    titulo: '',
    descricao_curta: '',
    categoria: '',
    tags: []
  });

  const handleFieldToggle = (field: keyof BulkUpdateFields, enabled: boolean) => {
    setFieldsToUpdate(prev => ({
      ...prev,
      [field]: enabled
    }));
  };

  const handleInputChange = (field: keyof UpdatePhotoData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBulkUpdate = async () => {
    try {
      setUpdating(true);
      
      // Criar objeto de atualização apenas com os campos selecionados
      const updateData: UpdatePhotoData = {};
      
      if (fieldsToUpdate.titulo && formData.titulo) {
        updateData.titulo = formData.titulo;
      }
      
      if (fieldsToUpdate.descricao_curta && formData.descricao_curta !== undefined) {
        updateData.descricao_curta = formData.descricao_curta;
      }
      
      if (fieldsToUpdate.categoria && formData.categoria) {
        updateData.categoria = formData.categoria;
      }
      
      if (fieldsToUpdate.tags && formData.tags) {
        updateData.tags = formData.tags;
      }
      
      // Verificar se há pelo menos um campo selecionado
      if (Object.keys(updateData).length === 0) {
        toast({
          title: "Nenhum campo selecionado",
          description: "Selecione pelo menos um campo para atualizar.",
          variant: "destructive"
        });
        return;
      }
      
      // Atualizar todas as fotos selecionadas
      const updatePromises = Array.from(selectedPhotos).map(photoId =>
        photoService.updatePhoto(photoId, updateData)
      );
      
      const results = await Promise.all(updatePromises);
      
      // Verificar se houve erros
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        toast({
          title: "Alguns erros ocorreram",
          description: `${errors.length} foto(s) não puderam ser atualizadas.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Fotos atualizadas",
          description: `${selectedPhotos.size} foto(s) foram atualizadas com sucesso.`
        });
      }
      
      onComplete();
      
    } catch (error) {
      console.error('Erro na atualização em massa:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar as fotos.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const hasSelectedFields = Object.values(fieldsToUpdate).some(Boolean);

  return (
    <Card className="aurora-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Edit className="h-5 w-5" />
          Editar {selectedPhotos.size} foto(s) selecionada(s)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Selecione os campos que deseja atualizar e digite os novos valores.
          Apenas os campos marcados serão alterados em todas as fotos selecionadas.
        </div>

        <div className="space-y-4">
          {/* Título */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="titulo-field"
              checked={fieldsToUpdate.titulo || false}
              onCheckedChange={(checked) => handleFieldToggle('titulo', checked as boolean)}
            />
            <div className="flex-1 space-y-2">
              <Label htmlFor="titulo-field" className="cursor-pointer">
                Alterar Título
              </Label>
              <Input
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Novo título para todas as fotos"
                disabled={!fieldsToUpdate.titulo}
                className={!fieldsToUpdate.titulo ? 'opacity-50' : ''}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="descricao-field"
              checked={fieldsToUpdate.descricao_curta || false}
              onCheckedChange={(checked) => handleFieldToggle('descricao_curta', checked as boolean)}
            />
            <div className="flex-1 space-y-2">
              <Label htmlFor="descricao-field" className="cursor-pointer">
                Alterar Descrição
              </Label>
              <Textarea
                value={formData.descricao_curta}
                onChange={(e) => handleInputChange('descricao_curta', e.target.value)}
                placeholder="Nova descrição para todas as fotos"
                disabled={!fieldsToUpdate.descricao_curta}
                className={!fieldsToUpdate.descricao_curta ? 'opacity-50' : ''}
                rows={3}
              />
            </div>
          </div>

          {/* Categoria */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="categoria-field"
              checked={fieldsToUpdate.categoria || false}
              onCheckedChange={(checked) => handleFieldToggle('categoria', checked as boolean)}
            />
            <div className="flex-1 space-y-2">
              <Label htmlFor="categoria-field" className="cursor-pointer">
                Alterar Categoria
              </Label>
              <Input
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                placeholder="Nova categoria para todas as fotos"
                disabled={!fieldsToUpdate.categoria}
                className={!fieldsToUpdate.categoria ? 'opacity-50' : ''}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="tags-field"
              checked={fieldsToUpdate.tags || false}
              onCheckedChange={(checked) => handleFieldToggle('tags', checked as boolean)}
            />
            <div className="flex-1 space-y-2">
              <Label htmlFor="tags-field" className="cursor-pointer">
                Alterar Tags
              </Label>
              <TagInput
                value={formData.tags || []}
                onChange={(tags) => handleInputChange('tags', tags)}
                placeholder="Novas tags para todas as fotos"
                disabled={!fieldsToUpdate.tags}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            onClick={handleBulkUpdate}
            disabled={updating || !hasSelectedFields}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {updating ? 'Atualizando...' : 'Aplicar Alterações'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={updating}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkPhotoEditor;