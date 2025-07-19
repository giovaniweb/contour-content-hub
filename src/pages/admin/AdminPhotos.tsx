import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AdminPhotoManager from '@/components/admin/AdminPhotoManager';
import { Camera, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminPhotos: React.FC = () => {
  return (
    <AppLayout requireAdmin={true}>
      <div className="container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-slate-50">Gerenciamento de Fotos</h1>
              <p className="text-slate-400">Visualize e gerencie todas as fotos cadastradas</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/admin/photos/upload'}
            className="bg-aurora-electric-purple hover:bg-aurora-electric-purple/80 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Fotos
          </Button>
        </div>

        {/* Admin Photo Manager */}
        <AdminPhotoManager />
      </div>
    </AppLayout>
  );
};

export default AdminPhotos;