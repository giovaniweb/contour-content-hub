
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, RefreshCw, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { InstagramOAuthButton } from './InstagramOAuthButton';
import { 
  getInstagramConfig, 
  deleteInstagramConfig,
  fetchInstagramAnalytics,
  type InstagramConfig 
} from "@/services/instagramService";

interface InstagramConnectorProps {
  onConnectionChange?: (connected: boolean) => void;
}

export const InstagramConnector: React.FC<InstagramConnectorProps> = ({ onConnectionChange }) => {
  const [config, setConfig] = useState<InstagramConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const savedConfig = await getInstagramConfig();
      if (savedConfig) {
        setConfig(savedConfig);
        setIsConnected(true);
        onConnectionChange?.(true);
      } else {
        setIsConnected(false);
        onConnectionChange?.(false);
      }
    } catch (error) {
      console.error('Error loading Instagram config:', error);
      toast.error("Erro ao carregar configuração do Instagram");
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const success = await deleteInstagramConfig();
      if (success) {
        setConfig(null);
        setIsConnected(false);
        onConnectionChange?.(false);
      }
    } catch (error) {
      console.error('Error disconnecting Instagram:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    if (!isConnected) {
      toast.error("Instagram não está conectado");
      return;
    }

    setIsLoading(true);
    try {
      await fetchInstagramAnalytics();
    } catch (error) {
      console.error('Error refreshing Instagram data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSuccess = () => {
    loadConfig(); // Reload config after successful OAuth
  };

  return (
    <Card className="aurora-glass border-aurora-turquoise/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5 text-pink-500" />
          Conectar Instagram
          {isConnected ? (
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
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div>
                <p className="font-medium text-green-400">@{config?.username}</p>
                <p className="text-sm text-foreground/60">
                  Conta conectada • {config?.account_type || 'personal'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshData}
                  disabled={isLoading}
                  className="border-green-500/30 text-green-400"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
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
              ✅ Dados reais do Instagram serão utilizados nas métricas
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center space-y-3">
              <Instagram className="h-12 w-12 mx-auto text-pink-500" />
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  Conecte seu Instagram
                </h3>
                <p className="text-sm text-foreground/60">
                  Obtenha métricas reais de engajamento da sua conta em segundos
                </p>
              </div>
            </div>
            
            <InstagramOAuthButton onSuccess={handleOAuthSuccess} />
            
            <div className="text-center">
              <p className="text-xs text-foreground/50">
                🔒 Conexão segura • Apenas dados públicos
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
