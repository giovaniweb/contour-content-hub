
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
      GENERATOR: '/script-generator'
    },
    PLANNER: '/content-planner',
    IDEAS: '/content-ideas'
  },
  
  VIDEOS: {
    ROOT: '/videos',
    CREATE: '/videos/create'
  }
} as const;
