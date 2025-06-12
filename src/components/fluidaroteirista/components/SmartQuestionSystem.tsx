
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, HelpCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ValidationResult } from '../utils/antiGenericValidation';

interface SmartQuestionSystemProps {
  validation: ValidationResult;
  onDismiss: () => void;
  onImprove: () => void;
}

const SmartQuestionSystem: React.FC<SmartQuestionSystemProps> = ({
  validation,
  onDismiss,
  onImprove
}) => {
  if (validation.isValid) return null;

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'text-green-400 border-green-400/30';
      case 'medium': return 'text-yellow-400 border-yellow-400/30';
      case 'low': return 'text-red-400 border-red-400/30';
      default: return 'text-slate-400 border-slate-400/30';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'high': return '✅';
      case 'medium': return '⚠️';
      case 'low': return '❌';
      default: return '❓';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mb-6"
    >
      {/* Status da Qualidade */}
      <Card className={`border-2 ${getQualityColor(validation.quality)}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">{getQualityIcon(validation.quality)}</span>
            Sistema Anti-Genérico Ativado
            <span className="text-sm font-normal capitalize">
              (Qualidade: {validation.quality})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Erros Críticos */}
          {validation.errors.length > 0 && (
            <Alert className="border-red-400/30 bg-red-400/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                <strong>Bloqueios identificados:</strong>
                <ul className="mt-2 space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Campos Obrigatórios Faltando */}
          {validation.missingFields.length > 0 && (
            <Alert className="border-yellow-400/30 bg-yellow-400/10">
              <HelpCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300">
                <strong>Informações obrigatórias faltando:</strong>
                <ul className="mt-2 space-y-1">
                  {validation.missingFields.map((field, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span className="capitalize">{field.replace('_', ' ')}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Sugestões de Melhoria */}
          {validation.suggestions.length > 0 && (
            <Alert className="border-blue-400/30 bg-blue-400/10">
              <Lightbulb className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300">
                <strong>Sugestões para roteiro personalizado:</strong>
                <ul className="mt-2 space-y-1">
                  {validation.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">💡</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onImprove}
              className="bg-aurora-electric-purple hover:bg-aurora-electric-purple/80"
            >
              Melhorar Informações
            </Button>
            {validation.quality === 'medium' && (
              <Button
                onClick={onDismiss}
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                Continuar Assim Mesmo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Exemplo de Entrada Válida */}
      <Card className="border-slate-600 bg-slate-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 text-base">
            💡 Exemplo de briefing ideal:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-300 space-y-2">
            <p><strong>Tema:</strong> "Como eliminar melasma resistente em mulheres de 35-50 anos usando tecnologia alemã"</p>
            <p><strong>Equipamento:</strong> Laser Q-Switch Spectra XT</p>
            <p><strong>Objetivo:</strong> Educar sobre tecnologia e gerar agendamentos</p>
            <p><strong>Público:</strong> Mulheres executivas preocupadas com manchas faciais</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SmartQuestionSystem;
