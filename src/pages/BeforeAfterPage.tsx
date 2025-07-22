
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Camera, 
  Image as ImageIcon, 
  Star,
  Layers,
  FileText,
  Users,
  Target,
  Settings,
  Sparkles
} from "lucide-react";
import BeforeAfterManager from '@/components/before-after/BeforeAfterManager';
import { beforeAfterService } from '@/services/beforeAfterService';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';

const BeforeAfterPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    publicPhotos: 0,
    protocolsCompleted: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      console.log('🔄 Iniciando carregamento das estatísticas...');
      
      const [userPhotos, publicPhotos] = await Promise.all([
        beforeAfterService.getUserPhotos(),
        beforeAfterService.getPublicPhotos()
      ]);

      console.log('📊 Dados carregados:', {
        userPhotos: userPhotos.length,
        publicPhotos: publicPhotos.length,
        userPhotosData: userPhotos,
        publicPhotosData: publicPhotos
      });

      const protocolsWithFullData = userPhotos.filter(photo => 
        photo.equipment_parameters && 
        photo.treated_areas && 
        photo.treatment_objective
      ).length;

      const newStats = {
        totalPhotos: userPhotos.length,
        publicPhotos: publicPhotos.length,
        protocolsCompleted: protocolsWithFullData,
        averageRating: userPhotos.length > 0 ? 4.5 : 0
      };

      console.log('📈 Estatísticas calculadas:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusBadges = [
    {
      icon: Sparkles,
      label: `${stats.totalPhotos} Casos`,
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: Star,
      label: `${stats.averageRating.toFixed(1)} Avaliação`,
      variant: 'secondary' as const,
      color: 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Camera}
        title="Antes & Depois Profissional"
        subtitle="Sistema completo para documentação de protocolos e resultados estéticos"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6 py-8 space-y-6">

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-aurora-electric-purple/20">
                <ImageIcon className="h-5 w-5 text-aurora-electric-purple" />
              </div>
              <div>
                <p className="text-sm aurora-body">Total de Casos</p>
                <p className="text-2xl font-bold aurora-heading">
                  {loading ? '...' : stats.totalPhotos}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-aurora-emerald/20">
                <FileText className="h-5 w-5 text-aurora-emerald" />
              </div>
              <div>
                <p className="text-sm aurora-body">Protocolos Completos</p>
                <p className="text-2xl font-bold aurora-heading">
                  {loading ? '...' : stats.protocolsCompleted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-aurora-neon-blue/20">
                <Users className="h-5 w-5 text-aurora-neon-blue" />
              </div>
              <div>
                <p className="text-sm aurora-body">Públicos</p>
                <p className="text-2xl font-bold aurora-heading">
                  {loading ? '...' : stats.publicPhotos}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-aurora-lime/20">
                <Star className="h-5 w-5 text-aurora-lime" />
              </div>
              <div>
                <p className="text-sm aurora-body">Avaliação Média</p>
                <p className="text-2xl font-bold aurora-heading">
                  {loading ? '...' : stats.averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sistema Integrado */}
      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardHeader>
          <CardTitle className="aurora-heading flex items-center gap-3">
            <Layers className="h-6 w-6 text-aurora-electric-purple" />
            Sistema Completo de Antes & Depois
          </CardTitle>
          <p className="aurora-body text-sm">
            Galeria, montador avançado e upload com protocolo completo - tudo em um só lugar
          </p>
        </CardHeader>
        <CardContent>
          <BeforeAfterManager />
        </CardContent>
      </Card>

      {/* Guia de Protocolo Completo */}
      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardHeader>
          <CardTitle className="aurora-heading flex items-center gap-3">
            <Target className="h-6 w-6 text-aurora-electric-purple" />
            Protocolo Profissional Completo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="aurora-heading-enhanced font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Parâmetros Técnicos
              </h4>
              <ul className="aurora-body text-sm space-y-1">
                <li>• Intensidade do equipamento</li>
                <li>• Frequência utilizada</li>
                <li>• Tempo de aplicação</li>
                <li>• Outros parâmetros específicos</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="aurora-heading-enhanced font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Protocolo Clínico
              </h4>
              <ul className="aurora-body text-sm space-y-1">
                <li>• Áreas tratadas detalhadas</li>
                <li>• Objetivo do tratamento</li>
                <li>• Número de sessões planejadas</li>
                <li>• Intervalo entre sessões</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="aurora-heading-enhanced font-semibold flex items-center gap-2">
                <Star className="h-4 w-4" />
                Associações e Resultados
              </h4>
              <ul className="aurora-body text-sm space-y-1">
                <li>• Terapias complementares</li>
                <li>• Cosmetologia associada</li>
                <li>• Observações da evolução</li>
                <li>• Documentação fotográfica</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dicas Profissionais */}
      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardHeader>
          <CardTitle className="aurora-heading flex items-center gap-3">
            <Target className="h-6 w-6 text-aurora-electric-purple" />
            Dicas para Documentação Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="aurora-heading-enhanced font-semibold">Fotografia Padronizada</h4>
              <ul className="aurora-body text-sm space-y-1">
                <li>• Mesma iluminação e posição</li>
                <li>• Ângulos consistentes</li>
                <li>• Fundo neutro e limpo</li>
                <li>• Alta resolução</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="aurora-heading-enhanced font-semibold">Parâmetros Precisos</h4>
              <ul className="aurora-body text-sm space-y-1">
                <li>• Registre todos os parâmetros</li>
                <li>• Documente ajustes realizados</li>
                <li>• Anote reações do paciente</li>
                <li>• Acompanhe a evolução</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="aurora-heading-enhanced font-semibold">Resultados e Análise</h4>
              <ul className="aurora-body text-sm space-y-1">
                <li>• Compare resultados objetivamente</li>
                <li>• Use o montador para apresentações</li>
                <li>• Compartilhe casos de sucesso</li>
                <li>• Crie portfólio profissional</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </AuroraPageLayout>
  );
};

export default BeforeAfterPage;
