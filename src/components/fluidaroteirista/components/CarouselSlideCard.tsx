
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import CopyButton from '@/components/ui/CopyButton';

interface CarouselSlideCardProps {
  slide: {
    number: number;
    title: string;
    texto: string;
    imagem: string;
  };
}

const getSlideIcon = (slideNumber: number): string => {
  const icons = {
    1: "🎯", // Hook/Gancho
    2: "⚡", // Problema
    3: "💡", // Solução
    4: "✨", // Benefícios
    5: "📲"  // CTA
  };
  return icons[slideNumber as keyof typeof icons] || "📝";
};

const getSlideTheme = (slideNumber: number) => {
  const themes = {
    1: {
      bg: "aurora-glass",
      border: "border-aurora-electric-purple/30",
      text: "text-aurora-electric-purple",
      badge: "bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30",
      glow: "aurora-glow",
      gradient: "bg-gradient-to-br from-aurora-electric-purple/10 to-aurora-neon-blue/10"
    },
    2: {
      bg: "aurora-glass",
      border: "border-red-400/30",
      text: "text-red-300",
      badge: "bg-red-500/20 text-red-300 border-red-400/30",
      glow: "shadow-red-400/20",
      gradient: "bg-gradient-to-br from-red-500/10 to-orange-500/10"
    },
    3: {
      bg: "aurora-glass",
      border: "border-aurora-emerald/30",
      text: "text-aurora-emerald",
      badge: "bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30",
      glow: "aurora-glow-emerald",
      gradient: "bg-gradient-to-br from-aurora-emerald/10 to-aurora-lime/10"
    },
    4: {
      bg: "aurora-glass",
      border: "border-aurora-lavender/30",
      text: "text-aurora-lavender",
      badge: "bg-aurora-lavender/20 text-aurora-lavender border-aurora-lavender/30",
      glow: "shadow-aurora-lavender/20",
      gradient: "bg-gradient-to-br from-aurora-lavender/10 to-aurora-soft-pink/10"
    },
    5: {
      bg: "aurora-glass",
      border: "border-aurora-neon-blue/30",
      text: "text-aurora-neon-blue",
      badge: "bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30",
      glow: "aurora-glow-blue",
      gradient: "bg-gradient-to-br from-aurora-neon-blue/10 to-aurora-cyan/10"
    }
  };
  return themes[slideNumber as keyof typeof themes] || themes[1];
};

const isTextoMock = (texto: string) => {
  return !texto || texto.trim() === "" || texto === "Conteúdo do slide" || texto === "Sem texto";
}

const isImagemMock = (imagem: string) => {
  return !imagem || imagem.trim() === "" || imagem === "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave" || imagem === "Sem imagem";
}

const CarouselSlideCard: React.FC<CarouselSlideCardProps> = ({ slide }) => {
  const icon = getSlideIcon(slide.number);
  const theme = getSlideTheme(slide.number);

  // Debug logs para entender o que está vindo no slide
  console.log(`🔍 Slide ${slide.number} - Debug:`, {
    title: slide.title,
    texto: slide.texto,
    imagem: slide.imagem,
    textoLength: slide.texto?.length,
    imagemLength: slide.imagem?.length
  });

  // Função para limpar e formatar o texto
  const cleanAndFormatText = (text: string): string => {
    if (!text || text.trim() === "") return "";
    
    let cleanText = text
      // Remove JSON estruturado mal formatado
      .replace(/[{\[\]}"]/g, '')
      // Converte \n literais em quebras reais
      .replace(/\\n/g, '\n')
      // Remove marcadores de formato JSON
      .replace(/"formato":\s*"[^"]*"/g, '')
      .replace(/"metodologia":\s*"[^"]*"/g, '')
      .replace(/"stories_total":\s*\d+/g, '')
      .replace(/"tempo_total":\s*"[^"]*"/g, '')
      .replace(/"dispositivos_usados":\s*\[[^\]]*\]/g, '')
      .replace(/"tom_narrativo":\s*"[^"]*"/g, '')
      .replace(/"engajamento_esperado":\s*"[^"]*"/g, '')
      // Remove vírgulas soltas e dois pontos
      .replace(/,\s*,/g, ',')
      .replace(/:\s*,/g, ':')
      .replace(/^,+|,+$/g, '')
      // Remove quebras excessivas
      .replace(/\n{3,}/g, '\n\n')
      // Remove espaços no início e fim
      .replace(/^\s+|\s+$/g, '')
      // Normaliza quebras de linha
      .replace(/\s*\n\s*/g, '\n')
      // Remove caracteres especiais de escape
      .replace(/\\"/g, '"');
    
    return cleanText;
  };

  // Verificação melhorada para mostrar conteúdo real
  const rawTexto = slide.texto && slide.texto.trim() !== "" && slide.texto !== "Conteúdo do slide" && slide.texto !== "Sem texto"
    ? slide.texto
    : "Texto não informado.";

  const rawImagem = slide.imagem && slide.imagem.trim() !== "" && slide.imagem !== "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave" && slide.imagem !== "Sem imagem"
    ? slide.imagem
    : "Descrição de imagem não informada.";

  // Aplica formatação
  const texto = cleanAndFormatText(rawTexto);
  const imagem = cleanAndFormatText(rawImagem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: slide.number * 0.06 }}
      whileHover={{ y: -2, scale: 1.025 }}
      className="h-full"
    >
      <Card className={`${theme.bg} ${theme.border} ${theme.glow} border-2 shadow-lg aurora-glass transition-all duration-200 h-full flex flex-col justify-between`}>
        <CardContent className="p-6 relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-2xl aurora-float">{icon}</div>
            <h3 className={`font-bold ${theme.text} text-base sm:text-lg aurora-heading filter drop-shadow`}>{slide.title}</h3>
          </div>
          <div className="flex flex-col gap-6">
            {/* Texto Principal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-aurora-emerald/15 text-aurora-emerald border-aurora-emerald/40 font-semibold px-3 py-1">
                  📝 TEXTO
                </Badge>
                <CopyButton text={texto} successMessage={`Texto do slide ${slide.number} copiado!`} />
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-xl p-4 border border-aurora-emerald/20 backdrop-blur-sm min-h-[80px] shadow-lg">
                <p className="text-slate-100 leading-relaxed text-base font-medium break-words whitespace-pre-line">
                  {texto}
                </p>
              </div>
            </div>

            {/* Descrição da Imagem */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-aurora-neon-blue/15 text-aurora-neon-blue border-aurora-neon-blue/40 font-semibold px-3 py-1">
                  🖼️ IMAGEM
                </Badge>
                <CopyButton text={imagem} successMessage={`Descrição da imagem do slide ${slide.number} copiada!`} />
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-xl p-4 border border-aurora-neon-blue/20 backdrop-blur-sm min-h-[60px] shadow-lg">
                <p className="text-slate-300 leading-relaxed text-sm italic font-normal break-words whitespace-pre-line">
                  {imagem}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CarouselSlideCard;

