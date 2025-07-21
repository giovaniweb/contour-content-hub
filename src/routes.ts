
export const ROUTES = {
  HOME: '/',
  LANDING: '/landing',
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
    PLAYER: '/video-player',
    STORAGE: '/videos/storage',
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
    AI: '/admin/ai',
    SYSTEM: {
      DIAGNOSTICS: '/admin/system-diagnostics',
      INTELLIGENCE: '/admin/system-intelligence'
    },
    VIMEO: {
      SETTINGS: '/admin/vimeo-settings'
    },
    WORKSPACE: '/admin/workspace'
  },

  ADMIN_VIDEOS: {
    ROOT: '/admin/videos',
    CREATE: '/admin/videos/create',
    BATCH: '/admin/videos/batch',
    IMPORT: '/admin/videos/import'
  },

  ADMIN_PHOTOS: {
    ROOT: '/admin/photos',
    UPLOAD: '/admin/photos/upload',
    EDIT: (id: string = ':id') => `/admin/photos/edit/${id}`
  }
} as const;
