
import React from 'react';
import { motion } from 'framer-motion';
import AppSidebar from './AppSidebar';
import AuroraParticles from '@/components/ui/AuroraParticles';

interface AuroraLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuroraLayout: React.FC<AuroraLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="min-h-screen aurora-gradient-bg relative overflow-hidden">
      {/* Aurora Particles */}
      <AuroraParticles count={15} active={true} />
      
      {/* Ambient light effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #C4B5FD 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          {(title || subtitle) && (
            <motion.div 
              className="p-6 border-b border-white/10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title && (
                <h1 className="aurora-heading text-3xl font-light text-white mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="aurora-body text-white/70">
                  {subtitle}
                </p>
              )}
            </motion.div>
          )}

          {/* Page Content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuroraLayout;
