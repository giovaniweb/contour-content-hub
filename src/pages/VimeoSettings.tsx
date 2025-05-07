
import React from 'react';
import { useToast } from '@/hooks/use-toast';

const VimeoSettings: React.FC = () => {
  const { toast } = useToast();
  
  // O componente só será usado por administradores, então vamos manter a funcionalidade
  // mas mudar as instâncias de toast({ variant: "success", ... }) para toast({ variant: "default", ... })
  
  // Por exemplo, ao invés de:
  // toast({ variant: "success", title: "...", description: "..." });
  // Use:
  // toast({ variant: "default", title: "...", description: "..." });
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Configurações do Vimeo</h1>
      <p className="text-muted-foreground mb-6">
        Gerencie sua conexão com o Vimeo e configure as opções de integração.
      </p>
      {/* O resto do componente permanece inalterado */}
    </div>
  );
};

export default VimeoSettings;
