import React, { useMemo, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import CopyButton from "@/components/ui/CopyButton";
import { Video } from 'lucide-react';
import { buildReelsGPSC, buildReelsOFF, SectionKey } from '../utils/reelsOffBuilder';

interface ImprovedReelsFormatterProps {
  roteiro: string;
  estimatedTime?: number;
}



const ImprovedReelsFormatter: React.FC<ImprovedReelsFormatterProps> = ({ 
  roteiro, 
  estimatedTime 
}) => {
  const [mode, setMode] = useState<'off' | 'gpsc'>('off');



  // Calcula tempo estimado baseado no número de palavras
  const calculateTime = (text: string): number => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.round(words / 3)); // ~180 wpm para reels
  };

  const gpscData = useMemo(() => buildReelsGPSC(roteiro), [roteiro]);

  const offOutput = useMemo(() => buildReelsOFF(roteiro), [roteiro]);

  // Tempos estimados
  const totalTime = Object.values(gpscData).reduce((sum, content) => sum + calculateTime(content), 0);
  const offTime = calculateTime(offOutput);

const sectionConfigs = [
  { key: 'Gancho' as SectionKey, icon: '🎯' },
  { key: 'Problema' as SectionKey, icon: '⚠️' },
  { key: 'Solução' as SectionKey, icon: '💡' },
  { key: 'CTA' as SectionKey, icon: '🚀' }
];

const finalOutput = sectionConfigs
  .map(({ key, icon }) => `${icon} ${key}\n${gpscData[key]}`.trim())
  .join('\n\n------------------------------\n\n');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Video className="h-6 w-6 text-aurora-electric-purple" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue bg-clip-text text-transparent aurora-heading">
            {mode === 'off' ? '📱 Reels — OFF' : '📱 Reels — GPSC'}
          </h2>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 border border-border rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode('off')}
              className={`px-3 py-1 text-sm rounded-md ${mode === 'off' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              aria-pressed={mode === 'off'}
            >
              OFF direto
            </button>
            <button
              type="button"
              onClick={() => setMode('gpsc')}
              className={`px-3 py-1 text-sm rounded-md ${mode === 'gpsc' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              aria-pressed={mode === 'gpsc'}
            >
              GPSC
            </button>
          </div>
          <Badge 
            variant={(mode === 'off' ? offTime : totalTime) <= 45 ? 'default' : 'destructive'}
            className="text-sm px-3 py-1"
          >
            Tempo Total: {mode === 'off' ? offTime : totalTime}s
          </Badge>
          <CopyButton 
            text={mode === 'off' ? offOutput : finalOutput}
            className="aurora-button-enhanced"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {mode === 'off' ? (
          <div className="text-foreground leading-relaxed aurora-body whitespace-pre-wrap">
            {offOutput}
          </div>
        ) : (
          <>
            {sectionConfigs.map(({ key, icon }, index) => {
              const content = gpscData[key];
              return (
                <div key={key} className="space-y-2">
                  <h3 className="text-base font-semibold text-aurora-electric-purple aurora-heading">
                    {icon} {key}
                  </h3>
                  <div className="text-foreground leading-relaxed aurora-body whitespace-pre-line">
                    {content}
                  </div>
                  {index < sectionConfigs.length - 1 && (
                    <hr className="my-6 border-border" />
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

    </div>
  );
};

export default ImprovedReelsFormatter;