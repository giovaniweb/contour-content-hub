import React, { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useFeatureAccess, AppFeature } from '@/hooks/useFeatureAccess';
import { FeatureBadge } from './FeatureBadge';

interface FeatureAccessControlProps {
  feature: AppFeature;
  children: ReactNode;
  className?: string;
  showTooltip?: boolean;
  onRestrictedClick?: () => void;
}

export const FeatureAccessControl: React.FC<FeatureAccessControlProps> = ({
  feature,
  children,
  className,
  showTooltip = true,
  onRestrictedClick
}) => {
  const { hasAccess, getFeatureStatus, isNewFeature, isLoading } = useFeatureAccess();

  const hasFeatureAccess = hasAccess(feature);
  const featureStatus = getFeatureStatus(feature);
  const isNew = isNewFeature(feature);

  const handleClick = (e: React.MouseEvent) => {
    if (!hasFeatureAccess) {
      e.preventDefault();
      e.stopPropagation();
      if (onRestrictedClick) {
        onRestrictedClick();
      }
    }
  };

  const tooltipMessage = 
    featureStatus === 'blocked' ? 'Recurso bloqueado - Entre em contato para liberar' :
    featureStatus === 'coming_soon' ? 'Recurso em breve - Aguarde liberação' :
    featureStatus === 'beta' ? 'Recurso em BETA - Pode apresentar erros' :
    'Acesso restrito';

  const content = (
    <div 
      className={cn(
        "relative inline-block",
        !hasFeatureAccess && "cursor-not-allowed",
        className
      )}
      onClick={handleClick}
    >
      {/* Main content */}
      <div className={cn(
        "transition-all duration-200",
        !hasFeatureAccess && "opacity-60 grayscale"
      )}>
        {children}
      </div>

      {/* Status badge for restricted features */}
      {!hasFeatureAccess && !isLoading && featureStatus && (
        <div className="absolute -top-1 -right-1">
          <FeatureBadge status={featureStatus} variant="compact" />
        </div>
      )}

      {/* New feature badge */}
      {hasFeatureAccess && isNew && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs bg-emerald-500 hover:bg-emerald-500 text-white border-emerald-600 animate-pulse"
        >
          <Sparkles size={10} className="mr-1" />
          Novo
        </Badge>
      )}
    </div>
  );

  if (!showTooltip || hasFeatureAccess) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {tooltipMessage}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FeatureAccessControl;