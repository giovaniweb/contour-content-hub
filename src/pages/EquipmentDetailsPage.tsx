
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { fetchEquipmentById, fetchEquipmentFiles, fetchEquipmentVideos } from "@/utils/api-equipment";
import { Equipment } from "@/types/equipment";
import { FileText, Video, Image as ImageIcon, ChevronLeft, Upload, PlusSquare } from "lucide-react";

const EquipmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedFiles, setRelatedFiles] = useState<any[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (id) {
      loadEquipment(id);
    }
  }, [id]);

  const loadEquipment = async (equipmentId: string) => {
    try {
      setIsLoading(true);
      const equipmentData = await fetchEquipmentById(equipmentId);
      
      if (equipmentData) {
        setEquipment(equipmentData);
        
        // Load related content
        if (equipmentData.nome) {
          const filesData = await fetchEquipmentFiles(equipmentData.nome);
          const videosData = await fetchEquipmentVideos(equipmentData.nome);
          
          setRelatedFiles(filesData || []);
          setRelatedVideos(videosData || []);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Equipamento não encontrado",
          description: "O equipamento solicitado não foi encontrado."
        });
      }
    } catch (error) {
      console.error("Erro ao carregar equipamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados do equipamento."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Carregando...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!equipment) {
    return (
      <Layout title="Equipamento não encontrado">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <h2 className="text-2xl font-semibold">Equipamento não encontrado</h2>
          <p className="text-muted-foreground">O equipamento solicitado não existe ou foi removido.</p>
          <Button asChild>
            <Link to="/admin/equipments">Voltar para Gerenciamento de Equipamentos</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Equipamento: ${equipment.nome}`}>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/equipments" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{equipment.nome}</h1>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar with image */}
          <Card className="md:col-span-1 h-fit">
            <CardContent className="p-4 flex flex-col items-center">
              {equipment.image_url ? (
                <img 
                  src={equipment.image_url} 
                  alt={equipment.nome} 
                  className="w-full h-auto rounded-lg object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
              
              <div className="mt-4 w-full">
                <Button className="w-full" asChild>
                  <Link to={`/admin/content?equipment=${equipment.nome}`}>
                    <PlusSquare className="mr-2 h-4 w-4" />
                    Cadastrar Arquivo Relacionado
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Details tabs */}
          <div className="md:col-span-2">
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="files">Arquivos</TabsTrigger>
                    <TabsTrigger value="videos">Vídeos</TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent className="p-6">
                  <TabsContent value="info" className="space-y-4 mt-0">
                    <div>
                      <h3 className="text-lg font-semibold">Tecnologia</h3>
                      <p className="mt-1 text-gray-600">{equipment.tecnologia}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Indicações</h3>
                      <p className="mt-1 text-gray-600">{equipment.indicacoes}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Benefícios</h3>
                      <p className="mt-1 text-gray-600">{equipment.beneficios}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Efeito</h3>
                      <p className="mt-1 text-gray-600">{equipment.efeito || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Diferenciais</h3>
                      <p className="mt-1 text-gray-600">{equipment.diferenciais}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Linguagem Recomendada</h3>
                      <p className="mt-1 text-gray-600">{equipment.linguagem}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="files" className="mt-0">
                    {relatedFiles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedFiles.map((file) => (
                          <Card key={file.id} className="overflow-hidden h-full">
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                              {file.preview_url ? (
                                <img 
                                  src={file.preview_url} 
                                  alt={file.nome} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FileText className="h-12 w-12 text-gray-400" />
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-medium truncate">{file.nome}</h4>
                              <p className="text-sm text-muted-foreground mt-1 truncate">
                                {file.tipo || "Documento"}
                              </p>
                              <div className="mt-2">
                                <Button size="sm" variant="outline" asChild>
                                  <a href={file.arquivo_url} target="_blank" rel="noreferrer">
                                    Ver arquivo
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium mb-1">Nenhum arquivo encontrado</h3>
                        <p className="text-muted-foreground mb-4">
                          Não há arquivos cadastrados para este equipamento.
                        </p>
                        <Button asChild>
                          <Link to={`/admin/content?equipment=${equipment.nome}`}>
                            <Upload className="mr-2 h-4 w-4" />
                            Adicionar arquivo
                          </Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="videos" className="mt-0">
                    {relatedVideos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedVideos.map((video) => (
                          <Card key={video.id} className="overflow-hidden h-full">
                            <div className="aspect-video bg-gray-100 relative">
                              {video.preview_url ? (
                                <img 
                                  src={video.preview_url} 
                                  alt={video.titulo} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Video className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Button variant="secondary" size="sm" asChild>
                                  <a href={video.url_video} target="_blank" rel="noreferrer">
                                    Assistir
                                  </a>
                                </Button>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-medium truncate">{video.titulo}</h4>
                              {video.descricao_curta && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {video.descricao_curta}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Video className="h-12 w-12 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium mb-1">Nenhum vídeo encontrado</h3>
                        <p className="text-muted-foreground mb-4">
                          Não há vídeos cadastrados para este equipamento.
                        </p>
                        <Button asChild>
                          <Link to={`/admin/content?equipment=${equipment.nome}&type=video`}>
                            <Upload className="mr-2 h-4 w-4" />
                            Adicionar vídeo
                          </Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EquipmentDetailsPage;
