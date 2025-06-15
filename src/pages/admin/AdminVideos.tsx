
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AdminVideoManager from '@/components/admin/AdminVideoManager';
import { Video } from 'lucide-react';

const AdminVideos: React.FC = () => {
  return (
    <AppLayout requireAdmin={true}>
      <div className="container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Video className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Administração de Vídeos</h1>
            <p className="text-slate-400">Sistema de upload em massa e gerenciamento de vídeos</p>
          </div>
        </div>

        {/* Admin Video Manager */}
        <AdminVideoManager />
      </div>
    </AppLayout>
  );
};

export default AdminVideos;
