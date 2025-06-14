
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image as ImageIcon } from "lucide-react";
import BeforeAfterUploader from './BeforeAfterUploader';
import BeforeAfterGallery from './BeforeAfterGallery';

const BeforeAfterManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadSuccess = () => {
    console.log('✅ Upload concluído - atualizando galeria');
    setRefreshGallery(prev => prev + 1);
    setActiveTab('gallery');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full space-y-6"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Galeria
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <BeforeAfterGallery key={refreshGallery} />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <BeforeAfterUploader onUploadSuccess={handleUploadSuccess} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default BeforeAfterManager;
