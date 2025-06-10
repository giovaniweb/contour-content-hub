
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, Download, Play, Pause, Image, Mic } from 'lucide-react';
import { useAudioGeneration } from '@/hooks/useAudioGeneration';

interface FluidaScriptResult {
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
}

interface EnhancedScriptResultsProps {
  results: FluidaScriptResult[];
  onScriptApproved?: (script: any) => void;
  onNewScript?: () => void;
  onGenerateImage?: (script: any) => void;
  isDisneyMode?: boolean;
}

const EnhancedScriptResults: React.FC<EnhancedScriptResultsProps> = ({
  results,
  onScriptApproved,
  onNewScript,
  onGenerateImage,
  isDisneyMode = false
}) => {
  const { generateAudio, downloadAudio, isGenerating, audioUrl } = useAudioGeneration();
  const [playingAudio, setPlayingAudio] = React.useState<string | null>(null);
  const [audioElements, setAudioElements] = React.useState<{ [key: string]: HTMLAudioElement }>({});

  const handleGenerateAudio = async (script: FluidaScriptResult, index: number) => {
    const audioKey = `script-${index}`;
    
    const audioUrl = await generateAudio({
      text: script.roteiro,
      mentor: script.mentor,
      isDisneyMode
    });

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAudio(null);
      setAudioElements(prev => ({ ...prev, [audioKey]: audio }));
    }
  };

  const toggleAudio = (index: number) => {
    const audioKey = `script-${index}`;
    const audio = audioElements[audioKey];
    
    if (!audio) return;

    if (playingAudio === audioKey) {
      audio.pause();
      setPlayingAudio(null);
    } else {
      // Parar outros áudios
      Object.values(audioElements).forEach(a => a.pause());
      audio.play();
      setPlayingAudio(audioKey);
    }
  };

  const handleApproveScript = (script: FluidaScriptResult) => {
    console.log('📝 Aprovando script no EnhancedScriptResults:', script);
    
    // Transformar o script no formato esperado pelo SmartResultDisplay
    const approvedScript = {
      roteiro: script.roteiro,
      formato: script.formato,
      emocao_central: script.emocao_central,
      intencao: script.intencao,
      objetivo: script.objetivo,
      mentor: script.mentor,
      disney_applied: false
    };
    
    if (onScriptApproved) {
      onScriptApproved(approvedScript);
    }
  };

  const isVideoFormat = (formato: string) => {
    return formato.toLowerCase().includes('stories') || formato.toLowerCase().includes('video');
  };

  const isImageFormat = (formato: string) => {
    return formato.toLowerCase().includes('imagem') || formato.toLowerCase().includes('carrossel');
  };

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <Card className="aurora-card border-2 relative overflow-hidden">
            {/* Efeito Aurora no fundo */}
            <div className="absolute inset-0 aurora-gradient-bg opacity-5 pointer-events-none" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 aurora-electric-purple aurora-pulse" />
                <span className="aurora-text-gradient">
                  Roteiro FLUIDA - {result.formato}
                </span>
                {isDisneyMode && (
                  <motion.span 
                    className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨ Modo Disney
                  </motion.span>
                )}
              </CardTitle>
              
              {/* Tags Aurora */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 aurora-glass rounded-full text-sm aurora-neon-blue border border-blue-300/20">
                  Emoção: {result.emocao_central}
                </span>
                <span className="px-3 py-1 aurora-glass rounded-full text-sm aurora-mint-green border border-green-300/20">
                  Intenção: {result.intencao}
                </span>
                <span className="px-3 py-1 aurora-glass rounded-full text-sm aurora-electric-purple border border-purple-300/20">
                  Mentor: {result.mentor}
                </span>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              {/* Objetivo */}
              <div>
                <Label className="aurora-accent font-semibold">Objetivo:</Label>
                <p className="aurora-body mt-1">{result.objetivo}</p>
              </div>

              {/* Roteiro */}
              <div>
                <Label className="aurora-accent font-semibold">Roteiro:</Label>
                <div className="aurora-glass p-4 rounded-xl mt-2 border aurora-glow">
                  <pre className="whitespace-pre-wrap aurora-body font-medium leading-relaxed">
                    {result.roteiro}
                  </pre>
                </div>
              </div>

              {/* Preview de Áudio */}
              {audioElements[`script-${index}`] && (
                <motion.div 
                  className="aurora-glass p-4 rounded-xl border"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAudio(index)}
                      className="aurora-button"
                    >
                      {playingAudio === `script-${index}` ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </Button>
                    <span className="aurora-body text-sm">
                      Áudio gerado com {isDisneyMode ? 'voz encantadora' : `mentor ${result.mentor}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadAudio(`roteiro-${result.formato}-${index + 1}.mp3`)}
                      className="aurora-button ml-auto"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Botões de Ação */}
              <div className="flex flex-wrap gap-3">
                {/* Botão principal de aprovação */}
                <Button 
                  onClick={() => handleApproveScript(result)}
                  className="aurora-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1 min-w-fit"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  ✨ Aprovar e Acessar FluiA Encantador
                </Button>

                {/* Botão de gerar imagem (para formatos de imagem) */}
                {isImageFormat(result.formato) && (
                  <Button
                    onClick={() => onGenerateImage?.(result)}
                    variant="outline"
                    className="aurora-glass border-purple-300/30 hover:border-purple-300/50"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Gerar Imagem
                  </Button>
                )}

                {/* Botão de gerar áudio (para formatos de vídeo/stories) */}
                {(isVideoFormat(result.formato) || !audioElements[`script-${index}`]) && (
                  <Button
                    onClick={() => handleGenerateAudio(result, index)}
                    disabled={isGenerating}
                    variant="outline"
                    className="aurora-glass border-blue-300/30 hover:border-blue-300/50"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Gerando...' : 
                     isVideoFormat(result.formato) ? 'Gerar Voz Encantadora' : 'Gerar Áudio'}
                  </Button>
                )}

                {/* Botão novo roteiro */}
                <Button 
                  variant="outline" 
                  onClick={onNewScript}
                  className="aurora-glass border-gray-300/30 hover:border-gray-300/50"
                >
                  Novo Roteiro
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default EnhancedScriptResults;
