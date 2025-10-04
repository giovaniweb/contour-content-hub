
export const ROUTES = {
  // Auth & Basic
  HOME: '/',
  LANDING: '/landing',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PROFILE_DASHBOARD: '/profile-dashboard',
  WORKSPACE_SETTINGS: '/workspace-settings',
  UPGRADE: '/upgrade',
  
  // Content Creation
  CONTENT: {
    SCRIPTS: {
      ROOT: '/content/scripts',
      GENERATOR: '/script-generator',
      VALIDATION: '/script-validation',
      APPROVED: '/approved-scripts'
    },
    FLUIDAROTEIRISTA: '/fluidaroteirista',
    PLANNER: '/content-planner',
    IDEAS: '/content-ideas',
    STRATEGY: '/content-strategy',
    CALENDAR: '/calendar'
  },
  
  // Media Libraries
  VIDEOS: {
    ROOT: '/videos',
    PLAYER: '/video-player',
    STORAGE: '/video-storage',
    SWIPE: '/videos/swipe'
  },

  PHOTOS: '/photos',
  ARTS: '/arts',
  MEDIA: '/media',
  
  // Documents & Knowledge
  SCIENTIFIC_ARTICLES: '/scientific-articles',
  MY_DOCUMENTS: '/my-documents',
  
  // Learning
  ACADEMIA: '/academia',
  
  // AI Tools
  MESTRE_BELEZA: '/mestre-beleza',
  COPILOT: '/copilot',
  
  // Features
  BEFORE_AFTER: '/before-after',
  GAMIFICATION: '/gamification',

  EQUIPMENTS: {
    LIST: '/equipments',
    DETAILS: (id: string = ':id') => `/equipments/${id}`
  },
  
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

  VIDEOMAKER: {
    CADASTRO: '/videomaker/cadastro',
    BUSCA: '/videomaker/busca'
  },

  // Admin Panel
  ADMIN: {
    ROOT: '/admin',
    USERS: '/admin/users',
    EQUIPMENTS: {
      ROOT: '/admin/equipments',
      CREATE: '/admin/equipments/create',
      EDIT: (id: string = ':id') => `/admin/equipments/edit/${id}`
    },
    CONTENT: '/admin/content',
    AI: '/admin/ai-panel',
    SYSTEM: {
      DIAGNOSTICS: '/admin/system-diagnostics',
      INTELLIGENCE: '/admin/system-intelligence'
    },
    VIMEO: {
      SETTINGS: '/admin/vimeo-settings'
    },
    WORKSPACE: '/admin/workspace',
    VIDEOS: {
      ROOT: '/admin/videos',
      CREATE: '/admin/videos/create',
      BATCH: '/admin/videos/batch',
      IMPORT: '/admin/videos/import'
    },
    PHOTOS: {
      ROOT: '/admin/photos',
      UPLOAD: '/admin/photos/upload',
      EDIT: (id: string = ':id') => `/admin/photos/edit/${id}`
    }
  }
} as const;
