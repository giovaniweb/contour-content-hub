
import React from 'react';
import VimeoImporter from '@/components/admin/VimeoImporter';

interface ImportTabProps {
  id?: string;
  onCompleteImport: (importedData: any) => void;
}

export const ImportTab: React.FC<ImportTabProps> = ({ id, onCompleteImport }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Importar Vídeo do Vimeo</h2>
      <VimeoImporter 
        onCompleteImport={onCompleteImport}
        selectedEquipmentId={id}
      />
    </div>
  );
};
