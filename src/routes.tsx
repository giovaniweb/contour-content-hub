
import React from "react";
import { RouteObject } from "react-router-dom";

// Routes constants
export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  
  // Auth callback routes
  AUTH: {
    VIMEO_CALLBACK: "/vimeo/callback"
  },
  
  // Protected routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  WORKSPACE_SETTINGS: "/workspace-settings",
  INVITES: "/invites",
  
  // Content
  CONTENT: {
    STRATEGY: "/estrategias",
    PLANNER: "/content-planner",
    IDEAS: "/content-ideas",
    SCRIPTS: {
      ROOT: "/scripts",
      GENERATOR: "/script-generator",
      VALIDATION: "/script-validation"
    },
    CALENDAR: "/calendar"
  },
  
  // Videos
  VIDEOS: {
    ROOT: "/videos",
    STORAGE: "/video-storage",
    BATCH: "/video-batch",
    IMPORT: "/video-import",
    SWIPE: "/video-swipe",
    PLAYER: "/video"
  },
  
  // Equipment & Media
  EQUIPMENT: {
    LIST: "/equipments",
    DETAILS: (id: string = ":id") => `/equipment/${id}`
  },
  MEDIA: "/media",
  
  // Documentation
  DOCUMENTS: {
    ROOT: "/documents",
    DETAILS: (id: string = ":id") => `/document/${id}`
  },
  SCIENTIFIC_ARTICLES: "/scientific-articles",
  
  // Marketing
  MARKETING: {
    CONSULTANT: "/marketing-consultant",
    REPORTS: "/reports"
  },
  
  // Consultant
  CONSULTANT: {
    PANEL: "/consultant"
  },
  
  // Admin routes
  ADMIN: {
    ROOT: "/admin",
    EQUIPMENT: "/admin/equipments",
    CONTENT: "/admin/content",
    AI: "/admin/ai",
    SYSTEM: {
      DIAGNOSTICS: "/admin/system-diagnostics",
      INTELLIGENCE: "/admin/system-intelligence"
    },
    VIMEO: {
      SETTINGS: "/admin/vimeo-settings"
    },
    WORKSPACE: "/admin/workspace"
  },
  
  // Error
  NOT_FOUND: "*",
  
  // Admin videos
  ADMIN_VIDEOS: '/admin/videos'
};
