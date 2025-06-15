import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FormatOption {
  value: string;
  label: string;
  emoji: string;
  description: string;
  tempo_limite: string;
  output_tipo: string;
}

interface ConditionalFormatSelectorProps {
  canal: string;
  formatOptions: FormatOption[];
  onSelect: (format: string) => void;
  selectedFormat?: string;
}

const ConditionalFormatSelector: React.FC<ConditionalFormatSelectorProps> = ({
  canal,
  formatOptions,
  onSelect,
  selectedFormat
}) => {
  const getChannelName = (canal: string) => {
    const names = {
      instagram: 'Instagram',
      youtube: 'YouTube', 
      tiktok: 'TikTok',
      ads: 'Anúncios Pagos'
    };
    return names[canal as keyof typeof names] || canal;
  };

  // Filtra para remover a opção "Stories"
  const filteredOptions = formatOptions.filter(option => option.label !== 'Stories');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-cyan-300 mb-2">
          📱 Formatos disponíveis para {getChannelName(canal)}
        </h3>
        <p className="text-cyan-400/80">
          Cada formato tem suas características específicas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`aurora-glass border cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedFormat === option.value 
                  ? 'border-cyan-400 bg-cyan-500/10' 
                  : 'border-cyan-500/30 hover:border-cyan-400/50'
              }`}
              onClick={() => onSelect(option.value)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-cyan-300">{option.label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-300 text-sm">{option.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                    ⏱️ {option.tempo_limite}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                    📝 {option.output_tipo.replace('_', ' ')}
                  </Badge>
                </div>
                
                {selectedFormat === option.value && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-2 bg-cyan-500/10 rounded border border-cyan-400/30"
                  >
                    <p className="text-cyan-300 text-xs font-medium">✅ Formato selecionado</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ConditionalFormatSelector;
