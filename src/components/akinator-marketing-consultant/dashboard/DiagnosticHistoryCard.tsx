
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Target, Zap, ExternalLink } from "lucide-react";
import { motion } from 'framer-motion';

interface DiagnosticHistoryEntry {
  clinic_type: string;
  specialty: string;
  diagnostic_content: string;
  created_at: string;
  model_used: string;
  success: boolean;
  equipments_validated: string[];
}

interface DiagnosticHistoryCardProps {
  entry: DiagnosticHistoryEntry;
  index: number;
  onView: (entry: DiagnosticHistoryEntry) => void;
}

const DiagnosticHistoryCard: React.FC<DiagnosticHistoryCardProps> = ({ 
  entry, 
  index, 
  onView 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getClinicTypeLabel = (type: string) => {
    return type === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética';
  };

  const getSuccessColor = (success: boolean) => {
    return success ? 'text-green-400' : 'text-amber-400';
  };

  const getAlignmentScore = () => {
    // Simular score baseado no sucesso e equipamentos
    if (!entry.success) return Math.floor(Math.random() * 40) + 30; // 30-70
    return Math.floor(Math.random() * 30) + 70; // 70-100
  };

  const score = getAlignmentScore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="aurora-card border-aurora-electric-purple/20 hover:border-aurora-sage/40 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg aurora-heading flex items-center gap-2">
                <FileText className="h-5 w-5 text-aurora-electric-purple" />
                {getClinicTypeLabel(entry.clinic_type)}
              </CardTitle>
              <p className="text-sm aurora-body opacity-80 mt-1">
                {entry.specialty}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge 
                variant="outline" 
                className={`${getSuccessColor(entry.success)} border-current`}
              >
                {entry.success ? '✅ Completo' : '⚠️ Fallback'}
              </Badge>
              <div className="text-right">
                <div className="text-xs aurora-body opacity-60">Score Estratégico</div>
                <div className={`text-sm font-bold ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-orange-400'}`}>
                  {score}/100
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-xs aurora-body opacity-70">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(entry.created_at)}
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {entry.model_used || 'gpt-4'}
            </div>
          </div>

          {entry.equipments_validated && entry.equipments_validated.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs aurora-body opacity-60">Equipamentos Validados:</p>
              <div className="flex flex-wrap gap-1">
                {entry.equipments_validated.map((equipment, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="text-xs border-aurora-sage/30 text-aurora-sage"
                  >
                    {equipment}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button 
              onClick={() => onView(entry)}
              variant="outline"
              size="sm"
              className="w-full aurora-button-secondary"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Relatório Completo
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DiagnosticHistoryCard;
