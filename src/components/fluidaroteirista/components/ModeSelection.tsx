
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, HelpCircle } from "lucide-react";

interface ModeSelectionProps {
  onSelect: (mode: "elementos" | "akinator") => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelect }) => (
  <div className="max-w-4xl mx-auto">
    <motion.h2
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-xl font-semibold text-white text-center mb-6"
    >
      ✨ Escolha seu estilo de criação:
    </motion.h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Modo Rocket */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card
          className="aurora-glass border-aurora-electric-purple/50 hover:border-aurora-electric-purple/70 transition-all cursor-pointer h-full relative overflow-hidden"
          onClick={() => onSelect("elementos")}
        >
          <div className="absolute top-2 right-2">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              NOVO ✨
            </span>
          </div>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <motion.div
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1],
                }}
                transition={{ duration: 0.6 }}
              >
                <Rocket className="h-16 w-16 text-aurora-electric-purple" />
              </motion.div>
            </div>
            <CardTitle className="text-white text-xl">
              🚀 Roteiro Rocket
            </CardTitle>
            <p className="text-aurora-electric-purple font-medium">
              10 Elementos Universais
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 text-center">
              Para quem quer conquistar o universo
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <p>🎯 Storytelling + Público-alvo</p>
              <p>📈 Headlines + Gatilhos mentais</p>
              <p>🧠 Lógica + Educação + Empatia</p>
              <p>📊 Copy + Ferramentas + Dados</p>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white">
              Decolar com Rocket 🚀
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modo Fluida */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card
          className="aurora-glass border-aurora-electric-purple/30 hover:border-aurora-electric-purple/50 transition-all cursor-pointer h-full"
          onClick={() => onSelect("akinator")}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <motion.div
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1.1, 1.1, 1],
                }}
                transition={{ duration: 0.6 }}
              >
                <HelpCircle className="h-16 w-16 text-aurora-electric-purple" />
              </motion.div>
            </div>
            <CardTitle className="text-white text-xl">
              🎯 Roteiro Fluida
            </CardTitle>
            <p className="text-aurora-electric-purple font-medium">
              Estilo Akinator
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 text-center">
              Para quem quer um roteiro rápido e prático
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <p>✅ Ideal para usuários iniciantes</p>
              <p>✅ Interface com perguntas visuais</p>
              <p>✅ 6 passos estruturados</p>
              <p>✅ Árvore de intenção inteligente</p>
            </div>
            <Button className="w-full bg-aurora-gradient-primary hover:opacity-90 text-white">
              Começar com Fluida
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </div>
);

export default ModeSelection;
