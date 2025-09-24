import React from 'react';
import { GiovanniEmailFix as GiovanniEmailFixComponent } from '@/components/admin/GiovanniEmailFix';

const GiovanniEmailFixPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Correção de Email - Giovanni
          </h1>
          <p className="text-muted-foreground mt-2">
            Ferramenta administrativa para corrigir inconsistências de email
          </p>
        </div>
        
        <GiovanniEmailFixComponent />
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Próximos Passos:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Após corrigir o email, teste a recuperação de senha</li>
            <li>Verifique se não há outros usuários com emails inconsistentes</li>
            <li>Considere implementar validações preventivas</li>
            <li>Documente o processo para futuros casos similares</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default GiovanniEmailFixPage;