
import React from 'react';
import { motion } from 'framer-motion';
import IntelligentIntentProcessor from './IntelligentIntentProcessor';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden text-white">
      {/* Background Video/Animation */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png" type="video/mp4" />
        </video>
        {/* Fallback image if video doesn't load */}
        <img
          src="/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Conte sua ideia. A gente transforma em conteúdo estratégico.
          </motion.h1>
          
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <IntelligentIntentProcessor />
          </motion.div>
          
          <motion.p
            className="mt-6 text-lg text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Deixe a IA criar roteiros, ideias e estratégias personalizadas para você
          </motion.p>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
