
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Image,
  ArrowRight,
  LayoutDashboard
} from "lucide-react";
import { ROUTES } from "@/routes";

const AdminContent: React.FC = () => {
  const navigate = useNavigate();

  const contentSections = [
    {
      title: "Artigos Científicos",
      description: "Gerencie a biblioteca de artigos científicos e pesquisas",
      icon: BookOpen,
      path: ROUTES.ADMIN.SCIENTIFIC_ARTICLES,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    },
    {
      title: "Materiais e Arquivos",
      description: "PDFs, PSDs, logomarcas e outros documentos",
      icon: FileText,
      path: ROUTES.ADMIN.MATERIALS,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Fotos e Imagens",
      description: "Before/after, galeria e outras imagens",
      icon: Image,
      path: ROUTES.ADMIN.PHOTOS,
      color: "text-pink-400 bg-pink-500/10 border-pink-500/20"
    },
    {
      title: "Vídeos",
      description: "Biblioteca de vídeos da plataforma",
      icon: Video,
      path: ROUTES.ADMIN.VIDEOS,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              Central de Conteúdo
            </h1>
            <p className="text-muted-foreground">
              Gerencie todos os tipos de conteúdo da plataforma
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentSections.map((section) => (
            <Card key={section.path} className={`cursor-pointer transition-all hover:shadow-lg ${section.color}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {section.description}
                </p>
                <Button 
                  onClick={() => navigate(section.path)}
                  className="w-full justify-between"
                  variant="outline"
                >
                  Gerenciar {section.title}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-slate-100">
                Navegação Rápida
              </h3>
              <p className="text-slate-400 text-sm">
                Use o menu lateral esquerdo para acessar diretamente cada seção de conteúdo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
