import React, { useState } from "react";
import ScriptFormatter from "./components/ScriptFormatter";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { FluidaScriptResult } from "./types";

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
      const { data, error } = await supabase.functions.invoke("improve-script", {
        body: {
          content: roteiroBase,
        },
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

  const roteiroParaExibir =
    improvedScript !== null
      ? { ...results[0], roteiro: improvedScript }
      : results[0];

  return (
    <div className="space-y-6 flex flex-col">
      {/* Exibição do roteiro (aprimorado ou original) */}
      <div>
        {/* We remove onApproveScript from ScriptFormatter, as its props don't accept it */}
        <ScriptFormatter script={roteiroParaExibir} />
        {improvedScript && (
          <Card className="mt-6 aurora-glass border-aurora-emerald/40 shadow-lg animate-fade-in">
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg">🕑</span>
                <span className="text-emerald-400 font-bold text-lg">Roteiro Anterior</span>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 via-emerald-900/40 to-slate-800/80 rounded-xl p-4 border border-emerald-400/10">
                <pre className="text-slate-100 whitespace-pre-line font-mono text-base leading-relaxed break-words" style={{ background: 'none', padding: 0, margin: 0 }}>
                  {results[0].roteiro}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Botões de ações movidos para o final e mais visíveis */}
      <div className="flex flex-wrap gap-2 items-center justify-end mt-6 sticky bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-transparent p-4 rounded-xl z-20 shadow-2xl aurora-glass border border-aurora-emerald/20">
        <Button variant="secondary" onClick={onNewScript}>Novo roteiro</Button>
        <Button variant="ghost" onClick={() => onApplyDisney(roteiroParaExibir)}>
          <Wand2 className="h-4 w-4 mr-1" />
          Aplicar Disney Magic
        </Button>
        <Button
          variant={improvedScript ? "outline" : "default"}
          disabled={isImproving}
          onClick={async () => {
            await handleImproveScript();
          }}
        >
          {isImproving ? "✨ Melhorando..." : "✨ Melhorar Roteiro"}
        </Button>
        <Button variant="default" onClick={() => onGenerateImage(roteiroParaExibir)}>
          Gerar Imagem
        </Button>
        <Button variant="outline" onClick={() => onGenerateAudio(roteiroParaExibir)}>
          Gerar Áudio
        </Button>
      </div>
    </div>
  );
};

export default FluidaScriptResults;
