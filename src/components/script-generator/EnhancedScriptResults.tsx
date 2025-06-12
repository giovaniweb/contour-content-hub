
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Wand2, 
  RefreshCw, 
  Image as ImageIcon, 
  Download,
  Sparkles,
  CheckCircle,
  Loader2,
  X
} from 'lucide-react';
import ScriptFormatter from '../fluidaroteirista/components/ScriptFormatter';
import { useFluidaScript } from '../fluidaroteirista/hooks/useFluidaScript';

interface EnhancedScriptResultsProps {
  results: any[];
  onScriptApproved?: (script: any) => void;
  onNewScript: () => void;
  onGenerateImage: (script: any) => void;
}

const EnhancedScriptResults: React.FC<EnhancedScriptResultsProps> = ({
  results,
  onScriptApproved,
  onNewScript,
  onGenerateImage
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const { 
    applyDisneyMagic, 
    isGenerating, 
    isGeneratingImage, 
    generatedImageUrl,
    generateImage
  } = useFluidaScript();

  const script = results[0];

  if (!script) return null;

  const handleDisneyMagic = async () => {
    await applyDisneyMagic(script);
  };

  const handleGenerateImage = async () => {
    await generateImage(script);
    setShowImageModal(true);
  };

  const downloadImage = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a');
      link.href = generatedImageUrl;
      link.download = `roteiro-imagem-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de Ações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Button
          onClick={onNewScript}
          variant="outline"
          className="aurora-glass border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Novo Roteiro
        </Button>

        <Button
          onClick={handleDisneyMagic}
          disabled={isGenerating}
          className="aurora-glass bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Disney Magic
        </Button>

        <Button
          onClick={handleGenerateImage}
          disabled={isGeneratingImage}
          className="aurora-glass bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
        >
          {isGeneratingImage ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4 mr-2" />
          )}
          Gerar Imagem
        </Button>

        {onScriptApproved && (
          <Button
            onClick={() => onScriptApproved(script)}
            className="aurora-glass bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300 hover:bg-green-500/10"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovar Roteiro
          </Button>
        )}
      </motion.div>

      {/* Badges de Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Badge className="aurora-glass border-cyan-500/30 text-cyan-300">
          {script.formato.toUpperCase()}
        </Badge>
        <Badge className="aurora-glass border-purple-500/30 text-purple-300">
          {script.mentor}
        </Badge>
        <Badge className="aurora-glass border-green-500/30 text-green-300">
          {script.emocao_central}
        </Badge>
        {script.disney_applied && (
          <Badge className="aurora-glass border-yellow-500/30 text-yellow-300">
            ✨ Disney Magic
          </Badge>
        )}
      </motion.div>

      {/* Formatador de Script */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ScriptFormatter script={script} />
      </motion.div>

      {/* Modal de Imagem Gerada */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="aurora-glass border border-purple-500/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-purple-300 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Imagem Gerada
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {isGeneratingImage ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
                <p className="text-purple-300">Gerando sua imagem...</p>
                <p className="text-sm text-purple-400 mt-2">Isso pode levar alguns segundos</p>
              </div>
            ) : generatedImageUrl ? (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={generatedImageUrl} 
                    alt="Imagem gerada do roteiro"
                    className="w-full rounded-lg border border-purple-500/20"
                  />
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={downloadImage}
                    className="aurora-glass bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  
                  <Button
                    onClick={() => setShowImageModal(false)}
                    variant="outline"
                    className="aurora-glass border-purple-500/30 text-purple-300"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-purple-300">Nenhuma imagem foi gerada ainda.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedScriptResults;
