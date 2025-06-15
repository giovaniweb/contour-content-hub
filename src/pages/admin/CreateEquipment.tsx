import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import EquipmentForm from '@/components/admin/EquipmentForm';
import { Equipment } from '@/types/equipment';
import { createEquipment } from '@/api/equipment';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreateEquipment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async (equipment: Equipment) => {
    try {
      await createEquipment(equipment);
      toast({
        title: "Equipamento criado",
        description: `${equipment.nome} foi criado com sucesso.`
      });
      navigate('/admin/equipments');
    } catch (error) {
      console.error('Error creating equipment:', error);
      throw error; // Re-throw so EquipmentForm can handle it
    }
  };

  const handleCancel = () => {
    navigate('/admin/equipments');
  };

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
                Criar Novo Equipamento
              </h1>
              <p className="aurora-body text-white/70">
                Preencha os campos abaixo para adicionar um novo equipamento ao sistema.
              </p>
            </div>

            <EquipmentForm
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateEquipment;
