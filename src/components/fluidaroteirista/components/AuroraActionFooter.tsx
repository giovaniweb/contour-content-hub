
import React from "react";
import { CheckCircle, Sparkles, RefreshCw, Image, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuroraActionFooterProps {
  onApproveScript?: () => void;
  onImproveScript?: () => void;
  onNewScript?: () => void;
  onGenerateImage?: () => void;
  onGenerateAudio?: () => void;
  isGeneratingAudio?: boolean;
  isGeneratingImage?: boolean;
}

const auroraBtnBase =
  "aurora-button px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-aurora-glow-blue aurora-glow transition-all duration-200 focus:aurora-focus focus:outline-none";

const variants = {
  gradient: `${auroraBtnBase} bg-[var(--aurora-gradient-primary)] text-white`,
  secondary: `${auroraBtnBase} bg-aurora-dark-violet/40 text-white border border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20`,
  outline: `${auroraBtnBase} bg-transparent border border-aurora-electric-purple text-aurora-electric-purple hover:bg-aurora-electric-purple/15`,
  glass: `${auroraBtnBase} bg-white/10 text-aurora-neon-blue backdrop-blur-sm border border-aurora-neon-blue/20 hover:bg-aurora-neon-blue/10`,
  emerald: `${auroraBtnBase} bg-aurora-emerald/80 text-white border border-aurora-emerald/60 hover:bg-aurora-emerald/90`,
};

const AuroraFooterButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: keyof typeof variants;
  children: React.ReactNode;
  loading?: boolean;
}> = ({ variant, children, className, loading, disabled, ...props }) => (
  <button
    className={cn(variants[variant], className, loading && "opacity-60 cursor-wait")}
    disabled={loading || disabled}
    {...props}
  >
    {loading ? (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ) : children}
  </button>
);

const AuroraActionFooter: React.FC<AuroraActionFooterProps> = ({
  onApproveScript,
  onImproveScript,
  onNewScript,
  onGenerateImage,
  onGenerateAudio,
  isGeneratingAudio = false,
  isGeneratingImage = false
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-10 w-full animate-fade-in">
      <AuroraFooterButton
        onClick={onApproveScript}
        variant="gradient"
        aria-label="Aprovar roteiro"
      >
        <CheckCircle className="h-5 w-5 text-lime-400 aurora-glow" />
        <span className="font-semibold drop-shadow">Aprovar roteiro</span>
      </AuroraFooterButton>
      <AuroraFooterButton
        onClick={onImproveScript}
        variant="secondary"
        aria-label="Melhorar roteiro"
      >
        <Sparkles className="h-5 w-5 text-aurora-electric-purple aurora-glow" />
        <span className="font-semibold">Melhorar roteiro</span>
      </AuroraFooterButton>
      <AuroraFooterButton
        onClick={onNewScript}
        variant="outline"
        aria-label="Novo roteiro"
      >
        <RefreshCw className="h-5 w-5 text-cyan-400" />
        <span className="font-semibold">Novo roteiro</span>
      </AuroraFooterButton>
      <AuroraFooterButton
        onClick={onGenerateImage}
        variant="emerald"
        aria-label="Gerar imagem"
        loading={isGeneratingImage}
        disabled={isGeneratingImage}
      >
        <Image className="h-5 w-5 text-aurora-neon-blue" />
        <span className="font-semibold">
          {isGeneratingImage ? "Gerando imagem..." : "Gerar imagem"}
        </span>
      </AuroraFooterButton>
      {onGenerateAudio && (
        <AuroraFooterButton
          onClick={onGenerateAudio}
          variant="glass"
          aria-label="Gerar áudio"
          loading={isGeneratingAudio}
          disabled={isGeneratingAudio}
        >
          <Headphones className="h-5 w-5 text-aurora-neon-blue animate-pulse" />
          <span className="font-semibold">
            {isGeneratingAudio ? "Gerando áudio..." : "Gerar áudio"}
          </span>
        </AuroraFooterButton>
      )}
    </div>
  );
};

export default AuroraActionFooter;
