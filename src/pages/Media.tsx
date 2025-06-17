
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Video, FileText, Camera, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Media: React.FC = () => {
  const navigate = useNavigate();

  const mediaOptions = [
    {
      title: 'Fotos',
      description: 'Galeria de fotos e imagens antes/depois',
      icon: Image,
      path: '/photos',
      color: 'text-pink-400'
    },
    {
      title: 'Vídeos',
      description: 'Biblioteca de vídeos e conteúdo audiovisual',
      icon: Video,
      path: '/videos',
      color: 'text-blue-400'
    },
    {
      title: 'Documentos',
      description: 'PDFs, materiais e documentos',
      icon: FileText,
      path: '/documents',
      color: 'text-green-400'
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <FileText className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Central de Mídia</h1>
            <p className="text-slate-400">Gerencie todos os seus arquivos em um só lugar</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload de Arquivos
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Capturar Foto
        </Button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mediaOptions.map((option, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(option.path)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <option.icon className={`h-8 w-8 ${option.color}`} />
                {option.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{option.description}</p>
              <Button variant="outline" className="w-full">
                Acessar {option.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhuma atividade recente encontrada
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Media;
