import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CourseFormData } from '@/types/academy';
import { supabase } from '@/integrations/supabase/client';

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CourseFormData>;
}

export const CourseForm: React.FC<CourseFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData
}) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    equipment_id: '',
    difficulty_level: 'beginner',
    estimated_duration_hours: 1,
    gamification_points: 100,
    has_final_exam: false,
    has_satisfaction_survey: false,
    ...initialData
  });

  const [equipments, setEquipments] = useState<Array<{id: string, nome: string}>>([]);

  useEffect(() => {
    const fetchEquipments = async () => {
      const { data } = await supabase
        .from('equipamentos')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');
      
      if (data) setEquipments(data);
    };

    fetchEquipments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="title">Título do Curso *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ex: Curso de Radiofrequência Avançada"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descreva o conteúdo e objetivos do curso..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="equipment">Equipamento</Label>
          <Select value={formData.equipment_id} onValueChange={(value) => handleInputChange('equipment_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um equipamento" />
            </SelectTrigger>
            <SelectContent>
              {equipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="difficulty">Nível de Dificuldade</Label>
          <Select value={formData.difficulty_level} onValueChange={(value: any) => handleInputChange('difficulty_level', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Iniciante</SelectItem>
              <SelectItem value="intermediate">Intermediário</SelectItem>
              <SelectItem value="advanced">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration">Duração Estimada (horas)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="100"
            value={formData.estimated_duration_hours}
            onChange={(e) => handleInputChange('estimated_duration_hours', parseInt(e.target.value) || 1)}
          />
        </div>

        <div>
          <Label htmlFor="points">Pontos de Gamificação</Label>
          <Input
            id="points"
            type="number"
            min="0"
            value={formData.gamification_points}
            onChange={(e) => handleInputChange('gamification_points', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="final-exam">Possui Exame Final</Label>
            <Switch
              id="final-exam"
              checked={formData.has_final_exam}
              onCheckedChange={(checked) => handleInputChange('has_final_exam', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="satisfaction-survey">Possui Pesquisa de Satisfação</Label>
            <Switch
              id="satisfaction-survey"
              checked={formData.has_satisfaction_survey}
              onCheckedChange={(checked) => handleInputChange('has_satisfaction_survey', checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || !formData.title.trim()}>
          {isLoading ? 'Salvando...' : 'Salvar Curso'}
        </Button>
      </div>
    </form>
  );
};