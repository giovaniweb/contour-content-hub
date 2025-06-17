
import React, { useState } from 'react';
import { Image, Upload, Grid, Search, Camera, Filter, Users, Lock } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeforeAfterManager from '@/components/before-after/BeforeAfterManager';

const PhotosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('gallery');

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Image className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Galeria de Fotos</h1>
            <p className="text-slate-400">Gerencie e organize suas fotos antes/depois</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar fotos..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Capturar Foto
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Enviar Fotos
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Galeria Antes/Depois
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Novo Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Image className="h-5 w-5" />
                Suas Transformações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BeforeAfterManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Novo Upload Antes/Depois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BeforeAfterManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips Section */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="h-5 w-5" />
            💡 Dicas para Melhores Resultados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-primary font-semibold">📷 Fotografia</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Use a mesma iluminação nas fotos antes/depois</li>
                <li>• Mantenha o mesmo ângulo e posição</li>
                <li>• Evite sombras e reflexos</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-primary font-semibold">🎯 Documentação</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Documente datas dos procedimentos</li>
                <li>• Adicione descrição dos equipamentos usados</li>
                <li>• Compartilhe resultados para inspirar outros</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotosPage;
