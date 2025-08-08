import React, { useState } from "react";
import ScriptFormatter from "./components/ScriptFormatter";
import AuroraActionFooter from "./components/AuroraActionFooter";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { FluidaScriptResult } from "./types";
import { useSaveScript } from "./hooks/useSaveScript";
interface FluidaScriptResultsProps {
  results: FluidaScriptResult[];
  onNewScript: () => void;
  onGenerateImage: (script: any) => Promise<void>;
  onGenerateAudio: (script: any) => Promise<void>;
  onApplyDisney: (script: FluidaScriptResult) => Promise<void>;
  isProcessing: boolean;
  onApproveScript?: () => void;
}
const FluidaScriptResults = ({
  results,
  onNewScript,
  onGenerateImage,
  onGenerateAudio,
  onApplyDisney,
  isProcessing,
  onApproveScript
}: FluidaScriptResultsProps) => {
  const [isImproving, setIsImproving] = useState(false);
  const [improvedScript, setImprovedScript] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { saveScript, isSaving } = useSaveScript();
 
   // Função para chamar a edge function de melhoria do roteiro
  const handleImproveScript = async () => {
    const roteiroBase = results && results[0] ? results[0].roteiro : "";
    if (!roteiroBase) {
      toast.warning("Nenhum roteiro disponível para melhorar.");
      return;
    }
    setIsImproving(true);
    setImprovedScript(null);
    try {
      // Chama a edge function /improve-script
      const {
        data,
        error
      } = await supabase.functions.invoke("improve-script", {
        body: {
          content: roteiroBase
        }
      });
      if (error || !data?.improved) {
        toast.error("Falha ao melhorar roteiro. Tente novamente.");
      } else {
        setImprovedScript(data.improved);
        toast.success("Roteiro melhorado com sucesso!");
      }
    } catch (err) {
      toast.error("Erro inesperado ao melhorar roteiro.");
    }
    setIsImproving(false);
  };

  // NOVO: Função para dividir o roteiro em stories com título e conteúdo
  function parseStoriesFromRoteiro(roteiro: string) {
    // Expressão para encontrar títulos como "Story 1:"
    const regex = /(Story\s*\d+:)/g;
    const parts = roteiro.split(regex).filter(Boolean);

    // Junta os títulos com o conteúdo seguinte
    let stories: {
      number: number;
      title: string;
      content: string;
    }[] = [];
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].match(/^Story\s*\d+:/)) {
        const title = parts[i].trim();
        let content = "";
        if (i + 1 < parts.length && !parts[i + 1].match(/^Story\s*\d+:/)) {
          content = parts[i + 1].trim();
        }
        const match = title.match(/^Story\s*(\d+):/);
        stories.push({
          number: match ? Number(match[1]) : i + 1,
          title,
          content
        });
      }
    }
    return stories;
  }
  const roteiroParaExibir = improvedScript !== null ? {
    ...results[0],
    roteiro: improvedScript
  } : results[0];

  // Handlers para rodapé Aurora
  const handleApprove = async () => {
    const scriptObj: any = roteiroParaExibir as any;

    const equipmentArray: string[] = (scriptObj?.equipamentos_utilizados || scriptObj?.equipment || [])
      .map((e: any) => (typeof e === 'string' ? e : e?.nome || e?.name))
      .filter(Boolean);

    const saved = await saveScript({
      content: scriptObj?.roteiro || "",
      title: (results[0] as any)?.title || scriptObj?.title || (results[0] as any)?.topic || "Roteiro Aprovado",
      format: (scriptObj?.formato || (results[0] as any)?.format || "reels").toLowerCase(),
      equipment_used: equipmentArray,
    });

    if (saved && onApproveScript) onApproveScript();
  };
  const handleImprove = async () => {
    await handleImproveScript();
  };
  const handleNew = () => {
    onNewScript();
  };
  const handleImage = async () => {
    if (!onGenerateImage) return;
    setIsGeneratingImage(true);
    await onGenerateImage(roteiroParaExibir);
    setIsGeneratingImage(false);
  };
  const handleAudio = async () => {
    if (!onGenerateAudio) return;
    setIsGeneratingAudio(true);
    await onGenerateAudio(roteiroParaExibir);
    setIsGeneratingAudio(false);
  };

  return <div className="space-y-6 flex flex-col">
      {/* Exibição do roteiro (aprimorado ou original) */}
      <div>
        <ScriptFormatter
          script={roteiroParaExibir}
          onApproveScript={handleApprove}
          onImproveScript={handleImprove}
          onNewScript={handleNew}
          onGenerateImage={handleImage}
          onGenerateAudio={handleAudio}
          isGeneratingAudio={isGeneratingAudio}
          isGeneratingImage={isGeneratingImage}
        />
        {improvedScript && <Card className="mt-6 aurora-glass border-aurora-emerald/40 shadow-lg animate-fade-in">
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg">🕑</span>
                <span className="text-emerald-400 font-bold text-xl tracking-wide drop-shadow-lg">
                  Roteiro Anterior
                </span>
              </div>
              <div className="space-y-4">
                {parseStoriesFromRoteiro(results[0].roteiro).length > 0 ? parseStoriesFromRoteiro(results[0].roteiro).map(story => <div key={story.number} className="border border-emerald-500/20 rounded-xl p-4 bg-gradient-to-br from-black/70 via-emerald-900/30 to-slate-800/60 shadow-md flex gap-3">
                      <div className="flex-shrink-0 flex flex-col items-center pt-1 pr-3">
                        <span className="bg-emerald-700/40 text-emerald-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-lg shadow">
                          {story.number}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-emerald-300 mb-1 text-base">
                          {story.title}
                        </div>
                        <pre className="text-slate-100 whitespace-pre-line font-mono text-[15px] leading-relaxed" style={{
                  background: "none",
                  padding: 0,
                  margin: 0
                }}>
                          {story.content}
                        </pre>
                      </div>
                    </div>) : <div className="bg-gradient-to-br from-slate-900/80 via-emerald-900/40 to-slate-800/80 rounded-xl p-4 border border-emerald-400/10">
                    <pre className="text-slate-100 whitespace-pre-line font-mono text-base leading-relaxed break-words" style={{
                background: 'none',
                padding: 0,
                margin: 0
              }}>
                      {results[0].roteiro}
                    </pre>
                  </div>}
              </div>
            </CardContent>
          </Card>}
      </div>
    </div>;
};
export default FluidaScriptResults;
