
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ContentPlannerItem } from "@/types/content-planner";
import { AlertTriangle } from "lucide-react";

interface ContentPlannerDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ContentPlannerItem | undefined;
  onConfirmDelete: () => Promise<void>;
}

const ContentPlannerDeleteDialog: React.FC<ContentPlannerDeleteDialogProps> = ({
  open,
  onOpenChange,
  item,
  onConfirmDelete
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="aurora-enhanced-theme bg-card/95 backdrop-blur-lg border border-primary/20 shadow-2xl max-w-md">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold text-foreground">
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-center leading-relaxed">
            Tem certeza que deseja excluir o documento <span className="font-semibold text-foreground">"{item?.title}"</span>?
            <br />
            <span className="text-destructive font-medium">Esta ação não pode ser desfeita e removerá todos os dados relacionados.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <AlertDialogCancel className="flex-1 bg-secondary/50 hover:bg-secondary border-border text-foreground">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContentPlannerDeleteDialog;
