import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEquipmentById } from '@/api/equipment';
import { EquipmentDetailsLoading } from '@/components/equipment-details/EquipmentDetailsLoading';
import { EquipmentDetailsError } from '@/components/equipment-details/EquipmentDetailsError';
import { EquipmentDetailsHeader } from '@/components/equipment-details/EquipmentDetailsHeader';
import EquipmentPhotosTab from '@/components/equipment-photos/EquipmentPhotosTab';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Target, Award, Lightbulb, Images, Info, Video, FileText, Palette, MessageCircle } from "lucide-react";
import { EquipmentVideosTab } from '@/components/equipment/tabs/EquipmentVideosTab';
import { EquipmentArticlesTab } from '@/components/equipment/tabs/EquipmentArticlesTab';
import { EquipmentArtsTab } from '@/components/equipment/tabs/EquipmentArtsTab';

const EquipmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  
  const { data: equipment, isLoading, error } = useQuery({
    queryKey: ['equipment', id],
    queryFn: () => getEquipmentById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <EquipmentDetailsLoading />;
  }

  if (error || !equipment) {
    return <EquipmentDetailsError error="Equipamento não encontrado" />;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <EquipmentDetailsHeader equipment={equipment} />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 aurora-glass">
              <TabsTrigger 
                value="details"
                className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
              >
                <Info className="h-4 w-4" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger 
                value="articles"
                className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
              >
                <FileText className="h-4 w-4" />
                Artigos
              </TabsTrigger>
              <TabsTrigger 
                value="videos"
                className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
              >
                <Video className="h-4 w-4" />
                Vídeos
              </TabsTrigger>
              <TabsTrigger 
                value="photos"
                className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
              >
                <Images className="h-4 w-4" />
                Fotos
              </TabsTrigger>
              <TabsTrigger 
                value="arts"
                className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
              >
                <Palette className="h-4 w-4" />
                Artes
              </TabsTrigger>
              <TabsTrigger 
                value="chat"
                className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
              >
                <MessageCircle className="h-4 w-4" />
                Chat IA
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              {/* Overview Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Wrench className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>{equipment.nome}</CardTitle>
                        <CardDescription>Tecnologia: {equipment.tecnologia}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {equipment.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      {equipment.image_url && (
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                          <img 
                            src={equipment.image_url} 
                            alt={equipment.nome}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Informações Gerais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Linguagem:</span>
                        <p className="text-muted-foreground">{equipment.linguagem}</p>
                      </div>
                      <div>
                        <span className="font-medium">Data de Cadastro:</span>
                        <p className="text-muted-foreground">
                          {new Date(equipment.data_cadastro).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Indicações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {equipment.indicacoes}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Benefícios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {equipment.beneficios}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Diferenciais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {equipment.diferenciais}
                    </p>
                  </CardContent>
                </Card>

                {equipment.efeito && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Efeito</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {equipment.efeito}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="articles" className="space-y-6">
              <EquipmentArticlesTab equipmentId={id!} equipmentName={equipment.nome} />
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <EquipmentVideosTab equipmentId={id!} equipmentName={equipment.nome} />
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <EquipmentPhotosTab equipmentId={id!} />
            </TabsContent>

            <TabsContent value="arts" className="space-y-6">
              <EquipmentArtsTab equipmentId={id!} equipmentName={equipment.nome} />
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="h-6 w-6 text-aurora-electric-purple" />
                  <div>
                    <h2 className="aurora-heading text-xl text-white">Chat Inteligente do {equipment.nome}</h2>
                    <p className="aurora-body text-white/70">Converse com a IA sobre este equipamento usando todos os documentos e artigos relacionados</p>
                  </div>
                </div>
                
                <div className="bg-aurora-electric-purple/10 rounded-xl p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-aurora-electric-purple mx-auto mb-4" />
                  <h3 className="aurora-heading text-lg text-white mb-2">Chat em Desenvolvimento</h3>
                  <p className="aurora-body text-white/70 mb-4">
                    Esta funcionalidade irá integrar todos os artigos científicos, documentos técnicos e informações 
                    do {equipment.nome} com inteligência artificial para responder suas perguntas.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-aurora-electric-purple">
                    <span>Em breve disponível</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default EquipmentDetailsPage;
