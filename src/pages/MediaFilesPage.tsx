
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, FileImage, Download, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { staggerChildren, itemVariants, fadeIn } from "@/lib/animations";

// Mock data for downloadable assets
const mediaAssets = [
  {
    id: 1,
    title: "Kit de Social Media - Tratamento Facial",
    thumbnail: "/assets/images/social-kit-thumbnail.jpg",
    type: "Template",
    format: "PSD",
    fileSize: "48.2 MB",
    date: "2025-05-05",
    description: "Kit completo para redes sociais com templates editáveis sobre tratamentos faciais.",
    tags: ["social media", "template", "photoshop", "tratamento facial"]
  },
  {
    id: 2,
    title: "Logo Fluida - Versões para Aplicação",
    thumbnail: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png",
    type: "Logo",
    format: "AI",
    fileSize: "12.8 MB",
    date: "2025-05-01",
    description: "Pacote com todas as versões do logo da Fluida para diferentes aplicações.",
    tags: ["logo", "marca", "identidade visual"]
  },
  {
    id: 3,
    title: "Templates para Stories - Procedimentos",
    thumbnail: "/assets/images/stories-template-thumbnail.jpg",
    type: "Template",
    format: "PSD",
    fileSize: "35.6 MB",
    date: "2025-04-28",
    description: "Templates editáveis para Stories do Instagram para diferentes procedimentos.",
    tags: ["instagram", "stories", "template", "procedimentos"]
  },
  {
    id: 4,
    title: "Mockups de Produtos - Kit Completo",
    thumbnail: "/assets/images/mockup-kit-thumbnail.jpg",
    type: "Mockup",
    format: "PSD",
    fileSize: "86.4 MB",
    date: "2025-04-25",
    description: "Kit completo de mockups para apresentação de produtos da linha premium.",
    tags: ["mockup", "produto", "apresentação", "marketing"]
  },
  {
    id: 5,
    title: "Elementos Gráficos - Pacote Médico",
    thumbnail: "/assets/images/medical-graphics-thumbnail.jpg",
    type: "Gráficos",
    format: "PNG",
    fileSize: "24.5 MB",
    date: "2025-04-20",
    description: "Conjunto de elementos gráficos para uso em materiais relacionados à medicina estética.",
    tags: ["gráficos", "elementos", "medicina", "estética"]
  },
];

const MediaFilesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter assets based on search query
  const filteredAssets = mediaAssets.filter(asset => 
    asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const openAssetDetails = (asset: any) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-contourline-darkBlue">Arquivos de Mídia</h1>
            <p className="text-muted-foreground">Acesse e baixe arquivos para suas campanhas</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar arquivos..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="graphics">Gráficos</TabsTrigger>
            <TabsTrigger value="mockups">Mockups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-6">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum arquivo encontrado para: "{searchQuery}"</p>
                <Button onClick={() => setSearchQuery("")} className="mt-4">Limpar busca</Button>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerChildren(0.1)}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAssets.map((asset) => (
                  <motion.div key={asset.id} variants={itemVariants}>
                    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-all" onClick={() => openAssetDetails(asset)}>
                      <div className="relative h-48 bg-muted">
                        <img 
                          src={asset.thumbnail} 
                          alt={asset.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                          <Button variant="default" className="flex items-center gap-2" onClick={(e) => {
                            e.stopPropagation();
                            // Mock download functionality
                            alert(`Iniciando o download de: ${asset.title}`);
                          }}>
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/50">
                          {asset.format}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-medium line-clamp-2">{asset.title}</h3>
                          <Badge variant="outline">{asset.type}</Badge>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                          <span>{asset.fileSize}</span>
                          <span>{new Date(asset.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="templates" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Templates serão filtrados aqui</p>
            </div>
          </TabsContent>
          
          <TabsContent value="graphics" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Gráficos serão filtrados aqui</p>
            </div>
          </TabsContent>
          
          <TabsContent value="mockups" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Mockups serão filtrados aqui</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedAsset && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <DialogHeader>
                <DialogTitle>{selectedAsset.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div className="bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={selectedAsset.thumbnail} 
                    alt={selectedAsset.title}
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <p className="font-medium">{selectedAsset.type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Formato</span>
                    <p className="font-medium">{selectedAsset.format}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tamanho</span>
                    <p className="font-medium">{selectedAsset.fileSize}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Data</span>
                    <p className="font-medium">{new Date(selectedAsset.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Tags</span>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {selectedAsset.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Descrição</span>
                  <p className="mt-1">{selectedAsset.description}</p>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" /> Visualizar
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Baixar {selectedAsset.format}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MediaFilesPage;
