
import React from 'react';
import { Equipment } from '@/types/equipment';

interface DetailsTabProps {
  equipment: Equipment;
}

// Helper function to format indicacoes
const formatIndicacoes = (indicacoes: string | string[]): string[] => {
  if (Array.isArray(indicacoes)) return indicacoes;
  if (!indicacoes) return [];
  
  // Split by semicolons or new lines if it's a string
  return indicacoes
    .split(/[;\n]/)
    .map(item => item.trim())
    .filter(Boolean);
};

export const DetailsTab: React.FC<DetailsTabProps> = ({ equipment }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {equipment.efeito && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-lg italic text-center">"{equipment.efeito}"</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tecnologia</h3>
                <p className="text-muted-foreground">{equipment.tecnologia}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Indicações</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {formatIndicacoes(equipment.indicacoes || []).map((indicacao, index) => (
                    <li key={index}>{indicacao}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Benefícios</h3>
                <p className="text-muted-foreground">{equipment.beneficios}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Diferenciais</h3>
                <p className="text-muted-foreground">{equipment.diferenciais}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Linguagem Recomendada</h3>
                <p className="text-muted-foreground">{equipment.linguagem}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg">
          {equipment.image_url ? (
            <img 
              src={equipment.image_url} 
              alt={equipment.nome} 
              className="w-full h-auto rounded-lg mb-4"
            />
          ) : (
            <div className="bg-muted h-48 flex items-center justify-center rounded-lg mb-4">
              <p className="text-muted-foreground">Sem imagem</p>
            </div>
          )}
          
          <h3 className="text-lg font-semibold mb-2">Informações adicionais</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono">{equipment.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
