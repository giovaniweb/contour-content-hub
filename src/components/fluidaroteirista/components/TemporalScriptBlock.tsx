
import React from "react";
import { cn } from "@/lib/utils";
import { Clock, Sparkles, Lightbulb, Megaphone, PlayCircle } from "lucide-react";

interface TemporalScriptBlockProps {
  time: string;
  label?: string;
  content: string;
  index: number;
}

// Ícones temáticos por label, pode expandir conforme padrões do roteiro
const labelIcons: Record<string, React.ReactNode> = {
  "Gancho": <Sparkles className="h-5 w-5 text-purple-500" />,
  "Conflito": <Lightbulb className="h-5 w-5 text-yellow-500" />,
  "Desenvolvimento": <Lightbulb className="h-5 w-5 text-blue-500" />,
  "Solução": <PlayCircle className="h-5 w-5 text-cyan-500" />,
  "CTA": <Megaphone className="h-5 w-5 text-green-500" />,
};

const badgeColor: Record<string, string> = {
  "Gancho": "bg-purple-100 text-purple-700",
  "Conflito": "bg-yellow-100 text-yellow-700",
  "Desenvolvimento": "bg-blue-100 text-blue-700",
  "Solução": "bg-cyan-100 text-cyan-700",
  "CTA": "bg-green-100 text-green-700",
};

const TemporalScriptBlock: React.FC<TemporalScriptBlockProps> = ({ time, label, content, index }) => {
  const icon = label && labelIcons[label] ? labelIcons[label] : <Clock className="h-5 w-5 text-slate-500" />;
  const badge = label && badgeColor[label] ? badgeColor[label] : "bg-slate-100 text-slate-600";
  return (
    <div 
      className={cn(
        "rounded-xl shadow-md p-4 mb-3 border flex gap-4 items-start animate-fade-in hover-scale transition-all duration-200",
        "bg-white/90 dark:bg-slate-900/80"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex-shrink-0 flex flex-col items-center pt-1">
        {icon}
        <span className={cn("mt-2 text-xs font-mono px-2 py-1 rounded", badge)}>
          {time}
        </span>
      </div>
      <div className="flex-1">
        <div className="font-semibold mb-1 text-base">
          {label || "Bloco"}
        </div>
        <div className="text-muted-foreground whitespace-pre-line font-mono text-[15px] leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default TemporalScriptBlock;
