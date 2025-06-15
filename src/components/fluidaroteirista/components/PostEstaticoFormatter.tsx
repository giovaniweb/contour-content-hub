import React from 'react';
import { motion } from 'framer-motion';
import { parsePostEstatico, validatePostEstatico } from '../utils/postEstaticoParser';
import PostEstaticoCard from './PostEstaticoCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, Instagram, Type, MessageSquare, CheckCircle, AlertTriangle, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { toast } from "sonner";
import { useState } from 'react';

interface PostEstaticoFormatterProps {
  roteiro: string;
}

const PostEstaticoFormatter: React.FC<PostEstaticoFormatterProps> = ({ roteiro }) => {
  const data = parsePostEstatico(roteiro);
  const validation = data ? validatePostEstatico(data) : { isValid: false, issues: ['Erro ao processar roteiro'], score: 0 };

  // Estados para botões de ação
  const [isApproved, setIsApproved] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  // Aprovar roteiro
  const handleApprove = () => {
    setIsApproved(true);
    toast.success("Roteiro aprovado com sucesso! 🎉 Agora é possível gerar imagem.");
  };
  // Simular melhorar roteiro
  const handleImprove = async () => {
    setIsImproving(true);
    toast("Chamando IA para melhorar roteiro (simulado)");
    setTimeout(() => {
      toast.success("Roteiro melhorado! (exemplo 👩‍🎤)");
      setIsImproving(false);
    }, 2000);
  };
  // Novo roteiro
  const handleNew = () => {
    window.location.reload();
  };
  // Simular gerar imagem
  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    toast("Gerando imagem (simulado)...");
    setTimeout(() => {
      toast.success("Imagem gerada!");
      setIsGeneratingImg(false);
    }, 2000);
  };

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Erro ao processar o roteiro do post estático.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header do Post Estático Aurora */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-4">
          <Image className="h-10 w-10 text-aurora-electric-purple aurora-glow" />
          <h2 className="text-3xl font-bold aurora-heading">Post Estático Instagram</h2>
          <Instagram className="h-8 w-8 text-aurora-soft-pink aurora-glow" />
        </div>
        
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Badge variant="outline" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
            <Type className="h-3 w-3 mr-1" />
            Texto + Imagem
          </Badge>
          <Badge variant="outline" className="bg-aurora-soft-pink/20 text-aurora-soft-pink border-aurora-soft-pink/30">
            <MessageSquare className="h-3 w-3 mr-1" />
            Legenda Completa
          </Badge>
          <Badge variant="outline" className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Visual Sugerido
          </Badge>
        </div>
        
        <p className="text-sm text-slate-300 aurora-body max-w-2xl mx-auto">
          ✨ Post estático otimizado para engajamento com texto impactante e legenda persuasiva
        </p>
      </motion.div>

      {/* Validação do Post */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={`aurora-glass border ${validation.isValid ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
          <CardHeader className="pb-4">
            <CardTitle className={`flex items-center gap-3 ${validation.isValid ? 'text-green-400' : 'text-yellow-400'}`}>
              {validation.isValid ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
              Validação do Post Estático
              <Badge variant="outline" className={validation.isValid ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                Score: {validation.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validation.isValid ? (
              <p className="text-green-300 text-sm">
                ✅ Post estático estruturado corretamente para Instagram
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-yellow-300 text-sm font-medium">Pontos de melhoria:</p>
                <ul className="space-y-1">
                  {validation.issues.map((issue, index) => (
                    <li key={index} className="text-yellow-200 text-sm flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* BLOCO DE BOTÕES PRINCIPAIS para Post Estático */}
      <div className="flex flex-wrap justify-center gap-3 mt-6 mb-2">
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-aurora-emerald text-white font-semibold shadow hover:bg-aurora-electric-purple transition-all border border-aurora-emerald/40 text-base disabled:opacity-60"
          onClick={handleApprove}
          disabled={isApproved}
        >
          <Sparkles className="h-5 w-5" />
          {isApproved ? "Roteiro Aprovado" : "Aprovar Roteiro"}
        </button>
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-aurora-neon-blue text-white font-semibold shadow hover:bg-aurora-electric-purple transition-all border border-aurora-neon-blue/40 text-base disabled:opacity-60"
          onClick={handleImprove}
          disabled={isImproving || isApproved}
        >
          {isImproving ? <Loader2 className="animate-spin h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
          Melhorar Roteiro
        </button>
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-800/80 text-slate-100 font-semibold shadow border border-slate-600/40 hover:bg-slate-900 transition-all text-base"
          onClick={handleNew}
          disabled={isImproving}
        >
          Novo Roteiro
        </button>
        <button
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-aurora-electric-purple text-white font-semibold shadow-lg hover:bg-aurora-emerald transition-all border border-aurora-electric-purple/50 text-lg disabled:opacity-60"
          onClick={handleGenerateImage}
          disabled={!isApproved || isGeneratingImg}
        >
          {isGeneratingImg ? <Loader2 className="h-5 w-5 animate-spin" /> : <Images className="h-6 w-6" />}
          {isGeneratingImg ? "Gerando Imagem..." : "Gerar Imagem"}
        </button>
      </div>

      {/* Estrutura do Post Aurora */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="aurora-glass border-aurora-neon-blue/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-neon-blue/5 via-aurora-electric-purple/5 to-aurora-soft-pink/5 opacity-50" />
          
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="text-center aurora-heading text-xl text-aurora-neon-blue">
              📱 Estrutura do Post
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Texto da Imagem */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-16 h-16 rounded-full bg-aurora-gradient-primary flex items-center justify-center text-white text-sm font-bold shadow-lg mb-3 mx-auto relative">
                  <Type className="h-6 w-6 relative z-10" />
                  <div className="absolute inset-0 rounded-full bg-aurora-gradient-primary opacity-30 animate-ping" />
                </div>
                <div className="text-aurora-electric-purple font-medium aurora-body mb-1">
                  Texto da Imagem
                </div>
                <div className="text-xs text-slate-400">
                  Overlay impactante
                </div>
              </motion.div>

              {/* Legenda */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-aurora-soft-pink to-aurora-electric-purple flex items-center justify-center text-white text-sm font-bold shadow-lg mb-3 mx-auto relative">
                  <MessageSquare className="h-6 w-6 relative z-10" />
                  <div className="absolute inset-0 rounded-full bg-aurora-soft-pink opacity-30 animate-ping" />
                </div>
                <div className="text-aurora-soft-pink font-medium aurora-body mb-1">
                  Legenda Completa
                </div>
                <div className="text-xs text-slate-400">
                  Call-to-action
                </div>
              </motion.div>

              {/* Sugestão Visual */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-aurora-emerald to-aurora-lime flex items-center justify-center text-white text-sm font-bold shadow-lg mb-3 mx-auto relative">
                  <Sparkles className="h-6 w-6 relative z-10" />
                  <div className="absolute inset-0 rounded-full bg-aurora-emerald opacity-30 animate-ping" />
                </div>
                <div className="text-aurora-emerald font-medium aurora-body mb-1">
                  Sugestão Visual
                </div>
                <div className="text-xs text-slate-400">
                  Direção criativa
                </div>
              </motion.div>
            </div>
            <p className="text-center text-sm aurora-body">
              ✨ Formato otimizado para máximo impacto visual no feed do Instagram
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Card Principal do Post */}
      <PostEstaticoCard data={data} />

      {/* Dicas Aurora para Posts Estáticos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="aurora-glass border-aurora-emerald/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-emerald/5 to-aurora-lime/5 opacity-50" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-aurora-emerald text-xl flex items-center gap-3 aurora-heading">
              <Sparkles className="h-6 w-6 aurora-glow-emerald" />
              Dicas para seu Post Estático Aurora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm relative z-10">
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-emerald text-lg">✅</span>
              <span className="aurora-body">Texto da imagem deve ser grande, legível e impactante (máximo 8 palavras)</span>
            </motion.div>
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-emerald text-lg">✅</span>
              <span className="aurora-body">Use cores contrastantes entre texto e fundo da imagem</span>
            </motion.div>
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-emerald text-lg">✅</span>
              <span className="aurora-body">Legenda deve contar uma história e incluir call-to-action claro</span>
            </motion.div>
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-emerald text-lg">✅</span>
              <span className="aurora-body">Imagem deve ser de alta qualidade e seguir identidade visual da clínica</span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PostEstaticoFormatter;
