
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, History, Copy, Undo, User, Clock, RefreshCw, Check } from "lucide-react";
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { AIModule, VersionHistory } from './types';

interface PromptEditorDialogProps {
  module: AIModule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (moduleId: string, newPrompt: string) => void;
}

const PromptEditorDialog: React.FC<PromptEditorDialogProps> = ({
  module,
  open,
  onOpenChange,
  onSave
}) => {
  const [prompt, setPrompt] = useState(module.prompt);
  const [activeTab, setActiveTab] = useState<"edit" | "history">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handleSave = async () => {
    if (prompt.trim() === module.prompt.trim()) {
      toast({
        title: "No changes detected",
        description: "The prompt hasn't been modified."
      });
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(module.id, prompt);
      setIsSaving(false);
      toast({
        title: "Saved successfully",
        description: `"${module.name}" prompt has been updated.`,
      });
    }, 800);
  };
  
  const handleRevert = () => {
    setPrompt(module.prompt);
    toast({
      title: "Changes reverted",
      description: "All changes have been discarded."
    });
  };
  
  const handleClone = () => {
    // In a real app, this would clone the prompt to create a new one
    toast({
      title: "Prompt cloned",
      description: "A copy of this prompt has been created."
    });
  };
  
  const restoreVersion = (version: VersionHistory) => {
    setPrompt(version.prompt);
    setActiveTab("edit");
    toast({
      title: "Version restored",
      description: `Prompt version from ${formatDistanceToNow(new Date(version.timestamp), { addSuffix: true })} has been restored. Remember to save your changes.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <span className="bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent">
                {module.name} Prompt
              </span>
              <Badge className={module.status === "Active" ? "bg-green-500" : "bg-slate-500"}>
                {module.status}
              </Badge>
            </DialogTitle>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "history")}>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="edit" className="gap-1">
                  <Save className="h-4 w-4" /> Edit
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-1">
                  <History className="h-4 w-4" /> History
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {module.description}
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="edit" className="h-full flex flex-col">
            <div className="mb-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleRevert}>
                <Undo className="h-4 w-4 mr-1" /> Revert
              </Button>
              <Button variant="outline" size="sm" onClick={handleClone}>
                <Copy className="h-4 w-4 mr-1" /> Clone
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-full min-h-[400px] resize-none font-mono text-sm"
                placeholder="Enter the system prompt for this AI module..."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="h-full overflow-y-auto pr-2">
            <div className="space-y-4">
              {module.versionHistory.length > 0 ? (
                module.versionHistory.map((version) => (
                  <div 
                    key={version.id} 
                    className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{version.user}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-muted-foreground text-sm">
                          {format(new Date(version.timestamp), 'PPpp')}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-md p-3 mb-3 max-h-[150px] overflow-y-auto">
                      <pre className="text-xs font-mono whitespace-pre-wrap text-slate-700">
                        {version.prompt.substring(0, 300)}
                        {version.prompt.length > 300 && "..."}
                      </pre>
                    </div>
                    <div className="flex justify-between items-center">
                      {version.tag && (
                        <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700">
                          <Check className="h-3.5 w-3.5" />
                          {version.tag}
                        </Badge>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => restoreVersion(version)}
                      >
                        Restore
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No version history available
                </div>
              )}
            </div>
          </TabsContent>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSave}
            disabled={isSaving || prompt === module.prompt}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptEditorDialog;
