
import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ContentStrategyForm from "@/components/content-strategy/ContentStrategyForm";
import { ContentStrategy } from "@/types/content-strategy";

interface ContentStrategySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ContentStrategy) => void;
  initialData?: ContentStrategy;
  isSubmitting?: boolean;
}

const ContentStrategySheet: React.FC<ContentStrategySheetProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {initialData ? "Editar Estratégia" : "Criar Nova Estratégia"}
          </SheetTitle>
          <SheetDescription>
            Defina os detalhes da sua estratégia de conteúdo para um período específico.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <ContentStrategyForm
            onSubmit={onSubmit}
            initialData={initialData}
            isSubmitting={isSubmitting}
            onCancel={handleClose}
          />
        </div>

        <SheetFooter className="sm:justify-start pt-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ContentStrategySheet;
