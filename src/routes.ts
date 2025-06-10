

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CONTENT: {
    SCRIPTS: {
      ROOT: '/content/scripts',
      LIST: '/content/scripts',
      GENERATOR: '/content/scripts/generator',
      FLUIA_AKINATOR: '/content/scripts/fluia-akinator',
      HISTORY: '/content/scripts/history',
      VALIDATION: '/content/scripts/validation'
    },
    ARTICLES: {
      LIST: '/content/articles',
      CREATE: '/content/articles/create',
      EDIT: '/content/articles/edit',
    },
    EMAILS: {
      LIST: '/content/emails',
      CREATE: '/content/emails/create',
      EDIT: '/content/emails/edit',
    },
    PLANNER: '/content/planner',
    IDEAS: '/content/ideas',
    STRATEGY: '/content/strategy',
    CALENDAR: '/content/calendar'
  },
  VIDEOS: {
    ROOT: '/videos',
    PLAYER: '/videos/player',
    IMPORT: '/videos/import',
    CREATE: '/videos/create',
    STORAGE: '/videos/storage',
    BATCH: '/videos/batch'
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PLANS: '/plans',
  PAYMENT: '/payment',
  CUSTOMERS: '/customers',
  TEMPLATES: '/templates',
  FAQ: '/faq',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  PRICING: '/pricing',
  FEATURES: '/features',
  JOBS: '/jobs',
  SERVICES: '/services',
  ABOUT: '/about',
  SUPPORT: '/support',
  BLOG: '/blog',
  CAREERS: '/careers',
  COMING_SOON: '/coming-soon',
  NOT_FOUND: '/404',
  SCIENTIFIC_ARTICLES: '/scientific-articles',
  MEDIA: '/media',
  WORKSPACE_SETTINGS: '/workspace/settings',
  EQUIPMENT: {
    LIST: '/equipment'
  },
  ADMIN_VIDEOS: '/admin/videos',
  MARKETING: {
    REPORTS: '/marketing/reports',
    CONSULTANT: '/marketing/consultant'
  },
  CONSULTANT: {
    PANEL: '/consultant/panel'
  },
  ADMIN: {
    ROOT: '/admin',
    EQUIPMENT: '/admin/equipment',
    CONTENT: '/admin/content',
    AI: '/admin/ai',
    SYSTEM: {
      INTELLIGENCE: '/admin/system/intelligence',
      DIAGNOSTICS: '/admin/system/diagnostics'
    },
    VIMEO: {
      SETTINGS: '/admin/vimeo/settings'
    }
  }
} as const;

