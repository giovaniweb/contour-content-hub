
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";

interface VideoFormActionsProps {
  onCancel?: () => void;
  isLoading: boolean;
  isEditing: boolean;
}

const VideoFormActions: React.FC<VideoFormActionsProps> = ({
  onCancel,
  isLoading,
  isEditing
}) => {
  return (
    <div className="flex justify-end space-x-4 pt-4 border-t">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      )}
      
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-600 to-purple-600"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isEditing ? 'Atualizando...' : 'Salvando...'}
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Atualizar Vídeo' : 'Salvar Vídeo'}
          </>
        )}
      </Button>
    </div>
  );
};

export default VideoFormActions;
