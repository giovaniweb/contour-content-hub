
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, History, Sparkles, ArrowRight, FileText, Plus, Download } from "lucide-react";
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
        whileHover={{ y: -5 }}
        className="perspective-1000"
      >
        <Card className="relative overflow-hidden border-aurora-electric-purple/30 hover:border-aurora-electric-purple/50 transition-all cursor-pointer group bg-gradient-to-br from-background via-background to-background/80" onClick={onStartNewDiagnostic}>
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />
          
          {/* Animated orb effect */}
          <motion.div 
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-aurora-electric-purple/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          />
          
          <CardHeader className="text-center pb-3 relative z-10">
            <motion.div 
              className="mx-auto p-4 bg-aurora-electric-purple/20 rounded-full w-fit mb-3 group-hover:bg-aurora-electric-purple/30 transition-colors"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <BrainCircuit className="h-8 w-8 text-aurora-electric-purple" />
              </motion.div>
            </motion.div>
            <CardTitle className="text-white text-2xl flex items-center justify-center gap-2">
              Novo Diagnóstico
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-5 relative z-10">
            <p className="text-white/70 text-sm">
              Inicie uma nova análise completa da sua clínica com nosso consultor de marketing inteligente.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple px-3 py-1 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  IA Especializada
                </Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge variant="outline" className="border-amber-500/30 text-amber-400 px-3 py-1 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Estratégias Personalizadas
                </Badge>
              </motion.div>
            </div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-gradient-to-r from-aurora-electric-purple to-indigo-600 hover:brightness-110 transition-all" onClick={(e) => {
                e.stopPropagation();
                onStartNewDiagnostic();
              }}>
                Iniciar Diagnóstico
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-4 w-4 ml-2" />
                </motion.div>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Card Performance e Diagnósticos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -5 }}
        className="perspective-1000"
      >
        <Card className="relative overflow-hidden border-green-500/30 hover:border-green-400/50 transition-all group cursor-pointer bg-gradient-to-br from-background via-background to-background/80">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />
          
          {/* Animated orb effect */}
          <motion.div 
            className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-green-500/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity, 
              repeatType: "reverse",
              delay: 1
            }}
          />
          
          <CardHeader className="text-center pb-3 relative z-10">
            <motion.div 
              className="mx-auto p-4 bg-green-500/20 rounded-full w-fit mb-3 group-hover:bg-green-500/30 transition-colors"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 15, 0, -15, 0],
                  transition: { duration: 4, repeat: Infinity }
                }}
              >
                <History className="h-8 w-8 text-green-400" />
              </motion.div>
            </motion.div>
            <CardTitle className="text-white text-2xl flex items-center justify-center gap-2">
              Performance e Histórico
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FileText className="h-5 w-5 text-green-400" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-5 relative z-10">
            <p className="text-white/70 text-sm">
              Acompanhe sua evolução, acesse diagnósticos anteriores e visualize relatórios completos.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400 px-3 py-1 text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  {savedDiagnostics.length} {savedDiagnostics.length === 1 ? 'Diagnóstico' : 'Diagnósticos'}
                </Badge>
              </motion.div>
              {savedDiagnostics.length > 0 && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 px-3 py-1 text-xs">
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                    </motion.div>
                    Exportar Relatórios
                  </Badge>
                </motion.div>
              )}
            </div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:brightness-110 transition-all" onClick={(e) => {
                e.stopPropagation();
                navigate('/diagnostic-history');
              }}>
                Ver Histórico
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  <ArrowRight className="h-4 w-4 ml-2" />
                </motion.div>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ActionCards;
