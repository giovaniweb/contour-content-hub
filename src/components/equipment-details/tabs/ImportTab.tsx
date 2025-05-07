
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePermissions } from '@/hooks/use-permissions';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import VideoUploader from '@/components/video-storage/VideoUploader';
import { useState } from 'react';

interface ImportTabProps {
  id?: string;
  onCompleteImport: (importedData: any) => void;
}

export const ImportTab: React.FC<ImportTabProps> = ({ id, onCompleteImport }) => {
  const { isAdmin } = usePermissions();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  const handleImportComplete = (videoId: string) => {
    setShowUploadDialog(false);
    if (onCompleteImport) {
      onCompleteImport({ videoId });
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Importar Vídeo</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        {isAdmin() ? (
          <>
            <p className="text-gray-600 mb-4">
              Você pode fazer upload de vídeos diretamente para este equipamento.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setShowUploadDialog(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Fazer upload para este equipamento
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/videos">
                  <Upload className="mr-2 h-4 w-4" />
                  Ir para o módulo de upload
                </Link>
              </Button>
            </div>
            
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogContent className="sm:max-w-lg">
                <VideoUploader 
                  onUploadComplete={handleImportComplete}
                  onCancel={() => setShowUploadDialog(false)}
                  equipmentId={id}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <p className="text-gray-600 mb-4">
            Apenas administradores podem fazer upload de vídeos para equipamentos.
          </p>
        )}
      </div>
    </div>
  );
};
