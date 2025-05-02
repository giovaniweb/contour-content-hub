
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getEquipments } from '@/utils/api-equipment';
import { Equipment } from '@/types/equipment';
import { Shield, ShieldCheck } from 'lucide-react';

const EquipmentViewer: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEquipments() {
      try {
        setLoading(true);
        const data = await getEquipments();
        setEquipments(data);
        if (data.length > 0) {
          setSelectedEquipment(data[0]);
        }
      } catch (err) {
        console.error('Erro ao buscar equipamentos:', err);
        setError('Não foi possível carregar os equipamentos. Verifique o console para mais detalhes.');
      } finally {
        setLoading(false);
      }
    }

    fetchEquipments();
  }, []);

  const handleSelectEquipment = (eq: Equipment) => {
    setSelectedEquipment(eq);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando equipamentos...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erro ao carregar equipamentos</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {equipments.length === 0 ? (
                <p className="text-muted-foreground">Nenhum equipamento cadastrado.</p>
              ) : (
                equipments.map((eq) => (
                  <div 
                    key={eq.id}
                    onClick={() => handleSelectEquipment(eq)}
                    className={`p-3 rounded-md cursor-pointer flex items-center justify-between 
                      ${selectedEquipment?.id === eq.id 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'hover:bg-accent'
                      }`}
                  >
                    <span className="font-medium">{eq.nome}</span>
                    {eq.ativo ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Ativo</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Inativo</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {selectedEquipment ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedEquipment.nome}</span>
                {selectedEquipment.ativo ? (
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Ativo
                  </span>
                ) : (
                  <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Inativo
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="completo" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="completo">Dados Completos</TabsTrigger>
                  <TabsTrigger value="prompt">Prompt Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="completo">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Tecnologia</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedEquipment.tecnologia}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Indicações</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedEquipment.indicacoes}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Benefícios</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedEquipment.beneficios}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Diferenciais</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedEquipment.diferenciais}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Linguagem Recomendada</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedEquipment.linguagem}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="prompt">
                  <div className="space-y-4">
                    <Alert>
                      <AlertTitle>Preview do formato enviado para IA</AlertTitle>
                      <AlertDescription>
                        Este é o formato dos dados enviados para o modelo GPT.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[500px] font-mono text-sm whitespace-pre-wrap">
{`Dados do equipamento selecionado:
Nome: ${selectedEquipment.nome}
Tecnologia: ${selectedEquipment.tecnologia}
Indicações: ${selectedEquipment.indicacoes}
Benefícios: ${selectedEquipment.beneficios}
Diferenciais: ${selectedEquipment.diferenciais}
Linguagem recomendada: ${selectedEquipment.linguagem}

Dados do prompt indicados ao modelo:
Instruções: "Use APENAS informações fornecidas acima. NÃO invente benefícios, tecnologias ou indicações que não estejam explicitamente listados nos dados do equipamento."
`}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">
                Selecione um equipamento para visualizar seus detalhes.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EquipmentViewer;
