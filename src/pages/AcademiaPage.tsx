import React from 'react';
import { GraduationCap, BookOpen, Award } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';

const AcademiaPage: React.FC = () => {
  const statusBadges = [
    {
      icon: BookOpen,
      label: 'Cursos Online',
      variant: 'secondary' as const,
      color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
    },
    {
      icon: Award,
      label: 'Certificação',
      variant: 'secondary' as const,
      color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    }
  ];

  return (
    <AuroraPageLayout containerSize="lg" padding="sm" fullHeight>
      <StandardPageHeader
        icon={GraduationCap}
        title="Academia Fluida"
        subtitle="Plataforma de educação e certificação em estética"
        statusBadges={statusBadges}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Cursos Disponíveis</h3>
          <p className="text-muted-foreground">
            Acesse nossa biblioteca de cursos especializados em equipamentos e técnicas de estética.
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Certificação</h3>
          <p className="text-muted-foreground">
            Obtenha certificados reconhecidos após a conclusão dos cursos.
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Progresso</h3>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e histórico de aprendizado.
          </p>
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default AcademiaPage;