import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import EquipmentForm from '@/components/admin/EquipmentForm';
import { Equipment } from '@/types/equipment';
import { getEquipmentById, updateEquipment } from '@/api/equipment';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditEquipment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!id) {
        setError('ID do equipamento não fornecido');
        setLoading(false);
        return;
      }

      try {
        const data = await getEquipmentById(id);
        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        setError('Não foi possível carregar o equipamento');
        toast({
          variant: "destructive",
          title: "Erro ao carregar equipamento",
          description: "Não foi possível carregar os dados do equipamento."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id, toast]);

  const handleSave = async (updatedEquipment: Equipment) => {
    if (!id) return;
    
    try {
      const savedEquipment = await updateEquipment(id, updatedEquipment);
      toast({
        title: "Equipamento atualizado",
        description: `${updatedEquipment.nome} foi atualizado com sucesso.`
      });
      navigate('/admin/equipments');
      return savedEquipment;
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw error; // Re-throw so EquipmentForm can handle it
    }
  };

  const handleCancel = () => {
    navigate('/admin/equipments');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="aurora-dark-bg min-h-screen flex items-center justify-center">
          <div className="aurora-glass rounded-3xl p-8 flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-aurora-electric-purple" />
            <span className="aurora-body text-white">Carregando equipamento...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !equipment) {
    return (
      <AdminLayout>
        <div className="aurora-dark-bg min-h-screen flex items-center justify-center">
          <div className="aurora-glass rounded-3xl p-8 text-center">
            <h2 className="aurora-text-gradient text-2xl font-light mb-4">
              Equipamento não encontrado
            </h2>
            <p className="aurora-body text-white/70 mb-6">
              {error || 'O equipamento solicitado não foi encontrado.'}
            </p>
            <Button
              onClick={handleCancel}
              className="aurora-button"
            >
              Voltar para Lista
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="aurora-dark-bg min-h-screen">
        <div className="aurora-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="aurora-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${10 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto py-8 px-4 relative z-10">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Lista
            </Button>
          </div>

          <div className="aurora-glass rounded-3xl p-8 backdrop-blur-2xl border border-aurora-electric-purple/20">
            <div className="mb-8">
              <h1 className="aurora-text-gradient text-3xl font-light mb-2">
                Editar Equipamento
              </h1>
              <p className="aurora-body text-white/70">
                Edite os dados do equipamento {equipment.nome}.
              </p>
            </div>

            <EquipmentForm
              equipment={equipment}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditEquipment;
