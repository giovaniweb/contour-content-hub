
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import QuickAccessGrid from '@/components/home/QuickAccessGrid';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import PersonalizedSuggestions from '@/components/home/PersonalizedSuggestions';
import ConsultantBanner from '@/components/home/ConsultantBanner';
import { fadeIn } from '@/lib/animations';

const HomePage: React.FC = () => {
  return (
    <Layout fullWidth={true} transparentHeader={true}>
      {/* Hero Section with Parallax and Intelligent Input */}
      <HeroSection />
      
      {/* Main Content Area */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Quick Access Cards */}
        <motion.section 
          className="py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <QuickAccessGrid />
        </motion.section>
        
        {/* Featured Content Carousel */}
        <motion.section 
          className="py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Destaques da Semana</h2>
          <FeaturedCarousel />
        </motion.section>
        
        {/* Personalized Recommendations */}
        <motion.section 
          className="py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Recomendado para Você</h2>
          <PersonalizedSuggestions />
        </motion.section>
      </div>
      
      {/* Consultant Banner */}
      <ConsultantBanner />
    </Layout>
  );
};

export default HomePage;
