
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
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <div className="rounded-2xl p-3 bg-gradient-to-br from-aurora-neon-blue/20 to-aurora-electric-purple/20 border border-aurora-neon-blue/30">
              <Icon className="h-8 w-8 text-aurora-neon-blue" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-aurora-neon-blue via-aurora-electric-purple to-aurora-cyan bg-clip-text text-transparent aurora-heading-enhanced">
              {title}
            </h1>
            <p className="text-aurora-text-muted aurora-body mt-2">{subtitle}</p>
          </div>
        </div>

        {/* Status Tags */}
        {statusBadges.length > 0 && (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {statusBadges.map((badge, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="bg-aurora-card-bg/30 text-aurora-neon-blue border-aurora-neon-blue/30 rounded-xl px-3 py-1"
              >
                <badge.icon className="h-4 w-4 mr-1.5" />
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="flex justify-center pt-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardPageHeader;
