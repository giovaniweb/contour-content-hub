
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { BadgeCheck, AlertTriangle, Eye } from "lucide-react";
import PromptEditorDialog from './PromptEditorDialog';
import { AIModule } from '@/components/ai-panel/types';
import { mockAIModules } from '@/components/ai-panel/mockData';

const AIModulesTable: React.FC = () => {
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

  const getStatusBadge = (status: string) => {
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => (
              <TableRow key={module.id}>
                <TableCell className="font-medium">{module.name}</TableCell>
                <TableCell>{module.description}</TableCell>
                <TableCell>{getStatusBadge(module.status)}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(module.lastModified), { addSuffix: true })}</TableCell>
                <TableCell>{getTagBadge(module.tag)}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewPrompt(module)}
                  >
                    <Eye className="h-4 w-4 mr-2" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

export default AIModulesTable;
