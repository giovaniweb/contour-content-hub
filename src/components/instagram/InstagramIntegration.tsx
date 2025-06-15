
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, RefreshCw, CheckCircle, AlertCircle, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { InstagramOAuthButton } from "@/components/diagnostic-report/metrics-tab/InstagramOAuthButton";
import {
  getConnectedInstagramAccount,
  disconnectInstagramAccount,
  fetchInstagramAnalytics,
} from "@/services/instagramService";

// Props: children as extra content, onConnectionChange callback, showAnalyticsCard = boolean
export interface InstagramIntegrationProps {
  onConnectionChange?: (connected: boolean) => void;
  showAnalyticsCard?: boolean;
  className?: string;
}

export const InstagramIntegration: React.FC<InstagramIntegrationProps> = ({
  onConnectionChange,
  showAnalyticsCard = false,
  className
}) => {
  const [account, setAccount] = useState<null | {
    username: string,
    followers_count: number,
    engagement_rate: number,
    instagram_id: string,
    page_id: string,
    access_token: string,
  }>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAccount();
    // eslint-disable-next-line
  }, []);

  const loadAccount = async () => {
    setIsLoading(true);
    const acc = await getConnectedInstagramAccount();
    setAccount(acc);
    onConnectionChange?.(!!acc);
    setIsLoading(false);
  };

  const handleOAuthSuccess = () => {
    loadAccount();
    toast.success("Instagram conectado com sucesso!");
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    const ok = await disconnectInstagramAccount();
    if (ok) {
      setAccount(null);
      onConnectionChange?.(false);
      toast.success("Instagram desconectado!");
    } else {
      toast.error("Erro ao desconectar Instagram.");
    }
    setIsLoading(false);
  };

  const handleRefreshData = async () => {
    if (!account) {
      toast.error("Instagram não está conectado");
      return;
    }
    setIsLoading(true);
    try {
      await fetchInstagramAnalytics();
      await loadAccount();
      toast.success("Dados do Instagram atualizados!");
    } catch {
      toast.error("Erro ao atualizar métricas do Instagram");
    } finally {
      setIsLoading(false);
    }
  };

  // Layout
  return (
    <Card className={`aurora-glass border-aurora-turquoise/30 ${className ?? ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5 text-pink-500" />
          Conectar Instagram
          {account ? (
            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
              <CheckCircle className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          ) : (
            <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-orange-500/10">
              <AlertCircle className="h-3 w-3 mr-1" />
              Não Conectado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {account ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div>
                <p className="font-medium text-green-400">@{account.username}</p>
                <p className="text-sm text-foreground/60">
                  Conta conectada
                </p>
                <div className="text-xs mt-2 flex flex-col gap-1">
                  <span>👥 Seguidores: <b className="text-blue-400">{account.followers_count ?? "-"}</b></span>
                  <span>📈 Engajamento: <b className="text-green-400">{account.engagement_rate ?? 0}%</b></span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshData}
                  disabled={isLoading}
                  className="border-green-500/30 text-green-400"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar Métricas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="border-red-500/30 text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                  Desconectar
                </Button>
              </div>
            </div>
            <p className="text-sm text-foreground/60">
              ✅ Dados do Instagram estão integrados à sua conta Fluida.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center space-y-3">
              <Instagram className="h-12 w-12 mx-auto text-pink-500" />
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  Conecte seu Instagram em apenas um clique!
                </h3>
                <p className="text-sm text-foreground/60">
                  Clique abaixo, faça login e pronto. Suas métricas serão importadas automaticamente.
                </p>
              </div>
            </div>
            <InstagramOAuthButton onSuccess={handleOAuthSuccess} />
            <div className="text-center mt-2 text-xs text-foreground/50 flex flex-col items-center gap-1">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                Conexão oficial e segura pelo Instagram.
              </span>
              <span>
                Nenhuma configuração adicional é necessária.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InstagramIntegration;
