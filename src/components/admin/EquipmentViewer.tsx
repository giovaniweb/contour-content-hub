
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getEquipments } from '@/api/equipment';
import { Equipment } from '@/types/equipment';
import { Shield, ShieldCheck, RefreshCcw, Database, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EquipmentViewer: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Iniciando busca de equipamentos...");
      const data = await getEquipments();
      console.log(`Equipamentos carregados: ${data.length}`);
      setEquipments(data);
      if (data.length > 0) {
        setSelectedEquipment(data[0]);
      } else {
        setSelectedEquipment(null);
      }
      
      // Feedback para o usuário
      if (data.length > 0) {
        toast({
          title: "Equipamentos carregados",
          description: `${data.length} equipamentos encontrados.`
        });
      } else {
        toast({
          title: "Nenhum equipamento encontrado",
          description: "Cadastre equipamentos para começar."
        });
      }
      
    } catch (err) {
      console.error('Erro ao buscar equipamentos:', err);
      setError('Não foi possível carregar os equipamentos. Verifique o console para mais detalhes.');
      
      toast({
        variant: "destructive",
        title: "Erro ao carregar equipamentos",
        description: "Não foi possível conectar à API. Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleSelectEquipment = (eq: Equipment) => {
    setSelectedEquipment(eq);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Carregando equipamentos...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Erro ao carregar equipamentos</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{error}</p>
          <Button 
            onClick={fetchEquipments} 
            variant="outline"
            size="sm"
            className="self-start"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Equipamentos Cadastrados</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchEquipments}
              className="h-8 w-8 p-0"
              title="Atualizar lista"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {equipments.length === 0 ? (
              <div className="py-8 text-center">
                <Database className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum equipamento cadastrado.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Adicione equipamentos usando o botão "Novo Equipamento" acima.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {equipments.map((eq) => (
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
                ))}
              </div>
            )}
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
                  <TabsTrigger value="tabela">Visão Tabular</TabsTrigger>
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
                
                <TabsContent value="tabela">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">Campo</TableHead>
                          <TableHead>Conteúdo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Nome</TableCell>
                          <TableCell>{selectedEquipment.nome}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Tecnologia</TableCell>
                          <TableCell>{selectedEquipment.tecnologia}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Indicações</TableCell>
                          <TableCell>{selectedEquipment.indicacoes}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Benefícios</TableCell>
                          <TableCell>{selectedEquipment.beneficios}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Diferenciais</TableCell>
                          <TableCell>{selectedEquipment.diferenciais}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Linguagem</TableCell>
                          <TableCell>{selectedEquipment.linguagem}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Status</TableCell>
                          <TableCell>
                            {selectedEquipment.ativo ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Ativo
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                Inativo
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              {equipments.length === 0 ? (
                <div>
                  <Database className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Nenhum equipamento cadastrado ainda.
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-2 max-w-md mx-auto">
                    Para utilizar o gerador de conteúdo avançado, é necessário cadastrar pelo menos um equipamento.
                    Use o botão "Novo Equipamento" para adicionar seus equipamentos.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Selecione um equipamento para visualizar seus detalhes.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EquipmentViewer;
