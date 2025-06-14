
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  RefreshCw, 
  Image as ImageIcon,
  Users,
  Lock
} from "lucide-react";
import { BeforeAfterPhoto } from '@/types/before-after';
import { beforeAfterService } from '@/services/beforeAfterService';
import BeforeAfterCard from './BeforeAfterCard';
import { toast } from 'sonner';

const BeforeAfterGallery: React.FC = () => {
  const [userPhotos, setUserPhotos] = useState<BeforeAfterPhoto[]>([]);
  const [publicPhotos, setPublicPhotos] = useState<BeforeAfterPhoto[]>([]);
  const [filteredUserPhotos, setFilteredUserPhotos] = useState<BeforeAfterPhoto[]>([]);
  const [filteredPublicPhotos, setFilteredPublicPhotos] = useState<BeforeAfterPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [userPhotos, publicPhotos, searchQuery, equipmentFilter]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando galeria de fotos...');

      const [userResult, publicResult] = await Promise.all([
        beforeAfterService.getUserPhotos(),
        beforeAfterService.getPublicPhotos()
      ]);

      setUserPhotos(userResult);
      setPublicPhotos(publicResult);
      console.log('📊 Fotos carregadas - Minhas:', userResult.length, 'Públicas:', publicResult.length);
    } catch (error) {
      console.error('❌ Erro ao carregar fotos:', error);
      toast.error('Erro ao carregar fotos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filterPhotos = (photos: BeforeAfterPhoto[]) => {
      return photos.filter(photo => {
        const matchesSearch = searchQuery === '' || 
          photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          photo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          photo.equipment_used.some(eq => eq.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesEquipment = equipmentFilter === 'all' || 
          photo.equipment_used.some(eq => eq.toLowerCase().includes(equipmentFilter.toLowerCase()));

        return matchesSearch && matchesEquipment;
      });
    };

    setFilteredUserPhotos(filterPhotos(userPhotos));
    setFilteredPublicPhotos(filterPhotos(publicPhotos));
  };

  const getUniqueEquipments = () => {
    const allEquipments = [
      ...userPhotos.flatMap(photo => photo.equipment_used),
      ...publicPhotos.flatMap(photo => photo.equipment_used)
    ];
    return [...new Set(allEquipments)].filter(Boolean);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-aurora-electric-purple mx-auto" />
          <p className="mt-2 text-white">Carregando galeria...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-white flex items-center gap-3">
              <ImageIcon className="h-6 w-6 text-aurora-electric-purple" />
              📸 Galeria Antes & Depois
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadPhotos}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, descrição ou equipamento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                />
              </div>
            </div>
            
            <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-800/50 border-aurora-electric-purple/30 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por equipamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os equipamentos</SelectItem>
                {getUniqueEquipments().map((equipment) => (
                  <SelectItem key={equipment} value={equipment}>
                    {equipment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="my-photos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="my-photos" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Minhas Fotos ({filteredUserPhotos.length})
          </TabsTrigger>
          <TabsTrigger value="public-photos" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Fotos Públicas ({filteredPublicPhotos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-photos" className="mt-6">
          {filteredUserPhotos.length === 0 ? (
            <Card className="aurora-glass border-aurora-electric-purple/20">
              <CardContent className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {userPhotos.length === 0 ? 'Nenhuma foto encontrada' : 'Nenhuma foto corresponde aos filtros'}
                </h3>
                <p className="text-gray-400">
                  {userPhotos.length === 0 
                    ? 'Faça upload das suas primeiras fotos antes e depois!'
                    : 'Tente ajustar os filtros para ver mais resultados.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredUserPhotos.map((photo) => (
                <BeforeAfterCard
                  key={photo.id}
                  photo={photo}
                  onUpdate={loadPhotos}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public-photos" className="mt-6">
          {filteredPublicPhotos.length === 0 ? (
            <Card className="aurora-glass border-aurora-electric-purple/20">
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Nenhuma foto pública encontrada
                </h3>
                <p className="text-gray-400">
                  Não há fotos públicas que correspondam aos filtros selecionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredPublicPhotos.map((photo) => (
                <BeforeAfterCard
                  key={photo.id}
                  photo={photo}
                  showOwner={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default BeforeAfterGallery;
