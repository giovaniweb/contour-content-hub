
import React from 'react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import IntelligentUploadForm from './IntelligentUploadForm';
import { Upload } from 'lucide-react';

const UnifiedUploadPage: React.FC = () => {
  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Upload}
        title="Upload Inteligente"
        subtitle="Envie documentos para processamento automático com IA"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <IntelligentUploadForm />
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default UnifiedUploadPage;
