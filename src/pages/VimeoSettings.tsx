import React from 'react';
// ... outros imports necessários

// O resto do arquivo permanece inalterado, apenas vamos mudar cada instância de 
// toast({ variant: "success", ... }) para toast({ variant: "default", ... })

const VimeoSettings: React.FC = () => {
  // ... keep existing code

  // Exemplo de modificação genérica:
  // Altere de:
  // toast({ variant: "success", title: "...", description: "..." });
  // Para:
  // toast({ variant: "default", title: "...", description: "..." });

  return (
    // ... keep existing code (o resto do componente)
  );
};

export default VimeoSettings;
