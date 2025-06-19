
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import { useEquipmentDetails } from '@/hooks/useEquipmentDetails';

const EquipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { equipment, isLoading, error } = useEquipmentDetails(id);

  if (isLoading) {
    return (
      <AuroraPageLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-16 aurora-glass rounded-3xl border border-aurora-electric-purple/30">
            <div className="aurora-sphere-outer w-16 h-16 rounded-full mx-auto mb-6 relative">
              <div className="aurora-sphere-middle absolute inset-2 rounded-full">
                <div className="aurora-sphere-core absolute inset-2 rounded-full">
                  <div className="aurora-sphere-nucleus absolute inset-4 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
            <p className="aurora-body text-white/80 aurora-shimmer">Carregando equipamento...</p>
          </div>
        </div>
      </AuroraPageLayout>
    );
  }

  if (error || !equipment) {
    return (
      <AuroraPageLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-16 aurora-glass rounded-3xl border border-aurora-electric-purple/30">
            <Wrench className="h-16 w-16 text-red-400 mx-auto mb-4 opacity-50" />
            <h3 className="aurora-heading text-xl text-white mb-2">Equipamento não encontrado</h3>
            <p className="aurora-body text-white/60 mb-6">O equipamento solicitado não foi encontrado ou não existe.</p>
            <Button 
              onClick={() => navigate('/equipments')}
              className="aurora-button aurora-glow hover:aurora-glow-intense"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Equipamentos
            </Button>
          </div>
        </div>
      </AuroraPageLayout>
    );
  }

  return (
    <AuroraPageLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button 
            variant="outline"
            onClick={() => navigate('/equipments')}
            className="aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20 text-aurora-electric-purple hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Equipamentos
          </Button>
        </div>

        <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8 aurora-glow">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <Wrench className="h-12 w-12 text-aurora-electric-purple drop-shadow-lg" />
                  <div className="absolute inset-0 h-12 w-12 text-aurora-electric-purple animate-pulse blur-sm"></div>
                </div>
                <div>
                  <h1 className="aurora-heading text-4xl font-bold text-white">
                    {equipment.nome}
                  </h1>
                  <p className="aurora-body text-white/80">{equipment.tecnologia}</p>
                </div>
              </div>
            </div>

            {/* Equipment Image */}
            {(equipment.image_url || equipment.thumbnail_url) && (
              <div className="flex justify-center">
                <div className="relative max-w-md">
                  <img 
                    src={equipment.thumbnail_url || equipment.image_url} 
                    alt={equipment.nome}
                    className="w-full h-auto rounded-xl border border-aurora-electric-purple/30"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-aurora-electric-purple/10 to-aurora-neon-blue/10"></div>
                </div>
              </div>
            )}

            {/* Equipment Details */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Benefits */}
              {equipment.beneficios && (
                <div className="aurora-glass rounded-2xl p-6 border border-aurora-emerald/30">
                  <h3 className="aurora-heading text-xl font-semibold text-aurora-emerald mb-4">
                    Benefícios
                  </h3>
                  <p className="aurora-body text-white/80">{equipment.beneficios}</p>
                </div>
              )}

              {/* Differentials */}
              {equipment.diferenciais && (
                <div className="aurora-glass rounded-2xl p-6 border border-aurora-neon-blue/30">
                  <h3 className="aurora-heading text-xl font-semibold text-aurora-neon-blue mb-4">
                    Diferenciais
                  </h3>
                  <p className="aurora-body text-white/80">{equipment.diferenciais}</p>
                </div>
              )}

              {/* Indications */}
              {equipment.indicacoes && (
                <div className="aurora-glass rounded-2xl p-6 border border-aurora-electric-purple/30">
                  <h3 className="aurora-heading text-xl font-semibold text-aurora-electric-purple mb-4">
                    Indicações
                  </h3>
                  <p className="aurora-body text-white/80">{equipment.indicacoes}</p>
                </div>
              )}

              {/* Category */}
              <div className="aurora-glass rounded-2xl p-6 border border-aurora-lime/30">
                <h3 className="aurora-heading text-xl font-semibold text-aurora-lime mb-4">
                  Categoria
                </h3>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-gradient-to-r from-aurora-lime to-aurora-emerald text-white text-sm rounded-full font-medium">
                    {equipment.categoria === 'estetico' ? '🌟 Estético' : '🏥 Médico'}
                  </span>
                </div>
              </div>
            </div>

            {/* Language and Effects */}
            {(equipment.linguagem || equipment.efeito) && (
              <div className="grid md:grid-cols-2 gap-8">
                {equipment.linguagem && (
                  <div className="aurora-glass rounded-2xl p-6 border border-aurora-electric-purple/20">
                    <h3 className="aurora-heading text-lg font-semibold text-white mb-3">
                      Linguagem
                    </h3>
                    <p className="aurora-body text-white/80">{equipment.linguagem}</p>
                  </div>
                )}

                {equipment.efeito && (
                  <div className="aurora-glass rounded-2xl p-6 border border-aurora-electric-purple/20">
                    <h3 className="aurora-heading text-lg font-semibold text-white mb-3">
                      Efeito
                    </h3>
                    <p className="aurora-body text-white/80">{equipment.efeito}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default EquipmentDetails;
