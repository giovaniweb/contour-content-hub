import React from 'react';
import { Palette, Image, Download } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';

const ArtesPage: React.FC = () => {
  const statusBadges = [
    {
      icon: Image,
      label: 'Arte Digital',
      variant: 'secondary' as const,
      color: 'bg-purple-500/20 text-purple-500 border-purple-500/30'
    },
    {
      icon: Download,
      label: 'Download Gratuito',
      variant: 'secondary' as const,
      color: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30'
    }
  ];

  return (
    <AuroraPageLayout containerSize="lg" padding="sm" fullHeight>
      <StandardPageHeader
        icon={Palette}
        title="Artes e Design"
        subtitle="Biblioteca de artes e materiais gráficos para sua clínica"
        statusBadges={statusBadges}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Biblioteca de Artes</h3>
          <p className="text-muted-foreground">
            Acesse nossa coleção de artes profissionais para suas campanhas de marketing.
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Templates</h3>
          <p className="text-muted-foreground">
            Templates editáveis para posts, stories e materiais gráficos.
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Customização</h3>
          <p className="text-muted-foreground">
            Personalize as artes com suas cores e logo da clínica.
          </p>
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default ArtesPage;