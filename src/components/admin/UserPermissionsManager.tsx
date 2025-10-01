import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AppFeature, FeatureStatus } from '@/hooks/useFeatureAccess';
import { 
  Shield, 
  Calendar, 
  Clock, 
  Search, 
  Plus,
  Trash2,
  AlertCircle,
  RotateCcw,
  History
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface UserPermission {
  id?: string;
  feature: AppFeature;
  enabled: boolean;
  status?: FeatureStatus;
  user_override_status?: FeatureStatus | null;
  expires_at?: string;
  granted_at?: string;
}

interface UserPermissionsManagerProps {
  userId: string;
}

const AVAILABLE_FEATURES: { feature: AppFeature; label: string; description: string; category: string }[] = [
  { feature: 'videos', label: 'FluiVideos', description: 'Acesso completo à biblioteca de vídeos', category: 'Conteúdo' },
  { feature: 'mestre_beleza', label: 'Mestre da Beleza', description: 'Ferramenta de diagnóstico estético com IA', category: 'IA' },
  { feature: 'consultor_mkt', label: 'Consultor de Marketing', description: 'Consultoria de marketing digital', category: 'IA' },
  { feature: 'fluida_roteirista', label: 'Fluida Roteirista', description: 'Criação automática de roteiros', category: 'IA' },
  { feature: 'artigos_cientificos', label: 'Documentos Científicos', description: 'Acesso a documentos e artigos científicos', category: 'Conteúdo' },
  { feature: 'fotos', label: 'FluiFotos', description: 'Visualização de casos de sucesso', category: 'Conteúdo' },
  { feature: 'equipamentos', label: 'Equipamentos', description: 'Informações sobre equipamentos estéticos', category: 'Conteúdo' },
  { feature: 'planner', label: 'Planejador de Conteúdo', description: 'Ferramenta de planejamento estratégico', category: 'Produtividade' },
  { feature: 'academia', label: 'FluiAulas', description: 'Cursos e certificações', category: 'Educação' },
  { feature: 'artes', label: 'FluiArtes', description: 'Downloads e materiais complementares', category: 'Educação' }
];

const UserPermissionsManager: React.FC<UserPermissionsManagerProps> = ({ userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newPermission, setNewPermission] = useState({
    feature: '' as AppFeature | '',
    expires_at: ''
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedFeatureHistory, setSelectedFeatureHistory] = useState<AppFeature | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user permissions
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_feature_permissions')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch status history for a specific feature
  const { data: statusHistory = [] } = useQuery({
    queryKey: ['feature-status-history', userId, selectedFeatureHistory],
    queryFn: async () => {
      if (!selectedFeatureHistory) return [];
      
      const { data, error } = await supabase
        .from('user_feature_status_history')
        .select('*, changed_by_profile:perfis!user_feature_status_history_changed_by_fkey(nome)')
        .eq('user_id', userId)
        .eq('feature', selectedFeatureHistory)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedFeatureHistory
  });

  // Grant permission mutation
  const grantPermissionMutation = useMutation({
    mutationFn: async (permission: Omit<UserPermission, 'id'>) => {
      const { error } = await supabase
        .from('user_feature_permissions')
        .upsert({
          user_id: userId,
          feature: permission.feature,
          enabled: true,
          expires_at: permission.expires_at || null,
          granted_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,feature'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', userId] });
      setShowAddDialog(false);
      setNewPermission({ feature: '', expires_at: '' });
      toast({
        title: "Permissão concedida",
        description: "A permissão foi concedida com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao conceder permissão",
        description: error.message,
      });
    }
  });

  // Update feature status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ feature, status, reason }: { 
      feature: AppFeature; 
      status: FeatureStatus | null;
      reason?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('update-user-feature-status', {
        body: {
          userId,
          feature,
          status,
          reason
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', userId] });
      queryClient.invalidateQueries({ queryKey: ['feature-status-history', userId] });
      toast({
        title: "Status atualizado",
        description: "O status da feature foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: error.message,
      });
    }
  });

  // Revoke permission mutation
  const revokePermissionMutation = useMutation({
    mutationFn: async (feature: AppFeature) => {
      const { error } = await supabase
        .from('user_feature_permissions')
        .delete()
        .match({ user_id: userId, feature });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', userId] });
      toast({
        title: "Permissão removida",
        description: "A permissão foi removida com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao remover permissão",
        description: error.message,
      });
    }
  });

  const hasPermission = (feature: AppFeature) => {
    return permissions.some(p => p.feature === feature && p.enabled);
  };

  const getPermissionData = (feature: AppFeature) => {
    return permissions.find(p => p.feature === feature);
  };

  const getEffectiveStatus = (permission?: UserPermission): FeatureStatus => {
    if (!permission) return 'blocked';
    return permission.user_override_status || permission.status || 'released';
  };

  const isOverrideActive = (permission?: UserPermission): boolean => {
    return permission?.user_override_status !== null && permission?.user_override_status !== undefined;
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadgeVariant = (status: FeatureStatus) => {
    switch (status) {
      case 'released': return 'default';
      case 'beta': return 'secondary';
      case 'coming_soon': return 'outline';
      case 'blocked': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: FeatureStatus) => {
    switch (status) {
      case 'released': return 'Liberado';
      case 'beta': return 'Beta';
      case 'coming_soon': return 'Em Breve';
      case 'blocked': return 'Bloqueado';
      default: return status;
    }
  };

  const filteredFeatures = AVAILABLE_FEATURES.filter(feature =>
    feature.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedFeatures = filteredFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_FEATURES>);

  const handleTogglePermission = (feature: AppFeature, enabled: boolean) => {
    if (enabled) {
      grantPermissionMutation.mutate({ feature, enabled: true });
    } else {
      revokePermissionMutation.mutate(feature);
    }
  };

  const handleAddPermission = () => {
    if (!newPermission.feature) {
      toast({
        variant: "destructive",
        title: "Feature obrigatória",
        description: "Selecione uma feature para conceder a permissão.",
      });
      return;
    }

    grantPermissionMutation.mutate({
      feature: newPermission.feature,
      enabled: true,
      expires_at: newPermission.expires_at || undefined
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Controle de Permissões
            </CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Conceder Permissão
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Conceder Nova Permissão</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Feature</Label>
                    <Select 
                      value={newPermission.feature} 
                      onValueChange={(value: AppFeature) => 
                        setNewPermission(prev => ({ ...prev, feature: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma feature" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_FEATURES.map(feature => (
                          <SelectItem 
                            key={feature.feature} 
                            value={feature.feature}
                            disabled={hasPermission(feature.feature)}
                          >
                            {feature.label}
                            {hasPermission(feature.feature) && " (já concedida)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Data de Expiração (opcional)</Label>
                    <Input
                      type="datetime-local"
                      value={newPermission.expires_at}
                      onChange={(e) => setNewPermission(prev => ({ 
                        ...prev, 
                        expires_at: e.target.value 
                      }))}
                    />
                  </div>


                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddPermission}>
                      Conceder Permissão
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Permissions by Category */}
      {Object.entries(categorizedFeatures).map(([category, features]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {features.map(({ feature, label, description }) => {
                const permissionDataRaw = getPermissionData(feature);
                // Type-safe permission data
                const permissionData: UserPermission | undefined = permissionDataRaw ? {
                  ...permissionDataRaw,
                  user_override_status: permissionDataRaw.user_override_status as FeatureStatus | null,
                  status: permissionDataRaw.status as FeatureStatus | undefined
                } : undefined;
                
                const isPermissionExpired = isExpired(permissionData?.expires_at);
                const hasFeaturePermission = hasPermission(feature);
                const effectiveStatus = getEffectiveStatus(permissionData);
                const hasOverride = isOverrideActive(permissionData);

                return (
                  <div key={feature} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium">{label}</h4>
                        
                        {/* Status Badge */}
                        <Badge variant={getStatusBadgeVariant(effectiveStatus)}>
                          {getStatusLabel(effectiveStatus)}
                        </Badge>

                        {/* Override Indicator */}
                        {hasOverride && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="border-blue-500 text-blue-700">
                                  Override
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Status específico para este usuário</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {hasFeaturePermission && (
                          <Badge variant={isPermissionExpired ? "destructive" : "default"}>
                            {isPermissionExpired ? 'Expirada' : 'Ativa'}
                          </Badge>
                        )}
                        {isPermissionExpired && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{description}</p>

                      {/* Status Control */}
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Status:</Label>
                        <Select
                          value={permissionData?.user_override_status || ''}
                          onValueChange={(value) => {
                            updateStatusMutation.mutate({
                              feature,
                              status: value === '' ? null : value as FeatureStatus
                            });
                          }}
                        >
                          <SelectTrigger className="h-8 w-[180px]">
                            <SelectValue placeholder="Global" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Global ({getStatusLabel(permissionData?.status || 'blocked')})</SelectItem>
                            <SelectItem value="released">Liberado</SelectItem>
                            <SelectItem value="beta">Beta</SelectItem>
                            <SelectItem value="coming_soon">Em Breve</SelectItem>
                            <SelectItem value="blocked">Bloqueado</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* History Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFeatureHistory(feature);
                            setShowHistoryDialog(true);
                          }}
                        >
                          <History className="h-4 w-4" />
                        </Button>

                        {/* Reset Override Button */}
                        {hasOverride && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    updateStatusMutation.mutate({
                                      feature,
                                      status: null,
                                      reason: 'Resetado para status global'
                                    });
                                  }}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Resetar para status global</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      
                      {permissionData?.expires_at && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Expira em: {new Date(permissionData.expires_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      )}
                      
                      {permissionData?.granted_at && (
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Concedida em: {new Date(permissionData.granted_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {hasFeaturePermission && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revokePermissionMutation.mutate(feature)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Switch
                                checked={hasFeaturePermission && !isPermissionExpired}
                                onCheckedChange={(checked) => handleTogglePermission(feature, checked)}
                                disabled={isPermissionExpired}
                                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500/50 border-2 data-[state=checked]:border-green-600 data-[state=unchecked]:border-red-400"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            className={`${
                              hasFeaturePermission && !isPermissionExpired 
                                ? 'bg-green-600 text-white border-green-700' 
                                : 'bg-red-600 text-white border-red-700'
                            }`}
                          >
                            {hasFeaturePermission && !isPermissionExpired ? 'Habilitado' : 'Desabilitado'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Histórico de Mudanças - {selectedFeatureHistory && 
                AVAILABLE_FEATURES.find(f => f.feature === selectedFeatureHistory)?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {statusHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma mudança registrada para esta feature.
              </p>
            ) : (
              statusHistory.map((history: any) => (
                <div key={history.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(history.old_status || 'blocked')}>
                        {getStatusLabel(history.old_status || 'blocked')}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant={getStatusBadgeVariant(history.new_status)}>
                        {getStatusLabel(history.new_status)}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(history.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Por: {history.changed_by_profile?.nome || 'Sistema'}
                  </div>
                  {history.change_reason && (
                    <div className="text-sm mt-2 p-2 bg-muted rounded">
                      {history.change_reason}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserPermissionsManager;