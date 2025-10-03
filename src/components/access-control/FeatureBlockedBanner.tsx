import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { FeatureStatus } from "@/hooks/useFeatureAccess";

interface FeatureBlockedBannerProps {
  featureName: string;
  status: FeatureStatus;
  className?: string;
}

export const FeatureBlockedBanner = ({ 
  featureName, 
  status, 
  className 
}: FeatureBlockedBannerProps) => {
  const navigate = useNavigate();

  const statusConfig = {
    blocked: {
      icon: Lock,
      title: "Recurso Bloqueado",
      description: "Este recurso não está disponível no seu plano atual.",
      action: "Ver Planos",
      variant: "destructive" as const
    },
    coming_soon: {
      icon: Sparkles,
      title: "Em Breve",
      description: "Este recurso está em desenvolvimento e estará disponível em breve.",
      action: "Saber Mais",
      variant: "default" as const
    },
    beta: {
      icon: Sparkles,
      title: "Versão BETA",
      description: "Este recurso está em fase de testes. Pode apresentar comportamentos inesperados.",
      action: null,
      variant: "default" as const
    },
    released: {
      icon: Sparkles,
      title: "",
      description: "",
      action: null,
      variant: "default" as const
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (status === 'released') {
    return null;
  }

  return (
    <Alert variant={config.variant} className={className}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{config.description}</p>
        {config.action && (
          <Button 
            variant={status === 'blocked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => navigate('/upgrade')}
            className="w-fit"
          >
            {config.action}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
