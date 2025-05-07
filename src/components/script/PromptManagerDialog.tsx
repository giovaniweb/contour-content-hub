
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';
import PromptEditor from './PromptEditor';

interface PromptManagerDialogProps {
  scriptType?: string;
  onPromptSelect?: (prompt: string) => void;
}

const PromptManagerDialog: React.FC<PromptManagerDialogProps> = ({
  scriptType = 'videoScript',
  onPromptSelect
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Code className="h-4 w-4" />
          Gerenciar Prompts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Gerenciador de Prompts</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <PromptEditor 
            scriptType={scriptType}
            onPromptSelect={onPromptSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptManagerDialog;
