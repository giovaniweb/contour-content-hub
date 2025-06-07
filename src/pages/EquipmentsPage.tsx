
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Wrench } from "lucide-react";
import { useEquipments } from '@/hooks/useEquipments';
import { useNavigate } from 'react-router-dom';

const EquipmentsPage: React.FC = () => {
  const { equipments, loading } = useEquipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filtrar equipamentos ativos
  const activeEquipments = equipments.filter(eq => eq.ativo);

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
              <p className="text-muted-foreground">Carregando equipamentos...</p>
            </div>
          )}

          {/* Grid de Equipamentos */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipments.map((equipment) => (
                <Card 
                  key={equipment.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleEquipmentClick(equipment.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Wrench className="h-8 w-8 text-primary" />
                      <Badge variant="outline">{equipment.tecnologia}</Badge>
                    </div>
                    <CardTitle className="text-xl">{equipment.nome}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Indicações</h4>
                        <p className="text-sm line-clamp-3">{equipment.indicacoes}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Benefícios</h4>
                        <p className="text-sm line-clamp-2">{equipment.beneficios}</p>
                      </div>
                      
                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Sem resultados */}
          {!loading && filteredEquipments.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum equipamento encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory 
                  ? "Tente ajustar os filtros de busca" 
                  : "Nenhum equipamento cadastrado ainda"}
              </p>
            </div>
          )}

          {/* Estatísticas */}
          {!loading && filteredEquipments.length > 0 && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Mostrando {filteredEquipments.length} de {activeEquipments.length} equipamentos
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EquipmentsPage;
