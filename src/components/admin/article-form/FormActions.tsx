
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isLoading: boolean;
  isProcessing: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isLoading,
  isProcessing,
  onCancel
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isLoading || isProcessing}
      >
        {isLoading ? "Salvando..." : "Salvar Artigo"}
      </Button>
    </div>
  );
};

export default FormActions;
