
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EnhancedScientificArticleForm from '@/components/admin/enhanced/EnhancedScientificArticleForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ScientificArticleFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSuccess = () => {
    navigate('/admin/content?tab=articles');
  };

  const handleCancel = () => {
    navigate('/admin/content?tab=articles');
  };

  return (
    <div className="aurora-dark-bg min-h-screen">
      <div className="aurora-particles fixed inset-0 pointer-events-none" />
      
      <div className="relative">
        {/* Header com botão de voltar */}
        <div className="aurora-card border-b border-aurora-electric-purple/20 p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Artigos
            </Button>
            <div className="h-6 w-px bg-aurora-electric-purple/30" />
            <h1 className="text-xl font-medium aurora-text-gradient">
              {id ? 'Editar Artigo Científico' : 'Cadastrar Novo Artigo Científico'}
            </h1>
          </div>
        </div>

        {/* Formulário */}
        <EnhancedScientificArticleForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isOpen={true}
        />
      </div>
    </div>
  );
};

export default ScientificArticleFormPage;
