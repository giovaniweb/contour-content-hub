
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ContentPlannerItem } from "@/types/content-planner";

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover Item</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o item "{item?.title}"?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContentPlannerDeleteDialog;
