import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Star, Zap, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useEquipmentDetailsState } from '@/hooks/useEquipmentDetailsState';
import { useEquipmentContent } from '@/hooks/useEquipmentContent';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import { EquipmentDetailsError } from '@/components/equipment-details/EquipmentDetailsError';
import { EquipmentDetailsLoading } from '@/components/equipment-details/EquipmentDetailsLoading';
import { EquipmentDetailsTabsList } from '@/components/equipment-details/EquipmentDetailsTabs';
import { EquipmentDocuments } from '@/components/equipment-details/EquipmentDocuments';
import { EquipmentVideos } from '@/components/equipment-details/EquipmentVideos';
import { EquipmentMaterials } from '@/components/equipment-details/EquipmentMaterials';

const EquipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const { equipment, loading, error } = useEquipmentDetailsState(id);
  
  // Hook para buscar conteúdo relacionado ao equipamento
  const { 
    documents, 
    videos, 
    materials, 
    loading: contentLoading 
  } = useEquipmentContent(id || '', equipment?.nome || '');

  if (loading) {
    return <EquipmentDetailsLoading />;
  }

  if (error) {
    return <EquipmentDetailsError error={error} />;
  }

  if (!equipment) {
    return (
      <AuroraPageLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 text-aurora-electric-purple mx-auto mb-4 opacity-50" />
              <h3 className="aurora-heading text-xl text-white mb-2">Equipamento não encontrado</h3>
              <p className="aurora-body text-white/70 mb-6">O equipamento que você está procurando não existe ou foi removido.</p>
              <Button 
                onClick={() => navigate('/equipments')}
                className="aurora-button aurora-glow hover:aurora-glow-intense"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Equipamentos
              </Button>
            </div>
          </div>
        </div>
      </AuroraPageLayout>
    );
  }

  const benefits = equipment.beneficios ? equipment.beneficios.split('\n').filter(b => b.trim()) : [];
  const indications = typeof equipment.indicacoes === 'string' 
    ? equipment.indicacoes.split('\n').filter(i => i.trim())
    : Array.isArray(equipment.indicacoes) ? equipment.indicacoes : [];

  return (
    <AuroraPageLayout>
      {/* Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-aurora-electric-purple/20 rounded-full blur-3xl animate-aurora-float"></div>
        <div className="absolute -top-1/4 -right-1/4 w-80 h-80 bg-aurora-neon-blue/20 rounded-full blur-3xl animate-aurora-pulse delay-700"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-72 h-72 bg-aurora-emerald/20 rounded-full blur-3xl animate-aurora-wave delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/equipments')}
            className="mb-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Equipamentos
          </Button>
          
          <div className="flex items-start gap-6">
            {(equipment.thumbnail_url || equipment.image_url) && (
              <div className="relative">
                <img 
                  src={equipment.thumbnail_url || equipment.image_url} 
                  alt={equipment.nome}
                  className="w-32 h-32 object-cover rounded-2xl border border-aurora-electric-purple/30 aurora-glow"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-aurora-electric-purple/10 to-aurora-neon-blue/10"></div>
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="aurora-heading text-3xl font-bold text-white">{equipment.nome}</h1>
                <Badge 
                  className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30 aurora-glow-emerald"
                >
                  {equipment.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              
              <p className="aurora-body text-white/80 text-lg mb-4">{equipment.tecnologia}</p>
              
              <div className="flex items-center gap-4">
                <Badge 
                  variant="outline" 
                  className="border-aurora-electric-purple/30 text-aurora-electric-purple bg-aurora-electric-purple/10"
                >
                  {equipment.categoria === 'estetico' ? '🌟 Estético' : '🏥 Médico'}
                </Badge>
                
                {equipment.nivel_investimento && (
                  <Badge 
                    variant="outline" 
                    className="border-aurora-neon-blue/30 text-aurora-neon-blue bg-aurora-neon-blue/10"
                  >
                    💰 {equipment.nivel_investimento}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <EquipmentDetailsTabsList activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Information */}
              <div className="space-y-6">
                {/* Technology */}
                <Card className="aurora-glass border-aurora-electric-purple/30 aurora-glow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="h-5 w-5 text-aurora-electric-purple" />
                      <h3 className="aurora-heading text-xl text-white">Tecnologia</h3>
                    </div>
                    <p className="aurora-body text-white/80">{equipment.tecnologia}</p>
                    {equipment.efeito && (
                      <div className="mt-4 p-3 rounded-xl bg-aurora-electric-purple/10 border border-aurora-electric-purple/20">
                        <p className="aurora-body text-aurora-electric-purple font-medium">
                          <strong>Efeito:</strong> {equipment.efeito}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Benefits */}
                {benefits.length > 0 && (
                  <Card className="aurora-glass border-aurora-emerald/30 aurora-glow-emerald">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Star className="h-5 w-5 text-aurora-emerald" />
                        <h3 className="aurora-heading text-xl text-white">Benefícios</h3>
                      </div>
                      <ul className="space-y-2">
                        {benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 aurora-body text-white/80">
                            <CheckCircle className="h-4 w-4 text-aurora-emerald mt-0.5 flex-shrink-0" />
                            <span>{benefit.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Differentials */}
                {equipment.diferenciais && (
                  <Card className="aurora-glass border-aurora-neon-blue/30 aurora-glow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="h-5 w-5 text-aurora-neon-blue" />
                        <h3 className="aurora-heading text-xl text-white">Diferenciais</h3>
                      </div>
                      <p className="aurora-body text-white/80 whitespace-pre-line">{equipment.diferenciais}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Indications and Applications */}
              <div className="space-y-6">
                {/* Indications */}
                {indications.length > 0 && (
                  <Card className="aurora-glass border-aurora-electric-purple/30 aurora-glow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="h-5 w-5 text-aurora-electric-purple" />
                        <h3 className="aurora-heading text-xl text-white">Indicações</h3>
                      </div>
                      <ul className="space-y-2">
                        {indications.map((indication, index) => (
                          <li key={index} className="flex items-start gap-2 aurora-body text-white/80">
                            <CheckCircle className="h-4 w-4 text-aurora-electric-purple mt-0.5 flex-shrink-0" />
                            <span>{indication.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Application Areas */}
                {equipment.area_aplicacao && equipment.area_aplicacao.length > 0 && (
                  <Card className="aurora-glass border-aurora-emerald/30 aurora-glow-emerald">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Wrench className="h-5 w-5 text-aurora-emerald" />
                        <h3 className="aurora-heading text-xl text-white">Áreas de Aplicação</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {equipment.area_aplicacao.map((area, index) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="border-aurora-emerald/30 text-aurora-emerald bg-aurora-emerald/10"
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ideal Patient Profile */}
                {equipment.perfil_ideal_paciente && equipment.perfil_ideal_paciente.length > 0 && (
                  <Card className="aurora-glass border-aurora-neon-blue/30 aurora-glow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="h-5 w-5 text-aurora-neon-blue" />
                        <h3 className="aurora-heading text-xl text-white">Perfil Ideal do Paciente</h3>
                      </div>
                      <ul className="space-y-2">
                        {equipment.perfil_ideal_paciente.map((perfil, index) => (
                          <li key={index} className="flex items-start gap-2 aurora-body text-white/80">
                            <CheckCircle className="h-4 w-4 text-aurora-neon-blue mt-0.5 flex-shrink-0" />
                            <span>{perfil}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Contraindications */}
                {equipment.contraindicacoes && equipment.contraindicacoes.length > 0 && (
                  <Card className="aurora-glass border-red-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="h-5 w-5 text-red-400" />
                        <h3 className="aurora-heading text-xl text-white">Contraindicações</h3>
                      </div>
                      <ul className="space-y-2">
                        {equipment.contraindicacoes.map((contraindicacao, index) => (
                          <li key={index} className="flex items-start gap-2 aurora-body text-red-400">
                            <span className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0">⚠️</span>
                            <span>{contraindicacao}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <EquipmentDocuments documents={documents} loading={contentLoading} />
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <EquipmentVideos videos={videos} loading={contentLoading} />
          </TabsContent>

          <TabsContent value="arts" className="mt-6">
            <EquipmentMaterials materials={materials} loading={contentLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </AuroraPageLayout>
  );
};

export default EquipmentDetails;