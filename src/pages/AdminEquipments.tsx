
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import EquipmentManager from '@/components/admin/EquipmentManager';
import { Button } from '@/components/ui/button';
import { getEquipments, importEquipments } from '@/api/equipment';
import { Equipment } from '@/types/equipment';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminEquipments: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await getEquipments();
        setEquipment(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar equipamentos",
          description: "Não foi possível carregar a lista de equipamentos.",
        });
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [toast]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const imported = await importEquipments(file);
      
      if (Array.isArray(imported)) {
        setEquipment(prev => [...prev, ...imported]);
        
        toast({
          title: "Importação concluída",
          description: `Foram importados ${imported.length} equipamentos.`,
        });
      }
    } catch (error) {
      console.error('Error importing equipment:', error);
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: "Não foi possível importar os equipamentos.",
      });
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Administração de Equipamentos">
        <div className="aurora-dark-bg min-h-screen flex items-center justify-center">
          <div className="aurora-glass rounded-3xl p-8 flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-aurora-electric-purple" />
            <span className="aurora-body text-white">Carregando equipamentos...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="aurora-dark-bg min-h-screen">
        <div className="aurora-particles">
          {[...Array(15)].map((_, i) => (
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
          <div className="mb-8">
            <h1 className="aurora-text-gradient text-4xl font-light mb-4">
              Gerenciar Equipamentos
            </h1>
            <p className="aurora-body text-white/70 text-lg">
              Administre os equipamentos do sistema de forma intuitiva e eficiente.
            </p>
          </div>

          <div className="flex justify-end mb-6">
            <div>
              <Label htmlFor="import-file" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm px-4 py-2 aurora-glass border border-aurora-electric-purple/30 rounded-lg hover:bg-aurora-electric-purple/20 transition-colors text-white">
                  <Upload className="h-4 w-4" />
                  {importing ? 'Importando...' : 'Importar Equipamentos'}
                </div>
                <Input 
                  id="import-file" 
                  type="file" 
                  className="hidden" 
                  accept=".csv,.xlsx,.json"
                  onChange={handleImport}
                  disabled={importing}
                />
              </Label>
            </div>
          </div>
          
          <div className="aurora-glass rounded-3xl p-8 backdrop-blur-2xl border border-aurora-electric-purple/20">
            <EquipmentManager />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminEquipments;
