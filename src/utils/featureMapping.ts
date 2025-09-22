import { AppFeature } from '@/hooks/useFeatureAccess';

/**
 * Maps sidebar navigation paths to corresponding feature permissions
 */
export const pathToFeatureMap: Record<string, AppFeature> = {
  '/dashboard': 'videos', // Dashboard is always accessible, map to videos
  '/mestre-da-beleza': 'mestre_beleza',
  '/marketing-consultant': 'consultor_mkt', 
  '/fluidaroteirista': 'fluida_roteirista',
  '/videos': 'videos',
  '/photos': 'fotos',
  '/arts': 'artes',
  '/scientific-articles': 'artigos_cientificos',
  '/academia': 'academia',
  '/equipments': 'equipamentos'
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