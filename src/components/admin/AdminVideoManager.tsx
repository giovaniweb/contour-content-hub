
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload, Video, Grid2x2, LayoutList } from 'lucide-react';
import BatchVideoUploader from '@/components/video-storage/BatchVideoUploader';
import VideoList from '@/components/video-storage/VideoList';
import { VideoFilterOptions } from '@/types/video-storage';

const AdminVideoManager: React.FC = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  const defaultFilters: VideoFilterOptions = {
    search: '',
    status: undefined
  };

  const handleUploadComplete = () => {
    setShowUploader(false);
    // Refresh video list
    window.location.reload();
  };

  if (showUploader) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-50">Upload em Massa de Vídeos</h3>
          <Button 
            variant="outline" 
            onClick={() => setShowUploader(false)}
          >
            Voltar para Lista
          </Button>
        </div>
        
        <BatchVideoUploader 
          onUploadComplete={handleUploadComplete}
          onCancel={() => setShowUploader(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload em Massa
          </Button>
          
          <div className="flex items-center gap-1 ml-4">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-700">
          <TabsTrigger value="all" className="text-slate-300">Todos os Vídeos</TabsTrigger>
          <TabsTrigger value="uploading" className="text-slate-300">Enviando</TabsTrigger>
          <TabsTrigger value="processing" className="text-slate-300">Processando</TabsTrigger>
          <TabsTrigger value="ready" className="text-slate-300">Prontos</TabsTrigger>
          <TabsTrigger value="error" className="text-slate-300">Com Erro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <VideoList 
            filters={defaultFilters}
            page={currentPage}
            pageSize={12}
            viewMode={viewMode}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
        
        <TabsContent value="uploading" className="mt-6">
          <VideoList 
            filters={{ ...defaultFilters, status: ['uploading'] }}
            page={currentPage}
            pageSize={12}
            viewMode={viewMode}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
        
        <TabsContent value="processing" className="mt-6">
          <VideoList 
            filters={{ ...defaultFilters, status: ['processing'] }}
            page={currentPage}
            pageSize={12}
            viewMode={viewMode}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
        
        <TabsContent value="ready" className="mt-6">
          <VideoList 
            filters={{ ...defaultFilters, status: ['ready'] }}
            page={currentPage}
            pageSize={12}
            viewMode={viewMode}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
        
        <TabsContent value="error" className="mt-6">
          <VideoList 
            filters={{ ...defaultFilters, status: ['error', 'failed'] }}
            page={currentPage}
            pageSize={12}
            viewMode={viewMode}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminVideoManager;
