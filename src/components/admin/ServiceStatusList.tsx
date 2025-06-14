
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { ServiceStatus } from "@/hooks/useSystemServicesStatus";

interface ServiceStatusListProps {
  services: ServiceStatus[];
  isLoading?: boolean;
  isError?: boolean;
}

const statusIcons = {
  operational: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  degraded: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  down: <XCircle className="h-4 w-4 text-red-500" />,
};

const statusLabels: Record<string, string> = {
  operational: "Operacional",
  degraded: "Degradado",
  down: "Indisponível",
};

export const ServiceStatusList: React.FC<ServiceStatusListProps> = ({
  services,
  isLoading,
  isError,
}) => {
  if (isLoading) {
    return <div className="py-6 text-center text-muted-foreground">Carregando status dos serviços...</div>;
  }
  if (isError) {
    return <div className="py-6 text-center text-red-500">Erro ao carregar status dos serviços.</div>;
  }
  if (!services?.length) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        Nenhum serviço cadastrado ainda.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="flex flex-col gap-2 p-4 rounded-lg bg-background/60 border border-muted shadow-sm"
        >
          <div className="flex items-center gap-2">
            {statusIcons[service.status as "operational" | "degraded" | "down"] ?? <AlertTriangle className="h-4 w-4" />}
            <span className="font-semibold">{service.name}</span>
            <Badge
              className={`ml-auto text-xs ${
                service.status === "operational"
                  ? "bg-green-100 text-green-700"
                  : service.status === "degraded"
                  ? "bg-yellow-100 text-yellow-700"
                  : service.status === "down"
                  ? "bg-red-100 text-red-700"
                  : ""
              }`}
              variant="outline"
            >
              {statusLabels[service.status] ?? service.status}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mb-1">
            {service.endpoint}
          </div>
          <div className="text-sm">
            {service.message || (
              <span className="text-muted-foreground">Sem mensagem adicional.</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex gap-2">
            Última verificação:{" "}
            {new Date(service.last_checked_at).toLocaleString("pt-BR")}
            {service.latency_ms && (
              <span>&middot; Latência: {service.latency_ms}ms</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
