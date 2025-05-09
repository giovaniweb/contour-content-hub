
export interface ParallaxCard {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface ParallaxSectionProps {
  backgroundImage: string;
  title: string;
  description: string;
  cards: ParallaxCard[];
  ctaText?: string;
  ctaLink?: string;
  textAlignment?: 'left' | 'center' | 'right';
  darkOverlay?: boolean;
  className?: string;
  interactive?: boolean;
  typingPhrases?: string[];
  onPromptSubmit?: (prompt: string) => void;
}

export interface FloatingCardProps {
  image: string;
  title: string;
  description: string;
  link: string;
  delay?: number;
}
