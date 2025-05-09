
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
        path: "/dashboard",
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
        path: "/content-ideas",
        highlight: true
      },
      {
        name: "Marketing AI",
        icon: BarChart3,
        path: "/marketing-consultant",
      },
      {
        name: "Content Planner",
        icon: Calendar,
        path: "/content-planner",
      },
      {
        name: "Script Generator",
        icon: PencilLine,
        path: "/script-generator",
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
        path: "/videos",
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
        path: "/articles",
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
        path: "/equipments",
      },
    ],
  },
];

// Admin items kept separate for conditional rendering
export const adminItems = [
  { 
    name: 'Admin Panel', 
    icon: LayoutDashboard,
    path: '/admin'
  },
  { 
    name: 'Content Management', 
    icon: FileText,
    path: '/admin/content'
  },
  { 
    name: 'Equipment Management', 
    icon: Wrench,
    path: '/admin/equipment'
  },
  { 
    name: 'System Settings', 
    icon: Calendar,
    path: '/settings'
  },
];
