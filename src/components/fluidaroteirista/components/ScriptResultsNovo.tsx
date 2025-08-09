import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Copy, 
  Download, 
  Share2, 
  Sparkles, 
  TrendingUp,
  BookOpen,
  Brain,
  Star,
  Award,
  Wand2,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Volume2
} from "lucide-react";
import { toast } from 'sonner';
import ImprovedScriptFormatter from './ImprovedScriptFormatter';
import ImprovedReelsFormatter from './ImprovedReelsFormatter';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useAudioGeneration } from '@/hooks/useAudioGeneration';
import { useSaveScript } from '../hooks/useSaveScript';

interface ScientificInsight {
  id: string;
  title: string;
  summary: string;
  relevanceScore: number;
  keywords: string[];
  source: string;
}

interface ScriptResult {
  id: string;
  content: string;
  format: string;
  scientificBasis: string[];
  qualityScore: number;
  improvements?: string[];
}

interface ScriptResultsNovoProps {
  results: ScriptResult[];
  scientificInsights: ScientificInsight[];
  onNewScript: () => void;
  onGoBack: () => void;
}

const ScriptResultsNovo: React.FC<ScriptResultsNovoProps> = ({
  results,
  scientificInsights,
  onNewScript,
  onGoBack
}) => {
const [activeResult, setActiveResult] = useState(0);

  // Hooks de geração e salvamento
  const { generateImage, isGenerating: isGeneratingImage, generatedImageUrl } = useImageGeneration();
  const { generateAudio, isGenerating: isGeneratingAudio, audioUrl, downloadAudio } = useAudioGeneration();
  const { saveScript, isSaving } = useSaveScript();

  const handleGenerateImage = async () => {
    await generateImage({ roteiro: results[activeResult].content, formato: results[activeResult].format });
  };

  const handleGenerateAudio = async () => {
    await generateAudio({ 
      text: results[activeResult].content,
      mentor: 'Especialista',
      isDisneyMode: false
    });
  };

  const handleApproveAndSave = async () => {
    await saveScript({
      content: results[activeResult].content,
      title: `Roteiro ${results[activeResult].format}`,
      format: results[activeResult].format,
      equipment_used: []
    });
  };

  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Conteúdo copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar conteúdo');
    }
  };

  const handleDownload = (content: string, format: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roteiro-${format}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Roteiro baixado com sucesso!');
  };

  const handleShare = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Roteiro Fluida',
          text: content
        });
      } catch (error) {
        // Fallback para copy
        handleCopyContent(content);
      }
    } else {
      handleCopyContent(content);
    }
  };

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-slate-400">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum resultado encontrado</p>
        </div>
      </motion.div>
    );
  }

  const currentResult = results[activeResult];
  const formatLc = (currentResult.format || '').toLowerCase();
  const canGenerateImage = ['carrossel','carousel','stories','story','artigo','article','blog'].some(k => formatLc.includes(k));
  const canGenerateAudio = formatLc.includes('reels') || formatLc.includes('reel') || formatLc.includes('vídeo longo') || formatLc.includes('video longo') || formatLc.includes('video_longo') || formatLc.includes('long-form') || formatLc.includes('longform') || formatLc.includes('longo');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="h-6 w-px bg-slate-600" />
          
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">Roteiro Gerado</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Button
            variant="outline"
            onClick={onNewScript}
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Novo Roteiro
          </Button>
        </motion.div>
      </div>

      {/* Métricas de Qualidade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {currentResult.qualityScore}%
                  </div>
                  <div className="text-sm text-slate-400">Score de Qualidade</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {currentResult.scientificBasis.length}
                  </div>
                  <div className="text-sm text-slate-400">Bases Científicas</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">IA+</div>
                  <div className="text-sm text-slate-400">Geração Avançada</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">PRO</div>
                  <div className="text-sm text-slate-400">Versão Premium</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Conteúdo Principal - Layout em Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Coluna Principal - Roteiro */}
        <div className="lg:col-span-2">
          {formatLc.includes('reels') ? (
            <section className="space-y-6">
              <header>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Roteiro Gerado</h2>
                <div className="mt-1 text-sm text-muted-foreground">{currentResult.format.toUpperCase()}</div>
              </header>
              <div className="space-y-6">
                <ImprovedReelsFormatter 
                  roteiro={currentResult.content}
                  estimatedTime={45}
                />
                <div className="flex flex-wrap gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyContent(currentResult.content)}
                    className="text-foreground border-border"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(currentResult.content, currentResult.format)}
                    className="text-foreground border-border"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(currentResult.content)}
                    className="text-foreground border-border"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </section>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Roteiro Gerado
                  <Badge variant="secondary" className="ml-auto bg-emerald-500/20 text-emerald-400">
                    {currentResult.format.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Usando o novo formatador melhorado */}
                <ImprovedScriptFormatter 
                  script={{
                    roteiro: currentResult.content,
                    formato: currentResult.format,
                    emocao_central: 'Confiança',
                    intencao: 'Educar e engajar',
                    objetivo: 'Informar sobre tratamento',
                    mentor: 'Especialista'
                  }} 
                />
                
                {/* Ações do Roteiro */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyContent(currentResult.content)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(currentResult.content, currentResult.format)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(currentResult.content)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna Lateral - Informações e Ações */}
        <div className="space-y-6">
          {/* Base Científica */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4 text-blue-400" />
                Base Científica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentResult.scientificBasis.length > 0 ? (
                currentResult.scientificBasis.slice(0, 3).map((basis, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-400 font-medium text-xs">Artigo Científico</span>
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1">{basis}</h4>
                    <p className="text-slate-400 text-xs">
                      Base científica utilizada no roteiro
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Nenhuma base científica</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Próximas Ações */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-yellow-400" />
                Próximas Ações
              </CardTitle>
            </CardHeader>
            <CardContent>
<div className="space-y-3">
                {canGenerateImage && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage}
                      className="w-full justify-start border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {isGeneratingImage ? "Gerando imagem..." : "Gerar Imagem com IA"}
                    </Button>

                    {generatedImageUrl && (
                      <div className="mt-2">
                        <img
                          src={generatedImageUrl}
                          alt="Imagem gerada por IA para o roteiro"
                          className="rounded-md border border-emerald-500/20"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </>
                )}

                {canGenerateAudio && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateAudio}
                      disabled={isGeneratingAudio}
                      className="w-full justify-start border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      {isGeneratingAudio ? "Gerando áudio..." : "Converter para Áudio"}
                    </Button>

                    {audioUrl && (
                      <div className="mt-2 space-y-2">
                        <audio controls src={audioUrl} className="w-full" />
                        <Button variant="ghost" size="sm" onClick={() => downloadAudio('roteiro-fluida.mp3')} className="text-blue-300 hover:text-blue-200">
                          Baixar áudio
                        </Button>
                      </div>
                    )}
                  </>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApproveAndSave}
                  disabled={isSaving}
                  className="w-full justify-start border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isSaving ? "Salvando..." : "Aprovar e Salvar"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Melhorias (se houver) */}
          {currentResult.improvements && currentResult.improvements.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Melhorias Sugeridas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentResult.improvements.slice(0, 2).map((improvement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20"
                  >
                    <p className="text-slate-100 text-sm">{improvement}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScriptResultsNovo;