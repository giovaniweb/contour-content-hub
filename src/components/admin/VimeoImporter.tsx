
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, Video } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface VimeoImporterProps {
  onComplete: (videoData: any) => void;
  equipmentId?: string;
}

interface VimeoMetadata {
  title: string;
  description: string;
  thumbnailUrl: string;
  authorName: string;
  videoUrl: string;
  vimeoId: string;
  width: number;
  height: number;
}

interface EnhancedMetadata {
  descricao_curta: string;
  descricao_longa: string;
  finalidade: string[];
  area_tratada: string[];
  tipo_video: 'take' | 'video_pronto';
  tags: string[];
  legenda_instagram: string;
  titulo_otimizado: string;
}

const VimeoImporter: React.FC<VimeoImporterProps> = ({ onComplete, equipmentId }) => {
  const [vimeoUrl, setVimeoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VimeoMetadata | null>(null);
  const [enhancedMetadata, setEnhancedMetadata] = useState<EnhancedMetadata | null>(null);
  const [equipmentData, setEquipmentData] = useState<any>(null);

  // Extract Vimeo ID from URL
  const extractVimeoId = (url: string): string | null => {
    const patterns = [
      /vimeo\.com\/(\d+)/,          // Standard Vimeo URL
      /vimeo\.com\/channels\/.*\/(\d+)/, // Channel URL
      /vimeo\.com\/groups\/.*\/videos\/(\d+)/, // Group URL
      /player\.vimeo\.com\/video\/(\d+)/ // Player URL
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const fetchEquipmentData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching equipment data:', error);
      return null;
    }
  };

  const handleImport = async () => {
    setError(null);
    setIsLoading(true);
    setVideoMetadata(null);
    setEnhancedMetadata(null);
    
    try {
      // Extract Vimeo ID
      const vimeoId = extractVimeoId(vimeoUrl);
      if (!vimeoId) {
        throw new Error('URL do Vimeo inválida. Use um formato como: https://vimeo.com/123456789');
      }

      // Get equipment data if ID is provided
      let equipment = null;
      if (equipmentId) {
        equipment = await fetchEquipmentData(equipmentId);
        setEquipmentData(equipment);
      }

      // Call the edge function to fetch Vimeo data
      const { data: vimeoData, error: vimeoError } = await supabase.functions
        .invoke('vimeo-import', {
          body: { vimeoId }
        });

      if (vimeoError || !vimeoData?.success) {
        throw new Error(vimeoError || vimeoData?.error || 'Falha ao importar vídeo do Vimeo');
      }

      const metadata = vimeoData.data;
      setVideoMetadata(metadata);
      
      // If we have equipment data, generate enhanced content
      if (equipment) {
        toast.info('Gerando conteúdo otimizado...');
        
        const { data: contentData, error: contentError } = await supabase.functions
          .invoke('generate-video-content', {
            body: { 
              videoMetadata: metadata,
              equipmentData: equipment
            }
          });
          
        if (contentError || !contentData?.success) {
          toast.error('Falha ao gerar conteúdo otimizado');
          console.error('Content generation error:', contentError || contentData?.error);
        } else {
          setEnhancedMetadata(contentData.data.enhancedMetadata);
          
          toast.success('Conteúdo gerado com sucesso!');
          
          // Combine data and pass it to parent
          onComplete({
            ...metadata,
            ...contentData.data.enhancedMetadata,
            equipment_id: equipmentId
          });
        }
      } else {
        // Just return the basic metadata
        onComplete(metadata);
        toast.success('Vídeo do Vimeo importado com sucesso!');
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao importar o vídeo');
      toast.error('Erro ao importar vídeo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Importar Vídeo do Vimeo
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vimeoUrl">URL do Vimeo</Label>
            <div className="flex gap-2">
              <Input
                id="vimeoUrl"
                placeholder="https://vimeo.com/123456789"
                value={vimeoUrl}
                onChange={(e) => setVimeoUrl(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleImport} 
                disabled={!vimeoUrl || isLoading}
                className="whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  'Importar Vídeo'
                )}
              </Button>
            </div>
          </div>
          
          {videoMetadata && (
            <div className="space-y-4 mt-6 p-4 bg-muted rounded-md">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Vídeo encontrado!</span>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="aspect-video bg-black rounded-md overflow-hidden">
                  {videoMetadata.thumbnailUrl && (
                    <img 
                      src={videoMetadata.thumbnailUrl} 
                      alt={videoMetadata.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <h3 className="font-medium text-lg">{videoMetadata.title}</h3>
                  {videoMetadata.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{videoMetadata.description}</p>
                  )}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Por: </span>
                    <span>{videoMetadata.authorName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {enhancedMetadata && (
        <CardFooter className="flex flex-col items-start bg-muted/50 p-4 rounded-b-lg">
          <h4 className="font-medium mb-2">Conteúdo Otimizado:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <span className="text-xs text-muted-foreground block">Título Otimizado:</span>
              <span className="text-sm font-medium">{enhancedMetadata.titulo_otimizado}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Tipo de Vídeo:</span>
              <span className="text-sm">{enhancedMetadata.tipo_video === 'take' ? 'Take (Bruto)' : 'Vídeo Pronto'}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Descrição Curta:</span>
              <span className="text-sm">{enhancedMetadata.descricao_curta}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Finalidade:</span>
              <span className="text-sm">{enhancedMetadata.finalidade.join(', ')}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs text-muted-foreground block">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {enhancedMetadata.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-primary/10 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default VimeoImporter;
