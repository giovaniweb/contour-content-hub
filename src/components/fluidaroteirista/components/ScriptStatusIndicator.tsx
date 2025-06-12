
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ScriptStatusIndicatorProps {
  script: any;
}

const ScriptStatusIndicator: React.FC<ScriptStatusIndicatorProps> = ({ script }) => {
  if (!script) return null;

  const getStatusInfo = () => {
    if (script.ai_improving) {
      return {
        icon: <Sparkles className="h-3 w-3 animate-pulse" />,
        label: 'IA Melhorando',
        color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        description: 'IA está aprimorando seu roteiro em segundo plano'
      };
    }
    
    if (script.is_template || script.from_cache) {
      return {
        icon: <Zap className="h-3 w-3" />,
        label: script.from_cache ? 'Cache' : 'Template',
        color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        description: script.from_cache ? 'Roteiro do cache local' : 'Template personalizado instantâneo'
      };
    }
    
    if (script.ai_failed) {
      return {
        icon: <AlertCircle className="h-3 w-3" />,
        label: 'IA Indisponível',
        color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        description: 'IA não conseguiu melhorar, mas o template está pronto'
      };
    }
    
    if (script.modo_usado && !script.is_template) {
      return {
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'IA Completa',
        color: 'bg-green-500/20 text-green-300 border-green-500/30',
        description: `Roteiro aprimorado pela IA - ${script.modo_usado}`
      };
    }
    
    return {
      icon: <Clock className="h-3 w-3" />,
      label: 'Processando',
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Roteiro sendo processado'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="flex items-center gap-2 mb-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Badge className={`flex items-center gap-1 ${statusInfo.color}`}>
          {statusInfo.icon}
          {statusInfo.label}
        </Badge>
      </motion.div>
      
      <span className="text-xs text-slate-400">
        {statusInfo.description}
      </span>
      
      {script.ai_improving && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs text-purple-300"
        >
          Aguarde...
        </motion.div>
      )}
    </div>
  );
};

export default ScriptStatusIndicator;
