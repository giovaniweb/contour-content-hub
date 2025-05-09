
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import FloatingCard from './FloatingCard';
import { ParallaxSectionProps } from './types';
import './parallax.css';

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImage,
  title,
  description,
  cards,
  ctaText,
  ctaLink,
  textAlignment = 'center',
  darkOverlay = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const isMobile = useIsMobile();

  // Get scroll progress for this section
  const { scrollY } = useScroll();
  const y = useTransform(
    scrollY,
    [elementTop - 500, elementTop + 500],
    [0, 150],
    { clamp: false }
  );

  // Update element position for the parallax calculation
  useEffect(() => {
    const setPosition = () => {
      if (containerRef.current) {
        const { top } = containerRef.current.getBoundingClientRect();
        setElementTop(top + window.scrollY);
      }
    };

    setPosition();
    window.addEventListener('resize', setPosition);
    return () => window.removeEventListener('resize', setPosition);
  }, []);

  // Text alignment class
  const textAlignClass = textAlignment === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div 
      ref={containerRef}
      className={`parallax-section relative w-full overflow-hidden ${className}`}
    >
      {/* Background with parallax effect (disabled on mobile) */}
      {!isMobile ? (
        <motion.div 
          className="parallax-background absolute inset-0 w-full h-[120%] -z-10"
          style={{ 
            y: y,
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      ) : (
        <div 
          className="parallax-background absolute inset-0 w-full h-full -z-10"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      )}

      {/* Optional dark overlay */}
      {darkOverlay && (
        <div className="absolute inset-0 bg-black/40 -z-10" />
      )}

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        {/* Text content */}
        <div className={`max-w-3xl mb-12 ${textAlignClass}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 text-white font-heading">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Floating cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {cards.map((card, index) => (
            <FloatingCard
              key={index}
              image={card.image}
              title={card.title}
              description={card.description}
              link={card.link}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Optional CTA button */}
        {ctaText && ctaLink && (
          <div className={`mt-8 ${textAlignment === 'center' ? 'text-center' : ''}`}>
            <Button asChild variant="gradient" size="lg">
              <a href={ctaLink}>{ctaText}</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParallaxSection;
