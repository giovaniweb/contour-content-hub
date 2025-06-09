
import React from 'react';
import { Button } from "@/components/ui/button";
import { History, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const DiagnosticHistoryHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-6">
      <Button variant="outline" onClick={() => navigate('/marketing-consultant')} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
      <div className="flex items-center gap-3">
        <History className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-slate-50">Histórico de Diagnósticos</h1>
      </div>
    </div>
  );
};

export default DiagnosticHistoryHeader;
