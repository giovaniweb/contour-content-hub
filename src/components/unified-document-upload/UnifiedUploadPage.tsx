import React from 'react';
import { UploadCloud } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { IntelligentUploadForm } from './IntelligentUploadForm'; // Assuming this will be created next

const UnifiedUploadPage: React.FC = () => {
  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={UploadCloud}
        title="Upload Inteligente de Documentos"
        subtitle="Envie e processe diversos tipos de documentos para a base de conhecimento."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl shadow-xl backdrop-blur-sm p-6 sm:p-8">
            <IntelligentUploadForm />
          </div>
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default UnifiedUploadPage;
