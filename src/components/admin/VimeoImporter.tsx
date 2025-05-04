
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Video } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VimeoImporterProps {
  onComplete: (data: any) => void;
  equipmentId?: string | null;
}

const VimeoImporter: React.FC<VimeoImporterProps> = ({ onComplete, equipmentId }) => {
  const [vimeoUrl, setVimeoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract Vimeo ID from URL
  const extractVimeoId = (url: string): string | null => {
    if (!url) return null;
    
    const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    return match ? match[1] : null;
  };
  
  const handleImport = async () => {
    const vimeoId = extractVimeoId(vimeoUrl);
    
    if (!vimeoId) {
      toast.error('URL do Vimeo inválida', {
        description: 'Por favor, insira uma URL válida do Vimeo (ex: https://vimeo.com/123456789)'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Step 1: Call the vimeo-import edge function
      const { data: vimeoData, error: vimeoError } = await supabase.functions.invoke('vimeo-import', {
        body: { vimeoId }
      });
      
      if (vimeoError) throw vimeoError;
      
      if (!vimeoData.success) {
        throw new Error(vimeoData.error || 'Falha ao importar vídeo do Vimeo');
      }
      
      // If no equipment is selected, just return the basic data
      if (!equipmentId) {
        toast.success('Vídeo do Vimeo importado com sucesso', {
          description: 'Dados básicos do vídeo foram recuperados.'
        });
        onComplete(vimeoData.data);
        return;
      }
      
      // Step 2: If equipment is selected, get equipment details
      const { data: equipmentData, error: equipmentError } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('id', equipmentId)
        .single();
        
      if (equipmentError) {
        console.warn('Erro ao buscar dados do equipamento:', equipmentError);
        // Continue with just the Vimeo data
        toast.success('Vídeo do Vimeo importado com sucesso', {
          description: 'Dados básicos do vídeo foram recuperados. Não foi possível obter dados do equipamento.'
        });
        onComplete(vimeoData.data);
        return;
      }
      
      // Step 3: Call the generate-video-content edge function with both data sources
      const { data: enhancedData, error: enhancedError } = await supabase.functions.invoke('generate-video-content', {
        body: {
          videoMetadata: vimeoData.data,
          equipmentData: equipmentData
        }
      });
      
      if (enhancedError) {
        console.warn('Erro ao gerar conteúdo enriquecido:', enhancedError);
        // Fall back to basic data
        toast.success('Vídeo do Vimeo importado com sucesso', {
          description: 'Dados básicos do vídeo foram recuperados. A geração de conteúdo avançado falhou.'
        });
        onComplete(vimeoData.data);
        return;
      }
      
      if (!enhancedData.success) {
        throw new Error(enhancedData.error || 'Falha ao gerar conteúdo enriquecido');
      }
      
      // Success! Return combined data
      toast.success('Vídeo importado e conteúdo gerado com sucesso', {
        description: 'Dados do vídeo foram recuperados e otimizados por IA.'
      });
      
      // Merge the Vimeo data with the AI-enhanced content
      const combinedData = {
        ...vimeoData.data,
        ...enhancedData.data.enhancedMetadata
      };
      
      onComplete(combinedData);
    } catch (error) {
      console.error('Erro na importação:', error);
      toast.error('Erro ao importar vídeo', {
        description: error.message || 'Ocorreu um erro durante a importação do vídeo.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Video className="h-12 w-12 text-primary" />
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Importar do Vimeo</h3>
          <p className="text-sm text-muted-foreground">
            Cole a URL do vídeo do Vimeo para importar seus dados automaticamente
          </p>
        </div>
        
        <div className="grid w-full gap-2">
          <Label htmlFor="vimeoUrl">URL do Vimeo</Label>
          <div className="flex gap-2">
            <Input
              id="vimeoUrl"
              placeholder="https://vimeo.com/123456789"
              value={vimeoUrl}
              onChange={(e) => setVimeoUrl(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleImport} disabled={isLoading || !vimeoUrl}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Importar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Os metadados do vídeo serão importados e otimizados automaticamente
          </p>
        </div>
      </div>
    </Card>
  );
};

export default VimeoImporter;
