import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Wrench, Camera } from "lucide-react";
import { useEquipments } from '@/hooks/useEquipments';
import { useNavigate } from 'react-router-dom';

const EquipmentsPage: React.FC = () => {
  const { equipments, loading, error } = useEquipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log('All equipments:', equipments);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  // Filtrar equipamentos ativos
  const activeEquipments = equipments.filter(eq => eq.ativo);
  console.log('Active equipments:', activeEquipments);

  // Aplicar filtros de busca e categoria
  const filteredEquipments = activeEquipments.filter(equipment => {
    const matchesSearch = equipment.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.tecnologia.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || equipment.tecnologia.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  // Extrair categorias únicas
  const categories = [...new Set(activeEquipments.map(eq => eq.tecnologia))];

  const handleEquipmentClick = (equipmentId: string) => {
    navigate(`/equipment/${equipmentId}`);
  };

  // Função para extrair palavras-chave das indicações
  const getKeywords = (indicacoes: string | string[]) => {
    if (Array.isArray(indicacoes)) {
      return indicacoes;
    }
    if (typeof indicacoes === 'string') {
      // Dividir por vírgulas, pontos-e-vírgulas ou quebras de linha
      return indicacoes.split(/[,;\n]/).map(item => item.trim()).filter(Boolean);
    }
    return [];
  };

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Wrench className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-red-600">Erro ao carregar equipamentos</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Equipamentos Disponíveis</h1>
            <p className="text-muted-foreground">
              Explore nossa linha completa de equipamentos estéticos
            </p>
            {equipments.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {equipments.length} equipamentos cadastrados no total
              </p>
            )}
          </div>

          {/* Filtros */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Pesquisar equipamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todos
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando equipamentos do banco de dados...</p>
            </div>
          )}

          {/* Grid de Equipamentos */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipments.map((equipment) => {
                const keywords = getKeywords(equipment.indicacoes);
                
                return (
                  <Card 
                    key={equipment.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                    onClick={() => handleEquipmentClick(equipment.id)}
                  >
                    <div className="flex">
                      {/* Foto do equipamento - lateral esquerda */}
                      <div className="w-32 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                        {equipment.image_url ? (
                          <img 
                            src={equipment.image_url} 
                            alt={equipment.nome}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Conteúdo do lado direito */}
                      <div className="flex-1 flex flex-col">
                        <CardHeader className="pb-2">
                          {/* Título primeiro */}
                          <CardTitle className="text-lg mb-1">
                            {equipment.nome}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Tecnologia: {equipment.tecnologia}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-0 flex-1">
                          <div className="space-y-3">
                            {/* Palavras-chave das indicações - separadas */}
                            {keywords.length > 0 && (
                              <div>
                                <h4 className="font-medium text-xs text-muted-foreground mb-1">Indicações</h4>
                                <div className="flex flex-wrap gap-1">
                                  {keywords.slice(0, 4).map((keyword, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                  {keywords.length > 4 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{keywords.length - 4} mais
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Benefícios resumidos */}
                            <div>
                              <h4 className="font-medium text-xs text-muted-foreground mb-1">Benefícios</h4>
                              <p className="text-xs line-clamp-2">{equipment.beneficios}</p>
                            </div>
                            
                            <div className="pt-1">
                              <Button variant="outline" size="sm" className="w-full text-xs">
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Sem resultados */}
          {!loading && filteredEquipments.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {equipments.length === 0 ? 'Nenhum equipamento cadastrado' : 'Nenhum equipamento encontrado'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory 
                  ? "Tente ajustar os filtros de busca" 
                  : equipments.length === 0 
                    ? "Cadastre equipamentos na área administrativa"
                    : "Nenhum equipamento encontrado"}
              </p>
              {equipments.length === 0 && (
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/admin/equipments')}
                >
                  Ir para Administração
                </Button>
              )}
            </div>
          )}

          {/* Estatísticas */}
          {!loading && filteredEquipments.length > 0 && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Mostrando {filteredEquipments.length} de {activeEquipments.length} equipamentos ativos
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EquipmentsPage;
