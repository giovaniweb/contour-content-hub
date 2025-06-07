
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEquipment } from '@/api/equipment';
import { EquipmentDetailsLoading } from '@/components/equipment-details/EquipmentDetailsLoading';
import { EquipmentDetailsError } from '@/components/equipment-details/EquipmentDetailsError';
import { EquipmentDetailsHeader } from '@/components/equipment-details/EquipmentDetailsHeader';
import { EquipmentDetailsTabsList } from '@/components/equipment-details/EquipmentDetailsTabs';
import Layout from '@/components/Layout';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Target, Award, Lightbulb } from "lucide-react";

const EquipmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: equipment, isLoading, error } = useQuery({
    queryKey: ['equipment', id],
    queryFn: () => getEquipment(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <EquipmentDetailsLoading />;
  }

  if (error || !equipment) {
    return <EquipmentDetailsError error="Equipamento não encontrado" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <EquipmentDetailsHeader equipment={equipment} />
          
          <Tabs defaultValue="details" className="w-full">
            <EquipmentDetailsTabsList activeTab="details" setActiveTab={() => {}} />
            
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
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default EquipmentDetailsPage;
