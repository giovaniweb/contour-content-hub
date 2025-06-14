
import React from 'react';
import { Video, Plus, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

const AdminVideos: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Video className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Administração de Vídeos</h1>
            <p className="text-slate-400">Gerencie todos os vídeos da plataforma</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Importar Vídeos
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        icon={Video}
        title="Nenhum vídeo encontrado"
        description="Configure a integração com Vimeo ou importe vídeos"
        actionLabel="Configurar Vimeo"
        actionIcon={Settings}
        onAction={() => console.log('Configure Vimeo')}
      />
    </div>
  );
};

export default AdminVideos;
