
import { ROUTES } from "@/routes";
import {
  BarChart3,
  FileText,
  FolderOpen,
  Home,
  PlaySquare,
  User,
  Calendar,
  PencilLine,
  Wrench,
  Lightbulb,
  Download,
  FileImage,
  BookOpen,
  LayoutDashboard
} from "lucide-react";

export interface SidebarLink {
  name: string;
  icon: any;
  path: string;
  highlight?: boolean;
}

export interface SidebarGroup {
  name: string;
  icon?: any;
  links: SidebarLink[];
}

export const sidebarData: SidebarGroup[] = [
  {
    name: "Main",
    links: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: ROUTES.DASHBOARD,
      },
    ]
  },
  {
    name: "Strategy",
    icon: Lightbulb,
    links: [
      {
        name: "Idea Validator",
        icon: Lightbulb,
        path: ROUTES.CONTENT.IDEAS,
        highlight: true
      },
      {
        name: "Marketing AI",
        icon: BarChart3,
        path: ROUTES.MARKETING.CONSULTANT,
      },
      {
        name: "Content Planner",
        icon: Calendar,
        path: ROUTES.CONTENT.PLANNER,
      },
      {
        name: "Script Generator",
        icon: PencilLine,
        path: ROUTES.CONTENT.SCRIPTS.GENERATOR,
      }
    ],
  },
  {
    name: "Downloads",
    icon: Download,
    links: [
      {
        name: "Templates",
        icon: FileText,
        path: "/templates",
      },
      {
        name: "Videos",
        icon: PlaySquare,
        path: ROUTES.VIDEOS.ROOT,
      },
      {
        name: "Photos",
        icon: FileImage,
        path: "/photos",
      },
      {
        name: "Files",
        icon: FolderOpen,
        path: "/files",
      },
      {
        name: "Scientific Articles",
        icon: BookOpen,
        path: ROUTES.SCIENTIFIC_ARTICLES,
        highlight: true
      }
    ],
  },
  {
    name: "Equipment",
    icon: Wrench,
    links: [
      {
        name: "Equipment Catalog",
        icon: Wrench,
        path: ROUTES.EQUIPMENT.LIST,
      },
    ],
  },
];

// Admin items kept separate for conditional rendering
export const adminItems = [
  { 
    name: 'Admin Panel', 
    icon: LayoutDashboard,
    path: ROUTES.ADMIN.ROOT
  },
  { 
    name: 'Content Management', 
    icon: FileText,
    path: ROUTES.ADMIN.CONTENT
  },
  { 
    name: 'Equipment Management', 
    icon: Wrench,
    path: ROUTES.ADMIN.EQUIPMENT
  },
  { 
    name: 'System Settings', 
    icon: Calendar,
    path: ROUTES.WORKSPACE_SETTINGS
  },
];

export default { sidebarData, adminItems };
