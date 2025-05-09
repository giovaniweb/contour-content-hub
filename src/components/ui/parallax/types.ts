
export interface ParallaxCard {
  image: string;
  title: string;
  description: string;
  link?: string;
}

export interface ParallaxSectionProps {
  backgroundImage: string;
  title: string;
  description: string;
  cards: ParallaxCard[];
  ctaText?: string;
  ctaLink?: string;
  textAlignment?: 'left' | 'center';
  darkOverlay?: boolean;
  className?: string;
}
