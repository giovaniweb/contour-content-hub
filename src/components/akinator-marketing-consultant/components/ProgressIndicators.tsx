
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Save, Loader2, Wifi } from "lucide-react";

interface ProgressIndicatorsProps {
  forceNew: boolean;
  hasCurrentSession: boolean;
  isSyncing: boolean;
}

const ProgressIndicators: React.FC<ProgressIndicatorsProps> = ({
  forceNew,
  hasCurrentSession,
  isSyncing
}) => {
  if (forceNew || !hasCurrentSession) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 text-center"
    >
      <div className="flex items-center justify-center gap-2">
        <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
          <Save className="h-3 w-3 mr-1" />
          Progresso salvo
        </Badge>
        {isSyncing ? (
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Sincronizando...
          </Badge>
        ) : (
          <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
            <Wifi className="h-3 w-3 mr-1" />
            Sincronizado
          </Badge>
        )}
      </div>
    </motion.div>
  );
};

export default ProgressIndicators;
