import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScientificArticleViewer from '@/components/scientific-articles/ScientificArticleViewer';

const AdminScientificArticleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="aurora-page-container min-h-screen aurora-enhanced-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="aurora-heading-enhanced text-2xl mb-4">Artigo não encontrado</h1>
            <p className="text-slate-400">O ID do artigo é inválido.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScientificArticleViewer
      articleId={id}
      onBack={() => navigate('/admin/scientific-articles')}
    />
  );
};

export default AdminScientificArticleView;