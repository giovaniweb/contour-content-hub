
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, LineChart, Settings } from "lucide-react";
import AIModulesTable from "@/components/ai-panel/AIModulesTable";
import AIModulesCards from "@/components/ai-panel/AIModulesCards";

const AdminAIPanel: React.FC = () => {
  const { isAdmin } = usePermissions();
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="mb-10 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="bg-violet-100 p-3 rounded-full">
              <BrainCircuit className="h-8 w-8 text-violet-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                AI Panel
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Manage and optimize your AI modules and prompts
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/80 border-0 shadow-sm rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Modules</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Settings className="h-10 w-10 text-blue-500 opacity-80" />
            </div>
            
            <div className="bg-white/80 border-0 shadow-sm rounded-lg p-4">
              <p className="text-sm font-medium text-muted-foreground">Prompt Updates (30 days)</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            
            <div className="bg-white/80 border-0 shadow-sm rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="flex items-center mt-1 text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="font-medium">All systems optimal</span>
                </p>
              </div>
              <LineChart className="h-10 w-10 text-green-500 opacity-80" />
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">AI Modules</h2>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "cards")}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="cards" className="mt-0">
            <AIModulesCards />
          </TabsContent>
          <TabsContent value="table" className="mt-0">
            <AIModulesTable />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAIPanel;
