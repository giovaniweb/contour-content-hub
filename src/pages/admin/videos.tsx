
import React from 'react';
import ContentLayout from '@/components/layout/ContentLayout';
import VideoContentManager from '@/components/admin/VideoContentManager';

const AdminVideosPage: React.FC = () => {
  return (
    <ContentLayout 
      title="Gerenciamento de Vídeos"
      subtitle="Gerencie todos os vídeos do sistema"
      fullWidth
    >
      <VideoContentManager />
    </ContentLayout>
  );
};

export default AdminVideosPage;
