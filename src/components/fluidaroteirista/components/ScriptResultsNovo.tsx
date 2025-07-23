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

      {/* Conteúdo Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Roteiro
            </TabsTrigger>
            <TabsTrigger value="scientific" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Base Científica
            </TabsTrigger>
            <TabsTrigger value="improvements" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Melhorias
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Ações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {currentResult.format.toUpperCase()}
                    </Badge>
                    Conteúdo do Roteiro
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyContent(currentResult.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(currentResult.content, currentResult.format)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(currentResult.content)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                  <pre className="whitespace-pre-wrap text-slate-100 font-mono text-sm leading-relaxed">
                    {currentResult.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scientific" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Fundamentação Científica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentResult.scientificBasis.length > 0 ? (
                  currentResult.scientificBasis.map((basis, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-medium text-sm">Artigo Científico</span>
                      </div>
                      <h4 className="text-white font-medium mb-1">{basis}</h4>
                      <p className="text-slate-400 text-sm">
                        Artigo utilizado como base para fundamentar o conteúdo do roteiro
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma base científica encontrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="improvements" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Sugestões de Melhoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentResult.improvements && currentResult.improvements.length > 0 ? (
                  currentResult.improvements.map((improvement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20"
                    >
                      <p className="text-slate-100">{improvement}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Excelente! Nenhuma melhoria necessária.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Próximas Ações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  >
                    <ImageIcon className="w-6 h-6" />
                    <span>Gerar Imagem</span>
                    <span className="text-xs opacity-70">Com IA</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Volume2 className="w-6 h-6" />
                    <span>Gerar Áudio</span>
                    <span className="text-xs opacity-70">Text-to-Speech</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>Aprovar</span>
                    <span className="text-xs opacity-70">Salvar como Final</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default ScriptResultsNovo;