import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AdminPhotoManager from '@/components/admin/AdminPhotoManager';
import { Camera } from 'lucide-react';

const AdminPhotos: React.FC = () => {
  return (
    <AppLayout requireAdmin={true}>
      <div className="container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Camera className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Gerenciamento de Fotos</h1>
            <p className="text-slate-400">Visualize e gerencie todas as fotos cadastradas</p>
          </div>
        </div>

        {/* Admin Photo Manager */}
        <AdminPhotoManager />
      </div>
    </AppLayout>
  );
};

export default AdminPhotos;