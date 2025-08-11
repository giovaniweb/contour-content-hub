import React from 'react';
import { motion } from 'framer-motion';
import { parseCarouselSlides } from '../utils/carouselParser';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Instagram, Sparkles, Clock } from 'lucide-react';
import CarouselSequencePreview from './CarouselSequencePreview';

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
  
  
  

  // Calcula tempo total baseado no conteúdo real dos slides
  const totalContent = slides.map(s => s.texto).join(' ');
  const timeInfo = calculateContentTime(totalContent);

  // Remove apenas separadores residuais, preservando todo o conteúdo real
  const cleanBody = (text: string) => {
    if (!text) return '';
    const lines = text.split('\n');
    const filtered = lines.filter((l) => {
      const t = l.trim();
      // Remove apenas linhas que são APENAS separadores ou headers vazios
      const dashLineRe = /^[-–—_]{3,}$/;
      const emptyHeaderRe = /^conte[uú]do do slide(\s*\d+)?\s*[-–—:]?\s*$/i;
      return !(dashLineRe.test(t) || emptyHeaderRe.test(t));
    }).map((l) => {
      // Remove separadores no final da linha, mas preserva o conteúdo da linha
      const cleaned = l
        .replace(/\s*[-–—_]{3,}\s*$/, '')
        .replace(/\s*[–—]\s*$/, '');
      return cleaned;
    });
    
    // Junta as linhas preservando quebras intencionais, apenas remove quebras excessivas
    const result = filtered.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    return result;
  };

  const combinedText = slides.map((s, idx) => {
    const title = (s.title || `Slide ${s.number || idx + 1}`).trim();
    const rawBody = (s.texto || '');
    const body = cleanBody(rawBody);
    const header = `🎯 Conteúdo do slide ${s.number || idx + 1} - ✨ ${title}`;
    return body ? `${header} \n\n${body}` : `${header}`;
  }).join('\n\n---------------------------------------------------------------\n\n');

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

      {/* Texto corrido simples dos slides */}
      <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <section className="max-w-3xl mx-auto">
          <div className="flex justify-end mb-3">
            <CopyButton text={combinedText} successMessage="Texto do carrossel copiado!" />
          </div>
          <article className="text-foreground leading-relaxed aurora-body">
            {slides.map((s, i) => {
              const body = cleanBody(s.texto || '');
              const hasBody = body.length > 0;
              return (
                <div key={i}>
                  <h3 className="font-semibold text-white mb-1">
                    🎯 Conteúdo do slide {s.number || i + 1} - ✨ {s.title?.trim() || `Slide ${s.number || i + 1}`}:
                  </h3>
                  {hasBody && (
                    <div className="mt-2 pl-4 border-l-2 border-aurora-electric-purple/20">
                      <div className="font-normal !text-white leading-relaxed whitespace-pre-line">{body}</div>
                    </div>
                  )}
                  {i < slides.length - 1 && <hr className="my-6 border-border border-dashed" />}
                </div>
              );
            })}
          </article>
        </section>
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