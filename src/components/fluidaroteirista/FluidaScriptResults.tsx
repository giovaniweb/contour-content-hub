
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  RotateCcw, 
  Image as ImageIcon, 
  Mic, 
  Copy, 
  Download,
  Heart,
  Share
} from "lucide-react";
import { toast } from "sonner";

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
  const [approvedScript, setApprovedScript] = useState<number | null>(null);
  const [showDisneyOption, setShowDisneyOption] = useState<number | null>(null);

  const handleApproveScript = (index: number) => {
    setApprovedScript(index);
    setShowDisneyOption(index);
    toast.success("✅ Roteiro Aprovado!", {
      description: "Agora você pode aplicar a magia Disney ou gerar conteúdo adicional."
    });
  };

  const handleCopyScript = (script: any) => {
    const textToCopy = typeof script.roteiro === 'string' ? script.roteiro : script.content;
    navigator.clipboard.writeText(textToCopy);
    toast.success("📋 Roteiro copiado!", {
      description: "O roteiro foi copiado para sua área de transferência."
    });
  };

  const handleApplyDisneyMagic = (script: any, index: number) => {
    onApplyDisney(script);
    setShowDisneyOption(null);
    toast.success("✨ Magia Disney 1928 Aplicada!", {
      description: "Walt Disney transformou seu roteiro com narrativa encantadora."
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">
          🎬 Seus Roteiros FLUIDA
        </h1>
        <p className="text-slate-400">
          Roteiros criativos e prontos para bombar nas redes sociais
        </p>
      </motion.div>

      {/* Results Grid */}
      <div className="grid gap-6">
        {results.map((script, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="aurora-glass border-aurora-electric-purple/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-white flex items-center gap-2">
                      <span className="text-2xl">
                        {script.formato === 'carrossel' ? '📱' : 
                         script.formato === 'stories' ? '📸' : 
                         script.formato === 'imagem' ? '🖼️' : '🎬'}
                      </span>
                      Roteiro {script.formato?.charAt(0).toUpperCase() + script.formato?.slice(1) || 'Personalizado'}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple">
                        {script.emocao_central || 'Criativo'}
                      </Badge>
                      <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple">
                        {script.intencao || 'Engajar'}
                      </Badge>
                      <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple">
                        {script.mentor || 'Fluida'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyScript(script)}
                      className="border-aurora-electric-purple/30 text-slate-300 hover:bg-aurora-electric-purple/20"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-aurora-electric-purple/30 text-slate-300 hover:bg-aurora-electric-purple/20"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Script Content */}
                <div className="p-4 rounded-lg bg-slate-800/30 border border-aurora-electric-purple/20">
                  <pre className="text-slate-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {script.roteiro || script.content}
                  </pre>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {approvedScript !== index && (
                    <Button
                      onClick={() => handleApproveScript(index)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Aprovar Roteiro
                    </Button>
                  )}

                  {showDisneyOption === index && (
                    <Button
                      onClick={() => handleApplyDisneyMagic(script, index)}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      ✨ Fluida Encantadora
                    </Button>
                  )}

                  {approvedScript === index && (
                    <>
                      <Button
                        onClick={() => onGenerateImage(script)}
                        disabled={isProcessing}
                        variant="outline"
                        className="border-aurora-electric-purple/30 text-slate-300 hover:bg-aurora-electric-purple/20"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Gerar Imagem com IA
                      </Button>

                      <Button
                        onClick={() => onGenerateAudio(script)}
                        disabled={isProcessing}
                        variant="outline"
                        className="border-aurora-electric-purple/30 text-slate-300 hover:bg-aurora-electric-purple/20"
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Gerar Áudio Encantador
                      </Button>

                      <Button
                        variant="outline"
                        className="border-aurora-electric-purple/30 text-slate-300 hover:bg-aurora-electric-purple/20"
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                    </>
                  )}
                </div>

                {/* Script Metadata */}
                {script.objetivo && (
                  <div className="text-sm text-slate-400 pt-4 border-t border-aurora-electric-purple/10">
                    <strong>Objetivo:</strong> {script.objetivo}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* New Script Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Button
          onClick={onNewScript}
          className="bg-aurora-gradient-primary hover:opacity-90 text-white px-8 py-3"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Criar Novo Roteiro
        </Button>
      </motion.div>
    </div>
  );
};

export default FluidaScriptResults;
