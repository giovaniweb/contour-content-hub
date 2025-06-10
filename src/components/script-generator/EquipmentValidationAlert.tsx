
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface EquipmentValidationAlertProps {
  clinicType: 'medico' | 'estetico' | 'hibrido';
  selectedEquipments: string[];
  recommendation: string;
  hasInvasiveEquipments: boolean;
}

const EquipmentValidationAlert: React.FC<EquipmentValidationAlertProps> = ({
  clinicType,
  selectedEquipments,
  recommendation,
  hasInvasiveEquipments
}) => {
  const getAlertVariant = () => {
    if (clinicType === 'estetico' && hasInvasiveEquipments) {
      return 'destructive';
    }
    return 'default';
  };

  const getIcon = () => {
    if (clinicType === 'estetico' && hasInvasiveEquipments) {
      return <AlertTriangle className="h-4 w-4" />;
    }
    if (selectedEquipments.length > 0) {
      return <CheckCircle className="h-4 w-4" />;
    }
    return <Info className="h-4 w-4" />;
  };

  const getClinicTypeBadge = () => {
    const variants = {
      medico: { color: 'bg-red-100 text-red-800', label: 'Clínica Médica' },
      estetico: { color: 'bg-blue-100 text-blue-800', label: 'Clínica Estética' },
      hibrido: { color: 'bg-purple-100 text-purple-800', label: 'Clínica Híbrida' }
    };

    const variant = variants[clinicType];
    
    return (
      <Badge className={variant.color}>
        {variant.label}
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Alert variant={getAlertVariant()}>
        {getIcon()}
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getClinicTypeBadge()}
              <span className="text-sm font-medium">
                Segmentação Automática
              </span>
            </div>
            <p className="text-sm">{recommendation}</p>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default EquipmentValidationAlert;
