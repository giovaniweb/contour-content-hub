import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, X, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useAcademyInvites } from '@/hooks/useAcademyInvites';
import { InviteStatusIndicator } from './InviteStatusIndicator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const InvitesManagement: React.FC = () => {
  const { invites, isLoading, cancelInvite, resendInvite } = useAcademyInvites();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const isPending = (status: string, expiresAt: string) => {
    return status === 'pending' && new Date(expiresAt) > new Date();
  };

  // Statistics
  const stats = {
    total: invites.length,
    pending: invites.filter(i => isPending(i.status, i.expires_at)).length,
    accepted: invites.filter(i => i.status === 'accepted').length,
    expired: invites.filter(i => new Date(i.expires_at) < new Date() && i.status === 'pending').length + 
             invites.filter(i => i.status === 'expired').length
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="text-center py-8">
          <p className="text-slate-400">Carregando convites...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-50 flex items-center justify-between">
          <span>Convites Enviados</span>
          <div className="flex items-center gap-2 text-sm font-normal">
            <div className="flex items-center gap-1 text-amber-400">
              <Clock className="h-3 w-3" />
              {stats.pending}
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="h-3 w-3" />
              {stats.accepted}
            </div>
            <div className="flex items-center gap-1 text-red-400">
              <AlertCircle className="h-3 w-3" />
              {stats.expired}
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Gerencie os convites enviados para novos usuários ({stats.total} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invites.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-400">Nenhum convite enviado ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-700/30"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-50">{invite.first_name}</h3>
                    <InviteStatusIndicator status={invite.status} expiresAt={invite.expires_at} />
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{invite.email}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Criado: {formatDate(invite.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expira: {formatDate(invite.expires_at)}
                    </span>
                    <span>{invite.course_ids.length} curso(s)</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isPending(invite.status, invite.expires_at) && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                        onClick={() => resendInvite(invite.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-500/10"
                        onClick={() => cancelInvite(invite.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};