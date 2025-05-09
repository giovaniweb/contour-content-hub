
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ParallaxSection from "@/components/ui/parallax/ParallaxSection";
import { isPdfUrlValid, openPdfInNewTab, downloadPdf } from "@/utils/pdfUtils";

const MediaLibraryPage: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = React.useState<{ title: string; url: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handlePreviewPdf = (title: string, url: string) => {
    if (isPdfUrlValid(url)) {
      setSelectedDocument({ title, url });
      setIsDialogOpen(true);
    } else {
      console.error("URL de PDF inválida:", url);
    }
  };

  const handleDownloadPdf = (title: string, url: string) => {
    if (isPdfUrlValid(url)) {
      downloadPdf(url, `${title}.pdf`)
        .then(() => console.log("Download iniciado com sucesso"))
        .catch(error => console.error("Erro ao baixar PDF:", error));
    } else {
      console.error("URL de PDF inválida para download:", url);
    }
  };

  // Example video cards for the parallax section
  const videoCards = [
    {
      title: "Técnicas Avançadas de Tratamento Facial",
      description: "Aprenda as técnicas mais recentes para tratamentos faciais profissionais",
      image: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png",
      link: "/videos/facial-treatment"
    },
    {
      title: "Workshop de Harmonização Facial",
      description: "Workshop completo sobre técnicas de harmonização e preenchimento",
      image: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png",
      link: "/videos/facial-harmony"
    },
    {
      title: "Recursos Estéticos Corporais",
      description: "Conheça os principais equipamentos e procedimentos para estética corporal",
      image: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png",
      link: "/videos/body-aesthetics"
    }
  ];
  
  return (
    <Layout title="Biblioteca de Mídia">
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">Biblioteca de Mídia</h1>
        
        {/* Parallax Section for Videos Highlight */}
        <ParallaxSection
          backgroundImage="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png"
          title="Vídeos Educacionais Premium"
          description="Acesse nossa coleção exclusiva de vídeos técnicos e tutoriais para profissionais de estética"
          cards={videoCards}
          ctaText="Ver Todos os Vídeos"
          ctaLink="#videos"
          className="mb-8"
        />
        
        <Tabs defaultValue="videos" id="videos">
          <TabsList>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Vídeos</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>Imagens</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documentos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <img 
                          src={`/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png`}
                          alt={`Video ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                            <Video className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm">Vídeo de Tratamento Facial {index + 1}</h3>
                        <p className="text-xs text-muted-foreground">Duração: 2:45 • Adicionado: 12/05/2025</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="images" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden group cursor-pointer">
                      <div className="aspect-square bg-muted relative">
                        <img 
                          src={`/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png`}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs truncate">imagem_{index + 1}.png</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 flex gap-3 hover:bg-muted/50 transition-colors">
                      <FileText className="h-10 w-10 text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Documento {index + 1}</h3>
                        <p className="text-xs text-muted-foreground">PDF • 2.4MB • Adicionado: 10/05/2025</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Relatório</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Cliente</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePreviewPdf(`Documento ${index + 1}`, `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`)}
                          >
                            Visualizar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadPdf(`Documento ${index + 1}`, `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`)}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex justify-end mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => selectedDocument && openPdfInNewTab(selectedDocument.url, selectedDocument.title)}
                >
                  Abrir em Nova Aba
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <iframe
              src={selectedDocument.url}
              className="w-full h-full border-0"
              title={selectedDocument.title}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MediaLibraryPage;
