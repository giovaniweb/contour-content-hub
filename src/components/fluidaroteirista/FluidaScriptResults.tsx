
import React from 'react';
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
import ElementosUniversaisDisplay from './components/ElementosUniversaisDisplay';

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

  const isDisneyApplied = script.mentor === 'Fluida Encantadora' || script.mentor === 'FLUIDAROTEIRISTA Disney';

  return (
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
              Roteiro criado com inteligência artificial e os 10 elementos universais
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-aurora-electric-purple/20 text-aurora-electric-purple">
            Formato: {script.formato || 'Universal'}
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            Emoção: {script.emocao_central || 'Criatividade'}
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            Intenção: {script.intencao || script.objetivo || 'Engajar'}
          </Badge>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roteiro Principal */}
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
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                  {script.roteiro || script.content}
                </div>
              </div>
              
              {script.mentor && (
                <div className="mt-6 p-4 bg-aurora-electric-purple/10 rounded-lg border border-aurora-electric-purple/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-aurora-electric-purple" />
                    <span className="text-sm font-semibold text-white">
                      Assinatura do Mentor
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Criado com o estilo de <strong>{script.mentor}</strong>
                  </p>
                  {script.objetivo && (
                    <p className="text-xs text-slate-400 mt-1">
                      Objetivo: {script.objetivo}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Painel Lateral */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Elementos Universais */}
          {script.elementos_aplicados && (
            <ElementosUniversaisDisplay
              elementos={script.elementos_aplicados}
              mentor={script.mentor || 'FLUIDAROTEIRISTA'}
              especialidades={script.especialidades_aplicadas}
            />
          )}

          {/* Ações */}
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                🚀 Próximos Passos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => onGenerateImage(script)}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Gerar Imagem
              </Button>

              <Button
                onClick={() => onGenerateAudio(script)}
                disabled={isProcessing}
                variant="outline"
                className="w-full"
              >
                <Mic className="h-4 w-4 mr-2" />
                Gerar Áudio
              </Button>

              {!isDisneyApplied && (
                <Button
                  onClick={() => onApplyDisney(script)}
                  disabled={isProcessing}
                  variant="outline"
                  className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                >
                  <Castle className="h-4 w-4 mr-2" />
                  Disney Magic ✨
                </Button>
              )}

              <Button
                onClick={onNewScript}
                disabled={isProcessing}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Novo Roteiro
              </Button>
            </CardContent>
          </Card>

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
    </div>
  );
};

export default FluidaScriptResults;
