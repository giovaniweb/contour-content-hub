
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BeforeAfterUploader from './BeforeAfterUploader';
import BeforeAfterGallery from './BeforeAfterGallery';
import BeforeAfterBuilder from './BeforeAfterBuilder';

const BeforeAfterManager: React.FC = () => {
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadSuccess = () => {
    console.log('✅ Upload concluído - atualizando galeria');
    console.log('🔄 Atualizando refreshGallery de', refreshGallery, 'para', refreshGallery + 1);
    setRefreshGallery(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full space-y-6"
    >
      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger 
            value="gallery" 
            className="flex items-center gap-2"
            onClick={() => console.log('🖱️ Clicou na aba Galeria')}
          >
            <ImageIcon className="h-4 w-4" />
            Galeria
          </TabsTrigger>
          <TabsTrigger 
            value="builder" 
            className="flex items-center gap-2"
            onClick={() => console.log('🖱️ Clicou na aba Montador')}
          >
            <Layers className="h-4 w-4" />
            Montador
          </TabsTrigger>
          <TabsTrigger 
            value="upload" 
            className="flex items-center gap-2"
            onClick={() => console.log('🖱️ Clicou na aba Upload')}
          >
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <BeforeAfterGallery key={refreshGallery} />
        </TabsContent>

        <TabsContent value="builder" className="mt-6">
          <BeforeAfterBuilder />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <BeforeAfterUploader onUploadSuccess={handleUploadSuccess} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default BeforeAfterManager;
