
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Target } from "lucide-react";

interface QuickAccessMenuProps {
  onNavigateToApprovedScripts: () => void;
}

const QuickAccessMenu: React.FC<QuickAccessMenuProps> = ({
  onNavigateToApprovedScripts,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="max-w-4xl mx-auto mb-8"
  >
    <Card className="aurora-glass border-aurora-electric-purple/30">
      <CardHeader>
        <CardTitle className="text-white text-center flex items-center justify-center gap-2">
          <BookOpen className="h-5 w-5" />
          Menu Rápido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={onNavigateToApprovedScripts}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white h-16 flex items-center gap-3 w-full"
          >
            <TrendingUp className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">📚 Roteiros Aprovados</div>
              <div className="text-sm opacity-90">
                Gerencie e avalie performance
              </div>
            </div>
          </Button>
          <div className="relative group">
            <Button
              variant="outline"
              className="border-aurora-electric-purple/50 text-aurora-electric-purple hover:bg-aurora-electric-purple/10 h-16 flex items-center gap-3 w-full"
              disabled
              aria-label="Análises (Em breve)"
            >
              <Target className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">📊 Análises (Em breve)</div>
                <div className="text-sm opacity-70">Métricas e insights</div>
              </div>
            </Button>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded bg-black text-xs text-white opacity-0 group-hover:opacity-100 transition opacity pointer-events-none z-50 whitespace-nowrap">
              Este recurso estará disponível em breve!
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default QuickAccessMenu;
