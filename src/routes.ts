
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  WORKSPACE_SETTINGS: '/workspace-settings',
  
  CONTENT: {
    SCRIPTS: {
      ROOT: '/content/scripts',
      GENERATOR: '/script-generator',
      VALIDATION: '/script-validation'
    },
    FLUIDAROTEIRISTA: '/fluidaroteirista',
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

  EQUIPMENTS: {
    LIST: '/equipments',
    DETAILS: (id: string = ':id') => `/equipments/${id}`
  },

  MEDIA: '/media',
  SCIENTIFIC_ARTICLES: '/scientific-articles',
  
  MARKETING: {
    CONSULTANT: '/marketing-consultant',
    REPORTS: '/reports',
    DIAGNOSTIC_HISTORY: '/diagnostic-history'
  },

  CONSULTANT: {
    PANEL: '/consultant-panel'
  },

  DOWNLOADS: {
    BATCH: '/downloads/batch'
  },

  ADMIN: {
    ROOT: '/admin',
    EQUIPMENTS: {
      ROOT: '/admin/equipments',
      CREATE: '/admin/equipments/create',
      EDIT: (id: string = ':id') => `/admin/equipments/edit/${id}`
    },
    CONTENT: '/admin/content',
    SCIENTIFIC_ARTICLES: '/admin/scientific-articles',
    MATERIALS: '/admin/materials',
    PHOTOS: '/admin/photos',
    VIDEOS: '/admin/videos',
    AI: '/admin/ai',
    SYSTEM: {
      DIAGNOSTICS: '/admin/system-diagnostics',
      INTELLIGENCE: '/admin/system-intelligence'
    },
    VIMEO: {
      SETTINGS: '/admin/vimeo-settings'
    },
    WORKSPACE: '/admin/workspace'
  }
} as const;
