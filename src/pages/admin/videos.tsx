
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import VideoBatchManage from '@/pages/VideoBatchManage';

// This is a wrapper component that ensures the VideoBatchManage component
// receives the auth context
const AdminVideosPage: React.FC = () => {
  return (
    <AuthProvider>
      <VideoBatchManage />
    </AuthProvider>
  );
};

export default AdminVideosPage;
