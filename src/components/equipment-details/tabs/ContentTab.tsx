
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ImageIcon } from 'lucide-react';

interface ContentTabProps {
  id?: string;
}

export const ContentTab: React.FC<ContentTabProps> = ({ id }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-10">
      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">Criar Conteúdo Personalizado</h3>
      <p className="text-muted-foreground mt-2">
        Gere roteiros, big ideas e stories para este equipamento.
      </p>
      <Button className="mt-4" onClick={() => navigate(`/custom-gpt?equipment=${id}&mode=advanced`)}>
        Acessar Gerador de Conteúdo
      </Button>
    </div>
  );
};
