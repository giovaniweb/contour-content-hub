
import React from 'react';
import EnhancedScientificArticleManager from '@/components/admin/enhanced/EnhancedScientificArticleManager';

const AdminScientificArticles: React.FC = () => {
  return (
    <div className="aurora-dark-bg min-h-screen">
      <div className="aurora-particles fixed inset-0 pointer-events-none" />
      <div className="relative">
        <EnhancedScientificArticleManager />
      </div>
    </div>
  );
};

export default AdminScientificArticles;
