
import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import CustomGptForm from '@/components/CustomGptForm';
import { Sparkles } from 'lucide-react';

const CustomGpt: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>GPT Personalizado | Reelline</title>
      </Helmet>
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
