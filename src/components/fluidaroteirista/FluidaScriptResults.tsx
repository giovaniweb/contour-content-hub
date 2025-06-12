
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
  Castle,
  Clock,
  Zap,
  CheckCircle,
  ThumbsUp,
  Loader2
} from "lucide-react";
import { toast } from 'sonner';
import { getMentorNickname } from './constants/mentorNames';
import ScriptFormatter from './components/ScriptFormatter';
import ElementosUniversaisDisplay from './components/ElementosUniversaisDisplay';
import DisneyTransformation from './components/DisneyTransformation';
import { useMultipleImageGeneration } from '@/hooks/useMultipleImageGeneration';
import ImageGenerationModal from './components/ImageGenerationModal';

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
  const [isApproved, setIsApproved] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const script = results[0];

  // Hook para geração múltipla de imagens
  const { 
    generateImages, 
    isGenerating: isGeneratingImages, 
    generatedImages, 
    progress, 
    downloadImage, 
    downloadAllImages,
    clearImages 
  } = useMultipleImageGeneration();

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

  const handleApproveScript = () => {
    setIsApproved(true);
    toast.success('✅ Roteiro Aprovado!', {
      description: 'Agora você pode gerar conteúdo adicional.'
    });
  };

  const handleGenerateImages = async () => {
    console.log('🖼️ [FluidaScriptResults] Iniciando geração de imagens para:', script.formato);
    clearImages(); // Limpar imagens anteriores
    setShowImageModal(true);
    await generateImages(script);
  };

  const handleApplyDisney = async () => {
    setDisneyAnimating(true);
    setTimeout(async () => {
      await onApplyDisney(script);
      setDisneyAnimating(false);
    }, 3000);
  };

  // Verificar se o formato suporta áudio
  const isVideoFormat = () => {
    const audioFormats = ['reels', 'video', 'short'];
    return audioFormats.includes(script.formato?.toLowerCase());
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

  const isDisneyApplied = script.disney_applied || script.mentor?.includes('Disney') || script.mentor?.includes('Walt');
  const mentorNickname = getMentorNickname(script.mentor || 'Criativo');
  const estimatedTime = Math.round((script.roteiro.split(/\s+/).length / 150) * 60);
  const isWithinTimeLimit = estimatedTime <= 60;

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
              <div className="flex items-center justify-center gap-4 mt-2">
                <p className="text-slate-400">
                  Criado por: <strong>{mentorNickname}</strong>
                </p>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  isWithinTimeLimit 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <Clock className="h-3 w-3" />
                  {estimatedTime}s
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Roteiro Principal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full"
        >
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  🎬 Roteiro Final
                  {script.equipamentos_utilizados && script.equipamentos_utilizados.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      {script.equipamentos_utilizados.length} equipamento(s)
                    </Badge>
                  )}
                </span>
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

        {/* Cards de Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
                  Transformado com a narrativa mágica de Walt Disney 1928
                </p>
              </CardContent>
            </Card>
          )}

          {/* Status de Tempo */}
          <Card className={`aurora-glass ${
            isWithinTimeLimit 
              ? 'border-green-500/30 bg-green-500/5' 
              : 'border-red-500/30 bg-red-500/5'
          }`}>
            <CardContent className="p-4">
              <div className={`flex items-center gap-2 ${
                isWithinTimeLimit ? 'text-green-400' : 'text-red-400'
              }`}>
                <Clock className="h-5 w-5" />
                <span className="font-semibold">
                  {isWithinTimeLimit ? 'Tempo Ideal ✅' : 'Atenção ao Tempo ⚠️'}
                </span>
              </div>
              <p className={`text-xs mt-1 ${
                isWithinTimeLimit ? 'text-green-300' : 'text-red-300'
              }`}>
                {estimatedTime}s de leitura | {isWithinTimeLimit ? 'Perfeito para redes sociais' : 'Considere encurtar'}
              </p>
            </CardContent>
          </Card>

          {/* Status de Equipamentos */}
          {script.equipamentos_utilizados && script.equipamentos_utilizados.length > 0 && (
            <Card className="aurora-glass border-indigo-500/30 bg-indigo-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">Equipamentos Integrados</span>
                </div>
                <p className="text-xs text-indigo-300 mt-1">
                  {script.equipamentos_utilizados.length} equipamento(s) mencionado(s) no roteiro
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Botão de Aprovação - NOVO */}
        {!isApproved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <Card className="aurora-glass border-green-500/30 bg-green-500/5">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-2">
                      🎯 Roteiro Finalizado!
                    </h3>
                    <p className="text-green-300 text-sm">
                      Revise seu roteiro e aprove para liberar as opções de criação de conteúdo
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={handleApproveScript}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                    >
                      <ThumbsUp className="h-5 w-5 mr-2" />
                      ✅ Aprovar Roteiro
                    </Button>

                    {!isDisneyApplied && (
                      <Button
                        onClick={handleApplyDisney}
                        disabled={isProcessing || disneyAnimating}
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 px-8 py-3"
                      >
                        <Castle className="h-5 w-5 mr-2" />
                        {disneyAnimating ? 'Aplicando...' : 'Disney Magic ✨'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Próximos Passos - Aparece apenas após aprovação */}
        {isApproved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <Card className="aurora-glass border-aurora-electric-purple/30">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  🚀 Próximos Passos
                  <Badge variant="outline" className="text-xs bg-green-500/20 border-green-500 text-green-400">
                    Aprovado ✅
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button
                  onClick={handleGenerateImages}
                  disabled={isProcessing || isGeneratingImages}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGeneratingImages ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4 mr-2" />
                  )}
                  {script.formato === 'carrossel' ? 'Gerar 5 Imagens' : 'Gerar Imagem'}
                </Button>

                {/* Mostrar áudio apenas para formatos de vídeo */}
                {isVideoFormat() && (
                  <Button
                    onClick={() => onGenerateAudio(script)}
                    disabled={isProcessing}
                    variant="outline"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Gerar Áudio
                  </Button>
                )}

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
        )}

        {/* Elementos Universais */}
        {script.elementos_aplicados && isApproved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <ElementosUniversaisDisplay
              elementos={script.elementos_aplicados}
              mentor={mentorNickname}
              especialidades={script.especialidades_aplicadas}
            />
          </motion.div>
        )}
      </div>

      {/* Modal de Geração de Imagens */}
      <ImageGenerationModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        isGenerating={isGeneratingImages}
        progress={progress}
        generatedImages={generatedImages}
        onDownloadImage={downloadImage}
        onDownloadAll={downloadAllImages}
        formato={script.formato}
      />
    </>
  );
};

export default FluidaScriptResults;
