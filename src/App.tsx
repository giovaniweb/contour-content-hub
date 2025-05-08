
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { SlideNotificationProvider } from '@/components/notifications/SlideNotificationProvider';

// Pages
import Dashboard from '@/pages/Dashboard';
import ContentPlannerPage from '@/pages/ContentPlannerPage'; 
import ContentStrategy from '@/pages/ContentStrategy';
import ScientificArticles from '@/pages/ScientificArticles'; 
import ReportsPage from '@/pages/ReportsPage';
import Settings from '@/pages/Settings';

function App() {
  return (
    <SlideNotificationProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content-planner" element={<ContentPlannerPage />} />
        <Route path="/content-strategy" element={<ContentStrategy />} />
        <Route path="/articles" element={<ScientificArticles />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Toaster />
    </SlideNotificationProvider>
  );
}

export default App;
