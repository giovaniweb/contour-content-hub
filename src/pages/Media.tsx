
import React from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VideoIcon, ImageIcon, FileTextIcon } from 'lucide-react';

const Media: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Biblioteca de Mídia</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Video Card */}
          <div className="bg-card rounded-lg shadow-md p-6 flex flex-col">
            <div className="mb-4 text-primary">
              <VideoIcon className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Vídeos</h2>
            <p className="text-muted-foreground mb-4 flex-grow">
              Acesse sua coleção de vídeos, incluindo vídeos prontos e takes brutos.
            </p>
            <Button onClick={() => navigate('/video-storage')} className="w-full">
              Acessar Vídeos
            </Button>
          </div>

          {/* Video Swipe Card */}
          <div className="bg-card rounded-lg shadow-md p-6 flex flex-col">
            <div className="mb-4 text-primary">
              <VideoIcon className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Descobrir Vídeos</h2>
            <p className="text-muted-foreground mb-4 flex-grow">
              Navegue pelos vídeos no formato de swipe para encontrar rapidamente o conteúdo que precisa.
            </p>
            <Button onClick={() => navigate('/video-swipe')} className="w-full">
              Acessar Swipe
            </Button>
          </div>

          {/* Documents Card */}
          <div className="bg-card rounded-lg shadow-md p-6 flex flex-col">
            <div className="mb-4 text-primary">
              <FileTextIcon className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Documentos Técnicos</h2>
            <p className="text-muted-foreground mb-4 flex-grow">
              Acesse artigos científicos, manuais e outros documentos técnicos relacionados aos equipamentos.
            </p>
            <Button onClick={() => navigate('/technical-documents')} variant="outline" className="w-full">
              Acessar Documentos
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Media;
