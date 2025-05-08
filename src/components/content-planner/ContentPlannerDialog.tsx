
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContentPlannerItem } from "@/types/content-planner";
import { useEquipments } from "@/hooks/useEquipments";
import ContentPlannerDialogForm from "./dialog/ContentPlannerDialogForm";

interface ContentPlannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ContentPlannerItem;
  onSave: (item: Partial<ContentPlannerItem>) => Promise<void>;
}

const ContentPlannerDialog: React.FC<ContentPlannerDialogProps> = ({
  open,
  onOpenChange,
  item,
  onSave
}) => {
  const { equipments } = useEquipments();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Editar item de conteúdo" : "Novo item de conteúdo"}
          </DialogTitle>
        </DialogHeader>
        
        <ContentPlannerDialogForm
          item={item}
          onSave={onSave}
          onClose={() => onOpenChange(false)}
          equipments={equipments}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContentPlannerDialog;
