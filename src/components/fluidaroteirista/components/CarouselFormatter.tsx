import React from 'react';
import { motion } from 'framer-motion';
import { parseCarouselSlides, validateCarouselSlides } from '../utils/carouselParser';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Instagram, Sparkles, Save, Loader2, Wand2, Clock } from 'lucide-react';
import CarouselSequencePreview from './CarouselSequencePreview';
import { useSaveScript } from "../hooks/useSaveScript";
import { toast } from "sonner";
import { useState } from "react";
import { sanitizeText } from '@/utils/textSanitizer';
import { calculateContentTime } from '@/utils/timeCalculator';
import { Helmet } from 'react-helmet-async';
import CopyButton from '@/components/ui/CopyButton';
interface CarouselFormatterProps {
  roteiro: string;
}
const CarouselFormatter: React.FC<CarouselFormatterProps> = ({
  roteiro
}) => {
  const slides = parseCarouselSlides(sanitizeText(roteiro));
  const validation = validateCarouselSlides(sanitizeText(roteiro));
  const hasErrors = !validation.isValid;
  const {
    saveScript,
    isSaving
  } = useSaveScript();
  const carouselTitle = slides[0]?.title || "Carrossel Aurora";
  const equipment_used: string[] = [];
  const [isImproving, setIsImproving] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  
  const [isApproved, setIsApproved] = useState(false);

  // Calcula tempo total baseado no conteúdo real dos slides
  const totalContent = slides.map(s => s.texto).join(' ');
  const timeInfo = calculateContentTime(totalContent);
  const combinedText = slides.map((s, idx) => {
    const title = (s.title || `Slide ${s.number || idx + 1}`).trim();
    const body = (s.texto || '').trim();
    return `✨ ${title}\n${body}`;
  }).join('\n\n--------\n\n');
  const handleSave = async () => {
    await saveScript({
      content: roteiro,
      title: carouselTitle,
      format: "carrossel",
      equipment_used: equipment_used
    });
  };

  // Aprovar roteiro: após isso liberar gerar imagem/áudio
  const handleApprove = () => {
    setIsApproved(true);
    toast.success("Roteiro aprovado com sucesso! 🎉 Agora é possível gerar imagem e áudio.");
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
  if (slides.length === 0) {
    return <div className="text-center py-8">
        <p className="text-slate-400">Nenhum slide encontrado no roteiro.</p>
      </div>;
  }
  return <div className="space-y-8">
      <Helmet>
        <title>Carrossel Instagram | Aurora</title>
        <meta name="description" content="Carrossel Instagram em texto corrido, com separadores por emoji e linha entre slides." />
        <link rel="canonical" href="/fluidaroteirista" />
      </Helmet>
      {/* Header bonito do Carrossel Aurora */}
      <motion.header initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Images className="h-10 w-10 text-aurora-electric-purple aurora-glow" />
          <h2 className="text-3xl font-extrabold aurora-heading text-aurora-electric-purple drop-shadow">
            Carrossel Instagram
          </h2>
          <Instagram className="h-8 w-8 text-aurora-soft-pink aurora-glow" />
        </div>

        <div className="flex items-center justify-center gap-3 mt-2">
          <CarouselSequencePreview slides={slides.map(sl => ({
          title: sl.title
        }))} />
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="outline" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
            {slides.length} Slides
          </Badge>
          <Badge variant="outline" className={`${timeInfo.isOverLimit ? 'bg-aurora-pink/20 text-aurora-pink border-aurora-pink/30' : 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30'}`}>
            <Clock className="w-3 h-3 mr-1" />
            {timeInfo.displayTime}
          </Badge>
          <span className="text-xs text-aurora-neon-blue">✦ Texto corrido com separadores</span>
        </div>
      </motion.header>
      {/* Avisos de validação */}
      {hasErrors && (
        <Card className="aurora-glass border-aurora-pink/30 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-aurora-pink text-base">Ajustes necessários no carrossel</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex flex-wrap gap-2">
              {validation.errors.map((err, i) => (
                <Badge key={i} variant="outline" className="bg-aurora-pink/15 text-aurora-pink border-aurora-pink/30">{err}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Texto corrido simples dos slides */}
      <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <section className="max-w-3xl mx-auto">
          <div className="flex justify-end mb-3">
            <CopyButton text={combinedText} successMessage="Texto do carrossel copiado!" />
          </div>
          <article className="text-foreground whitespace-pre-wrap leading-relaxed aurora-body">
            {slides.map((s, i) => (
              <div key={i}>
                <p className="font-semibold">✨ {s.title?.trim() || `Slide ${s.number || i + 1}`}</p>
                <p className="mt-1">{(s.texto || '').trim() || '(sem texto)'}</p>
                {i < slides.length - 1 && <hr className="my-4 border-border" />}
              </div>
            ))}
          </article>
        </section>
      </motion.div>

      {/* Equipamentos Integrados */}
      {equipment_used.length > 0 && <div>
          {/* Supondo que EquipmentDetails mostre o bloco de equipamentos integrados */}
          {/* <EquipmentDetails equipments={equipment_used} roteiro={roteiro} /> */}
        </div>}

      {/* BLOCO DE BOTÕES PRINCIPAIS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
      >
        <button
          onClick={handleApprove}
          disabled={isApproved}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            isApproved 
              ? 'bg-aurora-emerald/20 text-aurora-emerald border border-aurora-emerald/30' 
              : 'bg-aurora-emerald/10 text-aurora-emerald border border-aurora-emerald/20 hover:bg-aurora-emerald/20 hover:scale-105'
          }`}
        >
          <span className="text-lg">✅</span>
          {isApproved ? 'Roteiro Aprovado' : 'Aprovar roteiro'}
        </button>

        <button
          onClick={handleImprove}
          disabled={isImproving}
          className="flex items-center gap-2 px-6 py-3 bg-aurora-electric-purple/10 text-aurora-electric-purple border border-aurora-electric-purple/20 rounded-xl font-medium hover:bg-aurora-electric-purple/20 hover:scale-105 transition-all duration-200"
        >
          {isImproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          Melhorar roteiro
        </button>

        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-6 py-3 bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/20 rounded-xl font-medium hover:bg-aurora-cyan/20 hover:scale-105 transition-all duration-200"
        >
          <span className="text-lg">🔄</span>
          Novo roteiro
        </button>

        {isApproved && (
          <>
            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImg}
              className="flex items-center gap-2 px-6 py-3 bg-aurora-emerald/10 text-aurora-emerald border border-aurora-emerald/20 rounded-xl font-medium hover:bg-aurora-emerald/20 hover:scale-105 transition-all duration-200 aurora-button-enhanced"
            >
              {isGeneratingImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Images className="w-4 h-4" />}
              Gerar {slides.length} Imagens
            </button>

          </>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-aurora-soft-pink/10 text-aurora-soft-pink border border-aurora-soft-pink/20 rounded-xl font-medium hover:bg-aurora-soft-pink/20 hover:scale-105 transition-all duration-200"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar roteiro
        </button>
      </motion.div>

      {/* Dicas Aurora para o Carrossel */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.5
    }}>
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
    </div>;
};
function Tip({
  text
}: {
  text: string;
}) {
  return <span className="flex items-center gap-2 px-3 py-1 bg-aurora-emerald/10 text-aurora-emerald rounded-full border border-aurora-emerald/20 text-xs font-medium aurora-body">{text}</span>;
}
export default CarouselFormatter;