
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AuroraCard from '@/components/ui/AuroraCard';

const PersonalizedSuggestions: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';

  return (
    <AuroraCard className="p-6">
      <h3 className="aurora-heading text-lg font-medium text-white mb-4">
        Sugestões Personalizadas
      </h3>
      <p className="aurora-body text-white/80 mb-4">
        Olá, {userName}! Aqui estão algumas sugestões baseadas no seu perfil:
      </p>
      <div className="space-y-2">
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-white text-sm">📝 Criar roteiro para redes sociais</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-white text-sm">🎥 Produzir vídeo educativo</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-white text-sm">📊 Analisar performance do conteúdo</p>
        </div>
      </div>
    </AuroraCard>
  );
};

export default PersonalizedSuggestions;
