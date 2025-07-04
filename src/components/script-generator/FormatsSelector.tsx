import React from 'react';
import { Label } from '@/components/ui/label';
import { FileText, Image, Video, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Removido 'stories' do tipo e do array:
interface Format {
  id: 'carrossel' | 'imagem' | 'reels';
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const FORMATOS: Format[] = [
  // Stories removido — mantém apenas os outros formatos
  {
    id: 'carrossel',
    label: 'Carrossel',
    icon: FileText,
    description: 'Múltiplos slides'
  },
  {
    id: 'imagem',
    label: 'Post Estático',
    icon: Image,
    description: 'Uma imagem'
  },
  {
    id: 'reels',
    label: 'Reels',
    icon: Zap,
    description: 'Vídeo curto'
  },
  // Stories 10x pode ser adicionado, se quiser mostrar também
  // {
  //   id: 'stories_10x',
  //   label: 'Stories 10x',
  //   icon: Video,
  //   description: 'Metodologia Leandro Ladeira - Sequência de engajamento'
  // }
];

interface FormatsSelectorProps {
  selectedFormat: 'carrossel' | 'imagem' | 'reels';
  onFormatChange: (format: 'carrossel' | 'imagem' | 'reels') => void;
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FORMATOS.map((fmt) => (
          <motion.button
            key={fmt.id}
            onClick={() => onFormatChange(fmt.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedFormat === fmt.id
                ? 'border-purple-500/70 bg-purple-500/10 shadow-md shadow-purple-500/20'
                : 'border-gray-700 bg-gray-800/80 hover:border-purple-400/50 hover:bg-gray-700/90 hover:shadow-lg hover:shadow-purple-500/10'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <fmt.icon className={`h-8 w-8 mx-auto mb-3 ${
              selectedFormat === fmt.id ? 'text-purple-300' : 'text-gray-200'
            }`} />
            <div className={`text-sm font-semibold mb-1 ${
              selectedFormat === fmt.id ? 'text-purple-300' : 'text-gray-200'
            }`}>
              {fmt.label}
            </div>
            <div className="text-xs text-gray-400 opacity-70">
              {fmt.description}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FormatsSelector;
