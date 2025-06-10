
import React from 'react';
import { Label } from '@/components/ui/label';
import { FileText, Video, Image } from 'lucide-react';
import { motion } from 'framer-motion';

interface Format {
  id: 'carrossel' | 'stories' | 'imagem';
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const FORMATOS: Format[] = [
  { id: 'carrossel', label: 'Carrossel', icon: FileText, description: 'Múltiplos slides' },
  { id: 'stories', label: 'Stories', icon: Video, description: 'Formato vertical' },
  { id: 'imagem', label: 'Post Único', icon: Image, description: 'Uma imagem' }
];

interface FormatsSelectorProps {
  selectedFormat: 'carrossel' | 'stories' | 'imagem';
  onFormatChange: (format: 'carrossel' | 'stories' | 'imagem') => void;
}

const FormatsSelector: React.FC<FormatsSelectorProps> = ({
  selectedFormat,
  onFormatChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="aurora-accent font-semibold text-base">
        Formato do Conteúdo
      </Label>
      <div className="grid grid-cols-3 gap-4">
        {FORMATOS.map((fmt) => (
          <motion.button
            key={fmt.id}
            onClick={() => onFormatChange(fmt.id)}
            className={`p-4 rounded-xl border-2 transition-all aurora-glass backdrop-blur-sm ${
              selectedFormat === fmt.id
                ? 'border-purple-500/70 aurora-glow bg-purple-500/10'
                : 'border-purple-300/20 hover:border-purple-400/40'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <fmt.icon className={`h-8 w-8 mx-auto mb-3 ${
              selectedFormat === fmt.id ? 'aurora-electric-purple' : 'aurora-body'
            }`} />
            <div className={`text-sm font-semibold mb-1 ${
              selectedFormat === fmt.id ? 'aurora-electric-purple' : 'aurora-body'
            }`}>
              {fmt.label}
            </div>
            <div className="text-xs aurora-body opacity-70">
              {fmt.description}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FormatsSelector;
