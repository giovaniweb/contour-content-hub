import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Heading1, Sparkles, Image } from 'lucide-react';
import { sanitizeText } from '@/utils/textSanitizer';

interface ArticleFormatterProps {
  roteiro: string;
}

function parseArticle(roteiro: string): { title: string; content: string } {
  const clean = sanitizeText(roteiro || "");
  if (!clean) return { title: "Artigo", content: "" };

  // Tenta encontrar marcadores explícitos
  const tituloMatch = clean.match(/^(?:t[ií]tulo|titulo)\s*[:–-]\s*(.+)$/im);
  const conteudoMatch = clean.match(/(?:conte[úu]do|conteudo)\s*[:–-]\s*([\s\S]+)/im);

  if (tituloMatch) {
    const title = tituloMatch[1].trim();
    const content = conteudoMatch ? conteudoMatch[1].trim() : clean.replace(tituloMatch[0], '').trim();
    return { title, content };
  }

  // Fallback: primeira linha como título, restante como conteúdo
  const lines = clean.split(/\n+/).filter(l => l.trim());
  const title = lines[0] || 'Artigo';
  const content = lines.slice(1).join('\n').trim();
  return { title, content };
}

const ArticleFormatter: React.FC<ArticleFormatterProps> = ({ roteiro }) => {
  const { title, content } = parseArticle(roteiro);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <FileText className="h-7 w-7 text-aurora-electric-purple" />
          <h2 className="text-2xl font-bold text-aurora-electric-purple">Artigo</h2>
          <Sparkles className="h-5 w-5 text-aurora-neon-blue" />
        </div>
        <Badge variant="outline" className="bg-aurora-electric-purple/10 text-aurora-electric-purple border-aurora-electric-purple/30">SEO Friendly</Badge>
      </motion.div>

      {/* Título */}
      <Card className="aurora-glass border-aurora-neon-blue/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-aurora-neon-blue">
            <Heading1 className="h-5 w-5" />
            {sanitizeText(title)}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Conteúdo */}
      <Card className="aurora-glass border-aurora-emerald/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-aurora-emerald text-lg">Conteúdo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none aurora-body whitespace-pre-line">{sanitizeText(content)}</div>
        </CardContent>
      </Card>

      {/* Sugestão de mídia */}
      <Card className="aurora-glass border-aurora-soft-pink/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-aurora-soft-pink">
            <Image className="h-5 w-5" />
            Sugestão de imagem de capa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
            <li>Imagem 1200x630px (Open Graph)</li>
            <li>Visual limpo e coerente com o título</li>
            <li>Evitar excesso de texto na imagem</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleFormatter;
