
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, History, Sparkles, ArrowRight, FileText, Plus } from "lucide-react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';

interface ActionCardsProps {
  onStartNewDiagnostic: () => void;
}

const ActionCards: React.FC<ActionCardsProps> = ({ onStartNewDiagnostic }) => {
  const navigate = useNavigate();
  const { savedDiagnostics } = useDiagnosticPersistence();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Card Novo Diagnóstico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="aurora-card border-aurora-electric-purple/30 hover:border-aurora-electric-purple/50 transition-all cursor-pointer group" onClick={onStartNewDiagnostic}>
          <CardHeader className="text-center pb-3">
            <div className="mx-auto p-4 bg-aurora-electric-purple/20 rounded-full w-fit mb-3 group-hover:bg-aurora-electric-purple/30 transition-colors">
              <BrainCircuit className="h-8 w-8 text-aurora-electric-purple" />
            </div>
            <CardTitle className="text-white">
              🧠 Novo Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-white/70 text-sm">
              Inicie uma nova análise completa da sua clínica com nosso consultor inteligente.
            </p>
            
            <div className="space-y-2">
              <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple">
                <Sparkles className="h-3 w-3 mr-1" />
                IA Especializada
              </Badge>
              <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                <Plus className="h-3 w-3 mr-1" />
                Estratégias Personalizadas
              </Badge>
            </div>
            
            <Button className="w-full bg-aurora-electric-purple hover:bg-aurora-electric-purple/80 transition-colors" onClick={(e) => {
              e.stopPropagation();
              onStartNewDiagnostic();
            }}>
              Iniciar Diagnóstico
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Card Performance e Diagnósticos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="aurora-card border-green-500/30 hover:border-green-400/50 transition-all group cursor-pointer" onClick={() => navigate('/diagnostic-history')}>
          <CardHeader className="text-center pb-3">
            <div className="mx-auto p-4 bg-green-500/20 rounded-full w-fit mb-3 group-hover:bg-green-500/30 transition-colors">
              <History className="h-8 w-8 text-green-400" />
            </div>
            <CardTitle className="text-white">
              📊 Performance e Diagnósticos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-white/70 text-sm">
              Acompanhe sua performance, acesse diagnósticos anteriores e baixe relatórios completos.
            </p>
            
            <div className="space-y-2">
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <FileText className="h-3 w-3 mr-1" />
                {savedDiagnostics.length} Diagnósticos
              </Badge>
              {savedDiagnostics.length > 0 && (
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  Download Disponível
                </Badge>
              )}
            </div>
            
            <Button className="w-full group-hover:bg-green-600 transition-colors" onClick={(e) => {
              e.stopPropagation();
              navigate('/diagnostic-history');
            }}>
              Ver Performance
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ActionCards;
