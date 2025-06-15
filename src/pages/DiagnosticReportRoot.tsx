
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const DiagnosticReportRoot: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-aurora-background flex items-center justify-center">
      <div className="bg-white/10 aurora-card rounded-xl p-8 max-w-md w-full text-center shadow-aurora-glow space-y-6">
        <FileText className="w-16 h-16 mx-auto text-aurora-electric-purple mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Selecione um relatório</h1>
        <p className="text-foreground/70">
          Acesse esta página informando um relatório válido (ex: <span className="text-purple-300 font-mono">/diagnostic-report/&lt;id&gt;</span>).
        </p>
        <Button className="mt-4" onClick={() => navigate("/diagnostic-history")}>
          Ver Histórico de Diagnósticos
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticReportRoot;
