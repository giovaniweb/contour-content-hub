
import React from 'react';
import Layout from '@/components/Layout';

const ContentScripts: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-semibold mb-4">Scripts de Conteúdo</h1>
        <p className="mb-6">Gerencie seus roteiros de vídeo e conteúdo.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-medium mb-2">Criar Novo Script</h2>
            <p className="text-muted-foreground mb-4">
              Crie um novo roteiro para seus vídeos e conteúdos.
            </p>
            <button className="text-blue-600 hover:underline">Começar agora →</button>
          </div>
          
          <div className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-medium mb-2">Meus Scripts</h2>
            <p className="text-muted-foreground mb-4">
              Acesse e edite seus roteiros existentes.
            </p>
            <button className="text-blue-600 hover:underline">Ver scripts →</button>
          </div>
          
          <div className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-medium mb-2">Validação de Script</h2>
            <p className="text-muted-foreground mb-4">
              Verifique a qualidade e eficácia de seus roteiros.
            </p>
            <button className="text-blue-600 hover:underline">Validar script →</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContentScripts;
