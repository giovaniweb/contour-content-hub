
import React from 'react';
import Layout from '@/components/Layout';
import AdminRoute from '@/components/AdminRoute';
import VideoStorageManager from '@/components/video-storage/VideoStorageManager';
import { Separator } from '@/components/ui/separator';

const AdminVideosPage: React.FC = () => {
  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-800 tracking-tight">Video Storage Manager</h1>
              <p className="text-muted-foreground mt-1">
                Manage videos imported from Vimeo and control their metadata
              </p>
            </div>
          </div>
          <Separator className="my-6" />
          <VideoStorageManager />
        </div>
      </Layout>
    </AdminRoute>
  );
};

export default AdminVideosPage;
