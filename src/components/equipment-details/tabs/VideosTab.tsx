
import React from 'react';
import { Button } from "@/components/ui/button";
import { Video } from 'lucide-react';

interface VideosTabProps {
  setActiveTab: (tab: string) => void;
}

export const VideosTab: React.FC<VideosTabProps> = ({ setActiveTab }) => {
  return (
    <div className="text-center py-10">
      <Video className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">Sem vídeos</h3>
      <p className="text-muted-foreground mt-2">
        Não há vídeos disponíveis para este equipamento.
      </p>
      <div className="flex justify-center mt-4 gap-2">
        <Button onClick={() => setActiveTab('import')}>
          Importar Vídeo
        </Button>
      </div>
    </div>
  );
};
