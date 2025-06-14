
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Image as ImageIcon, 
  Upload,
  Images,
  TrendingUp,
  Star,
  Award
} from "lucide-react";
import BeforeAfterManager from '@/components/before-after/BeforeAfterManager';

const BeforeAfterPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Camera className="h-8 w-8 text-purple-500" />
            📸 Galeria Antes & Depois
          </h1>
          <p className="text-gray-400 mt-2">
            Documente e compartilhe os resultados dos seus tratamentos estéticos
          </p>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/20">
                <ImageIcon className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total de Fotos</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Resultados</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <Images className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Públicas</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-500/20">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avaliações</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com conteúdo */}
      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Images className="h-4 w-4" />
            Galeria
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Images className="h-5 w-5" />
                Suas Transformações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BeforeAfterManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Novo Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BeforeAfterManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dicas e Informações */}
      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5" />
            💡 Dicas para Melhores Resultados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-aurora-electric-purple font-semibold">📷 Fotografia</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use a mesma iluminação nas fotos antes/depois</li>
                <li>• Mantenha o mesmo ângulo e posição</li>
                <li>• Evite sombras e reflexos</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-aurora-electric-purple font-semibold">🎯 Documentação</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Documente datas dos procedimentos</li>
                <li>• Adicione descrição dos equipamentos usados</li>
                <li>• Compartilhe resultados para inspirar outros</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BeforeAfterPage;
