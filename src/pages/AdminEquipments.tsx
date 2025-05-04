
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import EquipmentManager from '@/components/admin/EquipmentManager';
import { Button } from '@/components/ui/button';
import { getEquipments, importEquipments } from '@/utils/api-equipment';
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
      
      // Updated to check if imported is an array with imported property
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Administração de Equipamentos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciar Equipamentos</h1>
          
          <div className="flex gap-2 items-center">
            <div>
              <Label htmlFor="import-file" className="cursor-pointer">
                <div className="flex items-center gap-1 text-sm px-3 py-1 border rounded-md bg-background hover:bg-accent">
                  <Upload className="h-4 w-4" />
                  {importing ? 'Importando...' : 'Importar'}
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
        </div>

        <EquipmentManager />
      </div>
    </Layout>
  );
};

export default AdminEquipments;
