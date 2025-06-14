
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from "lucide-react";
import BeforeAfterUploader from './BeforeAfterUploader';
import BeforeAfterGallery from './BeforeAfterGallery';

const BeforeAfterManager: React.FC = () => {
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadSuccess = () => {
    console.log('✅ Upload concluído - atualizando galeria');
    setRefreshGallery(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full space-y-6"
    >
      {/* Conteúdo da galeria e upload integrado */}
      <div className="space-y-6">
        <BeforeAfterGallery key={refreshGallery} />
        <div className="border-t border-gray-600/50 pt-6">
          <BeforeAfterUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
    </motion.div>
  );
};

export default BeforeAfterManager;
