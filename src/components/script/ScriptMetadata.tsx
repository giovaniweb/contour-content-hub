
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ScriptMetadataProps {
  type: string;
  marketingObjective?: string;
  observation?: string;
}

const ScriptMetadata: React.FC<ScriptMetadataProps> = ({ 
  type, 
  marketingObjective,
  observation 
}) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'videoScript':
        return "Roteiro para Vídeo";
      case 'bigIdea':
        return "Campanha Criativa";
      case 'dailySales':
        return "Vendas Diárias";
      default:
        return type;
    }
  };

  return (
    <>
      <Badge variant="secondary">{getTypeLabel(type)}</Badge>
      
      {marketingObjective && (
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <h4 className="font-medium text-sm text-blue-800 mb-1">Objetivo de marketing</h4>
          <p className="text-sm text-blue-600">
            {marketingObjective === "atrair_atencao" ? "Atrair atenção" :
             marketingObjective === "criar_conexao" ? "Criar conexão" :
             marketingObjective === "fazer_comprar" ? "Incentivar compra" :
             marketingObjective === "reativar_interesse" ? "Reativar interesse" :
             marketingObjective === "fechar_agora" ? "Fechar agora" :
             marketingObjective}
          </p>
        </div>
      )}

      {observation && (
        <div className="bg-amber-50 p-3 rounded-md">
          <h4 className="font-medium text-sm text-amber-800 mb-1">Observações</h4>
          <p className="text-sm text-amber-600">{observation}</p>
        </div>
      )}
    </>
  );
};

export default ScriptMetadata;
