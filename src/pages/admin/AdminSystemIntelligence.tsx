
import React from 'react';
import { LinkIcon, Settings, Share2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSystemIntelligence: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LinkIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Integrações</h1>
            <p className="text-slate-400">Gerencie integrações e conexões externas</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Nova Integração
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Instagram</span>
              <Button variant="outline" size="sm">Conectar</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Facebook</span>
              <Button variant="outline" size="sm">Conectar</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>YouTube</span>
              <Button variant="outline" size="sm">Conectar</Button>
            </div>
          </CardContent>
        </Card>

        {/* External APIs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              APIs Externas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>OpenAI</span>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Anthropic</span>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Google Cloud</span>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSystemIntelligence;
