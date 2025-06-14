
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VideoFormActions({ onCancel, isLoading, isEditing }) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : isEditing ? 'Atualizar Vídeo' : 'Cadastrar Vídeo'}
      </Button>
    </div>
  );
}
