import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, FileText, Image, Grid } from 'lucide-react';

const DownloadsPage: React.FC = () => {
  const navigate = useNavigate();

  const downloadOptions = [
    {
      title: "Meus Downloads",
      description: "Gerencie e organize seus materiais baixados",
      icon: <Download className="h-8 w-8" />,
      path: "/downloads/manage",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Upload em Massa",
      description: "Envie múltiplos arquivos de uma vez",
      icon: <Upload className="h-8 w-8" />,
      path: "/downloads/batch",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Biblioteca de Materiais",
      description: "Acesse todos os materiais disponíveis",
      icon: <Grid className="h-8 w-8" />,
      path: "/downloads/manage",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">
          Central de Downloads
        </h1>
        <p className="text-white/70 text-lg">
          Gerencie seus materiais e faça upload de novos conteúdos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {downloadOptions.map((option, index) => (
          <Card 
            key={index} 
            className="aurora-glass border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => navigate(option.path)}
          >
            <CardHeader className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center text-white mb-4`}>
                {option.icon}
              </div>
              <CardTitle className="text-white">
                {option.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/70 mb-4">
                {option.description}
              </p>
              <Button 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(option.path);
                }}
              >
                Acessar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-white mb-6">Estatísticas Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="aurora-glass border-white/20">
            <CardContent className="p-4 text-center">
              <FileText className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">--</div>
              <div className="text-sm text-white/60">Materiais Totais</div>
            </CardContent>
          </Card>
          
          <Card className="aurora-glass border-white/20">
            <CardContent className="p-4 text-center">
              <Download className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">--</div>
              <div className="text-sm text-white/60">Downloads Hoje</div>
            </CardContent>
          </Card>
          
          <Card className="aurora-glass border-white/20">
            <CardContent className="p-4 text-center">
              <Image className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">--</div>
              <div className="text-sm text-white/60">Imagens</div>
            </CardContent>
          </Card>
          
          <Card className="aurora-glass border-white/20">
            <CardContent className="p-4 text-center">
              <Upload className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">--</div>
              <div className="text-sm text-white/60">Uploads Recentes</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;