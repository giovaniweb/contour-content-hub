
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CarouselSequencePreviewProps {
  slides: { title: string }[];
}

const prettyTitles = ["Gancho", "Problema", "Solução", "Benefícios", "CTA"];
const prettyIcons = ["🎯", "⚡", "💡", "✨", "📲"];

const CarouselSequencePreview: React.FC<CarouselSequencePreviewProps> = ({ slides }) => (
  <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
    {slides.map((slide, idx) => (
      <React.Fragment key={idx}>
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + idx * 0.06 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aurora-electric-purple via-aurora-neon-blue to-aurora-emerald flex items-center justify-center text-xl aurora-shadow mb-1 font-bold">
            {prettyIcons[idx] || "📝"}
          </div>
          <span className="text-xs font-medium text-aurora-electric-purple">
            {prettyTitles[idx] || (slide.title ?? "")}
          </span>
        </motion.div>
        {idx < slides.length - 1 && (
          <ArrowRight className="h-5 w-5 text-aurora-neon-blue opacity-60" />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default CarouselSequencePreview;
