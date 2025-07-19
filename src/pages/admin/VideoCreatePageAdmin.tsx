import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentLayout from '@/components/layout/ContentLayout';
import GlassContainer from '@/components/ui/GlassContainer';
import VideoUploader from '@/components/video-storage/VideoUploader';
import BatchVideoUploader from '@/components/video-storage/BatchVideoUploader';
import { ROUTES } from '@/routes';

const VideoCreatePageAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('individual');

  const handleUploadComplete = () => {
    navigate(ROUTES.ADMIN_VIDEOS.ROOT);
  };

  return (
    <ContentLayout
      title="Sistema de Upload de Vídeos - Administrador"
      subtitle="Gerencie uploads individuais ou em lote com geração automática de thumbnails"
      actions={
        <Button 
          variant="outline" 
          onClick={() => navigate(ROUTES.ADMIN_VIDEOS.ROOT)}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Vídeos
        </Button>
      }
    >
      <GlassContainer className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Individual
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Upload em Lote
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Upload Individual Avançado</h3>
                <p className="text-muted-foreground">
                  Sistema completo com geração automática de thumbnails, extração de metadados e formatação inteligente de títulos
                </p>
              </div>
              <VideoUploader />
            </div>
          </TabsContent>
          
          <TabsContent value="batch" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Upload em Lote</h3>
                <p className="text-muted-foreground">
                  Envie múltiplos vídeos simultaneamente com processamento otimizado
                </p>
              </div>
              <BatchVideoUploader 
                onUploadComplete={handleUploadComplete}
                onCancel={() => navigate(ROUTES.ADMIN_VIDEOS.ROOT)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </GlassContainer>
      
      <GlassContainer className="mt-8 max-w-6xl mx-auto p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Funcionalidades do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-green-600">✅ Recursos Implementados</h4>
            <ul className="space-y-2 text-sm">
              <li>• 🖼️ Geração automática de thumbnails</li>
              <li>• 📊 Extração de metadados (duração, resolução)</li>
              <li>• 🏷️ Formatação inteligente de títulos</li>
              <li>• 🗂️ Organização por equipamentos</li>
              <li>• 🔄 Upload com progress tracking</li>
              <li>• 🛡️ Validação completa de arquivos</li>
              <li>• 🔧 Sistema de cleanup em caso de erro</li>
              <li>• 📦 Upload em lote otimizado</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-blue-600">📝 Padrão de Nomenclatura</h4>
            <div className="text-sm space-y-2">
              <p><strong>Entrada:</strong> aplicação_abdominal_cryorfmax_do_unyquepro-_1 (2160p)-2</p>
              <p><strong>Saída:</strong> Aplicação abdominal Cryo Rf Max do Unyque Pro Cod:ABC123</p>
              <hr className="my-2" />
              <p className="text-muted-foreground">
                O sistema automaticamente:
                <br />• Remove informações de resolução
                <br />• Substitui underscores por espaços
                <br />• Capitaliza palavras corretamente
                <br />• Adiciona código único
              </p>
            </div>
          </div>
        </div>
      </GlassContainer>
    </ContentLayout>
  );
};

export default VideoCreatePageAdmin;