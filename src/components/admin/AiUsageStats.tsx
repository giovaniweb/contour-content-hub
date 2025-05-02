
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { Sparkles, MessageSquare, Users, FileText } from "lucide-react";
import AiIndicator from "@/components/AiIndicator";

// Dados simulados - em uma aplicação real, seriam buscados do backend
const weeklyUsageData = [
  { name: 'Seg', roteiros: 12, agendamento: 8, bigideas: 5 },
  { name: 'Ter', roteiros: 19, agendamento: 5, bigideas: 7 },
  { name: 'Qua', roteiros: 15, agendamento: 10, bigideas: 4 },
  { name: 'Qui', roteiros: 13, agendamento: 7, bigideas: 8 },
  { name: 'Sex', roteiros: 22, agendamento: 12, bigideas: 6 },
  { name: 'Sáb', roteiros: 10, agendamento: 5, bigideas: 2 },
  { name: 'Dom', roteiros: 5, agendamento: 2, bigideas: 1 },
];

const aiModelUsageData = [
  { name: 'GPT-4o', value: 45, color: '#2672B8' },
  { name: 'Claude 3', value: 30, color: '#91B0DC' },
  { name: 'Mistral', value: 15, color: '#E7E7E6' },
  { name: 'Gemini', value: 10, color: '#162C45' },
];

interface AiUsageStatsProps {
  className?: string;
}

const AiUsageStats: React.FC<AiUsageStatsProps> = ({ className = '' }) => {
  // Estatísticas resumidas - valores simulados
  const totalGenerations = 542;
  const avgGenerationsPerUser = 8.7;
  const weeklyGrowth = '+12%';
  const activeUsers = 62;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-heading font-bold text-gray-800">
          Uso da IA na Plataforma
        </h2>
        <AiIndicator position="inline" size="md" tooltipText="Painel de estatísticas de uso da IA" />
      </div>
      
      {/* Cards de estatísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="modern-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Total de Gerações</p>
              <Sparkles className="h-5 w-5 text-contourline-mediumBlue" />
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-800">{totalGenerations}</p>
              <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                {weeklyGrowth}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Média por Usuário</p>
              <Users className="h-5 w-5 text-contourline-mediumBlue" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{avgGenerationsPerUser}</p>
          </CardContent>
        </Card>
        
        <Card className="modern-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Usuários Ativos</p>
              <Users className="h-5 w-5 text-contourline-mediumBlue" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{activeUsers}</p>
          </CardContent>
        </Card>
        
        <Card className="modern-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Geração mais popular</p>
              <FileText className="h-5 w-5 text-contourline-mediumBlue" />
            </div>
            <p className="text-xl font-medium text-gray-800">Roteiros</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de uso semanal */}
        <Card className="modern-card lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-1.5">
              <FileText className="h-5 w-5 text-contourline-mediumBlue" />
              <CardTitle className="text-lg font-medium">
                Utilização Semanal
              </CardTitle>
            </div>
            <CardDescription>
              Número de gerações por dia e tipo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyUsageData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#91B0DC',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="roteiros" name="Roteiros de Vídeo" fill="#2672B8" />
                  <Bar dataKey="agendamento" name="Agendamento de Conteúdo" fill="#91B0DC" />
                  <Bar dataKey="bigideas" name="Big Ideas" fill="#162C45" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por modelo de IA */}
        <Card className="modern-card">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-5 w-5 text-contourline-mediumBlue" />
              <CardTitle className="text-lg font-medium">
                Modelos de IA
              </CardTitle>
            </div>
            <CardDescription>
              Distribuição de uso por modelo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aiModelUsageData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {aiModelUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} gerações`, 'Quantidade']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#91B0DC',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights de Otimização - baseado em IA */}
      <Card className="modern-card border-l-4 border-l-contourline-mediumBlue">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-5 w-5 text-contourline-mediumBlue" />
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              Insights de Otimização
              <AiIndicator position="inline" size="sm" />
            </CardTitle>
          </div>
          <CardDescription>
            Sugestões baseadas no uso atual da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="font-medium text-gray-800">A utilização do modelo GPT-4o está alta</p>
              <p className="text-gray-600 text-sm mt-1">Considere definir limites de uso por cliente ou migrar algumas funcionalidades para modelos mais econômicos.</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="font-medium text-gray-800">Pico de uso às sextas-feiras</p>
              <p className="text-gray-600 text-sm mt-1">Os clientes tendem a planejar mais conteúdo antes do fim de semana. Considere enviar lembretes e dicas específicas para este dia.</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="font-medium text-gray-800">Big Ideas têm crescimento constante</p>
              <p className="text-gray-600 text-sm mt-1">Considere expandir esta funcionalidade com mais templates e opções de personalização, há potencial para maior engajamento.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiUsageStats;
