
import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ContentStrategyForm from "@/components/content-strategy/ContentStrategyForm";
import { ContentStrategyItem } from "@/types/content-strategy";

interface ContentStrategySheetProps {
  equipments: { id: string; nome: string }[];
  users: { id: string; nome: string }[];
  onSave: (item: Partial<ContentStrategyItem>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContentStrategySheet: React.FC<ContentStrategySheetProps> = ({
  equipments,
  users,
  onSave,
  open,
  onOpenChange
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Adicionar item à estratégia</SheetTitle>
          <SheetDescription>
            Preencha as informações para adicionar um novo item à sua estratégia de conteúdo.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <ContentStrategyForm 
            equipamentos={equipments}
            responsaveis={users}
            onSave={onSave}
            onClose={() => onOpenChange(false)}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild className="sheet-close-button">
            <Button type="button" variant="outline">Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ContentStrategySheet;
