
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { FileText, Image, Video, AlertCircle, Calendar, MessageCircle, Inbox } from "lucide-react";

type PlaceholderType = "content" | "media" | "messages" | "calendar" | "reports" | "generic";

interface PlaceholderProps {
  type?: PlaceholderType;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  type = "generic",
  title,
  description,
  icon: customIcon,
  action,
  className,
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case "content":
        return <FileText className="h-12 w-12" />;
      case "media":
        return <Image className="h-12 w-12" />;
      case "messages":
        return <MessageCircle className="h-12 w-12" />;
      case "calendar":
        return <Calendar className="h-12 w-12" />;
      case "reports":
        return <FileText className="h-12 w-12" />;
      default:
        return <Inbox className="h-12 w-12" />;
    }
  };

  const icon = customIcon || getDefaultIcon();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-6 rounded-lg border border-dashed bg-muted/30",
        className
      )}
    >
      <div className="text-muted-foreground mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md mb-4">{description}</p>}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export const MediaPlaceholder: React.FC<{ className?: string; type?: "image" | "video" }> = ({
  className,
  type = "image",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center aspect-video bg-muted/30 rounded-md border border-dashed",
        className
      )}
    >
      {type === "image" ? (
        <Image className="h-10 w-10 text-muted-foreground" />
      ) : (
        <Video className="h-10 w-10 text-muted-foreground" />
      )}
      <span className="mt-2 text-xs text-muted-foreground">
        {type === "image" ? "Imagem não disponível" : "Vídeo não disponível"}
      </span>
    </div>
  );
};

export const ErrorPlaceholder: React.FC<{
  title?: string;
  message?: string;
  className?: string;
  onRetry?: () => void;
}> = ({
  title = "Algo deu errado",
  message = "Não foi possível carregar este conteúdo",
  className,
  onRetry,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-lg border border-red-200 bg-red-50",
        className
      )}
    >
      <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
      <h3 className="text-base font-medium text-red-700">{title}</h3>
      <p className="text-sm text-red-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
          Tentar novamente
        </Button>
      )}
    </div>
  );
};
