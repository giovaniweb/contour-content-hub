import React from 'react';
import { Lock, Mail, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AppFeature } from '@/hooks/useFeatureAccess';

interface RestrictedAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: AppFeature;
}

const featureNames: Record<AppFeature, string> = {
  'mestre_beleza': 'FluiChat',
  'consultor_mkt': 'FluiMKT',
  'fluida_roteirista': 'FluiRoteiro',
  'videos': 'FluiVideos',
  'fotos': 'FluiFotos',
  'artes': 'FluiArtes',
  'artigos_cientificos': 'FluiArtigos',
  'academia': 'FluiAulas',
  'equipamentos': 'Equipamentos',
  'fotos_antes_depois': 'Fotos Antes e Depois',
  'reports': 'Relatórios',
  'planner': 'Planner de Conteúdo',
  'ideas': 'Ideias de Conteúdo'
};

export const RestrictedAccessModal: React.FC<RestrictedAccessModalProps> = ({
  isOpen,
  onClose,
  feature
}) => {
  const featureName = featureNames[feature] || feature;

  const handleContactSupport = () => {
    // Aqui você pode implementar a lógica para entrar em contato
    // Por exemplo, abrir WhatsApp, email, ou sistema de tickets
    window.open('mailto:suporte@fluida.com.br?subject=Liberação de Acesso - ' + featureName, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
            <Lock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <DialogTitle className="text-center">
            Acesso Restrito
          </DialogTitle>
          <DialogDescription className="text-center">
            Você não tem permissão para acessar <strong>{featureName}</strong> no momento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground text-center">
              Entre em contato conosco para solicitar acesso a esta funcionalidade.
              Nossa equipe analisará sua solicitação e liberará o acesso conforme seu plano.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleContactSupport}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Solicitar Acesso por Email
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              className="w-full"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Falar no WhatsApp
            </Button>
          </div>

          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full"
          >
            Voltar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestrictedAccessModal;