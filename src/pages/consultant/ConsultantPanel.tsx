
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ConsultantPanel: React.FC = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const consultations = [
    {
      id: 1,
      client: "Dr. Silva",
      topic: "Estratégia para Harmonização Facial",
      status: "pending",
      scheduledFor: "2024-06-08 14:00",
      priority: "high"
    },
    {
      id: 2,
      client: "Clínica Estética Plus",
      topic: "Análise de ROI em Marketing Digital",
      status: "completed",
      scheduledFor: "2024-06-07 10:00",
      priority: "medium"
    },
    {
      id: 3,
      client: "Dr. Oliveira",
      topic: "Posicionamento de Marca",
      status: "in_progress",
      scheduledFor: "2024-06-08 16:30",
      priority: "low"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Consultor';

  return (
    <Layout title="Painel de Consultoria">
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel de Consultoria</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {userName}! Gerencie suas consultorias e atendimentos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultorias Hoje</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +2 desde ontem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                Para hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Consultorias Agendadas</CardTitle>
            <CardDescription>
              Suas próximas consultorias e atendimentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(consultation.status)}
                    <div>
                      <h3 className="font-medium">{consultation.client}</h3>
                      <p className="text-sm text-muted-foreground">{consultation.topic}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(consultation.scheduledFor).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary" 
                      className={getPriorityColor(consultation.priority)}
                    >
                      {consultation.priority === 'high' && 'Alta'}
                      {consultation.priority === 'medium' && 'Média'}
                      {consultation.priority === 'low' && 'Baixa'}
                    </Badge>
                    
                    <Badge variant="outline">
                      {getStatusText(consultation.status)}
                    </Badge>
                    
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ConsultantPanel;
