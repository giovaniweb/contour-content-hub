import { Badge } from "@/components/ui/badge";
import { FeatureStatus } from "@/hooks/useFeatureAccess";
import { Lock, Clock, FlaskConical } from "lucide-react";

interface FeatureBadgeProps {
  status: FeatureStatus;
  variant?: "default" | "compact";
  className?: string;
}

export const FeatureBadge = ({ status, variant = "default", className = "" }: FeatureBadgeProps) => {
  if (status === 'released') {
    return null; // Não mostra badge para features liberadas
  }

  const badgeConfig = {
    blocked: {
      label: "Bloqueado",
      icon: Lock,
      className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
    },
    coming_soon: {
      label: "Em breve",
      icon: Clock,
      className: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"
    },
    beta: {
      label: "BETA",
      icon: FlaskConical,
      className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20"
    }
  };

  const config = badgeConfig[status];
  const Icon = config.icon;

  if (variant === "compact") {
    return (
      <Badge 
        variant="outline" 
        className={`${config.className} h-5 px-1.5 gap-1 text-xs ${className}`}
      >
        <Icon className="h-3 w-3" />
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} gap-1.5 font-medium ${className}`}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
};
