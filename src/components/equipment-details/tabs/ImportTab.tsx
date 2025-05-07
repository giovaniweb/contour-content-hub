
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePermissions } from '@/hooks/use-permissions';

interface ImportTabProps {
  id?: string;
  onCompleteImport: (importedData: any) => void;
}

export const ImportTab: React.FC<ImportTabProps> = ({ id, onCompleteImport }) => {
  const { isAdmin } = usePermissions();
  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Importar Vídeo</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        {isAdmin() ? (
          <>
            <p className="text-gray-600 mb-4">
              Você pode fazer upload de vídeos diretamente para este equipamento.
            </p>
            <Button asChild>
              <Link to="/admin/videos/batch-import">
                <Upload className="mr-2 h-4 w-4" />
                Ir para o módulo de upload
              </Link>
            </Button>
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
