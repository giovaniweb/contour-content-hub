
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
import { usePermissions } from '@/hooks/use-permissions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PromptManagerDialogProps {
  scriptType?: string;
  onPromptSelect?: (prompt: string) => void;
}

const PromptManagerDialog: React.FC<PromptManagerDialogProps> = ({
  scriptType = 'videoScript',
  onPromptSelect
}) => {
  const { isAdmin } = usePermissions();
  
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
          {!isAdmin() ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Acesso Restrito</AlertTitle>
              <AlertDescription>
                Apenas administradores podem editar prompts. Você pode visualizar os prompts disponíveis, mas não editá-los.
              </AlertDescription>
            </Alert>
          ) : null}
          
          <PromptEditor 
            scriptType={scriptType}
            onPromptSelect={onPromptSelect}
            readOnly={!isAdmin()}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptManagerDialog;
