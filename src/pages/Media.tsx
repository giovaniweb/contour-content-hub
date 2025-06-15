
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VideoIcon, ImageIcon, FileTextIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Media: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Media Hub
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Acesse todos os recursos de mídia da plataforma Fluida
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Media Library Card */}
          <Card className="hover:shadow-md transition-all bg-gradient-to-br from-white to-blue-50">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="mb-4 bg-blue-100 p-2 w-fit rounded-lg">
                <VideoIcon className="h-8 w-8 text-fluida-blue" />
              </div>
              
              <h2 className="text-xl font-semibold mb-2">Media Library</h2>
              <p className="text-muted-foreground mb-4 flex-grow">
                Acesse nossa biblioteca completa de vídeos, imagens e documentos com recomendações de conteúdo.
              </p>
              
              <Button onClick={() => navigate('/media-library')} className="w-full bg-fluida-blue hover:bg-fluida-blue/90">
                Acessar Media Library
              </Button>
            </CardContent>
          </Card>

          {/* Video Swipe Card */}
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="mb-4 bg-purple-100 p-2 w-fit rounded-lg">
                <VideoIcon className="h-8 w-8 text-purple-600" />
              </div>
              
              <h2 className="text-xl font-semibold mb-2">Video Swipe</h2>
              <p className="text-muted-foreground mb-4 flex-grow">
                Navegue pelos vídeos no formato de swipe para encontrar rapidamente o conteúdo que precisa.
              </p>
              
              <Button onClick={() => navigate('/video-swipe')} variant="outline" className="w-full">
                Acessar Video Swipe
              </Button>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="mb-4 bg-amber-100 p-2 w-fit rounded-lg">
                <FileTextIcon className="h-8 w-8 text-amber-600" />
              </div>
              
              <h2 className="text-xl font-semibold mb-2">Technical Documents</h2>
              <p className="text-muted-foreground mb-4 flex-grow">
                Acesse artigos científicos, manuais e outros documentos técnicos relacionados aos equipamentos.
              </p>
              
              <Button onClick={() => navigate('/technical-documents')} variant="outline" className="w-full">
                Acessar Technical Docs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Media;
