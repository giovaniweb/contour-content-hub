import React, { useState } from "react";
import Layout from "@/components/Layout";
import EquipmentViewer from "@/components/admin/EquipmentViewer";
import EquipmentCreateForm from "@/components/admin/EquipmentCreateForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DatabaseZap, FileSearch, ShieldCheck, Plus } from "lucide-react";
import { Equipment } from "@/types/equipment";

const EquipmentDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState("viewer");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEquipmentCreated = (equipment: Equipment) => {
    setShowCreateForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout title="Detalhes dos Equipamentos">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Análise de Equipamentos</h2>
          <p className="text-muted-foreground">
            Visualize e analise os dados dos equipamentos cadastrados no sistema
          </p>
        </div>
        
        {!showCreateForm && (
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Equipamento
          </Button>
        )}
      </div>

      <Alert className="mb-6">
        <FileSearch className="h-4 w-4" />
        <AlertTitle>Verificação de Dados dos Equipamentos</AlertTitle>
        <AlertDescription>
          Esta página permite verificar como os dados dos equipamentos estão estruturados
          no banco de dados. É importante garantir que esses dados estejam completos e precisos
          para evitar que a IA "alucine" ou misture conceitos ao gerar conteúdo.
        </AlertDescription>
      </Alert>

      {showCreateForm ? (
        <div className="mb-6">
          <EquipmentCreateForm 
            onSuccess={handleEquipmentCreated} 
            onCancel={() => setShowCreateForm(false)} 
          />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="viewer">Visualizador de Equipamentos</TabsTrigger>
            <TabsTrigger value="analysis">Análise e Recomendações</TabsTrigger>
          </TabsList>

          <TabsContent value="viewer" className="space-y-6">
            <EquipmentViewer key={refreshTrigger} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Prevenção de "Alucinações" da IA
                </CardTitle>
                <CardDescription>
                  Recomendações para garantir que a IA gere conteúdo preciso baseado nos dados dos equipamentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Estrutura Ideal de Dados</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Tecnologia:</strong> Descreva precisamente o tipo de tecnologia sem mencionar resultados.
                      <p className="text-sm text-muted-foreground mt-1">
                        ✅ "Ultrassom microfocado de alta intensidade (HIFU) com pontos térmicos de 65-70°C"
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ❌ "Tecnologia avançada que remove rugas e deixa a pele mais jovem"
                      </p>
                    </li>
                    <li>
                      <strong>Indicações:</strong> Liste problemas específicos tratados pelo equipamento.
                      <p className="text-sm text-muted-foreground mt-1">
                        ✅ "Rugas profundas, flacidez facial moderada a severa, papada, linha da mandíbula indefinida"
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ❌ "Tratamentos faciais"
                      </p>
                    </li>
                    <li>
                      <strong>Benefícios:</strong> Resultados concretos e específicos do tratamento.
                      <p className="text-sm text-muted-foreground mt-1">
                        ✅ "Estímulo da produção natural de colágeno, reestruturação das camadas profundas da pele"
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ❌ "Melhor equipamento do mercado com resultados incríveis"
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Instruções para Prompt da IA</h3>
                  <p className="text-gray-700 mb-3">
                    Para evitar que a IA "alucine" ou misture conceitos, as seguintes instruções já foram adicionadas ao prompt:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">Diretrizes de segurança para o modelo:</p>
                    <ul className="list-disc pl-6 mt-2">
                      <li>Utilizar APENAS informações contidas nos dados do equipamento fornecidos.</li>
                      <li>NUNCA inventar benefícios, indicações ou características que não estão explicitamente listadas.</li>
                      <li>Manter clara separação entre o que é a tecnologia, o que são indicações e o que são benefícios.</li>
                      <li>Respeitar estritamente a linguagem recomendada no cadastro do equipamento.</li>
                      <li>Verificar se há consistência entre o roteiro gerado e os dados do equipamento.</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Verificações Recomendadas</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Certifique-se de que cada campo do equipamento contém apenas as informações relevantes àquela categoria.</li>
                    <li>Evite repetir informações entre os campos de Tecnologia, Indicações, Benefícios e Diferenciais.</li>
                    <li>Use termos técnicos precisos e evite linguagem excessivamente promocional nos dados do equipamento.</li>
                    <li>Mantenha o campo "Linguagem Recomendada" focado no tom e estilo, não no conteúdo específico.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DatabaseZap className="h-5 w-5 mr-2" />
                  Integridade de Dados
                </CardTitle>
                <CardDescription>
                  Verificação da qualidade dos dados dos equipamentos no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    A página de visualização permite identificar possíveis problemas nos dados dos equipamentos, como:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Campos incompletos ou com informações inadequadas</li>
                    <li>Mistura de conceitos entre tecnologia e resultados</li>
                    <li>Indicações muito genéricas ou pouco específicas</li>
                    <li>Linguagem promocional em vez de técnica nos campos de tecnologia</li>
                  </ul>
                  <p className="mt-4">
                    Recomendamos revisar regularmente os dados dos equipamentos para garantir a qualidade e precisão
                    das informações utilizadas pela IA na geração de conteúdo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </Layout>
  );
};

export default EquipmentDetails;
