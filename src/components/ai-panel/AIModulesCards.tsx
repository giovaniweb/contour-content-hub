
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Code, Settings, BadgeCheck, AlertTriangle, Eye } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import PromptEditorDialog from './PromptEditorDialog';
import { AIModule } from '@/components/ai-panel/types';
import { mockAIModules } from '@/components/ai-panel/mockData';

const AIModulesCards: React.FC = () => {
  const [modules, setModules] = useState<AIModule[]>(mockAIModules);
  const [selectedModule, setSelectedModule] = useState<AIModule | null>(null);
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);

  const handleViewPrompt = (module: AIModule) => {
    setSelectedModule(module);
    setPromptDialogOpen(true);
  };

  const handlePromptSave = (moduleId: string, newPrompt: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { 
            ...module, 
            prompt: newPrompt,
            lastModified: new Date().toISOString(),
            versionHistory: [
              { 
                id: crypto.randomUUID(),
                prompt: module.prompt,
                timestamp: module.lastModified,
                user: "Current User",
                tag: module.tag
              },
              ...module.versionHistory.slice(0, 4)  // Keep only the last 5 versions
            ]
          } 
        : module
    ));
    setPromptDialogOpen(false);
  };

  const getStatusBadge = (status: string, tag?: string) => {
    if (status === "Active") {
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
    } else {
      return <Badge variant="outline" className="text-slate-500">Inactive</Badge>
    }
  };

  const getTagBadge = (tag?: string) => {
    if (!tag) return null;
    
    switch (tag) {
      case "Live":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 gap-1">
            <BadgeCheck className="w-3.5 h-3.5" /> Live
          </Badge>
        );
      case "Beta":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Beta
          </Badge>
        );
      case "Tested":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 gap-1">
            <BadgeCheck className="w-3.5 h-3.5" /> Tested
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-md">
                      <Settings className="h-5 w-5 text-fluida-blue" />
                    </div>
                    {module.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">{module.description}</p>
                </div>
                {getStatusBadge(module.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-sm font-mono line-clamp-3 text-slate-600">
                    {module.prompt.substring(0, 150)}...
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated {formatDistanceToNow(new Date(module.lastModified), { addSuffix: true })}</span>
                  </div>
                  {getTagBadge(module.tag)}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleViewPrompt(module)}
              >
                <Eye className="h-4 w-4 mr-2" /> View Prompt
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {selectedModule && (
        <PromptEditorDialog 
          module={selectedModule}
          open={promptDialogOpen}
          onOpenChange={setPromptDialogOpen}
          onSave={handlePromptSave}
        />
      )}
    </>
  );
};

export default AIModulesCards;
