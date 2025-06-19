
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import { Suspense } from "react";
import AdminScientificArticleForm from "./pages/admin/AdminScientificArticleForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={
              <Suspense fallback={<div>Loading...</div>}>
                {page}
              </Suspense>
            } />
          ))}
          {/* Add the new route for scientific article form */}
          <Route 
            path="/admin/scientific-articles/new" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminScientificArticleForm />
              </Suspense>
            } 
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
