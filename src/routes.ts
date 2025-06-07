
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  WORKSPACE_SETTINGS: '/workspace-settings',
  CONSULTANT: '/consultant',
  ADMIN: '/admin',
  
  CONTENT: {
    SCRIPTS: {
      ROOT: '/content/scripts',
      GENERATOR: '/script-generator',
      VALIDATION: '/script-validation'
    },
    PLANNER: '/content-planner',
    IDEAS: '/content-ideas',
    STRATEGY: '/content-strategy',
    CALENDAR: '/calendar'
  },
  
  VIDEOS: {
    ROOT: '/videos',
    CREATE: '/videos/create',
    PLAYER: '/video-player',
    STORAGE: '/videos/storage',
    BATCH: '/videos/batch',
    IMPORT: '/videos/import',
    SWIPE: '/videos/swipe'
  },

  EQUIPMENT: {
    LIST: '/equipments',
    DETAILS: (id: string = ':id') => `/equipment/${id}`
  },

  MEDIA: '/media',
  SCIENTIFIC_ARTICLES: '/scientific-articles',
  
  MARKETING: {
    CONSULTANT: '/marketing-consultant',
    REPORTS: '/reports'
  },

  ADMIN_VIDEOS: '/admin/videos'
} as const;
