import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Clock, Sparkles } from 'lucide-react';
import { sanitizeText } from '@/utils/textSanitizer';
import { parseTemporalScript } from '../utils/parseTemporalScript';

interface LongVideoFormatterProps {
  roteiro: string;
}

type SectionKey = 'Gancho' | 'Problema' | 'Solução' | 'CTA';

function buildGPSC(roteiro: string): Record<SectionKey, string> {
  const blocks = parseTemporalScript(roteiro);

  const map: Record<SectionKey, string[]> = {
    Gancho: [],
    Problema: [],
    Solução: [],
    CTA: [],
  };

  const chooseBucket = (label?: string, content?: string): SectionKey => {
    const l = (label || '').toLowerCase();
    const c = (content || '').toLowerCase();
    if (l.includes('gancho') || /você sabia|imagine|atenção|\?/.test(c)) return 'Gancho';
    if (l.includes('problema') || /problema|dificuldade|dor|incomoda|sofre/.test(c)) return 'Problema';
    if (l.includes('solu') || /solu|resultado|benef[ií]cio|tecnologia|transforma|consegue/.test(c)) return 'Solução';
    if (l.includes('cta') || /clique|acesse|agende|link|vem|vamos|faça|garanta/.test(c)) return 'CTA';
    // fallback por posição
    return 'Solução';
  };

  if (blocks.length) {
    blocks.forEach(b => {
      const key = chooseBucket(b.label, b.content);
      map[key].push(sanitizeText(b.content));
    });
  } else {
    // fallback simples
    const clean = sanitizeText(roteiro);
    const parts = clean.split(/\n\n+/);
    parts.forEach((p, i) => {
      const key: SectionKey = i === 0 ? 'Gancho' : i === 1 ? 'Problema' : i === 2 ? 'Solução' : 'CTA';
      map[key].push(p.trim());
    });
  }

  return {
    Gancho: map.Gancho.join('\n'),
    Problema: map.Problema.join('\n'),
    Solução: map.Solução.join('\n'),
    CTA: map.CTA.join('\n'),
  };
}

const SectionCard: React.FC<{ title: SectionKey; text: string; color: 'purple' | 'pink' | 'emerald' | 'cyan'; }> = ({ title, text, color }) => {
  const colorClasses = {
    purple: 'text-aurora-electric-purple border-aurora-electric-purple/30',
    pink: 'text-aurora-soft-pink border-aurora-soft-pink/30',
    emerald: 'text-aurora-emerald border-aurora-emerald/30',
    cyan: 'text-aurora-neon-blue border-aurora-neon-blue/30',
  }[color];

  return (
    <Card className={`aurora-glass ${colorClasses}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`${colorClasses?.split(' ')[0]} text-lg`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-line text-slate-200 text-sm aurora-body">{sanitizeText(text)}</div>
      </CardContent>
    </Card>
  );
};

const LongVideoFormatter: React.FC<LongVideoFormatterProps> = ({ roteiro }) => {
  const gpsc = buildGPSC(roteiro);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Film className="h-6 w-6 text-aurora-electric-purple" />
          <h2 className="text-xl font-bold text-aurora-electric-purple">Roteiro para Vídeo Longo</h2>
          <Sparkles className="h-5 w-5 text-aurora-neon-blue" />
        </div>
        <Badge variant="outline" className="bg-aurora-neon-blue/10 text-aurora-neon-blue border-aurora-neon-blue/30">Estrutura GPSC</Badge>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Gancho" text={gpsc.Gancho} color="purple" />
        <SectionCard title="Problema" text={gpsc.Problema} color="pink" />
        <SectionCard title="Solução" text={gpsc.Solução} color="emerald" />
        <SectionCard title="CTA" text={gpsc.CTA} color="cyan" />
      </div>
    </div>
  );
};

export default LongVideoFormatter;
