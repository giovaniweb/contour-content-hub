
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/navbar/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/HomePage/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import VideoGallerySection from '@/components/home/VideoGallerySection';
import ImageGallerySection from '@/components/home/ImageGallerySection';
import IntentProcessor from '@/components/intent-processor/IntentProcessor';
import MarketingConsultantBanner from '@/components/home/MarketingConsultantBanner';
import PersonalizedSuggestions from '@/components/home/PersonalizedSuggestions';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      
      <main className="pt-16">
        <HeroSection />
        
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <IntentProcessor />
          </div>
          
          <FeaturesSection />
          
          <div className="my-12">
            <MarketingConsultantBanner />
          </div>
          
          <VideoGallerySection />
          <ImageGallerySection />
          
          <div className="my-12">
            <h2 className="text-2xl font-bold text-center mb-8">Sugestões Personalizadas</h2>
            <PersonalizedSuggestions />
          </div>
          
          <TestimonialsSection />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
