
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface TimeWarningProps {
  isWithinTimeLimit: boolean;
  estimatedTime: number;
}

const TimeWarning: React.FC<TimeWarningProps> = ({ isWithinTimeLimit, estimatedTime }) => {
  if (isWithinTimeLimit) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="aurora-glass border border-red-500/30 bg-red-500/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Clock className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-300 text-sm">⚠️ Duração fora do ideal (30–45s)</h3>
              <p className="text-xs text-red-400 mt-1">
                Tempo atual: {estimatedTime}s | Ideal: 30–45s
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TimeWarning;
