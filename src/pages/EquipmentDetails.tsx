import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getEquipmentById } from '@/utils/api-equipment';
import { Equipment } from '@/types/equipment';
import { ArrowLeft, Loader2, FileText, Video, CheckCircle, Image as ImageIcon } from 'lucide-react';
import VimeoImporter from '@/components/admin/VimeoImporter';
import { useToast } from '@/hooks/use-toast';
import { logQuery } from '@/utils/validation/loggingUtils';

const EquipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!id) {
        console.error("No equipment ID provided in URL params");
        setError("ID do equipamento não fornecido");
        setLoading(false);
        return;
      }
      
      console.log(`Attempting to fetch equipment with ID: ${id}`);
      logQuery('select', 'equipamentos', { id, component: 'EquipmentDetails' });
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await getEquipmentById(id);
        console.log("Equipment data received:", data);
        
        if (!data) {
          console.error("No equipment found with provided ID");
          setError("Equipamento não encontrado");
          toast({
            variant: "destructive",
            title: "Equipamento não encontrado",
            description: "Não foi possível encontrar o equipamento solicitado."
          });
          // Don't navigate away immediately so user can see the error
          setLoading(false);
          return;
        }
        
        console.log("Setting equipment data:", data.nome);
        setEquipment(data);
      } catch (err: any) {
        console.error('Error fetching equipment:', err);
        setError(err.message || "Erro ao carregar dados do equipamento");
        toast({
          variant: "destructive",
          title: "Erro ao carregar equipamento",
          description: "Não foi possível carregar os dados do equipamento."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEquipment();
  }, [id, navigate, toast]);

  // Fix for the array type handling
  const formatIndicacoes = (indicacoes: string | string[]): string[] => {
    if (Array.isArray(indicacoes)) return indicacoes;
    if (!indicacoes) return [];
    
    // Split by semicolons or new lines if it's a string
    return indicacoes
      .split(/[;\n]/)
      .map(item => item.trim())
      .filter(Boolean);
  };
  
  const handleImportComplete = (importedData: any) => {
    toast({
      title: "Vídeo importado com sucesso!",
      description: `O vídeo "${importedData.titulo}" foi importado e associado a este equipamento.`,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Carregando detalhes do equipamento...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg text-muted-foreground mb-4">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/equipments')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para equipamentos
          </Button>
        </div>
      </Layout>
    );
  }

  if (!equipment) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg text-muted-foreground">Equipamento não encontrado</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/equipments')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para equipamentos
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={equipment.nome}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/equipments')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">{equipment.nome}</h1>
            {equipment.ativo ? (
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Ativo</span>
            ) : (
              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Inativo</span>
            )}
          </div>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-5 mb-6">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="import">Importar</TabsTrigger>
            <TabsTrigger value="content">Criar Conteúdo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {equipment.efeito && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-lg italic text-center">"{equipment.efeito}"</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Tecnologia</h3>
                      <p className="text-muted-foreground">{equipment.tecnologia}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Indicações</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {formatIndicacoes(equipment.indicacoes || []).map((indicacao, index) => (
                          <li key={index}>{indicacao}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Benefícios</h3>
                      <p className="text-muted-foreground">{equipment.beneficios}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Diferenciais</h3>
                      <p className="text-muted-foreground">{equipment.diferenciais}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Linguagem Recomendada</h3>
                      <p className="text-muted-foreground">{equipment.linguagem}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                {equipment.image_url ? (
                  <img 
                    src={equipment.image_url} 
                    alt={equipment.nome} 
                    className="w-full h-auto rounded-lg mb-4"
                  />
                ) : (
                  <div className="bg-muted h-48 flex items-center justify-center rounded-lg mb-4">
                    <p className="text-muted-foreground">Sem imagem</p>
                  </div>
                )}
                
                <h3 className="text-lg font-semibold mb-2">Informações adicionais</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono">{equipment.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Sem documentos</h3>
              <p className="text-muted-foreground mt-2">
                Não há documentos disponíveis para este equipamento.
              </p>
              <Button className="mt-4">
                Adicionar Documento
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="text-center py-10">
              <Video className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Sem vídeos</h3>
              <p className="text-muted-foreground mt-2">
                Não há vídeos disponíveis para este equipamento.
              </p>
              <div className="flex justify-center mt-4 gap-2">
                <Button onClick={() => setActiveTab('import')}>
                  Importar Vídeo
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="import">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Importar Vídeo do Vimeo</h2>
              <VimeoImporter 
                onCompleteImport={handleImportComplete}
                selectedEquipmentId={id}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="text-center py-10">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Criar Conteúdo Personalizado</h3>
              <p className="text-muted-foreground mt-2">
                Gere roteiros, big ideas e stories para este equipamento.
              </p>
              <Button className="mt-4" onClick={() => navigate(`/custom-gpt?equipment=${id}&mode=advanced`)}>
                Acessar Gerador de Conteúdo
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EquipmentDetails;
