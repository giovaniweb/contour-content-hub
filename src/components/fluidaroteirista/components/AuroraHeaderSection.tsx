
import React from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";

const AuroraHeaderSection: React.FC = () => (
  <div className="text-center space-y-4">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-3"
    >
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        <Wand2 className="h-12 w-12 text-aurora-electric-purple" />
      </motion.div>
      <div>
        <h1 className="text-3xl font-bold text-slate-50 bg-aurora-gradient-primary bg-clip-text text-transparent">
          FLUIDAROTEIRISTA 🎬
        </h1>
        <p className="text-slate-400 mt-2">
          Roteiros criativos, impactantes e prontos para redes sociais
        </p>
      </div>
    </motion.div>
  </div>
);

export default AuroraHeaderSection;
