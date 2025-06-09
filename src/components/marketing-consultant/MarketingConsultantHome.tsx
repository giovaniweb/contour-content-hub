
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, History, TrendingUp, Sparkles, ArrowRight, BarChart3, Target, FileText, Plus } from "lucide-react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AkinatorMarketingConsultant from "@/components/akinator-marketing-consultant/AkinatorMarketingConsultant";
import PerformanceMetrics from "./PerformanceMetrics";
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';

type ViewMode = 'home' | 'performance' | 'new-diagnostic';

const MarketingConsultantHome: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const navigate = useNavigate();
  const {
    savedDiagnostics
  } = useDiagnosticPersistence();

  // REMOVIDO: Sistema de limpeza automática que estava apagando dados pagos

  if (currentView === 'performance') {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => setCurrentView('home')} className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-slate-50">Performance Marketing</h1>
          </div>
        </div>
        <PerformanceMetrics />
      </div>
    );
  }

  if (currentView === 'new-diagnostic') {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center gap-3 mb-6 bg-transparent">
          <Button variant="outline" onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-slate-50">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-slate-50">Novo Diagnóstico</h1>
          </div>
        </div>
        <AkinatorMarketingConsultant />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BrainCircuit className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Consultor Fluida</h1>
            <p className="text-slate-400">
              Sua central de inteligência em marketing para clínicas
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Ação Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* Card Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="aurora-card border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer group" onClick={() => setCurrentView('performance')}>
            <CardHeader className="text-center pb-3">
              <div className="mx-auto p-4 bg-blue-500/20 rounded-full w-fit mb-3 group-hover:bg-blue-500/30 transition-colors">
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <CardTitle className="text-white">
                📊 Performance Marketing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-white/70 text-sm">
                Mensure o que foi executado vs planejado. Acompanhe métricas de leads, vendas e estratégias ativas.
              </p>
              
              <div className="space-y-2">
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Métricas em Tempo Real
                </Badge>
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  <Target className="h-3 w-3 mr-1" />
                  Metas vs Resultados
                </Badge>
              </div>
              
              <Button className="w-full group-hover:bg-blue-600 transition-colors" onClick={(e) => {
                e.stopPropagation();
                setCurrentView('performance');
              }}>
                Ver Performance
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card Novo Diagnóstico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="aurora-card border-aurora-electric-purple/30 hover:border-aurora-electric-purple/50 transition-all cursor-pointer group" onClick={() => setCurrentView('new-diagnostic')}>
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
                setCurrentView('new-diagnostic');
              }}>
                Iniciar Diagnóstico
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card Histórico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="aurora-card border-green-500/30 hover:border-green-400/50 transition-all group cursor-pointer" onClick={() => navigate('/diagnostic-history')}>
            <CardHeader className="text-center pb-3">
              <div className="mx-auto p-4 bg-green-500/20 rounded-full w-fit mb-3 group-hover:bg-green-500/30 transition-colors">
                <History className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-white">
                📋 Histórico de Diagnósticos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-white/70 text-sm">
                Acesse seus diagnósticos anteriores, baixe relatórios e continue de onde parou.
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
                Ver Histórico
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Seção de Insights Rápidos */}
      <div className="max-w-4xl mx-auto">
        <Card className="aurora-card border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              💡 Dicas Rápidas do Consultor Fluida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="text-white font-medium mb-2">📊 Métricas Importantes</h4>
                <p className="text-white/70 text-sm">
                  Acompanhe sempre: Taxa de conversão de leads, CAC (Custo de Aquisição de Cliente) e ROI das campanhas.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <h4 className="text-white font-medium mb-2">🎯 Foco em Resultados</h4>
                <p className="text-white/70 text-sm">
                  Defina metas mensais claras e revise semanalmente o progresso das suas estratégias de marketing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingConsultantHome;
