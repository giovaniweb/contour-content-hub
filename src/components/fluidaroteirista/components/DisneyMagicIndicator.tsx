
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

interface DisneyMagicIndicatorProps {
  disneyApplied: boolean;
}

const DisneyMagicIndicator: React.FC<DisneyMagicIndicatorProps> = ({ disneyApplied }) => {
  if (!disneyApplied) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="aurora-glass border border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-3 text-yellow-300">
            <span className="text-xl">✨</span>
            <span className="font-bold">Disney Magic Aplicada!</span>
            <span className="text-xl">✨</span>
          </div>
          <p className="text-yellow-400 mt-2 text-sm">
            Transformado com a narrativa mágica de Walt Disney 1928
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DisneyMagicIndicator;
