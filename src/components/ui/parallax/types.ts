
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
  interactive?: boolean;
  typingPhrases?: string[];
  onPromptSubmit?: (prompt: string) => void;
}

export interface InteractivePromptProps {
  phrases: string[];
  onSubmit: (prompt: string) => void;
  className?: string;
}
