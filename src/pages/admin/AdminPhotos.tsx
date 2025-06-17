
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Image, Upload, Plus, Grid2x2, LayoutList, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";

const AdminPhotos: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Image className="h-8 w-8 text-pink-400" />
              Fotos e Imagens
            </h1>
            <p className="text-muted-foreground">
              Gerencie before/after, galeria de fotos e imagens da plataforma
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="default"
              size="lg"
              className="flex gap-2"
            >
              <Plus className="h-5 w-5" /> Nova Foto
            </Button>
            
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
              <ToggleGroupItem value="grid" aria-label="Ver em grid">
                <Grid2x2 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="Ver em lista">
                <LayoutList className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-muted" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar fotos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Placeholder Content */}
        <Card className="p-8">
          <CardContent className="text-center">
            <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Gerenciamento de Fotos</h3>
            <p className="text-muted-foreground mb-4">
              Este módulo está em desenvolvimento e estará disponível em breve.
            </p>
            <p className="text-sm text-muted-foreground">
              Funcionalidades incluirão: Upload de fotos before/after, galeria de imagens, 
              organização por categorias e integração com os equipamentos.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPhotos;
