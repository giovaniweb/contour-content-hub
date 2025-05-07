
import React from 'react';

interface ImportTabProps {
  id?: string;
  onCompleteImport: (importedData: any) => void;
}

export const ImportTab: React.FC<ImportTabProps> = ({ id, onCompleteImport }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Importar Vídeo</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-600 mb-4">
          Funcionalidade em desenvolvimento. Em breve você poderá importar vídeos diretamente para o equipamento.
        </p>
      </div>
    </div>
  );
};
