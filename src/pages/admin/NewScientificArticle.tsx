
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import ScientificArticleUploadForm from '@/components/admin/ScientificArticleUploadForm';

const NewScientificArticle: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Artigo científico salvo",
      description: "O artigo foi cadastrado com sucesso.",
    });
    navigate('/admin/scientific-articles');
  };

  const handleCancel = () => {
    navigate('/admin/scientific-articles');
  };

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={BookOpen}
        title="Novo Artigo Científico"
        subtitle="Cadastre um novo artigo científico na biblioteca"
      />
      
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/scientific-articles')}
            className="text-cyan-400 hover:text-cyan-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Artigos Científicos
          </Button>
        </div>

        {/* Upload Form */}
        <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-8">
          <ScientificArticleUploadForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default NewScientificArticle;
