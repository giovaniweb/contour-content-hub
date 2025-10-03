import { AppFeature } from '@/hooks/useFeatureAccess';

/**
 * Maps sidebar navigation paths to corresponding feature permissions
 */
export const pathToFeatureMap: Record<string, AppFeature> = {
  '/dashboard': 'videos', // Dashboard is always accessible, map to videos
  '/mestre-beleza': 'mestre_beleza',
  '/mestre-da-beleza': 'mestre_beleza',
  '/marketing-consultant': 'consultor_mkt', 
  '/fluidaroteirista': 'fluida_roteirista',
  '/content/scripts': 'fluida_roteirista',
  '/script-generator': 'fluida_roteirista',
  '/videos': 'videos',
  '/video-storage': 'videos',
  '/video-player': 'videos',
  '/photos': 'fotos',
  '/arts': 'artes',
  '/media': 'artes',
  '/scientific-articles': 'artigos_cientificos',
  '/academia': 'academia',
  '/equipments': 'equipamentos',
  '/copilot': 'videos', // Copilot is accessible to all
  '/content-planner': 'videos',
  '/my-documents': 'videos'
};

/**
 * Gets the feature permission key for a given navigation path
 */
export const getFeatureFromPath = (path: string): AppFeature | null => {
  return pathToFeatureMap[path] || null;
};

/**
 * Default permissions for new users (only these features are unlocked by default)
 */
export const DEFAULT_USER_PERMISSIONS: AppFeature[] = [
  'videos',
  'fotos', 
  'artes'
];