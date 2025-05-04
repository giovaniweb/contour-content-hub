
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ExternalLink, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface VimeoImporterProps {
  onComplete: (videoData: any) => void;
  equipmentId?: string | null;
}

const VimeoImporter: React.FC<VimeoImporterProps> = ({ onComplete, equipmentId }) => {
  const { toast } = useToast();
  const [vimeoUrl, setVimeoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoPreview, setVideoPreview] = useState<any>(null);

  const extractVimeoId = (url: string): string | null => {
    // Patron para URLs de Vimeo (aceita vários formatos)
    const patterns = [
      /vimeo\.com\/(\d+)/,           // vimeo.com/123456789
      /vimeo\.com\/video\/(\d+)/,    // vimeo.com/video/123456789
      /player\.vimeo\.com\/video\/(\d+)/, // player.vimeo.com/video/123456789
      /(\d+)/                        // Caso já seja só o ID
    ];
    
    // Tenta cada padrão
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const handleImport = async () => {
    if (!vimeoUrl) {
      toast({
        variant: "destructive",
        title: "URL necessária",
        description: "Por favor, informe a URL do vídeo do Vimeo"
      });
      return;
    }
    
    const vimeoId = extractVimeoId(vimeoUrl);
    if (!vimeoId) {
      toast({
        variant: "destructive",
        title: "URL inválida",
        description: "Por favor, informe uma URL válida do Vimeo (ex: https://vimeo.com/123456789)"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Primeiro, busca os metadados básicos do Vimeo
      const { data, error } = await supabase.functions.invoke('vimeo-import', {
        body: { vimeoId }
      });
      
      if (error) {
        console.error('Erro na importação:', error);
        throw new Error(`Não foi possível importar o vídeo: ${error.message || 'Erro desconhecido'}`);
      }
      
      if (!data || !data.success) {
        throw new Error(data?.error || 'Não foi possível importar o vídeo');
      }

      // Mostra preview dos dados importados
      setVideoPreview(data.data);
      
      // Se equipamento foi selecionado, melhora os dados com IA
      if (equipmentId) {
        setIsProcessing(true);
        
        // Aqui usamos um fallback direto em caso de falha da IA
        // para não bloquear o usuário
        try {
          // Busca informações do equipamento
          const { data: equipmentData } = await supabase
            .from('equipamentos')
            .select('*')
            .eq('id', equipmentId)
            .single();

          if (equipmentData) {
            // Melhorando dados com base no equipamento, mesmo sem IA
            const enhancedData = {
              ...data.data,
              titulo_otimizado: data.data.title,
              descricao_curta: data.data.description?.substring(0, 150) || '',
              descricao_longa: data.data.description || '',
              finalidade: equipmentData.indicacoes || [],
              area_tratada: equipmentData.areas_corpo || [],
              equipment_id: equipmentId,
              videoUrl: data.data.videoUrl,
              thumbnailUrl: data.data.thumbnailUrl
            };
            
            setVideoPreview(enhancedData);
          }
        } catch (aiError) {
          console.warn('Erro ao enriquecer dados com IA, usando dados básicos:', aiError);
          // Continue com os dados básicos em caso de erro
        } finally {
          setIsProcessing(false);
        }
      }

      // Fornece os dados importados
      if (videoPreview && onComplete) {
        setTimeout(() => {
          onComplete(videoPreview);
        }, 200);
      }
      
    } catch (e) {
      console.error('Erro na importação:', e);
      toast({
        variant: "destructive",
        title: "Erro ao importar vídeo",
        description: e.message || "Não foi possível importar o vídeo do Vimeo."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Importar Vídeo do Vimeo</CardTitle>
        <CardDescription>
          Cole a URL do vídeo do Vimeo para importar automaticamente seus metadados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start gap-2">
            <div className="flex-grow w-full">
              <Input
                placeholder="https://vimeo.com/123456789"
                value={vimeoUrl}
                onChange={(e) => setVimeoUrl(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleImport}
              disabled={isLoading || !vimeoUrl}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Importar Vídeo
                </>
              )}
            </Button>
          </div>
          
          {videoPreview && (
            <div className="border rounded-md p-4 mt-4">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden">
                  {videoPreview.thumbnailUrl && (
                    <img
                      src={videoPreview.thumbnailUrl}
                      alt={videoPreview.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{videoPreview.title || videoPreview.titulo_otimizado}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {videoPreview.descricao_curta || videoPreview.description}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span>{videoPreview.authorName}</span>
                    <a 
                      href={videoPreview.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center text-primary hover:underline"
                    >
                      Ver no Vimeo <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
              
              {isProcessing && (
                <div className="mt-2 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Otimizando metadados...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 text-center text-sm text-muted-foreground">
        <p className="w-full">
          Os dados importados serão preenchidos automaticamente no formulário para sua revisão
        </p>
      </CardFooter>
    </Card>
  );
};

export default VimeoImporter;
