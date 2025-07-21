import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User, Loader2 } from 'lucide-react';
import { approvedScriptsService } from '@/services/approvedScriptsService';
import { ApprovedScriptWithPerformance } from '@/types/approved-scripts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ApprovedScripts = () => {
  const [scripts, setScripts] = useState<ApprovedScriptWithPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = async () => {
    try {
      setLoading(true);
      const data = await approvedScriptsService.getApprovedScripts();
      setScripts(data);
    } catch (error) {
      console.error('Erro ao carregar roteiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'pending':
        return 'Em revisão';
      case 'rejected':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando roteiros...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meus Roteiros</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie seus roteiros aprovados
        </p>
      </div>

      {scripts.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum roteiro encontrado</h3>
              <p className="text-muted-foreground">
                Você ainda não possui roteiros aprovados. Crie seu primeiro roteiro no Fluida Roteirista!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scripts.map((script) => (
            <Card key={script.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>{script.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(script.approval_status)}>
                      {getStatusLabel(script.approval_status)}
                    </Badge>
                    <Badge variant="outline">{script.format}</Badge>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {script.script_content?.substring(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Criado em {formatDate(script.created_at)}</span>
                  </div>
                  {script.approved_at && (
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Aprovado em {formatDate(script.approved_at)}</span>
                    </div>
                  )}
                </div>
                {script.equipment_used && script.equipment_used.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground">Equipamentos: </span>
                    <span className="text-sm">{script.equipment_used.join(', ')}</span>
                  </div>
                )}
                {script.performance && (
                  <div className="mt-2">
                    <Badge 
                      variant={script.performance.performance_rating === 'bombou' ? 'default' : 'secondary'}
                    >
                      Performance: {script.performance.performance_rating}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedScripts;