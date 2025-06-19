
import React from 'react';
import { Home } from 'lucide-react';

// Import your page components here
const HomePage = React.lazy(() => import('./pages/Index'));
const AdminScientificArticles = React.lazy(() => import('./pages/admin/AdminScientificArticles'));

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: Home,
    page: <HomePage />
  },
  {
    title: "Admin Scientific Articles",
    to: "/admin/scientific-articles",
    icon: Home,
    page: <AdminScientificArticles />
  }
];
