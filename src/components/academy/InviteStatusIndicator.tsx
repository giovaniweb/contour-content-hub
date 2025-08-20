import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertTriangle, Mail } from 'lucide-react';

interface InviteStatusIndicatorProps {
  status: string;
  expiresAt: string;
  showIcon?: boolean;
}

export const InviteStatusIndicator: React.FC<InviteStatusIndicatorProps> = ({ 
  status, 
  expiresAt, 
  showIcon = true 
}) => {
  const isExpired = new Date(expiresAt) < new Date();
  
  // Override status if expired
  const actualStatus = isExpired && status === 'pending' ? 'expired' : status;
  
  const getStatusConfig = () => {
    switch (actualStatus) {
      case 'pending':
        return {
          variant: 'default' as const,
          className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: Clock,
          label: 'Pendente'
        };
      case 'accepted':
        return {
          variant: 'default' as const,
          className: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: CheckCircle,
          label: 'Aceito'
        };
      case 'cancelled':
        return {
          variant: 'default' as const,
          className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          icon: XCircle,
          label: 'Cancelado'
        };
      case 'expired':
        return {
          variant: 'default' as const,
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: AlertTriangle,
          label: 'Expirado'
        };
      default:
        return {
          variant: 'secondary' as const,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: Mail,
          label: status
        };
    }
  };
  
  const config = getStatusConfig();
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
};