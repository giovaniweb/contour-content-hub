
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, TrendingUp, Target } from 'lucide-react';

const MarketingConsultantBanner: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Consultoria em Marketing Digital</h2>
            <p className="text-muted-foreground mb-6">
              Acelere o crescimento da sua clínica com estratégias personalizadas de marketing digital. 
              Nossa IA analisa seu perfil e sugere as melhores práticas para aumentar sua visibilidade.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm">Estratégias direcionadas para seu público</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm">Aumento comprovado de conversões</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="text-sm">Suporte especializado 24/7</span>
              </div>
            </div>
            
            <Button className="w-full md:w-auto">
              Falar com Consultor
            </Button>
          </div>
          
          <div className="flex justify-center">
            <div className="w-64 h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-24 h-24 text-primary/60" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingConsultantBanner;
