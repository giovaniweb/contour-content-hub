
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import CustomGptForm from '@/components/CustomGptForm';
import { Sparkles } from 'lucide-react';

const CustomGpt: React.FC = () => {
  useEffect(() => {
    document.title = "GPT Personalizado | Reelline";
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Sparkles className="h-8 w-8 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold">GPT Personalizado</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Gere roteiros, big ideas e stories para equipamentos estéticos usando seu prompt personalizado.
        </p>
        
        <CustomGptForm />
      </div>
    </Layout>
  );
};

export default CustomGpt;
