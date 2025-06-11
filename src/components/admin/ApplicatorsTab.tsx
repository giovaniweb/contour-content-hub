
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { EquipmentApplicator } from '@/types/equipment';

interface ApplicatorsTabProps {
  applicators: EquipmentApplicator[];
  onApplicatorsChange: (applicators: EquipmentApplicator[]) => void;
}

const ApplicatorsTab: React.FC<ApplicatorsTabProps> = ({
  applicators,
  onApplicatorsChange
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    technology: '',
    description: '',
    image_url: ''
  });

  const startEdit = (applicator: EquipmentApplicator) => {
    setEditingId(applicator.id);
    setFormData({
      name: applicator.name,
      technology: applicator.technology || '',
      description: applicator.description || '',
      image_url: applicator.image_url || ''
    });
  };

  const startAdd = () => {
    setIsAdding(true);
    setFormData({
      name: '',
      technology: '',
      description: '',
      image_url: ''
    });
  };

  const saveApplicator = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      // Update existing
      const updated = applicators.map(app => 
        app.id === editingId 
          ? { ...app, ...formData }
          : app
      );
      onApplicatorsChange(updated);
      setEditingId(null);
    } else {
      // Add new
      const newApplicator: EquipmentApplicator = {
        id: `temp-${Date.now()}`, // Temporary ID
        equipment_id: '',
        name: formData.name,
        technology: formData.technology,
        description: formData.description,
        image_url: formData.image_url,
        active: true,
        order_index: applicators.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      onApplicatorsChange([...applicators, newApplicator]);
      setIsAdding(false);
    }

    setFormData({ name: '', technology: '', description: '', image_url: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', technology: '', description: '', image_url: '' });
  };

  const deleteApplicator = (id: string) => {
    onApplicatorsChange(applicators.filter(app => app.id !== id));
  };

  const ApplicatorForm = () => (
    <Card className="mb-4 bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-sm text-white">
          {editingId ? 'Editar Ponteira' : 'Nova Ponteira'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="applicator-name" className="text-white">Nome da Ponteira*</Label>
            <Input
              id="applicator-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Ponteira 15mm"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label htmlFor="applicator-technology" className="text-white">Tecnologia</Label>
            <Input
              id="applicator-technology"
              value={formData.technology}
              onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
              placeholder="Ex: Radiofrequência monopolar"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="applicator-description" className="text-white">Descrição</Label>
          <Textarea
            id="applicator-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descrição da ponteira e sua aplicação..."
            rows={2}
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>

        <div>
          <Label htmlFor="applicator-image" className="text-white">URL da Imagem</Label>
          <Input
            id="applicator-image"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://..."
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          />
          {formData.image_url && (
            <div className="mt-2">
              <img 
                src={formData.image_url} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded border border-slate-600"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={saveApplicator} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          <Button 
            onClick={cancelEdit} 
            variant="outline" 
            size="sm"
            className="border-slate-600 hover:bg-slate-700 text-white"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Ponteiras do Equipamento</h3>
        {!isAdding && !editingId && (
          <Button onClick={startAdd} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Ponteira
          </Button>
        )}
      </div>

      {(isAdding || editingId) && <ApplicatorForm />}

      <div className="space-y-3">
        {applicators.map((applicator) => (
          <Card key={applicator.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {applicator.image_url ? (
                    <img 
                      src={applicator.image_url} 
                      alt={applicator.name}
                      className="w-16 h-16 object-cover rounded border border-slate-600"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-700 rounded border border-slate-600 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{applicator.name}</h4>
                    {applicator.technology && (
                      <p className="text-sm text-slate-300 mt-1">
                        <strong>Tecnologia:</strong> {applicator.technology}
                      </p>
                    )}
                    {applicator.description && (
                      <p className="text-sm text-slate-300 mt-1">{applicator.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startEdit(applicator)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 hover:bg-slate-700 text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteApplicator(applicator.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-600 hover:bg-red-700 text-red-300 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {applicators.length === 0 && !isAdding && (
        <div className="text-center py-8 text-white">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p>Nenhuma ponteira cadastrada</p>
          <p className="text-sm text-slate-400">Clique em "Adicionar Ponteira" para começar</p>
        </div>
      )}
    </div>
  );
};

export default ApplicatorsTab;
