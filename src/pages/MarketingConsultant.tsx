
import React from 'react';
import { BrainCircuit, MessageSquare, BarChart3, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MarketingConsultant: React.FC = () => {
  return (
    <div className="p-6">
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 aurora-glass rounded-2xl flex items-center justify-center">
              <BrainCircuit className="h-8 w-8 text-aurora-electric-purple aurora-floating" />
            </div>
            <div>
              <h1 className="text-4xl font-light aurora-text-gradient">
                Consultor de Marketing IA
              </h1>
              <p className="text-slate-400 aurora-body">
                Seu assistente inteligente para estratégias de marketing
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="aurora-card hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 aurora-glass rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-aurora-neon-blue" />
                </div>
                <CardTitle className="aurora-heading">Chat Estratégico</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Converse com a IA para obter insights e estratégias personalizadas.
              </p>
              <Button className="w-full aurora-button">
                Iniciar Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="aurora-card hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 aurora-glass rounded-full flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-aurora-emerald" />
                </div>
                <CardTitle className="aurora-heading">Análise de Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Analise o desempenho das suas campanhas e obtenha recomendações.
              </p>
              <Button className="w-full aurora-button">
                Ver Análises
              </Button>
            </CardContent>
          </Card>

          <Card className="aurora-card hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 aurora-glass rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-aurora-soft-pink" />
                </div>
                <CardTitle className="aurora-heading">Segmentação</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Identifique e segmente seu público-alvo de forma inteligente.
              </p>
              <Button className="w-full aurora-button">
                Segmentar Público
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="aurora-card p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Lightbulb className="h-8 w-8 text-aurora-electric-purple" />
              <h2 className="text-2xl font-medium aurora-heading">Precisa de ideias?</h2>
            </div>
            <p className="text-slate-300 max-w-2xl mx-auto">
              O Consultor IA pode ajudar você a criar estratégias personalizadas, 
              analisar tendências de mercado e otimizar suas campanhas de marketing.
            </p>
            <Button size="lg" className="aurora-button">
              <MessageSquare className="h-5 w-5 mr-2" />
              Começar Consultoria
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingConsultant;
