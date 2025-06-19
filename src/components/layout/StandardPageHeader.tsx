
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
}

const StandardPageHeader: React.FC<StandardPageHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  statusBadges = []
}) => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Icon className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
            <div className="absolute inset-0 h-12 w-12 text-cyan-400 animate-pulse blur-sm"></div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              {title}
            </h1>
            <p className="text-slate-300">{subtitle}</p>
          </div>
        </div>

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
