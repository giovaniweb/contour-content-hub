
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusBadge {
  icon: LucideIcon;
  label: string;
  variant: 'secondary' | 'default' | 'destructive' | 'outline';
  color: string;
}

interface StandardPageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  statusBadges?: StatusBadge[];
  actions?: React.ReactNode;
}

const StandardPageHeader: React.FC<StandardPageHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  statusBadges = [],
  actions
}) => {
  return (
    <div className="container mx-auto py-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Icon className="h-10 w-10 text-blue-400 drop-shadow-lg" />
            <div className="absolute inset-0 h-10 w-10 text-blue-400 animate-pulse blur-sm"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg aurora-heading-enhanced">
              {title}
            </h1>
            <p className="text-slate-300 aurora-body">{subtitle}</p>
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex justify-center">
            {actions}
          </div>
        )}

        {/* Status Tags */}
        {statusBadges.length > 0 && (
          <div className="flex items-center justify-center gap-4">
            {statusBadges.map((badge, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className={`${badge.color} rounded-xl`}
              >
                <badge.icon className="h-4 w-4 mr-1" />
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardPageHeader;
