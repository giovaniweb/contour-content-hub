import React from 'react';
import { motion } from 'framer-motion';
import { parseCarouselSlides } from '../utils/carouselParser';
import CarouselSlideCard from './CarouselSlideCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Instagram, Sparkles, Save } from 'lucide-react';
import CarouselSequencePreview from './CarouselSequencePreview';
import { useSaveScript } from "../hooks/useSaveScript";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";
import { useState } from "react";

interface CarouselFormatterProps {
  roteiro: string;
}

const CarouselFormatter: React.FC<CarouselFormatterProps> = ({ roteiro }) => {
  const slides = parseCarouselSlides(roteiro);

  // Nova lógica de salvamento
  const { saveScript, isSaving } = useSaveScript();

  // Infere o título do carrossel (primeira linha ou título padrão)
  const carouselTitle = slides[0]?.title || "Carrossel Aurora";

  // Infere equipamentos se disponíveis (exemplo: via regex ou metadados - aqui fica vazio)
  const equipment_used: string[] = [];

  // Novo: loading states para melhorar, imagem e audio
  const [isImproving, setIsImproving] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  // Função para salvar
  const handleSave = async () => {
    await saveScript({
      content: roteiro,
      title: carouselTitle,
      format: "carrossel",
      equipment_used: equipment_used
    });
  };

  const handleApprove = () => {
    toast.success("Roteiro aprovado com sucesso! 🎉");
  };

  const handleImprove = async () => {
    setIsImproving(true);
    toast("Chamando IA para melhorar roteiro (simulado)");
    setTimeout(() => {
      toast.success("Roteiro melhorado! (exemplo 👩‍🎤)");
      setIsImproving(false);
    }, 2000);
  };

  const handleNew = () => {
    window.location.reload();
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    toast("Gerando imagem (simulado)...");
    setTimeout(() => {
      toast.success("Imagem gerada!");
      setIsGeneratingImg(false);
    }, 2000);
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    toast("Gerando áudio (simulado)...");
    setTimeout(() => {
      toast.success("Áudio gerado!");
      setIsGeneratingAudio(false);
    }, 2000);
  };

  if (slides.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Nenhum slide encontrado no roteiro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header bonito do Carrossel Aurora */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-4">
          <Images className="h-10 w-10 text-aurora-electric-purple aurora-glow" />
          <h2 className="text-3xl font-extrabold aurora-heading text-aurora-electric-purple drop-shadow">
            Carrossel Instagram
          </h2>
          <Instagram className="h-8 w-8 text-aurora-soft-pink aurora-glow" />
        </div>

        <div className="flex items-center justify-center gap-3 mt-2">
          <CarouselSequencePreview slides={slides.map(sl => ({ title: sl.title }))} />
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="outline" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">{slides.length} Slides</Badge>
          <span className="text-xs text-aurora-neon-blue">Arraste ou deslize →</span>
        </div>
      </motion.div>

      {/* Grupo de botões principais (aprovar, melhorar, novo) */}
      <div className="flex flex-wrap justify-center gap-3 mt-6 mb-2">
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-aurora-emerald text-white font-semibold shadow hover:bg-aurora-electric-purple transition-all border border-aurora-emerald/40 text-base disabled:opacity-60"
          onClick={handleApprove}
          disabled={isSaving || isImproving}
        >
          <Sparkles className="h-5 w-5" />
          Aprovar Roteiro
        </button>
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-aurora-neon-blue text-white font-semibold shadow hover:bg-aurora-electric-purple transition-all border border-aurora-neon-blue/40 text-base disabled:opacity-60"
          onClick={handleImprove}
          disabled={isSaving || isImproving}
        >
          {isImproving ? <Loader2 className="animate-spin h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
          Melhorar Roteiro
        </button>
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-800/80 text-slate-100 font-semibold shadow border border-slate-600/40 hover:bg-slate-900 transition-all text-base"
          onClick={handleNew}
          disabled={isSaving || isImproving}
        >
          Novo Roteiro
        </button>
      </div>

      {/* Grid de Slides */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {slides.map((slide, index) => (
            <CarouselSlideCard key={index} slide={slide} />
          ))}
        </div>
      </motion.div>

      {/* Botões de Gerar Imagem e Gerar Áudio, agora após tudo */}
      <div className="flex flex-wrap justify-center gap-5 mt-7">
        <button
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-aurora-electric-purple text-white font-semibold shadow-lg hover:bg-aurora-emerald transition-all border border-aurora-electric-purple/50 text-lg disabled:opacity-60"
          onClick={handleGenerateImage}
          disabled={isGeneratingImg}
        >
          {isGeneratingImg ? <Loader2 className="h-5 w-5 animate-spin" /> : <Images className="h-6 w-6" />}
          {isGeneratingImg ? "Gerando Imagem..." : "Gerar Imagem"}
        </button>
        <button
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-aurora-neon-blue text-white font-semibold shadow-lg hover:bg-aurora-emerald transition-all border border-aurora-neon-blue/50 text-lg disabled:opacity-60"
          onClick={handleGenerateAudio}
          disabled={isGeneratingAudio}
        >
          {isGeneratingAudio ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-6 w-6" />}
          {isGeneratingAudio ? "Gerando Áudio..." : "Gerar Áudio"}
        </button>
      </div>

      {/* Dicas Aurora para o Carrossel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="aurora-glass border-aurora-emerald/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-emerald/10 to-aurora-lime/5 opacity-50 pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-aurora-emerald text-xl flex items-center gap-3 aurora-heading">
              <Sparkles className="h-6 w-6 aurora-glow-emerald" />
              Dicas para seu Carrossel Aurora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm relative z-10">
            <div className="flex flex-wrap gap-3">
              <Tip text="Primeiro slide = atenção nos 3 primeiros segundos" />
              <Tip text="Use imagens de alta qualidade e consistentes" />
              <Tip text="Último slide sempre com call-to-action claro" />
              <Tip text="Mantenha texto legível e pouco poluído" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Botão de salvar - FINAL DA PÁGINA */}
      <div className="flex justify-center mt-8">
        <button
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-aurora-emerald text-white font-semibold shadow-lg hover:bg-aurora-electric-purple transition-all border border-aurora-emerald/50 text-lg disabled:opacity-60"
          onClick={handleSave}
          disabled={isSaving}
          title="Salvar roteiro"
        >
          <Save className="h-6 w-6" />
          {isSaving ? "Salvando..." : "Salvar Roteiro"}
        </button>
      </div>
    </div>
  );
};

function Tip({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2 px-3 py-1 bg-aurora-emerald/10 text-aurora-emerald rounded-full border border-aurora-emerald/20 text-xs font-medium aurora-body">{text}</span>
  );
}

export default CarouselFormatter;
