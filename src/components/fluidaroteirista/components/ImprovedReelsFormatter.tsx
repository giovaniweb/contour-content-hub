import React from 'react';
import { motion } from 'framer-motion';
import { parseTemporalScript, TemporalScriptBlockData } from '../utils/parseTemporalScript';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Video, Sparkles } from 'lucide-react';

interface ImprovedReelsFormatterProps {
  roteiro: string;
  estimatedTime?: number;
}

const ImprovedReelsFormatter: React.FC<ImprovedReelsFormatterProps> = ({ 
  roteiro, 
  estimatedTime 
}) => {
  // Primeiro, tenta parseamento temporal
  const temporalBlocks = parseTemporalScript(roteiro);
  
  // Se não encontrou blocos temporais válidos, força quebra em parágrafos
  const useTemporalFormat = temporalBlocks.length > 1 || 
    (temporalBlocks.length === 1 && temporalBlocks[0].time !== "");

  const formatLongText = (text: string): string[] => {
    if (!text) return [];

    // 1) Normaliza separadores comuns em quebras de linha
    let pre = text
      .replace(/\r\n?/g, "\n") // normaliza CRLF
      .replace(/\s*[\u2022•·]\s*/g, "\n• ") // bullets
      .replace(/\s*(?:—|–)\s*/g, "\n") // em/en dash como separador
      .replace(/\s*-{2,}\s*/g, "\n") // múltiplos hifens
      .replace(/\s*\*\*\s*/g, "\n") // ** como divisor
      .replace(/(^|\s)(?:\*|\-|•)\s+/gm, "\n$&"); // força quebra antes de bullets

    // 2) Insere quebras antes de rótulos comuns seguidos de : - – —
    pre = pre.replace(
      /(?:^|\s)(gancho|intro|introdução|desenvolvimento|solução|cta|transição|exemplo|benefício|prova|oferta|urgência|conclusão|fechamento|off|narrador|locução|cena|tema|apresentação)\s*[:\-–—]/gmi,
      "\n$1:"
    );

    // 3) Remove formatação excessiva e limpa espaços
    const cleaned = pre
      .replace(/\[[^\]]+\]/g, " ")
      .replace(/\([^)]{3,}\)/g, " ")
      .replace(/^---+$/gm, " ")
      .replace(/^#+\s+/gm, " ")
      .replace(/^\s*(?:off|narrador|locução|cena|gancho|desenvolvimento|solução|cta|transição)\s*[:\-–—]?\s*/gmi, "")
      .replace(/[\t ]+/g, " ")
      .replace(/\s*\n\s*/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // 4) Se já tem quebras naturais, usa-as
    if (cleaned.includes("\n")) {
      return cleaned.split(/\n+/).map((p) => p.trim()).filter(Boolean);
    }

    // 5) Trata ":" como fim de sentença quando seguido de maiúscula
    const tmp = cleaned.replace(/:\s+(?=[A-ZÀ-Ý])/g, ". ");

    // 6) Separa por sentenças (Unicode/reticências incluídas)
    const sentenceRegex = /[^.!?…]+[.!?…]?/g;
    const sentences = tmp.match(sentenceRegex)?.map((s) => s.trim()).filter(Boolean) || [tmp];

    // 7) Agrupa em parágrafos até ~40 palavras por bloco (1–2+ sentenças)
    const paragraphs: string[] = [];
    let current = "";
    let wordCount = 0;
    const maxWords = 40;

    const flush = () => {
      if (current.trim()) paragraphs.push(current.trim());
      current = "";
      wordCount = 0;
    };

    for (const s of sentences) {
      const w = s.split(/\s+/).filter(Boolean).length;
      if (wordCount + w > maxWords && current) {
        flush();
      }
      current += (current ? " " : "") + s;
      wordCount += w;
    }
    if (current) flush();

    // 8) Fallback: se ainda ficou 1 bloco muito longo, quebra por 35 palavras
    if (paragraphs.length <= 1) {
      const words = cleaned.split(/\s+/).filter(Boolean);
      if (words.length > 55) {
        const chunks: string[] = [];
        for (let i = 0; i < words.length; i += 35) {
          const part = words.slice(i, i + 35).join(" ");
          chunks.push(/[.!?…]$/.test(part) ? part : part + ".");
        }
        return chunks;
      }
    }

    return paragraphs.length > 0 ? paragraphs : [cleaned];
  };
  const estimateBlockTime = (text: string): number => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 2.5)); // ~150 wpm
  };

  if (useTemporalFormat) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Roteiro para Reels
            </h2>
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          {estimatedTime && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {estimatedTime}s • Ideal: 30-45s
            </Badge>
          )}
        </header>

        <div className="space-y-3">
          {temporalBlocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-border/60 bg-gradient-to-br from-primary/5 via-background/80 to-secondary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {block.time && (
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {block.time}
                      </Badge>
                    )}
                    <div className="flex-1 space-y-1">
                      {block.label && (
                        <div className="font-medium text-sm text-primary">
                          {block.label}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed text-foreground/80">
                        {block.content}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Formato de parágrafos melhorados
  const paragraphs = formatLongText(roteiro);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <header className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Video className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            OFF para Reels
          </h2>
          <Sparkles className="h-5 w-5 text-secondary" />
        </div>
        {estimatedTime && (
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {estimatedTime}s • Ideal: 30-45s
          </Badge>
        )}
      </header>

      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => {
          const blockTime = estimateBlockTime(paragraph);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-border/60 bg-gradient-to-br from-primary/5 via-background/80 to-secondary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                      ~{blockTime}s
                    </Badge>
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed text-foreground/80">
                        {paragraph}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ImprovedReelsFormatter;