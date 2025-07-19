import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image, Download, Calendar, FileImage } from 'lucide-react';
import { EquipmentMaterial } from '@/hooks/useEquipmentContent';

interface EquipmentMaterialsProps {
  materials: EquipmentMaterial[];
  loading: boolean;
}

export const EquipmentMaterials: React.FC<EquipmentMaterialsProps> = ({ materials, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="aurora-glass border-aurora-neon-blue/30 animate-pulse">
            <CardContent className="p-4">
              <div className="aspect-square bg-white/20 rounded mb-3"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <Card className="aurora-glass border-aurora-neon-blue/30 aurora-glow">
        <CardContent className="p-8 text-center">
          <Image className="h-12 w-12 text-white/60 mx-auto mb-4" />
          <h3 className="aurora-heading text-xl text-white mb-2">Nenhuma arte encontrada</h3>
          <p className="aurora-body text-white/70">
            Ainda não há materiais artísticos cadastrados para este equipamento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => (
        <Card key={material.id} className="aurora-glass border-aurora-neon-blue/30 aurora-glow hover:border-aurora-neon-blue/50 transition-colors">
          <CardContent className="p-4">
            {/* Material Preview */}
            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-black/20">
              {material.preview_url ? (
                <img 
                  src={material.preview_url} 
                  alt={material.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileImage className="h-12 w-12 text-white/40" />
                </div>
              )}
              
              {material.arquivo_url && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    className="aurora-button aurora-glow hover:aurora-glow-intense"
                    onClick={() => window.open(material.arquivo_url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              )}
            </div>

            {/* Material Info */}
            <div>
              <h3 className="aurora-heading text-lg text-white mb-2 line-clamp-2">
                {material.nome}
              </h3>

              <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                <Calendar className="h-4 w-4" />
                {new Date(material.data_upload).toLocaleDateString('pt-BR')}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-2">
                  {material.categoria && (
                    <Badge 
                      variant="outline" 
                      className="border-aurora-neon-blue/30 text-aurora-neon-blue bg-aurora-neon-blue/10 text-xs"
                    >
                      {material.categoria}
                    </Badge>
                  )}
                  
                  {material.tipo && (
                    <Badge 
                      variant="outline" 
                      className="border-aurora-neon-blue/20 text-aurora-neon-blue bg-aurora-neon-blue/5 text-xs"
                    >
                      {material.tipo}
                    </Badge>
                  )}
                </div>

                {material.tags && material.tags.length > 0 && (
                  <div className="flex gap-1">
                    {material.tags.slice(0, 2).map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="border-aurora-neon-blue/20 text-aurora-neon-blue bg-aurora-neon-blue/5 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {material.tags.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="border-aurora-neon-blue/20 text-aurora-neon-blue bg-aurora-neon-blue/5 text-xs"
                      >
                        +{material.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};