import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, AlertTriangle, RefreshCw, Users, Database } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface OrphanedUser {
  id: string;
  email: string;
  created_at: string;
}

interface OrphanedUsersStats {
  success: boolean;
  orphaned_count: number;
  orphaned_users: OrphanedUser[];
}

const OrphanedUsersCard: React.FC = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch orphaned users stats
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['orphaned-users-stats'],
    queryFn: async (): Promise<OrphanedUsersStats> => {
      const { data, error } = await supabase.functions.invoke('admin-cleanup', {
        body: { action: 'get_orphaned_stats' }
      });
      
      if (error) throw error;
      return data;
    },
  });

  // Cleanup orphaned users mutation
  const cleanupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-cleanup', {
        body: { action: 'cleanup_orphaned_users' }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orphaned-users-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowConfirmDialog(false);
      
      if (data.orphaned_users_cleaned > 0) {
        toast({
          title: 'Limpeza concluída com sucesso!',
          description: `${data.orphaned_users_cleaned} usuário(s) órfão(s) removido(s): ${data.cleaned_users?.join(', ')}`,
        });
      } else {
        toast({
          title: 'Nenhum usuário órfão encontrado',
          description: 'Todos os usuários possuem perfis válidos.',
        });
      }
    },
    onError: (error: any) => {
      setShowConfirmDialog(false);
      toast({
        variant: 'destructive',
        title: 'Erro na limpeza',
        description: error.message || 'Não foi possível executar a limpeza de usuários órfãos.',
      });
    },
  });

  const handleCleanup = () => {
    setShowConfirmDialog(true);
  };

  const confirmCleanup = () => {
    cleanupMutation.mutate();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Usuários Órfãos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const orphanedCount = stats?.orphaned_count || 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Usuários Órfãos
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Usuários órfãos encontrados:</span>
            </div>
            <Badge variant={orphanedCount > 0 ? "destructive" : "outline"}>
              {orphanedCount}
            </Badge>
          </div>

          {orphanedCount > 0 && (
            <>
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">
                      Usuários órfãos são contas que existem na autenticação mas não possuem perfil completo.
                      Estes usuários não conseguem usar o sistema normalmente.
                    </p>
                    <p>
                      A limpeza removerá estes usuários completamente do sistema, liberando os emails para novos cadastros.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailsDialog(true)}
                  className="flex-1"
                >
                  Ver Detalhes
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCleanup}
                  disabled={cleanupMutation.isPending}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {cleanupMutation.isPending ? 'Limpando...' : 'Limpar Órfãos'}
                </Button>
              </div>
            </>
          )}

          {orphanedCount === 0 && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">
                  Sistema limpo - nenhum usuário órfão encontrado
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Limpeza de Usuários Órfãos</DialogTitle>
            <DialogDescription>
              Esta ação irá remover permanentemente {orphanedCount} usuário(s) órfão(s) do sistema.
              <br /><br />
              <strong>Esta ação não pode ser desfeita.</strong>
              <br /><br />
              Os emails destes usuários ficarão disponíveis para novos cadastros.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={cleanupMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCleanup}
              disabled={cleanupMutation.isPending}
            >
              {cleanupMutation.isPending ? 'Removendo...' : 'Confirmar Remoção'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes dos Usuários Órfãos</DialogTitle>
            <DialogDescription>
              Lista de usuários que possuem conta de autenticação mas não têm perfil completo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {stats?.orphaned_users?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Órfão
                </Badge>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrphanedUsersCard;