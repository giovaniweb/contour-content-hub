
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Dashboard from "@/pages/Dashboard";
import CustomGpt from "@/pages/CustomGpt";
import MarketingConsultant from "@/pages/MarketingConsultant";
import "./App.css";

function App() {
  return (
    <>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/custom-gpt" element={<CustomGpt />} />
            <Route path="/marketing-consultant" element={<MarketingConsultant />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;
