
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Instagram, Link, RefreshCw, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { 
  getInstagramConfig, 
  saveInstagramConfig, 
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    access_token: '',
    instagram_user_id: '',
    username: '',
    account_type: 'business'
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const savedConfig = await getInstagramConfig();
      if (savedConfig) {
        setConfig(savedConfig);
        setIsConnected(true);
        setFormData({
          access_token: savedConfig.access_token,
          instagram_user_id: savedConfig.instagram_user_id,
          username: savedConfig.username,
          account_type: savedConfig.account_type || 'business'
        });
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

  const handleSave = async () => {
    if (!formData.access_token || !formData.instagram_user_id || !formData.username) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      const savedConfig = await saveInstagramConfig(formData);
      if (savedConfig) {
        setConfig(savedConfig);
        setIsConnected(true);
        setIsDialogOpen(false);
        onConnectionChange?.(true);
        
        // Automatically fetch analytics after connecting
        await fetchInstagramAnalytics();
      }
    } catch (error) {
      console.error('Error saving Instagram config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const success = await deleteInstagramConfig();
      if (success) {
        setConfig(null);
        setIsConnected(false);
        setFormData({
          access_token: '',
          instagram_user_id: '',
          username: '',
          account_type: 'business'
        });
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

  return (
    <Card className="aurora-glass border-aurora-turquoise/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5 text-pink-500" />
          Integração Instagram
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
                  Conta conectada • {config?.account_type || 'business'}
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
            <p className="text-foreground/60 text-sm">
              Conecte sua conta comercial do Instagram para obter métricas reais de engajamento.
            </p>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  <Link className="h-4 w-4 mr-2" />
                  Conectar Instagram
                </Button>
              </DialogTrigger>
              <DialogContent className="aurora-glass border-aurora-turquoise/30">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-500" />
                    Conectar Instagram Business
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Como obter as informações:</h4>
                    <ol className="text-sm text-foreground/80 space-y-1">
                      <li>1. Acesse o Facebook Developer Console</li>
                      <li>2. Crie um app e configure Instagram Basic Display</li>
                      <li>3. Obtenha o Access Token de longa duração</li>
                      <li>4. Copie o User ID da sua conta business</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="username">Nome de usuário Instagram</Label>
                      <Input
                        id="username"
                        placeholder="@seu_usuario"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="user_id">Instagram User ID</Label>
                      <Input
                        id="user_id"
                        placeholder="17841405793187218"
                        value={formData.instagram_user_id}
                        onChange={(e) => setFormData({...formData, instagram_user_id: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="access_token">Access Token</Label>
                      <Input
                        id="access_token"
                        type="password"
                        placeholder="IGQVJYa2xlaGpGSDhqTVE..."
                        value={formData.access_token}
                        onChange={(e) => setFormData({...formData, access_token: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-pink-500 to-purple-600"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Conectando...
                        </>
                      ) : (
                        <>
                          <Link className="h-4 w-4 mr-2" />
                          Conectar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
