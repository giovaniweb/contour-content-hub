
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Wand2, Sparkles, Home, ChevronRight } from 'lucide-react';
import FluidaRoteiristaNovo from '@/components/fluidaroteirista/FluidaRoteiristaNovo';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { Helmet } from 'react-helmet-async';

const Breadcrumb = () => {
  const navigate = useNavigate();
  
  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Fluida Roteirista', path: '/fluidaroteirista', active: true }
  ];

  return (
    <nav className="flex items-center space-x-2 mb-6">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-white/40" />
          )}
          <button
            onClick={() => !item.active && navigate(item.path)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              item.active 
                ? 'text-aurora-neon-blue bg-aurora-neon-blue/10 cursor-default' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.icon && <item.icon className="w-4 h-4" />}
            <span>{item.label}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

const FluidaRoteiristsPage: React.FC = () => {
  const statusBadges = [
    {
      icon: Wand2,
      label: 'IA Criativa',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: Sparkles,
      label: 'Roteiros Pro',
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
    }
  ];

  const handleScriptGenerated = (script: any) => {
    console.log('🎬 [FluidaRoteiristsPage] Script gerado:', script);
  };

  return (
    <AuroraPageLayout containerSize="lg" padding="sm">
      <Helmet>
        <title>Fluida Roteirista — Roteiros IA para clínicas estéticas</title>
        <meta name="description" content="Fluida Roteirista: gere roteiros de conteúdo com IA para clínicas estéticas com base científica e resultados profissionais." />
        <link rel="canonical" href="/fluidaroteirista" />
      </Helmet>
      <Breadcrumb />
      <StandardPageHeader
        icon={PenTool}
        title="Fluida Roteirista"
        subtitle="IA Criativa para Roteiros Únicos"
        statusBadges={statusBadges}
      />
      <FluidaRoteiristaNovo onScriptGenerated={handleScriptGenerated} />
    </AuroraPageLayout>
  );
};

export default FluidaRoteiristsPage;
