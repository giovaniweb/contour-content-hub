
import React from 'react';
import { Label } from '@/components/ui/label';
import { FileText, Video, Image } from 'lucide-react';

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
    <div className="space-y-2">
      <Label>Formato do Conteúdo</Label>
      <div className="grid grid-cols-3 gap-3">
        {FORMATOS.map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => onFormatChange(fmt.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedFormat === fmt.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <fmt.icon className="h-6 w-6 mx-auto mb-2" />
            <div className="text-sm font-medium">{fmt.label}</div>
            <div className="text-xs text-gray-500">{fmt.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormatsSelector;
