
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  Download, 
  Copy, 
  RefreshCw, 
  Sparkles, 
  Image as ImageIcon,
  Mic,
  Castle
} from "lucide-react";
import { toast } from 'sonner';
import { getMentorNickname } from '../constants/mentorNames';
import ScriptFormatter from './components/ScriptFormatter';
import ElementosUniversaisDisplay from './components/ElementosUniversaisDisplay';
import DisneyTransformation from './components/DisneyTransformation';

interface FluidaScriptResultsProps {
  results: any[];
  onNewScript: () => void;
  onGenerateImage: (script: any) => void;
  onGenerateAudio: (script: any) => void;
  onApplyDisney: (script: any) => void;
  isProcessing: boolean;
}

const FluidaScriptResults: React.FC<FluidaScriptResultsProps> = ({
  results,
  onNewScript,
  onGenerateImage,
  onGenerateAudio,
  onApplyDisney,
  isProcessing
}) => {
  const [disneyAnimating, setDisneyAnimating] = useState(false);
  const script = results[0];

  const handleCopyScript = () => {
    const textToCopy = script.roteiro || script.content || '';
    navigator.clipboard.writeText(textToCopy);
    toast.success('✅ Roteiro copiado!', {
      description: 'O texto foi copiado para sua área de transferência.'
    });
  };

  const handleDownloadScript = () => {
    const textToDownload = script.roteiro || script.content || '';
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roteiro-fluida-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('📥 Download iniciado!', {
      description: 'Seu roteiro está sendo baixado.'
    });
  };

  const handleApplyDisney = async () => {
    setDisneyAnimating(true);
    // A animação vai durar 3 segundos, depois aplicar a transformação
    setTimeout(async () => {
      await onApplyDisney(script);
      setDisneyAnimating(false);
    }, 3000);
  };

  if (!script) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Nenhum roteiro encontrado.</p>
        <Button onClick={onNewScript} className="mt-4">
          Criar Novo Roteiro
        </Button>
      </div>
    );
  }

  const isDisneyApplied = script.disney_applied || script.mentor?.includes('Disney') || script.mentor?.includes('Fada');
  const mentorNickname = getMentorNickname(script.mentor || 'Criativo');

  return (
    <>
      <DisneyTransformation 
        isActive={disneyAnimating} 
        onComplete={() => setDisneyAnimating(false)} 
      />
      
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Wand2 className="h-12 w-12 text-aurora-electric-purple" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">
                ✨ Seu Roteiro FLUIDA Está Pronto!
              </h1>
              <p className="text-slate-400 mt-2">
                Criado por: <strong>{mentorNickname}</strong>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roteiro Principal - Formatado */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="aurora-glass border-aurora-electric-purple/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>🎬 Roteiro Final</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyScript}
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadScript}
                      className="text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Baixar
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScriptFormatter script={script} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Painel Lateral */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Status Disney */}
            {isDisneyApplied && (
              <Card className="aurora-glass border-yellow-500/30 bg-yellow-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Castle className="h-5 w-5" />
                    <span className="font-semibold">Disney Magic Aplicada!</span>
                  </div>
                  <p className="text-xs text-yellow-300 mt-1">
                    Este roteiro foi transformado com a magia Disney para criar uma experiência mais encantadora.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Próximos Passos - MOVIDO PARA BAIXO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                🚀 Próximos Passos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                onClick={() => onGenerateImage(script)}
                disabled={isProcessing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Gerar Imagem
              </Button>

              <Button
                onClick={() => onGenerateAudio(script)}
                disabled={isProcessing}
                variant="outline"
              >
                <Mic className="h-4 w-4 mr-2" />
                Gerar Áudio
              </Button>

              {!isDisneyApplied && (
                <Button
                  onClick={handleApplyDisney}
                  disabled={isProcessing || disneyAnimating}
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                >
                  <Castle className="h-4 w-4 mr-2" />
                  {disneyAnimating ? 'Aplicando...' : 'Disney Magic ✨'}
                </Button>
              )}

              <Button
                onClick={onNewScript}
                disabled={isProcessing}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Novo Roteiro
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Elementos Universais - MOVIDO PARA BAIXO */}
        {script.elementos_aplicados && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <ElementosUniversaisDisplay
              elementos={script.elementos_aplicados}
              mentor={mentorNickname}
              especialidades={script.especialidades_aplicadas}
            />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default FluidaScriptResults;
