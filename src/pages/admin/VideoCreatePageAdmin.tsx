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
      title="🎬 Sistema de Upload Aurora"
      subtitle="Plataforma avançada de upload com processamento inteligente e visual Aurora Boreal"
      actions={
        <Button 
          variant="outline" 
          onClick={() => navigate(ROUTES.ADMIN_VIDEOS.ROOT)}
          className="flex items-center bg-aurora-deep-purple/20 border-aurora-electric-purple/50 hover:bg-aurora-electric-purple/20 backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Vídeos
        </Button>
      }
    >
      {/* Main Upload Container */}
      <div className="aurora-glass-enhanced max-w-7xl mx-auto p-8 mb-8 animate-aurora-float">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue bg-clip-text text-transparent mb-4">
            Central de Upload Avançado
          </h2>
          <p className="text-aurora-lavender/80 text-lg">
            Sistema inteligente com geração automática de thumbnails e processamento em tempo real
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-aurora-deep-purple/30 border border-aurora-electric-purple/30 backdrop-blur-md">
            <TabsTrigger 
              value="individual" 
              className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/40 data-[state=active]:text-white transition-all duration-300"
            >
              <Upload className="h-5 w-5" />
              Upload Individual
            </TabsTrigger>
            <TabsTrigger 
              value="batch" 
              className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/40 data-[state=active]:text-white transition-all duration-300"
            >
              <Users className="h-5 w-5" />
              Upload em Lote
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="mt-8">
            <div className="space-y-6">
              <div className="text-center aurora-glass-enhanced p-6 animate-aurora-pulse">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-aurora-electric-purple to-aurora-neon-blue rounded-full mb-4 animate-aurora-glow">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-aurora-lavender">Upload Individual Avançado</h3>
                <p className="text-aurora-lavender/70">
                  Sistema completo com IA para thumbnails, extração de metadados e formatação inteligente
                </p>
              </div>
              <VideoUploader />
            </div>
          </TabsContent>
          
          <TabsContent value="batch" className="mt-8">
            <div className="space-y-6">
              <div className="text-center aurora-glass-enhanced p-6 animate-aurora-pulse">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-aurora-electric-purple to-aurora-emerald rounded-full mb-4 animate-aurora-glow">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-aurora-lavender">Upload em Lote Otimizado</h3>
                <p className="text-aurora-lavender/70">
                  Processamento paralelo de múltiplos vídeos com monitoramento em tempo real
                </p>
              </div>
              <BatchVideoUploader 
                onUploadComplete={handleUploadComplete}
                onCancel={() => navigate(ROUTES.ADMIN_VIDEOS.ROOT)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Features Showcase */}
      <div className="aurora-glass-enhanced max-w-7xl mx-auto p-8 animate-aurora-wave">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-aurora-emerald to-aurora-cyan bg-clip-text text-transparent mb-4">
            🚀 Sistema Aurora Intelligence
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Implemented Features */}
          <div className="aurora-glass-enhanced p-6 hover:bg-aurora-electric-purple/10 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-aurora-emerald rounded-full mr-3 animate-pulse"></div>
              <h4 className="font-semibold text-aurora-emerald text-lg">Recursos Ativos</h4>
            </div>
            <div className="space-y-3">
              {[
                { icon: "🎨", text: "Geração automática de thumbnails IA" },
                { icon: "📊", text: "Extração completa de metadados" },
                { icon: "🔤", text: "Formatação inteligente de títulos" },
                { icon: "🗂️", text: "Categorização por equipamentos" },
                { icon: "📈", text: "Progress tracking em tempo real" },
                { icon: "🛡️", text: "Validação avançada de arquivos" },
                { icon: "🔄", text: "Sistema de recuperação automática" },
                { icon: "⚡", text: "Upload paralelo otimizado" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-aurora-lavender/90 hover:text-white transition-colors duration-200">
                  <span className="mr-3 text-base">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Title Pattern Example */}
          <div className="aurora-glass-enhanced p-6 hover:bg-aurora-neon-blue/10 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-aurora-neon-blue rounded-full mr-3 animate-pulse"></div>
              <h4 className="font-semibold text-aurora-neon-blue text-lg">Padrão de Nomenclatura IA</h4>
            </div>
            <div className="space-y-4">
              <div className="bg-aurora-deep-purple/30 p-4 rounded-lg border border-aurora-electric-purple/30">
                <p className="text-xs text-aurora-lavender/70 mb-1">Entrada do arquivo:</p>
                <code className="text-aurora-cyan text-sm">aplicação_abdominal_cryorfmax_do_unyquepro-_1 (2160p)-2</code>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue rounded-full animate-aurora-shimmer">
                  <span className="text-white text-lg">⚡</span>
                </div>
              </div>
              
              <div className="bg-aurora-electric-purple/20 p-4 rounded-lg border border-aurora-emerald/30">
                <p className="text-xs text-aurora-lavender/70 mb-1">Saída formatada:</p>
                <code className="text-aurora-emerald text-sm">Aplicação abdominal Cryo Rf Max do Unyque Pro Cod:ABC123</code>
              </div>
              
              <div className="text-xs text-aurora-lavender/60 space-y-1">
                <p>✨ Remove informações de resolução automaticamente</p>
                <p>🔄 Converte underscores para espaços inteligentes</p>
                <p>📝 Aplica capitalização contextual</p>
                <p>🏷️ Adiciona código único rastreável</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { title: "Processamento", value: "< 2s", desc: "Thumbnail gerado", color: "aurora-emerald" },
            { title: "Precisão IA", value: "98.5%", desc: "Formatação correta", color: "aurora-neon-blue" },
            { title: "Velocidade", value: "50MB/s", desc: "Upload médio", color: "aurora-electric-purple" }
          ].map((stat, index) => (
            <div key={index} className="aurora-glass-enhanced p-4 text-center hover:scale-105 transition-transform duration-300">
              <div className={`text-2xl font-bold text-${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-sm text-aurora-lavender font-medium">{stat.title}</div>
              <div className="text-xs text-aurora-lavender/60">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
};

// Export explícito para evitar problemas de lazy loading
export { VideoCreatePageAdmin };
export default VideoCreatePageAdmin;